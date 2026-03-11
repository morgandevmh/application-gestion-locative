// page formulaire modification fiche locataire 
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

export default function ModifierLocatairePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();


  const [locataire, setLocataire] = useState<Locataire | null>(null);


  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [dateSortie, setDateSortie] = useState("");
  const [caution, setCaution] = useState("");
  const [statut, setStatut] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLocataire() {
      const response = await fetch(`/api/locataires/${id}`);
      const data = await response.json();
      setLocataire(data);

      setNom(data.nom);
      setEmail(data.email || "");
      setTelephone(data.telephone || "");setDateEntree(data.dateEntree.split("T")[0]);
      setDateSortie(data.dateSortie ? data.dateSortie.split("T")[0] : "");
      setCaution(data.caution.toString());
      setStatut(data.statut);
      setNotes(data.notes || "");
    }
    fetchLocataire();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/locataires/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email: email || null,
          telephone: telephone || null,
          dateEntree: new Date(dateEntree).toISOString(),
          dateSortie: dateSortie ? new Date(dateSortie).toISOString() : null,
          caution: parseFloat(caution),
          statut,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erreur lors de la modification");
        return;
      }

      router.push(`/dashboard/locataires/${id}`);
    } catch {
      setError("Erreur lors de la modification du locataire");
    } finally {
      setLoading(false);
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
      <Link
        href={`/dashboard/locataires/${id}`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Retour à la fiche
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Modifier {locataire.nom}</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;entrée *</label>
          <input
            type="date"
            value={dateEntree}
            onChange={(e) => setDateEntree(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        {/* Nouveau champ par rapport à la création */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de sortie</label>
          <input
            type="date"
            value={dateSortie}
            onChange={(e) => setDateSortie(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caution (€) *</label>
          <input
            type="number"
            value={caution}
            onChange={(e) => setCaution(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        {/* Select pour le statut — deux options possibles depuis l'enum Prisma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          >
            <option value="ACTIF">Actif</option>
            <option value="SORTI">Sorti</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Modification..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}