import React, { useState } from "react";
import { createCheckin } from "../api";

const moodOptions = [
  { label: "Muy bien", emoji: "😁", value: "muy_bien" },
  { label: "Bien", emoji: "😊", value: "bien" },
  { label: "Neutral", emoji: "😐", value: "neutral" },
  { label: "Triste", emoji: "😢", value: "triste" },
  { label: "Ansioso/a", emoji: "😰", value: "ansioso" },
];

interface EmotionCheckinCardProps {
  token: string;
  onCheckinSaved: () => void;
}

export const EmotionCheckinCard: React.FC<EmotionCheckinCardProps> = ({
  token,
  onCheckinSaved,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMood) return;

    try {
      setLoading(true);
      setError(null);
      await createCheckin(token, selectedMood, note);
      setSubmitted(true);
      setNote("");
      onCheckinSaved();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message || "Error al guardar el check-in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 space-y-3">
      <h2 className="text-lg font-semibold">Check-in emocional rápido</h2>
      <p className="text-xs text-slate-300">
        Elige cómo te sientes ahora mismo y, si quieres, escribe una nota breve.
        Esta información sirve para que EmoAI te recomiende ejercicios y apoyo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2" aria-label="Selecciona tu estado de ánimo">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setSelectedMood(mood.value)}
              className={`flex-1 min-w-[80px] rounded-xl border px-2 py-2 text-xs flex flex-col items-center gap-1
                ${
                  selectedMood === mood.value
                    ? "border-indigo-400 bg-indigo-500/20"
                    : "border-slate-700 bg-slate-950/80 hover:border-slate-500"
                }`}
            >
              <span className="text-xl" aria-hidden="true">
                {mood.emoji}
              </span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <label htmlFor="note" className="text-xs text-slate-200">
            ¿Quieres contarnos qué está pasando? (opcional)
          </label>
          <textarea
            id="note"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Estoy nerviosa por un examen, tuve una discusión, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!selectedMood || loading}
          className="rounded-lg bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {loading ? "Guardando..." : "Guardar check-in"}
        </button>

        {submitted && !error && (
          <p className="text-[11px] text-emerald-300">
            ✅ ¡Check-in guardado correctamente!
          </p>
        )}
      </form>
    </div>
  );
};
