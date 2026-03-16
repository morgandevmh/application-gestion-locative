//menu dashboard
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_25%] gap-4">

        {/* Colonne gauche */}
        <div className="flex flex-col gap-4">

          {/* M1 — Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
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
          <div className="grid grid-cols-2 md:flex gap-4 min-h-[120px]">
            {/* M4 — Taux de remplissage */}
             <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center md:w-[180px]">
               <div className="relative w-20 h-20">
                 <svg viewBox="0 0 36 36" className="w-full h-full">
                   {/* Cercle de fond */}
                   <circle
                     cx="18" cy="18" r="14"
                     fill="none"
                     stroke="#e5e7eb"
                     strokeWidth="4"
                   />
                   {/* Cercle de progression */}
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
              <p className="text-sm text-gray-400">Générer un bail — Bientôt disponible</p>
            </div>
          </div>

          {/* M5 + M6 — Résumé */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[230px]">
            <p className="text-sm text-gray-400">Derniers biens modifiés</p>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="flex flex-col gap-4">
          {/* M2 — Calendrier */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center min-h-[240px]">
            <p className="text-sm text-gray-400">Calendrier </p>
          </div>

          {/* M7 — Derniers locataires */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[360px]">
            <p className="text-sm text-gray-400">Derniers locataires modifiés</p>
          </div>
        </div>

      </div>
    </div>
  );
}