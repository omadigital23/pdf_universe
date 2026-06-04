import { redirect } from "next/navigation";

// Redirection de / vers /fr (locale par défaut)
export default function RootPage() {
  redirect("/fr");
}
