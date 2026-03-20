"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { getUserProfile, updateUserProfile } from "@/app/profile";
import {
  User,
  Settings,
  Target,
  Save,
  Loader2,
  CheckCircle,
  Flame,
  Beef,
  Wheat,
  Droplet,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  name: string | null;
  weight: number | null;
  height: number | null;
  age: number | null;
  gender: string | null;
  goal: string | null;
  activityLevel: string | null;
  targetCalories: number | null;
  targetProtein: number | null;
  targetCarbs: number | null;
  targetFats: number | null;
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

export default function ProfileClient() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const response = await getUserProfile();
    if (response.success && response.profile) {
      const p = response.profile;
      setProfile(p);
      setName(p.name || "");
      setWeight(p.weight?.toString() || "");
      setHeight(p.height?.toString() || "");
      setAge(p.age?.toString() || "");
      setGender(p.gender || "");
      setGoal(p.goal || "");
      setActivityLevel(p.activityLevel || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const response = await updateUserProfile({
      name: name || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      goal: goal || undefined,
      activityLevel: activityLevel || undefined,
    });
    if (response.success && response.profile) {
      setProfile(response.profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#10b981";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(71,85,105,0.6)";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <User className="w-8 h-8 text-emerald-400" />
            <span>Profile & Settings</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage your account and preferences</p>
        </motion.div>

        {/* User Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl p-6 mb-6 flex items-center space-x-5"
          style={{ ...cardStyle, borderLeft: "3px solid #10b981" }}
        >
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full ring-2"
              style={{ ringColor: "rgba(16,185,129,0.4)" }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <User className="w-8 h-8 text-emerald-400" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.fullName || name || "User"}</h2>
            <p className="text-slate-400 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
            {profile?.goal && (
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                Goal: {profile.goal}
              </span>
            )}
          </div>

          {/* Sign Out */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>Personal Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={user?.emailAddresses[0]?.emailAddress || ""}
                  disabled
                  className={inputClass}
                  style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 70"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 25"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={inputClass}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Goals & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-xl"
            style={cardStyle}
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Goals & Activity</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Your Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  <option value="">Select your goal</option>
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (intense daily exercise)</option>
                </select>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                style={{ boxShadow: "0 0 20px rgba(16,185,129,0.2)" }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Profile</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Daily Targets */}
          {profile?.targetCalories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-6 rounded-xl"
              style={cardStyle}
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>Your Daily Targets</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Flame, label: "Calories", val: profile.targetCalories, unit: "", color: "#10b981" },
                  { icon: Beef, label: "Protein", val: profile.targetProtein, unit: "g", color: "#06b6d4" },
                  { icon: Wheat, label: "Carbs", val: profile.targetCarbs, unit: "g", color: "#14b8a6" },
                  { icon: Droplet, label: "Fats", val: profile.targetFats, unit: "g", color: "#10b981" },
                ].map((t) => (
                  <motion.div
                    key={t.label}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-5 rounded-xl text-center"
                    style={{ background: `${t.color}10`, border: `1px solid ${t.color}25` }}
                  >
                    <t.icon className="w-8 h-8 mx-auto mb-2" style={{ color: t.color }} />
                    <p className="text-2xl font-bold" style={{ color: t.color }}>
                      {t.val}{t.unit}
                    </p>
                    <p className="text-sm text-slate-400">{t.label}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-slate-500 mt-5 text-center">
                These targets are calculated based on your profile and goals.
                Update your profile to recalculate.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
