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
      badge: "Project Architecture & Timeline",
      headline: "Four-Phase Development Roadmap",
      subhead:
        "Code Kernel '26 runs from 21 October to 31 October 2026. Here is our phased execution plan, clearly separating verified Phase 1 deliverables from planned future modules.",
    },
    hi: {
      badge: "परियोजना वास्तुकला और समयरेखा",
      headline: "चार-चरणीय विकास रोडमैप",
      subhead:
        "कोड कर्नेल '26 21 से 31 अक्टूबर 2026 तक आयोजित है। यहाँ हमारा चरणबद्ध कार्यान्वयन रोडमैप है, जो पूर्ण हो चुके चरण 1 और भविष्य के नियोजित चरणों को स्पष्ट करता है।",
    },
    te: {
      badge: "ప్రాజెక్ట్ నిర్మాణ ప్రణాళిక",
      headline: "నాలుగు దశల అభివృద్ధి ప్రణాళిక (Roadmap)",
      subhead:
        "కోడ్ కెర్నల్ '26 అక్టోబర్ 21 నుండి 31 వరకు కొనసాగుతుంది. పూర్తయిన ఫేజ్ 1 మరియు భవిష్యత్ ఫేజ్‌ల వివరాలు క్రింద ఇవ్వబడ్డాయి.",
    },
  }[currentLang];

  const phases = [
    {
      phaseNumber: "Phase 1",
      name: "Foundation & Knowledge Base",
      period: "21–24 October 2026 (Decode Period)",
      status: "COMPLETED",
      statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
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
      statusColor: "bg-orange-100 text-orange-900 border-orange-200",
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
      statusColor: "bg-amber-100 text-amber-900 border-amber-200",
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
      statusColor: "bg-slate-100 text-slate-800 border-slate-300",
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
    <section id="roadmap" className="py-16 md:py-24 bg-margam-cream border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              08 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 4 Phases Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((p) => (
            <div
              key={p.phaseNumber}
              className={`rounded-2xl border-2 p-6 flex flex-col justify-between space-y-5 shadow-card transition-all ${
                p.isCurrent
                  ? "bg-white border-margam-terracotta ring-2 ring-orange-200"
                  : "bg-white/80 border-margam-border opacity-90"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-black text-margam-navy">
                    {p.phaseNumber}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${p.statusColor}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-margam-navy leading-snug">
                    {p.name}
                  </h3>
                  <span className="text-[11px] text-margam-slate block mt-1">
                    {p.period}
                  </span>
                </div>

                <ul className="space-y-2 pt-2 border-t border-margam-border/60 text-xs font-sans text-margam-navy/85">
                  {p.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5 ${
                          p.isCurrent
                            ? "bg-margam-emerald text-white"
                            : "bg-gray-200 text-gray-600"
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
                <div className="pt-3 border-t border-orange-200 text-xs font-bold text-margam-terracotta flex items-center gap-1">
                  <span>Current Implemented Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 text-[11px] font-mono text-margam-slate">
                  Planned for upcoming hackathon sprint
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
