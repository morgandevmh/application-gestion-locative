//page fiche locataire 
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ModalModificationLocataire from "@/components/ModalModificationLocataire";

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

export default function LocataireDetailPage() {
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const [modalModifierLocataire, setModalModifierLocataire] = useState(false);
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
    <div className="max-w-3xl mx-auto">
      {/* Lien retour */}
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
         ← Retour
      </button>

      {/* Header card — gradient */}
      <div
        className="mb-8 rounded-xl"
        style={{
          background:
            "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 60%, #1a2a4a 85%, #1a2a4a 100%)",
        }}
      >
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4 px-7 py-6">
          <div className="flex items-center gap-[14px] min-w-0">
            {locataire.statut === "ACTIF" ? (
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
                SORTI
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[20px] leading-[26px] tracking-[-0.01em] text-white m-0 truncate">
                {locataire.nom}
              </h1>
              <p className="font-body text-[13px] text-white/55 m-0 mt-[2px] truncate">
                {locataire.bien.nom}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setModalModifierLocataire(true)}
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
            {locataire.statut === "ACTIF" ? (
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
                SORTI
              </span>
            )}
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[17px] leading-[22px] tracking-[-0.01em] text-white m-0 truncate">
                {locataire.nom}
              </h1>
              <p className="font-body text-xs text-white/55 m-0 mt-[2px] truncate">
                {locataire.bien.nom}
              </p>
            </div>
          </div>
          <div className="flex gap-[6px] shrink-0">
          <button
            onClick={() => setModalModifierLocataire(true)}
            className="flex items-center justify-center w-[34px] h-[34px] rounded-md bg-glass-on-gradient border          border-glass-on-gradient-border transition-all duration-100 hover:bg-glass-on-gradient-hover"
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

      {modalModifierLocataire && (
        <ModalModificationLocataire
          locataireId={id}
          onClose={() => setModalModifierLocataire(false)}
        />
      )}

    </div>
  );
}