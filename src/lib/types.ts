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
  mistakeTagHistory?: string[];
}

export interface RemediationGap {
  currentConceptId: string;
  rootConceptId: string;
  mistakeTag: string;
  plainLanguageReason: string;
  prerequisitePath: string[];
  confirmationQuestionIds: string[];
  status: "pending_confirmation" | "confirmed" | "resolved";
}

export interface LearnerProfile {
  version?: number; // Schema version (v1 = 1) for safe migrations
  id: string;
  name: string;
  selectedClass: 6 | 7 | 8 | 9 | 10;
  createdAt: string;
  lastActiveAt: string;
  topicProgress: Record<string, TopicProgress>;
  consecutiveCorrect: number; // profile-level fallback
  consecutiveIncorrect: number; // profile-level fallback
  currentDifficulty: 1 | 2 | 3; // profile-level fallback
  activeGap?: RemediationGap | null;
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
  mistakeTag?: string;
  mistakeDescription?: string;
  suggestedPrerequisiteId?: string;
}

export interface WorksheetResult {
  conceptId: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  qualifiesForCompletion: boolean;
  feedback: QuestionFeedback[];
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
}

export interface GapTraceResult {
  confirmed: boolean;
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
