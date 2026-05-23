import { HowWeWorkHero } from "@/components/how-we-work/hero";
import { HowWeWorkSteps } from "@/components/how-we-work/steps";
import { HowWeWorkDonationImpact } from "@/components/how-we-work/donation-impact";
import { HowWeWorkTrust } from "@/components/how-we-work/trust";
import { HowWeWorkCta } from "@/components/how-we-work/cta";

export default function HowWeWorkPage() {
  return (
    <main className="min-h-screen">
      <HowWeWorkHero />
      <HowWeWorkSteps />
      <HowWeWorkDonationImpact />
      <HowWeWorkTrust />
      <HowWeWorkCta />
    </main>
  );
}
