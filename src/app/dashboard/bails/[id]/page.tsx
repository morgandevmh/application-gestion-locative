"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Bail = {
  id: number;
  contenu: string;
  dateDebut: string;
  dateFin: string | null;
  loyerEncadre: number | null;
  complementLoyer: number;
  charges: number;
  typeBail: string;
  pdfUrl: string | null;
  pdfPresignedUrl: string | null;
  createdAt: string;
  bien: {
    id: number;
    nom: string;
  };
  locataire: {
    id: number;
    nom: string;
    caution: number;
  };
  template: {
    id: number;
    nom: string;
  };
};

const TYPE_BAIL_LABELS: Record<string, string> = {
  MEUBLE: "Meublé",
  VIDE: "Vide",
  ETUDIANT: "Étudiant",
  MOBILITE: "Mobilité",
};

function isBailActif(bail: Bail) {
  if (!bail.dateFin) return true;
  return new Date(bail.dateFin) >= new Date();
}

export default function BailDetailPage() {
  const [bail, setBail] = useState<Bail | null>(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/baux/${id}`)
      .then((res) => res.json())
      .then((data) => setBail(data));
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce bail ?"
    );
    if (!confirmed) return;

    const response = await fetch(`/api/baux/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/dashboard/bails");
    }
  }

  if (!bail) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-text-secondary">Chargement...</p>
      </div>
    );
  }

  const actif = isBailActif(bail);
  const loyerTotal = (bail.loyerEncadre || 0) + bail.complementLoyer + bail.charges;

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Lien retour */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Retour
      </button>

      {/* Header card — gradient */}
      <div
        className="rounded-xl mt-4 mb-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 60%, #1a2a4a 85%, #1a2a4a 100%)",
        }}
      >
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4 px-7 py-6">
          <div className="flex items-center gap-[14px] min-w-0">
            {actif ? (
              <span
                className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0"
                style={{
                  background: "rgba(52, 199, 89, 0.2)",
                  color: "#5ee87a",
                  border: "1px solid rgba(52, 199, 89, 0.3)",
                }}
              >
                ACTIF
              </span>
            ) : (
              <span className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0 bg-glass-on-gradient text-white/65 border border-glass-on-gradient-border">
                EXPIRÉ
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[20px] leading-[26px] tracking-[-0.01em] text-white m-0 truncate">
                Bail — {bail.locataire.nom}
              </h1>
              <p className="font-body text-[13px] text-white/55 m-0 mt-[2px] truncate">
                {bail.bien.nom} · {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => router.push(`/dashboard/bails/${bail.id}/modifier`)}
              className="inline-flex items-center gap-[6px] px-[18px] py-2 rounded-md bg-glass-on-gradient border border-glass-on-gradient-border text-white font-body font-bold text-[13px] transition-all duration-100 hover:bg-glass-on-gradient-hover"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 1.5l2.5 2.5L5 11.5H2.5V9z" />
              </svg>
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-[6px] px-[18px] py-2 rounded-md font-body font-bold text-[13px] cursor-pointer transition-all duration-100"
              style={{
                background: "rgba(255, 69, 58, 0.2)",
                border: "1px solid rgba(255, 69, 58, 0.3)",
                color: "#ff8f88",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.2)";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-[10px] min-w-0">
            {actif ? (
              <span
                className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0"
                style={{
                  background: "rgba(52, 199, 89, 0.2)",
                  color: "#5ee87a",
                  border: "1px solid rgba(52, 199, 89, 0.3)",
                }}
              >
                ACTIF
              </span>
            ) : (
              <span className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0 bg-glass-on-gradient text-white/65 border border-glass-on-gradient-border">
                EXPIRÉ
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[17px] leading-[22px] tracking-[-0.01em] text-white m-0 truncate">
                Bail — {bail.locataire.nom}
              </h1>
              <p className="font-body text-xs text-white/55 m-0 mt-[2px] truncate">
                {bail.bien.nom} · {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
              </p>
            </div>
          </div>
          <div className="flex gap-[6px] shrink-0">
            <button
              onClick={() => router.push(`/dashboard/bails/${bail.id}/modifier`)}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-md bg-glass-on-gradient border border-glass-on-gradient-border transition-all duration-100 hover:bg-glass-on-gradient-hover"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 1.5l2.5 2.5L5 11.5H2.5V9z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-md cursor-pointer transition-all duration-100"
              style={{
                background: "rgba(255, 69, 58, 0.2)",
                border: "1px solid rgba(255, 69, 58, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.2)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="#ff8f88"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="mb-8">
        <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
          Document
        </h2>
        <div className="bg-surface-elevated rounded-lg border border-border p-4 md:px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-pastel flex items-center justify-center shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#0055b3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                <path d="M7 7h6M7 10h6M7 13h3" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-medium text-[15px] text-text m-0">
                Bail généré
              </p>
              <p className="font-body text-[13px] text-text-tertiary m-0 mt-[2px]">
                {bail.pdfUrl
                  ? `PDF · Généré le ${new Date(bail.createdAt).toLocaleDateString()}`
                  : "Pas encore généré"}
              </p>
            </div>
          </div>
          {bail.pdfPresignedUrl ? (
            <a
              href={bail.pdfPresignedUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-[6px] rounded-md bg-glass-light border border-glass-border font-body font-bold text-xs text-text no-underline transition-colors hover:bg-glass-medium"
            >
              Télécharger
            </a>
          ) : (
            <span className="font-body text-xs text-text-tertiary">
              —
            </span>
          )}
        </div>
      </div>

      {/* Récap loyer + Informations du bail */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Récap loyer */}
        <div className="flex flex-col">
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Récap loyer
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5 flex flex-col gap-4 flex-1">
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Loyer encadré
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {bail.loyerEncadre != null
                  ? `${bail.loyerEncadre.toLocaleString()} €`
                  : "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Complément de loyer
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {bail.complementLoyer.toLocaleString()} €
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Charges
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {bail.charges.toLocaleString()} €
              </p>
            </div>
            <div className="border-t border-border pt-3 mt-auto">
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Loyer total
              </p>
              <p className="font-heading font-bold text-[22px] leading-7 tracking-[-0.01em] text-text m-0">
                {loyerTotal.toLocaleString()} €
                <span className="text-text-tertiary text-[13px] font-normal ml-1">
                  /mois
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Informations du bail */}
        <div className="flex flex-col">
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Informations du bail
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5 flex flex-col gap-4 flex-1">
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Date de début
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {new Date(bail.dateDebut).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Date de fin
              </p>
              <p className={`font-body text-[15px] m-0 ${bail.dateFin ? "text-text" : "text-text-tertiary"}`}>
                {bail.dateFin
                  ? new Date(bail.dateFin).toLocaleDateString()
                  : "En cours"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Type de bail
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Dépôt de garantie
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {bail.locataire.caution.toLocaleString()} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}