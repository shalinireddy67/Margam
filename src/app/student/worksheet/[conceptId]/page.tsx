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
import { getActiveProfile } from "@/lib/storage";
import { canAccessTopic } from "@/lib/progression";
import {
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import StudentHeader from "@/components/StudentHeader";
import { WitchCat } from "@/components/ui/WitchCat";
import {
  SkeletonCard,
  OfflineBanner,
} from "@/components/ui";

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
    mistakeTag?: string;
    misconceptionCategory?: string;
    educationalFeedback?: string;
    explanation?: any;
    conceptId?: string;
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
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
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
      <div className="min-h-screen bg-[#2A1E17] text-[#FFF7E6] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#5A3720] border-4 border-[#422816] p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-2 border-[#422816] flex items-center justify-center mx-auto text-[#2B1B0F]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#FFF7E6]">
              Practice Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#E5D7BE] leading-relaxed">
              {lockedReason || "You must complete prerequisite topics before accessing this practice."}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#FFF7E6] border-2 border-[#422816] text-xs font-heading font-extrabold shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px]"
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
      <div className="min-h-screen flex items-center justify-center bg-[#2A1E17] p-6 text-[#FFF7E6]">
        <div className="bg-[#5A3720] p-6 border-4 border-[#422816] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] max-w-md text-center space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-[#FFF7E6]">No Questions Found</h2>
          <p className="text-xs font-bold text-[#E5D7BE]">
            Practice questions for this topic are currently being prepared.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-[#422816] bg-[#5DAA3A] text-[#FFF7E6] text-xs font-heading font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
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
      <span className="inline-flex items-center text-[#102610] font-bold tracking-wider">
        {"★".repeat(level)}
        <span className="text-[#102610]/30">{"★".repeat(3 - level)}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#2A1E17] flex flex-col justify-between text-[#FFF7E6] pb-24">
      <OfflineBanner />
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
        {/* Title Header Card */}
        <div className="bg-[#5A3720] p-6 sm:p-8 border-4 border-[#422816] border-t-4 border-t-[#FFE9A8] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-4 text-[#FFF7E6]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#FFE9A8]">
              <span>Adaptive Practice</span>
              <span>•</span>
              <span>Class {concept.class}</span>
              {isPersonalized && (
                <>
                  <span>•</span>
                  <span className="text-[#FFE9A8] font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Personalized Worksheet
                  </span>
                </>
              )}
            </div>

            {/* Difficulty Badge with 1 to 3 stars */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE9A8] border-2 border-[#422816] text-xs font-heading font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.4)] text-[#2B1B0F]">
              <span>Level {difficultyLevel}</span>
              {renderStars(difficultyLevel)}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#FFF7E6] tracking-wide drop-shadow-[2px_2px_0px_#422816]">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-[#E5D7BE] bg-[#422816] p-3.5 border-2 border-[#7A4B2A] leading-relaxed font-medium">
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Personalized Worksheet Metadata Banner */}
          {isPersonalized && personalizedReason && (
            <div className="p-3.5 bg-[#422816] border-2 border-[#FFE9A8] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#FFE9A8] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-heading font-extrabold text-[#FFE9A8] uppercase tracking-wider block">
                  Tailored Practice Strategy
                </span>
                <p className="text-xs text-[#E5D7BE] leading-snug">
                  {personalizedReason}
                </p>
                {prereqsIncluded.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] text-[#5DAA3A] font-bold">Reinforcing:</span>
                    {prereqsIncluded.map((pr) => (
                      <span
                        key={pr.conceptId}
                        className="px-2 py-0.5 bg-[#5A3720] border border-[#7A4B2A] text-[10px] font-heading font-bold text-[#FFF7E6]"
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
                <div className="p-5 bg-[#422816] border-3 border-[#FFE9A8] border-l-[8px] border-l-[#FFE9A8] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-2">
                  <div className="flex items-center gap-2 text-[#FFE9A8] font-heading font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#FFE9A8]" />
                    <span>Foundational Prerequisite Gap Resolved!</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#FFF7E6]">
                    Foundation Successfully Repaired!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E5D7BE] leading-relaxed">
                    You scored <strong>{result.percentage}%</strong> and demonstrated mastery on this foundational topic. This concept is now marked as resolved in your learner profile!
                  </p>
                </div>
              )}

              {/* Main Score & Mastery Card */}
              <div
                className={`p-6 border-4 border-[#422816] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] bg-[#5A3720] text-[#FFF7E6] ${
                  result.passed
                    ? "border-t-4 border-t-[#5DAA3A]"
                    : "border-t-4 border-t-[#FFE9A8]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-1 bg-[#422816] border-2 border-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
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
                        <p className="text-xs mt-2 p-2.5 bg-[#422816] border-2 border-[#7A4B2A] font-bold text-[#FFF7E6]">
                          💡 <strong>Hint:</strong> {result.mistakeHint}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 px-3.5 py-2 bg-[#422816] text-[#E5D7BE] hover:text-[#FFF7E6] border-2 border-[#7A4B2A] text-xs font-heading font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Practice Again</span>
                    </button>

                    <Link
                      href={result.nextAction?.href || `/lesson/${conceptId}`}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 px-4 py-2 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] text-xs font-heading font-extrabold shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] no-underline transition-colors"
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
                      <div className="p-4 bg-[#422816] border-2 border-[#5DAA3A] space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-heading font-extrabold text-[#5DAA3A] uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-[#5DAA3A]" />
                            Performance Comparison
                          </span>
                          {result.comparison.improvementDelta !== undefined && (
                            <span
                              className={`px-2 py-0.5 text-xs font-heading font-extrabold border ${
                                result.comparison.improvementDelta > 0
                                  ? "bg-[#5DAA3A] text-[#FFF7E6] border-[#422816]"
                                  : result.comparison.improvementDelta === 0
                                  ? "bg-[#5A3720] text-[#E5D7BE] border-[#7A4B2A]"
                                  : "bg-[#E04A3F] text-[#FFF7E6] border-[#422816]"
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
                          <span className="text-[#E5D7BE]">
                            Previous Attempt:{" "}
                            <strong className="text-[#FFF7E6]">
                              {result.comparison.previousScore} / {result.comparison.previousTotal} ({result.comparison.previousPercentage}%)
                            </strong>
                          </span>
                          <span className="text-[#5DAA3A] font-extrabold">➔</span>
                          <span className="text-[#E5D7BE]">
                            Latest Attempt:{" "}
                            <strong className="text-[#5DAA3A]">
                              {result.comparison.latestScore} / {result.comparison.latestTotal} ({result.comparison.latestPercentage}%)
                            </strong>
                          </span>
                        </div>

                        <p className="text-xs text-[#E5D7BE] leading-snug">
                          {result.comparison.message}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#422816] border-2 border-[#7A4B2A] text-xs text-[#E5D7BE] flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#FFE9A8] shrink-0" />
                        <span>
                          <strong>First Attempt Recorded:</strong> Scored {result.score}/{result.total} ({result.percentage}%). Future attempts will track your growth delta!
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Spaced Revision Indicator */}
                {result.nextRevisionAt && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#E5D7BE] font-medium">
                    <Calendar className="w-4 h-4 text-[#FFE9A8]" />
                    <span>
                      Next scheduled revision:{" "}
                      <strong className="text-[#FFE9A8]">
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
            <div className="mt-4 p-3.5 bg-[#E04A3F]/20 border-2 border-[#E04A3F] text-xs font-bold flex items-center gap-2 text-[#FFF7E6]">
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
                className="bg-[#5A3720] p-6 sm:p-7 border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] space-y-4 text-[#FFF7E6]"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#7A4B2A] pb-3">
                  <span className="text-xs font-heading font-bold text-[#FFE9A8] uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-heading font-bold px-2 py-0.5 border border-[#422816] bg-[#FFE9A8] text-[#2B1B0F]">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-[#5DAA3A] text-[#FFF7E6] px-2 py-0.5 border border-[#422816]">
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#FFF7E6] leading-relaxed flex items-center flex-wrap gap-2">
                      <span>{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
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
                  <div className="mt-4 p-4 bg-[#422816] border-2 border-[#7A4B2A] space-y-3">
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
                              <AlertCircle className="w-4 h-4 text-[#FFE9A8]" />
                              <span className="text-[#FFE9A8]">
                                {feedbackItem.misconceptionCategory
                                  ? `Concept Note: ${feedbackItem.misconceptionCategory.replace(/_/g, " ").toUpperCase()}`
                                  : "Review Method"}
                              </span>
                            </>
                          )}
                        </div>

                        {!feedbackItem.isCorrect && feedbackItem.educationalFeedback && (
                          <div className="p-3 bg-[#5A3720] border border-[#FFE9A8] text-xs text-[#FFF7E6] leading-relaxed">
                            <span className="font-heading font-bold text-[10px] text-[#FFE9A8] uppercase block mb-1">
                              💡 Educational Note:
                            </span>
                            <p>{feedbackItem.educationalFeedback}</p>
                          </div>
                        )}

                        {feedbackItem.explanation && (
                          <div className="p-3 bg-[#422816] border border-[#7A4B2A] text-xs text-[#E5D7BE] leading-relaxed space-y-1">
                            <span className="font-heading font-bold text-[10px] text-[#5DAA3A] uppercase block">
                              Step-by-step Solution:
                            </span>
                            <p>{resolveLocalizedString(feedbackItem.explanation, currentLang).text}</p>
                          </div>
                        )}

                        {feedbackItem.hint && (
                          <p className="text-xs text-[#FFE9A8] pt-1">
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
            <div className="sticky bottom-4 z-30 bg-[#5A3720] border-4 border-[#422816] p-4 shadow-[0px_4px_0px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 text-[#FFF7E6]">
              <span className="text-xs font-heading font-bold text-[#FFE9A8]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50 transition-colors"
              >
                <span>{submitting ? "Checking..." : "Submit Practice Worksheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-4 border-[#422816] py-4 text-center text-xs font-heading text-[#E5D7BE]/70 bg-[#1A1614]">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
