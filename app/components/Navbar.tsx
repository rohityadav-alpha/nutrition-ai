"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, History, TrendingUp, User, Menu, X, Calculator, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/history", label: "History", icon: History },
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-xl"
              >
                <Leaf className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nutri<span className="text-emerald-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={link.href}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeNavLink"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                          style={{ boxShadow: "0 0 8px rgba(16,185,129,0.8)" }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-5 py-2 rounded-lg text-sm transition-all"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-emerald-500/40",
                    }
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
              style={{ background: "rgba(10,10,10,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                          active
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Auth */}
                <div className="pt-3 border-t border-slate-800 mt-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-3 rounded-xl transition-all">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <UserButton afterSignOutUrl="/" />
                      <span className="text-slate-300 font-medium">Account</span>
                    </div>
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
