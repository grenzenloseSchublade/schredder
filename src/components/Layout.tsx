import { Outlet, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AddEntryModalProvider } from "@/contexts/AddEntryModalContext";
import FunFactsBar from "@/components/FunFactsBar";
import FloatingAddButton from "@/components/FloatingAddButton";
import AddEntryModal from "@/components/AddEntryModal";

export default function Layout() {
  const { user, signOut, loading, isDemoMode } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Erfolgreich abgemeldet");
  };

  return (
    <AddEntryModalProvider>
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
                      className="flex items-center gap-1 text-gray-700 transition hover:text-orange-600"
                      aria-label="Dashboard"
                    >
                      {/* Icon auf Mobile */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 sm:hidden"
                        aria-hidden
                      >
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                      </svg>
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 sm:px-4 sm:py-2"
                      aria-label="Abmelden"
                    >
                      {/* Icon auf Mobile */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 sm:hidden"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 0 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden sm:inline">Abmelden</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-1 text-gray-700 transition hover:text-orange-600"
                      aria-label="Anmelden"
                    >
                      {/* Icon auf Mobile */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 sm:hidden"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 0 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H1.5a.75.75 0 0 1 0-1.5h10.69l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden sm:inline">Anmelden</span>
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary text-sm"
                      aria-label="Registrieren"
                    >
                      <span className="hidden sm:inline">Registrieren</span>
                      <span className="sm:hidden">+</span>
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

        <FloatingAddButton />
        <AddEntryModal />
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
    </AddEntryModalProvider>
  );
}
