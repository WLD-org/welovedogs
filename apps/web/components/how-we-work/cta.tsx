import Link from "next/link";

export function HowWeWorkCta() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 p-8 text-center text-white shadow-xl md:p-14 paw-pattern-bg">
          <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90">
            Every dollar feeds a dog, funds a treatment, or helps a hero keep going. Join the
            community — as a donor or as someone on the front lines.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/donate"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-purple-600 transition-transform hover:scale-105 hover:shadow-lg"
            >
              Find a Dog to Support
            </Link>
            <Link
              href="/register/care-provider"
              className="rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-purple-600"
            >
              Register as a Hero
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
