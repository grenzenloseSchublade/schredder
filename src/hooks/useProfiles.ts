import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Tables, UpdateTables } from "@/types/database.types";

// Query Keys für konsistente Cache-Invalidierung
export const profileKeys = {
  all: ["profiles"] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
};

/**
 * Hook zum Laden eines Profils
 */
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ""),
    queryFn: async (): Promise<Tables<"profiles"> | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Nicht gefunden
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Hook zum Aktualisieren eines Profils
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: UpdateTables<"profiles">;
    }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Cache aktualisieren
      queryClient.setQueryData(profileKeys.detail(data.id), data);
    },
  });
}
