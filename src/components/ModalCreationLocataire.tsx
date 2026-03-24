"use client";

import { useState } from "react";

type ModalCreationLocataireProps = {
  bienId: string | string[]| undefined;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ModalCreationLocataire({
  bienId,
  onClose,
  onSuccess,
}: ModalCreationLocataireProps) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [caution, setCaution] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/biens/${bienId}/locataires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email: email || null,
          telephone: telephone || null,
          dateEntree: new Date(dateEntree).toISOString(),
          caution: parseFloat(caution),
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Erreur lors de la création du locataire");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-glass-overlay"
        onClick={onClose}
      />

      {/* Panneau desktop (droite) / Modale mobile (centrée) */}
      <div className="relative z-10 w-[90%] max-w-[440px] max-h-[85vh] md:w-[520px] md:max-w-none md:max-h-none md:h-full md:rounded-none rounded-xl bg-surface-elevated flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-text m-0">
            Ajouter un locataire
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
          {/* Erreur */}
          {error && (
            <div className="mb-5 rounded-lg border border-red bg-red-pastel p-4">
              <p className="font-body text-sm text-red-text m-0">{error}</p>
            </div>
          )}

          <form id="form-locataire" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nom"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Nom *
              </label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="Nom du locataire"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dateEntree"
                  className="block font-heading font-bold text-[13px] text-text mb-[6px]"
                >
                  Date d&apos;entrée *
                </label>
                <input
                  id="dateEntree"
                  type="date"
                  value={dateEntree}
                  onChange={(e) => setDateEntree(e.target.value)}
                  required
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="caution"
                  className="block font-heading font-bold text-[13px] text-text mb-[6px]"
                >
                  Caution (€) *
                </label>
                <input
                  id="caution"
                  type="number"
                  value={caution}
                  onChange={(e) => setCaution(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Notes optionnelles..."
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
            form="form-locataire"
            disabled={loading}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Création..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}