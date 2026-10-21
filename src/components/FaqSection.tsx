"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface FaqSectionProps {
  currentLang: SupportedLanguage;
}

export default function FaqSection({ currentLang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const t = {
    en: {
      sectionNum: "11 / INQUIRIES & FAQ",
      headline: "Frequently Asked Questions",
      subhead:
        "Clear answers about our prerequisite tracing algorithm, vernacular translations, teacher controls, and child data protection.",
      q1: "How does Margam identify root conceptual gaps rather than superficial errors?",
      a1: "When a Class 9 student struggles with factoring polynomials (e.g. x² - x - 6), conventional platforms provide 20 more polynomial drills. Margam's 21-node NCERT graph instead diagnoses whether the true breakdown is in Class 7 integer multiplication rules (-3 × +2 = -6). Fixing the root concept closes the gap permanently.",
      q2: "Why focus specifically on Classes 6 to 10 mathematics?",
      a2: "Classes 6 through 10 represent the critical transition from concrete arithmetic to abstract algebraic reasoning. A student who enters Class 9 with an undetected sign error or variable transposition gap from Class 7 faces compounded difficulty. Margam targets these foundational inflection points.",
      q3: "How are Hindi and Telugu translations ensured for pedagogical accuracy?",
      a3: "Every question, lesson variant, hint, and worksheet has been authored directly for Indian classrooms and contains audit flags (reviewed: false/true) in data/questions.json and data/lessons.json. This allows continuous educator review and guarantees natural vernacular phrasing rather than raw machine translation.",
      q4: "Can teachers override Margam's recommendations?",
      a4: "Yes, completely. Algorithms inform teachers; they do not dictate classroom strategy. Teachers can override any diagnostic recommendation, reassign student remedial clusters, or choose to deliver 1-page paper worksheets instead of digital sessions.",
      q5: "Does Margam work in low-bandwidth schools with shared devices?",
      a5: "Yes. Margam is engineered with minimal payload footprints (< 50 KB initial bundle), zero client tracking scripts, and local device storage. It functions seamlessly on budget Android smartphones and tablets shared among whole classrooms, and supports direct 1-page A4 printing.",
      q6: "How does Margam protect student privacy under the DPDP Act 2023?",
      a6: "Margam has zero tracking cookies, zero third-party marketing trackers, and zero surveillance pixels. Student assessment runs are kept local to the school or classroom session, strictly adhering to India's Digital Personal Data Protection Act 2023.",
    },
    hi: {
      sectionNum: "11 / सामान्य प्रश्न (FAQ)",
      headline: "अक्सर पूछे जाने वाले प्रश्न",
      subhead:
        "मार्गम् के एल्गोरिदम, भाषाई सटीकता, शिक्षक नियंत्रण और डेटा सुरक्षा से संबंधित सभी महत्वपूर्ण उत्तर।",
      q1: "मार्गम् सतही गलतियों के बजाय मूल संप्रत्यय की कमी को कैसे पहचानता है?",
      a1: "जब कक्षा 9 का छात्र बहुपद के गुणनखंड में अटकता है, तो पारंपरिक सॉफ़्टवेयर उसी कक्षा के और प्रश्न देता है। मार्गम् का NCERT ग्राफ यह जाँचता है कि कहीं वास्तविक समस्या कक्षा 7 के पूर्णांक चिह्न नियमों में तो नहीं है। मूल कारण ठीक होते ही छात्र आगे बढ़ जाता है।",
      q2: "कक्षा 6 से 10 के गणित पर ही विशेष ध्यान क्यों?",
      a2: "कक्षा 6 से 10 वह समय है जब अंकगणित से बीजगणित की ओर संक्रमण होता है। कक्षा 7 में छूटी हुई एक छोटी सी कमी कक्षा 9 और 10 में विफलता का कारण बनती है।",
      q3: "हिन्दी और तेलुगु अनुवादों की प्रामाणिकता कैसे सुनिश्चित की जाती है?",
      a3: "प्रत्येक प्रश्न और पाठ भारतीय कक्षाओं के शिक्षकों द्वारा समीक्षा हेतु ऑडिट फ्लैग के साथ JSON फाइलों में सुरक्षित है। यह स्वाभाविक स्थानीय शब्दावली सुनिश्चित करता है।",
      q4: "क्या शिक्षक मार्गम् की अनुशंसित योजनाओं को बदल सकते हैं?",
      a4: "हाँ, पूरी तरह। शिक्षक किसी भी समय समूह विभाजन बदल सकते हैं, नए विषय चुन सकते हैं, या डिजिटल के स्थान पर प्रिंटेड पेपर वर्कशीट दे सकते हैं।",
      q5: "क्या यह कम इंटरनेट और साझा फोन वाले सरकारी स्कूलों में काम करता है?",
      a5: "हाँ, मार्गम् बहुत कम डेटा (<50 KB) खपत करता है और बुनियादी एंड्रॉइड फोन या टैबलेट पर सुचारू रूप से चलता है।",
      q6: "DPDP अधिनियम 2023 के तहत बच्चों की गोपनीयता कैसे सुरक्षित है?",
      a6: "शून्य ट्रैकिंग कुकीज़, शून्य विज्ञापन स्क्रिप्ट, और स्थानीय भंडारण। छात्रों की कोई भी निजी जानकारी एकत्र नहीं की जाती।",
    },
    te: {
      sectionNum: "11 / తరచుగా అడిగే ప్రశ్నలు (FAQ)",
      headline: "సందేహాలు & సమాధానాలు",
      subhead:
        "మార్గం అల్గారిథమ్, తెలుగు అనువాదాలు, ఉపాధ్యాయుల అధికారం మరియు విద్యార్థి డేటా భద్రత గురించిన సమగ్ర సమాచారం.",
      q1: "మార్గం విద్యార్థి లోపాన్ని ఎలా గుర్తిస్తుంది?",
      a1: "9వ తరగతి విద్యార్థి బహుపదుల లెక్కల్లో తప్పు చేస్తే, పాత పద్ధతుల్లో మళ్ళీ అవే లెక్కలు ఇస్తారు. మార్గం NCERT నెట్‌వర్క్ ద్వారా అసలు లోపం 7వ తరగతి సంకేత నియమాలలో ఉందని గుర్తించి దాన్ని సరిచేస్తుంది.",
      q2: "6 నుండి 10 తరగతుల గణితంపైనే ఎందుకు దృష్టి పెట్టారు?",
      a2: "ఈ తరగతుల్లోనే అంకగణితం నుండి బీజగణితానికి అడుగులు పడతాయి. 7వ తరగతిలో రాని లెక్కలు 9 మరియు 10వ తరగతి బోర్డు పరీక్షల్లో తీవ్ర సమస్యగా మారతాయి.",
      q3: "తెలుగు అనువాదాలు ఎంతవరకు ప్రామాణికమైనవి?",
      a3: "ప్రతి ప్రశ్న మరియు వివరణ పాఠశాల ఉపాధ్యాయుల సమీక్ష కోసం ప్రత్యేక ఆడిట్ ఫ్లాగ్‌లతో భద్రపరచబడింది. సహజమైన తెలుగు పదజాలం ఉపయోగించబడింది.",
      q4: "సిస్టమ్ సూచించిన పద్ధతులను ఉపాధ్యాయుడు మార్చవచ్చా?",
      a4: "ఖచ్చితంగా మార్చవచ్చు. ఉపాధ్యాయుడిదే అంతిమ నిర్ణయం. విద్యార్థుల గ్రూపులను మార్చడం లేదా ప్రింటెడ్ వర్క్‌షీట్‌లను ఇవ్వడం వంటి పూర్తి అధికారం ఉంటుంది.",
      q5: "తక్కువ ఇంటర్నెట్ ఉన్న పాఠశాలల్లో ఇది పనిచేస్తుందా?",
      a5: "అవును. చాలా తక్కువ ఇంటర్నెట్ డేటాతో (< 50 KB) వేగంగా లోడ్ అవుతుంది. సాధారణ ఫోన్లలో కూడా సులభంగా పనిచేస్తుంది.",
      q6: "DPDP చట్టం 2023 ప్రకారం పిల్లల వివరాలు సురక్షితమేనా?",
      a6: "జీరో ట్రాకింగ్ కుకీలు మరియు ఎలాంటి ప్రకటనలు లేవు. విద్యార్థుల వివరాలు ఎక్కడా సేకరించబడవు.",
    },
  }[currentLang];

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  return (
    <section id="faq" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* Accordion Questions List */}
      <div className="space-y-4 max-w-4xl">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-[20px] border-2 transition-all ${
                isOpen
                  ? "bg-card border-[#C7DDAE] shadow-warm"
                  : "bg-card/70 border-[#C7DDAE]/60 hover:border-primary"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#EAF5E1] border border-[#B7DE9E] text-primary flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-heading font-bold text-base sm:text-lg text-foreground">
                    {item.q}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border border-[#C7DDAE] transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 bg-[#FFF3DA] text-accent border-[#FCD685]" : "bg-background text-muted-foreground"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 border-t border-[#C7DDAE]/40 text-foreground/80 text-sm leading-relaxed font-sans">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
