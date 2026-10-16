import { redirect } from "next/navigation";

// Redirection temporaire en attendant une vraie page d'accueil :
// connecté, on arrive sur le tableau de bord ;
// non connecté, le middleware renvoie vers /connexion.
export default function Home() {
  redirect("/dashboard");
}