"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Network, ArrowRight, AlertCircle, Sparkles, Check } from "lucide-react";
import conceptsData from "../../data/concepts.json";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";

interface ConceptPathwayProps {
  currentLang?: SupportedLanguage;
  profile?: LearnerProfile | null;
}

export type BlockState = "solid" | "shaky" | "cracked" | "locked";

export default function ConceptPathway({
  currentLang = "en",
  profile: propProfile,
}: ConceptPathwayProps) {
  const [profile, setProfile] = useState<LearnerProfile | null>(propProfile || null);
  const [selectedConceptId, setSelectedConceptId] = useState<string>("c7-int-01");

  useEffect(() => {
    if (!profile) {
      const active = getActiveProfile();
      if (active) setProfile(active);
    }
  }, [profile]);

  // Key sequential prerequisite spine across Classes 6 to 10
  const spineConceptIds = [
    "c6-neg-01",
    "c6-neg-02",
    "c7-int-01",
    "c7-int-02",
    "c8-dist-01",
    "c8-dist-02",
    "c9-id-01",
    "c9-id-02",
    "c10-quad-01",
    "c10-quad-02",
  ];

  const spineConcepts = spineConceptIds
    .map((id) => conceptsData.find((c) => c.id === id))
    .filter(Boolean) as (typeof conceptsData)[0][];

  // Helper to determine block state for each concept
  const getConceptBlockState = (conceptId: string): {
    state: BlockState;
    label: string;
    pattern: string;
    isRootGap: boolean;
  } => {
    const isRootGap =
      profile?.activeGap?.rootConceptId === conceptId ||
      (!profile && conceptId === "c7-int-01"); // Demo fallback shows cracked block

    if (isRootGap) {
      return {
        state: "cracked",
        label: "Gap",
        pattern: "[ / | \\ ]",
        isRootGap: true,
      };
    }

    const prog = profile?.topicProgress?.[conceptId];

    // If completed
    if (prog?.status === "completed") {
      // Check if due for spaced review
      const isReviewDue = prog.worksheetScore !== undefined && prog.worksheetScore < 3;
      if (isReviewDue) {
        return {
          state: "shaky",
          label: "Review",
          pattern: "[ ~ ~ ~ ]",
          isRootGap: false,
        };
      }
      return {
        state: "solid",
        label: "Mastered",
        pattern: "[ / / / ]",
        isRootGap: false,
      };
    }

    // Default demo states for presentation if no deep progress yet
    if (!profile) {
      if (["c6-neg-01", "c6-neg-02"].includes(conceptId)) {
        return { state: "solid", label: "Mastered", pattern: "[ / / / ]", isRootGap: false };
      }
      if (conceptId === "c7-int-02") {
        return { state: "shaky", label: "Review", pattern: "[ ~ ~ ~ ]", isRootGap: false };
      }
    }

    if (prog?.status === "available" || prog?.status === "in_progress") {
      return {
        state: "shaky",
        label: "Review",
        pattern: "[ ~ ~ ~ ]",
        isRootGap: false,
      };
    }

    return {
      state: "locked",
      label: "Locked",
      pattern: "[ - - - ]",
      isRootGap: false,
    };
  };

  const selectedConcept =
    conceptsData.find((c) => c.id === selectedConceptId) || spineConcepts[0];
  const selectedState = getConceptBlockState(selectedConcept.id);

  // Group spine by Grade
  const grades = [6, 7, 8, 9, 10];

  return (
    <section
      id="concept-pathway"
      aria-label="Class Chain Path Map"
      className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-[1200px] mx-auto text-[#1E1610]"
    >
      {/* Header with Legend */}
      <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] font-heading font-extrabold text-xs shadow-[1px_1px_0px_#1E1610]">
              <Network className="w-3.5 h-3.5" />
              <span>Classes 6–10 Prerequisite Backbone</span>
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1E1610]">
              Math Path Map: Classes 6 to 10
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans max-w-2xl">
              Mathematics connects across grades. Solid grass blocks are mastered, cracked blocks show diagnosed gaps, shaky blocks need review, and stone blocks unlock as prerequisites are cleared.
            </p>
          </div>

          {/* Block State Legend (Color + Pattern + Label) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#E8CF9C]/80 p-2 border-2 border-[#1E1610] text-[11px] font-heading font-extrabold shrink-0">
            {/* Solid */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#6DB33F] text-[#1E1610] border border-[#1E1610]">
              <span>[///]</span>
              <span>Mastered</span>
            </div>
            {/* Shaky */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#F2C230] text-[#1E1610] border border-[#1E1610]">
              <span>[~~~]</span>
              <span>Review</span>
            </div>
            {/* Cracked */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#D1362B] text-[#F3E3BC] border border-[#1E1610]">
              <span>[/|\/]</span>
              <span>Gap</span>
            </div>
            {/* Locked */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#B9BCC0] text-[#1E1610] border border-[#1E1610]">
              <span>[---]</span>
              <span>Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Grade Tiles Chain (Left 8 cols) + Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chain Across Classes 6–10 */}
        <div className="lg:col-span-8 space-y-5">
          {grades.map((grade) => {
            const gradeConcepts = spineConcepts.filter((c) => c.class === grade);
            if (gradeConcepts.length === 0) return null;

            return (
              <div
                key={grade}
                className="panel-plank p-4 sm:p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-3"
              >
                <div className="flex items-center justify-between border-b-2 border-[#1E1610]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#8CCB55] border-2 border-[#1E1610] text-[10px] font-heading font-extrabold flex items-center justify-center text-[#1E1610]">
                      {grade}
                    </span>
                    <span className="font-heading font-extrabold text-xs text-[#1E1610] uppercase tracking-wider">
                      Class {grade} Concepts
                    </span>
                  </div>
                  <span className="text-[11px] font-sans font-bold text-[#5A3720]">
                    {gradeConcepts.length} Topic{gradeConcepts.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gradeConcepts.map((concept) => {
                    const isSelected = selectedConceptId === concept.id;
                    const { state, label, pattern, isRootGap } = getConceptBlockState(concept.id);

                    // Dynamic styling based on block state
                    const styleConfig = {
                      solid: {
                        bg: "bg-[#6DB33F]",
                        text: "text-[#1E1610]",
                        border: "border-3 border-[#1E1610] border-t-4 border-t-[#8CCB55]",
                        badgeBg: "bg-[#1E1610] text-[#8CCB55]",
                      },
                      shaky: {
                        bg: "bg-[#F2C230]",
                        text: "text-[#1E1610]",
                        border: "border-3 border-[#1E1610]",
                        badgeBg: "bg-[#1E1610] text-[#F2C230]",
                      },
                      cracked: {
                        bg: "bg-[#D1362B]",
                        text: "text-[#F3E3BC]",
                        border: "border-3 border-[#1E1610]",
                        badgeBg: "bg-[#1E1610] text-[#F3E3BC]",
                      },
                      locked: {
                        bg: "bg-[#B9BCC0]",
                        text: "text-[#1E1610]",
                        border: "border-3 border-[#1E1610] opacity-80",
                        badgeBg: "bg-[#1E1610] text-[#B9BCC0]",
                      },
                    }[state];

                    return (
                      <button
                        key={concept.id}
                        type="button"
                        onClick={() => setSelectedConceptId(concept.id)}
                        className={`min-h-[80px] p-3.5 text-left transition-all cursor-pointer relative shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] ${
                          styleConfig.bg
                        } ${styleConfig.text} ${styleConfig.border} ${
                          isSelected ? "ring-3 ring-[#2F4FB5]" : ""
                        } ${
                          isRootGap
                            ? "animate-pulse shadow-[0_0_12px_rgba(209,54,43,0.7)]"
                            : ""
                        }`}
                      >
                        {/* Soft pulsing "Fix this first" badge if root gap */}
                        {isRootGap && (
                          <div className="absolute -top-3 right-2 bg-[#D1362B] text-[#F3E3BC] border-2 border-[#1E1610] px-2 py-0.5 text-[9px] font-heading font-extrabold uppercase shadow-[2px_2px_0px_#1E1610] animate-bounce">
                            ⚠️ Fix this first
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 opacity-90">
                          <span className="font-bold">{concept.id}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] font-heading font-extrabold border border-[#1E1610] ${styleConfig.badgeBg}`}>
                            {pattern} {label}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm font-heading font-extrabold leading-snug">
                          {concept.name[currentLang] || concept.name.en}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Concept Inspector Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 text-[#1E1610]">
            <div className="flex items-center justify-between border-b-2 border-[#1E1610]/20 pb-3">
              <span className="font-heading font-extrabold text-xs text-[#1E1610] uppercase tracking-wider">
                Block Details
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-heading font-extrabold border-2 border-[#1E1610] ${
                  selectedState.state === "cracked"
                    ? "bg-[#D1362B] text-[#F3E3BC]"
                    : selectedState.state === "solid"
                    ? "bg-[#6DB33F] text-[#1E1610]"
                    : selectedState.state === "shaky"
                    ? "bg-[#F2C230] text-[#1E1610]"
                    : "bg-[#B9BCC0] text-[#1E1610]"
                }`}
              >
                {selectedState.pattern} {selectedState.label}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#5A3720] block">
                Class {selectedConcept.class} • {selectedConcept.id}
              </span>
              <h3 className="font-heading font-extrabold text-base text-[#1E1610] leading-snug">
                {selectedConcept.name[currentLang] || selectedConcept.name.en}
              </h3>
            </div>

            {/* Learning Objective */}
            <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-1 text-xs">
              <span className="font-heading font-extrabold text-[10px] uppercase text-[#5A3720] block">
                Learning Objective
              </span>
              <p className="text-xs text-[#1E1610] leading-relaxed font-sans">
                {selectedConcept.learningObjective[currentLang] || selectedConcept.learningObjective.en}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2 text-xs">
              <span className="font-heading font-extrabold text-[10px] uppercase text-[#5A3720] block">
                Required Prerequisite Topics ({selectedConcept.prerequisites.length})
              </span>
              {selectedConcept.prerequisites.length === 0 ? (
                <p className="text-xs text-[#5A3720] italic p-2 bg-[#E8CF9C]/50 border border-[#1E1610]">
                  Foundational topic. No prior prerequisites required.
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
                        className="w-full p-2 bg-[#E8CF9C] hover:bg-[#D9B87A] border-2 border-[#1E1610] text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className="font-heading font-bold text-[#1E1610]">
                          {pConcept ? (pConcept.name[currentLang] || pConcept.name.en) : pId}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#5A3720]">{pId}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <Link
                href={`/lesson/${selectedConcept.id}`}
                className="w-full py-2.5 px-4 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#1E1610] flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] transition-all no-underline"
              >
                <span>{selectedState.state === "cracked" ? "Fix Foundation Lesson" : "Open Lesson"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
