"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
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
} from "lucide-react";

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

export default function ProfileClient() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 text-gray-700">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <span>Profile & Settings</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </h2>

            <div className="space-y-4">
              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.emailAddresses[0]?.emailAddress || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Goals & Activity</span>
            </h2>

            <div className="space-y-4">
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
                  <option value="">Select your goal</option>
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Muscle</option>
                </select>
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
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (intense daily exercise)</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              </button>
            </div>
          </div>

          {/* Daily Targets Card */}
          {profile?.targetCalories && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-green-600" />
                <span>Your Daily Targets</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Calories */}
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-700">
                    {profile.targetCalories}
                  </p>
                  <p className="text-sm text-orange-600">Calories</p>
                </div>

                {/* Protein */}
                <div className="bg-red-50 p-4 rounded-xl text-center">
                  <Beef className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-700">
                    {profile.targetProtein}g
                  </p>
                  <p className="text-sm text-red-600">Protein</p>
                </div>

                {/* Carbs */}
                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                  <Wheat className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700">
                    {profile.targetCarbs}g
                  </p>
                  <p className="text-sm text-yellow-600">Carbs</p>
                </div>

                {/* Fats */}
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <Droplet className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">
                    {profile.targetFats}g
                  </p>
                  <p className="text-sm text-green-600">Fats</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                These targets are calculated based on your profile and goals.
                Update your profile to recalculate.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
