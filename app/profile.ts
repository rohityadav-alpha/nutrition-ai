"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

interface ProfileData {
  name?: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
}

// Get user profile
export async function getUserProfile() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in" };
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { error: "No email found" };
    }

    let profile = await prisma.userProfile.findUnique({
      where: { userEmail: email },
    });

    // If no profile exists, create one
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          userId,
          userEmail: email,
          name: user?.fullName || null,
        },
      });
    }

    return { success: true, profile };
  } catch (error: any) {
    console.error("Get profile error:", error);
    return { error: "Failed to load profile" };
  }
}

// Update user profile
export async function updateUserProfile(data: ProfileData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in" };
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return { error: "No email found" };
    }

    // Calculate targets based on profile data
    let targets = {};
    if (data.weight && data.height && data.age && data.gender && data.activityLevel && data.goal) {
      targets = calculateNutritionTargets(data);
    }

    const profile = await prisma.userProfile.upsert({
      where: { userEmail: email },
      update: {
        ...data,
        ...targets,
        updatedAt: new Date(),
      },
      create: {
        userId,
        userEmail: email,
        ...data,
        ...targets,
      },
    });

    return { success: true, profile };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

// Calculate nutrition targets
function calculateNutritionTargets(data: ProfileData) {
  const { weight, height, age, gender, activityLevel, goal } = data;

  if (!weight || !height || !age || !gender || !activityLevel || !goal) {
    return {};
  }

  // BMR (Mifflin-St Jeor)
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Adjust based on goal
  let targetCalories: number;
  switch (goal) {
    case "lose":
      targetCalories = Math.round(tdee - 500);
      break;
    case "gain":
      targetCalories = Math.round(tdee + 300);
      break;
    default:
      targetCalories = Math.round(tdee);
  }

  // Macros
  const targetProtein = Math.round(weight * 2); // 2g per kg
  const targetFats = Math.round(weight * 0.9); // 0.9g per kg
  const carbsCalories = targetCalories - (targetProtein * 4) - (targetFats * 9);
  const targetCarbs = Math.round(carbsCalories / 4);

  return {
    targetCalories,
    targetProtein: Math.max(targetProtein, 50),
    targetCarbs: Math.max(targetCarbs, 100),
    targetFats: Math.max(targetFats, 30),
  };
}
