/**
 * Margam Sound Engine
 * All audio effects are disabled per accessibility and focus requirements (NO sound rule).
 */

const SOUND_STORAGE_KEY = "margam_sound_enabled";

export function isSoundEnabled(): boolean {
  return false;
}

export function setSoundEnabled(enabled: boolean): void {}

export function playPopSound(): void {}

export function playLevelUpSound(): void {}

export function playGentleOopsSound(): void {}
