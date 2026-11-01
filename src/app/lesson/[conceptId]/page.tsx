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
import { WitchCat } from "@/components/ui/WitchCat";

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
      <div className="min-h-screen flex items-center justify-center bg-[#7EC8E3]">
        <div className="p-6 border-4 border-[#111111] bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] text-center">
          <p className="font-heading font-extrabold text-sm text-[#111111]">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const concept = getConceptById(conceptId);
  const lesson = getLessonByConceptId(conceptId);

  if (!concept || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#7EC8E3] p-4">
        <div className="bg-[#FFFFFF] p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] max-w-sm text-center space-y-3">
          <h2 className="font-heading font-extrabold text-base text-[#111111]">Lesson Not Found</h2>
          <p className="text-xs font-bold text-[#111111]/70">This lesson content is not yet available.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[#111111] bg-[#F2D16B] text-[#111111] text-xs font-heading font-bold shadow-[2px_2px_0px_#111111]"
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
    <div className="min-h-screen bg-[#7EC8E3] flex flex-col justify-between text-[#111111] font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#7EC8E3] border-b-4 border-[#111111]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 text-xs sm:text-sm font-heading font-extrabold text-[#111111] py-2 px-3 border-2 border-[#111111] bg-[#FFFFFF] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lessons</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
            <button
              type="button"
              onClick={() => setCurrentLang("en")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "en" ? "bg-[#F2D16B] border-[#111111] text-[#111111]" : "border-transparent text-[#111111]/70"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("hi")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "hi" ? "bg-[#F2D16B] border-[#111111] text-[#111111]" : "border-transparent text-[#111111]/70"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang("te")}
              className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 py-1 text-xs font-heading font-bold border-2 transition-all ${
                currentLang === "te" ? "bg-[#F2D16B] border-[#111111] text-[#111111]" : "border-transparent text-[#111111]/70"
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
          <div className="p-4 sm:p-5 bg-[#F2D16B] border-4 border-[#111111] shadow-[4px_4px_0px_#111111] text-[#111111] space-y-2">
            <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider">
              <GitBranch className="w-4 h-4 text-[#111111]" />
              <span>Diagnostic Remediation Route</span>
            </div>
            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              {variantReason}
            </p>
          </div>
        )}

        {/* Lesson Header Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111]/70">
              <span>Class {concept.class}</span>
              <span>•</span>
              <span>Topic {concept.id}</span>
            </div>

            {/* Pedagogical Variant Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading font-extrabold border-2 border-[#111111] shadow-[2px_2px_0px_#111111] ${
                variantKey === "basics_first"
                  ? "bg-[#D9453D] text-[#FFFFFF]"
                  : variantKey === "fast_track"
                  ? "bg-[#5DB84A] text-[#111111]"
                  : "bg-[#F2D16B] text-[#111111]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Variant: {variantKey === "basics_first" ? "Basics-First" : variantKey === "fast_track" ? "Fast-Track" : "Standard"}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#111111] tracking-tight">
            {concept.name[currentLang] || concept.name.en}
          </h1>

          <p className="text-xs sm:text-sm text-[#111111] bg-[#F2D16B]/30 p-3.5 border-2 border-[#111111] leading-relaxed font-bold">
            <strong>Goal:</strong> {concept.learningObjective[currentLang] || concept.learningObjective.en}
          </p>

          {!fromGap && (
            <p className="text-xs text-[#111111]/80 italic pt-1 font-bold">
              {variantReason}
            </p>
          )}
        </div>

        {/* Lesson Body Content with Witch Cat Companion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Conceptual Explanation */}
          <div className="md:col-span-8 space-y-6">
            {/* Core Explanation Card */}
            <div className="bg-[#FFFFFF] p-6 sm:p-7 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="shrink-0 p-2.5 bg-[#F2D16B] border-4 border-[#111111] shadow-[3px_3px_0px_#111111]">
                  <WitchCat
                    pose="read"
                    size={88}
                    sticker={false}
                    alt="Margam Witch Cat reading the maths lesson"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#111111]/70">
                    <BookOpen className="w-4 h-4 text-[#111111]" />
                    <span>Core Concept</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#111111] flex items-center flex-wrap gap-2">
                    <span>{headlineData.text}</span>
                    {headlineData.isDraft && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#F2D16B] text-[#111111] border border-[#111111]">
                        Draft
                      </span>
                    )}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed whitespace-pre-line font-medium">
                    {explanationData.text}
                  </p>

                  {activeVariant.visualAnalogy && (
                    <div className="p-3 bg-[#F2D16B]/30 border-2 border-[#111111] text-xs text-[#111111] font-bold">
                      <strong>Intuition:</strong> {resolveLocalizedString(activeVariant.visualAnalogy, currentLang).text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Worked Example Card */}
            <div className="bg-[#FFFFFF] p-6 sm:p-7 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-[#111111]/70">
                <Sparkles className="w-4 h-4 text-[#111111]" />
                <span>Step-by-Step Example</span>
              </div>

              <div className="p-4 bg-[#F2D16B]/20 border-2 border-[#111111] space-y-1">
                <p className="text-xs font-heading font-bold text-[#111111]/70 uppercase tracking-wider">Problem</p>
                <p className="text-xs sm:text-sm font-bold text-[#111111]">{workedProblem.text}</p>
              </div>

              <div className="p-4 bg-[#5DB84A]/20 border-2 border-[#111111] space-y-1">
                <p className="text-xs font-heading font-bold text-[#3C8A2E] uppercase tracking-wider">Solution</p>
                <p className="text-xs sm:text-sm text-[#111111] font-bold whitespace-pre-line leading-relaxed">
                  {workedSolution.text}
                </p>
              </div>
            </div>
          </div>

          {/* Side Column: Witch Cat Companion */}
          <div className="md:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#FFFFFF] p-4 sm:p-5 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-center text-center">
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
          <div className="bg-[#FFFFFF] p-6 sm:p-8 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-6">
            <div className="flex items-center justify-between gap-3 border-b-2 border-[#111111] pb-4 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#111111]">
                  Check Your Understanding
                </h2>
                <p className="text-xs font-bold text-[#111111]/70 mt-0.5">
                  Try this quick problem to verify concept mastery.
                </p>
              </div>

              {worksheetResult && (
                <button
                  onClick={handleRetryPractice}
                  className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-1 px-3 py-1.5 border-2 border-[#111111] bg-[#FFFFFF] shadow-[2px_2px_0px_#111111] text-xs font-heading font-bold text-[#111111] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-[#D9453D]/20 border-2 border-[#D9453D] text-xs font-bold text-[#111111] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D9453D] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPractice} className="space-y-6">
              {practiceQuestions.map((q, idx) => {
                const feedbackItem = worksheetResult?.feedback.find((f) => f.questionId === q.id);
                const qPrompt = resolveLocalizedString(q.prompt, currentLang);

                return (
                  <div key={q.id} className="space-y-3 pt-2">
                    <p className="text-xs font-heading font-bold text-[#111111]/70 uppercase tracking-wider">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm font-bold text-[#111111] leading-relaxed">
                      {qPrompt.text}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options?.map((opt: any) => {
                        const isSelected = answers[q.id] === opt.id;
                        const optText = resolveLocalizedString(opt.text, currentLang);

                        let borderClass = "border-2 border-[#111111]";
                        let bgClass = "bg-[#FFFFFF]";

                        if (worksheetResult && feedbackItem) {
                          if (isSelected && feedbackItem.isCorrect) {
                            borderClass = "border-2 border-[#111111]";
                            bgClass = "bg-[#5DB84A]/30";
                          } else if (isSelected && !feedbackItem.isCorrect) {
                            borderClass = "border-2 border-[#111111]";
                            bgClass = "bg-[#D9453D]/30";
                          }
                        } else if (isSelected) {
                          borderClass = "border-2 border-[#111111]";
                          bgClass = "bg-[#F2D16B] shadow-[2px_2px_0px_#111111]";
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`min-h-[48px] flex items-start gap-3 p-3 border-2 cursor-pointer transition-transform active:translate-x-[1px] active:translate-y-[1px] ${borderClass} ${bgClass}`}
                          >
                            <span
                              className={`w-6 h-6 border-2 border-[#111111] text-xs font-heading font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-[#111111] text-[#FFFFFF]"
                                  : "bg-[#FFFFFF] text-[#111111]"
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm text-[#111111] font-bold">
                              {optText.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Needs Review Feedback and Mistake Hint */}
                    {feedbackItem && !feedbackItem.isCorrect && (
                      <div className="p-3.5 bg-[#D9453D]/10 border-2 border-[#111111] text-xs text-[#111111] space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 pt-0.5">
                            <WitchCat
                              pose="oops"
                              size={56}
                              sticker={true}
                              alt="Margam Witch Cat offering mistake hint"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <p className="font-heading font-bold text-[#D9453D] flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-[#D9453D] shrink-0" />
                              <span>Needs Review: {feedbackItem.mistakeDescription || "Incorrect Choice"}</span>
                            </p>
                            {feedbackItem.hint && (
                              <div className="p-2.5 bg-[#F2D16B]/40 border border-[#111111] text-[#111111] font-bold">
                                <span className="font-heading">💡 Hint: </span>
                                <span>{feedbackItem.hint}</span>
                              </div>
                            )}
                            {feedbackItem.explanation && (
                              <p className="text-[#111111] font-medium">
                                <strong className="font-heading">Explanation: </strong>
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
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 bg-[#111111] text-[#F2D16B] border-2 border-[#111111] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  <span>Submit Practice Answers</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* Completion Footer */}
        <div className="bg-[#FFFFFF] p-6 border-4 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isCompleted && (
              <div className="shrink-0">
                <WitchCat
                  pose="cheer"
                  size={64}
                  sticker={true}
                  alt="Margam Witch Cat celebrating lesson completion"
                />
              </div>
            )}
            <div>
              {isCompleted ? (
                <div className="flex items-center gap-2 text-[#3C8A2E] font-heading font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#5DB84A]" />
                  <span>Lesson Completed • Next Lesson Unlocked</span>
                </div>
              ) : (
                <p className="text-xs font-bold text-[#111111]/70">
                  Read through the explanation and example, or submit the practice question above to complete.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted && (
              <button
                onClick={handleFinishLesson}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-5 py-2.5 bg-[#5DB84A] text-[#111111] border-2 border-[#111111] font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 px-5 py-2.5 bg-[#111111] text-[#FFFFFF] border-2 border-[#111111] font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] no-underline"
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
        <div className="min-h-screen flex items-center justify-center bg-[#7EC8E3]">
          <div className="p-6 border-4 border-[#111111] bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] text-center">
            <p className="font-heading font-extrabold text-sm text-[#111111]">Loading...</p>
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
