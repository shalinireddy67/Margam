"use client";

import React from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface HeroProps {
  currentLang: SupportedLanguage;
}

export default function Hero({ currentLang }: HeroProps) {
  const content = {
    en: {
      headlinePart1: "WHAT EACH",
      headlineItalic1: "student",
      headlinePart2: "NEEDS TO",
      headlineItalic2: "learn",
      headlinePart3: "NEXT",
      subTitle: "MARGAM AI AGENT • ADAPTIVE DIAGNOSTIC FOR CLASSES 6 TO 10",
      cardHeading: "Find the exact concept blocking your student.",
      assesses: "Foundational Math across Classes 6 to 10 (integers, fractions, transposition, polynomials)",
      time: "6 to 8 minutes per child",
      output: "Root gap report & 5-day classroom plan",
      ctaStart: "Start assessment",
      ctaSeeHow: "See how it works",
      noLogin: "No login required for initial classroom trial",
      whatInside: "WHAT IS INSIDE",
      item1: "The 38% Polynomial Fallacy",
      item2: "How the AI Agent Traces Gaps",
      item3: "Live Student Gap Report Sample",
      item4: "Printable 1-Page A4 Worksheets",
    },
    hi: {
      headlinePart1: "प्रत्येक",
      headlineItalic1: "विद्यार्थी",
      headlinePart2: "को आगे क्या",
      headlineItalic2: "सीखना",
      headlinePart3: "है",
      subTitle: "मार्गम् AI एजेंट • कक्षा 6 से 10 के लिए अनुकूली डायग्नोस्टिक",
      cardHeading: "छात्र की प्रगति रोकने वाले सटीक संप्रत्यय को खोजें।",
      assesses: "कक्षा 6 से 10 का आधारभूत गणित (पूर्णांक, भिन्न, पक्षांतरण, बहुपद)",
      time: "6 से 8 मिनट प्रति विद्यार्थी",
      output: "मूल अंतर रिपोर्ट और 5-दिवसीय कक्षा योजना",
      ctaStart: "डायग्नोस्टिक शुरू करें",
      ctaSeeHow: "देखें यह कैसे काम करता है",
      noLogin: "आरंभिक कक्षा परीक्षण के लिए लॉगिन की आवश्यकता नहीं",
      whatInside: "अंदर क्या है",
      item1: "38% बहुपद टेस्ट का भ्रम",
      item2: "AI एजेंट कैसे कमियाँ खोजता है",
      item3: "छात्र गैप रिपोर्ट का लाइव नमूना",
      item4: "प्रिंट-योग्य 1-पेज A4 वर्कशीट",
    },
    te: {
      headlinePart1: "ప్రతి",
      headlineItalic1: "విద్యార్థి",
      headlinePart2: "తదుపరి ఏమి",
      headlineItalic2: "నేర్చుకోవాలో",
      headlinePart3: "కనుగొనండి",
      subTitle: "మార్గం AI ఏజెంట్ • 6 నుండి 10 తరగతుల అనుకూల డయాగ్నోస్టిక్",
      cardHeading: "విద్యార్థిని అడ్డుకుంటున్న అసలు కాన్సెప్ట్‌ను గుర్తించండి.",
      assesses: "6 నుండి 10 తరగతుల పునాది గణితం (పూర్ణ సంఖ్యలు, భిన్నాలు, సమీకరణాలు, బహుపదులు)",
      time: "ఒక విద్యార్థికి 6 నుండి 8 నిమిషాలు",
      output: "రూట్ గ్యాప్ నివేదిక & 5 రోజుల బోధనా ప్రణాళిక",
      ctaStart: "డయాగ్నోస్టిక్ ప్రారంభించండి",
      ctaSeeHow: "ఇది ఎలా పనిచేస్తుందో చూడండి",
      noLogin: "ప్రాథమిక పరీక్షకు లాగిన్ అవసరం లేదు",
      whatInside: "లోపల ఏముంది",
      item1: "38% బహుపది మార్కుల మోసం",
      item2: "AI ఏజెంట్ లోపాలను ఎలా గుర్తిస్తుంది",
      item3: "విద్యార్థి గ్యాప్ రిపోర్ట్ నమూనా",
      item4: "ప్రింట్ చేయదగిన 1-పేజీ A4 వర్క్‌షీట్",
    },
  }[currentLang];

  return (
    <section id="cover" className="relative border-b border-[#C7DDAE]/60 dark:border-[#3B5428] overflow-hidden bg-background botanical-dots">
      {/* Cover Story Top Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-sans tracking-wide text-foreground/70">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-accent rounded-full inline-block animate-pulse" />
          <span className="font-bold text-foreground">01 / THE COVER STORY</span>
          <span className="opacity-40">•</span>
          <span className="text-primary font-bold">MATHEMATICS (CLASSES 6–10)</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-xs bg-[#C7DDAE]/40 px-3 py-1 rounded-full text-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
            <rect x="4" y="9" width="16" height="11" rx="2.5" fill="#6CA24A" />
            <rect x="3" y="6" width="18" height="4" rx="2" fill="#6CA24A" />
            <rect x="10.5" y="6" width="3" height="14" fill="#F4C542" />
          </svg>
          <span>Gently unwrapping prerequisite learning gaps in 6 minutes</span>
        </div>
      </div>

      {/* Main Cover Canvas */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-between overflow-hidden pt-4 pb-8 md:py-0 md:min-h-[720px] lg:min-h-[780px]">
        {/* Giant Headline in Background/Middle */}
        <div className="relative md:absolute md:inset-0 md:z-10 flex flex-col justify-center items-center pointer-events-none select-none px-2 sm:px-6 mb-4 md:mb-0">
          <div className="w-full text-center">
            <h1 className="font-heading uppercase tracking-tight text-foreground leading-[0.92] md:leading-[0.88] text-[clamp(2.1rem,7.5vw,9.5rem)] m-0">
              <span className="block break-words sm:whitespace-nowrap">
                <span>
                  {content.headlinePart1} <span className="italic font-normal font-serif text-primary">{content.headlineItalic1}</span>
                </span>
              </span>
              <span className="block break-words sm:whitespace-nowrap">
                <span>
                  {content.headlinePart2} <span className="italic font-normal font-serif text-accent">{content.headlineItalic2}</span> {content.headlinePart3}
                </span>
              </span>
            </h1>

            <div className="mt-2.5 sm:mt-3 text-[12px] sm:text-sm font-sans font-bold tracking-widest uppercase text-muted-foreground flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
                <path d="M 12 2 C 12 8 8 12 2 12 C 8 12 12 16 12 22 C 12 16 16 12 22 12 C 16 12 12 8 12 2 Z" fill="#F4C542" />
              </svg>
              <span>{content.subTitle}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
                <path d="M 12 2 C 12 8 8 12 2 12 C 8 12 12 16 12 22 C 12 16 16 12 22 12 C 16 12 12 8 12 2 Z" fill="#F4C542" />
              </svg>
            </div>
          </div>
        </div>

        {/* Floating Geometric / Mathematical Decorative Elements (Replacing Owl with Clean Math DAG Illustration) */}
        <div className="relative md:absolute md:inset-x-0 md:bottom-2 z-20 flex justify-center pointer-events-auto my-4 md:my-0">
          <div className="relative w-[240px] sm:w-[320px] md:w-[420px] flex items-end justify-center pb-2">
            <div className="relative inline-block select-none w-full max-w-[400px] drop-shadow-md">
              {/* Mathematical DAG & Coordinate Compass Diagram (No cartoon mascot) */}
              <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
                <ellipse cx="210" cy="265" rx="150" ry="14" fill="#2F4A1E" fillOpacity="0.08" />

                {/* Mathematical Slate Tablet Base */}
                <rect x="50" y="30" width="320" height="230" rx="24" fill="#FFFDF8" stroke="#2F4A1E" strokeWidth="4.5" />
                <rect x="65" y="45" width="290" height="200" rx="16" fill="#F5EEDB" stroke="#2F4A1E" strokeWidth="2.5" />

                {/* Coordinate Grid Lines */}
                <line x1="80" y1="145" x2="340" y2="145" stroke="#C7DDAE" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="210" y1="60" x2="210" y2="230" stroke="#C7DDAE" strokeWidth="2" strokeDasharray="4 4" />

                {/* DAG Node 1: Class 7 Integers */}
                <circle cx="120" cy="180" r="24" fill="#6CA24A" stroke="#2F4A1E" strokeWidth="3.5" />
                <text x="120" y="185" textAnchor="middle" fill="#FFF7E6" fontFamily="var(--font-heading)" fontSize="13" fontWeight="bold">C7</text>
                <text x="120" y="215" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-sans)" fontSize="10" fontWeight="bold">Integers</text>

                {/* Prerequisite Arrow: C7 -> C8 */}
                <path d="M 144 165 L 186 135" stroke="#F28C38" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="188,133 178,133 182,143" fill="#F28C38" />

                {/* DAG Node 2: Class 8 Linear Equations */}
                <circle cx="210" cy="120" r="26" fill="#F4C542" stroke="#2F4A1E" strokeWidth="3.5" />
                <text x="210" y="125" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-heading)" fontSize="13" fontWeight="bold">C8</text>
                <text x="210" y="86" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-sans)" fontSize="10" fontWeight="bold">Linear Eqns</text>

                {/* Prerequisite Arrow: C8 -> C9 */}
                <path d="M 234 135 L 276 165" stroke="#6CA24A" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="278,167 274,157 268,167" fill="#6CA24A" />

                {/* DAG Node 3: Class 9 Polynomials */}
                <circle cx="300" cy="180" r="24" fill="#C7DDAE" stroke="#2F4A1E" strokeWidth="3.5" />
                <text x="300" y="185" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-heading)" fontSize="13" fontWeight="bold">C9</text>
                <text x="300" y="215" textAnchor="middle" fill="#2F4A1E" fontFamily="var(--font-sans)" fontSize="10" fontWeight="bold">Polynomials</text>

                {/* Mathematical Compass Needle in Center */}
                <circle cx="210" cy="120" r="4" fill="#F28C38" />
                <path d="M 210 102 L 214 120 L 206 120 Z" fill="#F28C38" />
                <path d="M 210 138 L 214 120 L 206 120 Z" fill="#2F4A1E" />
              </svg>
            </div>
          </div>
        </div>

        {/* Foreground Briefing Cards (Left & Right) */}
        <div className="relative z-30 pt-2 sm:pt-6 pb-4 sm:pb-6 flex-1 flex flex-col justify-between pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pointer-events-auto">
            {/* Left Card: AI Diagnostic Agent Briefing */}
            <div className="md:col-span-5 bg-[#FFF7E6]/95 dark:bg-[#1C2817]/95 p-5 sm:p-7 border-2 border-[#C7DDAE] dark:border-[#3B5428] backdrop-blur-md max-w-md mx-auto md:mx-0 rounded-[28px] shadow-card relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold mb-1.5">
                <span className="inline-flex items-center gap-1">
                  <span style={{ width: 6, height: 6, backgroundColor: "#F28C38", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ width: 6, height: 6, backgroundColor: "#F28C38", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ width: 6, height: 6, backgroundColor: "#F28C38", borderRadius: "50%", display: "inline-block" }} />
                </span>
                <span>AI DIAGNOSTIC AGENT</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2 leading-snug">
                {content.cardHeading}
              </h2>

              <div className="space-y-1.5 mb-4 sm:mb-5 text-sm font-sans text-foreground/85 border-t border-b border-[#C7DDAE]/60 dark:border-[#3B5428] py-2.5 sm:py-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary w-20 shrink-0 text-xs uppercase">Assesses:</span>
                  <span className="text-xs sm:text-sm">{content.assesses}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary w-20 shrink-0 text-xs uppercase">Time:</span>
                  <span className="flex items-center gap-1 text-xs sm:text-sm">{content.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary w-20 shrink-0 text-xs uppercase">Output:</span>
                  <span className="text-xs sm:text-sm">{content.output}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#try-diagnostic"
                  className="w-full sm:w-auto rounded-full bg-accent text-accent-foreground px-7 py-3.5 min-h-[50px] inline-flex items-center justify-center gap-2 text-base font-sans font-bold hover:bg-accent/90 shadow-warm active:translate-y-[1px] transition-all cursor-pointer"
                >
                  <span>{content.ctaStart}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <a
                  href="#problem"
                  className="rounded-full border border-[#C7DDAE] dark:border-[#3B5428] bg-[#C7DDAE]/20 text-foreground px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center text-xs font-sans font-semibold hover:bg-[#C7DDAE]/40 cursor-pointer transition-colors"
                >
                  {content.ctaSeeHow}
                </a>
              </div>

              <div className="mt-3 text-xs font-sans text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--status-good)] shrink-0" />
                <span>{content.noLogin}</span>
              </div>
            </div>

            {/* Right Card: What is Inside */}
            <div className="hidden md:block md:col-start-9 md:col-span-4 bg-[#FFF7E6]/90 dark:bg-[#1C2817]/90 p-5 border border-[#C7DDAE] dark:border-[#3B5428] backdrop-blur-md text-right rounded-[24px] shadow-warm">
              <div className="text-xs font-sans uppercase tracking-widest text-primary font-bold mb-2 flex items-center justify-end gap-1.5">
                <span>{content.whatInside}</span>
              </div>

              <ul className="text-xs font-sans space-y-2 text-foreground/80 text-left">
                <li className="flex items-center justify-between border-b border-[#C7DDAE]/40 pb-1">
                  <span>{content.item1}</span>
                  <span className="font-bold text-accent">p. 02</span>
                </li>
                <li className="flex items-center justify-between border-b border-[#C7DDAE]/40 pb-1">
                  <span>{content.item2}</span>
                  <span className="font-bold text-primary">p. 04</span>
                </li>
                <li className="flex items-center justify-between border-b border-[#C7DDAE]/40 pb-1">
                  <span>{content.item3}</span>
                  <span className="font-bold text-primary">p. 07</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>{content.item4}</span>
                  <span className="font-bold text-accent">p. 12</span>
                </li>
              </ul>

              <div className="mt-3 pt-2 border-t border-[#C7DDAE]/40 text-xs font-sans text-muted-foreground text-center">
                MADE FOR INDIAN CLASSROOMS • FREE & ADAPTIVE
              </div>
            </div>
          </div>

          {/* Bottom Card Labels */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-4 items-end mt-auto pt-6 pointer-events-auto">
            <div className="md:col-span-5 bg-[#FFF7E6]/95 dark:bg-[#1C2817]/95 p-4 border border-[#C7DDAE] dark:border-[#3B5428] rounded-[22px] shadow-warm">
              <div className="text-xs font-sans uppercase text-primary font-bold flex items-center gap-1.5">
                <span>FIGURE 1.0: PREREQUISITE COMPASS & DAG</span>
              </div>
              <p className="text-xs text-foreground/80 leading-snug mt-1">
                Mathematical coordinate tablet illustrating cross-grade prerequisite mapping from Class 7 Integer Signs to Class 9 Polynomial Factorization.
              </p>
            </div>

            <div className="hidden md:flex md:col-start-9 md:col-span-4 justify-end">
              <div className="bg-[#FFF7E6]/95 dark:bg-[#1C2817]/95 border border-[#C7DDAE] dark:border-[#3B5428] p-3 text-center rounded-[18px] shadow-warm">
                <div className="text-xs tracking-wider text-muted-foreground uppercase font-sans">
                  SEALED WITH CARE • 2026
                </div>
                <div className="text-xs font-mono tracking-widest font-bold text-primary mt-0.5">
                  • • • MARGAM • • •
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
