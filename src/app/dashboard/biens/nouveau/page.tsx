// New Bien (formulaire creation)
"use client"
import { useState } from "react";

export default function FormulaireBiens() {
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const nom = formData.get("nom") as string;
        const adresse = formData.get("adresse") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;

        const newErrors: string[] = [];

        if (!nom.trim()) {
            newErrors.push("Un nom est requis.");
          }
        if (!adresse.trim()) {
            newErrors.push("Veuillez ajouter une adresse.");
            }
        if (!type.trim()) {
            newErrors.push("Choisissez un type de bien.");
        }
        if (newErrors.length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
          }

          const response = await fetch("/api/biens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, adresse, type, description })
          })
          const result = await response.json()

          if (!response.ok) {
            setErrors([result.error])
            setIsLoading(false)
          } else {
            window.location.href = "/dashboard/biens"
          } 

    }
    return (
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">
            Ajouter un bien
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
                Nom du bien
              </label>
              <input
                name="nom"
                id="nom"
                type="text"
                placeholder="Appartement Paris 11"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />
            </div>
      
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse
              </label>
              <input
                name="adresse"
                id="adresse"
                type="text"
                placeholder="12 rue de la Roquette, Paris"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />
            </div>
      
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                Type de bien
              </label>
              <select
                name="type"
                id="type"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              >
                <option value="">Choisir un type</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="MAISON">Maison</option>
                <option value="STUDIO">Studio</option>
                <option value="COLOCATION">Colocation</option>
                {/*<option value="CHAMBRE">Chambre</option>*/}
              </select>
            </div>
      
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description (optionnel)
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="T2 lumineux avec balcon..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              />
            </div>
      
            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création en cours..." : "Créer le bien"}
            </button>
          </form>
        </div>
      )
}