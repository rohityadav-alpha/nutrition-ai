import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  TrendingUp,
  History,
  Calculator,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default async function LandingPage() {
  // If already logged in, redirect to dashboard
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">NutriAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Nutrition
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}with AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Simply snap a photo of your meal and let AI instantly analyze calories, 
            protein, carbs, and fats. No manual logging required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span>Start Free</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Demo Image/Mockup */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto border border-gray-200">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center">
              <Camera className="w-20 h-20 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                Snap a photo of any meal to get instant nutrition analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Track Nutrition
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful features to help you understand and improve your eating habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI Food Scanner</h3>
              <p className="text-gray-600">
                Take a photo and get instant nutrition breakdown powered by Google Gemini AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Meal History</h3>
              <p className="text-gray-600">
                Track all your meals with detailed nutrition logs and weekly summaries
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600">
                Visualize your nutrition trends with beautiful charts and insights
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Calorie Calculator</h3>
              <p className="text-gray-600">
                Calculate your daily calorie and macro needs based on your goals
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose NutriAI?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Instant Analysis</h3>
                    <p className="text-gray-600">Get nutrition data in seconds, not minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">AI-Powered Accuracy</h3>
                    <p className="text-gray-600">Google Gemini Vision ensures reliable results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Privacy First</h3>
                    <p className="text-gray-600">Your data stays yours, secure and private</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total Calories</span>
                  <span className="text-2xl font-bold text-gray-800">650</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-red-700">32g</p>
                    <p className="text-xs text-red-600">Protein</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-orange-700">78g</p>
                    <p className="text-xs text-orange-600">Carbs</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-yellow-700">24g</p>
                    <p className="text-xs text-yellow-600">Fats</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of users tracking their meals with AI
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span>Get Started Free</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NutriAI</span>
            </div>
            <p className="text-sm">
              © 2025 NutriAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
