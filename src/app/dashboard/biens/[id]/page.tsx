// page details biens + condition pour colocation
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type SousBien = {
  id: number
  nom: string
  adresse: string
  type: string
  description: string | null
  image: string | null
}

type Bien = {
  id: number
  nom: string
  adresse: string
  type: string
  description: string | null
  image: string | null
  parentId: number | null
  sousBiens: SousBien[]
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
}

export default function BienDetailPage() {
  const [bien, setBien] = useState<Bien | null>(null);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchBien() {
      const response = await fetch(`/api/biens/${id}`);
      const data = await response.json();
      setBien(data);
    }
    fetchBien();

    async function fetchLocataire(){
      const response = await fetch(`/api/biens/${id}/locataires`)
      const data = await response.json();
      setLocataires(data);
    }
    fetchLocataire()
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ? (Si c'est une colocation vous supprimerez aussi les chambres)")
    if (!confirmed) return
  
    const response = await fetch(`/api/biens/${id}`, {
      method: "DELETE"
    })
  
    if (response.ok) {
      window.location.href = "/dashboard/biens"
    }
  }

  if (!bien) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation retour */}
      {bien.parentId ? (
        <Link
          href={`/dashboard/biens/${bien.parentId}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Retour à la colocation
        </Link>
      ) : (
        <Link
          href="/dashboard/biens"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Retour aux biens
        </Link>
      )}

      {/* En-tête */}
      <div className="flex gap-3 mt-4">
        <Link
          href={`/dashboard/biens/${bien.id}/modifier`}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
        >
          Modifier
        </Link>
        <button
           onClick={handleDelete}
           className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500 transition-colors"
        >
          Supprimer
        </button>
      </div>

      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{bien.nom}</h1>
        <p className="text-gray-500 mt-1">{bien.adresse}</p>
        <span className="inline-block mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
          {bien.type}
        </span>
      </div>

      {/* Description */}
      {bien.description && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 text-sm">{bien.description}</p>
        </div>
      )}

      {/* Locataires */}
      {/* Section Locataires */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Locataires</h2>
        <Link
           href={`/dashboard/biens/${id}/locataires/nouveau`}
           className="bg-black text-white px-4 py-2 rounded"
        >
            Ajouter un locataire
        </Link>
      </div>

      {locataires.length === 0 ? (
           <p className="text-gray-500">Aucun locataire pour le moment</p>
      ) : (
          <div className="grid gap-4">
            {locataires.map((locataire) => (
              <Link
                key={locataire.id}
                href={`/dashboard/locataires/${locataire.id}`}
                className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{locataire.nom}</p>
                  <p className="text-sm text-gray-500">
                    Entrée : {new Date(locataire.dateEntree).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    locataire.statut === "ACTIF"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {locataire.statut}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Section colocation : chambres + bouton ajout */}
      {bien.type === "COLOCATION" && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Chambres</h2>

          {bien.sousBiens.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-400 text-sm">Aucune chambre pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bien.sousBiens.map((chambre) => (
                <Link key={chambre.id} href={`/dashboard/biens/${chambre.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {chambre.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={chambre.image} alt={chambre.nom} className="h-48 w-full object-cover" />
                    ) : (
                      <div className="h-48 bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-400 text-sm">Image à venir</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="font-semibold text-lg">{chambre.nom}</h2>
                      <p className="text-gray-500 text-sm mt-1">{chambre.adresse}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Link
              href={`/dashboard/biens/${bien.id}/chambres/nouveau`}
              className="inline-block bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
            >
              + Ajouter une chambre
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}