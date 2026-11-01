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
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Chapter,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { unlockChapterLessons } from "@/lib/progression";
import {
  chapters,
  canTakeChapterDiagnostic,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";

interface SanitizedOption {
  id: string;
  text: any;
}

interface ClientQuestion {
  id: string;
  conceptId: string;
  difficulty: number;
  type: string;
  contextTag?: string;
  prompt: any;
  options?: SanitizedOption[];
}

interface DiagnosticResultResponse {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  mistakeTags: string[];
  gapAnalysis: {
    hasGap?: boolean;
    confirmed?: boolean;
    canRoute?: boolean;
    rootConceptId?: string;
    confidence?: string;
    routing?: "confirmation_only" | "gap_card" | "none";
    plainLanguageReason?: string;
    prerequisitePath?: string[];
  };
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    chosenAnswer: string;
    mistakeTag?: string;
    identifiedGap?: string;
  }>;
  confirmationQuestions?: ClientQuestion[];
  confirmationToken?: string | null;
}

export default function ChapterDiagnosticPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.chapterId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticResultResponse | null>(null);
  const [placementPassed, setPlacementPassed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Confirmation Step State
  const [confirmationQuestions, setConfirmationQuestions] = useState<ClientQuestion[]>([]);
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null);
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

      if (!canTakeChapterDiagnostic(chapterId)) {
        setLoading(false);
        return;
      }

      let isCancelled = false;
      async function loadQuestions() {
        try {
          const res = await fetch("/api/diagnostic/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterId,
              studentId: active!.id,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to load diagnostic");
          }

          const data = await res.json();
          if (!isCancelled) {
            setQuestions(data.questions || []);
            setSessionToken(data.token || null);
            setLoading(false);
          }
        } catch (err: any) {
          if (!isCancelled) {
            setHasError(true);
            setErrorMessage(err.message || "Network error loading questions");
            setLoading(false);
          }
        }
      }

      loadQuestions();

      return () => {
        isCancelled = true;
      };
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

  // Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#7EC8E3] text-[#111111] p-4 sm:p-6 pb-28">
        <OfflineBanner />
        <div className="max-w-4xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading diagnostic assessment">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#7EC8E3] text-[#111111] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-4 border-[#111111] p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 bg-[#D9453D] border-2 border-[#111111] flex items-center justify-center mx-auto text-[#FFFFFF] font-heading font-extrabold text-lg">
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

  // Guard: If chapter has fewer than 6 questions
  if (!canTakeChapterDiagnostic(chapterId)) {
    return (
      <div className="min-h-screen bg-[#7EC8E3] flex flex-col justify-between text-[#111111] pb-16">
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Path"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 bg-[#F2D16B] border-2 border-[#111111] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-[#111111]" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Diagnostic Not Available
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              This chapter requires at least 6 verified questions to generate a diagnostic assessment.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111] no-underline"
              >
                <span>Return to Learning Path</span>
              </Link>
            </div>
          </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    if (!sessionToken) {
      setErrorMessage("Missing session token. Please reload the assessment.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sessionToken,
          chapterId,
          studentId: profile.id,
          answers,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Diagnostic evaluation failed");
      }

      const diagResult: DiagnosticResultResponse = await res.json();
      setResult(diagResult);

      if (diagResult.passed) {
        setPlacementPassed(true);
        const unlockRes = unlockChapterLessons(chapterId);
        if (unlockRes.success && unlockRes.profile) {
          setProfile(unlockRes.profile);
        }
      }

      if (diagResult.confirmationQuestions && diagResult.confirmationQuestions.length > 0) {
        setConfirmationQuestions(diagResult.confirmationQuestions);
        setConfirmationToken(diagResult.confirmationToken || null);
        setConfirmationStatus("pending");
      }

      const refreshed = getActiveProfile();
      if (refreshed) setProfile(refreshed);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit diagnostic.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmationSelect = (questionId: string, optionId: string) => {
    if (confirmationSubmitted) return;
    setConfirmationAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleConfirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(confirmationAnswers).length < confirmationQuestions.length) {
      alert("Please answer all confirmation questions.");
      return;
    }

    if (!confirmationToken) {
      alert("Missing confirmation token. Please reload.");
      return;
    }

    try {
      const res = await fetch("/api/diagnostic/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: confirmationToken,
          answers: confirmationAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error("Confirmation submission failed");
      }

      const confirmRes = await res.json();
      setConfirmationSubmitted(true);
      setConfirmationStatus(confirmRes.passed ? "passed" : "failed");

      const refreshed = getActiveProfile();
      if (refreshed) setProfile(refreshed);
    } catch (err: any) {
      alert(err.message || "Failed to evaluate confirmation questions.");
    }
  };

  const rootConcept = result?.gapAnalysis?.rootConceptId
    ? getConceptById(result.gapAnalysis.rootConceptId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#7EC8E3] flex flex-col justify-between text-[#111111] pb-24">
      <OfflineBanner />
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Assessment Header Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] mb-6 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
              <span>Chapter Diagnostic</span>
              <span>•</span>
              <span>Class {profile.selectedClass}</span>
            </div>
            <span className="text-xs font-heading font-bold px-2 py-0.5 bg-[#F2D16B] border border-[#111111]">
              Diagnostic Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {currentChapter?.title[currentLang] || currentChapter?.title.en || chapterId}
          </h1>

          <p className="text-xs sm:text-sm text-[#111111] bg-[#F2D16B]/30 p-3.5 border-2 border-[#111111] leading-relaxed font-bold">
            Answer these 6 questions. Our adaptive engine identifies root-cause prerequisites and adjusts your learning journey.
          </p>

          {/* Results Summary Box */}
          {result && (
            <div
              className={`mt-6 p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4 ${
                result.passed ? "bg-[#5DB84A]/30" : "bg-[#F2D16B]/50"
              }`}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {result.passed ? (
                    <Award className="w-8 h-8 text-[#3C8A2E]" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-[#D9453D]" />
                  )}
                  <div>
                    <h2 className="font-heading font-extrabold text-lg text-[#111111]">
                      {result.passed
                        ? "Diagnostic Passed! Chapter Lessons Unlocked"
                        : "Diagnostic Complete • Practice Recommended"}
                    </h2>
                    <p className="text-xs font-bold text-[#111111]/80">
                      Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%)
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>Return to Learning Path</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>

              {/* GAP CARD: Root-Cause Remediation Suggestion */}
              {result.gapAnalysis?.hasGap && rootConcept && (
                <div className="p-5 bg-[#FFFFFF] border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#D9453D] uppercase tracking-wider">
                    <GitBranch className="w-4 h-4 text-[#D9453D]" />
                    <span>Identified Foundational Gap (Class {rootConcept.class})</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-[#111111]">
                    {rootConcept.name[currentLang] || rootConcept.name.en}
                  </h3>

                  <p className="text-xs sm:text-sm font-bold text-[#111111]/80 leading-relaxed">
                    {result.gapAnalysis.plainLanguageReason ||
                      `We detected recurring calculation misconceptions rooted in Class ${rootConcept.class} prerequisites.`}
                  </p>

                  {/* Prerequisite Path Journey Steps */}
                  {result.gapAnalysis.prerequisitePath && result.gapAnalysis.prerequisitePath.length > 0 && (
                    <div className="p-3 bg-[#F2D16B]/30 border-2 border-[#111111] space-y-2">
                      <span className="text-[10px] font-heading font-bold text-[#111111]/70 uppercase tracking-wider block">
                        Prerequisite Journey:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap text-xs font-heading font-bold">
                        {result.gapAnalysis.prerequisitePath.map((stepId, idx) => {
                          const stepConcept = getConceptById(stepId);
                          const isLast = idx === (result.gapAnalysis.prerequisitePath?.length || 0) - 1;
                          return (
                            <React.Fragment key={stepId}>
                              <span
                                className={`px-2 py-0.5 border border-[#111111] ${
                                  stepId === rootConcept.id
                                    ? "bg-[#D9453D] text-[#FFFFFF]"
                                    : "bg-[#FFFFFF] text-[#111111]"
                                }`}
                              >
                                {stepConcept ? stepConcept.name.en : stepId}
                              </span>
                              {!isLast && <span className="text-[#111111]">→</span>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/lesson/${rootConcept.id}?fromGap=true&reason=${encodeURIComponent(
                        result.gapAnalysis.plainLanguageReason || ""
                      )}`}
                      className="inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 bg-[#F2D16B] text-[#111111] border-2 border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      <span>Review Foundational Lesson (Class {rootConcept.class})</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-[#D9453D]/20 border-2 border-[#D9453D] text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D9453D]" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Diagnostic Questions List */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="bg-[#FFFFFF] p-6 sm:p-7 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#111111] pb-3">
                  <span className="text-xs font-heading font-bold text-[#111111]/70 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-heading font-bold px-2 py-0.5 border border-[#111111] bg-[#F2D16B]">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-[#5DB84A] text-[#111111] px-2 py-0.5 border border-[#111111]">
                        Answered
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
                      <span>{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-[#F2D16B] border border-[#111111]">
                          Draft Translation
                        </span>
                      )}
                    </h3>
                  );
                })()}

                {/* Options */}
                <div className="space-y-2 pt-2">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-2 border-[#111111]";
                    let optionBgClass = "bg-[#FFFFFF]";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#111111]";
                        optionBgClass = "bg-[#5DB84A]/30";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#111111]";
                        optionBgClass = "bg-[#D9453D]/30";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-2 border-[#111111]";
                      optionBgClass = "bg-[#F2D16B] shadow-[2px_2px_0px_#111111]";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleSelectOption(q.id, opt.id);
                          }
                        }}
                        className={`min-h-[48px] p-3.5 border-2 cursor-pointer flex items-center justify-between transition-transform active:translate-x-[1px] active:translate-y-[1px] ${optionBorderClass} ${optionBgClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 border-2 border-[#111111] font-heading font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-[#111111] text-[#FFFFFF]"
                                : "bg-[#FFFFFF] text-[#111111]"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#111111] leading-snug">{optData.text}</span>
                        </div>
                        {result && feedbackItem && isSelected && (
                          feedbackItem.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-[#3C8A2E] shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#D9453D] shrink-0" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Post-Submission */}
                {feedbackItem && (
                  <div
                    className={`mt-4 p-4 border-2 border-[#111111] text-xs font-bold leading-relaxed space-y-1.5 ${
                      feedbackItem.isCorrect
                        ? "bg-[#5DB84A]/30 text-[#111111]"
                        : "bg-[#D9453D]/20 text-[#111111]"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-heading font-extrabold text-sm">
                      {feedbackItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#3C8A2E]" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#D9453D]" />
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
            <div className="sticky bottom-4 z-30 bg-[#FFFFFF] border-4 border-[#111111] p-4 shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-4">
              <span className="text-xs font-heading font-bold text-[#111111]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 bg-[#111111] text-[#F2D16B] border-2 border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? "Evaluating..." : "Submit Diagnostic Assessment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* Confirmation Step (if triggered by low confidence) */}
        {confirmationQuestions.length > 0 && (
          <div className="mt-8 bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#111111]/70">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>Diagnostic Confirmation Step</span>
            </div>
            <h2 className="font-heading font-extrabold text-base text-[#111111]">
              Verification Questions
            </h2>
            <p className="text-xs font-bold text-[#111111]/70">
              Please answer these short follow-up questions to confirm whether targeted prerequisite routing is recommended.
            </p>

            <form onSubmit={handleConfirmationSubmit} className="space-y-4 pt-2">
              {confirmationQuestions.map((cq, cqIdx) => (
                <div key={cq.id} className="p-4 bg-[#F2D16B]/20 border-2 border-[#111111] space-y-2">
                  <p className="text-xs font-heading font-bold text-[#111111]/70">
                    Confirmation #{cqIdx + 1}
                  </p>
                  <p className="text-sm font-bold text-[#111111]">
                    {resolveLocalizedString(cq.prompt, currentLang).text}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {cq.options?.map((cOpt) => (
                      <div
                        key={cOpt.id}
                        role="radio"
                        aria-checked={confirmationAnswers[cq.id] === cOpt.id}
                        tabIndex={0}
                        onClick={() => handleConfirmationSelect(cq.id, cOpt.id)}
                        className={`min-h-[44px] p-2.5 border-2 text-xs font-bold cursor-pointer flex items-center gap-2.5 ${
                          confirmationAnswers[cq.id] === cOpt.id
                            ? "border-[#111111] bg-[#F2D16B] shadow-[2px_2px_0px_#111111]"
                            : "border-[#111111] bg-[#FFFFFF]"
                        }`}
                      >
                        <span className="w-5 h-5 border border-[#111111] flex items-center justify-center font-heading text-[10px]">
                          {cOpt.id}
                        </span>
                        <span>{resolveLocalizedString(cOpt.text, currentLang).text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!confirmationSubmitted && (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] font-heading font-bold text-xs shadow-[2px_2px_0px_#111111]"
                >
                  Confirm Diagnostic Result
                </button>
              )}
            </form>
          </div>
        )}
      </main>

      <footer className="border-t-4 border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Diagnostic Engine
      </footer>
    </div>
  );
}
