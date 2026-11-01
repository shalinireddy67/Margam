"use client";

import React from "react";
import { Globe, FileText, Smartphone, Printer, ShieldCheck, Check } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface IndianClassroomsProps {
  currentLang: SupportedLanguage;
}

export default function IndianClassrooms({ currentLang }: IndianClassroomsProps) {
  const t = {
    en: {
      badge: "Built for Indian Classrooms",
      headline: "Works on Budget Phones & Low Internet",
      subhead:
        "Designed specifically for real Indian schools—from government schools with shared tablets to students studying at home.",
      card1Title: "3 Languages",
      card1Desc: "Full parity across English, हिन्दी, and తెలుగు with human-reviewed translations.",
      card2Title: "Real-Life Examples",
      card2Desc: "Math explained using Kirana store debt, Hyderabad auto fares, and cricket run-rates.",
      card3Title: "Printable Worksheets",
      card3Desc: "Teachers can print 1-page A4 worksheets directly for students without phones.",
      printBtn: "Print Sample Worksheet (A4)",
      privacyTitle: "100% Child Privacy (DPDP Act 2023)",
      privacyDesc: "Zero tracking cookies, zero ads, and zero student profiling.",
    },
    hi: {
      badge: "भारतीय कक्षाओं के लिए निर्मित",
      headline: "बजट स्मार्टफोन और कम इंटरनेट पर भी निर्बाध",
      subhead:
        "भारतीय स्कूलों की वास्तविक परिस्थितियों के अनुसार डिज़ाइन—साझा फोन से लेकर घर पर अध्ययन तक।",
      card1Title: "3 भारतीय भाषाएँ",
      card1Desc: "अंग्रेजी, हिन्दी और तेलुगु में पूर्ण अध्ययन सामग्री और समीक्षा युक्त अनुवाद।",
      card2Title: "रोज़मर्रा के उदाहरण",
      card2Desc: "किराना उधारी, ऑटो किराया और क्रिकेट के व्यावहारिक उदाहरणों से अमूर्त गणित सरल।",
      card3Title: "प्रिंट-योग्य वर्कशीट",
      card3Desc: "स्मार्टफोन न रखने वाले छात्रों के लिए शिक्षक 1-पेज की A4 वर्कशीट प्रिंट कर सकते हैं।",
      printBtn: "नमूना वर्कशीट प्रिंट करें (A4)",
      privacyTitle: "बाल गोपनीयता (DPDP अधिनियम 2023)",
      privacyDesc: "शून्य ट्रैकिंग कुकीज़, शून्य विज्ञापन, और शून्य डेटा हार्वेस्टिंग।",
    },
    te: {
      badge: "భారతీయ పాఠశాలల కోసం",
      headline: "సాధారణ ఫోన్లు మరియు తక్కువ డేటాతో పనిచేస్తుంది",
      subhead:
        "పరిమిత ఇంటర్నెట్ సౌకర్యాలు ఉన్న ప్రభుత్వ మరియు ప్రైవేట్ పాఠశాలల వాస్తవ అవసరాల కోసం ప్రత్యేక రూపకల్పన.",
      card1Title: "3 ప్రాంతీయ భాషలు",
      card1Desc: "ఇంగ్లీష్, హిందీ మరియు తెలుగులలో సమగ్రమైన మరియు సరళమైన వివరణలు.",
      card2Title: "మన నిత్యజీవిత ఉదాహరణలు",
      card2Desc: "కిరాణా కొట్టు ఖాతాలు, ఆటో ఛార్జీలు వంటి సుపరిచిత ఉదాహరణలతో సులభంగా అర్థమవుతుంది.",
      card3Title: "ప్రింటెడ్ వర్క్‌షీట్‌లు",
      card3Desc: "ఇళ్ల వద్ద ఫోన్లు లేని విద్యార్థుల కోసం ఉపాధ్యాయులు సులభంగా 1-పేజీ A4 వర్క్‌షీట్ ప్రింట్ చేయవచ్చు.",
      printBtn: "నమూనా వర్క్‌షీట్ ప్రింట్ చేయండి (A4)",
      privacyTitle: "విద్యార్థి గోప్యత (DPDP చట్టం 2023)",
      privacyDesc: "జీరో ట్రాకింగ్ కుకీలు, ప్రకటనలు లేవు మరియు పూర్తి భద్రత.",
    },
  }[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="indian-classrooms" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <Globe className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans">
          {t.subhead}
        </p>
      </div>

      {/* 3 Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Vernacular */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-[#E04A3F] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-white flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.card1Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.card1Desc}
            </p>
          </div>
          <div className="flex gap-1.5 text-xs font-pixel text-[#2B1B0F] pt-3 border-t-2 border-[#E5D7BE]">
            <span className="px-2.5 py-1 bg-white border border-[#422816]">English</span>
            <span className="px-2.5 py-1 bg-white border border-[#422816]">हिन्दी</span>
            <span className="px-2.5 py-1 bg-white border border-[#422816]">తెలుగు</span>
          </div>
        </div>

        {/* Card 2: Real Contexts */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-[#F4C542] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-[#2B1B0F] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.card2Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.card2Desc}
            </p>
          </div>
          <span className="text-xs font-pixel text-[#7A4B2A] pt-3 border-t-2 border-[#E5D7BE] block">
            ₹ Rupees • Auto Fares • Cricket Run Rates
          </span>
        </div>

        {/* Card 3: Printable Worksheets */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-[#5DAA3A] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] text-white flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-pixel text-base text-[#2B1B0F]">
              {t.card3Title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3720] leading-relaxed font-sans">
              {t.card3Desc}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full min-h-[48px] px-4 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>
        </div>
      </div>

      {/* DPDP Act Privacy Bar */}
      <div className="bg-[#5A3720] text-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#FFF7E6] border-[2px] border-[#422816] text-[#5DAA3A] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-pixel text-sm sm:text-base text-[#FFF7E6]">
              {t.privacyTitle}
            </h4>
            <p className="text-xs text-[#E5D7BE] font-sans">{t.privacyDesc}</p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE9A8] border border-[#422816] text-xs font-pixel text-[#2B1B0F]">
          <Check className="w-4 h-4 text-[#5DAA3A]" />
          <span>DPDP Principles</span>
        </div>
      </div>
    </section>
  );
}
