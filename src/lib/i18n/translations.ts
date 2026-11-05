/**
 * Margam Central Interface Translations
 * Target audience: Indian students in Classes 6–10 (approx. ages 11–16).
 * Language styles:
 * - English: Simple Class 5 reading level, everyday vocabulary, direct active voice.
 * - Hindi: Everyday spoken Hindi understood naturally by school students;
 *          strictly avoids difficult Sanskritized/formal textbook vocabulary.
 * - Telugu: Natural, conversational, friendly teacher style;
 *          strictly avoids literal machine translations and formal/medical vocabulary.
 */

import { SupportedLanguage } from "@/lib/types";

export interface TranslationDictionary {
  common: {
    loading: string;
    save: string;
    back: string;
    next: string;
    start: string;
    finish: string;
    cancel: string;
    close: string;
    tryAgain: string;
    showMore: string;
    showLess: string;
    offlineNotice: string;
    errorGeneric: string;
    errorNetwork: string;
    selectLanguage: string;
    english: string;
    hindi: string;
    telugu: string;
    draftBadge: string;
    draftNotice: string;
  };
  nav: {
    home: string;
    learn: string;
    diagnostic: string;
    practice: string;
    stickers: string;
    profile: string;
    teacherHub: string;
    signIn: string;
    signOut: string;
    streakDays: string;
    streakDaysPlural: string;
    skipToContent: string;
    logoSubtitle: string;
  };
  home: {
    tagline: string;
    heroTitle: string;
    heroSubline: string;
    studentLabel: string;
    studentTitle: string;
    studentBody: string;
    studentBtn: string;
    studentSignIn: string;
    teacherLabel: string;
    teacherTitle: string;
    teacherBody: string;
    teacherBtn: string;
    teacherSignIn: string;
    trustLine: string;
    welcomeBack: string;
    classBadge: string;
    activeGapFound: string;
    fixGapBtn: string;
    continueLessonBtn: string;
    switchProfile: string;
    chaptersHeading: string;
    chaptersSubtitle: string;
    conceptsMastered: string;
    startQuickCheck: string;
    openLessons: string;
    ncertStandard: string;
  };
  dashboard: {
    pageTitle: string;
    loading: string;
    studyClass: string;
    streak: string;
    daysInRow: string;
    daysInRowPlural: string;
    activeGapTitle: string;
    activeGapBadge: string;
    activeGapDescFallback: string;
    fixThisTopic: string;
    recommendedNext: string;
    inProgress: string;
    completed: string;
    available: string;
    locked: string;
    startLesson: string;
    openWorksheet: string;
    takeQuickCheck: string;
    spacedRepetitionDue: string;
    startRevision: string;
    allChapters: string;
    allChaptersSubtitle: string;
    noCompletedTopics: string;
    changeClass: string;
    editProfile: string;
    overallProgress: string;
    topicsMastered: string;
    diagnosticReady: string;
    testReady: string;
    openLessons: string;
    startPractice: string;
    companionRevisionDue: string;
    companionAllClear: string;
    allClearDesc: string;
    repairedFoundations: string;
    xpLevelBadge: string;
    jumpToWorksheet: string;
    revisionZoneTitle: string;
    topicsPrioritized: string;
    allUpToDate: string;
    criticalGapBadge: string;
    needsPracticeBadge: string;
    overdueDaysBadge: string;
    revisionDueBadge: string;
    worksheetPendingBadge: string;
    startRevisionWorksheet: string;
    practiceWorksheetBtn: string;
    masteryLabel: string;
    growthDelta: string;
  };
  lesson: {
    backToLessons: string;
    goal: string;
    intuition: string;
    workedExample: string;
    problem: string;
    solution: string;
    step: string;
    keyTakeaway: string;
    practiceWorksheet: string;
    practiceIntro: string;
    draftBadge: string;
    draftNotice: string;
    variantBasics: string;
    variantStandard: string;
    variantFast: string;
    startWorksheetBtn: string;
    fromGapNotice: string;
    returnToLearningPath: string;
    lessonNotFound: string;
    lessonUnavailable: string;
    returnToLessons: string;
    backToCurriculum: string;
    loadingLesson: string;
  };
  practice: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allFilter: string;
    completedFilter: string;
    questionCounter: string;
    selectAnswer: string;
    submitAnswer: string;
    nextQuestion: string;
    finishPractice: string;
    correctTitle: string;
    incorrectTitle: string;
    explanation: string;
    tip: string;
    retryBtn: string;
    scoreSummary: string;
    reviewFoundationalLesson: string;
    backToPractice: string;
    emptySearch: string;
    adaptivePracticeTitle: string;
    reinforcing: string;
    blockRepaired: string;
    noQuestionsFound: string;
    noQuestionsDesc: string;
    returnToClassLessons: string;
    solidGrassMastery: string;
    woodMastery: string;
    unlockInLearn: string;
    viewLessons: string;
  };
  diagnostic: {
    title: string;
    subtitle: string;
    startCheck: string;
    evaluating: string;
    gapFound: string;
    gapFoundDesc: string;
    allGood: string;
    allGoodDesc: string;
    startRemediation: string;
    continueChapter: string;
    questionCount: string;
    instructions: string;
    chapterQuickCheck: string;
    returnToPath: string;
    whatToDoNext: string;
    viewAllLessons: string;
    goToHome: string;
  };
  test: {
    title: string;
    subtitle: string;
    timeRemaining: string;
    submitTest: string;
    confirmSubmit: string;
    testPassed: string;
    testPassedDesc: string;
    needsPractice: string;
    needsPracticeDesc: string;
    reviewAnswers: string;
    score: string;
    chapterMasteryTest: string;
    testBlueprint: string;
    retakeTest: string;
    returnToPath: string;
  };
  profile: {
    title: string;
    nickname: string;
    nicknameHint: string;
    studyClass: string;
    enrolledClass: string;
    classWarning: string;
    saveChanges: string;
    savedSuccess: string;
    stats: string;
    xp: string;
    level: string;
    streak: string;
    mastered: string;
    recoveryCode: string;
    recoveryCodeHint: string;
    dangerZone: string;
    resetProgress: string;
    logOut: string;
    edit: string;
    exploreCurriculum: string;
    ncertCurriculum: string;
    classSwitchProtocol: string;
  };
  stickers: {
    title: string;
    subtitle: string;
    earned: string;
    locked: string;
    howToUnlock: string;
    totalEarned: string;
    tryAgain: string;
    selectClass: string;
    blockInventory: string;
    loadingStickers: string;
  };
  login: {
    studentTab: string;
    teacherTab: string;
    studentSignInTitle: string;
    teacherSignInTitle: string;
    studentSignUpTitle: string;
    teacherSignUpTitle: string;
    enterNickname: string;
    enterPassword: string;
    selectGrade: string;
    classCode: string;
    signInBtn: string;
    signUpBtn: string;
    haveAccount: string;
    needAccount: string;
    useRecovery: string;
    invalidCredentials: string;
    recoveryCodeHelp: string;
    demoAccessTitle: string;
    demoStudentBtn: string;
    demoTeacherBtn: string;
    manualCredentialsTitle: string;
    teacherLabel: string;
    studentLabel: string;
    goBack: string;
    teacherConsentLabel: string;
    teacherConsentError: string;
  };
  teacher: {
    title: string;
    myClasses: string;
    createClass: string;
    classNamePlaceholder: string;
    selectGrade: string;
    shareCode: string;
    roster: string;
    foundationalGaps: string;
    noStudents: string;
    exportRoster: string;
    activeGapsCount: string;
    studentView: string;
    signOut: string;
    syntheticDemoClass: string;
    createNewClass: string;
    classCodeCopied: string;
    gradeLabel: string;
    studentCount: string;
    needsAttention: string;
    accuracyRate: string;
    lastActive: string;
    actions: string;
  };
  leaderboard: {
    title: string;
    weeklyXp: string;
    mostImproved: string;
    streakKings: string;
    assemblingScores: string;
    youBadge: string;
    hiddenOnLeaderboard: string;
    showOnLeaderboard: string;
    hideFromLeaderboard: string;
  };
  pathway: {
    backboneTitle: string;
    backboneSubtitle: string;
    masteredBadge: string;
    inProgressBadge: string;
    reviewBadge: string;
    lockedBadge: string;
  };
  tile: {
    comingSoon: string;
    underConstruction: string;
    questionsInForge: string;
    locked: string;
    inProgress: string;
    available: string;
    practiceWorksheet: string;
    openLesson: string;
    quickCheck: string;
  };
  footer: {
    description: string;
    privacy: string;
    terms: string;
    cookies: string;
    cookiePreferences: string;
    topBtn: string;
    allRightsReserved: string;
  };
  errors: {
    generic: string;
    network: string;
    selectAnswer: string;
    notFound: string;
    saveFailed: string;
    pageNotFoundTitle: string;
    pageNotFoundDesc: string;
    goHomeBtn: string;
    tryAgainBtn: string;
    reloadLessonBtn: string;
  };
}


