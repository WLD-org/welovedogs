/**
 * Donor Profile Page
 *
 * Data Sources:
 * 1. Supabase Database:
 *    - Donor profile data (donors table)
 *    - Donation transactions (transactions table)
 *    - Quest definitions (quests table)
 *    - Quest progress (donor_quest_progress table)
 *    - NFT achievements (donor_achievements table)
 *    - Donor levels (donor_levels table)
 *    - Related data: dogs, campaigns (via joins)
 *
 * 2. Solana Blockchain:
 *    - NFT achievements sync (via Metaplex POD NFTs) - fallback if not in database
 *
 * 3. Calculated/Transformed Data:
 *    - Total donated amount (sum of transaction.usd_value)
 *    - Donation count (count of transactions)
 *    - Donor level (calculated from stats vs donor_levels requirements)
 *    - Direct donation history (from transactions with on-chain tx_hash)
 */

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DonorProfileClient from "./DonorProfileClient";
import { getNFTAchievements } from "./utils/nft-achievements";
import {
  calculateTotalDonated,
  calculateDonationCount,
  calculateDonorLevel,
} from "./utils/donor-level";
import { transformDonorData, transformDonations } from "./utils/donor-data";
import { getPodNftMintAuthority } from "./utils/mint-authority";

export default async function DonorProfilePage() {
  const supabase = await createServerClient();

  // Get current user with better error handling
  let user = null;
  try {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();
    if (error || !authUser) {
      console.log(" Auth error or no user found, redirecting to sign-in");
      redirect("/sign-in");
    }
    user = authUser;
  } catch (error) {
    console.log(" Exception getting user:", error);
    redirect("/sign-in");
  }

  if (!user) {
    redirect("/sign-in");
  }

  const { data: donor } = await supabase
    .from("donors")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  // Fetch donation transactions from Supabase
  const { data: transactions } = donor
    ? await supabase
        .from("transactions")
        .select(
          `
      *,
      dogs (
        id,
        name,
        images
      ),
      campaigns (
        id,
        solana_address
      )
    `
        )
        .eq("donor_id", donor.id)
        .eq("type", "donation")
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: quests } = await supabase
    .from("quests")
    .select("*")
    .eq("is_active", true)
    .order("requirement_value", { ascending: true });

  const { data: questProgress } = donor
    ? await supabase.from("donor_quest_progress").select("*").eq("donor_id", donor.id)
    : { data: [] };

  // Fetch NFT achievements from Supabase (minted NFTs)
  const { data: allAchievements } = donor
    ? await supabase
        .from("donor_achievements")
        .select("*")
        .eq("donor_id", donor.id)
        .order("earned_at", { ascending: false })
    : { data: [] };

  // Get NFT achievements with blockchain sync fallback (Solana / Metaplex)
  const nftAchievements = await getNFTAchievements(allAchievements, donor?.solana_address);

  if (donor && allAchievements) {
    console.log("[donor-profile] Donor ID:", donor.id);
    console.log("[donor-profile] Solana Address:", donor.solana_address);
    console.log("[donor-profile] Transactions count:", transactions?.length || 0);
    console.log("[donor-profile] NFT achievements:", nftAchievements.length);
  }

  const { data: donorLevels } = await supabase
    .from("donor_levels")
    .select("*")
    .order("min_total_donated", { ascending: true });

  // Calculate donor stats from Supabase transactions
  const totalDonatedAmount = calculateTotalDonated(transactions);
  const donationCount = calculateDonationCount(transactions);

  // Calculate donor level based on stats (from Supabase donor_levels table)
  const currentLevel = calculateDonorLevel(donorLevels, totalDonatedAmount, donationCount);

  // Transform data for client component
  const donorData = transformDonorData(donor, user, totalDonatedAmount);
  const donations = transformDonations(transactions);
  const mintAuthority = getPodNftMintAuthority();

  return (
    <DonorProfileClient
      donorData={donorData}
      donations={donations}
      quests={quests || []}
      questProgress={questProgress || []}
      donorLevels={donorLevels || []}
      currentLevel={currentLevel}
      nftAchievements={nftAchievements || []}
      mintAuthority={mintAuthority}
    />
  );
}
