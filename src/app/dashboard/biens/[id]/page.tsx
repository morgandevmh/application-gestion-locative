"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Bien = {
    id: number
    nom: string
    adresse: string
    type: string
    description: string | null
  }

  export default function BienDetailsPage() {
    const [bien, setBien] = useState<Bien | null>(null)

    const params = useParams()
    const id = params.id
  
    useEffect(() => {
      async function fetchBien() {
        const response = await fetch(`/api/biens/${id}`)
        const data = await response.json()
        setBien(data)
      }
      fetchBien()
    },)

    if (!bien) {
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Chargement...</p>
          </div>
        )
      }
      
      return (
        <div className="max-w-3xl">
          <Link
            href="/dashboard/biens"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Retour aux biens
          </Link>
      
          <div className="mt-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{bien.nom}</h1>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {bien.type}
              </span>
            </div>
            <p className="text-gray-500">{bien.adresse}</p>
          </div>
      
          {bien.description && (
            <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 text-sm">{bien.description}</p>
            </div>
          )}
      
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-700">Locataires</h2>
            </div>
            <p className="text-gray-400 text-sm text-center py-6">
              Aucun locataire pour ce bien
            </p>
          </div>
      
          {bien.type === "COLOCATION" && (
            <div className="mt-6">
              <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                + Ajouter une chambre
              </button>
            </div>
          )}
        </div>
      )
    }