import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/30">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Über Schredder
          </h1>
          <p className="mt-4 text-lg text-orange-100">
            Die Geschichte hinter der Nugget-Tracking-App
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Motivation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Motivation</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              In Zeiten des globalen Veganismus gibt es eine kleine Gruppe
              Aufständiger. Sie bäumen sich standhaft gegen das System. Während
              die Welt zu Tofu und Quinoa greift, halten sie die Fahne des
              knusprig panierten Widerstands hoch.
            </p>
            <p>
              <strong>Schredder3000</strong> – so lautete der interne Codename –
              entstand aus einer simplen Frage: Wie viele Nuggets kann ein
              Mensch eigentlich vernichten? Und vor allem: Wer zählt mit?
            </p>
            <p>
              Was als absurde Idee unter Freunden begann, wurde zur Mission.
              Denn jeder Nugget verdient es, dokumentiert zu werden. Jede Sauce
              hat ihre Geschichte. Und jeder Schredderer verdient seinen Platz
              in der Rangliste.
            </p>
          </div>
        </section>

        {/* Was ist Schredder? */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Was ist Schredder?
          </h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              Schredder ist eine Web-App zum Tracken deines
              Chicken-Nugget-Konsums. Egal ob McDonald's, Burger King oder
              selbstgemacht – halte fest, wie viele Nuggets du vernichtest,
              welche Saucen du bevorzugst und wie sich dein Konsum über die Zeit
              entwickelt.
            </p>
            <p>
              <strong>Die wichtigsten Funktionen:</strong>
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Einträge erfassen:</strong> Dokumentiere jeden
                Nugget-Konsum mit Anzahl, Saucen, Ort, Stimmung und optionalen
                Notizen.
              </li>
              <li>
                <strong>Persönliche Statistiken:</strong> Sieh auf einen Blick
                deine Gesamtanzahl, den Wochenverlauf, das geschätzte
                Gesamtgewicht und deinen Durchschnittsverbrauch pro Tag.
              </li>
              <li>
                <strong>Leaderboard:</strong> Vergleiche dich anonym mit anderen
                Nutzern und kämpfe um einen Platz in den Top 10 der fleißigsten
                Schredderer.
              </li>
              <li>
                <strong>Fun Facts:</strong> Erfahre witzige und überraschende
                Fakten rund um Nuggets, Fast Food und Hühner.
              </li>
            </ul>
            <p>
              Ob als persönliches Tagebuch, Wettbewerb mit Freunden oder einfach
              aus Neugier – Schredder macht das Tracken unterhaltsam und
              unkompliziert.
            </p>
          </div>
        </section>

        {/* Datenschutz */}
        <section className="mb-12 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200/80">
          <h2 className="text-2xl font-bold text-gray-900">
            Datenschutz und Anonymität
          </h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              Schredder wurde mit Datenschutz als oberste Priorität entwickelt.
              Wir nehmen den Schutz deiner Daten ernst.
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Anonyme Nutzung:</strong> Du wählst einen frei wählbaren
                Spitznamen. Echte Namen sind nicht erforderlich.
              </li>
              <li>
                <strong>E-Mail nur für Login:</strong> Deine E-Mail-Adresse wird
                ausschließlich zur Authentifizierung verwendet und niemals
                öffentlich angezeigt.
              </li>
              <li>
                <strong>Sichere Speicherung:</strong> Alle Daten werden
                SSL-verschlüsselt auf EU-Servern gespeichert.
              </li>
              <li>
                <strong>Keine Weitergabe:</strong> Deine Daten werden nicht an
                Dritte verkauft oder weitergegeben.
              </li>
              <li>
                <strong>Recht auf Löschung:</strong> Du kannst jederzeit die
                vollständige Löschung deiner Daten beantragen. Erstelle dazu
                einfach ein Issue auf GitHub oder kontaktiere uns direkt.
              </li>
            </ul>
          </div>
        </section>

        {/* Kontakt */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Kontakt</h2>
          <div className="mt-4 space-y-4 text-gray-600">
            <p>
              Fragen, Feedback, Fehler gefunden oder Verbesserungsvorschläge?
              Erstelle einfach ein Issue auf GitHub – wir schauen regelmäßig
              vorbei.
            </p>
            <p>
              {/* GitHub Issues Link - URL anpassen */}
              <a
                href="https://github.com/grenzenloseschublade/schredder/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Issue erstellen
              </a>
            </p>
          </div>
        </section>

        {/* Zurück-Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-600 transition hover:text-orange-700 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
