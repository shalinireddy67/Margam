"use client";

import React from "react";
import { Compass, ShieldCheck, ArrowUp, CheckCircle2 } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1C2D14] text-[#FFF7E6] pt-16 pb-12 border-t border-[#3B5428]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Closing Call to Action Banner */}
        <div className="bg-[#253C1B] rounded-[28px] border-2 border-[#3B5428] p-8 sm:p-12 text-center space-y-6 shadow-warm-lg relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFF3DA]/10 text-accent border border-accent/30">
            <Compass className="w-4 h-4 text-accent" />
            <span>Find Your Individual Path</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FFF7E6] leading-tight max-w-2xl mx-auto tracking-tight">
            {SITE_TAGLINE}
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#C2DDAE] max-w-xl mx-auto leading-relaxed">
            Give every Indian student the chance to strengthen foundational gaps at their own pace, while keeping the classroom teacher firmly in control.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#try-diagnostic"
              className="px-6 py-3 rounded-[14px] font-heading font-bold text-sm bg-accent hover:bg-[#d97a2b] text-white transition-all shadow-warm cursor-pointer"
            >
              Start 3-Question Diagnostic
            </a>
            <a
              href="#concept-pathway"
              className="px-6 py-3 rounded-[14px] font-heading font-bold text-sm bg-[#1C2D14] hover:bg-[#253C1B] text-[#FFF7E6] border-2 border-[#3B5428] transition-all cursor-pointer"
            >
              Explore Concept Graph
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#3B5428]/60 text-xs font-sans">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-warm-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-heading text-2xl font-black text-[#FFF7E6]">
                Mar<span className="text-accent">gam</span>
              </span>
            </div>
            <p className="text-[#C2DDAE] leading-relaxed">
              Adaptive mathematics diagnostic and prerequisite remediation platform for Classes 6 to 10. NCERT aligned.
            </p>
            <div className="text-muted-foreground font-mono text-[11px] bg-[#1C2D14] px-2.5 py-1 rounded-full border border-[#3B5428] inline-block">
              Code Kernel &apos;26 • Decode Round
            </div>
          </div>

          {/* Col 2: Starter Chapters */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold uppercase tracking-wider text-[#FFF7E6] text-xs block">
              Curriculum Scope
            </span>
            <ul className="space-y-1.5 text-[#C2DDAE]">
              <li>Class 7: Integers (4 Concepts)</li>
              <li>Class 8: Linear Equations (5 Concepts)</li>
              <li>Class 9: Polynomials (5 Concepts)</li>
              <li>Class 6 & 7 Prerequisites Included</li>
              <li>21-Node Acyclic NCERT DAG</li>
            </ul>
          </div>

          {/* Col 3: Languages & Accessibility */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold uppercase tracking-wider text-[#FFF7E6] text-xs block">
              Languages & Worksheets
            </span>
            <ul className="space-y-1.5 text-[#C2DDAE]">
              <li>English • हिन्दी • తెలుగు</li>
              <li>Human-Audited JSON Content</li>
              <li>Printable 1-Page A4 Worksheets</li>
              <li>Low-Data Payloads (&lt; 50 KB)</li>
              <li>WCAG AA Contrast Compliant</li>
            </ul>
          </div>

          {/* Col 4: Child Privacy & Standards */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold uppercase tracking-wider text-[#FFF7E6] text-xs block">
              DPDP Act 2023 Compliance
            </span>
            <p className="text-[#C2DDAE] leading-relaxed text-[11px]">
              Built strictly following Digital Personal Data Protection principles. Zero tracking cookies, zero third-party advertising scripts, and localized session persistence.
            </p>
            <div className="flex items-center gap-1.5 text-[#85C060] font-bold text-xs pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Surveillance Architecture</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3B5428]/60 flex flex-wrap items-center justify-between gap-4 text-xs text-[#C2DDAE]">
          <div>
            © 2026 Margam. Built with pedagogical integrity for Indian education.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#253C1B] hover:bg-[#355227] text-[#FFF7E6] border border-[#3B5428] font-heading font-bold transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
