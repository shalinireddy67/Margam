"use client";

import React from "react";
import { SupportedLanguage } from "@/lib/types";

interface ProblemSectionProps {
  currentLang: SupportedLanguage;
}

export default function ProblemSection({ currentLang }: ProblemSectionProps) {
  const t = {
    en: {
      sectionNum: "02 / THE CLASSROOM DILEMMA",
      problemTag: "THE PROBLEM",
      quote: "A student scores 38% on a Class 9 Polynomials test. The mark confirms struggle, but conceals the root cause.",
      contextTag: "DESIGNED FOR INDIAN MIDDLE & HIGH SCHOOL CLASSROOMS",
      card1Tag: "The Dilemma",
      card1Title: "Repeating current class problems creates frustration.",
      card1Desc: "When a Class 9 student fails polynomial middle-term factoring (x² - x - 6), giving 20 more quadratic equations fails. The real gap is almost always in Class 7 integer sign rules: (-3) × (+2) = -6, but (-3) + 2 = -1.",
      card2Tag: "The AI Agent Solution",
      card2Title: "Traces the prerequisite gap and generates a 5-day plan.",
      card2Desc: "Margam backtracks through the curriculum DAG to identify whether the missing link began in Class 7 or Class 8, then produces a concrete 5-day classroom plan with single-sheet A4 paper printouts.",
    },
    hi: {
      sectionNum: "02 / कक्षा का असमंजस",
      problemTag: "मुख्य समस्या",
      quote: "कक्षा 9 के बहुपद टेस्ट में छात्र 38% अंक लाता है। अंक विफलता दर्शाते हैं, परंतु मूल कारण छिपा देते हैं।",
      contextTag: "भारतीय माध्यमिक विद्यालयों के लिए डिज़ाइन किया गया",
      card1Tag: "पारंपरिक दुविधा",
      card1Title: "वर्तमान कक्षा के ही और प्रश्न देने से हताशा बढ़ती है।",
      card1Desc: "जब कोई कक्षा 9 का छात्र गुणनखंड (x² - x - 6) नहीं कर पाता, तो 20 और प्रश्न देना विफल रहता है। वास्तविक अंतर कक्षा 7 के पूर्णांक चिह्न नियमों में होता है।",
      card2Tag: "AI एजेंट समाधान",
      card2Title: "बुनियादी कमी का पता लगाकर 5-दिवसीय योजना बनाता है।",
      card2Desc: "मार्गम् पाठ्यक्रम DAG में पीछे जाकर यह पता लगाता है कि कमी कक्षा 7 या 8 में कहाँ से शुरू हुई, फिर एकल-पृष्ठ प्रिंटआउट के साथ 5-दिवसीय योजना तैयार करता है।",
    },
    te: {
      sectionNum: "02 / తరగతి గది సమస్య",
      problemTag: "ప్రధాన సమస్య",
      quote: "9వ తరగతి బహుపదుల పరీక్షలో విద్యార్థికి 38% మార్కులు వచ్చాయి. మార్కులు సమస్యను చూపుతాయి కానీ మూల కారణాన్ని దాచిపెడతాయి.",
      contextTag: "భారతీయ ఉన్నత పాఠశాలల కోసం ప్రత్యేక రూపకల్పన",
      card1Tag: "సాంప్రదాయ సందిగ్ధత",
      card1Title: "అదే తరగతి లెక్కలను మళ్ళీ ఇవ్వడం వలన నిరాశ పెరుగుతుంది.",
      card1Desc: "విద్యార్థి వర్గ సమీకరణాల కారణాంక విభజన (x² - x - 6) చేయలేకపోతే, మరిన్ని లెక్కలు ఇచ్చినా ఫలితం ఉండదు. అసలు లోపం 7వ తరగతి పూర్ణ సంఖ్యల సంకేత నియమాలలో ఉంటుంది.",
      card2Tag: "AI ఏజెంట్ పరిష్కారం",
      card2Title: "పునాది లోపాన్ని గుర్తించి 5 రోజుల బోధనా ప్రణాళికను అందిస్తుంది.",
      card2Desc: "మార్గం DAG ద్వారా వెనుకకు వెళ్లి 7వ తరగతి లేదా 8వ తరగతి లోపాన్ని కనుగొని, 1-పేజీ A4 వర్క్‌షీట్‌లతో స్పష్టమైన 5 రోజుల ప్రణాళికను తయారుచేస్తుంది.",
    },
  }[currentLang];

  return (
    <section id="problem" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
      {/* Numbered Section Label */}
      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
          <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
          <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{t.sectionNum}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Big Blockquote */}
        <div className="lg:col-span-5 border-l-4 border-primary pl-5 py-2">
          <span className="text-xs font-sans uppercase tracking-widest text-accent font-bold block mb-2">
            {t.problemTag}
          </span>
          <blockquote className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight text-foreground">
            {t.quote}
          </blockquote>
          <div className="mt-4 text-xs font-sans text-muted-foreground flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
              <rect x="4" y="9" width="16" height="11" rx="2.5" fill="#6CA24A" />
              <rect x="3" y="6" width="18" height="4" rx="2" fill="#6CA24A" />
              <rect x="10.5" y="6" width="3" height="14" fill="#F4C542" />
            </svg>
            <span>{t.contextTag}</span>
          </div>
        </div>

        {/* Right 2 Editorial Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: The Dilemma */}
          <div className="rounded-[24px] border border-[#F7B7C4] bg-[#F7B7C4]/20 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-warm transition-all duration-200">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-accent font-bold mb-1">
                {t.card1Tag}
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
                {t.card1Desc}
              </p>
            </div>

            {/* Visual SVG Card */}
            <div className="pt-2 flex justify-center">
              <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px] h-auto drop-shadow-xs">
                <rect x="20" y="20" width="240" height="140" rx="8" fill="#C6C7C4" stroke="#2F4A1E" strokeWidth="4" />
                <rect x="30" y="30" width="220" height="120" rx="4" fill="#253C1B" stroke="#2F4A1E" strokeWidth="2.5" />
                <circle cx="85" cy="90" r="38" stroke="#F56276" strokeWidth="5" strokeDasharray="14 7" fill="none" />
                <text x="85" y="100" textAnchor="middle" fill="#F56276" fontFamily="var(--font-heading)" fontSize="28" fontWeight="bold">38%</text>
                <g transform="translate(145, 55)">
                  <rect x="0" y="0" width="95" height="30" rx="4" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="2.5" />
                  <text x="47" y="20" textAnchor="middle" fill="#2F4A1E" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="bold">x² - x - 6</text>
                </g>
                <g transform="translate(145, 95)">
                  <rect x="0" y="0" width="95" height="30" rx="4" fill="#EEF0F2" stroke="#F56276" strokeWidth="2.5" />
                  <text x="47" y="20" textAnchor="middle" fill="#F56276" fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="bold">Sign Mistake (?)</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Card 2: The AI Agent Solution */}
          <div className="rounded-[24px] border border-[#6CA24A]/40 bg-[#C7DDAE]/30 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-warm transition-all duration-200">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-primary font-bold mb-1">
                {t.card2Tag}
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                {t.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
                {t.card2Desc}
              </p>
            </div>

            {/* Visual DAG & 5-Day Plan SVG */}
            <div className="pt-2 flex justify-center">
              <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px] h-auto drop-shadow-xs">
                <rect x="25" y="18" width="230" height="144" rx="6" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="4" />
                <rect x="25" y="18" width="230" height="26" rx="6" fill="#A2999E" stroke="#2F4A1E" strokeWidth="2.5" />
                <circle cx="45" cy="31" r="4.5" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="2" />
                <circle cx="62" cy="31" r="4.5" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="2" />
                <circle cx="79" cy="31" r="4.5" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="2" />

                {/* Nodes C7 -> C8 -> C9 */}
                <g transform="translate(45, 60)">
                  <circle cx="22" cy="30" r="16" fill="#EEF0F2" stroke="#2F4A1E" strokeWidth="3" />
                  <text x="22" y="34" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-heading)" fontSize="11" fontWeight="bold">C7</text>
                  <line x1="38" y1="30" x2="68" y2="30" stroke="#F56276" strokeWidth="3" strokeDasharray="4 2" />
                  <polygon points="70,30 62,26 62,34" fill="#F56276" />
                  <circle cx="86" cy="30" r="16" fill="#C6C7C4" stroke="#2F4A1E" strokeWidth="3" />
                  <text x="86" y="34" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-heading)" fontSize="11" fontWeight="bold">C8</text>
                  <line x1="102" y1="30" x2="132" y2="30" stroke="#6CA24A" strokeWidth="3" />
                  <polygon points="134,30 126,26 126,34" fill="#6CA24A" />
                  <circle cx="150" cy="30" r="16" fill="#6CA24A" stroke="#2F4A1E" strokeWidth="3" />
                  <text x="150" y="34" textAnchor="middle" fill="#FFF7E6" fontFamily="var(--font-heading)" fontSize="11" fontWeight="bold">C9</text>
                </g>

                {/* Plan checklist preview */}
                <g transform="translate(50, 115)">
                  <rect x="0" y="0" width="14" height="14" rx="3" fill="#6CA24A" stroke="#2F4A1E" strokeWidth="2" />
                  <path d="M 3 7 L 6 10 L 11 3" stroke="#FFF7E6" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <line x1="22" y1="7" x2="140" y2="7" stroke="#2F4A1E" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="22" y1="16" x2="110" y2="16" stroke="#2F4A1E" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
