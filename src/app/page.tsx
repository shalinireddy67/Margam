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
import { LandingSections } from "@/components/landing/LandingSections";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  clearActiveProfile,
  handleLoginSync,
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
import { isIstNightTime } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import ConceptPathway from "@/components/ConceptPathway";
import { evaluateStudentBadges } from "@/lib/badges";
import { getCatGreeting } from "@/lib/greetings";
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
    async function initActiveHomeProfile() {
      let active = getActiveProfile();
      if (!active || !active.selectedClass) {
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            if (data?.authenticated && data.user && data.user.role === "student") {
              await handleLoginSync(data.user);
              active = getActiveProfile();
            }
          }
        } catch {
          // offline
        }
      }
      if (active && active.selectedClass) {
        const updated = syncClassProgression(active);
        setProfile(updated);
        setSelectedClass(updated.selectedClass as 6 | 7 | 8 | 9 | 10);
      }
      setIsLoaded(true);
    }
    initActiveHomeProfile();
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
      tagline: "Maths for Classes 6-10",
      h1: "Stuck in Class 10 maths? It probably started in Class 7.",
      subline:
        "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT, in English, हिन्दी and తెలుగు.",
      studentLabel: "Student",
      studentTitle: "I'm a student",
      studentBody:
        "Take a short quick check, see a map of what you know, then fix gaps one small step at a time. No email or phone number needed.",
      studentBtn: "Start learning",
      studentSignIn: "Already have an account? Sign in",
      teacherLabel: "Teacher",
      teacherTitle: "I'm a teacher",
      teacherBody:
        "Make a class, share a code, and see which earlier topics your students are actually missing.",
      teacherBtn: "Set up my class",
      teacherSignIn: "Already registered? Sign in",
      trustLine: "Built around NCERT chapters for Classes 6-10 · No email or phone asked · No ad trackers",
      reviewed: true,
      welcomeBack: "Welcome back",
      classBadge: "Class",
      activeGapFound: "Earlier topic missed",
      fixGapBtn: "Fix this first",
      continueLessonBtn: "Continue lesson",
      switchProfile: "Switch class or reset profile",
      chaptersHeading: "Maths chapters and quick checks",
      chaptersSubtitle: "Choose a chapter to check for earlier topics you missed or start lessons.",
      teacherLink: "Teacher",
      conceptsMastered: "concepts completed",
    },
    hi: {
      appName: "मार्गम्",
      tagline: "कक्षा 6-10 के लिए गणित",
      h1: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
      subline:
        "मार्गम् उस पिछली कमी को खोजता है जो छूट गई थी, जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न, और उसे सुधारने का रास्ता दिखाता है। एनसीईआरटी, अंग्रेजी, हिन्दी और తెలుగు में।",
      studentLabel: "Student",
      studentTitle: "मैं एक विद्यार्थी हूँ",
      studentBody:
        "एक छोटी जांच परीक्षा दें, अपनी समझ का नक्शा देखें, और एक-एक छोटे कदम से कमियों को ठीक करें। किसी ईमेल या फ़ोन नंबर की जरूरत नहीं है।",
      studentBtn: "सीखना शुरू करें",
      studentSignIn: "पहले से खाता है? साइन इन करें",
      teacherLabel: "Teacher",
      teacherTitle: "मैं एक शिक्षक हूँ",
      teacherBody:
        "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी वास्तव में किन पिछली कक्षाओं के विषयों में अटक रहे हैं।",
      teacherBtn: "मेरी कक्षा सेट करें",
      teacherSignIn: "पहले से पंजीकृत हैं? साइन इन करें",
      trustLine: "कक्षा 6-10 के एनसीईआरटी अध्यायों पर आधारित · न ईमेल, न फ़ोन · कोई विज्ञापन ट्रैकर नहीं",
      reviewed: false,
      welcomeBack: "पुनः स्वागत है",
      classBadge: "कक्षा",
      activeGapFound: "बुनियादी कमी पाई गई",
      fixGapBtn: "पहले इसे सुधारें",
      continueLessonBtn: "पाठ जारी रखें",
      switchProfile: "कक्षा बदलें या प्रोफ़ाइल रीसेट करें",
      chaptersHeading: "गणित के अध्याय और जांच",
      chaptersSubtitle: "बुनियादी कमियों की जांच या पाठ शुरू करने के लिए अध्याय चुनें।",
      teacherLink: "शिक्षक",
      conceptsMastered: "अवधारणाएं पूर्ण",
    },
    te: {
      appName: "మార్గం",
      tagline: "6-10 తరగతుల గణితం",
      h1: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
      subline:
        "మార్గం మీరు గతంలో తప్పిపోయిన పాఠాన్ని గుర్తిస్తుంది, ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేత నియమాలు, మరియు దానిని సరిదిద్దేందుకు మార్గదర్శనం చేస్తుంది. NCERT, English, हिन्दी మరియు తెలుగులో.",
      studentLabel: "Student",
      studentTitle: "నేను విద్యార్థిని",
      studentBody:
        "ఒక చిన్న రోగనిర్ధారణ పరీక్ష రాయండి, మీకు తెలిసిన విషయాల మ్యాప్ చూడండి, మరియు చిన్న చిన్న దశల్లో లోపాలను సరిదిద్దండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      studentBtn: "నేర్చుకోవడం ప్రారంభించండి",
      studentSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      teacherLabel: "Teacher",
      teacherTitle: "నేను ఉపాధ్యాయుడిని",
      teacherBody:
        "తరగతిని సృష్టించండి, కోడ్‌ను పంచుకోండి, మరియు మీ విద్యార్థులు ఏ మునుపటి అంశాలలో వెనుకబడ్డారో చూడండి.",
      teacherBtn: "నా తరగతిని సిద్ధం చేయండి",
      teacherSignIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
      trustLine: "6-10 తరగతుల NCERT అధ్యాయాల ఆధారంగా · ఈమెయిల్ లేదా ఫోన్ అడగము · యాడ్ ట్రాకర్లు లేవు",
      reviewed: false,
      welcomeBack: "పునఃస్వాగతం",
      classBadge: "తరగతి",
      activeGapFound: "పునాది లోపం గుర్తించబడింది",
      fixGapBtn: "ముందుగా దీన్ని సరిచేయండి",
      continueLessonBtn: "పాఠం కొనసాగించండి",
      switchProfile: "తరగతి మార్చండి లేదా ప్రొఫైల్ రీసెట్ చేయండి",
      chaptersHeading: "గణిత అధ్యాయాలు మరియు రోగనిర్ధారణ",
      chaptersSubtitle: "పునాది లోపాలను గుర్తించడానికి లేదా పాఠాలు ప్రారంభించడానికి అధ్యాయాన్ని ఎంచుకోండి.",
      teacherLink: "ఉపాధ్యాయుడు",
      conceptsMastered: "పూర్తయిన కాన్సెప్ట్‌లు",
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
          <LandingSections currentLang={currentLang as ("en" | "hi" | "te")} />
        )}

        {/* STUDENT DASHBOARD (When Profile is Active)                        */}
        {/* ================================================================= */}
        {profile && (
          <section aria-labelledby="dashboard-heading" className="space-y-6">
            {/* Student Dashboard Banner */}
            <div className="p-6 sm:p-7 bg-[#FFFDF7] border-3 border-[#2B1B0F] border-t-4 border-t-[#5DAA3A] shadow-block space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-pixel text-[#5DAA3A] uppercase tracking-wider block">
                    {catGreeting.text}
                  </span>
                  <h1
                    id="dashboard-heading"
                    className="font-pixel text-lg sm:text-xl md:text-2xl text-[#2B1B0F] leading-tight"
                  >
                    {profile.name}
                  </h1>
                  <p className="text-xs text-[#2B1B0F]/70 mt-1 font-bold">
                    Class {profile.selectedClass}, level {profile.currentDifficulty} of 3
                  </p>
                </div>

                {/* Progress / Mastery Stats */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                  <span className="px-3 py-1 bg-[#5DAA3A] text-white border-2 border-[#2B1B0F] font-heading font-bold text-xs shadow-[2px_2px_0px_#2B1B0F]">
                    {completedConceptsCount} {copy.conceptsMastered}
                  </span>
                  {resolvedGapsCount > 0 && (
                    <span className="px-3 py-1 bg-[#F4C542] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-bold text-xs shadow-[2px_2px_0px_#2B1B0F] flex items-center gap-1.5">
                      <span>✦ {resolvedGapsCount} Foundations Repaired</span>
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#2B1B0F]">
                    XP Level: {Math.max(1, completedConceptsCount * 10 + resolvedGapsCount * 25)}
                  </span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-[#2B1B0F]/70">Topic progress</span>
                  <span className="text-[#2B1B0F] font-bold">
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
                <div className="p-5 bg-[#FFF7E6] border-3 border-[#2B1B0F] border-l-[8px] border-l-[#E04A3F] shadow-block space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[#2B1B0F]">
                      <AlertCircle className="w-5 h-5 shrink-0 text-[#E04A3F]" />
                      <span className="font-heading font-extrabold text-xs sm:text-sm">
                        {copy.activeGapFound} {gapConcept ? `(Class ${gapConcept.class})` : ""}
                      </span>
                    </div>
                    {gapConcept && (
                      <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F]">
                        Class {gapConcept.class} earlier topic
                      </span>
                    )}
                  </div>

                  {gapConcept && (
                    <h3 className="font-pixel text-sm sm:text-base text-[#2B1B0F]">
                      {gapConcept.name[currentLang] || gapConcept.name.en}
                    </h3>
                  )}

                  <p className="text-xs text-[#2B1B0F]/80 leading-relaxed font-sans">
                    {profile?.activeGap?.plainLanguageReason ||
                      "Our quick check found an earlier topic you missed. Fixing this first makes your current class topics much simpler."}
                  </p>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/lesson/${firstActiveGapId}?fromGap=true`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#F4C542] hover:bg-[#F4C542]/20 text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#2B1B0F] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                    >
                      <span>{copy.fixGapBtn}</span>
                    </Link>
                    <Link
                      href={`/student/worksheet/${firstActiveGapId}`}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#5DAA3A] hover:brightness-105 text-white border-2 border-[#2B1B0F] font-heading font-bold text-xs shadow-[2px_2px_0px_#2B1B0F] no-underline transition-colors"
                    >
                      <span>Start practice</span>
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
                    className="min-h-[44px] px-3 py-2 inline-flex items-center text-xs font-bold text-[#2B1B0F]/70 hover:text-[#2B1B0F] underline cursor-pointer"
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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#2B1B0F] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚔️</span>
                <h2
                  id="revision-zone-heading"
                  className="font-pixel text-base sm:text-lg text-[#2B1B0F]"
                >
                  Your revision topics
                </h2>
              </div>
              <span className="text-xs font-pixel text-[#5DAA3A]">
                {revisionQueue.length > 0
                  ? `${revisionQueue.length} Topic${revisionQueue.length > 1 ? "s" : ""} Prioritized`
                  : "All Foundations Up to Date"}
              </span>
            </div>

            {/* Daily Revision Advice Card */}
            {companionRevision && (
              <div className="p-4 sm:p-5 bg-[#FFFDF7] border-3 border-[#2B1B0F] shadow-block flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-pixel text-[#5DAA3A] uppercase tracking-wider block">
                    Daily check-in: {companionRevision.title || "Spaced revision"}
                  </span>
                  <p className="text-xs sm:text-sm text-[#2B1B0F] font-medium leading-relaxed font-sans">
                    &ldquo;{companionRevision.message}&rdquo;
                  </p>
                </div>

                {revisionQueue.length > 0 && (
                  <div className="shrink-0">
                    <Link
                      href={revisionQueue[0].href}
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#5DAA3A] hover:brightness-105 text-white border-2 border-[#2B1B0F] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#2B1B0F] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                    >
                      <span>Start revision</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Revision Cards Grid */}
            {revisionQueue.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {revisionQueue.map((item) => {
                  const isCritical = item.priority === "critical_gap";
                  const isNeedsPractice = item.priority === "needs_practice";
                  const isDue = item.priority === "due_revision";

                  const badgeColor = isCritical
                    ? "bg-[#F4C542] text-[#2B1B0F] border-[#2B1B0F]"
                    : isNeedsPractice
                    ? "bg-[#E04A3F] text-white border-[#2B1B0F]"
                    : isDue
                    ? "bg-[#5DAA3A] text-white border-[#2B1B0F]"
                    : "bg-[#3FA7C9] text-white border-[#2B1B0F]";

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
                      className="p-4 bg-[#FFFDF7] border-3 border-[#2B1B0F] shadow-block flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[10px] font-pixel border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                          <span className="text-[11px] font-sans font-bold text-[#2B1B0F]/70">
                            Class {item.class}, level {item.currentDifficulty}
                          </span>
                        </div>

                        <h3 className="font-pixel text-xs sm:text-sm text-[#2B1B0F] leading-snug">
                          {item.conceptName}
                        </h3>

                        <p className="text-xs text-[#2B1B0F]/80 leading-relaxed font-sans">
                          {item.reason}
                        </p>

                        {/* Historical Attempt Improvement if recorded */}
                        {item.previousImprovement && (
                          <div className="p-2 bg-[#FFF7E6] border border-[#2B1B0F] flex items-center justify-between text-[11px]">
                            <span className="text-[#2B1B0F]/70">
                              Prev: {item.previousImprovement.previousPercentage}% ➔ Latest: {item.previousImprovement.latestPercentage}%
                            </span>
                            <span className={`font-bold ${item.previousImprovement.delta >= 0 ? "text-[#5DAA3A]" : "text-[#E04A3F]"}`}>
                              {item.previousImprovement.delta >= 0 ? `+${item.previousImprovement.delta}%` : `${item.previousImprovement.delta}%`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#2B1B0F]">
                        <span className="text-[11px] font-pixel text-[#5DAA3A]">
                          Progress: {item.mastery}%
                        </span>
                        <Link
                          href={item.href}
                          className="inline-flex items-center justify-center min-h-[38px] px-3.5 py-1.5 bg-[#5DAA3A] hover:brightness-105 text-white border-2 border-[#2B1B0F] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#2B1B0F] no-underline active:translate-x-[1px] active:translate-y-[1px] transition-colors"
                        >
                          <span>Start practice</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-[#FFFDF7] border-3 border-[#2B1B0F] shadow-block text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#5DAA3A] mx-auto" />
                <h3 className="font-pixel text-xs sm:text-sm text-[#2B1B0F]">
                  All math topics in good shape
                </h3>
                <p className="text-xs text-[#2B1B0F]/70 max-w-md mx-auto font-sans">
                  No concepts are currently overdue for spaced revision. Complete new lessons below to keep moving forward.
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
        {profile && (
          <>
        {/* CHAPTERS GRID (Block-world Tiles)                             */}
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
            <span className="text-xs font-heading font-bold text-[#2B1B0F] shrink-0">
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
              const localizedSubtitle = `NCERT, ${chapter.bookName}`;

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
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-heading font-bold text-[#2B1B0F] underline"
            >
              {copy.teacherLink}
            </Link>
          </div>
        )}
        </>
        )}
      </main>

      {/* Slim Brown Ground-Strip Footer */}
      <Footer />
    </div>
  );
}
