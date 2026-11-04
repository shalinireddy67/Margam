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
  };
  stickers: {
    title: string;
    subtitle: string;
    earned: string;
    locked: string;
    howToUnlock: string;
    totalEarned: string;
  };
  login: {
    studentTab: string;
    teacherTab: string;
    studentSignInTitle: string;
    teacherSignInTitle: string;
    studentSignUpTitle: string;
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
  };
  errors: {
    generic: string;
    network: string;
    selectAnswer: string;
    notFound: string;
    saveFailed: string;
  };
}

export type SupportedLanguage = "en" | "hi" | "te";

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  // ---------------------------------------------------------------------------
  // ENGLISH (Canonical Class 5 English level)
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
      tryAgain: "Try again",
      showMore: "Show more",
      showLess: "Show less",
      offlineNotice: "You are offline. Your progress is saved on this device.",
      errorGeneric: "Something went wrong. Please try again.",
      errorNetwork: "Network problem. We will save your answers on this device.",
      selectLanguage: "Language",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      draftBadge: "Draft translation",
      draftNotice: "This translation is in progress. English terms may appear.",
    },
    nav: {
      home: "Home",
      learn: "Lessons",
      diagnostic: "Quick check",
      practice: "Practice",
      stickers: "Stickers",
      profile: "Profile",
      teacherHub: "Teacher hub",
      signIn: "Sign in",
      signOut: "Sign out",
      streakDays: "{count} day in a row",
      streakDaysPlural: "{count} days in a row",
      skipToContent: "Skip to main content",
    },
    home: {
      tagline: "Adaptive Mathematics for Classes 6–10",
      heroTitle: "Stuck in Class 10 maths? It probably started in Class 7.",
      heroSubline:
        "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT Classes 6-10, in English, हिंदी and తెలుగు.",
      studentLabel: "Student",
      studentTitle: "I'm a student",
      studentBody:
        "Take a quick check, see what you know, then fix topics one small step at a time. No email or phone number needed.",
      studentBtn: "Start learning",
      studentSignIn: "Already have an account? Sign in",
      teacherLabel: "Teacher",
      teacherTitle: "I'm a teacher",
      teacherBody:
        "Create a class, share a code, and see which foundational concepts from earlier grades your students are actually stuck on.",
      teacherBtn: "Set up my class",
      teacherSignIn: "Already registered? Sign in",
      trustLine: "Follows NCERT 2024–26 · No trackers · No email needed",
      welcomeBack: "Welcome back",
      classBadge: "Class {grade}",
      activeGapFound: "Earlier topic you missed",
      fixGapBtn: "Fix this topic",
      continueLessonBtn: "Next lesson",
      switchProfile: "Switch class / Reset profile",
      chaptersHeading: "Maths chapters & quick checks",
      chaptersSubtitle: "Choose a chapter to start a quick check or learn a lesson.",
      conceptsMastered: "Concepts mastered",
      startQuickCheck: "Take quick check",
      openLessons: "Open lessons",
      ncertStandard: "NCERT",
    },
    dashboard: {
      pageTitle: "Student home",
      loading: "Opening student home...",
      studyClass: "Studying Class {grade}",
      streak: "Daily streak",
      daysInRow: "{count} day in a row",
      daysInRowPlural: "{count} days in a row",
      activeGapTitle: "Earlier topic you missed",
      activeGapBadge: "Foundational topic review",
      activeGapDescFallback:
        "A quick check found an earlier topic you missed. Practicing it now will make your current lessons much easier.",
      fixThisTopic: "Fix this topic",
      recommendedNext: "Recommended next topic",
      inProgress: "In progress",
      completed: "Completed",
      startLesson: "Start lesson",
      openWorksheet: "Open worksheet",
      takeQuickCheck: "Take quick check",
      spacedRepetitionDue: "Time for revision",
      startRevision: "Start revision",
      allChapters: "Maths chapters & lessons",
      allChaptersSubtitle: "Follow the official NCERT syllabus step by step.",
      noCompletedTopics: "No completed topics yet. Start your first lesson!",
      changeClass: "Change class",
      editProfile: "Edit profile",
      overallProgress: "Overall progress",
      topicsMastered: "Topics mastered",
      diagnosticReady: "Ready for quick check",
      testReady: "Chapter test ready",
      openLessons: "Open lessons",
      startPractice: "Start practice",
      companionRevisionDue: "You have a topic ready for revision today.",
      companionAllClear: "Great job! Keep up the good work today.",
    },
    lesson: {
      backToLessons: "Back to lessons",
      goal: "Goal",
      intuition: "Intuition",
      workedExample: "Worked example",
      problem: "Problem",
      solution: "Solution",
      step: "Step {step}",
      keyTakeaway: "Key takeaway",
      practiceWorksheet: "Practice worksheet",
      practiceIntro: "Answer these questions to check how well you know this topic.",
      draftBadge: "Draft translation",
      draftNotice: "This translation is in progress. English terms may appear.",
      variantBasics: "Basics first",
      variantStandard: "Standard lesson",
      variantFast: "Fast track",
      startWorksheetBtn: "Start practice questions",
      fromGapNotice: "You are reviewing this topic to fix an earlier missed step.",
    },
    practice: {
      title: "Practice hub",
      subtitle: "Strengthen your concepts with targeted questions.",
      searchPlaceholder: "Search topics or concepts...",
      allFilter: "All topics",
      completedFilter: "Completed",
      questionCounter: "Question {current} of {total}",
      selectAnswer: "Select your answer:",
      submitAnswer: "Submit answer",
      nextQuestion: "Next question",
      finishPractice: "Finish practice",
      correctTitle: "Well done!",
      incorrectTitle: "Not quite right",
      explanation: "Explanation",
      tip: "Helpful tip",
      retryBtn: "Try again",
      scoreSummary: "You scored {score}% ({correct} of {total} correct)",
      reviewFoundationalLesson: "Review lesson for this topic",
      backToPractice: "Back to practice hub",
      emptySearch: "No topics found matching your search.",
    },
    diagnostic: {
      title: "Quick check",
      subtitle: "A short check to find what you know and what to learn next.",
      startCheck: "Start quick check",
      evaluating: "Checking your answers...",
      gapFound: "Earlier topic found",
      gapFoundDesc: "We found a concept from an earlier grade that needs a quick refresh.",
      allGood: "Ready to go!",
      allGoodDesc: "You have solid foundations for this chapter. Continue with the next lesson.",
      startRemediation: "Review earlier topic",
      continueChapter: "Go to lessons",
      questionCount: "{count} questions",
      instructions: "Answer honestly. If you are not sure, pick your best guess.",
    },
    test: {
      title: "Chapter test",
      subtitle: "Check how well you know this chapter.",
      timeRemaining: "Time remaining",
      submitTest: "Submit test",
      confirmSubmit: "Are you sure you want to submit your test?",
      testPassed: "Test completed!",
      testPassedDesc: "You showed a strong understanding of this chapter.",
      needsPractice: "Keep practicing",
      needsPracticeDesc: "Review the topics below to strengthen your understanding.",
      reviewAnswers: "Review questions and answers",
      score: "Score: {score}%",
    },
    profile: {
      title: "Student profile",
      nickname: "Nickname",
      nicknameHint: "This name appears on your dashboard and companion greetings.",
      studyClass: "Class you are studying",
      enrolledClass: "Your school class",
      classWarning: "Note: Changing your class will update your recommended learning path.",
      saveChanges: "Save changes",
      savedSuccess: "Profile updated successfully.",
      stats: "Your learning stats",
      xp: "Total XP",
      level: "Level {lvl}",
      streak: "Daily streak",
      mastered: "Topics mastered",
      recoveryCode: "Recovery code",
      recoveryCodeHint: "Save this code to sign in on another device without a password.",
      dangerZone: "Danger zone",
      resetProgress: "Reset my progress",
    },
    stickers: {
      title: "Sticker collection",
      subtitle: "Earn stickers as you complete lessons, tests, and streaks.",
      earned: "Earned",
      locked: "Locked",
      howToUnlock: "How to unlock:",
      totalEarned: "{count} of {total} stickers earned",
    },
    login: {
      studentTab: "Student login",
      teacherTab: "Teacher login",
      studentSignInTitle: "Student sign in",
      teacherSignInTitle: "Teacher sign in",
      studentSignUpTitle: "Create student profile",
      enterNickname: "Enter your nickname",
      enterPassword: "Enter password (optional)",
      selectGrade: "Select your class",
      classCode: "Class code (optional)",
      signInBtn: "Sign in",
      signUpBtn: "Start learning",
      haveAccount: "Already have an account? Sign in",
      needAccount: "New here? Create profile",
      useRecovery: "Sign in with recovery code",
      invalidCredentials: "Nickname not found or password incorrect.",
      recoveryCodeHelp: "Use the 16-character code given when you created your profile.",
    },
    teacher: {
      title: "Teacher dashboard",
      myClasses: "My classes",
      createClass: "Create class",
      classNamePlaceholder: "Class name (e.g. Class 10A Maths)",
      selectGrade: "Select grade",
      shareCode: "Class code",
      roster: "Student roster",
      foundationalGaps: "Foundational gaps identified",
      noStudents: "No students enrolled yet. Share your class code!",
      exportRoster: "Export roster",
      activeGapsCount: "{count} students have an earlier topic to review",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Network error. Please check your internet connection.",
      selectAnswer: "Please select an answer to continue.",
      notFound: "The requested page or lesson was not found.",
      saveFailed: "We could not save your changes. Please try again.",
    },
  },

  // ---------------------------------------------------------------------------
  // HINDI (Simple, natural everyday Hindi for school students)
  // ---------------------------------------------------------------------------
  hi: {
    common: {
      loading: "लोड हो रहा है...",
      save: "सहेजें",
      back: "पीछे",
      next: "आगे",
      start: "शुरू करें",
      finish: "समाप्त करें",
      cancel: "रद्द करें",
      close: "बंद करें",
      tryAgain: "फिर से प्रयास करें",
      showMore: "और देखें",
      showLess: "कम देखें",
      offlineNotice: "आप ऑफ़लाइन हैं। आपकी प्रगति इस डिवाइस पर सुरक्षित है।",
      errorGeneric: "कुछ गलत हो गया। कृपया फिर से प्रयास करें।",
      errorNetwork: "इंटरनेट समस्या है। आपके उत्तर इस डिवाइस पर सुरक्षित रहेंगे।",
      selectLanguage: "भाषा",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      draftBadge: "कच्चा अनुवाद",
      draftNotice: "इस अनुवाद पर काम जारी है। कुछ शब्द अंग्रेजी में हो सकते हैं।",
    },
    nav: {
      home: "मुख्य",
      learn: "पाठ",
      diagnostic: "जाँच",
      practice: "अभ्यास",
      stickers: "स्टीकर",
      profile: "प्रोफ़ाइल",
      teacherHub: "शिक्षक हब",
      signIn: "साइन इन",
      signOut: "साइन आउट",
      streakDays: "लगातार {count} दिन",
      streakDaysPlural: "लगातार {count} दिन",
      skipToContent: "मुख्य सामग्री पर जाएं",
    },
    home: {
      tagline: "कक्षा 6–10 के लिए सरल और अनुकूली गणित",
      heroTitle: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
      heroSubline:
        "मार्गम् उस पुराने विषय को खोजता है जो छूट गया था—जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न—और उसे एक-एक कदम में सुधारता है। एनसीईआरटी कक्षा 6-10, अंग्रेजी, हिंदी और తెలుగు में।",
      studentLabel: "विद्यार्थी",
      studentTitle: "मैं विद्यार्थी हूँ",
      studentBody:
        "एक छोटी जाँच करें, देखें कि आप क्या जानते हैं, और एक-एक छोटे कदम के साथ विषयों को सुधारें। ईमेल या फ़ोन की आवश्यकता नहीं है।",
      studentBtn: "सीखना शुरू करें",
      studentSignIn: "पहले से खाता है? साइन इन करें",
      teacherLabel: "शिक्षक",
      teacherTitle: "मैं शिक्षक हूँ",
      teacherBody:
        "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी पिछली कक्षाओं के किन विषयों में अटक रहे हैं।",
      teacherBtn: "मेरी कक्षा सेट करें",
      teacherSignIn: "पहले से पंजीकृत हैं? साइन इन करें",
      trustLine: "एनसीईआरटी 2024–26 पर आधारित · कोई ट्रैकर नहीं · ईमेल की आवश्यकता नहीं",
      welcomeBack: "फिर से स्वागत है",
      classBadge: "कक्षा {grade}",
      activeGapFound: "पिछला छूटा हुआ विषय",
      fixGapBtn: "यह विषय सुधारें",
      continueLessonBtn: "अगला पाठ",
      switchProfile: "कक्षा बदलें / प्रोफ़ाइल रीसेट करें",
      chaptersHeading: "गणित के अध्याय और जाँच",
      chaptersSubtitle: "जाँच शुरू करने या पाठ सीखने के लिए अध्याय चुनें।",
      conceptsMastered: "सीखे गए विषय",
      startQuickCheck: "जाँच शुरू करें",
      openLessons: "पाठ खोलें",
      ncertStandard: "एनसीईआरटी",
    },
    dashboard: {
      pageTitle: "विद्यार्थी मुख्य पृष्ठ",
      loading: "विद्यार्थी पृष्ठ खुल रहा है...",
      studyClass: "कक्षा {grade} का अध्ययन",
      streak: "दैनिक अभ्यास",
      daysInRow: "लगातार {count} दिन",
      daysInRowPlural: "लगातार {count} दिन",
      activeGapTitle: "पिछला छूटा हुआ विषय",
      activeGapBadge: "बुनियादी विषय की समीक्षा",
      activeGapDescFallback:
        "जाँच में एक पुराना विषय सामने आया जो छूट गया था। अभी इसका अभ्यास करने से वर्तमान पाठ बहुत आसान हो जाएंगे।",
      fixThisTopic: "यह विषय सुधारें",
      recommendedNext: "सुझाया गया अगला विषय",
      inProgress: "प्रगति पर",
      completed: "पूर्ण",
      startLesson: "पाठ शुरू करें",
      openWorksheet: "अभ्यास पत्र खोलें",
      takeQuickCheck: "जाँच शुरू करें",
      spacedRepetitionDue: "दोहराने का समय",
      startRevision: "दोहराना शुरू करें",
      allChapters: "गणित के अध्याय और पाठ",
      allChaptersSubtitle: "एनसीईआरटी पाठ्यक्रम के अनुसार एक-एक कदम आगे बढ़ें।",
      noCompletedTopics: "अभी कोई विषय पूरा नहीं हुआ है। अपना पहला पाठ शुरू करें!",
      changeClass: "कक्षा बदलें",
      editProfile: "प्रोफ़ाइल संपादित करें",
      overallProgress: "कुल प्रगति",
      topicsMastered: "सीखे गए विषय",
      diagnosticReady: "जाँच के लिए तैयार",
      testReady: "अध्याय परीक्षा तैयार",
      openLessons: "पाठ खोलें",
      startPractice: "अभ्यास शुरू करें",
      companionRevisionDue: "आज आपके पास दोहराने के लिए एक विषय है।",
      companionAllClear: "बहुत बढ़िया! आज भी इसी तरह सीखते रहें।",
    },
    lesson: {
      backToLessons: "पाठों पर वापस जाएं",
      goal: "उद्देश्य",
      intuition: "सहज समझ",
      workedExample: "हल किया गया उदाहरण",
      problem: "प्रश्न",
      solution: "हल",
      step: "चरण {step}",
      keyTakeaway: "मुख्य बात",
      practiceWorksheet: "अभ्यास पत्र",
      practiceIntro: "यह देखने के लिए इन प्रश्नों के उत्तर दें कि आप इस विषय को कितना समझते हैं।",
      draftBadge: "कच्चा अनुवाद",
      draftNotice: "इस अनुवाद पर काम जारी है। कुछ शब्द अंग्रेजी में हो सकते हैं।",
      variantBasics: "पहले बुनियादी बातें",
      variantStandard: "मानक पाठ",
      variantFast: "तेज़ गति",
      startWorksheetBtn: "अभ्यास प्रश्न शुरू करें",
      fromGapNotice: "आप पिछली छूटी हुई कमी को दूर करने के लिए यह विषय दोहरा रहे हैं।",
    },
    practice: {
      title: "अभ्यास केंद्र",
      subtitle: "प्रश्नों के साथ अपनी समझ को मजबूत बनाएं।",
      searchPlaceholder: "विषय खोजें...",
      allFilter: "सभी विषय",
      completedFilter: "पूर्ण",
      questionCounter: "प्रश्न {current} / {total}",
      selectAnswer: "अपना उत्तर चुनें:",
      submitAnswer: "उत्तर जमा करें",
      nextQuestion: "अगला प्रश्न",
      finishPractice: "अभ्यास पूरा करें",
      correctTitle: "बहुत बढ़िया!",
      incorrectTitle: "सही नहीं है",
      explanation: "व्याख्या",
      tip: "मददगार सुझाव",
      retryBtn: "फिर से प्रयास करें",
      scoreSummary: "आपका स्कोर: {score}% ({total} में से {correct} सही)",
      reviewFoundationalLesson: "इस विषय का पाठ दोहराएं",
      backToPractice: "अभ्यास केंद्र पर वापस जाएं",
      emptySearch: "आपकी खोज से मेल खाता कोई विषय नहीं मिला।",
    },
    diagnostic: {
      title: "त्वरित जाँच",
      subtitle: "यह देखने के लिए एक छोटी जाँच कि आप क्या जानते हैं और आगे क्या सीखना है।",
      startCheck: "जाँच शुरू करें",
      evaluating: "आपके उत्तरों की जाँच हो रही है...",
      gapFound: "पिछला छूटा हुआ विषय मिला",
      gapFoundDesc: "हमें पिछली कक्षा का एक ऐसा विषय मिला है जिसे दोहराने की जरूरत है।",
      allGood: "आप पूरी तरह तैयार हैं!",
      allGoodDesc: "इस अध्याय के लिए आपकी नींव मजबूत है। अगले पाठ के साथ आगे बढ़ें।",
      startRemediation: "पुराना विषय दोहराएं",
      continueChapter: "पाठों पर जाएं",
      questionCount: "{count} प्रश्न",
      instructions: "ईमानदारी से उत्तर दें। यदि निश्चित नहीं हैं, तो सबसे सही लगने वाला विकल्प चुनें।",
    },
    test: {
      title: "अध्याय परीक्षा",
      subtitle: "देखें कि आप इस अध्याय को कितना समझ चुके हैं।",
      timeRemaining: "शेष समय",
      submitTest: "परीक्षा जमा करें",
      confirmSubmit: "क्या आप अपनी परीक्षा जमा करना चाहते हैं?",
      testPassed: "परीक्षा पूरी हुई!",
      testPassedDesc: "आपने इस अध्याय की अच्छी समझ दिखाई है।",
      needsPractice: "अभ्यास जारी रखें",
      needsPracticeDesc: "अपनी समझ को मजबूत करने के लिए नीचे दिए गए विषयों को दोहराएं।",
      reviewAnswers: "प्रश्न और उत्तर देखें",
      score: "स्कोर: {score}%",
    },
    profile: {
      title: "विद्यार्थी प्रोफ़ाइल",
      nickname: "उपनाम",
      nicknameHint: "यह नाम आपके मुख्य पृष्ठ पर दिखाई देता है।",
      studyClass: "अध्ययन की कक्षा",
      enrolledClass: "आपकी स्कूल कक्षा",
      classWarning: "ध्यान दें: कक्षा बदलने से आपका सीखने का रास्ता बदल जाएगा।",
      saveChanges: "बदलाव सहेजें",
      savedSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई।",
      stats: "आपके सीखने के आँकड़े",
      xp: "कुल XP",
      level: "स्तर {lvl}",
      streak: "दैनिक अभ्यास",
      mastered: "सीखे गए विषय",
      recoveryCode: "रिकवरी कोड",
      recoveryCodeHint: "पासवर्ड के बिना किसी अन्य डिवाइस पर साइन इन करने के लिए इस कोड को सहेजें।",
      dangerZone: "महत्वपूर्ण क्षेत्र",
      resetProgress: "मेरी प्रगति रीसेट करें",
    },
    stickers: {
      title: "स्टीकर संग्रह",
      subtitle: "पाठ, परीक्षा और दैनिक अभ्यास पूरा करके स्टीकर जीतें।",
      earned: "प्राप्त",
      locked: "बंद",
      howToUnlock: "अनलॉक कैसे करें:",
      totalEarned: "{total} में से {count} स्टीकर प्राप्त",
    },
    login: {
      studentTab: "विद्यार्थी लॉगिन",
      teacherTab: "शिक्षक लॉगिन",
      studentSignInTitle: "विद्यार्थी साइन इन",
      teacherSignInTitle: "शिक्षक साइन इन",
      studentSignUpTitle: "विद्यार्थी प्रोफ़ाइल बनाएं",
      enterNickname: "अपना उपनाम दर्ज करें",
      enterPassword: "पासवर्ड दर्ज करें (वैकल्पिक)",
      selectGrade: "अपनी कक्षा चुनें",
      classCode: "कक्षा कोड (वैकल्पिक)",
      signInBtn: "साइन इन करें",
      signUpBtn: "सीखना शुरू करें",
      haveAccount: "पहले से खाता है? साइन इन करें",
      needAccount: "यहाँ नए हैं? प्रोफ़ाइल बनाएं",
      useRecovery: "रिकवरी कोड से साइन इन करें",
      invalidCredentials: "उपनाम नहीं मिला या पासवर्ड गलत है।",
      recoveryCodeHelp: "प्रोफ़ाइल बनाते समय मिला 16-अक्षरों का कोड उपयोग करें।",
    },
    teacher: {
      title: "शिक्षक डैशबोर्ड",
      myClasses: "मेरी कक्षाएं",
      createClass: "कक्षा बनाएं",
      classNamePlaceholder: "कक्षा का नाम (उदा. कक्षा 10A गणित)",
      selectGrade: "कक्षा चुनें",
      shareCode: "कक्षा कोड",
      roster: "विद्यार्थी सूची",
      foundationalGaps: "बुनियादी कमियां पहचानी गईं",
      noStudents: "अभी कोई विद्यार्थी नहीं जुड़ा है। अपनी कक्षा का कोड साझा करें!",
      exportRoster: "सूची डाउनलोड करें",
      activeGapsCount: "{count} विद्यार्थियों को पुराना विषय दोहराने की आवश्यकता है",
    },
    errors: {
      generic: "कुछ गलत हो गया। कृपया फिर से प्रयास करें।",
      network: "नेटवर्क समस्या। कृपया अपना इंटरनेट जांचें।",
      selectAnswer: "कृपया आगे बढ़ने के लिए उत्तर चुनें।",
      notFound: "अनुरोधित पृष्ठ या पाठ नहीं मिला।",
      saveFailed: "बदलाव सहेजे नहीं जा सके। कृपया पुनः प्रयास करें।",
    },
  },

  // ---------------------------------------------------------------------------
  // TELUGU (Natural, friendly, conversational Telugu for school students)
  // ---------------------------------------------------------------------------
  te: {
    common: {
      loading: "లోడ్ అవుతోంది...",
      save: "సేవ్ చేయండి",
      back: "వెనుకకు",
      next: "తర్వాత",
      start: "మొదలుపెట్టండి",
      finish: "ముగించండి",
      cancel: "రద్దు చేయండి",
      close: "మూసివేయండి",
      tryAgain: "మళ్లీ ప్రయత్నించండి",
      showMore: "మరిన్ని చూడండి",
      showLess: "తక్కువ చూడండి",
      offlineNotice: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. మీ పురోగతి ఈ పరికరంలో సేవ్ చేయబడింది.",
      errorGeneric: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      errorNetwork: "ఇంటర్నెట్ సమస్య ఉంది. మీ సమాధానాలు ఈ పరికరంలో సురక్షితంగా ఉంటాయి.",
      selectLanguage: "భాష",
      english: "English",
      hindi: "हिंदी",
      telugu: "తెలుగు",
      draftBadge: "డ్రాఫ్ట్ అనువాదం",
      draftNotice: "ఈ అనువాదం సమీక్షలో ఉంది. కొన్ని పదాలు ఇంగ్లీషులో ఉండవచ్చు.",
    },
    nav: {
      home: "హోమ్",
      learn: "పాఠాలు",
      diagnostic: "తనిఖీ",
      practice: "సాధన",
      stickers: "స్టిక్కర్లు",
      profile: "ప్రొఫైల్",
      teacherHub: "ఉపాధ్యాయుల విభాగం",
      signIn: "సైన్ ఇన్",
      signOut: "సైన్ అవుట్",
      streakDays: "వరుసగా {count} రోజులు",
      streakDaysPlural: "వరుసగా {count} రోజులు",
      skipToContent: "ముఖ్య విషయానికి వెళ్లండి",
    },
    home: {
      tagline: "6–10 తరగతుల విద్యార్థుల కోసం అనుకూల గణితం",
      heroTitle: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
      heroSubline:
        "మార్గం మీరు గతంలో తప్పిపోయిన పునాది అంశాన్ని గుర్తిస్తుంది—ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేతాలు—మరియు దానిని సరిదిద్దేందుకు సహాయపడుతుంది. NCERT 6-10 తరగతులు, English, हिंदी మరియు తెలుగులో.",
      studentLabel: "విద్యార్థి",
      studentTitle: "నేను విద్యార్థిని",
      studentBody:
        "చిన్న తనిఖీ చేయండి, మీకు ఏమి తెలుసో చూడండి, ఆపై చిన్న చిన్న దశల్లో అంశాలను నేర్చుకోండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      studentBtn: "నేర్చుకోవడం ప్రారంభించండి",
      studentSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      teacherLabel: "ఉపాధ్యాయులు",
      teacherTitle: "నేను ఉపాధ్యాయుడిని",
      teacherBody:
        "తరగతిని సృష్టించండి, కోడ్ పంచుకోండి, మరియు మీ విద్యార్థులు గత తరగతుల ఏ పునాది అంశాలలో ఇబ్బంది పడుతున్నారో చూడండి.",
      teacherBtn: "నా తరగతిని సిద్ధం చేయండి",
      teacherSignIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
      trustLine: "NCERT 2024–26 ఆధారంగా · ట్రాకర్లు లేవు · ఈమెయిల్ అవసరం లేదు",
      welcomeBack: "మళ్లీ స్వాగతం",
      classBadge: "{grade}వ తరగతి",
      activeGapFound: "గతంలో తప్పిపోయిన అంశం",
      fixGapBtn: "ఈ అంశాన్ని సరిదిద్దండి",
      continueLessonBtn: "తర్వాతి పాఠం",
      switchProfile: "తరగతి మార్చండి / ప్రొఫైల్ రీసెట్ చేయండి",
      chaptersHeading: "గణిత అధ్యాయాలు మరియు తనిఖీలు",
      chaptersSubtitle: "తనిఖీ ప్రారంభించడానికి లేదా పాఠం నేర్చుకోవడానికి అధ్యాయాన్ని ఎంచుకోండి.",
      conceptsMastered: "నేర్చుకున్న అంశాలు",
      startQuickCheck: "తనిఖీ రాయండి",
      openLessons: "పాఠాలు తెరవండి",
      ncertStandard: "NCERT",
    },
    dashboard: {
      pageTitle: "విద్యార్థి హోమ్ పేజీ",
      loading: "విద్యార్థి పేజీ తెరుచుకుంటోంది...",
      studyClass: "{grade}వ తరగతి చదువుతున్నారు",
      streak: "రోజువారీ సాధన",
      daysInRow: "వరుసగా {count} రోజులు",
      daysInRowPlural: "వరుసగా {count} రోజులు",
      activeGapTitle: "గతంలో తప్పిపోయిన అంశం",
      activeGapBadge: "పునాది అంశం పునశ్చరణ",
      activeGapDescFallback:
        "తనిఖీలో మీరు గతంలో తప్పిపోయిన అంశం కనిపించింది. ఇప్పుడు దీనిని సాధన చేయడం వల్ల ప్రస్తుత పాఠాలు చాలా సులభం అవుతాయి.",
      fixThisTopic: "ఈ అంశాన్ని సరిదిద్దండి",
      recommendedNext: "తదుపరి సిఫార్సు",
      inProgress: "కొనసాగుతోంది",
      completed: "పూర్తయింది",
      startLesson: "పాఠం మొదలుపెట్టండి",
      openWorksheet: "వర్క్‌షీట్ తెరవండి",
      takeQuickCheck: "తనిఖీ రాయండి",
      spacedRepetitionDue: "పునశ్చరణ సమయం",
      startRevision: "పునశ్చరణ మొదలుపెట్టండి",
      allChapters: "గణిత అధ్యాయాలు మరియు పాఠాలు",
      allChaptersSubtitle: "అధికారిక NCERT సిలబస్ ప్రకారం ఒక్కో అడుగు ముందుకు సాగండి.",
      noCompletedTopics: "ఇంకా ఏ అంశాలు పూర్తి కాలేదు. మీ మొదటి పాఠాన్ని ప్రారంభించండి!",
      changeClass: "తరగతి మార్చండి",
      editProfile: "ప్రొఫైల్ ఎడిట్ చేయండి",
      overallProgress: "మొత్తం పురోగతి",
      topicsMastered: "నేర్చుకున్న అంశాలు",
      diagnosticReady: "తనిఖీకి సిద్ధం",
      testReady: "అధ్యాయ పరీక్ష సిద్ధం",
      openLessons: "పాఠాలు తెరవండి",
      startPractice: "సాధన మొదలుపెట్టండి",
      companionRevisionDue: "ఈ రోజు మీరు పునశ్చరణ చేయాల్సిన అంశం ఉంది.",
      companionAllClear: "చాలా బాగుంది! ఈ రోజు కూడా ఇలాగే సాధన కొనసాగించండి.",
    },
    lesson: {
      backToLessons: "పాఠాలకు తిరిగి వెళ్లండి",
      goal: "లక్ష్యం",
      intuition: "సులభ అవగాహన",
      workedExample: "సాధించిన ఉదాహరణ",
      problem: "సమస్య",
      solution: "సాధన",
      step: "దశ {step}",
      keyTakeaway: "ముఖ్యమైన విషయం",
      practiceWorksheet: "సాధనా వర్క్‌షీట్",
      practiceIntro: "ఈ అంశం మీకు ఎంతవరకు అర్థమైందో చూసేందుకు ఈ ప్రశ్నలకు సమాధానాలు ఇవ్వండి.",
      draftBadge: "డ్రాఫ్ట్ అనువాదం",
      draftNotice: "ఈ అనువాదం సమీక్షలో ఉంది. కొన్ని పదాలు ఇంగ్లీషులో ఉండవచ్చు.",
      variantBasics: "ముందుగా ప్రాథమిక అంశాలు",
      variantStandard: "ప్రామాణిక పాఠం",
      variantFast: "వేగవంతమైన పాఠం",
      startWorksheetBtn: "సాధనా ప్రశ్నలను ప్రారంభించండి",
      fromGapNotice: "గతంలో తప్పిపోయిన పునాదిని సరిదిద్దేందుకు మీరు ఈ పాఠాన్ని చదువుతున్నారు.",
    },
    practice: {
      title: "సాధనా కేంద్రం",
      subtitle: "ప్రశ్నలతో మీ భావనలను మరింత బలోపేతం చేసుకోండి.",
      searchPlaceholder: "అంశాలను వెతకండి...",
      allFilter: "అన్ని అంశాలు",
      completedFilter: "పూర్తయినవి",
      questionCounter: "ప్రశ్న {current} / {total}",
      selectAnswer: "మీ సమాధానాన్ని ఎంచుకోండి:",
      submitAnswer: "సమాధానం సమర్పించండి",
      nextQuestion: "తర్వాతి ప్రశ్న",
      finishPractice: "సాధన ముగించండి",
      correctTitle: "చాలా బాగుంది!",
      incorrectTitle: "సరైనది కాదు",
      explanation: "వివరణ",
      tip: "ఉపయోగకరమైన చిట్కా",
      retryBtn: "మళ్లీ ప్రయత్నించండి",
      scoreSummary: "మీ స్కోర్: {score}% ({total} లో {correct} సరైనవి)",
      reviewFoundationalLesson: "ఈ అంశం పాఠాన్ని పునశ్చరణ చేయండి",
      backToPractice: "సాధనా కేంద్రానికి తిరిగి వెళ్లండి",
      emptySearch: "మీ వెతుకులాటకు సరిపోలే అంశాలు ఏవీ కనిపించలేదు.",
    },
    diagnostic: {
      title: "చిన్న తనిఖీ",
      subtitle: "మీకు ఏమి తెలుసో, తర్వాత ఏమి నేర్చుకోవాలో తెలుసుకునేందుకు చిన్న తనిఖీ.",
      startCheck: "తనిఖీ ప్రారంభించండి",
      evaluating: "మీ సమాధానాలను పరిశీలిస్తున్నాము...",
      gapFound: "గతంలో తప్పిపోయిన అంశం గుర్తించబడింది",
      gapFoundDesc: "గత తరగతికి చెందిన ఒక అంశాన్ని మీరు మళ్లీ చూసుకోవాల్సి ఉంది.",
      allGood: "మీరు సిద్ధంగా ఉన్నారు!",
      allGoodDesc: "ఈ అధ్యాయానికి మీ పునాది బలంగా ఉంది. తర్వాతి పాఠంతో ముందుకు సాగండి.",
      startRemediation: "గత అంశాన్ని పునశ్చరణ చేయండి",
      continueChapter: "పాఠాలకు వెళ్లండి",
      questionCount: "{count} ప్రశ్నలు",
      instructions: "స్పష్టంగా సమాధానం ఇవ్వండి. ఖచ్చితంగా తెలియకపోతే మీకు సరైనదనిపించేది ఎంచుకోండి.",
    },
    test: {
      title: "అధ్యాయ పరీక్ష",
      subtitle: "ఈ అధ్యాయంపై మీ పట్టును పరీక్షించుకోండి.",
      timeRemaining: "మిగిలిన సమయం",
      submitTest: "పరీక్ష సమర్పించండి",
      confirmSubmit: "మీరు పరీక్షను సమర్పించాలనుకుంటున్నారా?",
      testPassed: "పరీక్ష పూర్తయింది!",
      testPassedDesc: "ఈ అధ్యాయంపై మీరు మంచి పట్టు సాధించారు.",
      needsPractice: "సాధన కొనసాగించండి",
      needsPracticeDesc: "మరింత స్పష్టత కోసం క్రింది అంశాలను మళ్లీ చదవండి.",
      reviewAnswers: "ప్రశ్నలు మరియు సమాధానాలను చూడండి",
      score: "స్కోర్: {score}%",
    },
    profile: {
      title: "విద్యార్థి ప్రొఫైల్",
      nickname: "మారుపేరు",
      nicknameHint: "ఈ పేరు మీ హోమ్ పేజీలో కనిపిస్తుంది.",
      studyClass: "చదువుకునే తరగతి",
      enrolledClass: "మీ పాఠశాల తరగతి",
      classWarning: "గమనిక: తరగతి మార్చడం వల్ల మీ అభ్యాస మార్గం మారుతుంది.",
      saveChanges: "మార్పులను సేవ్ చేయండి",
      savedSuccess: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది.",
      stats: "మీ అభ్యాస గణాంకాలు",
      xp: "మొత్తం XP",
      level: "స్థాయి {lvl}",
      streak: "రోజువారీ సాధన",
      mastered: "నేర్చుకున్న అంశాలు",
      recoveryCode: "రికవరీ కోడ్",
      recoveryCodeHint: "పాస్‌వర్డ్ లేకుండా వేరే పరికరంలో సైన్ ఇన్ కావడానికి ఈ కోడ్‌ను దాచుకోండి.",
      dangerZone: "ముఖ్యమైన విభాగం",
      resetProgress: "నా పురోగతిని రీసెట్ చేయండి",
    },
    stickers: {
      title: "స్టిక్కర్ల సేకరణ",
      subtitle: "పాఠాలు, పరీక్షలు మరియు రోజువారీ సాధన పూర్తి చేసి స్టిక్కర్లను గెలుచుకోండి.",
      earned: "లభించినవి",
      locked: "లాక్ చేయబడింది",
      howToUnlock: "ఎలా అన్‌లాక్ చేయాలి:",
      totalEarned: "{total} లో {count} స్టిక్కర్లు లభించాయి",
    },
    login: {
      studentTab: "విద్యార్థి లాగిన్",
      teacherTab: "ఉపాధ్యాయుల లాగిన్",
      studentSignInTitle: "విద్యార్థి సైన్ ఇన్",
      teacherSignInTitle: "ఉపాధ్యాయుల సైన్ ఇన్",
      studentSignUpTitle: "విద్యార్థి ప్రొఫైల్ సృష్టించండి",
      enterNickname: "మీ మారుపేరును నమోదు చేయండి",
      enterPassword: "పాస్‌వర్డ్ నమోదు చేయండి (ఐచ్ఛికం)",
      selectGrade: "మీ తరగతిని ఎంచుకోండి",
      classCode: "తరగతి కోడ్ (ఐచ్ఛికం)",
      signInBtn: "సైన్ ఇన్ చేయండి",
      signUpBtn: "నేర్చుకోవడం ప్రారంభించండి",
      haveAccount: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      needAccount: "కొత్తవారా? ప్రొఫైల్ సృష్టించండి",
      useRecovery: "రికవరీ కోడ్‌తో సైన్ ఇన్ చేయండి",
      invalidCredentials: "మారుపేరు కనిపించలేదు లేదా పాస్‌వర్డ్ తప్పు.",
      recoveryCodeHelp: "ప్రొఫైల్ సృష్టించినప్పుడు ఇచ్చిన 16-అక్షరాల కోడ్‌ను ఉపయోగించండి.",
    },
    teacher: {
      title: "ఉపాధ్యాయుల డ్యాష్‌బోర్డ్",
      myClasses: "నా తరగతులు",
      createClass: "తరగతిని సృష్టించండి",
      classNamePlaceholder: "తరగతి పేరు (ఉదా. 10A గణితం)",
      selectGrade: "తరగతిని ఎంచుకోండి",
      shareCode: "తరగతి కోడ్",
      roster: "విద్యార్థుల జాబితా",
      foundationalGaps: "గుర్తించిన పునాది లోపాలు",
      noStudents: "ఇంకా విద్యార్థులు చేరలేదు. మీ తరగతి కోడ్‌ను పంచుకోండి!",
      exportRoster: "జాబితాను డౌన్‌లోడ్ చేయండి",
      activeGapsCount: "{count} మంది విద్యార్థులు గత అంశాన్ని పునశ్చరణ చేయాల్సి ఉంది",
    },
    errors: {
      generic: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      network: "నెట్‌వర్క్ సమస్య. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.",
      selectAnswer: "దయచేసి కొనసాగడానికి సమాధానాన్ని ఎంచుకోండి.",
      notFound: "అభ్యర్థించిన పేజీ లేదా పాఠం కనుగొనబడలేదు.",
      saveFailed: "మార్పులను సేవ్ చేయడం సాధ్యం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    },
  },
};

