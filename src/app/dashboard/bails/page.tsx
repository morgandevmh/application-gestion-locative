// page liste des baux 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ModalCreationBail from "@/components/ModalCreationBail";

type Bail = {
  id: number;
  dateDebut: string;
  dateFin: string | null;
  loyerEncadre: number | null;
  complementLoyer: number;
  charges: number;
  typeBail: string;
  locataire: {
    id: number;
    nom: string;
  };
  bien: {
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

function getLoyerTotal(bail: Bail) {
  return (bail.loyerEncadre || 0) + bail.complementLoyer + bail.charges;
}

function isBailActif(bail: Bail) {
  if (!bail.dateFin) return true;
  return new Date(bail.dateFin) >= new Date();
}

export default function BauxPage() {
  const [baux, setBaux] = useState<Bail[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOuverte, setModalOuverte] = useState(false);

  useEffect(() => {
    fetch("/api/baux")
      .then((res) => res.json())
      .then((data) => {
        setBaux(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-text-secondary">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-[28px] leading-[34px] tracking-[-0.02em] text-text">
            Mes baux
          </h1>
          {baux.length > 0 && (
            <p className="font-body text-[13px] text-text-tertiary mt-1">
              {baux.length} {baux.length !== 1 ? "baux" : "bail"}
            </p>
          )}
        </div>
        {baux.length > 0 && (
          <button
          onClick={() => setModalOuverte(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Nouveau bail
        </button>
        )}
      </div>

      {/* État vide */}
      {baux.length === 0 ? (
        <div className="bg-surface-elevated rounded-lg border border-border py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-glass-light flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
              <path d="M7 7h6M7 10h6M7 13h3" />
            </svg>
          </div>
          <p className="font-body text-[15px] text-text-secondary">
            Vous n&apos;avez pas encore de baux
          </p>
          <p className="font-body text-[13px] text-text-tertiary mt-1">
            Commencez par créer votre premier bail
          </p>
          <button
            onClick={() => setModalOuverte(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm           border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 1v12M1 7h12" />
            </svg>
            Nouveau bail
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {baux.map((bail) => {
            const actif = isBailActif(bail);
            const loyerTotal = getLoyerTotal(bail);

            return (
              <Link
                key={bail.id}
                href={`/dashboard/bails/${bail.id}`}
                className="bg-surface-elevated rounded-lg border border-border p-4 md:px-5 no-underline transition-all duration-200 hover:border-border-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                {/* Desktop */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-[14px] min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        actif ? "bg-blue-pastel" : "bg-surface"
                      }`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke={actif ? "#0055b3" : "var(--text-tertiary)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                        <path d="M7 7h6M7 10h6M7 13h3" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-medium text-[15px] leading-5 text-text m-0">
                        Bail — {bail.locataire.nom}
                      </p>
                      <p className="font-body text-[13px] text-text-secondary mt-[2px] m-0 truncate">
                        {bail.bien.nom} · {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="font-heading font-medium text-[15px] text-text m-0">
                        {loyerTotal.toLocaleString()} €/mois
                      </p>
                      <p className="font-body text-xs text-text-tertiary mt-[2px] m-0">
                        {new Date(bail.dateDebut).toLocaleDateString()}
                        {bail.dateFin
                          ? ` → ${new Date(bail.dateFin).toLocaleDateString()}`
                          : " → En cours"}
                      </p>
                    </div>
                    <span
                      className={`px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] ${
                        actif
                          ? "bg-green-pastel text-green-text"
                          : "bg-surface text-text-secondary"
                      }`}
                    >
                      {actif ? "Actif" : "Expiré"}
                    </span>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      actif ? "bg-blue-pastel" : "bg-surface"
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke={actif ? "#0055b3" : "var(--text-tertiary)"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                      <path d="M7 7h6M7 10h6M7 13h3" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-heading font-medium text-[15px] text-text m-0 truncate">
                        {bail.locataire.nom}
                      </p>
                      <span
                        className={`px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0 ml-2 ${
                          actif
                            ? "bg-green-pastel text-green-text"
                            : "bg-surface text-text-secondary"
                        }`}
                      >
                        {actif ? "Actif" : "Expiré"}
                      </span>
                    </div>
                    <p className="font-body text-[13px] text-text-secondary mt-[2px] m-0 truncate">
                      {bail.bien.nom} · {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
                    </p>
                    <p className="font-heading font-medium text-[13px] text-text mt-1 m-0">
                      {loyerTotal.toLocaleString()} €/mois
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {modalOuverte && (
        <ModalCreationBail
          onClose={() => setModalOuverte(false)}
          onSuccess={() => {
            setModalOuverte(false);
            fetch("/api/baux")
              .then((res) => res.json())
              .then((data) => setBaux(data));
          }}
        />
      )}
    </div>
  );
}