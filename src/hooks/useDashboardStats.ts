import { useMemo } from "react";
import type { Tables } from "@/types/database.types";

type NuggetEntry = Tables<"nugget_entries">;

export interface DashboardStats {
  total: number;
  thisWeek: number;
  topSauce: string;
  count: number;
  totalWeight: number;
  avgPerDay: number;
  weekTrend: number | null;
}

export function useDashboardStats(entries: NuggetEntry[]): DashboardStats {
  return useMemo(() => {
    const total = entries.reduce((sum, e) => sum + e.count, 0);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = entries
      .filter((e) => new Date(e.created_at) >= weekAgo)
      .reduce((sum, e) => sum + e.count, 0);

    // Top Sauce berechnen
    const sauceCounts: Record<string, number> = {};
    for (const e of entries) {
      const sauces = e.sauces ?? [];
      for (const s of sauces) {
        if (s) sauceCounts[s] = (sauceCounts[s] ?? 0) + 1;
      }
    }
    const topSauce =
      Object.entries(sauceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

    // Gesamtgewicht (17g pro Nugget)
    const totalWeight = total * 17;

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
}

export function useUniqueSauces(entries: NuggetEntry[]): string[] {
  return useMemo(() => {
    const sauceSet = new Set<string>();
    for (const e of entries) {
      for (const s of e.sauces ?? []) {
        if (s) sauceSet.add(s);
      }
    }
    return Array.from(sauceSet).sort();
  }, [entries]);
}

export function useFilteredEntries(
  entries: NuggetEntry[],
  sortBy: "date" | "count",
  sortOrder: "asc" | "desc",
  filterSauce: string | null
): NuggetEntry[] {
  return useMemo(() => {
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
}
