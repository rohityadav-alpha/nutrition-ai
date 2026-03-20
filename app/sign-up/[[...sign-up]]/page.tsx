"use client";

import { SignUp } from "@clerk/nextjs";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#0a0a0a", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl">
          <Leaf className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Nutri<span className="text-emerald-400">AI</span>
        </span>
      </div>

      {/* Clerk SignUp Card */}
      <div
        className="w-full max-w-md rounded-2xl p-2"
        style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#10b981",
              colorBackground: "transparent",
              colorInputBackground: "rgba(30,41,59,0.9)",
              colorInputText: "#f1f5f9",
              colorText: "#f1f5f9",
              colorTextSecondary: "#94a3b8",
              colorNeutral: "#1e293b",
              borderRadius: "12px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
            elements: {
              card: { background: "transparent", boxShadow: "none", border: "none" },
              rootBox: { width: "100%" },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#000",
                fontWeight: "700",
              },
              formFieldInput: {
                background: "rgba(30,41,59,0.9)",
                border: "1px solid rgba(71,85,105,0.6)",
                color: "#f1f5f9",
              },
              socialButtonsBlockButton: {
                background: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(71,85,105,0.5)",
                color: "#f1f5f9",
              },
              dividerLine: { background: "rgba(71,85,105,0.4)" },
              dividerText: { color: "#64748b" },
              footerActionLink: { color: "#10b981" },
              headerTitle: { color: "#f1f5f9" },
              headerSubtitle: { color: "#94a3b8" },
            },
          }}
        />
      </div>

      <p className="mt-6 text-slate-400 text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
