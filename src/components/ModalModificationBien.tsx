"use client";

import { useState, useEffect } from "react";

type Bien = {
  id: number;
  nom: string;
  adresse: string;
  type: string;
  description: string | null;
};

type ModalModifierBienProps = {
  bienId: string | string[] | undefined;
  onClose: () => void;
};

export default function ModalModificationBien({
  bienId,
  onClose,
}: ModalModifierBienProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bien, setBien] = useState<Bien | null>(null);

  useEffect(() => {
    async function fetchBien() {
      const response = await fetch(`/api/biens/${bienId}`);
      const data = await response.json();
      setBien(data);
    }
    if (bienId) fetchBien();
  }, [bienId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const nom = formData.get("nom") as string;
    const adresse = formData.get("adresse") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;

    const newErrors: string[] = [];

    if (!nom.trim()) newErrors.push("Un nom est requis.");
    if (!adresse.trim()) newErrors.push("Veuillez ajouter une adresse.");
    if (!type.trim()) newErrors.push("Choisissez un type de bien.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/biens/${bienId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, adresse, type, description }),
    });

    if (!response.ok) {
      const result = await response.json();
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      window.location.href = `/dashboard/biens/${bienId}`;
    }
  }

  if (!bien) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-glass-overlay">
        <p className="text-text-secondary">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-glass-overlay"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-[90%] max-w-[440px] max-h-[85vh] md:w-[520px] md:max-w-none md:max-h-none md:h-full md:rounded-none rounded-xl bg-surface-elevated flex flex-col overflow-hidden shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-[18px] text-text">
            Modifier le bien
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-surface flex items-center justify-center hover:bg-border"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5">
              <path d="M11 3L3 11M3 3l8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-5 rounded-lg border border-red bg-red-pastel p-4">
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-text">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form id="form-modifier-bien" onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Nom du bien *
              </label>
              <input
                name="nom"
                defaultValue={bien.nom}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Adresse *
              </label>
              <input
                name="adresse"
                defaultValue={bien.adresse}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Type de bien *
              </label>
              <select
                name="type"
                defaultValue={bien.type}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="">Choisir un type</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="STUDIO">Studio</option>
                <option value="COLOCATION">Colocation</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={bien.description || ""}
                rows={4}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm resize-y focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-glass-light border border-glass-border px-4 py-[10px] text-sm font-bold text-text hover:bg-glass-medium"
          >
            Annuler
          </button>

          <button
            type="submit"
            form="form-modifier-bien"
            disabled={isLoading}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] text-sm font-bold text-white hover:bg-accent disabled:opacity-40"
          >
            {isLoading ? "Modification..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}