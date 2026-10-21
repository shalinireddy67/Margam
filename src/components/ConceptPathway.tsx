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
      badge: "The Concept Map",
      headline: "Explore the 21-Node Prerequisite Graph",
      subhead:
        "Math concepts connect across years. Click any topic below to see what you need to know first.",
      class7Title: "Class 7: Integers",
      class8Title: "Class 8: Linear Equations",
      class9Title: "Class 9: Polynomials",
      inspectorTitle: "Concept Details",
      objectiveLabel: "What You Learn",
      prereqLabel: "Must Know First",
      noPrereq: "Starting topic. No earlier prerequisites required.",
      verifiedTag: "100% verified acyclic graph (0 loops).",
    },
    hi: {
      badge: "संप्रत्यय ग्राफ",
      headline: "21 संप्रत्ययों का पूर्वापेक्षा ग्राफ",
      subhead:
        "गणित के संप्रत्यय एक-दूसरे से जुड़े हैं। किसी भी विषय पर क्लिक करके देखें कि पहले क्या आना चाहिए।",
      class7Title: "कक्षा 7: पूर्णांक",
      class8Title: "कक्षा 8: रैखिक समीकरण",
      class9Title: "कक्षा 9: बहुपद",
      inspectorTitle: "विषय विवरण",
      objectiveLabel: "सीखने का उद्देश्य",
      prereqLabel: "पहले यह आना चाहिए",
      noPrereq: "प्रारंभिक विषय। किसी पूर्व-आवश्यकता की आवश्यकता नहीं।",
      verifiedTag: "100% सत्यापित अचक्रीय ग्राफ।",
    },
    te: {
      badge: "కాన్సెప్ట్ నెట్‌వర్క్",
      headline: "21 కీలక కాన్సెప్ట్‌ల లింకులు",
      subhead:
        "గణితంలో ప్రతి అంశం మునుపటి తరగతులపై ఆధారపడుతుంది. ముందుగా ఏది నేర్చుకోవాలో చూడటానికి క్లిక్ చేయండి.",
      class7Title: "7వ తరగతి: పూర్ణ సంఖ్యలు",
      class8Title: "8వ తరగతి: ఏకఘాత సమీకరణాలు",
      class9Title: "9వ తరగతి: బహుపదులు",
      inspectorTitle: "కాన్సెప్ట్ సమాచారం",
      objectiveLabel: "అభ్యాస లక్ష్యం",
      prereqLabel: "ముందుగా తెలియాల్సినవి",
      noPrereq: "ప్రారంభ కాన్సెప్ట్. మునుపటి లింకులు అవసరం లేదు.",
      verifiedTag: "100% ఖచ్చితమైన నెట్‌వర్క్.",
    },
  }[currentLang];

  return (
    <section id="concept-pathway" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-light text-sage border border-sage-border text-xs sm:text-sm font-heading font-bold">
          <Network className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* Grid: Graph Columns + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3 Grade Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Class 7 Column */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E0E5D4] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E5D4]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-coral inline-block" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-coral">
                  {t.class7Title}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">4 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class7Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-coral bg-coral-light text-foreground shadow-xs font-bold"
                        : "border-[#E0E5D4] bg-background/50 hover:bg-background text-foreground/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                      <span>{c.id}</span>
                      {c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-heading leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 8 Column */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E0E5D4] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E5D4]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lemon inline-block" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-lemon">
                  {t.class8Title}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">5 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class8Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-lemon bg-lemon-light text-foreground shadow-xs font-bold"
                        : "border-[#E0E5D4] bg-background/50 hover:bg-background text-foreground/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                      <span>{c.id}</span>
                      {c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-heading leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 9 Column */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E0E5D4] shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E5D4]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sage inline-block" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-sage">
                  {t.class9Title}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">5 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class9Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-sage bg-sage-light text-foreground shadow-xs font-bold"
                        : "border-[#E0E5D4] bg-background/50 hover:bg-background text-foreground/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                      <span>{c.id}</span>
                      {c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-heading leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Concept Inspector Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-[#F9F7E8] rounded-3xl p-6 border border-[#E0E5D4] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E5D4]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {t.inspectorTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-xs font-bold text-coral border border-[#E0E5D4]">
                Class {selectedConcept.class}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground">{selectedConcept.id}</span>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {selectedConcept.name[currentLang]}
              </h3>
            </div>

            {/* Learning Objective */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#E0E5D4] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block">
                {t.objectiveLabel}
              </span>
              <p className="text-xs text-foreground/85 leading-relaxed font-sans">
                {selectedConcept.learningObjective[currentLang]}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground block">
                {t.prereqLabel} ({selectedConcept.prerequisites.length})
              </span>
              {selectedConcept.prerequisites.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-white p-3 rounded-2xl border border-[#E0E5D4]">
                  {t.noPrereq}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedConcept.prerequisites.map((pId) => {
                    const pConcept = conceptsData.find((c) => c.id === pId);
                    return (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setSelectedConceptId(pId)}
                        className="w-full min-h-[44px] p-2.5 rounded-xl bg-white border border-[#E0E5D4] text-left flex items-center justify-between text-xs hover:border-coral transition-colors cursor-pointer"
                      >
                        <span className="font-heading font-bold text-foreground">
                          {pConcept ? pConcept.name[currentLang] : pId}
                        </span>
                        <span className="text-[10px] font-mono text-coral font-bold">{pId}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E0E5D4] text-[11px] font-mono text-sage text-center">
              {t.verifiedTag}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
