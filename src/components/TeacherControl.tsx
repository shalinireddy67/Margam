"use client";

import React, { useState } from "react";
import { Users, Layers, Sliders, CheckCircle2, ChevronRight, Sparkles, GraduationCap } from "lucide-react";
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
      sectionNum: "07 / TEACHERS REMAIN IN CONTROL",
      badge: "Empowered, Not Replaced",
      headline: "Classroom Clustering & Teacher Agency",
      subhead:
        "Algorithms inform educators, never dictate to them. Margam turns scattered diagnostic marks into clear, actionable classroom clusters so teachers can conduct focused 10-minute interventions.",
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
      sectionNum: "07 / शिक्षक ही मुख्य निर्णयकर्ता हैं",
      badge: "सशक्तिकरण, प्रतिस्थापन नहीं",
      headline: "कक्षा समूहन और शिक्षक की स्वायत्तता",
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
      sectionNum: "07 / ఉపాధ్యాయుల చేతుల్లోనే నియంత్రణ",
      badge: "ఉపాధ్యాయుడికి సహాయకారి, ప్రత్యామ్నాయం కాదు",
      headline: "తరగతి గది బృంద విభజన & ఉపాధ్యాయ ప్రాధాన్యత",
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
    <section id="teachers" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-3.5 shadow-warm">
          <div className="w-10 h-10 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-primary flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            {t.pillar1}
          </h3>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
            {t.pillar1Desc}
          </p>
        </div>

        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-3.5 shadow-warm">
          <div className="w-10 h-10 rounded-full bg-[#FFF3DA] border border-[#FCD685] text-accent flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            {t.pillar2}
          </h3>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
            {t.pillar2Desc}
          </p>
        </div>

        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-3.5 shadow-warm">
          <div className="w-10 h-10 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-[#3E8424] flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            {t.pillar3}
          </h3>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
            {t.pillar3Desc}
          </p>
        </div>
      </div>

      {/* Synthetic Grouping Engine Demo */}
      <div className="rounded-[24px] border-2 border-[#C7DDAE] bg-card p-6 sm:p-8 space-y-6 shadow-warm">
        <div className="flex flex-wrap items-center justify-between border-b border-[#C7DDAE]/60 pb-4 gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
              Classroom Grouping Engine
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground mt-0.5">
              {t.demoTitle}
            </h3>
          </div>
          <span className="text-xs font-mono bg-background border border-[#C7DDAE] text-foreground/80 px-3 py-1 rounded-full font-bold">
            Teacher: Mrs. Lakshmi Devi
          </span>
        </div>

        {/* Group Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveGroupTab("integers")}
            className={`px-4 py-2 rounded-[14px] text-xs font-heading font-bold transition-all cursor-pointer ${
              activeGroupTab === "integers"
                ? "bg-[#FFF3DA] text-accent border-2 border-[#FCD685] shadow-warm-sm scale-[1.01]"
                : "bg-background border-2 border-[#C7DDAE]/60 text-foreground/80 hover:border-primary"
            }`}
          >
            Group A: Signed Integer Operations ({integerGapStudents.length} Students)
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab("transposition")}
            className={`px-4 py-2 rounded-[14px] text-xs font-heading font-bold transition-all cursor-pointer ${
              activeGroupTab === "transposition"
                ? "bg-[#EAF5E1] text-primary border-2 border-[#B7DE9E] shadow-warm-sm scale-[1.01]"
                : "bg-background border-2 border-[#C7DDAE]/60 text-foreground/80 hover:border-primary"
            }`}
          >
            Group B: Variable Transposition ({transpositionStudents.length} Students)
          </button>

          <button
            type="button"
            onClick={() => setActiveGroupTab("fractions")}
            className={`px-4 py-2 rounded-[14px] text-xs font-heading font-bold transition-all cursor-pointer ${
              activeGroupTab === "fractions"
                ? "bg-[#EAF5E1] text-[#3E8424] border-2 border-[#B7DE9E] shadow-warm-sm scale-[1.01]"
                : "bg-background border-2 border-[#C7DDAE]/60 text-foreground/80 hover:border-primary"
            }`}
          >
            Group C: Fraction Denominators ({fractionStudents.length} Students)
          </button>
        </div>

        {/* Group Student Cards */}
        <div className="bg-background rounded-[18px] p-5 border border-[#C7DDAE] space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
            <span className="text-foreground">
              Identified Students Needing Focused 10-Minute Remediation:
            </span>
            <span className="text-accent bg-[#FFF3DA] px-2.5 py-0.5 rounded-full border border-[#FCD685]">
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
                className="bg-card p-4 rounded-[14px] border border-[#C7DDAE] shadow-warm-sm space-y-2 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-foreground">
                    {student.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-[#C7DDAE]">
                    Roll #{student.rollNumber}
                  </span>
                </div>
                <div className="text-[11px] text-foreground/80 line-clamp-2 font-sans">
                  {student.diagnosedRootGap?.rationale}
                </div>
                <div className="pt-1.5 border-t border-[#C7DDAE]/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-accent font-bold">
                    Prereq: {student.diagnosedRootGap?.rootPrerequisiteId}
                  </span>
                  <span className="uppercase text-muted-foreground font-bold">
                    {student.diagnosedRootGap?.recommendedVariant}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center font-sans">
          {t.demoSubtitle}
        </p>
      </div>
    </section>
  );
}
