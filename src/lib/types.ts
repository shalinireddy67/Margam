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

export interface Concept {
  id: string;
  class: number; // 6 to 10
  chapter: string;
  name: LocalizedString;
  learningObjective: LocalizedString;
  prerequisites: string[]; // IDs of prerequisite concepts (DAG edges)
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
