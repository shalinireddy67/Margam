"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface ApproachSectionProps {
  currentLang: SupportedLanguage;
}

export default function ApproachSection({ currentLang }: ApproachSectionProps) {
  const t = {
    en: {
      sectionNum: "03 / HOW THE AGENT WORKS : VISUAL SAMPLES",
      headline: "From 6-Minute Check to Actionable Gap Report",
      ctaBtn: "Start an Assessment Now",
      sampleReport: "SAMPLE REPORT",
      reportTitle: "Student Gap Report",
      classScore: "Class 9A : 38%",
      sampleNotice: "Sample data. Not a real student.",
      studentName: "Rajesh Kumar (Roll #7)",
      diagnosedCause: "Diagnosed Root Cause:",
      rootTitle: "Class 7 Integer Subtraction & Sign Rules",
      quote: "“Student attempted middle-term splitting in x² - x - 6 by choosing 3 and 2, but multiplied (-3) × (+2) to get +6 instead of -6.”",
      backtrackTrail: "AI Agent Backtracking Trail:",
      prescribedSeq: "Prescribed 5-Day Classroom Sequence:",
      prescribedDays: "Day 1 to 2: Kirana shop debt model on paper. Day 3: Sign flips on slate. Day 4 to 5: Single-sheet paper checks.",
      sampleWorksheet: "SAMPLE WORKSHEET",
      worksheetTitle: "1-Page Paper Worksheet",
      worksheetBadge: "Standard A4 Print",
      targetSkill: "Target Skill: Factoring with Negative Signs",
      deterministicFooter: "Deterministic Question Bank • Generated for Student Diagnosis • Form M-A4-2026",
    },
    hi: {
      sectionNum: "03 / एजेंट कैसे काम करता है : दृश्य नमूने",
      headline: "6-मिनट की जाँच से क्रियाशील गैप रिपोर्ट तक",
      ctaBtn: "अभी मूल्यांकन शुरू करें",
      sampleReport: "नमूना रिपोर्ट",
      reportTitle: "छात्र अंतर रिपोर्ट",
      classScore: "कक्षा 9A : 38%",
      sampleNotice: "काल्पनिक डेटा। वास्तविक छात्र नहीं।",
      studentName: "राजेश कुमार (रोल #7)",
      diagnosedCause: "पहचाना गया मूल कारण:",
      rootTitle: "कक्षा 7 पूर्णांक व्यवकलन और चिह्न नियम",
      quote: "“छात्र ने x² - x - 6 में मध्य पद तोड़ने का प्रयास किया परंतु (-3) × (+2) को -6 के स्थान पर +6 समझ लिया।”",
      backtrackTrail: "AI एजेंट बैकट्रैकिंग पथ:",
      prescribedSeq: "निर्धारित 5-दिवसीय कक्षा अनुक्रम:",
      prescribedDays: "दिन 1 से 2: किराना उधारी खाता मॉडल। दिन 3: स्लेट पर चिह्न अभ्यास। दिन 4 से 5: एकल-पृष्ठ पेपर टेस्ट।",
      sampleWorksheet: "नमूना वर्कशीट",
      worksheetTitle: "1-पेज पेपर वर्कशीट",
      worksheetBadge: "मानक A4 प्रिंट",
      targetSkill: "लक्षित कौशल: ऋणात्मक चिह्नों के साथ गुणनखंडन",
      deterministicFooter: "निश्चित प्रश्न बैंक • छात्र निदान हेतु उत्पन्न • फॉर्म M-A4-2026",
    },
    te: {
      sectionNum: "03 / ఏజెంట్ ఎలా పనిచేస్తుంది : దృశ్య నమూనాలు",
      headline: "6 నిమిషాల పరిశీలన నుండి కార్యాచరణ నివేదిక వరకు",
      ctaBtn: "ఇప్పుడే డయాగ్నోస్టిక్ ప్రారంభించండి",
      sampleReport: "నమూనా రిపోర్ట్",
      reportTitle: "విద్యార్థి గ్యాప్ రిపోర్ట్",
      classScore: "తరగతి 9A : 38%",
      sampleNotice: "నమూనా సమాచారం. అసలు విద్యార్థి కాదు.",
      studentName: "రాజేష్ కుమార్ (రోల్ #7)",
      diagnosedCause: "గుర్తించిన మూల కారణం:",
      rootTitle: "7వ తరగతి పూర్ణ సంఖ్యల తీసివేత & సంకేత నియమాలు",
      quote: "“విద్యార్థి x² - x - 6 లో మధ్య పదాన్ని విభజించడానికి ప్రయత్నించాడు, కానీ (-3) × (+2) = -6 కు బదులుగా +6 అనుకున్నాడు.”",
      backtrackTrail: "AI ఏజెంట్ బ్యాక్‌ట్రాకింగ్ మార్గం:",
      prescribedSeq: "సూచించిన 5 రోజుల తరగతి ప్రణాళిక:",
      prescribedDays: "రోజు 1 నుండి 2: కిరాణా అప్పుల పద్ధతి. రోజు 3: పలకపై సంకేతాల సాధన. రోజు 4 నుండి 5: పేపర్ చెక్స్.",
      sampleWorksheet: "నమూనా వర్క్‌షీట్",
      worksheetTitle: "1-పేజీ పేపర్ వర్క్‌షీట్",
      worksheetBadge: "ప్రామాణిక A4 ప్రింట్",
      targetSkill: "లక్ష్య నైపుణ్యం: ఋణ సంఖ్యలతో కారణాంక విభజన",
      deterministicFooter: "ఖచ్చితమైన ప్రశ్నల బ్యాంక్ • రోగ నిర్ధారణ కోసం రూపొందించబడింది • ఫారం M-A4-2026",
    },
  }[currentLang];

  return (
    <section id="approach" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto bg-[#FFF7E6] dark:bg-[#1A2615] rounded-[32px] border border-[#C7DDAE]/60 my-6 shadow-card">
      {/* Top Banner */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#C7DDAE]/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
              <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
              <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>{t.sectionNum}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold mt-1 text-foreground">
            {t.headline}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#try-diagnostic"
            className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 min-h-[44px] inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold hover:bg-primary/90 cursor-pointer shadow-warm transition-transform active:scale-95"
          >
            <span>{t.ctaBtn}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* 2 Massive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Student Gap Report */}
        <div className="rounded-[28px] border-2 border-[#C7DDAE] bg-[#FFF7E6] dark:bg-[#1C2817] p-6 shadow-card space-y-4">
          <div className="border-b border-[#C7DDAE]/60 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
                  <path d="M 12 2 C 12 8 8 12 2 12 C 8 12 12 16 12 22 C 12 16 16 12 22 12 C 16 12 12 8 12 2 Z" fill="#F4C542" />
                </svg>
                {t.sampleReport}
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {t.reportTitle}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-sans px-3 py-1 rounded-full bg-[#F4C542]/25 text-[#9E6000] dark:text-[#F4C542] border border-[#F4C542]/50 font-bold">
                {t.classScore}
              </span>
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#C7DDAE]/20 text-muted-foreground border border-[#C7DDAE]/40">
                {t.sampleNotice}
              </span>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#C7DDAE] p-4 bg-[#C7DDAE]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-muted-foreground uppercase">Student:</span>
              <strong className="text-foreground">{t.studentName}</strong>
            </div>
            <div className="text-xs font-sans">
              <span className="text-accent font-bold uppercase block">{t.diagnosedCause}</span>
              <p className="font-heading text-base font-bold text-primary">
                {t.rootTitle}
              </p>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed italic border-t border-[#C7DDAE]/50 pt-2">
              {t.quote}
            </p>
          </div>

          <div className="rounded-[20px] border border-[#C7DDAE] p-3.5 bg-white dark:bg-[#1A2615] space-y-2 text-xs font-sans">
            <span className="uppercase font-bold text-primary flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
                <circle cx="12" cy="7.2" r="4.2" fill="#F4C542" />
                <circle cx="16.6" cy="10.5" r="4.2" fill="#F4C542" />
                <circle cx="14.8" cy="16" r="4.2" fill="#F4C542" />
                <circle cx="9.2" cy="16" r="4.2" fill="#F4C542" />
                <circle cx="7.4" cy="10.5" r="4.2" fill="#F4C542" />
                <circle cx="12" cy="12" r="3.2" fill="#F28C38" />
              </svg>
              {t.backtrackTrail}
            </span>
            <div className="flex items-center justify-between text-xs bg-[#FFF7E6] dark:bg-[#1C2817] p-2.5 rounded-[14px] border border-[#C7DDAE]/60">
              <span className="text-primary font-bold">Class 7 Signed Arithmetic</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
              <span className="text-primary font-bold">Class 8 Balancing</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
              <span className="text-muted-foreground font-semibold">Class 9 Polynomials</span>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#6CA24A]/40 p-4 bg-[#C7DDAE]/30 space-y-1.5 text-xs font-sans">
            <span className="uppercase font-bold text-foreground block">{t.prescribedSeq}</span>
            <div className="text-foreground/80 leading-relaxed">
              {t.prescribedDays}
            </div>
          </div>
        </div>

        {/* Right: 1-Page Paper Worksheet */}
        <div className="rounded-[28px] border-2 border-[#C7DDAE] p-6 bg-[#FFF7E6] dark:bg-[#1C2817] text-foreground shadow-card space-y-4">
          <div className="border-b border-[#C7DDAE]/60 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                {t.sampleWorksheet}
              </span>
              <h3 className="font-heading text-xl font-bold">
                {t.worksheetTitle}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-sans px-3 py-1 rounded-full bg-[#C7DDAE]/40 text-primary border border-[#6CA24A]/40 font-bold">
                {t.worksheetBadge}
              </span>
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#C7DDAE]/20 text-muted-foreground border border-[#C7DDAE]/40">
                {t.sampleNotice}
              </span>
            </div>
          </div>

          {/* Worksheet Paper Card */}
          <div className="grid grid-cols-3 gap-2 border border-[#C7DDAE] p-2.5 rounded-[16px] text-xs font-sans bg-[#C7DDAE]/20">
            <div>STUDENT: <strong>Rajesh Kumar</strong></div>
            <div>ROLL NO: <strong>#7</strong></div>
            <div className="text-right">CLASS: <strong>9A</strong></div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="text-xs font-sans uppercase tracking-wider text-primary font-bold">
              {t.targetSkill}
            </div>
            <div className="border border-[#C7DDAE] p-3 rounded-[16px] space-y-1 bg-white dark:bg-[#1A2615]">
              <div className="text-xs font-bold font-sans">1. Split the middle term and factorise:</div>
              <div className="text-xs font-mono font-bold text-primary">x² - x - 6 = ?</div>
              <div className="h-8 border-b border-dashed border-[#C7DDAE] flex items-end text-xs text-muted-foreground font-sans">
                Answer: (x - 3)(x + 2)
              </div>
            </div>

            <div className="border border-[#C7DDAE] p-3 rounded-[16px] space-y-1 bg-white dark:bg-[#1A2615]">
              <div className="text-xs font-bold font-sans">2. Evaluate integer sign products:</div>
              <div className="text-xs font-mono font-bold text-primary">(-4) × (-3) × (-2) = ?</div>
              <div className="h-8 border-b border-dashed border-[#C7DDAE] flex items-end text-xs text-muted-foreground font-sans">
                Answer: -24
              </div>
            </div>
          </div>

          <div className="pt-2 text-center text-xs font-sans text-muted-foreground border-t border-[#C7DDAE]/50">
            {t.deterministicFooter}
          </div>
        </div>
      </div>
    </section>
  );
}
