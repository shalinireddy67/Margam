"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Compass, Sparkles, BookOpen } from "lucide-react";
import questionsData from "../../data/questions.json";
import conceptsData from "../../data/concepts.json";
import lessonsData from "../../data/lessons.json";
import { SupportedLanguage } from "@/lib/types";

interface DiagnosticWidgetProps {
  currentLang?: SupportedLanguage;
}

export default function DiagnosticWidget({ currentLang = "en" }: DiagnosticWidgetProps) {
  const [lang, setLang] = useState<SupportedLanguage>(currentLang);
  const [selectedGrade, setSelectedGrade] = useState<number>(9);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showLessonPreview, setShowLessonPreview] = useState<boolean>(false);

  // 3 sequential diagnostic questions representing Class 9 -> Class 8 -> Class 7 DAG
  const diagnosticQuestionIds = ["q-poly-02", "q-lin-02", "q-int-02"];
  const currentQuestions = diagnosticQuestionIds.map((id) =>
    questionsData.find((q) => q.id === id)
  ).filter(Boolean);

  const activeQ = currentQuestions[currentStep];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < currentQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setSubmitted(false);
    setShowLessonPreview(false);
  };

  const rootLesson = lessonsData.find((l) => l.conceptId === "c7-int-02");

  const stepsList = [
    "01. Select Student",
    "02. Check Learning",
    "03. Find Gaps",
    "04. Practice Plan",
    "05. Check Again",
  ];

  return (
    <div id="try-diagnostic" className="w-full max-w-7xl mx-auto my-6">
      {/* Numbered Section Header matching ShikshaGap */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#C7DDAE]/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>04 / INTERACTIVE WORKFLOW CASE FILES</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold mt-1 text-foreground">
            How the Agent Runs in Five Steps
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-muted-foreground max-w-md">
          Select a class and test student records below to experience diagnostic checking, DAG backtracking, and 5-day practice sequences.
        </p>
      </div>

      {/* Grade Selector Box */}
      <div className="mb-6 p-5 rounded-[24px] border border-[#C7DDAE] bg-[#C7DDAE]/20">
        <div className="text-xs font-sans uppercase tracking-wider text-primary mb-3 font-bold">
          Select Grade to Explore Middle & High School Cases:
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 max-w-md">
          {[6, 7, 8, 9, 10].map((gr) => (
            <button
              key={gr}
              type="button"
              onClick={() => setSelectedGrade(gr)}
              className={`min-h-[46px] px-2 py-2 text-xs sm:text-sm font-bold rounded-[14px] border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                selectedGrade === gr
                  ? "border-primary bg-primary text-primary-foreground shadow-warm"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              <span>Class {gr}</span>
              <span className="text-[10px] font-normal opacity-85 leading-none">
                {gr <= 8 ? "Middle" : "Secondary"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Process Step Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6 text-xs font-sans">
        {stepsList.map((stepText, idx) => (
          <div
            key={idx}
            className={`min-h-[44px] px-3.5 py-2 rounded-full border text-center font-bold flex items-center justify-center transition-all ${
              (currentStep === idx && !submitted) || (submitted && idx === 4)
                ? "border-primary bg-primary text-primary-foreground shadow-warm"
                : "border-[#C7DDAE] bg-[#FFF7E6] text-foreground/80"
            }`}
          >
            {stepText}
          </div>
        ))}
      </div>

      {/* Main Interactive Card */}
      <div className="rounded-[28px] border-2 border-[#C7DDAE] bg-[#FFF7E6] dark:bg-[#1C2817] p-6 sm:p-8 shadow-card space-y-6">
        {!submitted ? (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#C7DDAE]/60 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-muted-foreground uppercase font-bold">
                  Class {selectedGrade} Case Record:
                </span>
                <span className="px-3.5 py-1 rounded-full border border-primary bg-primary text-primary-foreground font-bold text-xs">
                  Ananya Reddy (Roll #2)
                </span>
              </div>
              <div className="text-xs font-sans text-muted-foreground font-medium">
                Targeted: Polynomials & Equations
              </div>
            </div>

            {/* Step Heading */}
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl sm:text-2xl font-bold">
                Step {currentStep + 1}: Diagnostic Verification Check
              </h3>
              <span className="text-xs font-sans px-3 py-1 rounded-full border border-[#C7DDAE] bg-[#C7DDAE]/30 font-semibold text-primary">
                Question {currentStep + 1} of 3
              </span>
            </div>

            {/* Question Card */}
            {activeQ && (
              <div className="space-y-5">
                <div className="rounded-[20px] border border-[#C7DDAE] p-5 bg-[#C7DDAE]/20 space-y-2">
                  <span className="text-xs uppercase font-mono font-bold text-primary block">
                    Concept Node: {activeQ.conceptId}
                  </span>
                  <p className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {activeQ.prompt[lang]}
                  </p>
                </div>

                {/* Option Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeQ.options?.map((opt) => {
                    const isSelected = selectedAnswers[currentStep] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 rounded-[16px] border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "border-accent bg-[#FFFDF8] shadow-warm text-foreground"
                            : "border-[#C7DDAE] hover:border-primary bg-white text-foreground/80"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            isSelected
                              ? "bg-accent text-accent-foreground"
                              : "bg-[#C7DDAE]/40 text-foreground border border-[#C7DDAE]"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold mt-0.5">
                          {opt.text[lang]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Hint Callout */}
                <div className="p-3.5 bg-[#FFFDF8] border border-[#C7DDAE] rounded-[14px] text-xs text-foreground/85 flex items-start gap-2">
                  <strong className="text-accent uppercase shrink-0">Pedagogical Hint:</strong>
                  <span>{activeQ.hint[lang]}</span>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedAnswers[currentStep]}
                    onClick={handleNext}
                    className="rounded-full min-h-[44px] px-7 bg-primary text-primary-foreground text-xs font-sans uppercase font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-warm transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <span>{currentStep === 2 ? "Analyze Root Gap" : "Next: Check Learning"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Backtracking Results View */
          <div className="space-y-6">
            <div className="border-b border-[#C7DDAE]/60 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold">
                  STEP 5: ADAPTIVE INTERVENTION READY
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold">
                  Diagnosed Root Gap: Class 7 Integer Operations
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-bold">
                Intervention Planned
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
              The diagnostic traces the student&apos;s difficulty with Class 9 polynomial evaluation directly back 2 academic years to Class 7 signed integer subtraction rules.
            </p>

            {/* DAG Backtracking Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-[18px] border border-[#C7DDAE] bg-white space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Class 9 Target</span>
                <div className="font-bold text-foreground text-sm">Polynomials (c9-poly-02)</div>
                <span className="text-xs text-[var(--status-urgent)] font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Sign Mistake Found
                </span>
              </div>

              <div className="p-4 rounded-[18px] border border-[#C7DDAE] bg-white space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Class 8 Bridge</span>
                <div className="font-bold text-foreground text-sm">Linear Transposition (c8-lin-03)</div>
                <span className="text-xs text-[var(--status-warn)] font-semibold flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5" /> Prerequisite Link
                </span>
              </div>

              <div className="p-4 rounded-[18px] border-2 border-primary bg-[#C7DDAE]/30 space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase">Root Prerequisite Gap</span>
                <div className="font-bold text-foreground text-sm">Integer Subtraction (c7-int-02)</div>
                <span className="text-xs text-primary font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 10-Min Remedial Target
                </span>
              </div>
            </div>

            {/* Prescribed Lesson Accordion */}
            <div className="p-5 rounded-[20px] border border-[#C7DDAE] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent font-sans">
                  Recommended Pedagogical Lesson
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C7DDAE]/50 text-foreground font-bold font-sans">
                  Basics-First Variant
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                Prescribed <strong>Kirana Shop Debt & Credit Model</strong> to build intuitive understanding of adding and subtracting signed quantities.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowLessonPreview(!showLessonPreview)}
                  className="rounded-full px-5 py-2 bg-primary text-primary-foreground text-xs font-sans uppercase font-bold hover:bg-primary/90 cursor-pointer shadow-warm transition-transform active:scale-95"
                >
                  {showLessonPreview ? "Hide Lesson Preview" : "Preview Basics-First Lesson"}
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full px-5 py-2 border border-[#C7DDAE] bg-transparent text-foreground text-xs font-sans font-semibold hover:bg-[#C7DDAE]/30 cursor-pointer transition-colors"
                >
                  Run Simulator Again
                </button>
              </div>

              {showLessonPreview && rootLesson && (
                <div className="mt-4 p-4 rounded-[16px] bg-[#FFF7E6] border border-[#C7DDAE] space-y-2 text-xs">
                  <span className="font-bold text-primary uppercase">
                    {rootLesson.basics_first.headline[lang]}
                  </span>
                  <p className="text-foreground/90 leading-relaxed font-sans">
                    {rootLesson.basics_first.explanation[lang]}
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-[#C7DDAE] font-mono text-primary font-bold">
                    {rootLesson.basics_first.workedExample.problem[lang]} &rarr; {rootLesson.basics_first.workedExample.solution[lang]}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
