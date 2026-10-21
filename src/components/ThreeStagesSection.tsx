"use client";

import React, { useState } from "react";
import { BookOpen, CheckSquare, Award, ArrowRight, Lightbulb, Compass, Sparkles } from "lucide-react";
import lessonsData from "../../data/lessons.json";
import { SupportedLanguage } from "@/lib/types";

interface ThreeStagesSectionProps {
  currentLang: SupportedLanguage;
}

export default function ThreeStagesSection({ currentLang }: ThreeStagesSectionProps) {
  const [activeStage, setActiveStage] = useState<"learn" | "solve" | "test">("learn");
  const [selectedVariant, setSelectedVariant] = useState<"basics_first" | "standard" | "fast_track">(
    "basics_first"
  );

  // Lesson sample for demoing
  const sampleLesson = lessonsData.find((l) => l.conceptId === "c7-int-02") || lessonsData[0];
  const activeContent = sampleLesson[selectedVariant];

  const t = {
    en: {
      badge: "Three Connected Learning Stages",
      headline: "Learn • Solve • Test",
      subhead:
        "Most educational software only adapts practice question difficulty. Margam adapts all three connected stages of understanding, ensuring students never get stuck on abstract theory or repetitive drills.",
    },
    hi: {
      badge: "तीन परस्पर जुड़े शिक्षण चरण",
      headline: "सीखें (Learn) • हल करें (Solve) • परीक्षण दें (Test)",
      subhead:
        "अधिकांश शैक्षिक सॉफ़्टवेयर केवल अभ्यास प्रश्नों की कठिनाई बदलते हैं। मार्गम् समझ के तीनों चरणों को अनुकूलित करता है ताकि विद्यार्थी कभी भी अमूर्त सिद्धांतों या दोहराव में न फंसे।",
    },
    te: {
      badge: "మూడు అనుసంధాన అభ్యాస దశలు",
      headline: "నేర్చుకోండి (Learn) • సాధించండి (Solve) • పరీక్షించండి (Test)",
      subhead:
        "చాలా వెబ్‌సైట్లు కేవలం లెక్కల కష్టాన్ని మాత్రమే మారుస్తాయి. మార్గం అవగాహన యొక్క మూడు దశలనూ అనుకూలీకరించి విద్యార్థికి సమగ్ర స్పష్టతను అందిస్తుంది.",
    },
  }[currentLang];

  return (
    <section id="three-stages" className="py-16 md:py-24 bg-white border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              03 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* Stage Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-margam-border pb-3">
          <button
            type="button"
            onClick={() => setActiveStage("learn")}
            className={`min-h-[44px] px-5 rounded-xl font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStage === "learn"
                ? "bg-margam-navy text-white shadow-warm"
                : "text-margam-slate hover:bg-margam-cream-paper hover:text-margam-navy"
            }`}
          >
            <BookOpen className="w-4 h-4 text-margam-terracotta" />
            <span>1. LEARN (3 Lesson Variants)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage("solve")}
            className={`min-h-[44px] px-5 rounded-xl font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStage === "solve"
                ? "bg-margam-navy text-white shadow-warm"
                : "text-margam-slate hover:bg-margam-cream-paper hover:text-margam-navy"
            }`}
          >
            <CheckSquare className="w-4 h-4 text-margam-amber" />
            <span>2. SOLVE (Adaptive Practice)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStage("test")}
            className={`min-h-[44px] px-5 rounded-xl font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStage === "test"
                ? "bg-margam-navy text-white shadow-warm"
                : "text-margam-slate hover:bg-margam-cream-paper hover:text-margam-navy"
            }`}
          >
            <Award className="w-4 h-4 text-margam-emerald" />
            <span>3. TEST (Personalized Checks)</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeStage === "learn" && (
          <div className="space-y-6">
            {/* Variant Switcher */}
            <div className="bg-margam-cream-paper p-4 rounded-2xl border border-margam-border flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-slate">
                Select Teaching Variant (Sample: Class 7 Integer Subtraction):
              </span>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-margam-border text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedVariant("basics_first")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedVariant === "basics_first"
                      ? "bg-margam-terracotta text-white shadow-xs"
                      : "text-margam-slate hover:text-margam-navy"
                  }`}
                >
                  Basics-First (Visual & Kirana Model)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVariant("standard")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedVariant === "standard"
                      ? "bg-margam-terracotta text-white shadow-xs"
                      : "text-margam-slate hover:text-margam-navy"
                  }`}
                >
                  Standard (NCERT Formal Steps)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVariant("fast_track")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedVariant === "fast_track"
                      ? "bg-margam-terracotta text-white shadow-xs"
                      : "text-margam-slate hover:text-margam-navy"
                  }`}
                >
                  Fast-Track (Vector Shifts & Shortcuts)
                </button>
              </div>
            </div>

            {/* Live Lesson Content Card */}
            <div className="rounded-2xl border-2 border-margam-border bg-white p-6 sm:p-8 space-y-6 shadow-card">
              <div className="border-b border-margam-border/70 pb-4 space-y-1">
                <span className="text-xs font-mono font-bold text-margam-terracotta uppercase">
                  Concept: c7-int-02 • {selectedVariant.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-bold text-margam-navy">
                  {activeContent.headline[currentLang]}
                </h3>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-margam-slate">
                  Conceptual Explanation
                </span>
                <p className="text-sm md:text-base text-margam-navy/90 leading-relaxed font-sans whitespace-pre-line">
                  {activeContent.explanation[currentLang]}
                </p>
              </div>

              {/* Visual Analogy callout if present */}
              {"visualAnalogy" in activeContent && activeContent.visualAnalogy && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-margam-terracotta">
                    <Lightbulb className="w-4 h-4" />
                    <span>Indian Mental Model & Visual Representation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-margam-navy/90 leading-relaxed font-sans">
                    {activeContent.visualAnalogy[currentLang]}
                  </p>
                </div>
              )}

              {/* Worked Example */}
              <div className="bg-margam-cream-paper border border-margam-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-margam-navy">
                  <span>Worked Step-by-Step Example</span>
                  <span className="font-mono text-margam-terracotta">
                    {activeContent.workedExample.problem[currentLang]}
                  </span>
                </div>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  {activeContent.workedExample.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-margam-border flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-margam-navy text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-margam-navy font-sans text-xs pt-0.5">
                        {step[currentLang]}
                      </span>
                    </div>
                  ))}
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 font-bold text-margam-emerald text-xs">
                    Solution: {activeContent.workedExample.solution[currentLang]}
                  </div>
                </div>
              </div>

              {/* Key Takeaway */}
              <div className="border-t border-margam-border pt-3 flex items-start gap-2 text-xs text-margam-slate">
                <strong className="text-margam-navy uppercase shrink-0">Key Takeaway:</strong>
                <span>{activeContent.keyTakeaway[currentLang]}</span>
              </div>
            </div>
          </div>
        )}

        {activeStage === "solve" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-4 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-amber font-mono">
                Level 1 • Guided Practice
              </span>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                Single-Step Direct Calculations
              </h3>
              <p className="text-xs text-margam-slate leading-relaxed">
                Problems with simple single operations, visible number lines, and step-by-step guidance. Builds initial confidence.
              </p>
              <div className="p-3 bg-margam-cream-paper rounded-lg font-mono text-xs text-margam-navy">
                Sample: (-15) - (-9) = ?
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-4 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-amber font-mono">
                Level 2 • Multi-Term Balancing
              </span>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                Distributive & Sign Grouping
              </h3>
              <p className="text-xs text-margam-slate leading-relaxed">
                Problems with mixed operations, sign products, and bracket reductions requiring sign conservation rules.
              </p>
              <div className="p-3 bg-margam-cream-paper rounded-lg font-mono text-xs text-margam-navy">
                Sample: (-4) × (-3) × (-2) = ?
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-4 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-amber font-mono">
                Level 3 • Real-World Applications
              </span>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                Word Contexts & Algebraic Proofs
              </h3>
              <p className="text-xs text-margam-slate leading-relaxed">
                Translating Indian real-world scenarios (auto fares, elevation drops, kirana credits) into algebraic expressions.
              </p>
              <div className="p-3 bg-margam-cream-paper rounded-lg font-mono text-xs text-margam-navy">
                Sample: Hyderabad auto fare 30 + 15x = 105
              </div>
            </div>
          </div>
        )}

        {activeStage === "test" && (
          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 sm:p-8 space-y-6 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-margam-emerald font-mono">
                  Personalized & Stress-Free Assessment
                </span>
                <h3 className="font-serif text-2xl font-bold text-margam-navy">
                  Adaptive Chapter Tests & Mid-Checks
                </h3>
                <p className="text-sm text-margam-navy/80 leading-relaxed font-sans">
                  Unlike traditional school tests where every child gets the exact same 30 questions regardless of prior struggles, Margam constructs short, adaptive checkpoints:
                </p>
                <ul className="space-y-2 text-xs text-margam-navy/90 font-medium list-disc pl-4">
                  <li>Mid-chapter checks take only 5–7 minutes to preserve classroom energy.</li>
                  <li>Questions adapt difficulty based on recent response streaks (3 correct increases difficulty; 2 consecutive mistakes pauses to diagnose).</li>
                  <li>Clear formative progress reports for the student and teacher without high-stakes test anxiety.</li>
                </ul>
              </div>

              {/* Sample Test Card */}
              <div className="bg-margam-cream-paper border border-margam-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-margam-navy">Chapter Assessment Report</span>
                  <span className="font-mono bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Score: 88%
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-margam-border flex items-center justify-between">
                    <span>Class 7 Integer Foundations</span>
                    <span className="text-emerald-700 font-bold">Closed ✓</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-margam-border flex items-center justify-between">
                    <span>Class 8 Linear Transposition</span>
                    <span className="text-emerald-700 font-bold">Mastered ✓</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-margam-border flex items-center justify-between">
                    <span>Class 8 Word Problem Translation</span>
                    <span className="text-amber-700 font-bold">In Progress</span>
                  </div>
                </div>
                <p className="text-[11px] text-margam-slate pt-1">
                  Evidence-based readiness check for upcoming school exams.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
