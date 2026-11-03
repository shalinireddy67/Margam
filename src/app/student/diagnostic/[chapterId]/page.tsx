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
  BookOpen,
  GitBranch,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Target,
  Check,
  HelpCircle,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Chapter,
} from "@/lib/types";
import { getActiveProfile, saveProfile } from "@/lib/storage";
import { unlockChapterLessons } from "@/lib/progression";
import {
  chapters,
  canTakeChapterDiagnostic,
  getConceptById,
  getConceptsByChapter,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import { WitchCat } from "@/components/ui/WitchCat";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";
import {
  PixelConfetti,
  FloatingXp,
  MistakeCreatureCard,
  SegmentedXpBar,
  LevelUpModal,
} from "@/components/ui/PixelEffects";
import { playPopSound, playGentleOopsSound } from "@/lib/sound";
import { applyAwardedXpToProfile } from "@/lib/gamification";
import { getLevelProgress, isIstNightTime } from "@/lib/xp-config";

interface SanitizedOption {
  id: string;
  text: any;
}

interface ClientQuestion {
  id: string;
  conceptId: string;
  difficulty: number;
  type: string;
  contextTag?: string;
  prompt: any;
  options?: SanitizedOption[];
}

interface DiagnosticResultResponse {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  mistakeTags: string[];
  gapAnalysis: {
    hasGap?: boolean;
    confirmed?: boolean;
    canRoute?: boolean;
    rootConceptId?: string;
    confidence?: string;
    routing?: "confirmation_only" | "gap_card" | "none";
    plainLanguageReason?: string;
    prerequisitePath?: string[];
  };
  conceptBreakdown?: Array<{
    conceptId: string;
    conceptName: string;
    class: number;
    status: "mastered" | "needs_practice" | "foundational_gap" | "unassessed";
    totalQuestions: number;
    correctCount: number;
    scorePercentage: number;
    isFoundational?: boolean;
    reason?: string;
  }>;
  learningPath?: Array<{
    stepNumber: number;
    conceptId: string;
    conceptName: string;
    class: number;
    action: "remediate" | "practice" | "learn" | "reassess";
    title: string;
    description: string;
    isCurrentClass: boolean;
    isFoundational: boolean;
    href: string;
    status: "available" | "locked" | "completed";
  }>;
  nextAction?: {
    conceptId: string;
    conceptName: string;
    class: number;
    title: string;
    description: string;
    href: string;
    type: "remediate" | "practice" | "lesson";
  };
  feedback: Array<{
    questionId: string;
    conceptId?: string;
    isCorrect: boolean;
    chosenAnswer: string;
    tag?: string;
    misconceptionCategory?: string;
    educationalFeedback?: string;
    explanation?: any;
    hint?: any;
    identifiedGap?: string;
  }>;
  confirmationQuestions?: ClientQuestion[];
  confirmationToken?: string | null;
  xpAwarded?: number;
  grossXp?: number;
  isCapped?: boolean;
  newDailyTotal?: number;
  updatedQuestionHistory?: Record<string, string>;
}

export default function ChapterDiagnosticPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.chapterId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticResultResponse | null>(null);
  const [placementPassed, setPlacementPassed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<{ newLevel: number; rank: any } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [awardedXpAnim, setAwardedXpAnim] = useState<number>(0);

  // Confirmation Step State
  const [confirmationQuestions, setConfirmationQuestions] = useState<ClientQuestion[]>([]);
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null);
  const [confirmationAnswers, setConfirmationAnswers] = useState<Record<string, string>>({});
  const [confirmationStatus, setConfirmationStatus] = useState<"pending" | "passed" | "failed" | null>(null);
  const [confirmationSubmitted, setConfirmationSubmitted] = useState(false);

  const initDiagnostic = useCallback(() => {
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

      if (!canTakeChapterDiagnostic(chapterId)) {
        setLoading(false);
        return;
      }

      let isCancelled = false;
      async function loadQuestions() {
        try {
          let excludeQuestionIds: string[] = [];
          try {
            const cached = sessionStorage.getItem(`last_diag_qids_${chapterId}`);
            if (cached) excludeQuestionIds = JSON.parse(cached);
          } catch (e) {}

          const res = await fetch("/api/diagnostic/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterId,
              studentId: active!.id,
              excludeQuestionIds,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to load diagnostic");
          }

          const data = await res.json();
          if (!isCancelled) {
            const receivedQuestions = data.questions || [];
            setQuestions(receivedQuestions);
            try {
              if (receivedQuestions.length > 0) {
                sessionStorage.setItem(
                  `last_diag_qids_${chapterId}`,
                  JSON.stringify(receivedQuestions.map((q: any) => q.id))
                );
              }
            } catch (e) {}
            setSessionToken(data.token || null);
            setLoading(false);
          }
        } catch (err: any) {
          if (!isCancelled) {
            setHasError(true);
            setErrorMessage(err.message || "Network error loading questions");
            setLoading(false);
          }
        }
      }

      loadQuestions();

      return () => {
        isCancelled = true;
      };
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to initialize diagnostic.");
      setLoading(false);
    }
  }, [chapterId, router]);

  useEffect(() => {
    initDiagnostic();
  }, [initDiagnostic]);

  const currentChapter: Chapter | undefined = chapters.find((c) => c.id === chapterId);
  const chapterConcepts = getConceptsByChapter(chapterId);

  // Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-[100dvh] bg-[#2A1E17] text-[#FFF7E6] p-4 sm:p-6 pb-28 flex flex-col justify-center items-center">
        <OfflineBanner />
        <div className="max-w-2xl w-full mx-auto space-y-4 pt-4" role="status" aria-label="Loading diagnostic assessment">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-[100dvh] text-slate-800 flex flex-col justify-between">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/student"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center text-center my-auto w-full">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-lg space-y-4 w-full text-slate-800">
            <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto text-white font-heading font-extrabold text-lg shadow-xs">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-emerald-950">
              Diagnostic Assessment Error
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              {errorMessage || "We encountered an issue preparing this diagnostic assessment."}
            </p>
            <div className="pt-2">
              <Button
                variant="grass"
                size="default"
                onClick={initDiagnostic}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>Try again</span>
                <RotateCcw className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Guard: If chapter has fewer than 6 questions (Vertically centered properly on mobile & desktop)
  if (!canTakeChapterDiagnostic(chapterId)) {
    return (
      <div className="min-h-[100dvh] bg-[#2A1E17] text-[#FFF7E6] flex flex-col justify-between">
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/student"
          backLabel="Back to Path"
        />
        <main className="max-w-xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center text-center my-auto w-full">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-lg space-y-4 w-full text-slate-800">
            <div className="w-14 h-14 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-xs text-amber-900">
              <BookOpen className="w-7 h-7 text-amber-900" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#FFF7E6]">
              Diagnostic Not Available
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed max-w-md mx-auto">
              This chapter is still being built. Try another chapter or come back soon.
            </p>
            <div className="pt-2">
              <Link
                href="/student"
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-extrabold shadow-sm no-underline transition-all"
              >
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    if (!sessionToken) {
      setErrorMessage("Missing session token. Please reload the assessment.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sessionToken,
          chapterId,
          studentId: profile.id,
          answers,
          studentHistory: {
            questionHistory: profile.answeredQuestionsHistory || {},
            todayXpEarned: profile.dailyXp?.xp || 0,
            lastActiveIstDate: profile.dailyXp?.date,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Diagnostic evaluation failed");
      }

      const diagResult: DiagnosticResultResponse = await res.json();
      setResult(diagResult);

      if (diagResult.passed) {
        setPlacementPassed(true);
        const updatedProfile = unlockChapterLessons(chapterId);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }

      // Persist active gap to profile if confirmed foundational gap
      if (
        diagResult.gapAnalysis &&
        diagResult.gapAnalysis.confirmed &&
        diagResult.gapAnalysis.rootConceptId &&
        diagResult.gapAnalysis.canRoute
      ) {
        const prof = getActiveProfile();
        if (prof) {
          prof.activeGap = {
            currentConceptId: chapterConcepts[0]?.id || chapterId,
            rootConceptId: diagResult.gapAnalysis.rootConceptId,
            plainLanguageReason: diagResult.gapAnalysis.plainLanguageReason || "",
            prerequisitePath: diagResult.gapAnalysis.prerequisitePath || [],
            confirmationQuestionIds: [],
            status: "confirmed",
          };
          saveProfile(prof);
          setProfile(prof);
        }
      }

      if (diagResult.confirmationQuestions && diagResult.confirmationQuestions.length > 0) {
        setConfirmationQuestions(diagResult.confirmationQuestions);
        setConfirmationToken(diagResult.confirmationToken || null);
        setConfirmationStatus("pending");
      }

      // Apply server-derived XP, streaks, levels, and badges
      const currentProf = getActiveProfile() || profile;
      if (currentProf) {
        const xpOutcome = applyAwardedXpToProfile(
          currentProf,
          diagResult.xpAwarded || 0,
          diagResult.newDailyTotal || 0,
          diagResult.updatedQuestionHistory
        );
        saveProfile(xpOutcome.updatedProfile);
        setProfile(xpOutcome.updatedProfile);

        if (diagResult.xpAwarded && diagResult.xpAwarded > 0) {
          setAwardedXpAnim(diagResult.xpAwarded);
          setShowConfetti(true);
          playPopSound();
          setTimeout(() => setShowConfetti(false), 2200);
        } else if (!diagResult.passed) {
          playGentleOopsSound();
        }

        if (xpOutcome.leveledUp) {
          const levelInfo = getLevelProgress(xpOutcome.updatedProfile.xp || 0);
          setShowLevelUp({ newLevel: xpOutcome.newLevel, rank: levelInfo.rank });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit diagnostic.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmationSelect = (questionId: string, optionId: string) => {
    if (confirmationSubmitted) return;
    setConfirmationAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleConfirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(confirmationAnswers).length < confirmationQuestions.length) {
      alert("Please answer all confirmation questions.");
      return;
    }

    if (!confirmationToken) {
      alert("Missing confirmation token. Please reload.");
      return;
    }

    try {
      const res = await fetch("/api/diagnostic/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: confirmationToken,
          studentId: profile.id,
          answers: confirmationAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error("Confirmation submission failed");
      }

      const confirmRes = await res.json();
      setConfirmationSubmitted(true);
      setConfirmationStatus(confirmRes.passed ? "passed" : "failed");

      const refreshed = getActiveProfile();
      if (refreshed) setProfile(refreshed);
    } catch (err: any) {
      alert(err.message || "Failed to evaluate confirmation questions.");
    }
  };

  const rootConcept = result?.gapAnalysis?.rootConceptId
    ? getConceptById(result.gapAnalysis.rootConceptId)
    : undefined;

  const foundGapsCount = result?.conceptBreakdown?.filter((c) => c.status === "foundational_gap").length || 0;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      <OfflineBanner />
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/student"
        backLabel="Class Lessons"
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative has-mobile-nav">
        <PixelConfetti active={showConfetti} />
        <FloatingXp xp={awardedXpAnim} active={showConfetti} />
        {showLevelUp && (
          <LevelUpModal
            newLevel={showLevelUp.newLevel}
            rank={showLevelUp.rank}
            onClose={() => setShowLevelUp(null)}
          />
        )}

        {/* Student XP Progress Track */}
        {profile && (
          <div className="max-w-[720px] lg:max-w-none mx-auto mb-6">
            <SegmentedXpBar currentXp={profile.xp || 0} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Question Column: Focused max 720px width, centered on desktop */}
          <div className="lg:col-span-8 max-w-[720px] mx-auto w-full space-y-6">
            {/* Assessment Header Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-emerald-950">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
                  <span>Chapter diagnostic</span>
                  <span>,</span>
                  <span>Class {profile.selectedClass}</span>
                </div>
                <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 bg-white/80 border border-white/90 rounded-full text-slate-700 shadow-2xs">
                  Diagnostic check
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
                {currentChapter ? (currentChapter.name[currentLang] || currentChapter.name.en) : chapterId}
              </h1>

              <p className="text-xs sm:text-sm text-slate-700 bg-white/80 p-4 rounded-2xl border border-white/90 leading-relaxed font-sans font-medium text-xs sm:text-sm">
                Answer these 6 questions. Margam checks your answers against the NCERT prerequisite graph to see what you understand and find any earlier topics you missed.
              </p>

              {errorMessage && (
                <div className="p-3.5 bg-[#E04A3F]/20 border-2 border-[#E04A3F] text-xs font-bold flex items-center gap-2 text-[#FFF7E6]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#E04A3F]" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

        {/* ================================================================= */}
        {/* COMPREHENSIVE LEARNING GAP REPORT (WHEN RESULT IS AVAILABLE)      */}
        {/* ================================================================= */}
        {result && (
          <div className="space-y-6">
            {/* A. Overall Assessment Summary Box */}
            <div
              className={`glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-6 text-slate-800 ${
                result.passed
                  ? "border-t-4 border-t-emerald-500"
                  : "border-t-4 border-t-amber-400"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/80 pb-5">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2 rounded-2xl bg-white/80 border border-white/90 shadow-xs">
                    <WitchCat
                      pose={result.passed ? "cheer" : "think"}
                      size={74}
                      sticker={false}
                      alt="Companion Reaction"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-emerald-900 block">
                      Diagnostic Evaluation Complete
                    </span>
                    <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-emerald-950 mt-0.5">
                      {result.passed
                        ? "Chapter lessons ready"
                        : foundGapsCount > 0
                        ? "Foundational Gap Identified"
                        : "Practice Recommended"}
                    </h2>
                    <p className="text-xs text-slate-600 font-sans font-medium mt-1">
                      {result.passed
                        ? "You answered the prerequisite questions accurately. Chapter lessons are ready to start."
                        : "We analyzed your error patterns. Strengthening prerequisite concepts will make this chapter effortless."}
                    </p>
                  </div>
                </div>

                <Link
                  href="/student"
                  className="self-start sm:self-center inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm no-underline transition-all"
                >
                  <span>Return to Learning Path</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] font-heading font-bold uppercase text-slate-500 block">
                    Questions
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-slate-800">
                    {result.total}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] font-heading font-bold uppercase text-slate-500 block">
                    Correct
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-emerald-700">
                    {result.score}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] font-heading font-bold uppercase text-slate-500 block">
                    Gaps Traced
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-amber-600">
                    {foundGapsCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] font-heading font-bold uppercase text-slate-500 block">
                    Accuracy
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-emerald-700">
                    {result.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* D. Next Action Recommendation Banner (Single clear CTA) */}
            {result.nextAction && (
              <div className="glass-panel p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 border-l-4 border-l-amber-500 text-amber-950 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-amber-900 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Immediate Recommended Next Action</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-amber-950">
                      {result.nextAction.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                      {result.nextAction.description}
                    </p>
                  </div>

                  <Link
                    href={result.nextAction.href}
                    className="inline-flex items-center justify-center shrink-0 min-h-[46px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm no-underline transition-all"
                  >
                    <span>Start lesson</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {/* B. Concept-Level Analysis */}
            {result.conceptBreakdown && result.conceptBreakdown.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800">
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5DAA3A]" />
                    <span>Topic analysis</span>
                  </h3>
                  <span className="text-[10px] font-heading text-slate-500 uppercase">
                    Diagnosed against Prerequisite Graph
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {result.conceptBreakdown.map((cb) => {
                    let badgeClass = "bg-emerald-600 text-white";
                    let statusLabel = "Mastered";
                    let borderClass = "border-[#5DAA3A]";

                    if (cb.status === "foundational_gap") {
                      badgeClass = "bg-[#E04A3F] text-[#FFFFFF]";
                      statusLabel = `Foundational Gap (Class ${cb.class})`;
                      borderClass = "border-[#E04A3F] bg-[#3B1917]";
                    } else if (cb.status === "needs_practice") {
                      badgeClass = "bg-amber-100 text-amber-900 border border-amber-300";
                      statusLabel = "Needs Practice";
                      borderClass = "border-amber-200 bg-amber-50/50";
                    } else if (cb.status === "unassessed") {
                      badgeClass = "bg-slate-100 text-slate-700 border border-slate-300";
                      statusLabel = "Not Assessed";
                      borderClass = "border-[#7A4B2A]";
                    }

                    return (
                      <div
                        key={cb.conceptId}
                        className={`p-4 rounded-2xl border ${borderClass} space-y-2`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] font-heading font-extrabold px-2 py-0.5 rounded-full uppercase ${badgeClass}`}
                          >
                            {statusLabel}
                          </span>
                          {cb.totalQuestions > 0 && (
                            <span className="text-[10px] font-heading font-bold text-slate-600">
                              {cb.correctCount} / {cb.totalQuestions} ({cb.scorePercentage}%)
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 font-bold">
                          {cb.conceptName}
                        </h4>

                        {cb.reason && (
                          <p className="text-[11px] text-[#D8D8D0] leading-relaxed">
                            {cb.reason}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. Recommended Learning Path (Following Prerequisite Graph) */}
            {result.learningPath && result.learningPath.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800">
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6] flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#5DAA3A]" />
                    <span>Your Recommended Learning Roadmap</span>
                  </h3>
                  <span className="text-[10px] font-heading font-bold text-emerald-900">
                    {result.learningPath.length} Steps
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {result.learningPath.map((step) => {
                    return (
                      <div
                        key={step.stepNumber}
                        className="p-4 rounded-2xl bg-white/80 border border-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {step.stepNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                                {step.title}
                              </span>
                              {step.isFoundational && (
                                <span className="text-[9px] font-heading font-extrabold px-2 py-0.5 bg-rose-100 text-rose-900 rounded-full border border-rose-300">
                                  Prerequisite
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={step.href}
                          className="self-end sm:self-center inline-flex items-center justify-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-bold text-xs shadow-xs no-underline transition-all shrink-0"
                        >
                          <span>Open lesson</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* DIAGNOSTIC QUESTIONS & STEP-BY-STEP REVIEW                        */}
        {/* ================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/80 pb-2">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">
              {result ? "Diagnostic Questions Review & Educational Feedback" : "Assessment Questions"}
            </h2>
            <span className="text-xs font-heading font-bold text-emerald-900">
              {questions.length} Total Questions
            </span>
          </div>

          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <span className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                        Answered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt: Larger readable font on desktop */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <div className="font-sans text-base sm:text-lg font-bold text-slate-900 leading-relaxed flex items-center flex-wrap gap-2">
                      <span className="break-words">{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-heading font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                          Draft Translation
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-white/80";
                    let optionBgClass = "bg-white/70 text-slate-800 hover:bg-white hover:border-emerald-300 hover:shadow-xs";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                        optionBgClass = "bg-emerald-100 text-emerald-950";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-rose-400 ring-2 ring-rose-400/20";
                        optionBgClass = "bg-rose-50 text-rose-950";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                      optionBgClass = "bg-emerald-100/90 text-emerald-950 shadow-xs";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
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
                        className={`min-h-[48px] p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${optionBorderClass} ${optionBgClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 border-2 font-heading font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-300"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {optData.text}
                          </span>
                        </div>

                        {result && feedbackItem && isSelected && (
                          feedbackItem.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-[#5DAA3A] shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#E04A3F] shrink-0" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Educational Feedback Post-Submission */}
                {feedbackItem && (
                  <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-white/90 space-y-3">
                    <div className="flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm">
                      {feedbackItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#5DAA3A]" />
                          <span className="text-[#5DAA3A]">Correct answer.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-700" />
                          <span className="text-amber-900">
                            {feedbackItem.misconceptionCategory
                              ? `Concept check: ${feedbackItem.misconceptionCategory.replace(/_/g, " ")}`
                              : "Conceptual Check"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Kind Mistake Creature Guidance */}
                    {!feedbackItem.isCorrect && (
                      <MistakeCreatureCard
                        tag={feedbackItem.tag || feedbackItem.misconceptionCategory}
                        hint={feedbackItem.educationalFeedback}
                      />
                    )}

                    {/* Step-by-Step Solution */}
                    {feedbackItem.explanation && (
                      <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-700 font-sans leading-relaxed space-y-1">
                        <span className="font-heading font-bold text-[10px] text-[#5DAA3A] uppercase block">
                          Step-by-step Solution:
                        </span>
                        <p>{resolveLocalizedString(feedbackItem.explanation, currentLang).text}</p>
                      </div>
                    )}

                    {/* Helpful Hint */}
                    {feedbackItem.hint && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-sans flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 shrink-0 text-amber-700" />
                        <span>{resolveLocalizedString(feedbackItem.hint, currentLang).text}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!result && (
            <div className="sticky bottom-4 z-30 glass-panel-elevated rounded-2xl p-4 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4 text-slate-800">
              <span className="text-xs font-heading font-extrabold text-emerald-950">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm cursor-pointer disabled:opacity-50 transition-all"
              >
                <span>{submitting ? "Evaluating..." : "Submit Diagnostic Assessment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* Confirmation Step (if triggered by low confidence) */}
        {confirmationQuestions.length > 0 && (
          <div className="mt-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800">
            <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Diagnostic Confirmation Step</span>
            </div>
            <h2 className="font-heading font-extrabold text-base text-emerald-950">
              Verification Questions
            </h2>
            <p className="text-xs text-slate-600 font-sans">
              Please answer these 2 quick follow-up questions to confirm whether targeted prerequisite routing is needed.
            </p>

            <form onSubmit={handleConfirmationSubmit} className="space-y-4 pt-2">
              {confirmationQuestions.map((cq, cqIdx) => (
                <div key={cq.id} className="p-4 rounded-2xl bg-white/80 border border-white/90 space-y-2">
                  <p className="text-xs font-heading font-bold text-emerald-900">
                    Confirmation #{cqIdx + 1}
                  </p>
                  <p className="text-sm font-bold text-slate-900 font-sans">
                    {resolveLocalizedString(cq.prompt, currentLang).text}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {cq.options?.map((cOpt) => (
                      <div
                        key={cOpt.id}
                        role="radio"
                        aria-checked={confirmationAnswers[cq.id] === cOpt.id}
                        tabIndex={0}
                        onClick={() => handleConfirmationSelect(cq.id, cOpt.id)}
                        className={`min-h-[44px] p-2.5 border-2 text-xs font-bold cursor-pointer flex items-center gap-2.5 ${
                          confirmationAnswers[cq.id] === cOpt.id
                            ? "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-xs"
                            : "border-white/80 bg-white/70 text-slate-800 hover:bg-white"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-heading text-[10px]">
                          {cOpt.id}
                        </span>
                        <span>{resolveLocalizedString(cOpt.text, currentLang).text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!confirmationSubmitted && (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-extrabold text-xs shadow-sm transition-all"
                >
                  Confirm result
                </button>
              )}
            </form>
          </div>
        )}
          </div>

          {/* Desktop Side Companion & Progress Panel (Hidden on mobile & tablet) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 select-none">
            {/* Companion Reaction Card */}
            <div className="glass-panel p-5 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] text-center space-y-3">
              <div className="flex justify-center">
                <WitchCat
                  pose={result ? (result.passed ? "cheer" : "think") : isIstNightTime() ? "sleepy" : "greet"}
                  size={96}
                  sticker={false}
                  alt="Margam guide"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wider block">
                  Companion Study Guide
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {result
                    ? result.passed
                      ? "You answered the prerequisite questions accurately. Chapter lessons are ready to start."
                      : "We found an earlier topic to review before continuing."
                    : "Work at your own pace. Each question checks an earlier topic."}
                </p>
              </div>
            </div>

            {/* Live Progress Card */}
            <div className="glass-panel p-4 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-3 text-slate-800">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-emerald-950">
                <span>Question Progress</span>
                <span>{Object.keys(answers).length} / {questions.length} Answered</span>
              </div>
              {/* Progress Blocks */}
              <div className="grid grid-cols-6 gap-1.5">
                {questions.map((q, idx) => {
                  const isDone = !!answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`h-4 rounded-md border border-white/90 flex items-center justify-center text-[9px] font-heading font-extrabold shadow-2xs ${
                        isDone
                          ? "bg-[#5DAA3A] text-[#FFF7E6]"
                          : "bg-white/60 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostic Quest Bounty */}
            <div className="glass-panel p-4 rounded-2xl border border-white/80 space-y-2 text-xs bg-amber-50/70 text-amber-950">
              <div className="flex items-center gap-1.5 text-amber-900 font-heading font-extrabold">
                <span>Diagnostic check</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                Complete this diagnostic to earn <strong className="text-amber-900 font-bold">+30 XP</strong> and make practice worksheets available.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-6 text-center text-xs font-heading font-bold text-slate-600/80">
        Margam · Maths for Classes 6-10
      </footer>
    </div>
  );
}
