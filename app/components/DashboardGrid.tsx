"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Flame,
  Droplets,
  Beef,
  ChevronRight,
  X,
} from "lucide-react";
import { analyzeFoodImage } from "@/app/actions";
import { saveMealToDatabase } from "@/app/saveMeal";
import imageCompression from "browser-image-compression";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FoodItem {
  name: string;
  portion_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

interface AnalysisResult {
  foods: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  meal_type: string;
  health_tip: string;
}

// ─── Weekly Data ──────────────────────────────────────────────────────────────
const weeklyData = [
  { day: "Mon", calories: 1820, protein: 95, carbs: 210 },
  { day: "Tue", calories: 2100, protein: 110, carbs: 245 },
  { day: "Wed", calories: 1650, protein: 88, carbs: 180 },
  { day: "Thu", calories: 2300, protein: 125, carbs: 270 },
  { day: "Fri", calories: 1980, protein: 102, carbs: 230 },
  { day: "Sat", calories: 2450, protein: 130, carbs: 290 },
  { day: "Sun", calories: 1700, protein: 90, carbs: 195 },
];

const profiles = [
  {
    name: "Alex M.",
    intake: "2,100 cal",
    avatar: "AM",
    color: "#10b981",
  },
  {
    name: "Sara K.",
    intake: "1,850 cal",
    avatar: "SK",
    color: "#06b6d4",
  },
];

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(15,20,25,0.95)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "10px",
          padding: "10px 14px",
          color: "#e2e8f0",
          fontSize: "12px",
          backdropFilter: "blur(12px)",
        }}
      >
        <p style={{ fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
          {label}
        </p>
        <p>{payload[0].value} cal</p>
      </div>
    );
  }
  return null;
};

