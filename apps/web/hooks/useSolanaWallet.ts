"use client";

import { useCallback, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { Transaction } from "@solana/web3.js";

export function useSolanaWallet() {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    signTransaction,
    sendTransaction,
  } = useWallet();
  const { setVisible } = useWalletModal();

  const address = publicKey?.toBase58() ?? null;

  const shortAddress = useMemo(() => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  }, [address]);

  const openModalAndConnect = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const signAndSendTransaction = useCallback(
    async (transaction: Transaction) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (signTransaction) {
        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(signature, "confirmed");
        return signature;
      }
      if (sendTransaction) {
        return sendTransaction(transaction, connection);
      }
      throw new Error("Wallet does not support transaction signing");
    },
    [publicKey, signTransaction, sendTransaction, connection]
  );

  return {
    address,
    shortAddress,
    connected,
    connecting,
    isConnected: connected,
    connection,
    publicKey,
    openModalAndConnect,
    disconnect,
    signTransaction,
    signAndSendTransaction,
  };
}
