import { useLeaderboard } from "@/hooks/useLeaderboard";
import InitialsAvatar from "@/components/InitialsAvatar";

function formatWeight(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(3)} kg`;
  return `${grams} g`;
}

const COLUMN_TOOLTIPS = {
  total: "Gesamtzahl der gegessenen Nuggets",
  avgPerDay: "Durchschnittliche Nuggets pro Tag seit erstem Eintrag",
  last14Days: "Nuggets der letzten 2 Wochen (bei Gleichstand entscheidend)",
  weight: "Geschätztes Gesamtgewicht bei 17 g pro Nugget (Gramm-genau)",
} as const;

function ColumnHeaderWithTooltip({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) {
  return (
    <span className="inline-flex items-center justify-end gap-1">
      <span>{label}</span>
      <abbr
        title={tooltip}
        className="cursor-help no-underline"
        aria-label={tooltip}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 shrink-0 text-gray-400"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-7-4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-3.25V4.75A.75.75 0 0 1 8 4Z"
            clipRule="evenodd"
          />
        </svg>
      </abbr>
    </span>
  );
}

export default function LeaderboardSection() {
  const { data: entries = [], isLoading, isError } = useLeaderboard();

  return (
    <section
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="leaderboard-heading"
    >
      <h2
        id="leaderboard-heading"
        className="text-center text-2xl font-bold text-gray-900 sm:text-3xl"
      >
        Top 10 Nugget Schredder
      </h2>
      <p className="mt-2 text-center text-gray-600">
        Hier werden anonym die fleißigsten Schredderer gelistet.
      </p>

      {isLoading && (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      )}

      {isError && (
        <p className="mt-8 text-center text-sm text-red-600">
          Ranking konnte nicht geladen werden.
        </p>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          Noch keine Shredder unterwegs. Sei der Erste!
        </p>
      )}

      {!isLoading && !isError && entries.length > 0 && (
        <>
          {/* Mobile: Card-Layout */}
          <div className="mt-8 space-y-3 md:hidden">
            {entries.map((entry) => (
              <article
                key={`${entry.rank}-${entry.nickname}`}
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 tabular-nums">
                    {entry.rank}
                  </span>
                  <InitialsAvatar
                    nickname={entry.nickname ?? "Anonym"}
                    color={entry.avatar_color ?? "orange"}
                    size="md"
                  />
                  <span className="min-w-0 flex-1 truncate font-medium text-gray-900">
                    {entry.nickname ?? "Anonym"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 px-4 py-3 text-sm">
                  <span title={COLUMN_TOOLTIPS.total}>
                    <span className="text-gray-500">Total:</span>{" "}
                    <span className="font-semibold tabular-nums text-orange-600">
                      {entry.total_nuggets}
                    </span>
                  </span>
                  <span title={COLUMN_TOOLTIPS.avgPerDay}>
                    <span className="text-gray-500">Ø/Tag:</span>{" "}
                    <span className="tabular-nums text-gray-700">
                      {Number(entry.avg_per_day ?? 0).toFixed(1)}
                    </span>
                  </span>
                  <span title={COLUMN_TOOLTIPS.last14Days}>
                    <span className="text-gray-500">14 Tage:</span>{" "}
                    <span className="tabular-nums text-gray-700">
                      {entry.nuggets_last_14_days ?? 0}
                    </span>
                  </span>
                  <span title={COLUMN_TOOLTIPS.weight}>
                    <span className="text-gray-500">Gewicht:</span>{" "}
                    <span className="tabular-nums text-gray-700">
                      {formatWeight(entry.total_weight_grams ?? 0)}
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop: Tabelle */}
          <div className="mt-8 hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80 md:block">
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[320px] table-fixed border-collapse"
                role="grid"
              >
                <thead>
                  <tr className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3" aria-hidden />
                    <th className="px-3 py-3 text-left">Name</th>
                    <th className="min-w-[5rem] px-3 py-3 text-right">
                      <ColumnHeaderWithTooltip
                        label="Total"
                        tooltip={COLUMN_TOOLTIPS.total}
                      />
                    </th>
                    <th className="hidden min-w-[5rem] px-3 py-3 text-right md:table-cell">
                      <ColumnHeaderWithTooltip
                        label="Ø/Tag"
                        tooltip={COLUMN_TOOLTIPS.avgPerDay}
                      />
                    </th>
                    <th className="hidden min-w-[5rem] px-3 py-3 text-right md:table-cell">
                      <ColumnHeaderWithTooltip
                        label="14 Tage"
                        tooltip={COLUMN_TOOLTIPS.last14Days}
                      />
                    </th>
                    <th className="hidden min-w-[5.5rem] px-3 py-3 text-right md:table-cell">
                      <ColumnHeaderWithTooltip
                        label="Gewicht"
                        tooltip={COLUMN_TOOLTIPS.weight}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={`${entry.rank}-${entry.nickname}`}
                      className="border-t border-gray-200/80 transition hover:bg-gray-50/50"
                    >
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 tabular-nums">
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <InitialsAvatar
                          nickname={entry.nickname ?? "Anonym"}
                          color={entry.avatar_color ?? "orange"}
                          size="md"
                        />
                      </td>
                      <td className="max-w-0 truncate px-3 py-3 font-medium text-gray-900">
                        {entry.nickname ?? "Anonym"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                        <span className="font-semibold text-orange-600">
                          {entry.total_nuggets}
                        </span>
                        <span className="ml-1 text-sm text-gray-500 md:hidden">
                          Nuggets
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-right text-gray-600 tabular-nums md:table-cell">
                        {Number(entry.avg_per_day ?? 0).toFixed(1)}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-right text-gray-600 tabular-nums md:table-cell">
                        {entry.nuggets_last_14_days ?? 0}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-right text-gray-600 tabular-nums md:table-cell">
                        {formatWeight(entry.total_weight_grams ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
