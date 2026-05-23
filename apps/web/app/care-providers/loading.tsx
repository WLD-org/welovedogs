import { CareProvidersHero } from "@/components/care-providers-hero";
import { CareProviderCardsSkeleton } from "@/components/loading/hero-cards-skeleton";

export default function CareProvidersLoading() {
  return (
    <main className="min-h-screen">
      <CareProvidersHero />
      <CareProviderCardsSkeleton />
    </main>
  );
}
