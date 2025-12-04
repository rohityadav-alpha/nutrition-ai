"use client";

import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Jahan Navbar hide karna hai
  const hideNavbarOn = ["/", "/sign-in", "/sign-up"];

  const shouldHideNavbar = hideNavbarOn.includes(pathname);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50">
          {!shouldHideNavbar && <Navbar />}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
