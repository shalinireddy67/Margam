"use client";

import React from "react";
import { SupportedLanguage } from "@/lib/types";
import { Network, Globe, GraduationCap, ShieldCheck } from "lucide-react";

interface VitalStatsSectionProps {
  currentLang: SupportedLanguage;
}

export default function VitalStatsSection({ currentLang }: VitalStatsSectionProps) {
  const t = {
    en: {
      sectionNum: "05 / VITAL STATISTICS",
      headline: "Curriculum Footprint & Architectural Integrity",
      subhead:
        "Every single concept is explicitly mapped to NCERT standards with zero black-box obscurity and absolute child privacy compliance.",
      stat1Number: "21",
      stat1Label: "CONCEPTS IN DAG",
      stat1Desc: "100% mathematically verified acyclic graph across Class 6 to 9 foundational topics.",
      stat2Number: "03",
      stat2Label: "LANGUAGES SUPPORTED",
      stat2Desc: "Complete parity across English, हिन्दी (Hindi), and తెలుగు (Telugu) with human review flags.",
      stat3Number: "05",
      stat3Label: "CLASSES COVERED",
      stat3Desc: "Class 6, 7, 8, 9, and 10 curriculum prerequisites cross-referenced for root gap analysis.",
      stat4Number: "00",
      stat4Label: "TRACKING COOKIES",
      stat4Desc: "Zero third-party trackers, zero advertising scripts, and full DPDP Act 2023 child privacy compliance.",
    },
    hi: {
      sectionNum: "05 / मुख्य आंकड़े",
      headline: "पाठ्यक्रम विस्तार और वास्तुशिल्प अखंडता",
      subhead:
        "प्रत्येक संप्रत्यय एनसीईआरटी मानकों से मैप किया गया है, जिसमें कोई अस्पष्टता नहीं और बाल गोपनीयता का पूर्ण पालन है।",
      stat1Number: "21",
      stat1Label: "DAG में संप्रत्यय",
      stat1Desc: "कक्षा 6 से 9 के आधारभूत विषयों का 100% गणितीय रूप से सत्यापित अचक्रीय ग्राफ।",
      stat2Number: "03",
      stat2Label: "समर्थित भाषाएँ",
      stat2Desc: "अंग्रेजी, हिन्दी और तेलुगु में पूर्ण समानता एवं शिक्षक समीक्षा स्थिति।",
      stat3Number: "05",
      stat3Label: "कक्षाएँ शामिल",
      stat3Desc: "कक्षा 6, 7, 8, 9 और 10 के पूर्वापेक्षा संप्रत्ययों का अंतर-विश्लेषण।",
      stat4Number: "00",
      stat4Label: "ट्रैकिंग कुकीज़",
      stat4Desc: "शून्य विज्ञापन स्क्रिप्ट, शून्य बाहरी ट्रैकर, और DPDP अधिनियम 2023 का पूर्ण अनुपालन।",
    },
    te: {
      sectionNum: "05 / గణాంకాలు",
      headline: "పాఠ్యాంశాల పరిధి & సాంకేతిక భద్రత",
      subhead:
        "ప్రతి కాన్సెప్ట్ NCERT ప్రమాణాలకు అనుగుణంగా రూపొందించబడింది మరియు విద్యార్థి గోప్యతకు అత్యధిక ప్రాధాన్యత ఇవ్వబడింది.",
      stat1Number: "21",
      stat1Label: "DAG కాన్సెప్ట్‌లు",
      stat1Desc: "6 నుండి 9 తరగతుల పునాది అంశాల కోసం గణితపరంగా ధృవీకరించబడిన నెట్‌వర్క్.",
      stat2Number: "03",
      stat2Label: "భాషా సౌలభ్యం",
      stat2Desc: "ఇంగ్లీష్, హిందీ మరియు తెలుగులలో సమాన ప్రాధాన్యతతో కూడిన వివరణలు.",
      stat3Number: "05",
      stat3Label: "తరగతుల పరిధి",
      stat3Desc: "6, 7, 8, 9, 10 తరగతుల లింక్ చేయబడిన పాఠ్యాంశాల సమగ్ర విశ్లేషణ.",
      stat4Number: "00",
      stat4Label: "ట్రాకింగ్ కుకీలు",
      stat4Desc: "ఎలాంటి ప్రకటనలు లేదా ట్రాకింగ్ స్క్రిప్ట్‌లు లేని సురక్షిత DPDP 2023 ప్లాట్‌ఫారమ్.",
    },
  }[currentLang];

  const stats = [
    {
      num: t.stat1Number,
      label: t.stat1Label,
      desc: t.stat1Desc,
      icon: Network,
      color: "text-primary",
      bg: "bg-[#EAF5E1] border-[#B7DE9E]",
    },
    {
      num: t.stat2Number,
      label: t.stat2Label,
      desc: t.stat2Desc,
      icon: Globe,
      color: "text-accent",
      bg: "bg-[#FFF3DA] border-[#FCD685]",
    },
    {
      num: t.stat3Number,
      label: t.stat3Label,
      desc: t.stat3Desc,
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-[#EAF5E1] border-[#B7DE9E]",
    },
    {
      num: t.stat4Number,
      label: t.stat4Label,
      desc: t.stat4Desc,
      icon: ShieldCheck,
      color: "text-[#3E8424]",
      bg: "bg-[#EAF5E1] border-[#B7DE9E]",
    },
  ];

  return (
    <section id="statistics" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 shadow-warm flex flex-col justify-between sticker-lift relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-muted-foreground">
                  {item.label}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>

              <div>
                <div className={`font-serif text-5xl font-extrabold mb-2 ${item.color}`}>
                  {item.num}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C7DDAE]/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>VERIFIED</span>
                <span className="text-primary font-bold">100% OK</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
