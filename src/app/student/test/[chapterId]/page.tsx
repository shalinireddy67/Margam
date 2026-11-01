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
  Award,
  Lock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Layers,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Chapter,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import {
  chapters,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";
import {
  SkeletonCard,
  OfflineBanner,
  Button,
} from "@/components/ui";

interface SanitizedOption {
  id: string;
  text: any;
}

interface ClientTestQuestion {
  id: string;
  conceptId: string;
  difficulty: number;
  type: string;
  contextTag?: string;
  prompt: any;
  options?: SanitizedOption[];
}

interface ConceptPerformance {
  conceptId: string;
  conceptName: string;
  score: number;
  total: number;
  percentage: number;
  category: "mastered" | "in_progress" | "needs_attention";
}

interface ChapterTestResultResponse {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  strongConcepts: ConceptPerformance[];
  weakConcepts: ConceptPerformance[];
  nextSteps: string[];
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    conceptId: string;
    chosenOption: string;
  }>;
}

export default function ChapterTestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.chapterId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<ClientTestQuestion[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [conceptAllocation, setConceptAllocation] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ChapterTestResultResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initTest = useCallback(() => {
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

      let isCancelled = false;
      async function loadTest() {
        try {
          const res = await fetch("/api/test/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterId,
              studentId: active!.id,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to generate test");
          }

          const data = await res.json();
          if (!isCancelled) {
            setQuestions(data.questions || []);
            setSessionToken(data.token || null);
            setConceptAllocation(data.conceptAllocation || {});
            setLoading(false);
          }
        } catch (err: any) {
          if (!isCancelled) {
            setHasError(true);
            setErrorMessage(err.message || "Network error loading test questions");
            setLoading(false);
          }
        }
      }

      loadTest();

      return () => {
        isCancelled = true;
      };
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load chapter test.");
      setLoading(false);
    }
  }, [chapterId, router]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const currentChapter: Chapter | undefined = chapters.find((c) => c.id === chapterId);

  // 1. Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#7EC8E3] text-[#111111] p-4 sm:p-6 pb-28">
        <OfflineBanner />
        <div className="max-w-4xl mx-auto space-y-4 pt-4" role="status" aria-label="Generating chapter test">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Error State with Retry
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
              Chapter Test Error
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {errorMessage || "We encountered an issue preparing the chapter assessment questions."}
            </p>
            <div className="pt-2">
              <Button
                variant="yellow"
                size="default"
                onClick={initTest}
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

  // 3. Locked / Unavailable State
  if (!currentChapter || questions.length === 0) {
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
          <div className="bg-[#FFFFFF] p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 bg-[#F2D16B] border-2 border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Chapter Test Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              Assessment questions for this chapter are currently in development or require lesson completion.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
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

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    if (!sessionToken) {
      setErrorMessage("Missing session token. Please reload the test.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/test/submit", {
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

      const testRes: ChapterTestResultResponse = await res.json();
      setResult(testRes);

      const refreshed = getActiveProfile();
      if (refreshed) setProfile(refreshed);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit test.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#7EC8E3] text-[#111111] flex flex-col justify-between pb-24">
      <OfflineBanner />

      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Header Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
            <span>Chapter Mastery Test</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-[#111111]/80 leading-relaxed">
            Comprehensive 10-question chapter evaluation. Questions are adaptively allocated across concepts based on your mastery profile.
          </p>

          {/* Test Allocation Breakdown */}
          {Object.keys(conceptAllocation).length > 0 && (
            <div className="mt-4 p-3.5 bg-[#F2D16B]/30 border-2 border-[#111111] flex items-center flex-wrap gap-2 text-xs">
              <span className="font-heading font-bold text-[#111111] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Test Blueprint:</span>
              </span>
              {Object.entries(conceptAllocation).map(([cId, count]) => {
                const c = getConceptById(cId);
                const name = c ? (c.name[currentLang] || c.name.en) : cId;
                return (
                  <span
                    key={cId}
                    className="inline-flex items-center px-2 py-0.5 bg-[#FFFFFF] border border-[#111111] text-[11px] font-heading font-bold text-[#111111]"
                  >
                    {name}: {count} Qs
                  </span>
                );
              })}
            </div>
          )}

          {/* Results Summary Card */}
          {result && (
            <div
              className={`mt-6 p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-5 ${
                result.passed
                  ? "bg-[#5DB84A]/30 text-[#111111]"
                  : "bg-[#F2D16B]/40 text-[#111111]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-6 h-6 text-[#3C8A2E]" />
                        <span>Chapter Mastered! Score: {result.percentage}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-[#D9453D]" />
                        <span>Test Attempted • Score: {result.percentage}%</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs font-bold mt-1 text-[#111111]/80">
                    Correct: <strong>{result.score} / {result.total}</strong> questions
                    {!result.passed && " (70% required to master this chapter)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-extrabold text-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <span>Back to Learning</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* SEPARATE WEAK AND STRONG CONCEPTS */}
              <div className="space-y-4 pt-3 border-t-2 border-[#111111]/20">
                {/* 1. Strong Concepts Section */}
                {result.strongConcepts && result.strongConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#3C8A2E] uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4" />
                      <span>Strong Concepts (Mastered • &gt;= 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.strongConcepts.map((sc) => (
                        <div
                          key={sc.conceptId}
                          className="bg-[#FFFFFF] p-3 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-xs flex items-center justify-between"
                        >
                          <span className="font-heading font-extrabold text-[#111111] truncate mr-2">
                            {sc.conceptName}
                          </span>
                          <span className="font-bold shrink-0 px-2 py-0.5 bg-[#5DB84A] text-[#111111] border border-[#111111]">
                            {sc.score}/{sc.total} ({sc.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Weak Concepts Section */}
                {result.weakConcepts && result.weakConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#D9453D] uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4" />
                      <span>Weak Concepts (Needs Review • &lt; 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.weakConcepts.map((wc) => (
                        <div
                          key={wc.conceptId}
                          className="bg-[#FFFFFF] p-3 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-xs flex items-center justify-between"
                        >
                          <span className="font-heading font-extrabold text-[#111111] truncate mr-2">
                            {wc.conceptName}
                          </span>
                          <span className="font-bold shrink-0 px-2 py-0.5 bg-[#D9453D] text-[#FFFFFF] border border-[#111111]">
                            {wc.score}/{wc.total} ({wc.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Next Steps Recommendation Card */}
                {result.nextSteps && result.nextSteps.length > 0 && (
                  <div className="p-4 bg-[#FFFFFF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] space-y-2">
                    <h3 className="text-xs font-heading font-extrabold text-[#111111] uppercase tracking-wider">
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-1">
                      {result.nextSteps.map((step, idx) => (
                        <p key={idx} className="text-xs font-bold text-[#111111]/80 leading-relaxed">
                          • {step}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-[#D9453D]/20 border-2 border-[#D9453D] text-xs font-bold text-[#111111] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D9453D]" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Test Questions List */}
        <form onSubmit={handleSubmitTest} className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);
            const promptData = resolveLocalizedString(q.prompt, currentLang);

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="bg-[#FFFFFF] p-6 sm:p-7 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#111111] pb-3">
                  <span className="text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-heading font-bold text-[#111111] px-2.5 py-0.5 bg-[#F2D16B] border border-[#111111]">
                    Level {q.difficulty}
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-[#F2D16B] text-[#111111] border border-[#111111]">
                      Draft Translation
                    </span>
                  )}
                </h2>

                <div className="space-y-2.5 pt-1">
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
                        className={`min-h-[48px] flex items-center gap-3 p-3.5 border-2 cursor-pointer select-none transition-transform active:translate-x-[1px] active:translate-y-[1px] ${optionBorderClass} ${optionBgClass}`}
                      >
                        <span
                          className={`w-7 h-7 font-heading font-extrabold text-xs flex items-center justify-center shrink-0 border-2 border-[#111111] ${
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
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold bg-[#F2D16B] text-[#111111] border border-[#111111]">
                              Draft
                            </span>
                          )}
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
                <span>{submitting ? "Evaluating..." : "Submit Chapter Test"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-4 border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Chapter Assessment
      </footer>
    </div>
  );
}