// ─── Scan Meal Card ────────────────────────────────────────────────────────────
function ScanMealCard() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      setImagePreview(URL.createObjectURL(compressed));
      const fd = new FormData();
      fd.append("image", compressed);
      const res = await analyzeFoodImage(fd);
      if (res.error) setError(res.error);
      else if (res.data?.foods && Array.isArray(res.data.foods))
        setResult(res.data);
      else setError("AI returned invalid data. Please try again.");
    } catch {
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) processFile(file);
    },
    [processFile]
  );

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    await saveMealToDatabase({ ...result, image_url: imagePreview || undefined });
    setSaving(false);
  };

  const reset = () => {
    setResult(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="dash-card flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-badge">
          <Camera size={18} className="text-emerald" />
        </div>
        <div>
          <h2 className="card-title">Scan Meal Today</h2>
          <p className="card-sub">AI-powered nutrition analysis</p>
        </div>
        {result && (
          <button onClick={reset} className="ml-auto ghost-btn">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropzone or Preview */}
      {!imagePreview ? (
        <div
          className={`dropzone flex-1 ${dragging ? "dropzone-active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
          />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="upload-icon-wrap">
              <Upload size={28} className="text-emerald" />
            </div>
            <p className="text-slate-300 font-medium text-sm">Drop photo or click to upload</p>
            <p className="text-slate-500 text-xs">JPG, PNG, WEBP supported</p>
          </div>
        </div>
      ) : (
        <div className="preview-wrap flex-1">
          <img src={imagePreview} alt="Meal" className="preview-img" />
          {loading && (
            <div className="preview-overlay">
              <Loader2 size={32} className="animate-spin text-emerald" />
              <p className="text-slate-300 text-sm mt-2">Analyzing meal…</p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-banner mt-3">
          <AlertCircle size={16} className="shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* Result summary */}
      {result && !loading && (
        <div className="result-summary mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="tag-pill">
              <CheckCircle size={12} /> {result.meal_type || "Meal"}
            </span>
            <span className="text-lg font-bold text-emerald">{result.total_calories} cal</span>
          </div>
          <div className="macro-row">
            <span className="macro-chip protein">P {result.total_protein}g</span>
            <span className="macro-chip carbs">C {result.total_carbs}g</span>
            <span className="macro-chip fats">F {result.total_fats}g</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        disabled={loading || saving}
        onClick={imagePreview && result ? handleSave : () => fileInputRef.current?.click()}
        className="analyze-btn mt-4"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Analyzing…</>
        ) : saving ? (
          <><Loader2 size={16} className="animate-spin" /> Saving…</>
        ) : result ? (
          <><CheckCircle size={16} /> Save Meal</>
        ) : (
          <><Zap size={16} /> Analyze Food</>
        )}
      </button>
    </div>
  );
}

// ─── Recent Analysis Card ──────────────────────────────────────────────────────
function RecentAnalysisCard() {
  const macros = [
    { label: "Protein", value: 45, unit: "g", color: "#10b981", icon: <Beef size={14} /> },
    { label: "Carbs", value: 82, unit: "g", color: "#06b6d4", icon: <Flame size={14} /> },
    { label: "Fats", value: 28, unit: "g", color: "#f59e0b", icon: <Droplets size={14} /> },
  ];
  const total = macros.reduce((s, m) => s + m.value, 0);

  return (
    <div className="dash-card flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-badge cyan">
          <Flame size={18} className="text-cyan" />
        </div>
        <div>
          <h2 className="card-title">Recent Analysis</h2>
          <p className="card-sub">Last scanned meal</p>
        </div>
        <span className="tag-pill ml-auto cyan-pill">Protein Rich</span>
      </div>

      {/* Calorie hero */}
      <div className="cal-hero">
        <p className="cal-number">650</p>
        <p className="cal-label">calories</p>
        <p className="meal-desc">Grilled Chicken & Quinoa Bowl</p>
      </div>

      {/* Macro donut-like bars */}
      <div className="flex flex-col gap-3 mt-5 flex-1">
        {macros.map((m) => {
          const width = Math.round((m.value / total) * 100);
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <div className="flex items-center gap-1.5" style={{ color: m.color }}>
                  {m.icon}
                  <span>{m.label}</span>
                </div>
                <span className="text-slate-300 font-semibold">{m.value}{m.unit}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${width}%`, background: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="ghost-action-btn mt-5">
        View Full Report <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Daily Intake Card ─────────────────────────────────────────────────────────
function DailyIntakeCard() {
  const macros = [
    { label: "Carbohydrates", value: 142, goal: 200, color: "#06b6d4" },
    { label: "Protein", value: 89, goal: 150, color: "#10b981" },
    { label: "Fats", value: 56, goal: 80, color: "#f59e0b" },
  ];

  return (
    <div className="dash-card flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="icon-badge">
          <TrendingUp size={18} className="text-emerald" />
        </div>
        <div className="flex-1">
          <h2 className="card-title">Daily Intake</h2>
          <p className="card-sub">Today's consumption</p>
        </div>
        <a href="/analytics" className="text-xs text-cyan hover:text-emerald transition-colors flex items-center gap-1">
          All stats <ChevronRight size={12} />
        </a>
      </div>

      {/* Big number */}
      <div className="flex items-end gap-2 mb-6 mt-1">
        <span className="text-5xl font-black text-white tracking-tight">287</span>
        <span className="text-slate-400 text-lg mb-1.5 font-medium">g total macros</span>
      </div>

      {/* Horizontal bars */}
      <div className="flex flex-col gap-5 flex-1">
        {macros.map((m) => {
          const pct = Math.min(100, Math.round((m.value / m.goal) * 100));
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">{m.label}</span>
                <span className="font-semibold" style={{ color: m.color }}>
                  {m.value}g <span className="text-slate-600">/ {m.goal}g</span>
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill animated-bar"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${m.color}cc, ${m.color})` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Weekly Trends Card ────────────────────────────────────────────────────────
function WeeklyTrendsCard() {
  const maxCal = Math.max(...weeklyData.map((d) => d.calories));
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="dash-card flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-badge cyan">
          <TrendingUp size={18} className="text-cyan" />
        </div>
        <div className="flex-1">
          <h2 className="card-title">Weekly Trends</h2>
          <p className="card-sub">Calorie overview</p>
        </div>
        <a href="/analytics" className="text-xs text-cyan hover:text-emerald transition-colors flex items-center gap-1">
          Others <ChevronRight size={12} />
        </a>
      </div>

      {/* Profile Rows */}
      <div className="flex gap-3 mb-4">
        {profiles.map((p) => (
          <div key={p.name} className="profile-chip">
            <div className="avatar" style={{ background: `${p.color}22`, border: `2px solid ${p.color}55` }}>
              <span style={{ color: p.color }}>{p.avatar}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{p.name}</p>
              <p className="text-xs text-slate-500">{p.intake}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} barSize={22} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {weeklyData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === todayIdx ? "#10b981" : i % 2 === 0 ? "#06b6d4" : "#0891b2"}
                  fillOpacity={i === todayIdx ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Dashboard Grid ────────────────────────────────────────────────────────────
export default function DashboardGrid() {
  return (
    <>
      <style>{`
        /* ── Base ── */
        .dash-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0f172a 100%);
          padding: 24px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        /* Ambient glow blobs */
        .dash-bg::before {
          content: '';
          position: fixed;
          top: -100px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .dash-bg::after {
          content: '';
          position: fixed;
          bottom: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Top Bar ── */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .logo-row { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(16,185,129,0.35);
        }
        .logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .logo-dot { color: #10b981; }
        .greeting { font-size: 13px; color: #64748b; font-weight: 500; }
        .date-badge {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          color: #94a3b8;
        }

        /* ── Grid ── */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 18px;
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr; }
        }

        /* ── Card ── */
        .dash-card {
          background: rgba(15, 23, 32, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 4px 6px rgba(0,0,0,0.4),
            0 1px 0 rgba(255,255,255,0.05) inset,
            0 -1px 0 rgba(0,0,0,0.3) inset;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          min-height: 320px;
        }
        .dash-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.5),
            0 0 0 1px rgba(16,185,129,0.1),
            0 1px 0 rgba(255,255,255,0.07) inset;
        }

        /* ── Icon Badge ── */
        .icon-badge {
          width: 38px; height: 38px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.25);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon-badge.cyan {
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.25);
        }

        /* ── Typography ── */
        .card-title { font-size: 16px; font-weight: 700; color: #f1f5f9; line-height: 1; }
        .card-sub { font-size: 11px; color: #475569; margin-top: 2px; }
        .text-emerald { color: #10b981; }
        .text-cyan { color: #06b6d4; }

        /* ── Dropzone ── */
        .dropzone {
          border: 2px dashed rgba(16,185,129,0.25);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          min-height: 130px;
          background: rgba(16,185,129,0.03);
        }
        .dropzone:hover, .dropzone-active {
          border-color: rgba(16,185,129,0.6);
          background: rgba(16,185,129,0.07);
        }
        .upload-icon-wrap {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(16,185,129,0.12);
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(16,185,129,0.25);
        }

        /* ── Preview ── */
        .preview-wrap {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          min-height: 130px;
        }
        .preview-img {
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 14px;
          display: block;
        }
        .preview-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }

        /* ── Analyze Button ── */
        .analyze-btn {
          width: 100%;
          padding: 12px 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.2px;
          transition: all 0.2s ease;
          box-shadow: 0 0 20px rgba(16,185,129,0.3);
        }
        .analyze-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 0 28px rgba(16,185,129,0.5);
          transform: translateY(-1px);
        }
        .analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Ghost Btn ── */
        .ghost-btn {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .ghost-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.1); }

        .ghost-action-btn {
          background: transparent;
          border: 1px solid rgba(6,182,212,0.25);
          border-radius: 10px;
          color: #06b6d4;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap-4;
          gap: 6px;
          transition: all 0.2s;
          width: 100%;
        }
        .ghost-action-btn:hover {
          background: rgba(6,182,212,0.08);
          border-color: rgba(6,182,212,0.5);
        }

        /* ── Tags / Pills ── */
        .tag-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
          font-size: 11px; font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .cyan-pill {
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.3);
          color: #06b6d4;
        }

        /* ── Calorie Hero ── */
        .cal-hero { text-align: center; padding: 16px 0 8px; }
        .cal-number {
          font-size: 64px; font-weight: 900;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1; letter-spacing: -2px;
        }
        .cal-label { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 2px; }
        .meal-desc { font-size: 12px; color: #94a3b8; margin-top: 6px; }

        /* ── Macro chips ── */
        .macro-row { display: flex; gap: 8px; margin-top: 8px; }
        .macro-chip {
          flex: 1; text-align: center;
          padding: 6px 4px;
          border-radius: 8px;
          font-size: 11px; font-weight: 700;
        }
        .macro-chip.protein { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
        .macro-chip.carbs { background: rgba(6,182,212,0.12); color: #06b6d4; border: 1px solid rgba(6,182,212,0.2); }
        .macro-chip.fats { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }

        /* ── Bars ── */
        .bar-track {
          height: 7px; background: rgba(255,255,255,0.05);
          border-radius: 99px; overflow: hidden;
        }
        .bar-fill {
          height: 100%; border-radius: 99px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animated-bar {
          animation: growBar 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes growBar {
          from { width: 0 !important; }
        }

        /* ── Profile chips ── */
        .profile-chip {
          display: flex; align-items: center; gap: 10px;
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 10px 12px;
        }
        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
          flex-shrink: 0;
        }

        /* ── Error ── */
        .error-banner {
          display: flex; align-items: start; gap: 8px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          padding: 10px 12px;
          color: #f87171;
        }

        /* ── Result summary ── */
        .result-summary {
          background: rgba(16,185,129,0.06);
          border: 1px solid rgba(16,185,129,0.15);
          border-radius: 12px;
          padding: 12px 14px;
        }
      `}</style>

      <div className="dash-bg">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="logo-row">
            <div className="logo-icon">
              <Zap size={20} color="#fff" />
            </div>
            <div>
              <div className="logo-text">Nutri<span className="logo-dot">AI</span></div>
              <div className="greeting">Good evening — stay on track 🥗</div>
            </div>
          </div>
          <div className="date-badge">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>

        {/* 2×2 Grid */}
        <div className="dash-grid">
          <ScanMealCard />
          <RecentAnalysisCard />
          <DailyIntakeCard />
          <WeeklyTrendsCard />
        </div>
      </div>
    </>
  );
}
