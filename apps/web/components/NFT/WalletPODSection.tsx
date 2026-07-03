"use client";

import { PODGallery } from "@/components/NFT/PODGallery";
import { Button } from "@/components/ui/button";
import { usePodPoap } from "@/hooks/usePodPoap";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { getSolanaNetwork } from "@/lib/solana/config";
import { RefreshCw } from "lucide-react";

type WalletPODSectionProps = {
  mintAuthority?: string | null;
};

export function WalletPODSection({ mintAuthority }: WalletPODSectionProps) {
  const { connected, openModalAndConnect } = useSolanaWallet();
  const { tokens, loading, refreshTokens } = usePodPoap();
  const network = getSolanaNetwork();

  return (
    <div className="mt-10 rounded-xl border border-purple-200 bg-purple-50/40 p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">On-Chain PODs in Your Wallet</h3>
          <p className="text-sm text-gray-600">
            Live view of POD NFTs held by your connected Solana wallet ({network}).
          </p>
        </div>
        {connected ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refreshTokens()}
            disabled={loading}
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => void openModalAndConnect()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Connect Wallet
          </Button>
        )}
      </div>

      <PODGallery
        isConnected={connected}
        tokens={tokens}
        loading={loading}
        mintAuthority={mintAuthority}
        network={network}
      />
    </div>
  );
}
