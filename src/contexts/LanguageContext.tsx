"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { SupportedLanguage } from "@/lib/types";
import { translations } from "@/lib/i18n/translations";
import { resolveLocalizedString } from "@/lib/curriculum";

export interface LanguageContextValue {
  lang: SupportedLanguage;
  language: SupportedLanguage;
  setLang: (newLang: SupportedLanguage) => void;
  setLanguage: (newLang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  resolve: (
    localizedObj: any,
    showDrafts?: boolean
  ) => { text: string; isDraft: boolean };
}

const STORAGE_KEY = "margam_language";
const COOKIE_KEY = "margam_lang";

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved === "en" || saved === "hi" || saved === "te") {
      return saved;
    }
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`)
    );
    if (match && (match[1] === "en" || match[1] === "hi" || match[1] === "te")) {
      return match[1] as SupportedLanguage;
    }
  } catch (err) {
    // ignore local storage / cookie errors
  }
  return "en";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: SupportedLanguage;
}) {
  const [lang, setLangState] = useState<SupportedLanguage>(
    initialLang || "en"
  );

  // Sync initial language from storage on client mount
  useEffect(() => {
    const detected = getInitialLanguage();
    if (detected !== lang) {
      setLangState(detected);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = detected;
    }

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        e.newValue &&
        (e.newValue === "en" || e.newValue === "hi" || e.newValue === "te")
      ) {
        setLangState(e.newValue as SupportedLanguage);
        document.documentElement.lang = e.newValue;
      }
    };

    const handleCustom = (e: Event) => {
      const customLang = (e as CustomEvent).detail;
      if (
        customLang === "en" ||
        customLang === "hi" ||
        customLang === "te"
      ) {
        setLangState(customLang);
        document.documentElement.lang = customLang;
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("margam-language-change", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("margam-language-change", handleCustom);
    };
  }, []);

  const setLang = useCallback((newLang: SupportedLanguage) => {
    if (newLang !== "en" && newLang !== "hi" && newLang !== "te") return;
    setLangState(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.cookie = `${COOKIE_KEY}=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLang;
        window.dispatchEvent(
          new CustomEvent("margam-language-change", { detail: newLang })
        );
      } catch (err) {
        // ignore storage write errors
      }
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[lang] || translations.en;
      const parts = key.split(".");
      let val: any = dict;
      for (const p of parts) {
        if (val && typeof val === "object" && p in val) {
          val = val[p];
        } else {
          val = undefined;
          break;
        }
      }

      // Fallback to English if missing in target language
      if (typeof val !== "string") {
        let engVal: any = translations.en;
        for (const p of parts) {
          if (engVal && typeof engVal === "object" && p in engVal) {
            engVal = engVal[p];
          } else {
            engVal = undefined;
            break;
          }
        }
        val = engVal;
      }

      if (typeof val !== "string") {
        return key;
      }

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          val = val.replaceAll(`{${k}}`, String(v));
        }
      }
      return val;
    },
    [lang]
  );

  const resolve = useCallback(
    (
      localizedObj: any,
      showDrafts = true
    ): { text: string; isDraft: boolean } => {
      return resolveLocalizedString(localizedObj, lang, showDrafts);
    },
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      language: lang,
      setLang,
      setLanguage: setLang,
      t,
      resolve,
    }),
    [lang, setLang, t, resolve]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/**
 * Hook to access current language, changer, translation helper and curriculum resolver.
 * Resilient: if called outside LanguageProvider, safely falls back to local storage detection.
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context) {
    return context;
  }

  // Fallback for SSR / isolated tests
  const fallbackLang = getInitialLanguage();
  const fallbackSetLang = (newLang: SupportedLanguage) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.cookie = `${COOKIE_KEY}=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLang;
        window.dispatchEvent(
          new CustomEvent("margam-language-change", { detail: newLang })
        );
      } catch (e) {
        // ignore
      }
    }
  };

  return {
    lang: fallbackLang,
    language: fallbackLang,
    setLang: fallbackSetLang,
    setLanguage: fallbackSetLang,
    t: (key: string, params?: Record<string, string | number>) => {
      const dict = translations[fallbackLang] || translations.en;
      const parts = key.split(".");
      let val: any = dict;
      for (const p of parts) {
        if (val && typeof val === "object" && p in val) {
          val = val[p];
        } else {
          val = undefined;
          break;
        }
      }
      if (typeof val !== "string") {
        let engVal: any = translations.en;
        for (const p of parts) {
          if (engVal && typeof engVal === "object" && p in engVal) {
            engVal = engVal[p];
          } else {
            engVal = undefined;
            break;
          }
        }
        val = engVal;
      }
      if (typeof val !== "string") return key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          val = val.replaceAll(`{${k}}`, String(v));
        }
      }
      return val;
    },
    resolve: (localizedObj: any, showDrafts = true) => {
      return resolveLocalizedString(localizedObj, fallbackLang, showDrafts);
    },
  };
}

export default useLanguage;

