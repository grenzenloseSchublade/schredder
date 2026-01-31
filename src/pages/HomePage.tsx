import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: "⚡",
    title: "React 19",
    description:
      "Neueste React-Version mit Server Components und verbesserter Performance.",
  },
  {
    icon: "🎨",
    title: "Tailwind CSS 4",
    description:
      "CSS-first Konfiguration mit blitzschnellen Build-Zeiten und modernem Design.",
  },
  {
    icon: "🔒",
    title: "TypeScript",
    description:
      "Vollständige Type-Safety für fehlerfreien und wartbaren Code.",
  },
  {
    icon: "🗄️",
    title: "Supabase",
    description:
      "Open-Source Backend mit PostgreSQL, Authentication und Realtime.",
  },
  {
    icon: "🚀",
    title: "Vite 7",
    description:
      "Blitzschneller Dev-Server mit Hot Module Replacement und optimierten Builds.",
  },
  {
    icon: "🔄",
    title: "TanStack Query",
    description:
      "Intelligentes Caching, automatisches Refetching und optimistische Updates.",
  },
];

const stats = [
  { value: "< 100ms", label: "Build Zeit" },
  { value: "100%", label: "Type Coverage" },
  { value: "A+", label: "Lighthouse Score" },
  { value: "0", label: "Dependencies mit Vulnerabilities" },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Willkommen bei
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Schredder
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
              Eine moderne Full-Stack Anwendung mit React, Vite, TypeScript und
              Supabase. Production-ready mit CI/CD und automatischem Deployment.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
                >
                  Zum Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
                  >
                    Jetzt starten
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Anmelden
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Moderner Tech Stack
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Alles was du für eine moderne Webanwendung brauchst - von der
              Entwicklung bis zum Deployment.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-lg hover:ring-blue-200"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bereit loszulegen?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Erstelle dein kostenloses Konto und entdecke alle Features dieser
              modernen Webanwendung.
            </p>
            <div className="mt-8">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                {user ? "Zum Dashboard" : "Kostenlos registrieren"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
