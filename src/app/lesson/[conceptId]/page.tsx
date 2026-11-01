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
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import {
  recordTopicOpened,
  completeLesson,
  canAccessTopic,
} from "@/lib/progression";
import {
  getConceptById,
  getLessonByConceptId,
  selectLessonVariant,
  resolveLocalizedString,
} from "@/lib/curriculum";
import WitchCatCompanion, { CompanionContext } from "@/components/WitchCatCompanion";

interface PracticeFeedbackItem {
  questionId: string;
  isCorrect: boolean;
  chosenAnswer: string;
  tag?: string;
  hint?: string;
  explanation?: string;
  mistakeDescription?: string;
}

interface PracticeResultState {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  feedback: PracticeFeedbackItem[];
  mistakeHint?: string;
}

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conceptId = params?.conceptId as string;

  const fromGap = searchParams.get("fromGap") === "true";
  const gapReason = searchParams.get("reason") || "";

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [worksheetResult, setWorksheetResult] = useState<PracticeResultState | null>(null);
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

    // Load single practice question for the lesson from server route
    async function loadPractice() {
      try {
        const res = await fetch("/api/practice/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conceptId,
            studentId: active!.id,
            count: 1,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPracticeQuestions(data.questions || []);
          setSessionToken(data.token || null);
        }
      } catch (err) {
        console.error("Failed to load lesson practice question:", err);
      }
    }

    loadPractice();
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

  // Choose variant with selectLessonVariant from concept's mastery.
  // If student arrives from a gap card, show basics_first. Show the one-line reason on the page.
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

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (worksheetResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setErrorMessage(null);
  };

  // Practice Submission through server route
  const handleSubmitPractice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length === 0) {
      setErrorMessage("Please answer the practice question.");
      return;
    }

    if (!sessionToken) {
      setErrorMessage("Practice session expired. Please refresh the page.");
      return;
    }

    try {
      const res = await fetch("/api/practice/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sessionToken,
          conceptId,
          studentId: profile.id,
          answers,
        }),
      });

      if (!res.ok) {
        throw new Error("Practice submission failed");
      }

      const resData: PracticeResultState = await res.json();
      setWorksheetResult(resData);
      setCompletedNow(true);

      // Complete the lesson to unlock subsequent concepts
      const completeRes = completeLesson(conceptId);
      if (completeRes.success && completeRes.profile) {
        setProfile(completeRes.profile);
      }

      if (resData.score === resData.total) {
        setCompanionContext("correct");
      } else if (resData.score > 0) {
        setCompanionContext("completed");
      } else {
        setCompanionContext("incorrect");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit practice question.");
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

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Remediation Gap Alert if fromGap is true */}
        {fromGap && (
          <div className="p-4 sm:p-5 rounded-3xl bg-peach-light border-2 border-peach-border text-plum shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-berry">
              <GitBranch className="w-4 h-4 text-berry" />
              <span>Diagnostic Remediation Route</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {variantReason}
            </p>
          </div>
        )}

        {/* Lesson Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-grey">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>Topic {concept.id}</span>
            </div>

            {/* Adaptive Variant Chip with Reason */}
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                  variantKey === "basics_first"
                    ? "bg-[#FFF4E5] text-[#B76E00] border-[#FFE2B3]"
                    : variantKey === "fast_track"
                    ? "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]"
                    : "bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {variantKey === "basics_first"
                    ? "Basics-First"
                    : variantKey === "fast_track"
                    ? "Fast-Track"
                    : "Standard"}
                </span>
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-plum tracking-tight">
            {headlineData.text}
          </h1>

          {/* Pedagogy Reason Explanation */}
          <div className="p-3 rounded-2xl bg-[#FDF5F3] border border-peach-border/70 text-xs text-grey leading-relaxed">
            <strong className="text-plum">Pedagogical Mode: </strong>
            {variantReason}
          </div>
        </div>

        {/* Lesson Body Content with Witch Cat Companion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Conceptual Explanation */}
          <div className="md:col-span-8 space-y-6">
            {/* Core Explanation Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-grey">
                <BookOpen className="w-4 h-4 text-berry" />
                <span>Core Concept</span>
              </div>

              <div className="text-xs sm:text-sm text-plum leading-relaxed space-y-3 font-normal whitespace-pre-line">
                {explanationData.text}
              </div>
            </div>

            {/* Step-by-Step Worked Example Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-card space-y-4">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-grey">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Step-by-Step Example</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F6] border border-border space-y-2">
                <p className="text-xs font-bold text-grey uppercase tracking-wider">Problem</p>
                <p className="text-xs sm:text-sm font-semibold text-plum">{workedProblem.text}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Solution</p>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium whitespace-pre-line leading-relaxed">
                  {workedSolution.text}
                </p>
              </div>
            </div>
          </div>

          {/* Side Column: Witch Cat Companion */}
          <div className="md:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border shadow-card flex flex-col items-center text-center">
              <WitchCatCompanion
                context={companionContext}
                studentName={profile.name}
                mode="inline"
              />
            </div>
          </div>
        </div>

        {/* Embedded Practice Section */}
        {practiceQuestions.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-plum">
                  Check Your Understanding
                </h2>
                <p className="text-xs text-grey mt-0.5">
                  Try this quick problem to verify concept mastery.
                </p>
              </div>

              {worksheetResult && (
                <button
                  onClick={handleRetryPractice}
                  className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-grey hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {practiceQuestions.map((q, idx) => {
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
                      {q.options?.map((opt: any) => {
                        const isSelected = answers[q.id] === opt.id;
                        const optText = resolveLocalizedString(opt.text, currentLang);

                        let borderClass = "border-border hover:border-peach-border";
                        let bgClass = "bg-white";

                        if (worksheetResult && feedbackItem) {
                          if (isSelected && feedbackItem.isCorrect) {
                            borderClass = "border-emerald-500 ring-1 ring-emerald-500";
                            bgClass = "bg-emerald-50/60";
                          } else if (isSelected && !feedbackItem.isCorrect) {
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

                    {/* Needs Review Feedback and Mistake Hint */}
                    {feedbackItem && !feedbackItem.isCorrect && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
                        <p className="font-bold text-rose-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                        </p>
                        {feedbackItem.hint && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                            <span className="font-bold text-amber-900">💡 Hint: </span>
                            <span>{feedbackItem.hint}</span>
                          </div>
                        )}
                        {feedbackItem.explanation && (
                          <p className="text-slate-700">
                            <strong className="text-slate-900">Explanation: </strong>
                            {feedbackItem.explanation}
                          </p>
                        )}
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
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Lesson Completed</span>
              </div>
            ) : (
              <p className="text-xs text-grey">
                Read through the explanation and example, or submit the practice question above to complete.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted && (
              <button
                onClick={handleFinishLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-5 py-2.5 rounded-2xl bg-plum hover:bg-black text-white font-bold text-xs shadow-soft transition-all"
            >
              <span>Back to Class Path</span>
            </Link>
          </div>
        </div>
      </main>
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
