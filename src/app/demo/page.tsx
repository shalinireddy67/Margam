import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Logo } from "@/components/ui";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "Try Margam without signing up | Demo",
  description: "Test Margam as a student or teacher using a sample class of 25 students.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  const demoPassword = process.env.DEMO_PASSWORD || undefined;

  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b-[3px] border-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
            aria-label="Margam Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[2px] bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center shrink-0">
              <Logo className="w-5 h-5 sm:w-6 sm:h-6" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-sm sm:text-lg text-[#2B1B0F] tracking-wider leading-none">
                MARGAM
              </span>
              <span className="text-[10px] font-sans font-bold text-[#7A4B2A] leading-tight mt-0.5">
                Maths for Classes 6-10
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="px-3.5 py-1.5 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-bold text-xs shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#2B1B0F] tracking-tight">
            Try Margam without signing up
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/80 leading-relaxed">
            The data is made up: one class of 25 students
          </p>
        </div>

        {/* Interactive Client Component */}
        <DemoClient demoPassword={demoPassword} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t-[3px] border-[#2B1B0F] bg-[#FFFFFF] py-6 text-center text-xs text-[#2B1B0F]/70 font-sans">
        <p>Margam &copy; 2026 &middot; Built for Code Kernel &apos;26</p>
      </footer>
    </div>
  );
}

