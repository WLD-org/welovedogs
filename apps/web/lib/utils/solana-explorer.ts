import { getSolanaNetwork } from "@/lib/solana/config";

export function getTransactionExplorerUrl(signature: string): string {
  const network = getSolanaNetwork();
  const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

export function getAccountExplorerUrl(address: string): string {
  const network = getSolanaNetwork();
  const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
  return `https://explorer.solana.com/address/${address}${cluster}`;
}
