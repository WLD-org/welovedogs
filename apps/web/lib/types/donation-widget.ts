export interface DonationWidgetProps {
  dogName: string;
  raised?: number;
  spent: number;
  fundsNeededFor: Array<{ icon: string; label: string }> | string[];
  campaignId?: string;
  careProviderAddress?: string;
  campaignSolanaAddress?: string;
  goal?: number;
}
