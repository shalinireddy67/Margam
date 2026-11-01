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
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { canAccessTopic } from "@/lib/progression";
import {
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";

interface SanitizedOption {
  id: string;
  text: any;
}

interface ClientPracticeQuestion {
  id: string;
  conceptId: string;
  difficulty: number;
  type: string;
  contextTag?: string;
  prompt: any;
  options?: SanitizedOption[];
}

interface PracticeResultResponse {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  mastery: number;
  nextDifficulty: 1 | 2 | 3;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    chosenAnswer: string;
    tag?: string;
    hint?: string;
  }>;
  mistakeHint?: string;
}

export default function AdaptivePracticeRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params?.conceptId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<ClientPracticeQuestion[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PracticeResultResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/");
      return;
    }

    const access = canAccessTopic(conceptId, active, true);
    if (!access.accessible) {
      alert(access.reason || "You cannot access this practice worksheet yet.");
      router.replace("/");
      return;
    }

    setProfile(active);

    let isCancelled = false;
    async function loadPractice() {
      try {
        const res = await fetch("/api/practice/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conceptId,
            studentId: active!.id,
            count: 3,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load practice questions");
        }

        const data = await res.json();
        if (!isCancelled) {
          setQuestions(data.questions || []);
          setSessionToken(data.token || null);
          setLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setErrorMessage(err.message || "Network error loading practice questions");
          setLoading(false);
        }
      }
    }

    loadPractice();

    return () => {
      isCancelled = true;
    };
  }, [conceptId, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Loading adaptive practice...</p>
        </div>
      </div>
    );
  }

  const concept = getConceptById(conceptId);

  if (!concept || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-md text-center">
          <h2 className="text-lg font-bold text-foreground">No Questions Found</h2>
          <p className="text-xs text-muted-foreground mt-2">
            Practice questions for this topic are currently being prepared.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Return to Learning Path
          </Link>
        </div>
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
      setErrorMessage("Missing session token. Please reload practice.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/practice/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sessionToken,
          conceptId,
          studentId: profile.id,
          answers,
          currentDifficulty: difficultyLevel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Practice evaluation failed");
      }

      const practiceRes: PracticeResultResponse = await res.json();
      setResult(practiceRes);
      if (practiceRes.nextDifficulty) {
        setDifficultyLevel(practiceRes.nextDifficulty);
      }

      const refreshed = getActiveProfile();
      if (refreshed) setProfile(refreshed);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit practice.");
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

  const renderStars = (level: number) => {
    return (
      <span className="inline-flex items-center text-amber-500 font-bold tracking-wider">
        {"★".repeat(level)}
        <span className="text-slate-300">{"★".repeat(3 - level)}</span>
      </span>
    );
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
        {/* Title Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>Adaptive Practice</span>
              <span>•</span>
              <span>Class {concept.class}</span>
            </div>

            {/* Difficulty Badge with 1 to 3 stars */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950">
              <span>Difficulty Level {difficultyLevel}</span>
              {renderStars(difficultyLevel)}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Results Summary Box */}
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
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.passed ? (
                      <>
                        <Award className="w-5 h-5 text-emerald-700" />
                        <span>Practice Complete! Mastery Updated</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                        <span>Practice Attempted • Review Recommended</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs mt-1">
                    Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%) • Mastery: <strong>{result.mastery}%</strong>
                    {result.passed
                      ? " • Next level unlocked!"
                      : " • Keep practicing to build confidence."}
                  </p>
                  {result.mistakeHint && (
                    <p className="text-xs mt-2 p-2.5 rounded-xl bg-white/80 border border-amber-300 text-amber-900 font-medium">
                      💡 <strong>Hint:</strong> {result.mistakeHint}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Again</span>
                  </button>

                  <Link
                    href={`/lesson/${conceptId}`}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft transition-all"
                  >
                    <span>Review Lesson</span>
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

        {/* Practice Questions List */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);

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
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                      Difficulty Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h3 className="font-heading font-bold text-base text-foreground leading-relaxed flex items-center flex-wrap gap-2">
                      <span>{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
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
                    } else if (isSelected) {
                      optionBorderClass = "border-primary ring-2 ring-primary/20";
                      optionBgClass = "bg-slate-50";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`min-h-[48px] p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer flex items-center justify-between transition-all ${optionBorderClass} ${optionBgClass}`}
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
                <span>{submitting ? "Checking Answers..." : "Submit Practice Worksheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
