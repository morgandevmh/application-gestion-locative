// page details biens + condition pour colocation
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ModalCreationLocataire from "@/components/ModalCreationLocataire";
import ModalCreationChambre from "@/components/ModalCreationChambre";
import ModalModificationBien from "@/components/ModalModificationBien";

type Locataire = {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  dateEntree: string;
  dateSortie: string | null;
  caution: number;
  statut: string;
  notes: string | null;
};

type SousBien = {
  id: number;
  nom: string;
  adresse: string;
  type: string;
  description: string | null;
  image: string | null;
  locataires: Locataire[];
};

type Bien = {
  id: number;
  nom: string;
  adresse: string;
  type: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
  sousBiens: SousBien[];
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  APPARTEMENT: { bg: "bg-blue-pastel", text: "text-blue-text" },
  MAISON: { bg: "bg-green-pastel", text: "text-green-text" },
  STUDIO: { bg: "bg-violet-pastel", text: "text-violet-text" },
  COLOCATION: { bg: "bg-amber-pastel", text: "text-amber-text" },
  CHAMBRE: { bg: "bg-cyan-pastel", text: "text-cyan-text" },
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] || { bg: "bg-surface", text: "text-text-secondary" };
}

export default function BienDetailPage() {
  const [bien, setBien] = useState<Bien | null>(null);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [modalLocataire, setModalLocataire] = useState(false);
  const [modalChambre, setModalChambre] = useState(false);
  const [modalModifierBien, setModalModifierBien] = useState(false);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  function fetchBien() {
    fetch(`/api/biens/${id}`)
      .then((res) => res.json())
      .then((data) => setBien(data));
  }

  function fetchLocataires() {
    fetch(`/api/biens/${id}/locataires`)
      .then((res) => res.json())
      .then((data) => setLocataires(data));
  }

  useEffect(() => {
    fetchBien();
    fetchLocataires();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce bien ? (Si c'est une colocation vous supprimerez aussi les chambres)"
    );
    if (!confirmed) return;
  
    const response = await fetch(`/api/biens/${id}`, {
      method: "DELETE",
    });
  
    if (response.ok) {
      window.location.href = "/dashboard/biens";
    } else {
      const data = await response.json();
      alert(data.error);
    }
  }

  if (!bien) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-body text-sm text-text-secondary">Chargement...</p>
      </div>
    );
  }

  const isColocation = bien.type === "COLOCATION";
  const typeColor = getTypeColor(bien.type);

  const tousLesLocataires = isColocation
    ? bien.sousBiens.flatMap((chambre) => chambre.locataires)
    : [];

  const locatairesActifs = tousLesLocataires.filter(
    (loc) => loc.statut === "ACTIF"
  );

  const nombreLocatairesActifs = locatairesActifs.length;

  const sommeCautions = locatairesActifs.reduce(
    (acc, loc) => acc + loc.caution,
    0
  );

  const chambresOccupees = isColocation
  ? bien.sousBiens.filter(
      (chambre) => chambre.locataires.some((loc) => loc.statut === "ACTIF")
    ).length
  : 0;

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Navigation retour */}
      {bien.parentId ? (
        <Link
          href={`/dashboard/biens/${bien.parentId}`}
          className="inline-flex items-center gap-1 font-body text-sm text-text-secondary no-underline transition-colors duration-200 hover:text-text"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          Retour à la colocation
        </Link>
      ) : (
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Retour
       </button>
      )}

      {/* Header card — gradient compact */}
      <div
        className="rounded-xl mt-4 mb-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 60%, #1a2a4a 85%, #1a2a4a 100%)",
        }}
      >
        {/* Image */}
        {bien.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bien.image}
            alt={bien.nom}
            className="w-full h-56 object-cover"
          />
        )}

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between flex-wrap gap-3 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-white m-0">
              {bien.nom}
            </h1>
            <span
              className={`px-2 py-[1px] rounded-full font-body font-bold text-[8px] shrink-0 ${typeColor.bg} ${typeColor.text}`}
            >
              {bien.type}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setModalModifierBien(true)}
            className="inline-flex items-center gap-[6px] px-4 py-[7px] rounded-md bg-glass-on-gradient border border-glass-on-gradient-border text-white font-body font-bold text-xs transition-all duration-100 hover:bg-glass-on-gradient-hover"
          >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 1.5l2.5 2.5L5 11.5H2.5V9z" />
              </svg>
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-[6px] px-4 py-[7px] rounded-md font-body font-bold text-xs cursor-pointer transition-all duration-100"
              style={{
                background: "rgba(255, 69, 58, 0.2)",
                border: "1px solid rgba(255, 69, 58, 0.3)",
                color: "#ff8f88",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.2)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" />
              </svg>
              Supprimer
            </button>
          </div>
          <p className="font-body text-[13px] text-white/55 mt-1 m-0 w-full">
            {bien.adresse}
          </p>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-[10px]">
              <h1 className="font-heading font-bold text-[17px] leading-[22px] tracking-[-0.01em] text-white m-0 truncate">
                {bien.nom}
              </h1>
              <span
                className={`px-2 py-[1px] rounded-full font-body font-bold text-[8px] shrink-0 ${typeColor.bg} ${typeColor.text}`}
              >
                {bien.type}
              </span>
            </div>
            <p className="font-body text-xs text-white/55 m-0 mt-[2px] truncate">
              {bien.adresse}
            </p>
          </div>
          <div className="flex gap-[6px] shrink-0">
            <Link
              href={`/dashboard/biens/${bien.id}/modifier`}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-md bg-glass-on-gradient border border-glass-on-gradient-border no-underline transition-all duration-100 hover:bg-glass-on-gradient-hover"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 1.5l2.5 2.5L5 11.5H2.5V9z" />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-[34px] h-[34px] rounded-md cursor-pointer transition-all duration-100"
              style={{
                background: "rgba(255, 69, 58, 0.2)",
                border: "1px solid rgba(255, 69, 58, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 69, 58, 0.2)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ff8f88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {bien.description && (
        <div className="mb-8">
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-3">
            Description
          </h2>
          <div className="bg-surface-elevated rounded-lg border border-border p-5">
            <p className="font-body text-[15px] leading-6 text-text-secondary m-0 whitespace-pre-wrap">
              {bien.description}
            </p>
          </div>
        </div>
      )}

      {/* CONDITIONNEL : Stats colocation OU Liste locataires */}
      {isColocation ? (
        <div className="mb-8">
          <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary mb-4">
            Résumé de la colocation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-elevated rounded-lg border border-border p-5">
              <p className="font-body text-xs text-text-tertiary m-0 mb-1">
                Locataires actifs
              </p>
              <p className="font-heading font-bold text-[32px] leading-9 tracking-[-0.02em] text-text m-0">
                {nombreLocatairesActifs}
              </p>
            </div>
            <div className="bg-surface-elevated rounded-lg border border-border p-5">
              <p className="font-body text-xs text-text-tertiary m-0 mb-1">
                Chambres Occupées
              </p>
              <p className="font-heading font-bold text-[32px] leading-9 tracking-[-0.02em] text-text m-0">
                {chambresOccupees}
                <span className="text-text-tertiary text-[15px] font-normal ml-1">
                  / {bien.sousBiens.length}
                </span>
              </p>
            </div>
            <div className="bg-surface-elevated rounded-lg border border-border p-5">
              <p className="font-body text-xs text-text-tertiary m-0 mb-1">
                Total cautions
              </p>
              <p className="font-heading font-bold text-[32px] leading-9 tracking-[-0.02em] text-text m-0">
                {sommeCautions.toLocaleString()}
                <span className="text-text-tertiary text-[15px] font-normal ml-1">
                  €
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Locataires
            </h2>
            <button
              onClick={() => setModalLocataire(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M7 1v12M1 7h12" />
              </svg>
              Ajouter un locataire
            </button>
          </div>

          {locataires.length === 0 ? (
            <div className="bg-surface-elevated rounded-lg border border-border py-12 px-6 text-center">
              <p className="font-body text-sm text-text-tertiary">
                Aucun locataire pour le moment
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {locataires.map((locataire) => (
                <Link
                  key={locataire.id}
                  href={`/dashboard/locataires/${locataire.id}`}
                  className="bg-surface-elevated rounded-lg border border-border p-4 flex justify-between items-center no-underline transition-all duration-200 hover:border-border-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <p className="font-heading font-medium text-[15px] leading-5 text-text m-0">
                      {locataire.nom}
                    </p>
                    <p className="font-body text-[13px] text-text-secondary mt-1 m-0">
                      Entrée : {new Date(locataire.dateEntree).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-[10px] py-[3px] rounded-full font-body font-bold text-[11px] ${
                      locataire.statut === "ACTIF"
                        ? "bg-green-pastel text-green-text"
                        : "bg-surface text-text-secondary"
                    }`}
                  >
                    {locataire.statut}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section colocation : chambres */}
      {isColocation && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-bold text-[11px] leading-[14px] tracking-[0.08em] uppercase text-text-tertiary">
              Chambres
            </h2>
            <button
              onClick={() => setModalChambre(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-[22px] py-[10px] rounded-md font-body font-bold text-sm border-none cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M7 1v12M1 7h12" />
              </svg>
              Ajouter une chambre
            </button>
          </div>

          {bien.sousBiens.length === 0 ? (
            <div className="bg-surface-elevated rounded-lg border border-border py-12 px-6 text-center">
              <p className="font-body text-sm text-text-tertiary">
                Aucune chambre pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bien.sousBiens.map((chambre) => (
                <Link
                  key={chambre.id}
                  href={`/dashboard/biens/${chambre.id}`}
                  className="group no-underline"
                >
                  <div className="bg-surface-elevated rounded-lg border border-border overflow-hidden transition-all duration-200 group-hover:border-border-hover group-hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    {chambre.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={chambre.image}
                        alt={chambre.nom}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="h-40 bg-surface flex items-center justify-center">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--text-tertiary)"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-50"
                        >
                          <path d="M3 12L12 5l9 7" />
                          <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-heading font-medium text-[15px] leading-5 text-text m-0">
                        {chambre.nom}
                      </h3>
                      <p className="font-body text-[13px] text-text-secondary mt-1 m-0 truncate">
                        {chambre.adresse}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modale création locataire */}
      {modalLocataire && (
        <ModalCreationLocataire
          bienId={id}
          onClose={() => setModalLocataire(false)}
          onSuccess={() => {
            setModalLocataire(false);
            fetchLocataires();
          }}
        />
      )}

      {/* Modale création chambre */}
      {modalChambre && (
        <ModalCreationChambre
          bienId={id}
          onClose={() => setModalChambre(false)}
          onSuccess={() => {
            setModalChambre(false);
            fetchBien();
          }}
        />
      )}

      {/* Modale création cbien */}
      {modalModifierBien && (
        <ModalModificationBien
          bienId={id}
          onClose={() => setModalModifierBien(false)}
        />
      )}
    </div>
  );
}