"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, HeartHandshake, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/motion";

const pillars = [
  {
    icon: Eye,
    title: "See where every dollar goes",
    description:
      "Donations are tracked on-chain. No black boxes — supporters follow funds from gift to treatment, food, and shelter.",
  },
  {
    icon: HeartHandshake,
    title: "Put heroes in the spotlight",
    description:
      "Vets, shelters, and rescuers finally get the visibility and tools they need to keep saving dogs — starting in Costa Rica.",
  },
];

export function LandingBridge() {
  return (
    <section className="border-y border-purple-100 bg-gradient-to-b from-purple-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold text-foreground md:text-4xl">
            The problem is massive. Your help can be precise.
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            WeLoveDogs exists because rescue work is underfunded, invisible, and impossible to
            scale without trust and transparency.
          </p>
        </Reveal>

        <div className="mx-auto mb-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delayMs={150 + index * 150}>
                <div className="group h-full rounded-2xl border border-purple-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-sans text-xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delayMs={400} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="transition-transform hover:scale-105">
            <Link href="/how-we-work">
              See how it works
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
            <Link href="/care-providers">Meet the heroes</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
