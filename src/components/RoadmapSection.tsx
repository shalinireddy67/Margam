"use client";

import React from "react";
import { CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface RoadmapSectionProps {
  currentLang: SupportedLanguage;
}

export default function RoadmapSection({ currentLang }: RoadmapSectionProps) {
  const t = {
    en: {
      sectionNum: "13 / DEVELOPMENT ROADMAP",
      badge: "Project Architecture & Timeline",
      headline: "Four-Phase Development Roadmap",
      subhead:
        "Code Kernel '26 runs from 21 October to 31 October 2026. Here is our phased execution plan, clearly separating verified Phase 1 deliverables from planned future modules.",
      currentScopeTag: "Current Implemented Scope",
      plannedTag: "Planned for upcoming sprint",
    },
    hi: {
      sectionNum: "13 / विकास रोडमैप",
      badge: "परियोजना वास्तुकला और समयरेखा",
      headline: "चार-चरणीय विकास रोडमैप",
      subhead:
        "कोड कर्नेल '26 21 से 31 अक्टूबर 2026 तक आयोजित है। यहाँ हमारा चरणबद्ध कार्यान्वयन रोडमैप है, जो पूर्ण हो चुके चरण 1 और भविष्य के नियोजित चरणों को स्पष्ट करता है।",
      currentScopeTag: "वर्तमान में कार्यान्वित चरण",
      plannedTag: "आगामी स्प्रिंट हेतु नियोजित",
    },
    te: {
      sectionNum: "13 / ప్రాజెక్ట్ రోడ్‌మ్యాప్",
      badge: "ప్రాజెక్ట్ నిర్మాణ ప్రణాళిక",
      headline: "నాలుగు దశల అభివృద్ధి ప్రణాళిక (Roadmap)",
      subhead:
        "కోడ్ కెర్నల్ '26 అక్టోబర్ 21 నుండి 31 వరకు కొనసాగుతుంది. పూర్తయిన ఫేజ్ 1 మరియు భవిష్యత్ ఫేజ్‌ల వివరాలు క్రింద ఇవ్వబడ్డాయి.",
      currentScopeTag: "ప్రస్తుతం అమలైన ఫేజ్",
      plannedTag: "తదుపరి స్పింట్‌కు ప్రణాళిక చేయబడింది",
    },
  }[currentLang];

  const phases = [
    {
      phaseNumber: "Phase 1",
      name: "Foundation & Knowledge Base",
      period: "21–24 October 2026 (Decode Period)",
      status: "COMPLETED",
      statusColor: "bg-[#EAF5E1] text-[#3E8424] border-[#B7DE9E]",
      isCurrent: true,
      items: [
        "Repository foundation & Next.js App Router setup",
        "Calm editorial design system with bespoke warm palette",
        "NCERT Mathematics Concept DAG (21 nodes, verified acyclic)",
        "Deterministic Question Bank (14 starter diagnostic items in EN/HI/TE)",
        "3 Pedagogical Lesson Variants (Basics-first, Standard, Fast-track)",
        "Automated validation suite (100% passing tests for cycles & schemas)",
        "Synthetic 25-student demo class dataset (data/demo-class.json)",
        "Interactive 3-question diagnostic simulator on landing page",
      ],
    },
    {
      phaseNumber: "Phase 2",
      name: "Student Experience & Adaptive Engine",
      period: "25–27 October 2026 (Build Period)",
      status: "PLANNED",
      statusColor: "bg-[#FFF3DA] text-accent border-[#FCD685]",
      isCurrent: false,
      items: [
        "Lightweight student onboarding (Class code + roll number/name)",
        "Full 8-question chapter diagnostic sessions",
        "Deterministic weighted moving-average mastery tracker",
        "Adaptive practice engine (difficulty scaling 1 to 3)",
        "Real-time mistake classification and prerequisite routing",
        "Mid-chapter checks and personalized progress cards",
      ],
    },
    {
      phaseNumber: "Phase 3",
      name: "Teacher Portal & Classroom Tools",
      period: "28–29 October 2026 (Build Period)",
      status: "PLANNED",
      statusColor: "bg-[#FFF3DA] text-accent border-[#FCD685]",
      isCurrent: false,
      items: [
        "Teacher Class Mastery Heatmap (student × concept matrix)",
        "Automated peer remedial grouping generator",
        "One-click 1-page A4 printable worksheet generator",
        "Teacher manual topic override & homework assignment",
        "10-minute whole-class intervention playbooks",
      ],
    },
    {
      phaseNumber: "Phase 4",
      name: "Vernacular Polish & Offline PWA",
      period: "30–31 October 2026 (Prove Period)",
      status: "PLANNED",
      statusColor: "bg-background text-muted-foreground border-[#C7DDAE]",
      isCurrent: false,
      items: [
        "Full UI localization across English, Hindi, and Telugu",
        "PWA Service Worker for offline lesson & question caching",
        "Locally queued attempts with automatic sync on reconnect",
        "Low-data optimization (< 50 KB initial payload)",
        "Production deployment on Vercel with verified Lighthouse audit",
      ],
    },
  ];

  return (
    <section id="roadmap" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* 4 Phases Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((p) => (
          <div
            key={p.phaseNumber}
            className={`rounded-[22px] border-2 p-6 flex flex-col justify-between space-y-5 shadow-warm transition-all ${
              p.isCurrent
                ? "bg-card border-primary ring-2 ring-[#B7DE9E] shadow-warm-lg scale-[1.01]"
                : "bg-card border-[#C7DDAE]/70"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-black text-foreground">
                  {p.phaseNumber}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${p.statusColor}`}
                >
                  {p.status}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-foreground leading-snug">
                  {p.name}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground block mt-1">
                  {p.period}
                </span>
              </div>

              <ul className="space-y-2 pt-3 border-t border-[#C7DDAE]/60 text-xs font-sans text-foreground/80">
                {p.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-bold ${
                        p.isCurrent
                          ? "bg-primary text-white"
                          : "bg-background text-muted-foreground border border-[#C7DDAE]"
                      }`}
                    >
                      {p.isCurrent ? "✓" : "○"}
                    </span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {p.isCurrent ? (
              <div className="pt-3 border-t border-[#B7DE9E] text-xs font-bold text-primary flex items-center gap-1.5 font-heading">
                <span>{t.currentScopeTag}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="pt-3 border-t border-[#C7DDAE]/60 text-[11px] font-mono text-muted-foreground">
                {t.plannedTag}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
