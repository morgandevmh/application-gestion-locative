export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";

export default async function TestSessionPage() {
  const session = await getSession();
  console.log("Session result:", session);

  if (!session) {
    return <p>Non connecté</p>;
  }

  return (
    <div>
      <h1>Session active</h1>
      <p>Nom : {session.user.name}</p>
      <p>Email : {session.user.email}</p>
    </div>
  );
}