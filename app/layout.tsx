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
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-screen">
          {!shouldHideNavbar && <Navbar />}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
