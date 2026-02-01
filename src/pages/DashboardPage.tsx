import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfiles";
import {
  useNuggetEntries,
  useCreateNuggetEntry,
  useDeleteNuggetEntry,
} from "@/hooks/useNuggetEntries";
import {
  useDashboardStats,
  useUniqueSauces,
  useFilteredEntries,
} from "@/hooks/useDashboardStats";
import InitialsAvatar from "@/components/InitialsAvatar";
import NuggetEntryForm from "@/components/NuggetEntryForm";
import NuggetEntryCard from "@/components/NuggetEntryCard";
import DeleteEntryConfirmDialog from "@/components/DeleteEntryConfirmDialog";
import StatsGrid from "@/components/StatsGrid";
import {
  NuggetEntryCardSkeleton,
  StatsGridSkeleton,
} from "@/components/Skeleton";
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

  // Stats und Filter über Custom Hooks
  const stats = useDashboardStats(entries);
  const uniqueSauces = useUniqueSauces(entries);
  const filteredEntries = useFilteredEntries(
    entries,
    sortBy,
    sortOrder,
    filterSauce
  );

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
    } catch (error) {
      console.error("Delete entry failed:", error);
      toast.error("Fehler beim Löschen", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
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
              className="min-h-[48px] w-full rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 px-6 py-4 text-base font-medium text-orange-700 transition hover:border-orange-400 hover:bg-orange-50 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-label="Neuen Nugget-Eintrag hinzufügen"
            >
              + Eintrag hinzufügen
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {entriesLoading ? <StatsGridSkeleton /> : <StatsGrid stats={stats} />}

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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <NuggetEntryCardSkeleton key={i} />
              ))}
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
