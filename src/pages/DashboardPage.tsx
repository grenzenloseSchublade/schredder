import { useAuth } from "@/hooks/useAuth";

const stats = [
  {
    name: "Projekte",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: "📁",
  },
  {
    name: "Aufgaben",
    value: "48",
    change: "-5",
    changeType: "negative" as const,
    icon: "✅",
  },
  {
    name: "Team-Mitglieder",
    value: "8",
    change: "+1",
    changeType: "positive" as const,
    icon: "👥",
  },
  {
    name: "Abgeschlossen",
    value: "89%",
    change: "+12%",
    changeType: "positive" as const,
    icon: "📈",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Max Mustermann",
    action: "hat ein neues Projekt erstellt",
    project: "Website Redesign",
    time: "vor 5 Minuten",
    avatar: "M",
  },
  {
    id: 2,
    user: "Anna Schmidt",
    action: "hat eine Aufgabe abgeschlossen",
    project: "Mobile App",
    time: "vor 23 Minuten",
    avatar: "A",
  },
  {
    id: 3,
    user: "Tom Weber",
    action: "hat einen Kommentar hinzugefügt",
    project: "API Integration",
    time: "vor 1 Stunde",
    avatar: "T",
  },
  {
    id: 4,
    user: "Lisa Müller",
    action: "hat das Team erweitert",
    project: "Marketing Kampagne",
    time: "vor 2 Stunden",
    avatar: "L",
  },
];

const projects = [
  { name: "Website Redesign", progress: 75, status: "In Arbeit", color: "blue" },
  { name: "Mobile App", progress: 45, status: "In Arbeit", color: "indigo" },
  { name: "API Integration", progress: 90, status: "Review", color: "green" },
  { name: "Marketing Kampagne", progress: 20, status: "Geplant", color: "orange" },
];

export default function DashboardPage() {
  const { user, isDemoMode } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Willkommen zurück,{" "}
            <span className="font-medium text-blue-600">
              {user?.email || "Benutzer"}
            </span>
            {isDemoMode && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                Demo-Daten
              </span>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Projects */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Aktive Projekte
            </h2>
            <div className="mt-6 space-y-6">
              {projects.map((project) => (
                <div key={project.name}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.status}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {project.progress}%
                    </div>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        project.color === "blue"
                          ? "bg-blue-500"
                          : project.color === "indigo"
                            ? "bg-indigo-500"
                            : project.color === "green"
                              ? "bg-green-500"
                              : "bg-orange-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Letzte Aktivitäten
            </h2>
            <div className="mt-6 flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 && (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                          {activity.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}
                          </div>
                          <div className="mt-0.5 text-sm text-gray-500">
                            {activity.project} • {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">
                Bereit für dein nächstes Projekt?
              </h3>
              <p className="mt-1 text-blue-100">
                Erstelle ein neues Projekt und lade dein Team ein.
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 font-semibold text-blue-700 shadow transition hover:bg-blue-50">
              Neues Projekt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
