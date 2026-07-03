import { Zap } from "lucide-react";
import { formatCurrency } from "./utils";
import type { Dog } from "./types";

interface CampaignStatusCardProps {
  dog: Dog;
  totalRaised: number;
  isLoadingDonations: boolean;
}

export function CampaignStatusCard({
  dog,
  totalRaised,
  isLoadingDonations,
}: CampaignStatusCardProps) {
  if (dog.goal === 0) {
    return (
      <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-8 text-center">
        <p className="text-yellow-800 font-medium">
          This dog doesn&apos;t have an active fundraising campaign yet. Check back soon or contact
          the care provider for more information.
        </p>
      </div>
    );
  }

  const progressPercentage = Math.round((totalRaised / dog.goal) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-foreground">
            {dog.headline || `Help ${dog.name} Recover`}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Campaign Status: Active</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Fundraising Progress</span>
            <span className="text-muted-foreground">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 rounded-lg bg-background/60">
            <div className="text-2xl font-bold text-foreground">
              ${formatCurrency(totalRaised, isLoadingDonations)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Raised</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/60">
            <div className="text-2xl font-bold text-foreground">${dog.goal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Goal</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/60">
            <div className="text-2xl font-bold text-foreground">
              ${formatCurrency(totalRaised - (dog.spent || 0))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Remaining</div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border bg-background/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              Direct donations on Solana
            </span>
            <span className="font-semibold text-foreground">
              ${formatCurrency(totalRaised, isLoadingDonations)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
