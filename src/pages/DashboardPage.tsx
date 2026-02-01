import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfiles";
import {
  useNuggetEntries,
  useCreateNuggetEntry,
  useDeleteNuggetEntry,
} from "@/hooks/useNuggetEntries";
import InitialsAvatar from "@/components/InitialsAvatar";
import NuggetEntryForm from "@/components/NuggetEntryForm";
import NuggetEntryCard from "@/components/NuggetEntryCard";
import DeleteEntryConfirmDialog from "@/components/DeleteEntryConfirmDialog";
import type { NuggetEntryFormData } from "@/lib/validations";
import type { Tables } from "@/types/database.types";

export default function DashboardPage() {
  const { user, isDemoMode } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: entries = [], isLoading: entriesLoading } = useNuggetEntries(
    user?.id
  );
  const createEntry = useCreateNuggetEntry();
  const deleteEntry = useDeleteNuggetEntry();

  const [showForm, setShowForm] = useState(false);
  const [entryToDelete, setEntryToDelete] =
    useState<Tables<"nugget_entries"> | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "count">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterSauce, setFilterSauce] = useState<string | null>(null);

  const displayName =
    profile?.nickname ||
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Nugget-Lover";
  const avatarColor = profile?.avatar_color ?? "orange";

  const stats = useMemo(() => {
    const total = entries.reduce((sum, e) => sum + e.count, 0);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = entries
      .filter((e) => new Date(e.created_at) >= weekAgo)
      .reduce((sum, e) => sum + e.count, 0);
    const sauceCounts: Record<string, number> = {};
    for (const e of entries) {
      const sauces = e.sauces ?? [];
      for (const s of sauces) {
        if (s) sauceCounts[s] = (sauceCounts[s] ?? 0) + 1;
      }
    }
    const topSauce =
      Object.entries(sauceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    // Neue Stats
    const totalWeight = total * 17; // Gramm (17g pro Nugget)

    // Durchschnitt pro Tag seit erstem Eintrag
    const sortedByDate = [...entries].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const firstEntry = sortedByDate.length
      ? new Date(sortedByDate[0].created_at)
      : null;
    const daysSinceFirst = firstEntry
      ? Math.max(
          1,
          Math.floor((now.getTime() - firstEntry.getTime()) / 86400000)
        )
      : 1;
    const avgPerDay = total / daysSinceFirst;

    // Trend: Vergleich diese Woche vs. letzte Woche
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeek = entries
      .filter(
        (e) =>
          new Date(e.created_at) >= twoWeeksAgo &&
          new Date(e.created_at) < weekAgo
      )
      .reduce((sum, e) => sum + e.count, 0);
    const weekTrend =
      lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : null;

    return {
      total,
      thisWeek,
      topSauce,
      count: entries.length,
      totalWeight,
      avgPerDay,
      weekTrend,
    };
  }, [entries]);

  // Alle einzigartigen Saucen für Filter
  const uniqueSauces = useMemo(() => {
    const sauceSet = new Set<string>();
    for (const e of entries) {
      for (const s of e.sauces ?? []) {
        if (s) sauceSet.add(s);
      }
    }
    return Array.from(sauceSet).sort();
  }, [entries]);

  // Gefilterte und sortierte Einträge
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Filter nach Sauce
    if (filterSauce) {
      result = result.filter((e) => (e.sauces ?? []).includes(filterSauce));
    }

    // Sortierung
    result.sort((a, b) => {
      const valA =
        sortBy === "date" ? new Date(a.created_at).getTime() : a.count;
      const valB =
        sortBy === "date" ? new Date(b.created_at).getTime() : b.count;
      return sortOrder === "desc" ? valB - valA : valA - valB;
    });

    return result;
  }, [entries, sortBy, sortOrder, filterSauce]);

  const handleCreateEntry = async (
    data: NuggetEntryFormData & { created_at: string }
  ) => {
    if (!user?.id) return;
    try {
      await createEntry.mutateAsync({
        user_id: user.id,
        count: data.count,
        sauces: data.sauces ?? [],
        location: data.location || null,
        mood: data.mood || null,
        notes: data.notes || null,
        created_at: data.created_at,
      });
      toast.success("Eintrag gespeichert!", {
        description: `${data.count} Nuggets wurden hinzugefügt.`,
      });
      setShowForm(false);
    } catch (err) {
      toast.error("Fehler beim Speichern", {
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user?.id) return;
    try {
      await deleteEntry.mutateAsync({ id, userId: user.id });
      toast.success("Eintrag gelöscht");
      setEntryToDelete(null);
    } catch {
      toast.error("Fehler beim Löschen");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <InitialsAvatar
              nickname={displayName}
              color={avatarColor}
              size="xl"
              className="ring-4 ring-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Willkommen, {displayName}!
              </h1>
              <p className="mt-1 text-gray-600">
                Deine Chicken Nuggets Vernichtungs-Stats
              </p>
              {isDemoMode && (
                <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Demo-Daten
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Neuer Eintrag */}
        <div className="mb-8">
          {showForm ? (
            <NuggetEntryForm
              onSubmit={handleCreateEntry}
              isSubmitting={createEntry.isPending}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 px-6 py-4 text-base font-medium text-orange-700 transition hover:border-orange-400 hover:bg-orange-50"
            >
              + Eintrag hinzufügen
            </button>
          )}
        </div>

        {/* Stats: Mobile kompakt (< sm) */}
        <div className="mb-8 sm:hidden">
          <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <span className="text-2xl">🍗</span>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Gesamt</div>
              </div>
              <div className="text-center">
                <span className="text-2xl">📅</span>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    {stats.thisWeek}
                  </span>
                  {stats.weekTrend !== null && (
                    <span
                      className={`text-xs font-medium ${
                        stats.weekTrend >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stats.weekTrend >= 0 ? "↑" : "↓"}
                      {Math.abs(stats.weekTrend).toFixed(0)}%
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600">Diese Woche</div>
              </div>
              <div className="text-center">
                <span className="text-2xl">⚖️</span>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {stats.totalWeight >= 1000
                    ? `${(stats.totalWeight / 1000).toFixed(1)} kg`
                    : `${stats.totalWeight} g`}
                </div>
                <div className="text-xs text-gray-600">Gewicht</div>
              </div>
              <div className="text-center">
                <span className="text-2xl">📊</span>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {stats.avgPerDay.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Ø/Tag</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats: Desktop Grid (>= sm) */}
        <div className="mb-8 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">🍗</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Gesamt Nuggets</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">📅</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats.thisWeek}
              </span>
              {stats.weekTrend !== null && (
                <span
                  className={`text-sm font-medium ${
                    stats.weekTrend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.weekTrend >= 0 ? "↑" : "↓"}
                  {Math.abs(stats.weekTrend).toFixed(0)}%
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">Diese Woche</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">⚖️</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.totalWeight >= 1000
                ? `${(stats.totalWeight / 1000).toFixed(1)} kg`
                : `${stats.totalWeight} g`}
            </div>
            <div className="text-sm text-gray-600">Gesamtgewicht</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">📊</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.avgPerDay.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Ø Nuggets/Tag</div>
          </div>
        </div>

        {/* Einträge-Liste */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">Deine Einträge</h2>
            {entries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "count")
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="date">Nach Datum</option>
                  <option value="count">Nach Anzahl</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title={sortOrder === "desc" ? "Absteigend" : "Aufsteigend"}
                >
                  {sortOrder === "desc" ? "↓" : "↑"}
                </button>
                {uniqueSauces.length > 0 && (
                  <select
                    value={filterSauce ?? ""}
                    onChange={(e) => setFilterSauce(e.target.value || null)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    <option value="">Alle Saucen</option>
                    {uniqueSauces.map((sauce) => (
                      <option key={sauce} value={sauce}>
                        {sauce}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
          {entriesLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-md ring-1 ring-gray-200/60">
              <p className="text-gray-500">
                Noch keine Einträge. Klicke auf „Eintrag hinzufügen“ und starte.
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-md ring-1 ring-gray-200/60">
              <p className="text-gray-500">
                Keine Einträge mit diesem Filter gefunden.
              </p>
              <button
                type="button"
                onClick={() => setFilterSauce(null)}
                className="mt-2 text-sm text-orange-600 hover:underline"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <NuggetEntryCard
                  key={entry.id}
                  entry={entry}
                  onDeleteClick={(e) => setEntryToDelete(e)}
                  canDelete
                />
              ))}
            </div>
          )}
        </div>

        <DeleteEntryConfirmDialog
          key={entryToDelete?.id ?? "closed"}
          entry={entryToDelete}
          onConfirm={handleDeleteEntry}
          onCancel={() => setEntryToDelete(null)}
          isDeleting={deleteEntry.isPending}
        />
      </div>
    </div>
  );
}
