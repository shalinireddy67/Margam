"use client";

import React from "react";
import { BookOpen, CheckSquare, Award, ArrowRight, Printer, Sparkles } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface ApproachSectionProps {
  currentLang: SupportedLanguage;
}

export default function ApproachSection({ currentLang }: ApproachSectionProps) {
  const t = {
    en: {
      badge: "How Margam Works",
      headline: "Learn • Solve • Test",
      subhead:
        "Most math apps only change the difficulty of practice drills. Margam adapts all three steps of learning so you never get stuck.",
      step1Tag: "1. LEARN",
      step1Title: "3 Lesson Styles",
      step1Desc: "Pick how you learn best: real-life Kirana store visual models, standard textbook steps, or fast-track shortcuts.",
      step2Tag: "2. SOLVE",
      step2Title: "Adaptive Practice",
      step2Desc: "Start with 1-step confidence builders, then level up to multi-step problem solving with step-by-step hints.",
      step3Tag: "3. TEST",
      step3Title: "5-Min Checkpoints",
      step3Desc: "Quick checkpoints that pinpoint which prerequisite gaps you have closed, without high-stakes test stress.",
      reportTitle: "Student Gap Report",
      reportStudent: "Rajesh Kumar (Class 9A)",
      reportGap: "Class 7 Integer Signs",
      worksheetTitle: "1-Page Paper Worksheet",
      worksheetDesc: "Clean A4 printable format for offline classroom practice.",
      printBtn: "Print Worksheet (A4)",
    },
    hi: {
      badge: "मार्गम् कैसे काम करता है",
      headline: "सीखें • हल करें • परीक्षण दें",
      subhead:
        "अधिकांश ऐप्स केवल प्रश्नों की कठिनाई बदलते हैं। मार्गम् समझ के तीनों चरणों को अनुकूलित करता है ताकि आप कभी न अटकें।",
      step1Tag: "1. सीखें (Learn)",
      step1Title: "3 शिक्षण शैलियाँ",
      step1Desc: "किराना दुकान का वास्तविक मॉडल, पाठ्यपुस्तक के औपचारिक चरण, या त्वरित शॉर्टकट में से चुनें।",
      step2Tag: "2. हल करें (Solve)",
      step2Title: "अनुकूली अभ्यास",
      step2Desc: "सरल प्रश्नों से आत्मविश्वास बढ़ाएँ, फिर चरणबद्ध संकेतों के साथ उच्च स्तर के प्रश्न हल करें।",
      step3Tag: "3. परीक्षण (Test)",
      step3Title: "5-मिनट की जाँच",
      step3Desc: "तनाव-मुक्त छोटी जाँच जो बताती है कि कौन सी बुनियादी कमियाँ दूर हो चुकी हैं।",
      reportTitle: "छात्र अंतर रिपोर्ट",
      reportStudent: "राजेश कुमार (कक्षा 9A)",
      reportGap: "कक्षा 7 पूर्णांक चिह्न नियम",
      worksheetTitle: "1-पेज पेपर वर्कशीट",
      worksheetDesc: "ऑफलाइन कक्षा अभ्यास के लिए स्पष्ट A4 प्रिंट प्रारूप।",
      printBtn: "वर्कशीट प्रिंट करें (A4)",
    },
    te: {
      badge: "మార్గం ఎలా పనిచేస్తుంది",
      headline: "నేర్చుకోండి • సాధించండి • పరీక్షించండి",
      subhead:
        "చాలా వెబ్‌సైట్లు కేవలం లెక్కల కష్టాన్ని మాత్రమే మారుస్తాయి. మార్గం అవగాహన యొక్క 3 దశలను అనుకూలీకరిస్తుంది.",
      step1Tag: "1. నేర్చుకోండి",
      step1Title: "3 బోధనా శైలులు",
      step1Desc: "కిరాణా షాపు ఉదాహరణలు, పాఠ్యపుస్తక పద్ధతి లేదా షార్ట్‌కట్లలో మీకు నచ్చిన రీతిని ఎంచుకోండి.",
      step2Tag: "2. సాధించండి",
      step2Title: "అనుకూల సాధన",
      step2Desc: "సులభమైన లెక్కలతో ప్రారంభించి, క్లూల సహాయంతో క్లిష్టమైన సమస్యలను సాధించండి.",
      step3Tag: "3. పరీక్షించండి",
      step3Title: "5 నిమిషాల చెక్",
      step3Desc: "ఎలాంటి ఒత్తిడి లేకుండా మీ పునాది లోపాలు ఎంతవరకు సరిదిద్దబడ్డాయో చూపే నివేదిక.",
      reportTitle: "విద్యార్థి గ్యాప్ నివేదిక",
      reportStudent: "రాజేష్ కుమార్ (9వ తరగతి A)",
      reportGap: "7వ తరగతి పూర్ణ సంఖ్యల సంకేతాలు",
      worksheetTitle: "1-పేజీ పేపర్ వర్క్‌షీట్",
      worksheetDesc: "ఇళ్ల వద్ద సాధన కోసం ముద్రించదగిన స్పష్టమైన A4 ఫార్మాట్.",
      printBtn: "వర్క్‌షీట్ ప్రింట్ చేయండి (A4)",
    },
  }[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light text-sage border border-sage-border text-xs sm:text-sm font-heading font-bold">
          <BookOpen className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* 3 Step Cards (Inspired by Dribbble Reference subject cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Step 1: Learn */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E0E5D4] shadow-card flex flex-col justify-between space-y-4 card-hover">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-light border border-coral-border flex items-center justify-center text-coral">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-coral">
              {t.step1Tag}
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {t.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.step1Desc}
            </p>
          </div>
          <div className="pt-3 border-t border-[#E0E5D4] flex items-center justify-between text-xs font-heading font-bold text-coral">
            <span>Visual & Real-Life Models</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: Solve */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E0E5D4] shadow-card flex flex-col justify-between space-y-4 card-hover">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lemon-light border border-lemon-border flex items-center justify-center text-lemon">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-lemon">
              {t.step2Tag}
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {t.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.step2Desc}
            </p>
          </div>
          <div className="pt-3 border-t border-[#E0E5D4] flex items-center justify-between text-xs font-heading font-bold text-lemon">
            <span>3 Progressive Levels</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: Test */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E0E5D4] shadow-card flex flex-col justify-between space-y-4 card-hover">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-light border border-sage-border flex items-center justify-center text-sage">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sage">
              {t.step3Tag}
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {t.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
          <div className="pt-3 border-t border-[#E0E5D4] flex items-center justify-between text-xs font-heading font-bold text-sage">
            <span>Formative Progress Card</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2 Clean Preview Cards (Gap Report & Printable Worksheet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Report Card */}
        <div className="bg-[#F9F7E8] rounded-3xl p-6 border border-[#E0E5D4] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-coral">
              Sample Output
            </span>
            <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-[#E0E5D4]">
              {t.reportStudent}
            </span>
          </div>
          <h4 className="font-heading text-lg font-bold text-foreground">
            {t.reportTitle}
          </h4>
          <div className="p-3 bg-white rounded-2xl border border-[#E0E5D4] space-y-1">
            <div className="text-xs text-muted-foreground font-medium">Diagnosed Root Cause:</div>
            <div className="text-sm font-bold text-coral font-heading">{t.reportGap}</div>
            <div className="text-xs text-foreground/80 pt-1 font-mono">
              Action: 10-min number line practice before revisiting quadratic factoring.
            </div>
          </div>
        </div>

        {/* Printable Worksheet Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E0E5D4] shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-sage">
              Printable Resource
            </span>
            <span className="text-xs font-mono bg-sage-light text-sage px-2 py-0.5 rounded-full font-bold">
              A4 Format
            </span>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold text-foreground">
              {t.worksheetTitle}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
              {t.worksheetDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-2xl bg-background hover:bg-white text-foreground border border-[#E0E5D4] text-xs font-heading font-bold gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sage" />
            <span>{t.printBtn}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
