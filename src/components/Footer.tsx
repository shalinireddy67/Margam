"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { Logo } from "@/components/ui";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#5A3720] text-[#FFF7E6] pt-8 pb-20 md:pb-8 border-t-4 border-[#422816] shadow-[0px_-4px_0px_rgba(0,0,0,0.35)]">
      {/* Layered Grass Strip along the top of ground */}
      <div
        className="absolute top-0 inset-x-0 h-2 bg-[#5DAA3A] border-b border-[#2F6B22] flex items-center justify-around overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-1.5 h-1.5 bg-[#E04A3F]" />
        <div className="w-1.5 h-1.5 bg-[#F4C542]" />
        <div className="w-1.5 h-1.5 bg-[#FFFFFF]" />
        <div className="w-1.5 h-1.5 bg-[#B070C9]" />
        <div className="w-1.5 h-1.5 bg-[#F4C542]" />
        <div className="w-1.5 h-1.5 bg-[#E04A3F]" />
        <div className="w-1.5 h-1.5 bg-[#FFFFFF]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#2B1B0F] bg-[#7A4B2A] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center shrink-0 rounded-[2px]">
              <Logo className="w-5 h-5" ariaLabel="Margam Logo" />
            </div>
            <div>
              <span className="font-pixel text-sm text-[#FFE9A8] tracking-wider">
                MARGAM
              </span>
              <span className="text-[11px] text-[#FFF7E6]/75 ml-2 font-sans">
                Maths for Classes 6-10
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-5 text-xs font-sans font-bold text-[#FFF7E6]">
            <Link href="/" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Home
            </Link>
            <Link href="/student" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Learn
            </Link>
            <Link href="/teacher" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Teacher
            </Link>
            <Link href="/privacy" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#FFE9A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]">
              Cookies
            </Link>
          </nav>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#422816] hover:bg-[#7A4B2A] text-xs font-sans font-bold text-[#FFF7E6] border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FFE9A8]" />
          </button>
        </div>

        <div className="pt-2 border-t border-[#7A4B2A]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFF7E6]/70 font-sans gap-2">
          <p className="m-0">
            No email or phone asked. No ad trackers. Built around NCERT chapters for Classes 6-10.
          </p>
          <p className="m-0 text-[#FFE9A8]/90 font-medium">
            English · हिन्दी · తెలుగు
          </p>
        </div>
      </div>
    </footer>
  );
}
