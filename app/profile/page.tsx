import { User, Settings, Target, Award } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <span>Profile & Settings</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <User className="w-16 h-16 text-blue-600" />
            <Settings className="w-16 h-16 text-purple-600" />
            <Target className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon!</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            User profiles, goal setting, and personalized recommendations are under development.
          </p>
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Guest User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
