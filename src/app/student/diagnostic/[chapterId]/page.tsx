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
          const res = await fetch("/api/diagnostic/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterId,
              studentId: active!.id,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to load diagnostic");
          }

          const data = await res.json();
          if (!isCancelled) {
            setQuestions(data.questions || []);
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
      <div className="min-h-[100dvh] bg-[#2A1E17] text-[#FFF7E6] flex flex-col justify-between">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center text-center my-auto w-full">
          <div className="bg-[#5A3720] border-4 border-[#422816] p-6 sm:p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-4 w-full">
            <div className="w-14 h-14 bg-[#E04A3F] border-3 border-[#422816] flex items-center justify-center mx-auto text-[#FFFFFF] font-heading font-extrabold text-lg shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#FFF7E6]">
              Diagnostic Assessment Error
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#E5D7BE] leading-relaxed">
              {errorMessage || "We encountered an issue preparing this diagnostic assessment."}
            </p>
            <div className="pt-2">
              <Button
                variant="pixelgreen"
                size="default"
                onClick={initDiagnostic}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>Try Again</span>
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
          backHref="/"
          backLabel="Back to Path"
        />
        <main className="max-w-xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center text-center my-auto w-full">
          <div className="bg-[#5A3720] p-6 sm:p-8 border-4 border-[#422816] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-4 w-full">
            <div className="w-14 h-14 bg-[#FFE9A8] border-3 border-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7 text-[#2B1B0F]" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#FFF7E6]">
              Diagnostic Not Available
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#E5D7BE] leading-relaxed max-w-md mx-auto">
              This chapter is still being built. Try another chapter or come back soon.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] text-xs font-heading font-extrabold shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline transition-colors"
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
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative">
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
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/75 shadow-sm space-y-4 text-emerald-950">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#FFE9A8]">
                  <span>Chapter Diagnostic</span>
                  <span>•</span>
                  <span>Class {profile.selectedClass}</span>
                </div>
                <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#422816] border border-[#7A4B2A] text-[#FFE9A8]">
                  Intelligent Learning Gap Engine
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
                {currentChapter ? (currentChapter.name[currentLang] || currentChapter.name.en) : chapterId}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-900/80 bg-white/70 p-3.5 rounded-xl border border-white/80 leading-relaxed font-medium">
                Answer these 6 questions. Our adaptive engine investigates your responses against the NCERT prerequisite graph to pinpoint exactly what you understand and detect any missing foundational concepts from earlier grades.
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
              className={`p-6 sm:p-8 border-4 border-[#422816] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-6 bg-[#5A3720] ${
                result.passed
                  ? "border-t-4 border-t-[#5DAA3A]"
                  : "border-t-4 border-t-[#FFE9A8]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-[#7A4B2A] pb-5">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2 bg-[#422816] border-2 border-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
                    <WitchCat
                      pose={result.passed ? "cheer" : "think"}
                      size={74}
                      sticker={false}
                      alt="Companion Reaction"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#FFE9A8] block">
                      Diagnostic Evaluation Complete
                    </span>
                    <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-[#FFF7E6] mt-0.5">
                      {result.passed
                        ? "Chapter Mastery Unlocked! 🎉"
                        : foundGapsCount > 0
                        ? "Foundational Gap Identified"
                        : "Practice Recommended"}
                    </h2>
                    <p className="text-xs text-[#E5D7BE] font-medium mt-1">
                      {result.passed
                        ? "You demonstrated strong mastery of the chapter prerequisites. All chapter quests are unlocked!"
                        : "We analyzed your error patterns. Strengthening prerequisite concepts will make this chapter effortless."}
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="self-start sm:self-center inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                >
                  <span>Return to Learning Path</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#422816] border-2 border-[#7A4B2A] text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold uppercase text-[#E5D7BE]/80 block">
                    Questions
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-[#FFF7E6]">
                    {result.total}
                  </span>
                </div>
                <div className="p-3.5 bg-[#422816] border-2 border-[#7A4B2A] text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold uppercase text-[#E5D7BE]/80 block">
                    Correct
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-[#5DAA3A]">
                    {result.score}
                  </span>
                </div>
                <div className="p-3.5 bg-[#422816] border-2 border-[#7A4B2A] text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold uppercase text-[#E5D7BE]/80 block">
                    Gaps Traced
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-[#FFE9A8]">
                    {foundGapsCount}
                  </span>
                </div>
                <div className="p-3.5 bg-[#422816] border-2 border-[#7A4B2A] text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold uppercase text-[#E5D7BE]/80 block">
                    Accuracy
                  </span>
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-[#5DAA3A]">
                    {result.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* D. Next Action Recommendation Banner (Single clear CTA) */}
            {result.nextAction && (
              <div className="p-6 bg-[#422816] border-3 border-[#FFE9A8] border-l-[8px] border-l-[#FFE9A8] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#FFE9A8] uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#FFE9A8]" />
                  <span>Immediate Recommended Next Action</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#FFF7E6]">
                      {result.nextAction.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E5D7BE] leading-relaxed">
                      {result.nextAction.description}
                    </p>
                  </div>

                  <Link
                    href={result.nextAction.href}
                    className="inline-flex items-center justify-center shrink-0 min-h-[46px] px-5 py-2.5 bg-[#FFE9A8] hover:bg-[#FFF2CC] text-[#2B1B0F] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <span>Start This Quest</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {/* B. Concept-Level Analysis */}
            {result.conceptBreakdown && result.conceptBreakdown.length > 0 && (
              <div className="p-6 sm:p-7 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-4">
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5DAA3A]" />
                    <span>Concept-Level Mastery Analysis</span>
                  </h3>
                  <span className="text-[10px] font-heading text-[#E5D7BE]/80 uppercase">
                    Diagnosed against Prerequisite Graph
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {result.conceptBreakdown.map((cb) => {
                    let badgeClass = "bg-[#5DAA3A] text-[#FFF7E6]";
                    let statusLabel = "Mastered";
                    let borderClass = "border-[#5DAA3A]";

                    if (cb.status === "foundational_gap") {
                      badgeClass = "bg-[#E04A3F] text-[#FFFFFF]";
                      statusLabel = `Foundational Gap (Class ${cb.class})`;
                      borderClass = "border-[#E04A3F] bg-[#3B1917]";
                    } else if (cb.status === "needs_practice") {
                      badgeClass = "bg-[#FFE9A8] text-[#2B1B0F]";
                      statusLabel = "Needs Practice";
                      borderClass = "border-[#FFE9A8]";
                    } else if (cb.status === "unassessed") {
                      badgeClass = "bg-[#7A4B2A] text-[#E5D7BE]";
                      statusLabel = "Not Assessed";
                      borderClass = "border-[#7A4B2A]";
                    }

                    return (
                      <div
                        key={cb.conceptId}
                        className={`p-4 bg-[#422816] border-2 ${borderClass} space-y-2`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] font-heading font-extrabold px-2 py-0.5 border border-[#102610] uppercase ${badgeClass}`}
                          >
                            {statusLabel}
                          </span>
                          {cb.totalQuestions > 0 && (
                            <span className="text-[10px] font-heading font-bold text-[#D8D8D0]">
                              {cb.correctCount} / {cb.totalQuestions} ({cb.scorePercentage}%)
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#F2F0DF]">
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
              <div className="p-6 sm:p-7 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-4">
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6] flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#5DAA3A]" />
                    <span>Your Recommended Learning Roadmap</span>
                  </h3>
                  <span className="text-[10px] font-heading text-[#FFE9A8]">
                    {result.learningPath.length} Steps
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {result.learningPath.map((step) => {
                    return (
                      <div
                        key={step.stepNumber}
                        className="p-4 bg-[#422816] border-2 border-[#7A4B2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#FFE9A8] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 bg-[#5DAA3A] text-[#FFF7E6] font-heading font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#422816]">
                            {step.stepNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-bold text-xs sm:text-sm text-[#FFF7E6]">
                                {step.title}
                              </span>
                              {step.isFoundational && (
                                <span className="text-[9px] font-heading font-extrabold px-1.5 py-0.5 bg-[#E04A3F] text-[#FFFFFF] border border-[#422816]">
                                  Prerequisite
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#E5D7BE] mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={step.href}
                          className="self-end sm:self-center inline-flex items-center justify-center px-3.5 py-1.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border border-[#422816] font-heading font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline transition-colors shrink-0"
                        >
                          <span>Open Quest</span>
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
          <div className="flex items-center justify-between border-b-2 border-[#7A4B2A] pb-2">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FFF7E6]">
              {result ? "Diagnostic Questions Review & Educational Feedback" : "Assessment Questions"}
            </h2>
            <span className="text-xs font-heading font-bold text-[#FFE9A8]">
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
                className="bg-[#5A3720] p-6 sm:p-7 border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-4 text-[#FFF7E6]"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <span className="text-xs font-heading font-bold text-[#FFE9A8] uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 border border-[#422816] bg-[#5DAA3A] text-[#FFF7E6]">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-[#FFE9A8] text-[#2B1B0F] px-2 py-0.5 border border-[#422816]">
                        Answered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt: Larger readable font on desktop */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <div className="font-sans text-base sm:text-lg lg:text-xl font-medium text-[#FFF7E6] leading-relaxed flex items-center flex-wrap gap-2">
                      <span className="break-words">{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-heading font-bold bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
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

                    let optionBorderClass = "border-2 border-[#7A4B2A]";
                    let optionBgClass = "bg-[#422816] text-[#E5D7BE] hover:border-[#3FA7C9] hover:bg-[#5A3720]";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#2F6B22]";
                        optionBgClass = "bg-[#5DAA3A] text-[#FFF7E6]";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#8B2323]";
                        optionBgClass = "bg-[#E04A3F] text-[#FFF7E6]";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-2 border-[#1E6F8C]";
                      optionBgClass = "bg-[#3FA7C9] text-[#FFF7E6] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.4)]";
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
                        className={`min-h-[48px] p-3.5 border-2 cursor-pointer flex items-center justify-between transition-transform active:translate-x-[1px] active:translate-y-[1px] ${optionBorderClass} ${optionBgClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 border-2 font-heading font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-[#FFE9A8] text-[#2B1B0F] border-[#422816]"
                                : "bg-[#422816] text-[#FFE9A8] border-[#7A4B2A]"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#FFF7E6] leading-snug">
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
                  <div className="mt-4 p-4 bg-[#422816] border-2 border-[#7A4B2A] space-y-3">
                    <div className="flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm">
                      {feedbackItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#5DAA3A]" />
                          <span className="text-[#5DAA3A]">Correct Answer! Excellent conceptual grasp.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-[#FFE9A8]" />
                          <span className="text-[#FFE9A8]">
                            {feedbackItem.misconceptionCategory
                              ? `Concept Insight: ${feedbackItem.misconceptionCategory.replace(/_/g, " ").toUpperCase()}`
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
                      <div className="p-3 bg-[#422816] border border-[#7A4B2A] text-xs text-[#E5D7BE] leading-relaxed space-y-1">
                        <span className="font-heading font-bold text-[10px] text-[#5DAA3A] uppercase block">
                          Step-by-step Solution:
                        </span>
                        <p>{resolveLocalizedString(feedbackItem.explanation, currentLang).text}</p>
                      </div>
                    )}

                    {/* Helpful Hint */}
                    {feedbackItem.hint && (
                      <div className="p-2.5 bg-[#5A3720] border border-[#7A4B2A] text-xs text-[#FFE9A8] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 shrink-0 text-[#FFE9A8]" />
                        <span>{resolveLocalizedString(feedbackItem.hint, currentLang).text}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!result && (
            <div className="sticky bottom-4 z-30 bg-[#5A3720] border-4 border-[#422816] p-4 shadow-[0px_4px_0px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 text-[#FFF7E6]">
              <span className="text-xs font-heading font-bold text-[#FFE9A8]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50 transition-colors"
              >
                <span>{submitting ? "Evaluating..." : "Submit Diagnostic Assessment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* Confirmation Step (if triggered by low confidence) */}
        {confirmationQuestions.length > 0 && (
          <div className="mt-8 bg-[#5A3720] p-6 sm:p-8 border-4 border-[#FFE9A8] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#FFE9A8]">
              <ShieldCheck className="w-4 h-4 text-[#FFE9A8]" />
              <span>Diagnostic Confirmation Step</span>
            </div>
            <h2 className="font-heading font-extrabold text-base text-[#F2F0DF]">
              Verification Questions
            </h2>
            <p className="text-xs text-[#D8D8D0]">
              Please answer these 2 quick follow-up questions to confirm whether targeted prerequisite routing is needed.
            </p>

            <form onSubmit={handleConfirmationSubmit} className="space-y-4 pt-2">
              {confirmationQuestions.map((cq, cqIdx) => (
                <div key={cq.id} className="p-4 bg-[#422816] border-2 border-[#7A4B2A] space-y-2">
                  <p className="text-xs font-heading font-bold text-[#FFE9A8]">
                    Confirmation #{cqIdx + 1}
                  </p>
                  <p className="text-sm font-bold text-[#FFF7E6]">
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
                            ? "border-[#1E6F8C] bg-[#3FA7C9] text-[#FFF7E6] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                            : "border-[#7A4B2A] bg-[#5A3720] text-[#E5D7BE]"
                        }`}
                      >
                        <span className="w-5 h-5 border border-[#422816] bg-[#422816] flex items-center justify-center font-heading text-[10px] text-[#FFE9A8]">
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
                  className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#FFE9A8] text-[#2B1B0F] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                >
                  Confirm Diagnostic Result
                </button>
              )}
            </form>
          </div>
        )}
          </div>

          {/* Desktop Side Companion & Progress Panel (Hidden on mobile & tablet) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 select-none">
            {/* Companion Reaction Card */}
            <div className="p-5 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] text-center space-y-3">
              <div className="flex justify-center">
                <WitchCat
                  pose={result ? (result.passed ? "cheer" : "think") : isIstNightTime() ? "sleepy" : "greet"}
                  size={96}
                  sticker={false}
                  alt="Margam companion cheering you on"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#FFE9A8] uppercase tracking-wider block">
                  Companion Study Guide
                </span>
                <p className="text-xs text-[#FFF7E6] leading-relaxed font-sans font-medium">
                  {result
                    ? result.passed
                      ? "Incredible work! You conquered the prerequisites for this chapter."
                      : "We found the exact concept to practice. You've got this!"
                    : "Take your time! No rush, every question diagnoses your foundational skills."}
                </p>
              </div>
            </div>

            {/* Live Progress Card */}
            <div className="p-4 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-3">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#FFE9A8]">
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
                      className={`h-4 border-2 border-[#422816] flex items-center justify-center text-[9px] font-heading font-extrabold ${
                        isDone
                          ? "bg-[#5DAA3A] text-[#FFF7E6]"
                          : "bg-[#422816] text-[#A68A72]"
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostic Quest Bounty */}
            <div className="p-4 bg-[#422816] border-2 border-[#7A4B2A] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#FFE9A8] font-heading font-extrabold">
                <Sparkles className="w-4 h-4 text-[#FFE9A8]" />
                <span>Diagnostic Bounty</span>
              </div>
              <p className="text-[11px] text-[#E5D7BE] leading-relaxed">
                Complete this diagnostic to earn <strong className="text-[#FFE9A8]">+30 XP</strong> and unlock personalized practice worksheets!
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t-4 border-[#422816] py-4 text-center text-xs font-heading text-[#E5D7BE]/70 bg-[#1A1614]">
        Margam Adaptive Mathematics • Intelligent Learning Gap Engine
      </footer>
    </div>
  );
}
