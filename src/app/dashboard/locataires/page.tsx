//liste locataires
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#3b82f6",
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
  id: number
  nom: string
  adresse: string
  type: string
  parent: {
    id: number
    nom: string
  } | null
}

type Locataire = {
  id: number
  nom: string
  email: string | null
  telephone: string | null
  dateEntree: string
  dateSortie: string | null
  caution: number
  statut: string
  notes: string | null
  bien: Bien
}

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

  // recherche => pagination
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
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tete */}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Locataires</h1>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un locataire..."
          value={recherche}
          onChange={(e) => {
            setRecherche(e.target.value);
            setPageActuelle(1);
          }}
          className="w-full md:w-80 border border-gray-200 rounded-lg p-2 text-sm"
        />
      </div>

      {/* etat vide */}
      {locataires.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Aucun locataire pour le moment</p>
        </div>
      ) : locatairesFiltres.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Aucun résultat pour &quot;{recherche}&quot;</p>
        </div>
      ) : (
        <>
          {/* En-tetes desktop */}
          <div className="hidden md:flex items-center gap-4 px-4 py-2 mb-2 text-xs font-medium text-gray-500">
            <div className="w-8">#</div>
            <div className="flex-1">Locataire</div>
            <div className="flex-1">Bien</div>
            <div className="w-24">Entrée</div>
            <div className="w-24">Sortie</div>
            <div className="w-20">Statut</div>
          </div>

          {/* Liste des locataires */}
          <div className="grid gap-3">
            {locatairesPage.map((locataire, index) => (
              <div
                key={locataire.id}
                onClick={() => router.push(`/dashboard/locataires/${locataire.id}`)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {/* Version mobile */}
                <div className="md:hidden flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                    style={{ backgroundColor: getColor(locataire.nom) }}
                  >
                    {getInitiales(locataire.nom)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {locataire.nom}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getNomBien(locataire.bien)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-center gap-1 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        locataire.statut === "ACTIF"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {locataire.statut}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(locataire.dateEntree).toLocaleDateString()}
                    </span>
                    {locataire.dateSortie && (
                      <span className="text-xs text-gray-400">
                        → {new Date(locataire.dateSortie).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Version desktop */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="w-8 text-sm text-gray-400">
                    {(pageActuelle - 1) * PAR_PAGE + index + 1}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                      style={{ backgroundColor: getColor(locataire.nom) }}
                    >
                      {getInitiales(locataire.nom)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {locataire.nom}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{getNomBien(locataire.bien)}</p>
                    <p className="text-xs text-gray-400 truncate">{locataire.bien.adresse}</p>
                  </div>
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(locataire.dateEntree).toLocaleDateString()}
                  </div>
                  <div className="w-24 text-sm text-gray-600">
                    {locataire.dateSortie
                      ? new Date(locataire.dateSortie).toLocaleDateString()
                      : "—"}
                  </div>
                  <div className="w-20">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        locataire.statut === "ACTIF"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {locataire.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPageActuelle(pageActuelle - 1)}
                disabled={pageActuelle === 1}
                className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-300 px-2 py-1"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPageActuelle(page)}
                  className={`text-sm px-3 py-1 rounded-lg ${
                    page === pageActuelle
                      ? "bg-slate-800 text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setPageActuelle(pageActuelle + 1)}
                disabled={pageActuelle === totalPages}
                className="text-sm text-gray-500 hover:text-gray-900 disabled:text-gray-300 px-2 py-1"
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