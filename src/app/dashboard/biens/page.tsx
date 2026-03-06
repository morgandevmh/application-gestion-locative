"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Bien = {
  id: number
  nom: string
  adresse: string
  type: string
  description: string | null
}

export default function BiensPage() {
  const [biens, setBiens] = useState<Bien[]>([]);

  useEffect(() => {
    async function fetchBiens() {
      const response = await fetch("/api/biens")
      const data = await response.json()
      setBiens(data)
    }
    fetchBiens()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes biens</h1>
        {biens.length > 0 && (
          <Link
            href="/dashboard/biens/nouveau"
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
          >
            + Ajouter un bien
          </Link>
        )}
      </div>

      {biens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Vous n&aposavez pas encore de biens</p>
          <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier bien</p>
          <Link
            href="/dashboard/biens/nouveau"
            className="inline-block mt-4 bg-slate-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
          >
            + Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biens.map((bien) => (
            <Link key={bien.id} href={`/dashboard/biens/${bien.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Image à venir</span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{bien.nom}</h2>
                  <p className="text-gray-500 text-sm mt-1">{bien.adresse}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{bien.type}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}