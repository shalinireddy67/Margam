"use client";

import React, { useState } from "react";
import { Users, Layers, Sliders, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import demoClassData from "../../data/demo-class.json";
import { SupportedLanguage } from "@/lib/types";

interface TeacherControlProps {
  currentLang: SupportedLanguage;
}

export default function TeacherControl({ currentLang }: TeacherControlProps) {
  const [activeGroupTab, setActiveGroupTab] = useState<"integers" | "transposition" | "fractions">(
    "integers"
  );

  // Group synthetic students by diagnosed gap
  const integerGapStudents = demoClassData.students.filter(
    (s) => s.diagnosedRootGap?.rootPrerequisiteId === "c7-int-02"
  );
  const transpositionStudents = demoClassData.students.filter(
    (s) => s.diagnosedRootGap?.rootPrerequisiteId === "c8-lin-03"
  );
  const fractionStudents = demoClassData.students.filter(
    (s) => s.diagnosedRootGap?.rootPrerequisiteId === "c6-frac-01"
  );

  const t = {
    en: {
      badge: "Empowered, Not Replaced",
      headline: "Teachers Remain in Full Control",
      subhead:
        "Algorithms should inform educators, never dictate to them. Margam turns scattered test scores into clear, actionable classroom groups so teachers can conduct focused 10-minute interventions.",
      pillar1: "Class-Wide Mastery Heatmap",
      pillar1Desc:
        "Instantly see which concepts the entire class has mastered, and where hidden prerequisite bottlenecks lie across grade levels.",
      pillar2: "Automated Peer Remedial Groups",
      pillar2Desc:
        "Margam clusters students needing the same foundational review, enabling targeted group activities and shared peer discussion.",
      pillar3: "Teacher Override Authority",
      pillar3Desc:
        "The teacher can easily override any adaptive recommendation, assign custom topics, or disable digital practice in favor of paper worksheets.",
      demoTitle: "Interactive Preview: Grouping Engine for Class 8A (25 Students)",
      demoSubtitle:
        "Based on synthetic demo dataset in data/demo-class.json. Full Teacher Dashboard arrives in Phase 3.",
    },
    hi: {
      badge: "सशक्तिकरण, प्रतिस्थापन नहीं",
      headline: "शिक्षक ही मुख्य निर्णयकर्ता हैं",
      subhead:
        "एल्गोरिदम को शिक्षकों का मार्गदर्शन करना चाहिए, उन पर हावी नहीं होना चाहिए। मार्गम् बिखरे हुए अंकों को स्पष्ट समूहों में बदलता है ताकि शिक्षक 10 मिनट के प्रभावी सत्र ले सकें।",
      pillar1: "कक्षा-वार दक्षता हीटमैप",
      pillar1Desc:
        "एक नज़र में देखें कि पूरी कक्षा ने किन संप्रत्ययों में महारत हासिल की है और किस बुनियादी नियम में छात्र अटक रहे हैं।",
      pillar2: "लक्षित समूह विभाजन",
      pillar2Desc:
        "समान आवश्यकता वाले विद्यार्थियों को स्वचालित रूप से समूहित करता है ताकि शिक्षक छोटे समूहों में पढ़ा सकें।",
      pillar3: "शिक्षक का पूर्ण नियंत्रण",
      pillar3Desc:
        "शिक्षक किसी भी स्वचालित अनुशंसा को बदल सकते हैं और अपनी पसंद के विषय या मुद्रित वर्कशीट असाइन कर सकते हैं।",
      demoTitle: "कक्षा 8A समूह विभाजन पूर्वावलोकन (25 विद्यार्थी)",
      demoSubtitle: "data/demo-class.json पर आधारित। पूर्ण शिक्षक डैशबोर्ड चरण 3 में उपलब्ध होगा।",
    },
    te: {
      badge: "ఉపాధ్యాయుల చేతుల్లోనే నియంత్రణ",
      headline: "ఉపాధ్యాయుడికి సహాయకారి, ప్రత్యామ్నాయం కాదు",
      subhead:
        "సాంకేతికత ఉపాధ్యాయుడికి తోడ్పడాలి కానీ బోధనను శాసించకూడదు. మార్గం విద్యార్థుల సమస్యలను స్పష్టమైన గ్రూపులుగా విభజించి 10 నిమిషాల లక్ష్య కేంద్రీకృత బోధనకు సహాయపడుతుంది.",
      pillar1: "తరగతి సమగ్ర హీట్‌మ్యాప్",
      pillar1Desc:
        "తరగతిలోని విద్యార్థులు ఏ కాన్సెప్ట్‌లో ముందున్నారో, ఎక్కడ వెనుకబడ్డారో రంగుల ద్వారా సులభంగా తెలియజేస్తుంది.",
      pillar2: "సమస్యల ఆధారంగా విద్యార్థుల సమూహాలు",
      pillar2Desc:
        "ఒకే విధమైన లోపం ఉన్న విద్యార్థులను వేరుచేసి, ఉపాధ్యాయుడు చిన్న బృందాలలో ప్రత్యేక శ్రద్ధ పెట్టడానికి వీలుకల్పిస్తుంది.",
      pillar3: "ఉపాధ్యాయుడి పూర్తి అధికారం",
      pillar3Desc:
        "సిస్టమ్ సూచించిన మార్గాన్ని ఉపాధ్యాయుడు ఎప్పుడైనా మార్చవచ్చు లేదా సొంత వర్క్‌షీట్‌లను నిర్ణయించవచ్చు.",
      demoTitle: "8A తరగతి విద్యార్థుల సమూహాల ప్రివ్యూ (25 విద్యార్థులు)",
      demoSubtitle: "data/demo-class.json ఆధారంగా. పూర్తి ఉపాధ్యాయ డ్యాష్‌బోర్డ్ ఫేజ్ 3 లో రానుంది.",
    },
  }[currentLang];

  return (
    <section id="teachers" className="py-16 md:py-24 bg-margam-cream border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              06 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-3 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-margam-terracotta flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-margam-navy">
              {t.pillar1}
            </h3>
            <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
              {t.pillar1Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-3 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-margam-amber flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-margam-navy">
              {t.pillar2}
            </h3>
            <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
              {t.pillar2Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-margam-border p-6 space-y-3 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-margam-emerald flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-margam-navy">
              {t.pillar3}
            </h3>
            <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
              {t.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Synthetic Grouping Engine Demo */}
        <div className="rounded-2xl border-2 border-margam-border bg-white p-6 sm:p-8 space-y-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between border-b border-margam-border pb-4 gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-margam-terracotta">
                Classroom Grouping Engine
              </span>
              <h3 className="font-serif text-xl font-bold text-margam-navy">
                {t.demoTitle}
              </h3>
            </div>
            <span className="text-xs font-mono bg-margam-cream-paper border border-margam-border text-slate-700 px-3 py-1 rounded-full font-bold">
              Teacher: Mrs. Lakshmi Devi
            </span>
          </div>

          {/* Group Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveGroupTab("integers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroupTab === "integers"
                  ? "bg-rose-100 text-rose-900 border-2 border-rose-300 shadow-xs"
                  : "bg-margam-cream-paper border border-margam-border text-margam-slate hover:text-margam-navy"
              }`}
            >
              Group A: Signed Integer Operations ({integerGapStudents.length} Students)
            </button>

            <button
              type="button"
              onClick={() => setActiveGroupTab("transposition")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroupTab === "transposition"
                  ? "bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-xs"
                  : "bg-margam-cream-paper border border-margam-border text-margam-slate hover:text-margam-navy"
              }`}
            >
              Group B: Variable Transposition ({transpositionStudents.length} Students)
            </button>

            <button
              type="button"
              onClick={() => setActiveGroupTab("fractions")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroupTab === "fractions"
                  ? "bg-blue-100 text-blue-900 border-2 border-blue-300 shadow-xs"
                  : "bg-margam-cream-paper border border-margam-border text-margam-slate hover:text-margam-navy"
              }`}
            >
              Group C: Fraction Denominators ({fractionStudents.length} Students)
            </button>
          </div>

          {/* Group Student Cards */}
          <div className="bg-margam-cream-paper rounded-xl p-5 border border-margam-border space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-margam-navy">
                Identified Students Needing Focused 10-Minute Remediation:
              </span>
              <span className="text-margam-terracotta">
                Recommended Action: 10-Min Kirana Model Group Activity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(activeGroupTab === "integers"
                ? integerGapStudents
                : activeGroupTab === "transposition"
                ? transpositionStudents
                : fractionStudents
              ).map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-3.5 rounded-xl border border-margam-border shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-margam-navy">
                      {student.name}
                    </span>
                    <span className="text-[10px] font-mono text-margam-slate bg-gray-100 px-1.5 py-0.5 rounded">
                      Roll #{student.rollNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-margam-slate line-clamp-2">
                    {student.diagnosedRootGap?.rationale}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-margam-terracotta font-semibold">
                      Prereq: {student.diagnosedRootGap?.rootPrerequisiteId}
                    </span>
                    <span className="uppercase text-slate-500 font-bold">
                      {student.diagnosedRootGap?.recommendedVariant}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-margam-slate text-center italic">
            {t.demoSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
