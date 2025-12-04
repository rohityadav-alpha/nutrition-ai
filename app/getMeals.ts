import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserMeals(limit: number = 10) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in to view meals", meals: [] };
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return { error: "No email found for user", meals: [] };
    }

    const meals = await prisma.meal.findMany({
      where: {
        // ✅ Email-based filter
        userEmail: email,
      },
      include: {
        foods: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return { success: true, meals };
  } catch (error: any) {
    console.error("Fetch meals error:", error);
    return { error: "Failed to load meals", meals: [] };
  }
}

export async function getWeeklyStats() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in to view stats" };
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return { error: "No email found for user" };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const meals = await prisma.meal.findMany({
      where: {
        userEmail: email, // ✅ email-based
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFats: true,
        createdAt: true,
      },
    });

    const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);

    const stats = {
      totalMeals: meals.length,
      totalCalories,
      avgCalories: meals.length > 0
        ? Math.round(totalCalories / meals.length)
        : 0,
      totalProtein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
      totalCarbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
      totalFats: meals.reduce((sum, m) => sum + m.totalFats, 0),
      dailyData: meals,
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error("Stats error:", error);
    return { error: "Failed to load stats" };
  }
}
