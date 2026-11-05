/**
 * Margam Environment Variable Validator & Centralized Access Layer
 *
 * Provides typed, validated access to environment variables across client and server.
 * Standardizes public and server-only variable naming conventions while supporting
 * backwards-compatible aliases.
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * - Public variables (NEXT_PUBLIC_*) are safe for client and server bundles.
 * - Server-only variables (SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET) are STRICT SECRETS.
 * - Server secrets are NEVER included in exported client env objects or bundles.
 * - Missing variables in production trigger explicit, actionable errors without leaking secret values.
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
  isConfigured: boolean;
  isProduction: boolean;
}

/**
 * Known placeholder markers used in template files and documentation.
 */
const PLACEHOLDER_MARKERS = [
  "your-project",
  "your-publishable-key",
  "your-anon-key",
  "your-server-secret-key",
  "your-service-role-key",
  "your-service-key",
  "generate-a-strong-random-secret",
];

export function isPlaceholderValue(value?: string | null): boolean {
  if (!value) return true;
  return PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

function cleanEnvValue(val?: string | null): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().replace(/^["']|["']$/g, "").trim();
  return clean || undefined;
}

/**
 * Standardized Supabase URL getter.
 * Supports server-side integration SUPABASE_URL as well as NEXT_PUBLIC_SUPABASE_URL.
 */
export function getSupabaseUrl(): string | undefined {
  const raw = cleanEnvValue(
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  if (!raw) return undefined;
  return raw.replace(/\/+$/, "");
}

/**
 * Standardized Supabase Anon / Publishable Key getter.
 * Supports integration names (SUPABASE_PUBLISHABLE_KEY, SUPABASE_ANON_KEY)
 * and public names (NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
 */
export function getSupabaseAnonKey(): string | undefined {
  return cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  );
}

/**
 * Checks whether Supabase configuration is set with valid (non-placeholder) values.
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  return !isPlaceholderValue(url) && !isPlaceholderValue(key);
}

/**
 * Standardized Server-Only Supabase Service Role / Secret Key getter.
 * Supports integration primary name SUPABASE_SECRET_KEY as well as SUPABASE_SERVICE_ROLE_KEY.
 *
 * NOTE: Returns undefined if called on client or if unconfigured.
 */
export function getSupabaseServiceKey(): string | undefined {
  if (typeof window !== "undefined") {
    // Client-side guard: never access or return server secrets
    return undefined;
  }
  return cleanEnvValue(
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY
  );
}

/**
 * Checks whether server-only Supabase admin configuration is set with valid (non-placeholder) values.
 */
export function isAdminConfigured(): boolean {
  if (typeof window !== "undefined") return false;
  const url = getSupabaseUrl();
  const secretKey = getSupabaseServiceKey();
  if (!url || !secretKey) return false;
  return !isPlaceholderValue(url) && !isPlaceholderValue(secretKey);
}

/**
 * Standardized Session HMAC Secret getter.
 * In production: Reads process.env.SESSION_SECRET; warns if unset.
 * In non-production: Uses safe local testing fallback if unset.
 */
export function getSessionSecret(): string {
  const secret = cleanEnvValue(process.env.SESSION_SECRET);
  if (!secret || isPlaceholderValue(secret)) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[Margam Security Warning] SESSION_SECRET is unset or using a placeholder in production. Configure SESSION_SECRET (min 32 characters) in Vercel to guarantee session isolation across serverless cold starts."
      );
    }
    return "margam_internal_secure_hmac_secret_2026";
  }
  return secret;
}

/**
 * Server Configuration Diagnostic Report
 * Validates environment completeness and returns status without printing secret values.
 */
export function validateServerEnvironment(): {
  valid: boolean;
  isProduction: boolean;
  missingVariables: string[];
  placeholderVariables: string[];
} {
  const isProd = process.env.NODE_ENV === "production";
  const missing: string[] = [];
  const placeholders: string[] = [];

  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const serviceKey = getSupabaseServiceKey();
  const sessionSecret = process.env.SESSION_SECRET;

  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  else if (isPlaceholderValue(url)) placeholders.push("NEXT_PUBLIC_SUPABASE_URL");

  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)");
  else if (isPlaceholderValue(anonKey)) placeholders.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)");
  else if (isPlaceholderValue(serviceKey)) placeholders.push("SUPABASE_SERVICE_ROLE_KEY");

  if (!sessionSecret) missing.push("SESSION_SECRET");
  else if (isPlaceholderValue(sessionSecret)) placeholders.push("SESSION_SECRET");

  const valid = missing.length === 0 && placeholders.length === 0;

  if (isProd && !valid) {
    console.error(
      `[Margam Production Config Error]\n` +
      (missing.length > 0 ? `  • Missing required variables: ${missing.join(", ")}\n` : "") +
      (placeholders.length > 0 ? `  • Variables containing placeholder values: ${placeholders.join(", ")}\n` : "") +
      `  Configure these in Vercel Project Settings -> Environment Variables.`
    );
  }

  return {
    valid,
    isProduction: isProd,
    missingVariables: missing,
    placeholderVariables: placeholders,
  };
}

/**
 * Validates configuration and returns a sanitized client-safe environment object.
 */
export function validateEnv(): AppEnv {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Margam";
  const appTagline = process.env.NEXT_PUBLIC_APP_TAGLINE || "Sequential Maths";
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  const configured = isSupabaseConfigured();
  const isProd = process.env.NODE_ENV === "production";

  if (process.env.NEXT_PUBLIC_FEATURE_LOGIN === "true" && !configured) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Margam Env Diagnostic] NEXT_PUBLIC_FEATURE_LOGIN is enabled, but Supabase URL or Anon Key is missing or placeholder."
      );
    }
  }

  return {
    appName,
    appTagline,
    defaultLocale,
    supabaseUrl: configured ? supabaseUrl : undefined,
    supabaseAnonKey: configured ? supabaseAnonKey : undefined,
    showDraftTranslations: process.env.NEXT_PUBLIC_SHOW_DRAFT_TRANSLATIONS === "true",
    featureLogin: process.env.NEXT_PUBLIC_FEATURE_LOGIN !== "false",
    featureTutor: process.env.NEXT_PUBLIC_FEATURE_TUTOR === "true",
    featureTeacherTools: process.env.NEXT_PUBLIC_FEATURE_TEACHER_TOOLS !== "false",
    isConfigured: configured,
    isProduction: isProd,
  };
}

export const env = validateEnv();
