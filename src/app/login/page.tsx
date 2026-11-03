import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import LoginForm from "./LoginForm";
import LoginShellFallback from "./LoginShellFallback";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Margam as a student or teacher to diagnose prerequisite gaps and access lessons.",
  openGraph: {
    title: "Sign in | Margam",
    description:
      "Sign in to Margam as a student or teacher to diagnose prerequisite gaps and access lessons.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in | Margam",
    description:
      "Sign in to Margam as a student or teacher to diagnose prerequisite gaps and access lessons.",
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      {/* Floating Top Header */}
      <header className="max-w-[1200px] mx-auto mt-3 px-3 sm:px-6 w-full">
        <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center text-[#2B1B0F]">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-base sm:text-lg text-[#2B1B0F]">MARGAM</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2B1B0F] hover:bg-[#FFF7E6] py-1.5 px-3 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center space-y-6">
        <Suspense fallback={<LoginShellFallback />}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Lightweight Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#2B1B0F]/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}
