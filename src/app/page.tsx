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
  OfflineBanner,
  Logo,
  ProgressBar,
  type Language,
} from "@/components/ui";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
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
import { isIstNightTime } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import ConceptPathway from "@/components/ConceptPathway";
import { evaluateStudentBadges } from "@/lib/badges";
import { getCatGreeting } from "@/lib/greetings";
import { Sparkles, Compass, Award, BookOpen, AlertCircle, ArrowRight, RotateCcw, Calendar, CheckCircle2, TrendingUp, School, GraduationCap } from "lucide-react";
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
    const eligibleChapters = getSupportedChapters(selectedClass).filter((ch) =>
      canTakeChapterDiagnostic(ch.id)
    );
    const chapterId =
      eligibleChapters[0]?.id || (selectedClass === 10 ? "c10-ch04" : "c6-ch01");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <p className="font-heading font-extrabold text-base text-emerald-950 animate-pulse">
            Loading Realm...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* Floating Desktop-First Glass Navbar */}
      <Navigation
        currentTab="home"
        currentLang={currentLang as SupportedLanguage}
        onLanguageChange={(lang) => setCurrentLang(lang as Language)}
        profile={profile}
      />

      {/* Main Content Container */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 flex-1 w-full">
        {/* ================================================================= */}
        {/* ONBOARDING (For First-Time Visitors)                              */}
        {/* ================================================================= */}
        {!profile && (
          <section aria-labelledby="welcome-heading" className="space-y-6">
            {/* Minecraft Nature Glass Welcome Card */}
            <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/70 shadow-[0_12px_40px_rgba(16,42,18,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[10px] font-heading font-bold text-emerald-900 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>MARGAM REALM</span>
                  </div>
                  <h1
                    id="welcome-heading"
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-950 leading-tight"
                  >
                    Welcome to Margam.
                    <span className="block text-emerald-700 text-xl sm:text-2xl mt-1 font-extrabold">
                      Who is learning or teaching today?
                    </span>
                  </h1>
                  <p className="text-sm text-emerald-950/80 leading-relaxed font-medium">
                    Choose your portal to enter the adaptive mathematics realm.
                  </p>
                </div>

                {/* Companion Mascot Welcome in Glass Frame */}
                <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
                  <WitchCat
                    pose={isIstNightTime() ? "sleepy" : "greet"}
                    size={110}
                    sticker={false}
                    alt="Margam companion welcoming you"
                  />
                  <span className="text-[10px] font-heading text-emerald-900 mt-2 font-bold">
                    {isIstNightTime() ? "Maru (Resting zZz)" : "Maru Welcomes You!"}
                  </span>
                </div>
              </div>

              {/* Two clearly separated role cards: Student Login & Teacher Login */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* 1. Student Portal Option */}
                <div className="glass-card p-6 rounded-2xl border-2 border-emerald-400/50 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-xs">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base font-heading font-extrabold text-emerald-950">
                        Student Login
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950/75 leading-relaxed font-medium">
                      Practice NCERT mathematics (Classes 6–10), diagnose learning gaps, and earn quest badges. Privacy-first, no email needed.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => router.push("/login?role=student")}
                      className="w-full justify-center text-xs shadow-sm"
                    >
                      <span>Enter Student Portal</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("guest-onboarding-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full text-center text-[11px] font-heading font-bold text-emerald-800 hover:text-emerald-950 hover:underline py-1 cursor-pointer"
                    >
                      Or continue below as Guest
                    </button>
                  </div>
                </div>

                {/* 2. Teacher Portal Option */}
                <div className="glass-card p-6 rounded-2xl border-2 border-sky-400/50 hover:border-sky-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
                        <School className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base font-heading font-extrabold text-slate-900">
                        Teacher Login
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Manage classrooms, share unique class codes, monitor student concept mastery heatmaps, and track learning gaps.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="sky"
                      size="default"
                      onClick={() => router.push("/login?role=teacher")}
                      className="w-full justify-center text-xs shadow-sm"
                    >
                      <span>Enter Teacher Portal</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 3 Pillar Features in Glass Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="glass-card p-4 rounded-xl border border-white/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-800">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Classes 6–10</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{copy.heroLine1}</p>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-amber-800">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Gap Tracing</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{copy.heroLine2}</p>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-800">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>100% Free</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{copy.heroLine3}</p>
                </div>
              </div>

              {/* Fast Try 3 Questions Diagnostic Button */}
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="default"
                  onClick={handleTryQuestions}
                  className="w-full sm:w-auto shadow-sm"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>{copy.try3Questions}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Name and Grade Realm Selection Card */}
            <div id="guest-onboarding-section" className="glass-panel p-6 sm:p-8 border border-white/70 shadow-[0_8px_32px_rgba(16,42,18,0.08)] space-y-6 rounded-2xl">
              <div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-950">
                  {copy.startCardTitle}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-900/80 mt-1 font-medium">
                  {copy.startCardSubtitle}
                </p>
              </div>

              <form onSubmit={handleStartLearning} className="space-y-6">
                {/* 1. Student Name */}
                <div>
                  <label
                    htmlFor="student-name-field"
                    className="block font-heading font-bold text-xs text-emerald-950 mb-2 uppercase tracking-wider"
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
                    className="glass-input w-full p-3 font-heading text-sm text-emerald-950 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* 2. Grade Realm Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      id="class-selector-label"
                      className="block font-heading font-bold text-xs text-emerald-950 uppercase tracking-wider"
                    >
                      {copy.classLabel}
                    </label>
                    <span className="text-[10px] text-emerald-800 font-heading">
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
                            min-h-[56px] py-2 px-1 rounded-xl
                            flex flex-col items-center justify-center gap-1
                            font-heading font-extrabold text-sm sm:text-base
                            cursor-pointer select-none transition-all duration-200
                            hover:-translate-y-0.5 active:translate-y-0
                            ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-500"
                                : "bg-white/70 text-emerald-950 border border-white/80 shadow-xs hover:bg-white"
                            }
                          `.trim()}
                        >
                          <span className="text-[9px] uppercase tracking-tighter opacity-80">Class</span>
                          <span className="text-base sm:text-lg leading-none">{grade}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Spawn Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  className="w-full shadow-md"
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
            {/* Hero Student Realm Banner in Frosted Glass */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/70 shadow-[0_8px_32px_rgba(16,42,18,0.08)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Mascot Companion with Pose */}
                  <div className="shrink-0 p-3 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
                    <WitchCat
                      pose="cheer"
                      size={90}
                      sticker={false}
                      alt="Margam Learning Companion"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-emerald-700 uppercase tracking-wider block">
                      {catGreeting.text}
                    </span>
                    <h1
                      id="dashboard-heading"
                      className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-950 leading-tight"
                    >
                      {profile.name}
                    </h1>
                    <p className="text-xs text-emerald-800 mt-1 font-bold">
                      Class {profile.selectedClass} Realm • Adaptive Level {profile.currentDifficulty} / 3
                    </p>
                  </div>
                </div>

                {/* Progress / Mastery Stats */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-heading font-bold text-xs shadow-xs">
                    {completedConceptsCount} {copy.conceptsMastered}
                  </span>
                  {resolvedGapsCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-heading font-bold text-xs shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{resolvedGapsCount} Foundations Repaired</span>
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-emerald-800">
                    XP Level: {Math.max(1, completedConceptsCount * 10 + resolvedGapsCount * 25)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-emerald-900">Realm Mastery Progress</span>
                  <span className="text-emerald-700">
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

              {/* Segmented XP Progress */}
              <SegmentedXpBar currentXp={profile.xp || 0} />

              {/* Active Gap Remediation Box if Found */}
              {firstActiveGapId ? (
                <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-900">
                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                      <span className="font-heading font-extrabold text-xs sm:text-sm">
                        {copy.activeGapFound} {gapConcept ? `(Class ${gapConcept.class})` : ""}
                      </span>
                    </div>
                    {gapConcept && (
                      <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950 border border-amber-300">
                        Class {gapConcept.class} Prerequisite
                      </span>
                    )}
                  </div>

                  {gapConcept && (
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-amber-950">
                      {gapConcept.name[currentLang] || gapConcept.name.en}
                    </h3>
                  )}

                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {profile?.activeGap?.plainLanguageReason ||
                      "Our diagnostic detected an underlying prerequisite gap. Strengthening this foundation will make your current grade quests much easier!"}
                  </p>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/lesson/${firstActiveGapId}?fromGap=true`}
                      className="glass-btn-accent inline-flex items-center justify-center min-h-[40px] px-4 py-2 font-heading font-extrabold text-xs no-underline transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>{copy.fixGapBtn}</span>
                    </Link>
                    <Link
                      href={`/student/worksheet/${firstActiveGapId}`}
                      className="glass-btn-primary inline-flex items-center justify-center min-h-[40px] px-4 py-2 font-heading font-bold text-xs no-underline transition-all"
                    >
                      <span>Jump to Practice Worksheet</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-wrap gap-3 items-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleTryQuestions}
                  >
                    <span>{copy.continueLessonBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="min-h-[40px] px-3 py-1.5 inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-emerald-900/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚔️</span>
                <h2
                  id="revision-zone-heading"
                  className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-950"
                >
                  Your Revision Zone
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-emerald-800">
                {revisionQueue.length > 0
                  ? `${revisionQueue.length} Topic${revisionQueue.length > 1 ? "s" : ""} Prioritized`
                  : "All Foundations Up to Date"}
              </span>
            </div>

            {/* Companion Dialogue & Advice Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/70 shadow-xs flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0 p-2 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
                <WitchCat
                  pose={companionRevision?.pose || "greet"}
                  size={74}
                  sticker={false}
                  alt="Margam companion revision advice"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-emerald-700 uppercase tracking-wider block">
                  Companion Quest Advice • {companionRevision?.title || "Daily Check-in"}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                  &ldquo;{companionRevision?.message}&rdquo;
                </p>
              </div>

              {revisionQueue.length > 0 && (
                <div className="shrink-0">
                  <Link
                    href={revisionQueue[0].href}
                    className="glass-btn-primary inline-flex items-center justify-center min-h-[40px] px-4 py-2 font-heading font-extrabold text-xs no-underline transition-all"
                  >
                    <span>Start Revision Worksheet</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Revision Cards Grid */}
            {revisionQueue.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revisionQueue.map((item) => {
                  const isCritical = item.priority === "critical_gap";
                  const isNeedsPractice = item.priority === "needs_practice";
                  const isDue = item.priority === "due_revision";

                  const badgeColor = isCritical
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : isNeedsPractice
                    ? "bg-rose-100 text-rose-900 border-rose-300"
                    : isDue
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : "bg-sky-100 text-sky-900 border-sky-300";

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
                      className={`glass-card glass-card-hover p-5 rounded-2xl border shadow-xs flex flex-col justify-between gap-3 ${
                        isCritical ? "border-amber-300" : "border-white/70"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                          <span className="text-[11px] font-heading font-bold text-slate-500">
                            Class {item.class} • Level {item.currentDifficulty}
                          </span>
                        </div>

                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950 leading-snug">
                          {item.conceptName}
                        </h3>

                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {item.reason}
                        </p>

                        {/* Historical Attempt Improvement if recorded */}
                        {item.previousImprovement && (
                          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">
                              Prev: {item.previousImprovement.previousPercentage}% ➔ Latest: {item.previousImprovement.latestPercentage}%
                            </span>
                            <span className={`font-heading font-extrabold ${item.previousImprovement.delta >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                              {item.previousImprovement.delta >= 0 ? `+${item.previousImprovement.delta}%` : `${item.previousImprovement.delta}%`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-200/60">
                        <span className="text-[11px] font-heading font-bold text-emerald-800">
                          Mastery: {item.mastery}%
                        </span>
                        <Link
                          href={item.href}
                          className="glass-btn-primary inline-flex items-center justify-center min-h-[36px] px-3.5 py-1.5 font-heading font-extrabold text-xs no-underline transition-all"
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
              <div className="glass-panel p-6 rounded-2xl border border-white/70 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950">
                  All Math Blocks in Great Shape!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                  No concepts are currently overdue for spaced revision. Complete new lessons below to advance your learning realm!
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================================================================= */}
        {/* CLASS QUEST LEADERBOARD                                           */}
        {/* ================================================================= */}
        {profile && (
          <section id="class-leaderboard" aria-labelledby="leaderboard-heading" className="space-y-4">
            <ClassLeaderboard classId="demo-sec-10a" />
          </section>
        )}

        {/* ================================================================= */}
        {/* CHAPTERS GRID                                                     */}
        {/* ================================================================= */}
        <section id="chapters" aria-labelledby="chapters-list-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-emerald-900/10 pb-2">
            <div>
              <h2
                id="chapters-list-heading"
                className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-950"
              >
                {copy.classBadge} {currentGrade} {copy.chaptersHeading}
              </h2>
              <p className="text-xs text-emerald-900/70 mt-0.5 font-medium">
                {copy.chaptersSubtitle}
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-emerald-800 shrink-0">
              {gradeChapters.length} Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gradeChapters.map((chapter) => {
              const isReady = canTakeChapterDiagnostic(chapter.id);
              const chapterConcepts = getConceptsByChapter(chapter.id);
              const hasStarted =
                isReady &&
                chapterConcepts.some(
                  (c) =>
                    profile?.topicProgress[c.id]?.status === "completed" ||
                    profile?.topicProgress[c.id]?.status === "in_progress"
                );

              const tileState = !isReady
                ? "coming_soon"
                : hasStarted
                ? "in_progress"
                : "available";

              const localizedTitle = `Ch ${chapter.chapterNumber}: ${
                chapter.name[currentLang] || chapter.name.en
              }`;
              const localizedSubtitle = `NCERT • ${chapter.bookName}`;

              const firstConceptId = chapterConcepts[0]?.id;
              const diagnosticHref = isReady
                ? `/student/diagnostic/${chapter.id}`
                : undefined;
              const practiceHref =
                isReady && firstConceptId
                  ? `/student/worksheet/${firstConceptId}`
                  : undefined;
              const lessonHref =
                isReady && firstConceptId
                  ? `/lesson/${firstConceptId}`
                  : undefined;

              return (
                <Tile
                  key={chapter.id}
                  title={localizedTitle}
                  subtitle={localizedSubtitle}
                  tooltip={
                    !isReady
                      ? "This chapter is still being built. Try another chapter or come back soon."
                      : undefined
                  }
                  state={tileState}
                  color="wood"
                  diagnosticHref={diagnosticHref}
                  practiceHref={practiceHref}
                  lessonHref={lessonHref}
                />
              );
            })}
          </div>
        </section>

        {/* Concept Pathway & Prerequisite Graph */}
        <ConceptPathway currentLang={currentLang as SupportedLanguage} />
      </main>

      {/* Lightweight Frosted Glass Footer */}
      <Footer />
    </div>
  );
}
