import chaptersData from "../../data/chapters.json";
import conceptsData from "../../data/concepts.json";
import lessonsData from "../../data/lessons.json";
import tagRootsData from "../../data/tag-roots.json";
import { Chapter, Concept, Lesson, Question, LocalizedString, SupportedLanguage } from "./types";

export const chapters: Chapter[] = chaptersData as unknown as Chapter[];
export const concepts: Concept[] = conceptsData as unknown as Concept[];
export const lessons: Lesson[] = lessonsData as unknown as Lesson[];
export const tagRoots: Record<string, string> = tagRootsData as unknown as Record<string, string>;

/**
 * Static map of question counts per chapter to determine eligibility without
 * loading full question bodies into client JavaScript bundles.
 */
export const chapterQuestionCounts: Record<string, number> = {
  "c6-ch10": 13,
  "c7-ch10": 13,
  "c8-ch06": 13,
  "c9-ch04": 13,
  "c10-ch04": 14,
  "c6-ch01": 2,
  "c6-ch02": 2,
  "c7-ch01": 2,
  "c7-ch02": 2,
  "c8-ch01": 2,
  "c8-ch02": 2,
  "c9-ch01": 2,
  "c9-ch02": 2,
  "c10-ch01": 2,
  "c10-ch02": 2,
};

/**
 * Returns all NCERT chapters for a specific class (6-10), preserving official curriculum sequence.
 */
export function getChaptersByClass(grade: number): Chapter[] {
  return chapters.filter((c) => c.class === grade);
}

/**
 * Returns only the fully implemented pilot chapters for a class.
 */
export function getSupportedChapters(grade: number): Chapter[] {
  return chapters.filter((c) => c.class === grade && c.status === "full");
}

/**
 * Returns concepts belonging to a specific class.
 */
export function getConceptsByClass(grade: number): Concept[] {
  return concepts.filter((c) => c.class === grade);
}

/**
 * Returns concepts belonging to a specific chapter ID.
 */
export function getConceptsByChapter(chapterId: string): Concept[] {
  return concepts.filter((c) => c.chapterId === chapterId);
}

export function getConceptById(conceptId: string): Concept | undefined {
  return concepts.find((c) => c.id === conceptId);
}

export function getLessonByConceptId(conceptId: string): Lesson | undefined {
  return lessons.find((l) => l.conceptId === conceptId);
}

/**
 * Loads questions for a concept on demand from the chapter's individual questions file.
 * On the client, this returns empty array (client routes must fetch sanitized questions from /api).
 * On the server and in Node test harnesses, this dynamically loads from data/questions/${chapterId}.json.
 */
export function getQuestionsByConceptId(conceptId: string): Question[] {
  const concept = getConceptById(conceptId);
  if (!concept || !concept.chapterId) return [];
  const chapterQuestions = getQuestionsByChapterId(concept.chapterId);
  return chapterQuestions.filter((q) => q.conceptId === conceptId);
}

/**
 * Returns questions for a chapter.
 * Server / Node: loads from data/questions/${chapterId}.json.
 * Client: returns empty (use /api routes).
 */
export function getQuestionsByChapterId(chapterId: string): Question[] {
  if (typeof window !== "undefined") {
    return [];
  }
  try {
    const fs = (eval("require"))("fs");
    const path = (eval("require"))("path");
    const filePath = path.join(process.cwd(), "data", "questions", `${chapterId}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    return [];
  }
  return [];
}

/**
 * Returns the total count of questions available in a chapter.
 */
export function getChapterQuestionCount(chapterId: string): number {
  return chapterQuestionCounts[chapterId] || 0;
}

/**
 * RULE: "Take diagnostic" is only available on chapters whose questions total 6 or more.
 * Other chapters stay lesson-only (no empty or tiny diagnostics).
 */
export function canTakeChapterDiagnostic(chapterId: string): boolean {
  return getChapterQuestionCount(chapterId) >= 6;
}

/**
 * Returns true if the concept has at least minRequired questions in the active question bank.
 */
export function hasEnoughQuestions(conceptId: string, minRequired = 3): boolean {
  return getQuestionsByConceptId(conceptId).length >= minRequired;
}

/**
 * Deterministically returns the first fully supported topic for a given class.
 * Never unlocks an incomplete chapter.
 */
export function getFirstSupportedConcept(grade: number): Concept | undefined {
  const supported = getSupportedChapters(grade);
  if (supported.length === 0) return undefined;
  const firstChapter = supported[0];
  const chapterConcepts = getConceptsByChapter(firstChapter.id);
  return chapterConcepts[0];
}

/**
 * Determines lesson pedagogical variant from mastery score.
 */
export function selectLessonVariant(
  mastery?: number | null
): "basics_first" | "standard" | "fast_track" {
  if (mastery === undefined || mastery === null) return "standard";
  if (mastery < 50) return "basics_first";
  if (mastery >= 80) return "fast_track";
  return "standard";
}

/**
 * Resolves localized text with draft protection:
 * RULE: Unreviewed Hindi/Telugu translations (reviewed: false) are NOT displayed as final.
 * They are displayed as draft in the UI ONLY if the NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS flag is true.
 * Otherwise, the system safely falls back to English (which is always reviewed: true).
 */
export function resolveLocalizedString(
  localized: LocalizedString | undefined,
  targetLang: SupportedLanguage,
  showDrafts = false
): { text: string; isDraft: boolean } {
  if (!localized) {
    return { text: "", isDraft: false };
  }

  // English is canonical and always fully reviewed
  if (targetLang === "en") {
    return { text: localized.en || "", isDraft: false };
  }

  const requestedTranslation = localized[targetLang];
  const isReviewed = localized.reviewed === true;

  // Case 1: Translation is verified by language specialist
  if (requestedTranslation && isReviewed) {
    return { text: requestedTranslation, isDraft: false };
  }

  // Case 2: Draft translations explicitly enabled via flag
  if (requestedTranslation && showDrafts) {
    return { text: requestedTranslation, isDraft: true };
  }

  // Case 3: Default fallback to English to preserve academic rigor
  return { text: localized.en || "", isDraft: false };
}
