import { Search, Heart, LineChart, Camera } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a dog or hero",
    description:
      "Browse real stories from rescuers and shelters across Costa Rica. Every profile shows who needs help and why.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: Heart,
    title: "Donate with confidence",
    description:
      "Give instantly on Solana. Your contribution goes directly toward medical care, food, and shelter for that dog.",
    accent: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: LineChart,
    title: "Track every dollar",
    description:
      "Donations are recorded on-chain so you can see where funds go — treatments, supplies, and verified expenses.",
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Camera,
    title: "Follow the recovery",
    description:
      "Care providers post updates as dogs heal, get adopted, or find their forever homes. You stay connected to the impact.",
    accent: "from-pink-500 to-rose-500",
  },
];

export function HowWeWorkSteps() {
  return (
    <section className="border-y border-purple-100 bg-gradient-to-b from-purple-50/80 to-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold text-foreground md:text-4xl">
            From story to second chance
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Four simple steps — built so donors feel close to the work and heroes get the support
            they need faster.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent} text-white shadow-sm`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold text-purple-400">0{index + 1}</span>
                </div>
                <h3 className="mb-2 font-sans text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
