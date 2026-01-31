import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isDemoMode } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

// Query Keys für konsistente Cache-Invalidierung
export const profileKeys = {
  all: ["profiles"] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
};

// Demo-Profil für den Demo-Modus
const createDemoProfile = (id: string, email?: string): Tables<"profiles"> => ({
  id,
  email: email ?? "demo@example.com",
  full_name: "Demo Benutzer",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

/**
 * Hook zum Laden eines Profils
 */
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ""),
    queryFn: async (): Promise<Tables<"profiles"> | null> => {
      if (!userId) return null;

      // Im Demo-Modus Demo-Profil zurückgeben
      if (isDemoMode) {
        return createDemoProfile(userId);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Nicht gefunden
        throw error;
      }

      return data as Tables<"profiles">;
    },
    enabled: !!userId,
  });
}

interface UpdateProfileParams {
  userId: string;
  updates: {
    email?: string;
    full_name?: string | null;
    avatar_url?: string | null;
  };
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
    }: UpdateProfileParams): Promise<Tables<"profiles">> => {
      // Im Demo-Modus simulieren
      if (isDemoMode) {
        const profile = createDemoProfile(userId);
        return {
          ...profile,
          email: updates.email ?? profile.email,
          full_name: updates.full_name ?? profile.full_name,
          avatar_url: updates.avatar_url ?? profile.avatar_url,
          updated_at: new Date().toISOString(),
        };
      }

      // Type assertion für Supabase-Kompatibilität
      const updateData = {
        email: updates.email,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData as never)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"profiles">;
    },
    onSuccess: (data) => {
      // Cache aktualisieren
      queryClient.setQueryData(profileKeys.detail(data.id), data);
    },
  });
}
