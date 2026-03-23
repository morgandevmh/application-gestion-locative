"use client";

import { useState, useEffect } from "react";

type Locataire = {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  dateEntree: string;
  dateSortie: string | null;
  caution: number;
  statut: string;
  notes: string | null;
};

type Props = {
  locataireId: string | string[] | undefined;
  onClose: () => void;
};

export default function ModalModifierLocataire({
  locataireId,
  onClose,
}: Props) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locataire, setLocataire] = useState<Locataire | null>(null);

  useEffect(() => {
    async function fetchLocataire() {
      const res = await fetch(`/api/locataires/${locataireId}`);
      const data = await res.json();
      setLocataire(data);
    }
    if (locataireId) fetchLocataire();
  }, [locataireId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const nom = formData.get("nom") as string;
    const email = formData.get("email") as string;
    const telephone = formData.get("telephone") as string;
    const dateEntree = formData.get("dateEntree") as string;
    const dateSortie = formData.get("dateSortie") as string;
    const caution = formData.get("caution") as string;
    const statut = formData.get("statut") as string;
    const notes = formData.get("notes") as string;

    const newErrors: string[] = [];

    if (!nom.trim()) newErrors.push("Un nom est requis.");
    if (!dateEntree) newErrors.push("Date d'entrée requise.");
    if (!caution) newErrors.push("Caution requise.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/locataires/${locataireId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        email: email || null,
        telephone: telephone || null,
        dateEntree: new Date(dateEntree).toISOString(),
        dateSortie: dateSortie ? new Date(dateSortie).toISOString() : null,
        caution: parseFloat(caution),
        statut,
        notes: notes || null,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      window.location.href = `/dashboard/locataires/${locataireId}`;
    }
  }

  if (!locataire) {
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
            Modifier le locataire
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

          <form id="form-modifier-locataire" onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Nom *
              </label>
              <input
                name="nom"
                defaultValue={locataire.nom}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Email
              </label>
              <input
                name="email"
                defaultValue={locataire.email || ""}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Téléphone
              </label>
              <input
                name="telephone"
                defaultValue={locataire.telephone || ""}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Date d&apos;entrée *
              </label>
              <input
                type="date"
                name="dateEntree"
                defaultValue={locataire.dateEntree.split("T")[0]}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Date de sortie
              </label>
              <input
                type="date"
                name="dateSortie"
                defaultValue={locataire.dateSortie ? locataire.dateSortie.split("T")[0] : ""}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Caution (€) *
              </label>
              <input
                type="number"
                name="caution"
                defaultValue={locataire.caution}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Statut
              </label>
              <select
                name="statut"
                defaultValue={locataire.statut}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="ACTIF">Actif</option>
                <option value="SORTI">Sorti</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Notes
              </label>
              <textarea
                name="notes"
                defaultValue={locataire.notes || ""}
                rows={3}
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
            form="form-modifier-locataire"
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