import { useQuery } from "@tanstack/react-query";
import { supabase, isDemoMode } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
};

type LeaderboardRow = Tables<"nugget_leaderboard">;

const DEMO_LEADERBOARD: LeaderboardRow[] = [
  {
    rank: 1,
    nickname: "Nugget-King",
    avatar_color: "orange",
    total_nuggets: 127,
    avg_per_day: 12.7,
    nuggets_last_14_days: 45,
  },
  {
    rank: 2,
    nickname: "Sauce-Boss",
    avatar_color: "blue",
    total_nuggets: 89,
    avg_per_day: 8.1,
    nuggets_last_14_days: 22,
  },
];

export function useLeaderboard() {
  return useQuery({
    queryKey: leaderboardKeys.all,
    queryFn: async (): Promise<LeaderboardRow[]> => {
      if (isDemoMode) return DEMO_LEADERBOARD;

      const { data, error } = await supabase
        .from("nugget_leaderboard")
        .select(
          "rank, nickname, avatar_color, total_nuggets, avg_per_day, nuggets_last_14_days"
        )
        .order("rank", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60 * 1000,
  });
}
