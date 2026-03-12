//page fiche locataire 
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";


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
  bien: {
    id: number
    nom: string
  }
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
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce locataire ?");
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
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Lien retour vers le bien */}
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
         ← Retour
      </button>

      {/* Boutons actions */}
      <div className="flex gap-3 mt-4">
        <Link
          href={`/dashboard/locataires/${locataire.id}/modifier`}
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

      {/* En-tête */}
      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{locataire.nom}</h1>
        <span
          className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
            locataire.statut === "ACTIF"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {locataire.statut}
        </span>
      </div>

      {/* Infos contact */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Contact</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
          <p className="text-sm text-gray-600">
            Email : {locataire.email || "Non renseigné"}
          </p>
          <p className="text-sm text-gray-600">
            Téléphone : {locataire.telephone || "Non renseigné"}
          </p>
        </div>
      </div>

      {/* Infos bail */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Informations</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
          <p className="text-sm text-gray-600">
            Date d&apos;entrée : {new Date(locataire.dateEntree).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Date de sortie : {locataire.dateSortie
              ? new Date(locataire.dateSortie).toLocaleDateString()
              : "En cours"}
          </p>
          <p className="text-sm text-gray-600">
            Caution : {locataire.caution} €
          </p>
        </div>
      </div>

      {/* Notes */}
      {locataire.notes && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Notes</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">{locataire.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}