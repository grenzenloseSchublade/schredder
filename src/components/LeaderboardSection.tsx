import { useLeaderboard } from "@/hooks/useLeaderboard";
import InitialsAvatar from "@/components/InitialsAvatar";

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
        <ul className="mt-8 space-y-3" role="list">
          {entries.map((entry) => (
            <li
              key={`${entry.rank}-${entry.nickname}`}
              className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200/80 transition hover:ring-orange-200"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700"
                aria-hidden
              >
                {entry.rank}.
              </span>
              <InitialsAvatar
                nickname={entry.nickname ?? "Anonym"}
                color={entry.avatar_color ?? "orange"}
                size="md"
              />
              <span className="min-w-0 flex-1 truncate font-medium text-gray-900">
                {entry.nickname ?? "Anonym"}
              </span>
              <span className="shrink-0 text-right text-lg font-semibold text-orange-600">
                {entry.total_nuggets} Nuggets
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
