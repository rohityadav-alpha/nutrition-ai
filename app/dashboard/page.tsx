import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardGrid from "@/app/components/DashboardGrid";

export default async function DashboardPage() {
  // Protect this route - redirect to sign-in if not logged in
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardGrid />;
}
