"use client";

import React, { useState } from "react";
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles, BookOpen, Award } from "lucide-react";
import conceptsData from "../../data/concepts.json";
import lessonsData from "../../data/lessons.json";
import { SupportedLanguage } from "@/lib/types";
import { ProgressBar, Button } from "@/components/ui";

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
      headline: "Try 3 questions to trace your path",
      subhead:
        "Answer 3 quick maths questions from Class 9 down to Class 7. Margam checks your answers and finds any topic you missed.",
      stepLabel: `Question ${currentStep + 1} of ${currentQuestions.length}`,
      nextBtn: "Next question",
      finishBtn: "View Diagnostic Map",
      restartBtn: "Restart Diagnostic",
      resultTitle: "Diagnostic Assessment Complete",
      resultScore: "1 of 3 Correct",
      gapFoundLabel: "Identified Prerequisite Learning Gap:",
      gapFoundTitle: "Class 7 Integer Multiplication & Sign Rules",
      gapRationale:
        "You understand polynomial expansion, but careless sign inversion rules like (-3) × (+2) = -6 prevent correct solutions in advanced algebra.",
      lessonPreviewBtn: "Preview 3 Teaching Variations",
      hideLessonBtn: "Hide Teaching Variations",
    },
    hi: {
      badge: "सक्रिय जाँच",
      headline: "3 प्रश्नों से अपना स्तर जानें",
      subhead:
        "कक्षा 9 से कक्षा 7 तक के 3 सरल प्रश्नों के उत्तर दें। मार्गम आपके उत्तरों का विश्लेषण कर वास्तविक अंतर ढूँढता है।",
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#422816] border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] text-xs font-heading font-bold text-[#FFE9A8]">
          <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
          <span>{t.badge}</span>
        </div>
        <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-[#FFE9A8] tracking-tight drop-shadow-[2px_2px_0px_#2B1B0F]">
          {t.headline}
        </h2>
        <p className="text-[#FFF7E6]/90 text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      {/* Main Diagnostic Card Canvas - Blocky Voxel Panel */}
      <div className="bg-[#7A4B2A] border-4 border-[#422816] rounded-[2px] p-6 sm:p-10 shadow-[inset_2px_2px_0px_rgba(255,255,255,0.25),inset_-2px_-2px_0px_rgba(0,0,0,0.4),6px_6px_0px_rgba(0,0,0,0.35)] max-w-3xl mx-auto">
        {!submitted && activeQ ? (
          <div className="space-y-6">
            {/* Step Progress Bar & Indicator */}
            {(() => {
              const activeConcept = conceptsData.find((c) => c.id === activeQ.conceptId);
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-heading font-bold">
                    <span className="text-[#FFE9A8] uppercase tracking-wider">{t.stepLabel}</span>
                    <span className="text-[#FFF7E6]/80 text-[11px]">
                      Class {activeConcept?.class || 9}, {activeConcept?.chapter || "Mathematics"}
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

            {/* Question Text inside Light Block Tile */}
            <div className="p-4 sm:p-6 bg-[#FFF7E6] border-4 border-[#5A3720] rounded-[2px] shadow-[inset_2px_2px_0px_#FFFFFF,3px_3px_0px_rgba(0,0,0,0.35)]">
              <span className="inline-block text-[10px] font-heading font-bold text-[#7A4B2A] uppercase mb-1">
                Question {currentStep + 1}
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-bold text-[#2B1B0F] leading-snug">
                {activeQ.prompt[currentLang]}
              </h3>
            </div>

            {/* Options List with Min 48px Touch Targets & Water-Blue Selection */}
            <div className="space-y-3">
              {activeQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentStep] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full min-h-[54px] p-4 rounded-[2px] border-4 text-left flex items-center justify-between transition-transform active:translate-x-[2px] active:translate-y-[2px] cursor-pointer ${
                      isSelected
                        ? "border-[#3FA7C9] bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_2px_2px_0px_#FFFFFF,4px_4px_0px_rgba(0,0,0,0.35)] font-bold ring-2 ring-[#3FA7C9]"
                        : "border-[#5A3720] bg-[#FFF7E6] hover:bg-[#FFE9D6] text-[#2B1B0F] shadow-[4px_4px_0px_rgba(0,0,0,0.35)] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-[2px] flex items-center justify-center text-xs font-heading font-bold shrink-0 border-2 ${
                          isSelected
                            ? "bg-[#3FA7C9] text-[#FFF7E6] border-[#1E6F8C]"
                            : "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]"
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="text-base sm:text-lg font-sans font-bold">{opt.text[currentLang]}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#1E6F8C] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t-2 border-[#5A3720] flex items-center justify-between">
              <div className="text-xs text-[#FFF7E6]/75 font-mono">
                {selectedAnswers[currentStep] ? "✓ Option selected" : "Select an answer tile above"}
              </div>

              <button
                type="button"
                disabled={!selectedAnswers[currentStep]}
                onClick={handleNext}
                className={`min-h-[48px] px-6 rounded-[2px] text-xs sm:text-sm font-heading font-bold flex items-center gap-2 transition-all select-none ${
                  selectedAnswers[currentStep]
                    ? "voxel-btn-primary cursor-pointer"
                    : "bg-[#5E5E5E] text-[#D9D9D9] border-3 border-[#3F3F3F] cursor-not-allowed opacity-60"
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
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5A3720] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[2px] bg-[#5DAA3A] border-3 border-[#2F6B22] text-[#FFF7E6] flex items-center justify-center font-bold shadow-[inset_1px_1px_0px_rgba(255,255,255,0.5)]">
                  <Award className="w-6 h-6 text-[#FFE9A8]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#FFE9A8] drop-shadow-[1px_1px_0px_#2B1B0F]">
                    {t.resultTitle}
                  </h3>
                  <p className="text-xs text-[#FFF7E6]/80 font-mono">{t.resultScore}</p>
                </div>
              </div>

              <Button
                variant="dirt"
                size="sm"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.restartBtn}</span>
              </Button>
            </div>

            {/* Root Gap Diagnostic Callout (Cracked / Highlight Block) */}
            <div className="bg-[#FFF7E6] rounded-[2px] p-6 border-4 border-[#E04A3F] shadow-[inset_2px_2px_0px_#FFFFFF,4px_4px_0px_rgba(0,0,0,0.35)] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#E04A3F] border border-[#2B1B0F]" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#E04A3F]">
                  {t.gapFoundLabel}
                </span>
              </div>
              <h4 className="font-heading text-base sm:text-xl font-bold text-[#2B1B0F]">
                {t.gapFoundTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[#2B1B0F]/90 leading-relaxed font-sans font-medium">
                {t.gapRationale}
              </p>
            </div>

            {/* Lesson Styles Preview Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowLessonPreview(!showLessonPreview)}
                className="w-full min-h-[48px] px-5 rounded-[2px] voxel-btn-secondary text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#FFE9A8]" />
                <span>{showLessonPreview ? t.hideLessonBtn : t.lessonPreviewBtn}</span>
              </button>

              {showLessonPreview && rootLesson && (
                <div className="mt-4 p-5 rounded-[2px] bg-[#FFF7E6] border-4 border-[#5A3720] shadow-[inset_2px_2px_0px_#FFFFFF,4px_4px_0px_rgba(0,0,0,0.35)] space-y-4 text-[#2B1B0F]">
                  {/* Variant Switcher Pills */}
                  <div className="flex flex-wrap gap-2 text-xs font-heading font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("basics_first")}
                      className={`px-3 py-2 rounded-[2px] border-2 transition-all cursor-pointer ${
                        selectedVariant === "basics_first"
                          ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                          : "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]"
                      }`}
                    >
                      Basics-First (Kirana Model)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("standard")}
                      className={`px-3 py-2 rounded-[2px] border-2 transition-all cursor-pointer ${
                        selectedVariant === "standard"
                          ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                          : "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]"
                      }`}
                    >
                      Standard (NCERT Formal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("fast_track")}
                      className={`px-3 py-2 rounded-[2px] border-2 transition-all cursor-pointer ${
                        selectedVariant === "fast_track"
                          ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                          : "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]"
                      }`}
                    >
                      Fast-Track (Shortcut)
                    </button>
                  </div>

                  {/* Headline & Explanation */}
                  <div className="space-y-1.5 pt-2 border-t-2 border-[#5A3720]/20">
                    <h5 className="font-heading font-bold text-sm sm:text-base text-[#2B1B0F]">
                      {rootLesson[selectedVariant].headline[currentLang]}
                    </h5>
                    <p className="text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed font-sans">
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
