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
        "Classroom topic progress heatmap",
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <Calendar className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans">
          {t.subhead}
        </p>
      </div>

      {/* 4 Clean Phase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {phases.map((p) => (
          <div
            key={p.num}
            className={`p-6 border-[3px] border-[#422816] flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_#1B120C] ${
              p.done
                ? "bg-[#FFF7E6]"
                : "bg-white/80"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-sm text-[#2B1B0F]">
                  {p.num}
                </span>
                <span
                  className={`text-xs font-pixel px-2.5 py-0.5 border ${
                    p.done
                      ? "bg-[#5DAA3A] text-white border-[#422816]"
                      : "bg-[#D9D9D9] text-[#2B1B0F] border-[#422816]"
                  }`}
                >
                  {p.done ? t.phase1Status : t.phasePlanned}
                </span>
              </div>

              <div>
                <h3 className="font-pixel text-xs sm:text-sm text-[#2B1B0F]">
                  {p.name}
                </h3>
                <span className="text-xs font-mono text-[#7A4B2A]">{p.dates}</span>
              </div>

              <ul className="space-y-2 pt-2 border-t-2 border-[#E5D7BE] text-xs font-sans text-[#5A3720] font-semibold">
                {p.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#5DAA3A] font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t-2 border-[#E5D7BE] text-xs font-pixel">
              {p.done ? (
                <span className="text-[#5DAA3A]">Implemented & Verified</span>
              ) : (
                <span className="text-[#7A4B2A]">Upcoming Sprint</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
