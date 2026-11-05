/**
 * Margam Badge & Sticker System
 * Derives badges and achievements from learner profile history, attempts, and streaks.
 */

import { LearnerProfile } from "./types";

export interface BadgeDefinition {
  id: string;
  title: {
    en: string;
    hi: string;
    te: string;
  };
  description: {
    en: string;
    hi: string;
    te: string;
  };
  icon: "star" | "award" | "trending" | "zap" | "shield" | "flame" | "globe" | "crown";
  color: "yellow" | "cyan" | "pink" | "green" | "orange" | "gold" | "diamond";
  isSecret?: boolean;
}

export interface EvaluatedBadge extends BadgeDefinition {
  unlocked: boolean;
  unlockedAtLabel: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first_step",
    title: {
      en: "First Step",
      hi: "पहला कदम",
      te: "మొదటి అడుగు",
    },
    description: {
      en: "Started learning on Margam",
      hi: "मार्ग पर सीखना शुरू किया",
      te: "మార్గంలో అభ్యాసం ప్రారంభించారు",
    },
    icon: "star",
    color: "green",
  },
  {
    id: "concept_pioneer",
    title: {
      en: "Concept Pioneer",
      hi: "संकल्पना पथप्रदर्शक",
      te: "భావన మార్గదర్శి",
    },
    description: {
      en: "Mastered your first mathematical concept",
      hi: "अपनी पहली गणितीय अवधारणा में महारत हासिल की",
      te: "మొదటి గణిత భావనలో నైపుణ్యం సాధించారు",
    },
    icon: "award",
    color: "yellow",
  },
  {
    id: "adaptive_climber",
    title: {
      en: "Adaptive Climber",
      hi: "अनुकूली पर्वतारोही",
      te: "అనుకూల అధిరోహకుడు",
    },
    description: {
      en: "Reached Difficulty Level 2 in adaptive practice",
      hi: "अनुकूली अभ्यास में कठिनाई स्तर 2 पर पहुंचे",
      te: "అనుకూల సాధనలో కఠినత స్థాయి 2 చేరుకున్నారు",
    },
    icon: "trending",
    color: "cyan",
  },
  {
    id: "top_performer",
    title: {
      en: "Level 3 Explorer",
      hi: "स्तर 3 खोजकर्ता",
      te: "స్థాయి 3 అన్వేషకుడు",
    },
    description: {
      en: "Reached Difficulty Level 3 in adaptive practice",
      hi: "अनुकूली अभ्यास में कठिनाई स्तर 3 पर पहुंचे",
      te: "అనుకూల సాధనలో కఠినత స్థాయి 3 చేరుకున్నారు",
    },
    icon: "zap",
    color: "pink",
  },
  {
    id: "focus_streak",
    title: {
      en: "Focus Streak",
      hi: "एकाग्रता लड़ी",
      te: "దృష్టి శ్రేణి",
    },
    description: {
      en: "Answered 3 questions correctly in a row",
      hi: "लगातार 3 प्रश्नों के सही उत्तर दिए",
      te: "వరుసగా 3 ప్రశ్నలకు సరైన సమాధానం ఇచ్చారు",
    },
    icon: "zap",
    color: "yellow",
  },
  {
    id: "gap_slayer",
    title: {
      en: "Gap Slayer",
      hi: "कमजोरी विजेता",
      te: "అభ్యాస లోప విజేత",
    },
    description: {
      en: "Identified and fixed a foundational learning gap",
      hi: "बुनियादी सीखने की कमी की पहचान की और उसे सुधारा",
      te: "పునాది అభ్యాస లోపాన్ని గుర్తించి సరిచేశారు",
    },
    icon: "shield",
    color: "orange",
  },
  {
    id: "comeback_kid",
    title: {
      en: "Comeback Kid",
      hi: "वापसी विजेता",
      te: "పునరాగమన చాంపియన్",
    },
    description: {
      en: "Improved your score after struggling with difficult questions",
      hi: "कठिन प्रश्नों के बाद अपने स्कोर में सुधार किया",
      te: "తప్పుల తర్వాత సాధనతో స్కోరును మెరుగుపరుచుకున్నారు",
    },
    icon: "trending",
    color: "green",
  },
  {
    id: "streak_3",
    title: {
      en: "Spark (3-Day Streak)",
      hi: "चिंगारी (3 दिन की लड़ी)",
      te: "చిరుజ్వాల (3 రోజుల శ్రేణి)",
    },
    description: {
      en: "Practiced mathematics for 3 consecutive days",
      hi: "लगातार 3 दिनों तक गणित का अभ्यास किया",
      te: "వరుసగా 3 రోజులు గణిత సాధన చేశారు",
    },
    icon: "flame",
    color: "yellow",
  },
  {
    id: "streak_7",
    title: {
      en: "Week Warrior (7-Day Streak)",
      hi: "साप्ताहिक योद्धा (7 दिन की लड़ी)",
      te: "వారపు యోధుడు (7 రోజుల శ్రేణి)",
    },
    description: {
      en: "Practiced mathematics for 7 consecutive days",
      hi: "लगातार 7 दिनों तक गणित का अभ्यास किया",
      te: "వరుసగా 7 రోజులు గణిత సాధన చేశారు",
    },
    icon: "flame",
    color: "orange",
  },
  {
    id: "streak_30",
    title: {
      en: "Flame Master (30-Day Streak)",
      hi: "अग्नि महारथी (30 दिन की लड़ी)",
      te: "జ్వాలా విజేత (30 రోజుల శ్రేణి)",
    },
    description: {
      en: "Practiced mathematics for 30 consecutive days",
      hi: "लगातार 30 दिनों तक गणित का अभ्यास किया",
      te: "వరుసగా 30 రోజులు గణిత సాధన చేశారు",
    },
    icon: "crown",
    color: "gold",
  },
  {
    id: "language_explorer",
    title: {
      en: "Language Explorer",
      hi: "भाषा खोजी",
      te: "భాషా అన్వేషకుడు",
    },
    description: {
      en: "Explored math lessons in multiple languages (EN / HI / TE)",
      hi: "कई भाषाओं (अंग्रेजी / हिंदी / तेलुगु) में गणित के पाठ पढ़े",
      te: "బహుళ భాషలలో (ఇంగ్లీష్ / హిందీ / తెలుగు) గణితాన్ని అన్వేషించారు",
    },
    icon: "globe",
    color: "cyan",
  },
  {
    id: "chapter_champion",
    title: {
      en: "Chapter Champion",
      hi: "अध्याय शिरोमणि",
      te: "అధ్యాయ విజేత",
    },
    description: {
      en: "Achieved 80%+ mastery on a chapter diagnostic or chapter test",
      hi: "अध्याय निदान या परीक्षा में 80%+ महारत हासिल की",
      te: "అధ్యాయ పరీక్షలో 80%+ నైపుణ్యం సాధించారు",
    },
    icon: "crown",
    color: "diamond",
  },
];

