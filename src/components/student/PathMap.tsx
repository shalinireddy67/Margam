"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Flame,
  Compass,
  BookOpen,
} from "lucide-react";
import { LearnerProfile, SupportedLanguage, Concept } from "@/lib/types";
import { getConceptById, resolveLocalizedString, getConceptsByChapter, getChaptersByClass } from "@/lib/curriculum";

interface PathMapProps {
  profile: LearnerProfile;
  currentLang?: SupportedLanguage;
}

interface PathNode {
  concept: Concept;
  status: "mastered" | "weak" | "in_progress" | "available" | "locked";
  mastery: number;
  isGapRoot: boolean;
  stepNumber: number;
}

const CHAIN_1_IDS = ["c6-neg-01", "c7-int-02", "c8-dist-01", "c9-id-01", "c10-quad-01"];
const CHAIN_2_IDS = ["c6-pat-01", "c7-alg-01", "c8-exp-01", "c9-poly-01", "c10-poly-01"];

export function PathMap({ profile, currentLang = "en" }: PathMapProps) {
  const [selectedChain, setSelectedChain] = useState<"chain1" | "chain2" | "grade">("chain1");

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const activeGapRootId = profile.activeGap && profile.activeGap.status !== "resolved" ? profile.activeGap.rootConceptId : null;
  const activeGapCurrentId = profile.activeGap && profile.activeGap.status !== "resolved" ? profile.activeGap.currentConceptId : null;

  // Resolve concept ids based on selected chain
  let targetConceptIds: string[] = [];
  if (selectedChain === "chain1") {
    targetConceptIds = CHAIN_1_IDS;
  } else if (selectedChain === "chain2") {
    targetConceptIds = CHAIN_2_IDS;
  } else {
    // Current class syllabus path
    const chapters = getChaptersByClass(studyClass);
    const ids: string[] = [];
    for (const ch of chapters) {
      const concepts = getConceptsByChapter(ch.id);
      for (const c of concepts) {
        if (!ids.includes(c.id)) ids.push(c.id);
      }
    }
    targetConceptIds = ids.slice(0, 6); // Take first 6 for clean visual path
  }

  // Build nodes with real student progress (no fake numbers)
  const nodes: PathNode[] = [];
  let prevMastered = true;

  targetConceptIds.forEach((id, idx) => {
    const concept = getConceptById(id);
    if (!concept) return;

    const prog = profile.topicProgress?.[id];
    const mastery = prog?.mastery !== undefined ? Math.round(prog.mastery) : (prog?.status === "completed" ? 85 : 0);
    const isGapRoot = activeGapRootId === id;
    const isGapCurrent = activeGapCurrentId === id;

    let status: PathNode["status"] = "available";

    if (isGapRoot || (prog && prog.mastery !== undefined && prog.mastery < 60) || (prog?.consecutiveIncorrect && prog.consecutiveIncorrect >= 2)) {
      status = "weak";
    } else if (prog?.status === "completed" || (prog?.mastery !== undefined && prog.mastery >= 75)) {
      status = "mastered";
    } else if (prog?.status === "in_progress" || (prog?.worksheetCompleted || prog?.lessonCompleted)) {
      status = "in_progress";
    } else if (idx === 0 || prevMastered || prog?.status === "available") {
      status = "available";
    } else {
      status = "locked";
    }

    // Keep track of progression chain
    prevMastered = status === "mastered" || status === "in_progress";

    nodes.push({
      concept,
      status,
      mastery,
      isGapRoot,
      stepNumber: idx + 1,
    });
  });

  return (
    <div className="bg-[#FFFDF7] p-5 sm:p-7 rounded-none border-3 border-[#2B1B0F] shadow-block space-y-5">
      {/* Header and Chain Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2B1B0F]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wide mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>LEARNING PATH MAP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B1B0F]">
            The Margam Progression Path
          </h2>
          <p className="text-xs text-[#2B1B0F]/80 font-sans mt-0.5">
            Your block-by-block journey from foundational roots up to Class {studyClass}.
          </p>
        </div>

        {/* Chain Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-[#FFF7E6] p-1 border-2 border-[#2B1B0F] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSelectedChain("chain1")}
            className={`px-3 py-1 text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedChain === "chain1"
                ? "bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-xs"
                : "text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
            }`}
          >
            Quadratics (C6–10)
          </button>
          <button
            type="button"
            onClick={() => setSelectedChain("chain2")}
            className={`px-3 py-1 text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedChain === "chain2"
                ? "bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-xs"
                : "text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
            }`}
          >
            Algebra (C6–10)
          </button>
          <button
            type="button"
            onClick={() => setSelectedChain("grade")}
            className={`px-3 py-1 text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedChain === "grade"
                ? "bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-xs"
                : "text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
            }`}
          >
            Class {studyClass} Syllabus
          </button>
        </div>
      </div>

      {/* Path Blocks Chain Grid */}
      <div className="relative">
        {/* Desktop & Tablet: Horizontal Flow Grid; Mobile: Vertical/Wrapped Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 relative z-10">
          {nodes.map((node, i) => {
            const isLast = i === nodes.length - 1;
            const conceptName = resolveLocalizedString(node.concept.name, currentLang).text;

            // Render block card depending on state
            if (node.status === "weak") {
              // WEAK / CRACKED BLOCK (RED / CRACKED TEXTURE)
              return (
                <div
                  key={node.concept.id}
                  className="relative p-4 bg-[#FFF0F0] border-3 border-[#D9453D] shadow-[4px_4px_0px_#D9453D] rounded-none flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-0.5"
                >
                  {/* Cracked visual indicator pattern */}
                  <div className="absolute top-1 right-1 opacity-20 pointer-events-none select-none text-2xl font-mono">
                    ⚡
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#D9453D] text-white text-[9px] font-pixel uppercase tracking-wider">
                        CRACKED
                      </span>
                      <span className="text-[10px] font-heading font-bold text-[#D9453D]">
                        Class {node.concept.class}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-pixel text-[#D9453D]/80">
                        STEP 0{node.stepNumber}
                      </div>
                      <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2B1B0F] mt-0.5 leading-snug">
                        {conceptName}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FDE8E8] text-[#D9453D] text-[10px] font-heading font-bold border border-[#D9453D]/40">
                      <AlertTriangle className="w-3 h-3 text-[#D9453D] shrink-0" />
                      <span>{node.isGapRoot ? "Root Misconception" : `Mastery ${node.mastery}%`}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D9453D]/30 mt-2">
                    <Link
                      href={`/student/worksheet/${node.concept.id}`}
                      className="w-full py-1.5 px-2.5 bg-[#D9453D] hover:bg-[#B8322B] text-white font-heading font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors no-underline"
                    >
                      <span>Fix Gap</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            }

            if (node.status === "mastered") {
              // MASTERED BLOCK (SOLID GRASS GREEN)
              return (
                <div
                  key={node.concept.id}
                  className="relative p-4 bg-[#5DAA3A] border-3 border-[#2B1B0F] shadow-block rounded-none flex flex-col justify-between min-h-[170px] text-[#2B1B0F] transition-transform hover:-translate-y-0.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#2B1B0F] text-[#FFF7E6] text-[9px] font-pixel uppercase tracking-wider">
                        SOLID
                      </span>
                      <span className="text-[10px] font-heading font-extrabold text-[#2B1B0F]">
                        Class {node.concept.class}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-pixel text-[#2B1B0F]/70">
                        STEP 0{node.stepNumber}
                      </div>
                      <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2B1B0F] mt-0.5 leading-snug">
                        {conceptName}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#2B1B0F]/10 text-[#2B1B0F] text-[10px] font-heading font-black">
                      <CheckCircle2 className="w-3 h-3 text-[#2B1B0F] shrink-0" />
                      <span>Mastered ({node.mastery > 0 ? `${node.mastery}%` : "100%"})</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2B1B0F]/20 mt-2 flex items-center justify-between text-[11px] font-heading font-bold">
                    <Link
                      href={`/student/worksheet/${node.concept.id}`}
                      className="text-[#2B1B0F] hover:underline flex items-center gap-1"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/student/lesson/${node.concept.id}`}
                      className="text-[#2B1B0F]/80 hover:underline"
                    >
                      Lesson
                    </Link>
                  </div>
                </div>
              );
            }

            if (node.status === "in_progress") {
              // IN PROGRESS (GOLD ACCENT BLOCK)
              return (
                <div
                  key={node.concept.id}
                  className="relative p-4 bg-[#F4C542] border-3 border-[#2B1B0F] shadow-block rounded-none flex flex-col justify-between min-h-[170px] text-[#2B1B0F] transition-transform hover:-translate-y-0.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#2B1B0F] text-[#F4C542] text-[9px] font-pixel uppercase tracking-wider">
                        ACTIVE
                      </span>
                      <span className="text-[10px] font-heading font-extrabold text-[#2B1B0F]">
                        Class {node.concept.class}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-pixel text-[#2B1B0F]/70">
                        STEP 0{node.stepNumber}
                      </div>
                      <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2B1B0F] mt-0.5 leading-snug">
                        {conceptName}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/60 text-[#2B1B0F] text-[10px] font-heading font-extrabold border border-[#2B1B0F]/20">
                      <Flame className="w-3 h-3 text-[#B8322B] fill-[#B8322B] shrink-0" />
                      <span>In Progress ({node.mastery}%)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2B1B0F]/20 mt-2">
                    <Link
                      href={`/student/worksheet/${node.concept.id}`}
                      className="w-full py-1.5 px-2.5 bg-[#2B1B0F] hover:bg-[#3D2615] text-[#FFF7E6] font-heading font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors no-underline"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3 text-[#F4C542]" />
                    </Link>
                  </div>
                </div>
              );
            }

            if (node.status === "available") {
              // AVAILABLE / UP NEXT (WHITE/CREAM BLOCK)
              return (
                <div
                  key={node.concept.id}
                  className="relative p-4 bg-[#FFFFFF] border-3 border-[#2B1B0F] shadow-block rounded-none flex flex-col justify-between min-h-[170px] text-[#2B1B0F] transition-transform hover:-translate-y-0.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#E2DDD5] text-[#2B1B0F] text-[9px] font-pixel uppercase tracking-wider">
                        READY
                      </span>
                      <span className="text-[10px] font-heading font-bold text-[#2B1B0F]/70">
                        Class {node.concept.class}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-pixel text-[#2B1B0F]/50">
                        STEP 0{node.stepNumber}
                      </div>
                      <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2B1B0F] mt-0.5 leading-snug">
                        {conceptName}
                      </h3>
                    </div>

                    <div className="text-[10px] font-heading font-bold text-[#5DAA3A]">
                      ● Up Next on Your Path
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2B1B0F]/15 mt-2 flex items-center justify-between text-[11px] font-heading font-bold">
                    <Link
                      href={`/student/lesson/${node.concept.id}`}
                      className="text-[#2B1B0F] hover:text-[#5DAA3A] flex items-center gap-1"
                    >
                      <span>Start Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            }

            // LOCKED BLOCK (STONE GRAY DASHED)
            return (
              <div
                key={node.concept.id}
                className="relative p-4 bg-[#EBE7DF] border-2 border-dashed border-[#8C827A] rounded-none flex flex-col justify-between min-h-[170px] text-[#8C827A] opacity-75"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 bg-[#D6D0C5] text-[#6E655F] text-[9px] font-pixel uppercase tracking-wider">
                      LOCKED
                    </span>
                    <span className="text-[10px] font-heading font-medium text-[#6E655F]">
                      Class {node.concept.class}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-pixel text-[#8C827A]">
                      STEP 0{node.stepNumber}
                    </div>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#6E655F] mt-0.5 leading-snug">
                      {conceptName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-heading font-medium text-[#8C827A]">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>Complete previous steps first</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D6D0C5] mt-2 text-[10px] font-heading font-bold text-slate-500">
                  Prerequisites required
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Path Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2B1B0F]/15 text-[11px] font-heading font-bold text-[#2B1B0F]/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#5DAA3A] border border-[#2B1B0F] inline-block" />
            <span>Mastered (Solid Block)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#FFF0F0] border-2 border-[#D9453D] inline-block" />
            <span className="text-[#D9453D]">Weak / Gap (Cracked Block)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#F4C542] border border-[#2B1B0F] inline-block" />
            <span>In Progress</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-white border border-[#2B1B0F] inline-block" />
            <span>Available</span>
          </span>
        </div>
        <span className="text-[10px] font-pixel text-[#2B1B0F]/60 uppercase">
          Adaptive Stepping Active
        </span>
      </div>
    </div>
  );
}
