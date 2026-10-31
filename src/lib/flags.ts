/**
 * Margam Feature Flags
 * Controls progressive rollout of login, tutor, and teacher capabilities.
 * All default to false. Unfinished work is invisible when off.
 */

export interface FeatureFlags {
  FEATURE_LOGIN: boolean;
  FEATURE_TUTOR: boolean;
  FEATURE_TEACHER_TOOLS: boolean;
}

function parseBool(val: string | undefined, defaultVal = false): boolean {
  if (val === undefined || val === null || val === "") return defaultVal;
  return val === "true" || val === "1" || val === "yes";
}

export const flags: FeatureFlags = {
  FEATURE_LOGIN: parseBool(process.env.NEXT_PUBLIC_FEATURE_LOGIN, false),
  FEATURE_TUTOR: parseBool(process.env.NEXT_PUBLIC_FEATURE_TUTOR, false),
  FEATURE_TEACHER_TOOLS: parseBool(process.env.NEXT_PUBLIC_FEATURE_TEACHER_TOOLS, true),
};

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return flags[flag] === true;
}
