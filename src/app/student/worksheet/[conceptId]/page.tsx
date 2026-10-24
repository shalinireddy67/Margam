"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Question,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { canAccessTopic } from "@/lib/progression";
import {
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import {
  selectPracticeQuestions,
  evaluatePracticeSubmission,
  PracticeResult,
} from "@/lib/adaptive";
import StudentHeader from "@/components/StudentHeader";

export default function AdaptivePracticeRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params?.conceptId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/");
      return;
    }

    // Allow remediation access if user is practicing a lower-class concept
    const access = canAccessTopic(conceptId, active, true);
    if (!access.accessible) {
      alert(access.reason || "You cannot access this practice worksheet yet.");
      router.replace("/");
      return;
    }

    setProfile(active);

    // Select adaptive practice questions matching student's per-concept difficulty level
    const practiceData = selectPracticeQuestions(conceptId, 3);
    setQuestions(practiceData.questions);
    setDifficultyLevel(practiceData.targetDifficulty);
    setLoading(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    // Evaluate submission through the adaptive engine
    const practiceRes = evaluatePracticeSubmission(conceptId, answers);
    setResult(practiceRes);
    setDifficultyLevel(practiceRes.updatedDifficulty);

    const refreshed = getActiveProfile();
    if (refreshed) setProfile(refreshed);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);

    // Refresh questions based on updated difficulty
    const practiceData = selectPracticeQuestions(conceptId, 3);
    setQuestions(practiceData.questions);
    setDifficultyLevel(practiceData.targetDifficulty);
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

          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Solve these 3 targeted questions to advance your mastery. Your difficulty level automatically adjusts based on your performance.
          </p>

          {/* Result Banner on Submission */}
          {result && (
            <div
              className={`mt-6 p-5 rounded-2xl border ${
                result.scorePercentage >= 70
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.scorePercentage >= 70 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Practice Complete! Mastery Updated to {result.updatedMastery}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                        <span>Practice Attempted • Mastery at {result.updatedMastery}%</span>
                      </>
                    )}
                  </h3>

                  <p className="text-xs mt-1">
                    Score: <strong>{result.correctCount} / {result.totalQuestions}</strong> ({result.scorePercentage}%)
                  </p>

                  {/* One-Line Note when the Level Changes */}
                  <div className="mt-3 text-xs font-bold flex items-center gap-2">
                    {result.difficultyChanged === "promoted" && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-emerald-700" />
                        Promoted to Difficulty Level {result.updatedDifficulty} {renderStars(result.updatedDifficulty)}! Keep going!
                      </span>
                    )}

                    {result.difficultyChanged === "demoted" && (
                      <span className="inline-flex items-center gap-1.5 text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
                        <TrendingDown className="w-4 h-4 text-amber-700" />
                        Adjusted to Difficulty Level {result.updatedDifficulty} {renderStars(result.updatedDifficulty)} to reinforce core foundations.
                      </span>
                    )}

                    {result.difficultyChanged === "maintained" && (
                      <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                        Difficulty maintained at Level {result.updatedDifficulty} {renderStars(result.updatedDifficulty)}.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Next Set</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft transition-all"
                  >
                    <span>Back to Lessons</span>
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
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);
            const isAnswered = !!answers[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 flex items-center gap-1">
                    Level {q.difficulty} {renderStars(q.difficulty)}
                  </span>
                </div>

                {/* Question Prompt */}
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
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${optionBorderClass} ${optionBgClass}`}
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

                {/* Question Feedback Post-Submission with Mistake Hint */}
                {feedbackItem && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      feedbackItem.isCorrect
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/80 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {feedbackItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Correct! Well reasoned.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>
                            Mistake Hint:{" "}
                            {feedbackItem.mistakeTag
                              ? feedbackItem.mistakeTag.replace(/_/g, " ")
                              : "Review calculation rule"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Explanation */}
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

          {/* Submission Bar */}
          {!result && (
            <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground font-semibold">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs shadow-soft transition-all"
              >
                <span>Submit Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
