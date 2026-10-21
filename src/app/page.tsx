"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import DiagnosticWidget from "@/components/DiagnosticWidget";
import VitalStatsSection from "@/components/VitalStatsSection";
import ConceptPathway from "@/components/ConceptPathway";
import TeacherControl from "@/components/TeacherControl";
import ThreeStagesSection from "@/components/ThreeStagesSection";
import StarterChapters from "@/components/StarterChapters";
import IndianClassrooms from "@/components/IndianClassrooms";
import FaqSection from "@/components/FaqSection";
import PilotFormSection from "@/components/PilotFormSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { SupportedLanguage } from "@/lib/types";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation Bar with Vernacular Switcher (EN, हिन्दी, తెలుగు) */}
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main id="main-content" className="flex-1">
        {/* 01 / THE COVER STORY */}
        <Hero currentLang={currentLang} />

        <SectionDivider />

        {/* 02 / THE CLASSROOM DILEMMA */}
        <ProblemSection currentLang={currentLang} />

        <SectionDivider />

        {/* 03 / HOW THE AGENT WORKS : VISUAL SAMPLES */}
        <ApproachSection currentLang={currentLang} />

        <SectionDivider />

        {/* 04 / INTERACTIVE WORKFLOW CASE FILES */}
        <section className="px-4 sm:px-8 py-8">
          <DiagnosticWidget currentLang={currentLang} />
        </section>

        <SectionDivider />

        {/* 05 / VITAL STATISTICS */}
        <VitalStatsSection currentLang={currentLang} />

        <SectionDivider />

        {/* 06 / CURRICULUM ARCHITECTURE & PREREQUISITE PATHWAY */}
        <ConceptPathway currentLang={currentLang} />

        <SectionDivider />

        {/* 07 / TEACHERS REMAIN IN CONTROL */}
        <TeacherControl currentLang={currentLang} />

        <SectionDivider />

        {/* 08 / ADAPTIVE PEDAGOGY: LEARN • SOLVE • TEST */}
        <ThreeStagesSection currentLang={currentLang} />

        <SectionDivider />

        {/* 09 / STARTER MATHEMATICS MODULES */}
        <StarterChapters currentLang={currentLang} />

        <SectionDivider />

        {/* 10 / BUILT FOR INDIAN CLASSROOM REALITIES */}
        <IndianClassrooms currentLang={currentLang} />

        <SectionDivider />

        {/* 11 / INQUIRIES & FAQ */}
        <FaqSection currentLang={currentLang} />

        <SectionDivider />

        {/* 12 / SCHOOL PILOT REQUEST */}
        <PilotFormSection currentLang={currentLang} />

        <SectionDivider />

        {/* 13 / DEVELOPMENT ROADMAP */}
        <RoadmapSection currentLang={currentLang} />
      </main>

      {/* Footer & Final Call to Action */}
      <Footer />
    </div>
  );
}
