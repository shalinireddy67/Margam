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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <BookOpen className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans">
          {t.subhead}
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Step 1: Learn */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#E04A3F] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-pixel text-xs tracking-wider text-[#A03028]">
              {t.step1Tag}
            </span>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.step1Desc}
            </p>
          </div>
          <div className="pt-3 border-t-2 border-[#E5D7BE] flex items-center justify-between text-xs font-pixel text-[#A03028]">
            <span>Visual & Real-Life Models</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: Solve */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#F4C542] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-[#2B1B0F]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="font-pixel text-xs tracking-wider text-[#8A6310]">
              {t.step2Tag}
            </span>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.step2Desc}
            </p>
          </div>
          <div className="pt-3 border-t-2 border-[#E5D7BE] flex items-center justify-between text-xs font-pixel text-[#8A6310]">
            <span>3 Progressive Levels</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: Test */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#5DAA3A] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-pixel text-xs tracking-wider text-[#2F6B22]">
              {t.step3Tag}
            </span>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.step3Desc}
            </p>
          </div>
          <div className="pt-3 border-t-2 border-[#E5D7BE] flex items-center justify-between text-xs font-pixel text-[#2F6B22]">
            <span>Formative Progress Card</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2 Clean Preview Cards (Gap Report & Printable Worksheet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Report Card */}
        <div className="bg-[#5A3720] text-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs uppercase text-[#FFE9A8]">
              Sample Output
            </span>
            <span className="font-pixel text-xs bg-[#FFE9A8] text-[#2B1B0F] px-2.5 py-0.5 border border-[#422816]">
              {t.reportStudent}
            </span>
          </div>
          <h4 className="font-pixel text-base text-[#FFF7E6]">
            {t.reportTitle}
          </h4>
          <div className="p-3 bg-[#FFF7E6] text-[#2B1B0F] border-[2px] border-[#422816] space-y-1">
            <div className="text-xs text-[#5A3720] font-semibold">Diagnosed Root Cause:</div>
            <div className="text-sm font-bold text-[#E04A3F]">{t.reportGap}</div>
            <div className="text-xs text-[#2B1B0F] pt-1 font-mono">
              Action: 10-min number line practice before revisiting quadratic factoring.
            </div>
          </div>
        </div>

        {/* Printable Worksheet Card */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs uppercase text-[#5DAA3A]">
              Printable Resource
            </span>
            <span className="font-pixel text-xs bg-[#5DAA3A] text-white px-2.5 py-0.5 border border-[#422816]">
              A4 Format
            </span>
          </div>
          <div>
            <h4 className="font-pixel text-base text-[#2B1B0F]">
              {t.worksheetTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed mt-1 font-sans">
              {t.worksheetDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center min-h-[48px] px-5 bg-[#5DAA3A] hover:bg-[#4E9330] text-white border-[2px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{t.printBtn}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
