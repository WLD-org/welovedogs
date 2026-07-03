"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, ImageIcon, Sparkles } from "lucide-react";
import type { TokenMetadata } from "@/components/NFT/types";
import { getAccountExplorerUrl, getTransactionExplorerUrl } from "@/lib/utils/solana-explorer";
import { getSolanaNetwork } from "@/lib/solana/config";

interface NFTAchievement {
  id: string;
  nft_token_id: string;
  blockchain_tx_hash?: string;
  metadata?: {
    metadataIpfsUrl?: string;
    imageIpfsUrl?: string;
    dogName?: string;
    donationAmount?: number;
    transactionId?: string;
    mintAddress?: string;
    explorerUrl?: string;
  };
  earned_at: string;
}

interface DonorNFTGalleryProps {
  nftAchievements: NFTAchievement[];
}

export default function DonorNFTGallery({ nftAchievements }: DonorNFTGalleryProps) {
  const [tokenMetadata, setTokenMetadata] = useState<Record<string, TokenMetadata | null>>({});
  const [loading, setLoading] = useState(true);
  const network = getSolanaNetwork();

  useEffect(() => {
    if (nftAchievements.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadMetadata() {
      setLoading(true);
      try {
        const entries = await Promise.all(
          nftAchievements.map(async (achievement) => {
            const mintAddress = achievement.nft_token_id;
            const metadataUrl = achievement.metadata?.metadataIpfsUrl;
            if (!metadataUrl) {
              return [mintAddress, null] as const;
            }

            try {
              const url = metadataUrl.startsWith("ipfs://")
                ? `https://gateway.pinata.cloud/ipfs/${metadataUrl.replace("ipfs://", "")}`
                : metadataUrl;

              const response = await fetch(url);
              if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
              }
              const data = (await response.json()) as TokenMetadata;
              return [mintAddress, data] as const;
            } catch (error) {
              console.error(`Failed to load metadata for mint ${mintAddress}:`, error);
              return [mintAddress, null] as const;
            }
          })
        );

        if (!cancelled) {
          setTokenMetadata(Object.fromEntries(entries));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [nftAchievements]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-80 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (nftAchievements.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 p-12 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-purple-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No NFTs Yet</h3>
        <p className="text-sm text-gray-500">
          Make a donation and mint your first Proof of Donation NFT on Solana!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {nftAchievements.map((achievement, index) => {
        const mintAddress = achievement.nft_token_id;
        const metadata = tokenMetadata[mintAddress];
        const imageUrl = metadata?.image
          ? metadata.image.startsWith("ipfs://")
            ? `https://gateway.pinata.cloud/ipfs/${metadata.image.replace("ipfs://", "")}`
            : metadata.image
          : achievement.metadata?.imageIpfsUrl
            ? achievement.metadata.imageIpfsUrl.startsWith("ipfs://")
              ? `https://gateway.pinata.cloud/ipfs/${achievement.metadata.imageIpfsUrl.replace("ipfs://", "")}`
              : achievement.metadata.imageIpfsUrl
            : null;

        const series = metadata?.attributes?.find((attr) => attr.trait_type === "Series")?.value;
        const donationAmount = metadata?.attributes?.find(
          (attr) => attr.trait_type === "Donation Amount"
        )?.value;
        const dogName = metadata?.attributes?.find((attr) => attr.trait_type === "Dog")?.value;

        const mintExplorerUrl = getAccountExplorerUrl(mintAddress);
        const txExplorerUrl = achievement.blockchain_tx_hash
          ? getTransactionExplorerUrl(achievement.blockchain_tx_hash)
          : achievement.metadata?.explorerUrl || null;

        return (
          <Card
            key={achievement.id}
            className="group relative overflow-hidden border-2 border-purple-200/50 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative p-6 z-10">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={metadata?.name || `POD ${mintAddress.slice(0, 8)}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {metadata?.name || `Proof of Donation`}
                </h3>
                <p className="text-xs font-mono text-gray-500 mb-3 break-all">
                  {mintAddress.slice(0, 4)}…{mintAddress.slice(-4)}
                </p>

                <div className="w-full space-y-2 mb-4">
                  {dogName && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Dog</span>
                      <span className="text-xs font-bold text-gray-800">{dogName}</span>
                    </div>
                  )}
                  {donationAmount && (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Amount</span>
                      <span className="text-xs font-bold text-green-700">{donationAmount}</span>
                    </div>
                  )}
                  {series && (
                    <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Series</span>
                      <span className="text-xs font-bold text-purple-700">{series}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 w-full">
                  <a
                    href={mintExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View NFT
                  </a>
                  {txExplorerUrl && (
                    <a
                      href={txExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-purple-300 px-4 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Mint Tx
                    </a>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Earned {new Date(achievement.earned_at).toLocaleDateString()} · {network}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
