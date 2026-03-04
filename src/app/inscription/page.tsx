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
          {/* IMAGE / BRANDING */}
          <div
            className="
              h-[12vh] lg:h-auto   
              p-2     
              w-full lg:w-[60%]          
              lg:order-2                
              relative overflow-hidden
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
              w-full lg:w-[40%]          
              lg:order-1                  
              flex flex-col justify-center
              px-6 sm:px-12 lg:px-16     
              py-10 lg:py-0              
              bg-white
            "
          >
            <div className="w-full max-w-sm mx-auto">
              {/* Titre */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Inscription
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Créez votre espace de gestion
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
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Prénom
                    </label>
                    <input
                      name="firstName"
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      className="
                        w-full rounded-lg border border-gray-300 
                        px-4 py-2.5 text-sm text-gray-900 
                        placeholder:text-gray-400 
                        focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 
                        transition-colors
                      "
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Nom
                    </label>
                    <input
                      name="lastName"
                      id="lastName"
                      type="text"
                      placeholder="Dupont"
                      className="
                        w-full rounded-lg border border-gray-300 
                        px-4 py-2.5 text-sm text-gray-900 
                        placeholder:text-gray-400 
                        focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 
                        transition-colors
                      "
                    />
                  </div>
                </div>
    
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
    
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    name="confirmPassword"
                    id="confirmPassword"
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
                  {isLoading ? "Création en cours..." : "Créer un compte"}
                </button>
              </form>
    
              {/* Lien vers connexion */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Déjà un compte ?{" "}
                <Link href="/connexion" className="font-medium text-gray-900 hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      );

}