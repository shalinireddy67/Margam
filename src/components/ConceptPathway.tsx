"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Info, Network, Layers } from "lucide-react";
import conceptsData from "../../data/concepts.json";
import { SupportedLanguage } from "@/lib/types";

interface ConceptPathwayProps {
  currentLang: SupportedLanguage;
}

export default function ConceptPathway({ currentLang }: ConceptPathwayProps) {
  const [selectedConceptId, setSelectedConceptId] = useState<string>("c9-poly-04");

  const selectedConcept =
    conceptsData.find((c) => c.id === selectedConceptId) || conceptsData[0];

  // Group concepts by Class
  const class7Concepts = conceptsData.filter((c) => c.class === 7 && c.chapter === "Integers");
  const class8Concepts = conceptsData.filter((c) => c.class === 8 && c.chapter.includes("Linear"));
  const class9Concepts = conceptsData.filter((c) => c.class === 9 && c.chapter === "Polynomials");

  const t = {
    en: {
      sectionNum: "06 / CURRICULUM ARCHITECTURE & PREREQUISITE PATHWAY",
      headline: "Prerequisite Pathways Across Grades",
      subhead:
        "Mathematics concepts build upon each other across academic years. Click any concept node below to inspect its mathematical learning objective and trace its ancestors in our 21-node NCERT Directed Acyclic Graph.",
      class7Title: "Class 7 • Integers (Foundational Chapter)",
      class8Title: "Class 8 • Linear Equations in One Variable",
      class9Title: "Class 9 • Polynomials",
      inspectorTitle: "Concept Inspector",
      objectiveLabel: "NCERT Learning Objective",
      prereqLabel: "Direct Prerequisites in DAG",
      noPrereq: "Foundational entry concept. No earlier prerequisites required.",
      verifiedTag: "Valid acyclic graph verified via depth-first topological search (0 cycles).",
    },
    hi: {
      sectionNum: "06 / पाठ्यक्रम वास्तुकला और पूर्वापेक्षा पथ",
      headline: "कक्षाओं के बीच परस्पर जुड़े गणितीय संप्रत्यय",
      subhead:
        "गणित में संप्रत्यय वर्षों के साथ एक-दूसरे पर निर्मित होते हैं। किसी भी नोड पर क्लिक करके उसके शिक्षण उद्देश्य और पूर्व-आवश्यकताओं का विश्लेषण करें।",
      class7Title: "कक्षा 7 • पूर्णांक (आधारभूत अध्याय)",
      class8Title: "कक्षा 8 • एक चर वाले रैखिक समीकरण",
      class9Title: "कक्षा 9 • बहुपद",
      inspectorTitle: "संप्रत्यय विश्लेषक",
      objectiveLabel: "एनसीईआरटी शिक्षण उद्देश्य",
      prereqLabel: "DAG में प्रत्यक्ष पूर्व-आवश्यकताएँ",
      noPrereq: "आधारभूत प्रवेश संप्रत्यय। किसी पूर्व-आवश्यकता की आवश्यकता नहीं।",
      verifiedTag: "गहन टोपोलॉजिकल खोज द्वारा अचक्रीय ग्राफ सत्यापित (शून्य चक्र)।",
    },
    te: {
      sectionNum: "06 / పాఠ్యాంశాల నెట్‌వర్క్ & పునాది లింకులు",
      headline: "తరగతుల వారీగా అనుసంధాన కాన్సెప్ట్ మార్గాలు",
      subhead:
        "గణితంలో ప్రతి కాన్సెప్ట్ మునుపటి తరగతుల పునాదిపై ఆధారపడి ఉంటుంది. ఏదైనా కాన్సెప్ట్‌ను ఎంచుకుని దాని NCERT అభ్యాస లక్ష్యం మరియు మునుపటి లింకులను పరిశీలించండి.",
      class7Title: "7వ తరగతి • పూర్ణ సంఖ్యలు (పునాది పాఠం)",
      class8Title: "8వ తరగతి • ఒకే చరరాశి కలిగిన ఏకఘాత సమీకరణాలు",
      class9Title: "9వ తరగతి • బహుపదులు",
      inspectorTitle: "కాన్సెప్ట్ వివరాలు",
      objectiveLabel: "NCERT అభ్యాస లక్ష్యం",
      prereqLabel: "DAG లో ప్రత్యక్ష పునాది అంశాలు",
      noPrereq: "ప్రాథమిక ప్రవేశ కాన్సెప్ట్. మునుపటి లింకులు అవసరం లేదు.",
      verifiedTag: "టోపోలాజికల్ శోధన ద్వారా ధృవీకరించబడిన నెట్‌వర్క్ (సున్నా సైకిల్స్).",
    },
  }[currentLang];

  return (
    <section id="concept-pathway" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
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

      {/* Interactive DAG Visual Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Concepts by Grade */}
        <div className="lg:col-span-8 space-y-6">
          {/* Class 7 Column */}
          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C7DDAE]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                  {t.class7Title}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF3DA] text-accent border border-[#FCD685] font-bold">
                4 Concepts
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {class7Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`p-3.5 rounded-[14px] border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-[#FFF3DA] shadow-warm-sm scale-[1.01]"
                        : "border-[#C7DDAE]/70 hover:border-primary bg-background/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                      <span className="font-bold">{c.id}</span>
                      {c.prerequisites.length > 0 && (
                        <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-[#C7DDAE]">
                          {c.prerequisites.length} prereq
                        </span>
                      )}
                    </div>
                    <div className="font-heading text-xs sm:text-sm font-bold text-foreground leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 8 Column */}
          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C7DDAE]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                  {t.class8Title}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5E1] text-primary border border-[#B7DE9E] font-bold">
                5 Concepts
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {class8Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`p-3.5 rounded-[14px] border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-[#EAF5E1] shadow-warm-sm scale-[1.01]"
                        : "border-[#C7DDAE]/70 hover:border-primary bg-background/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                      <span className="font-bold">{c.id}</span>
                      {c.prerequisites.length > 0 && (
                        <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-[#C7DDAE]">
                          {c.prerequisites.length} prereq
                        </span>
                      )}
                    </div>
                    <div className="font-heading text-xs sm:text-sm font-bold text-foreground leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 9 Column */}
          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C7DDAE]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F4A1E] inline-block" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2F4A1E]">
                  {t.class9Title}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5E1] text-[#2F4A1E] border border-[#B7DE9E] font-bold">
                5 Concepts
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {class9Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`p-3.5 rounded-[14px] border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#2F4A1E] bg-[#EAF5E1] shadow-warm-sm scale-[1.01]"
                        : "border-[#C7DDAE]/70 hover:border-primary bg-background/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                      <span className="font-bold">{c.id}</span>
                      {c.prerequisites.length > 0 && (
                        <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-[#C7DDAE]">
                          {c.prerequisites.length} prereq
                        </span>
                      )}
                    </div>
                    <div className="font-heading text-xs sm:text-sm font-bold text-foreground leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Node Details Inspector */}
        <div className="lg:col-span-4">
          <div className="bg-card rounded-[22px] border-2 border-[#C7DDAE] p-6 shadow-warm space-y-5 sticky top-24">
            <div className="border-b border-[#C7DDAE]/60 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Info className="w-4 h-4 text-accent" />
                <span>{t.inspectorTitle}</span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-background border border-[#C7DDAE] text-primary">
                Class {selectedConcept.class}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-muted-foreground block">
                ID: {selectedConcept.id} • Chapter: {selectedConcept.chapter}
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground leading-snug">
                {selectedConcept.name[currentLang]}
              </h3>
            </div>

            {/* Learning Objective */}
            <div className="p-4 bg-background rounded-[14px] border border-[#C7DDAE] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                {t.objectiveLabel}
              </span>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                {selectedConcept.learningObjective[currentLang]}
              </p>
            </div>

            {/* Direct Prerequisites */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                {t.prereqLabel} ({selectedConcept.prerequisites.length})
              </span>
              {selectedConcept.prerequisites.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-background p-3 rounded-[12px] border border-[#C7DDAE]/60">
                  {t.noPrereq}
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedConcept.prerequisites.map((pId) => {
                    const pConcept = conceptsData.find((c) => c.id === pId);
                    return (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setSelectedConceptId(pId)}
                        className="w-full p-3 rounded-[12px] bg-[#FFF3DA] border border-[#FCD685] text-left flex items-center justify-between text-xs hover:bg-[#FFE8BF] transition-colors cursor-pointer group"
                      >
                        <span className="font-heading font-bold text-foreground group-hover:text-accent">
                          {pConcept ? pConcept.name[currentLang] : pId}
                        </span>
                        <span className="text-[10px] font-mono text-accent font-bold">
                          {pId}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground border-t border-[#C7DDAE]/60 pt-3 font-sans">
              {t.verifiedTag}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
