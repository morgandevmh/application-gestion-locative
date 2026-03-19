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
      {/* IMAGE / BRANDING */}
      <div
        className="
          h-[35vh] lg:h-auto  
          pb-15    
          w-full lg:w-[60%]          
          lg:order-2                 
          relative overflow-hidden
          p-0
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-white">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
            <span className="text-xl font-bold">GL</span>
          </div>
          <h2 className="text-xl lg:text-3xl font-light tracking-wide hidden lg:block">
            Gestion Locative
          </h2>
          <p className="text-sm text-white/60 mt-2 hidden lg:block">
            Gérez vos biens en toute simplicité
          </p>
        </div>
      </div>

      {/* FORMULAIRE */}
      <div
        className="
          flex-1 lg:flex-none  
          rounded-tl-[5rem] 
          -mt-30
          z-10
          w-full lg:w-[40%]          
          lg:order-1                  
          flex flex-col justify-center
          px-6 sm:px-12 lg:px-16     
          py-10 lg:py-0              
          bg-white
          lg:rounded-none lg:mt-0 
        "
      >
        <div className="w-full max-w-sm mx-auto">
          {/* Titre */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Accédez à votre espace de gestion
            </p>
          </div>

          {/* Zone d'erreurs */}
          {errors.length > 0 && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-600">
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
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                className="
                  w-full rounded-lg border border-gray-300 
                  px-4 py-2.5 text-sm text-gray-900 
                  placeholder:text-gray-400 
                  focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 
                  transition-colors
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Mot de passe
              </label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                className="
                  w-full rounded-lg border border-gray-300 
                  px-4 py-2.5 text-sm text-gray-900 
                  placeholder:text-gray-400 
                  focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 
                  transition-colors
                "
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="
                w-full rounded-lg bg-gray-900 
                px-4 py-2.5 text-sm font-medium text-white 
                hover:bg-gray-800 
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Lien vers inscription */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-gray-900 hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}