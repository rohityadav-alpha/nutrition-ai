"use client";

import { useEffect, useState } from "react";
import { getUserMeals, getWeeklyStats } from "@/app/getMeals";
import {
  Calendar,
  TrendingUp,
  Flame,
  Zap,
  Beef,
  Wheat,
  Droplet,
  Activity,
  Loader2,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portionSize: string;
}

interface Meal {
  id: string;
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  healthTip: string | null;
  createdAt: Date;
  foods: Food[];
}

interface WeeklyStats {
  totalMeals: number;
  avgCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalCalories: number;
}

const cardStyle = {
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
};

const inputStyle = {
  background: "rgba(30,41,59,0.8)",
  border: "1px solid rgba(71,85,105,0.6)",
  color: "#f1f5f9",
  borderRadius: "10px",
  padding: "8px 14px",
  width: "100%",
  outline: "none",
};

export default function HistoryClient() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [baseStats, setBaseStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mealType, setMealType] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const computeStatsFromMeals = (data: Meal[]): WeeklyStats => {
    const totalMeals = data.length;
    const totalCalories = data.reduce((s, m) => s + m.totalCalories, 0);
    const totalProtein = data.reduce((s, m) => s + m.totalProtein, 0);
    const totalCarbs = data.reduce((s, m) => s + m.totalCarbs, 0);
    const totalFats = data.reduce((s, m) => s + m.totalFats, 0);
    return {
      totalMeals,
      totalCalories,
      avgCalories: totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0,
      totalProtein,
      totalCarbs,
      totalFats,
    };
  };

  const hasActiveFilters = (filters?: { mealType?: string; startDate?: string; endDate?: string }) => {
    const mt = filters?.mealType ?? mealType;
    const sd = filters?.startDate ?? startDate;
    const ed = filters?.endDate ?? endDate;
    return mt !== "all" || sd !== "" || ed !== "";
  };

  const loadData = async (opts?: { mealType?: string; startDate?: string; endDate?: string }) => {
    setLoading(true);
    setError(null);
    const currentFilters = {
      mealType: opts?.mealType ?? mealType,
      startDate: opts?.startDate ?? startDate,
      endDate: opts?.endDate ?? endDate,
    };

    const [mealsRes, statsRes] = await Promise.all([
      getUserMeals(50, currentFilters),
      getWeeklyStats(),
    ]);

    if (mealsRes.success) {
      const data = mealsRes.meals as Meal[];
      setMeals(data);
      if (!hasActiveFilters(currentFilters)) {
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats as WeeklyStats);
          setBaseStats(statsRes.stats as WeeklyStats);
        }
      } else {
        setStats(computeStatsFromMeals(data));
      }
    } else if (mealsRes.error) {
      setError(mealsRes.error);
      setMeals([]);
      setStats(null);
    }

    if (statsRes.success && statsRes.stats && !baseStats) {
      setBaseStats(statsRes.stats as WeeklyStats);
    }
    setLoading(false);
  };

  const handleApplyFilters = () => loadData();
  const handleClearFilters = () => {
    setMealType("all");
    setStartDate("");
    setEndDate("");
    loadData({ mealType: "all", startDate: "", endDate: "" });
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading your meal history...</p>
        </div>
      </div>
    );
  }

  const statsSubtitle = hasActiveFilters() ? "For selected range" : "Last 7 days";

  const statCards = stats ? [
    { label: "Total Meals", value: stats.totalMeals, icon: Flame, color: "#10b981", suffix: "" },
    { label: "Total Calories", value: stats.totalCalories, icon: Zap, color: "#06b6d4", suffix: "" },
    { label: "Avg Calories", value: stats.avgCalories, icon: TrendingUp, color: "#14b8a6", suffix: "" },
    { label: "Total Protein", value: stats.totalProtein, icon: Beef, color: "#10b981", suffix: "g" },
    { label: "Total Carbs", value: stats.totalCarbs, icon: Wheat, color: "#06b6d4", suffix: "g" },
  ] : [];

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-emerald-400" />
            <span>Meal History</span>
          </h1>
          <p className="text-slate-400 mt-1">Track your nutrition journey</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5 mb-6"
          style={cardStyle}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                style={inputStyle}
              >
                <option value="all">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 px-4 rounded-lg transition-all hover:scale-105"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 font-semibold py-2 px-4 rounded-lg transition-all"
                style={{ background: "rgba(71,85,105,0.3)", color: "#94a3b8", border: "1px solid rgba(71,85,105,0.4)" }}
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-5 rounded-xl"
                style={{ ...cardStyle, borderLeft: `3px solid ${card.color}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs font-medium">{card.label}</span>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <p className="text-2xl font-bold" style={{ color: card.color }}>
                  {card.value}{card.suffix}
                </p>
                <p className="text-xs text-slate-500 mt-1">{statsSubtitle}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Meals List */}
        <div className="space-y-4">
          {meals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-16 text-center"
              style={cardStyle}
            >
              <Camera className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No meals found
              </h3>
              <p className="text-slate-400 mb-6">
                Try changing filters or scan a new meal.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-8 rounded-xl transition-all hover:scale-105"
              >
                Scan a Meal
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              {meals.map((meal, i) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.005, y: -2 }}
                  className="rounded-xl overflow-hidden"
                  style={cardStyle}
                >
                  <div className="p-6">
                    {/* Meal Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider capitalize"
                          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
                        >
                          {meal.mealType}
                        </span>
                        <span className="text-slate-400 text-sm">{formatDate(meal.createdAt)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">{meal.totalCalories}</p>
                        <p className="text-xs text-slate-400">calories</p>
                      </div>
                    </div>

                    {/* Macro Badges */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { icon: Beef, val: `${meal.totalProtein}g`, label: "Protein", color: "#10b981" },
                        { icon: Wheat, val: `${meal.totalCarbs}g`, label: "Carbs", color: "#06b6d4" },
                        { icon: Droplet, val: `${meal.totalFats}g`, label: "Fats", color: "#14b8a6" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="p-3 rounded-xl text-center"
                          style={{ background: `${m.color}10`, border: `1px solid ${m.color}25` }}
                        >
                          <div className="flex justify-center mb-1">
                            <m.icon className="w-4 h-4" style={{ color: m.color }} />
                          </div>
                          <p className="text-base font-bold" style={{ color: m.color }}>{m.val}</p>
                          <p className="text-xs text-slate-400">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Food Items */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} className="pt-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Items</h4>
                      <div className="space-y-2">
                        {meal.foods.map((food) => (
                          <div key={food.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium text-slate-200 capitalize">{food.name}</span>
                              <span className="text-slate-500 ml-2 text-xs">({food.portionSize})</span>
                            </div>
                            <span className="text-slate-300 font-semibold">{food.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Tip */}
                    {meal.healthTip && (
                      <div
                        className="mt-4 rounded-xl p-3 flex items-start space-x-2"
                        style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
                      >
                        <Activity className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-cyan-300">
                          <span className="font-semibold text-cyan-400">Health Tip: </span>
                          {meal.healthTip}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
