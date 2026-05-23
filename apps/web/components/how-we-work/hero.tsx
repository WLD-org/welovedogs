import { CaretakersBanner } from "@/components/caretakers-banner";

export function HowWeWorkHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto px-4 py-10 pb-14 md:py-14 md:pb-16 lg:py-16 lg:pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            How WeLoveDogs works
          </p>
          <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Support you can see. Impact you can trust.
          </h1>

          <div className="mb-8 flex justify-center">
            <CaretakersBanner className="h-auto w-full max-w-3xl" />
          </div>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            We connect compassionate donors with the vets, shelters, and rescuers doing the hardest
            work — then make every step transparent, from the first donation to the dog&apos;s
            recovery.
          </p>
        </div>
      </div>
    </section>
  );
}
