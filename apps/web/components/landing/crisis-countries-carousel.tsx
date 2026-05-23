"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type CountryStat = {
  country: string;
  count: number;
  label: string;
  highlight?: boolean;
};

type CrisisCountriesCarouselProps = {
  countries: readonly CountryStat[];
  maxCount: number;
};

function TickerCard({ stat, widthPercent }: { stat: CountryStat; widthPercent: number }) {
  return (
    <article
      className={cn(
        "flex w-[min(82vw,17rem)] shrink-0 flex-col rounded-xl border px-4 py-3 sm:w-72 sm:px-5 sm:py-4",
        stat.highlight
          ? "border-amber-400/50 bg-amber-400/10"
          : "border-white/15 bg-white/5 backdrop-blur-sm"
      )}
      aria-label={`${stat.country}: ${stat.label} stray dogs`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-sm font-bold text-white sm:text-base">
            {stat.country}
          </h3>
          {stat.highlight ? (
            <span className="mt-1 inline-flex rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
              Where we started
            </span>
          ) : null}
        </div>
        <p className="shrink-0 font-sans text-2xl font-bold tabular-nums text-white sm:text-3xl">
          {stat.label}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full",
            stat.highlight
              ? "bg-gradient-to-r from-amber-400 to-orange-400"
              : "bg-gradient-to-r from-purple-400 to-fuchsia-400"
          )}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-purple-200/75">stray dogs</p>
    </article>
  );
}

function StaticCountryGrid({
  countries,
  maxCount,
}: {
  countries: readonly CountryStat[];
  maxCount: number;
}) {
  return (
    <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3">
      {countries.map((stat) => (
        <li key={stat.country}>
          <TickerCard
            stat={stat}
            widthPercent={Math.max((stat.count / maxCount) * 100, stat.highlight ? 12 : 6)}
          />
        </li>
      ))}
    </ul>
  );
}

export function CrisisCountriesCarousel({ countries, maxCount }: CrisisCountriesCarouselProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const loop = [...countries, ...countries];

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="mx-auto max-w-6xl" aria-label="Stray dog population by country">
      <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-purple-300">
        Stray dog population
      </p>

      {reducedMotion ? (
        <StaticCountryGrid countries={countries} maxCount={maxCount} />
      ) : (
        <div className="crisis-ticker-mask group relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#1a0f2e] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#1a0f2e] to-transparent sm:w-16" />

          <div className="crisis-ticker-track flex w-max gap-4 py-1 group-hover:[animation-play-state:paused]">
            {loop.map((stat, index) => (
              <TickerCard
                key={`${stat.country}-${index}`}
                stat={stat}
                widthPercent={Math.max((stat.count / maxCount) * 100, stat.highlight ? 12 : 6)}
              />
            ))}
          </div>
        </div>
      )}

      <ul className="sr-only">
        {countries.map((stat) => (
          <li key={stat.country}>
            {stat.country}: {stat.label} stray dogs
          </li>
        ))}
      </ul>
    </div>
  );
}
