import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isDemoMode } from "@/lib/supabase";
import type { Tables, TablesInsert } from "@/types/database.types";

export const nuggetKeys = {
  all: ["nuggets"] as const,
  list: (userId: string) => [...nuggetKeys.all, "list", userId] as const,
};

// Demo-Einträge für den Demo-Modus
function createDemoEntries(userId: string): Tables<"nugget_entries">[] {
  const now = new Date();
  return [
    {
      id: "demo-1",
      user_id: userId,
      count: 20,
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      sauce: "BBQ",
      location: "McDonald's",
      mood: "😋",
      notes: null,
    },
    {
      id: "demo-2",
      user_id: userId,
      count: 10,
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      sauce: "Curry",
      location: "Zuhause",
      mood: "🤤",
      notes: null,
    },
  ];
}

export function useNuggetEntries(userId: string | undefined) {
  return useQuery({
    queryKey: nuggetKeys.list(userId ?? ""),
    queryFn: async (): Promise<Tables<"nugget_entries">[]> => {
      if (!userId) return [];
      if (isDemoMode) return createDemoEntries(userId);

      const { data, error } = await supabase
        .from("nugget_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });
}

export function useCreateNuggetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      entry: TablesInsert<"nugget_entries">
    ): Promise<Tables<"nugget_entries">> => {
      if (isDemoMode) {
        return {
          id: crypto.randomUUID(),
          user_id: entry.user_id,
          count: entry.count,
          created_at: new Date().toISOString(),
          sauce: entry.sauce ?? null,
          location: entry.location ?? null,
          mood: entry.mood ?? null,
          notes: entry.notes ?? null,
        };
      }

      const { data, error } = await supabase
        .from("nugget_entries")
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: nuggetKeys.list(variables.user_id),
      });
    },
  });
}

export function useDeleteNuggetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      userId: string;
    }): Promise<void> => {
      const { id } = params;
      if (isDemoMode) return;

      const { error } = await supabase
        .from("nugget_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: nuggetKeys.list(userId) });
    },
  });
}
