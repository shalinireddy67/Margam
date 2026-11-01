"use client";

import React from "react";
import { AlertCircle, CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface ProblemSectionProps {
  currentLang: SupportedLanguage;
}

export default function ProblemSection({ currentLang }: ProblemSectionProps) {
  const t = {
    en: {
      badge: "The Problem",
      headline: "A 38% mark doesn't tell you where the mistake began.",
      subhead:
        "When an 8th or 9th grader struggles with polynomials, giving 20 more hard questions only causes frustration. Here is what actually happens:",
      card1Tag: "Traditional Tests",
      card1Title: "Only sees: 38% / Failed",
      card1Point1: "Assumes the student doesn't understand Class 9 Polynomials.",
      card1Point2: "Assigns 20 more factoring equations (x² - x - 6).",
      card1Point3: "Result: Student gets frustrated because the root gap is untouched.",
      card2Tag: "Margam Prerequisite Graph",
      card2Title: "Traces the root: Class 7 Integers",
      card2Point1: "Identifies that the student gets negative signs wrong: (-3) × (+2) = -6.",
      card2Point2: "Recommends 2 quick paper practice exercises on Class 7 signed numbers.",
      card2Point3: "Result: Student fixes the foundation and solves Class 9 factoring with ease.",
    },
    hi: {
      badge: "मुख्य समस्या",
      headline: "38% अंक यह नहीं बताते कि गलती कहाँ से शुरू हुई।",
      subhead:
        "जब कक्षा 9 का छात्र बहुपदों में अटकता है, तो उसी कक्षा के 20 और कठिन प्रश्न देना केवल निराशा बढ़ाता है:",
      card1Tag: "पारंपरिक परीक्षा",
      card1Title: "केवल देखता है: 38% / अनुत्तीर्ण",
      card1Point1: "मान लिया जाता है कि छात्र को कक्षा 9 का बहुपद समझ नहीं आया।",
      card1Point2: "उसी तरह के 20 और कठिन प्रश्न हल करने को दिए जाते हैं।",
      card1Point3: "परिणाम: छात्र हताश हो जाता है क्योंकि मूल कमी बनी रहती है।",
      card2Tag: "मार्गम् पूर्वापेक्षा ग्राफ",
      card2Title: "मूल कारण खोजता है: कक्षा 7 पूर्णांक",
      card2Point1: "पहचानता है कि गलती चिह्नों में है: (-3) × (+2) = -6।",
      card2Point2: "कक्षा 7 के पूर्णांक चिह्नों पर 2 छोटे अभ्यास सुझाता है।",
      card2Point3: "परिणाम: बुनियादी कमी दूर होते ही छात्र कक्षा 9 के प्रश्न आसानी से हल कर लेता है।",
    },
    te: {
      badge: "ప్రధాన సమస్య",
      headline: "38% మార్కులు అసలు తప్పు ఎక్కడ జరిగిందో చెప్పలేవు.",
      subhead:
        "9వ తరగతి విద్యార్థి లెక్కల్లో తప్పు చేస్తే, మళ్ళీ అవే కష్టమైన లెక్కలు ఇవ్వడం వల్ల ఫలితం ఉండదు:",
      card1Tag: "సాంప్రదాయ పరీక్షలు",
      card1Title: "కేవలం చూసేది: 38% మార్కులు",
      card1Point1: "విద్యార్థికి 9వ తరగతి బహుపదులు రాలేదని భావిస్తారు.",
      card1Point2: "మరిన్ని కష్టమైన లెక్కలను హోమ్‌వర్క్‌గా ఇస్తారు.",
      card1Point3: "ఫలితం: అసలు లోపం అలాగే ఉండి విద్యార్థి నిరాశ చెందుతాడు.",
      card2Tag: "మార్గం కాన్సెప్ట్ నెట్‌వర్క్",
      card2Title: "అసలు లోపాన్ని గుర్తిస్తుంది: 7వ తరగతి పూర్ణ సంఖ్యలు",
      card2Point1: "సంకేతాల గుణకారంలో (-3) × (+2) = -6 తప్పు చేస్తున్నారని గుర్తిస్తుంది.",
      card2Point2: "7వ తరగతి సూత్రాలపై 2 చిన్న అభ్యాసాలను సూచిస్తుంది.",
      card2Point3: "ఫలితం: పునాది బలపడి విద్యార్థి 9వ తరగతి లెక్కలను సులభంగా చేయగలుగుతాడు.",
    },
  }[currentLang];

  return (
    <section id="problem" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E04A3F] text-white border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans">
          {t.subhead}
        </p>
      </div>

      {/* 2 Clean Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Traditional Tests */}
        <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#D9D9D9] border-[2px] border-[#422816] font-pixel text-xs text-[#2B1B0F] uppercase">
                {t.card1Tag}
              </span>
              <XCircle className="w-6 h-6 text-[#E04A3F]" />
            </div>

            <h3 className="font-pixel text-lg sm:text-xl text-[#2B1B0F]">
              {t.card1Title}
            </h3>

            <ul className="space-y-3 pt-2 text-sm text-[#5A3720] font-sans font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#D9D9D9] border border-[#422816] text-[#2B1B0F] text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  1
                </span>
                <span>{t.card1Point1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#D9D9D9] border border-[#422816] text-[#2B1B0F] text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  2
                </span>
                <span>{t.card1Point2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#D9D9D9] border border-[#422816] text-[#2B1B0F] text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  3
                </span>
                <span className="text-[#E04A3F] font-bold">{t.card1Point3}</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t-2 border-[#E5D7BE] text-xs font-pixel text-[#7A4B2A]">
            Symptom-treating approach
          </div>
        </div>

        {/* Card 2: Margam Prerequisite Tracing */}
        <div className="bg-[#5A3720] text-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#5DAA3A] border-[2px] border-[#422816] font-pixel text-xs text-white uppercase">
                {t.card2Tag}
              </span>
              <CheckCircle2 className="w-6 h-6 text-[#5DAA3A]" />
            </div>

            <h3 className="font-pixel text-lg sm:text-xl text-[#FFF7E6]">
              {t.card2Title}
            </h3>

            <ul className="space-y-3 pt-2 text-sm text-[#FFF7E6] font-sans font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#5DAA3A] border border-[#422816] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  ✓
                </span>
                <span>{t.card2Point1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#5DAA3A] border border-[#422816] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  ✓
                </span>
                <span>{t.card2Point2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#5DAA3A] border border-[#422816] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-pixel">
                  ✓
                </span>
                <span className="text-[#FFE9A8] font-bold">{t.card2Point3}</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#7A4B2A] text-xs font-pixel text-[#FFE9A8] flex items-center gap-1.5">
            <span>Root-cause elimination approach</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
