//menu dashboard
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type DashboardData = {
  user: { name: string };
  resumeGlobal: { totalBiens: number; totalLocataires: number; totalCautions: number };
  patrimoine: Record<string, number>;
  remplissage: { total: number; loues: number };
  derniersLocataires: {
    id: number;
    nom: string;
    email: string | null;
    telephone: string | null;
    statut: string;
    updatedAt: string;
    bien: { id: number; nom: string; type: string; parent: { nom: string } | null };
  }[];
  derniersBiens: {
    id: number;
    nom: string;
    adresse: string;
    type: string;
    image: string | null;
    updatedAt: string;
  }[];
};

const AVATAR_COLORS: { bg: string; text: string }[] = [
  { bg: "bg-blue-pastel", text: "text-blue-text" },
  { bg: "bg-violet-pastel", text: "text-violet-text" },
  { bg: "bg-green-pastel", text: "text-green-text" },
  { bg: "bg-amber-pastel", text: "text-amber-text" },
  { bg: "bg-red-pastel", text: "text-red-text" },
  { bg: "bg-cyan-pastel", text: "text-cyan-text" },
];

const TYPE_LABELS: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  COLOCATION: "Colocation",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  APPARTEMENT: { bg: "bg-blue-pastel", text: "text-blue-text" },
  MAISON: { bg: "bg-green-pastel", text: "text-green-text" },
  STUDIO: { bg: "bg-violet-pastel", text: "text-violet-text" },
  COLOCATION: { bg: "bg-amber-pastel", text: "text-amber-text" },
};

