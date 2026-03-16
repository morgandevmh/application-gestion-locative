"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type DashboardData = {
  user: { name: string };
  resumeGlobal: { totalBiens: number; totalLocataires: number; totalCautions: number };
  patrimoine: Record<string, number>;
  remplissage: { capacite: number; actifs: number };
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
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
    "#eab308", "#22c55e", "#14b8a6", "#3b82f6",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_25%] gap-3 lg:h-full">

        {/* Colonne gauche */}
        <div className="flex flex-col gap-3 lg:min-h-0">

          {/* M1 — Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-slate-500 text-lg">👤</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{data.user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {/* M3 + M4 */}
          <div className="grid grid-cols-2 md:flex gap-3 shrink-0">
            {/* M4 — Taux de remplissage */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center md:w-[180px]">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    strokeDasharray={`${data.remplissage.capacite > 0 ? (data.remplissage.actifs / data.remplissage.capacite) * 87.96 : 0} 87.96`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {data.remplissage.capacite > 0
                      ? Math.round((data.remplissage.actifs / data.remplissage.capacite) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Remplissage</p>
              <p className="text-xs text-gray-400">{data.remplissage.actifs}/{data.remplissage.capacite}</p>
            </div>
            {/* M3 — Générer bail */}
            <div className="md:flex-1 bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center">
              <p className="text-sm text-gray-400">Générer un bail</p>
            </div>
          </div>

          {/* M5 + M6 — Résumé */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 shrink-0">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Résumé global — 70% */}
              <div className="md:flex-[7]">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Résumé global</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.resumeGlobal.totalBiens}</p>
                    <p className="text-xs text-gray-500">Biens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.resumeGlobal.totalLocataires}</p>
                    <p className="text-xs text-gray-500">Locataires</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{data.resumeGlobal.totalCautions.toLocaleString()}&nbsp;€</p>
                    <p className="text-xs text-gray-500">Cautions</p>
                  </div>
                </div>
              </div>
              {/* Patrimoine — 30% */}
              <div className="md:flex-[3] border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Patrimoine</h3>
                <div className="flex flex-col gap-1">
                  {Object.entries(data.patrimoine).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {type === "APPARTEMENT" && "Appartement"}
                        {type === "MAISON" && "Maison"}
                        {type === "STUDIO" && "Studio"}
                        {type === "COLOCATION" && "Colocation"}
                        {count > 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* M8 — Derniers biens */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 min-h-0 overflow-hidden flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 mb-3 shrink-0">Derniers biens modifiés</h3>
            <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
              {data.derniersBiens.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun bien</p>
              ) : (
                data.derniersBiens.map((bien) => (
                  <div
                    key={bien.id}
                    onClick={() => router.push(`/dashboard/biens/${bien.id}`)}
                    className="rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors overflow-hidden flex flex-col"
                  >
                    <div className="flex-1 min-h-0 bg-gray-100">
                      {bien.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bien.image} alt={bien.nom} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Pas d&apos;image
                        </div>
                      )}
                    </div>
                    <div className="p-2 shrink-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{bien.nom}</p>
                      <p className="text-xs text-gray-500 truncate">{bien.adresse}</p>
                      <span className="text-xs text-gray-400">
                        {bien.type === "APPARTEMENT" && "Appartement"}
                        {bien.type === "MAISON" && "Maison"}
                        {bien.type === "STUDIO" && "Studio"}
                        {bien.type === "COLOCATION" && "Colocation"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Colonne droite */}
        <div className="flex flex-col gap-3 lg:min-h-0">
          {/* M2 — Calendrier */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center shrink-0 lg:flex-[30]">
            <p className="text-sm text-gray-400">Calendrier</p>
          </div>

          {/* M7 — Derniers locataires */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:flex-[70] min-h-0 overflow-hidden">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Derniers locataires modifiés</h3>
            <div className="flex flex-col gap-2">
              {data.derniersLocataires.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun locataire</p>
              ) : (
                data.derniersLocataires.map((locataire) => {
                  const colorIndex = locataire.nom
                    .split("")
                    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length;
                  const initiales = locataire.nom
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  const nomBien =
                    locataire.bien.parent
                      ? `${locataire.bien.parent.nom} — ${locataire.bien.nom}`
                      : locataire.bien.nom;

                  return (
                    <div
                      key={locataire.id}
                      onClick={() => router.push(`/dashboard/locataires/${locataire.id}`)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                        style={{ backgroundColor: COLORS[colorIndex] }}
                      >
                        {initiales}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{locataire.nom}</p>
                        <p className="text-xs text-gray-500 truncate">{nomBien}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                        locataire.statut === "ACTIF"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}>
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