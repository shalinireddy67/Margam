"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Info, Network, Layers, Sparkles } from "lucide-react";
import conceptsData from "../../data/concepts.json";
import { SupportedLanguage } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";

interface ConceptPathwayProps {
  currentLang: SupportedLanguage;
}

export default function ConceptPathway({ currentLang }: ConceptPathwayProps) {
  const [selectedConceptId, setSelectedConceptId] = useState<string>("c9-poly-04");
  const [resolvedGapIds, setResolvedGapIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const prof = getActiveProfile();
    if (prof?.resolvedGaps && prof.resolvedGaps.length > 0) {
      setResolvedGapIds(new Set(prof.resolvedGaps.map((g) => g.rootConceptId)));
    }
  }, []);

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
    <section id="concept-pathway" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5DAA3A] text-[#FFF7E6] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] font-pixel text-xs">
          <Network className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#2B1B0F] tracking-wide">
          {t.headline}
        </h2>
        <p className="text-[#5A3720] text-sm sm:text-base leading-relaxed font-sans font-medium">
          {t.subhead}
        </p>
      </div>

      {/* Grid: Graph Columns + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3 Grade Columns with smooth mobile panning */}
        <div className="lg:col-span-8 space-y-6 overflow-x-auto pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
          {/* Class 7 Column */}
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#E5D7BE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#E04A3F] border border-[#422816] inline-block" />
                <span className="font-pixel text-xs tracking-wider text-[#A03028]">
                  {t.class7Title}
                </span>
              </div>
              <span className="text-xs font-mono text-[#7A4B2A] font-bold">4 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class7Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                const isResolvedGap = resolvedGapIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 border-[2px] text-left transition-all cursor-pointer relative ${
                      isResolvedGap ? "animate-voxel-glow border-[#5DAA3A] bg-[#2F6B22]/20 shadow-[0_0_12px_rgba(93,170,58,0.5)]" : ""
                    } ${
                      isSelected
                        ? "border-[#422816] bg-[#3FA7C9] text-[#FFF7E6] shadow-[3px_3px_0px_#1B120C] font-bold"
                        : "border-[#422816]/30 bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#2B1B0F] hover:border-[#422816]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-80 mb-1">
                      <span>{c.id}</span>
                      {isResolvedGap ? (
                        <span className="text-[10px] font-heading font-extrabold text-[#79B82A]">✨ GAP FIXED</span>
                      ) : (
                        c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 8 Column */}
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#E5D7BE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#F4C542] border border-[#422816] inline-block" />
                <span className="font-pixel text-xs tracking-wider text-[#8A6310]">
                  {t.class8Title}
                </span>
              </div>
              <span className="text-xs font-mono text-[#7A4B2A] font-bold">5 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class8Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                const isResolvedGap = resolvedGapIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 border-[2px] text-left transition-all cursor-pointer relative ${
                      isResolvedGap ? "animate-voxel-glow border-[#5DAA3A] bg-[#2F6B22]/20 shadow-[0_0_12px_rgba(93,170,58,0.5)]" : ""
                    } ${
                      isSelected
                        ? "border-[#422816] bg-[#3FA7C9] text-[#FFF7E6] shadow-[3px_3px_0px_#1B120C] font-bold"
                        : "border-[#422816]/30 bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#2B1B0F] hover:border-[#422816]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-80 mb-1">
                      <span>{c.id}</span>
                      {isResolvedGap ? (
                        <span className="text-[10px] font-heading font-extrabold text-[#79B82A]">✨ GAP FIXED</span>
                      ) : (
                        c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-snug">
                      {c.name[currentLang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class 9 Column */}
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] shadow-[4px_4px_0px_#1B120C] p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#E5D7BE]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#5DAA3A] border border-[#422816] inline-block" />
                <span className="font-pixel text-xs tracking-wider text-[#2F6B22]">
                  {t.class9Title}
                </span>
              </div>
              <span className="text-xs font-mono text-[#7A4B2A] font-bold">5 Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {class9Concepts.map((c) => {
                const isSelected = selectedConceptId === c.id;
                const isResolvedGap = resolvedGapIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConceptId(c.id)}
                    className={`min-h-[48px] p-3 border-[2px] text-left transition-all cursor-pointer relative ${
                      isResolvedGap ? "animate-voxel-glow border-[#5DAA3A] bg-[#2F6B22]/20 shadow-[0_0_12px_rgba(93,170,58,0.5)]" : ""
                    } ${
                      isSelected
                        ? "border-[#422816] bg-[#3FA7C9] text-[#FFF7E6] shadow-[3px_3px_0px_#1B120C] font-bold"
                        : "border-[#422816]/30 bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#2B1B0F] hover:border-[#422816]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-80 mb-1">
                      <span>{c.id}</span>
                      {isResolvedGap ? (
                        <span className="text-[10px] font-heading font-extrabold text-[#79B82A]">✨ GAP FIXED</span>
                      ) : (
                        c.prerequisites.length > 0 && <span>{c.prerequisites.length} prereq</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-snug">
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
          <div className="bg-[#5A3720] text-[#FFF7E6] border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#7A4B2A]">
              <span className="font-pixel text-xs uppercase tracking-wider text-[#FFE9A8]">
                {t.inspectorTitle}
              </span>
              <span className="px-2.5 py-0.5 bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816] font-pixel text-xs">
                Class {selectedConcept.class}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#E5D7BE]">{selectedConcept.id}</span>
              <h3 className="font-pixel text-base text-[#FFF7E6] leading-snug">
                {selectedConcept.name[currentLang]}
              </h3>
            </div>

            {/* Learning Objective */}
            <div className="p-3.5 bg-[#FFF7E6] text-[#2B1B0F] border-[2px] border-[#422816] space-y-1">
              <span className="font-pixel text-[10px] uppercase text-[#7A4B2A] block">
                {t.objectiveLabel}
              </span>
              <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans">
                {selectedConcept.learningObjective[currentLang]}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <span className="font-pixel text-[10px] uppercase text-[#FFE9A8] block">
                {t.prereqLabel} ({selectedConcept.prerequisites.length})
              </span>
              {selectedConcept.prerequisites.length === 0 ? (
                <p className="text-xs text-[#FFF7E6] italic bg-[#422816] p-3 border border-[#7A4B2A]">
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
                        className="w-full min-h-[44px] p-2.5 bg-[#FFF7E6] border-[2px] border-[#422816] text-[#2B1B0F] text-left flex items-center justify-between text-xs hover:bg-[#FFE9A8] transition-colors cursor-pointer"
                      >
                        <span className="font-bold">
                          {pConcept ? pConcept.name[currentLang] : pId}
                        </span>
                        <span className="text-[10px] font-mono text-[#7A4B2A] font-bold">{pId}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#7A4B2A] text-[11px] font-mono text-[#FFE9A8] text-center">
              {t.verifiedTag}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
