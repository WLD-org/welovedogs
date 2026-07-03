/**
 * POD NFT configuration for Solana.
 */

import { getSolanaNetwork } from "@/lib/solana/config";
import { getMintAuthorityPublicKey } from "@/lib/solana/nft";

export type PodConfig = {
  mintAuthority: string | null;
  collectionMint: string | null;
  network: string;
  defaultRecipient: string | undefined;
};

export function getPodConfig(): PodConfig {
  return {
    mintAuthority: getMintAuthorityPublicKey(),
    collectionMint: process.env.NEXT_PUBLIC_POD_COLLECTION_MINT ?? null,
    network: getSolanaNetwork(),
    defaultRecipient: process.env.NEXT_PUBLIC_DEFAULT_DONATION_RECIPIENT,
  };
}
