import { memo } from "react";

interface SkeletonProps {
  className?: string;
}

/**
 * Basis-Skeleton-Komponente mit Pulse-Animation
 */
export const Skeleton = memo(function Skeleton({
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
});

/**
 * Skeleton für NuggetEntryCard
 */
export const NuggetEntryCardSkeleton = memo(function NuggetEntryCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-200/60">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="mt-2 h-4 w-24" />
          <div className="mt-2 flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Skeleton für Stats-Grid
 */
export const StatsGridSkeleton = memo(function StatsGridSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="mb-8 sm:hidden">
        <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200/50">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="mx-auto h-4 w-12" />
                <Skeleton className="mx-auto mt-2 h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="mb-8 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-8 w-24" />
          </div>
        ))}
      </div>
    </>
  );
});

/**
 * Skeleton für Leaderboard-Tabelle
 */
export const LeaderboardSkeleton = memo(function LeaderboardSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/80"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
});

export default Skeleton;
