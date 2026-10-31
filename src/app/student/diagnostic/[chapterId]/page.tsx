"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  GitBranch,
  ShieldCheck,
  Award,
  Lock,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Question,
  Chapter,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { unlockChapterLessons } from "@/lib/progression";
import {
  chapters,
  canTakeChapterDiagnostic,
  getChapterQuestionCount,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import {
  generateChapterDiagnostic,
  evaluateChapterDiagnostic,
  getConfirmationQuestions,
  DiagnosticResult,
} from "@/lib/adaptive";
import StudentHeader from "@/components/StudentHeader";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";

export default function ChapterDiagnosticPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.chapterId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [placementPassed, setPlacementPassed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Confirmation Step State
  const [confirmationQuestions, setConfirmationQuestions] = useState<Question[]>([]);
  const [confirmationAnswers, setConfirmationAnswers] = useState<Record<string, string>>({});
  const [confirmationStatus, setConfirmationStatus] = useState<"pending" | "passed" | "failed" | null>(null);
  const [confirmationSubmitted, setConfirmationSubmitted] = useState(false);

  const initDiagnostic = useCallback(() => {
    try {
      setLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const active = getActiveProfile();
      if (!active || !active.selectedClass) {
        router.replace("/");
        return;
      }
      setProfile(active);

      // Verify diagnostic eligibility (total questions >= 6)
      if (!canTakeChapterDiagnostic(chapterId)) {
        setLoading(false);
        return;
      }

      const { questions: diagQuestions } = generateChapterDiagnostic(chapterId, 6);
      setQuestions(diagQuestions);
      setLoading(false);
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to initialize diagnostic.");
      setLoading(false);
    }
  }, [chapterId, router]);

  useEffect(() => {
    initDiagnostic();
  }, [initDiagnostic]);

  const currentChapter: Chapter | undefined = chapters.find((c) => c.id === chapterId);

  // 1. Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] p-4 sm:p-6 pb-safe">
        <OfflineBanner />
        <div className="max-w-3xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading diagnostic assessment">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF4F9A] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#FFFFFF] font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Diagnostic Assessment Error
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {errorMessage || "We encountered an issue preparing this diagnostic assessment."}
            </p>
            <div className="pt-2">
              <Button
                variant="yellow"
                size="default"
                onClick={initDiagnostic}
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

  // 3. Locked State: If chapter has fewer than 6 questions, block diagnostic and inform student
  const questionCount = getChapterQuestionCount(chapterId);
  if (!currentChapter || questionCount < 6) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] rounded-3xl p-8 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE14D] text-[#111111] flex items-center justify-center mx-auto border-[2px] border-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#111111]">
              Diagnostic Assessment Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              This chapter has {questionCount} questions available (minimum 6 required for diagnostic placement).
              Please complete this chapter by learning the sequential lessons directly.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-extrabold shadow-[2px_2px_0px_#111111] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Chapter Lessons</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 4. Empty State: If no questions were returned
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
          <EmptyState
            title="No Diagnostic Questions Found"
            description="Questions for this chapter are currently in development."
            actionLabel="Return to Learning Path"
            onAction={() => router.push("/")}
          />
        </main>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setErrorMessage(null);
  };

  const handleSelectConfirmationOption = (questionId: string, optionId: string) => {
    if (confirmationSubmitted) return;
    setConfirmationAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    const diagResult = evaluateChapterDiagnostic(chapterId, answers, 3);
    setResult(diagResult);

    // Placement Rule: score >= 70% unlocks chapter lessons
    const passed = diagResult.scorePercentage >= 70;
    setPlacementPassed(passed);
    if (passed) {
      const updated = unlockChapterLessons(chapterId);
      if (updated) setProfile(updated);
    }

    // Calibrated Gap Tracing Routing:
    // - low = confirmation check only (confirmation failure -> gap card)
    // - medium or high = gap card directly
    // - insufficient = no routing
    if (
      diagResult.gapAnalysis.confirmed &&
      diagResult.gapAnalysis.canRoute &&
      diagResult.gapAnalysis.rootConceptId
    ) {
      const routing =
        diagResult.gapAnalysis.routing ||
        (diagResult.gapAnalysis.confidence === "low" ? "confirmation_only" : "gap_card");

      if (routing === "confirmation_only") {
        const confirmQs = getConfirmationQuestions(diagResult.gapAnalysis.rootConceptId, 2);
        if (confirmQs.length > 0) {
          setConfirmationQuestions(confirmQs);
          setConfirmationStatus("pending");
        } else {
          // If no confirmation questions available, protect student
          setConfirmationStatus("passed");
        }
      } else if (routing === "gap_card") {
        // Direct routing to gap card for medium or high confidence
        setConfirmationStatus("failed");
      }
    }
  };

  const handleSubmitConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(confirmationAnswers).length < confirmationQuestions.length) {
      alert("Please answer both check questions to verify your understanding.");
      return;
    }

    // Check if student answered all confirmation questions correctly
    const allCorrect = confirmationQuestions.every(
      (q) => confirmationAnswers[q.id] === q.correctAnswer
    );

    setConfirmationSubmitted(true);
    if (allCorrect) {
      setConfirmationStatus("passed");
    } else {
      setConfirmationStatus("failed");
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
    setConfirmationQuestions([]);
    setConfirmationAnswers({});
    setConfirmationStatus(null);
    setConfirmationSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
      <OfflineBanner />

      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Header Card */}
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
            <span>Diagnostic Assessment</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-[#111111]/80 leading-relaxed">
            Take this 6-question diagnostic to test out of this chapter or identify foundational prerequisite topics.
            A score of 70% or more immediately unlocks this chapter&apos;s lessons.
          </p>

          {/* Placement Result Banner */}
          {result && (
            <div
              className={`mt-4 p-5 rounded-2xl border-[3px] border-[#111111] shadow-[3px_3px_0px_#111111] ${
                placementPassed
                  ? "bg-[#8DE86A]/30 text-[#111111]"
                  : "bg-[#FFE14D]/40 text-[#111111]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {placementPassed ? (
                      <>
                        <Award className="w-5 h-5 text-[#111111]" />
                        <span>Placement Passed! Chapter Lessons Unlocked</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-[#111111]" />
                        <span>Diagnostic Attempted • Complete Lessons in Order</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs font-bold mt-1 text-[#111111]/80">
                    Score: <strong>{result.correctCount} / {result.totalQuestions}</strong> ({result.scorePercentage}%)
                    {!placementPassed && " • 70% required for instant placement"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border-[2px] border-[#111111] text-xs font-heading font-extrabold text-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <span>Chapter Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#FF4F9A]/20 border-[2px] border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#111111]" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* STEP 5 CONFIRMATION CHECK: Interactive Check Before Gap Routing */}
        {result && confirmationQuestions.length > 0 && confirmationStatus === "pending" && (
          <div className="bg-[#4DD9E8]/20 border-[3px] border-[#111111] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="flex items-center gap-2 text-[#111111] font-heading font-extrabold text-base">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
              <span>Prerequisite Check: Quick Verification</span>
            </div>
            <p className="text-xs font-bold text-[#111111]/80 leading-relaxed">
              We noticed a pattern in your diagnostic answers that connects to a foundational prerequisite.
              Please answer these 2 quick questions to confirm whether you already know this concept:
            </p>

            <form onSubmit={handleSubmitConfirmation} className="space-y-4 pt-2">
              {confirmationQuestions.map((q, qIdx) => {
                const promptData = resolveLocalizedString(q.prompt, currentLang);
                return (
                  <div key={q.id} data-confirm-qid={q.id} className="bg-[#FFFFFF] p-4 rounded-xl border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] space-y-2">
                    <p className="text-xs font-bold text-[#111111]">
                      Check Question {qIdx + 1}: {promptData.text}
                    </p>
                    <div className="space-y-2">
                      {q.options?.map((opt) => {
                        const isSelected = confirmationAnswers[q.id] === opt.id;
                        const optData = resolveLocalizedString(opt.text, currentLang);
                        return (
                          <div
                            key={opt.id}
                            data-confirm-oid={opt.id}
                            onClick={() => handleSelectConfirmationOption(q.id, opt.id)}
                            className={`min-h-[48px] p-3 rounded-xl border-[2px] border-[#111111] text-xs font-bold cursor-pointer flex items-center gap-2.5 select-none focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none ${
                              isSelected
                                ? "bg-[#FFE14D] shadow-[2px_2px_0px_#111111]"
                                : "bg-[#FFFFFF] hover:bg-[#FFE14D]/20 shadow-[1px_1px_0px_#111111]"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-md bg-[#111111] text-[#FFFFFF] font-extrabold flex items-center justify-center text-xs shrink-0">
                              {opt.id}
                            </span>
                            <span className="flex-1 text-[#111111]">{optData.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[3px_3px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Verify Prerequisite Understanding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* CONFIRMATION PASSED: No Routing */}
        {confirmationStatus === "passed" && (
          <div className="bg-[#8DE86A]/30 border-[3px] border-[#111111] rounded-2xl sm:rounded-3xl p-5 shadow-[4px_4px_0px_#111111] text-[#111111] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
            <div className="text-xs font-bold leading-relaxed">
              <strong className="block text-sm font-heading font-extrabold">Prerequisite Check Passed!</strong>
              You answered the foundational check questions correctly. No prerequisite remediation routing is required.
            </div>
          </div>
        )}

        {/* CONFIRMATION FAILED: SHOW GAP CARD WITH VISUAL PATH & ACTION BUTTON */}
        {confirmationStatus === "failed" && result?.gapAnalysis.rootConceptId && (() => {
          const rootConcept = getConceptById(result.gapAnalysis.rootConceptId);
          const exactConceptName = rootConcept
            ? (rootConcept.name[currentLang] || rootConcept.name.en)
            : result.gapAnalysis.rootConceptId;

          return (
            <div className="bg-[#FFF5F8] border-[3px] border-[#FF4F9A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-[#111111] font-heading font-extrabold text-base">
                  <GitBranch className="w-5 h-5 text-[#FF4F9A]" />
                  <span>Identified Prerequisite Gap</span>
                </div>
                {rootConcept && (
                  <span className="px-3 py-1 rounded-full bg-[#FFE14D] border-[2px] border-[#111111] text-[#111111] text-xs font-heading font-extrabold">
                    Class {rootConcept.class} • Concept ID: {rootConcept.id}
                  </span>
                )}
              </div>

              {/* Exact Concept Name from concepts.json */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] space-y-1.5">
                <span className="text-[11px] font-bold text-[#FF4F9A] uppercase tracking-wider block">
                  Foundational Concept to Review
                </span>
                <h3 className="text-lg font-heading font-extrabold text-[#111111] tracking-tight">
                  {exactConceptName}
                </h3>
                {rootConcept && currentLang !== "en" && rootConcept.name.en !== exactConceptName && (
                  <p className="text-xs text-[#111111]/70 font-bold">
                    {rootConcept.name.en}
                  </p>
                )}
                {rootConcept && (
                  <p className="text-xs text-[#111111]/80 font-bold leading-relaxed pt-1 border-t border-[#111111]/10 mt-2">
                    <strong className="text-[#111111]">Learning Objective: </strong>
                    {rootConcept.learningObjective[currentLang] || rootConcept.learningObjective.en}
                  </p>
                )}
              </div>

              {/* Plain Reason */}
              <div className="p-3.5 bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl text-xs font-bold text-[#111111] leading-relaxed">
                <strong className="block text-[11px] uppercase tracking-wider text-[#FF4F9A] mb-1">
                  Reason for Recommendation:
                </strong>
                {result.gapAnalysis.plainLanguageReason}
              </div>

              {/* Path of nodes from current class back to root concept */}
              {result.gapAnalysis.prerequisitePath.length > 0 && (
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] space-y-2">
                  <span className="text-[11px] font-bold text-[#111111]/70 uppercase tracking-wider block">
                    Learning Journey Backtrack Path
                  </span>
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    {result.gapAnalysis.prerequisitePath.map((nodeId, idx) => {
                      const nodeConcept = getConceptById(nodeId);
                      const isLast = idx === result.gapAnalysis.prerequisitePath.length - 1;
                      const nodeConceptName = nodeConcept
                        ? (nodeConcept.name[currentLang] || nodeConcept.name.en)
                        : nodeId;
                      return (
                        <React.Fragment key={nodeId}>
                          <span
                            className={`px-3 py-1.5 rounded-xl font-heading font-extrabold border-[2px] border-[#111111] ${
                              isLast
                                ? "bg-[#FF4F9A] text-[#111111] shadow-[2px_2px_0px_#111111]"
                                : "bg-[#FFE14D]/40 text-[#111111]"
                            }`}
                          >
                            {nodeConcept ? `Class ${nodeConcept.class}: ${nodeConceptName}` : nodeId}
                          </span>
                          {!isLast && <ArrowRight className="w-4 h-4 text-[#111111] shrink-0" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* One large 'Fix this first' button */}
              <div className="pt-2">
                <Link
                  id="fix-this-first-btn"
                  href={`/lesson/${result.gapAnalysis.rootConceptId}?fromGap=true&reason=${encodeURIComponent(
                    result.gapAnalysis.plainLanguageReason
                  )}`}
                  className="w-full inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-4 rounded-2xl bg-[#FF4F9A] text-[#111111] border-[3px] border-[#111111] font-heading font-extrabold text-sm shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                >
                  <span>Fix this first: Review Foundational Lesson (Basics-First)</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Diagnostic Questions List */}
        <form onSubmit={handleSubmitDiagnostic} className="space-y-6">
          {questions.map((q, qIndex) => {
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b-[2px] border-[#111111]/10 pb-3">
                  <span className="text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-bold text-[#111111] px-2.5 py-0.5 rounded-full bg-[#FFE14D] border-[2px] border-[#111111]">
                    Difficulty Level {q.difficulty}
                  </span>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
                      <span>{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                          Draft Translation
                        </span>
                      )}
                    </h2>
                  );
                })()}

                {/* Options */}
                <div className="space-y-2.5 pt-1">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const isCorrectAnswer = q.correctAnswer === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-[#111111] bg-[#FFFFFF] hover:bg-[#FFE14D]/20";

                    if (result) {
                      if (isCorrectAnswer) {
                        optionBorderClass = "border-[#111111] bg-[#8DE86A]/40";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionBorderClass = "border-[#111111] bg-[#FF4F9A]/30";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-[#111111] bg-[#FFE14D] shadow-[2px_2px_0px_#111111]";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        tabIndex={0}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Option ${opt.id}: ${optData.text}`}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleSelectOption(q.id, opt.id);
                          }
                        }}
                        className={`min-h-[48px] flex items-center gap-3 p-3.5 rounded-xl border-[2px] cursor-pointer select-none transition-transform active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none ${optionBorderClass}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-heading font-extrabold text-xs flex items-center justify-center shrink-0 border-[2px] border-[#111111] ${
                            isSelected
                              ? "bg-[#111111] text-[#FFFFFF]"
                              : "bg-[#FFFFFF] text-[#111111]"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm text-[#111111] font-bold flex items-center flex-wrap gap-2">
                          <span>{optData.text}</span>
                          {optData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Post-Submission */}
                {feedbackItem && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-[2px] border-[#111111] text-xs font-bold leading-relaxed space-y-1.5 ${
                      feedbackItem.isCorrect
                        ? "bg-[#8DE86A]/30 text-[#111111]"
                        : "bg-[#FF4F9A]/20 text-[#111111]"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-heading font-extrabold text-sm">
                      {feedbackItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#111111]" />
                          <span>
                            Misconception: {feedbackItem.mistakeTag ? feedbackItem.mistakeTag.replace(/_/g, " ") : "Incorrect Answer"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!result && (
            <div className="sticky bottom-4 z-30 bg-[#FFF8DC]/95 border-[3px] border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#111111]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Submit Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-[3px] border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Diagnostic Engine
      </footer>
    </div>
  );
}
