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
  ProgressBar,
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
  getConceptById,
} from "@/lib/curriculum";
import { isFeatureEnabled } from "@/lib/flags";
import { WitchCat } from "@/components/ui/WitchCat";
import { getCatGreeting } from "@/lib/greetings";
import { Sparkles, Compass, Award, BookOpen, AlertCircle, ArrowRight, RotateCcw, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { getRevisionQueue, getCompanionRevisionGreeting } from "@/lib/revision";

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
      tagline: "Minecraft-Inspired Math Realm",
      heroLine1: "Sequential maths progression across Classes 6–10.",
      heroLine2: "Detects prerequisite gaps and traces root causes automatically.",
      heroLine3: "Private, lightweight, and works seamlessly offline.",
      try3Questions: "Try 3 Questions (Quick Diagnostic)",
      startCardTitle: "Enter Your Realm",
      startCardSubtitle: "Enter your name and select your grade to build your personal learning world.",
      nameLabel: "Player Name",
      namePlaceholder: "Enter your name (e.g. Priya)",
      classLabel: "Select Your Grade Realm",
      startLearningBtn: "Spawn into Realm",
      welcomeBack: "Welcome back",
      classBadge: "Class",
      activeGapFound: "Prerequisite Gap Detected",
      fixGapBtn: "Strengthen Foundation",
      continueLessonBtn: "Continue Quest",
      switchProfile: "Switch Grade / Reset Realm",
      chaptersHeading: "Math Quests & Chapters",
      chaptersSubtitle: "Choose a chapter to diagnose prerequisite mastery or start lessons.",
      teacherLink: "Teacher Hub",
      conceptsMastered: "Blocks Mastered",
    },
    hi: {
      appName: "मार्गम्",
      tagline: "गणित की दुनिया",
      heroLine1: "कक्षा 6–10 के लिए क्रमिक और अनुकूली गणित अभ्यास।",
      heroLine2: "बुनियादी कमियों की स्वतः पहचान और चरणबद्ध समाधान।",
      heroLine3: "पूर्णतः सुरक्षित, निःशुल्क और ऑफलाइन सक्षम।",
      try3Questions: "3 प्रश्नों का अभ्यास करें",
      startCardTitle: "अपनी दुनिया में प्रवेश करें",
      startCardSubtitle: "अपना नाम दर्ज करें और अपनी कक्षा चुनें।",
      nameLabel: "आपका नाम",
      namePlaceholder: "अपना नाम लिखें (उदा. प्रिया)",
      classLabel: "अपनी कक्षा चुनें",
      startLearningBtn: "सीखना शुरू करें",
      welcomeBack: "पुनः स्वागत है",
      classBadge: "कक्षा",
      activeGapFound: "बुनियादी कमी पाई गई",
      fixGapBtn: "बुनियादी कमी सुधारें",
      continueLessonBtn: "पाठ जारी रखें",
      switchProfile: "कक्षा बदलें",
      chaptersHeading: "गणित के अध्याय",
      chaptersSubtitle: "अभ्यास करने या जांच के लिए अध्याय चुनें।",
      teacherLink: "शिक्षक दृश्य",
      conceptsMastered: "अवधारणाएं पूर्ण",
    },
    te: {
      appName: "మార్గం",
      tagline: "గణిత అభ్యాస ప్రపంచం",
      heroLine1: "6–10 తరగతుల విద్యార్థుల కోసం దశలవారీ గణిత అభ్యాసం.",
      heroLine2: "ముందస్తు పునాది లోపాలను గుర్తించి స్వయంచాలకంగా సరిదిద్దుతుంది.",
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
    ? Object.values(profile.topicProgress || {}).filter((p) => p.status === "completed").length
    : 0;

  const resolvedGapsCount = profile?.resolvedGaps?.length || 0;

  // Active gap concept if any
  const firstActiveGapId =
    profile?.activeGap && profile.activeGap.status === "confirmed"
      ? profile.activeGap.rootConceptId
    : undefined;

  const gapConcept = firstActiveGapId ? getConceptById(firstActiveGapId) : undefined;

  // Companion greeting
  const catGreeting = getCatGreeting(profile?.name, currentLang);
  const revisionQueue = profile ? getRevisionQueue(profile, 4) : [];
  const companionRevision = profile ? getCompanionRevisionGreeting(revisionQueue, profile) : null;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#102610] minecraft-grid-bg">
        <div className="p-6 border-3 border-[#315B2A] bg-[#173B19] shadow-[6px_6px_0px_#102610] text-center text-[#F2F0DF]">
          <p className="font-heading font-extrabold text-base text-[#79B82A] animate-pulse">
            Loading Realm...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] pb-28">
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#173B19]/95 backdrop-blur-md border-b-3 border-[#315B2A] shadow-[0px_4px_0px_#102610]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Grade Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] gap-2.5 no-underline text-[#F2F0DF]"
            >
              <div className="w-10 h-10 rounded-none bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] flex items-center justify-center shrink-0">
                <Logo className="w-6 h-6" ariaLabel={copy.appName} />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#79B82A] tracking-wider leading-none block drop-shadow-[2px_2px_0px_#102610]">
                  {copy.appName.toUpperCase()}
                </span>
                <span className="text-[10px] font-heading font-bold text-[#D8D8D0] block mt-0.5">
                  {copy.tagline}
                </span>
              </div>
            </Link>

            {profile && (
              <span className="hidden sm:inline-block px-2.5 py-1 border-2 border-[#102610] bg-[#4F8A24] text-[10px] font-heading font-extrabold text-[#F2F0DF] shadow-[2px_2px_0px_#102610]">
                {copy.classBadge} {profile.selectedClass}
              </span>
            )}
          </div>

          {/* Right Controls: Teacher link & Language Toggle */}
          <div className="flex items-center gap-2">
            {isFeatureEnabled("FEATURE_TEACHER_TOOLS") && (
              <Link
                href="/teacher"
                className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 min-h-[42px] border-2 border-[#315B2A] bg-[#102610] shadow-[2px_2px_0px_#102610] text-xs font-heading font-bold text-[#F2F0DF] hover:bg-[#315B2A] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
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
      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8 space-y-8">
        {/* ================================================================= */}
        {/* ONBOARDING (For First-Time Visitors)                              */}
        {/* ================================================================= */}
        {!profile && (
          <section aria-labelledby="welcome-heading" className="space-y-6">
            {/* Minecraft World Welcome Card */}
            <div className="p-6 sm:p-8 bg-[#173B19]/90 border-3 border-[#4F8A24] shadow-[6px_6px_0px_#102610] border-t-[6px] border-t-[#79B82A] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#102610] border border-[#315B2A] text-[10px] font-heading font-bold text-[#79B82A]">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5B834]" />
                    <span>MARGAM REALM</span>
                  </div>
                  <h1
                    id="welcome-heading"
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F2F0DF] leading-tight drop-shadow-[2px_2px_0px_#102610]"
                  >
                    Build Your Math Mastery
                  </h1>
                  <p className="text-sm text-[#D8D8D0] leading-relaxed">
                    A Minecraft-inspired adaptive math realm where learning is sequential, gaps are diagnosed, and every lesson strengthens your foundation.
                  </p>
                </div>

                {/* Companion Mascot Welcome */}
                <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-[#102610]/70 border-2 border-[#315B2A] shadow-[4px_4px_0px_#102610]">
                  <WitchCat
                    pose="greet"
                    size={110}
                    sticker={false}
                    alt="Margam Zombie Chicken Jockey companion welcoming you"
                  />
                  <span className="text-[9px] font-heading text-[#79B82A] mt-1">Study Companion</span>
                </div>
              </div>

              {/* 3 Pillar Features in Block Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#79B82A]">
                    <BookOpen className="w-4 h-4 text-[#79B82A]" />
                    <span>Classes 6–10</span>
                  </div>
                  <p className="text-xs text-[#D8D8D0] leading-snug">{copy.heroLine1}</p>
                </div>
                <div className="p-3.5 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#E5B834]">
                    <Compass className="w-4 h-4 text-[#E5B834]" />
                    <span>Gap Tracing</span>
                  </div>
                  <p className="text-xs text-[#D8D8D0] leading-snug">{copy.heroLine2}</p>
                </div>
                <div className="p-3.5 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#79B82A]">
                    <Award className="w-4 h-4 text-[#79B82A]" />
                    <span>100% Free</span>
                  </div>
                  <p className="text-xs text-[#D8D8D0] leading-snug">{copy.heroLine3}</p>
                </div>
              </div>

              {/* Fast Try 3 Questions Diagnostic Button */}
              <div className="pt-2">
                <Button
                  variant="pixelgreen"
                  size="default"
                  onClick={handleTryQuestions}
                  className="w-full sm:w-auto text-[#102610]"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>{copy.try3Questions}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Name and Grade Realm Selection Card */}
            <div className="p-6 sm:p-8 bg-[#173B19] border-3 border-[#315B2A] shadow-[6px_6px_0px_#102610] space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F2F0DF]">
                  {copy.startCardTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#D8D8D0] mt-1 font-medium">
                  {copy.startCardSubtitle}
                </p>
              </div>

              <form onSubmit={handleStartLearning} className="space-y-6">
                {/* 1. Student Name */}
                <div>
                  <label
                    htmlFor="student-name-field"
                    className="block font-heading font-bold text-xs text-[#79B82A] mb-2 uppercase tracking-wider"
                  >
                    {copy.nameLabel}
                  </label>
                  <input
                    id="student-name-field"
                    type="text"
                    required
                    placeholder={copy.namePlaceholder}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-3 bg-[#102610] border-3 border-[#315B2A] text-[#F2F0DF] placeholder:text-[#D8D8D0]/40 font-heading text-sm focus:border-[#79B82A] focus:outline-none shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* 2. Grade Realm Selection (Classes 6 to 10 as interactive Minecraft block buttons) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      id="class-selector-label"
                      className="block font-heading font-bold text-xs text-[#79B82A] uppercase tracking-wider"
                    >
                      {copy.classLabel}
                    </label>
                    <span className="text-[10px] text-[#D8D8D0]/70 font-heading">
                      Single grade lock
                    </span>
                  </div>
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
                            min-h-[56px] py-2 px-1
                            flex flex-col items-center justify-center gap-1
                            font-heading font-extrabold text-sm sm:text-base
                            border-3 border-[#102610] rounded-none
                            box-border cursor-pointer select-none
                            transition-transform active:translate-x-[2px] active:translate-y-[2px]
                            ${
                              isSelected
                                ? "bg-[#79B82A] text-[#102610] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6),3px_3px_0px_#102610]"
                                : "bg-[#102610] text-[#D8D8D0] shadow-[3px_3px_0px_#102610] hover:bg-[#315B2A] hover:text-[#F2F0DF]"
                            }
                          `.trim()}
                        >
                          <span className="text-[9px] uppercase tracking-tighter opacity-70">Class</span>
                          <span className="text-base sm:text-lg leading-none">{grade}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Spawn Button */}
                <Button
                  type="submit"
                  variant="pixelgreen"
                  size="default"
                  className="w-full text-[#102610]"
                >
                  <span>{copy.startLearningBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* STUDENT DASHBOARD (When Profile is Active)                        */}
        {/* ================================================================= */}
        {profile && (
          <section aria-labelledby="dashboard-heading" className="space-y-6">
            {/* Hero Student Realm Banner */}
            <div className="p-6 sm:p-7 bg-[#173B19]/95 border-3 border-[#4F8A24] border-t-[6px] border-t-[#79B82A] shadow-[6px_6px_0px_#102610] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Mascot Companion with Pose */}
                  <div className="shrink-0 p-2 bg-[#102610] border-2 border-[#315B2A] shadow-[3px_3px_0px_#102610]">
                    <WitchCat
                      pose="cheer"
                      size={90}
                      sticker={false}
                      alt="Margam Learning Companion"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-[#79B82A] uppercase tracking-wider block">
                      {catGreeting.text}
                    </span>
                    <h1
                      id="dashboard-heading"
                      className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F2F0DF] leading-tight drop-shadow-[2px_2px_0px_#102610]"
                    >
                      {profile.name}
                    </h1>
                    <p className="text-xs text-[#D8D8D0] mt-1 font-bold">
                      Class {profile.selectedClass} Realm • Adaptive Level {profile.currentDifficulty} / 3
                    </p>
                  </div>
                </div>

                {/* Progress / Mastery Stats */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                  <span className="px-3 py-1 bg-[#4F8A24] text-[#F2F0DF] border-2 border-[#102610] font-heading font-bold text-xs shadow-[2px_2px_0px_#102610]">
                    {completedConceptsCount} {copy.conceptsMastered}
                  </span>
                  {resolvedGapsCount > 0 && (
                    <span className="px-3 py-1 bg-[#E5B834] text-[#102610] border-2 border-[#102610] font-heading font-bold text-xs shadow-[2px_2px_0px_#102610] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{resolvedGapsCount} Foundations Repaired</span>
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#E5B834]">
                    XP Level: {Math.max(1, completedConceptsCount * 10 + resolvedGapsCount * 25)}
                  </span>
                </div>
              </div>

              {/* Minecraft XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-[#D8D8D0]">Realm Mastery Progress</span>
                  <span className="text-[#79B82A]">
                    {completedConceptsCount} / {gradeChapters.length * 2} concepts
                  </span>
                </div>
                <ProgressBar
                  value={completedConceptsCount}
                  max={Math.max(1, gradeChapters.length * 2)}
                  segments={12}
                  color="pixelgreen"
                />
              </div>

              {/* Active Gap Remediation Box if Found */}
              {firstActiveGapId ? (
                <div className="p-5 bg-[#102610] border-3 border-[#E5B834] border-l-[8px] border-l-[#E5B834] shadow-[4px_4px_0px_#102610] space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[#E5B834]">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-heading font-extrabold text-xs sm:text-sm">
                        {copy.activeGapFound} {gapConcept ? `(Class ${gapConcept.class})` : ""}
                      </span>
                    </div>
                    {gapConcept && (
                      <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#E5B834] text-[#102610] border border-[#102610]">
                        Class {gapConcept.class} Prerequisite
                      </span>
                    )}
                  </div>

                  {gapConcept && (
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#F2F0DF]">
                      {gapConcept.name[currentLang] || gapConcept.name.en}
                    </h3>
                  )}

                  <p className="text-xs text-[#D8D8D0] leading-relaxed">
                    {profile?.activeGap?.plainLanguageReason ||
                      "Our diagnostic detected an underlying prerequisite gap. Strengthening this foundation will make your current grade quests much easier!"}
                  </p>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/lesson/${firstActiveGapId}?fromGap=true`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#E5B834] hover:bg-[#F2D16B] text-[#102610] border-2 border-[#102610] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>{copy.fixGapBtn}</span>
                    </Link>
                    <Link
                      href={`/student/worksheet/${firstActiveGapId}`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#315B2A] hover:bg-[#4F8A24] text-[#F2F0DF] border-2 border-[#102610] font-heading font-bold text-xs shadow-[2px_2px_0px_#102610] no-underline transition-colors"
                    >
                      <span>Jump to Practice Worksheet</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-wrap gap-3 items-center">
                  <Button
                    variant="pixelgreen"
                    size="sm"
                    onClick={handleTryQuestions}
                    className="text-[#102610]"
                  >
                    <span>{copy.continueLessonBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="min-h-[44px] px-3 py-2 inline-flex items-center text-xs font-bold text-[#D8D8D0] hover:text-[#79B82A] underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>{copy.switchProfile}</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* YOUR REVISION ZONE (Smart Spaced Repetition)                      */}
        {/* ================================================================= */}
        {profile && (
          <section aria-labelledby="revision-zone-heading" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#315B2A] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#79B82A] text-lg">⚔️</span>
                <h2
                  id="revision-zone-heading"
                  className="font-heading font-extrabold text-xl sm:text-2xl text-[#F2F0DF]"
                >
                  Your Revision Zone
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-[#E5B834]">
                {revisionQueue.length > 0
                  ? `${revisionQueue.length} Topic${revisionQueue.length > 1 ? "s" : ""} Prioritized`
                  : "All Foundations Up to Date"}
              </span>
            </div>

            {/* Companion Dialogue & Advice Card */}
            <div className="p-4 sm:p-5 bg-[#173B19] border-3 border-[#4F8A24] shadow-[4px_4px_0px_#102610] flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0 p-1.5 bg-[#102610] border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610]">
                <WitchCat
                  pose={companionRevision?.pose || "greet"}
                  size={74}
                  sticker={false}
                  alt="Margam Zombie Chicken Jockey companion revision advice"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#79B82A] uppercase tracking-wider block">
                  Companion Quest Advice • {companionRevision?.title || "Daily Check-in"}
                </span>
                <p className="text-xs sm:text-sm text-[#F2F0DF] font-medium leading-relaxed">
                  &ldquo;{companionRevision?.message}&rdquo;
                </p>
              </div>

              {revisionQueue.length > 0 && (
                <div className="shrink-0">
                  <Link
                    href={revisionQueue[0].href}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] border-2 border-[#102610] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <span>Start Revision Worksheet</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Revision Cards Grid */}
            {revisionQueue.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {revisionQueue.map((item) => {
                  const isCritical = item.priority === "critical_gap";
                  const isNeedsPractice = item.priority === "needs_practice";
                  const isDue = item.priority === "due_revision";

                  const badgeColor = isCritical
                    ? "bg-[#E5B834] text-[#102610] border-[#102610]"
                    : isNeedsPractice
                    ? "bg-[#D9453D] text-[#F2F0DF] border-[#102610]"
                    : isDue
                    ? "bg-[#79B82A] text-[#102610] border-[#102610]"
                    : "bg-[#4F8A24] text-[#F2F0DF] border-[#102610]";

                  const badgeLabel = isCritical
                    ? "CRITICAL GAP"
                    : isNeedsPractice
                    ? "NEEDS PRACTICE"
                    : isDue
                    ? (item.daysOverdue && item.daysOverdue > 0 ? `OVERDUE (${item.daysOverdue}D)` : "REVISION DUE")
                    : "WORKSHEET PENDING";

                  return (
                    <div
                      key={item.conceptId}
                      className={`p-4 bg-[#173B19] border-3 shadow-[4px_4px_0px_#102610] flex flex-col justify-between gap-3 ${
                        isCritical ? "border-[#E5B834]" : "border-[#315B2A]"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[10px] font-heading font-extrabold border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                          <span className="text-[11px] font-heading font-bold text-[#D8D8D0]">
                            Class {item.class} • Level {item.currentDifficulty}
                          </span>
                        </div>

                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#F2F0DF] leading-snug">
                          {item.conceptName}
                        </h3>

                        <p className="text-xs text-[#D8D8D0] leading-relaxed">
                          {item.reason}
                        </p>

                        {/* Historical Attempt Improvement if recorded */}
                        {item.previousImprovement && (
                          <div className="p-2 bg-[#102610] border border-[#315B2A] flex items-center justify-between text-[11px]">
                            <span className="text-[#D8D8D0]">
                              Prev: {item.previousImprovement.previousPercentage}% ➔ Latest: {item.previousImprovement.latestPercentage}%
                            </span>
                            <span className={`font-heading font-extrabold ${item.previousImprovement.delta >= 0 ? "text-[#79B82A]" : "text-[#D9453D]"}`}>
                              {item.previousImprovement.delta >= 0 ? `+${item.previousImprovement.delta}%` : `${item.previousImprovement.delta}%`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#315B2A]">
                        <span className="text-[11px] font-heading font-bold text-[#79B82A]">
                          Mastery: {item.mastery}%
                        </span>
                        <Link
                          href={item.href}
                          className="inline-flex items-center justify-center min-h-[38px] px-3.5 py-1.5 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] border-2 border-[#102610] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                        >
                          <span>Practice Worksheet</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-[#173B19] border-2 border-[#315B2A] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#79B82A] mx-auto" />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#F2F0DF]">
                  All Math Blocks in Great Shape!
                </h3>
                <p className="text-xs text-[#D8D8D0] max-w-md mx-auto">
                  No concepts are currently overdue for spaced revision. Complete new lessons below to advance your learning realm!
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================================================================= */}
        {/* CHAPTERS GRID (Minecraft Voxel Tiles)                             */}
        {/* ================================================================= */}
        <section id="chapters" aria-labelledby="chapters-list-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#315B2A] pb-2">
            <div>
              <h2
                id="chapters-list-heading"
                className="font-heading font-extrabold text-xl sm:text-2xl text-[#F2F0DF]"
              >
                {copy.classBadge} {currentGrade} {copy.chaptersHeading}
              </h2>
              <p className="text-xs text-[#D8D8D0]/80 mt-0.5">
                {copy.chaptersSubtitle}
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-[#79B82A] shrink-0">
              {gradeChapters.length} Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gradeChapters.map((chapter) => {
              const isFull = chapter.status === "full";
              const chapterConcepts = getConceptsByChapter(chapter.id);
              const hasDiagnostic = isFull && canTakeChapterDiagnostic(chapter.id);
              const hasStarted = chapterConcepts.some(
                (c) =>
                  profile?.topicProgress[c.id]?.status === "completed" ||
                  profile?.topicProgress[c.id]?.status === "in_progress"
              );

              const tileState = !isFull
                ? "coming_soon"
                : hasStarted
                ? "in_progress"
                : "available";

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
                  color="forest"
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
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-heading font-bold text-[#79B82A] underline"
            >
              {copy.teacherLink}
            </Link>
          </div>
        )}
      </main>

      {/* Repeating Pixel Grass Border at Bottom */}
      <div className="w-full overflow-hidden leading-none select-none mt-12" aria-hidden="true">
        <svg
          viewBox="0 0 320 16"
          preserveAspectRatio="none"
          className="w-full h-5 sm:h-6 block"
          shapeRendering="crispEdges"
        >
          <defs>
            <pattern id="pixel-grass-strip" width="32" height="16" patternUnits="userSpaceOnUse">
              <rect x="0" y="4" width="32" height="12" fill="#4F8A24" />
              <rect x="0" y="12" width="32" height="4" fill="#315B2A" />
              <rect x="2" y="0" width="4" height="4" fill="#79B82A" />
              <rect x="10" y="0" width="4" height="4" fill="#79B82A" />
              <rect x="18" y="0" width="4" height="4" fill="#79B82A" />
              <rect x="26" y="0" width="4" height="4" fill="#79B82A" />
              <rect x="6" y="4" width="2" height="2" fill="#315B2A" />
              <rect x="14" y="4" width="2" height="2" fill="#315B2A" />
              <rect x="22" y="4" width="2" height="2" fill="#315B2A" />
              <rect x="30" y="4" width="2" height="2" fill="#315B2A" />
            </pattern>
          </defs>
          <rect width="100%" height="16" fill="url(#pixel-grass-strip)" />
        </svg>
        <div className="w-full h-4 sm:h-5 bg-[#173B19] border-t-2 border-[#102610]" />
      </div>

      {/* Student Bottom Tab Bar */}
      <BottomTabBar currentTab="home" />
    </div>
  );
}
