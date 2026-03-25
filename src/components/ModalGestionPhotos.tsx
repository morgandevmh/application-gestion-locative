"use client";
import { useState, useEffect } from "react";

type Photo = {
  key: string;
  url: string;
};

type ModalGestionPhotosProps = {
  bienId: number | string;
  onClose: () => void;
};

export default function ModalGestionPhotos({
  bienId,
  onClose,
}: ModalGestionPhotosProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  function fetchPhotos() {
    fetch(`/api/biens/${bienId}/photos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Photos reçues:", data);
        setPhotos(data);
      });
  }

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bienId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      await fetch(`/api/biens/${bienId}/photos`, {
        method: "POST",
        body: formData,
      });
    }

    fetchPhotos();
    setIsUploading(false);
    // Reset l'input pour permettre de re-sélectionner le même fichier
    e.target.value = "";
  }

  async function handleDelete(key: string) {
    const confirmed = window.confirm("Supprimer cette photo ?");
    if (!confirmed) return;

    await fetch(`/api/biens/${bienId}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    fetchPhotos();
  }

  async function handleSetPrincipale(index: number) {
    if (index === 0) return; // déjà principale

    // Réorganiser : mettre la photo sélectionnée en premier
    const newOrder = [
      photos[index].key,
      ...photos.filter((_, i) => i !== index).map((p) => p.key),
    ];

    await fetch(`/api/biens/${bienId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos: newOrder }),
    });

    fetchPhotos();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end">
      <div
        className="absolute inset-0 bg-glass-overlay"
        onClick={onClose}
      />
      <div className="relative z-10 w-[90%] max-w-[440px] max-h-[85vh] md:w-[520px] md:max-w-none md:max-h-none md:h-full md:rounded-none rounded-xl bg-surface-elevated flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-[18px] leading-6 tracking-[-0.01em] text-text m-0">
            Photos du bien
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-surface flex items-center justify-center cursor-pointer border-none transition-colors duration-100 hover:bg-border"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 3L3 11M3 3l8 8" />
            </svg>
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Bouton upload */}
          <label className="flex items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-border rounded-lg cursor-pointer transition-colors hover:border-accent hover:bg-glass-accent mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4v12M4 10h12" />
            </svg>
            <span className="font-body font-bold text-sm text-text-secondary">
              {isUploading ? "Upload en cours..." : "Ajouter des photos"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {/* Grille de photos */}
          {photos.length === 0 ? (
            <p className="font-body text-sm text-text-tertiary text-center py-4">
              Aucune photo pour le moment
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.key}
                  className="relative group rounded-lg overflow-hidden border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  {/* Badge principale */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-body font-bold px-2 py-[2px] rounded-full">
                      Principale
                    </span>
                  )}
                  {/* Actions au hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {index !== 0 && (
                      <button
                        onClick={() => handleSetPrincipale(index)}
                        className="px-3 py-[6px] rounded-md bg-white text-text font-body font-bold text-xs border-none cursor-pointer"
                      >
                        Principale
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(photo.key)}
                      className="px-3 py-[6px] rounded-md bg-red-600 text-white font-body font-bold text-xs border-none cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97]"
          >
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}