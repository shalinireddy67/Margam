"use client";

import React from "react";
import { Search, Shuffle, CheckCircle, ArrowRight, RotateCw, Sparkles } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface ApproachSectionProps {
  currentLang: SupportedLanguage;
}

export default function ApproachSection({ currentLang }: ApproachSectionProps) {
  const t = {
    en: {
      badge: "The Central Learning Loop",
      headline: "Diagnose → Adapt → Check Again",
      subhead:
        "Margam replaces blind repetition with a continuous, explainable three-step cycle that respects each student's pace while keeping the teacher informed.",
      step1Title: "1. DIAGNOSE",
      step1Subtitle: "Pinpoints the root prerequisite in 6 questions",
      step1Desc:
        "A short diagnostic tests the current chapter skill. When a mistake occurs, deterministic mistake tags classify the error type (such as sign inversion or like-term confusion) and trace backwards along the NCERT DAG to find the exact prerequisite breakdown.",
      step2Title: "2. ADAPT",
      step2Subtitle: "Adapts Learn, Solve, and Test simultaneously",
      step2Desc:
        "Margam selects the appropriate learning variant: Basics-first with concrete Indian models (Kirana debts, weighing balances), Standard with formal steps, or Fast-track with mental shortcuts. Practice questions adapt difficulty deterministically (1 to 3).",
      step3Title: "3. CHECK AGAIN",
      step3Subtitle: "Verifies true conceptual mastery before moving on",
      step3Desc:
        "After completing the adapted lesson, a quick 2-question check verifies that the foundational gap has closed. Only when mastery is demonstrated does the system progress to the next concept in the pathway.",
    },
    hi: {
      badge: "मुख्य शिक्षण चक्र",
      headline: "निदान (Diagnose) → अनुकूलन (Adapt) → पुनः जाँच (Check Again)",
      subhead:
        "मार्गम् अंधी पुनरावृत्ति को एक सतत, स्पष्ट तीन-चरणीय चक्र से बदलता है जो शिक्षक को सूचित रखते हुए प्रत्येक छात्र की गति का सम्मान करता है।",
      step1Title: "1. निदान (Diagnose)",
      step1Subtitle: "6 प्रश्नों में मूल कारण का पता लगाता है",
      step1Desc:
        "एक छोटा डायग्नोस्टिक वर्तमान अध्याय कौशल की जाँच करता है। त्रुटि होने पर, निश्चित मिस्टेक टैग्स त्रुटि के प्रकार (जैसे चिह्न विपर्यय) को वर्गीकृत करते हैं और NCERT DAG में पीछे जाकर सटीक कमी खोजते हैं।",
      step2Title: "2. अनुकूलन (Adapt)",
      step2Subtitle: "सीखना, हल करना और परीक्षण तीनों को अनुकूलित करता है",
      step2Desc:
        "मार्गम् उपयुक्त पाठ चुनता है: भारतीय उदाहरणों के साथ बुनियादी (किराना उधारी, तराजू संतुलन), मानक व्यवस्थित चरण, या त्वरित शॉर्टकट। अभ्यास प्रश्नों की कठिनाई (1 से 3) स्वचालित रूप से अनुकूलित होती है।",
      step3Title: "3. पुनः जाँच (Check Again)",
      step3Subtitle: "आगे बढ़ने से पहले वास्तविक अवधारणा स्पष्टता की पुष्टि करता है",
      step3Desc:
        "अनुकूलित पाठ के बाद, 2 प्रश्नों की संक्षिप्त जाँच पुष्टि करती है कि बुनियादी कमी दूर हो गई है। दक्षता सिद्ध होने पर ही विद्यार्थी अगले संप्रत्यय पर बढ़ता है।",
      te: {
        badge: "ప్రధాన అభ్యాస ప్రక్రియ",
        headline: "రోగ నిర్ధారణ (Diagnose) → అనుకూలత (Adapt) → మళ్ళీ సరిచూడటం (Check Again)",
        subhead:
          "మార్గం గుడ్డి హోమ్‌వర్క్ స్థానంలో స్పష్టమైన మూడు దశల ప్రక్రియను అందిస్తుంది, ఇది ఉపాధ్యాయుడి నియంత్రణలో ప్రతి విద్యార్థి వేగానికి అనుగుణంగా నడుస్తుంది.",
        step1Title: "1. నిర్ధారణ (Diagnose)",
        step1Subtitle: "6 ప్రశ్నలలో మూల లోపాన్ని గుర్తిస్తుంది",
        step1Desc:
          "ఒక చిన్న డయాగ్నోస్టిక్ పరీక్ష ప్రస్తుత పాఠాన్ని పరీక్షిస్తుంది. తప్పు సమాధానం వచ్చినప్పుడు, మిస్టేక్ ట్యాగ్‌లు సంకేత లేదా గణన లోపాలను గుర్తించి, NCERT DAG ద్వారా వెనుకకు వెళ్లి అసలు కారణాన్ని కనుగొంటాయి.",
        step2Title: "2. అనుకూలత (Adapt)",
        step2Subtitle: "నేర్చుకోవడం, సాధన, మరియు పరీక్ష మూడింటినీ మారుస్తుంది",
        step2Desc:
          "మార్గం సరైన పాఠ్యాంశాన్ని ఎంచుకుంటుంది: కిరాణా అప్పుల ఉదాహరణలతో ప్రాథమిక పద్ధతి, క్రమబద్ధమైన సాధారణ పద్ధతి, లేదా వేగవంతమైన షార్ట్‌కట్‌లు. సాధన ప్రశ్నల స్థాయి (1 నుండి 3) మారుతుంది.",
        step3Title: "3. సరిచూడటం (Check Again)",
        step3Subtitle: "ముందుకు సాగే ముందు భావన అర్థమైందో లేదో నిర్ధారిస్తుంది",
        step3Desc:
          "పాఠం పూర్తయిన తర్వాత, 2 ప్రశ్నల చిన్న పరీక్ష ద్వారా లోపం తొలగిపోయిందో లేదో ధృవీకరిస్తుంది. సంపూర్ణ పట్టు సాధించిన తర్వాత మాత్రమే తదుపరి కాన్సెప్ట్‌కు అనుమతిస్తుంది.",
      },
    },
    te: {
      badge: "ప్రధాన అభ్యాస ప్రక్రియ",
      headline: "రోగ నిర్ధారణ (Diagnose) → అనుకూలత (Adapt) → మళ్ళీ సరిచూడటం (Check Again)",
      subhead:
        "మార్గం గుడ్డి హోమ్‌వర్క్ స్థానంలో స్పష్టమైన మూడు దశల ప్రక్రియను అందిస్తుంది, ఇది ఉపాధ్యాయుడి నియంత్రణలో ప్రతి విద్యార్థి వేగానికి అనుగుణంగా నడుస్తుంది.",
      step1Title: "1. నిర్ధారణ (Diagnose)",
      step1Subtitle: "6 ప్రశ్నలలో మూల లోపాన్ని గుర్తిస్తుంది",
      step1Desc:
        "ఒక చిన్న డయాగ్నోస్టిక్ పరీక్ష ప్రస్తుత పాఠాన్ని పరీక్షిస్తుంది. తప్పు సమాధానం వచ్చినప్పుడు, మిస్టేక్ ట్యాగ్‌లు సంకేత లేదా గణన లోపాలను గుర్తించి, NCERT DAG ద్వారా వెనుకకు వెళ్లి అసలు కారణాన్ని కనుగొంటాయి.",
      step2Title: "2. అనుకూలత (Adapt)",
      step2Subtitle: "నేర్చుకోవడం, సాధన, మరియు పరీక్ష మూడింటినీ మారుస్తుంది",
      step2Desc:
        "మార్గం సరైన పాఠ్యాంశాన్ని ఎంచుకుంటుంది: కిరాణా అప్పుల ఉదాహరణలతో ప్రాథమిక పద్ధతి, క్రమబద్ధమైన సాధారణ పద్ధతి, లేదా వేగవంతమైన షార్ట్‌కట్‌లు. సాధన ప్రశ్నల స్థాయి (1 నుండి 3) మారుతుంది.",
      step3Title: "3. సరిచూడటం (Check Again)",
      step3Subtitle: "ముందుకు సాగే ముందు భావన అర్థమైందో లేదో నిర్ధారిస్తుంది",
      step3Desc:
        "పాఠం పూర్తయిన తర్వాత, 2 ప్రశ్నల చిన్న పరీక్ష ద్వారా లోపం తొలగిపోయిందో లేదో ధృవీకరిస్తుంది. సంపూర్ణ పట్టు సాధించిన తర్వాత మాత్రమే తదుపరి కాన్సెప్ట్‌కు అనుమతిస్తుంది.",
    },
  }[currentLang];

  return (
    <section id="approach" className="py-16 md:py-24 bg-margam-cream border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              02 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-margam-terracotta flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-margam-navy">
                {t.step1Title}
              </h3>
              <div className="text-xs font-bold text-margam-terracotta uppercase tracking-wide">
                {t.step1Subtitle}
              </div>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.step1Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono font-semibold text-margam-slate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-margam-terracotta" />
              <span>Deterministic Distractor Analysis</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-margam-amber flex items-center justify-center font-bold">
                <Shuffle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-margam-navy">
                {t.step2Title}
              </h3>
              <div className="text-xs font-bold text-margam-amber uppercase tracking-wide">
                {t.step2Subtitle}
              </div>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.step2Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono font-semibold text-margam-slate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-margam-amber" />
              <span>Basics-First • Standard • Fast-Track</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-5 relative">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-margam-emerald flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-margam-navy">
                {t.step3Title}
              </h3>
              <div className="text-xs font-bold text-margam-emerald uppercase tracking-wide">
                {t.step3Subtitle}
              </div>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.step3Desc}
              </p>
            </div>
            <div className="pt-3 border-t border-margam-border/60 text-[11px] font-mono font-semibold text-margam-slate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-margam-emerald" />
              <span>Evidence-Based Mastery Validation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
