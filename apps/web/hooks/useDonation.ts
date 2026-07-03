"use client";

import { useCallback, useState } from "react";
import { useSolanaWallet } from "./useSolanaWallet";
import { buildDonationTransaction, calculateDonationSplit } from "@/lib/solana/donation";

export type DonationResult = {
  hash: string;
  successful: boolean;
  campaignAmount: number;
  platformFee: number;
};

export type DonationError = {
  message: string;
  code?: string;
};

export function useDonation() {
  const { address, publicKey, connection, signAndSendTransaction } = useSolanaWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DonationError | null>(null);

  const donate = useCallback(
    async (recipientAddress: string, amount: string): Promise<DonationResult> => {
      if (!address || !publicKey) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
          throw new Error("Invalid amount. Must be a positive number.");
        }

        const split = calculateDonationSplit(amountNum);
        const { transaction } = await buildDonationTransaction(
          connection,
          publicKey,
          recipientAddress,
          amountNum
        );

        const signature = await signAndSendTransaction(transaction);

        return {
          hash: signature,
          successful: true,
          campaignAmount: split.campaignAmount,
          platformFee: split.platformFee,
        };
      } catch (err: unknown) {
        const donationError: DonationError = {
          message: err instanceof Error ? err.message : "Failed to process donation",
        };
        setError(donationError);
        throw donationError;
      } finally {
        setIsLoading(false);
      }
    },
    [address, publicKey, connection, signAndSendTransaction]
  );

  return {
    donate,
    isLoading,
    error,
    isConnected: !!address,
  };
}
