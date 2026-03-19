//page fiche locataire 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  bien: {
    id: number;
    nom: string;
  };
};

function getInitiales(nom: string) {
  const parts = nom.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nom.slice(0, 2).toUpperCase();
}

export default function LocataireDetailPage() {
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    async function fetchLocataire() {
      const response = await fetch(`/api/locataires/${id}`);
      const data = await response.json();
      setLocataire(data);
    }
    fetchLocataire();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce locataire ?"
    );
    if (!confirmed) return;

    const response = await fetch(`/api/locataires/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.href = `/dashboard/biens/${locataire?.bien.id}`;
    }
  }

  if (!locataire) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-text-secondary">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Lien retour */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 font-body text-sm text-secondary bg-transparent border-none cursor-pointer p-0 mb-4 transition-colors duration-200 hover:text-text"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 12L6 8l4-4" />
        </svg>
        Retour
      </button>

      {/* Header card — gradient (inline style nécessaire pour le gradient custom) */}
      <div
        className="mb-8 rounded-xl p-8"
        style={{
          background:
            "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 40%, #14365d 75%, #0071e3 100%)",
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Avatar + infos */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-xl text-white border border-glass-on-gradient-border bg-glass-on-gradient-hover"
            >
              {getInitiales(locataire.nom)}
            </div>
            <div>
              <h1 className="font-heading font-bold text-[22px] leading-7 tracking-[-0.01em] text-white m-0">
                {locataire.nom}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                {locataire.statut === "ACTIF" ? (
                  <span
                    className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px]"
                    style={{
                      background: "rgba(52, 199, 89, 0.2)",
                      color: "#5ee87a",
                      border: "1px solid rgba(52, 199, 89, 0.3)",
                    }}
                  >
                    ACTIF
                  </span>
                ) : (
                  <span className="inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] bg-glass-on-gradient text-white/65 border border-glass-on-gradient-border">
                    {locataire.statut}
                  </span>
                )}
                <span className="font-body text-[13px] text-white/55">
                  {locataire.bien.nom}
                </span>
              </div>
            </div>
          </div>

          {/* Actions — glass on gradient */}
          <div className="flex gap-2">
            <Link
              href={`/dashboard/locataires/${locataire.id}/modifier`}
              className="inline-flex items-center gap-2 px-[22px] py-[10px] rounded-md bg-glass-on-gradient border border-glass-on-gradient-border text-white font-body font-bold text-sm no-underline cursor-pointer transition-all duration-100 hover:bg-glass-on-gradient-hover"
            >
              <svg
                width="14"
                height="14"
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
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-[22px] py-[10px] rounded-md font-body font-bold text-sm cursor-pointer transition-all duration-100"
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
                width="14"
                height="14"
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
      </div>

      {/* Grille infos : Contact + Informations */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Contact */}
        <div>
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Contact
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5 flex flex-col gap-4 min-h-[350px]">
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Email
              </p>
              <p className={`font-body text-[15px] m-0 ${locataire.email ? "text-text" : "text-text-tertiary"}`}>
                {locataire.email || "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Téléphone
              </p>
              <p className={`font-body text-[15px] m-0 ${locataire.telephone ? "text-text" : "text-text-tertiary"}`}>
                {locataire.telephone || "Non renseigné"}
              </p>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div>
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Informations
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5 flex flex-col gap-4 min-h-[350px]">
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Date d&apos;entrée
              </p>
              <p className="font-body text-[15px] text-text m-0">
                {new Date(locataire.dateEntree).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Date de sortie
              </p>
              <p className={`font-body text-[15px] m-0 ${locataire.dateSortie ? "text-text" : "text-text-tertiary"}`}>
                {locataire.dateSortie
                  ? new Date(locataire.dateSortie).toLocaleDateString()
                  : "En cours"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-text-tertiary m-0 mb-[2px]">
                Caution
              </p>
              <p className="font-heading font-bold text-[22px] leading-7 tracking-[-0.01em] text-text m-0">
                {locataire.caution.toLocaleString()} €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {locataire.notes && (
        <div className="mb-8">
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Notes
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5">
            <p className="font-body text-[15px] leading-6 text-text-secondary m-0 whitespace-pre-wrap">
              {locataire.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}