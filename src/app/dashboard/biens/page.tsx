//liste de mes biens 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ModalCreationBien from "@/components/ModalCreationBien";

type Bien = {
  id: number;
  nom: string;
  adresse: string;
  type: string;
  description: string | null;
  image: string | null;
  photoPrincipaleUrl: string | null;
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  APPARTEMENT: { bg: "bg-blue-pastel", text: "text-blue-text" },
  MAISON: { bg: "bg-green-pastel", text: "text-green-text" },
  STUDIO: { bg: "bg-violet-pastel", text: "text-violet-text" },
  COLOCATION: { bg: "bg-amber-pastel", text: "text-amber-text" },
  CHAMBRE: { bg: "bg-cyan-pastel", text: "text-cyan-text" },
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] || { bg: "bg-surface", text: "text-text-secondary" };
}

export default function BiensPage() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOuverte, setModalOuverte] = useState(false);

  function fetchBiens() {
    fetch("/api/biens")
      .then((res) => res.json())
      .then((data) => {
        setBiens(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchBiens();
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
            Mes biens
          </h1>
          {biens.length > 0 && (
            <p className="font-body text-[13px] text-text-tertiary mt-1">
              {biens.length} bien{biens.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {biens.length > 0 && (
          <button
            onClick={() => setModalOuverte(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M7 1v12M1 7h12" />
            </svg>
            Ajouter un bien
          </button>
        )}
      </div>

      {/* État vide */}
      {biens.length === 0 ? (
        <div className="bg-surface-elevated rounded-lg border border-border py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-glass-light flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12L12 5l9 7" />
              <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
            </svg>
          </div>
          <p className="font-body text-[15px] text-text-secondary">
            Vous n&apos;avez pas encore de biens
          </p>
          <p className="font-body text-[13px] text-text-tertiary mt-1">
            Commencez par ajouter votre premier bien
          </p>
          <button
            onClick={() => setModalOuverte(true)}
            className="inline-flex items-center gap-2 mt-5 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M7 1v12M1 7h12" />
            </svg>
            Ajouter un bien
          </button>
        </div>
      ) : (
        /* Grille de biens */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {biens.map((bien) => {
            const typeColor = getTypeColor(bien.type);
            return (
              <Link
                key={bien.id}
                href={`/dashboard/biens/${bien.id}`}
                className="group no-underline"
              >
                <div className="bg-surface-elevated rounded-lg border border-border overflow-hidden transition-all duration-200 group-hover:border-border-hover group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  {/* Image */}
                  {bien.photoPrincipaleUrl || bien.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bien.photoPrincipaleUrl || bien.image!}
                    alt={bien.nom}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                    <div className="h-44 bg-surface flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-tertiary)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                      >
                        <path d="M3 12L12 5l9 7" />
                        <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
                      </svg>
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="p-5">
                    <h2 className="font-heading font-medium text-[15px] leading-5 text-text">
                      {bien.nom}
                    </h2>
                    <p className="font-body text-[13px] leading-5 text-text-secondary mt-1 truncate">
                      {bien.adresse}
                    </p>
                    <div className="flex items-center mt-3">
                      <span
                        className={`px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] ${typeColor.bg} ${typeColor.text}`}
                      >
                        {bien.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modale création bien */}
      {modalOuverte && (
        <ModalCreationBien
          onClose={() => setModalOuverte(false)}
          onSuccess={() => {
            setModalOuverte(false);
            fetchBiens();
          }}
        />
      )}
    </div>
  );
}