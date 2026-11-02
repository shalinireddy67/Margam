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
    <footer className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-10">
      <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/70 shadow-[0_8px_32px_rgba(16,42,18,0.08)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center shrink-0">
              <Logo className="w-6 h-6 text-white" ariaLabel="Margam Logo" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-emerald-950 tracking-wider">
                MARGAM
              </span>
              <p className="text-xs text-emerald-900/80 font-medium mt-0.5">{SITE_TAGLINE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/70 px-3.5 py-2 border border-emerald-200/60 rounded-xl shadow-xs text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Adheres to DPDP Principles • Strictly Necessary Local Storage</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-xs font-heading font-bold text-emerald-950 border border-white/80 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            © 2026 Margam. Adaptive Mathematics for Indian Classrooms.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-bold text-emerald-900">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link href="/student" className="hover:text-emerald-600 transition-colors">Student Realm</Link>
            <Link href="/login?role=teacher" className="hover:text-emerald-600 transition-colors">Teacher Portal</Link>
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-emerald-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
