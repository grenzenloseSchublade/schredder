import { Outlet, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import FunFactsBar from "@/components/FunFactsBar";

export default function Layout() {
  const { user, signOut, loading, isDemoMode } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Erfolgreich abgemeldet");
  };

  return (
    <div className="min-h-screen flex flex-col pb-14">
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-center text-sm font-medium text-white">
          <span className="mr-2">⚡</span>
          Demo-Modus aktiv - Keine Datenbank verbunden. Füge{" "}
          <code className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs">
            .env.local
          </code>{" "}
          mit Supabase-Credentials hinzu für den Live-Modus.
        </div>
      )}

      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xl font-bold text-orange-600">
                Schredder
              </Link>
              {isDemoMode && (
                <span className="hidden sm:inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Demo
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
              ) : user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-orange-600 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary text-sm"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 transition"
                  >
                    Anmelden
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <FunFactsBar />

      <footer className="bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="text-sm text-gray-500">
            {new Date().getFullYear()} Schredder. Alle Rechte vorbehalten.
          </div>
          <div className="mt-2 text-xs text-gray-400">
            React 19 • Vite 7 • TypeScript • Tailwind CSS 4 • Supabase
          </div>
        </div>
      </footer>
    </div>
  );
}
