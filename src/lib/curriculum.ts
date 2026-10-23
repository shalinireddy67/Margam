import chaptersData from "../../data/chapters.json";
import conceptsData from "../../data/concepts.json";
import questionsData from "../../data/questions.json";
import lessonsData from "../../data/lessons.json";
import tagRootsData from "../../data/tag-roots.json";
import { Chapter, Concept, Lesson, Question } from "./types";

export const chapters: Chapter[] = chaptersData as Chapter[];
export const concepts: Concept[] = conceptsData as Concept[];
export const questions: Question[] = questionsData as Question[];
export const lessons: Lesson[] = lessonsData as Lesson[];
export const tagRoots: Record<string, string> = tagRootsData as Record<string, string>;

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

export function getQuestionsByConceptId(conceptId: string): Question[] {
  return questions.filter((q) => q.conceptId === conceptId);
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