/**
 * Evaluates which badges the student has unlocked based on current profile state.
 */
export function evaluateStudentBadges(
  profile: LearnerProfile | null,
  usedLanguages: string[] = ["en"]
): EvaluatedBadge[] {
  if (!profile) return [];

  const completedTopics = Object.values(profile.topicProgress || {}).filter(
    (t) => t.status === "completed"
  );
  const completedCount = completedTopics.length;
  const streakCurrent = profile.streak?.current || 0;
  const streakLongest = profile.streak?.longest || streakCurrent;
  const resolvedGapsCount = (profile.resolvedGaps || []).length;

  // Track distinct languages explored from session or topic tag history
  const discoveredLanguages = new Set<string>(usedLanguages || ["en"]);
  for (const tp of Object.values(profile.topicProgress || {})) {
    if (tp.tagHistory) {
      for (const tag of tp.tagHistory) {
        if (["en", "hi", "te"].includes(tag)) {
          discoveredLanguages.add(tag);
        }
      }
    }
  }

  // Check if comeback: any topic with previousScore < 50% and latestScore >= 70%
  const hasComeback = Object.values(profile.topicProgress || {}).some(
    (t) =>
      (t.previousScore !== undefined &&
        t.previousTotal &&
        (t.previousScore / t.previousTotal) < 0.6 &&
        t.worksheetScore !== undefined &&
        t.worksheetTotal &&
        (t.worksheetScore / t.worksheetTotal) >= 0.7) ||
      (profile.consecutiveCorrect >= 2 && profile.consecutiveIncorrect >= 2)
  );

  // Check chapter champion: any topic worksheet score >= 80% or test score >= 80%
  const hasChapterChampion = Object.values(profile.topicProgress || {}).some(
    (t) =>
      (t.worksheetScore !== undefined &&
        t.worksheetTotal &&
        (t.worksheetScore / t.worksheetTotal) >= 0.8) ||
      (t.mastery !== undefined && t.mastery >= 80)
  );

  return BADGE_DEFINITIONS.map((def) => {
    let unlocked = false;
    let label = "Locked";

    switch (def.id) {
      case "first_step":
        unlocked = Boolean(profile.selectedClass);
        label = unlocked ? "Unlocked on onboarding" : "Select a class to unlock";
        break;

      case "concept_pioneer":
        unlocked = completedCount >= 1;
        label = unlocked ? "1 concept mastered" : "Master 1 concept to unlock";
        break;

      case "adaptive_climber":
        unlocked = profile.currentDifficulty >= 2;
        label = unlocked ? "Level 2 reached" : "Reach Difficulty 2 in practice";
        break;

      case "top_performer":
        unlocked = profile.currentDifficulty === 3;
        label = unlocked ? "Level 3 achieved" : "Reach Difficulty 3 in practice";
        break;

      case "focus_streak":
        unlocked = profile.consecutiveCorrect >= 3;
        label = unlocked ? "3 correct in a row" : "Answer 3 in a row without errors";
        break;

      case "gap_slayer":
        unlocked = resolvedGapsCount > 0;
        label = unlocked ? `${resolvedGapsCount} gap(s) resolved` : "Fix a diagnosed learning gap";
        break;

      case "comeback_kid":
        unlocked = hasComeback;
        label = unlocked ? "Bounced back stronger" : "Overcome a difficult question streak";
        break;

      case "streak_3":
        unlocked = streakLongest >= 3;
        label = unlocked ? "3-day streak reached" : `Current: ${streakCurrent}/3 days`;
        break;

      case "streak_7":
        unlocked = streakLongest >= 7;
        label = unlocked ? "7-day streak reached" : `Current: ${streakCurrent}/7 days`;
        break;

      case "streak_30":
        unlocked = streakLongest >= 30;
        label = unlocked ? "30-day streak reached" : `Current: ${streakCurrent}/30 days`;
        break;

      case "language_explorer":
        unlocked = discoveredLanguages.size >= 2;
        label = unlocked ? "Explored in 2+ languages" : "Try lessons in Hindi or Telugu";
        break;

      case "chapter_champion":
        unlocked = hasChapterChampion;
        label = unlocked ? "Scored 80%+ on an assessment" : "Score 80%+ on a worksheet or test";
        break;

      default:
        unlocked = false;
        label = "Locked";
    }

    return {
      ...def,
      unlocked,
      unlockedAtLabel: label,
    };
  });
}

