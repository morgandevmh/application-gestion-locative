"use server";

import { auth } from "@/lib/auth";

export async function register(formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.email.trim() ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    return { error: "Tous les champs sont requis." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { error: "Format d'email invalide." };
  }

  if (formData.password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (!/[A-Z]/.test(formData.password)) {
    return { error: "Le mot de passe doit contenir au moins une majuscule." };
  }

  if (!/[0-9]/.test(formData.password)) {
    return { error: "Le mot de passe doit contenir au moins un chiffre." };
  }

  if (!/[^a-zA-Z0-9]/.test(formData.password)) {
    return { error: "Le mot de passe doit contenir au moins un caractère spécial." };
  }

  if (formData.password !== formData.confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Register error:", err);
    return { error: "Cet email est déjà utilisé." };
  }
}

export async function login(formData: {
  email: string;
  password: string;
}) {
  if (
    !formData.email.trim() ||
    !formData.password
  ) {
    return { error: "Tous les champs sont requis." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { error: "Format d'email invalide." };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: formData.email,
        password: formData.password,
      },
    });

    return { success: true };
  } catch {
    return { error: "Email ou mot de passe incorrect." };
  }
}