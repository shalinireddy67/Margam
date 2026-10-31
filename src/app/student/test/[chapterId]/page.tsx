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
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Question,
  Chapter,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import {
  chapters,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import {
  generateChapterTest,
  evaluateChapterTest,
  ChapterTestResult,
} from "@/lib/adaptive";
import StudentHeader from "@/components/StudentHeader";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";

export default function ChapterTestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.chapterId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [conceptAllocation, setConceptAllocation] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ChapterTestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

      const testAssembly = generateChapterTest(chapterId, 10);
      setQuestions(testAssembly.questions);
      setConceptAllocation(testAssembly.conceptAllocation);
      setLoading(false);
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
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] p-4 sm:p-6 pb-safe">
        <OfflineBanner />
        <div className="max-w-3xl mx-auto space-y-4 pt-4" role="status" aria-label="Generating chapter test">
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
            <div className="w-12 h-12 rounded-2xl bg-[#FFE14D] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#111111]">
              Chapter Test Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              Assessment questions for this chapter are currently in development or require lesson completion.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
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

  const handleSubmitTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    const testRes = evaluateChapterTest(chapterId, answers);
    setResult(testRes);

    const refreshed = getActiveProfile();
    if (refreshed) setProfile(refreshed);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);

    const testAssembly = generateChapterTest(chapterId, 10);
    setQuestions(testAssembly.questions);
    setConceptAllocation(testAssembly.conceptAllocation);
  };

  // Partition concepts into strong and weak
  const conceptBreakdownEntries = result ? Object.entries(result.conceptBreakdown) : [];
  const strongConcepts = conceptBreakdownEntries.filter(([, item]) => item.scorePercentage >= 70);
  const weakConcepts = conceptBreakdownEntries.filter(([, item]) => item.scorePercentage < 70);

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

          {/* Result Scorecard Banner */}
          {result && (
            <div
              className={`mt-4 p-5 rounded-2xl border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-5 ${
                result.passed
                  ? "bg-[#8DE86A]/30 text-[#111111]"
                  : "bg-[#FFE14D]/40 text-[#111111]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-5 h-5 text-[#111111]" />
                        <span>Chapter Mastered! Score: {result.scorePercentage}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-[#111111]" />
                        <span>Test Attempted • Score: {result.scorePercentage}%</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs font-bold mt-1 text-[#111111]/80">
                    Correct: <strong>{result.correctCount} / {result.totalQuestions}</strong> questions
                    {!result.passed && " (70% required to master this chapter)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border-[2px] border-[#111111] text-xs font-heading font-extrabold text-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <span>Learning Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* SEPARATE WEAK AND STRONG CONCEPTS */}
              <div className="space-y-4 pt-2 border-t-[2px] border-[#111111]/10">
                {/* 1. Strong Concepts Section */}
                {strongConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#111111] uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-[#111111]" />
                      <span>Strong Concepts (Mastered • &gt;= 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {strongConcepts.map(([cId, item]) => {
                        const conceptItem = getConceptById(cId);
                        const conceptName = conceptItem
                          ? (conceptItem.name[currentLang] || conceptItem.name.en)
                          : cId;
                        return (
                          <div
                            key={cId}
                            className="bg-[#FFFFFF] p-3 rounded-xl border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] text-xs flex items-center justify-between"
                          >
                            <span className="font-heading font-extrabold text-[#111111] truncate mr-2">
                              {conceptName}
                            </span>
                            <span className="font-bold shrink-0 px-2 py-0.5 rounded-md bg-[#8DE86A] text-[#111111] border border-[#111111]">
                              {item.correct}/{item.total} ({item.scorePercentage}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Weak Concepts Section */}
                {weakConcepts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#111111] uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4 text-[#111111]" />
                      <span>Weak Concepts (Needs Review • &lt; 70%)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {weakConcepts.map(([cId, item]) => {
                        const conceptItem = getConceptById(cId);
                        const conceptName = conceptItem
                          ? (conceptItem.name[currentLang] || conceptItem.name.en)
                          : cId;
                        return (
                          <div
                            key={cId}
                            className="bg-[#FFFFFF] p-3 rounded-xl border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111] text-xs flex items-center justify-between"
                          >
                            <span className="font-heading font-extrabold text-[#111111] truncate mr-2">
                              {conceptName}
                            </span>
                            <span className="font-bold shrink-0 px-2 py-0.5 rounded-md bg-[#FF4F9A] text-[#111111] border border-[#111111]">
                              {item.correct}/{item.total} ({item.scorePercentage}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Next Steps Recommendation Card */}
                <div className="p-4 bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111] space-y-2">
                  <h3 className="text-xs font-heading font-extrabold text-[#111111] uppercase tracking-wider">
                    Recommended Next Steps
                  </h3>
                  {weakConcepts.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#111111]/80 leading-relaxed">
                        Review the lessons for your weak concepts before retaking this assessment:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {weakConcepts.map(([cId]) => {
                          const conceptItem = getConceptById(cId);
                          const name = conceptItem ? (conceptItem.name[currentLang] || conceptItem.name.en) : cId;
                          return (
                            <Link
                              key={cId}
                              href={`/lesson/${cId}`}
                              className="inline-flex items-center min-h-[48px] px-3.5 py-1.5 rounded-xl bg-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold text-[#111111] shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
                            >
                              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                              <span>Review {name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-[#111111]/80 leading-relaxed">
                      All concepts in this chapter are mastered. Proceed to the next chapter on your learning path.
                    </p>
                  )}
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

        {/* Test Questions List */}
        <form onSubmit={handleSubmitTest} className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const isCorrect = answers[q.id] === q.correctAnswer;
            const promptData = resolveLocalizedString(q.prompt, currentLang);

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

                <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                      Draft Translation
                    </span>
                  )}
                </h2>

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
                {result && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-[2px] border-[#111111] text-xs font-bold leading-relaxed space-y-2 ${
                      isCorrect
                        ? "bg-[#8DE86A]/30 text-[#111111]"
                        : "bg-[#FF4F9A]/20 text-[#111111]"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-heading font-extrabold text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#111111]" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                    {(() => {
                      const expData = resolveLocalizedString(q.explanation, currentLang);
                      return (
                        <p className="text-[#111111]/80 pt-1 flex items-center flex-wrap gap-1.5">
                          <strong className="text-[#111111]">Explanation:</strong> <span>{expData.text}</span>
                          {expData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                              Draft
                            </span>
                          )}
                        </p>
                      );
                    })()}
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
                <span>Submit Chapter Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-[3px] border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Chapter Assessment
      </footer>
    </div>
  );
}
