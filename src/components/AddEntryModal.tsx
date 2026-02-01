import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCreateNuggetEntry } from "@/hooks/useNuggetEntries";
import { useAddEntryModal } from "@/contexts/AddEntryModalContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import NuggetEntryForm from "@/components/NuggetEntryForm";
import type { NuggetEntryFormData } from "@/lib/validations";

export default function AddEntryModal() {
  const { isOpen, closeModal } = useAddEntryModal();
  const { user } = useAuth();
  const createEntry = useCreateNuggetEntry();
  const containerRef = useFocusTrap(isOpen, closeModal);

  const handleSubmit = async (
    data: NuggetEntryFormData & { created_at: string }
  ) => {
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
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

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
        ref={containerRef}
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
