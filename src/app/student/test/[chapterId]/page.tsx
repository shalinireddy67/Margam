"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  BarChart2,
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

  useEffect(() => {
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
  }, [chapterId, router]);

  const currentChapter: Chapter | undefined = chapters.find((c) => c.id === chapterId);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Generating chapter test...</p>
        </div>
      </div>
    );
  }

  if (!currentChapter || questions.length === 0) {
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
            <h1 className="text-xl font-heading font-bold text-foreground">
              Chapter Test Unavailable
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Assessment questions for this chapter are currently in development.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Learning Path</span>
            </Link>
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
            <span>Chapter Mastery Test</span>
            <span>•</span>
            <span>Class {currentChapter.class}</span>
            <span>•</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {currentChapter.name[currentLang] || currentChapter.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Comprehensive 10-question chapter evaluation. Questions are adaptively allocated across concepts based on your mastery profile.
          </p>

          {/* Result Scorecard Banner */}
          {result && (
            <div
              className={`mt-6 p-6 rounded-2xl border space-y-4 ${
                result.passed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-5 h-5 text-emerald-700" />
                        <span>Chapter Mastered! Score: {result.scorePercentage}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                        <span>Test Attempted • Score: {result.scorePercentage}%</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs mt-1">
                    Correct: <strong>{result.correctCount} / {result.totalQuestions}</strong> questions
                    {!result.passed && " (70% required to master this chapter)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft transition-all"
                  >
                    <span>Learning Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Concept Mastery Breakdown */}
              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-700">
                  Concept Mastery Breakdown
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(result.conceptBreakdown).map(([cId, item]) => {
                    const conceptItem = getConceptById(cId);
                    return (
                      <div
                        key={cId}
                        className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 truncate mr-2">
                          {conceptItem ? conceptItem.name.en : cId}
                        </span>
                        <span className="font-bold shrink-0 text-slate-900">
                          {item.correct}/{item.total} ({item.scorePercentage}%) • Mastery: {item.updatedMastery}%
                        </span>
                      </div>
                    );
                  })}
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
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                    Difficulty Level {q.difficulty}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-foreground leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      Draft Translation
                    </span>
                  )}
                </h3>

                <div className="space-y-2 pt-2">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const isCorrectAnswer = q.correctAnswer === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-slate-200 hover:border-slate-300";
                    let optionBgClass = "bg-white";

                    if (result) {
                      if (isCorrectAnswer) {
                        optionBorderClass = "border-emerald-500 ring-1 ring-emerald-500";
                        optionBgClass = "bg-emerald-50/60";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionBorderClass = "border-rose-400 ring-1 ring-rose-400";
                        optionBgClass = "bg-rose-50/60";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-primary ring-2 ring-primary/20";
                      optionBgClass = "bg-slate-50";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`min-h-[48px] flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${optionBorderClass} ${optionBgClass}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm text-foreground font-medium pt-0.5 flex items-center flex-wrap gap-2">
                          <span>{optData.text}</span>
                          {optData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
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
                    className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      isCorrect
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/80 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                    {(() => {
                      const expData = resolveLocalizedString(q.explanation, currentLang);
                      return (
                        <p className="text-slate-700 pt-1 flex items-center flex-wrap gap-1.5">
                          <strong>Explanation:</strong> <span>{expData.text}</span>
                          {expData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
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
            <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground font-semibold">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs shadow-soft transition-all"
              >
                <span>Submit Chapter Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam Adaptive Mathematics • Chapter Assessment
      </footer>
    </div>
  );
}
