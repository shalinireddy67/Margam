/**
 * Margam Core TypeScript Definitions
 * Covers Concept DAG, Question Bank, Lesson Variants, and Synthetic Demo Data.
 */

export type SupportedLanguage = "en" | "hi" | "te";

export interface LocalizedString {
  en: string;
  hi: string;
  te: string;
  reviewed: boolean; // Flag to easily filter and audit human translations
}

export interface Chapter {
  id: string; // e.g. "c6-ch10", "c8-ch06", "c10-ch04"
  class: 6 | 7 | 8 | 9 | 10;
  chapterNumber: number;
  part?: number;
  name: LocalizedString;
  board: "ncert";
  bookName: string;
  subject: "maths";
  topics: string[];
  status: "full" | "in_progress";
}

export interface EdgeMetadata {
  reason: string;
  source: string;
  status: "verified" | "tentative, pending teacher review";
}

export interface Concept {
  id: string;
  class: number; // 6 to 10
  chapterId?: string; // Links to Chapter.id in chapters.json
  chapter: string;
  subject?: string;
  board?: string;
  name: LocalizedString;
  learningObjective: LocalizedString;
  prerequisites: string[]; // IDs of prerequisite concepts (DAG edges)
  edgeMeta?: Record<string, EdgeMetadata>; // Prerequisite edge metadata
}

export interface MistakeClassification {
  tag: string; // e.g. "sign_error_multiplication", "distributive_error", "fraction_denominator_addition"
  description: LocalizedString;
  suggestedPrerequisiteId?: string; // Concept ID to backtrack to when this error is made
}

export interface QuestionOption {
  id: string; // "A", "B", "C", "D"
  text: LocalizedString;
  mistakeTag?: string; // Links this distractor to a specific conceptual mistake
}

export interface Question {
  id: string;
  conceptId: string;
  difficulty: 1 | 2 | 3;
  type: "multiple_choice" | "numeric" | "true_false";
  prompt: LocalizedString;
  options?: QuestionOption[];
  correctAnswer: string; // Option id (e.g. "B") or exact string for deterministic matching
  explanation: LocalizedString;
  hint: LocalizedString;
  contextTag?: "indian_real_world" | "pure_math" | "classroom";
  verified?: boolean;
}

export interface LessonVariantContent {
  headline: LocalizedString;
  explanation: LocalizedString;
  visualAnalogy?: LocalizedString; // e.g. Leh temperature, elevator levels, auto meter fare
  workedExample: {
    problem: LocalizedString;
    steps: LocalizedString[];
    solution: LocalizedString;
  };
  keyTakeaway: LocalizedString;
}

export interface Lesson {
  conceptId: string;
  basics_first: LessonVariantContent;
  standard: LessonVariantContent;
  fast_track: LessonVariantContent;
}

export interface DemoStudentMastery {
  conceptId: string;
  masteryPercentage: number; // 0 to 100
  status: "mastered" | "learning" | "gap_detected" | "not_started";
  lastAttemptDate?: string;
  identifiedMistakeTag?: string;
}

export interface DemoStudent {
  id: string;
  rollNumber: number;
  name: string; // Fictional synthetic name
  gender?: "M" | "F";
  overallGradeLevel: number;
  section: string;
  primaryLanguage: SupportedLanguage;
  mastery: DemoStudentMastery[];
  diagnosedRootGap?: {
    currentConceptId: string;
    rootPrerequisiteId: string;
    recommendedVariant: "basics_first" | "standard" | "fast_track";
    rationale: string;
  };
}

export interface DemoClassData {
  classId: string;
  className: string;
  academicYear: string;
  teacherName: string;
  subject: string;
  totalStudents: number;
  students: DemoStudent[];
  syntheticNotice: string;
}

// ==========================================
// Student Progression & Learner Profile
// ==========================================

export type TopicStatus = "available" | "in_progress" | "completed" | "locked";

export interface TopicProgress {
  conceptId: string;
  status: TopicStatus;
  lessonCompleted: boolean;
  worksheetCompleted: boolean;
  worksheetScore?: number;
  worksheetTotal?: number;
  lastAttemptAt?: string;
  completedAt?: string;
  // Per-concept adaptive state
  mastery?: number; // 0.0 to 100.0
  difficulty?: 1 | 2 | 3;
  consecutiveCorrect?: number;
  consecutiveIncorrect?: number;
  tagHistory?: string[];
  mistakeTagHistory?: string[];
  // Phase 3: Spaced Revision & Attempt Tracking
  revisionLevel?: number; // 0 = unrevised, 1 = 1-day, 2 = 3-day, 3 = 7-day, 4+ = 14-day
  nextRevisionAt?: string; // ISO timestamp when revision is due
  lastRevisedAt?: string; // ISO timestamp of last revision
  previousScore?: number; // Previous attempt score before latest attempt
  previousTotal?: number; // Previous attempt total before latest attempt
  attemptHistory?: Array<{
    attemptedAt: string;
    score: number;
    total: number;
    percentage: number;
    difficulty: 1 | 2 | 3;
    isPersonalized?: boolean;
  }>;
}

export interface RemediationGap {
  currentConceptId: string;
  rootConceptId: string;
  tag?: string;
  mistakeTag?: string;
  plainLanguageReason: string;
  prerequisitePath: string[];
  confirmationQuestionIds: string[];
  status: "pending_confirmation" | "confirmed" | "resolved";
  misconceptionCategory?: string;
}

export interface ResolvedGapRecord {
  rootConceptId: string;
  currentConceptId: string;
  resolvedAt: string;
  scorePercentage: number;
  conceptName?: string;
}

