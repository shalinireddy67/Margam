"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import DiagnosticWidget from "@/components/DiagnosticWidget";
import ConceptPathway from "@/components/ConceptPathway";
import TeacherControl from "@/components/TeacherControl";
import IndianClassrooms from "@/components/IndianClassrooms";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";
import { SupportedLanguage } from "@/lib/types";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 1. Navbar: Desktop Top Bar + Phone Bottom Tab Bar */}
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main id="main-content" className="flex-1 space-y-6 sm:space-y-10">
        {/* 2. Hero: Clean Card Layout + Sample Student Progress Card */}
        <Hero currentLang={currentLang} />

        {/* 3. The Problem: The 38% Puzzle */}
        <ProblemSection currentLang={currentLang} />

        {/* 4. How It Works: Learn • Solve • Test */}
        <ApproachSection currentLang={currentLang} />

        {/* 5. Diagnostic Simulator: Try 3 Questions */}
        <DiagnosticWidget currentLang={currentLang} />

        {/* 6. Concept Map: Interactive 21-Node DAG */}
        <ConceptPathway currentLang={currentLang} />

        {/* 7. Teacher View: Classroom Grouping Engine */}
        <TeacherControl currentLang={currentLang} />

        {/* 8. Made for India: 3 Languages, Relatable Math, A4 Print */}
        <IndianClassrooms currentLang={currentLang} />

        {/* 9. Roadmap: What is Next */}
        <RoadmapSection currentLang={currentLang} />
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
