"use client";

import React from "react";
import { CheckCircle2, Calendar, ArrowRight, Compass } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface RoadmapSectionProps {
  currentLang: SupportedLanguage;
}

export default function RoadmapSection({ currentLang }: RoadmapSectionProps) {
  const t = {
    en: {
      badge: "Project Plan",
      headline: "Development Roadmap",
      subhead:
        "Code Kernel '26 runs 21 to 31 October 2026. Here is our 4-phase plan:",
      phase1Status: "Done ✓",
      phasePlanned: "Planned",
    },
    hi: {
      badge: "परियोजना योजना",
      headline: "विकास रोडमैप",
      subhead:
        "कोड कर्नेल '26 (21 से 31 अक्टूबर 2026)। हमारी 4-चरणीय विकास योजना:",
      phase1Status: "पूर्ण ✓",
      phasePlanned: "नियोजित",
    },
    te: {
      badge: "ప్రాజెక్ట్ ప్రణాళిక",
      headline: "అభివృద్ధి రోడ్‌మ్యాప్",
      subhead:
        "కోడ్ కెర్నల్ '26 (అక్టోబర్ 21 నుండి 31). మా 4 దశల ప్రణాళిక:",
      phase1Status: "పూర్తయింది ✓",
      phasePlanned: "ప్రణాళిక",
    },
  }[currentLang];

  const phases = [
    {
      num: "Phase 1",
      name: "Foundation & Graph",
      dates: "21–24 Oct",
      done: true,
      points: [
        "21-node NCERT Mathematics DAG (0 cycles)",
        "14 deterministic diagnostic items in EN/HI/TE",
        "3 pedagogical lesson variants for every concept",
        "Synthetic 25-student demo class dataset",
      ],
    },
    {
      num: "Phase 2",
      name: "Student App",
      dates: "25–27 Oct",
      done: false,
      points: [
        "Clean student onboarding (Class code + roll number)",
        "Adaptive practice engine with streak & XP tracking",
        "Real-time prerequisite gap detection",
        "Short 5-minute mid-chapter checks",
      ],
    },
    {
      num: "Phase 3",
      name: "Teacher Tools",
      dates: "28–29 Oct",
      done: false,
      points: [
        "Classroom mastery heatmap matrix",
        "Automated remedial peer grouping engine",
        "Single-click 1-page A4 worksheet generator",
        "Teacher topic override authority",
      ],
    },
    {
      num: "Phase 4",
      name: "PWA & Polish",
      dates: "30–31 Oct",
      done: false,
      points: [
        "PWA offline caching for zero-internet classrooms",
        "Locally queued attempts with auto-sync",
        "Lightweight payload (< 50 KB)",
        "Production deployment on Vercel",
      ],
    },
  ];

  return (
    <section id="roadmap" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light text-sage border border-sage-border text-xs sm:text-sm font-heading font-bold">
          <Calendar className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* 4 Clean Phase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {phases.map((p) => (
          <div
            key={p.num}
            className={`rounded-3xl p-6 border flex flex-col justify-between space-y-4 shadow-card ${
              p.done
                ? "bg-white border-sage-border ring-2 ring-sage/20"
                : "bg-white/80 border-[#E0E5D4]"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-lg text-foreground">
                  {p.num}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    p.done
                      ? "bg-sage-light text-sage border-sage-border"
                      : "bg-background text-muted-foreground border-[#E0E5D4]"
                  }`}
                >
                  {p.done ? t.phase1Status : t.phasePlanned}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  {p.name}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">{p.dates}</span>
              </div>

              <ul className="space-y-2 pt-2 border-t border-[#E0E5D4] text-xs font-sans text-muted-foreground">
                {p.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sage font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[#E0E5D4] text-xs font-mono font-bold">
              {p.done ? (
                <span className="text-sage">Implemented & Verified</span>
              ) : (
                <span className="text-muted-foreground">Upcoming Sprint</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
