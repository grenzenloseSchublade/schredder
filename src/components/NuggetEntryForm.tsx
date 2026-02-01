import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nuggetEntrySchema, type NuggetEntryFormData } from "@/lib/validations";
import Input from "@/components/ui/Input";

const SAUCE_OPTIONS = [
  { value: "", label: "Keine Auswahl" },
  { value: "BBQ", label: "BBQ" },
  { value: "Süß-Sauer", label: "Süß-Sauer" },
  { value: "Sweet Chili", label: "Sweet Chili" },
  { value: "Curry", label: "Curry" },
  { value: "Ketchup", label: "Ketchup" },
  { value: "Mayo", label: "Mayo" },
  { value: "Honig-Senf", label: "Honig-Senf" },
  { value: "Andere", label: "Andere" },
];

const MOOD_OPTIONS = ["😋", "🤤", "😍", "🥰", "😎", "🤩", "😌", "🙂"] as const;

interface NuggetEntryFormProps {
  onSubmit: (data: NuggetEntryFormData & { created_at: string }) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export default function NuggetEntryForm({
  onSubmit,
  isSubmitting = false,
  onCancel,
}: NuggetEntryFormProps) {
  const [liveTimestamp, setLiveTimestamp] = useState(() =>
    new Date().toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTimestamp(
        new Date().toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<NuggetEntryFormData>({
    resolver: zodResolver(nuggetEntrySchema),
    defaultValues: {
      count: 10,
      sauce: "",
      location: "",
      mood: undefined,
      notes: "",
    },
  });

  const count = useWatch({ control, name: "count", defaultValue: 10 });
  const selectedMood = useWatch({ control, name: "mood" });

  const handleFormSubmit = (data: NuggetEntryFormData): void => {
    onSubmit({
      ...data,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 ring-1 ring-orange-200/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          🍗 Neuer Eintrag
        </h3>
        <p className="text-sm text-gray-600">
          Erstellt: <span className="font-medium">{liveTimestamp}</span>
        </p>
      </div>

      <div className="space-y-4">
        {/* Anzahl mit +/- Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Anzahl (Pflichtfeld)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValue("count", Math.max(1, count - 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-gray-600 shadow ring-1 ring-gray-200 transition hover:bg-gray-50"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={999}
              {...register("count", { valueAsNumber: true })}
              className="input h-10 w-24 text-center text-lg font-bold"
            />
            <button
              type="button"
              onClick={() => setValue("count", Math.min(999, count + 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-gray-600 shadow ring-1 ring-gray-200 transition hover:bg-gray-50"
            >
              +
            </button>
          </div>
          {errors.count && (
            <p className="mt-1 text-sm text-red-600">{errors.count.message}</p>
          )}
        </div>

        {/* Sauce */}
        <div>
          <label
            htmlFor="sauce"
            className="block text-sm font-medium text-gray-700"
          >
            Sauce
          </label>
          <select
            id="sauce"
            {...register("sauce")}
            className="input mt-1 w-full"
          >
            {SAUCE_OPTIONS.map((opt) => (
              <option key={opt.value || "none"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <Input
          id="location"
          label="Ort"
          placeholder="z.B. McDonald's, KFC, Zuhause"
          {...register("location")}
        />

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stimmung
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() =>
                  setValue("mood", selectedMood === mood ? undefined : mood)
                }
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                  selectedMood === mood
                    ? "scale-110 bg-orange-200 ring-2 ring-orange-500"
                    : "bg-white ring-1 ring-gray-200 hover:bg-orange-50"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notizen
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={2}
            placeholder="Optionale Notizen..."
            className="input mt-1 w-full resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isSubmitting ? "Wird gespeichert..." : "Eintrag speichern"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary shrink-0"
          >
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}
