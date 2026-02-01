import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAddEntryModal } from "@/contexts/AddEntryModalContext";

export default function FloatingAddButton() {
  const { user } = useAuth();
  const { openModal } = useAddEntryModal();
  const { pathname } = useLocation();
  const isDashboard =
    pathname === "/dashboard" || pathname.endsWith("/dashboard");

  if (!user || isDashboard) return null;

  return (
    <button
      type="button"
      onClick={openModal}
      className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
      aria-label="Neuen Eintrag hinzufügen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
      >
        <path
          fillRule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
