"use client";

import { useState } from "react";
import { Calculator, Activity, Flame, Beef, Wheat, Droplet, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Results {
  bmr: number;
  tdee: number;
  calories: { min: number; max: number };
  protein: { min: number; max: number };
  carbs: { min: number; max: number };
  fats: { min: number; max: number };
}

const cardStyle = {
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
};

const inputClass = "w-full px-4 py-2.5 rounded-lg text-white text-sm outline-none transition-all";
const inputStyle = {
  background: "rgba(30,41,59,0.8)",
  border: "1px solid rgba(71,85,105,0.6)",
};

export default function CalculatorPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [results, setResults] = useState<Results | null>(null);
  const [calculating, setCalculating] = useState(false);

  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const calculateNutrition = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) {
      alert("Please fill all fields");
      return;
    }

    setCalculating(true);
    setTimeout(() => {
      let bmr: number;
      if (gender === "male") {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }

      const tdee = bmr * activityMultipliers[activityLevel];

      let caloriesMin: number, caloriesMax: number;
      switch (goal) {
        case "lose":
          caloriesMin = Math.round(tdee - 500);
          caloriesMax = Math.round(tdee - 250);
          break;
        case "gain":
          caloriesMin = Math.round(tdee + 250);
          caloriesMax = Math.round(tdee + 500);
          break;
        default:
          caloriesMin = Math.round(tdee - 100);
          caloriesMax = Math.round(tdee + 100);
      }

      const proteinMin = Math.round(w * 1.6);
      const proteinMax = Math.round(w * 2.2);
      const fatsMin = Math.round(w * 0.8);
      const fatsMax = Math.round(w * 1);
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
      setCalculating(false);
    }, 600);
  };

  const macroRows = results ? [
    { icon: Flame, label: "Daily Calories", unit: "", min: results.calories.min, max: results.calories.max, color: "#10b981" },
    { icon: Beef, label: "Protein", unit: "g", min: results.protein.min, max: results.protein.max, color: "#06b6d4" },
    { icon: Wheat, label: "Carbohydrates", unit: "g", min: results.carbs.min, max: results.carbs.max, color: "#14b8a6" },
    { icon: Droplet, label: "Fats", unit: "g", min: results.fats.min, max: results.fats.max, color: "#10b981" },
  ] : [];

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scanner</span>
          </Link>

          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-emerald-400" />
            <span>Nutrition Calculator</span>
          </h1>
          <p className="text-slate-400 mt-1">Calculate your daily calorie and macro needs</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Your Details</span>
            </h2>

            <div className="space-y-4">
              {/* Weight */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(71,85,105,0.6)")}
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 175"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(71,85,105,0.6)")}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 25"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(71,85,105,0.6)")}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Gender</label>
                <div className="flex space-x-3">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                      style={
                        gender === g
                          ? { background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.5)" }
                          : { background: "rgba(30,41,59,0.5)", color: "#94a3b8", border: "1px solid rgba(71,85,105,0.4)" }
                      }
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
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
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Your Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
              </div>

              {/* Calculate Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateNutrition}
                disabled={calculating}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                style={{ boxShadow: "0 0 20px rgba(16,185,129,0.2)" }}
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate My Needs</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>Your Daily Needs</span>
            </h2>

            {!results ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <Calculator className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Fill in your details and click calculate to see your personalized nutrition plan
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* BMR & TDEE */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "BMR", val: results.bmr, sub: "cal/day (at rest)", color: "#10b981" },
                      { label: "TDEE", val: results.tdee, sub: "cal/day (with activity)", color: "#06b6d4" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-4 rounded-xl text-center"
                        style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                      >
                        <p className="text-xs font-medium mb-1" style={{ color: item.color }}>{item.label}</p>
                        <p className="text-2xl font-bold" style={{ color: item.color }}>{item.val}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Macro rows */}
                  {macroRows.map((macro, i) => (
                    <motion.div
                      key={macro.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl"
                      style={{ background: `${macro.color}0d`, border: `1px solid ${macro.color}20` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium flex items-center space-x-2" style={{ color: macro.color }}>
                          <macro.icon className="w-4 h-4" />
                          <span className="text-sm">{macro.label}</span>
                        </span>
                        <span className="text-xs text-slate-400">{macro.min}{macro.unit} – {macro.max}{macro.unit}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold" style={{ color: macro.color }}>{macro.min}{macro.unit}</span>
                        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: "65%", background: `linear-gradient(90deg, ${macro.color}, ${macro.color}80)` }}
                          />
                        </div>
                        <span className="text-sm font-bold" style={{ color: macro.color }}>{macro.max}{macro.unit}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Info note */}
                  <div
                    className="rounded-xl p-3 flex items-start space-x-2"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
                  >
                    <Activity className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-cyan-300">
                      <span className="font-semibold text-cyan-400">Note: </span>
                      These are estimates based on the Mifflin-St Jeor equation.
                      Individual needs may vary. Consult a nutritionist for personalized advice.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
