"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, History, TrendingUp, User, Menu, X, Calculator } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Scanner", icon: Pizza },
    { href: "/history", label: "History", icon: History },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NutriAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all hover:scale-105">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-200">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-lg">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-gray-700 font-medium">Account</span>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
