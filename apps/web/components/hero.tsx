"use client";

import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/landing/motion";
import { ChevronDown, Eye, Globe, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TRUST_STATS = [
  {
    icon: Globe,
    value: 64_000_000,
    suffix: "M+",
    label: "stray dogs across 6 countries",
  },
  {
    icon: Eye,
    value: 100,
    suffix: "%",
    label: "transparent donation tracking",
  },
  {
    icon: MapPin,
    staticValue: "Costa Rica",
    label: "where our mission began",
  },
] as const;

export function Hero() {
  const scrollToMatchMe = () => {
    const matchMeSection = document.getElementById("match-me-section");
    matchMeSection?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto px-4 pb-10 pt-8 md:pb-14 md:pt-12 lg:pb-16 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <p
              className="animate-hero-enter mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-sm motion-reduce:animate-none"
              style={{ animationDelay: "0ms" }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Donations platform · Starting in Costa Rica
            </p>

            <h1 className="mb-5 font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.35rem] lg:leading-[1.08] xl:text-7xl">
              <span
                className="animate-hero-enter block text-balance motion-reduce:animate-none"
                style={{ animationDelay: "80ms" }}
              >
                We love dogs.
              </span>
              <span
                className="animate-hero-enter mt-1 block text-balance text-primary motion-reduce:animate-none"
                style={{ animationDelay: "140ms" }}
              >
                Too many are running out of time.
              </span>
            </h1>

            <p
              className="animate-hero-enter mb-8 text-pretty text-base leading-relaxed text-muted-foreground motion-reduce:animate-none sm:text-lg md:text-xl"
              style={{ animationDelay: "180ms" }}
            >
              Millions are abandoned every year, faster than rescuers can save them. WeLoveDogs
              connects you directly with the heroes on the ground: transparent donations, real
              stories, and a clear path from your gift to a dog&apos;s recovery.
            </p>

            <div
              className="animate-hero-enter mb-8 grid gap-3 sm:grid-cols-3 motion-reduce:animate-none"
              style={{ animationDelay: "280ms" }}
            >
              {TRUST_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-purple-100/80 bg-white/70 px-3 py-3 text-center backdrop-blur-sm lg:text-left"
                  >
                    <div className="mb-1 flex items-center justify-center gap-1.5 text-primary lg:justify-start">
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <p className="font-sans text-lg font-bold tabular-nums text-foreground">
                        {"staticValue" in stat ? (
                          stat.staticValue
                        ) : (
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        )}
                      </p>
                    </div>
                    <p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              className="animate-hero-enter flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start motion-reduce:animate-none"
              style={{ animationDelay: "380ms" }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
                onClick={scrollToMatchMe}
              >
                <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                Start Donating
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-purple-200 bg-white/80 backdrop-blur-sm transition-transform hover:scale-[1.02]"
              >
                <Link href="#the-crisis">
                  See the crisis
                  <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            className="animate-hero-enter flex items-center justify-center motion-reduce:animate-none lg:justify-end"
            style={{ animationDelay: "200ms" }}
          >
            <Image
              src="/images/design-mode/banner-123.png"
              alt="Cartoon dogs illustration"
              width={1200}
              height={300}
              className="h-auto w-full max-w-lg object-contain sm:max-w-xl lg:max-w-none xl:max-w-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
