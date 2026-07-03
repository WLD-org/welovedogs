export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getTransactionExplorerUrl } from "@/lib/utils/solana-explorer";
import { PLATFORM_COMMISSION_RATE } from "@/lib/solana/config";

type RecordDonationPayload = {
  donorId?: string;
  dogId: string;
  campaignId?: string;
  txHash: string;
  amount: number;
  donorAddress?: string;
  platformFee?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as RecordDonationPayload;
    const { donorId, dogId, campaignId, txHash, amount, donorAddress, platformFee } = body;

    if (!dogId || !txHash || !amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: dogId, txHash, amount" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    let finalDonorId = donorId;
    if (!finalDonorId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: donor } = await supabase
          .from("donors")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (donor) {
          finalDonorId = donor.id;
        }
      }
    }

    const { data: existingTx } = await supabase
      .from("transactions")
      .select("id")
      .eq("tx_hash", txHash)
      .maybeSingle();

    if (existingTx) {
      return NextResponse.json({
        ok: true,
        message: "Donation already recorded",
        transactionId: existingTx.id,
      });
    }

    let finalCampaignId = campaignId;
    if (!finalCampaignId) {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("id")
        .eq("dog_id", dogId)
        .eq("status", "Active")
        .maybeSingle();
      finalCampaignId = campaign?.id || null;
    }

    const fee = platformFee ?? Math.round(amount * PLATFORM_COMMISSION_RATE * 100) / 100;
    const explorerUrl = getTransactionExplorerUrl(txHash);

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        donor_id: finalDonorId || null,
        dog_id: dogId,
        campaign_id: finalCampaignId,
        tx_hash: txHash,
        usd_value: amount,
        crypto_amount: amount.toString(),
        token_symbol: "USDC",
        type: "donation",
        donation_type: "direct",
        donor_address: donorAddress || null,
        explorer_url: explorerUrl,
        description: `Direct donation of $${amount} (platform fee: $${fee})`,
      })
      .select()
      .single();

    if (txError) {
      console.error("Error recording transaction:", txError);
      return NextResponse.json(
        { ok: false, error: `Failed to record transaction: ${txError.message}` },
        { status: 500 }
      );
    }

    if (finalDonorId) {
      try {
        const { updateQuestProgress } = await import("@/app/actions/update-quest-progress");
        await updateQuestProgress(finalDonorId);
      } catch (questError) {
        console.error("Error updating quest progress:", questError);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Donation recorded successfully",
      transactionId: transaction.id,
      donorId: finalDonorId || null,
      transaction: {
        id: transaction.id,
        tx_hash: transaction.tx_hash,
        usd_value: transaction.usd_value,
      },
    });
  } catch (error: unknown) {
    console.error("Error in record donation:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
