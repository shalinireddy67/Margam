"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, Compass, Award, Flame } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface HeroProps {
  currentLang: SupportedLanguage;
}

export default function Hero({ currentLang }: HeroProps) {
  const content = {
    en: {
      badge: "Maths for Classes 6-10",
      headline: "Find what you need to learn next.",
      subhead:
        "Stuck on Class 9 math? The missing piece is often an easy rule from Class 7. We find the exact gap and help you fix it with short, simple steps.",
      chip1: "NCERT Aligned",
      chip2: "English, हिन्दी, తెలుగు",
      chip3: "100% Free & Private",
      ctaMain: "Try 3 questions",
      ctaSecondary: "See how it works",
      sampleCardLabel: "Sample student",
      sampleName: "Aditi Sharma",
      sampleGrade: "Class 9B, roll 14",
      progressLabel: "Weekly Goal",
      progressValue: "2 of 3 Gaps Fixed",
      streakLabel: "4-Day Streak",
      xpLabel: "240 Math XP",
      pathTitle: "Prerequisite Path",
      node1: "Class 7: Integers",
      node2: "Class 8: Transposition",
      node3: "Class 9: Factoring",
      statusSolved: "Fixed ✓",
      statusTarget: "Target Gap",
      recentAchievement: "Sign rules (-3 × +2 = -6) mastered today!",
    },
    hi: {
      badge: "गणित, कक्षा 6 से 10",
      headline: "जानें आगे क्या सीखना है।",
      subhead:
        "कक्षा 9 के गणित में अटक रहे हैं? असली कमी अक्सर कक्षा 7 के किसी बुनियादी नियम में होती है। हम सटीक कमी खोजकर उसे सरल तरीके से सुधारते हैं।",
      chip1: "एनसीईआरटी संरेखित",
      chip2: "अंग्रेजी, हिन्दी, तेलुगु",
      chip3: "पूर्णतः निःशुल्क व सुरक्षित",
      ctaMain: "3 प्रश्न हल करें",
      ctaSecondary: "देखें यह कैसे काम करता है",
      sampleCardLabel: "नमूना छात्र प्रोफ़ाइल",
      sampleName: "अदिति शर्मा",
      sampleGrade: "कक्षा 9B, रोल 14",
      progressLabel: "साप्ताहिक लक्ष्य",
      progressValue: "3 में से 2 कमियाँ दूर",
      streakLabel: "4-दिन की निरंतरता",
      xpLabel: "240 गणित XP",
      pathTitle: "पूर्वापेक्षा पथ",
      node1: "कक्षा 7: पूर्णांक",
      node2: "कक्षा 8: पक्षांतरण",
      node3: "कक्षा 9: गुणनखंडन",
      statusSolved: "सुधार पूर्ण ✓",
      statusTarget: "मुख्य अंतर",
      recentAchievement: "चिह्न नियम (-3 × +2 = -6) में महारत हासिल की!",
    },
    te: {
      badge: "గణితం, 6 నుండి 10 తరగతులు",
      headline: "తదుపరి ఏమి నేర్చుకోవాలో కనుగొనండి.",
      subhead:
        "9వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అసలు లోపం 7వ తరగతి సూత్రాలలో ఉండవచ్చు. మేము ఆ లోపాన్ని సులభమైన దశల్లో సరిచేస్తాము.",
      chip1: "NCERT ప్రమాణాలు",
      chip2: "ఇంగ్లీష్, हिन्दी, తెలుగు",
      chip3: "పూర్తిగా ఉచితం & సురక్షితం",
      ctaMain: "3 ప్రశ్నలు సాధించండి",
      ctaSecondary: "ఇది ఎలా పనిచేస్తుందో చూడండి",
      sampleCardLabel: "నమూనా విద్యార్థి ప్రొఫైల్",
      sampleName: "అదితి శర్మ",
      sampleGrade: "9వ తరగతి B, రోల్ 14",
      progressLabel: "వారపు లక్ష్యం",
      progressValue: "3 లో 2 లోపాలు పూర్తయ్యాయి",
      streakLabel: "4 రోజుల సాధన",
      xpLabel: "240 మ్యాథ్స్ XP",
      pathTitle: "కాన్సెప్ట్ లింకులు",
      node1: "7వ తరగతి: పూర్ణ సంఖ్యలు",
      node2: "8వ తరగతి: స్థానాంతరణ",
      node3: "9వ తరగతి: కారణాంకాలు",
      statusSolved: "పూర్తయింది ✓",
      statusTarget: "ప్రధాన లోపం",
      recentAchievement: "సంకేత నియమాలు (-3 × +2 = -6) నేర్చుకున్నారు!",
    },
  }[currentLang];

  return (
    <section id="home" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Editorial Card: Clear Main Idea */}
        <div className="lg:col-span-7 bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
              <Compass className="w-4 h-4" />
              <span>{content.badge}</span>
            </div>

            {/* Main Headline (Ages 11-16) */}
            <h1 className="font-pixel text-2xl sm:text-4xl text-[#2B1B0F] tracking-wide leading-tight">
              {content.headline}
            </h1>

            {/* Short Simple Subhead */}
            <p className="text-[#5A3720] text-base sm:text-lg leading-relaxed max-w-xl font-sans font-semibold">
              {content.subhead}
            </p>

            {/* 3 Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 bg-white border-[2px] border-[#422816] font-pixel text-xs text-[#2B1B0F]">
                {content.chip1}
              </span>
              <span className="px-3 py-1.5 bg-white border-[2px] border-[#422816] font-pixel text-xs text-[#2B1B0F]">
                {content.chip2}
              </span>
              <span className="px-3 py-1.5 bg-white border-[2px] border-[#422816] font-pixel text-xs text-[#2B1B0F]">
                {content.chip3}
              </span>
            </div>
          </div>

          {/* Primary Action Button (Min 48px, High Contrast WCAG AA) */}
          <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-4">
            <a
              href="/student"
              className="inline-flex items-center justify-center min-h-[52px] px-8 bg-[#5DAA3A] hover:bg-[#4E9330] text-white font-pixel text-xs border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer no-underline"
            >
              <span>Start learning</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>

            <a
              href="#try-diagnostic"
              className="inline-flex items-center justify-center min-h-[52px] px-6 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] border-[2px] border-[#422816] font-pixel text-xs shadow-[2px_2px_0px_#1B120C] transition-all cursor-pointer no-underline"
            >
              <span>{content.ctaMain}</span>
            </a>
          </div>
        </div>

        {/* Right Card: Sample Student Progress Dashboard */}
        <div className="lg:col-span-5 bg-[#5A3720] text-[#FFF7E6] border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Top Label */}
          <div className="flex items-center justify-between pb-4 border-b border-[#7A4B2A]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#E04A3F] border border-[#422816]" />
              <span className="font-pixel text-xs uppercase tracking-wider text-[#FFE9A8]">
                {content.sampleCardLabel}
              </span>
            </div>
            <span className="font-pixel text-xs bg-[#5DAA3A] text-white px-2.5 py-1 border border-[#422816]">
              Live Demo
            </span>
          </div>

          {/* Student Profile Row */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-[#FFF7E6] border-[2px] border-[#422816] flex items-center justify-center text-[#2B1B0F] font-pixel text-base">
                AS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-pixel text-base text-[#FFF7E6]">
                    {content.sampleName}
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-[#5DAA3A]" />
                </div>
                <p className="text-xs text-[#E5D7BE] font-sans">
                  {content.sampleGrade}
                </p>
              </div>
            </div>

            {/* Streak & XP Pills */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF7E6] text-[#E04A3F] border border-[#422816] font-pixel text-xs shadow-xs">
                <Flame className="w-3.5 h-3.5 text-[#E04A3F]" />
                <span>{content.streakLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816] font-pixel text-xs shadow-xs">
                <Award className="w-3.5 h-3.5 text-[#2B1B0F]" />
                <span>{content.xpLabel}</span>
              </span>
            </div>
          </div>

          {/* Visual Progress Ring & Indicator */}
          <div className="bg-[#FFF7E6] text-[#2B1B0F] border-[2px] border-[#422816] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-pixel">
              <span className="text-[#5A3720]">{content.progressLabel}</span>
              <span className="text-[#5DAA3A]">{content.progressValue}</span>
            </div>

            {/* Simple Visual Progress Bar */}
            <div className="w-full h-3 bg-white border border-[#422816] overflow-hidden p-0.5">
              <div className="h-full bg-[#5DAA3A] w-2/3 transition-all duration-500" />
            </div>

            {/* Clean Prerequisite Nodes Preview */}
            <div className="pt-2 border-t border-[#422816]/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#2B1B0F] font-semibold">{content.node1}</span>
                <span className="px-2 py-0.5 bg-[#5DAA3A] text-white font-pixel text-[10px]">
                  {content.statusSolved}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#2B1B0F] font-bold">{content.node2}</span>
                <span className="px-2 py-0.5 bg-[#FFE9A8] text-[#2B1B0F] font-pixel text-[10px] border border-[#422816]">
                  {content.statusTarget}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#5A3720]">{content.node3}</span>
                <span className="text-[10px] font-pixel text-[#7A4B2A]">Next Step</span>
              </div>
            </div>
          </div>

          {/* Bottom Achievement Chip */}
          <div className="mt-4 p-3 bg-[#FFE9A8] text-[#2B1B0F] border-[2px] border-[#422816] flex items-center gap-2.5 text-xs font-pixel">
            <Sparkles className="w-4 h-4 text-[#5DAA3A] shrink-0" />
            <span className="truncate">{content.recentAchievement}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
