// page inscription 
"use client";

import { register } from "@/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const newErrors: string[] = [];

    if (!firstName.trim()) {
      newErrors.push("Le prénom est requis.");
    }
    if (!lastName.trim()) {
      newErrors.push("Le nom est requis.");
    }
    if (!email.trim()) {
      newErrors.push("L'email est requis.");
    }
    if (!password) {
      newErrors.push("Le mot de passe est requis.");
    }
    if (!confirmPassword) {
      newErrors.push("La confirmation du mot de passe est requise.");
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push("Format d'email invalide.");
    }
    if (password.length < 8) {
      newErrors.push("Le mot de passe doit contenir au moins 8 caractères.");
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.push("Le mot de passe doit contenir au moins une majuscule.");
    }
    if (!/[0-9]/.test(password)) {
      newErrors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      newErrors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    }
    if (password !== confirmPassword) {
      newErrors.push("Les mots de passe ne correspondent pas.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (result.error) {
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* IMAGE / BRANDING — D: bleu nuit subtil */}
      <div
        className="h-[12vh] lg:h-auto p-2 w-full lg:w-[60%] lg:order-2 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0c 0%, #1c1c1e 35%, #1a2a4a 65%, #1c1c1e 100%)",
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-white">
          <div className="w-14 h-14 rounded-xl bg-glass-on-gradient-hover border border-glass-on-gradient-border flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 9L9 3l7 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8v6a1 1 0 001 1h8a1 1 0 001-1V8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl lg:text-3xl font-heading font-bold tracking-[-0.02em] hidden lg:block">
            AGL
          </h2>
          <p className="font-body text-sm text-white/55 mt-2 hidden lg:block">
            Gérez vos biens en toute simplicité
          </p>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div className="flex-1 lg:flex-none w-full lg:w-[40%] lg:order-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 lg:py-0 bg-background">
        <div className="w-full max-w-sm mx-auto">
          {/* Titre */}
          <div className="mb-8 text-center">
            <h1 className="font-heading font-bold text-[28px] leading-[34px] tracking-[-0.02em] text-text">
              Inscription
            </h1>
            <p className="mt-2 font-body text-sm text-text-secondary">
              Créez votre espace de gestion
            </p>
          </div>

          {/* Zone d'erreurs */}
          {errors.length > 0 && (
            <div className="mb-6 rounded-lg border border-red bg-red-pastel p-4">
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="font-body text-sm text-red-text">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block font-heading font-bold text-[13px] text-text mb-[6px]"
                >
                  Prénom
                </label>
                <input
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="Jean"
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block font-heading font-bold text-[13px] text-text mb-[6px]"
                >
                  Nom
                </label>
                <input
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Mot de passe
              </label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-heading font-bold text-[13px] text-text mb-[6px]"
              >
                Confirmer le mot de passe
              </label>
              <input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full border-[1.5px] border-border rounded-md bg-surface-elevated px-4 py-[10px] text-sm font-body text-text placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-glass-accent"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] focus:outline-none focus:ring-3 focus:ring-glass-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? "Création en cours..." : "Créer un compte"}
            </button>
          </form>

          {/* Lien vers connexion */}
          <p className="mt-8 text-center font-body text-sm text-text-secondary">
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="font-bold text-accent no-underline hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}