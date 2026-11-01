export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "teacher";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          username: string | null;
          full_name: string;
          selected_class: number | null;
          recovery_code_hash: string | null;
          consent_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          username?: string | null;
          full_name?: string;
          selected_class?: number | null;
          recovery_code_hash?: string | null;
          consent_confirmed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          username?: string | null;
          full_name?: string;
          selected_class?: number | null;
          recovery_code_hash?: string | null;
          consent_confirmed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          teacher_id: string;
          name: string;
          grade: number;
          class_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          name: string;
          grade: number;
          class_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          name?: string;
          grade?: number;
          class_code?: string;
          created_at?: string;
        };
      };
      class_members: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          student_id?: string;
          joined_at?: string;
        };
      };
      attempts: {
        Row: {
          id: string;
          student_id: string;
          type: "diagnostic" | "worksheet" | "test";
          identifier: string;
          score: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          type: "diagnostic" | "worksheet" | "test";
          identifier: string;
          score: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          type?: "diagnostic" | "worksheet" | "test";
          identifier?: string;
          score?: number;
          total?: number;
          created_at?: string;
        };
      };
      concept_mastery: {
        Row: {
          id: string;
          student_id: string;
          concept_id: string;
          mastery: number;
          difficulty: number;
          consecutive_correct: number;
          consecutive_incorrect: number;
          status: string;
          lesson_completed: boolean;
          worksheet_completed: boolean;
          last_attempt_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          concept_id: string;
          mastery?: number;
          difficulty?: number;
          consecutive_correct?: number;
          consecutive_incorrect?: number;
          status?: string;
          lesson_completed?: boolean;
          worksheet_completed?: boolean;
          last_attempt_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          concept_id?: string;
          mastery?: number;
          difficulty?: number;
          consecutive_correct?: number;
          consecutive_incorrect?: number;
          status?: string;
          lesson_completed?: boolean;
          worksheet_completed?: boolean;
          last_attempt_at?: string;
        };
      };
    };
  };
}
