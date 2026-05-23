import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CARE_PROVIDERS_BG = "url('/images/gemini-generated-image-uwlb3xuwlb3xuwlb.png')";
const DONATE_BG =
  "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_uwlb3xuwlb3xuwlb-awu9qxePhWlzj1m6sjUBvyU36C8rUW.png)";

function FilterSkeletons() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Skeleton className="h-4 w-24 bg-white/30" />
        <Skeleton className="h-10 w-full sm:w-48 rounded-md bg-white/25" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Skeleton className="h-4 w-20 bg-white/30" />
        <Skeleton className="h-10 w-full sm:w-48 rounded-md bg-white/25" />
      </div>
    </div>
  );
}

function CareProviderCardSkeleton() {
  return (
    <Card className="overflow-hidden border-white/20 bg-white/20 backdrop-blur-md p-0 flex flex-col h-full">
      <Skeleton className="h-8 w-full rounded-none bg-white/30" />
      <Skeleton className="aspect-4/3 w-full rounded-none bg-white/25" />
      <CardContent className="px-6 pb-6 pt-4 flex flex-col grow">
        <Skeleton className="mb-3 h-7 w-3/4 bg-white/30" />
        <Skeleton className="mb-3 h-4 w-1/2 bg-white/25" />
        <Skeleton className="mb-2 h-3 w-full bg-white/20" />
        <Skeleton className="mb-4 h-3 w-5/6 bg-white/20" />
        <div className="mb-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-lg bg-white/20" />
          ))}
        </div>
        <Skeleton className="mt-auto h-10 w-full rounded-md bg-white/30" />
      </CardContent>
    </Card>
  );
}

function DogCardSkeleton() {
  return (
    <Card className="overflow-hidden border-white/20 bg-white/20 backdrop-blur-md p-0">
      <Skeleton className="aspect-4/3 w-full rounded-none bg-white/25" />
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-7 w-2/5 bg-white/30" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/25" />
        </div>
        <Skeleton className="h-4 w-1/2 bg-white/25" />
        <Skeleton className="h-3 w-full bg-white/20" />
        <Skeleton className="h-3 w-4/5 bg-white/20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full bg-white/25" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-5 w-24 rounded-full bg-white/25" />
            <Skeleton className="h-4 w-20 rounded-full bg-white/20" />
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded-full bg-white/20" />
        <Skeleton className="h-10 w-full rounded-md bg-white/30" />
      </CardContent>
    </Card>
  );
}

function LoadingStatus({ label }: { label: string }) {
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {label}
    </p>
  );
}

export function CareProviderCardsSkeleton() {
  return (
    <section
      className="relative bg-primary py-12"
      style={{
        backgroundImage: CARE_PROVIDERS_BG,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-busy="true"
    >
      <LoadingStatus label="Loading care providers" />
      <div className="container mx-auto px-4">
        <FilterSkeletons />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CareProviderCardSkeleton key={index} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Skeleton className="h-4 w-48 bg-white/25" />
        </div>
      </div>
    </section>
  );
}

export function DogCardsSkeleton() {
  return (
    <section
      className="py-0 pb-12 md:pb-16"
      style={{
        backgroundImage: DONATE_BG,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
      aria-busy="true"
    >
      <LoadingStatus label="Loading dogs" />
      <div className="container mx-auto px-4">
        <div className="mb-12 pt-12 text-center md:pt-16">
          <Skeleton className="mx-auto mb-4 h-10 w-full max-w-2xl bg-white/30" />
          <Skeleton className="mx-auto h-6 w-full max-w-xl bg-white/25" />
        </div>

        <div className="mb-8 flex flex-col items-center gap-2">
          <Skeleton className="h-14 w-72 max-w-full rounded-full bg-white/30" />
          <Skeleton className="h-4 w-64 max-w-full bg-white/20" />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <Skeleton className="h-10 w-44 rounded-md bg-white/25" />
          <Skeleton className="h-10 w-44 rounded-md bg-white/25" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <DogCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-6">
          <Skeleton className="h-4 w-40 bg-white/25" />
        </div>
      </div>
    </section>
  );
}
