import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminConsolePage from "./AdminConsolePage";

type SearchParams = Promise<{
  collection?: string;
  selectedId?: string;
}>;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Review Console",
  robots: { index: false, follow: false }
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = await cookies();
  const admin_session = cookieStore.get("admin_session");
  const user_role = cookieStore.get("user_role");

  if (admin_session?.value !== "true" && user_role?.value !== "ADMIN") {
    redirect("/profile?need_admin=true");
  }

  return <AdminConsolePage searchParams={searchParams} />;
}
