// New chambre (formulaire creation)
"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FormulaireChambre() {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const id = params.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const nom = formData.get("nom") as string;
    const description = formData.get("description") as string;

    const newErrors: string[] = [];

    if (!nom.trim()) {
      newErrors.push("Un nom est requis.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/biens/${id}/chambres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description }),
    });
    const result = await response.json();

    if (!response.ok) {
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      window.location.href = `/dashboard/biens/${id}`;
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href={`/dashboard/biens/${id}`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Retour à la colocation
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mt-4 mb-8">
        Ajouter une chambre
      </h1>

      {errors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <ul className="space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nom de la chambre
          </label>
          <input
            name="nom"
            id="nom"
            type="text"
            placeholder="Chambre 1"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (optionnel)
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Chambre avec vue sur cour..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création en cours..." : "Créer la chambre"}
        </button>
      </form>
    </div>
  );
}