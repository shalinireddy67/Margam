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
    <footer className="bg-[#0F2610] text-[#D8D8D0] pt-12 pb-24 md:pb-12 border-t-3 border-[#315B2A] shadow-[0px_-4px_0px_#102610]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b-2 border-[#173B19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#102610] shadow-[2px_2px_0px_#102610] flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" ariaLabel="Margam Logo" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-[#79B82A] tracking-wider drop-shadow-[2px_2px_0px_#102610]">
                MARGAM
              </span>
              <p className="text-xs text-[#D8D8D0]/80 mt-0.5">{SITE_TAGLINE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#173B19] px-3.5 py-1.5 border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] text-[#F2F0DF]">
            <ShieldCheck className="w-4 h-4 text-[#79B82A]" />
            <span className="font-bold">Adheres to DPDP Principles • Strictly Necessary Local Storage</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#173B19] hover:bg-[#315B2A] text-xs font-heading font-bold text-[#F2F0DF] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8D8D0]/70">
          <div>
            © 2026 Margam. Adaptive Mathematics for Indian Classrooms.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-bold">
            <Link href="/" className="hover:text-[#79B82A] transition-colors">Home</Link>
            <Link href="/student" className="hover:text-[#79B82A] transition-colors">Student Realm</Link>
            <Link href="/teacher" className="hover:text-[#79B82A] transition-colors">Teacher Tools</Link>
            <Link href="/privacy" className="hover:text-[#79B82A] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#79B82A] transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-[#79B82A] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
