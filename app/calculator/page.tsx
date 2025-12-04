"use client";

import { useState } from "react";
import { Calculator, Activity, Flame, Beef, Wheat, Droplet, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Results {
  bmr: number;
  tdee: number;
  calories: { min: number; max: number };
  protein: { min: number; max: number };
  carbs: { min: number; max: number };
  fats: { min: number; max: number };
}

export default function CalculatorPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [results, setResults] = useState<Results | null>(null);

  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9,     // Very hard exercise, physical job
  };

  const calculateNutrition = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) {
      alert("Please fill all fields");
      return;
    }

    // BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust based on goal
    let caloriesMin: number, caloriesMax: number;
    switch (goal) {
      case "lose":
        caloriesMin = Math.round(tdee - 500); // Deficit for weight loss
        caloriesMax = Math.round(tdee - 250);
        break;
      case "gain":
        caloriesMin = Math.round(tdee + 250); // Surplus for muscle gain
        caloriesMax = Math.round(tdee + 500);
        break;
      default: // maintain
        caloriesMin = Math.round(tdee - 100);
        caloriesMax = Math.round(tdee + 100);
    }

    // Macros calculation
    // Protein: 1.6-2.2g per kg body weight
    const proteinMin = Math.round(w * 1.6);
    const proteinMax = Math.round(w * 2.2);

    // Fats: 0.8-1g per kg body weight
    const fatsMin = Math.round(w * 0.8);
    const fatsMax = Math.round(w * 1);

    // Carbs: Remaining calories
    // Protein = 4 cal/g, Carbs = 4 cal/g, Fats = 9 cal/g
    const avgCalories = (caloriesMin + caloriesMax) / 2;
    const avgProtein = (proteinMin + proteinMax) / 2;
    const avgFats = (fatsMin + fatsMax) / 2;
    const carbsCalories = avgCalories - (avgProtein * 4) - (avgFats * 9);
    const carbsAvg = Math.round(carbsCalories / 4);
    const carbsMin = Math.round(carbsAvg * 0.85);
    const carbsMax = Math.round(carbsAvg * 1.15);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: { min: caloriesMin, max: caloriesMax },
      protein: { min: proteinMin, max: proteinMax },
      carbs: { min: Math.max(carbsMin, 100), max: carbsMax },
      fats: { min: fatsMin, max: fatsMax },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 text-gray-700">
      <div className="max-w-4xl mx-auto">
        
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
            <Calculator className="w-8 h-8 text-blue-600" />
            <span>Nutrition Calculator</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Calculate your daily calorie and macro needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Your Details</span>
            </h2>

            <div className="space-y-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 175"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (intense exercise daily)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateNutrition}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Calculate My Needs
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Your Daily Needs</span>
            </h2>

            {!results ? (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Fill in your details and click calculate to see your personalized nutrition plan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* BMR & TDEE */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-600 font-medium">BMR</p>
                    <p className="text-2xl font-bold text-blue-700">{results.bmr}</p>
                    <p className="text-xs text-blue-500">cal/day (at rest)</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-600 font-medium">TDEE</p>
                    <p className="text-2xl font-bold text-purple-700">{results.tdee}</p>
                    <p className="text-xs text-purple-500">cal/day (with activity)</p>
                  </div>
                </div>

                {/* Calories */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-700 font-medium flex items-center space-x-2">
                      <Flame className="w-4 h-4" />
                      <span>Daily Calories</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-orange-600">Min</p>
                      <p className="text-xl font-bold text-orange-700">{results.calories.min}</p>
                    </div>
                    <div className="flex-1 mx-4 h-2 bg-orange-200 rounded-full">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-orange-600">Max</p>
                      <p className="text-xl font-bold text-orange-700">{results.calories.max}</p>
                    </div>
                  </div>
                </div>

                {/* Protein */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-700 font-medium flex items-center space-x-2">
                      <Beef className="w-4 h-4" />
                      <span>Protein</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-red-600">Min</p>
                      <p className="text-xl font-bold text-red-700">{results.protein.min}g</p>
                    </div>
                    <div className="flex-1 mx-4 h-2 bg-red-200 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-red-600">Max</p>
                      <p className="text-xl font-bold text-red-700">{results.protein.max}g</p>
                    </div>
                  </div>
                </div>

                {/* Carbs */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-700 font-medium flex items-center space-x-2">
                      <Wheat className="w-4 h-4" />
                      <span>Carbohydrates</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-yellow-600">Min</p>
                      <p className="text-xl font-bold text-yellow-700">{results.carbs.min}g</p>
                    </div>
                    <div className="flex-1 mx-4 h-2 bg-yellow-200 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-yellow-600">Max</p>
                      <p className="text-xl font-bold text-yellow-700">{results.carbs.max}g</p>
                    </div>
                  </div>
                </div>

                {/* Fats */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium flex items-center space-x-2">
                      <Droplet className="w-4 h-4" />
                      <span>Fats</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-green-600">Min</p>
                      <p className="text-xl font-bold text-green-700">{results.fats.min}g</p>
                    </div>
                    <div className="flex-1 mx-4 h-2 bg-green-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-green-600">Max</p>
                      <p className="text-xl font-bold text-green-700">{results.fats.max}g</p>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                  <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Note: </span>
                    These are estimates based on the Mifflin-St Jeor equation. 
                    Individual needs may vary. Consult a nutritionist for personalized advice.
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
