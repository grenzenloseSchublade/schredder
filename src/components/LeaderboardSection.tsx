import { useLeaderboard } from "@/hooks/useLeaderboard";
import InitialsAvatar from "@/components/InitialsAvatar";

function formatWeight(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg`;
  return `${grams} g`;
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
        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse" role="grid">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="w-10 py-3 pl-4 pr-2 text-center">#</th>
                  <th className="w-12 py-3 pr-2" aria-hidden />
                  <th className="py-3 pr-4">Name</th>
                  <th className="w-20 py-3 pr-4 text-right">Total</th>
                  <th className="hidden w-20 py-3 text-right md:table-cell">
                    Ø/Tag
                  </th>
                  <th className="hidden w-20 py-3 text-right md:table-cell">
                    14 Tage
                  </th>
                  <th className="hidden w-24 py-3 pr-4 text-right md:table-cell">
                    Gewicht
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={`${entry.rank}-${entry.nickname}`}
                    className="border-t border-gray-200/80 transition hover:bg-gray-50/50"
                  >
                    <td className="py-3 pl-4 pr-2 text-center">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                        {entry.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      <InitialsAvatar
                        nickname={entry.nickname ?? "Anonym"}
                        color={entry.avatar_color ?? "orange"}
                        size="md"
                      />
                    </td>
                    <td className="max-w-[120px] truncate py-3 pr-4 font-medium text-gray-900 sm:max-w-none">
                      {entry.nickname ?? "Anonym"}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="font-semibold text-orange-600">
                        {entry.total_nuggets}
                      </span>
                      <span className="ml-1 text-sm text-gray-500 md:hidden">
                        Nuggets
                      </span>
                    </td>
                    <td className="hidden py-3 pr-4 text-right text-gray-600 md:table-cell">
                      {Number(entry.avg_per_day ?? 0).toFixed(1)}
                    </td>
                    <td className="hidden py-3 pr-4 text-right text-gray-600 md:table-cell">
                      {entry.nuggets_last_14_days ?? 0}
                    </td>
                    <td className="hidden py-3 pr-4 text-right text-gray-600 md:table-cell">
                      {formatWeight(entry.total_weight_grams ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
