import { useState, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { Tables } from "@/types/database.types";

const CONFIRM_TEXT = "LÖSCHEN";

interface DeleteEntryConfirmDialogProps {
  entry: Tables<"nugget_entries"> | null;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteEntryConfirmDialog({
  entry,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteEntryConfirmDialogProps) {
  // Input State mit key-basiertem Reset (über Parent-Komponente)
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = entry !== null;
  const containerRef = useFocusTrap(isOpen, onCancel, {
    initialFocusRef: inputRef,
  });

  if (!entry) return null;

  const match = input.trim().toUpperCase() === CONFIRM_TEXT;
  const formattedDate = new Date(entry.created_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={onCancel}
    >
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-dialog-title"
          className="text-lg font-semibold text-gray-900"
        >
          Eintrag wirklich löschen?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {entry.count} Nuggets vom {formattedDate} – diese Aktion kann nicht
          rückgängig gemacht werden.
        </p>
        <p className="mt-4 text-sm text-gray-700">
          Zum Bestätigen bitte <strong>{CONFIRM_TEXT}</strong> eintippen:
        </p>
        <label htmlFor="delete-confirm-input" className="sr-only">
          Bestätigungstext eingeben
        </label>
        <input
          ref={inputRef}
          id="delete-confirm-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={CONFIRM_TEXT}
          className="input mt-2 w-full font-mono uppercase"
          autoComplete="off"
          disabled={isDeleting}
          aria-describedby="delete-confirm-hint"
        />
        <p id="delete-confirm-hint" className="sr-only">
          Gib LÖSCHEN ein, um den Eintrag zu löschen
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-secondary flex-1"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => onConfirm(entry.id)}
            disabled={!match || isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Wird gelöscht…" : "Endgültig löschen"}
          </button>
        </div>
      </div>
    </div>
  );
}
