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
import Footer from "@/components/Footer";
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
            throw new Error(errData.error || "Failed to start chapter test");
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
      <div className="min-h-screen  text-[#2B1B0F] p-4 sm:p-6 pb-28">
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
      <div className="min-h-screen  text-[#2B1B0F] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/80 shadow-lg space-y-4 max-w-lg mx-auto text-center text-slate-800">
            <div className="w-12 h-12 bg-rose-100 border border-rose-300 rounded-2xl flex items-center justify-center mx-auto text-rose-900 font-heading font-extrabold text-lg shadow-xs">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-emerald-950">
              Chapter Test Error
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              {errorMessage || "We encountered an issue preparing the chapter assessment questions."}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
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
      <div className="min-h-screen  text-[#2B1B0F] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/80 shadow-lg space-y-4 max-w-lg mx-auto text-center text-slate-800">
            <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-900 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-emerald-950">
              Chapter Test Unavailable
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              This chapter assessment is currently in progress. Complete prerequisite lesson worksheets first.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-extrabold shadow-sm no-underline transition-all"
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
    <div className="min-h-[100dvh] text-slate-800 flex flex-col justify-between">
      <OfflineBanner />

      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        {/* Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-emerald-950">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
            <span>Chapter Mastery Test</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
            Comprehensive 10-question chapter evaluation. Questions are adaptively allocated across concepts based on your mastery profile.
          </p>

          {/* Test Allocation Breakdown */}
          {Object.keys(conceptAllocation).length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-white/90 flex items-center flex-wrap gap-2 text-xs shadow-2xs">
              <span className="font-heading font-extrabold text-emerald-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Test Blueprint:</span>
              </span>
              {Object.entries(conceptAllocation).map(([cId, count]) => {
                const c = getConceptById(cId);
                const name = c ? (c.name[currentLang] || c.name.en) : cId;
                return (
                  <span
                    key={cId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-heading text-[11px] font-bold"
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
              className={`mt-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-5 text-slate-800 ${
                result.passed ? "border-t-4 border-t-emerald-500" : "border-t-4 border-t-amber-400"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-lg sm:text-xl text-emerald-950 flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-6 h-6 text-emerald-600" />
                        <span>Chapter Mastered! Score: {result.percentage}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                        <span>Test Attempted • Score: {result.percentage}%</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs font-semibold mt-1 font-sans opacity-90">
                    Correct: <strong>{result.score} / {result.total}</strong> questions
                    {!result.passed && " (70% required to master this chapter)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 bg-white/80 hover:bg-white text-slate-700 font-heading font-bold text-xs rounded-xl border border-white/90 shadow-xs transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm no-underline transition-all"
                  >
                    <span>Back to Learning</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* SEPARATE WEAK AND STRONG CONCEPTS */}
              <div className="space-y-4 pt-3 border-t border-white/80">
                {/* 1. Strong Concepts Section */}
                {result.strongConcepts && result.strongConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold uppercase tracking-wider text-emerald-900">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Strong Concepts (Mastered • &gt;= 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.strongConcepts.map((sc) => (
                        <div
                          key={sc.conceptId}
                          className="bg-white/80 text-slate-800 p-3 rounded-2xl border border-white/90 text-xs flex items-center justify-between shadow-2xs"
                        >
                          <span className="font-bold truncate mr-2">
                            {sc.conceptName}
                          </span>
                          <span className="font-heading font-bold shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200">
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
                    <div className="flex items-center gap-1.5 text-xs font-pixel text-[#D9453D] uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4 text-[#D9453D]" />
                      <span>Weak Concepts (Needs Review • &lt; 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.weakConcepts.map((wc) => (
                        <div
                          key={wc.conceptId}
                          className="bg-white/80 text-slate-800 p-3 rounded-2xl border border-white/90 text-xs flex items-center justify-between shadow-2xs"
                        >
                          <span className="font-bold truncate mr-2">
                            {wc.conceptName}
                          </span>
                          <span className="font-heading font-bold shrink-0 px-2 py-0.5 bg-rose-100 text-rose-900 rounded-lg border border-rose-200">
                            {wc.score}/{wc.total} ({wc.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Next Steps Recommendation Card */}
                {result.nextSteps && result.nextSteps.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-2">
                    <h3 className="text-xs font-heading font-extrabold text-amber-900 uppercase tracking-wider">
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-1">
                      {result.nextSteps.map((step, idx) => (
                        <p key={idx} className="text-xs text-slate-700 font-sans leading-relaxed">
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
            <div className="mt-4 p-3.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
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
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/80 pb-3">
                  <span className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full border border-amber-300 bg-amber-100 text-amber-900">
                    Level {q.difficulty}
                  </span>
                </div>

                <h2 className="font-sans text-base sm:text-lg font-bold text-slate-900 leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-heading font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                      Draft Translation
                    </span>
                  )}
                </h2>

                <div className="space-y-2.5 pt-1">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-white/80";
                    let optionBgClass = "bg-white/70 text-slate-800 hover:bg-white hover:border-emerald-300 hover:shadow-xs";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                        optionBgClass = "bg-[#5DAA3A] text-white";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                        optionBgClass = "bg-[#D9453D] text-white";
                      }
                    } else if (isSelected) {
                        optionBorderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                      optionBgClass = "bg-[#3FA7C9] text-white shadow-[3px_3px_0px_#1B120C]";
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
                        className={`min-h-[48px] flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${optionBorderClass} ${optionBgClass}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl border font-heading font-extrabold flex items-center justify-center text-xs shrink-0 ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm font-semibold flex items-center flex-wrap gap-2 font-sans">
                          <span>{optData.text}</span>
                          {optData.isDraft && (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-heading font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                        {result && feedbackItem && isSelected && (
                          feedbackItem.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-white shrink-0" />
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
            <div className="sticky bottom-4 z-30 glass-panel-elevated rounded-2xl p-4 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4 text-slate-800">
              <span className="text-xs font-heading font-extrabold text-emerald-950">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm cursor-pointer disabled:opacity-50 transition-all"
              >
                <span>{submitting ? "Evaluating..." : "Submit Chapter Test"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="py-6 text-center text-xs font-heading font-bold text-slate-600/80">
        Margam Adaptive Mathematics • Chapter Assessment
      </footer>
    </div>
  );
}
