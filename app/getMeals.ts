"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserMeals(limit: number = 10) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "Please sign in to view meals", meals: [] };
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
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

    // Calculate total calories
    const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);

    // Calculate stats
    const stats = {
      totalMeals: meals.length,
      totalCalories: totalCalories, // ✅ Added
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
