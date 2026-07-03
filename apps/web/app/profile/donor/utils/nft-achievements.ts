import type { Database } from "@/lib/supabase/types";

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
      metadata: achievement.metadata as Record<string, unknown> | undefined,
      earned_at: achievement.earned_at,
    }));
}

export async function syncNFTsFromBlockchain(
  _solanaAddress: string,
  _allAchievements: Achievement[]
): Promise<NFTAchievement[]> {
  // Solana NFT on-chain sync not yet implemented
  return [];
}

export async function getNFTAchievements(
  allAchievements: Achievement[] | null,
  solanaAddress?: string | null
): Promise<NFTAchievement[]> {
  if (!allAchievements) return [];

  const nftAchievements = filterNFTAchievements(allAchievements);

  if (nftAchievements.length === 0 && solanaAddress) {
    return syncNFTsFromBlockchain(solanaAddress, allAchievements);
  }

  return nftAchievements;
}
