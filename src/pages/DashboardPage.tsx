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
import type { NuggetEntryFormData } from "@/lib/validations";

export default function DashboardPage() {
  const { user, isDemoMode } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: entries = [], isLoading: entriesLoading } = useNuggetEntries(
    user?.id
  );
  const createEntry = useCreateNuggetEntry();
  const deleteEntry = useDeleteNuggetEntry();

  const [showForm, setShowForm] = useState(false);

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
      if (e.sauce) {
        sauceCounts[e.sauce] = (sauceCounts[e.sauce] ?? 0) + 1;
      }
    }
    const topSauce =
      Object.entries(sauceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    return {
      total,
      thisWeek,
      topSauce,
      count: entries.length,
    };
  }, [entries]);

  const handleCreateEntry = async (
    data: NuggetEntryFormData & { created_at: string }
  ) => {
    if (!user?.id) return;
    try {
      await createEntry.mutateAsync({
        user_id: user.id,
        count: data.count,
        sauce: data.sauce || null,
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
                🍗 Deine Chicken Nuggets Vernichtungs-Stats
              </p>
              {isDemoMode && (
                <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Demo-Daten
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">🍗</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Gesamt Nuggets</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">📅</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.thisWeek}
            </div>
            <div className="text-sm text-gray-600">Diese Woche</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">🥫</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.topSauce}
            </div>
            <div className="text-sm text-gray-600">Lieblings-Sauce</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200/50 transition hover:shadow-xl">
            <span className="text-3xl">📝</span>
            <div className="mt-3 text-2xl font-bold text-gray-900">
              {stats.count}
            </div>
            <div className="text-sm text-gray-600">Einträge</div>
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
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-6 text-lg font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
            >
              🍗 Neuer Eintrag
            </button>
          )}
        </div>

        {/* Einträge-Liste */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Deine Einträge
          </h2>
          {entriesLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg ring-1 ring-gray-200/50">
              <p className="text-5xl">🍗</p>
              <p className="mt-4 text-gray-600">
                Noch keine Einträge. Klicke auf „Neuer Eintrag“ und starte!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <NuggetEntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                  canDelete
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
