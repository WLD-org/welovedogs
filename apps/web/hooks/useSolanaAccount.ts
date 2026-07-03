"use client";

import { useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { getSolanaConfig } from "@/lib/solana/config";

export function useSolanaAccount(address: string | null) {
  const { connection } = useConnection();
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [solBalance, setSolBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) {
      setUsdcBalance("0");
      setSolBalance("0");
      return;
    }

    setIsLoading(true);
    try {
      const pubkey = new PublicKey(address);
      const config = getSolanaConfig();

      const [solLamports, tokenAccount] = await Promise.all([
        connection.getBalance(pubkey),
        connection
          .getTokenAccountBalance(
            getAssociatedTokenAddressSync(new PublicKey(config.usdcMint), pubkey)
          )
          .catch(() => null),
      ]);

      setSolBalance((solLamports / 1e9).toFixed(4));
      setUsdcBalance(tokenAccount?.value.uiAmountString ?? "0");
    } catch {
      setUsdcBalance("0");
      setSolBalance("0");
    } finally {
      setIsLoading(false);
    }
  }, [address, connection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { usdcBalance, solBalance, isLoading, refresh };
}
