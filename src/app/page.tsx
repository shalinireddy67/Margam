"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Tile,
  Input,
  LanguageToggle,
  BottomTabBar,
  OfflineBanner,
  Logo,
  type Language,
} from "@/components/ui";
import { LearnerProfile } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  clearActiveProfile,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getSupportedChapters,
  getConceptsByChapter,
  canTakeChapterDiagnostic,
} from "@/lib/curriculum";
import { isFeatureEnabled } from "@/lib/flags";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("en");

  // Onboarding form state
  const [nameInput, setNameInput] = useState("");
  const [selectedClass, setSelectedClass] = useState<6 | 7 | 8 | 9 | 10>(10);

  useEffect(() => {
    const active = getActiveProfile();
    if (active && active.selectedClass) {
      const updated = syncClassProgression(active);
      setProfile(updated);
      setSelectedClass(updated.selectedClass as 6 | 7 | 8 | 9 | 10);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Handle Start Learning
  const handleStartLearning = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = createLearnerProfile(
      nameInput.trim() || "Student",
      selectedClass
    );
    const updated = syncClassProgression(newProfile);
    setProfile(updated);
  };

  // Handle Try 3 Questions (Fast entry into pilot diagnostic)
  const handleTryQuestions = () => {
    const effectiveProfile =
      profile ||
      syncClassProgression(
        createLearnerProfile(nameInput.trim() || "Student", selectedClass)
      );
    setProfile(effectiveProfile);
    const pilotChapters = getSupportedChapters(selectedClass);
    const chapterId = pilotChapters[0]?.id || "c10-ch04";
    router.push(`/student/diagnostic/${chapterId}`);
  };

  // Handle Reset Profile
  const handleResetProfile = () => {
    if (
      window.confirm(
        "Are you sure you want to switch class or learner? Progress for this profile is preserved in browser storage."
      )
    ) {
      clearActiveProfile();
      setProfile(null);
      setNameInput("");
    }
  };

  // Translations dictionary
  const copy = {
    en: {
      appName: "Margam",
      tagline: "Sequential Maths",
      heroLine1: "Adaptive maths practice for CBSE & State Boards.",
      heroLine2: "Catches hidden foundation gaps from earlier classes.",
      heroLine3: "Free, private, and works offline on any phone.",
      try3Questions: "Try 3 questions",
      startCardTitle: "Get Started",
      startCardSubtitle: "Enter your name and select your class to begin.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name (e.g. Priya)",
      classLabel: "Select Your Class",
      startLearningBtn: "Start Learning",
      welcomeBack: "Welcome back",
      classBadge: "Class",
      activeGapFound: "Active gap identified in foundational prerequisite",
      fixGapBtn: "Fix Foundation Gap",
      continueLessonBtn: "Continue Practice",
      switchProfile: "Switch class or name",
      chaptersHeading: "Maths Chapters",
      chaptersSubtitle: "Choose a chapter to practice, review lessons, or diagnose foundation gaps.",
      teacherLink: "Teacher View",
      conceptsMastered: "concepts mastered",
    },
    hi: {
      appName: "मार्गम्",
      tagline: "अनुक्रमिक गणित",
      heroLine1: "सीबीएसई और राज्य बोर्डों के लिए अनुकूली गणित अभ्यास।",
      heroLine2: "पिछली कक्षाओं की छुपी हुई कमियों को खोजकर ठीक करता है।",
      heroLine3: "पूरी तरह निःशुल्क, निजी और किसी भी फ़ोन पर ऑफ़लाइन चलता है।",
      try3Questions: "3 प्रश्नों को आज़माएं",
      startCardTitle: "शुरू करें",
      startCardSubtitle: "अपना नाम दर्ज करें और अपनी कक्षा चुनें।",
      nameLabel: "आपका नाम",
      namePlaceholder: "अपना नाम दर्ज करें (उदा. प्रिया)",
      classLabel: "अपनी कक्षा चुनें",
      startLearningBtn: "सीखना शुरू करें",
      welcomeBack: "वापसी पर स्वागत है",
      classBadge: "कक्षा",
      activeGapFound: "बुनियादी पूर्व-अपेक्षा में अंतराल पाया गया",
      fixGapBtn: "बुनियादी कमी ठीक करें",
      continueLessonBtn: "अभ्यास जारी रखें",
      switchProfile: "कक्षा या नाम बदलें",
      chaptersHeading: "गणित के अध्याय",
      chaptersSubtitle: "अभ्यास करने, पाठ सीखने या कमी का पता लगाने के लिए एक अध्याय चुनें।",
      teacherLink: "शिक्षक दृश्य",
      conceptsMastered: "अवधारणाएं पूरी हुईं",
    },
    te: {
      appName: "మార్గం",
      tagline: "క్రమానుగత గణితం",
      heroLine1: "సీబీఎస్‌ఈ మరియు స్టేట్ బోర్డుల కోసం అనుకూల గణిత అభ్యాసం.",
      heroLine2: "మునుపటి తరగతుల పునాది లోపాలను గుర్తించి సరిచేస్తుంది.",
      heroLine3: "ఉచితం, గోప్యత మరియు ఏ ఫోన్‌లోనైనా ఆఫ్‌లైన్‌లో పనిచేస్తుంది.",
      try3Questions: "3 ప్రశ్నలను ప్రయత్నించండి",
      startCardTitle: "ప్రారంభించండి",
      startCardSubtitle: "మీ పేరును నమోదు చేసి మీ తరగతిని ఎంచుకోండి.",
      nameLabel: "మీ పేరు",
      namePlaceholder: "మీ పేరు నమోదు చేయండి (ఉదా. ప్రియ)",
      classLabel: "మీ తరగతిని ఎంచుకోండి",
      startLearningBtn: "నేర్చుకోవడం ప్రారంభించండి",
      welcomeBack: "పునఃస్వాగతం",
      classBadge: "తరగతి",
      activeGapFound: "పునాది అంశంలో లోపం గుర్తించబడింది",
      fixGapBtn: "పునాది లోపాన్ని సరిచేయండి",
      continueLessonBtn: "అభ్యాసం కొనసాగించండి",
      switchProfile: "తరగతి లేదా పేరు మార్చండి",
      chaptersHeading: "గణిత అధ్యాయాలు",
      chaptersSubtitle: "అభ్యాసం చేయడానికి లేదా లోపాలను గుర్తించడానికి ఒక అధ్యాయాన్ని ఎంచుకోండి.",
      teacherLink: "ఉపాధ్యాయుల వీక్షణ",
      conceptsMastered: "కాన్సెప్ట్‌లు పూర్తి అయ్యాయి",
    },
  }[currentLang];

  const currentGrade = profile ? (profile.selectedClass as 6 | 7 | 8 | 9 | 10) : selectedClass;
  const gradeChapters = getChaptersByClass(currentGrade);

  // Calculate completed concepts count if profile exists
  const completedConceptsCount = profile
    ? Object.values(profile.topicProgress).filter((p) => p.status === "completed").length
    : 0;

  // Active gap concept if any
  const firstActiveGapId =
    profile?.activeGap && profile.activeGap.status === "confirmed"
      ? profile.activeGap.rootConceptId
      : undefined;

  // Tile colors rotation
  const tileColors: ("yellow" | "cyan" | "green" | "sky" | "orange")[] = [
    "yellow",
    "cyan",
    "green",
    "sky",
    "orange",
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8DC]">
        <div className="p-6 border-[3px] border-[#111111] rounded-2xl bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] text-center">
          <p className="font-heading font-extrabold text-lg text-[#111111]">Loading Margam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] pb-28">
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FFF8DC]/95 backdrop-blur-none border-b-[3px] border-[#111111]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Grade Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center min-h-[48px] gap-2 no-underline text-[#111111]"
            >
              <div className="w-10 h-10 rounded-none bg-[#F2D16B] border-4 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center shrink-0">
                <Logo className="w-6 h-6" ariaLabel={copy.appName} />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl text-[#111111] tracking-tight leading-none block">
                  {copy.appName}
                </span>
                <span className="text-xs font-bold text-[#111111]/70 block">
                  {copy.tagline}
                </span>
              </div>
            </Link>

            {profile && (
              <span className="hidden sm:inline-block px-2.5 py-1 border-[2px] border-[#111111] rounded-full bg-[#FFE14D] text-xs font-heading font-extrabold text-[#111111]">
                {copy.classBadge} {profile.selectedClass}
              </span>
            )}
          </div>

          {/* Right Controls: Teacher link & Language Toggle */}
          <div className="flex items-center gap-2">
            {isFeatureEnabled("FEATURE_TEACHER_TOOLS") && (
              <Link
                href="/teacher"
                className="hidden sm:inline-flex items-center justify-center px-3 py-2 min-h-[48px] min-w-[48px] border-[2px] border-[#111111] rounded-xl bg-[#FFFFFF] shadow-[2px_2px_0px_#111111] text-xs font-heading font-extrabold text-[#111111] no-underline hover:bg-[#FFE14D]/30 active:translate-x-[1px] active:translate-y-[1px]"
              >
                {copy.teacherLink}
              </Link>
            )}
            <LanguageToggle
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
            />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-8 space-y-8">
        {/* ================================================================= */}
        {/* LANDING & ONBOARDING (For First-Time Visitors)                    */}
        {/* ================================================================= */}
        {!profile && (
          <section aria-labelledby="welcome-heading" className="space-y-6">
            {/* 3-Line Landing Hero */}
            <Card color="yellow" className="p-6 sm:p-8 space-y-4">
              <h1
                id="welcome-heading"
                className="font-heading font-extrabold text-3xl sm:text-4xl text-[#111111] leading-tight"
              >
                {copy.appName}
              </h1>

              {/* 3 Short Informative Lines */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-[#FFE14D] flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="font-sans font-bold text-base text-[#111111] leading-snug">
                    {copy.heroLine1}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-[#FFE14D] flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="font-sans font-bold text-base text-[#111111] leading-snug">
                    {copy.heroLine2}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-[#FFE14D] flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="font-sans font-bold text-base text-[#111111] leading-snug">
                    {copy.heroLine3}
                  </p>
                </div>
              </div>

              {/* Main "Try 3 questions" Action Button */}
              <div className="pt-2">
                <Button
                  variant="ink"
                  size="lg"
                  onClick={handleTryQuestions}
                  className="w-full sm:w-auto text-[#FFE14D]"
                >
                  <span className="mr-2">{copy.try3Questions}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="w-5 h-5 inline-block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Button>
              </div>
            </Card>

            {/* Name and Class Entry Card */}
            <Card color="white" className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-[#111111]">
                  {copy.startCardTitle}
                </h2>
                <p className="text-sm font-bold text-[#111111]/70 mt-1">
                  {copy.startCardSubtitle}
                </p>
              </div>

              <form onSubmit={handleStartLearning} className="space-y-5">
                {/* 1. Name Input */}
                <div>
                  <label
                    htmlFor="student-name-field"
                    className="block font-heading font-bold text-sm text-[#111111] mb-1.5 uppercase tracking-wide"
                  >
                    {copy.nameLabel}
                  </label>
                  <Input
                    id="student-name-field"
                    type="text"
                    required
                    placeholder={copy.namePlaceholder}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>

                {/* 2. Class Selection: 48px buttons with checkmark + 21:1 contrast */}
                <div>
                  <label
                    id="class-selector-label"
                    className="block font-heading font-bold text-sm text-[#111111] mb-1.5 uppercase tracking-wide"
                  >
                    {copy.classLabel}
                  </label>
                  <div
                    role="radiogroup"
                    aria-labelledby="class-selector-label"
                    className="grid grid-cols-5 gap-2 sm:gap-3"
                  >
                    {([6, 7, 8, 9, 10] as const).map((grade) => {
                      const isSelected = selectedClass === grade;
                      return (
                        <button
                          key={grade}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          aria-label={`Class ${grade}${isSelected ? ", selected" : ""}`}
                          onClick={() => setSelectedClass(grade)}
                          className={`
                            min-h-[48px] py-2 px-1
                            flex items-center justify-center gap-1
                            font-heading font-extrabold text-base
                            border-[3px] border-[#111111]
                            rounded-[14px_12px_16px_13px/13px_15px_12px_14px]
                            box-border cursor-pointer select-none
                            transition-transform active:translate-x-[2px] active:translate-y-[2px]
                            ${
                              isSelected
                                ? "bg-[#111111] text-[#FFFFFF] shadow-[2px_2px_0px_#111111]"
                                : "bg-[#FFFFFF] text-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#FFE14D]/30"
                            }
                          `.trim()}
                        >
                          {isSelected && (
                            <svg
                              viewBox="0 0 16 16"
                              className="w-4 h-4 text-[#8DE86A] shrink-0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M3 8.5l3.5 3.5 7-7" />
                            </svg>
                          )}
                          <span className={isSelected ? "text-[#FFFFFF]" : "text-[#111111]"}>
                            {grade}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="yellow"
                  size="default"
                  className="w-full text-[#111111]"
                >
                  <span>{copy.startLearningBtn}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Button>
              </form>
            </Card>
          </section>
        )}

        {/* ================================================================= */}
        {/* RETURNING STUDENT SECTION (If profile exists)                     */}
        {/* ================================================================= */}
        {profile && (
          <section aria-labelledby="returning-heading" className="space-y-4">
            {/* Continue Card */}
            <Card color="yellow" className="p-6 sm:p-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#111111]/70 uppercase tracking-wide">
                    {copy.welcomeBack}
                  </span>
                  <h1
                    id="returning-heading"
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111111] leading-tight"
                  >
                    {profile.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-[#111111] text-[#FFFFFF] rounded-full font-heading font-extrabold text-xs">
                    {copy.classBadge} {profile.selectedClass}
                  </span>
                  <span className="text-xs font-bold text-[#111111]/80">
                    {completedConceptsCount} {copy.conceptsMastered}
                  </span>
                </div>
              </div>

              {/* Active gap indicator or continue prompt */}
              {firstActiveGapId ? (
                <div className="p-4 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] space-y-2">
                  <div className="flex items-center gap-2 text-[#FF4F9A]">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 shrink-0 stroke-[3]"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="font-heading font-extrabold text-sm text-[#111111]">
                      {copy.activeGapFound}
                    </span>
                  </div>
                  <div className="pt-1">
                    <Link
                      href={`/student/worksheet/${firstActiveGapId}`}
                      className="inline-flex items-center justify-center min-h-[48px] px-4 py-2 bg-[#FF4F9A] text-[#111111] border-[2px] border-[#111111] rounded-xl font-heading font-extrabold text-xs shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      {copy.fixGapBtn}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-wrap gap-3 items-center">
                  <Button
                    variant="ink"
                    size="sm"
                    onClick={handleTryQuestions}
                    className="text-[#FFE14D]"
                  >
                    <span>{copy.continueLessonBtn}</span>
                    <svg
                      viewBox="0 0 16 16"
                      className="w-4 h-4 ml-1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="min-h-[48px] min-w-[48px] px-3 py-2 inline-flex items-center text-xs font-bold text-[#111111] underline hover:text-[#FF4F9A] cursor-pointer"
                  >
                    {copy.switchProfile}
                  </button>
                </div>
              )}
            </Card>
          </section>
        )}

        {/* ================================================================= */}
        {/* CHAPTERS LIST (Coloured Illustrated Tiles)                        */}
        {/* ================================================================= */}
        <section id="chapters" aria-labelledby="chapters-list-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-[3px] border-[#111111] pb-2">
            <div>
              <h2
                id="chapters-list-heading"
                className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111111]"
              >
                {copy.classBadge} {currentGrade} {copy.chaptersHeading}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#111111]/70 mt-0.5">
                {copy.chaptersSubtitle}
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#111111] shrink-0">
              {gradeChapters.length} Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gradeChapters.map((chapter, index) => {
              const isFull = chapter.status === "full";
              const chapterConcepts = getConceptsByChapter(chapter.id);
              const hasDiagnostic = isFull && canTakeChapterDiagnostic(chapter.id);
              const hasStarted = chapterConcepts.some(
                (c) =>
                  profile?.topicProgress[c.id]?.status === "completed" ||
                  profile?.topicProgress[c.id]?.status === "in_progress"
              );

              // Real state mapping
              const tileState = !isFull
                ? "coming_soon"
                : hasStarted
                ? "in_progress"
                : "available";

              const color = tileColors[index % tileColors.length];
              const localizedTitle = `Ch ${chapter.chapterNumber}: ${
                chapter.name[currentLang] || chapter.name.en
              }`;
              const localizedSubtitle = `NCERT • ${chapter.bookName}`;

              const firstConceptId = chapterConcepts[0]?.id;
              const diagnosticHref = hasDiagnostic
                ? `/student/diagnostic/${chapter.id}`
                : undefined;
              const practiceHref =
                isFull && firstConceptId
                  ? `/student/worksheet/${firstConceptId}`
                  : undefined;
              const lessonHref =
                isFull && firstConceptId
                  ? `/lesson/${firstConceptId}`
                  : undefined;

              return (
                <Tile
                  key={chapter.id}
                  title={localizedTitle}
                  subtitle={localizedSubtitle}
                  state={tileState}
                  color={color}
                  diagnosticHref={diagnosticHref}
                  practiceHref={practiceHref}
                  lessonHref={lessonHref}
                />
              );
            })}
          </div>
        </section>

        {/* Small Teacher link for mobile footer */}
        {isFeatureEnabled("FEATURE_TEACHER_TOOLS") && (
          <div className="pt-4 text-center sm:hidden">
            <Link
              href="/teacher"
              className="inline-flex items-center justify-center min-h-[48px] px-4 py-2 text-xs font-bold text-[#111111] underline hover:text-[#FF4F9A]"
            >
              {copy.teacherLink}
            </Link>
          </div>
        )}
      </main>

      {/* Student Bottom Tab Bar (Home active) */}
      <BottomTabBar currentTab="home" />
    </div>
  );
}
