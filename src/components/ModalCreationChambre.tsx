"use client";

import { useState } from "react";
import ModalGestionPhotos from "@/components/ModalGestionPhotos";

type ModalCreationChambreProps = {
  bienId: string | string[] | undefined;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ModalCreationChambre({
  bienId,
  onClose,
  onSuccess,
}: ModalCreationChambreProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chambreCreeId, setChambreCreeId] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const nom = formData.get("nom") as string;
    const description = formData.get("description") as string;

    const newErrors: string[] = [];

    if (!nom.trim()) {
      newErrors.push("Un nom est requis.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/biens/${bienId}/chambres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description }),
    });

    if (!response.ok) {
      const result = await response.json();
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      const result = await response.json();
      setChambreCreeId(result.id);
    }
  }

  if (chambreCreeId) {
    return (
      <ModalGestionPhotos
        bienId={chambreCreeId}
        onClose={() => {
          onSuccess();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-glass-overlay"
        onClick={onClose}
      />

      {/* Panneau desktop / Modale mobile */}
      <div className="relative z-10 w-[90%] max-w-[440px] max-h-[85vh] md:w-[520px] md:max-w-none md:max-h-none md:h-full md:rounded-none rounded-xl bg-surface-elevated flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-text m-0">
            Ajouter une chambre
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-surface flex items-center justify-center cursor-pointer border-none transition-colors duration-100 hover:bg-border"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 3L3 11M3 3l8 8" />
            </svg>
          </button>
        </div>

        {/* Formulaire scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="mb-5 rounded-lg border border-red bg-red-pastel p-4">
              <ul className="space-y-1 list-none m-0 p-0">
                {errors.map((error, i) => (
                  <li key={i} className="font-body text-sm text-red-text">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form id="form-chambre" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nom"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Nom de la chambre *
              </label>
              <input
                name="nom"
                id="nom"
                type="text"
                placeholder="Chambre 1"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Description (optionnel)
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Chambre avec vue sur cour..."
                rows={4}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 resize-y min-h-[80px] focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>
          </form>
        </div>

        {/* Footer — boutons */}
        <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-glass-light border border-glass-border px-4 py-[10px] font-body font-bold text-sm text-text cursor-pointer transition-all duration-100 hover:bg-glass-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="form-chambre"
            disabled={isLoading}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création..." : "Créer la chambre"}
          </button>
        </div>
      </div>
    </div>
  );
}