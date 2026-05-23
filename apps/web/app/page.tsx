import { Hero } from "@/components/hero";
import { CrisisSection } from "@/components/landing/crisis-section";
import { LandingBridge } from "@/components/landing/bridge";
import { DogCards } from "@/components/dog-cards";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div id="the-crisis">
        <CrisisSection />
      </div>
      <LandingBridge />
      <DogCards />
    </main>
  );
}
