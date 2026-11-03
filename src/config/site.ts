/**
 * Margam Site Configuration
 * Single source of truth for branding, metadata, and terminology.
 * Name and tagline can be renamed here directly.
 */

export const SITE_NAME = "Margam";
export const SITE_TAGLINE = "Every learner has a path. Find yours.";
export const SITE_DESCRIPTION =
  "Margam is an adaptive mathematics learning platform for Indian students in Classes 6–10. We diagnose root prerequisite gaps, adapt lessons to individual needs, and support classroom teachers.";

export const SITE_CONFIG = {
  name: SITE_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  version: "1.0.0-phase1",
  stage: "Decode Round — Code Kernel '26",
  languages: [
    { code: "en", label: "English", nativeName: "English" },
    { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
    { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  ],
  starterChapters: [
    {
      classNumber: 7,
      subject: "Mathematics",
      chapterName: "Integers",
      chapterNameHi: "पूर्णांक",
      chapterNameTe: "పూర్ణ సంఖ్యలు",
      description:
        "Signed arithmetic, number line navigation, and foundational sign rules essential for algebra.",
      conceptCount: 4,
    },
    {
      classNumber: 8,
      subject: "Mathematics",
      chapterName: "Linear Equations in One Variable",
      chapterNameHi: "एक चर वाले रैखिक समीकरण",
      chapterNameTe: "ఒక చరరాశిలో రేఖీయ సమీకరణాలు",
      description:
        "Transposition, variable balancing, and translating Indian real-world word problems into equations.",
      conceptCount: 5,
    },
    {
      classNumber: 9,
      subject: "Mathematics",
      chapterName: "Polynomials",
      chapterNameHi: "बहुपद",
      chapterNameTe: "బహుపదులు",
      description:
        "Degree of polynomials, zeroes, factor theorem, and algebraic identities connecting back to integer arithmetic.",
      conceptCount: 5,
    },
  ],
  principles: [
    "Diagnose root prerequisite gaps, don't just assign more drill",
    "Adapt all three stages: Learn, Solve, and Test",
    "Teachers remain in control, never replaced",
    "Zero tracking cookies, DPDP Act 2023 privacy-by-design",
    "Works on low-data devices and includes printable single-sheet A4 worksheets",
  ],
};
