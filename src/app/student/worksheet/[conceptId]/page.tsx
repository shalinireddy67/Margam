"use client";

import React, { useEffect, useState } from "react";
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
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    chosenAnswer: string;
    tag?: string;
    hint?: string;
    mistakeTag?: string;
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

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/");
      return;
    }

    const access = canAccessTopic(conceptId, active, true);
    if (!access.accessible) {
      alert(access.reason || "You cannot access this practice worksheet yet.");
      router.replace("/");
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
          setErrorMessage(err.message || "Network error loading practice questions");
          setLoading(false);
        }
      }
    }

    loadPractice();

    return () => {
      isCancelled = true;
    };
  }, [conceptId, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#7EC8E3]">
        <div className="p-6 border-4 border-[#111111] bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] text-center">
          <p className="font-heading font-extrabold text-sm text-[#111111]">Loading adaptive practice...</p>
        </div>
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
    <div className="min-h-screen bg-[#7EC8E3] flex flex-col justify-between text-[#111111] pb-16">
      <StudentHeader
        profile={profile}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        backHref="/"
        backLabel="Class Lessons"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Title Header Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] mb-6 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
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

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-[#111111] bg-[#F2D16B]/30 p-3.5 border-2 border-[#111111] leading-relaxed font-bold">
            {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {/* Results Summary Box with WitchCat */}
          {result && (
            <div
              className={`mt-6 p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] ${
                result.passed
                  ? "bg-[#5DB84A]/30"
                  : "bg-[#F2D16B]/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-1.5 bg-[#FFFFFF] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                    <WitchCat
                      pose={result.scorePercentage >= 70 || result.passed ? "cheer" : "think"}
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
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Again</span>
                  </button>

                  <Link
                    href={`/lesson/${conceptId}`}
                    className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1.5 px-4 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] no-underline"
                  >
                    <span>Review Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 bg-[#D9453D]/20 border-2 border-[#D9453D] text-xs font-bold flex items-center gap-2">
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
                className="bg-[#FFFFFF] p-6 sm:p-7 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#111111] pb-3">
                  <span className="text-xs font-heading font-bold text-[#111111]/70 uppercase tracking-wider">
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
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#111111] leading-relaxed flex items-center flex-wrap gap-2">
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

                    let optionBorderClass = "border-2 border-[#111111]";
                    let optionBgClass = "bg-[#FFFFFF]";

                    if (result && feedbackItem) {
                      if (isSelected && feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#111111]";
                        optionBgClass = "bg-[#5DB84A]/30";
                      } else if (isSelected && !feedbackItem.isCorrect) {
                        optionBorderClass = "border-2 border-[#111111]";
                        optionBgClass = "bg-[#D9453D]/30";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-2 border-[#111111]";
                      optionBgClass = "bg-[#F2D16B] shadow-[2px_2px_0px_#111111]";
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
                            className={`w-6 h-6 border-2 border-[#111111] font-heading font-bold flex items-center justify-center text-xs shrink-0 ${
                              isSelected
                                ? "bg-[#111111] text-[#FFFFFF]"
                                : "bg-[#FFFFFF] text-[#111111]"
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

                {/* Question Feedback Post-Submission with WitchCat */}
                {feedbackItem && (
                  <div
                    className={`mt-4 p-4 border-2 border-[#111111] text-xs font-bold leading-relaxed space-y-2 ${
                      feedbackItem.isCorrect
                        ? "bg-[#5DB84A]/30"
                        : "bg-[#D9453D]/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        <WitchCat
                          pose={feedbackItem.isCorrect ? "cheer" : "oops"}
                          size={56}
                          sticker={true}
                          alt={
                            feedbackItem.isCorrect
                              ? "Margam Witch Cat cheering correct answer"
                              : "Margam Witch Cat offering mistake hint"
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 font-heading font-extrabold text-xs sm:text-sm">
                          {feedbackItem.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#3C8A2E]" />
                              <span>Correct! Well reasoned.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#D9453D]" />
                              <span>
                                Mistake Hint:{" "}
                                {feedbackItem.tag || feedbackItem.mistakeTag
                                  ? (feedbackItem.tag || feedbackItem.mistakeTag || "").replace(/_/g, " ")
                                  : "Review calculation rule"}
                              </span>
                            </>
                          )}
                        </div>

                        {feedbackItem.hint && (
                          <p className="pt-1 text-[#111111]">
                            <strong>Hint:</strong> <span>{feedbackItem.hint}</span>
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
            <div className="sticky bottom-4 z-30 bg-[#FFFFFF] border-4 border-[#111111] p-4 shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-4">
              <span className="text-xs font-heading font-bold text-[#111111]">
                {Object.keys(answers).length} of {questions.length} Answered
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-3 bg-[#111111] text-[#F2D16B] border-2 border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? "Checking..." : "Submit Practice Worksheet"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
