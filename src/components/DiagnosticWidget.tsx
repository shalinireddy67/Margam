"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen, Compass, Award } from "lucide-react";
import conceptsData from "../../data/concepts.json";
import lessonsData from "../../data/lessons.json";
import { SupportedLanguage } from "@/lib/types";
import { ProgressBar } from "@/components/ui";

interface DiagnosticWidgetProps {
  currentLang?: SupportedLanguage;
}

const sampleQuestions = [
  {
    id: "q-poly-02",
    conceptId: "c9-poly-01",
    prompt: {
      en: "Expand (x + 3)(x - 2)",
      hi: "(x + 3)(x - 2) का प्रसार कीजिए",
      te: "(x + 3)(x - 2) ను విస్తరించండి",
      reviewed: false,
    },
    options: [
      { id: "A", text: { en: "x² + x - 6", hi: "x² + x - 6", te: "x² + x - 6", reviewed: false } },
      { id: "B", text: { en: "x² - x - 6", hi: "x² - x - 6", te: "x² - x - 6", reviewed: false } },
    ],
  },
  {
    id: "q-lin-02",
    conceptId: "c8-lin-01",
    prompt: {
      en: "Solve for x: 2(x - 3) = 8",
      hi: "x के लिए हल करें: 2(x - 3) = 8",
      te: "x కొరకు సాధించండి: 2(x - 3) = 8",
      reviewed: false,
    },
    options: [
      { id: "A", text: { en: "x = 7", hi: "x = 7", te: "x = 7", reviewed: false } },
      { id: "B", text: { en: "x = 4", hi: "x = 4", te: "x = 4", reviewed: false } },
    ],
  },
  {
    id: "q-int-02",
    conceptId: "c7-int-02",
    prompt: {
      en: "Calculate: (-4) × (-5)",
      hi: "गणना करें: (-4) × (-5)",
      te: "లెక్కించండి: (-4) × (-5)",
      reviewed: false,
    },
    options: [
      { id: "A", text: { en: "+20", hi: "+20", te: "+20", reviewed: false } },
      { id: "B", text: { en: "-20", hi: "-20", te: "-20", reviewed: false } },
    ],
  },
];

