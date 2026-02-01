import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCreateNuggetEntry } from "@/hooks/useNuggetEntries";
import { useAddEntryModal } from "@/contexts/AddEntryModalContext";
import NuggetEntryForm from "@/components/NuggetEntryForm";
import type { NuggetEntryFormData } from "@/lib/validations";

export default function AddEntryModal() {
  const { isOpen, closeModal } = useAddEntryModal();
  const { user } = useAuth();
  const createEntry = useCreateNuggetEntry();

  const handleSubmit = useCallback(
    async (data: NuggetEntryFormData & { created_at: string }) => {
      if (!user?.id) return;
      try {
        await createEntry.mutateAsync({
          user_id: user.id,
          count: data.count,
          sauces: data.sauces ?? [],
          location: data.location || null,
          mood: data.mood || null,
          notes: data.notes || null,
          created_at: data.created_at,
        });
        toast.success("Eintrag gespeichert!", {
          description: `${data.count} Nuggets wurden hinzugefügt.`,
        });
        closeModal();
      } catch (err) {
        toast.error("Fehler beim Speichern", {
          description:
            err instanceof Error ? err.message : "Unbekannter Fehler",
        });
      }
    },
    [user?.id, createEntry, closeModal]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-entry-dialog-title"
      onClick={closeModal}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <NuggetEntryForm
          onSubmit={handleSubmit}
          isSubmitting={createEntry.isPending}
          onCancel={closeModal}
        />
      </div>
    </div>
  );
}
