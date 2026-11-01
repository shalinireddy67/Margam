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
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
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
  MistakeCreature,
  MistakeCreatureType,
} from "@/components/ui";

function getMistakeCreatureType(tag?: string): MistakeCreatureType {
  if (!tag) return "calculation_slip";
  const t = tag.toLowerCase();
  if (t.includes("sign") || t.includes("negative") || t.includes("minus") || t.includes("inverse") || t.includes("root")) {
    return "sign_slip";
  }
  if (t.includes("fraction") || t.includes("denom") || t.includes("numerator") || t.includes("divide")) {
    return "fraction_fumble";
  }
  if (t.includes("distribut") || t.includes("bracket") || t.includes("expand") || t.includes("parenthes") || t.includes("identity")) {
    return "distribution_dodge";
  }
  return "calculation_slip";
}

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
              count: 3,
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
      <div className="min-h-screen bg-[#7EC8E3] text-[#111111] p-4 sm:p-6 pb-28">
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
      <div className="min-h-screen bg-[#7EC8E3] text-[#111111] flex flex-col justify-between pb-16">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-4 border-[#111111] p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 bg-[#F2D16B] border-2 border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Practice Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {lockedReason || "You must complete prerequisite topics before accessing this practice."}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
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
      <div className="min-h-screen flex items-center justify-center bg-[#7EC8E3] p-6">
        <div className="bg-[#FFFFFF] p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] max-w-md text-center space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-[#111111]">No Questions Found</h2>
          <p className="text-xs font-bold text-[#111111]/70">
            Practice questions for this topic are currently being prepared.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-[#111111] bg-[#F2D16B] text-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111]"
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
      <span className="inline-flex items-center text-[#111111] font-bold tracking-wider">
        {"★".repeat(level)}
        <span className="text-[#111111]/30">{"★".repeat(3 - level)}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#102610] minecraft-grid-bg flex flex-col justify-between text-[#F2F0DF] pb-24">
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
        <div className="bg-[#173B19] p-6 sm:p-8 border-3 border-[#4F8A24] border-t-[6px] border-t-[#79B82A] shadow-[6px_6px_0px_#102610] space-y-4 text-[#F2F0DF]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#79B82A]">
              <span>Adaptive Practice</span>
              <span>•</span>
              <span>Class {concept.class}</span>
            </div>

            {/* Difficulty Badge with 1 to 3 stars */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2D16B] border-2 border-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111]">
              <span>Level {difficultyLevel}</span>
              {renderStars(difficultyLevel)}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#F2F0DF] tracking-wide drop-shadow-[2px_2px_0px_#102610]">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-[#D8D8D0] bg-[#102610] p-3.5 border-2 border-[#315B2A] leading-relaxed font-medium">
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Results Summary Box with WitchCat & Progression */}
          {result && (
            <div className="space-y-4 mt-6">
              {result.gapResolved && (
                <div className="p-5 bg-[#173B19] border-3 border-[#E5B834] border-l-[8px] border-l-[#E5B834] shadow-[6px_6px_0px_#102610] space-y-2">
                  <div className="flex items-center gap-2 text-[#E5B834] font-heading font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#E5B834]" />
                    <span>Foundational Prerequisite Gap Resolved!</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#F2F0DF]">
                    Foundation Successfully Repaired!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D8D8D0] leading-relaxed">
                    You scored <strong>{result.percentage}%</strong> and demonstrated mastery on this foundational topic. This concept is now marked as resolved in your learner profile!
                  </p>
                </div>
              )}
            <div
              className={`p-6 border-3 shadow-[6px_6px_0px_#102610] ${
                result.passed
                  ? "bg-[#173B19] border-[#79B82A] text-[#F2F0DF]"
                  : "bg-[#173B19] border-[#E5B834] text-[#F2F0DF]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-1 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610]">
                    <WitchCat
                      pose={result.percentage >= 70 || result.passed ? "cheer" : "think"}
                      size={72}
                      sticker={true}
                      alt="Margam Witch Cat reviewing practice results"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base sm:text-lg flex items-center gap-2">
                      {result.passed ? (
                        <>
                          <Award className="w-5 h-5 text-[#3C8A2E]" />
                          <span>Practice Complete! Mastery Updated</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-[#D9453D]" />
                          <span>Practice Attempted • Review Recommended</span>
                        </>
                      )}
                    </h3>
                    <p className="text-xs font-bold mt-1">
                      Score: <strong>{result.score} / {result.total}</strong> ({result.percentage}%) • Mastery: <strong>{result.mastery}%</strong>
                      {result.passed
                        ? " • Next level unlocked!"
                        : " • Keep practicing to build confidence."}
                    </p>
                    {result.mistakeHint && (
                      <p className="text-xs mt-2 p-2.5 bg-[#FFFFFF] border-2 border-[#111111] font-bold">
                        💡 <strong>Hint:</strong> {result.mistakeHint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 px-3.5 py-2 bg-[#102610] text-[#D8D8D0] hover:text-[#F2F0DF] border-2 border-[#315B2A] text-xs font-heading font-bold shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Again</span>
                  </button>

                  <Link
                    href={`/lesson/${conceptId}`}
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 px-4 py-2 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] border-2 border-[#102610] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] no-underline transition-colors"
                  >
                    <span>Review Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-[#D9453D]/20 border-2 border-[#D9453D] text-xs font-bold flex items-center gap-2 text-[#F2F0DF]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D9453D]" />
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
                className="bg-[#173B19] p-6 sm:p-7 border-3 border-[#315B2A] shadow-[4px_4px_0px_#102610] space-y-4 text-[#F2F0DF]"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#315B2A] pb-3">
                  <span className="text-xs font-heading font-bold text-[#79B82A] uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-heading font-bold px-2 py-0.5 border border-[#111111] bg-[#F2D16B]">
                      Level {q.difficulty}
                    </span>
                    {isAnswered && !result && (
                      <span className="text-[10px] font-heading font-bold bg-[#5DB84A] text-[#111111] px-2 py-0.5 border border-[#111111]">
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {(() => {
                  const promptData = resolveLocalizedString(q.prompt, currentLang);
                  return (
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#F2F0DF] leading-relaxed flex items-center flex-wrap gap-2">
                      <span>{promptData.text}</span>
                      {promptData.isDraft && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-[#F2D16B] border border-[#111111]">
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

                    let optionBorderClass = "border-2 border-[#315B2A]";
                    let optionBgClass = "bg-[#102610] text-[#D8D8D0] hover:border-[#79B82A] hover:bg-[#315B2A]/40";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#79B82A]";
                        optionBgClass = "bg-[#4F8A24] text-[#F2F0DF]";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#D9453D]";
                        optionBgClass = "bg-[#8B2323] text-[#F2F0DF]";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-2 border-[#79B82A]";
                      optionBgClass = "bg-[#4F8A24] text-[#F2F0DF] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_#102610]";
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
                            className={`w-6 h-6 border-2 border-[#102610] font-heading font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-[#79B82A] text-[#102610]"
                                : "bg-[#173B19] text-[#79B82A]"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#111111] leading-snug">{optData.text}</span>
                        </div>
                        {result && feedbackItem && isSelected && (
                          feedbackItem.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-[#3C8A2E] shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#D9453D] shrink-0" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Question Feedback Post-Submission with WitchCat & Educational Guidance */}
                {feedbackItem && (
                  <div className="mt-4 p-4 bg-[#102610] border-2 border-[#315B2A] space-y-3">
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
                              <CheckCircle2 className="w-4 h-4 text-[#79B82A]" />
                              <span className="text-[#79B82A]">Correct! Solid understanding demonstrated.</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-[#E5B834]" />
                              <span className="text-[#E5B834]">
                                {feedbackItem.misconceptionCategory
                                  ? `Concept Note: ${feedbackItem.misconceptionCategory.replace(/_/g, " ").toUpperCase()}`
                                  : "Review Method"}
                              </span>
                            </>
                          )}
                        </div>

                        {!feedbackItem.isCorrect && feedbackItem.educationalFeedback && (
                          <div className="p-3 bg-[#173B19] border border-[#E5B834] text-xs text-[#F2F0DF] leading-relaxed">
                            <span className="font-heading font-bold text-[10px] text-[#E5B834] uppercase block mb-1">
                              💡 Educational Note:
                            </span>
                            <p>{feedbackItem.educationalFeedback}</p>
                          </div>
                        )}

                        {feedbackItem.explanation && (
                          <div className="p-3 bg-[#102610] border border-[#315B2A] text-xs text-[#D8D8D0] leading-relaxed space-y-1">
                            <span className="font-heading font-bold text-[10px] text-[#79B82A] uppercase block">
                              Step-by-step Solution:
                            </span>
                            <p>{resolveLocalizedString(feedbackItem.explanation, currentLang).text}</p>
                          </div>
                        )}

                        {feedbackItem.hint && (
                          <p className="text-xs text-[#79B82A] pt-1">
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
            <div className="sticky bottom-4 z-30 bg-[#173B19] border-3 border-[#315B2A] p-4 shadow-[0px_4px_0px_#102610] flex items-center justify-between gap-4 text-[#F2F0DF]">
              <span className="text-xs font-heading font-bold text-[#79B82A]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[46px] gap-2 px-5 py-2.5 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] border-2 border-[#102610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50 transition-colors"
              >
                <span>{submitting ? "Checking..." : "Submit Practice Worksheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-3 border-[#315B2A] py-4 text-center text-xs font-heading text-[#D8D8D0]/60 bg-[#0F2610]">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
