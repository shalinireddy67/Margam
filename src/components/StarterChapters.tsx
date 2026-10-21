"use client";

import React from "react";
import { BookOpen, Layers, CheckCircle2, ChevronRight, Hash } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { SupportedLanguage } from "@/lib/types";

interface StarterChaptersProps {
  currentLang: SupportedLanguage;
}

export default function StarterChapters({ currentLang }: StarterChaptersProps) {
  const t = {
    en: {
      badge: "Deep Curriculum Focus",
      headline: "Three Starter Chapters & Prerequisites",
      subhead:
        "Rather than attempting superficial breadth across all subjects, Margam models three foundational mathematics chapters with uncompromising depth and accurate NCERT alignment.",
    },
    hi: {
      badge: "गहन पाठ्यक्रम फोकस",
      headline: "तीन प्रारंभिक अध्याय और उनकी पूर्वापेक्षाएँ",
      subhead:
        "सभी विषयों पर सतही ध्यान देने के बजाय, मार्गम् तीन मुख्य अध्यायों का गहराई और सटीक एनसीईआरटी संरेखण के साथ मॉडल प्रस्तुत करता है।",
    },
    te: {
      badge: "లోతైన పాఠ్యాంశాల రూపకల్పన",
      headline: "మూడు ప్రారంభ పాఠాలు మరియు వాటి పునాది అంశాలు",
      subhead:
        "అన్ని సబ్జెక్టులను పైపైన చెప్పడం కంటే, ఎన్‌సిఈఆర్‌టి సిలబస్ ప్రకారం 3 కీలక గణిత అధ్యాయాలపై మార్గం లోతైన దృష్టిని సారిస్తుంది.",
    },
  }[currentLang];

  return (
    <section id="chapters" className="py-16 md:py-24 bg-white border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              07 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 3 Starter Chapter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chapter 1: Class 7 Integers */}
          <div className="rounded-2xl border-2 border-margam-border bg-margam-cream-paper p-6 sm:p-7 space-y-5 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-orange-100 text-margam-terracotta border border-orange-200">
                  Class 7 • Chapter 1
                </span>
                <span className="text-xs text-margam-slate font-semibold">4 Concepts</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-margam-navy">
                Integers
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                Negative numbers, sign preservation, debt/credit arithmetic, and algebraic sign products. The bedrock of middle-school algebra.
              </p>
              <div className="space-y-2 pt-2 border-t border-margam-border/70 text-xs font-sans">
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Number Line Navigation (c7-int-01)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Addition & Subtraction Rules (c7-int-02)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Sign Multiplication & Division (c7-int-03)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Distributive & Closure Properties (c7-int-04)</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono text-margam-slate">
              Key Prerequisite: Class 6 Opposite Numbers
            </div>
          </div>

          {/* Chapter 2: Class 8 Linear Equations */}
          <div className="rounded-2xl border-2 border-margam-border bg-margam-cream-paper p-6 sm:p-7 space-y-5 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  Class 8 • Chapter 2
                </span>
                <span className="text-xs text-margam-slate font-semibold">5 Concepts</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-margam-navy">
                Linear Equations
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                Expressions vs equations, balance pan transposition, variables on both sides, and real-life rupee/geometry word problems.
              </p>
              <div className="space-y-2 pt-2 border-t border-margam-border/70 text-xs font-sans">
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Expressions vs Equations (c8-lin-01)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Solution Verification LHS/RHS (c8-lin-02)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Transposition & Balancing (c8-lin-03)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Variables on Both Sides (c8-lin-04)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Auto Fare & Currency Word Problems (c8-lin-05)</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono text-margam-slate">
              Key Prerequisite: Class 7 Like-Terms & Transposition
            </div>
          </div>

          {/* Chapter 3: Class 9 Polynomials */}
          <div className="rounded-2xl border-2 border-margam-border bg-margam-cream-paper p-6 sm:p-7 space-y-5 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Class 9 • Chapter 2
                </span>
                <span className="text-xs text-margam-slate font-semibold">5 Concepts</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-margam-navy">
                Polynomials
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                Degrees, zeroes, Remainder Theorem, splitting middle terms, and algebraic identities connecting back to integer arithmetic.
              </p>
              <div className="space-y-2 pt-2 border-t border-margam-border/70 text-xs font-sans">
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Degrees & One-Variable Terms (c9-poly-01)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Zeroes of Polynomial P(k)=0 (c9-poly-02)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Remainder Theorem (c9-poly-03)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Factor Theorem & Splitting Middle Term (c9-poly-04)</span>
                </div>
                <div className="flex items-center gap-2 text-margam-navy font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-margam-emerald shrink-0" />
                  <span>Algebraic Identities Expansion (c9-poly-05)</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono text-margam-slate">
              Key Prerequisite: Class 7 Signed Multiplication Rules
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
