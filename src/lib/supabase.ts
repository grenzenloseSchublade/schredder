import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Demo-Modus wenn keine Credentials vorhanden
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

// Supabase Client - im Demo-Modus mit Dummy-URL (wird nie aufgerufen)
// Wir erstellen immer einen Client für korrekte TypeScript-Typisierung
export const supabase = createClient<Database>(
  supabaseUrl || "https://demo.supabase.co",
  supabaseAnonKey || "demo-key"
);
