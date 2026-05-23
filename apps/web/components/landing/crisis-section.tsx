"use client";

import {
  AnimatedCounter,
  CrisisParticles,
  Reveal,
} from "@/components/landing/motion";
import { CrisisCountriesCarousel } from "@/components/landing/crisis-countries-carousel";

const STRAY_DOG_STATS = [
  { country: "USA", count: 40_000_000, label: "40M", highlight: false },
  { country: "Mexico", count: 16_100_000, label: "16.1M", highlight: false },
  { country: "Peru", count: 6_000_000, label: "6M", highlight: false },
  { country: "Costa Rica", count: 1_000_000, label: "1M", highlight: true },
  { country: "Uruguay", count: 800_000, label: "800K", highlight: false },
  { country: "Colombia", count: 120_000, label: "120K", highlight: false },
] as const;

const TOTAL_STRAY_DOGS = STRAY_DOG_STATS.reduce((sum, stat) => sum + stat.count, 0);
const MAX_COUNT = STRAY_DOG_STATS[0].count;

export function CrisisSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#1a0f2e] py-16 text-white md:py-20"
      aria-labelledby="crisis-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 motion-reduce:animate-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.12), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <CrisisParticles />

      <div className="container relative mx-auto px-4">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
            The crisis
          </p>
          <h2
            id="crisis-heading"
            className="mb-5 text-balance font-sans text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Millions of dogs need help.
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-purple-100/90 md:text-xl">
            Every year, dogs are abandoned faster than anyone can save them. The numbers are
            staggering — and they keep growing.
          </p>
        </Reveal>

        <CrisisCountriesCarousel countries={STRAY_DOG_STATS} maxCount={MAX_COUNT} />

        <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
          <Reveal delayMs={100}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-transform duration-300 hover:scale-[1.02] md:p-8">
              <p className="mb-2 font-sans text-4xl font-bold text-white md:text-5xl">
                <AnimatedCounter value={TOTAL_STRAY_DOGS} suffix="M+" />
              </p>
              <p className="text-sm leading-relaxed text-purple-100/90 md:text-base">
                stray dogs across just these 6 countries. The crisis is global — and it is not
                slowing down.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={250}>
            <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-6 text-center transition-transform duration-300 hover:scale-[1.02] md:p-8">
              <p className="mb-2 font-sans text-4xl font-bold text-white md:text-5xl">
                <AnimatedCounter value={70} suffix="%" />
              </p>
              <p className="text-sm leading-relaxed text-purple-100/90 md:text-base">
                of donors want better visibility into how their gifts are used. Good intentions are
                not enough.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
