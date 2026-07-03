import { clusterApiUrl, type Cluster } from "@solana/web3.js";

export type SolanaNetwork = "devnet" | "mainnet-beta" | "testnet";

export type SolanaConfig = {
  network: SolanaNetwork;
  rpcUrl: string;
  usdcMint: string;
  platformWallet: string;
  commissionRate: number;
  appName: string;
  appUrl: string;
};

// Circle USDC mint addresses
const USDC_MINT_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const USDC_MINT_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const PLATFORM_COMMISSION_RATE = 0.01; // 1%

export function getSolanaNetwork(): SolanaNetwork {
  const env = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet").toLowerCase();
  if (env === "mainnet" || env === "mainnet-beta") return "mainnet-beta";
  if (env === "testnet") return "testnet";
  return "devnet";
}

export function getSolanaConfig(): SolanaConfig {
  const network = getSolanaNetwork();
  const isMainnet = network === "mainnet-beta";

  return {
    network,
    rpcUrl:
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      clusterApiUrl(network as Cluster),
    usdcMint:
      process.env.NEXT_PUBLIC_USDC_MINT ||
      (isMainnet ? USDC_MINT_MAINNET : USDC_MINT_DEVNET),
    platformWallet:
      process.env.NEXT_PUBLIC_PLATFORM_WALLET || "",
    commissionRate: PLATFORM_COMMISSION_RATE,
    appName: process.env.NEXT_PUBLIC_APP_NAME || "We Love Dogs",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

export function getNetworkPassphrase(): string {
  const network = getSolanaNetwork();
  if (network === "mainnet-beta") return "mainnet-beta";
  return network;
}
