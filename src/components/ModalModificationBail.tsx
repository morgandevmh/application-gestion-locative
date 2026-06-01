"use client";

import { useState, useEffect } from "react";

type Bien = {
  id: number;
  nom: string;
  parent?: { nom: string } | null;
};

type Locataire = {
  id: number;
  nom: string;
};

type Template = {
  id: number;
  nom: string;
};

type Bail = {
  id: number;
  bienId: number;
  locataireId: number;
  templateId: number;
  typeBail: string;
  dateDebut: string;
  dateFin: string | null;
  loyerEncadre: number | null;
  complementLoyer: number;
  charges: number;
  bien: Bien;
  locataire: Locataire;
  template: Template;
};

type ModalModificationBailProps = {
  bail: Bail;
  onClose: () => void;
  onSuccess: () => void;
};

const TYPE_BAIL_DUREES: Record<string, number> = {
  MEUBLE: 12,
  VIDE: 36,
  ETUDIANT: 9,
  MOBILITE: 10,
};

function calculerDateFin(dateDebut: string, typeBail: string): string {
  if (!dateDebut || !typeBail) return "";
  const duree = TYPE_BAIL_DUREES[typeBail];
  if (!duree) return "";
  const date = new Date(dateDebut);
  date.setMonth(date.getMonth() + duree);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

export default function ModalModificationBail({
  bail,
  onClose,
  onSuccess,
}: ModalModificationBailProps) {
  const [typeBail, setTypeBail] = useState(bail.typeBail);
  const [dateDebut, setDateDebut] = useState(bail.dateDebut.split("T")[0]);
  const [dateFin, setDateFin] = useState(
    bail.dateFin ? bail.dateFin.split("T")[0] : ""
  );
  const [loyerEncadre, setLoyerEncadre] = useState(
    bail.loyerEncadre?.toString() ?? ""
  );
  const [complementLoyer, setComplementLoyer] = useState(
    bail.complementLoyer.toString()
  );
  const [charges, setCharges] = useState(bail.charges.toString());

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Recalcul auto de la date de fin quand le type ou la date de début change
  useEffect(() => {
    if (dateDebut && typeBail) {
      setDateFin(calculerDateFin(dateDebut, typeBail));
    }
  }, [dateDebut, typeBail]);

  const loyerTotal =
    (parseFloat(loyerEncadre) || 0) +
    (parseFloat(complementLoyer) || 0) +
    (parseFloat(charges) || 0);

  const bienLabel = bail.bien.parent
    ? `${bail.bien.parent.nom} — ${bail.bien.nom}`
    : bail.bien.nom;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const newErrors: string[] = [];
    if (!typeBail) newErrors.push("Choisissez un type de bail.");
    if (!dateDebut) newErrors.push("La date de début est requise.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/baux/${bail.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typeBail,
        dateDebut,
        dateFin: dateFin || null,
        loyerEncadre: loyerEncadre ? parseFloat(loyerEncadre) : null,
        complementLoyer: parseFloat(complementLoyer) || 0,
        charges: parseFloat(charges) || 0,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setErrors([result.error]);
      setIsLoading(false);
      return;
    }

    await fetch(`/api/baux/${bail.id}/generer`, {
      method: "POST",
    });

    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end">
      <div
        className="absolute inset-0 bg-glass-overlay"
        onClick={onClose}
      />

      <div className="relative z-10 w-[90%] max-w-[440px] max-h-[85vh] md:w-[520px] md:max-w-none md:max-h-none md:h-full md:rounded-none rounded-xl bg-surface-elevated flex flex-col overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-text m-0">
            Modifier le bail
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

        <div className="flex-1 overflow-y-auto px-6 py-5">
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

          <form id="form-bail-modif" onSubmit={handleSubmit} className="space-y-5">
            {/* Bien non modifiable, affiché en lecture seule */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Bien
              </label>
              <div className="w-full border-[1.5px] border-border rounded-md bg-surface px-4 py-[10px] text-sm font-body text-text-secondary">
                {bienLabel}
              </div>
              <p className="font-body text-[11px] text-text-tertiary mt-1">
                Non modifiable
              </p>
            </div>

            {/* Locataire non modifiable */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Locataire
              </label>
              <div className="w-full border-[1.5px] border-border rounded-md bg-surface px-4 py-[10px] text-sm font-body text-text-secondary">
                {bail.locataire.nom}
              </div>
              <p className="font-body text-[11px] text-text-tertiary mt-1">
                Non modifiable
              </p>
            </div>

            {/* Template non modifiable */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Template
              </label>
              <div className="w-full border-[1.5px] border-border rounded-md bg-surface px-4 py-[10px] text-sm font-body text-text-secondary">
                {bail.template.nom}
              </div>
              <p className="font-body text-[11px] text-text-tertiary mt-1">
                Non modifiable
              </p>
            </div>

            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Type de bail *
              </label>
              <select
                value={typeBail}
                onChange={(e) => setTypeBail(e.target.value)}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none appearance-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="MEUBLE">Meublé (1 an)</option>
                <option value="VIDE">Vide (3 ans)</option>
                <option value="ETUDIANT">Étudiant (9 mois)</option>
                <option value="MOBILITE">Mobilité (10 mois)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
              <div>
                <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
                <p className="font-body text-[11px] text-text-tertiary mt-1">
                  Recalculée auto, modifiable
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                  Loyer encadré
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={loyerEncadre}
                  onChange={(e) => setLoyerEncadre(e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
              <div>
                <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                  Complément
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={complementLoyer}
                  onChange={(e) => setComplementLoyer(e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
              <div>
                <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                  Charges
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={charges}
                  onChange={(e) => setCharges(e.target.value)}
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
            </div>

            <div className="bg-surface rounded-lg p-3 flex items-center justify-between">
              <p className="font-body text-[13px] text-text-secondary m-0">
                Loyer total
              </p>
              <p className="font-heading font-bold text-[18px] text-text m-0">
                {loyerTotal.toLocaleString()} €
                <span className="text-text-tertiary text-xs font-normal ml-1">
                  /mois
                </span>
              </p>
            </div>
          </form>
        </div>

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
            form="form-bail-modif"
            disabled={isLoading}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}