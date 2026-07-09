// src/app/(site)/account/page.tsx
import { redirect } from "next/navigation";

// /account itself has no content — redirect to the default tab.
export default function AccountPage() {
  redirect("/account/profile");
}
