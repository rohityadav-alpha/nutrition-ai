"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { startOfDay, subDays, format } from "date-fns";

export async function getAnalyticsData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Please sign in to view analytics" };
    }

    // Get user email
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { error: "No email found for user" };
    }

    // Last 30 days data
    const thirtyDaysAgo = subDays(new Date(), 30);

    const meals = await prisma.meal.findMany({
      where: {
        userEmail: email, // ✅ Email-based
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFats: true,
        mealType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const dailyData: { [key: string]: any } = {};

    meals.forEach((meal) => {
      const dateKey = format(startOfDay(new Date(meal.createdAt)), "MMM dd");

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          meals: 0,
        };
      }

      dailyData[dateKey].calories += meal.totalCalories;
      dailyData[dateKey].protein += meal.totalProtein;
      dailyData[dateKey].carbs += meal.totalCarbs;
      dailyData[dateKey].fats += meal.totalFats;
      dailyData[dateKey].meals += 1;
    });

    // Convert to array and sort
    const chartData = Object.values(dailyData);

    // Meal type distribution
    const mealTypeCount = meals.reduce((acc: any, meal) => {
      acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
      return acc;
    }, {});

    const mealDistribution = Object.entries(mealTypeCount).map(
      ([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })
    );

    // Overall stats
    const totalMeals = meals.length;
    const avgCalories =
      totalMeals > 0
        ? Math.round(
            meals.reduce((sum, m) => sum + m.totalCalories, 0) / totalMeals
          )
        : 0;
    const totalProtein = meals.reduce((sum, m) => sum + m.totalProtein, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.totalCarbs, 0);
    const totalFats = meals.reduce((sum, m) => sum + m.totalFats, 0);

    // Macro percentage
    const totalMacros = totalProtein * 4 + totalCarbs * 4 + totalFats * 9;
    const macroDistribution =
      totalMacros > 0
        ? [
            {
              name: "Protein",
              value: Math.round(((totalProtein * 4) / totalMacros) * 100),
              color: "#ef4444",
            },
            {
              name: "Carbs",
              value: Math.round(((totalCarbs * 4) / totalMacros) * 100),
              color: "#f97316",
            },
            {
              name: "Fats",
              value: Math.round(((totalFats * 9) / totalMacros) * 100),
              color: "#eab308",
            },
          ]
        : [];

    return {
      success: true,
      data: {
        chartData,
        mealDistribution,
        macroDistribution,
        stats: {
          totalMeals,
          avgCalories,
          totalProtein,
          totalCarbs,
          totalFats,
        },
      },
    };
  } catch (error: any) {
    console.error("Analytics error:", error);
    return { error: "Failed to load analytics" };
  }
}
