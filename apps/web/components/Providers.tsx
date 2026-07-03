"use client";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </SupabaseProvider>
  );
}
