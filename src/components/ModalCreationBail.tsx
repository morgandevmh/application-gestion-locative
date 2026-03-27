"use client";

import { useState, useEffect } from "react";

type Bien = {
  id: number;
  nom: string;
  type: string;
};

type Locataire = {
  id: number;
  nom: string;
  statut: string;
};

type Template = {
  id: number;
  nom: string;
};

type ModalCreationBailProps = {
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

export default function ModalCreationBail({
  onClose,
  onSuccess,
}: ModalCreationBailProps) {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [bienId, setBienId] = useState("");
  const [locataireId, setLocataireId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [typeBail, setTypeBail] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loyerEncadre, setLoyerEncadre] = useState("");
  const [complementLoyer, setComplementLoyer] = useState("");
  const [charges, setCharges] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger biens et templates au montage
  useEffect(() => {
    fetch("/api/biens")
      .then((res) => res.json())
      .then((data) => setBiens(data));

    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, []);

  // Charger locataires quand le bien change
  useEffect(() => {
    if (!bienId) {
      setLocataires([]);
      setLocataireId("");
      return;
    }

    fetch(`/api/biens/${bienId}/locataires`)
      .then((res) => res.json())
      .then((data) => {
        setLocataires(data);
        setLocataireId("");
      });
  }, [bienId]);

  // Recalculer date fin quand date début ou type change
  useEffect(() => {
    if (dateDebut && typeBail) {
      setDateFin(calculerDateFin(dateDebut, typeBail));
    }
  }, [dateDebut, typeBail]);

  const loyerTotal =
    (parseFloat(loyerEncadre) || 0) +
    (parseFloat(complementLoyer) || 0) +
    (parseFloat(charges) || 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const newErrors: string[] = [];
    if (!bienId) newErrors.push("Sélectionnez un bien.");
    if (!locataireId) newErrors.push("Sélectionnez un locataire.");
    if (!templateId) newErrors.push("Sélectionnez un template.");
    if (!typeBail) newErrors.push("Choisissez un type de bail.");
    if (!dateDebut) newErrors.push("La date de début est requise.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/biens/${bienId}/baux`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locataireId: Number(locataireId),
        templateId: Number(templateId),
        typeBail,
        dateDebut,
        dateFin: dateFin || null,
        loyerEncadre: loyerEncadre ? parseFloat(loyerEncadre) : null,
        complementLoyer: parseFloat(complementLoyer) || 0,
        charges: parseFloat(charges) || 0,
        contenu: "",
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      onSuccess();
    }
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
          <h2 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-text m-0">
            Nouveau bail
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

          <form id="form-bail" onSubmit={handleSubmit} className="space-y-5">
            {/* Bien */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Bien *
              </label>
              <select
                value={bienId}
                onChange={(e) => setBienId(e.target.value)}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none appearance-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="">Sélectionner un bien</option>
                {biens.map((bien) => (
                  <option key={bien.id} value={bien.id}>
                    {bien.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Locataire */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Locataire *
              </label>
              <select
                value={locataireId}
                onChange={(e) => setLocataireId(e.target.value)}
                disabled={!bienId}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none appearance-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {bienId ? "Sélectionner un locataire" : "Sélectionnez d'abord un bien"}
                </option>
                {locataires
                  .filter((loc) => loc.statut === "ACTIF")
                  .map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.nom}
                    </option>
                  ))}
              </select>
            </div>

            {/* Template */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Template *
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none appearance-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="">Sélectionner un template</option>
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.nom}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="font-body text-xs text-text-tertiary mt-1">
                  Aucun template disponible — créez-en un d&apos;abord
                </p>
              )}
            </div>

            {/* Type de bail */}
            <div>
              <label className="block font-heading font-bold text-[13px] text-text mb-[6px]">
                Type de bail *
              </label>
              <select
                value={typeBail}
                onChange={(e) => setTypeBail(e.target.value)}
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text outline-none appearance-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              >
                <option value="">Choisir un type</option>
                <option value="MEUBLE">Meublé (1 an)</option>
                <option value="VIDE">Vide (3 ans)</option>
                <option value="ETUDIANT">Étudiant (9 mois)</option>
                <option value="MOBILITE">Mobilité (10 mois)</option>
              </select>
            </div>

            {/* Dates */}
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
                  Calculée auto, modifiable
                </p>
              </div>
            </div>

            {/* Loyers */}
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
                  placeholder="650"
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
                  placeholder="0"
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
                  placeholder="0"
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
            </div>

            {/* Loyer total */}
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

        {/* Footer */}
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
            form="form-bail"
            disabled={isLoading}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création..." : "Créer le bail"}
          </button>
        </div>
      </div>
    </div>
  );
}