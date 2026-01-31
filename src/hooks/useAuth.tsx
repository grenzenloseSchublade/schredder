import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthError, Session } from "@supabase/supabase-js";
import { supabase, isDemoMode } from "@/lib/supabase";

// Demo-User für den Demo-Modus
const DEMO_USER: User = {
  id: "demo-user-id",
  email: "demo@example.com",
  app_metadata: {},
  user_metadata: { name: "Demo Benutzer" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Im Demo-Modus kein automatisches Login
      setLoading(false);
      return;
    }

    // Initiale Session abrufen (nur im Live-Modus)
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Auth State Changes abonnieren
    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo-Login: Akzeptiere demo@example.com oder jeden User
      if (email === "demo@example.com" || email.includes("@")) {
        setUser({ ...DEMO_USER, email });
        setSession({
          access_token: "demo-token",
          refresh_token: "demo-refresh",
          expires_in: 3600,
          token_type: "bearer",
          user: { ...DEMO_USER, email },
        });
        return { error: null };
      }
      return {
        error: {
          message: "Ungültige E-Mail-Adresse",
          name: "AuthError",
          status: 400,
        } as AuthError,
      };
    }

    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo-Registrierung: Simuliere Erfolg
      return { error: null };
    }

    const { error } = await supabase!.auth.signUp({
      email,
      password,
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setUser(null);
      setSession(null);
      return;
    }

    await supabase!.auth.signOut();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden");
  }
  return context;
}
