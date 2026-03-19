//liste locataire
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COLORS: { bg: string; text: string }[] = [
  { bg: "bg-blue-pastel", text: "text-blue-text" },
  { bg: "bg-violet-pastel", text: "text-violet-text" },
  { bg: "bg-green-pastel", text: "text-green-text" },
  { bg: "bg-amber-pastel", text: "text-amber-text" },
  { bg: "bg-red-pastel", text: "text-red-text" },
  { bg: "bg-cyan-pastel", text: "text-cyan-text" },
];

function getColor(nom: string) {
  let hash = 0;
  for (let i = 0; i < nom.length; i++) {
    hash += nom.charCodeAt(i);
  }
  return COLORS[hash % COLORS.length];
}

function getInitiales(nom: string) {
  const parts = nom.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nom.slice(0, 2).toUpperCase();
}

type Bien = {
  id: number;
  nom: string;
  adresse: string;
  type: string;
  parent: {
    id: number;
    nom: string;
  } | null;
};

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
  bien: Bien;
};

const PAR_PAGE = 10;

export default function LocatairesPage() {
  const router = useRouter();
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [pageActuelle, setPageActuelle] = useState(1);

  useEffect(() => {
    async function fetchLocataires() {
      const response = await fetch("/api/locataires");
      const data = await response.json();
      setLocataires(data);
      setLoading(false);
    }
    fetchLocataires();
  }, []);

  function getNomBien(bien: Bien) {
    if (bien.parent) {
      return `${bien.parent.nom} — ${bien.nom}`;
    }
    return bien.nom;
  }

  const locatairesFiltres = locataires.filter((loc) =>
    loc.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalPages = Math.ceil(locatairesFiltres.length / PAR_PAGE);
  const locatairesPage = locatairesFiltres.slice(
    (pageActuelle - 1) * PAR_PAGE,
    pageActuelle * PAR_PAGE
  );

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading font-bold text-[28px] leading-[34px] tracking-[-0.02em] text-text">
          Locataires
        </h1>
        {locataires.length > 0 && (
          <span className="font-body text-[13px] text-text-tertiary">
            {locatairesFiltres.length} résultat{locatairesFiltres.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="mb-5">
        <div className="relative max-w-[360px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un locataire..."
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPageActuelle(1);
            }}
            className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated pl-9 pr-3 py-[10px] text-sm font-body text-text outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
          />
        </div>
      </div>

      {/* État vide */}
      {locataires.length === 0 ? (
        <div className="bg-surface-elevated rounded-lg border border-border py-12 px-6 text-center">
          <p className="font-body text-sm text-text-tertiary">
            Aucun locataire pour le moment
          </p>
        </div>
      ) : locatairesFiltres.length === 0 ? (
        <div className="bg-surface-elevated rounded-lg border border-border py-12 px-6 text-center">
          <p className="font-body text-sm text-text-tertiary">
            Aucun résultat pour &quot;{recherche}&quot;
          </p>
        </div>
      ) : (
        <>
          {/* En-têtes desktop */}
          <div className="hidden md:flex items-center gap-4 px-5 mb-2">
            <div className="w-8 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              #
            </div>
            <div className="flex-1 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Locataire
            </div>
            <div className="flex-1 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Bien
            </div>
            <div className="w-24 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Entrée
            </div>
            <div className="w-24 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Sortie
            </div>
            <div className="w-20 font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Statut
            </div>
          </div>

          {/* Liste */}
          <div className="grid gap-2">
            {locatairesPage.map((locataire, index) => {
              const color = getColor(locataire.nom);
              return (
                <div
                  key={locataire.id}
                  onClick={() =>
                    router.push(`/dashboard/locataires/${locataire.id}`)
                  }
                  className="bg-surface-elevated rounded-lg border border-border px-5 py-4 cursor-pointer transition-all duration-200 hover:border-border-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  {/* Version mobile */}
                  <div className="md:hidden flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-[13px] ${color.bg} ${color.text}`}
                    >
                      {getInitiales(locataire.nom)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate font-heading font-medium text-[15px] leading-5 text-text m-0">
                        {locataire.nom}
                      </p>
                      <p className="truncate font-body text-[13px] leading-5 text-text-secondary m-0">
                        {getNomBien(locataire.bien)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span
                        className={`inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] ${
                          locataire.statut === "ACTIF"
                            ? "bg-green-pastel text-green-text"
                            : "bg-surface text-text-secondary"
                        }`}
                      >
                        {locataire.statut}
                      </span>
                      <span className="font-body text-xs leading-4 text-text-tertiary">
                        {new Date(locataire.dateEntree).toLocaleDateString()}
                      </span>
                      {locataire.dateSortie && (
                        <span className="font-body text-xs leading-4 text-text-tertiary">
                          → {new Date(locataire.dateSortie).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Version desktop */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="w-8 font-body text-[13px] text-text-tertiary">
                      {(pageActuelle - 1) * PAR_PAGE + index + 1}
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                      <div
                        className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-xs ${color.bg} ${color.text}`}
                      >
                        {getInitiales(locataire.nom)}
                      </div>
                      <span className="font-heading font-medium text-[15px] leading-5 text-text">
                        {locataire.nom}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate font-body text-sm text-text m-0">
                        {getNomBien(locataire.bien)}
                      </p>
                      <p className="truncate font-body text-xs text-text-tertiary m-0">
                        {locataire.bien.adresse}
                      </p>
                    </div>

                    <div className="w-24 font-body text-[13px] text-text-secondary">
                      {new Date(locataire.dateEntree).toLocaleDateString()}
                    </div>

                    <div className="w-24 font-body text-[13px] text-text-secondary">
                      {locataire.dateSortie
                        ? new Date(locataire.dateSortie).toLocaleDateString()
                        : "—"}
                    </div>

                    <div className="w-20">
                      <span
                        className={`inline-block px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] ${
                          locataire.statut === "ACTIF"
                            ? "bg-green-pastel text-green-text"
                            : "bg-surface text-text-secondary"
                        }`}
                      >
                        {locataire.statut}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPageActuelle(pageActuelle - 1)}
                disabled={pageActuelle === 1}
                className="px-3 py-[7px] text-sm font-body text-text-secondary rounded-md border-none bg-transparent cursor-pointer disabled:text-text-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-100"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setPageActuelle(page)}
                    className={`px-[14px] py-[7px] text-sm font-body rounded-md border-none cursor-pointer transition-all duration-100 ${
                      page === pageActuelle
                        ? "bg-primary text-white font-bold"
                        : "bg-transparent text-text-secondary font-normal"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setPageActuelle(pageActuelle + 1)}
                disabled={pageActuelle === totalPages}
                className="px-3 py-[7px] text-sm font-body text-text-secondary rounded-md border-none bg-transparent cursor-pointer disabled:text-text-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-100"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}