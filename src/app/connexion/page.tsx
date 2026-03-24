// page connexion
"use client";

import { login } from "@/actions/auth";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors: string[] = [];

    if (!email.trim()) {
      newErrors.push("L'email est requis.");
    }
    if (!password) {
      newErrors.push("Le mot de passe est requis.");
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push("Format d'email invalide.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await login({ email, password });

    if (result.error) {
      setErrors([result.error]);
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* IMAGE / BRANDING — F: noir + glow bleu */}
      <div
        className="h-[35vh] lg:h-auto pb-15 w-full lg:w-[60%] lg:order-2 relative overflow-hidden p-0"
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
      <div className="flex-1 lg:flex-none rounded-tl-[5rem] -mt-30 z-10 w-full lg:w-[40%] lg:order-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 lg:py-0 bg-background lg:rounded-none lg:mt-0">
        <div className="w-full max-w-sm mx-auto">
          {/* Titre */}
          <div className="mb-8 text-center">
            <h1 className="font-heading font-bold text-[28px] leading-[34px] tracking-[-0.02em] text-text">
              Connexion
            </h1>
            <p className="mt-2 font-body text-sm text-text-secondary">
              Accédez à votre espace de gestion
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

            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-[10px] font-body font-bold text-sm text-white transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.97] focus:outline-none focus:ring-3 focus:ring-glass-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Lien vers inscription */}
          <p className="mt-8 text-center font-body text-sm text-text-secondary">
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="font-bold text-accent no-underline hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}