"use client";

import React from "react";
import { Compass, ShieldCheck, Github, ArrowUp, Heart } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-margam-navy text-white pt-16 pb-12 border-t border-margam-navy-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Closing Call to Action Banner */}
        <div className="bg-margam-navy-card rounded-2xl border border-white/10 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Compass className="w-4 h-4" />
            <span>Find Your Individual Path</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl mx-auto">
            {SITE_TAGLINE}
          </h2>

          <p className="font-sans text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Give every Indian student the chance to strengthen foundational gaps at their own pace, while keeping the classroom teacher firmly in control.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#try-diagnostic"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-margam-terracotta hover:bg-margam-terracotta-hover text-white transition-all shadow-warm"
            >
              Try 3-Question Diagnostic
            </a>
            <a
              href="#concept-pathway"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
            >
              Explore Concept Graph
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 text-xs">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-margam-terracotta text-white flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-black text-white">{SITE_NAME}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Adaptive mathematics diagnostic and remediation platform for Classes 6 to 10. NCERT aligned.
            </p>
            <div className="text-gray-400 font-mono text-[11px]">
              Code Kernel &apos;26 • Decode Round
            </div>
          </div>

          {/* Col 2: Starter Chapters */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-white text-[11px] block">
              Curriculum Scope
            </span>
            <ul className="space-y-1.5 text-gray-400">
              <li>Class 7: Integers (4 Concepts)</li>
              <li>Class 8: Linear Equations (5 Concepts)</li>
              <li>Class 9: Polynomials (5 Concepts)</li>
              <li>Class 6 & 7 Prerequisites Included</li>
            </ul>
          </div>

          {/* Col 3: Languages & Accessibility */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-white text-[11px] block">
              Languages & Accessibility
            </span>
            <ul className="space-y-1.5 text-gray-400">
              <li>English • हिन्दी • తెలుగు</li>
              <li>Low-Data Static Payloads</li>
              <li>Printable 1-Page A4 Worksheets</li>
              <li>WCAG AA Contrast Compliant</li>
            </ul>
          </div>

          {/* Col 4: Child Privacy & Standards */}
          <div className="space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-white text-[11px] block">
              Privacy & Compliance
            </span>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Built strictly following Digital Personal Data Protection (DPDP) Act 2023 principles. Zero tracking cookies, zero marketing scripts, and local-only session persistence.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Surveillance Architecture</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Margam Learning Platform. Built for Code Kernel &apos;26.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shalinireddy67/kernel2k26"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
