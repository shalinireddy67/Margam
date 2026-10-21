"use client";

import React from "react";
import { AlertCircle, ArrowDown, HelpCircle, Lightbulb, Zap, TrendingUp } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface ProblemSectionProps {
  currentLang: SupportedLanguage;
}

export default function ProblemSection({ currentLang }: ProblemSectionProps) {
  const t = {
    en: {
      badge: "The Indian Classroom Dilemma",
      headline: "A student scores 38% on a Class 9 Polynomials test.",
      quote:
        "The mark confirms struggle, but completely conceals the root cause. Giving 40 more quadratic factoring problems only compounds frustration.",
      traditionalTitle: "The Conventional Approach: Blind Repetition",
      traditionalDesc:
        "When an Indian student fails polynomial factorization, standard practice is to assign additional chapter drill. But if the student cannot determine whether (-3) × (+2) is -6 or +6, repeating Class 9 problems only deepens anxiety.",
      margamTitle: "The Margam Solution: Prerequisite Backtracking",
      margamDesc:
        "Margam traverses backwards across the curriculum DAG. Within 4 minutes, it traces the breakdown past Class 8 linear terms back to Class 7 signed integer rules. A 10-minute targeted remediation unlocks the entire high-school chapter.",
      stat1: "2 Academic Years",
      stat1Desc: "Average grade distance between an apparent failure and its root prerequisite gap",
      stat2: "45+ Students",
      stat2Desc: "Typical Indian classroom size where a teacher cannot manually diagnose every gap",
      stat3: "10 Minutes",
      stat3Desc: "Targeted remedial time needed to close an identified foundational gap",
    },
    hi: {
      badge: "भारतीय कक्षाओं की वास्तविक समस्या",
      headline: "कक्षा 9 के बहुपद परीक्षण में एक छात्र को 38% अंक मिलते हैं।",
      quote:
        "यह अंक संघर्ष की पुष्टि तो करता है, परंतु मूल कारण को छिपा देता है। 40 और द्विघात समीकरण हल करने के लिए देना केवल निराशा बढ़ाता है।",
      traditionalTitle: "पारंपरिक दृष्टिकोण: अंधी पुनरावृत्ति",
      traditionalDesc:
        "जब कोई छात्र बहुपद गुणनखंड में असफल होता है, तो सामान्य अभ्यास उसी अध्याय के और प्रश्न देना होता है। लेकिन यदि छात्र यह नहीं जानता कि (-3) × (+2) का मान -6 है या +6, तो अधिक प्रश्न देने से केवल घबराहट बढ़ती है।",
      margamTitle: "मार्गम् समाधान: पूर्वापेक्षा का पता लगाना",
      margamDesc:
        "मार्गम् पाठ्यक्रम DAG में पीछे की ओर खोज करता है। 4 मिनट में यह पता लगा लेता है कि समस्या कक्षा 7 के पूर्णांक चिह्न नियमों में है। 10 मिनट का लक्षित शिक्षण पूरे अध्याय को सुगम बना देता है।",
      stat1: "2 शैक्षणिक वर्ष",
      stat1Desc: "स्पष्ट विफलता और उसके मूल कारण के बीच औसत कक्षा का अंतर",
      stat2: "45+ विद्यार्थी",
      stat2Desc: "कक्षा का सामान्य आकार जहाँ शिक्षक अकेले हर विद्यार्थी की कमी नहीं पहचान सकता",
      stat3: "10 मिनट",
      stat3Desc: "पहचाने गए बुनियादी अंतर को भरने के लिए आवश्यक लक्षित समय",
    },
    te: {
      badge: "భారతీయ తరగతి గదులలోని ప్రధాన సమస్య",
      headline: "9వ తరగతి బహుపదుల పరీక్షలో ఒక విద్యార్థికి 38% మార్కులు వచ్చాయి.",
      quote:
        "ఈ మార్కులు విద్యార్థి ఇబ్బందిని నిర్ధారిస్తాయి, కానీ అసలు మూలకారణాన్ని దాచిపెడతాయి. మరో 40 వర్గ సమీకరణాల హోమ్‌వర్క్ ఇవ్వడం వలన నిరాశ పెరుగుతుంది తప్ప ఫలితం ఉండదు.",
      traditionalTitle: "సాంప్రదాయ పద్ధతి: గుడ్డిగా మరిన్ని లెక్కలు ఇవ్వడం",
      traditionalDesc:
        "బహుపదుల కారణాంక విభజన రాకపోతే, ఉపాధ్యాయులు సాధారణంగా అదే పాఠం నుండి మరిన్ని లెక్కలు ఇస్తారు. కానీ విద్యార్థికి (-3) × (+2) = -6 అవుతుందో కాదో తెలియకపోతే, 9వ తరగతి లెక్కలను మళ్ళీ మళ్ళీ చేయడం వలన భయం మరింత పెరుగుతుంది.",
      margamTitle: "మార్గం పరిష్కారం: కాన్సెప్ట్ బ్యాక్‌ట్రాకింగ్",
      margamDesc:
        "మార్గం పాఠ్యప్రణాళిక DAG ద్వారా వెనుకకు వెళ్లి విశ్లేషిస్తుంది. 4 నిమిషాల్లో సమస్య 7వ తరగతి పూర్ణ సంఖ్యల సంకేత నియమాలలో ఉందని గుర్తిస్తుంది. 10 నిమిషాల నిర్దిష్ట వివరణతో విద్యార్థికి పూర్తి అధ్యాయం సులభమవుతుంది.",
      stat1: "2 విద్యా సంవత్సరాలు",
      stat1Desc: "విద్యార్థి కనబరిచే సమస్య మరియు దాని అసలు మూల లోపం మధ్య ఉండే సగటు తరగతి అంతరం",
      stat2: "45+ విద్యార్థులు",
      stat2Desc: "ఉపాధ్యాయుడు ప్రతి విద్యార్థి వ్యక్తిగత లోపాన్ని విడిగా గమనించలేని తరగతి పరిమాణం",
      stat3: "10 నిమిషాలు",
      stat3Desc: "గుర్తించిన ప్రాథమిక లోపాన్ని సరిదిద్దడానికి అవసరమైన సమయం",
    },
  }[currentLang];

  return (
    <section id="problem" className="py-16 md:py-24 bg-white border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              01 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <blockquote className="border-l-4 border-margam-terracotta pl-4 text-base sm:text-lg text-margam-navy/85 italic font-serif">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
        </div>

        {/* Comparison Cards: Traditional vs Margam */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Traditional Drill Fallacy */}
          <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>The Traditional Drill Fallacy</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-900 bg-white px-2 py-0.5 rounded border border-rose-200">
                  Class 9 Score: 38%
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950">
                {t.traditionalTitle}
              </h3>

              <p className="text-sm text-rose-900/90 leading-relaxed font-sans">
                {t.traditionalDesc}
              </p>
            </div>

            {/* Visual Equation Breakdown Error */}
            <div className="bg-white rounded-xl p-4 border border-rose-200 space-y-3 font-mono text-xs">
              <div className="text-slate-600 font-sans font-bold flex items-center justify-between">
                <span>Problem: Factorise x² - x - 6</span>
                <span className="text-rose-600 font-bold">Failed Attempt</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg text-rose-900 space-y-1">
                <div>Student wrote: (x + 3)(x - 2)</div>
                <div className="text-rose-600 text-[11px]">
                  ✗ Error: (+3) × (-2) = -6, but (+3) + (-2) = +1 (Expected -1).
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-sans italic">
                Teacher conclusion: &ldquo;Needs more factoring practice.&rdquo; (Wrong diagnosis)
              </div>
            </div>
          </div>

          {/* Card 2: Margam DAG Solution */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                  <span>The Margam Breakthrough</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Backtracked in 4 Min
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950">
                {t.margamTitle}
              </h3>

              <p className="text-sm text-emerald-900/90 leading-relaxed font-sans">
                {t.margamDesc}
              </p>
            </div>

            {/* Visual Prerequisite Resolution */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-3 font-mono text-xs">
              <div className="text-slate-600 font-sans font-bold flex items-center justify-between">
                <span>DAG Backtracking Diagnostic Result</span>
                <span className="text-emerald-700 font-bold">Root Gap Pinpointed</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-950 space-y-1">
                <div className="font-bold">c7-int-02: Integer Addition & Sign Rules</div>
                <div className="text-emerald-800 text-[11px]">
                  ✓ Prescription: 10-minute Kirana Debt/Credit visual model on adding signed values.
                </div>
              </div>
              <div className="text-[11px] text-emerald-800 font-sans font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-margam-amber" />
                <span>Result: Unlocks Class 8 Transposition & Class 9 Polynomials immediately.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Vital Statistics */}
        <div className="pt-6 border-t border-margam-border grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-margam-cream-paper border border-margam-border space-y-1">
            <div className="font-serif text-3xl font-black text-margam-terracotta">
              {t.stat1}
            </div>
            <p className="text-xs text-margam-slate leading-relaxed font-sans">
              {t.stat1Desc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-margam-cream-paper border border-margam-border space-y-1">
            <div className="font-serif text-3xl font-black text-margam-navy">
              {t.stat2}
            </div>
            <p className="text-xs text-margam-slate leading-relaxed font-sans">
              {t.stat2Desc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-margam-cream-paper border border-margam-border space-y-1">
            <div className="font-serif text-3xl font-black text-margam-emerald">
              {t.stat3}
            </div>
            <p className="text-xs text-margam-slate leading-relaxed font-sans">
              {t.stat3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
