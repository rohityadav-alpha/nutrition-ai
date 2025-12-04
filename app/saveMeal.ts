"use server";

import { prisma } from "@/lib/prisma";
import { auth , currentUser } from "@clerk/nextjs/server";

interface FoodItem {
  name: string;
  portion_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

interface MealData {
  foods: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  meal_type: string;
  health_tip: string;
  image_url?: string;
}

export async function saveMealToDatabase(mealData: MealData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in to save meals" };
    }

    const user = await currentUser(); // ✅ Clerk se full user
    const primaryEmail =
      user?.emailAddresses[0]?.emailAddress ?? null;

    const meal = await prisma.meal.create({
      data: {
        userId: userId,
        userEmail: primaryEmail, // ✅ Email store
        imageUrl: mealData.image_url || null,
        mealType: mealData.meal_type,
        totalCalories: mealData.total_calories,
        totalProtein: mealData.total_protein,
        totalCarbs: mealData.total_carbs,
        totalFats: mealData.total_fats,
        healthTip: mealData.health_tip,

        foods: {
          create: mealData.foods.map((food) => ({
            name: food.name,
            portionSize: food.portion_size,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fats: food.fats,
            confidence: food.confidence,
          })),
        },
      },
      include: {
        foods: true,
      },
    });

    return { success: true, meal_id: meal.id };
  } catch (error: any) {
    console.error("Save error:", error);
    return { error: "Failed to save: " + error.message };
  }
}

