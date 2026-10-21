"use client";

import React from "react";
import { BookOpen, Layers, CheckCircle2, ChevronRight, Hash } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface StarterChaptersProps {
  currentLang: SupportedLanguage;
}

export default function StarterChapters({ currentLang }: StarterChaptersProps) {
  const t = {
    en: {
      sectionNum: "09 / STARTER MATHEMATICS MODULES",
      badge: "Deep Curriculum Focus",
      headline: "Three Starter Chapters & Prerequisites",
      subhead:
        "Rather than attempting superficial breadth across all subjects, Margam models three foundational mathematics chapters with uncompromising depth and accurate NCERT alignment.",
    },
    hi: {
      sectionNum: "09 / प्रारंभिक गणित अध्याय",
      badge: "गहन पाठ्यक्रम फोकस",
      headline: "तीन प्रारंभिक अध्याय और उनकी पूर्वापेक्षाएँ",
      subhead:
        "सभी विषयों पर सतही ध्यान देने के बजाय, मार्गम् तीन मुख्य अध्यायों का गहराई और सटीक एनसीईआरटी संरेखण के साथ मॉडल प्रस्तुत करता है।",
    },
    te: {
      sectionNum: "09 / ప్రారంభ గణిత పాఠాలు",
      badge: "లోతైన పాఠ్యాంశాల రూపకల్పన",
      headline: "మూడు ప్రారంభ పాఠాలు మరియు వాటి పునాది అంశాలు",
      subhead:
        "అన్ని సబ్జెక్టులను పైపైన చెప్పడం కంటే, ఎన్‌సిఈఆర్‌టి సిలబస్ ప్రకారం 3 కీలక గణిత అధ్యాయాలపై మార్గం లోతైన దృష్టిని సారిస్తుంది.",
    },
  }[currentLang];

  return (
    <section id="chapters" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
          <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
          <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{t.sectionNum}</span>
      </div>

      <div className="max-w-3xl mb-10 space-y-3">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* 3 Starter Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chapter 1: Class 7 Integers */}
        <div className="rounded-[22px] border-2 border-[#C7DDAE] bg-card p-6 sm:p-7 space-y-5 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF3DA] text-accent border border-[#FCD685]">
                Class 7 • Chapter 1
              </span>
              <span className="text-xs text-muted-foreground font-semibold">4 Concepts</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Integers
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              Negative numbers, sign preservation, debt/credit arithmetic, and algebraic sign products. The bedrock of middle-school algebra.
            </p>
            <div className="space-y-2 pt-3 border-t border-[#C7DDAE]/60 text-xs font-sans">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Number Line Navigation (c7-int-01)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Addition & Subtraction Rules (c7-int-02)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Sign Multiplication & Division (c7-int-03)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Distributive & Closure Properties (c7-int-04)</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-[#C7DDAE]/60 text-[11px] font-mono text-muted-foreground">
            Key Prerequisite: Class 6 Opposite Numbers
          </div>
        </div>

        {/* Chapter 2: Class 8 Linear Equations */}
        <div className="rounded-[22px] border-2 border-[#C7DDAE] bg-card p-6 sm:p-7 space-y-5 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EAF5E1] text-primary border border-[#B7DE9E]">
                Class 8 • Chapter 2
              </span>
              <span className="text-xs text-muted-foreground font-semibold">5 Concepts</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Linear Equations
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              Expressions vs equations, balance pan transposition, variables on both sides, and real-life rupee/geometry word problems.
            </p>
            <div className="space-y-2 pt-3 border-t border-[#C7DDAE]/60 text-xs font-sans">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Expressions vs Equations (c8-lin-01)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Solution Verification LHS/RHS (c8-lin-02)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Transposition & Balancing (c8-lin-03)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Variables on Both Sides (c8-lin-04)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Auto Fare & Currency Word Problems (c8-lin-05)</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-[#C7DDAE]/60 text-[11px] font-mono text-muted-foreground">
            Key Prerequisite: Class 7 Like-Terms & Transposition
          </div>
        </div>

        {/* Chapter 3: Class 9 Polynomials */}
        <div className="rounded-[22px] border-2 border-[#C7DDAE] bg-card p-6 sm:p-7 space-y-5 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EAF5E1] text-[#2F4A1E] border border-[#B7DE9E]">
                Class 9 • Chapter 2
              </span>
              <span className="text-xs text-muted-foreground font-semibold">5 Concepts</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Polynomials
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              Degrees, zeroes, Remainder Theorem, splitting middle terms, and algebraic identities connecting back to integer arithmetic.
            </p>
            <div className="space-y-2 pt-3 border-t border-[#C7DDAE]/60 text-xs font-sans">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Degrees & One-Variable Terms (c9-poly-01)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Zeroes of Polynomial P(k)=0 (c9-poly-02)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Remainder Theorem (c9-poly-03)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Factor Theorem & Middle Term (c9-poly-04)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Algebraic Identities Expansion (c9-poly-05)</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-[#C7DDAE]/60 text-[11px] font-mono text-muted-foreground">
            Key Prerequisite: Class 7 Signed Multiplication Rules
          </div>
        </div>
      </div>
    </section>
  );
}
