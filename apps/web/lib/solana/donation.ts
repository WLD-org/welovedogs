import {
  Connection,
  PublicKey,
  Transaction,
  type TransactionSignature,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { getSolanaConfig, PLATFORM_COMMISSION_RATE } from "@/lib/solana/config";

export type DonationSplit = {
  totalAmount: number;
  campaignAmount: number;
  platformFee: number;
};

export function calculateDonationSplit(totalUsd: number): DonationSplit {
  const platformFee = Math.round(totalUsd * PLATFORM_COMMISSION_RATE * 100) / 100;
  const campaignAmount = Math.round((totalUsd - platformFee) * 100) / 100;
  return { totalAmount: totalUsd, campaignAmount, platformFee };
}

function toTokenAmount(usdAmount: number, decimals = 6): bigint {
  return BigInt(Math.round(usdAmount * 10 ** decimals));
}

export async function buildDonationTransaction(
  connection: Connection,
  donorPublicKey: PublicKey,
  campaignWallet: string,
  totalUsdAmount: number
): Promise<{ transaction: Transaction; split: DonationSplit }> {
  const config = getSolanaConfig();

  if (!config.platformWallet) {
    throw new Error("Platform wallet not configured. Set NEXT_PUBLIC_PLATFORM_WALLET.");
  }

  const campaignPubkey = new PublicKey(campaignWallet);
  const platformPubkey = new PublicKey(config.platformWallet);
  const usdcMint = new PublicKey(config.usdcMint);

  const split = calculateDonationSplit(totalUsdAmount);

  const donorAta = getAssociatedTokenAddressSync(usdcMint, donorPublicKey);
  const campaignAta = getAssociatedTokenAddressSync(usdcMint, campaignPubkey);
  const platformAta = getAssociatedTokenAddressSync(usdcMint, platformPubkey);

  const transaction = new Transaction();

  // Ensure recipient ATAs exist (idempotent — donor pays rent if needed)
  transaction.add(
    createAssociatedTokenAccountIdempotentInstruction(
      donorPublicKey,
      campaignAta,
      campaignPubkey,
      usdcMint
    ),
    createAssociatedTokenAccountIdempotentInstruction(
      donorPublicKey,
      platformAta,
      platformPubkey,
      usdcMint
    )
  );

  // 99% to campaign
  if (split.campaignAmount > 0) {
    transaction.add(
      createTransferInstruction(
        donorAta,
        campaignAta,
        donorPublicKey,
        toTokenAmount(split.campaignAmount)
      )
    );
  }

  // 1% platform commission
  if (split.platformFee > 0) {
    transaction.add(
      createTransferInstruction(
        donorAta,
        platformAta,
        donorPublicKey,
        toTokenAmount(split.platformFee)
      )
    );
  }

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = donorPublicKey;

  return { transaction, split };
}

export async function sendDonationTransaction(
  connection: Connection,
  transaction: Transaction,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<TransactionSignature> {
  const signed = await signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}
