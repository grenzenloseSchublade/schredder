import { useState, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const STORAGE_KEY = "schredder_welcome_dismissed";

export default function WelcomeBanner() {
  // Lazy initializer: localStorage wird nur beim ersten Render geprüft
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const containerRef = useFocusTrap(visible, handleDismiss, {
    initialFocusRef: buttonRef,
  });

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-banner-title"
    >
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2
          id="welcome-banner-title"
          className="text-xl font-semibold text-gray-900"
        >
          Willkommen bei Schredder
        </h2>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>
            Schredder ist eine Anwendung zum Tracken deines Chicken Nuggets
            Konsums. Deine Daten werden sicher und datenschutzkonform
            gespeichert.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Anonym nutzbar</strong> – Wir speichern nur einen frei
                wählbaren Spitznamen, keine echten Namen.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>E-Mail nur für Login</strong> – Deine E-Mail-Adresse
                wird niemals öffentlich angezeigt.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Sichere Speicherung</strong> – Alle Daten werden
                verschlüsselt auf EU-Servern gespeichert.
              </span>
            </li>
          </ul>
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleDismiss}
          className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition hover:bg-orange-600"
          aria-label="Willkommens-Banner schließen"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
