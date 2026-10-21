"use client";

import React, { useState } from "react";
import { Printer, Globe, Smartphone, ShieldCheck, Clock, FileText, Check } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface IndianClassroomsProps {
  currentLang: SupportedLanguage;
}

export default function IndianClassrooms({ currentLang }: IndianClassroomsProps) {
  const [printNotice, setPrintNotice] = useState(false);

  const t = {
    en: {
      sectionNum: "10 / BUILT FOR INDIAN CLASSROOM REALITIES",
      badge: "Built for Indian Realities",
      headline: "Engineered for Diverse Indian Classrooms",
      subhead:
        "From government schools with shared tablets to high-bandwidth classrooms, Margam is deliberately built to work within the constraints of real Indian education.",
      card1Title: "Vernacular Fluency (3 Languages)",
      card1Desc:
        "Every question, lesson variant, hint, and worksheet is completely available in English, हिन्दी (Hindi), and తెలుగు (Telugu) with clear audit flags for continuous educator review.",
      card2Title: "Familiar Indian Contexts",
      card2Desc:
        "Abstract math is made tangible using relatable everyday situations: Kirana store ledger balances, Hyderabad auto fares, Leh winter temperatures, and cricket match run-rate deficits.",
      card3Title: "Low-Data & Shared Devices",
      card3Desc:
        "Engineered with minimal payload and local device storage. Works seamlessly on budget Android smartphones and tablets shared among siblings or whole classrooms.",
      card4Title: "Single-Sheet Printable A4 Worksheets",
      card4Desc:
        "For students who lack personal digital access at home, teachers can print clean, 1-page A4 practice worksheets directly from the browser with zero formatting headaches.",
      printBtn: "Print Sample Worksheet (A4)",
      privacyTitle: "Child Privacy by Design (DPDP Act 2023)",
      privacyDesc:
        "Zero tracking cookies. Zero third-party surveillance or advertising scripts. Student performance data remains strictly localized and private.",
    },
    hi: {
      sectionNum: "10 / भारतीय कक्षाओं के अनुकूल",
      badge: "भारतीय वास्तविकताओं के अनुकूल",
      headline: "भारतीय कक्षाओं की विविधता के लिए डिज़ाइन किया गया",
      subhead:
        "साझा टैबलेट वाले सरकारी स्कूलों से लेकर उच्च गति इंटरनेट वाले निजी स्कूलों तक, मार्गम् भारतीय शिक्षा की वास्तविक परिस्थितियों में काम करने के लिए बनाया गया है।",
      card1Title: "मातृभाषा में शिक्षण (3 भाषाएँ)",
      card1Desc:
        "प्रत्येक प्रश्न, पाठ, संकेत और अभ्यास पत्र अंग्रेजी, हिन्दी और तेलुगु में पूर्णतः उपलब्ध है।",
      card2Title: "परिचित भारतीय संदर्भ",
      card2Desc:
        "किराना दुकान के खाते, ऑटो किराया, लेह का तापमान और क्रिकेट रन-रेट जैसे रोज़मर्रा के उदाहरणों से अमूर्त गणित को सरल बनाया गया है।",
      card3Title: "कम डेटा और साझा उपकरण",
      card3Desc:
        "कम इंटरनेट डेटा खपत और स्थानीय भंडारण। बजट एंड्रॉइड फोन और साझा टैबलेट पर भी निर्बाध काम करता है।",
      card4Title: "प्रिंट-योग्य एकल-पृष्ठ A4 वर्कशीट",
      card4Desc:
        "घर पर स्मार्टफोन न रखने वाले छात्रों के लिए शिक्षक सीधे 1-पेज की A4 वर्कशीट प्रिंट कर सकते हैं।",
      printBtn: "नमूना वर्कशीट प्रिंट करें (A4)",
      privacyTitle: "बाल गोपनीयता (DPDP अधिनियम 2023)",
      privacyDesc:
        "शून्य ट्रैकिंग कुकीज़। शून्य तृतीय-पक्ष विज्ञापन ट्रैकर। बच्चों की गोपनीयता पूरी तरह सुरक्षित है।",
    },
    te: {
      sectionNum: "10 / భారతీయ తరగతుల వాస్తవికతలకు అనుగుణంగా",
      badge: "భారతీయ పాఠశాలల వాస్తవికతలకు అనుగుణంగా",
      headline: "వైవిధ్యభరితమైన భారతీయ తరగతుల కోసం ప్రత్యేక రూపకల్పన",
      subhead:
        "పరిమిత పరికరాలు ఉన్న ప్రభుత్వ పాఠశాలల నుండి కంప్యూటర్ ల్యాబ్‌ల వరకు, మార్గం భారతీయ విద్యా వ్యవస్థ యొక్క వాస్తవ అవసరాలను తీర్చడానికి నిర్మించబడింది.",
      card1Title: "ప్రాంతీయ భాషా ప్రావీణ్యం (3 భాషలు)",
      card1Desc:
        "ప్రతి ప్రశ్న, వివరణ, క్లూ మరియు వర్క్‌షీట్ ఇంగ్లీష్, हिन्दी మరియు తెలుగులలో పూర్తిగా అందుబాటులో ఉన్నాయి.",
      card2Title: "మన నిత్యజీవిత ఉదాహరణలు",
      card2Desc:
        "కిరాణా షాపు అప్పులు, ఆటో ఛార్జీలు, కాశ్మీర్ శీతాకాల ఉష్ణోగ్రతలు, క్రికెట్ రన్ రేట్ వంటి వాస్తవ ఉదాహరణలతో సులభంగా అర్థమవుతుంది.",
      card3Title: "తక్కువ ఇంటర్నెట్ & పంచుకునే పరికరాలు",
      card3Desc:
        "తక్కువ డేటాతో వేగంగా లోడ్ అవుతుంది. సాధారణ ఆండ్రాయిడ్ ఫోన్లు మరియు పాఠశాల ట్యాబ్‌లలో కూడా సులభంగా పనిచేస్తుంది.",
      card4Title: "సింగిల్-పేజీ ప్రింటెడ్ A4 వర్క్‌షీట్‌లు",
      card4Desc:
        "ఇళ్ల వద్ద ఫోన్లు లేని విద్యార్థుల కోసం ఉపాధ్యాయులు సులభంగా 1-పేజీ A4 వర్క్‌షీట్‌లను ప్రింట్ చేయవచ్చు.",
      printBtn: "నమూనా వర్క్‌షీట్ ప్రింట్ చేయండి (A4)",
      privacyTitle: "విద్యార్థి గోప్యత (DPDP చట్టం 2023)",
      privacyDesc:
        "జీరో ట్రాకింగ్ కుకీలు. ఎలాంటి ప్రకటన ట్రాకర్లు ఉండవు. విద్యార్థుల వివరాలు సురక్షితంగా ఉంటాయి.",
    },
  }[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="indian-classrooms" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* 4 Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Pillar 1 */}
        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3DA] border border-[#FCD685] text-accent flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {t.card1Title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              {t.card1Desc}
            </p>
          </div>
          <div className="flex gap-1.5 text-[11px] font-bold text-foreground pt-3 border-t border-[#C7DDAE]/60 font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-background border border-[#C7DDAE]">English</span>
            <span className="px-2.5 py-0.5 rounded-full bg-background border border-[#C7DDAE]">हिन्दी</span>
            <span className="px-2.5 py-0.5 rounded-full bg-background border border-[#C7DDAE]">తెలుగు</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-primary flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {t.card2Title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              {t.card2Desc}
            </p>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground font-semibold pt-3 border-t border-[#C7DDAE]/60 block">
            ₹ Rupees • Temperatures • Auto Fares
          </span>
        </div>

        {/* Pillar 3 */}
        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-[#3E8424] flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {t.card3Title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              {t.card3Desc}
            </p>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground font-semibold pt-3 border-t border-[#C7DDAE]/60 block">
            &lt; 50 KB payload • 0 tracking scripts
          </span>
        </div>

        {/* Pillar 4: Printable A4 */}
        <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 space-y-4 shadow-warm flex flex-col justify-between sticker-lift">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3DA] border border-[#FCD685] text-accent flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {t.card4Title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              {t.card4Desc}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full mt-2 py-2.5 px-3 rounded-[12px] bg-primary text-white text-xs font-bold font-heading hover:bg-[#5b8a3e] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-warm-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>
        </div>
      </div>

      {/* Child Privacy Callout */}
      <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 sm:p-7 shadow-warm flex flex-col sm:flex-row items-center gap-5 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-[#3E8424] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {t.privacyTitle}
            </h4>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              {t.privacyDesc}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-xs font-mono font-bold bg-background px-3 py-1.5 rounded-full border border-[#C7DDAE] text-[#3E8424]">
          <Check className="w-4 h-4" />
          <span>DPDP 2023 COMPLIANT</span>
        </div>
      </div>
    </section>
  );
}
