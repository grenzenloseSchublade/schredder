import { useEffect, useRef, useCallback } from "react";

/**
 * Hook für Focus-Management in Modals
 * - Setzt Focus auf erstes fokussierbares Element beim Öffnen
 * - Hält Tab-Navigation innerhalb des Modals (Focus-Trap)
 * - Stellt Focus auf auslösendes Element nach Schließen wieder her
 * - Unterstützt ESC zum Schließen
 */
export function useFocusTrap(
  isOpen: boolean,
  onClose: () => void,
  options?: {
    enableEsc?: boolean;
    initialFocusRef?: React.RefObject<HTMLElement | null>;
  }
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const { enableEsc = true, initialFocusRef } = options ?? {};

  // Focus auf erstes Element setzen beim Öffnen
  useEffect(() => {
    if (!isOpen) return;

    // Vorheriges aktives Element speichern
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus setzen
    const setInitialFocus = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusable = containerRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    };

    // Kurze Verzögerung für Animation
    const timeoutId = setTimeout(setInitialFocus, 10);

    return () => clearTimeout(timeoutId);
  }, [isOpen, initialFocusRef]);

  // Focus wiederherstellen beim Schließen
  useEffect(() => {
    if (isOpen) return;

    // Focus zurücksetzen
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Focus-Trap und ESC-Handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !containerRef.current) return;

      // ESC zum Schließen
      if (enableEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus-Trap bei Tab
      if (e.key === "Tab") {
        const focusableElements =
          containerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isOpen, onClose, enableEsc]
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return containerRef;
}
