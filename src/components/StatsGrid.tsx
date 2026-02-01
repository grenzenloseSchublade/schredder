import type { DashboardStats } from "@/hooks/useDashboardStats";

interface StatsGridProps {
  stats: DashboardStats;
}

function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

function TrendBadge({ trend }: { trend: number | null }) {
  if (trend === null) return null;

  const isPositive = trend >= 0;
  return (
    <span
      className={`text-xs font-medium sm:text-sm ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {isPositive ? "+" : ""}
      {trend.toFixed(0)}%
    </span>
  );
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      icon: "Total",
      value: stats.total,
      label: "Gesamt",
      labelLong: "Gesamt Nuggets",
    },
    {
      icon: "Woche",
      value: stats.thisWeek,
      label: "Diese Woche",
      labelLong: "Diese Woche",
      trend: stats.weekTrend,
    },
    {
      icon: "Gewicht",
      value: formatWeight(stats.totalWeight),
      label: "Gewicht",
      labelLong: "Gesamtgewicht",
    },
    {
      icon: "Avg",
      value: stats.avgPerDay.toFixed(1),
      label: "Ø/Tag",
      labelLong: "Ø Nuggets/Tag",
    },
  ];

  return (
    <>
      {/* Mobile: Kompakte Ansicht */}
      <div className="mb-8 sm:hidden">
        <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200/50">
          <div className="grid grid-cols-2 gap-4">
            {statItems.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </div>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    {item.value}
                  </span>
                  {item.trend !== undefined && (
                    <TrendBadge trend={item.trend} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Grid-Ansicht */}
      <div className="mb-8 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {item.labelLong}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {item.value}
              </span>
              {item.trend !== undefined && <TrendBadge trend={item.trend} />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
