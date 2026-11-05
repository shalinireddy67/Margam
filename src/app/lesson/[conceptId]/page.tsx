"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  BookOpen,
  GitBranch,
  Lock,
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

import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { Companion } from "@/components/ui/Companion";
import {
  SkeletonCard,
  OfflineBanner,
} from "@/components/ui";

type LessonCompanionContext = "lesson_start" | "correct" | "incorrect" | "completed";

const companionPoseMap: Record<LessonCompanionContext, "greet" | "read" | "think" | "cheer" | "oops" | "sleepy"> = {
  lesson_start: "read",
  correct: "cheer",
  incorrect: "oops",
  completed: "cheer",
};

const companionDialogMap: Record<LessonCompanionContext, string> = {
  lesson_start: "Study the key concept and worked examples below.",
  correct: "Excellent answer! You got it right!",
  incorrect: "Good try! Check the hint and try again.",
  completed: "Fantastic! You completed this lesson milestone!",
};

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
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [worksheetResult, setWorksheetResult] = useState<PracticeResultState | null>(null);
  const [completedNow, setCompletedNow] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companionContext, setCompanionContext] = useState<LessonCompanionContext>("lesson_start");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedReason, setLockedReason] = useState<string>("");

  const initLesson = useCallback(() => {
    try {
      setIsLoaded(false);
      setHasError(false);
      setErrorMessage(null);
      setIsLocked(false);

      const active = getActiveProfile();
      if (!active || !active.selectedClass) {
        router.replace("/");
        return;
      }

      const concept = getConceptById(conceptId);
      const allowRemediation = fromGap || (concept ? concept.class < active.selectedClass : false);
      const access = canAccessTopic(conceptId, active, allowRemediation);

      if (!access.accessible) {
        setIsLocked(true);
        setLockedReason(access.reason || "Please finish earlier topics before opening this lesson.");
        setIsLoaded(true);
        return;
      }

      const updated = recordTopicOpened(conceptId);
      setProfile(updated || active);
      setIsLoaded(true);

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
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load lesson.");
      setIsLoaded(true);
    }
  }, [conceptId, fromGap, router]);

  useEffect(() => {
    initLesson();
  }, [initLesson]);

  // Loading Skeleton State
  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen bg-[#102610] voxel-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
        <OfflineBanner />
        <div className="max-w-4xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading lesson">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Locked State
  if (isLocked) {
    return (
      <div className="min-h-screen text-slate-800 flex flex-col justify-between pb-16">
        <OfflineBanner />
        <header className="sticky top-0 z-40 bg-[#232634]/92 border-b-3 border-[#1E1610] shadow-[0_3px_0px_#1E1610]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link
              href="/student/learn"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-heading font-bold text-[#1E1610] bg-[#E8CF9C] hover:bg-[#D9B87A] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] no-underline transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>{t("lesson.backToLessons")}</span>
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="panel-plank p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 max-w-lg mx-auto text-center text-[#1E1610]">
            <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-900 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-emerald-950">
              Lesson Locked
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              {lockedReason || "Please finish earlier topics before opening this lesson."}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-extrabold no-underline transition-all active:translate-x-[1px] active:translate-y-[1px]"
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

  const concept = getConceptById(conceptId);
  const lesson = getLessonByConceptId(conceptId);

  if (!concept || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-slate-800">
        <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] max-w-sm text-center space-y-3 text-[#1E1610]">
          <h2 className="font-heading font-extrabold text-base text-emerald-950">Lesson Not Found</h2>
          <p className="text-xs text-slate-600 font-sans">This lesson content is not yet available.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-bold active:translate-x-[1px] active:translate-y-[1px]"
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
          profile,
        }),
      });

      if (!res.ok) {
        throw new Error("Practice submission failed");
      }

      const resData: PracticeResultState = await res.json();
      setWorksheetResult(resData);
      setCompletedNow(true);

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

  const headlineData = resolve(activeVariant.headline);
  const explanationData = resolve(activeVariant.explanation);
  const workedProblem = resolve(activeVariant.workedExample.problem);
  const workedSolution = resolve(activeVariant.workedExample.solution);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      <OfflineBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#232634]/92 border-b-3 border-[#1E1610] shadow-[0_3px_0px_#1E1610]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/student/learn"
            className="inline-flex items-center justify-center min-h-[40px] gap-2 text-xs font-heading font-bold text-[#1E1610] bg-[#E8CF9C] hover:bg-[#D9B87A] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] no-underline transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curriculum</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#E8CF9C]/80 p-1 border-2 border-[#1E1610]">
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "en" ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]" : "text-[#1E1610] hover:bg-[#D9B87A] border-2 border-transparent"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("hi")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "hi" ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]" : "text-[#1E1610] hover:bg-[#D9B87A] border-2 border-transparent"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("te")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "te" ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]" : "text-[#1E1610] hover:bg-[#D9B87A] border-2 border-transparent"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        {/* Remediation Gap Alert if fromGap is true */}
        {fromGap && (
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-amber-900">
              <GitBranch className="w-4 h-4 text-amber-600" />
              <span>Fix earlier topic</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-700">
              {variantReason}
            </p>
          </div>
        )}

        {/* Lesson Header Card */}
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 text-[#1E1610]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>Topic {concept.id}</span>
            </div>

            {/* Pedagogical Variant Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading font-extrabold rounded-full shadow-xs ${
                variantKey === "basics_first"
                  ? "bg-[#E04A3F] text-[#FFF7E6]"
                  : variantKey === "fast_track"
                  ? "bg-[#5DAA3A] text-[#FFF7E6]"
                  : "bg-emerald-100 text-emerald-950 border border-emerald-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Variant: {variantKey === "basics_first" ? "Basics-First" : variantKey === "fast_track" ? "Fast-Track" : "Standard"}
              </span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
            {resolve(concept.name).text}
          </h1>

          <p className="text-xs sm:text-sm text-[#5A3720] bg-[#E8CF9C]/70 p-4 border-2 border-[#1E1610] leading-relaxed font-sans font-medium">
            <strong className="text-emerald-950 font-bold">{t("lesson.goal")}:</strong> {resolve(concept.learningObjective).text}
          </p>

          {!fromGap && (
            <p className="text-xs text-slate-500 italic pt-1 font-sans font-medium">
              {variantReason}
            </p>
          )}
        </div>

        {/* Lesson Body Content with Companion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Conceptual Explanation */}
          <div className="md:col-span-8 space-y-6">
            {/* Core Explanation Card */}
            <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 text-[#1E1610]">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="shrink-0 p-2.5 bg-[#E8CF9C] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]">
                  <Companion
                    pose="read"
                    size={88}
                    sticker={false}
                    alt="Margam Learning Companion reading the maths lesson"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-emerald-800">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>Core Concept</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-heading font-extrabold text-emerald-950 flex items-center flex-wrap gap-2">
                    <span>{headlineData.text}</span>
                    {headlineData.isDraft && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Draft
                      </span>
                    )}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans font-medium">
                    {explanationData.text}
                  </p>

                  {activeVariant.visualAnalogy && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-sans">
                      <strong>{t("lesson.intuition")}:</strong> {resolve(activeVariant.visualAnalogy).text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step {t("lesson.workedExample")} Card */}
            <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4 text-[#1E1610]">
              <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Step-by-Step Example</span>
              </div>

              <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-1">
                <p className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wider">Problem</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">{workedProblem.text}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <p className="text-xs font-heading font-bold text-[#5DAA3A] uppercase tracking-wider">Solution</p>
                <p className="text-xs sm:text-sm text-slate-700 font-sans font-medium whitespace-pre-line leading-relaxed">
                  {workedSolution.text}
                </p>
              </div>
            </div>
          </div>

          {/* Side Column: Mascot Companion Dialogue */}
          <div className="md:col-span-4 sticky top-24 space-y-4">
            <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col items-center text-center text-[#1E1610]">
              <Companion
                pose={companionPoseMap[companionContext] || "read"}
                size={84}
                alt="Margam learning companion"
              />
              <p className="text-xs sm:text-sm font-heading font-bold text-slate-700 leading-relaxed mt-2">
                {companionDialogMap[companionContext]}
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Practice Section */}
        {practiceQuestions.length > 0 && (
          <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-6 text-[#1E1610]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-[#1E1610]/20 pb-4 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-extrabold text-emerald-950">
                  {t("lesson.practiceWorksheet")}
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  Try this quick problem to verify concept comprehension.
                </p>
              </div>

              {worksheetResult && (
                <button
                  onClick={handleRetryPractice}
                  className="inline-flex items-center justify-center min-h-[44px] gap-1 px-3 py-1.5 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-bold active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 text-xs font-sans font-bold text-rose-900 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E04A3F] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {practiceQuestions.map((q, idx) => {
                const feedbackItem = worksheetResult?.feedback.find((f) => f.questionId === q.id);
                const qPrompt = resolve(q.prompt);

                return (
                  <div key={q.id} className="space-y-3 pt-2">
                    <p className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wider">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed font-sans">
                      {qPrompt.text}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: any) => {
                        const isSelected = answers[q.id] === opt.id;
                        const optText = resolve(opt.text);

                        let borderClass = "border-2 border-[#1E1610]";
                        let bgClass = "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A]";

                        if (worksheetResult && feedbackItem) {
                          if (isSelected && feedbackItem.isCorrect) {
                            borderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                            bgClass = "bg-emerald-100 text-emerald-950";
                          } else if (isSelected && !feedbackItem.isCorrect) {
                            borderClass = "border-rose-400 ring-2 ring-rose-400/20";
                            bgClass = "bg-rose-50 text-rose-950";
                          }
                        } else if (isSelected) {
                          borderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                          bgClass = "bg-emerald-100/90 text-emerald-950 shadow-xs";
                        }

                        return (
                          <div
                            key={opt.id}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault();
                                handleSelectOption(q.id, opt.id);
                              }
                            }}
                            className={`min-h-[48px] flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${borderClass} ${bgClass}`}
                          >
                            <span
                              className={`w-7 h-7 rounded-xl border font-heading font-extrabold flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                                isSelected
                                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                                  : "bg-[#D9B87A] text-[#1E1610] border-2 border-[#1E1610]"
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm font-bold leading-snug">
                              {optText.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Needs Review Feedback and Mistake Hint */}
                    {feedbackItem && !feedbackItem.isCorrect && (
                      <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 pt-0.5">
                            <Companion
                              pose="oops"
                              size={56}
                              sticker={true}
                              alt="Margam Learning Companion offering mistake hint"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <p className="font-heading font-bold text-rose-700 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-[#E04A3F] shrink-0" />
                              <span>Common mix-up: {feedbackItem.mistakeDescription || "Not quite right"}</span>
                            </p>
                            {feedbackItem.hint && (
                              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-sans font-medium">
                                <span className="font-heading">💡 Hint: </span>
                                <span>{feedbackItem.hint}</span>
                              </div>
                            )}
                            {feedbackItem.explanation && (
                              <p className="text-slate-700 font-sans font-medium">
                                <strong className="font-heading text-emerald-800">Explanation: </strong>
                                {feedbackItem.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {!worksheetResult && (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-extrabold text-xs transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <span>Submit Practice Answer</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Sticky Next Button Bar */}
        <div className="sticky bottom-4 z-30 panel-night p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#F3E3BC]">
          <div className="text-center sm:text-left">
            <span className="text-xs font-heading font-extrabold text-[#F3E3BC] block">
              {isCompleted ? "Topic Completed!" : "Finished Reviewing?"}
            </span>
            <span className="text-[11px] text-[#F3E3BC]/80 font-sans block">
              {isCompleted
                ? "You can now attempt the full practice worksheet or return to your path."
                : "Mark this lesson completed to unlock practice and next topics."}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleFinishLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-6 py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-extrabold text-xs transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Next: Finish Lesson & Complete</span>
              </button>
            ) : (
              <>
                <Link
                  href={`/student/worksheet/${conceptId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-extrabold text-xs no-underline transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>Attempt Practice Worksheet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={fromGap ? "/student" : "/student/learn"}
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-4 py-2.5 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold text-xs no-underline transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <span>{fromGap ? "Return to Dashboard" : "Return to Curriculum"}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs font-heading font-bold text-slate-600/80">
        Margam Adaptive Mathematics • Lesson Workspace
      </footer>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#102610] voxel-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
          <div className="max-w-4xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading lesson">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
