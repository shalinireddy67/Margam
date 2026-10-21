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
        "कम इंटरनेट डेटा खपत और स्थानीय भंडारण। बजट एंड्रॉइड फोन और साझा टैबलेट पर भी निर्बाధ काम करता है।",
      card4Title: "प्रिंट-योग्य एकल-पृष्ठ A4 वर्कशीट",
      card4Desc:
        "घर पर स्मार्टफोन न रखने वाले छात्रों के लिए शिक्षक सीधे 1-पेज की A4 वर्कशीट प्रिंट कर सकते हैं।",
      printBtn: "नमूना वर्कशीट प्रिंट करें (A4)",
      privacyTitle: "बाल गोपनीयता (DPDP अधिनियम 2023)",
      privacyDesc:
        "शून्य ट्रैकिंग कुकीज़। शून्य तृतीय-पक्ष विज्ञापन ट्रैकर। बच्चों की गोपनीयता पूरी तरह सुरक्षित है।",
    },
    te: {
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
    <section id="indian-classrooms" className="py-16 md:py-24 bg-white border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              05 / {t.badge}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            {t.headline}
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            {t.subhead}
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-margam-cream-paper rounded-2xl border border-margam-border p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-margam-terracotta flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.card1Desc}
              </p>
            </div>
            <div className="flex gap-1.5 text-[11px] font-bold text-margam-navy pt-2">
              <span className="px-2 py-0.5 rounded bg-white border border-margam-border">English</span>
              <span className="px-2 py-0.5 rounded bg-white border border-margam-border">हिन्दी</span>
              <span className="px-2 py-0.5 rounded bg-white border border-margam-border">తెలుగు</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-margam-cream-paper rounded-2xl border border-margam-border p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-margam-amber flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                {t.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.card2Desc}
              </p>
            </div>
            <span className="text-[11px] font-mono text-margam-slate font-semibold pt-2 block">
              ₹ Rupees • Temperatures • Auto Fares
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="bg-margam-cream-paper rounded-2xl border border-margam-border p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-margam-emerald flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                {t.card3Title}
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.card3Desc}
              </p>
            </div>
            <span className="text-[11px] font-mono text-margam-slate font-semibold pt-2 block">
              &lt; 50 KB initial payload • Zero third-party scripts
            </span>
          </div>

          {/* Pillar 4: Printable A4 */}
          <div className="bg-margam-cream-paper rounded-2xl border border-margam-border p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-margam-navy">
                {t.card4Title}
              </h3>
              <p className="text-xs sm:text-sm text-margam-slate leading-relaxed font-sans">
                {t.card4Desc}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-margam-navy text-white text-xs font-bold hover:bg-margam-navy/90 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printBtn}</span>
            </button>
          </div>
        </div>

        {/* Printable Worksheet Preview Card */}
        <div className="rounded-2xl border-2 border-margam-border bg-white p-6 sm:p-8 space-y-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between border-b border-margam-border pb-4 gap-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-margam-terracotta">
                Single-Page A4 Classroom Handout
              </span>
              <h3 className="font-serif text-xl font-bold text-margam-navy">
                Sample A4 Practice Worksheet (Form M-A4-2026)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                Ready for Inkjet & Xerox
              </span>
            </div>
          </div>

          {/* Worksheet Paper Layout */}
          <div className="p-6 bg-margam-cream-paper border border-margam-border rounded-xl space-y-4 font-mono text-xs">
            <div className="grid grid-cols-3 gap-2 border-b border-margam-border pb-3 text-slate-700">
              <div>STUDENT: ___________________</div>
              <div>ROLL NO: ________</div>
              <div className="text-right">DATE: ___/___/2026</div>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 bg-white rounded-lg border border-margam-border space-y-1.5">
                <div className="font-bold text-margam-navy">
                  1. Hyderabad auto fare calculation: 30 + 15x = 105. Find additional km (x).
                </div>
                <div className="h-6 border-b border-dashed border-gray-300 flex items-end text-slate-400 font-mono text-[11px]">
                  Working space: _________________________________________________________________
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-margam-border space-y-1.5">
                <div className="font-bold text-margam-navy">
                  2. Evaluate with proper signs: (-48) ÷ (-6) = ?
                </div>
                <div className="h-6 border-b border-dashed border-gray-300 flex items-end text-slate-400 font-mono text-[11px]">
                  Answer: _______________________
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-margam-border space-y-1.5">
                <div className="font-bold text-margam-navy">
                  3. Factorise quadratic expression: x² - x - 6 = (____ - ____)(____ + ____)
                </div>
                <div className="h-6 border-b border-dashed border-gray-300 flex items-end text-slate-400 font-mono text-[11px]">
                  Show two integers whose product is -6 and sum is -1: ______________________________
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Principles Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-margam-emerald" />
              <span className="text-xs font-bold uppercase tracking-wider text-margam-emerald">
                {t.privacyTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 font-sans leading-relaxed">
              {t.privacyDesc}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-emerald-900 shrink-0">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-margam-emerald" />
              <span>Cookies: 0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-margam-emerald" />
              <span>Trackers: 0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-margam-emerald" />
              <span>Local Session</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
