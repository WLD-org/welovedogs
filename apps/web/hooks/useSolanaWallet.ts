"use client";

import { useCallback, useMemo } from "react";
import { Connection, PublicKey, type Transaction } from "@solana/web3.js";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import { getSolanaConfig } from "@/lib/solana/config";
import { ensureAppKitInitialized, getWalletConnectProjectId } from "@/lib/solana/appkit";

function useRpcConnection(): Connection {
  const { connection: appKitConnection } = useAppKitConnection();
  return useMemo(() => {
    if (appKitConnection) return appKitConnection;
    const config = getSolanaConfig();
    return new Connection(config.rpcUrl, "confirmed");
  }, [appKitConnection]);
}

export function useSolanaWallet() {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount({ namespace: "solana" });
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const connection = useRpcConnection();

  const publicKey = useMemo(() => {
    if (walletProvider?.publicKey) return walletProvider.publicKey;
    if (!address) return null;
    try {
      return new PublicKey(address);
    } catch {
      return null;
    }
  }, [address, walletProvider]);

  const shortAddress = useMemo(() => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  }, [address]);

  const openModalAndConnect = useCallback(async () => {
    if (!getWalletConnectProjectId()) {
      throw new Error(
        "WalletConnect is not configured. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment."
      );
    }
    ensureAppKitInitialized();
    await open({ view: "Connect", namespace: "solana" });
  }, [open]);

  const signTransaction = useCallback(
    async (transaction: Transaction): Promise<Transaction> => {
      if (!walletProvider?.publicKey) {
        throw new Error("Wallet not connected");
      }
      return walletProvider.signTransaction(transaction);
    },
    [walletProvider]
  );

  const signAndSendTransaction = useCallback(
    async (transaction: Transaction): Promise<string> => {
      if (!walletProvider?.publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!transaction.feePayer) {
        transaction.feePayer = walletProvider.publicKey;
      }

      if (!transaction.recentBlockhash) {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
      }

      const signature = await walletProvider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "confirmed");
      return signature;
    },
    [walletProvider, connection]
  );

  const handleDisconnect = useCallback(async () => {
    await disconnect({ namespace: "solana" });
  }, [disconnect]);

  return {
    address: address ?? null,
    shortAddress,
    connected: isConnected,
    connecting: status === "connecting" || status === "reconnecting",
    isConnected,
    connection,
    publicKey,
    openModalAndConnect,
    disconnect: handleDisconnect,
    signTransaction,
    signAndSendTransaction,
  };
}