export interface LearnerProfile {
  version?: number; // Schema version (v1 = 1) for safe migrations
  id: string;
  name: string;
  selectedClass: 6 | 7 | 8 | 9 | 10;
  enrolledClass?: 6 | 7 | 8 | 9 | 10;
  studyClass?: 6 | 7 | 8 | 9 | 10;
  createdAt: string;
  lastActiveAt: string;
  topicProgress: Record<string, TopicProgress>;
  consecutiveCorrect: number; // profile-level fallback
  consecutiveIncorrect: number; // profile-level fallback
  currentDifficulty: 1 | 2 | 3; // profile-level fallback
  activeGap?: RemediationGap | null;
  resolvedGaps?: ResolvedGapRecord[];
  // Gamification fields:
  xp?: number;
  level?: number;
  rank?: "Wood" | "Stone" | "Iron" | "Gold" | "Diamond" | string;
  dailyXp?: {
    date: string;
    xp: number;
  };
  streak?: {
    current: number;
    longest: number;
    lastActiveDate: string;
    freezeTokens: number;
    lastFreezeEarnedDate?: string;
  };
  answeredQuestionsHistory?: Record<string, string>;
  unlockedBadgeIds?: string[];
  soundEnabled?: boolean;
  optOutOfLeaderboard?: boolean;
  avatar_pixel?: "wood_scholar" | "stone_scholar" | "iron_scholar" | "gold_scholar" | "diamond_scholar" | string;
  avatarPixel?: "wood_scholar" | "stone_scholar" | "iron_scholar" | "gold_scholar" | "diamond_scholar" | string;
}

export interface AttemptComparison {
  hasPreviousAttempt: boolean;
  previousScore?: number;
  previousTotal?: number;
  previousPercentage?: number;
  latestScore: number;
  latestTotal: number;
  latestPercentage: number;
  improvementDelta?: number; // e.g. +40 or -10
  improved?: boolean;
  message: string;
}

export interface PersonalizedWorksheetMeta {
  conceptId: string;
  conceptName: string;
  isPersonalized: boolean;
  personalizedReason?: string;
  targetDifficulty: 1 | 2 | 3;
  scaffoldedPrerequisites?: Array<{
    conceptId: string;
    name: string;
    questionCount: number;
  }>;
}

export type RevisionPriority =
  | "critical_gap"
  | "needs_practice"
  | "due_revision"
  | "pending_worksheet"
  | "mastery_refresh";

export interface RevisionQueueItem {
  conceptId: string;
  conceptName: string;
  class: number;
  priority: RevisionPriority;
  priorityScore: number;
  reason: string;
  mastery: number;
  currentDifficulty: 1 | 2 | 3;
  revisionLevel: number;
  nextRevisionAt?: string;
  daysOverdue?: number;
  lastScore?: {
    score: number;
    total: number;
    percentage: number;
  };
  previousImprovement?: {
    previousPercentage: number;
    latestPercentage: number;
    delta: number;
  };
  href: string;
}

export interface WorksheetSubmission {
  conceptId: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  submittedAt: string;
}

export interface QuestionFeedback {
  questionId: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: LocalizedString;
  hint?: LocalizedString;
  mistakeTag?: string;
  mistakeDescription?: string;
  suggestedPrerequisiteId?: string;
  misconceptionCategory?: string;
  educationalFeedback?: string;
}

export interface WorksheetResult {
  conceptId: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  qualifiesForCompletion: boolean;
  feedback: QuestionFeedback[];
  gapResolved?: boolean;
  comparison?: AttemptComparison;
  nextRevisionAt?: string;
  revisionLevel?: number;
  conceptsPracticed?: string[];
  conceptsNeedingAttention?: string[];
  nextAction?: {
    title: string;
    description: string;
    href: string;
  };
}

export type ConfidenceLevel = "high" | "medium" | "low" | "insufficient";
export type RoutingAction = "gap_card" | "confirmation_only" | "none";

export interface CandidateRootCause {
  conceptId: string;
  concept?: Concept;
  score: number;
  confidence: ConfidenceLevel;
  routing: RoutingAction;
  depth: number;
  directEvidenceCount: number;
  propagatedEvidenceScore: number;
  reason: string;
  isDirectRoot: boolean;
  prerequisitePath: string[];
  misconceptionCategory?: string;
}

export interface GapTraceResult {
  confirmed: boolean;
  hasGap?: boolean;
  rootConceptId: string | null;
  rootConcept?: Concept;
  triggerReason: "repeated_tag" | "convergent_tags" | "ranked_root" | "propagated_prereq" | null;
  mistakeTags: string[];
  prerequisitePath: string[]; // For visual display only
  canRoute: boolean;
  shortfallReport?: string;
  plainLanguageReason: string;
  confidence?: ConfidenceLevel;
  routing?: RoutingAction;
  score?: number;
  candidates?: CandidateRootCause[];
}

export interface ConceptDiagnosticBreakdown {
  conceptId: string;
  conceptName: string;
  class: number;
  status: "mastered" | "needs_practice" | "foundational_gap" | "unassessed";
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  isFoundational?: boolean;
  reason?: string;
}

export interface LearningPathStep {
  stepNumber: number;
  conceptId: string;
  conceptName: string;
  class: number;
  action: "remediate" | "practice" | "learn" | "reassess";
  title: string;
  description: string;
  isCurrentClass: boolean;
  isFoundational: boolean;
  href: string;
  status: "available" | "locked" | "completed";
}

export interface DiagnosticNextAction {
  conceptId: string;
  conceptName: string;
  class: number;
  title: string;
  description: string;
  href: string;
  type: "remediate" | "practice" | "lesson";
}
