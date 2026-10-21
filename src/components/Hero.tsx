"use client";

import React from "react";
import { ArrowRight, Compass, CheckCircle2, AlertTriangle, Sparkles, Network } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface HeroProps {
  currentLang: SupportedLanguage;
}

export default function Hero({ currentLang }: HeroProps) {
  const content = {
    en: {
      tag: "Adaptive Learning for Classes 6 to 10",
      headlineLead: "Every learner has a different starting point.",
      headlineAccent: "Margam helps each student find their next step.",
      subhead:
        "Mathematics in Classes 6–10 builds concept upon concept. When an Indian student struggles with Class 9 polynomials, the real gap is rarely abstract algebra—it is an unaddressed Class 7 integer sign error. Margam diagnoses the root prerequisite, adapts the lesson, and empowers the teacher.",
      ctaPrimary: "Try 3-Question Diagnostic",
      ctaSecondary: "Explore Concept Graph (DAG)",
      previewTitle: "PREVIEW: LIVE STUDENT CONCEPT TRAIL",
      previewSub: "Synthetic path showing diagnostic prerequisite tracing across 3 grades",
    },
    hi: {
      tag: "कक्षा 6 से 10 के लिए अनुकूलित शिक्षण मंच",
      headlineLead: "प्रत्येक शिक्षार्थी का प्रारंभिक बिंदु भिन्न होता है।",
      headlineAccent: "मार्गम् प्रत्येक विद्यार्थी को उसका अगला कदम खोजने में मदद करता है।",
      subhead:
        "कक्षा 6–10 का गणित एक के ऊपर एक अवधारणाओं पर निर्मित होता है। जब कोई विद्यार्थी कक्षा 9 के बहुपद में कठिनाई महसूस करता है, तो वास्तविक कमी बीजगणित की नहीं, बल्कि कक्षा 7 के पूर्णांक चिह्नों की अधूरी समझ होती है। मार्गम् मूल कमी की पहचान करता है, पाठ को अनुकूलित करता है और शिक्षक को सशक्त बनाता है।",
      ctaPrimary: "3-प्रश्नों का डायग्नोस्टिक आज़माएँ",
      ctaSecondary: "अवधारणा ग्राफ़ (DAG) देखें",
      previewTitle: "पूर्वावलोकन: विद्यार्थी अवधारणा पथ",
      previewSub: "3 कक्षाओं में डायग्नोस्टिक ट्रेसिंग प्रदर्शित करने वाला वास्तविक पाथவே",
    },
    te: {
      tag: "6 నుండి 10 తరగతులకు అనుకూల అభ్యాస వేదిక",
      headlineLead: "ప్రతి విద్యార్థికి ఒక నిర్దిష్ట ప్రారంభ స్థాయి ఉంటుంది.",
      headlineAccent: "మార్గం ప్రతి విద్యార్థికి వారి తదుపరి అభ్యాస అడుగును చూపుతుంది.",
      subhead:
        "6–10 తరగతుల గణితం ఒక భావనపై మరొకటి ఆధారపడి ఉంటుంది. 9వ తరగతి బహుపదుల సాధనలో విద్యార్థి ఇబ్బంది పడితే, సమస్య బీజగణితంలో కాకుండా 7వ తరగతి పూర్ణ సంఖ్యల సంకేత నియమాలలో ఉండవచ్చు. మార్గం అసలు లోపాన్ని గుర్తించి, పాఠాన్ని అనుకూలీకరించి, ఉపాధ్యాయుడికి సహాయపడుతుంది.",
      ctaPrimary: "3 ప్రశ్నల డయాగ్నోస్టిక్ ప్రయత్నించండి",
      ctaSecondary: "కాన్సెప్ట్ గ్రాఫ్ (DAG) అన్వేషించండి",
      previewTitle: "ప్రివ్యూ: విద్యార్థి కాన్సెప్ట్ మార్గం",
      previewSub: "3 తరగతుల మధ్య లోపాలను గుర్తించే వాస్తవ కాన్సెప్ట్ చైన్",
    },
  }[currentLang];

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:py-20 border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Category Pill */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-margam-terracotta border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.tag}</span>
          </span>
          <span className="hidden sm:inline text-xs text-margam-slate">
            NCERT Curriculum Aligned • Classes 6, 7, 8, 9, 10
          </span>
        </div>

        {/* Hero Title & Supporting text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-margam-navy leading-[1.12] tracking-tight">
              <span>{content.headlineLead}</span>{" "}
              <span className="text-margam-terracotta underline decoration-margam-amber/60 decoration-wavy decoration-2">
                {content.headlineAccent}
              </span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed max-w-2xl">
              {content.subhead}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#try-diagnostic"
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-margam-terracotta hover:bg-margam-terracotta-hover text-white flex items-center justify-center gap-2 transition-all shadow-warm hover:shadow-lg active:scale-98"
              >
                <span>{content.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#concept-pathway"
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base border-2 border-margam-border bg-white hover:bg-margam-cream-paper text-margam-navy flex items-center justify-center gap-2 transition-all"
              >
                <Network className="w-4 h-4 text-margam-slate" />
                <span>{content.ctaSecondary}</span>
              </a>
            </div>

            {/* Quick credibility bullet points */}
            <div className="pt-4 border-t border-margam-border/70 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-semibold text-margam-slate">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-margam-emerald shrink-0" />
                <span>Deterministic Grading</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-margam-emerald shrink-0" />
                <span>3 Lesson Variants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-margam-emerald shrink-0" />
                <span>Teacher In Control</span>
              </div>
            </div>
          </div>

          {/* Right Column: Credible Product Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border-2 border-margam-border p-5 shadow-card space-y-4 relative">
              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-margam-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-margam-terracotta" />
                  <span className="text-xs font-bold uppercase tracking-wider text-margam-navy">
                    {content.previewTitle}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-margam-cream-subtle px-2 py-0.5 rounded text-margam-navy">
                  Class 8A Demo
                </span>
              </div>

              {/* Synthetic Learner Context */}
              <div className="bg-margam-cream-paper border border-margam-border rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-margam-slate">Student Profile:</span>{" "}
                  <strong className="text-margam-navy">Ananya Reddy (Roll #2)</strong>
                </div>
                <div className="text-right">
                  <span className="text-margam-slate">Evaluating:</span>{" "}
                  <strong className="text-margam-terracotta">Linear Equations</strong>
                </div>
              </div>

              {/* The DAG Pathway Nodes Preview */}
              <div className="space-y-2.5">
                {/* Node 1: Mastered */}
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-margam-emerald text-white flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </span>
                    <div>
                      <div className="font-bold text-margam-navy">Negative Numbers on Number Line</div>
                      <span className="text-[11px] text-margam-slate font-mono">c7-int-01 • Class 7</span>
                    </div>
                  </div>
                  <span className="font-bold text-margam-emerald">92% Mastered</span>
                </div>

                {/* Node 2: DETECTED GAP */}
                <div className="p-3 rounded-xl border-2 border-rose-300 bg-rose-50 flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                      !
                    </span>
                    <div>
                      <div className="font-bold text-rose-950">Integer Subtraction & Sign Rules</div>
                      <span className="text-[11px] text-rose-700 font-mono">c7-int-02 • Class 7 (Root Gap)</span>
                    </div>
                  </div>
                  <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    45% Gap Found
                  </span>
                </div>

                {/* Node 3: Prescribed Lesson */}
                <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-margam-amber text-white flex items-center justify-center font-bold text-[10px]">
                      →
                    </span>
                    <div>
                      <div className="font-bold text-amber-950">Basics-First: Kirana Store Debt Model</div>
                      <span className="text-[11px] text-amber-800">10-minute visual remedial step</span>
                    </div>
                  </div>
                  <span className="font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                    Prescribed
                  </span>
                </div>

                {/* Node 4: Target Class 8 Skill */}
                <div className="p-3 rounded-xl border border-margam-border bg-gray-50 flex items-center justify-between text-xs opacity-75">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-[10px]">
                      ○
                    </span>
                    <div>
                      <div className="font-bold text-gray-700">Solving Equations by Transposition</div>
                      <span className="text-[11px] text-gray-500 font-mono">c8-lin-03 • Class 8</span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-500">Unlocks Next</span>
                </div>
              </div>

              {/* Footer explanation */}
              <p className="text-[11px] text-margam-slate text-center pt-2 border-t border-margam-border/60">
                {content.previewSub}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
