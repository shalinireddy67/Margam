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
  Sparkles,
  BookOpen,
  Compass,
  Award,
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
          setErrorMessage(err.message || "Network error loading test questions");
          setLoading(false);
        }
      }
    }

    loadTest();

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

          {/* Test Allocation Breakdown */}
          {Object.keys(conceptAllocation).length > 0 && (
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center flex-wrap gap-2 text-xs">
              <span className="font-bold text-slate-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Test Blueprint:</span>
              </span>
              {Object.entries(conceptAllocation).map(([cId, count]) => {
                const c = getConceptById(cId);
                const name = c ? (c.name[currentLang] || c.name.en) : cId;
                return (
                  <span
                    key={cId}
                    className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700"
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
              className={`mt-6 p-6 rounded-2xl border ${
                result.passed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-xl flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-6 h-6 text-emerald-700" />
                        <span>Chapter Test Passed!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-amber-700" />
                        <span>Review Recommended</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1">
                    Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%)
                    {result.passed
                      ? " • You have demonstrated mastery of this chapter!"
                      : " • 70% required to master this chapter."}
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
                    <span>Back to Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Concept-by-Concept Performance Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Concept Mastery Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Strong Concepts */}
                {result.strongConcepts && result.strongConcepts.length > 0 && (
                  <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Strong Concepts (Mastered)
                    </span>
                    <ul className="space-y-1">
                      {result.strongConcepts.map((sc) => (
                        <li key={sc.conceptId} className="text-xs text-slate-700 flex justify-between">
                          <span className="truncate pr-2">{sc.conceptName}</span>
                          <span className="font-bold text-emerald-700">{sc.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weak Concepts */}
                {result.weakConcepts && result.weakConcepts.length > 0 && (
                  <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                      Concepts Needing Attention
                    </span>
                    <ul className="space-y-1">
                      {result.weakConcepts.map((wc) => (
                        <li key={wc.conceptId} className="text-xs text-slate-700 flex justify-between">
                          <span className="truncate pr-2">{wc.conceptName}</span>
                          <span className="font-bold text-rose-700">{wc.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);
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
                <span>{submitting ? "Evaluating Chapter Test..." : "Submit Chapter Test"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
