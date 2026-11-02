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
import WitchCatCompanion, { CompanionContext } from "@/components/WitchCatCompanion";
import Footer from "@/components/Footer";
import { WitchCat } from "@/components/ui/WitchCat";
import {
  SkeletonCard,
  OfflineBanner,
} from "@/components/ui";

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
        setLockedReason(access.reason || "You must complete prerequisite topics before accessing this lesson.");
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
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
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
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <header className="sticky top-0 z-40 bg-[#173B19]/95 backdrop-blur-md border-b-3 border-[#315B2A] shadow-[0px_4px_0px_#102610]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 border-2 border-[#102610] bg-[#102610] text-[#D8D8D0] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] no-underline hover:text-[#F2F0DF]"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Lessons</span>
            </Link>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#173B19] border-3 border-[#315B2A] p-8 shadow-[6px_6px_0px_#102610] space-y-4">
            <div className="w-12 h-12 bg-[#F2D16B] border-2 border-[#102610] flex items-center justify-center mx-auto text-[#102610]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#F2F0DF]">
              Lesson Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#D8D8D0] leading-relaxed">
              {lockedReason || "You must complete prerequisite topics before accessing this lesson."}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#79B82A] text-[#102610] border-2 border-[#102610] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#102610] no-underline active:translate-x-[1px] active:translate-y-[1px]"
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
      <div className="min-h-screen flex items-center justify-center bg-[#2A1E17] p-4 text-[#FFF7E6]">
        <div className="bg-[#5A3720] p-6 border-4 border-[#422816] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] max-w-sm text-center space-y-3">
          <h2 className="font-heading font-extrabold text-base text-[#FFF7E6]">Lesson Not Found</h2>
          <p className="text-xs font-bold text-[#E5D7BE]">This lesson content is not yet available.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[#422816] bg-[#5DAA3A] text-[#FFF7E6] text-xs font-heading font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
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

  const headlineData = resolveLocalizedString(activeVariant.headline, currentLang);
  const explanationData = resolveLocalizedString(activeVariant.explanation, currentLang);
  const workedProblem = resolveLocalizedString(activeVariant.workedExample.problem, currentLang);
  const workedSolution = resolveLocalizedString(activeVariant.workedExample.solution, currentLang);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      <OfflineBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#5A3720] border-b-4 border-[#422816] shadow-[0px_4px_0px_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] gap-2 text-xs font-heading font-extrabold text-[#E5D7BE] hover:text-[#FFF7E6] py-2 px-3 border-2 border-[#422816] bg-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] no-underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lessons</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#422816] p-1 border-2 border-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "en"
                  ? "bg-[#FFE9A8] border-[#422816] text-[#2B1B0F]"
                  : "border-transparent text-[#E5D7BE] hover:text-[#FFF7E6]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("hi")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "hi"
                  ? "bg-[#FFE9A8] border-[#422816] text-[#2B1B0F]"
                  : "border-transparent text-[#E5D7BE] hover:text-[#FFF7E6]"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("te")}
              className={`min-h-[36px] min-w-[36px] flex items-center justify-center px-2 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "te"
                  ? "bg-[#FFE9A8] border-[#422816] text-[#2B1B0F]"
                  : "border-transparent text-[#E5D7BE] hover:text-[#FFF7E6]"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Remediation Gap Alert if fromGap is true */}
        {fromGap && (
          <div className="p-4 sm:p-5 bg-[#422816] border-3 border-[#FFE9A8] border-l-[8px] border-l-[#FFE9A8] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] text-[#FFF7E6] space-y-2">
            <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-[#FFE9A8]">
              <GitBranch className="w-4 h-4 text-[#FFE9A8]" />
              <span>Diagnostic Remediation Route</span>
            </div>
            <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#E5D7BE]">
              {variantReason}
            </p>
          </div>
        )}

        {/* Lesson Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/75 shadow-sm space-y-4 text-emerald-950">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#FFE9A8]">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>Topic {concept.id}</span>
            </div>

            {/* Pedagogical Variant Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading font-extrabold border-2 border-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] ${
                variantKey === "basics_first"
                  ? "bg-[#E04A3F] text-[#FFF7E6]"
                  : variantKey === "fast_track"
                  ? "bg-[#5DAA3A] text-[#FFF7E6]"
                  : "bg-[#FFE9A8] text-[#2B1B0F]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Variant: {variantKey === "basics_first" ? "Basics-First" : variantKey === "fast_track" ? "Fast-Track" : "Standard"}
              </span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-900/80 bg-white/70 p-3.5 rounded-xl border border-white/80 leading-relaxed font-medium">
            <strong className="text-[#FFE9A8]">Goal:</strong> {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {!fromGap && (
            <p className="text-xs text-[#E5D7BE]/80 italic pt-1 font-medium">
              {variantReason}
            </p>
          )}
        </div>

        {/* Lesson Body Content with Companion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Conceptual Explanation */}
          <div className="md:col-span-8 space-y-6">
            {/* Core Explanation Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/75 shadow-sm space-y-4 text-emerald-950">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="shrink-0 p-2 bg-[#422816] border-2 border-[#7A4B2A] shadow-[3px_3px_0px_rgba(0,0,0,0.4)]">
                  <WitchCat
                    pose="read"
                    size={88}
                    sticker={false}
                    alt="Margam Learning Companion reading the maths lesson"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#FFE9A8]">
                    <BookOpen className="w-4 h-4 text-[#FFE9A8]" />
                    <span>Core Concept</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#FFF7E6] flex items-center flex-wrap gap-2">
                    <span>{headlineData.text}</span>
                    {headlineData.isDraft && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
                        Draft
                      </span>
                    )}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#E5D7BE] leading-relaxed whitespace-pre-line font-medium">
                    {explanationData.text}
                  </p>

                  {activeVariant.visualAnalogy && (
                    <div className="p-3 bg-[#422816] border-2 border-[#FFE9A8] text-xs text-[#FFE9A8] font-medium">
                      <strong>Intuition:</strong> {resolveLocalizedString(activeVariant.visualAnalogy, currentLang).text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Worked Example Card */}
            <div className="bg-[#5A3720] p-6 sm:p-7 border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-4 text-[#FFF7E6]">
              <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#5DAA3A]">
                <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
                <span>Step-by-Step Example</span>
              </div>

              <div className="p-4 bg-[#422816] border-2 border-[#7A4B2A] space-y-1">
                <p className="text-xs font-heading font-bold text-[#FFE9A8] uppercase tracking-wider">Problem</p>
                <p className="text-xs sm:text-sm font-bold text-[#FFF7E6]">{workedProblem.text}</p>
              </div>

              <div className="p-4 bg-[#422816] border-2 border-[#5DAA3A] space-y-1">
                <p className="text-xs font-heading font-bold text-[#5DAA3A] uppercase tracking-wider">Solution</p>
                <p className="text-xs sm:text-sm text-[#E5D7BE] font-medium whitespace-pre-line leading-relaxed">
                  {workedSolution.text}
                </p>
              </div>
            </div>
          </div>

          {/* Side Column: Mascot Companion Dialogue */}
          <div className="md:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#5A3720] p-4 sm:p-5 border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex flex-col items-center text-center text-[#FFF7E6]">
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
          <div className="bg-[#5A3720] p-6 sm:p-8 border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-6 text-[#FFF7E6]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-[#7A4B2A] pb-4 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#FFE9A8]">
                  Check Your Understanding
                </h2>
                <p className="text-xs font-bold text-[#E5D7BE]/80 mt-0.5">
                  Try this quick problem to verify concept comprehension.
                </p>
              </div>

              {worksheetResult && (
                <button
                  onClick={handleRetryPractice}
                  className="inline-flex items-center justify-center min-h-[44px] gap-1 px-3 py-1.5 border-2 border-[#7A4B2A] bg-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] text-xs font-heading font-bold text-[#E5D7BE] hover:text-[#FFF7E6] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-[#E04A3F]/20 border-2 border-[#E04A3F] text-xs font-bold text-[#FFF7E6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E04A3F] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {practiceQuestions.map((q, idx) => {
                const feedbackItem = worksheetResult?.feedback.find((f) => f.questionId === q.id);
                const qPrompt = resolveLocalizedString(q.prompt, currentLang);

                return (
                  <div key={q.id} className="space-y-3 pt-2">
                    <p className="text-xs font-heading font-bold text-[#FFE9A8] uppercase tracking-wider">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm font-bold text-[#FFF7E6] leading-relaxed">
                      {qPrompt.text}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: any) => {
                        const isSelected = answers[q.id] === opt.id;
                        const optText = resolveLocalizedString(opt.text, currentLang);

                        let borderClass = "border-2 border-[#7A4B2A]";
                        let bgClass = "bg-[#422816] text-[#E5D7BE] hover:border-[#3FA7C9] hover:bg-[#5A3720]";

                        if (worksheetResult && feedbackItem) {
                          if (isSelected && feedbackItem.isCorrect) {
                            borderClass = "border-2 border-[#2F6B22]";
                            bgClass = "bg-[#5DAA3A] text-[#FFF7E6]";
                          } else if (isSelected && !feedbackItem.isCorrect) {
                            borderClass = "border-2 border-[#8B2323]";
                            bgClass = "bg-[#E04A3F] text-[#FFF7E6]";
                          }
                        } else if (isSelected) {
                          borderClass = "border-2 border-[#1E6F8C]";
                          bgClass = "bg-[#3FA7C9] text-[#FFF7E6] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.4)]";
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
                            className={`min-h-[48px] flex items-start gap-3 p-3 border-2 cursor-pointer transition-transform active:translate-x-[1px] active:translate-y-[1px] ${borderClass} ${bgClass}`}
                          >
                            <span
                              className={`w-6 h-6 border-2 font-heading font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                                isSelected
                                  ? "bg-[#FFE9A8] text-[#2B1B0F] border-[#422816]"
                                  : "bg-[#422816] text-[#FFE9A8] border-[#7A4B2A]"
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
                      <div className="p-3.5 bg-[#422816] border-2 border-[#E04A3F] text-xs text-[#FFF7E6] space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 pt-0.5">
                            <WitchCat
                              pose="oops"
                              size={56}
                              sticker={true}
                              alt="Margam Learning Companion offering mistake hint"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <p className="font-heading font-bold text-[#E04A3F] flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-[#E04A3F] shrink-0" />
                              <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                            </p>
                            {feedbackItem.hint && (
                              <div className="p-2.5 bg-[#5A3720] border border-[#FFE9A8] text-[#FFE9A8] font-bold">
                                <span className="font-heading">💡 Hint: </span>
                                <span>{feedbackItem.hint}</span>
                              </div>
                            )}
                            {feedbackItem.explanation && (
                              <p className="text-[#E5D7BE] font-medium">
                                <strong className="font-heading text-[#5DAA3A]">Explanation: </strong>
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
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
                >
                  <span>Submit Practice Answer</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Sticky Next Button Bar */}
        <div className="sticky bottom-4 z-30 bg-[#5A3720] border-4 border-[#422816] p-4 shadow-[0px_4px_0px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#FFF7E6]">
          <div className="text-center sm:text-left">
            <span className="text-xs font-heading font-extrabold text-[#FFE9A8] block">
              {isCompleted ? "Topic Completed!" : "Finished Reviewing?"}
            </span>
            <span className="text-[11px] font-bold text-[#E5D7BE] block">
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
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-6 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Next: Finish Lesson & Complete</span>
              </button>
            ) : (
              <>
                <Link
                  href={`/student/worksheet/${conceptId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                >
                  <span>Attempt Practice Worksheet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] gap-2 px-4 py-2.5 bg-[#422816] text-[#E5D7BE] hover:text-[#FFF7E6] border-2 border-[#7A4B2A] font-heading font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline transition-colors"
                >
                  <span>Return to Path</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t-4 border-[#422816] py-4 text-center text-xs font-heading text-[#E5D7BE]/70 bg-[#1A1614]">
        Margam Adaptive Mathematics • Lesson Workspace
      </footer>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
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
