import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAddEntryModal } from "@/contexts/AddEntryModalContext";
import LeaderboardSection from "@/components/LeaderboardSection";

export default function HomePage() {
  const { user } = useAuth();
  const { openModal } = useAddEntryModal();

  return (
    <div className="flex flex-col">
      <section className="relative w-full min-h-[calc(100vh-12rem)] flex items-center bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <p className="text-6xl">🍗</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Willkommen bei
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
                Schredder
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-orange-100 sm:text-xl">
              Tracke deine Chicken Nuggets Vernichtung. Wie viele schaffst du?
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-lg font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50 hover:shadow-xl"
                  >
                    Zum Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Neuer Eintrag
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-lg font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50 hover:shadow-xl"
                  >
                    Jetzt starten
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Anmelden
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <LeaderboardSection />
    </div>
  );
}
