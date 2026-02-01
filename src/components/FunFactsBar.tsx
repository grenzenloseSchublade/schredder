import { useState, useEffect, useCallback } from "react";
import { FUN_FACTS } from "@/data/funFacts";

const ROTATION_DELAY_MS = 7000;

// Initialen Wert lazy ermitteln (nur einmal beim ersten Render, nicht im Effect)
function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FunFactsBar() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * FUN_FACTS.length)
  );
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
            Info:
          </span>
          {FUN_FACTS[index]}
        </p>
      </div>
    </div>
  );
}
