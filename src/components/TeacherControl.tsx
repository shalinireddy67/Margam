"use client";

import React, { useState } from "react";
import { Users, Layers, Sliders, CheckCircle2, ArrowRight } from "lucide-react";
import demoClassData from "../../data/demo-class.json";
import { SupportedLanguage } from "@/lib/types";

interface TeacherControlProps {
  currentLang: SupportedLanguage;
}

export default function TeacherControl({ currentLang }: TeacherControlProps) {
  const [activeGroupTab, setActiveGroupTab] = useState<"integers" | "transposition" | "fractions">(
    "integers"
  );

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
      badge: "For Teachers",
      headline: "Teachers Stay in Complete Control",
      subhead:
        "Margam turns scattered test scores into clear, actionable classroom groups for 10-minute targeted interventions.",
      pillar1Title: "Class Heatmap",
      pillar1Desc: "Instantly see which topics the whole class knows, and where hidden bottlenecks lie.",
      pillar2Title: "Auto Groups",
      pillar2Desc: "Group students needing the same foundation review for quick peer activities.",
      pillar3Title: "Teacher Override",
      pillar3Desc: "Change any recommendation, assign custom topics, or print paper worksheets anytime.",
      previewTitle: "Live Classroom Grouping: Class 8A (25 Students)",
      tabIntegers: `Group A: Signed Integers (${integerGapStudents.length})`,
      tabTransposition: `Group B: Variable Moves (${transpositionStudents.length})`,
      tabFractions: `Group C: Fractions (${fractionStudents.length})`,
      actionLabel: "Recommended: 10-Min Kirana Ledger Peer Activity",
    },
    hi: {
      badge: "शिक्षकों के लिए",
      headline: "शिक्षक ही मुख्य निर्णयकर्ता हैं",
      subhead:
        "मार्गम् बिखरे हुए अंकों को स्पष्ट समूहों में बदलता है ताकि शिक्षक 10 मिनट के केंद्रित उपचारात्मक सत्र ले सकें।",
      pillar1Title: "कक्षा हीटमैप",
      pillar1Desc: "एक नज़र में देखें कि पूरी कक्षा कहाँ मजबूत है और कहाँ अटक रही है।",
      pillar2Title: "स्वचालित समूह",
      pillar2Desc: "समान कमी वाले विद्यार्थियों को एक साथ समूहित करके पढ़ाएँ।",
      pillar3Title: "शिक्षक का नियंत्रण",
      pillar3Desc: "किसी भी अनुशंसा को बदलें या मुद्रित वर्कशीट असाइन करें।",
      previewTitle: "कक्षा 8A समूह विभाजन पूर्वावलोकन (25 विद्यार्थी)",
      tabIntegers: `समूह A: पूर्णांक चिह्न (${integerGapStudents.length})`,
      tabTransposition: `समूह B: पक्षांतरण (${transpositionStudents.length})`,
      tabFractions: `समूह C: भिन्न (${fractionStudents.length})`,
      actionLabel: "सुझाव: 10-मिनट का किराना खाता समूह अभ्यास",
    },
    te: {
      badge: "ఉపాధ్యాయుల కోసం",
      headline: "ఉపాధ్యాయుల చేతుల్లోనే పూర్తి అధికారం",
      subhead:
        "మార్కులు ఇచ్చే అయోమయాన్ని తొలగించి, 10 నిమిషాల లక్ష్య కేంద్రీకృత బోధన కోసం విద్యార్థులను గ్రూపులుగా విభజిస్తుంది.",
      pillar1Title: "తరగతి హీట్‌మ్యాప్",
      pillar1Desc: "తరగతి మొత్తం ఎక్కడ ముందుందో, ఎక్కడ వెనుకబడిందో స్పష్టంగా చూపుతుంది.",
      pillar2Title: "సహజ గ్రూపులు",
      pillar2Desc: "ఒకే రకమైన లోపం ఉన్న విద్యార్థులను వేరుచేసి చిన్న బృందాలుగా చేస్తుంది.",
      pillar3Title: "ఉపాధ్యాయుడి నిర్ణయం",
      pillar3Desc: "సిస్టమ్ సూచనలను ఎప్పుడైనా మార్చవచ్చు లేదా వర్క్‌షీట్‌లను ప్రింట్ చేయవచ్చు.",
      previewTitle: "8A తరగతి బృంద విభజన (25 విద్యార్థులు)",
      tabIntegers: `గ్రూప్ A: పూర్ణ సంఖ్యలు (${integerGapStudents.length})`,
      tabTransposition: `గ్రూప్ B: సమీకరణాలు (${transpositionStudents.length})`,
      tabFractions: `గ్రూప్ C: భిన్నాలు (${fractionStudents.length})`,
      actionLabel: "సూచన: 10 నిమిషాల కిరాణా షాపు బృంద అభ్యాసం",
    },
  }[currentLang];

  return (
    <section id="teachers" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <Users className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans">
          {t.subhead}
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-6 space-y-3">
          <div className="w-10 h-10 bg-[#E04A3F] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-white flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-base text-[#2B1B0F]">
            {t.pillar1Title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
            {t.pillar1Desc}
          </p>
        </div>

        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-6 space-y-3">
          <div className="w-10 h-10 bg-[#F4C542] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-[#2B1B0F] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-base text-[#2B1B0F]">
            {t.pillar2Title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
            {t.pillar2Desc}
          </p>
        </div>

        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-6 space-y-3">
          <div className="w-10 h-10 bg-[#5DAA3A] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-white flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-pixel text-base text-[#2B1B0F]">
            {t.pillar3Title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
            {t.pillar3Desc}
          </p>
        </div>
      </div>

      {/* Interactive Grouping Demo Card */}
      <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#E5D7BE] pb-4 gap-2">
          <h3 className="font-pixel text-base sm:text-lg text-[#2B1B0F]">
            {t.previewTitle}
          </h3>
          <span className="font-pixel text-xs bg-[#FFE9A8] px-3 py-1 border border-[#422816] text-[#2B1B0F]">
            Teacher: Mrs. Lakshmi Devi
          </span>
        </div>

        {/* 3 Group Switcher Tabs with min 48px touch target */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveGroupTab("integers")}
            className={`min-h-[48px] px-4 py-2 border-[2px] font-pixel text-xs transition-all cursor-pointer ${activeGroupTab === "integers"
              ? "bg-[#3FA7C9] text-white border-[#422816] shadow-[3px_3px_0px_#1B120C]"
              : "bg-white/80 border-[#422816]/30 text-[#2B1B0F] hover:bg-white hover:border-[#422816]"
              }`}
          >
            {t.tabIntegers}
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab("transposition")}
            className={`min-h-[48px] px-4 py-2 border-[2px] font-pixel text-xs transition-all cursor-pointer ${activeGroupTab === "transposition"
              ? "bg-[#3FA7C9] text-white border-[#422816] shadow-[3px_3px_0px_#1B120C]"
              : "bg-white/80 border-[#422816]/30 text-[#2B1B0F] hover:bg-white hover:border-[#422816]"
              }`}
          >
            {t.tabTransposition}
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab("fractions")}
            className={`min-h-[48px] px-4 py-2 border-[2px] font-pixel text-xs transition-all cursor-pointer ${activeGroupTab === "fractions"
              ? "bg-[#3FA7C9] text-white border-[#422816] shadow-[3px_3px_0px_#1B120C]"
              : "bg-white/80 border-[#422816]/30 text-[#2B1B0F] hover:bg-white hover:border-[#422816]"
              }`}
          >
            {t.tabFractions}
          </button>
        </div>

        {/* Student Cards in Selected Group */}
        <div className="bg-white/80 border-[2px] border-[#422816] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-pixel text-[#E04A3F]">
            <span>Students Needing Focused 10-Minute Review:</span>
            <span className="hidden sm:inline bg-[#FFE9A8] text-[#2B1B0F] px-2.5 py-0.5 border border-[#422816]">
              {t.actionLabel}
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
                className="p-3.5 bg-[#FFF7E6] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#2B1B0F]">
                    {student.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#7A4B2A] bg-white px-2 py-0.5 border border-[#422816]">
                    #{student.rollNumber}
                  </span>
                </div>
                <div className="text-[11px] text-[#5A3720] line-clamp-2 font-sans">
                  {student.diagnosedRootGap?.rationale}
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-[#E04A3F]">
                  <span>Prereq: {student.diagnosedRootGap?.rootPrerequisiteId}</span>
                  <span className="uppercase text-[#7A4B2A]">
                    {student.diagnosedRootGap?.recommendedVariant}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
