import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  "aria-label"?: string;
}

/** Animated skeleton placeholder for loading states */
export function Skeleton({ className, "aria-label": ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? "Loading…"}
      aria-busy="true"
      className={cn(
        "animate-pulse rounded-lg bg-muted/60",
        className
      )}
    />
  );
}

/** Full report page skeleton — mirrors the layout of ReportView */
export function ReportSkeleton() {
  return (
    <div role="status" aria-label="Loading audit report" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12">
      {/* Hero */}
      <div className="text-center space-y-4 mb-10">
        <Skeleton className="w-14 h-14 rounded-2xl mx-auto" />
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <span className="sr-only">Loading your audit report, please wait…</span>
    </div>
  );
}

