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
      sectionNum: "08 / ADAPTIVE PEDAGOGY: LEARN • SOLVE • TEST",
      badge: "Three Connected Learning Stages",
      headline: "Learn • Solve • Test",
      subhead:
        "Most educational software only adapts practice question difficulty. Margam adapts all three connected stages of understanding, ensuring students never get stuck on abstract theory or repetitive drills.",
      learnTab: "1. LEARN (3 Lesson Variants)",
      solveTab: "2. SOLVE (Adaptive Practice)",
      testTab: "3. TEST (Personalized Checks)",
      variantLabel: "Select Teaching Variant (Sample: Class 7 Integer Subtraction):",
      variantBasics: "Basics-First (Visual & Kirana Model)",
      variantStandard: "Standard (NCERT Formal Steps)",
      variantFast: "Fast-Track (Vector Shifts & Shortcuts)",
      workedTitle: "Worked Step-by-Step Example",
      takeawayLabel: "Key Takeaway",
    },
    hi: {
      sectionNum: "08 / अनुकूली शिक्षण: सीखें • हल करें • परीक्षण दें",
      badge: "तीन परस्पर जुड़े शिक्षण चरण",
      headline: "सीखें (Learn) • हल करें (Solve) • परीक्षण दें (Test)",
      subhead:
        "अधिकांश शैक्षिक सॉफ़्टवेयर केवल अभ्यास प्रश्नों की कठिनाई बदलते हैं। मार्गम् समझ के तीनों चरणों को अनुकूलित करता है ताकि विद्यार्थी कभी भी अमूर्त सिद्धांतों या दोहराव में न फंसे।",
      learnTab: "1. सीखें (3 पाठ प्रकार)",
      solveTab: "2. हल करें (अनुकूली अभ्यास)",
      testTab: "3. परीक्षण दें (व्यक्तिगत जाँच)",
      variantLabel: "शिक्षण प्रकार चुनें (नमूना: कक्षा 7 पूर्णांक व्यवकलन):",
      variantBasics: "बुनियादी-पहले (किराना व दृश्य मॉडल)",
      variantStandard: "मानक (एनसीईआरटी औपचारिक चरण)",
      variantFast: "फास्ट-ट्रैक (संक्षिप्त तकनीक व सदिश)",
      workedTitle: "क्रमबद्ध हल किया गया उदाहरण",
      takeawayLabel: "मुख्य सीख",
    },
    te: {
      sectionNum: "08 / అనుకూల బోధనా విధానం: నేర్చుకోండి • సాధించండి • పరీక్షించండి",
      badge: "మూడు అనుసంధాన అభ్యాస దశలు",
      headline: "నేర్చుకోండి (Learn) • సాధించండి (Solve) • పరీక్షించండి (Test)",
      subhead:
        "చాలా వెబ్‌సైట్లు కేవలం లెక్కల కష్టాన్ని మాత్రమే మారుస్తాయి. మార్గం అవగాహన యొక్క మూడు దశలనూ అనుకూలీకరించి విద్యార్థికి సమగ్ర స్పష్టతను అందిస్తుంది.",
      learnTab: "1. నేర్చుకోండి (3 పాఠ్య రీతులు)",
      solveTab: "2. సాధించండి (అనుకూల సాధన)",
      testTab: "3. పరీక్షించండి (వ్యక్తిగత పరిశీలన)",
      variantLabel: "బోధనా శైలిని ఎంచుకోండి (7వ తరగతి పూర్ణ సంఖ్యల వ్యవకలనం):",
      variantBasics: "పునాది-మొదట (కిరాణా & దృశ్య రూపం)",
      variantStandard: "ప్రామాణికం (NCERT అధికారిక పద్ధతి)",
      variantFast: "వేగవంతమైన మార్గం (షార్ట్‌కట్ & వెక్టర్)",
      workedTitle: "దశలవారీగా సాధించిన ఉదాహరణ",
      takeawayLabel: "గుర్తుంచుకోవాల్సిన అంశం",
    },
  }[currentLang];

  return (
    <section id="three-stages" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* Stage Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#C7DDAE]/60 pb-4 mb-8">
        <button
          type="button"
          onClick={() => setActiveStage("learn")}
          className={`min-h-[44px] px-5 rounded-[14px] font-heading text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeStage === "learn"
              ? "bg-[#EAF5E1] text-[#2F4A1E] border-2 border-[#B7DE9E] shadow-warm-sm scale-[1.01]"
              : "text-foreground/80 border-2 border-transparent hover:border-[#C7DDAE] bg-card hover:bg-white"
          }`}
        >
          <BookOpen className="w-4 h-4 text-accent" />
          <span>{t.learnTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("solve")}
          className={`min-h-[44px] px-5 rounded-[14px] font-heading text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeStage === "solve"
              ? "bg-[#FFF3DA] text-accent border-2 border-[#FCD685] shadow-warm-sm scale-[1.01]"
              : "text-foreground/80 border-2 border-transparent hover:border-[#C7DDAE] bg-card hover:bg-white"
          }`}
        >
          <CheckSquare className="w-4 h-4 text-accent" />
          <span>{t.solveTab}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("test")}
          className={`min-h-[44px] px-5 rounded-[14px] font-heading text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeStage === "test"
              ? "bg-[#EAF5E1] text-[#3E8424] border-2 border-[#B7DE9E] shadow-warm-sm scale-[1.01]"
              : "text-foreground/80 border-2 border-transparent hover:border-[#C7DDAE] bg-card hover:bg-white"
          }`}
        >
          <Award className="w-4 h-4 text-[#3E8424]" />
          <span>{t.testTab}</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeStage === "learn" && (
        <div className="space-y-6">
          {/* Variant Switcher */}
          <div className="bg-card p-4 rounded-[18px] border-2 border-[#C7DDAE] flex flex-wrap items-center justify-between gap-3 shadow-warm-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {t.variantLabel}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-heading">
              <button
                type="button"
                onClick={() => setSelectedVariant("basics_first")}
                className={`px-3 py-1.5 rounded-[10px] transition-all cursor-pointer ${
                  selectedVariant === "basics_first"
                    ? "bg-[#FFF3DA] text-accent border border-[#FCD685]"
                    : "bg-background text-foreground/80 border border-[#C7DDAE] hover:border-primary"
                }`}
              >
                {t.variantBasics}
              </button>
              <button
                type="button"
                onClick={() => setSelectedVariant("standard")}
                className={`px-3 py-1.5 rounded-[10px] transition-all cursor-pointer ${
                  selectedVariant === "standard"
                    ? "bg-[#EAF5E1] text-primary border border-[#B7DE9E]"
                    : "bg-background text-foreground/80 border border-[#C7DDAE] hover:border-primary"
                }`}
              >
                {t.variantStandard}
              </button>
              <button
                type="button"
                onClick={() => setSelectedVariant("fast_track")}
                className={`px-3 py-1.5 rounded-[10px] transition-all cursor-pointer ${
                  selectedVariant === "fast_track"
                    ? "bg-[#EAF5E1] text-[#2F4A1E] border border-[#B7DE9E]"
                    : "bg-background text-foreground/80 border border-[#C7DDAE] hover:border-primary"
                }`}
              >
                {t.variantFast}
              </button>
            </div>
          </div>

          {/* Live Lesson Content Card */}
          <div className="rounded-[24px] border-2 border-[#C7DDAE] bg-card p-6 sm:p-8 space-y-6 shadow-warm">
            <div className="border-b border-[#C7DDAE]/60 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-accent uppercase bg-[#FFF3DA] px-2 py-0.5 rounded-full border border-[#FCD685]">
                  Concept: c7-int-02 • {selectedVariant.toUpperCase()}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mt-2">
                {activeContent.headline[currentLang]}
              </h3>
            </div>

            {/* Conceptual Explanation */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                Conceptual Explanation
              </span>
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
                {activeContent.explanation[currentLang]}
              </p>
            </div>

            {/* Visual Analogy callout if present */}
            {"visualAnalogy" in activeContent && activeContent.visualAnalogy && (
              <div className="p-5 bg-[#FFF3DA] border border-[#FCD685] rounded-[18px] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent font-heading">
                  <Lightbulb className="w-4 h-4" />
                  <span>Indian Mental Model & Visual Representation</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                  {activeContent.visualAnalogy[currentLang]}
                </p>
              </div>
            )}

            {/* Worked Example */}
            <div className="bg-background border border-[#C7DDAE] rounded-[18px] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground gap-2">
                <span className="font-heading">{t.workedTitle}</span>
                <span className="font-mono text-accent bg-[#FFF3DA] px-2.5 py-0.5 rounded-full border border-[#FCD685]">
                  {activeContent.workedExample.problem[currentLang]}
                </span>
              </div>
              <div className="space-y-2 pt-1 font-mono text-xs">
                {activeContent.workedExample.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-card rounded-[12px] border border-[#C7DDAE] flex items-start gap-3 shadow-warm-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-foreground font-sans text-xs pt-0.5">
                      {step[currentLang]}
                    </span>
                  </div>
                ))}
                <div className="p-3.5 bg-[#EAF5E1] rounded-[12px] border border-[#B7DE9E] font-bold text-[#3E8424] text-xs">
                  Solution: {activeContent.workedExample.solution[currentLang]}
                </div>
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="border-t border-[#C7DDAE]/60 pt-4 flex items-start gap-2 text-xs text-muted-foreground font-sans">
              <strong className="text-foreground uppercase shrink-0 font-heading">{t.takeawayLabel}:</strong>
              <span>{activeContent.keyTakeaway[currentLang]}</span>
            </div>
          </div>
        </div>
      )}

      {activeStage === "solve" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm">
            <span className="text-xs font-bold uppercase tracking-wider text-accent font-mono bg-[#FFF3DA] px-2.5 py-0.5 rounded-full border border-[#FCD685] inline-block">
              Level 1 • Guided Practice
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Single-Step Direct Calculations
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed font-sans">
              Problems with simple single operations, visible number lines, and step-by-step guidance. Builds initial confidence.
            </p>
            <div className="p-3 bg-background rounded-[12px] border border-[#C7DDAE] font-mono text-xs text-foreground">
              Sample: (-15) - (-9) = ?
            </div>
          </div>

          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono bg-[#EAF5E1] px-2.5 py-0.5 rounded-full border border-[#B7DE9E] inline-block">
              Level 2 • Multi-Term Balancing
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Distributive & Sign Grouping
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed font-sans">
              Problems with mixed operations, sign products, and bracket reductions requiring sign conservation rules.
            </p>
            <div className="p-3 bg-background rounded-[12px] border border-[#C7DDAE] font-mono text-xs text-foreground">
              Sample: (-4) × (-3) × (-2) = ?
            </div>
          </div>

          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E8424] font-mono bg-[#EAF5E1] px-2.5 py-0.5 rounded-full border border-[#B7DE9E] inline-block">
              Level 3 • Real-World Applications
            </span>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Word Contexts & Algebraic Proofs
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed font-sans">
              Translating Indian real-world scenarios (auto fares, elevation drops, kirana credits) into algebraic expressions.
            </p>
            <div className="p-3 bg-background rounded-[12px] border border-[#C7DDAE] font-mono text-xs text-foreground">
              Sample: Hyderabad auto fare 30 + 15x = 105
            </div>
          </div>
        </div>
      )}

      {activeStage === "test" && (
        <div className="bg-card rounded-[24px] border-2 border-[#C7DDAE] p-6 sm:p-8 space-y-6 shadow-warm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3E8424] font-mono bg-[#EAF5E1] px-2.5 py-0.5 rounded-full border border-[#B7DE9E] inline-block">
                Personalized & Stress-Free Assessment
              </span>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Adaptive Chapter Tests & Mid-Checks
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                Unlike traditional school tests where every child gets the exact same 30 questions regardless of prior struggles, Margam constructs short, adaptive checkpoints:
              </p>
              <ul className="space-y-2 text-xs text-foreground/90 font-medium list-disc pl-4 font-sans">
                <li>Mid-chapter checks take only 5–7 minutes to preserve classroom energy.</li>
                <li>Questions adapt difficulty based on recent response streaks (3 correct increases difficulty; 2 consecutive mistakes pauses to diagnose).</li>
                <li>Clear formative progress reports for the student and teacher without high-stakes test anxiety.</li>
              </ul>
            </div>

            {/* Sample Test Card */}
            <div className="bg-background border border-[#C7DDAE] rounded-[18px] p-5 space-y-3 shadow-warm-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-foreground">Chapter Assessment Report</span>
                <span className="font-mono bg-[#EAF5E1] text-[#3E8424] font-bold px-2 py-0.5 rounded-full border border-[#B7DE9E]">
                  Score: 88%
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 bg-card rounded-[12px] border border-[#C7DDAE] flex items-center justify-between">
                  <span>Class 7 Integer Foundations</span>
                  <span className="text-[#3E8424] font-bold">Closed ✓</span>
                </div>
                <div className="p-3 bg-card rounded-[12px] border border-[#C7DDAE] flex items-center justify-between">
                  <span>Class 8 Linear Transposition</span>
                  <span className="text-[#3E8424] font-bold">Mastered ✓</span>
                </div>
                <div className="p-3 bg-card rounded-[12px] border border-[#C7DDAE] flex items-center justify-between">
                  <span>Class 8 Word Problem Translation</span>
                  <span className="text-accent font-bold">In Progress</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1 font-sans">
                Evidence-based readiness check for upcoming school exams.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
