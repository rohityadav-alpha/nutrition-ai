"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/app/getAnalytics";
import {  TrendingUp, Flame, Activity,Award, Beef, Wheat } from "lucide-react";
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

export default function AnalyticsPage() {
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Yet</h3>
            <p className="text-gray-600">Start logging meals to see your analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Last 30 days insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Meals</span>
              <Flame className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{data.stats.totalMeals}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Avg Calories</span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{data.stats.avgCalories}</p>
            <p className="text-xs text-gray-500 mt-1">Per meal</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Protein</span>
              <Beef className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{data.stats.totalProtein}g</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Carbs</span>
              <Wheat className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{data.stats.totalCarbs}g</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Daily Calories Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Daily Calorie Intake</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Macros Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Daily Macros Breakdown</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" fill="#ef4444" name="Protein (g)" />
                <Bar dataKey="carbs" fill="#f97316" name="Carbs (g)" />
                <Bar dataKey="fats" fill="#eab308" name="Fats (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meal Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Meal Type Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.mealDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}

                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.mealDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Macro Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <span>Macro Distribution (%)</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.macroDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-red-50 p-2 rounded">
                <p className="font-bold text-red-700">{data.stats.totalProtein}g</p>
                <p className="text-xs text-red-600">Protein</p>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <p className="font-bold text-orange-700">{data.stats.totalCarbs}g</p>
                <p className="text-xs text-orange-600">Carbs</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <p className="font-bold text-yellow-700">{data.stats.totalFats}g</p>
                <p className="text-xs text-yellow-600">Fats</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
