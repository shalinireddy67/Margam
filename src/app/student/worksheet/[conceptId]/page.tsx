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
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  Lock,
  Calendar,
  Compass,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  AttemptComparison,
} from "@/lib/types";
import { getActiveProfile, saveProfile } from "@/lib/storage";
import { canAccessTopic } from "@/lib/progression";
import {
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";
import Footer from "@/components/Footer";
import { WitchCat } from "@/components/ui/WitchCat";
import {
  SkeletonCard,
  OfflineBanner,
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
  gapResolved?: boolean;
  comparison?: AttemptComparison;
  nextRevisionAt?: string;
  revisionLevel?: number;
  conceptsPracticed?: string[];
  conceptsNeedingAttention?: string[];
  nextAction?: {
    title: string;
    description: string;
    href: string;
  };
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    chosenAnswer: string;
    correctAnswer?: string;
    tag?: string;
    hint?: any;
    misconceptionCategory?: string;
    educationalFeedback?: string;
    explanation?: any;
    conceptId?: string;
  }>;
  mistakeHint?: string;
  xpAwarded?: number;
  grossXp?: number;
  isCapped?: boolean;
  newDailyTotal?: number;
  updatedQuestionHistory?: Record<string, string>;
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
  const [worksheetTitle, setWorksheetTitle] = useState<string>("");
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizedReason, setPersonalizedReason] = useState<string>("");
  const [prereqsIncluded, setPrereqsIncluded] = useState<Array<{ conceptId: string; name: string; count: number }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PracticeResultResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedReason, setLockedReason] = useState<string>("");
  const [showLevelUp, setShowLevelUp] = useState<{ newLevel: number; rank: any } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [awardedXpAnim, setAwardedXpAnim] = useState<number>(0);

  const initPractice = useCallback(() => {
    try {
      setLoading(true);
      setHasError(false);
      setErrorMessage(null);
      setIsLocked(false);

      const active = getActiveProfile();
      if (!active || !active.selectedClass) {
        router.replace("/");
        return;
      }

      const access = canAccessTopic(conceptId, active, true);
      if (!access.accessible) {
        setIsLocked(true);
        setLockedReason(access.reason || "You must complete prerequisite topics before accessing this practice.");
        setLoading(false);
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
              count: 5,
              profile: active,
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
            setWorksheetTitle(data.worksheetTitle || "");
            setIsPersonalized(!!data.isPersonalized);
            setPersonalizedReason(data.personalizedReason || "");
            setPrereqsIncluded(data.prerequisiteConceptsIncluded || []);
            if (data.targetDifficulty) {
              setDifficultyLevel(data.targetDifficulty);
            }
            setLoading(false);
          }
        } catch (err: any) {
          if (!isCancelled) {
            setHasError(true);
            setErrorMessage(err.message || "Network error loading practice questions");
            setLoading(false);
          }
        }
      }

      loadPractice();

      return () => {
        isCancelled = true;
      };
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load practice questions.");
      setLoading(false);
    }
  }, [conceptId, router]);

  useEffect(() => {
    initPractice();
  }, [initPractice]);

  // Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] p-4 sm:p-6 pb-28">
        <OfflineBanner />
        <div className="max-w-4xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading adaptive practice">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Locked State
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/student"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-white p-8 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-2 border-[#2B1B0F] flex items-center justify-center mx-auto text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#2B1B0F]">
              Practice Locked
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans leading-relaxed">
              {lockedReason || "You must complete prerequisite topics before accessing this practice."}
            </p>
            <div className="pt-2">
              <Link
                href="/student"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[3px] border-[#2B1B0F] text-sm font-heading font-extrabold shadow-[3px_3px_0px_#2B1B0F] no-underline transition-all"
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

  if (!concept || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-800">
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-lg max-w-md text-center space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-emerald-950">No Questions Found</h2>
          <p className="text-xs text-slate-600 font-sans">
            Practice questions for this topic are currently being prepared.
          </p>
          <Link
            href="/student"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-heading font-bold px-4 py-2 shadow-sm"
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
          profile,
          isPersonalized,
          studentHistory: {
            questionHistory: profile.answeredQuestionsHistory || {},
            todayXpEarned: profile.dailyXp?.xp || 0,
            lastActiveIstDate: profile.dailyXp?.date,
          },
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

      // Apply server-derived XP, streaks, levels, and badges
      const currentProf = getActiveProfile() || profile;
      if (currentProf) {
        const xpOutcome = applyAwardedXpToProfile(
          currentProf,
          practiceRes.xpAwarded || 0,
          practiceRes.newDailyTotal || 0,
          practiceRes.updatedQuestionHistory
        );
        saveProfile(xpOutcome.updatedProfile);
        setProfile(xpOutcome.updatedProfile);

        if (practiceRes.xpAwarded && practiceRes.xpAwarded > 0) {
          setAwardedXpAnim(practiceRes.xpAwarded);
          setShowConfetti(true);
          playPopSound();
          setTimeout(() => setShowConfetti(false), 2200);
        } else if (!practiceRes.passed) {
          playGentleOopsSound();
        }

        if (xpOutcome.leveledUp) {
          const levelInfo = getLevelProgress(xpOutcome.updatedProfile.xp || 0);
          setShowLevelUp({ newLevel: xpOutcome.newLevel, rank: levelInfo.rank });
        }
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
      <span className="inline-flex items-center text-[#102610] font-bold tracking-wider">
        {"★".repeat(level)}
        <span className="text-[#102610]/30">{"★".repeat(3 - level)}</span>
      </span>
    );
  };

  return (
    <div className="min-h-[100dvh] text-slate-800 flex flex-col justify-between">
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
          {/* Main Focused Column: max ~720px wide */}
          <div className="lg:col-span-8 max-w-[720px] mx-auto w-full space-y-6">
            {/* Title Header Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-emerald-950">
              <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full">
              <span>Adaptive Practice</span>
              <span>•</span>
              <span>Class {concept.class}</span>
              {isPersonalized && (
                <>
                  <span>•</span>
                  <span className="text-amber-800 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Personalized Worksheet
                  </span>
                </>
              )}
            </div>

            {/* Difficulty Badge with 1 to 3 stars */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300 rounded-full text-xs font-heading font-extrabold shadow-xs text-amber-950">
              <span>Level {difficultyLevel}</span>
              {renderStars(difficultyLevel)}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950 tracking-wide">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 bg-white/80 p-4 rounded-2xl border border-white/90 leading-relaxed font-sans font-medium">
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Personalized Worksheet Metadata Banner */}
          {isPersonalized && personalizedReason && (
            <div className="glass-panel p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-heading font-extrabold text-amber-900 uppercase tracking-wider block">
                  Tailored Practice Strategy
                </span>
                <p className="text-xs text-slate-700 font-sans leading-snug">
                  {personalizedReason}
                </p>
                {prereqsIncluded.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] text-[#5DAA3A] font-bold">Reinforcing:</span>
                    {prereqsIncluded.map((pr) => (
                      <span
                        key={pr.conceptId}
                        className="px-2.5 py-0.5 bg-white/80 border border-white/90 rounded-lg text-[10px] font-heading font-bold text-slate-700 shadow-2xs"
                      >
                        {pr.name} ({pr.count} question{pr.count > 1 ? "s" : ""})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Summary Box with Mascot & Comparison */}
          {result && (
            <div className="space-y-4 mt-6">
              {result.gapResolved && (
                <div className="glass-panel p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-heading font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>✨ Foundational Prerequisite Gap Resolved! (+50 XP Bonus)</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">
                    Foundation Successfully Repaired!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                    You scored <strong>{result.percentage}%</strong> and demonstrated mastery on this foundational topic. This block is now illuminated on your Concept Pathway!
                  </p>
                </div>
              )}

              {/* Main Score & Mastery Card */}
              <div
                className={`glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] text-slate-800 ${
                  result.passed
                    ? "border-t-4 border-t-emerald-500"
                    : "border-t-4 border-t-amber-400"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-2 rounded-2xl bg-white/80 border border-white/90 shadow-xs">
                      <WitchCat
                        pose={result.percentage >= 70 || result.passed ? "cheer" : "think"}
                        size={72}
                        sticker={true}
                        alt="Margam Learning Companion reviewing practice results"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base sm:text-lg flex items-center gap-2">
                        {result.passed ? (
                          <>
                            <Award className="w-5 h-5 text-[#79B82A]" />
                            <span>Practice Complete! Mastery Updated</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-[#E5B834]" />
                            <span>Practice Attempted • Review Recommended</span>
                          </>
                        )}
                      </h3>
                      <p className="text-xs font-bold mt-1 text-[#D8D8D0]">
                        Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%) • Mastery: <strong>{result.mastery}%</strong>
                        {result.passed
                          ? " • Next level unlocked!"
                          : " • Keep practicing to build confidence."}
                      </p>
                      {result.mistakeHint && (
                        <p className="text-xs mt-2 p-3 rounded-xl bg-white/80 border border-white/90 font-sans font-medium text-slate-700">
                          💡 <strong>Hint:</strong> {result.mistakeHint}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center min-h-[42px] gap-1.5 px-4 py-2 bg-white/80 hover:bg-white text-slate-700 font-heading font-bold text-xs rounded-xl border border-white/90 shadow-xs transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Practice Again</span>
                    </button>

                    <Link
                      href={result.nextAction?.href || `/lesson/${conceptId}`}
                      className="inline-flex items-center justify-center min-h-[42px] gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-extrabold shadow-sm no-underline transition-all"
                    >
                      <span>{result.nextAction?.title || "Continue Path"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Section 6: Previous Attempt Comparison Block */}
                {result.comparison && (
                  <div className="mt-4 pt-4 border-t-2 border-[#7A4B2A]">
                    {result.comparison.hasPreviousAttempt ? (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-heading font-extrabold text-[#5DAA3A] uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-[#5DAA3A]" />
                            Performance Comparison
                          </span>
                          {result.comparison.improvementDelta !== undefined && (
                            <span
                              className={`px-2 py-0.5 text-xs font-heading font-extrabold border ${
                                result.comparison.improvementDelta > 0
                                  ? "bg-emerald-600 text-white rounded-full shadow-xs"
                                  : result.comparison.improvementDelta === 0
                                  ? "bg-white/80 text-slate-700 border-white/90 rounded-full"
                                  : "bg-rose-100 text-rose-900 border-rose-300 rounded-full"
                              }`}
                            >
                              {result.comparison.improvementDelta > 0
                                ? `+${result.comparison.improvementDelta}% Improvement! 🚀`
                                : result.comparison.improvementDelta === 0
                                ? "Consistent Performance"
                                : `${result.comparison.improvementDelta}% (Needs Review)`}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-3 text-sm">
                          <span className="text-slate-600">
                            Previous Attempt:{" "}
                            <strong className="text-slate-900">
                              {result.comparison.previousScore} / {result.comparison.previousTotal} ({result.comparison.previousPercentage}%)
                            </strong>
                          </span>
                          <span className="text-emerald-700 font-extrabold">➔</span>
                          <span className="text-slate-600">
                            Latest Attempt:{" "}
                            <strong className="text-emerald-800 font-bold">
                              {result.comparison.latestScore} / {result.comparison.latestTotal} ({result.comparison.latestPercentage}%)
                            </strong>
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-sans leading-snug">
                          {result.comparison.message}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/80 border border-white/90 text-xs text-slate-700 font-sans flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          <strong>First Attempt Recorded:</strong> Scored {result.score}/{result.total} ({result.percentage}%). Future attempts will track your growth delta!
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Spaced Revision Indicator */}
                {result.nextRevisionAt && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 font-sans font-medium">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>
                      Next scheduled revision:{" "}
                      <strong className="text-emerald-950 font-bold">
                        {new Date(result.nextRevisionAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </strong>{" "}
                      (Spaced Level {result.revisionLevel || 1})
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-sans font-bold flex items-center gap-2 text-rose-900 p-3.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E04A3F]" />
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
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-4 text-slate-800"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/80 pb-3">
                  <span className="text-xs font-heading font-bold text-emerald-900 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border border-amber-300 bg-amber-100 text-amber-900">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt: Larger readable font on desktop */}
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

                {/* Options */}
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
                          <span className="text-xs sm:text-sm font-bold leading-snug">{optData.text}</span>
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

                {/* Question Feedback Post-Submission with Mascot & Educational Guidance */}
                {feedbackItem && (
                  <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-white/90 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        <WitchCat
                          pose={feedbackItem.isCorrect ? "cheer" : "think"}
                          size={56}
                          sticker={false}
                          alt="Margam Learning Companion"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm">
                          {feedbackItem.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#5DAA3A]" />
                              <span className="text-[#5DAA3A]">Correct! Solid understanding demonstrated.</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-amber-700" />
                              <span className="text-amber-900">
                                {feedbackItem.misconceptionCategory
                                  ? `Concept Note: ${feedbackItem.misconceptionCategory.replace(/_/g, " ").toUpperCase()}`
                                  : "Review Method"}
                              </span>
                            </>
                          )}
                        </div>

                        {!feedbackItem.isCorrect && (
                          <MistakeCreatureCard
                            tag={feedbackItem.tag || feedbackItem.misconceptionCategory}
                            hint={feedbackItem.educationalFeedback}
                          />
                        )}

                        {feedbackItem.explanation && (
                          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-700 font-sans leading-relaxed space-y-1">
                            <span className="font-heading font-bold text-[10px] text-[#5DAA3A] uppercase block">
                              Step-by-step Solution:
                            </span>
                            <p>{resolveLocalizedString(feedbackItem.explanation, currentLang).text}</p>
                          </div>
                        )}

                        {feedbackItem.hint && (
                          <p className="text-xs text-emerald-950 font-sans font-medium pt-1">
                            <strong>Tip:</strong> {typeof feedbackItem.hint === 'string' ? feedbackItem.hint : resolveLocalizedString(feedbackItem.hint, currentLang).text}
                          </p>
                        )}
                      </div>
                    </div>
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
                <span>{submitting ? "Checking..." : "Submit Practice Worksheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
          </div>

          {/* Desktop Side Companion & Progress Panel (Hidden on mobile & tablet) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 select-none">
            {/* Companion Card */}
            <div className="glass-panel p-5 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] text-center space-y-3">
              <div className="flex justify-center">
                <WitchCat
                  pose={result ? (result.percentage >= 70 ? "cheer" : "think") : isIstNightTime() ? "sleepy" : "greet"}
                  size={96}
                  sticker={false}
                  alt="Margam companion study buddy"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wider block">
                  Companion Study Guide
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {result
                    ? result.percentage >= 70
                      ? "Great job on this worksheet! Your concept foundation is growing stronger."
                      : "Keep practicing! Reviewing the explanation steps will help you master this."
                    : "Focused adaptive practice. Each question adapts to your current level."}
                </p>
              </div>
            </div>

            {/* Live Progress Card */}
            <div className="glass-panel p-4 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.08)] space-y-3 text-slate-800">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-emerald-950">
                <span>Worksheet Progress</span>
                <span>{Object.keys(answers).length} / {questions.length} Answered</span>
              </div>
              {/* Progress Blocks */}
              <div className="grid grid-cols-5 gap-1.5">
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

            {/* Practice XP Bounty */}
            <div className="glass-panel p-4 rounded-2xl border border-white/80 space-y-2 text-xs bg-amber-50/70 text-amber-950">
              <div className="flex items-center gap-1.5 text-amber-900 font-heading font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Practice XP Rewards</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                Earn <strong className="text-amber-900 font-bold">10 XP × Difficulty</strong> for each correct answer plus first-try bonuses!
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-6 text-center text-xs font-heading font-bold text-slate-600/80">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
