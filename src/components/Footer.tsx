"use client";

import React from "react";
import { Compass, ShieldCheck, ArrowUp } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-sidebar text-white pt-12 pb-24 md:pb-12 border-t border-[#2C3545]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#2C3545]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl text-white">
                Margam
              </span>
              <p className="text-xs text-sidebar-muted">{SITE_TAGLINE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-[#1E2533] px-3.5 py-1.5 rounded-full border border-[#2C3545] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Adheres to DPDP Principles • Strictly Necessary Local Storage Only</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2533] hover:bg-[#252F42] text-xs font-heading font-bold text-white border border-[#2C3545] transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sidebar-muted">
          <div>
            © 2026 Margam. Adaptive Mathematics for Indian Classrooms.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-heading">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/student" className="hover:text-white transition-colors">Student Path</a>
            <a href="/teacher" className="hover:text-white transition-colors">Teacher Tools</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
