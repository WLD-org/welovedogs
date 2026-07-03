export type AppConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  solanaNetwork: "devnet" | "mainnet-beta" | "testnet";
  solanaRpcUrl: string;
  usdcMint: string;
  platformWallet: string;
  appName?: string;
  appUrl?: string;
};

export function getConfig(): AppConfig {
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    "";

  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet").toLowerCase();
  const solanaNetwork =
    network === "mainnet" || network === "mainnet-beta"
      ? "mainnet-beta"
      : network === "testnet"
        ? "testnet"
        : "devnet";

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey,
    solanaNetwork,
    solanaRpcUrl:
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      (solanaNetwork === "mainnet-beta"
        ? "https://api.mainnet-beta.solana.com"
        : solanaNetwork === "testnet"
          ? "https://api.testnet.solana.com"
          : "https://api.devnet.solana.com"),
    usdcMint:
      process.env.NEXT_PUBLIC_USDC_MINT ||
      (solanaNetwork === "mainnet-beta"
        ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        : "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
    platformWallet: process.env.NEXT_PUBLIC_PLATFORM_WALLET || "",
    appName: process.env.NEXT_PUBLIC_APP_NAME || "We Love Dogs",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}
