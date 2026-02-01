import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrollt bei jeder Routenaenderung zum Seitenanfang.
 * Muss innerhalb des Router-Kontexts eingebunden werden.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
