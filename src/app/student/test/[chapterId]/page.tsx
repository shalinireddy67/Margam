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
      <div className="min-h-screen bg-voxel-sky text-[#2B1B0F] p-4 sm:p-6 pb-28">
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
      <div className="min-h-screen bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] p-8 shadow-[6px_6px_0px_#1B120C] space-y-4">
            <div className="w-12 h-12 bg-[#D9453D] border-[2px] border-[#422816] flex items-center justify-center mx-auto text-[#FFF7E6] font-pixel text-lg">
              !
            </div>
            <h1 className="font-pixel text-lg text-[#2B1B0F]">
              Chapter Test Error
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
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
      <div className="min-h-screen bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] p-8 shadow-[6px_6px_0px_#1B120C] space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-[2px] border-[#422816] flex items-center justify-center mx-auto text-[#2B1B0F]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-pixel text-lg text-[#2B1B0F]">
              Chapter Test Unavailable
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
              This chapter assessment is currently in progress. Complete prerequisite lesson worksheets first.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-white border-[2px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] no-underline hover:bg-[#4E9330]"
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
    <div className="min-h-[100dvh] bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between pb-24">
      <OfflineBanner />

      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Header Card */}
        <div className="bg-[#FFF7E6] p-6 sm:p-8 border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] space-y-3">
          <div className="flex items-center gap-2 text-xs font-pixel text-[#5DAA3A]">
            <span>Chapter Mastery Test</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-pixel text-[#2B1B0F] tracking-wide">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
            Comprehensive 10-question chapter evaluation. Questions are adaptively allocated across concepts based on your mastery profile.
          </p>

          {/* Test Allocation Breakdown */}
          {Object.keys(conceptAllocation).length > 0 && (
            <div className="mt-4 p-3.5 bg-[#5A3720] text-[#FFF7E6] border-[2px] border-[#422816] flex items-center flex-wrap gap-2 text-xs">
              <span className="font-pixel text-[#FFE9A8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Test Blueprint:</span>
              </span>
              {Object.entries(conceptAllocation).map(([cId, count]) => {
                const c = getConceptById(cId);
                const name = c ? (c.name[currentLang] || c.name.en) : cId;
                return (
                  <span
                    key={cId}
                    className="inline-flex items-center px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#422816] text-[11px] font-pixel"
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
              className={`mt-6 p-6 border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] space-y-5 ${
                result.passed
                  ? "bg-[#5DAA3A] text-white"
                  : "bg-[#FFE9A8] text-[#2B1B0F]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-pixel text-base sm:text-lg flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-6 h-6 text-white" />
                        <span>Chapter Mastered! Score: {result.percentage}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-[#A06A3C]" />
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
                    className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 bg-[#FFF7E6] text-[#2B1B0F] border-[2px] border-[#422816] text-xs font-pixel shadow-[2px_2px_0px_#1B120C] active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 bg-[#5DAA3A] hover:bg-[#4E9330] text-white border-[2px] border-[#422816] text-xs font-pixel shadow-[2px_2px_0px_#1B120C] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <span>Back to Learning</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* SEPARATE WEAK AND STRONG CONCEPTS */}
              <div className="space-y-4 pt-3 border-t-2 border-[#422816]/30">
                {/* 1. Strong Concepts Section */}
                {result.strongConcepts && result.strongConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-pixel uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-white" />
                      <span>Strong Concepts (Mastered • &gt;= 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.strongConcepts.map((sc) => (
                        <div
                          key={sc.conceptId}
                          className="bg-[#FFF7E6] text-[#2B1B0F] p-3 border-[2px] border-[#422816] text-xs flex items-center justify-between"
                        >
                          <span className="font-bold truncate mr-2">
                            {sc.conceptName}
                          </span>
                          <span className="font-pixel shrink-0 px-2 py-0.5 bg-[#5DAA3A] text-white border border-[#422816]">
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
                          className="bg-[#FFF7E6] text-[#2B1B0F] p-3 border-[2px] border-[#422816] text-xs flex items-center justify-between"
                        >
                          <span className="font-bold truncate mr-2">
                            {wc.conceptName}
                          </span>
                          <span className="font-pixel shrink-0 px-2 py-0.5 bg-[#D9453D] text-white border border-[#422816]">
                            {wc.score}/{wc.total} ({wc.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Next Steps Recommendation Card */}
                {result.nextSteps && result.nextSteps.length > 0 && (
                  <div className="p-4 bg-[#FFF7E6] text-[#2B1B0F] border-[2px] border-[#422816] space-y-2">
                    <h3 className="text-xs font-pixel text-[#5A3720] uppercase tracking-wider">
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-1">
                      {result.nextSteps.map((step, idx) => (
                        <p key={idx} className="text-xs font-semibold text-[#5A3720] leading-relaxed font-sans">
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
            <div className="mt-4 p-3.5 bg-[#D9453D] text-white border-[2px] border-[#422816] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
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
                className="bg-[#FFF7E6] p-6 sm:p-7 border-[3px] border-[#422816] shadow-[5px_5px_0px_#1B120C] space-y-4 text-[#2B1B0F]"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#E5D7BE] pb-3">
                  <span className="text-xs font-pixel text-[#5DAA3A] uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-pixel text-[#2B1B0F] px-2.5 py-0.5 bg-[#FFE9A8] border border-[#422816]">
                    Level {q.difficulty}
                  </span>
                </div>

                <h2 className="font-pixel text-sm sm:text-base text-[#2B1B0F] leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-pixel bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
                      Draft Translation
                    </span>
                  )}
                </h2>

                <div className="space-y-2.5 pt-1">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-[2px] border-[#422816]/30";
                    let optionBgClass = "bg-white/80 text-[#2B1B0F] hover:border-[#422816] hover:bg-white";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-[2px] border-[#422816]";
                        optionBgClass = "bg-[#5DAA3A] text-white";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-[2px] border-[#422816]";
                        optionBgClass = "bg-[#D9453D] text-white";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-[2px] border-[#422816]";
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
                        className={`min-h-[48px] flex items-center gap-3 p-3.5 border-2 cursor-pointer select-none transition-transform active:translate-x-[1px] active:translate-y-[1px] ${optionBorderClass} ${optionBgClass}`}
                      >
                        <span
                          className={`w-7 h-7 font-pixel text-xs flex items-center justify-center shrink-0 border-2 border-[#422816] ${
                            isSelected
                              ? "bg-[#FFE9A8] text-[#2B1B0F]"
                              : "bg-[#FFF7E6] text-[#5A3720]"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm font-semibold flex items-center flex-wrap gap-2 font-sans">
                          <span>{optData.text}</span>
                          {optData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-pixel bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
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
            <div className="sticky bottom-4 z-30 bg-[#5A3720] border-[3px] border-[#422816] p-4 shadow-[0px_4px_0px_#1B120C] flex items-center justify-between gap-4 text-[#FFF7E6]">
              <span className="text-xs font-pixel text-[#FFE9A8]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-white border-[2px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50 transition-colors"
              >
                <span>{submitting ? "Evaluating..." : "Submit Chapter Test"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-2 border-[#422816]/20 py-4 text-center text-xs text-[#5A3720] bg-[#FFF7E6]">
        Margam Adaptive Mathematics • Chapter Assessment
      </footer>
    </div>
  );
}
