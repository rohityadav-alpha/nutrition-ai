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
  Leaf,
} from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* Ambient Blob Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Landing Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-xl">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nutri<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-5 py-2 rounded-lg text-sm transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Powered by Google Gemini AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Track Your Nutrition
            <br />
            <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              with AI
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Simply snap a photo of your meal and let AI instantly analyze calories,
            protein, carbs, and fats. No manual logging required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
              style={{ boxShadow: "0 0 30px rgba(16,185,129,0.3)" }}
            >
              <span>Start Free</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center space-x-2 bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Hero Demo Card */}
        <div className="mt-20">
          <div
            className="max-w-3xl mx-auto rounded-2xl p-6"
            style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
          >
            <div
              className="rounded-xl p-10 text-center"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <Camera className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-slate-300 text-lg">
                Snap a photo of any meal to get instant nutrition analysis
              </p>

              {/* Mock macro display */}
              <div className="mt-6 flex justify-center gap-4 flex-wrap">
                {[
                  { label: "Calories", val: "650", color: "#10b981" },
                  { label: "Protein", val: "32g", color: "#06b6d4" },
                  { label: "Carbs", val: "78g", color: "#14b8a6" },
                  { label: "Fats", val: "24g", color: "#10b981" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="px-4 py-2 rounded-lg text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-lg font-bold" style={{ color: m.color }}>{m.val}</p>
                    <p className="text-xs text-slate-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, #0a0a0a, #0f1a14, #0a0a0a)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Track Nutrition
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Powerful features to help you understand and improve your eating habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: "AI Food Scanner", desc: "Take a photo and get instant nutrition breakdown powered by Google Gemini AI", color: "#10b981" },
              { icon: History, title: "Meal History", desc: "Track all your meals with detailed nutrition logs and weekly summaries", color: "#06b6d4" },
              { icon: TrendingUp, title: "Analytics", desc: "Visualize your nutrition trends with beautiful charts and insights", color: "#14b8a6" },
              { icon: Calculator, title: "Calorie Calculator", desc: "Calculate your daily calorie and macro needs based on your goals", color: "#10b981" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  background: "rgba(15,23,42,0.5)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}35` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                Why Choose NutriAI?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Instant Analysis", desc: "Get nutrition data in seconds, not minutes", color: "#10b981" },
                  { icon: Sparkles, title: "AI-Powered Accuracy", desc: "Google Gemini Vision ensures reliable results", color: "#06b6d4" },
                  { icon: Shield, title: "Privacy First", desc: "Your data stays yours, secure and private", color: "#14b8a6" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div
                      className="p-2.5 rounded-lg flex-shrink-0 mt-0.5"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Stats Card */}
            <div
              className="rounded-2xl p-8"
              style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
            >
              <h3 className="font-semibold mb-6 text-sm uppercase tracking-widest text-slate-400">Today&apos;s Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <span className="text-slate-300">Total Calories</span>
                  <span className="text-2xl font-bold text-emerald-400">650</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Protein", val: "32g", color: "#10b981" },
                    { label: "Carbs", val: "78g", color: "#06b6d4" },
                    { label: "Fats", val: "24g", color: "#14b8a6" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-xl text-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-lg font-bold" style={{ color: m.color }}>{m.val}</p>
                      <p className="text-xs text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Daily Goal Progress</span>
                    <span>650 / 2000 kcal</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-2 rounded-full" style={{ width: "32.5%", background: "linear-gradient(90deg, #10b981, #06b6d4)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))", borderTop: "1px solid rgba(16,185,129,0.15)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join thousands of users tracking their meals with AI
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105"
            style={{ boxShadow: "0 0 40px rgba(16,185,129,0.25)" }}
          >
            <span>Get Started Free</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-1.5 rounded-lg">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white font-bold">NutriAI</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 NutriAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
