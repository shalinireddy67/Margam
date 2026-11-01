"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { SITE_TAGLINE } from "@/config/site";
import { Logo } from "@/components/ui";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#422816] text-[#FFF7E6] pt-14 pb-24 md:pb-12 border-t-4 border-[#2F6B22] shadow-[0px_-4px_0px_rgba(0,0,0,0.35)]">
      {/* Layered Grass Strip with Pixel Flower Dots along top */}
      <div className="absolute top-0 inset-x-0 h-3 bg-[#5DAA3A] border-b-2 border-[#2F6B22] flex items-center justify-around overflow-hidden" aria-hidden="true">
        <div className="w-2 h-2 bg-[#E04A3F]" />
        <div className="w-2 h-2 bg-[#F4C542]" />
        <div className="w-2 h-2 bg-[#FFFFFF]" />
        <div className="w-2 h-2 bg-[#B070C9]" />
        <div className="w-2 h-2 bg-[#F4C542]" />
        <div className="w-2 h-2 bg-[#E04A3F]" />
        <div className="w-2 h-2 bg-[#FFFFFF]" />
        <div className="w-2 h-2 bg-[#B070C9]" />
        <div className="w-2 h-2 bg-[#F4C542]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b-2 border-[#5A3720]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#2B1B0F] bg-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] flex items-center justify-center shrink-0 rounded-[2px]">
              <Logo className="w-full h-full" ariaLabel="Margam Logo" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-[#FFE9A8] tracking-wider drop-shadow-[2px_2px_0px_#2B1B0F]">
                MARGAM
              </span>
              <p className="text-xs text-[#FFF7E6]/85 mt-0.5">{SITE_TAGLINE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#5A3720] px-3.5 py-1.5 border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] text-[#FFF7E6]">
            <ShieldCheck className="w-4 h-4 text-[#5DAA3A]" />
            <span className="font-bold">Adheres to DPDP Principles • Strictly Necessary Local Storage</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#5A3720] hover:bg-[#7A4B2A] text-xs font-heading font-bold text-[#FFF7E6] border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FFE9A8]" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF7E6]/75">
          <div>
            © 2026 Margam. Adaptive Mathematics for Indian Classrooms.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-bold">
            <Link href="/" className="hover:text-[#FFE9A8] transition-colors">Home</Link>
            <Link href="/student" className="hover:text-[#FFE9A8] transition-colors">Student Realm</Link>
            <Link href="/teacher" className="hover:text-[#FFE9A8] transition-colors">Teacher Tools</Link>
            <Link href="/privacy" className="hover:text-[#FFE9A8] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#FFE9A8] transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-[#FFE9A8] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
