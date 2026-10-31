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
  TrendingUp,
  TrendingDown,
  Lock,
} from "lucide-react";
import {
  SupportedLanguage,
  LearnerProfile,
  Question,
} from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { canAccessTopic } from "@/lib/progression";
import {
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import {
  selectPracticeQuestions,
  evaluatePracticeSubmission,
  PracticeResult,
} from "@/lib/adaptive";
import StudentHeader from "@/components/StudentHeader";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
  StarRating,
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

export default function AdaptivePracticeRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params?.conceptId as string;

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

      // Allow remediation access if user is practicing a lower-class concept
      const access = canAccessTopic(conceptId, active, true);
      if (!access.accessible) {
        setIsLocked(true);
        setLockedReason(access.reason || "You must complete prerequisite topics before accessing this practice.");
        setLoading(false);
        return;
      }

      setProfile(active);

      // Select adaptive practice questions matching student's per-concept difficulty level
      const practiceData = selectPracticeQuestions(conceptId, 3);
      setQuestions(practiceData.questions);
      setDifficultyLevel(practiceData.targetDifficulty);
      setLoading(false);
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load practice questions.");
      setLoading(false);
    }
  }, [conceptId, router]);

  useEffect(() => {
    initPractice();
  }, [initPractice]);

  // 1. Loading Skeleton State
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] p-4 sm:p-6 pb-safe">
        <OfflineBanner />
        <div className="max-w-3xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading adaptive practice">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Locked State
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE14D] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Practice Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {lockedReason}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Return to Learning Path</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF4F9A] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#FFFFFF] font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#111111]">
              Practice Error
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
              {errorMessage || "We encountered an issue preparing practice questions."}
            </p>
            <div className="pt-2">
              <Button
                variant="yellow"
                size="default"
                onClick={initPractice}
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

  const concept = getConceptById(conceptId);

  // 4. Empty State
  if (!concept || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
        <OfflineBanner />
        <StudentHeader
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          backHref="/"
          backLabel="Back to Lessons"
        />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
          <EmptyState
            title="No Questions Found"
            description="Practice questions for this topic are currently being assembled."
            actionLabel="Return to Learning Path"
            onAction={() => router.push("/")}
          />
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    // Evaluate submission through adaptive engine
    const practiceRes = evaluatePracticeSubmission(conceptId, answers);
    setResult(practiceRes);
    setDifficultyLevel(practiceRes.updatedDifficulty);

    const refreshed = getActiveProfile();
    if (refreshed) setProfile(refreshed);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setErrorMessage(null);

    const practiceData = selectPracticeQuestions(conceptId, 3);
    setQuestions(practiceData.questions);
    setDifficultyLevel(practiceData.targetDifficulty);
  };

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
      <OfflineBanner />

      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Header Card */}
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
              <span>Adaptive Practice</span>
              <span>•</span>
              <span>Class {concept.class}</span>
            </div>

            {/* Difficulty stars with aria-label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE14D] border-[2px] border-[#111111] shadow-[2px_2px_0px_#111111]">
              <span className="text-xs font-heading font-extrabold text-[#111111]">
                Difficulty {difficultyLevel} of 3
              </span>
              <StarRating rating={difficultyLevel} max={3} size="sm" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm font-bold text-[#111111]/80 leading-relaxed">
            Solve these 3 targeted questions to advance your mastery. Your difficulty level automatically adjusts based on your performance.
          </p>

          {/* Result Banner on Submission */}
          {result && (
            <div
              className={`mt-4 p-5 rounded-2xl border-[3px] border-[#111111] shadow-[3px_3px_0px_#111111] ${
                result.scorePercentage >= 70
                  ? "bg-[#8DE86A]/30 text-[#111111]"
                  : "bg-[#FFE14D]/40 text-[#111111]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg flex items-center gap-2">
                    {result.scorePercentage >= 70 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#111111]" />
                        <span>Practice Complete! Mastery Updated to {result.updatedMastery}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-[#111111]" />
                        <span>Practice Attempted • Mastery at {result.updatedMastery}%</span>
                      </>
                    )}
                  </h3>

                  <p className="text-xs font-bold mt-1 text-[#111111]/80">
                    Score: <strong>{result.correctCount} / {result.totalQuestions}</strong> ({result.scorePercentage}%)
                  </p>

                  {/* One line when the level changes */}
                  <div className="mt-3 text-xs font-bold">
                    {result.difficultyChanged === "promoted" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#8DE86A] border-[2px] border-[#111111] text-[#111111] font-heading font-extrabold">
                        <TrendingUp className="w-4 h-4 text-[#111111]" />
                        <span>Promoted to Difficulty Level {result.updatedDifficulty}! Well done on advancing.</span>
                      </div>
                    )}

                    {result.difficultyChanged === "demoted" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF4F9A] border-[2px] border-[#111111] text-[#111111] font-heading font-extrabold">
                        <TrendingDown className="w-4 h-4 text-[#111111]" />
                        <span>Adjusted to Difficulty Level {result.updatedDifficulty} to reinforce core foundations.</span>
                      </div>
                    )}

                    {result.difficultyChanged === "maintained" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border-[2px] border-[#111111] text-[#111111] font-heading font-extrabold">
                        <span>Difficulty maintained at Level {result.updatedDifficulty}.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border-[2px] border-[#111111] text-xs font-heading font-extrabold text-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
                  >
                    <span>Learning Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#FF4F9A]/20 border-[2px] border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#111111]" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Practice Questions List */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = !!answers[q.id];
            const isCorrect = answers[q.id] === q.correctAnswer;
            const promptData = resolveLocalizedString(q.prompt, currentLang);
            const feedbackItem = result?.feedback.find((f) => f.questionId === q.id);

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b-[2px] border-[#111111]/10 pb-3">
                  <span className="text-xs font-heading font-extrabold text-[#111111]/70 uppercase tracking-wider">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#111111] px-2 py-0.5 rounded-full bg-[#FFE14D] border-[2px] border-[#111111]">
                      Level {q.difficulty}
                    </span>
                    <StarRating rating={q.difficulty} max={3} size="sm" />
                  </div>
                </div>

                <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
                  <span>{promptData.text}</span>
                  {promptData.isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                      Draft Translation
                    </span>
                  )}
                </h2>

                {/* Options */}
                <div className="space-y-2.5 pt-1">
                  {q.options?.map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const isCorrectAnswer = q.correctAnswer === opt.id;
                    const optData = resolveLocalizedString(opt.text, currentLang);

                    let optionBorderClass = "border-[#111111] bg-[#FFFFFF] hover:bg-[#FFE14D]/20";

                    if (result) {
                      if (isCorrectAnswer) {
                        optionBorderClass = "border-[#111111] bg-[#8DE86A]/40";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionBorderClass = "border-[#111111] bg-[#FF4F9A]/30";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-[#111111] bg-[#FFE14D] shadow-[2px_2px_0px_#111111]";
                    }

                    return (
                      <div
                        key={opt.id}
                        data-oid={opt.id}
                        tabIndex={0}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Option ${opt.id}: ${optData.text}`}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleSelectOption(q.id, opt.id);
                          }
                        }}
                        className={`min-h-[48px] flex items-center gap-3 p-3.5 rounded-xl border-[2px] cursor-pointer select-none transition-transform active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none ${optionBorderClass}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-heading font-extrabold text-xs flex items-center justify-center shrink-0 border-[2px] border-[#111111] ${
                            isSelected
                              ? "bg-[#111111] text-[#FFFFFF]"
                              : "bg-[#FFFFFF] text-[#111111]"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 text-xs sm:text-sm text-[#111111] font-bold flex items-center flex-wrap gap-2">
                          <span>{optData.text}</span>
                          {optData.isDraft && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Question Feedback Post-Submission with Mistake Creature SVG */}
                {feedbackItem && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-[2px] border-[#111111] text-xs font-bold leading-relaxed space-y-3 ${
                      feedbackItem.isCorrect
                        ? "bg-[#8DE86A]/30 text-[#111111]"
                        : "bg-[#FF4F9A]/20 text-[#111111]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!feedbackItem.isCorrect && (
                        <div className="shrink-0 p-1.5 bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111]">
                          <MistakeCreature
                            type={getMistakeCreatureType(feedbackItem.mistakeTag)}
                            size="sm"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 font-heading font-extrabold text-sm">
                          {feedbackItem.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                              <span>Correct! Well reasoned.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#111111]" />
                              <span>
                                Mistake Hint:{" "}
                                {feedbackItem.mistakeTag
                                  ? feedbackItem.mistakeTag.replace(/_/g, " ")
                                  : "Review calculation rule"}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Explanation */}
                        {(() => {
                          const expData = resolveLocalizedString(q.explanation, currentLang);
                          return (
                            <p className="text-[#111111]/80 pt-1 flex items-center flex-wrap gap-1.5">
                              <strong className="text-[#111111]">Explanation:</strong> <span>{expData.text}</span>
                              {expData.isDraft && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFE14D] text-[#111111] border border-[#111111]">
                                  Draft
                                </span>
                              )}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submission Bar */}
          {!result && (
            <div className="sticky bottom-4 z-30 bg-[#FFF8DC]/95 border-[3px] border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#111111]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 rounded-xl bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Submit Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>

      <footer className="border-t-[3px] border-[#111111] py-4 text-center text-xs font-bold text-[#111111]/70 bg-[#FFFFFF]">
        Margam Adaptive Mathematics • Practice Workspace
      </footer>
    </div>
  );
}
