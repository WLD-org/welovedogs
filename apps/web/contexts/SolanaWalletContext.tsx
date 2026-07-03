"use client";

import { type ReactNode } from "react";
import { ensureAppKitInitialized } from "@/lib/solana/appkit";

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  ensureAppKitInitialized();
  return <>{children}</>;
}
