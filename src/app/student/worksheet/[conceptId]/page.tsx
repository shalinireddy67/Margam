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
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  WorksheetResult,
  Question,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { submitWorksheet, canAccessTopic } from "@/lib/progression";
import { getConceptById, getQuestionsByConceptId, resolveLocalizedString } from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";

export default function WorksheetRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params?.conceptId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<WorksheetResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/student/select-class");
      return;
    }

    const access = canAccessTopic(conceptId, active);
    if (!access.accessible) {
      alert(access.reason || "You cannot access this worksheet yet.");
      router.replace(`/student/class/${active.selectedClass}`);
      return;
    }

    setProfile(active);
    setLoading(false);
  }, [conceptId, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Loading practice worksheet...</p>
        </div>
      </div>
    );
  }

  const concept = getConceptById(conceptId);
  const questions = getQuestionsByConceptId(conceptId);

  if (!concept || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-md text-center">
          <h2 className="text-lg font-bold text-foreground">No Questions Found</h2>
          <p className="text-xs text-muted-foreground mt-2">
            Practice questions for this topic are currently being prepared.
          </p>
          <Link
            href={`/student/class/${profile.selectedClass}`}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Return to Learning Path
          </Link>
        </div>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return; // Locked once submitted
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const submission = {
      conceptId,
      answers,
      submittedAt: new Date().toISOString(),
    };

    const res = submitWorksheet(submission);
    if (!res.success) {
      setErrorMessage(res.error || "Please answer at least one question.");
      return;
    }

    if (res.result && res.profile) {
      setResult(res.result);
      setProfile(res.profile);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref={`/student/class/${profile.selectedClass}`}
        backLabel={`Class ${profile.selectedClass} Path`}
      />

      {/* Main Practice Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-2">
            <span>Practice Worksheet</span>
            <span>•</span>
            <span>Class {concept.class}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Answer the following questions to verify your understanding. Instant feedback will explain any misconceptions.
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.scorePercentage >= 70 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Worksheet Passed! Next Topic Unlocked</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                        <span>Worksheet Attempted • Topic Completed</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs mt-1">
                    Score: <strong>{result.correctCount} / {result.totalQuestions}</strong> ({result.scorePercentage}%)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  <Link
                    href={`/student/class/${profile.selectedClass}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft transition-all"
                  >
                    <span>Learning Path</span>
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

        {/* Questions List */}
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
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                    Difficulty Level {q.difficulty}
                  </span>
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

                {/* Question Feedback Post-Submission */}
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
                          <span>Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                        </>
                      )}
                    </div>

                    {(() => {
                      const expData = resolveLocalizedString(feedbackItem.explanation, currentLang);
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
                {Object.keys(answers).length} of {questions.length} Questions Answered
              </span>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs shadow-soft transition-all"
              >
                <span>Submit Worksheet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
