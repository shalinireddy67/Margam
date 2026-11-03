import { LocalizedString, SupportedLanguage } from "./types";

export type TimeOfDay = "morning" | "afternoon" | "evening";

/**
 * Cat time-of-day greetings across English, Hindi, and Telugu.
 * Hindi and Telugu greetings are marked reviewed: false per specification.
 */
export const CAT_TIME_GREETINGS: Record<TimeOfDay, LocalizedString> = {
  morning: {
    en: "Good morning, {name}!",
    hi: "शुभ प्रभात, {name}!",
    te: "శుభోదయం, {name}!",
    reviewed: false,
  },
  afternoon: {
    en: "Good afternoon, {name}!",
    hi: "शुभ दोपहर, {name}!",
    te: "శుభ మధ్యాహ్నం, {name}!",
    reviewed: false,
  },
  evening: {
    en: "Good evening, {name}!",
    hi: "शुभ संध्या, {name}!",
    te: "శుభ సాయంత్రం, {name}!",
    reviewed: false,
  },
};

export const CAT_GREETING_SUBTITLES: Record<SupportedLanguage, string> = {
  en: "Ready for maths practice today?",
  hi: "क्या आप आज के गणित अभ्यास के लिए तैयार हैं?",
  te: "ఈరోజు గణిత అభ్యాసానికి సిద్ధంగా ఉన్నారా?",
};

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function getCatGreeting(
  studentName?: string,
  lang: SupportedLanguage = "en",
  date: Date = new Date()
): { text: string; subtitle: string; timeOfDay: TimeOfDay; reviewed: boolean } {
  const timeOfDay = getTimeOfDay(date);
  const template = CAT_TIME_GREETINGS[timeOfDay];
  const fallbackName = lang === "hi" ? "विद्यार्थी" : lang === "te" ? "విద్యార్థి" : "Learner";
  const name = studentName && studentName.trim() ? studentName.trim() : fallbackName;
  const rawText = template[lang] || template.en;
  return {
    text: rawText.replace("{name}", name),
    subtitle: CAT_GREETING_SUBTITLES[lang] || CAT_GREETING_SUBTITLES.en,
    timeOfDay,
    reviewed: template.reviewed,
  };
}
