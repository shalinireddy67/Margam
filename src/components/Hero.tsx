"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Compass, Award, Flame } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";
import Companion from "@/components/ui/Companion";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  currentLang?: SupportedLanguage;
}

export default function Hero({ currentLang: propLang }: HeroProps) {
  const { lang } = useLanguage();
  const currentLang = propLang || lang || "en";
  const content = {
    en: {
      badge: "Adaptive Math • Classes 6 to 10",
      headline: "Find what you need to learn next.",
      subhead:
        "Stuck on Class 9 math? The missing piece is often an easy rule from Class 7. We find the exact gap and help you fix it with short, simple steps.",
      chip1: "NCERT Aligned",
      chip2: "English • हिन्दी • తెలుగు",
      chip3: "100% Free & Private",
      ctaMain: "Try 3 questions",
      ctaSecondary: "See how it works",
      maruGreeting: "Hi! I am Maru. I will help you fix maths topics step by step.",
      sampleCardLabel: "Sample student",
      sampleName: "Aditi Sharma",
      sampleGrade: "Class 9B • Roll #14",
      progressLabel: "Weekly Goal",
      progressValue: "2 of 3 Gaps Fixed",
      streakLabel: "4-Day Streak",
      xpLabel: "240 Math XP",
      node1: "Class 7: Integers",
      node2: "Class 8: Transposition",
      node3: "Class 9: Factoring",
      statusSolved: "Fixed ✓",
      statusTarget: "Target Gap",
      recentAchievement: "Sign rules (-3 × +2 = -6) learned today!",
    },
    hi: {
      badge: "अनुकूली गणित • कक्षा 6 से 10",
      headline: "जानें आगे क्या सीखना है।",
      subhead:
        "कक्षा 9 के गणित में अटक रहे हैं? असली कमी अक्सर कक्षा 7 के किसी बुनियादी नियम में होती है। हम सटीक कमी खोजकर उसे सरल तरीके से सुधारते हैं।",
      chip1: "एनसीईआरटी संरेखित",
      chip2: "अंग्रेजी • हिन्दी • तेलुगु",
      chip3: "पूर्णतः निःशुल्क व सुरक्षित",
      ctaMain: "3 प्रश्न हल करें",
      ctaSecondary: "देखें यह कैसे काम करता है",
      maruGreeting: "नमस्ते! मैं मारू हूँ। मैं आपको गणित के छूटे पाठ सिखाऊँगा।",
      sampleCardLabel: "नमूना छात्र प्रोफ़ाइल",
      sampleName: "अदिति शर्मा",
      sampleGrade: "कक्षा 9B • रोल #14",
      progressLabel: "साप्ताहिक लक्ष्य",
      progressValue: "3 में से 2 कमियाँ दूर",
      streakLabel: "4-दिन की निरंतरता",
      xpLabel: "240 गणित XP",
      node1: "कक्षा 7: पूर्णांक",
      node2: "कक्षा 8: पक्षांतरण",
      node3: "कक्षा 9: गुणनखंडन",
      statusSolved: "सुधार पूर्ण ✓",
      statusTarget: "मुख्य अंतर",
      recentAchievement: "चिह्न नियम (-3 × +2 = -6) सीख लिया!",
    },
    te: {
      badge: "అనుకూల గణితం • 6 నుండి 10 తరగతులు",
      headline: "తదుపరి ఏమి నేర్చుకోవాలో కనుగొనండి.",
      subhead:
        "9వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అసలు లోపం 7వ తరగతి సూత్రాలలో ఉండవచ్చు. మేము ఆ లోపాన్ని సులభమైన దశల్లో సరిచేస్తాము.",
      chip1: "NCERT ప్రమాణాలు",
      chip2: "ఇంగ్లీష్ • हिन्दी • తెలుగు",
      chip3: "పూర్తిగా ఉచితం & సురక్షితం",
      ctaMain: "3 ప్రశ్నలు సాధించండి",
      ctaSecondary: "ఇది ఎలా పనిచేస్తుందో చూడండి",
      maruGreeting: "నమస్కారం! నేను మారు. లెక్కల్లో మీకు సహాయం చేస్తాను.",
      sampleCardLabel: "నమూనా విద్యార్థి ప్రొఫైల్",
      sampleName: "అదితి శర్మ",
      sampleGrade: "9వ తరగతి B • రోల్ #14",
      progressLabel: "వారపు లక్ష్యం",
      progressValue: "3 లో 2 లోపాలు పూర్తయ్యాయి",
      streakLabel: "4 రోజుల సాధన",
      xpLabel: "240 మ్యాథ్స్ XP",
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
      {/* Asymmetric Block-World Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* Left Column (7 cols): Main Editorial Plank Panel */}
        <div
          data-panel="hero-main"
          className="lg:col-span-7 bg-[#D9B87A]/90 text-[#1E1610] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-xs p-6 sm:p-10 flex flex-col justify-between"
        >
          <div className="space-y-5">
            {/* HUD Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#6DB33F] text-[#1E1610] border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-extrabold text-xs">
              <Compass className="w-4 h-4 text-[#1E1610]" />
              <span>{content.badge}</span>
            </div>

            {/* Main Headline (Baloo 2 800) */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#1E1610] tracking-wide leading-tight">
              {content.headline}
            </h1>

            {/* Short Simple Subhead (Nunito 17px) */}
            <p className="text-[#5A3720] text-base sm:text-lg leading-relaxed max-w-xl font-sans font-semibold">
              {content.subhead}
            </p>

            {/* 3 Quick Chips: plankLight fill with 2px ink border */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 bg-[#E8CF9C] border-[2px] border-[#1E1610] font-heading font-extrabold text-xs text-[#1E1610]">
                {content.chip1}
              </span>
              <span className="px-3 py-1.5 bg-[#E8CF9C] border-[2px] border-[#1E1610] font-heading font-extrabold text-xs text-[#1E1610]">
                {content.chip2}
              </span>
              <span className="px-3 py-1.5 bg-[#E8CF9C] border-[2px] border-[#1E1610] font-heading font-extrabold text-xs text-[#1E1610]">
                {content.chip3}
              </span>
            </div>
          </div>

          {/* Primary Action Button (Grass with ink text, 3px ink border, hard shadow) */}
          <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-4">
            <a
              href="/student"
              className="inline-flex items-center justify-center min-h-[52px] px-8 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-extrabold text-sm border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] transition-all cursor-pointer no-underline"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#1E1610]" />
            </a>

            <a
              href="#try-diagnostic"
              className="inline-flex items-center justify-center min-h-[52px] px-6 bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] border-[3px] border-[#1E1610] font-heading font-extrabold text-sm shadow-[3px_3px_0px_#1E1610] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] transition-all cursor-pointer no-underline"
            >
              <span>{content.ctaMain}</span>
            </a>
          </div>
        </div>

        {/* Right Column (5 cols): Asymmetric Maru World Stage + Progress Card */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Maru Standing on Ground Pedestal in the World Scene */}
          <div
            data-panel="hero-companion-stage"
            className="relative bg-[#232634]/90 text-[#F3E3BC] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-xs p-5 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Speech Bubble from Maru */}
            <div className="relative mb-3 max-w-xs bg-[#F3E3BC] text-[#1E1610] border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] p-2.5 rounded-xs text-xs font-sans font-bold leading-snug text-center">
              <span>{content.maruGreeting}</span>
              {/* Bubble pointer triangle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#F3E3BC]" />
            </div>

            {/* Maru Mascot Standing On Ground Pedestal */}
            <div className="relative flex flex-col items-center">
              <Companion
                pose="greet"
                size={110}
                alt="Maru standing on the ground"
              />

              {/* Stepped Ground Block beneath Maru's Feet */}
              <div className="w-36 flex flex-col items-center border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] -mt-1">
                <div className="w-full h-3 bg-[#8CCB55] border-b border-[#5DAA3A]" />
                <div className="w-full h-5 bg-[#8B5A2B]" />
              </div>
            </div>
          </div>

          {/* Student Progress Peek Card (Semi-Opaque Stone Panel) */}
          <div
            data-panel="hero-progress"
            className="bg-[#B9BCC0]/90 text-[#1E1610] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-xs p-5 flex flex-col justify-between"
          >
            {/* Top Row: Name and Demo Tag */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1610]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#E8CF9C] border-[2px] border-[#1E1610] flex items-center justify-center text-[#1E1610] font-heading font-extrabold text-sm">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-extrabold text-sm text-[#1E1610] m-0">
                      {content.sampleName}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#17B862]" />
                  </div>
                  <p className="text-[11px] text-[#5A3720] font-sans m-0">
                    {content.sampleGrade}
                  </p>
                </div>
              </div>

              {/* Streak Pill */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8CF9C] text-[#D1362B] border border-[#1E1610] font-heading font-extrabold text-[11px]">
                <Flame className="w-3 h-3 text-[#D1362B]" />
                <span>{content.streakLabel}</span>
              </span>
            </div>

            {/* Prerequisite Node Path preview */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1E1610]">{content.node1}</span>
                <span className="px-2 py-0.5 bg-[#6DB33F] text-[#1E1610] border border-[#1E1610] font-heading font-extrabold text-[10px]">
                  {content.statusSolved}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#1E1610]">{content.node2}</span>
                <span className="px-2 py-0.5 bg-[#F2C230] text-[#1E1610] border border-[#1E1610] font-heading font-extrabold text-[10px]">
                  {content.statusTarget}
                </span>
              </div>
            </div>

            {/* Achievement Footer */}
            <div className="mt-3 p-2 bg-[#E8CF9C] text-[#1E1610] border-[2px] border-[#1E1610] flex items-center gap-2 text-xs font-sans font-bold">
              <Award className="w-4 h-4 text-[#1E1610] shrink-0" />
              <span className="truncate">{content.recentAchievement}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
