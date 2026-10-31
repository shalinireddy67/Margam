"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
  BookOpen,
  GitBranch,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  WorksheetResult,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import {
  recordTopicOpened,
  completeLesson,
  submitWorksheet,
  canAccessTopic,
} from "@/lib/progression";
import {
  getConceptById,
  getLessonByConceptId,
  getQuestionsByConceptId,
  resolveLocalizedString,
} from "@/lib/curriculum";
import { selectLessonVariant } from "@/lib/adaptive";
import WitchCatCompanion, { CompanionContext } from "@/components/WitchCatCompanion";

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptId = params?.conceptId as string;

  const fromGap = searchParams.get("fromGap") === "true";
  const gapReason = searchParams.get("reason") || "";

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [worksheetResult, setWorksheetResult] = useState<WorksheetResult | null>(null);
  const [completedNow, setCompletedNow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companionContext, setCompanionContext] = useState<CompanionContext>("lesson_start");
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/");
      return;
    }

    const concept = getConceptById(conceptId);
    // Allow remediation if arriving from gap card or if concept belongs to lower class
    const allowRemediation = fromGap || (concept ? concept.class < active.selectedClass : false);
    const access = canAccessTopic(conceptId, active, allowRemediation);

    if (!access.accessible) {
      alert(access.reason || "You cannot access this lesson yet.");
      router.replace("/");
      return;
    }

    // Opening does NOT complete the lesson, but records in_progress
    const updated = recordTopicOpened(conceptId);
    setProfile(updated || active);
    setIsLoaded(true);
  }, [conceptId, fromGap, router]);

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-berry border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-grey">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const concept = getConceptById(conceptId);
  const lesson = getLessonByConceptId(conceptId);
  const questions = getQuestionsByConceptId(conceptId);

  if (!concept || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6] p-4">
        <div className="bg-white p-6 rounded-3xl border border-border max-w-sm text-center space-y-3">
          <h2 className="text-base font-bold text-plum">Lesson Not Found</h2>
          <p className="text-xs text-grey">This lesson content is not yet available.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-berry text-white text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Lessons</span>
          </Link>
        </div>
      </div>
    );
  }

  const topicProgress = profile.topicProgress[conceptId];
  const isCompleted = topicProgress?.status === "completed" || completedNow;

  // Requirement 2: Choose variant with selectLessonVariant from concept's mastery.
  // If the student arrives from a gap card, show basics_first. Show the one-line reason on the page.
  let variantKey: "basics_first" | "standard" | "fast_track" = "standard";
  let variantReason = "";

  if (fromGap) {
    variantKey = "basics_first";
    variantReason =
      gapReason ||
      "Basics-First: Selected to reinforce foundational prerequisites identified during diagnostic backtracking.";
  } else {
    variantKey = selectLessonVariant(topicProgress?.mastery);
    if (variantKey === "basics_first") {
      variantReason = "Basics-First: Focused on intuitive real-world analogies and concrete examples.";
    } else if (variantKey === "fast_track") {
      variantReason = "Fast-Track: High mastery detected. Concise overview with advanced challenges.";
    } else {
      variantReason = "Standard: Balanced conceptual explanation with step-by-step worked examples.";
    }
  }

  const activeVariant = lesson[variantKey] || lesson.standard;

  // Explicit Lesson Completion
  const handleFinishLesson = () => {
    const res = completeLesson(conceptId);
    if (res.success && res.profile) {
      setProfile(res.profile);
      setCompletedNow(true);
      setCompanionContext("completed");
    }
  };

  // Practice Option Select
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (worksheetResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setErrorMessage(null);
  };

  // Worksheet Submission with Contextual Companion Feedback
  const handleSubmitPractice = (e: React.FormEvent) => {
    e.preventDefault();
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
      setWorksheetResult(res.result);
      setProfile(res.profile);
      setCompletedNow(true);

      if (res.result.correctCount === res.result.totalQuestions) {
        setCompanionContext("correct");
      } else if (res.result.correctCount > 0) {
        setCompanionContext("completed");
      } else {
        setCompanionContext("incorrect");
      }
    }
  };

  const handleRetryPractice = () => {
    setAnswers({});
    setWorksheetResult(null);
    setErrorMessage(null);
    setCompanionContext("lesson_start");
  };

  const headlineData = resolveLocalizedString(activeVariant.headline, currentLang);
  const explanationData = resolveLocalizedString(activeVariant.explanation, currentLang);
  const workedProblem = resolveLocalizedString(activeVariant.workedExample.problem, currentLang);
  const workedSolution = resolveLocalizedString(activeVariant.workedExample.solution, currentLang);

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex flex-col justify-between text-plum font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 text-xs sm:text-sm font-semibold text-grey hover:text-plum py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lessons</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#FDF5F3] p-1 rounded-xl border border-peach-border/70">
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentLang === "en" ? "bg-white text-plum shadow-xs" : "text-grey"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("hi")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentLang === "hi" ? "bg-white text-plum shadow-xs" : "text-grey"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("te")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentLang === "te" ? "bg-white text-plum shadow-xs" : "text-grey"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </header>

      {/* Main Lesson Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
        {/* Gap Reason Banner (Shown when arriving from Gap Card) */}
        {fromGap && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-sm text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-rose-800">
              <GitBranch className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Remedial Journey • Basics-First Lesson</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-semibold">
              {variantReason}
            </p>
          </div>
        )}

        {/* Title & Objective */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-grey">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>{concept.chapter}</span>
            </div>

            {/* Pedagogical Variant Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                variantKey === "basics_first"
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : variantKey === "fast_track"
                  ? "bg-purple-50 border-purple-200 text-purple-800"
                  : "bg-peach-light border-peach-border text-plum"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Variant: {variantKey === "basics_first" ? "Basics-First" : variantKey === "fast_track" ? "Fast-Track" : "Standard"}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-plum tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-plum bg-[#FDF5F3] p-3.5 rounded-2xl border border-peach-border/80 leading-relaxed font-medium">
            <strong>Goal:</strong> {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Show the one-line reason on the page */}
          {!fromGap && (
            <p className="text-xs text-slate-500 italic pt-1">
              {variantReason}
            </p>
          )}
        </div>

        {/* Conceptual Explanation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4">
          <h2 className="text-lg font-bold text-plum flex items-center flex-wrap gap-2">
            <span>{headlineData.text}</span>
            {headlineData.isDraft && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Draft
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
            {explanationData.text}
          </p>

          {/* Visual Analogy if present in variant */}
          {activeVariant.visualAnalogy && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium">
              <strong>Intuition:</strong> {resolveLocalizedString(activeVariant.visualAnalogy, currentLang).text}
            </div>
          )}
        </div>

        {/* Worked Examples */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-berry" />
            <h2 className="text-xs font-bold text-plum uppercase tracking-wider">
              Worked Example
            </h2>
          </div>

          <div className="bg-[#FAF8F6] p-4 rounded-2xl border border-border">
            <p className="text-xs font-bold text-grey uppercase mb-1">Problem:</p>
            <p className="text-sm font-semibold text-plum">
              {workedProblem.text}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-grey uppercase">Steps:</p>
            {activeVariant.workedExample.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-peach-light text-plum font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-peach-border/60">
                  {i + 1}
                </span>
                <p className="leading-relaxed">
                  {resolveLocalizedString(step, currentLang).text}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2 text-xs sm:text-sm text-emerald-950 font-bold">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Result: {workedSolution.text}</span>
          </div>
        </div>

        {/* Practice Questions / Worksheet (if available) */}
        {questions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h2 className="text-base font-bold text-plum">
                Practice Questions
              </h2>
              <Link
                href={`/student/worksheet/${concept.id}`}
                className="min-h-[48px] inline-flex items-center text-xs text-berry hover:underline font-bold"
              >
                Open Adaptive Practice Runner →
              </Link>
            </div>

            {worksheetResult && (
              <div
                className={`p-4 rounded-2xl border ${
                  worksheetResult.scorePercentage >= 70
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-[#FDF5F3] border-peach-border text-plum"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">
                      Score: {worksheetResult.correctCount} / {worksheetResult.totalQuestions} Correct ({worksheetResult.scorePercentage}%)
                    </p>
                    <p className="text-xs text-grey mt-0.5">
                      {worksheetResult.scorePercentage >= 70
                        ? "Great work! Lesson completed."
                        : "Attempt recorded."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryPractice}
                    className="inline-flex items-center justify-center min-h-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-border text-xs font-bold text-plum hover:bg-slate-50 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {questions.slice(0, 3).map((q, idx) => {
                const feedbackItem = worksheetResult?.feedback.find((f) => f.questionId === q.id);
                const qPrompt = resolveLocalizedString(q.prompt, currentLang);

                return (
                  <div key={q.id} className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-grey uppercase tracking-wider">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm font-semibold text-plum leading-relaxed">
                      {qPrompt.text}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt) => {
                        const isSelected = answers[q.id] === opt.id;
                        const isCorrectAnswer = q.correctAnswer === opt.id;
                        const optText = resolveLocalizedString(opt.text, currentLang);

                        let borderClass = "border-border hover:border-peach-border";
                        let bgClass = "bg-white";

                        if (worksheetResult) {
                          if (isCorrectAnswer) {
                            borderClass = "border-emerald-500 ring-1 ring-emerald-500";
                            bgClass = "bg-emerald-50/60";
                          } else if (isSelected && !isCorrectAnswer) {
                            borderClass = "border-rose-400 ring-1 ring-rose-400";
                            bgClass = "bg-rose-50/60";
                          }
                        } else if (isSelected) {
                          borderClass = "border-berry ring-2 ring-berry/20";
                          bgClass = "bg-[#FDF5F3]";
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`min-h-[48px] flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${borderClass} ${bgClass}`}
                          >
                            <span
                              className={`w-5 h-5 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-berry text-white"
                                  : "bg-[#FDF5F3] text-plum border border-peach-border/70"
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-800 font-medium">
                              {optText.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pre-submission Hint Toggle */}
                    {q.hint && !worksheetResult && (
                      <div className="pt-1">
                        <button
                          type="button"
                          id={`hint-toggle-${q.id}`}
                          onClick={() => setShowHint((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="min-h-[48px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>💡 {showHint[q.id] ? "Hide Hint" : "Need a hint?"}</span>
                        </button>
                        {showHint[q.id] && (
                          <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                            <span className="font-bold text-amber-900">Hint: </span>
                            <span>{resolveLocalizedString(q.hint, currentLang).text}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {feedbackItem && !feedbackItem.isCorrect && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
                        <p className="font-bold text-rose-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                        </p>
                        {q.hint && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                            <span className="font-bold text-amber-900">💡 Hint: </span>
                            <span>{resolveLocalizedString(q.hint, currentLang).text}</span>
                          </div>
                        )}
                        <p className="text-slate-700">
                          <strong className="text-slate-900">Explanation: </strong>
                          {resolveLocalizedString(feedbackItem.explanation, currentLang).text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {!worksheetResult && (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-2xl bg-berry hover:bg-berry-hover text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
                >
                  <span>Submit Practice Answers</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Completion Footer */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {isCompleted ? (
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Lesson Completed • Next Lesson Unlocked</span>
              </div>
            ) : (
              <p className="text-xs text-grey">
                Finish reviewing this lesson variant to mark this topic complete.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleFinishLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-2.5 rounded-2xl bg-berry hover:bg-berry-hover text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Lesson & Mark Complete</span>
              </button>
            ) : (
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-plum font-bold text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Lessons</span>
              </Link>
            )}
          </div>
        </div>
      </main>

      <WitchCatCompanion
        studentName={profile.name}
        context={companionContext}
        mode="floating"
      />

      <footer className="border-t border-border py-4 text-center text-xs text-grey bg-white">
        Margam • Sequentially Adaptive Mathematics
      </footer>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
          <div className="w-8 h-8 border-3 border-berry border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
