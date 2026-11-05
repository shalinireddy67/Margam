"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { LanguageToggle, type Language } from "@/components/ui";

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalDocument {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  sections: LegalSection[];
  backText: string;
}

export interface LegalPageViewerProps {
  content: Record<"en" | "hi" | "te", LegalDocument>;
}

export function LegalPageViewer({ content }: LegalPageViewerProps) {
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const doc = content[currentLang] || content.en;
  const lastUpdated = doc.lastUpdated || "5 November 2026";

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 border-b-[3px] border-[#2B1B0F] bg-white text-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Margam home"
            className="flex items-center gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
          >
            <div className="w-9 h-9 bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] flex items-center justify-center shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-xl text-[#2B1B0F]">
              Margam
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle
              currentLang={currentLang}
              onLanguageChange={(lang) => setCurrentLang(lang)}
            />
            <Link
              href="/"
              className="min-h-[40px] px-3.5 inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2B1B0F] bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{doc.backText}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 space-y-6 rounded-[2px]">
          {/* Document Header */}
          <div className="space-y-2 border-b-2 border-[#2B1B0F]/15 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 border-2 border-[#2B1B0F] bg-[#FFF7E6] text-[10px] font-heading font-bold uppercase tracking-wider text-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] rounded-[2px] inline-block">
                {doc.badge}
              </span>
              <span className="text-xs text-[#2B1B0F]/70 font-sans font-medium">
                Last updated: {lastUpdated}
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
              {doc.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#2B1B0F]/80 leading-relaxed">
              {doc.subtitle}
            </p>
          </div>

          {/* Document Sections */}
          <div className="space-y-6 pt-1">
            {doc.sections.map((section, idx) => (
              <section key={idx} className="space-y-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-[#2B1B0F]">
                  {section.title}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#2B1B0F]/70">
        © 2026 Margam · Maths for Classes 6–10
      </footer>
    </div>
  );
}

