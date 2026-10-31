/**
 * Margam Environment Variable Validator
 * Validates configuration at startup and warns with clear diagnostics rather than crashing.
 */

export interface AppEnv {
  appName: string;
  appTagline: string;
  defaultLocale: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  showDraftTranslations: boolean;
  featureLogin: boolean;
  featureTutor: boolean;
  featureTeacherTools: boolean;
}

export function validateEnv(): AppEnv {
  const warnings: string[] = [];

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Margam";
  const appTagline = process.env.NEXT_PUBLIC_APP_TAGLINE || "Sequential Maths";
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (process.env.NEXT_PUBLIC_FEATURE_LOGIN === "true" && (!supabaseUrl || !supabaseAnonKey)) {
    warnings.push(
      "NEXT_PUBLIC_FEATURE_LOGIN is enabled, but NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured."
    );
  }

  if (warnings.length > 0 && typeof window !== "undefined") {
    // Print friendly, non-crashing diagnostic banner in browser console
    console.warn(
      `[Margam Env Diagnostic]\n${warnings.map((w) => ` • ${w}`).join("\n")}`
    );
  }

  return {
    appName,
    appTagline,
    defaultLocale,
    supabaseUrl,
    supabaseAnonKey,
    showDraftTranslations: process.env.NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS === "true",
    featureLogin: process.env.NEXT_PUBLIC_FEATURE_LOGIN === "true",
    featureTutor: process.env.NEXT_PUBLIC_FEATURE_TUTOR === "true",
    featureTeacherTools: process.env.NEXT_PUBLIC_FEATURE_TEACHER_TOOLS === "true",
  };
}

export const env = validateEnv();
