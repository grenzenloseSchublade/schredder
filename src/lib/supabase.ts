import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Demo-Modus wenn keine Credentials vorhanden
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

// Supabase Client nur erstellen wenn Credentials vorhanden
export const supabase: SupabaseClient<Database> | null = isDemoMode
  ? null
  : createClient<Database>(supabaseUrl, supabaseAnonKey);
