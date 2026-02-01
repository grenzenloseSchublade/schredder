import { useState, useEffect, useCallback } from "react";

const FUN_FACTS = [
  "Chicken Nuggets wurden 1963 von Robert C. Baker an der Cornell University erfunden.",
  "McDonald's McNuggets gibt es in genau 4 Formen: Boot, Glocke, Kugel und Knochen – alle beginnen mit B.",
  "McDonald's dazu: Drei Formen wären zu wenig, fünf zu verrückt gewesen.",
  "McDonald’s verkauft weltweit Milliarden McNuggets pro Jahr.",
  "Pommes Frites stammen aus Belgien – Kartoffeln wurden in Fischform geschnitten, wenn die Maas zugefroren war.",
  "In Belgien gibt es rund 5000 Frittenbuden und ein Frietmuseum in Brügge.",
  "McDonald's McNuggets kamen 1983 in den USA, 1984 in Deutschland auf die Speisekarte.",
  "Die ersten McNuggets gab es mit vier Saucen: Honey, Sweet & Sour, Hot Mustard und BBQ.",
  "Ein Nugget hat etwa 45–50 Kalorien.",
  "Colonel Sanders von KFC war ein ehrenamtlicher Colonel – der Titel wurde ihm vom Gouverneur von Kentucky verliehen.",
  "KFCs Geheimrezept soll 11 Kräuter und Gewürze enthalten.",
  "Nuggets wurden als preiswerte Alternative zu ganzen Hühnchen entwickelt.",
  "Die goldene Farbe von Nuggets kommt von der Panade und dem Frittieren.",
  "Die McNugget-Formen wurden 2021 per TikTok wieder zum Gesprächsthema.",
  "Manche Länder haben Nuggets in Dino- oder Herzform – nicht nur die klassischen B-Formen.",
  "Belgien und Frankreich streiten sich darum, wer die Pommes erfunden hat.",
  "Ein 6er-Nugget liefert etwa 20 Gramm Protein – gut ein Drittel des Tagesbedarfs.",
  "McDonald's stellt McNuggets seit 2016 ohne künstliche Farb- und Konservierungsstoffe her.",
];

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
            💡
          </span>
          {FUN_FACTS[index]}
        </p>
      </div>
    </div>
  );
}
