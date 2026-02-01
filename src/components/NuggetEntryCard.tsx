import { memo } from "react";
import type { Tables } from "@/types/database.types";

interface NuggetEntryCardProps {
  entry: Tables<"nugget_entries">;
  onDeleteClick?: (entry: Tables<"nugget_entries">) => void;
  canDelete?: boolean;
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Gerade eben";
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const NuggetEntryCard = memo(function NuggetEntryCard({
  entry,
  onDeleteClick,
  canDelete = false,
}: NuggetEntryCardProps) {
  return (
    <div className="group rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-200/60 transition hover:ring-orange-200/60">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-orange-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-orange-600"
              aria-hidden
            >
              <path d="M4 4h16v2H4V4Zm0 4h16v2H4V8Zm0 4h12v2H4v-2Zm0 4h8v2H4v-2Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {entry.count}
              </span>
              <span className="text-gray-500">Nuggets</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {formatRelativeTime(entry.created_at)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(entry.sauces ?? []).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
                >
                  {s}
                </span>
              ))}
              {entry.location && (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {entry.location}
                </span>
              )}
              {entry.mood && (
                <span
                  className="text-lg"
                  aria-label={`Stimmung: ${entry.mood}`}
                >
                  {entry.mood}
                </span>
              )}
            </div>
            {entry.notes && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {entry.notes}
              </p>
            )}
          </div>
        </div>
        {canDelete && onDeleteClick && (
          <button
            type="button"
            onClick={() => onDeleteClick(entry)}
            className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Eintrag löschen"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default NuggetEntryCard;
