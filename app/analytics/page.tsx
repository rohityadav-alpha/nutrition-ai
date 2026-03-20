"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/app/getAnalytics";
import { TrendingUp, Flame, Activity, Award, Beef, Wheat, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  chartData: any[];
  mealDistribution: any[];
  macroDistribution: any[];
  stats: {
    totalMeals: number;
    avgCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
  };
}

const cardStyle = {
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
};

const chartTooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#f1f5f9",
};

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const response = await getAnalyticsData();
    if (response.success && response.data) {
      setData(response.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4" style={{ background: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl p-12 text-center" style={cardStyle}>
            <TrendingUp className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
            <p className="text-slate-400">Start logging meals to see your analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ["#10b981", "#06b6d4", "#14b8a6", "#34d399"];

  const statCards = [
    { label: "Total Meals", value: data.stats.totalMeals, icon: Flame, color: "#10b981", suffix: "" },
    { label: "Avg Calories", value: data.stats.avgCalories, icon: Activity, color: "#06b6d4", suffix: " kcal" },
    { label: "Total Protein", value: data.stats.totalProtein, icon: Beef, color: "#10b981", suffix: "g" },
    { label: "Total Carbs", value: data.stats.totalCarbs, icon: Wheat, color: "#14b8a6", suffix: "g" },
  ];

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span>Analytics</span>
          </h1>
          <p className="text-slate-400 mt-1">Last 30 days insights</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 rounded-xl"
              style={{ ...cardStyle, borderLeft: `3px solid ${card.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm font-medium">{card.label}</span>
                <div className="p-2 rounded-lg" style={{ background: `${card.color}18` }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: card.color }}>
                {card.value}{card.suffix}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Daily Calorie Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-white font-bold mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Daily Calorie Intake</span>
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8" }} />
                <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Daily Macros Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-white font-bold mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Daily Macros Breakdown</span>
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="protein" fill="#10b981" name="Protein (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs" fill="#06b6d4" name="Carbs (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fats" fill="#14b8a6" name="Fats (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Meal Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-white font-bold mb-6 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>Meal Type Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.mealDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {data.mealDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Macro Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h3 className="text-white font-bold mb-6 flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Macro Distribution (%)</span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.macroDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value ?? 0}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {data.macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Protein", val: `${data.stats.totalProtein}g`, color: "#10b981" },
                { label: "Carbs", val: `${data.stats.totalCarbs}g`, color: "#06b6d4" },
                { label: "Fats", val: `${data.stats.totalFats}g`, color: "#14b8a6" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-xl text-center"
                  style={{ background: `${m.color}12`, border: `1px solid ${m.color}25` }}
                >
                  <p className="font-bold text-lg" style={{ color: m.color }}>{m.val}</p>
                  <p className="text-xs text-slate-400">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
