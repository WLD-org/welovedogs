import { Keypair } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  fetchAllDigitalAssetByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  type PublicKey as UmiPublicKey,
} from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import bs58 from "bs58";
import { getSolanaConfig } from "@/lib/solana/config";

export type PodNftToken = {
  mintAddress: string;
  tokenUri: string | null;
  name: string;
};

export type MintPodNftResult = {
  mintAddress: string;
  signature: string;
};

function parseSecretKey(secret: string): Uint8Array {
  const trimmed = secret.trim();
  if (trimmed.startsWith("[")) {
    return Uint8Array.from(JSON.parse(trimmed) as number[]);
  }
  return bs58.decode(trimmed);
}

export function getPodNftMintAuthorityKeypair(): Keypair {
  const secret = process.env.POD_NFT_MINT_AUTHORITY_SECRET;
  if (!secret) {
    throw new Error(
      "POD_NFT_MINT_AUTHORITY_SECRET is not configured. Set the base58 secret key for the NFT mint authority."
    );
  }

  try {
    return Keypair.fromSecretKey(parseSecretKey(secret));
  } catch {
    throw new Error("Invalid POD_NFT_MINT_AUTHORITY_SECRET format.");
  }
}

function createUmiWithMintAuthority() {
  const config = getSolanaConfig();
  const umi = createUmi(config.rpcUrl).use(mplTokenMetadata());

  const web3Keypair = getPodNftMintAuthorityKeypair();
  const umiKeypair = fromWeb3JsKeypair(web3Keypair);
  const signer = createSignerFromKeypair(umi, umiKeypair);
  umi.use(keypairIdentity(signer));

  return umi;
}

export async function mintPodNft(params: {
  recipientAddress: string;
  name: string;
  uri: string;
  symbol?: string;
}): Promise<MintPodNftResult> {
  const umi = createUmiWithMintAuthority();
  const mint = generateSigner(umi);

  const result = await createNft(umi, {
    mint,
    name: params.name,
    symbol: params.symbol ?? "POD",
    uri: params.uri,
    sellerFeeBasisPoints: percentAmount(0),
    tokenOwner: publicKey(params.recipientAddress),
  }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

  return {
    mintAddress: mint.publicKey.toString(),
    signature: String(result.signature),
  };
}

export async function fetchPodNftsByOwner(ownerAddress: string): Promise<PodNftToken[]> {
  const config = getSolanaConfig();
  const umi = createUmi(config.rpcUrl).use(mplTokenMetadata());

  const assets = await fetchAllDigitalAssetByOwner(umi, publicKey(ownerAddress));

  return assets
    .filter((asset) => asset.metadata.symbol === "POD")
    .map((asset) => ({
      mintAddress: asset.mint.publicKey,
      tokenUri: asset.metadata.uri || null,
      name: asset.metadata.name,
    }));
}

export function isPodNftMintConfigured(): boolean {
  return Boolean(process.env.POD_NFT_MINT_AUTHORITY_SECRET);
}

export function getMintAuthorityPublicKey(): string | null {
  try {
    return getPodNftMintAuthorityKeypair().publicKey.toBase58();
  } catch {
    return null;
  }
}

export function umiPublicKeyToString(key: UmiPublicKey): string {
  return key.toString();
}
