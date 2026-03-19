//liste locataire
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COLORS: { bg: string; text: string }[] = [
  { bg: "var(--color-blue-pastel)", text: "var(--color-blue-text)" },
  { bg: "var(--color-violet-pastel)", text: "var(--color-violet-text)" },
  { bg: "var(--color-green-pastel)", text: "var(--color-green-text)" },
  { bg: "var(--color-amber-pastel)", text: "var(--color-amber-text)" },
  { bg: "var(--color-red-pastel)", text: "var(--color-red-text)" },
  { bg: "var(--color-cyan-pastel)", text: "var(--color-cyan-text)" },
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
      <div
        className="flex items-center justify-center"
        style={{ height: 256 }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* En-tête */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "var(--space-6)" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: 28,
            lineHeight: "34px",
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Locataires
        </h1>
        {locataires.length > 0 && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-tertiary)",
            }}
          >
            {locatairesFiltres.length} résultat{locatairesFiltres.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <div style={{ position: "relative", maxWidth: 360 }}>
          {/* Icône loupe */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
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
            style={{
              width: "100%",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "10px 12px 10px 36px",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              background: "var(--surface-elevated)",
              outline: "none",
              transition: `border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--glass-accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* État vide */}
      {locataires.length === 0 ? (
        <div
          style={{
            background: "var(--surface-elevated)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: "var(--space-12) var(--space-6)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-tertiary)",
            }}
          >
            Aucun locataire pour le moment
          </p>
        </div>
      ) : locatairesFiltres.length === 0 ? (
        <div
          style={{
            background: "var(--surface-elevated)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: "var(--space-12) var(--space-6)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-tertiary)",
            }}
          >
            Aucun résultat pour &quot;{recherche}&quot;
          </p>
        </div>
      ) : (
        <>
          {/* En-têtes desktop */}
          <div
            className="hidden md:flex items-center"
            style={{
              gap: "var(--space-4)",
              padding: "0 var(--space-5)",
              marginBottom: "var(--space-2)",
            }}
          >
            <div
              style={{
                width: 32,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              #
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              Locataire
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              Bien
            </div>
            <div
              style={{
                width: 96,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              Entrée
            </div>
            <div
              style={{
                width: 96,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              Sortie
            </div>
            <div
              style={{
                width: 80,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--text-tertiary)",
              }}
            >
              Statut
            </div>
          </div>

          {/* Liste */}
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {locatairesPage.map((locataire, index) => {
              const color = getColor(locataire.nom);
              return (
                <div
                  key={locataire.id}
                  onClick={() =>
                    router.push(`/dashboard/locataires/${locataire.id}`)
                  }
                  style={{
                    background: "var(--surface-elevated)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    padding: "var(--space-4) var(--space-5)",
                    cursor: "pointer",
                    transition: `border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Version mobile */}
                  <div className="md:hidden flex items-center" style={{ gap: "var(--space-3)" }}>
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--radius-full)",
                        background: color.bg,
                        color: color.text,
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {getInitiales(locataire.nom)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 500,
                          fontSize: 15,
                          lineHeight: "20px",
                          color: "var(--text)",
                          margin: 0,
                        }}
                      >
                        {locataire.nom}
                      </p>
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          lineHeight: "20px",
                          color: "var(--text-secondary)",
                          margin: 0,
                        }}
                      >
                        {getNomBien(locataire.bien)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0" style={{ gap: "var(--space-1)" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: 11,
                          background:
                            locataire.statut === "ACTIF"
                              ? "var(--color-green-pastel)"
                              : "var(--surface)",
                          color:
                            locataire.statut === "ACTIF"
                              ? "var(--color-green-text)"
                              : "var(--text-secondary)",
                        }}
                      >
                        {locataire.statut}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          lineHeight: "16px",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {new Date(locataire.dateEntree).toLocaleDateString()}
                      </span>
                      {locataire.dateSortie && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            lineHeight: "16px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          → {new Date(locataire.dateSortie).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Version desktop */}
                  <div
                    className="hidden md:flex items-center"
                    style={{ gap: "var(--space-4)" }}
                  >
                    <div
                      style={{
                        width: 32,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {(pageActuelle - 1) * PAR_PAGE + index + 1}
                    </div>

                    <div
                      className="flex-1 flex items-center"
                      style={{ gap: "var(--space-3)" }}
                    >
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "var(--radius-full)",
                          background: color.bg,
                          color: color.text,
                          fontFamily: "var(--font-heading)",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {getInitiales(locataire.nom)}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 500,
                          fontSize: 15,
                          lineHeight: "20px",
                          color: "var(--text)",
                        }}
                      >
                        {locataire.nom}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--text)",
                          margin: 0,
                        }}
                      >
                        {getNomBien(locataire.bien)}
                      </p>
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          margin: 0,
                        }}
                      >
                        {locataire.bien.adresse}
                      </p>
                    </div>

                    <div
                      style={{
                        width: 96,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {new Date(locataire.dateEntree).toLocaleDateString()}
                    </div>

                    <div
                      style={{
                        width: 96,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {locataire.dateSortie
                        ? new Date(locataire.dateSortie).toLocaleDateString()
                        : "—"}
                    </div>

                    <div style={{ width: 80 }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: 11,
                          background:
                            locataire.statut === "ACTIF"
                              ? "var(--color-green-pastel)"
                              : "var(--surface)",
                          color:
                            locataire.statut === "ACTIF"
                              ? "var(--color-green-text)"
                              : "var(--text-secondary)",
                        }}
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
            <div
              className="flex justify-center items-center"
              style={{
                gap: "var(--space-2)",
                marginTop: "var(--space-8)",
              }}
            >
              <button
                onClick={() => setPageActuelle(pageActuelle - 1)}
                disabled={pageActuelle === 1}
                style={{
                  padding: "7px 12px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  color: pageActuelle === 1 ? "var(--text-tertiary)" : "var(--text-secondary)",
                  background: "transparent",
                  border: "none",
                  cursor: pageActuelle === 1 ? "not-allowed" : "pointer",
                  opacity: pageActuelle === 1 ? 0.4 : 1,
                  borderRadius: "var(--radius-md)",
                  transition: `color var(--duration-fast) var(--ease-out)`,
                }}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setPageActuelle(page)}
                    style={{
                      padding: "7px 14px",
                      fontSize: 14,
                      fontFamily: "var(--font-body)",
                      fontWeight: page === pageActuelle ? 700 : 400,
                      color:
                        page === pageActuelle ? "#ffffff" : "var(--text-secondary)",
                      background:
                        page === pageActuelle ? "var(--primary)" : "transparent",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: `all var(--duration-fast) var(--ease-out)`,
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setPageActuelle(pageActuelle + 1)}
                disabled={pageActuelle === totalPages}
                style={{
                  padding: "7px 12px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  color:
                    pageActuelle === totalPages
                      ? "var(--text-tertiary)"
                      : "var(--text-secondary)",
                  background: "transparent",
                  border: "none",
                  cursor: pageActuelle === totalPages ? "not-allowed" : "pointer",
                  opacity: pageActuelle === totalPages ? 0.4 : 1,
                  borderRadius: "var(--radius-md)",
                  transition: `color var(--duration-fast) var(--ease-out)`,
                }}
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