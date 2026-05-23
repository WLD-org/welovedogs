import { Stethoscope, Home, Wheat, Users, DollarSign } from "lucide-react";

const highlights = [
  { label: "Monthly cost per dog", value: "$20", detail: "vet, food & shelter care" },
  { label: "Dog food consumed", value: "4+ tons", detail: "every week at large sanctuaries" },
  { label: "Shelter team", value: "20+", detail: "people caring for the pack daily" },
];

const breakdown = [
  {
    icon: Stethoscope,
    title: "Veterinary care",
    amount: "$10/month",
    color: "border-emerald-200 bg-emerald-50/60",
    iconBg: "bg-emerald-100 text-emerald-700",
    description:
      "Every new dog is neutered and dewormed when they arrive. Some cases need surgeries, amputations, or major operations that demand far more resources — but on average, a healthy dog costs around $10 per month for basic medication and veterinary care.",
  },
  {
    icon: Home,
    title: "Shelter & farm",
    amount: "Daily care",
    color: "border-blue-200 bg-blue-50/60",
    iconBg: "bg-blue-100 text-blue-700",
    description:
      "A team of more than 20 people runs the shelter every day — feeding the pack, walking dogs around the farm, coordinating vet visits, handling logistics, cleaning spaces, and showing up with customer care and heart. It is hard work, and also the most gratifying work we can imagine.",
  },
  {
    icon: Wheat,
    title: "Food costs",
    amount: "$10/month",
    color: "border-amber-200 bg-amber-50/60",
    iconBg: "bg-amber-100 text-amber-700",
    description:
      "Large sanctuaries go through more than 4 tons of dog food every week. Running out is never an option. On average, each dog consumes around $10 of food every single month — one of the biggest line items in keeping a pack alive and healthy.",
  },
];

export function HowWeWorkDonationImpact() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_uwlb3xuwlb3xuwlb-awu9qxePhWlzj1m6sjUBvyU36C8rUW.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <DollarSign className="h-4 w-4" aria-hidden="true" />
            Where your money goes
          </div>
          <h2 className="mb-5 font-sans text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            What is included in your donation?
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Taking care of a big pack has a lot of challenges. We have a big tribe of people who
            help us get our dogs neutered, fed, cleaned, and loved every single day. Each dog has a
            cost of around <strong className="font-semibold text-foreground">$20 per month</strong>{" "}
            — covering veterinary care, food, and shelter maintenance.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/60 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm"
            >
              <p className="mb-1 text-3xl font-bold text-primary md:text-4xl">{item.value}</p>
              <p className="mb-1 text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>Typical monthly breakdown per dog at a large sanctuary</span>
          </div>

          <div className="mb-4 flex h-4 overflow-hidden rounded-full bg-purple-100">
            <div className="w-1/2 bg-emerald-500" title="Veterinary care ~50%" />
            <div className="w-1/2 bg-amber-400" title="Food costs ~50%" />
          </div>
          <div className="mb-10 flex justify-between text-xs font-medium text-muted-foreground">
            <span>Veterinary care · ~$10/mo</span>
            <span>Food · ~$10/mo</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {breakdown.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${item.color}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`rounded-xl p-3 ${item.iconBg}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-foreground">
                      {item.amount}
                    </span>
                  </div>
                  <h3 className="mb-3 font-sans text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">
            Numbers vary by sanctuary size and medical needs. Emergency surgeries and special cases
            can exceed these averages — which is exactly why transparent, story-driven fundraising
            matters.
          </p>
        </div>
      </div>
    </section>
  );
}