export default function DiagnosticWidget({ currentLang = "en" }: DiagnosticWidgetProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showLessonPreview, setShowLessonPreview] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<"basics_first" | "standard" | "fast_track">(
    "basics_first"
  );

  const currentQuestions = sampleQuestions;

  const activeQ = currentQuestions[currentStep];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < currentQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setSubmitted(false);
    setShowLessonPreview(false);
  };

  const rootLesson = lessonsData.find((l) => l.conceptId === "c7-int-02");

  const t = {
    en: {
      badge: "Interactive Diagnostic",
      headline: "Try 3 Questions to Trace Your Path",
      subhead:
        "Answer 3 quick math questions from Class 9 down to Class 7. Margam checks your answers and pinpoints where you need a quick boost.",
      stepLabel: `Question ${currentStep + 1} of ${currentQuestions.length}`,
      nextBtn: "Next Question",
      finishBtn: "See My Result",
      restartBtn: "Try Again",
      resultTitle: "Diagnostic Complete",
      resultScore: "1 of 3 Correct",
      gapFoundLabel: "Diagnosed Prerequisite Gap:",
      gapFoundTitle: "Class 7 Integer Subtraction & Sign Rules",
      gapRationale:
        "You understand polynomial terms, but sign flips like (-3) × (+2) = -6 cause small errors that cascade through quadratic factoring.",
      lessonPreviewBtn: "Preview 3 Lesson Styles",
      hideLessonBtn: "Hide Lesson Styles",
    },
    hi: {
      badge: "इंटरैक्टिव डायग्नोस्टिक",
      headline: "3 प्रश्नों से समझें अपनी सीखने की राह",
      subhead:
        "कक्षा 9 से कक्षा 7 तक के 3 त्वरित प्रश्नों के उत्तर दें। मार्गम् बताएगा कि आपको कहाँ थोड़ी और मदद चाहिए।",
      stepLabel: `प्रश्न ${currentStep + 1} / ${currentQuestions.length}`,
      nextBtn: "अगला प्रश्न",
      finishBtn: "परिणाम देखें",
      restartBtn: "पुनः प्रयास करें",
      resultTitle: "जाँच पूरी हुई",
      resultScore: "3 में से 1 सही",
      gapFoundLabel: "पहचाना गया मूल अंतर:",
      gapFoundTitle: "कक्षा 7 पूर्णांक व्यवकलन और चिह्न नियम",
      gapRationale:
        "आप बहुपद समझते हैं, परंतु (-3) × (+2) = -6 जैसे चिह्न नियमों की छोटी गलतियाँ बड़े प्रश्नों में बाधा बनती हैं।",
      lessonPreviewBtn: "3 शिक्षण शैलियाँ देखें",
      hideLessonBtn: "पाठ छिपाएँ",
    },
    te: {
      badge: "డయాగ్నోస్టిక్ సాధన",
      headline: "3 ప్రశ్నలతో మీ అభ్యాస మార్గాన్ని తెలుసుకోండి",
      subhead:
        "9వ తరగతి నుండి 7వ తరగతి వరకు 3 చిన్న ప్రశ్నలకు సమాధానం ఇవ్వండి. మీకు ఎక్కడ సహాయం కావాలో మార్గం ఖచ్చితంగా చూపుతుంది.",
      stepLabel: `ప్రశ్న ${currentStep + 1} / ${currentQuestions.length}`,
      nextBtn: "తదుపరి ప్రశ్న",
      finishBtn: "ఫలితం చూడండి",
      restartBtn: "మళ్ళీ ప్రయత్నించండి",
      resultTitle: "పరిశీలన పూర్తయింది",
      resultScore: "3 లో 1 సరైనది",
      gapFoundLabel: "గుర్తించిన పునాది లోపం:",
      gapFoundTitle: "7వ తరగతి పూర్ణ సంఖ్యల వ్యవకలనం మరియు సంకేతాలు",
      gapRationale:
        "మీకు కాన్సెప్ట్ అర్థమవుతోంది, కానీ (-3) × (+2) = -6 వంటి సంకేతాల నియమాలలో చిన్న తప్పులు జరుగుతున్నాయి.",
      lessonPreviewBtn: "3 బోధనా రీతులను చూడండి",
      hideLessonBtn: "వివరణను దాచండి",
    },
  }[currentLang];

  return (
    <section id="try-diagnostic" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-light text-coral border border-coral-border text-xs sm:text-sm font-heading font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* Main Diagnostic Card Canvas */}
      <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-[#E0E5D4] shadow-card max-w-3xl mx-auto">
        {!submitted && activeQ ? (
          <div className="space-y-6">
            {/* Step Progress Bar & Indicator */}
            {(() => {
              const activeConcept = conceptsData.find((c) => c.id === activeQ.conceptId);
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-coral uppercase tracking-wider">{t.stepLabel}</span>
                    <span className="text-muted-foreground">
                      Class {activeConcept?.class || 9} • {activeConcept?.chapter || "Mathematics"}
                    </span>
                  </div>
                  <ProgressBar
                    value={currentStep + 1}
                    max={currentQuestions.length}
                    segments={currentQuestions.length}
                    color="grass"
                  />
                </div>
              );
            })()}

            {/* Question Text */}
            <div className="py-2">
              <h3 className="font-heading text-lg sm:text-2xl font-bold text-foreground leading-snug">
                {activeQ.prompt[currentLang]}
              </h3>
            </div>

            {/* Options List with Min 48px Touch Targets */}
            <div className="space-y-3">
              {activeQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentStep] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full min-h-[52px] p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-coral bg-coral-light text-foreground shadow-xs font-bold"
                        : "border-[#E0E5D4] bg-background/50 hover:bg-background text-foreground/90 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isSelected ? "bg-coral text-white" : "bg-white border border-[#E0E5D4] text-muted-foreground"
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="text-sm sm:text-base font-sans">{opt.text[currentLang]}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-coral shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#E0E5D4] flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-mono">
                {selectedAnswers[currentStep] ? "Option selected" : "Select an answer above"}
              </div>

              <button
                type="button"
                disabled={!selectedAnswers[currentStep]}
                onClick={handleNext}
                className={`min-h-[48px] px-6 rounded-2xl text-sm font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  selectedAnswers[currentStep]
                    ? "bg-coral hover:bg-coral-hover text-white shadow-soft"
                    : "bg-background text-muted-foreground border border-[#E0E5D4] cursor-not-allowed opacity-60"
                }`}
              >
                <span>{currentStep === currentQuestions.length - 1 ? t.finishBtn : t.nextBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result & Root Gap Analysis Card */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0E5D4] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sage-light text-sage flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    {t.resultTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">{t.resultScore}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background border border-[#E0E5D4] text-xs font-heading font-bold text-foreground hover:bg-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.restartBtn}</span>
              </button>
            </div>

            {/* Root Gap Diagnostic Callout */}
            <div className="bg-[#F9F7E8] rounded-3xl p-6 border-2 border-coral-border space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-coral">
                {t.gapFoundLabel}
              </span>
              <h4 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                {t.gapFoundTitle}
              </h4>
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-sans">
                {t.gapRationale}
              </p>
            </div>

            {/* Lesson Styles Preview Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowLessonPreview(!showLessonPreview)}
                className="w-full min-h-[48px] px-5 rounded-2xl bg-background hover:bg-white border border-[#E0E5D4] text-xs sm:text-sm font-heading font-bold text-foreground flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-coral" />
                <span>{showLessonPreview ? t.hideLessonBtn : t.lessonPreviewBtn}</span>
              </button>

              {showLessonPreview && rootLesson && (
                <div className="mt-4 p-5 rounded-2xl bg-background border border-[#E0E5D4] space-y-4">
                  {/* Variant Switcher Pills */}
                  <div className="flex flex-wrap gap-2 text-xs font-heading font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("basics_first")}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        selectedVariant === "basics_first"
                          ? "bg-coral text-white"
                          : "bg-white text-muted-foreground border border-[#E0E5D4]"
                      }`}
                    >
                      Basics-First (Kirana Model)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("standard")}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        selectedVariant === "standard"
                          ? "bg-coral text-white"
                          : "bg-white text-muted-foreground border border-[#E0E5D4]"
                      }`}
                    >
                      Standard (NCERT Formal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("fast_track")}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        selectedVariant === "fast_track"
                          ? "bg-coral text-white"
                          : "bg-white text-muted-foreground border border-[#E0E5D4]"
                      }`}
                    >
                      Fast-Track (Shortcut)
                    </button>
                  </div>

                  {/* Headline & Explanation */}
                  <div className="space-y-1.5">
                    <h5 className="font-heading font-bold text-base text-foreground">
                      {rootLesson[selectedVariant].headline[currentLang]}
                    </h5>
                    <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                      {rootLesson[selectedVariant].explanation[currentLang]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
