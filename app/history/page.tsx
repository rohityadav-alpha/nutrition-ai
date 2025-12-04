import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserMeals, getWeeklyStats } from "@/app/getMeals";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Flame,
  Zap,
  Beef,
  Wheat,
  Droplet,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
  const [mealsRes, statsRes] = await Promise.all([
    getUserMeals(20),
    getWeeklyStats(),
  ]);

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const meals = mealsRes.success ? mealsRes.meals : [];
  const stats = statsRes.success ? statsRes.stats : null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scanner</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span>Meal History</span>
          </h1>
          <p className="text-gray-600 mt-1">Track your nutrition journey</p>
        </div>

        {/* Weekly Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            
            {/* Total Meals */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Meals</span>
                <Flame className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalMeals}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>

            {/* Total Calories */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Calories</span>
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCalories}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>

            {/* Avg Calories */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Avg Calories</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.avgCalories}</p>
              <p className="text-xs text-gray-500 mt-1">Per meal</p>
            </div>

            {/* Total Protein */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Protein</span>
                <Beef className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProtein}g</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>

            {/* Total Carbs */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Carbs</span>
                <Wheat className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCarbs}g</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>

          </div>
        )}

        {/* Meals List */}
        <div className="space-y-4">
          {meals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No meals logged yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start scanning your meals to track your nutrition!
              </p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
              >
                Scan Your First Meal
              </Link>
            </div>
          ) : (
            meals.map((meal: any) => (
              <div
                key={meal.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  
                  {/* Meal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {meal.mealType}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {formatDate(meal.createdAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        {meal.totalCalories}
                      </p>
                      <p className="text-xs text-gray-500">calories</p>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Beef className="w-4 h-4 text-red-600" />
                      </div>
                      <p className="text-lg font-bold text-red-700">
                        {meal.totalProtein}g
                      </p>
                      <p className="text-xs text-red-600">Protein</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Wheat className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-lg font-bold text-orange-700">
                        {meal.totalCarbs}g
                      </p>
                      <p className="text-xs text-orange-600">Carbs</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Droplet className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-lg font-bold text-yellow-700">
                        {meal.totalFats}g
                      </p>
                      <p className="text-xs text-yellow-600">Fats</p>
                    </div>
                  </div>

                  {/* Foods List */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Items:
                    </h4>
                    <div className="space-y-2">
                      {meal.foods.map((food: any) => (
                        <div
                          key={food.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <span className="font-medium text-gray-800 capitalize">
                              {food.name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ({food.portionSize})
                            </span>
                          </div>
                          <span className="text-gray-600 font-semibold">
                            {food.calories} cal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Tip */}
                  {meal.healthTip && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                      <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">Health Tip: </span>
                        {meal.healthTip}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
