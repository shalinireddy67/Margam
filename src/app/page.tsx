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
import { Companion } from "@/components/ui/Companion";
import { isIstNightTime } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import ConceptPathway from "@/components/ConceptPathway";
import { evaluateStudentBadges } from "@/lib/badges";
import { getLearnerGreeting } from "@/lib/greetings";
import { Sparkles, AlertCircle, ArrowRight, RotateCcw, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
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
      tagline: "Adaptive Mathematics for Classes 6–10",
      h1: "Stuck in Class 10 maths? It probably started in Class 7.",
      subline:
        "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT Classes 6-10, in English, हिन्दी and తెలుగు.",
      studentLabel: "STUDENT",
      studentTitle: "I'm a student",
      studentBody:
        "Take a short diagnostic, see a map of what you know, then fix gaps one small step at a time. No email or phone number needed.",
      studentBtn: "Start learning",
      studentSignIn: "Already have an account? Sign in",
      teacherLabel: "TEACHER",
      teacherTitle: "I'm a teacher",
      teacherBody:
        "Create a class, share a code, and see which foundational concepts from earlier grades your students are actually stuck on.",
      teacherBtn: "Set up my class",
      teacherSignIn: "Already registered? Sign in",
      trustLine: "Follows NCERT 2024–26 · No trackers · No email needed",
      reviewed: true,
      welcomeBack: "Welcome back",
      classBadge: "Class",
      activeGapFound: "Prerequisite Gap Detected",
      fixGapBtn: "Strengthen Foundation",
      continueLessonBtn: "Continue Quest",
      switchProfile: "Switch Grade / Reset Profile",
      chaptersHeading: "Math Chapters & Diagnostics",
      chaptersSubtitle: "Choose a chapter to diagnose prerequisite mastery or start lessons.",
      teacherLink: "Teacher Hub",
      conceptsMastered: "Concepts Mastered",
    },
    hi: {
      appName: "मार्गम्",
      tagline: "कक्षा 6–10 के लिए अनुकूली गणित",
      h1: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
      subline:
        "मार्गम् उस पुरानी कमी को खोजता है जो छूट गई थी—जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न—और उसे सुधारने का मार्ग दिखाता है। एनसीईआरटी कक्षा 6-10, अंग्रेजी, हिन्दी और తెలుగు में।",
      studentLabel: "STUDENT",
      studentTitle: "मैं एक विद्यार्थी हूँ",
      studentBody:
        "एक संक्षिप्त जांच परीक्षा दें, अपनी समझ का मानचित्र देखें, और एक-एक छोटे कदम के साथ कमियों को दूर करें। किसी ईमेल या फ़ोन नंबर की आवश्यकता नहीं है।",
      studentBtn: "सीखना शुरू करें",
      studentSignIn: "पहले से खाता है? साइन इन करें",
      teacherLabel: "TEACHER",
      teacherTitle: "मैं एक शिक्षक हूँ",
      teacherBody:
        "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी वास्तव में किन पुराने विषयों में कठिनाई महसूस कर रहे हैं।",
      teacherBtn: "मेरी कक्षा सेट करें",
      teacherSignIn: "पहले से पंजीकृत हैं? साइन इन करें",
      trustLine: "एनसीईआरटी 2024–26 पर आधारित · कोई ट्रैकर नहीं · ईमेल की आवश्यकता नहीं",
      reviewed: false,
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
      tagline: "6–10 తరగతుల అనుకూల గణితం",
      h1: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
      subline:
        "మార్గం మీరు గతంలో తప్పిపోయిన పునాది అంశాన్ని గుర్తిస్తుంది—ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేత నియమాలు—మరియు దానిని సరిదిద్దేందుకు మార్గదర్శనం చేస్తుంది. NCERT 6-10 తరగతులు, English, हिन्दी మరియు తెలుగులో.",
      studentLabel: "STUDENT",
      studentTitle: "నేను విద్యార్థిని",
      studentBody:
        "ఒక చిన్న రోగనిర్ధారణ పరీక్ష రాయండి, మీకు తెలిసిన అంశాల పటాన్ని చూడండి, మరియు చిన్న చిన్న దశల్లో లోపాలను సరిదిద్దండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      studentBtn: "నేర్చుకోవడం ప్రారంభించండి",
      studentSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      teacherLabel: "TEACHER",
      teacherTitle: "నేను ఉపాధ్యాయుడిని",
      teacherBody:
        "తరగతిని సృష్టించండి, కోడ్‌ను పంచుకోండి, మరియు మీ విద్యార్థులు గతంలోని ఏ పునాది అంశాలలో వెనుకబడ్డారో చూడండి.",
      teacherBtn: "నా తరగతిని సిద్ధం చేయండి",
      teacherSignIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
      trustLine: "NCERT 2024–26 ఆధారంగా · ట్రాకర్లు లేవు · ఈమెయిల్ అవసరం లేదు",
      reviewed: false,
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
  const learnerGreeting = getLearnerGreeting(profile?.name, currentLang);
  const revisionQueue = profile ? getRevisionQueue(profile, 4) : [];
  const companionRevision = profile ? getCompanionRevisionGreeting(revisionQueue, profile) : null;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
        <div className="p-6 border-[3px] border-[#2B1B0F] bg-[#FFFFFF] shadow-[4px_4px_0px_#2B1B0F] text-center text-[#2B1B0F]">
          <p className="font-heading font-extrabold text-base text-[#2B1B0F] animate-pulse">
            Loading Margam...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between bg-sky-cream-gradient">
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* Unified Responsive Navigation (Top Navbar on Desktop, Left Rail on Tablet, Bottom Bar on Mobile) */}
      <Navigation
        currentTab="home"
        currentLang={currentLang as SupportedLanguage}
        onLanguageChange={(lang) => setCurrentLang(lang as Language)}
        profile={profile}
      />

      {/* Main Content Container: Fluid padding, centered max-w-[1200px], safe-area bottom */}
      <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10 md:pl-28 lg:pl-8 pb-16 flex-1 w-full">
        {/* ================================================================= */}
        {/* ONBOARDING / LANDING (For First-Time Visitors)                    */}
        {/* ================================================================= */}
        {!profile && (
          <section aria-labelledby="hero-heading" className="space-y-10 sm:space-y-12 py-4 sm:py-8">
            {/* Hero Section: Learning Companion Mascot + H1 + Subline */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
              <div className="shrink-0 mb-2 p-2 bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F]">
                <Companion
                  pose={isIstNightTime() ? "sleepy" : "greet"}
                  size={110}
                  sticker={false}
                  alt="Margam learning companion"
                />
              </div>

              <h1
                id="hero-heading"
                className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-[#2B1B0F] leading-tight max-w-[22ch]"
              >
                {copy.h1}
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#2B1B0F] max-w-[65ch] leading-relaxed">
                {copy.subline}
              </p>
            </div>

            {/* Two Role Cards: Student & Teacher (side by side on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
              {/* Card 1: Student */}
              <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="font-pixel text-[11px] uppercase tracking-wider text-[#5DAA3A] block">
                    {copy.studentLabel}
                  </span>
                  <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                    {copy.studentTitle}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                    {copy.studentBody}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href="/login?role=student"
                    className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                  >
                    <span>{copy.studentBtn}</span>
                    <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
                  </Link>

                  <div className="text-center">
                    <Link
                      href="/login?role=student"
                      className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                    >
                      {copy.studentSignIn}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Teacher */}
              <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="font-pixel text-[11px] uppercase tracking-wider text-[#3FA7C9] block">
                    {copy.teacherLabel}
                  </span>
                  <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                    {copy.teacherTitle}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                    {copy.teacherBody}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href="/login?role=teacher"
                    className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                  >
                    <span>{copy.teacherBtn}</span>
                    <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
                  </Link>

                  <div className="text-center">
                    <Link
                      href="/login?role=teacher"
                      className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                    >
                      {copy.teacherSignIn}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Line Below Cards */}
            <div className="text-center pt-2 pb-4">
              <p className="font-sans text-sm text-[#5A3720] max-w-none">
                {copy.trustLine}
              </p>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* STUDENT DASHBOARD (When Profile is Active)                        */}
        {/* ================================================================= */}
        {profile && (
          <section aria-labelledby="dashboard-heading" className="space-y-6">
            {/* Hero Student Realm Banner */}
            <div className="p-6 sm:p-7 bg-[#5A3720] border-4 border-[#422816] border-t-4 border-t-[#FFE9A8] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Mascot Companion with Pose */}
                  <div className="shrink-0 p-2 bg-[#422816] border-2 border-[#7A4B2A] shadow-[3px_3px_0px_rgba(0,0,0,0.4)]">
                    <Companion
                      pose="cheer"
                      size={90}
                      sticker={false}
                      alt="Margam Learning Companion"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-[#FFE9A8] uppercase tracking-wider block">
                      {learnerGreeting.text}
                    </span>
                    <h1
                      id="dashboard-heading"
                      className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFF7E6] leading-tight drop-shadow-[2px_2px_0px_#422816]"
                    >
                      {profile.name}
                    </h1>
                    <p className="text-xs text-[#E5D7BE] mt-1 font-bold">
                      Class {profile.selectedClass} Realm • Adaptive Level {profile.currentDifficulty} / 3
                    </p>
                  </div>
                </div>

                {/* Progress / Mastery Stats */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                  <span className="px-3 py-1 bg-[#5DAA3A] text-[#FFF7E6] border-2 border-[#422816] font-heading font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
                    {completedConceptsCount} {copy.conceptsMastered}
                  </span>
                  {resolvedGapsCount > 0 && (
                    <span className="px-3 py-1 bg-[#FFE9A8] text-[#2B1B0F] border-2 border-[#422816] font-heading font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{resolvedGapsCount} Foundations Repaired</span>
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#FFE9A8]">
                    XP Level: {Math.max(1, completedConceptsCount * 10 + resolvedGapsCount * 25)}
                  </span>
                </div>
              </div>

              {/* Minecraft XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-[#E5D7BE]">Realm Mastery Progress</span>
                  <span className="text-[#FFE9A8]">
                    {completedConceptsCount} / {gradeChapters.length * 2} concepts
                  </span>
                </div>
                <ProgressBar
                  value={completedConceptsCount}
                  max={Math.max(1, gradeChapters.length * 2)}
                  segments={12}
                  color="grass"
                />
              </div>

              {/* Segmented XP Progress */}
              <SegmentedXpBar currentXp={profile.xp || 0} />

              {/* Active Gap Remediation Box if Found */}
              {firstActiveGapId ? (
                <div className="p-5 bg-[#422816] border-3 border-[#FFE9A8] border-l-[8px] border-l-[#FFE9A8] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[#FFE9A8]">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-heading font-extrabold text-xs sm:text-sm">
                        {copy.activeGapFound} {gapConcept ? `(Class ${gapConcept.class})` : ""}
                      </span>
                    </div>
                    {gapConcept && (
                      <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#FFE9A8] text-[#2B1B0F] border border-[#422816]">
                        Class {gapConcept.class} Prerequisite
                      </span>
                    )}
                  </div>

                  {gapConcept && (
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6]">
                      {gapConcept.name[currentLang] || gapConcept.name.en}
                    </h3>
                  )}

                  <p className="text-xs text-[#E5D7BE] leading-relaxed">
                    {profile?.activeGap?.plainLanguageReason ||
                      "Our diagnostic detected an underlying prerequisite gap. Strengthening this foundation will make your current grade quests much easier!"}
                  </p>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/lesson/${firstActiveGapId}?fromGap=true`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#FFE9A8] hover:bg-[#FFF2CC] text-[#2B1B0F] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>{copy.fixGapBtn}</span>
                    </Link>
                    <Link
                      href={`/student/worksheet/${firstActiveGapId}`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline transition-colors"
                    >
                      <span>Jump to Practice Worksheet</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-wrap gap-3 items-center">
                  <Button
                    variant="grass"
                    size="sm"
                    onClick={handleTryQuestions}
                  >
                    <span>{copy.continueLessonBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="min-h-[44px] px-3 py-2 inline-flex items-center text-xs font-bold text-[#E5D7BE] hover:text-[#FFE9A8] underline cursor-pointer"
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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#7A4B2A] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FFE9A8] text-lg">⚔️</span>
                <h2
                  id="revision-zone-heading"
                  className="font-heading font-extrabold text-xl sm:text-2xl text-[#FFF7E6]"
                >
                  Your Revision Zone
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-[#FFE9A8]">
                {revisionQueue.length > 0
                  ? `${revisionQueue.length} Topic${revisionQueue.length > 1 ? "s" : ""} Prioritized`
                  : "All Foundations Up to Date"}
              </span>
            </div>

            {/* Companion Dialogue & Advice Card */}
            <div className="p-4 sm:p-5 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0 p-1.5 bg-[#422816] border-2 border-[#7A4B2A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
                <Companion
                  pose={companionRevision?.pose || "greet"}
                  size={74}
                  sticker={false}
                  alt="Margam Zombie Chicken Jockey companion revision advice"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-heading font-extrabold text-[#FFE9A8] uppercase tracking-wider block">
                  Companion Quest Advice • {companionRevision?.title || "Daily Check-in"}
                </span>
                <p className="text-xs sm:text-sm text-[#FFF7E6] font-medium leading-relaxed">
                  &ldquo;{companionRevision?.message}&rdquo;
                </p>
              </div>

              {revisionQueue.length > 0 && (
                <div className="shrink-0">
                  <Link
                    href={revisionQueue[0].href}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                  >
                    <span>Start Revision Worksheet</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Revision Cards Grid */}
            {revisionQueue.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {revisionQueue.map((item) => {
                  const isCritical = item.priority === "critical_gap";
                  const isNeedsPractice = item.priority === "needs_practice";
                  const isDue = item.priority === "due_revision";

                  const badgeColor = isCritical
                    ? "bg-[#FFE9A8] text-[#2B1B0F] border-[#422816]"
                    : isNeedsPractice
                    ? "bg-[#E04A3F] text-[#FFF7E6] border-[#422816]"
                    : isDue
                    ? "bg-[#5DAA3A] text-[#FFF7E6] border-[#422816]"
                    : "bg-[#3FA7C9] text-[#FFF7E6] border-[#422816]";

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
                      className={`p-4 bg-[#5A3720] border-3 shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex flex-col justify-between gap-3 ${
                        isCritical ? "border-[#FFE9A8]" : "border-[#7A4B2A]"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[10px] font-heading font-extrabold border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                          <span className="text-[11px] font-heading font-bold text-[#E5D7BE]">
                            Class {item.class} • Level {item.currentDifficulty}
                          </span>
                        </div>

                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6] leading-snug">
                          {item.conceptName}
                        </h3>

                        <p className="text-xs text-[#E5D7BE] leading-relaxed">
                          {item.reason}
                        </p>

                        {/* Historical Attempt Improvement if recorded */}
                        {item.previousImprovement && (
                          <div className="p-2 bg-[#422816] border border-[#7A4B2A] flex items-center justify-between text-[11px]">
                            <span className="text-[#E5D7BE]">
                              Prev: {item.previousImprovement.previousPercentage}% ➔ Latest: {item.previousImprovement.latestPercentage}%
                            </span>
                            <span className={`font-heading font-extrabold ${item.previousImprovement.delta >= 0 ? "text-[#5DAA3A]" : "text-[#E04A3F]"}`}>
                              {item.previousImprovement.delta >= 0 ? `+${item.previousImprovement.delta}%` : `${item.previousImprovement.delta}%`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#7A4B2A]">
                        <span className="text-[11px] font-heading font-bold text-[#FFE9A8]">
                          Mastery: {item.mastery}%
                        </span>
                        <Link
                          href={item.href}
                          className="inline-flex items-center justify-center min-h-[38px] px-3.5 py-1.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#FFF7E6] border-2 border-[#422816] font-heading font-extrabold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.4)] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
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
              <div className="p-6 bg-[#5A3720] border-3 border-[#7A4B2A] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#5DAA3A] mx-auto" />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6]">
                  All Math Blocks in Great Shape!
                </h3>
                <p className="text-xs text-[#E5D7BE] max-w-md mx-auto">
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
        {/* CHAPTERS GRID (Minecraft Voxel Tiles)                             */}
        {/* ================================================================= */}
        <section id="chapters" aria-labelledby="chapters-list-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#7A4B2A] pb-2">
            <div>
              <h2
                id="chapters-list-heading"
                className="font-heading font-extrabold text-xl sm:text-2xl text-[#FFF7E6]"
              >
                {copy.classBadge} {currentGrade} {copy.chaptersHeading}
              </h2>
              <p className="text-xs text-[#E5D7BE]/80 mt-0.5">
                {copy.chaptersSubtitle}
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-[#FFE9A8] shrink-0">
              {gradeChapters.length} Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Small Teacher link for mobile footer */}
        {isFeatureEnabled("FEATURE_TEACHER_TOOLS") && (
          <div className="pt-4 text-center sm:hidden">
            <Link
              href="/teacher"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-heading font-bold text-[#FFE9A8] underline"
            >
              {copy.teacherLink}
            </Link>
          </div>
        )}
      </main>

      {/* Slim Brown Ground-Strip Footer */}
      <Footer />
    </div>
  );
}
