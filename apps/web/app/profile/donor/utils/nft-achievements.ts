import type { Database } from "@/lib/supabase/types";
import { fetchPodNftsByOwner } from "@/lib/solana/nft";

type Achievement = Database["public"]["Tables"]["donor_achievements"]["Row"];

export interface NFTAchievement {
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

export function filterNFTAchievements(achievements: Achievement[] | null): NFTAchievement[] {
  if (!achievements) return [];

  return achievements
    .filter((achievement) => {
      const isMinted =
        achievement.nft_minted === true ||
        achievement.nft_minted === "true" ||
        String(achievement.nft_minted).toLowerCase() === "true";
      const hasTokenId =
        achievement.nft_token_id !== null &&
        achievement.nft_token_id !== undefined &&
        String(achievement.nft_token_id).trim() !== "";

      return isMinted && hasTokenId;
    })
    .map((achievement) => ({
      id: achievement.id,
      nft_token_id: String(achievement.nft_token_id),
      blockchain_tx_hash: achievement.blockchain_tx_hash || undefined,
      metadata: achievement.metadata as NFTAchievement["metadata"],
      earned_at: achievement.earned_at,
    }));
}

export async function syncNFTsFromBlockchain(
  solanaAddress: string,
  allAchievements: Achievement[]
): Promise<NFTAchievement[]> {
  try {
    const onChainNfts = await fetchPodNftsByOwner(solanaAddress);
    if (onChainNfts.length === 0) return [];

    return onChainNfts.map((nft, index) => {
      const matchingAchievement = allAchievements.find(
        (a) => String(a.nft_token_id) === nft.mintAddress
      );

      return {
        id: matchingAchievement?.id || `onchain-${nft.mintAddress}`,
        nft_token_id: nft.mintAddress,
        blockchain_tx_hash: matchingAchievement?.blockchain_tx_hash || undefined,
        metadata: {
          ...(matchingAchievement?.metadata as NFTAchievement["metadata"]),
          metadataIpfsUrl: nft.tokenUri || undefined,
          mintAddress: nft.mintAddress,
        },
        earned_at: matchingAchievement?.earned_at || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("[donor-profile] Error syncing NFTs from Solana:", error);
    return [];
  }
}

export async function getNFTAchievements(
  allAchievements: Achievement[] | null,
  solanaAddress?: string | null
): Promise<NFTAchievement[]> {
  if (!allAchievements) return [];

  let nftAchievements = filterNFTAchievements(allAchievements);

  if (nftAchievements.length === 0 && solanaAddress) {
    nftAchievements = await syncNFTsFromBlockchain(solanaAddress, allAchievements);
  }

  return nftAchievements;
}
