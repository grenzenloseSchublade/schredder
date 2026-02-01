import { useState, useEffect, useCallback } from "react";

const FUN_FACTS = [
  "Chicken Nuggets wurden 1963 von einem US-Forscher erfunden.",
  "In Deutschland werden jährlich mehrere tausend Tonnen Nuggets verzehrt.",
  "Die durchschnittliche Nugget-Packung hat 6, 9 oder 20 Stück.",
  "McDonald’s verkauft weltweit Milliarden Nuggets pro Jahr.",
  "Nuggets bestehen meist aus Hähnchenbrust oder -hack.",
  "Die beliebteste Sauce zu Nuggets ist oft BBQ oder Sweet & Sour.",
  "Ein Nugget wiegt ungefähr 15–20 Gramm.",
  "Nuggets wurden ursprünglich als preiswerte Alternative zu ganzen Hühnchen entwickelt.",
  "Manche Länder haben Nuggets in Form von Dinosauriern oder Herzen.",
  "Die goldene Farbe kommt von der Panade und dem Frittieren.",
];

const ROTATION_DELAY_MS = 7000;

// Initialen Wert lazy ermitteln (nur einmal beim ersten Render, nicht im Effect)
function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FunFactsBar() {
  const [index, setIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotion
  );

  // Effect nur für Subscription bei späteren Änderungen (kein synchroner setState mehr)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nextIndex = useCallback(() => {
    setIndex((i) => (i + 1) % FUN_FACTS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextIndex, ROTATION_DELAY_MS);
    return () => clearInterval(interval);
  }, [nextIndex]);

  return (
    <div
      className="block fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-gray-50/95 px-4 py-3 text-center text-sm text-gray-600 backdrop-blur-sm"
      role="region"
      aria-live="polite"
      aria-label="Wechselnde Fun Facts"
    >
      <div className="mx-auto max-w-3xl overflow-hidden">
        <p
          key={index}
          className={
            prefersReducedMotion ? "" : "animate-fact-slide inline-block w-full"
          }
        >
          <span className="mr-2 text-amber-500" aria-hidden>
            💡
          </span>
          {FUN_FACTS[index]}
        </p>
      </div>
    </div>
  );
}
