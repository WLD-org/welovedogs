import { Shield, Sparkles, TrendingUp, CheckCircle } from "lucide-react";

const pillars = [
  {
    icon: TrendingUp,
    title: "Blockchain transparency",
    description:
      "Every donation is traceable and verifiable. Donors see where money goes — from medical treatments to food and shelter costs.",
    checks: ["Real-time donation tracking", "On-chain verified records"],
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Storytelling that connects",
    description:
      "AI helps present each hero's story in a warm, engaging way — amplifying rescuers who rarely have time to write, not replacing their voice.",
    checks: ["Emotional dog profiles", "Care provider journeys"],
    accent: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Verified heroes",
    description:
      "Vets, shelters, and independent rescuers go through verification so donors can give with confidence.",
    checks: ["License & documentation review", "Expense proof on campaigns"],
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export function HowWeWorkTrust() {
  return (
    <section className="bg-gradient-to-b from-white to-purple-50/50 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold text-foreground md:text-4xl">
            Built for trust, not hype
          </h2>
          <p className="text-lg text-muted-foreground">
            Technology should make rescue work easier — for the dogs, the heroes, and everyone who
            wants to help.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-purple-100 bg-white p-7 shadow-sm"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${pillar.bg}`}>
                  <Icon className={`h-6 w-6 ${pillar.accent}`} aria-hidden="true" />
                </div>
                <h3 className="mb-3 font-sans text-xl font-bold text-foreground">{pillar.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
                <ul className="space-y-2">
                  {pillar.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
