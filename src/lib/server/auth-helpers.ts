import crypto from "crypto";

export const INTERNAL_STUDENT_DOMAIN = "student.internal.margam.local";

/**
 * Normalizes username and generates a synthetic address on a non-mailable domain.
 */
export function generateStudentEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${clean}@${INTERNAL_STUDENT_DOMAIN}`;
}

/**
 * Generates an unguessable 16-character recovery code formatted as XXXX-XXXX-XXXX-XXXX.
 */
export function generateRecoveryCode(): string {
  const bytes = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `${bytes.substring(0, 4)}-${bytes.substring(4, 8)}-${bytes.substring(8, 12)}-${bytes.substring(12, 16)}`;
}

/**
 * Computes deterministic SHA-256 hash for storage of recovery code.
 */
export function hashRecoveryCode(code: string): string {
  const normalized = code.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Generates a memorable 6-character class code like "MGM-8A" or "C8-7K2X".
 */
export function generateClassCode(grade = 8): string {
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MGM-C${grade}-${rand}`;
}

// In-memory fallback auth & profile registry for testing & unconfigured environments
export interface StoredUserProfile {
  id: string;
  role: "student" | "teacher";
  username: string | null;
  email: string;
  passwordHash: string; // for mock verification
  fullName: string;
  selectedClass: number | null;
  recoveryCodeHash: string | null;
  consentConfirmed: boolean;
  classCode?: string | null;
  is_demo?: boolean;
  avatar_pixel?: string;
  createdAt: string;
  updated_at: string;
}

export interface StoredClass {
  id: string;
  teacherId: string;
  name: string;
  grade: number;
  classCode: string;
  createdAt: string;
}

export interface StoredClassMember {
  id: string;
  classId: string;
  studentId: string;
  joinedAt: string;
}

export interface StoredAttempt {
  id: string;
  studentId: string;
  type: "diagnostic" | "worksheet" | "test";
  identifier: string;
  score: number;
  total: number;
  createdAt: string;
}

export interface StoredConceptMastery {
  id: string;
  studentId: string;
  conceptId: string;
  mastery: number;
  difficulty: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  status: string;
  lessonCompleted: boolean;
  worksheetCompleted: boolean;
  lastAttemptAt: string;
}

class MockDatabaseStore {
  profiles = new Map<string, StoredUserProfile>();
  classes = new Map<string, StoredClass>();
  classMembers = new Map<string, StoredClassMember>();
  attempts: StoredAttempt[] = [];
  conceptMastery = new Map<string, StoredConceptMastery>(); // key: studentId:conceptId

  clear() {
    this.profiles.clear();
    this.classes.clear();
    this.classMembers.clear();
    this.attempts = [];
    this.conceptMastery.clear();
  }
}

export const mockDb = new MockDatabaseStore();
