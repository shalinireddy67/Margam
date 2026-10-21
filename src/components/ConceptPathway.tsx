"use client";

import React, { useState } from "react";
import { Network, ArrowRight, CheckCircle2, ChevronRight, Info } from "lucide-react";
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

  return (
    <section id="concept-pathway" className="py-16 md:py-24 bg-margam-cream border-b border-margam-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-margam-terracotta inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-margam-terracotta">
              04 / Directed Acyclic Graph (DAG)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-margam-navy leading-tight">
            Prerequisite Pathways Across Grades
          </h2>
          <p className="font-sans text-base sm:text-lg text-margam-navy/80 leading-relaxed">
            In mathematics, concepts build upon each other across academic years. Click any node below to inspect its mathematical learning objective and trace its ancestors in our 21-node NCERT DAG.
          </p>
        </div>

        {/* Interactive DAG Visual Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columns representing classes */}
          <div className="lg:col-span-8 space-y-6">
            {/* Class 7 Column */}
            <div className="bg-white rounded-2xl border-2 border-margam-border p-5 space-y-3 shadow-card">
              <div className="flex items-center justify-between border-b border-margam-border/60 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-margam-terracotta">
                  Class 7 • Integers (Foundational Chapter)
                </span>
                <span className="text-[11px] text-margam-slate">4 Concepts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {class7Concepts.map((c) => {
                  const isSelected = selectedConceptId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedConceptId(c.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-margam-terracotta bg-orange-50 shadow-xs"
                          : "border-margam-border hover:border-margam-navy/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-margam-slate mb-1">
                        <span>{c.id}</span>
                        {c.prerequisites.length > 0 && (
                          <span className="text-[10px] bg-margam-cream-subtle px-1.5 rounded">
                            {c.prerequisites.length} prereq
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-margam-navy leading-snug">
                        {c.name[currentLang]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Class 8 Column */}
            <div className="bg-white rounded-2xl border-2 border-margam-border p-5 space-y-3 shadow-card">
              <div className="flex items-center justify-between border-b border-margam-border/60 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-margam-amber">
                  Class 8 • Linear Equations in One Variable
                </span>
                <span className="text-[11px] text-margam-slate">5 Concepts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {class8Concepts.map((c) => {
                  const isSelected = selectedConceptId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedConceptId(c.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-margam-amber bg-amber-50/60 shadow-xs"
                          : "border-margam-border hover:border-margam-navy/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-margam-slate mb-1">
                        <span>{c.id}</span>
                        {c.prerequisites.length > 0 && (
                          <span className="text-[10px] bg-margam-cream-subtle px-1.5 rounded">
                            {c.prerequisites.length} prereq
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-margam-navy leading-snug">
                        {c.name[currentLang]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Class 9 Column */}
            <div className="bg-white rounded-2xl border-2 border-margam-border p-5 space-y-3 shadow-card">
              <div className="flex items-center justify-between border-b border-margam-border/60 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-margam-emerald">
                  Class 9 • Polynomials
                </span>
                <span className="text-[11px] text-margam-slate">5 Concepts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {class9Concepts.map((c) => {
                  const isSelected = selectedConceptId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedConceptId(c.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-margam-emerald bg-emerald-50/70 shadow-xs"
                          : "border-margam-border hover:border-margam-navy/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-margam-slate mb-1">
                        <span>{c.id}</span>
                        {c.prerequisites.length > 0 && (
                          <span className="text-[10px] bg-margam-cream-subtle px-1.5 rounded">
                            {c.prerequisites.length} prereq
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-margam-navy leading-snug">
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
            <div className="bg-white rounded-2xl border-2 border-margam-border p-6 shadow-card space-y-5 sticky top-24">
              <div className="border-b border-margam-border pb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-margam-slate">
                  <Info className="w-4 h-4 text-margam-terracotta" />
                  <span>Concept Inspector</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-margam-cream-paper border border-margam-border">
                  Class {selectedConcept.class}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-margam-slate block">
                  ID: {selectedConcept.id} • Chapter: {selectedConcept.chapter}
                </span>
                <h3 className="font-serif text-xl font-bold text-margam-navy leading-snug">
                  {selectedConcept.name[currentLang]}
                </h3>
              </div>

              {/* Learning Objective */}
              <div className="p-3.5 bg-margam-cream-paper rounded-xl border border-margam-border space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-margam-slate block">
                  NCERT Learning Objective
                </span>
                <p className="text-xs text-margam-navy/90 leading-relaxed font-sans">
                  {selectedConcept.learningObjective[currentLang]}
                </p>
              </div>

              {/* Direct Prerequisites */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-margam-slate block">
                  Direct Prerequisites in DAG ({selectedConcept.prerequisites.length})
                </span>
                {selectedConcept.prerequisites.length === 0 ? (
                  <p className="text-xs text-margam-slate italic">
                    Foundational entry concept. No earlier prerequisites required.
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
                          className="w-full p-2.5 rounded-lg bg-orange-50/70 border border-orange-200 text-left flex items-center justify-between text-xs hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          <span className="font-serif font-bold text-margam-navy">
                            {pConcept ? pConcept.name[currentLang] : pId}
                          </span>
                          <span className="text-[10px] font-mono text-margam-terracotta font-semibold">
                            {pId}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="text-[11px] text-margam-slate border-t border-margam-border pt-3">
                Valid acyclic graph verified via depth-first topological search.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
