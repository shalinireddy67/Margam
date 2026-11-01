import fs from "fs";
import path from "path";
import conceptsData from "../../../data/concepts.json";
import { Question, LocalizedString } from "../types";

export interface SanitizedOption {
  id: string;
  text: LocalizedString;
}

export interface SanitizedQuestion {
  id: string;
  conceptId: string;
  difficulty: number;
  type: string;
  contextTag?: string;
  prompt: LocalizedString;
  options: SanitizedOption[];
}

// In-memory cache for loaded chapter questions
const chapterCache = new Map<string, Question[]>();

// Fast map from conceptId -> chapterId
const conceptToChapterMap: Record<string, string> = {};
for (const c of conceptsData as any[]) {
  conceptToChapterMap[c.id] = c.chapterId;
}

/**
 * Loads all questions for a given chapter from data/questions/${chapterId}.json.
 * Server-only file reading with in-memory caching.
 */
export function getChapterQuestions(chapterId: string): Question[] {
  if (chapterCache.has(chapterId)) {
    return chapterCache.get(chapterId)!;
  }

  const filePath = path.join(process.cwd(), "data", "questions", `${chapterId}.json`);
  if (!fs.existsSync(filePath)) {
    chapterCache.set(chapterId, []);
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed: Question[] = JSON.parse(raw);
    chapterCache.set(chapterId, parsed);
    return parsed;
  } catch (err) {
    console.error(`Error loading questions for chapter ${chapterId}:`, err);
    return [];
  }
}

/**
 * Loads questions for a given conceptId by locating its parent chapter.
 */
export function getConceptQuestions(conceptId: string): Question[] {
  const chapterId = conceptToChapterMap[conceptId];
  if (!chapterId) {
    return [];
  }
  const chapterQuestions = getChapterQuestions(chapterId);
  return chapterQuestions.filter((q) => q.conceptId === conceptId);
}

/**
 * Sanitizes a question by stripping correctAnswer and any mistakeTag from options.
 * This ensures answer keys and internal diagnostic tags never reach the browser.
 */
export function sanitizeQuestion(q: Question): SanitizedQuestion {
  return {
    id: q.id,
    conceptId: q.conceptId,
    difficulty: q.difficulty,
    type: q.type,
    contextTag: q.contextTag,
    prompt: q.prompt,
    options: (q.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
}
