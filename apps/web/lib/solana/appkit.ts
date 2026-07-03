"use client";

import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import {
  solana,
  solanaDevnet,
  solanaTestnet,
  type AppKitNetwork,
} from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { getSolanaConfig, getSolanaNetwork } from "@/lib/solana/config";

export function getWalletConnectProjectId(): string {
  return (
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
    ""
  );
}

function getAppKitNetworks(): [AppKitNetwork, ...AppKitNetwork[]] {
  const network = getSolanaNetwork();
  if (network === "mainnet-beta") return [solana];
  if (network === "testnet") return [solanaTestnet];
  return [solanaDevnet];
}

const projectId = getWalletConnectProjectId();
const config = getSolanaConfig();
const networks = getAppKitNetworks();

const metadata = {
  name: config.appName,
  description: "Proof of Donation platform for dog rescue campaigns on Solana.",
  url: config.appUrl,
  icons: [`${config.appUrl}/favicon.ico`],
};

let initialized = false;

export function ensureAppKitInitialized(): boolean {
  if (initialized || !projectId) return initialized;

  const solanaAdapter = new SolanaAdapter({
    registerWalletStandard: true,
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  });

  createAppKit({
    adapters: [solanaAdapter],
    networks,
    defaultNetwork: networks[0],
    metadata,
    projectId,
    themeMode: "light",
    features: {
      analytics: false,
    },
  });

  initialized = true;
  return true;
}

// Initialize when this client module loads (inside SolanaWalletProvider tree).
if (projectId) {
  ensureAppKitInitialized();
}
