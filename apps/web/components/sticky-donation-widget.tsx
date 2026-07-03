"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDonation } from "@/hooks/useDonation";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { DonationWidgetProps } from "@/lib/types/donation-widget";
import { getIconEmoji } from "@/lib/utils/fund-icons";
import { PLATFORM_COMMISSION_RATE } from "@/lib/solana/config";

export function StickyDonationWidget({
  dogName,
  spent,
  fundsNeededFor,
  campaignId,
  campaignSolanaAddress,
}: DonationWidgetProps) {
  const router = useRouter();
  const { address, openModalAndConnect } = useSolanaWallet();
  const { donate, isLoading: donationLoading, error: donationError } = useDonation();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignSolanaAddr, setCampaignSolanaAddr] = useState<string | null>(null);
  const [dogId, setDogId] = useState<string | null>(null);
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) return;

      try {
        const supabase = createBrowserClient();
        const { data: campaign } = await supabase
          .from("campaigns")
          .select("solana_address, dog_id")
          .eq("id", campaignId)
          .maybeSingle();

        if (campaign) {
          if (campaign.solana_address) {
            setCampaignSolanaAddr(campaign.solana_address);
          }
          if (campaign.dog_id) {
            setDogId(campaign.dog_id);
          }
        }
      } catch (err) {
        console.error("Error fetching campaign data:", err);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  const refreshDonations = useCallback(async () => {
    if (!campaignId) {
      setTotalDonations(0);
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("usd_value")
        .eq("campaign_id", campaignId)
        .eq("type", "donation");

      if (error) {
        console.error("Error fetching donations:", error);
        return;
      }

      const total =
        transactions?.reduce(
          (sum: number, tx: { usd_value: number | null }) => sum + Number(tx.usd_value || 0),
          0
        ) ?? 0;

      setTotalDonations(total);
    } catch (err) {
      console.error("Error refreshing donations:", err);
    }
  }, [campaignId]);

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoadingDonations(true);
      await refreshDonations();
      setIsLoadingDonations(false);
    };
    fetchDonations();
  }, [refreshDonations]);

  const solanaAddressToUse = campaignSolanaAddr || campaignSolanaAddress || null;

  const handleDonate = async () => {
    const amount = selectedAmount || Number.parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid donation amount",
      });
      setError("Please enter a valid donation amount");
      return;
    }

    if (!address) {
      toast.error("Wallet not connected", {
        description: "Please connect your Solana wallet to make a donation",
      });
      setError("Please connect your wallet to donate");
      await openModalAndConnect();
      return;
    }

    const recipientAddr = solanaAddressToUse;
    if (!recipientAddr) {
      toast.error("Campaign wallet not configured", {
        description: "Please contact the campaign organizer.",
      });
      setError("Campaign Solana address is required for donations.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const toastId = toast.loading("Processing donation...", {
      description: "Sending USDC on Solana",
    });

    try {
      const donationResult = await donate(recipientAddr, amount.toString());

      if (!donationResult.successful) {
        throw new Error("Donation failed");
      }

      toast.success("Donation successful!", {
        id: toastId,
        description: `$${amount} sent — ${(100 - PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% goes to ${dogName}'s care`,
        duration: 5000,
      });

      await refreshDonations();

      const dogIdParam = dogId ? `&dogId=${encodeURIComponent(dogId)}` : "";
      const campaignIdParam = campaignId ? `&campaignId=${encodeURIComponent(campaignId)}` : "";
      const donorAddressParam = address ? `&donorAddress=${encodeURIComponent(address)}` : "";
      router.push(
        `/donation-success?dog=${encodeURIComponent(dogName)}&amount=${amount}&hash=${donationResult.hash}${dogIdParam}${campaignIdParam}${donorAddressParam}`
      );
    } catch (err: unknown) {
      console.error("Donation error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process donation. Please try again.";

      toast.error("Donation failed", {
        id: toastId,
        description: errorMessage,
      });

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const isLoading = isProcessing || donationLoading;
  const displayError = error || donationError?.message;
  const donationAmounts = [25, 50, 100];

  const normalizedFunds = Array.isArray(fundsNeededFor)
    ? fundsNeededFor.map((item) => (typeof item === "string" ? { icon: item, label: item } : item))
    : [];

  return (
    <div className="w-full sticky top-20 h-fit" id="donation-widget">
      <div
        className="rounded-2xl p-3 md:p-4 shadow-2xl border-2 border-purple-300"
        style={{
          backgroundImage: "url('/purple-paw-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="mb-3 md:mb-4 font-sans text-lg md:text-xl font-bold text-white">
          Support {dogName}
        </h2>

        <div className="mb-3 md:mb-4">
          <div className="mb-1.5 flex items-end justify-between">
            <span className="font-sans text-xs md:text-sm font-semibold text-white">
              Amount Raised
            </span>
            <span className="font-sans text-xl md:text-2xl font-bold text-white">
              $
              {isLoadingDonations
                ? "..."
                : totalDonations.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] md:text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Direct donations on Solana
            </span>
          </div>
        </div>

        <div className="mb-3 md:mb-4">
          <div className="mb-1.5 flex items-end justify-between">
            <span className="font-sans text-xs md:text-sm font-semibold text-white">
              Amount Spent on Care
            </span>
            <span className="font-sans text-xl md:text-2xl font-bold text-white">
              ${spent.toLocaleString()}
            </span>
          </div>
        </div>

        {normalizedFunds.length > 0 && (
          <div className="mb-3 md:mb-4 rounded-xl bg-white/95 p-2.5 md:p-3">
            <h3 className="mb-2 font-sans text-xs md:text-sm font-bold text-gray-900">
              How Your Donation Helps {dogName}
            </h3>
            <div className="space-y-1.5">
              {normalizedFunds.map((item) => (
                <div
                  key={`${item.icon}-${item.label}`}
                  className="flex items-center gap-2 rounded-lg bg-purple-50 px-2 py-1.5"
                >
                  <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-purple-600 shrink-0">
                    <span className="text-xs md:text-sm">{getIconEmoji(item.icon)}</span>
                  </div>
                  <span className="font-sans text-[10px] md:text-xs font-medium text-gray-800 leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2.5 md:mb-3 rounded-xl bg-white/95 p-2 md:p-2.5">
          <h3 className="mb-1.5 font-sans text-[10px] md:text-xs font-bold text-gray-900">
            Select Donation Amount
          </h3>
          <div className="mb-2 md:mb-2.5 grid grid-cols-3 gap-1.5">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`rounded-lg border-2 py-1.5 font-sans text-xs font-semibold transition-all ${
                  selectedAmount === amount
                    ? "border-purple-600 bg-purple-600 text-white shadow-md"
                    : "border-purple-300 bg-white text-purple-700 hover:border-purple-500 hover:bg-purple-50"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor="custom-amount-input"
              className="mb-1 block font-sans text-[10px] md:text-xs font-medium text-gray-700"
            >
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 font-sans text-xs text-gray-500">
                $
              </span>
              <input
                id="custom-amount-input"
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="0.00"
                className="w-full rounded-lg border-2 border-purple-300 bg-white py-1.5 pl-5 md:pl-6 pr-2 font-sans text-xs text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
          </div>
        </div>

        {displayError && (
          <div className="mb-2 md:mb-3 rounded-lg bg-red-50 border border-red-200 p-2.5 md:p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-red-800 leading-tight">{displayError}</p>
            </div>
          </div>
        )}

        {!address && (
          <div className="mb-2 md:mb-3 rounded-lg bg-yellow-50 border border-yellow-200 p-2.5 md:p-3">
            <p className="font-sans text-xs text-yellow-800 leading-tight">
              Connect your Solana wallet via WalletConnect to donate
            </p>
          </div>
        )}

        <Button
          onClick={handleDonate}
          disabled={isLoading || (!selectedAmount && !customAmount) || !address}
          className="mb-2 md:mb-3 w-full rounded-lg bg-purple-600 py-3 md:py-4 font-sans text-sm md:text-base font-bold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-label="Loading">
                <title>Loading spinner</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 fill-current" />
              DONATE NOW
            </span>
          )}
        </Button>

        <p className="mb-1.5 md:mb-2 text-center font-sans text-[9px] md:text-[10px] text-white/90 leading-tight">
          {(100 - PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% goes directly to {dogName}&apos;s
          care. A {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% platform fee supports operations.
        </p>

        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white/20 px-2 py-1.5">
          <svg
            className="h-3 w-3 md:h-3.5 md:w-3.5 text-white shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Security shield icon"
          >
            <title>Security shield</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="font-sans text-[9px] md:text-[10px] text-white leading-tight">
            Live transparency powered by Solana
          </span>
        </div>
      </div>
    </div>
  );
}
