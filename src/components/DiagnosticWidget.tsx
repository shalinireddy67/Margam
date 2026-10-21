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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showLessonPreview, setShowLessonPreview] = useState<boolean>(false);

  // The 3 sequential diagnostic questions representing Class 9 -> Class 8 -> Class 7 DAG
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

  // Find root gap concept & lesson variant
  const rootConcept = conceptsData.find((c) => c.id === "c7-int-02");
  const rootLesson = lessonsData.find((l) => l.conceptId === "c7-int-02");

  return (
    <div
      id="try-diagnostic"
      className="w-full max-w-4xl mx-auto my-8 bg-white rounded-2xl border-2 border-margam-border shadow-card overflow-hidden"
    >
      {/* Widget Header */}
      <div className="bg-margam-cream-paper border-b border-margam-border px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-margam-terracotta text-white flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-margam-terracotta">
                Interactive Diagnostic Simulator
              </span>
              <span className="text-xs bg-margam-cream-subtle text-margam-navy px-2 py-0.5 rounded font-mono font-semibold">
                NCERT DAG
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-margam-navy">
              Experience Prerequisite Backtracking in 3 Questions
            </h3>
          </div>
        </div>

        {/* Mini Language Selector for Widget */}
        <div className="flex items-center gap-1 bg-white border border-margam-border rounded-lg p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 rounded transition-colors ${
              lang === "en"
                ? "bg-margam-navy text-white font-bold"
                : "text-margam-slate hover:text-margam-navy"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={`px-2.5 py-1 rounded transition-colors ${
              lang === "hi"
                ? "bg-margam-navy text-white font-bold"
                : "text-margam-slate hover:text-margam-navy"
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLang("te")}
            className={`px-2.5 py-1 rounded transition-colors ${
              lang === "te"
                ? "bg-margam-navy text-white font-bold"
                : "text-margam-slate hover:text-margam-navy"
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Main Diagnostic Body */}
      {!submitted ? (
        <div className="p-6 md:p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6 border-b border-margam-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-margam-slate">
              <span>Question {currentStep + 1} of 3</span>
              <span>•</span>
              <span className="text-margam-navy font-bold">
                {currentStep === 0 && "Class 9 — Polynomial Evaluation"}
                {currentStep === 1 && "Class 8 — Linear Equation Transposition"}
                {currentStep === 2 && "Class 7 — Negative Integer Operations"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    idx === currentStep
                      ? "bg-margam-terracotta w-8"
                      : idx < currentStep
                      ? "bg-margam-emerald"
                      : "bg-margam-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Question */}
          {activeQ && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-xs uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-margam-cream-paper text-margam-slate border border-margam-border">
                  Concept ID: {activeQ.conceptId}
                </span>
                <p className="font-serif text-lg md:text-xl font-bold text-margam-navy leading-relaxed">
                  {activeQ.prompt[lang]}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeQ.options?.map((opt) => {
                  const isSelected = selectedAnswers[currentStep] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "border-margam-terracotta bg-orange-50/50 shadow-xs"
                          : "border-margam-border hover:border-margam-navy/40 bg-white"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${
                          isSelected
                            ? "bg-margam-terracotta text-white"
                            : "bg-margam-cream-paper text-margam-navy border border-margam-border"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="font-mono text-sm md:text-base font-semibold text-margam-navy mt-0.5">
                        {opt.text[lang]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Hint Callout */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <span className="font-bold text-margam-amber uppercase shrink-0">
                  Pedagogical Hint:
                </span>
                <p>{activeQ.hint[lang]}</p>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex items-center justify-between border-t border-margam-border">
                <span className="text-xs text-margam-slate">
                  {selectedAnswers[currentStep]
                    ? "Option selected. Click next to proceed."
                    : "Select an option to test adaptive response."}
                </span>
                <button
                  type="button"
                  disabled={!selectedAnswers[currentStep]}
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-margam-navy text-white hover:bg-margam-navy/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>{currentStep === 2 ? "Analyze Root Gap" : "Next Question"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Result & Prerequisite DAG Backtracking Visualizer */
        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-margam-terracotta">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive Diagnosis Completed</span>
            </div>
            <h4 className="font-serif text-xl md:text-2xl font-bold text-margam-navy">
              Root Cause Diagnosed: Class 7 Signed Integer Operations
            </h4>
            <p className="text-sm text-margam-navy/85 leading-relaxed">
              When the learner made a sign mistake in Class 9 polynomial evaluation, Margam did not simply label them &ldquo;bad at algebra.&rdquo; Our algorithm backtracked across grade boundaries to verify if the breakdown was caused by Class 8 equation transposition or Class 7 integer sign rules.
            </p>
          </div>

          {/* Visual Concept Chain */}
          <div className="p-5 bg-margam-cream-paper border border-margam-border rounded-xl space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-margam-slate block">
              Prerequisite DAG Backtracking Trail:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-margam-border space-y-1">
                <span className="text-xs font-bold text-margam-slate">Tested Class 9 Skill</span>
                <div className="text-sm font-bold text-margam-navy">Polynomial Evaluation (c9-poly-02)</div>
                <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Sign Error Detected
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-margam-border space-y-1">
                <span className="text-xs font-bold text-margam-slate">Checked Class 8 Bridge</span>
                <div className="text-sm font-bold text-margam-navy">Linear Transposition (c8-lin-03)</div>
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                  <ArrowRight className="w-3.5 h-3.5" /> Prerequisite Chain
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border-2 border-margam-emerald space-y-1">
                <span className="text-xs font-bold text-margam-emerald uppercase">Root Prerequisite Gap</span>
                <div className="text-sm font-bold text-margam-navy">Integer Subtraction (c7-int-02)</div>
                <span className="inline-flex items-center gap-1 text-xs text-margam-emerald font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Targeted Intervention
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Adaptive Next Step */}
          <div className="border border-margam-border rounded-xl p-5 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-terracotta">
                Recommended Pedagogical Adaptation
              </span>
              <span className="text-xs bg-orange-100 text-orange-900 font-bold px-2.5 py-0.5 rounded-full">
                Basics-First Variant
              </span>
            </div>
            <p className="text-sm text-margam-navy/85">
              Instead of assigning 20 more polynomial drill problems, Margam prescribes a <strong>10-minute Basics-First lesson</strong> using the concrete Kirana shop debt & credit model to rebuild sign intuition.
            </p>

            {/* Toggle Lesson Preview */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowLessonPreview((prev) => !prev)}
                className="px-4 py-2 rounded-lg bg-margam-navy text-white text-xs font-bold flex items-center gap-2 hover:bg-margam-navy/90 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showLessonPreview ? "Hide Lesson Preview" : "Preview Basics-First Lesson"}</span>
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 rounded-lg border border-margam-border text-margam-navy text-xs font-semibold hover:bg-margam-cream-paper flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Simulator Again</span>
              </button>
            </div>

            {/* Inline Lesson Variant Preview */}
            {showLessonPreview && rootLesson && (
              <div className="mt-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-2 text-xs">
                <span className="font-bold text-margam-terracotta uppercase">
                  {rootLesson.basics_first.headline[lang]}
                </span>
                <p className="text-margam-navy/90 leading-relaxed">
                  {rootLesson.basics_first.explanation[lang]}
                </p>
                <div className="p-3 bg-white rounded-lg border border-orange-200 space-y-1">
                  <span className="font-bold text-margam-navy">
                    {rootLesson.basics_first.workedExample.problem[lang]}
                  </span>
                  <div className="font-mono text-margam-emerald font-bold">
                    {rootLesson.basics_first.workedExample.solution[lang]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
