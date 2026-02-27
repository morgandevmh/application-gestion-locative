"use client";

import { useState } from "react";
import { register, login } from "@/actions/auth";

export default function TestAuth() {
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"register" | "login">("register");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await register({
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    });
    setResult(JSON.stringify(res, null, 2));
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await login({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });
    setResult(JSON.stringify(res, null, 2));
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Test Auth</h1>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => { setMode("register"); setResult(""); }}
          style={{ marginRight: 10, fontWeight: mode === "register" ? "bold" : "normal" }}
        >
          Register
        </button>
        <button
          onClick={() => { setMode("login"); setResult(""); }}
          style={{ fontWeight: mode === "login" ? "bold" : "normal" }}
        >
          Login
        </button>
      </div>

      {mode === "register" ? (
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input name="firstName" placeholder="Prénom" />
          <input name="lastName" placeholder="Nom" />
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Mot de passe" />
          <input name="confirmPassword" type="password" placeholder="Confirmer mot de passe" />
          <button type="submit">S&#39;inscrire</button>
        </form>
      ) : (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Mot de passe" />
          <button type="submit">Se connecter</button>
        </form>
      )}

      {result && (
        <pre style={{ marginTop: 20, padding: 10, background: "#f0f0f0", borderRadius: 5 }}>
          {result}
        </pre>
      )}
    </div>
  );
}