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
      badge: "Adaptive Math • Classes 6 to 10",
      headline: "Find what you need to learn next.",
      subhead:
        "Stuck on Class 9 math? The missing piece is often an easy rule from Class 7. We find the exact gap and help you fix it with short, simple steps.",
      chip1: "NCERT Aligned",
      chip2: "English • हिन्दी • తెలుగు",
      chip3: "100% Free & Private",
      ctaMain: "Try 3 questions",
      ctaSecondary: "See how it works",
      sampleCardLabel: "Sample student",
      sampleName: "Aditi Sharma",
      sampleGrade: "Class 9B • Roll #14",
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
      badge: "अनुकूली गणित • कक्षा 6 से 10",
      headline: "जानें आगे क्या सीखना है।",
      subhead:
        "कक्षा 9 के गणित में अटक रहे हैं? असली कमी अक्सर कक्षा 7 के किसी बुनियादी नियम में होती है। हम सटीक कमी खोजकर उसे सरल तरीके से सुधारते हैं।",
      chip1: "एनसीईआरटी संरेखित",
      chip2: "अंग्रेजी • हिन्दी • तेलुगु",
      chip3: "पूर्णतः निःशुल्क व सुरक्षित",
      ctaMain: "3 प्रश्न हल करें",
      ctaSecondary: "देखें यह कैसे काम करता है",
      sampleCardLabel: "नमूना छात्र प्रोफ़ाइल",
      sampleName: "अदिति शर्मा",
      sampleGrade: "कक्षा 9B • रोल #14",
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
      badge: "అనుకూల గణితం • 6 నుండి 10 తరగతులు",
      headline: "తదుపరి ఏమి నేర్చుకోవాలో కనుగొనండి.",
      subhead:
        "9వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అసలు లోపం 7వ తరగతి సూత్రాలలో ఉండవచ్చు. మేము ఆ లోపాన్ని సులభమైన దశల్లో సరిచేస్తాము.",
      chip1: "NCERT ప్రమాణాలు",
      chip2: "ఇంగ్లీష్ • हिन्दी • తెలుగు",
      chip3: "పూర్తిగా ఉచితం & సురక్షితం",
      ctaMain: "3 ప్రశ్నలు సాధించండి",
      ctaSecondary: "ఇది ఎలా పనిచేస్తుందో చూడండి",
      sampleCardLabel: "నమూనా విద్యార్థి ప్రొఫైల్",
      sampleName: "అదితి శర్మ",
      sampleGrade: "9వ తరగతి B • రోల్ #14",
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
        <div className="lg:col-span-7 bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-[#E0E5D4] shadow-card flex flex-col justify-between">
          <div className="space-y-5">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-light text-sage border border-sage-border text-xs sm:text-sm font-heading font-bold">
              <Compass className="w-4 h-4" />
              <span>{content.badge}</span>
            </div>

            {/* Main Headline (Ages 11-16) */}
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              {content.headline}
            </h1>

            {/* Short Simple Subhead */}
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {content.subhead}
            </p>

            {/* 3 Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-background border border-[#E0E5D4] text-xs font-heading font-bold text-foreground">
                {content.chip1}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-background border border-[#E0E5D4] text-xs font-heading font-bold text-foreground">
                {content.chip2}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-background border border-[#E0E5D4] text-xs font-heading font-bold text-foreground">
                {content.chip3}
              </span>
            </div>
          </div>

          {/* Primary Action Button (Min 48px, High Contrast WCAG AA) */}
          <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-4">
            <a
              href="#try-diagnostic"
              className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-2xl bg-coral hover:bg-coral-hover text-white text-base font-heading font-bold transition-all shadow-floating cursor-pointer"
            >
              <span>{content.ctaMain}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-2xl bg-background hover:bg-white text-foreground border border-[#E0E5D4] text-sm font-heading font-bold transition-all cursor-pointer"
            >
              {content.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Right Card: Sample Student Progress Dashboard (Inspired by Dribbble Reference) */}
        <div className="lg:col-span-5 bg-[#F9F7E8] rounded-3xl sm:rounded-4xl p-6 sm:p-8 border border-[#E0E5D4] shadow-card flex flex-col justify-between relative overflow-hidden">
          {/* Top Label clearly declaring "Sample student" as instructed */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E0E5D4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {content.sampleCardLabel}
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-[#E0E5D4] text-sage">
              Live Demo
            </span>
          </div>

          {/* Student Profile Row */}
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-coral-light border border-coral-border flex items-center justify-center text-coral font-bold text-lg font-heading">
                AS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {content.sampleName}
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-sage" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {content.sampleGrade}
                </p>
              </div>
            </div>

            {/* Streak & XP Pills */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-coral border border-coral-border text-xs font-heading font-bold shadow-xs">
                <Flame className="w-3.5 h-3.5 text-coral" />
                <span>{content.streakLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-lemon border border-lemon-border text-xs font-heading font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-lemon" />
                <span>{content.xpLabel}</span>
              </span>
            </div>
          </div>

          {/* Visual Progress Ring & Indicator */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E5D4] space-y-3">
            <div className="flex items-center justify-between text-xs font-heading font-bold">
              <span className="text-muted-foreground">{content.progressLabel}</span>
              <span className="text-sage">{content.progressValue}</span>
            </div>

            {/* Simple Visual Progress Bar */}
            <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-[#E0E5D4]">
              <div className="h-full bg-sage rounded-full w-2/3 transition-all duration-500" />
            </div>

            {/* Clean Prerequisite Nodes Preview */}
            <div className="pt-2 border-t border-[#E0E5D4] space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">{content.node1}</span>
                <span className="px-2 py-0.5 rounded-full bg-sage-light text-sage font-bold text-[11px]">
                  {content.statusSolved}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground font-bold">{content.node2}</span>
                <span className="px-2 py-0.5 rounded-full bg-coral-light text-coral font-bold text-[11px] border border-coral-border">
                  {content.statusTarget}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">{content.node3}</span>
                <span className="text-[11px] text-muted-foreground font-mono">Next Step</span>
              </div>
            </div>
          </div>

          {/* Bottom Achievement Chip */}
          <div className="mt-4 p-3 rounded-2xl bg-white border border-[#E0E5D4] flex items-center gap-2.5 text-xs text-foreground font-heading font-bold">
            <Sparkles className="w-4 h-4 text-coral shrink-0" />
            <span className="truncate">{content.recentAchievement}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