export type { SupportedLanguage };

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  // ---------------------------------------------------------------------------
  // EN
  // ---------------------------------------------------------------------------
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      back: "Back",
      next: "Next",
      start: "Start",
      finish: "Finish",
      cancel: "Cancel",
      close: "Close",
      tryAgain: "Try Again",
      showMore: "Show more",
      showLess: "Show less",
      offlineNotice: "You are currently offline. Changes are saved locally.",
      errorGeneric: "Something went wrong. Please try again.",
      errorNetwork: "Network error. Please check your connection.",
      selectLanguage: "Select language",
      english: "English",
      hindi: "Hindi",
      telugu: "Telugu",
      draftBadge: "Draft translation",
      draftNotice: "This translation is in draft review.",
    },
    nav: {
      home: "Home",
      learn: "Learn",
      diagnostic: "Check",
      practice: "Practice",
      stickers: "Blocks",
      profile: "Profile",
      teacherHub: "Teacher Hub",
      signIn: "Sign in",
      signOut: "Sign out",
      streakDays: "1 day streak",
      streakDaysPlural: "{count} days streak",
      skipToContent: "Skip to main content",
      logoSubtitle: "Classes 6–10",
    },
    home: {
      tagline: "Adaptive Mathematics for Classes 6–10",
      heroTitle: "Stuck in Class 10 maths? It probably started in Class 7.",
      heroSubline: "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT Classes 6-10, in English, हिन्दी and తెలుగు.",
      studentLabel: "STUDENT",
      studentTitle: "I'm a student",
      studentBody: "Take a quick check, see what you know, then fix topics one small step at a time. No email or phone number needed.",
      studentBtn: "Start learning",
      studentSignIn: "Already have an account? Sign in",
      teacherLabel: "TEACHER",
      teacherTitle: "I'm a teacher",
      teacherBody: "Create a class, share a code, and see which foundational concepts from earlier grades your students are actually stuck on.",
      teacherBtn: "Set up my class",
      teacherSignIn: "Already registered? Sign in",
      trustLine: "Follows NCERT 2024–26 · No trackers · No email needed",
      welcomeBack: "Welcome back",
      classBadge: "Class {grade}",
      activeGapFound: "Earlier Topic You Missed",
      fixGapBtn: "Fix this topic",
      continueLessonBtn: "Next lesson",
      switchProfile: "Switch Grade / Reset Profile",
      chaptersHeading: "Maths Chapters & Quick Checks",
      chaptersSubtitle: "Choose a chapter to start a quick check or learn a lesson.",
      conceptsMastered: "Concepts Mastered",
      startQuickCheck: "Start quick check",
      openLessons: "Open lessons",
      ncertStandard: "NCERT Standard",
    },
    dashboard: {
      pageTitle: "Student Home",
      loading: "Opening student home...",
      studyClass: "Class {grade}",
      streak: "Daily streak",
      daysInRow: "1 day in a row",
      daysInRowPlural: "{count} days in a row",
      activeGapTitle: "Earlier Topic You Missed",
      activeGapBadge: "Class {grade} Prerequisite",
      activeGapDescFallback: "A quick check found an earlier topic you missed. Practicing it now will make your current lessons much easier.",
      fixThisTopic: "Fix this topic",
      recommendedNext: "Recommended next",
      inProgress: "In Progress",
      completed: "Completed",
      available: "Available",
      locked: "Locked",
      startLesson: "Start lesson",
      openWorksheet: "Open worksheet",
      takeQuickCheck: "Take quick check",
      spacedRepetitionDue: "Revision Due",
      startRevision: "Start revision",
      allChapters: "Maths Chapters & Quick Checks",
      allChaptersSubtitle: "Choose a chapter to start a quick check or learn a lesson.",
      noCompletedTopics: "No completed topics yet. Start your first lesson below!",
      changeClass: "Switch Grade / Reset Profile",
      editProfile: "Edit Profile",
      overallProgress: "Your progress",
      topicsMastered: "{count} / {total} concepts",
      diagnosticReady: "Quick check available",
      testReady: "Chapter test ready",
      openLessons: "Open lessons",
      startPractice: "Start practice",
      companionRevisionDue: "Companion Quest Advice • Revision Check-in",
      companionAllClear: "All Math Blocks in Great Shape!",
      allClearDesc: "No topics are due for revision today. Start a new lesson below to keep learning.",
      repairedFoundations: "{count} Foundations Repaired",
      xpLevelBadge: "XP Level: {level}",
      jumpToWorksheet: "Jump to Practice Worksheet",
      revisionZoneTitle: "Your Revision Zone",
      topicsPrioritized: "{count} Topics Prioritized",
      allUpToDate: "All Foundations Up to Date",
      criticalGapBadge: "CRITICAL GAP",
      needsPracticeBadge: "NEEDS PRACTICE",
      overdueDaysBadge: "OVERDUE ({days}D)",
      revisionDueBadge: "REVISION DUE",
      worksheetPendingBadge: "WORKSHEET PENDING",
      startRevisionWorksheet: "Start Revision Worksheet",
      practiceWorksheetBtn: "Practice Worksheet",
      masteryLabel: "Mastery: {percent}%",
      growthDelta: "Prev: {prev}% ➔ Latest: {latest}%",
    },
    lesson: {
      backToLessons: "Back to lessons",
      goal: "Learning Goal",
      intuition: "Core Idea",
      workedExample: "Worked Example",
      problem: "Problem",
      solution: "Solution",
      step: "Step {num}",
      keyTakeaway: "Key Takeaway",
      practiceWorksheet: "Practice Worksheet",
      practiceIntro: "Solve practice questions to master this concept.",
      draftBadge: "Draft translation",
      draftNotice: "This lesson translation is awaiting specialist review.",
      variantBasics: "Basics & Foundations",
      variantStandard: "Standard Explanation",
      variantFast: "Quick Summary",
      startWorksheetBtn: "Start Practice Worksheet",
      fromGapNotice: "This earlier concept was recommended to help you with your current lessons.",
      returnToLearningPath: "Return to Learning Path",
      lessonNotFound: "Lesson Not Found",
      lessonUnavailable: "This lesson content is not yet available.",
      returnToLessons: "Return to Lessons",
      backToCurriculum: "Back to Curriculum",
      loadingLesson: "Loading lesson...",
    },
    practice: {
      title: "Practice Worksheets",
      subtitle: "Solve questions that adapt to your understanding.",
      searchPlaceholder: "Search worksheets...",
      allFilter: "All Topics",
      completedFilter: "Completed",
      questionCounter: "Question {current} of {total}",
      selectAnswer: "Please select an answer",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      finishPractice: "Finish Worksheet",
      correctTitle: "Correct! Well done.",
      incorrectTitle: "Not quite. Here is why:",
      explanation: "Explanation",
      tip: "Helpful Tip",
      retryBtn: "Try Again",
      scoreSummary: "You answered {score} out of {total} correctly ({percent}%)",
      reviewFoundationalLesson: "Review Foundational Lesson",
      backToPractice: "Back to Practice",
      emptySearch: "No worksheets match your search.",
      adaptivePracticeTitle: "Adaptive Practice",
      reinforcing: "Reinforcing: {concept}",
      blockRepaired: "✨ Block Repaired! Foundation Restored",
      noQuestionsFound: "No Questions Found",
      noQuestionsDesc: "No practice problems available for this concept yet.",
      returnToClassLessons: "Return to Class Lessons",
      solidGrassMastery: "[///] Solid Grass (100% Mastery)",
      woodMastery: "[-] Cracked Wood",
      unlockInLearn: "Unlock in Learn",
      viewLessons: "View lessons",
    },
    diagnostic: {
      title: "Chapter Quick Check",
      subtitle: "Find out if earlier concepts need a quick review.",
      startCheck: "Start quick check",
      evaluating: "Evaluating answers...",
      gapFound: "Foundational Topic to Review",
      gapFoundDesc: "Practicing this earlier concept will make your current chapter much easier.",
      allGood: "Foundations are Strong!",
      allGoodDesc: "You are well-prepared for this chapter. Keep learning!",
      startRemediation: "Review foundational lesson",
      continueChapter: "Continue chapter lessons",
      questionCount: "3 quick questions",
      instructions: "Answer without pressure. This check helps identify topics to strengthen.",
      chapterQuickCheck: "Chapter Quick Check",
      returnToPath: "Return to Learning Path",
      whatToDoNext: "What to do next",
      viewAllLessons: "View all lessons",
      goToHome: "Go to home",
    },
    test: {
      title: "Chapter Mastery Test",
      subtitle: "Demonstrate your understanding of this entire chapter.",
      timeRemaining: "Time Remaining",
      submitTest: "Submit Test",
      confirmSubmit: "Are you sure you want to submit your test?",
      testPassed: "Congratulations! Chapter Mastered.",
      testPassedDesc: "You have shown strong understanding across all chapter concepts.",
      needsPractice: "Keep Practicing",
      needsPracticeDesc: "Review the recommended lessons below to strengthen your score.",
      reviewAnswers: "Review Answers",
      score: "Score: {score} / {total} ({percent}%)",
      chapterMasteryTest: "Chapter Mastery Test",
      testBlueprint: "Test Blueprint: {count} Questions covering all chapter concepts",
      retakeTest: "Retake Test",
      returnToPath: "Return to Learning Path",
    },
    profile: {
      title: "Student Profile & Settings",
      nickname: "Learner Nickname",
      nicknameHint: "Your friendly display name on Margam",
      studyClass: "Current Study Class",
      enrolledClass: "Enrolled Grade",
      classWarning: "Changing your class changes the syllabus displayed.",
      saveChanges: "Save Changes",
      savedSuccess: "Profile updated successfully!",
      stats: "Learning Statistics",
      xp: "Total XP",
      level: "Level",
      streak: "Current Streak",
      mastered: "Concepts Mastered",
      recoveryCode: "Secret Recovery Code",
      recoveryCodeHint: "Keep this code safe to restore your account on a new device.",
      dangerZone: "Reset Options",
      resetProgress: "Switch Grade / Reset Profile",
      logOut: "Log Out",
      edit: "Edit",
      exploreCurriculum: "Explore Curriculum",
      ncertCurriculum: "NCERT Curriculum",
      classSwitchProtocol: "Class Switch Protocol",
    },
    stickers: {
      title: "Block Inventory",
      subtitle: "Unlock badges and blocks as you learn math concepts.",
      earned: "Unlocked",
      locked: "Locked",
      howToUnlock: "How to unlock",
      totalEarned: "{count} of {total} Unlocked",
      tryAgain: "Try again",
      selectClass: "Select Class",
      blockInventory: "Block Inventory",
      loadingStickers: "Loading blocks and badges...",
    },
    login: {
      studentTab: "Student",
      teacherTab: "Teacher",
      studentSignInTitle: "Student Sign In",
      teacherSignInTitle: "Teacher Sign In",
      studentSignUpTitle: "Create Student Account",
      teacherSignUpTitle: "Create Teacher Account",
      enterNickname: "Enter your nickname",
      enterPassword: "Enter password",
      selectGrade: "Select Class Grade",
      classCode: "Class Code (optional)",
      signInBtn: "Sign In",
      signUpBtn: "Create Account",
      haveAccount: "Already have an account? Sign in",
      needAccount: "Need an account? Sign up free",
      useRecovery: "Use secret recovery code",
      invalidCredentials: "Invalid nickname or password. Please try again.",
      recoveryCodeHelp: "Enter your 16-character recovery code to sign in.",
      demoAccessTitle: "Demo Access for Live Hackathon Judging",
      demoStudentBtn: "Demo Student",
      demoTeacherBtn: "Demo Teacher",
      manualCredentialsTitle: "Manual Credentials:",
      teacherLabel: "Teacher",
      studentLabel: "Student",
      goBack: "Go back",
      teacherConsentLabel: "I confirm I am an educator and authorized to view classroom diagnostic analytics.",
      teacherConsentError: "Please confirm school or guardian consent to register as an educator.",
    },
    teacher: {
      title: "Teacher Dashboard",
      myClasses: "My Classes",
      createClass: "Create New Class",
      classNamePlaceholder: "e.g. Class 10A Mathematics",
      selectGrade: "Select Grade",
      shareCode: "Share Class Code",
      roster: "Class Roster",
      foundationalGaps: "Common Foundational Gaps",
      noStudents: "No students enrolled in this class yet.",
      exportRoster: "Export Roster",
      activeGapsCount: "{count} Foundational Gaps",
      studentView: "Student View",
      signOut: "Sign Out",
      syntheticDemoClass: "Synthetic Demo Class",
      createNewClass: "Create New Class",
      classCodeCopied: "Class code copied to clipboard!",
      gradeLabel: "Grade {grade}",
      studentCount: "{count} Students",
      needsAttention: "Needs Attention",
      accuracyRate: "Accuracy Rate",
      lastActive: "Last Active",
      actions: "Actions",
    },
    leaderboard: {
      title: "Class Quest Leaderboard",
      weeklyXp: "Weekly XP",
      mostImproved: "Most Improved",
      streakKings: "Streak Kings",
      assemblingScores: "Assembling class quest scores...",
      youBadge: "YOU",
      hiddenOnLeaderboard: "Your profile is hidden from the public leaderboard (Privacy Mode).",
      showOnLeaderboard: "Show on leaderboard",
      hideFromLeaderboard: "Hide from leaderboard",
    },
    pathway: {
      backboneTitle: "Classes 6–10 Prerequisite Backbone",
      backboneSubtitle: "Visualizes foundational math dependencies across grades. Click any node to open lesson.",
      masteredBadge: "Mastered",
      inProgressBadge: "In Progress",
      reviewBadge: "Needs Review",
      lockedBadge: "Locked",
    },
    tile: {
      comingSoon: "COMING SOON",
      underConstruction: "This chapter is still being built. Try another chapter or come back soon.",
      questionsInForge: "Questions in Forge",
      locked: "LOCKED",
      inProgress: "IN PROGRESS",
      available: "READY",
      practiceWorksheet: "Practice Worksheet",
      openLesson: "Open Lesson",
      quickCheck: "Take Quick Check",
    },
    footer: {
      description: "Margam — Adaptive Mathematics for NCERT Classes 6–10",
      privacy: "Privacy Notice",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
      cookiePreferences: "Cookie Preferences",
      topBtn: "Top",
      allRightsReserved: "Free for all students and teachers.",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Network error. Please check your connection.",
      selectAnswer: "Please select an answer",
      notFound: "Page not found",
      saveFailed: "Could not save changes.",
      pageNotFoundTitle: "Page Not Found",
      pageNotFoundDesc: "This page was not found. Tap below to return home.",
      goHomeBtn: "Go home",
      tryAgainBtn: "Try Again",
      reloadLessonBtn: "Reload Lesson",
    },
  },
  // ---------------------------------------------------------------------------
  // HI
  // ---------------------------------------------------------------------------
  hi: {
    common: {
      loading: "लोड हो रहा है...",
      save: "सहेजें",
      back: "वापस",
      next: "आगे",
      start: "शुरू करें",
      finish: "समाप्त करें",
      cancel: "रद्द करें",
      close: "बंद करें",
      tryAgain: "पुनः प्रयास करें",
      showMore: "और देखें",
      showLess: "कम देखें",
      offlineNotice: "आप अभी ऑफलाइन हैं। बदलाव स्थानीय रूप से सुरक्षित हैं।",
      errorGeneric: "कुछ त्रुटि हुई। कृपया पुनः प्रयास करें।",
      errorNetwork: "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
      selectLanguage: "भाषा चुनें",
      english: "English",
      hindi: "हिंदी",
      telugu: "तेलुगु",
      draftBadge: "प्रारूप अनुवाद",
      draftNotice: "यह अनुवाद समीक्षाधीन है।",
    },
    nav: {
      home: "मुख्य पृष्ठ",
      learn: "सीखें",
      diagnostic: "जांच",
      practice: "अभ्यास",
      stickers: "ब्लॉक",
      profile: "प्रोफाइल",
      teacherHub: "शिक्षक केंद्र",
      signIn: "साइन इन",
      signOut: "साइन आउट",
      streakDays: "1 दिन की निरंतरता",
      streakDaysPlural: "{count} दिन की निरंतरता",
      skipToContent: "मुख्य सामग्री पर जाएं",
      logoSubtitle: "कक्षा 6–10",
    },
    home: {
      tagline: "कक्षा 6–10 के लिए अनुकूली गणित",
      heroTitle: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
      heroSubline: "मार्गम् उस पुरानी कमी को खोजता है जो छूट गई थी—जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न—और उसे सुधारने का मार्ग दिखाता है। एनसीईआरटी कक्षा 6-10, अंग्रेजी, हिन्दी और తెలుగు में।",
      studentLabel: "विद्यार्थी",
      studentTitle: "मैं एक विद्यार्थी हूँ",
      studentBody: "एक संक्षिप्त जांच परीक्षा दें, अपनी समझ को देखें, और एक-एक छोटे कदम के साथ कमियों को दूर करें। किसी ईमेल या फ़ोन नंबर की आवश्यकता नहीं है।",
      studentBtn: "सीखना शुरू करें",
      studentSignIn: "पहले से खाता है? साइन इन करें",
      teacherLabel: "शिक्षक",
      teacherTitle: "मैं एक शिक्षक हूँ",
      teacherBody: "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी वास्तव में किन पुराने विषयों में कठिनाई महसूस कर रहे हैं।",
      teacherBtn: "मेरी कक्षा सेट करें",
      teacherSignIn: "पहले से पंजीकृत हैं? साइन इन करें",
      trustLine: "एनसीईआरटी 2024–26 पर आधारित · कोई ट्रैकर नहीं · ईमेल की आवश्यकता नहीं",
      welcomeBack: "पुनः स्वागत है",
      classBadge: "कक्षा {grade}",
      activeGapFound: "पिछला छूटा हुआ विषय",
      fixGapBtn: "यह विषय सुधारें",
      continueLessonBtn: "पाठ जारी रखें",
      switchProfile: "कक्षा बदलें / प्रोफाइल रीसेट करें",
      chaptersHeading: "गणित के अध्याय",
      chaptersSubtitle: "अभ्यास करने या जांच के लिए अध्याय चुनें।",
      conceptsMastered: "अवधारणाएं पूर्ण",
      startQuickCheck: "त्वरित जांच शुरू करें",
      openLessons: "पाठ खोलें",
      ncertStandard: "एनसीईआरटी मानक",
    },
    dashboard: {
      pageTitle: "विद्यार्थी मुख्य पृष्ठ",
      loading: "विद्यार्थी पृष्ठ खुल रहा है...",
      studyClass: "कक्षा {grade}",
      streak: "दैनिक निरंतरता",
      daysInRow: "लगातार 1 दिन",
      daysInRowPlural: "लगातार {count} दिन",
      activeGapTitle: "पिछला छूटा हुआ विषय",
      activeGapBadge: "कक्षा {grade} की बुनियादी आवश्यकता",
      activeGapDescFallback: "एक त्वरित जांच में एक पुराना विषय छूटा हुआ मिला। अब इसका अभ्यास करने से आपके वर्तमान पाठ बहुत आसान हो जाएंगे।",
      fixThisTopic: "यह विषय सुधारें",
      recommendedNext: "आगे का सुझाव",
      inProgress: "प्रगति पर",
      completed: "पूर्ण",
      available: "उपलब्ध",
      locked: "अनलॉक नहीं",
      startLesson: "पाठ शुरू करें",
      openWorksheet: "कार्यपत्रक खोलें",
      takeQuickCheck: "त्वरित जांच लें",
      spacedRepetitionDue: "दोहराव बाकी",
      startRevision: "दोहराव शुरू करें",
      allChapters: "गणित के अध्याय और त्वरित जांच",
      allChaptersSubtitle: "अभ्यास करने या जांच के लिए अध्याय चुनें।",
      noCompletedTopics: "अभी कोई विषय पूरा नहीं हुआ है। नीचे अपना पहला पाठ शुरू करें!",
      changeClass: "कक्षा बदलें / प्रोफाइल रीसेट करें",
      editProfile: "प्रोफाइल बदलें",
      overallProgress: "आपकी प्रगति",
      topicsMastered: "{count} / {total} विषय",
      diagnosticReady: "त्वरित जांच उपलब्ध",
      testReady: "अध्याय परीक्षा तैयार",
      openLessons: "पाठ खोलें",
      startPractice: "अभ्यास शुरू करें",
      companionRevisionDue: "साथी की सलाह • दोहराव उपस्थिति",
      companionAllClear: "सभी गणितीय विषय अच्छी स्थिति में हैं!",
      allClearDesc: "आज दोहराने के लिए कोई विषय शेष नहीं है। सीखने के लिए नीचे नया पाठ शुरू करें।",
      repairedFoundations: "{count} पुरानी कमियां सुधारीं",
      xpLevelBadge: "एक्सपी स्तर: {level}",
      jumpToWorksheet: "अभ्यास कार्यपत्रक पर जाएं",
      revisionZoneTitle: "आपका दोहराव क्षेत्र",
      topicsPrioritized: "{count} विषय प्राथमिकता पर",
      allUpToDate: "सभी बुनियादी विषय मजबूत हैं",
      criticalGapBadge: "गंभीर कमी",
      needsPracticeBadge: "अभ्यास आवश्यक",
      overdueDaysBadge: "बाकी ({days} दिन)",
      revisionDueBadge: "दोहराना आवश्यक",
      worksheetPendingBadge: "कार्यपत्रक शेष",
      startRevisionWorksheet: "दोहराव कार्यपत्रक शुरू करें",
      practiceWorksheetBtn: "अभ्यास कार्यपत्रक",
      masteryLabel: "महारत: {percent}%",
      growthDelta: "पिछला: {prev}% ➔ नवीनतम: {latest}%",
    },
    lesson: {
      backToLessons: "पाठों पर वापस",
      goal: "सीखने का उद्देश्य",
      intuition: "मूल विचार",
      workedExample: "हल किया गया उदाहरण",
      problem: "प्रश्न",
      solution: "हल",
      step: "चरण {num}",
      keyTakeaway: "मुख्य निष्कर्ष",
      practiceWorksheet: "अभ्यास कार्यपत्रक",
      practiceIntro: "इस विषय में महारत हासिल करने के लिए प्रश्नों का अभ्यास करें।",
      draftBadge: "प्रारूप अनुवाद",
      draftNotice: "इस पाठ का अनुवाद विशेषज्ञ समीक्षा के अधीन है।",
      variantBasics: "बुनियादी बातें",
      variantStandard: "विस्तृत व्याख्या",
      variantFast: "संक्षिप्त सार",
      startWorksheetBtn: "अभ्यास कार्यपत्रक शुरू करें",
      fromGapNotice: "आपके वर्तमान पाठों को आसान बनाने के लिए यह पुराना विषय सुझाया गया है।",
      returnToLearningPath: "सीखने के पथ पर लौटें",
      lessonNotFound: "पाठ नहीं मिला",
      lessonUnavailable: "यह पाठ सामग्री अभी उपलब्ध नहीं है।",
      returnToLessons: "पाठ सूची पर लौटें",
      backToCurriculum: "पाठ्यक्रम पर वापस",
      loadingLesson: "पाठ लोड हो रहा है...",
    },
    practice: {
      title: "अभ्यास कार्यपत्रक",
      subtitle: "अपनी गति के अनुसार प्रश्नों का अभ्यास करें।",
      searchPlaceholder: "कार्यपत्रक खोजें...",
      allFilter: "सभी विषय",
      completedFilter: "पूर्ण",
      questionCounter: "प्रश्न {current} / {total}",
      selectAnswer: "कृपया उत्तर चुनें",
      submitAnswer: "उत्तर जमा करें",
      nextQuestion: "अगला प्रश्न",
      finishPractice: "कार्यपत्रक पूरा करें",
      correctTitle: "सही उत्तर! बहुत बढ़िया।",
      incorrectTitle: "यह सही नहीं था। कारण देखें:",
      explanation: "व्याख्या",
      tip: "सुझाव",
      retryBtn: "पुनः प्रयास करें",
      scoreSummary: "आपने {total} में से {score} सही उत्तर दिए ({percent}%)",
      reviewFoundationalLesson: "बुनियादी पाठ दोहराएं",
      backToPractice: "अभ्यास पर वापस",
      emptySearch: "आपकी खोज से कोई कार्यपत्रक मेल नहीं खाता।",
      adaptivePracticeTitle: "अनुकूली अभ्यास",
      reinforcing: "पुख्ता कर रहे हैं: {concept}",
      blockRepaired: "✨ विषय सुधर गया! बुनियाद मजबूत हुई",
      noQuestionsFound: "कोई प्रश्न नहीं मिला",
      noQuestionsDesc: "इस अवधारणा के लिए अभी अभ्यास प्रश्न उपलब्ध नहीं हैं।",
      returnToClassLessons: "कक्षा के पाठों पर लौटें",
      solidGrassMastery: "[///] मजबूत घास (100% महारत)",
      woodMastery: "[-] कमजोर लकड़ी",
      unlockInLearn: "सीखें में अनलॉक करें",
      viewLessons: "पाठ देखें",
    },
    diagnostic: {
      title: "अध्याय की त्वरित जांच",
      subtitle: "जानें कि क्या किसी पुराने विषय को दोहराने की जरूरत है।",
      startCheck: "जांच शुरू करें",
      evaluating: "उत्तरों की जांच हो रही है...",
      gapFound: "दोहराने के लिए पुराना विषय",
      gapFoundDesc: "इस पुराने विषय का अभ्यास करने से आपका वर्तमान अध्याय बहुत आसान हो जाएगा।",
      allGood: "आपकी बुनियादी समझ मजबूत है!",
      allGoodDesc: "आप इस अध्याय के लिए पूरी तरह तैयार हैं। सीखते रहें!",
      startRemediation: "पुराना पाठ दोहराएं",
      continueChapter: "अध्याय के पाठ जारी रखें",
      questionCount: "3 संक्षिप्त प्रश्न",
      instructions: "बिना तनाव के उत्तर दें। यह जांच सिर्फ सहायता के लिए है।",
      chapterQuickCheck: "अध्याय की त्वरित जांच",
      returnToPath: "सीखने के पथ पर लौटें",
      whatToDoNext: "आगे क्या करें",
      viewAllLessons: "सभी पाठ देखें",
      goToHome: "मुख्य पृष्ठ पर जाएं",
    },
    test: {
      title: "अध्याय प्रवीणता परीक्षा",
      subtitle: "इस पूरे अध्याय पर अपनी समझ को साबित करें।",
      timeRemaining: "शेष समय",
      submitTest: "परीक्षा जमा करें",
      confirmSubmit: "क्या आप अपनी परीक्षा जमा करना चाहते हैं?",
      testPassed: "बधाई हो! अध्याय में प्रवीणता हासिल की।",
      testPassedDesc: "आपने अध्याय के सभी विषयों में बहुत अच्छी समझ दिखाई है।",
      needsPractice: "अभ्यास जारी रखें",
      needsPracticeDesc: "अपने स्कोर को बेहतर बनाने के लिए नीचे दिए गए पाठों को दोहराएं।",
      reviewAnswers: "उत्तर देखें",
      score: "प्राप्तांक: {score} / {total} ({percent}%)",
      chapterMasteryTest: "अध्याय प्रवीणता परीक्षा",
      testBlueprint: "परीक्षा रूपरेखा: {count} प्रश्न सभी मुख्य विषयों को शामिल करते हैं",
      retakeTest: "परीक्षा पुनः दें",
      returnToPath: "सीखने के पथ पर लौटें",
    },
    profile: {
      title: "विद्यार्थी प्रोफाइल और सेटिंग्स",
      nickname: "विद्यार्थी का नाम",
      nicknameHint: "मार्गम् पर आपका नाम",
      studyClass: "वर्तमान अध्ययन कक्षा",
      enrolledClass: "नामांकित कक्षा",
      classWarning: "कक्षा बदलने से दिखाया जाने वाला पाठ्यक्रम बदल जाता है।",
      saveChanges: "बदलाव सुरक्षित करें",
      savedSuccess: "प्रोफाइल सफलतापूर्वक अपडेट हो गई!",
      stats: "सीखने के आंकड़े",
      xp: "कुल एक्सपी",
      level: "स्तर",
      streak: "दैनिक निरंतरता",
      mastered: "अवधारणाएं पूर्ण",
      recoveryCode: "गोपनीय रिकवरी कोड",
      recoveryCodeHint: "नए उपकरण पर खाता पुनः प्राप्त करने के लिए इस कोड को सुरक्षित रखें।",
      dangerZone: "रीसेट विकल्प",
      resetProgress: "कक्षा बदलें / प्रोफाइल रीसेट करें",
      logOut: "लॉग आउट",
      edit: "बदलें",
      exploreCurriculum: "पाठ्यक्रम देखें",
      ncertCurriculum: "एनसीईआरटी पाठ्यक्रम",
      classSwitchProtocol: "कक्षा बदलने का नियम",
    },
    stickers: {
      title: "ब्लॉक संग्रह",
      subtitle: "गणित सीखते हुए बैज और ब्लॉक अनलॉक करें।",
      earned: "अनलॉक किया गया",
      locked: "अनलॉक नहीं",
      howToUnlock: "अनलॉक कैसे करें",
      totalEarned: "{total} में से {count} अनलॉक",
      tryAgain: "पुनः प्रयास करें",
      selectClass: "कक्षा चुनें",
      blockInventory: "ब्लॉक संग्रह",
      loadingStickers: "ब्लॉक और बैज लोड हो रहे हैं...",
    },
    login: {
      studentTab: "विद्यार्थी",
      teacherTab: "शिक्षक",
      studentSignInTitle: "विद्यार्थी साइन इन",
      teacherSignInTitle: "शिक्षक साइन इन",
      studentSignUpTitle: "विद्यार्थी खाता बनाएं",
      teacherSignUpTitle: "शिक्षक खाता बनाएं",
      enterNickname: "अपना नाम दर्ज करें",
      enterPassword: "पासवर्ड दर्ज करें",
      selectGrade: "कक्षा चुनें",
      classCode: "कक्षा कोड (वैकल्पिक)",
      signInBtn: "साइन इन",
      signUpBtn: "खाता बनाएं",
      haveAccount: "पहले से खाता है? साइन इन करें",
      needAccount: "नया खाता चाहिए? निःशुल्क बनाएं",
      useRecovery: "रिकवरी कोड का उपयोग करें",
      invalidCredentials: "नाम या पासवर्ड सही नहीं है। कृपया पुनः प्रयास करें।",
      recoveryCodeHelp: "साइन इन करने के लिए 16 अक्षरों का रिकवरी कोड दर्ज करें।",
      demoAccessTitle: "लाइव मूल्यांकन के लिए डेमो प्रवेश",
      demoStudentBtn: "डेमो विद्यार्थी",
      demoTeacherBtn: "डेमो शिक्षक",
      manualCredentialsTitle: "मैन्युअल विवरण:",
      teacherLabel: "शिक्षक",
      studentLabel: "विद्यार्थी",
      goBack: "वापस जाएं",
      teacherConsentLabel: "मैं पुष्टि करता हूँ कि मैं एक शिक्षक हूँ और कक्षा डायग्नोस्टिक रिपोर्ट देखने के लिए अधिकृत हूँ।",
      teacherConsentError: "शिक्षक के रूप में पंजीकरण करने के लिए कृपया विद्यालय या संस्थागत सहमति की पुष्टि करें।",
    },
    teacher: {
      title: "शिक्षक डैशबोर्ड",
      myClasses: "मेरी कक्षाएं",
      createClass: "नई कक्षा बनाएं",
      classNamePlaceholder: "जैसे: कक्षा 10A गणित",
      selectGrade: "कक्षा चुनें",
      shareCode: "कक्षा कोड साझा करें",
      roster: "कक्षा सूची",
      foundationalGaps: "कक्षा की मुख्य कमियां",
      noStudents: "इस कक्षा में अभी कोई विद्यार्थी नहीं है।",
      exportRoster: "सूची डाउनलोड करें",
      activeGapsCount: "{count} बुनियादी कमियां",
      studentView: "विद्यार्थी दृश्य",
      signOut: "साइन आउट",
      syntheticDemoClass: "डेमो कक्षा",
      createNewClass: "नई कक्षा बनाएं",
      classCodeCopied: "कक्षा कोड कॉपी हो गया!",
      gradeLabel: "कक्षा {grade}",
      studentCount: "{count} विद्यार्थी",
      needsAttention: "ध्यान देने योग्य",
      accuracyRate: "सटीकता दर",
      lastActive: "अंतिम सक्रियता",
      actions: "कार्य",
    },
    leaderboard: {
      title: "कक्षा लीडरबोर्ड",
      weeklyXp: "साप्ताहिक एक्सपी",
      mostImproved: "सर्वाधिक सुधार",
      streakKings: "दैनिक निरंतरता",
      assemblingScores: "स्कोर एकत्र किए जा रहे हैं...",
      youBadge: "आप",
      hiddenOnLeaderboard: "आपकी प्रोफाइल लीडरबोर्ड पर छिपी हुई है (गोपनीयता मोड)।",
      showOnLeaderboard: "लीडरबोर्ड पर दिखाएं",
      hideFromLeaderboard: "लीडरबोर्ड से छिपाएं",
    },
    pathway: {
      backboneTitle: "कक्षा 6–10 की मुख्य बुनियादी श्रृंखला",
      backboneSubtitle: "कक्षाओं के बीच गणित की निर्भरता को दर्शाता है। पाठ देखने के लिए किसी भी बिंदु पर क्लिक करें।",
      masteredBadge: "पूर्ण",
      inProgressBadge: "प्रगति पर",
      reviewBadge: "दोहराना जरूरी",
      lockedBadge: "अनलॉक नहीं",
    },
    tile: {
      comingSoon: "जल्द आ रहा है",
      underConstruction: "यह अध्याय अभी तैयार किया जा रहा है। कृपया दूसरा अध्याय चुनें।",
      questionsInForge: "प्रश्न तैयार हो रहे हैं",
      locked: "अनलॉक नहीं",
      inProgress: "प्रगति पर",
      available: "तैयार",
      practiceWorksheet: "अभ्यास कार्यपत्रक",
      openLesson: "पाठ खोलें",
      quickCheck: "त्वरित जांच लें",
    },
    footer: {
      description: "मार्गम् — एनसीईआरटी कक्षा 6–10 के लिए अनुकूली गणित",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      cookies: "कुकी नीति",
      cookiePreferences: "कुकी प्राथमिकताएँ",
      topBtn: "ऊपर जाएं",
      allRightsReserved: "सभी विद्यार्थियों और शिक्षकों के लिए निःशुल्क।",
    },
    errors: {
      generic: "कुछ त्रुटि हुई। कृपया पुनः प्रयास करें।",
      network: "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
      selectAnswer: "कृपया उत्तर चुनें",
      notFound: "पृष्ठ नहीं मिला",
      saveFailed: "बदलाव सुरक्षित नहीं हो सके।",
      pageNotFoundTitle: "पृष्ठ नहीं मिला",
      pageNotFoundDesc: "यह पृष्ठ उपलब्ध नहीं है। मुख्य पृष्ठ पर लौटने के लिए नीचे टैप करें।",
      goHomeBtn: "मुख्य पृष्ठ पर जाएं",
      tryAgainBtn: "पुनः प्रयास करें",
      reloadLessonBtn: "पाठ पुनः लोड करें",
    },
  },
  // ---------------------------------------------------------------------------
  // TE
  // ---------------------------------------------------------------------------
  te: {
    common: {
      loading: "లోడ్ అవుతోంది...",
      save: "సేవ్ చేయండి",
      back: "వెనుకకు",
      next: "తరువాత",
      start: "మొదలుపెట్టండి",
      finish: "ముగించండి",
      cancel: "రద్దు చేయండి",
      close: "మూసివేయండి",
      tryAgain: "మళ్ళీ ప్రయత్నించండి",
      showMore: "మరిన్ని చూడండి",
      showLess: "తక్కువగా చూడండి",
      offlineNotice: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. మార్పులు ఇక్కడే భద్రపరచబడ్డాయి.",
      errorGeneric: "ఏదో లోపం జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
      errorNetwork: "నెట్‌వర్క్ లోపం. మీ ఇంటర్నెట్ కనెక్షన్‌ని తనిఖీ చేయండి.",
      selectLanguage: "భాషను ఎంచుకోండి",
      english: "English",
      hindi: "హిందీ",
      telugu: "తెలుగు",
      draftBadge: "చిత్తు ప్రతి",
      draftNotice: "ఈ అనువాదం సమీక్షలో ఉంది.",
    },
    nav: {
      home: "మొదటి పేజీ",
      learn: "నేర్చుకోండి",
      diagnostic: "పరీక్ష",
      practice: "సాధన",
      stickers: "బ్లాక్స్",
      profile: "ప్రొఫైల్",
      teacherHub: "ఉపాధ్యాయ కేంద్రం",
      signIn: "సైన్ ఇన్",
      signOut: "సైన్ అవుట్",
      streakDays: "1 రోజు సాధన",
      streakDaysPlural: "{count} రోజుల సాధన",
      skipToContent: "ప్రధాన అంశానికి వెళ్లండి",
      logoSubtitle: "6–10 తరగతులు",
    },
    home: {
      tagline: "6–10 తరగతుల అనుకూల గణితం",
      heroTitle: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
      heroSubline: "మార్గం మీరు గతంలో తప్పిపోయిన పునాది అంశాన్ని గుర్తిస్తుంది—ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేత నియమాలు—మరియు దానిని సరిదిద్దేందుకు మార్గదర్శనం చేస్తుంది. NCERT 6-10 తరగతులు, English, हिन्दी మరియు తెలుగులో.",
      studentLabel: "విద్యార్థి",
      studentTitle: "నేను విద్యార్థిని",
      studentBody: "ఒక చిన్న పరీక్ష రాయండి, మీకు తెలిసిన అంశాలను చూడండి, మరియు చిన్న చిన్న దశల్లో లోపాలను సరిదిద్దండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      studentBtn: "నేర్చుకోవడం ప్రారంభించండి",
      studentSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      teacherLabel: "ఉపాధ్యాయుడు",
      teacherTitle: "నేను ఉపాధ్యాయుడిని",
      teacherBody: "తరగతిని సృష్టించండి, కోడ్‌ను పంచుకోండి, మరియు మీ విద్యార్థులు గతంలోని ఏ పునాది అంశాలలో వెనుకబడ్డారో చూడండి.",
      teacherBtn: "నా తరగతిని సిద్ధం చేయండి",
      teacherSignIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
      trustLine: "NCERT 2024–26 ఆధారంగా · ట్రాకర్లు లేవు · ఈమెయిల్ అవసరం లేదు",
      welcomeBack: "పునఃస్వాగతం",
      classBadge: "{grade}వ తరగతి",
      activeGapFound: "గతంలో తప్పిన అంశం",
      fixGapBtn: "ఈ అంశాన్ని సరిచేయండి",
      continueLessonBtn: "అభ్యాసం కొనసాగించండి",
      switchProfile: "తరగతి లేదా ప్రొఫైల్ మార్చండి",
      chaptersHeading: "గణిత అధ్యాయాలు",
      chaptersSubtitle: "అభ్యాసం చేయడానికి లేదా లోపాలను గుర్తించడానికి ఒక అధ్యాయాన్ని ఎంచుకోండి.",
      conceptsMastered: "కాన్సెప్ట్‌లు పూర్తి అయ్యాయి",
      startQuickCheck: "చిన్న పరీక్ష ప్రారంభించండి",
      openLessons: "పాఠాలు చూడండి",
      ncertStandard: "NCERT ప్రమాణాలు",
    },
    dashboard: {
      pageTitle: "విద్యార్థి మొదటి పేజీ",
      loading: "విద్యార్థి పేజీ తెరుచుకుంటోంది...",
      studyClass: "{grade}వ తరగతి",
      streak: "రోజువారీ సాధన",
      daysInRow: "వరుసగా 1 రోజు",
      daysInRowPlural: "వరుసగా {count} రోజులు",
      activeGapTitle: "గతంలో తప్పిన అంశం",
      activeGapBadge: "{grade}వ తరగతి పునాది అంశం",
      activeGapDescFallback: "చిన్న పరీక్షలో మీరు గతంలో తప్పిపోయిన ఒక అంశం కనిపించింది. ఇప్పుడు సాధన చేయడం వల్ల ప్రస్తుత పాఠాలు సులభంగా అర్థమవుతాయి.",
      fixThisTopic: "ఈ అంశాన్ని సరిచేయండి",
      recommendedNext: "తదుపరి సిఫార్సు",
      inProgress: "కొనసాగుతోంది",
      completed: "పూర్తయింది",
      available: "అందుబాటులో ఉంది",
      locked: "లాక్ చేయబడింది",
      startLesson: "పాఠం ప్రారంభించండి",
      openWorksheet: "వర్క్‌షీట్ తెరవండి",
      takeQuickCheck: "చిన్న పరీక్ష రాయండి",
      spacedRepetitionDue: "పునశ్చరణ చేయాలి",
      startRevision: "పునశ్చరణ ప్రారంభించండి",
      allChapters: "గణిత అధ్యాయాలు మరియు చిన్న పరీక్షలు",
      allChaptersSubtitle: "అభ్యాసం చేయడానికి లేదా లోపాలను గుర్తించడానికి ఒక అధ్యాయాన్ని ఎంచుకోండి.",
      noCompletedTopics: "ఇంకా ఏ అంశాలూ పూర్తి కాలేదు. మీ మొదటి పాఠాన్ని ప్రారంభించండి!",
      changeClass: "తరగతి లేదా ప్రొఫైల్ మార్చండి",
      editProfile: "ప్రొఫైల్ సవరించండి",
      overallProgress: "మీ పురోగతి",
      topicsMastered: "{count} / {total} కాన్సెప్ట్‌లు",
      diagnosticReady: "పరీక్ష అందుబాటులో ఉంది",
      testReady: "అధ్యాయం పరీక్ష సిద్ధం",
      openLessons: "పాఠాలు తెరవండి",
      startPractice: "సాధన ప్రారంభించండి",
      companionRevisionDue: "సహచరుని సలహా • పునశ్చరణ వివరాలు",
      companionAllClear: "అన్ని గణిత అంశాలు చాలా బాగున్నాయి!",
      allClearDesc: "ఈ రోజు పునశ్చరణ కోసం ఏ అంశాలూ లేవు. కొత్త పాఠాన్ని ప్రారంభించండి.",
      repairedFoundations: "{count} పునాదులు సరిచేయబడ్డాయి",
      xpLevelBadge: "XP స్థాయి: {level}",
      jumpToWorksheet: "సాధన వర్క్‌షీట్‌కు వెళ్ళండి",
      revisionZoneTitle: "మీ పునశ్చరణ విభాగం",
      topicsPrioritized: "{count} అంశాలు సిద్ధంగా ఉన్నాయి",
      allUpToDate: "అన్ని పునాదులు సిద్ధంగా ఉన్నాయి",
      criticalGapBadge: "ముఖ్యమైన లోపం",
      needsPracticeBadge: "సాధన అవసరం",
      overdueDaysBadge: "ఆలస్యం ({days} రోజులు)",
      revisionDueBadge: "పునశ్చరణ అవసరం",
      worksheetPendingBadge: "వర్క్‌షీట్ పెండింగ్",
      startRevisionWorksheet: "పునశ్చరణ వర్క్‌షీట్ ప్రారంభించండి",
      practiceWorksheetBtn: "సాధన వర్క్‌షీట్",
      masteryLabel: "పట్టు: {percent}%",
      growthDelta: "గత: {prev}% ➔ తాజా: {latest}%",
    },
    lesson: {
      backToLessons: "పాఠాలకు తిరిగి వెళ్ళండి",
      goal: "అభ్యాస లక్ష్యం",
      intuition: "ముఖ్య భావన",
      workedExample: "సాధించిన ఉదాహరణ",
      problem: "సమస్య",
      solution: "సాధన",
      step: "దశ {num}",
      keyTakeaway: "గుర్తుంచుకోవాల్సిన అంశం",
      practiceWorksheet: "సాధన వర్క్‌షీట్",
      practiceIntro: "ఈ కాన్సెప్ట్‌పై పట్టు సాధించడానికి ప్రశ్నలను సాధించండి.",
      draftBadge: "చిత్తు ప్రతి",
      draftNotice: "ఈ అనువాదం నిపుణుల సమీక్షలో ఉంది.",
      variantBasics: "ప్రాథమిక అంశాలు",
      variantStandard: "సాధారణ వివరణ",
      variantFast: "త్వరిత సారాంశం",
      startWorksheetBtn: "సాధన వర్క్‌షీట్ ప్రారంభించండి",
      fromGapNotice: "మీ ప్రస్తుత పాఠాలను సులభతరం చేయడానికి ఈ పాత అంశం సిఫార్సు చేయబడింది.",
      returnToLearningPath: "అభ్యాస మార్గానికి తిరిగి వెళ్ళండి",
      lessonNotFound: "పాఠం కనుగొనబడలేదు",
      lessonUnavailable: "ఈ పాఠం సమాచారం ఇంకా సిద్ధంగా లేదు.",
      returnToLessons: "పాఠాల జాబితాకు వెళ్ళండి",
      backToCurriculum: "సిలబస్‌కు తిరిగి వెళ్ళండి",
      loadingLesson: "పాఠం లోడ్ అవుతోంది...",
    },
    practice: {
      title: "సాధన వర్క్‌షీట్‌లు",
      subtitle: "మీ అవగాహనకు అనుగుణంగా మారే ప్రశ్నలతో సాధన చేయండి.",
      searchPlaceholder: "వర్క్‌షీట్‌లను వెతకండి...",
      allFilter: "అన్ని అంశాలు",
      completedFilter: "పూర్తయినవి",
      questionCounter: "ప్రశ్న {current} / {total}",
      selectAnswer: "దయచేసి ఒక సమాధానాన్ని ఎంచుకోండి",
      submitAnswer: "సమాధానం సమర్పించండి",
      nextQuestion: "తదుపరి ప్రశ్న",
      finishPractice: "వర్క్‌షీట్ ముగించండి",
      correctTitle: "సరైన సమాధానం! బాగుంది.",
      incorrectTitle: "సరికాదు. వివరణ చూడండి:",
      explanation: "వివరణ",
      tip: "ముఖ్యమైన చిట్కా",
      retryBtn: "మళ్ళీ ప్రయత్నించండి",
      scoreSummary: "మీరు {total}కి {score} సరైన సమాధానాలు ఇచ్చారు ({percent}%)",
      reviewFoundationalLesson: "పునాది పాఠాన్ని చదవండి",
      backToPractice: "సాధనకు తిరిగి వెళ్ళండి",
      emptySearch: "మీ వెతుకులాటకు సరిపోయే వర్క్‌షీట్‌లు లేవు.",
      adaptivePracticeTitle: "అనుకూల సాధన",
      reinforcing: "బలపరుస్తున్న కాన్సెప్ట్: {concept}",
      blockRepaired: "✨ కాన్సెప్ట్ సరిదిద్దబడింది! పునాది బలపడింది",
      noQuestionsFound: "ప్రశ్నలు కనుగొనబడలేదు",
      noQuestionsDesc: "ఈ అంశానికి సాధన ప్రశ్నలు ఇంకా అందుబాటులో లేవు.",
      returnToClassLessons: "తరగతి పాఠాలకు తిరిగి వెళ్ళండి",
      solidGrassMastery: "[///] పూర్తి పట్టు (100% నైపుణ్యం)",
      woodMastery: "[-] బలహీనమైన పునాది",
      unlockInLearn: "నేర్చుకోండిలో తెరవండి",
      viewLessons: "పాఠాలు చూడండి",
    },
    diagnostic: {
      title: "అధ్యాయం చిన్న పరీక్ష",
      subtitle: "పాత అంశాలను పునశ్చరణ చేయాల్సిన అవసరం ఉందో లేదో తెలుసుకోండి.",
      startCheck: "పరీక్ష ప్రారంభించండి",
      evaluating: "సమాధానాలను పరిశీలిస్తున్నాం...",
      gapFound: "పునశ్చరణ చేయాల్సిన పునాది అంశం",
      gapFoundDesc: "ఈ పాత అంశాన్ని సాధన చేయడం వల్ల ప్రస్తుత అధ్యాయం చాలా సులభం అవుతుంది.",
      allGood: "మీ పునాది చాలా బలంగా ఉంది!",
      allGoodDesc: "మీరు ఈ అధ్యాయం కోసం సంసిద్ధంగా ఉన్నారు. అభ్యాసాన్ని కొనసాగించండి!",
      startRemediation: "పునాది పాఠాన్ని చదవండి",
      continueChapter: "అధ్యాయం పాఠాలు కొనసాగించండి",
      questionCount: "3 చిన్న ప్రశ్నలు",
      instructions: "ఆందోళన లేకుండా సమాధానాలు ఇవ్వండి. ఇది మీకు సహాయపడటానికే.",
      chapterQuickCheck: "అధ్యాయం చిన్న పరీక్ష",
      returnToPath: "అభ్యాస మార్గానికి తిరిగి వెళ్ళండి",
      whatToDoNext: "తర్వాత ఏమి చేయాలి",
      viewAllLessons: "అన్ని పాఠాలను చూడండి",
      goToHome: "మొదటి పేజీకి వెళ్ళండి",
    },
    test: {
      title: "అధ్యాయం నైపుణ్య పరీక్ష",
      subtitle: "ఈ మొత్తం అధ్యాయంపై మీ నైపుణ్యాన్ని నిరూపించుకోండి.",
      timeRemaining: "మిగిలిన సమయం",
      submitTest: "పరీక్ష సమర్పించండి",
      confirmSubmit: "మీరు పరీక్షను ఖచ్చితంగా సమర్పించాలనుకుంటున్నారా?",
      testPassed: "అభినందనలు! అధ్యాయంపై పట్టు సాధించారు.",
      testPassedDesc: "మీరు అధ్యాయంలోని అన్ని అంశాలపై మంచి పట్టు సాధించారు.",
      needsPractice: "సాధన కొనసాగించండి",
      needsPracticeDesc: "మరింత మెరుగైన ఫలితాల కోసం కింద సూచించిన పాఠాలను చదవండి.",
      reviewAnswers: "సమాధానాలను సమీక్షించండి",
      score: "ఫలితం: {score} / {total} ({percent}%)",
      chapterMasteryTest: "అధ్యాయం నైపుణ్య పరీక్ష",
      testBlueprint: "పరీక్ష ప్రణాళిక: అన్ని కాన్సెప్ట్‌ల నుండి {count} ప్రశ్నలు",
      retakeTest: "పరీక్ష మళ్ళీ రాయండి",
      returnToPath: "అభ్యాస మార్గానికి తిరిగి వెళ్ళండి",
    },
    profile: {
      title: "విద్యార్థి ప్రొఫైల్ మరియు సెట్టింగ్‌లు",
      nickname: "విద్యార్థి పేరు",
      nicknameHint: "మార్గంలో కనిపించే మీ పేరు",
      studyClass: "ప్రస్తుత అధ్యయన తరగతి",
      enrolledClass: "చేరిన తరగతి",
      classWarning: "తరగతి మార్చడం వల్ల కనిపించే సిలబస్ మారుతుంది.",
      saveChanges: "మార్పులను భద్రపరచండి",
      savedSuccess: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!",
      stats: "అభ్యాస గణాంకాలు",
      xp: "మొత్తం XP",
      level: "స్థాయి",
      streak: "ప్రస్తుత సాధన",
      mastered: "పూర్తయిన కాన్సెప్ట్‌లు",
      recoveryCode: "రహస్య రికవరీ కోడ్",
      recoveryCodeHint: "కొత్త పరికరంలో మీ ఖాతాను తిరిగి పొందడానికి ఈ కోడ్‌ను భద్రపరుచుకోండి.",
      dangerZone: "రీసెట్ ఎంపికలు",
      resetProgress: "తరగతి లేదా ప్రొఫైల్ మార్చండి",
      logOut: "లాగ్ అవుట్",
      edit: "మార్చండి",
      exploreCurriculum: "సిలబస్ చూడండి",
      ncertCurriculum: "NCERT సిలబస్",
      classSwitchProtocol: "తరగతి మార్పు సూచన",
    },
    stickers: {
      title: "బ్లాక్ సేకరణ",
      subtitle: "గణితం నేర్చుకుంటూ బ్యాడ్జ్‌లు మరియు బ్లాక్‌లను పొందండి.",
      earned: "అన్‌లాక్ చేయబడింది",
      locked: "లాక్ చేయబడింది",
      howToUnlock: "ఎలా అన్‌లాక్ చేయాలి",
      totalEarned: "{total}లో {count} అన్‌లాక్ చేయబడ్డాయి",
      tryAgain: "మళ్ళీ ప్రయత్నించండి",
      selectClass: "తరగతిని ఎంచుకోండి",
      blockInventory: "బ్లాక్ సేకరణ",
      loadingStickers: "బ్యాడ్జ్‌లు లోడ్ అవుతున్నాయి...",
    },
    login: {
      studentTab: "విద్యార్థి",
      teacherTab: "ఉపాధ్యాయుడు",
      studentSignInTitle: "విద్యార్థి సైన్ ఇన్",
      teacherSignInTitle: "ఉపాధ్యాయుల సైన్ ఇన్",
      studentSignUpTitle: "విద్యార్థి ఖాతాను సృష్టించండి",
      teacherSignUpTitle: "ఉపాధ్యాయుల ఖాతాను సృష్టించండి",
      enterNickname: "మీ పేరు నమోదు చేయండి",
      enterPassword: "పాస్‌వర్డ్ నమోదు చేయండి",
      selectGrade: "తరగతిని ఎంచుకోండి",
      classCode: "తరగతి కోడ్ (ఐచ్ఛికం)",
      signInBtn: "సైన్ ఇన్",
      signUpBtn: "ఖాతాను సృష్టించండి",
      haveAccount: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      needAccount: "కొత్త ఖాతా కావాలా? ఉచితంగా నమోదు చేయండి",
      useRecovery: "రికవరీ కోడ్‌ని ఉపయోగించండి",
      invalidCredentials: "పేరు లేదా పాస్‌వర్డ్ సరైనది కాదు. మళ్ళీ ప్రయత్నించండి.",
      recoveryCodeHelp: "సైన్ ఇన్ చేయడానికి మీ 16 అక్షరాల రికవరీ కోడ్‌ను నమోదు చేయండి.",
      demoAccessTitle: "లైవ్ మూల్యాంకనం కోసం డెమో ప్రవేశం",
      demoStudentBtn: "డెమో విద్యార్థి",
      demoTeacherBtn: "డెమో ఉపాధ్యాయుడు",
      manualCredentialsTitle: "నేరుగా ప్రవేశ వివరాలు:",
      teacherLabel: "ఉపాధ్యాయుడు",
      studentLabel: "విద్యార్థి",
      goBack: "వెనక్కి వెళ్ళండి",
      teacherConsentLabel: "నేను ఉపాధ్యాయుడినని మరియు తరగతి గది డయాగ్నస్టిక్ నివేదికలను చూసేందుకు అధికారం కలిగి ఉన్నానని నిర్ధారిస్తున్నాను.",
      teacherConsentError: "ఉపాధ్యాయునిగా నమోదు చేసుకోవడానికి దయచేసి పాఠశాల లేదా సంస్థాగత సమ్మతిని నిర్ధారించండి.",
    },
    teacher: {
      title: "ఉపాధ్యాయుల డాష్‌బోర్డ్",
      myClasses: "నా తరగతులు",
      createClass: "కొత్త తరగతిని సృష్టించండి",
      classNamePlaceholder: "ఉదా: 10A గణితం",
      selectGrade: "తరగతిని ఎంచుకోండి",
      shareCode: "తరగతి కోడ్‌ని పంచుకోండి",
      roster: "తరగతి జాబితా",
      foundationalGaps: "సాధారణ పునాది లోపాలు",
      noStudents: "ఈ తరగతిలో ఇంకా విద్యార్థులు చేరలేదు.",
      exportRoster: "జాబితాను డౌన్‌లోడ్ చేయండి",
      activeGapsCount: "{count} పునాది లోపాలు",
      studentView: "విద్యార్థి వీక్షణ",
      signOut: "సైన్ అవుట్",
      syntheticDemoClass: "డెమో తరగతి",
      createNewClass: "కొత్త తరగతిని సృష్టించండి",
      classCodeCopied: "తరగతి కోడ్ కాపీ చేయబడింది!",
      gradeLabel: "{grade}వ తరగతి",
      studentCount: "{count} మంది విద్యార్థులు",
      needsAttention: "శ్రద్ధ అవసరం",
      accuracyRate: "ఖచ్చితత్వ శాతం",
      lastActive: "చివరిసారి చూసిన సమయం",
      actions: "చర్యలు",
    },
    leaderboard: {
      title: "తరగతి లీడర్‌బోర్డ్",
      weeklyXp: "వారపు XP",
      mostImproved: "అత్యుత్తమ పురోగతి",
      streakKings: "నిరంతర సాధన",
      assemblingScores: "స్కోర్‌లను సిద్ధం చేస్తున్నాం...",
      youBadge: "మీరు",
      hiddenOnLeaderboard: "మీ వివరాలు లీడర్‌బోర్డ్‌లో దాచబడ్డాయి (గోప్యతా మోడ్).",
      showOnLeaderboard: "లీడర్‌బోర్డ్‌లో చూపించు",
      hideFromLeaderboard: "లీడర్‌బోర్డ్ నుండి దాచు",
    },
    pathway: {
      backboneTitle: "6–10 తరగతుల ప్రధాన పునాది గొలుసు",
      backboneSubtitle: "తరగతుల మధ్య గణిత ఆధారాలను చూపుతుంది. పాఠం చూడటానికి ఏదైనా అంశంపై క్లిక్ చేయండి.",
      masteredBadge: "పూర్తయింది",
      inProgressBadge: "కొనసాగుతోంది",
      reviewBadge: "పునశ్చరణ అవసరం",
      lockedBadge: "లాక్ చేయబడింది",
    },
    tile: {
      comingSoon: "త్వరలో వస్తుంది",
      underConstruction: "ఈ అధ్యాయం ఇంకా సిద్ధమవుతోంది. మరొక అధ్యాయాన్ని ఎంచుకోండి.",
      questionsInForge: "ప్రశ్నలు సిద్ధమవుతున్నాయి",
      locked: "లాక్ చేయబడింది",
      inProgress: "కొనసాగుతోంది",
      available: "సిద్ధం",
      practiceWorksheet: "సాధన వర్క్‌షీట్",
      openLesson: "పాఠం తెరవండి",
      quickCheck: "చిన్న పరీక్ష రాయండి",
    },
    footer: {
      description: "మార్గం — NCERT 6–10 తరగతుల అనుకూల గణితం",
      privacy: "గోప్యతా విధానం",
      terms: "నిబంధనలు",
      cookies: "కుకీ విధానం",
      cookiePreferences: "కుకీ ప్రాధాన్యతలు",
      topBtn: "పైకి వెళ్ళండి",
      allRightsReserved: "విద్యార్థులు మరియు ఉపాధ్యాయులందరికీ ఉచితం.",
    },
    errors: {
      generic: "ఏదో లోపం జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
      network: "నెట్‌వర్క్ లోపం. మీ ఇంటర్నెట్ కనెక్షన్‌ని తనిఖీ చేయండి.",
      selectAnswer: "దయచేసి ఒక సమాధానాన్ని ఎంచుకోండి",
      notFound: "పేజీ కనుగొనబడలేదు",
      saveFailed: "మార్పులను భద్రపరచడం సాధ్యం కాలేదు.",
      pageNotFoundTitle: "పేజీ కనుగొనబడలేదు",
      pageNotFoundDesc: "ఈ పేజీ కనుగొనబడలేదు. మొదటి పేజీకి వెళ్ళడానికి కింద నొక్కండి.",
      goHomeBtn: "మొదటి పేజీకి వెళ్ళండి",
      tryAgainBtn: "మళ్ళీ ప్రయత్నించండి",
      reloadLessonBtn: "పాఠాన్ని మళ్ళీ లోడ్ చేయండి",
    },
  },
};