function getAvatarColor(nom: string) {
  let hash = 0;
  for (let i = 0; i < nom.length; i++) {
    hash += nom.charCodeAt(i);
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitiales(nom: string) {
  const parts = nom.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nom.slice(0, 2).toUpperCase();
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/connexion");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-text-secondary">Chargement...</p>
      </div>
    );
  }

  if (!data) return null;

  const remplissagePct =
    data.remplissage.total > 0
      ? Math.round((data.remplissage.loues / data.remplissage.total) * 100)
      : 0;

  const remplissageArc =
    data.remplissage.total > 0
      ? (data.remplissage.loues / data.remplissage.total) * 87.96
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_25%] gap-3 lg:h-full">

        {/* colonne gauche */}
        <div className="flex flex-col gap-3 lg:min-h-0">

          {/* M1 — Header gradient */}
          <div
            className="rounded-xl px-6 py-4 flex items-center justify-between shrink-0"
            style={{
              background:
                "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 40%, #1a2a4a 75%, #1a2a4a 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-glass-on-gradient-hover border border-glass-on-gradient-border">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
                </svg>
              </div>
              <p className="font-heading font-bold text-[15px] text-white m-0">
                {data.user.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-[6px] px-4 py-[7px] rounded-md bg-glass-on-gradient border border-glass-on-gradient-border text-white font-body font-bold text-xs cursor-pointer transition-all duration-100 hover:bg-glass-on-gradient-hover"
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
                <path d="M5 1H3a1 1 0 00-1 1v10a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" />
              </svg>
              Déconnexion
            </button>
          </div>

          {/* M3 + M4 */}
          <div className="grid grid-cols-2 md:flex gap-3 shrink-0">
            {/* M4 — Taux de remplissage */}
            <div className="bg-surface-elevated rounded-lg border border-border p-4 flex flex-col items-center justify-center md:w-[180px]">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeDasharray={`${remplissageArc} 87.96`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading font-bold text-sm text-text">
                    {remplissagePct}%
                  </span>
                </div>
              </div>
              <p className="font-body text-xs text-text-secondary mt-2">
                Remplissage
              </p>
              <p className="font-body text-xs text-text-tertiary">
                {data.remplissage.loues}/{data.remplissage.total}
              </p>
            </div>

            {/* M3 — Générer bail */}
            <div className="md:flex-1 bg-surface-elevated rounded-lg border border-border p-4 flex items-center justify-center">
              <p className="font-body text-sm text-text-tertiary">
                Générer un bail
              </p>
            </div>
          </div>

          {/* M5 + M6 — Résumé */}
          <div className="bg-surface-elevated rounded-lg border border-border p-5 shrink-0 lg:max-h-[160px]">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Résumé global — 70% */}
              <div className="md:flex-[7]">
                <h3 className="font-heading py-2 font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
                  Résumé global
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg p-3 text-center">
                    <p className="font-heading font-bold text-[28px] leading-8 tracking-[-0.02em] text-text m-0">
                      {data.resumeGlobal.totalBiens}
                    </p>
                    <p className="font-body text-xs text-text-secondary mt-1">
                      Biens
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center">
                    <p className="font-heading font-bold text-[28px] leading-8 tracking-[-0.02em] text-text m-0">
                      {data.resumeGlobal.totalLocataires}
                    </p>
                    <p className="font-body text-xs text-text-secondary mt-1">
                      Locataires
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center">
                  <p className="font-heading font-bold text-[28px] leading-8 tracking-[-0.02em] text-text m-0">
                    {data.resumeGlobal.totalCautions.toLocaleString()}
                  </p>
                  <p className="font-body text-xs text-text-secondary mt-1">
                    Cautions (€)
                  </p>
                </div>
                </div>
              </div>

              {/* Patrimoine — 30% */}
              <div className="md:flex-[3] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                <h3 className="font-heading py-1 font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
                  Patrimoine
                </h3>
                <div className="flex flex-col gap-1">
                  {Object.entries(data.patrimoine).map(([type, count]) => {
                    const tc = TYPE_COLORS[type] || {
                      bg: "bg-surface",
                      text: "text-text-secondary",
                    };
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className={`font-body font-bold text-[11px] ${tc.text} ${tc.bg} px-1 rounded-sm`}>
                          {TYPE_LABELS[type] || type}
                          {count > 1 ? "s" : ""}
                        </span>
                        <span className="font-heading font-bold text-sm text-text">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* M8 — Derniers biens */}
          <div className="bg-surface-elevated rounded-lg border border-border p-5 flex-1 min-h-0 overflow-hidden flex flex-col">
            <h3 className="font-heading pb-4 font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3 shrink-0">
              Derniers biens modifiés
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 min-h-0 [&>*:nth-child(n+3)]:hidden md:[&>*:nth-child(n+3)]:flex">
              {data.derniersBiens.length === 0 ? (
                <p className="font-body text-sm text-text-tertiary">Aucun bien</p>
              ) : (
                data.derniersBiens.map((bien) => {
                  const tc = TYPE_COLORS[bien.type] || {
                    bg: "bg-surface",
                    text: "text-text-secondary",
                  };
                  return (
                    <div
                      key={bien.id}
                      onClick={() =>
                        router.push(`/dashboard/biens/${bien.id}`)
                      }
                      className="rounded-lg border max-h-[300px] border-border hover:border-border-hover cursor-pointer transition-all duration-200 overflow-hidden flex flex-col hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex-1 min-h-0 bg-surface">
                        {bien.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={bien.image}
                            alt={bien.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--text-tertiary)"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-40"
                            >
                              <path d="M3 12L12 5l9 7" />
                              <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-2 shrink-0">
                        <p className="font-heading font-medium text-sm text-text truncate m-0">
                          {bien.nom}
                        </p>
                        <p className="font-body text-xs text-text-secondary truncate mt-[2px] m-0">
                          {bien.adresse}
                        </p>
                        <span
                          className={`inline-block mt-2 px-[8px] py-[2px] rounded-full font-body font-bold text-[10px] ${tc.bg} ${tc.text}`}
                        >
                          {TYPE_LABELS[bien.type] || bien.type}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite  */}
        <div className="flex flex-col gap-3 lg:min-h-0">
          {/* M2 — Calendrier */}
          <div className="bg-surface-elevated rounded-lg border border-border p-4 flex items-center justify-center shrink-0 lg:flex-[30]">
            <p className="font-body text-sm text-text-tertiary">Calendrier</p>
          </div>

          {/* M7 — Derniers locataires (gradient) */}
          <div
            className="rounded-xl p-5 lg:flex-[70] min-h-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 40%, #1a2a4a 75%, #1a2a4a 100%)",
            }}
          >
            <h3 className="font-heading py-2 font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-white/45 mb-4">
              Derniers locataires modifiés
            </h3>
            <div className="flex flex-col gap-3">
              {data.derniersLocataires.length === 0 ? (
                <p className="font-body text-sm text-white/45">
                  Aucun locataire
                </p>
              ) : (
                data.derniersLocataires.map((locataire) => {
                  const color = getAvatarColor(locataire.nom);
                  const initiales = getInitiales(locataire.nom);
                  const nomBien = locataire.bien.parent
                    ? `${locataire.bien.parent.nom} — ${locataire.bien.nom}`
                    : locataire.bien.nom;

                  return (
                    <div
                      key={locataire.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/locataires/${locataire.id}`
                        )
                      }
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-glass-on-gradient-hover border border-glass-on-gradient-border"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs shrink-0 ${color.bg} ${color.text}`}
                      >
                        {initiales}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-medium text-sm text-white truncate m-0">
                          {locataire.nom}
                        </p>
                        <p className="font-body text-xs text-white/55 truncate m-0">
                          {nomBien}
                        </p>
                      </div>
                      <span
                        className={`px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] shrink-0 ${
                          locataire.statut === "ACTIF"
                            ? ""
                            : "bg-glass-on-gradient text-white/65 border border-glass-on-gradient-border"
                        }`}
                        style={
                          locataire.statut === "ACTIF"
                            ? {
                                background: "rgba(52, 199, 89, 0.2)",
                                color: "#5ee87a",
                                border: "1px solid rgba(52, 199, 89, 0.3)",
                              }
                            : undefined
                        }
                      >
                        {locataire.statut === "ACTIF" ? "Actif" : "Sorti"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}