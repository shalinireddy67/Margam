"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DiagnosticWidget from "@/components/DiagnosticWidget";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import ThreeStagesSection from "@/components/ThreeStagesSection";
import ConceptPathway from "@/components/ConceptPathway";
import IndianClassrooms from "@/components/IndianClassrooms";
import TeacherControl from "@/components/TeacherControl";
import StarterChapters from "@/components/StarterChapters";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import { SupportedLanguage } from "@/lib/types";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Section A: Navigation */}
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main id="main-content" className="flex-1">
        {/* Section B: Hero */}
        <Hero currentLang={currentLang} />

        {/* User Request Feature: Interactive 3-Question Diagnostic Widget */}
        <section className="px-4 sm:px-8 py-8 bg-margam-cream border-b border-margam-border">
          <DiagnosticWidget currentLang={currentLang} />
        </section>

        {/* Section C: The Problem (Class 6-10 Mathematics Dilemma) */}
        <ProblemSection currentLang={currentLang} />

        {/* Section D: The Margam Approach (Diagnose -> Adapt -> Check Again) */}
        <ApproachSection currentLang={currentLang} />

        {/* Section E: Learn, Solve, Test (3 Pedagogical Variants) */}
        <ThreeStagesSection currentLang={currentLang} />

        {/* Section F: Concept Pathway (Interactive DAG Explorer) */}
        <ConceptPathway currentLang={currentLang} />

        {/* Section G: Built for Indian Classrooms (Multilingual, Relatable Contexts, Printable A4) */}
        <IndianClassrooms currentLang={currentLang} />

        {/* Section H: Teachers Remain in Control (Classroom Grouping Engine) */}
        <TeacherControl currentLang={currentLang} />

        {/* Section I: Starter Mathematics Chapters (Class 7, 8, 9) */}
        <StarterChapters currentLang={currentLang} />

        {/* Section J: Development Roadmap (4 Phases) */}
        <RoadmapSection currentLang={currentLang} />
      </main>

      {/* Section K: Final CTA & Professional Footer */}
      <Footer />
    </div>
  );
}
