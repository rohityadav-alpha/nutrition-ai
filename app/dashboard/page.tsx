import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NutritionAnalyzer from "@/app/components/NutritionAnalyzer";

export default async function DashboardPage() {
  // Protect this route - redirect to sign-in if not logged in
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <main className="container mx-auto px-4 py-8">
        <NutritionAnalyzer />
      </main>
    </div>
  );
}
