"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
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
  getChapterQuestionCount,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";

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
  const [submitting, setSubmitting] = useState(false);

  // Confirmation Step State
  const [confirmationQuestions, setConfirmationQuestions] = useState<ClientQuestion[]>([]);
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null);
  const [confirmationAnswers, setConfirmationAnswers] = useState<Record<string, string>>({});
  const [confirmationStatus, setConfirmationStatus] = useState<"pending" | "passed" | "failed" | null>(null);
  const [confirmationSubmitted, setConfirmationSubmitted] = useState(false);

  useEffect(() => {
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

    // Fetch questions from server route (sanitized, no answers/tags)
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
          setErrorMessage(err.message || "Network error loading questions");
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isCancelled = true;
    };
  }, [chapterId, router]);

  const currentChapter: Chapter | undefined = chapters.find((c) => c.id === chapterId);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Preparing diagnostic assessment...</p>
        </div>
      </div>
    );
  }

  // Guard: If chapter has fewer than 6 questions, block diagnostic and inform student
  const questionCount = getChapterQuestionCount(chapterId);
  if (!currentChapter || questionCount < 6) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              Lesson-Only Chapter
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This chapter has {questionCount} questions available (minimum 6 required for diagnostic placement).
              Please complete this chapter by learning the sequential lessons directly.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft"
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

  const handleSubmitDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    if (!sessionToken) {
      setErrorMessage("Missing session token. Please reload the assessment.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

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
        throw new Error(errData.error || "Submission failed");
      }

      const diagResult: DiagnosticResultResponse = await res.json();
      setResult(diagResult);

      // Placement Rule: score >= 70% unlocks chapter lessons
      const passed = diagResult.percentage >= 70;
      setPlacementPassed(passed);
      if (passed) {
        const updated = unlockChapterLessons(chapterId);
        if (updated) setProfile(updated);
      }

      // Check confirmation questions
      if (diagResult.confirmationQuestions && diagResult.confirmationQuestions.length > 0) {
        setConfirmationQuestions(diagResult.confirmationQuestions);
        setConfirmationToken(diagResult.confirmationToken || null);
        setConfirmationStatus("pending");
      } else if (
        diagResult.gapAnalysis?.hasGap &&
        diagResult.gapAnalysis?.rootConceptId
      ) {
        if (diagResult.gapAnalysis.routing === "gap_card") {
          setConfirmationStatus("failed");
        } else {
          setConfirmationStatus("passed");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit diagnostic assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(confirmationAnswers).length < confirmationQuestions.length) {
      alert("Please answer both check questions to verify your understanding.");
      return;
    }

    if (!confirmationToken) {
      setConfirmationStatus("failed");
      setConfirmationSubmitted(true);
      return;
    }

    try {
      const res = await fetch("/api/diagnostic/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationToken,
          studentId: profile.id,
          answers: confirmationAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error("Confirmation verification failed");
      }

      const confirmData = await res.json();
      setConfirmationSubmitted(true);
      if (confirmData.allCorrect) {
        setConfirmationStatus("passed");
      } else {
        setConfirmationStatus("failed");
      }
    } catch {
      setConfirmationSubmitted(true);
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
    // Reload a fresh session
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-2">
            <span>Diagnostic Assessment</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Take this 6-question diagnostic to test out of this chapter or identify foundational prerequisite topics.
            A score of 70% or more immediately unlocks this chapter&apos;s lessons.
          </p>

          {/* Placement Result Banner */}
          {result && (
            <div
              className={`mt-6 p-5 rounded-2xl border ${
                placementPassed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-sm sm:text-base flex items-start sm:items-center gap-2">
                    {placementPassed ? (
                      <>
                        <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                        <span>Placement Passed! Chapter Lessons Unlocked</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                        <span>Diagnostic Attempted • Complete Lessons in Order</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs mt-1">
                    Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%)
                    {!placementPassed && " • 70% required for instant placement"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft transition-all"
                  >
                    <span>Chapter Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* STEP 5 CONFIRMATION CHECK: Interactive Check Before Gap Routing */}
        {result && confirmationQuestions.length > 0 && confirmationStatus === "pending" && (
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-7 shadow-sm mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sky-900 font-heading font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <span>Prerequisite Check: Quick Verification</span>
            </div>
            <p className="text-xs text-sky-800 leading-relaxed">
              We noticed a pattern in your diagnostic answers that might connect to a foundational prerequisite.
              Please answer these 2 quick questions to confirm whether you already know this concept:
            </p>

            <form onSubmit={handleSubmitConfirmation} className="space-y-4 pt-2">
              {confirmationQuestions.map((q, qIdx) => {
                const promptData = resolveLocalizedString(q.prompt, currentLang);
                return (
                  <div key={q.id} data-confirm-qid={q.id} className="bg-white p-4 rounded-2xl border border-sky-100 space-y-2">
                    <p className="text-xs font-bold text-sky-950">
                      Check Question {qIdx + 1}: {promptData.text}
                    </p>
                    <div className="space-y-1.5">
                      {q.options?.map((opt) => {
                        const isSelected = confirmationAnswers[q.id] === opt.id;
                        const optData = resolveLocalizedString(opt.text, currentLang);
                        return (
                          <div
                            key={opt.id}
                            data-confirm-oid={opt.id}
                            onClick={() => handleSelectConfirmationOption(q.id, opt.id)}
                            className={`min-h-[48px] p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 font-semibold"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                              {opt.id}
                            </span>
                            <span>{optData.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft transition-all"
              >
                <span>Verify Prerequisite Understanding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* CONFIRMATION PASSED: No Routing */}
        {confirmationStatus === "passed" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 mb-6 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block text-sm font-bold">Prerequisite Check Passed!</strong>
              You answered the foundational check questions correctly. No prerequisite remediation routing is required.
            </div>
          </div>
        )}

        {/* CONFIRMATION FAILED: SHOW GAP CARD (WHATEVER THE SCORE) */}
        {confirmationStatus === "failed" && result?.gapAnalysis?.rootConceptId && (() => {
          const rootConcept = getConceptById(result.gapAnalysis.rootConceptId);
          const exactConceptName = rootConcept
            ? (rootConcept.name[currentLang] || rootConcept.name.en)
            : result.gapAnalysis.rootConceptId;

          const pathNodes = result.gapAnalysis.prerequisitePath || [];

          return (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-7 shadow-sm mb-6 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-rose-950 font-heading font-extrabold text-base">
                  <GitBranch className="w-5 h-5 text-rose-700" />
                  <span>Identified Prerequisite Gap</span>
                </div>
                {rootConcept && (
                  <span className="px-3 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-bold">
                    Class {rootConcept.class} • Concept ID: {rootConcept.id}
                  </span>
                )}
              </div>

              {/* Exact Concept Name from concepts.json */}
              <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-1.5">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                  Foundational Concept to Review
                </span>
                <h3 className="text-lg font-heading font-extrabold text-slate-900 tracking-tight">
                  {exactConceptName}
                </h3>
                {rootConcept && currentLang !== "en" && rootConcept.name.en !== exactConceptName && (
                  <p className="text-xs text-slate-500 font-medium">
                    {rootConcept.name.en}
                  </p>
                )}
                {rootConcept && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100 mt-2">
                    <strong className="text-slate-700">Learning Objective: </strong>
                    {rootConcept.learningObjective[currentLang] || rootConcept.learningObjective.en}
                  </p>
                )}
              </div>

              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {result.gapAnalysis.plainLanguageReason}
              </p>

              {/* Visual DAG Journey Path */}
              {pathNodes.length > 0 && (
                <div className="bg-white/80 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                    Learning Journey Backtrack
                  </span>
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    {pathNodes.map((nodeId, idx) => {
                      const nodeConcept = getConceptById(nodeId);
                      const isLast = idx === pathNodes.length - 1;
                      const nodeConceptName = nodeConcept
                        ? (nodeConcept.name[currentLang] || nodeConcept.name.en)
                        : nodeId;
                      return (
                        <React.Fragment key={nodeId}>
                          <span
                            className={`px-2.5 py-1 rounded-xl font-bold border ${
                              isLast
                                ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                                : "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                          >
                            {nodeConcept ? `Class ${nodeConcept.class}: ${nodeConceptName}` : nodeId}
                          </span>
                          {!isLast && <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA Button to Prerequisite Lesson */}
              <div className="pt-2">
                <Link
                  id="fix-this-first-btn"
                  href={`/lesson/${result.gapAnalysis.rootConceptId}?fromGap=true&reason=${encodeURIComponent(
                    result.gapAnalysis.plainLanguageReason || ""
                  )}`}
                  className="w-full inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-heading font-bold text-xs shadow-soft transition-all"
                >
                  <span>Fix this first: Review Foundational Lesson (Basics-First)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Diagnostic Questions List */}
        <form onSubmit={handleSubmitDiagnostic} className="space-y-6">
          {questions.map((q, qIndex) => {
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);
            const isAnswered = !!answers[q.id];

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        Answered
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h3 className="text-base sm:text-lg font-heading font-bold text-foreground leading-snug">
                      {promptData.text}
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 ml-2">
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

                    let optionBorderClass = "border-slate-200 hover:border-slate-300";
                    let optionBgClass = "bg-white";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-emerald-500 ring-1 ring-emerald-500";
                        optionBgClass = "bg-emerald-50/60";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-rose-400 ring-1 ring-rose-400";
                        optionBgClass = "bg-rose-50/60";
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`min-h-[48px] p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 font-semibold"
                            : `${optionBorderClass} ${optionBgClass}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-slate-800 leading-snug">{optData.text}</span>
                        </div>
                        {result && feedbackItem && isSelected && (
                          feedbackItem.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!result && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center min-h-[48px] gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-heading font-extrabold text-sm shadow-soft transition-all disabled:opacity-50"
              >
                <span>{submitting ? "Evaluating Assessment..." : "Submit Diagnostic Assessment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
