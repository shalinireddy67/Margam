"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Lock,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  WorksheetResult,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import {
  recordTopicOpened,
  completeLesson,
  submitWorksheet,
  canAccessTopic,
} from "@/lib/progression";
import {
  getConceptById,
  getLessonByConceptId,
  getQuestionsByConceptId,
  resolveLocalizedString,
} from "@/lib/curriculum";
import { selectLessonVariant } from "@/lib/adaptive";
import WitchCatCompanion, { CompanionContext } from "@/components/WitchCatCompanion";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptId = params?.conceptId as string;

  const fromGap = searchParams.get("fromGap") === "true";
  const gapReason = searchParams.get("reason") || "";

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [worksheetResult, setWorksheetResult] = useState<WorksheetResult | null>(null);
  const [completedNow, setCompletedNow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companionContext, setCompanionContext] = useState<CompanionContext>("lesson_start");
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedReason, setLockedReason] = useState<string>("");

  const initLesson = useCallback(() => {
    try {
      setIsLoaded(false);
      setHasError(false);
      setErrorMessage(null);
      setIsLocked(false);

      const active = getActiveProfile();
      if (!active || !active.selectedClass) {
        router.replace("/");
        return;
      }

      const concept = getConceptById(conceptId);
      // Allow remediation if arriving from gap card or if concept belongs to lower class
      const allowRemediation = fromGap || (concept ? concept.class < active.selectedClass : false);
      const access = canAccessTopic(conceptId, active, allowRemediation);

      if (!access.accessible) {
        setIsLocked(true);
        setLockedReason(access.reason || "You must complete prerequisite topics before accessing this lesson.");
        setIsLoaded(true);
        return;
      }

      // Opening records in_progress
      const updated = recordTopicOpened(conceptId);
      setProfile(updated || active);
      setIsLoaded(true);
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load lesson.");
      setIsLoaded(true);
    }
  }, [conceptId, fromGap, router]);

  useEffect(() => {
    initLesson();
  }, [initLesson]);

  // 1. Loading Skeleton State
  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] p-4 sm:p-6 pb-safe">
        <OfflineBanner />
        <div className="max-w-3xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading lesson">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Locked State: Student has not met prerequisites
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <header className="border-b-[3px] border-[#111111] bg-[#FFFFFF]">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center min-h-[48px] gap-2 text-xs font-heading font-extrabold text-[#111111] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lessons</span>
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE14D] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Lesson Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {lockedReason}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Return to Learning Path</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF4F9A] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#FFFFFF] font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Lesson Error
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {errorMessage || "We encountered an error loading this lesson."}
            </p>
            <div className="pt-2">
              <Button
                variant="yellow"
                size="default"
                onClick={initLesson}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>Try Again</span>
                <RotateCcw className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const concept = getConceptById(conceptId);
  const lesson = getLessonByConceptId(conceptId);
  const questions = getQuestionsByConceptId(conceptId);

  // 4. Empty State: Lesson content not found
  if (!concept || !lesson) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <header className="border-b-[3px] border-[#111111] bg-[#FFFFFF]">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center min-h-[48px] gap-2 text-xs font-heading font-extrabold text-[#111111] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lessons</span>
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
          <EmptyState
            title="Lesson Content Unavailable"
            description="The pedagogical variants for this topic are currently being prepared."
            actionLabel="Return to Learning Path"
            onAction={() => router.push("/")}
          />
        </main>
      </div>
    );
  }

  const topicProgress = profile.topicProgress[conceptId];
  const isCompleted = topicProgress?.status === "completed" || completedNow;

  // Pedagogical variant selection
  let variantKey: "basics_first" | "standard" | "fast_track" = "standard";
  let variantReason = "";

  if (fromGap) {
    variantKey = "basics_first";
    variantReason =
      gapReason ||
      "Basics-First: Selected to reinforce foundational prerequisites identified during diagnostic backtracking.";
  } else {
    variantKey = selectLessonVariant(topicProgress?.mastery);
    if (variantKey === "basics_first") {
      variantReason = "Basics-First: Focused on intuitive real-world analogies and concrete examples.";
    } else if (variantKey === "fast_track") {
      variantReason = "Fast-Track: High mastery detected. Concise overview with advanced challenges.";
    } else {
      variantReason = "Standard: Balanced conceptual explanation with step-by-step worked examples.";
    }
  }

  const activeVariant = lesson[variantKey] || lesson.standard;

  // Finish Lesson
  const handleFinishLesson = () => {
    const res = completeLesson(conceptId);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setCompletedNow(true);
      setCompanionContext("completed");
    }
  };

  // Option Select
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (worksheetResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setErrorMessage(null);
  };

  // Submit Practice
  const handleSubmitPractice = (e: React.FormEvent) => {
    e.preventDefault();
    const submission = {
      conceptId,
      answers,
      submittedAt: new Date().toISOString(),
    };

    const res = submitWorksheet(submission);
    if (res.success && res.result) {
      setWorksheetResult(res.result);
      if (res.profile) setProfile(res.profile);

      const allCorrect = res.result.correctCount === res.result.totalQuestions;
      setCompanionContext(allCorrect ? "correct" : "incorrect");
    }
  };

  const headlineData = resolveLocalizedString(activeVariant.headline, currentLang);
  const explanationData = resolveLocalizedString(activeVariant.explanation, currentLang);
  const workedProblem = resolveLocalizedString(activeVariant.workedExample.problem, currentLang);
  const workedSolution = resolveLocalizedString(activeVariant.workedExample.solution, currentLang);

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
      <OfflineBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-[3px] border-[#111111]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center min-h-[48px] gap-2 text-xs font-heading font-extrabold text-[#111111] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Class Lessons</span>
          </Link>

          <div className="flex items-center gap-1 bg-[#FFF8DC] p-1 rounded-xl border-[2px] border-[#111111]">
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`min-h-[38px] px-2.5 rounded-lg text-xs font-heading font-extrabold select-none ${
                currentLang === "en" ? "bg-[#111111] text-[#FFFFFF]" : "text-[#111111] hover:bg-[#FFE14D]/30"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("hi")}
              className={`min-h-[38px] px-2.5 rounded-lg text-xs font-heading font-extrabold select-none ${
                currentLang === "hi" ? "bg-[#111111] text-[#FFFFFF]" : "text-[#111111] hover:bg-[#FFE14D]/30"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("te")}
              className={`min-h-[38px] px-2.5 rounded-lg text-xs font-heading font-extrabold select-none ${
                currentLang === "te" ? "bg-[#111111] text-[#FFFFFF]" : "text-[#111111] hover:bg-[#FFE14D]/30"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Section 1: Concept Header & Style Chip */}
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>{concept.chapter}</span>
            </div>

            {/* Style Chip with Variant */}
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] ${
                variantKey === "basics_first"
                  ? "bg-[#FF4F9A] text-[#111111]"
                  : variantKey === "fast_track"
                  ? "bg-[#8DE86A] text-[#111111]"
                  : "bg-[#FFE14D] text-[#111111]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Variant: {variantKey === "basics_first" ? "Basics-First" : variantKey === "fast_track" ? "Fast-Track" : "Standard"}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          {/* One-Line Reason */}
          <div className="p-3 bg-[#FFF8DC] rounded-xl border-[2px] border-[#111111] text-xs font-bold text-[#111111] leading-relaxed">
            <span className="uppercase tracking-wider text-[10px] text-[#111111]/70 block mb-0.5">Teaching Strategy</span>
            {variantReason}
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#111111]/80 leading-relaxed">
            <strong className="text-[#111111]">Learning Goal: </strong>
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>
        </div>

        {/* Section 2: Core Idea & Conceptual Explanation */}
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
          <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#111111]" />
            <span>Core Concept</span>
          </div>

          <h2 className="text-lg font-heading font-extrabold text-[#111111] flex items-center flex-wrap gap-2">
            <span>{headlineData.text}</span>
            {headlineData.isDraft && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFE14D] text-[#111111] border border-[#111111]">
                Draft
              </span>
            )}
          </h2>

          <p className="text-sm font-medium text-[#111111] leading-relaxed">
            {explanationData.text}
          </p>
        </div>

        {/* Section 3: Visual Analogy / Intuition */}
        {activeVariant.visualAnalogy && (
          <div className="bg-[#4DD9E8]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#111111] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              <span>Real-World Intuition</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#111111] leading-relaxed">
              {resolveLocalizedString(activeVariant.visualAnalogy, currentLang).text}
            </p>
          </div>
        )}

        {/* Section 4: Worked Example */}
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
          <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#111111]" />
            <span>Worked Example</span>
          </div>

          <div className="bg-[#FFF8DC] p-4 rounded-xl border-[2px] border-[#111111] space-y-1">
            <p className="text-[11px] font-heading font-extrabold text-[#111111]/70 uppercase">Problem</p>
            <p className="text-sm font-heading font-extrabold text-[#111111]">
              {workedProblem.text}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-heading font-extrabold text-[#111111]/70 uppercase">Steps</p>
            {activeVariant.workedExample.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#111111]">
                <span className="w-6 h-6 rounded-lg bg-[#FFE14D] text-[#111111] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border-[2px] border-[#111111]">
                  {i + 1}
                </span>
                <p className="leading-relaxed pt-0.5">
                  {resolveLocalizedString(step, currentLang).text}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#8DE86A]/40 border-[2px] border-[#111111] rounded-xl p-3.5 flex items-center gap-2 text-xs sm:text-sm text-[#111111] font-heading font-extrabold shadow-[2px_2px_0px_#111111]">
            <Check className="w-4 h-4 text-[#111111] shrink-0" />
            <span>Result: {workedSolution.text}</span>
          </div>
        </div>

        {/* Section 5: Check Your Understanding (Practice Questions) */}
        {questions.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-5">
            <div className="flex items-center justify-between border-b-[2px] border-[#111111]/10 pb-3">
              <h2 className="text-base font-heading font-extrabold text-[#111111]">
                Check Your Understanding
              </h2>
              <Link
                href={`/student/worksheet/${concept.id}`}
                className="min-h-[48px] inline-flex items-center text-xs font-heading font-extrabold text-[#111111] underline hover:text-[#FF4F9A] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Full Worksheet</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {questions.slice(0, 2).map((q, qIndex) => {
                const feedbackItem = worksheetResult?.feedback.find((f) => f.questionId === q.id);
                const qPrompt = resolveLocalizedString(q.prompt, currentLang);

                return (
                  <div key={q.id} data-qid={q.id} className="p-4 rounded-2xl border-[2px] border-[#111111] space-y-3">
                    <p className="text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
                      Practice Question {qIndex + 1}
                    </p>
                    <p className="text-sm font-heading font-extrabold text-[#111111]">
                      {qPrompt.text}
                    </p>

                    <div className="space-y-2">
                      {q.options?.map((opt) => {
                        const isSelected = answers[q.id] === opt.id;
                        const isCorrectAnswer = q.correctAnswer === opt.id;
                        const optText = resolveLocalizedString(opt.text, currentLang);

                        let optClass = "bg-[#FFFFFF] border-[#111111] hover:bg-[#FFE14D]/20";
                        if (worksheetResult) {
                          if (isCorrectAnswer) optClass = "bg-[#8DE86A]/40 border-[#111111]";
                          else if (isSelected) optClass = "bg-[#FF4F9A]/30 border-[#111111]";
                        } else if (isSelected) {
                          optClass = "bg-[#FFE14D] border-[#111111] shadow-[2px_2px_0px_#111111]";
                        }

                        return (
                          <div
                            key={opt.id}
                            data-oid={opt.id}
                            tabIndex={0}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`Option ${opt.id}: ${optText.text}`}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                handleSelectOption(q.id, opt.id);
                              }
                            }}
                            className={`min-h-[48px] p-3 rounded-xl border-[2px] cursor-pointer flex items-center gap-3 select-none active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none ${optClass}`}
                          >
                            <span className="w-6 h-6 rounded-md bg-[#111111] text-[#FFFFFF] font-extrabold text-xs flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <span className="text-xs font-bold text-[#111111] flex-1">{optText.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pre-submission Hint Toggle */}
                    {q.hint && !worksheetResult && (
                      <div className="pt-1">
                        <button
                          type="button"
                          id={`hint-toggle-${q.id}`}
                          onClick={() => setShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="min-h-[48px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-heading font-extrabold text-[#111111] bg-[#FFE14D]/40 hover:bg-[#FFE14D] border-[2px] border-[#111111] rounded-xl transition-colors cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                        >
                          <HelpCircle className="w-4 h-4 text-[#111111]" />
                          <span>{showHint[q.id] ? "Hide Hint" : "Need a hint?"}</span>
                        </button>
                        {showHint[q.id] && (
                          <div className="mt-2 p-2.5 rounded-lg bg-[#FFE14D]/30 border-[2px] border-[#111111] text-xs font-bold text-[#111111]">
                            <span className="font-heading font-extrabold">Hint: </span>
                            <span>{resolveLocalizedString(q.hint, currentLang).text}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {feedbackItem && !feedbackItem.isCorrect && (
                      <div className="p-3.5 rounded-xl bg-[#FF4F9A]/20 border-[2px] border-[#111111] text-xs font-bold text-[#111111] space-y-2">
                        <p className="font-heading font-extrabold text-[#111111] flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-[#FF4F9A] shrink-0" />
                          <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                        </p>
                        {q.hint && (
                          <div className="p-2.5 rounded-lg bg-[#FFE14D]/30 border-[2px] border-[#111111] text-[#111111]">
                            <span className="font-heading font-extrabold">Hint: </span>
                            <span>{resolveLocalizedString(q.hint, currentLang).text}</span>
                          </div>
                        )}
                        <p className="text-[#111111]/80">
                          <strong className="text-[#111111]">Explanation: </strong>
                          {resolveLocalizedString(feedbackItem.explanation, currentLang).text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {!worksheetResult && (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                >
                  <span>Submit Practice Answers</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Sticky Next Button Bar */}
        <div className="sticky bottom-4 z-30 bg-[#FFF8DC]/95 border-[3px] border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-heading font-extrabold text-[#111111] block">
              {isCompleted ? "Topic Mastered!" : "Finished Reviewing?"}
            </span>
            <span className="text-[11px] font-bold text-[#111111]/70 block">
              {isCompleted ? "You can proceed to the next concept or chapter test." : "Advance to update your concept mastery."}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleFinishLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-2.5 rounded-xl bg-[#FFE14D] text-[#111111] border-[2px] border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Next: Finish Lesson & Complete</span>
              </button>
            ) : (
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Next: Return to Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t-[3px] border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Lesson Workspace
      </footer>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8DC] text-[#111111] p-4 sm:p-6 pb-safe">
          <div className="max-w-3xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading lesson">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
