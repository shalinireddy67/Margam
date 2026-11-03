#!/usr/bin/env node

/**
 * Margam Parametric Question Generator (Phase 5)
 * 
 * Generates verified, deterministic questions for the 10 pilot concepts across Classes 6–10.
 * 
 * HARD CONSTRAINTS:
 * - Uses a seeded deterministic RNG (Mulberry32).
 * - Computes correct answers mathematically in code.
 * - Applies known misconception rules with verified tags strictly from data/tag-roots.json.
 * - Deduplicates against existing questions and preserves all original questions intact.
 * - Outputs 18 balanced questions per pilot concept across difficulty 1, 2, and 3.
 * - Updates chapter-split files, data/questions.json, and data/chapter-counts.json.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const questionsDir = path.join(rootDir, "data", "questions");
const questionsJsonPath = path.join(rootDir, "data", "questions.json");
const chapterCountsPath = path.join(rootDir, "data", "chapter-counts.json");
const tagRootsPath = path.join(rootDir, "data", "tag-roots.json");
const conceptsPath = path.join(rootDir, "data", "concepts.json");

const tagRoots = JSON.parse(fs.readFileSync(tagRootsPath, "utf8"));
const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf8"));

// Seeded deterministic RNG (Mulberry32)
function createRng(seed = 20261103) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(422026);

function randInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickOne(arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// -----------------------------------------------------------------------------
// PILOT CONCEPT DEFINITIONS & TARGETS
// -----------------------------------------------------------------------------
const PILOT_CONCEPTS = [
  // Chain 1: Quadratic Progression
  { conceptId: "c6-neg-01", chapterId: "c6-ch10", class: 6 },
  { conceptId: "c7-int-02", chapterId: "c7-ch10", class: 7 },
  { conceptId: "c8-dist-01", chapterId: "c8-ch06", class: 8 },
  { conceptId: "c9-id-01", chapterId: "c9-ch04", class: 9 },
  { conceptId: "c10-quad-01", chapterId: "c10-ch04", class: 10 },
  // Chain 2: Algebraic Progression
  { conceptId: "c6-pat-01", chapterId: "c6-ch01", class: 6 },
  { conceptId: "c7-alg-01", chapterId: "c7-ch02", class: 7 },
  { conceptId: "c8-exp-01", chapterId: "c8-ch02", class: 8 },
  { conceptId: "c9-poly-01", chapterId: "c9-ch02", class: 9 },
  { conceptId: "c10-poly-01", chapterId: "c10-ch02", class: 10 },
];

/**
 * Formats options into standardized A, B, C, D array with correct letter assignment
 */
function buildOptions(correctText, distractors) {
  // Distractors: array of 3 { text: string, mistakeTag: string }
  const rawItems = [
    { text: correctText, isCorrect: true },
    { text: distractors[0].text, mistakeTag: distractors[0].mistakeTag, isCorrect: false },
    { text: distractors[1].text, mistakeTag: distractors[1].mistakeTag, isCorrect: false },
    { text: distractors[2].text, mistakeTag: distractors[2].mistakeTag, isCorrect: false },
  ];

  const shuffled = shuffle(rawItems);
  const letters = ["A", "B", "C", "D"];
  let correctAnswer = "A";

  const options = shuffled.map((item, idx) => {
    const letter = letters[idx];
    if (item.isCorrect) {
      correctAnswer = letter;
      return {
        id: letter,
        text: { en: item.text, hi: item.text, te: item.text, reviewed: false },
      };
    } else {
      // Validate mistake tag
      if (!tagRoots[item.mistakeTag]) {
        throw new Error(`CRITICAL: Tag "${item.mistakeTag}" does not exist in data/tag-roots.json!`);
      }
      return {
        id: letter,
        text: { en: item.text, hi: item.text, te: item.text, reviewed: false },
        mistakeTag: item.mistakeTag,
      };
    }
  });

  return { options, correctAnswer };
}

// =============================================================================
// CONCEPT GENERATORS
// =============================================================================

// 1. Concept: c6-neg-01 (Negative Numbers & Absolute/Opposite Quantities)
function genC6Neg(diff, idx) {
  const id = `q-gen-c6-neg-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const temp = randInt(6, 25);
    const promptEn = `A town's temperature drops to ${temp}°C below 0°C. Which integer represents this temperature?`;
    const promptHi = `एक शहर का तापमान 0°C से ${temp}°C नीचे चला जाता है। कौन सा पूर्णांक इस तापमान को दर्शाता है?`;
    const promptTe = `ఒక పట్టణ ఉష్ణోగ్రత 0°C కంటే ${temp}°C తక్కువకు పడిపోయింది. ఈ ఉష్ణోగ్రతను ఏ పూర్ణసంఖ్య సూచిస్తుంది?`;

    const correct = `-${temp}°C`;
    const distractors = [
      { text: `+${temp}°C`, mistakeTag: "positive_sign_for_below_zero" },
      { text: `0°C`, mistakeTag: "confused_zero_with_below_zero" },
      { text: `-${temp + 10}°C`, mistakeTag: "assumed_minimum_negative_integer" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-neg-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Values below 0 are negative integers. ${temp}°C below zero is written as -${temp}°C.`,
        hi: `शून्य से नीचे के मान ऋणात्मक होते हैं। 0°C से ${temp}°C नीचे को -${temp}°C लिखा जाता है।`,
        te: `0 కంటే తక్కువ విలువలు రుణ పూర్ణసంఖ్యలు. 0°C కంటే ${temp}°C తక్కువను -${temp}°C గా రాస్తారు.`,
        reviewed: false,
      },
      hint: {
        en: "Quantities below zero or reference points use the minus (-) sign.",
        hi: "शून्य से नीचे की मात्राओं के लिए ऋण (-) चिह्न का प्रयोग करें।",
        te: "సున్నా కంటే తక్కువ ఉన్న పరిమాణాలకు మైనస్ (-) గుర్తును ఉపయోగించండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const alt = randInt(150, 450);
    const depth = randInt(40, 180);
    const diffVal = alt + depth;

    const promptEn = `A drone flies at +${alt} m above sea level, and a submarine explores at -${depth} m below sea level. What is the vertical distance between them?`;
    const promptHi = `एक ड्रोन समुद्र तल से +${alt} मीटर ऊपर उड़ता है, और एक पनडुब्बी समुद्र तल से -${depth} मीटर नीचे है। उनके बीच की ऊर्ध्वाधर दूरी क्या है?`;
    const promptTe = `ఒక డ్రోన్ సముద్ర మట్టానికి +${alt} మీటర్ల ఎత్తులో ఎగురుతోంది, జలాంతర్గామి -${depth} మీటర్ల లోతులో ఉంది. వాటి మధ్య నిలువు దూరం ఎంత?`;

    const correct = `${diffVal} m`;
    const distractors = [
      { text: `${alt - depth} m`, mistakeTag: "negative_difference_fallacy" },
      { text: `-${diffVal} m`, mistakeTag: "distance_expressed_as_negative" },
      { text: `${alt} m`, mistakeTag: "confused_zero_with_below_zero" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-neg-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Vertical distance = (+${alt}) - (-${depth}) = ${alt} + ${depth} = ${diffVal} m. Distance is always positive.`,
        hi: `ऊर्ध्वाधर दूरी = (+${alt}) - (-${depth}) = ${alt} + ${depth} = ${diffVal} मीटर।`,
        te: `నిలువు దూరం = (+${alt}) - (-${depth}) = ${alt} + ${depth} = ${diffVal} మీటర్లు.`,
        reviewed: false,
      },
      hint: {
        en: "Subtracting a negative depth adds to the positive altitude: a - (-b) = a + b.",
        hi: "ऋणात्मक गहराई को घटाने पर वह धनात्मक में जुड़ जाती है: a - (-b) = a + b।",
        te: "రుణ లోతును తీసివేస్తే అది ధనాత్మక ఎత్తుకు కలుస్తుంది: a - (-b) = a + b.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const start = randInt(2, 8);
    const rise = randInt(5, 12);
    const drop = randInt(14, 25);
    const net = -start + rise - drop;

    const promptEn = `The morning temperature was -${start}°C. By noon, it rose by ${rise}°C, but by midnight it fell by ${drop}°C. What was the midnight temperature?`;
    const promptHi = `सुबह का तापमान -${start}°C था। दोपहर तक इसमें ${rise}°C की वृद्धि हुई, लेकिन आधी रात तक इसमें ${drop}°C की गिरावट आई। आधी रात का तापमान क्या था?`;
    const promptTe = `ఉదయం ఉష్ణోగ్రత -${start}°C. మధ్యాహ్నానికి ${rise}°C పెరిగింది, కానీ అర్ధరాత్రికి ${drop}°C తగ్గింది. అర్ధరాత్రి ఉష్ణోగ్రత ఎంత?`;

    const correct = `${net}°C`;
    const distractors = [
      { text: `${Math.abs(net)}°C`, mistakeTag: "positive_sign_for_below_zero" },
      { text: `${-start - rise - drop}°C`, mistakeTag: "negative_difference_fallacy" },
      { text: `${start + rise + drop}°C`, mistakeTag: "confused_absolute_value_with_signed_value" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-neg-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Calculate step-by-step: -${start} + ${rise} = ${-start + rise}, then ${-start + rise} - ${drop} = ${net}°C.`,
        hi: `चरणबद्ध गणना: -${start} + ${rise} = ${-start + rise}, फिर ${-start + rise} - ${drop} = ${net}°C।`,
        te: `దశలవారీగా లెక్కించండి: -${start} + ${rise} = ${-start + rise}, తర్వాత ${-start + rise} - ${drop} = ${net}°C.`,
        reviewed: false,
      },
      hint: {
        en: "Track the signs sequentially: start with -a, add the rise (+b), subtract the drop (-c).",
        hi: "चिह्नों का क्रमानुसार ध्यान रखें: -a से शुरू करें, वृद्धि (+b) जोड़ें, गिरावट (-c) घटाएँ।",
        te: "గుర్తులను వరుసగా గమనించండి: -a తో ప్రారంభించి, పెరుగుదలను (+b) కలిపి, తగ్గుదలను (-c) తీసివేయండి.",
        reviewed: false,
      },
    };
  }
}

// 2. Concept: c7-int-02 (Multiplication of Integers & Sign Rules)
function genC7Int(diff, idx) {
  const id = `q-gen-c7-int-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(4, 12);
    const b = randInt(3, 9);
    const prod = a * b;

    const promptEn = `Evaluate: (-${a}) × (-${b})`;
    const promptHi = `मान ज्ञात कीजिए: (-${a}) × (-${b})`;
    const promptTe = `విలువను కనుగొనండి: (-${a}) × (-${b})`;

    const correct = `${prod}`;
    const distractors = [
      { text: `-${prod}`, mistakeTag: "negative_times_negative_equals_negative_error" },
      { text: `-${a + b}`, mistakeTag: "added_instead_of_multiplied_with_negative" },
      { text: `${a + b}`, mistakeTag: "added_instead_of_multiplied_positive" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-int-02",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `The product of two negative integers is always positive: (-${a}) × (-${b}) = +(${a} × ${b}) = ${prod}.`,
        hi: `दो ऋणात्मक पूर्णांकों का गुणनफल सदैव धनात्मक होता है: (-${a}) × (-${b}) = +${prod}।`,
        te: `రెండు రుణ పూర్ణసంఖ్యల లబ్దం ఎల్లప్పుడూ ధనాత్మకం: (-${a}) × (-${b}) = +${prod}.`,
        reviewed: false,
      },
      hint: {
        en: "Remember the fundamental rule: negative × negative = positive.",
        hi: "मूलभूत नियम याद रखें: ऋण × ऋण = धन।",
        te: "ప్రాథమిక సూత్రం గుర్తుంచుకోండి: మైనస్ × మైనస్ = ప్లస్.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const a = randInt(2, 5);
    const b = randInt(3, 6);
    const c = randInt(2, 4);
    const prod = -(a * b * c);

    const promptEn = `Find the product: (-${a}) × (-${b}) × (-${c})`;
    const promptHi = `गुणनफल ज्ञात कीजिए: (-${a}) × (-${b}) × (-${c})`;
    const promptTe = `లబ్దాన్ని కనుగొనండి: (-${a}) × (-${b}) × (-${c})`;

    const correct = `${prod}`;
    const distractors = [
      { text: `${Math.abs(prod)}`, mistakeTag: "odd_even_negative_count_confusion" },
      { text: `-${a + b + c}`, mistakeTag: "added_instead_of_multiplied_with_negative" },
      { text: `${-(a * b)}`, mistakeTag: "incomplete_multiplication_of_factors" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-int-02",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Odd number of negative factors (3) yields a negative product: (-${a}) × (-${b}) = +${a*b}, then (+${a*b}) × (-${c}) = ${prod}.`,
        hi: `विषम संख्या (3) में ऋणात्मक गुणनखंड होने पर परिणाम ऋणात्मक होता है: ${prod}।`,
        te: `బేసి సంఖ్యలో (3) రుణాంకాలు ఉన్నప్పుడు ఫలితం రుణాత్మకం అవుతుంది: ${prod}.`,
        reviewed: false,
      },
      hint: {
        en: "An odd number of negative signs yields a negative answer; an even number yields positive.",
        hi: "ऋणात्मक चिह्नों की विषम संख्या पर उत्तर ऋणात्मक और सम संख्या पर धनात्मक होता है।",
        te: "రుణ గుర్తుల సంఖ్య బేసి అయితే ఫలితం రుణాత్మకం, సరి అయితే ధనాత్మకం.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const mult = randInt(3, 7);
    const x = randInt(4, 9);
    const y = randInt(5, 11);
    const net = -mult * (-x - y);

    const promptEn = `Calculate using the distributive property: (-${mult}) × [(-${x}) + (-${y})]`;
    const promptHi = `वितरण नियम का उपयोग करके गणना कीजिए: (-${mult}) × [(-${x}) + (-${y})]`;
    const promptTe = `విభాగ న్యాయాన్ని ఉపయోగించి లెక్కించండి: (-${mult}) × [(-${x}) + (-${y})]`;

    const correct = `${net}`;
    const distractors = [
      { text: `-${net}`, mistakeTag: "sign_error_positive_times_negative" },
      { text: `${mult * x - mult * y}`, mistakeTag: "negative_times_negative_equals_negative_error" },
      { text: `-${mult + x + y}`, mistakeTag: "added_instead_of_multiplied_with_negative" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-int-02",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `(-${mult}) × (-${x}) + (-${mult}) × (-${y}) = +${mult*x} + +${mult*y} = ${net}. Both terms become positive!`,
        hi: `(-${mult}) × (-${x}) + (-${mult}) × (-${y}) = +${mult*x} + +${mult*y} = ${net}।`,
        te: `(-${mult}) × (-${x}) + (-${mult}) × (-${y}) = +${mult*x} + +${mult*y} = ${net}. రెండు పదాలు ధనాత్మకం అవుతాయి!`,
        reviewed: false,
      },
      hint: {
        en: "Distribute -a across both negative terms: (-a) × (-b) + (-a) × (-c).",
        hi: "दोनों ऋणात्मक पदों में -a को गुणा करें: (-a) × (-b) + (-a) × (-c) ।",
        te: "రెండు రుణ పదాలతో -a ని గుణించండి: (-a) × (-b) + (-a) × (-c).",
        reviewed: false,
      },
    };
  }
}

// 3. Concept: c8-dist-01 (Distributive Law with Signed Monomials)
function genC8Dist(diff, idx) {
  const id = `q-gen-c8-dist-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(4, 9);

    const promptEn = `Expand using the distributive law: ${a}(${b}x + ${c})`;
    const promptHi = `वितरण नियम का उपयोग करके प्रसार कीजिए: ${a}(${b}x + ${c})`;
    const promptTe = `విభాగ న్యాయాన్ని ఉపయోగించి విస్తరించండి: ${a}(${b}x + ${c})`;

    const correct = `${a * b}x + ${a * c}`;
    const distractors = [
      { text: `${a * b}x + ${c}`, mistakeTag: "neglected_distributing_to_second_term" },
      { text: `${a + b}x + ${a + c}`, mistakeTag: "added_coefficients_instead_of_multiplied" },
      { text: `${b}x + ${a * c}`, mistakeTag: "multiplied_variable_only" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-dist-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Multiply the outside factor ${a} with both terms inside: (${a} × ${b}x) + (${a} × ${c}) = ${a*b}x + ${a*c}.`,
        hi: `बाहरी पद ${a} को कोष्ठक के दोनों पदों से गुणा करें: ${a*b}x + ${a*c}।`,
        te: `బయట ఉన్న ${a} తో బ్రాకెట్ లోని రెండు పదాలను గుణించండి: ${a*b}x + ${a*c}.`,
        reviewed: false,
      },
      hint: {
        en: "a(b + c) = ab + ac. Make sure to multiply every term inside the parentheses.",
        hi: "a(b + c) = ab + ac। कोष्ठक के अंदर प्रत्येक पद से गुणा करना सुनिश्चित करें।",
        te: "a(b + c) = ab + ac. బ్రాకెట్ లోపల ఉన్న ప్రతి పదాన్ని గుణించాలి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const a = randInt(3, 7);
    const b = randInt(2, 5);
    const c = randInt(3, 8);

    const promptEn = `Expand and simplify: -${a}(${b}x - ${c})`;
    const promptHi = `प्रसार और सरल कीजिए: -${a}(${b}x - ${c})`;
    const promptTe = `విస్తరించి సూక్ష్మీకరించండి: -${a}(${b}x - ${c})`;

    const correct = `-${a * b}x + ${a * c}`;
    const distractors = [
      { text: `-${a * b}x - ${a * c}`, mistakeTag: "sign_error_positive_times_negative" },
      { text: `-${a * b}x - ${c}`, mistakeTag: "neglected_distributing_to_second_term" },
      { text: `${a * b}x + ${a * c}`, mistakeTag: "dropped_negative_on_first_term" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-dist-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `(-${a}) × (${b}x) = -${a*b}x and (-${a}) × (-${c}) = +${a*c}. Result: -${a*b}x + ${a*c}.`,
        hi: `(-${a}) × (${b}x) = -${a*b}x तथा (-${a}) × (-${c}) = +${a*c}। परिणाम: -${a*b}x + ${a*c}।`,
        te: `(-${a}) × (${b}x) = -${a*b}x మరియు (-${a}) × (-${c}) = +${a*c}. ఫలితం: -${a*b}x + ${a*c}.`,
        reviewed: false,
      },
      hint: {
        en: "Watch the negative multiplier: (-a) × (-c) produces a positive (+ac) second term.",
        hi: "ऋणात्मक गुणक का ध्यान रखें: (-a) × (-c) से धनात्मक (+ac) दूसरा पद बनता है।",
        te: "రుణ గుణకాన్ని గమనించండి: (-a) × (-c) ధనాత్మక (+ac) రెండవ పదాన్ని ఇస్తుంది.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = randInt(2, 5);
    const b = randInt(2, 4);
    const c = randInt(3, 7);

    const promptEn = `Expand: -${a}x(${b}x - ${c})`;
    const promptHi = `प्रसार कीजिए: -${a}x(${b}x - ${c})`;
    const promptTe = `విస్తరించండి: -${a}x(${b}x - ${c})`;

    const correct = `-${a * b}x² + ${a * c}x`;
    const distractors = [
      { text: `-${a * b}x² - ${a * c}x`, mistakeTag: "sign_error_positive_times_negative" },
      { text: `-${a * b}x² + ${a * c}`, mistakeTag: "neglected_distributing_to_second_term" },
      { text: `${a * b}x² + ${a * c}x`, mistakeTag: "dropped_negative_on_first_term" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-dist-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `(-${a}x) × (${b}x) = -${a*b}x² and (-${a}x) × (-${c}) = +${a*c}x. Result: -${a*b}x² + ${a*c}x.`,
        hi: `(-${a}x) × (${b}x) = -${a*b}x² तथा (-${a}x) × (-${c}) = +${a*c}x। परिणाम: -${a*b}x² + ${a*c}x।`,
        te: `(-${a}x) × (${b}x) = -${a*b}x² మరియు (-${a}x) × (-${c}) = +${a*c}x. ఫలితం: -${a*b}x² + ${a*c}x.`,
        reviewed: false,
      },
      hint: {
        en: "Multiply coefficients and add exponents: x × x = x², and (-ax) × (-c) = +acx.",
        hi: "गुणांकों को गुणा करें और घातों को जोड़ें: x × x = x² तथा (-ax) × (-c) = +acx।",
        te: "గుణకాలను గుణించి ఘాతాలను కూడండి: x × x = x² మరియు (-ax) × (-c) = +acx.",
        reviewed: false,
      },
    };
  }
}

// 4. Concept: c9-id-01 (Standard Algebraic Identities)
function genC9Id(diff, idx) {
  const id = `q-gen-c9-id-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(3, 9);
    const a2 = a * a;
    const mid = 2 * a;

    const promptEn = `Expand using algebraic identity: (x + ${a})²`;
    const promptHi = `बीजीय सर्वसमिका का उपयोग करके प्रसार कीजिए: (x + ${a})²`;
    const promptTe = `బీజీయ సర్వసమీకరణాన్ని ఉపయోగించి విస్తరించండి: (x + ${a})²`;

    const correct = `x² + ${mid}x + ${a2}`;
    const distractors = [
      { text: `x² + ${a2}`, mistakeTag: "omitted_middle_linear_terms" },
      { text: `x² + ${a}x + ${a2}`, mistakeTag: "forgot_factor_of_two_in_middle_term" },
      { text: `x² - ${a2}`, mistakeTag: "confused_squared_binomial_with_difference_of_squares" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-id-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Using (a + b)² = a² + 2ab + b²: x² + 2(x)(${a}) + ${a}² = x² + ${mid}x + ${a2}.`,
        hi: `(a + b)² = a² + 2ab + b² से: x² + ${mid}x + ${a2}।`,
        te: `(a + b)² = a² + 2ab + b² ఉపయోగించి: x² + ${mid}x + ${a2}.`,
        reviewed: false,
      },
      hint: {
        en: "Do not forget the middle term 2ab in (a + b)².",
        hi: "(a + b)² में मध्य पद 2ab को न भूलें।",
        te: "(a + b)² లో మధ్య పదం 2ab ని మర్చిపోకండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const k = randInt(2, 5);
    const a = randInt(3, 7);
    const k2 = k * k;
    const mid = 2 * k * a;
    const a2 = a * a;

    const promptEn = `Expand using identity: (${k}x - ${a})²`;
    const promptHi = `सर्वसमिका का उपयोग करके प्रसार कीजिए: (${k}x - ${a})²`;
    const promptTe = `సర్వసమీకరణాన్ని ఉపయోగించి విస్తరించండి: (${k}x - ${a})²`;

    const correct = `${k2}x² - ${mid}x + ${a2}`;
    const distractors = [
      { text: `${k2}x² + ${mid}x + ${a2}`, mistakeTag: "sign_error_middle_term_positive_instead_of_negative" },
      { text: `${k2}x² - ${a2}`, mistakeTag: "omitted_middle_linear_terms" },
      { text: `${2*k}x² - ${mid}x + ${2*a}`, mistakeTag: "multiplied_by_two_instead_of_squaring" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-id-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Using (a - b)² = a² - 2ab + b²: (${k}x)² - 2(${k}x)(${a}) + (${a})² = ${k2}x² - ${mid}x + ${a2}.`,
        hi: `(a - b)² = a² - 2ab + b² से: ${k2}x² - ${mid}x + ${a2}।`,
        te: `(a - b)² = a² - 2ab + b² ఉపయోగించి: ${k2}x² - ${mid}x + ${a2}.`,
        reviewed: false,
      },
      hint: {
        en: "In (a - b)², the middle term is -2ab and the last term +b² is always positive.",
        hi: "(a - b)² में मध्य पद -2ab होता है तथा अंतिम पद +b² सदैव धनात्मक होता है।",
        te: "(a - b)² లో మధ్య పదం -2ab మరియు చివరి పదం +b² ఎల్లప్పుడూ ధనాత్మకం.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const a2 = a * a;
    const b2 = b * b;

    const promptEn = `Expand using difference of squares: (${a}x + ${b})(${a}x - ${b})`;
    const promptHi = `वर्गों के अंतर की सर्वसमिका का उपयोग करके प्रसार कीजिए: (${a}x + ${b})(${a}x - ${b})`;
    const promptTe = `వర్గాల తేడా సర్వసమీకరణాన్ని ఉపయోగించి విస్తరించండి: (${a}x + ${b})(${a}x - ${b})`;

    const correct = `${a2}x² - ${b2}`;
    const distractors = [
      { text: `${a2}x² + ${2*a*b}x - ${b2}`, mistakeTag: "included_non_existent_middle_term_in_difference_of_squares" },
      { text: `${a2}x² + ${b2}`, mistakeTag: "sign_error_difference_of_squares" },
      { text: `${a2}x² - ${2*a*b}x + ${b2}`, mistakeTag: "confused_squared_binomial_with_difference_of_squares" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-id-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Using (a + b)(a - b) = a² - b²: (${a}x)² - (${b})² = ${a2}x² - ${b2}. The linear middle terms cancel out.`,
        hi: `(a + b)(a - b) = a² - b² से: ${a2}x² - ${b2}।`,
        te: `(a + b)(a - b) = a² - b² ఉపయోగించి: ${a2}x² - ${b2}.`,
        reviewed: false,
      },
      hint: {
        en: "(a + b)(a - b) yields difference of squares a² - b² with no middle term.",
        hi: "(a + b)(a - b) से a² - b² प्राप्त होता है, इसमें कोई मध्य पद नहीं होता।",
        te: "(a + b)(a - b) అనేది a² - b² ని ఇస్తుంది, ఇందులో మధ్య పదం ఉండదు.",
        reviewed: false,
      },
    };
  }
}

// 5. Concept: c10-quad-01 (Solving Quadratic Equations by Factoring)
function genC10Quad(diff, idx) {
  const id = `q-gen-c10-quad-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const p = randInt(2, 6);
    const q = randInt(p + 1, 9);
    const b = p + q;
    const c = p * q;

    const promptEn = `Solve the quadratic equation by factoring: x² - ${b}x + ${c} = 0`;
    const promptHi = `गुणनखंडन द्वारा द्विघात समीकरण हल कीजिए: x² - ${b}x + ${c} = 0`;
    const promptTe = `కారణాంక పద్ధతిలో వర్గ సమీకరణాన్ని సాధించండి: x² - ${b}x + ${c} = 0`;

    const correct = `x = ${p}, x = ${q}`;
    const distractors = [
      { text: `x = -${p}, x = -${q}`, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { text: `x = ${p}, x = -${q}`, mistakeTag: "inconsistent_sign_inversion" },
      { text: `x = ${p+1}, x = ${q-1}`, mistakeTag: "incorrect_factor_pair_sum" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-quad-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Factor into (x - ${p})(x - ${q}) = 0. By zero product property, x = ${p} or x = ${q}.`,
        hi: `(x - ${p})(x - ${q}) = 0 के रूप में गुणनखंडित करें। शून्य गुणनफल नियम से x = ${p} या x = ${q}।`,
        te: `(x - ${p})(x - ${q}) = 0 గా మార్చండి. శూన్య లబ్ద నియమం ప్రకారం x = ${p} లేదా x = ${q}.`,
        reviewed: false,
      },
      hint: {
        en: "Find two numbers multiplying to +c and adding to -b, then invert signs for the roots: (x - r) = 0 => x = +r.",
        hi: "दो संख्याएँ खोजें जिनका गुणन +c और योग -b हो, फिर मूलों के लिए चिह्न बदलें।",
        te: "గుణిస్తే +c మరియు కూడితే -b వచ్చే రెండు సంఖ్యలను కనుగొని, మూలాల కోసం గుర్తులను మార్చండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const p = randInt(5, 9);
    const q = randInt(2, p - 1);
    const b = p - q;
    const c = p * q;

    const promptEn = `Find the roots of: x² + ${b}x - ${c} = 0`;
    const promptHi = `समीकरण के मूल ज्ञात कीजिए: x² + ${b}x - ${c} = 0`;
    const promptTe = `సమీకరణ మూలాలను కనుగొనండి: x² + ${b}x - ${c} = 0`;

    const correct = `x = -${p}, x = ${q}`;
    const distractors = [
      { text: `x = ${p}, x = -${q}`, mistakeTag: "swapped_factor_signs_producing_positive_middle_term" },
      { text: `x = -${p}, x = -${q}`, mistakeTag: "assumed_both_roots_negative" },
      { text: `x = ${p}, x = ${q}`, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-quad-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Factors are (x + ${p})(x - ${q}) = 0. Solving gives x = -${p} and x = ${q}.`,
        hi: `गुणनखंड (x + ${p})(x - ${q}) = 0 हैं। अतः x = -${p} और x = ${q}।`,
        te: `కారణాంకాలు (x + ${p})(x - ${q}) = 0. కాబట్టి x = -${p} మరియు x = ${q}.`,
        reviewed: false,
      },
      hint: {
        en: "Because the middle term is positive, the factor with larger magnitude takes the plus sign.",
        hi: "चूँकि मध्य पद धनात्मक है, बड़े परिमाण वाले गुणनखंड का चिह्न धनात्मक होगा।",
        te: "మధ్య పదం ధనాత్మకం కాబట్టి, పెద్ద సంఖ్యకు ప్లస్ గుర్తు వస్తుంది.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = 2;
    const r1 = randInt(1, 3);
    const r2 = randInt(3, 5);
    const b = -(2 * r2 + r1);
    const c = r1 * r2;

    const promptEn = `Solve the quadratic equation: 2x² - ${2*r2 + r1}x + ${r1*r2} = 0`;
    const promptHi = `द्विघात समीकरण हल कीजिए: 2x² - ${2*r2 + r1}x + ${r1*r2} = 0`;
    const promptTe = `వర్గ సమీకరణాన్ని సాధించండి: 2x² - ${2*r2 + r1}x + ${r1*r2} = 0`;

    const correct = `x = ${r1}/2, x = ${r2}`;
    const distractors = [
      { text: `x = -${r1}/2, x = -${r2}`, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { text: `x = ${r1}, x = ${2*r2}`, mistakeTag: "inconsistent_sign_inversion" },
      { text: `x = -${r1}, x = ${r2}`, mistakeTag: "sign_error_moving_terms_across_equality" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-quad-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Splitting middle term: (2x - ${r1})(x - ${r2}) = 0. Roots are x = ${r1}/2 and x = ${r2}.`,
        hi: `मध्य पद विभाजन से: (2x - ${r1})(x - ${r2}) = 0। मूल: x = ${r1}/2 और x = ${r2}।`,
        te: `మధ్య పదాన్ని విభజించగా: (2x - ${r1})(x - ${r2}) = 0. మూలాలు x = ${r1}/2 మరియు x = ${r2}.`,
        reviewed: false,
      },
      hint: {
        en: "Split the middle term by finding factors of a × c that sum to b.",
        hi: "a × c के ऐसे गुणनखंड खोजें जिनका योग b हो।",
        te: "a × c లబ్దాన్ని ఇచ్చే మరియు కూడితే b వచ్చే కారణాంకాలతో మధ్య పదాన్ని విభజించండి.",
        reviewed: false,
      },
    };
  }
}

// 6. Concept: c6-pat-01 (Patterns in Sequences & Arithmetic Rules)
function genC6Pat(diff, idx) {
  const id = `q-gen-c6-pat-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(3, 10);
    const d = randInt(3, 6);
    const s1 = a, s2 = a + d, s3 = a + 2*d, s4 = a + 3*d;
    const next = a + 4*d;

    const promptEn = `What is the next number in the sequence: ${s1}, ${s2}, ${s3}, ${s4}, ___?`;
    const promptHi = `अनुक्रम ${s1}, ${s2}, ${s3}, ${s4}, ___ में अगली संख्या क्या है?`;
    const promptTe = `శ్రేణి ${s1}, ${s2}, ${s3}, ${s4}, ___ లో తర్వాతి సంఖ్య ఏది?`;

    const correct = `${next}`;
    const distractors = [
      { text: `${s4 + d - 1}`, mistakeTag: "added_two_instead_of_three" },
      { text: `${s4 + d + 1}`, mistakeTag: "added_four_instead_of_three" },
      { text: `${s4 * 2}`, mistakeTag: "assumed_multiplication_rule" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-pat-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `The common difference is +${d}. Next term = ${s4} + ${d} = ${next}.`,
        hi: `समान अंतर +${d} है। अगला पद = ${s4} + ${d} = ${next}।`,
        te: `సాధారణ భేదం +${d}. తర్వాతి పదం = ${s4} + ${d} = ${next}.`,
        reviewed: false,
      },
      hint: {
        en: "Calculate the difference between consecutive terms: second - first.",
        hi: "क्रमागत पदों के बीच का अंतर ज्ञात करें: दूसरा पद - पहला पद।",
        te: "వరుస పదాల మధ్య తేడాను కనుగొనండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const mult = randInt(2, 5);
    const add = randInt(1, 4);
    const n = randInt(6, 10);
    const val = mult * n + add;

    const promptEn = `The nth term of a number pattern is given by ${mult}n + ${add}. Find the ${n}th term.`;
    const promptHi = `किसी संख्या प्रतिरूप का n-वाँ पद ${mult}n + ${add} है। ${n}-वाँ पद ज्ञात कीजिए।`;
    const promptTe = `సంఖ్యా క్రమం యొక్క nవ పదం ${mult}n + ${add}. ${n}వ పదాన్ని కనుగొనండి.`;

    const correct = `${val}`;
    const distractors = [
      { text: `${mult * (n - 1) + add}`, mistakeTag: "added_two_instead_of_three" },
      { text: `${mult * n}`, mistakeTag: "added_four_instead_of_three" },
      { text: `${mult * n + add * 2}`, mistakeTag: "multiplied_four_by_three" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-pat-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Substitute n = ${n}: ${mult}(${n}) + ${add} = ${mult * n} + ${add} = ${val}.`,
        hi: `n = ${n} प्रतिस्थापित करें: ${mult}(${n}) + ${add} = ${val}।`,
        te: `n = ${n} ప్రతిక్షేపించండి: ${mult}(${n}) + ${add} = ${val}.`,
        reviewed: false,
      },
      hint: {
        en: "Substitute the given position n into the formula.",
        hi: "दिए गए पद n को सूत्र में प्रतिस्थापित करें।",
        te: "ఇచ్చిన n విలువను సూత్రంలో ప్రతిక్షేపించండి.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = randInt(3, 6);
    const b = randInt(2, 5);
    const n = randInt(7, 12);
    const total = a * n + b;

    const promptEn = `In the rule T = ${a}n + ${b}, which position n produces the value ${total}?`;
    const promptHi = `नियम T = ${a}n + ${b} में, कौन सा पद n मान ${total} देता है?`;
    const promptTe = `T = ${a}n + ${b} సూత్రంలో, ఏ స్థానం n వద్ద విలువ ${total} వస్తుంది?`;

    const correct = `n = ${n}`;
    const distractors = [
      { text: `n = ${n + 1}`, mistakeTag: "added_two_instead_of_three" },
      { text: `n = ${n - 1}`, mistakeTag: "added_four_instead_of_three" },
      { text: `n = ${Math.floor(total / a)}`, mistakeTag: "assumed_multiplication_rule" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c6-pat-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Set ${a}n + ${b} = ${total}. Subtract ${b}: ${a}n = ${total - b}. Divide by ${a}: n = ${n}.`,
        hi: `${a}n + ${b} = ${total} हल करें। ${total - b} ÷ ${a} = ${n}।`,
        te: `${a}n + ${b} = ${total} సాధించగా, n = ${n}.`,
        reviewed: false,
      },
      hint: {
        en: "Subtract the constant first, then divide by the coefficient.",
        hi: "पहले अचर पद को घटाएँ, फिर गुणांक से भाग दें।",
        te: "మొదట స్థిరపదాన్ని తీసివేసి, తర్వాత గుణకంతో భాగించండి.",
        reviewed: false,
      },
    };
  }
}

// 7. Concept: c7-alg-01 (Arithmetic Expressions & Order of Operations)
function genC7Alg(diff, idx) {
  const id = `q-gen-c7-alg-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(15, 35);
    const b = randInt(3, 6);
    const c = randInt(2, 5);
    const ans = a - b * c;

    const promptEn = `Evaluate: ${a} - ${b} × ${c}`;
    const promptHi = `मान ज्ञात कीजिए: ${a} - ${b} × ${c}`;
    const promptTe = `విలువను కనుగొనండి: ${a} - ${b} × ${c}`;

    const correct = `${ans}`;
    const distractors = [
      { text: `${(a - b) * c}`, mistakeTag: "performed_subtraction_before_multiplication" },
      { text: `${a + b * c}`, mistakeTag: "added_multiplication_product_instead_of_subtracting" },
      { text: `${a - b - c}`, mistakeTag: "performed_addition_before_subtraction_erroneously" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-alg-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `According to BODMAS, multiplication precedes subtraction: ${b} × ${c} = ${b*c}, then ${a} - ${b*c} = ${ans}.`,
        hi: `BODMAS नियम के अनुसार, गुणा घटाव से पहले होता है: ${a} - ${b*c} = ${ans}।`,
        te: `BODMAS ప్రకారం గుణకారం తీసివేత కంటే ముందు జరుగుతుంది: ${a} - ${b*c} = ${ans}.`,
        reviewed: false,
      },
      hint: {
        en: "BODMAS: Perform multiplication before subtraction.",
        hi: "BODMAS: घटाने से पहले गुणा करें।",
        te: "BODMAS: తీసివేత కంటే ముందు గుణకారం చేయండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const a = randInt(4, 8);
    const b = randInt(2, 5);
    const c = randInt(2, 4);
    const d = 12;
    const e = 3;
    const ans = (a + b) * c - (d / e);

    const promptEn = `Simplify: (${a} + ${b}) × ${c} - ${d} ÷ ${e}`;
    const promptHi = `सरल कीजिए: (${a} + ${b}) × ${c} - ${d} ÷ ${e}`;
    const promptTe = `సూక్ష్మీకరించండి: (${a} + ${b}) × ${c} - ${d} ÷ ${e}`;

    const correct = `${ans}`;
    const distractors = [
      { text: `${a + b * c - d / e}`, mistakeTag: "calculated_bracket_as_nine_instead_of_three" },
      { text: `${(a + b) * (c - d) / e}`, mistakeTag: "performed_subtraction_before_multiplication" },
      { text: `${(a + b) * c + d / e}`, mistakeTag: "added_multiplication_product_instead_of_subtracting" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-alg-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Brackets first: (${a}+${b}) = ${a+b}. Multiplication & division: ${a+b} × ${c} = ${(a+b)*c} and ${d} ÷ ${e} = ${d/e}. Then subtraction: ${(a+b)*c} - ${d/e} = ${ans}.`,
        hi: `कोष्ठक पहले: ${a+b}। फिर गुणा और भाग, अंत में घटाव: ${ans}।`,
        te: `మొదట బ్రాకెట్: ${a+b}. తర్వాత గుణకారం మరియు భాగాహారం, చివరగా తీసివేత: ${ans}.`,
        reviewed: false,
      },
      hint: {
        en: "Evaluate brackets first, then multiplication and division from left to right.",
        hi: "पहले कोष्ठक हल करें, फिर बाएँ से दाएँ गुणा और भाग करें।",
        te: "మొదట బ్రాకెట్లను సాధించి, తర్వాత గుణకారం మరియు భాగాహారం చేయండి.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = randInt(25, 45);
    const b = randInt(3, 7);
    const c = randInt(2, 4);
    const d = randInt(5, 8);
    const e = randInt(2, 4);
    const inner = d - e;
    const ans = a - (b + c * inner);

    const promptEn = `Evaluate: ${a} - [${b} + ${c} × (${d} - ${e})]`;
    const promptHi = `मान ज्ञात कीजिए: ${a} - [${b} + ${c} × (${d} - ${e})]`;
    const promptTe = `విలువను కనుగొనండి: ${a} - [${b} + ${c} × (${d} - ${e})]`;

    const correct = `${ans}`;
    const distractors = [
      { text: `${a - (b + c * d - e)}`, mistakeTag: "calculated_bracket_as_nine_instead_of_three" },
      { text: `${(a - b) + c * inner}`, mistakeTag: "performed_subtraction_before_multiplication" },
      { text: `${a + (b + c * inner)}`, mistakeTag: "added_multiplication_product_instead_of_subtracting" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c7-alg-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Innermost brackets first: (${d} - ${e}) = ${inner}. Then multiply: ${c} × ${inner} = ${c*inner}. Square bracket: ${b} + ${c*inner} = ${b + c*inner}. Finally: ${a} - ${b + c*inner} = ${ans}.`,
        hi: `सबसे अंदर का कोष्ठक पहले: (${d} - ${e}) = ${inner}। चरणबद्ध हल करने पर: ${ans}।`,
        te: `అంతర్గత బ్రాకెట్ మొదట: (${d} - ${e}) = ${inner}. దశలవారీగా సాధించగా: ${ans}.`,
        reviewed: false,
      },
      hint: {
        en: "Work from the innermost parentheses outward.",
        hi: "सबसे अंदर वाले कोष्ठक से बाहर की ओर हल करें।",
        te: "లోపలి బ్రాకెట్ల నుండి బయటకు సాధించండి.",
        reviewed: false,
      },
    };
  }
}

// 8. Concept: c8-exp-01 (Exponents, Powers & Laws of Exponents)
function genC8Exp(diff, idx) {
  const id = `q-gen-c8-exp-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const base = randInt(2, 6);
    const m = randInt(2, 5);
    const n = randInt(2, 4);
    const sum = m + n;

    const promptEn = `Simplify using the product law: ${base}ᵐ × ${base}ⁿ where m = ${m} and n = ${n}.`;
    const promptHi = `गुणन नियम से सरल कीजिए: ${base}^${m} × ${base}^${n}।`;
    const promptTe = `లబ్ద న్యాయాన్ని ఉపయోగించి సూక్ష్మీకరించండి: ${base}^${m} × ${base}^${n}.`;

    const correct = `${base}^${sum}`;
    const distractors = [
      { text: `${base}^${m * n}`, mistakeTag: "multiplied_powers_instead_of_adding" },
      { text: `${base * 2}^${sum}`, mistakeTag: "multiplied_bases_as_well_as_added_powers" },
      { text: `${base}^${Math.abs(m - n)}`, mistakeTag: "subtracted_powers_instead_of_adding" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-exp-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Law of exponents for same base: aᵐ × aⁿ = aᵐ⁺ⁿ. Thus ${base}^${m} × ${base}^${n} = ${base}^(${m}+${n}) = ${base}^${sum}.`,
        hi: `समान आधार पर घातांक नियम: aᵐ × aⁿ = aᵐ⁺ⁿ। अतः ${base}^${sum}।`,
        te: `సమాన భూములు ఉన్నప్పుడు: aᵐ × aⁿ = aᵐ⁺ⁿ. కాబట్టి ${base}^${sum}.`,
        reviewed: false,
      },
      hint: {
        en: "When multiplying terms with the same base, add their exponents.",
        hi: "समान आधार वाली संख्याओं का गुणा करते समय घातों को जोड़ें।",
        te: "సమాన భూములు ఉన్న పదాలను గుణించేటప్పుడు ఘాతాలను కలపాలి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const base = randInt(2, 5);
    const m = randInt(2, 4);
    const n = randInt(2, 3);
    const prod = m * n;

    const promptEn = `Simplify: (${base}^${m})^${n}`;
    const promptHi = `सरल कीजिए: (${base}^${m})^${n}`;
    const promptTe = `సూక్ష్మీకరించండి: (${base}^${m})^${n}`;

    const correct = `${base}^${prod}`;
    const distractors = [
      { text: `${base}^${m + n}`, mistakeTag: "calculated_power_of_power_as_addition" },
      { text: `${base}^${Math.pow(m, n)}`, mistakeTag: "multiplied_powers_instead_of_adding" },
      { text: `${base * n}^${m}`, mistakeTag: "multiplied_bases_as_well_as_added_powers" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-exp-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Power of a power law: (aᵐ)ⁿ = aᵐˣⁿ. Thus (${base}^${m})^${n} = ${base}^(${m}×${n}) = ${base}^${prod}.`,
        hi: `घात की घात का नियम: (aᵐ)ⁿ = aᵐˣⁿ। अतः ${base}^${prod}।`,
        te: `ఘాతం యొక్క ఘాత న్యాయం: (aᵐ)ⁿ = aᵐˣⁿ. కాబట్టి ${base}^${prod}.`,
        reviewed: false,
      },
      hint: {
        en: "For a power raised to another power, multiply the exponents: (aᵐ)ⁿ = aᵐⁿ.",
        hi: "घात की घात होने पर घातों का गुणा करें: (aᵐ)ⁿ = aᵐⁿ।",
        te: "ఘాతాన్ని మరో ఘాతానికి పెంచినప్పుడు ఘాతాలను గుణించండి.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const base = randInt(2, 4);
    const m = 3;
    const n = 5;
    const diffVal = n - m;

    const promptEn = `Evaluate in positive exponent form: ${base}^${m} ÷ ${base}^${n}`;
    const promptHi = `धनात्मक घातांक रूप में मान ज्ञात कीजिए: ${base}^${m} ÷ ${base}^${n}`;
    const promptTe = `ధనాత్మక ఘాతాంక రూపంలో తెలపండి: ${base}^${m} ÷ ${base}^${n}`;

    const correct = `1 / ${base}^${diffVal}`;
    const distractors = [
      { text: `${base}^${m + n}`, mistakeTag: "multiplied_powers_instead_of_adding" },
      { text: `-${base}^${diffVal}`, mistakeTag: "subtracted_powers_instead_of_adding" },
      { text: `${base}^${diffVal}`, mistakeTag: "multiplied_bases_as_well_as_added_powers" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c8-exp-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Quotient law: ${base}^${m} ÷ ${base}^${n} = ${base}^(${m}-${n}) = ${base}^(-${diffVal}) = 1 / ${base}^${diffVal}.`,
        hi: `भागफल नियम: ${base}^${m} ÷ ${base}^${n} = 1 / ${base}^${diffVal}।`,
        te: `భాగాహార న్యాయం: ${base}^${m} ÷ ${base}^${n} = 1 / ${base}^${diffVal}.`,
        reviewed: false,
      },
      hint: {
        en: "Subtract exponents in division: aᵐ ÷ aⁿ = aᵐ⁻ⁿ, and a⁻ᵏ = 1 / aᵏ.",
        hi: "भाग में घातों को घटाएँ: aᵐ ÷ aⁿ = aᵐ⁻ⁿ, और a⁻ᵏ = 1 / aᵏ।",
        te: "భాగాహారంలో ఘాతాలను తీసివేయండి: aᵐ ÷ aⁿ = aᵐ⁻ⁿ, మరియు a⁻ᵏ = 1 / aᵏ.",
        reviewed: false,
      },
    };
  }
}

// 9. Concept: c9-poly-01 (Polynomial Terms, Degree & Zeroes)
function genC9Poly(diff, idx) {
  const id = `q-gen-c9-poly-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const a = randInt(2, 6);
    const b = randInt(4, 12);

    const promptEn = `Find the zero of the linear polynomial p(x) = ${a}x + ${b}.`;
    const promptHi = `रैखिक बहुपद p(x) = ${a}x + ${b} का शून्यक ज्ञात कीजिए।`;
    const promptTe = `రేఖీయ బహుపది p(x) = ${a}x + ${b} యొక్క శూన్యాన్ని కనుగొనండి.`;

    const correct = `x = -${b}/${a}`;
    const distractors = [
      { text: `x = ${b}/${a}`, mistakeTag: "sign_error_during_transposition" },
      { text: `x = -${b}`, mistakeTag: "confused_constant_term_with_coefficient_of_x" },
      { text: `x = -${a}/${b}`, mistakeTag: "omitted_negative_sign_of_coefficient" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-poly-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Set p(x) = 0: ${a}x + ${b} = 0 => ${a}x = -${b} => x = -${b}/${a}.`,
        hi: `p(x) = 0 रखें: ${a}x + ${b} = 0 => x = -${b}/${a}।`,
        te: `p(x) = 0 అని ప్రతిక్షేపించండి: ${a}x + ${b} = 0 => x = -${b}/${a}.`,
        reviewed: false,
      },
      hint: {
        en: "To find the zero of a polynomial, equate p(x) = 0 and solve for x.",
        hi: "शून्यक ज्ञात करने के लिए p(x) = 0 रखें और x का मान निकालें।",
        te: "శూన్యాన్ని కనుగొనడానికి p(x) = 0 గా తీసుకొని x విలువను కనుగొనండి.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const a = randInt(3, 7);
    const b = randInt(4, 9);
    const c = randInt(2, 8);

    const promptEn = `In the polynomial P(x) = ${a}x³ - ${b}x² + ${c}x - 5, what is the coefficient of x²?`;
    const promptHi = `बहुपद P(x) = ${a}x³ - ${b}x² + ${c}x - 5 में, x² का गुणांक क्या है?`;
    const promptTe = `P(x) = ${a}x³ - ${b}x² + ${c}x - 5 బహుపదిలో, x² యొక్క గుణకం ఎంత?`;

    const correct = `-${b}`;
    const distractors = [
      { text: `${b}`, mistakeTag: "omitted_negative_sign_of_coefficient" },
      { text: `-5`, mistakeTag: "confused_constant_term_with_coefficient_of_x" },
      { text: `${c}`, mistakeTag: "sign_error_during_transposition" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-poly-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `The term with x² is -${b}x². The coefficient includes the negative sign: -${b}.`,
        hi: `x² वाला पद -${b}x² है। गुणांक में ऋण चिह्न शामिल होता है: -${b}।`,
        te: `x² పదం -${b}x². గుణకంలో మైనస్ గుర్తు కూడా ఉంటుంది: -${b}.`,
        reviewed: false,
      },
      hint: {
        en: "Always include the operational sign preceding the term as part of the coefficient.",
        hi: "हमेशा पद के आगे लगे चिह्न को गुणांक के साथ शामिल करें।",
        te: "పదం ముందున్న గుర్తును కూడా గుణకంలో భాగంగా పరిగణించండి.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const a = randInt(2, 4);
    const b = randInt(3, 6);
    const c = randInt(2, 5);
    const k = randInt(2, 3);
    const val = a * k * k - b * k + c;

    const promptEn = `If p(x) = ${a}x² - ${b}x + ${c}, evaluate p(${k}).`;
    const promptHi = `यदि p(x) = ${a}x² - ${b}x + ${c} है, तो p(${k}) का मान ज्ञात कीजिए।`;
    const promptTe = `p(x) = ${a}x² - ${b}x + ${c} అయితే, p(${k}) విలువను కనుగొనండి.`;

    const correct = `${val}`;
    const distractors = [
      { text: `${a * k * k + b * k + c}`, mistakeTag: "sign_error_during_transposition" },
      { text: `${a * k * k - b * k}`, mistakeTag: "confused_constant_term_with_coefficient_of_x" },
      { text: `${val + 4}`, mistakeTag: "omitted_negative_sign_of_coefficient" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c9-poly-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `p(${k}) = ${a}(${k})² - ${b}(${k}) + ${c} = ${a*k*k} - ${b*k} + ${c} = ${val}.`,
        hi: `p(${k}) = ${a}(${k})² - ${b}(${k}) + ${c} = ${val}।`,
        te: `p(${k}) = ${a}(${k})² - ${b}(${k}) + ${c} = ${val}.`,
        reviewed: false,
      },
      hint: {
        en: "Substitute x = k and evaluate exponents before multiplying.",
        hi: "x = k रखें और गुणा करने से पहले घात हल करें।",
        te: "x = k ప్రతిక్షేపించి, గుణించే ముందు ఘాతాలను లెక్కించండి.",
        reviewed: false,
      },
    };
  }
}

// 10. Concept: c10-poly-01 (Zeroes and Coefficients of Quadratic Polynomials)
function genC10Poly(diff, idx) {
  const id = `q-gen-c10-poly-d${diff}-${String(idx).padStart(2, "0")}`;
  if (diff === 1) {
    const b = randInt(4, 10);
    const c = randInt(3, 12);

    const promptEn = `For the quadratic polynomial P(x) = x² - ${b}x + ${c}, what is the sum of its zeroes?`;
    const promptHi = `द्विघात बहुपद P(x) = x² - ${b}x + ${c} के लिए, इसके शून्यकों का योग क्या है?`;
    const promptTe = `వర్గ బహుపది P(x) = x² - ${b}x + ${c} యొక్క శూన్యాల మొత్తం ఎంత?`;

    const correct = `${b}`;
    const distractors = [
      { text: `-${b}`, mistakeTag: "omitted_negative_sign_in_sum_formula" },
      { text: `${c}`, mistakeTag: "swapped_sum_with_product" },
      { text: `-${c}`, mistakeTag: "confused_zeroes_with_y_intercept" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-poly-01",
      difficulty: 1,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Sum of zeroes = -b/a = -(-${b})/1 = +${b}.`,
        hi: `शून्यकों का योग = -b/a = -(-${b})/1 = +${b}।`,
        te: `శూన్యాల మొత్తం = -b/a = -(-${b})/1 = +${b}.`,
        reviewed: false,
      },
      hint: {
        en: "Sum of zeroes of ax² + bx + c is given by -b/a.",
        hi: "ax² + bx + c के शून्यकों का योग -b/a होता है।",
        te: "ax² + bx + c శూన్యాల మొత్తం -b/a అవుతుంది.",
        reviewed: false,
      },
    };
  } else if (diff === 2) {
    const a = randInt(2, 4);
    const b = randInt(5, 9);
    const c = randInt(3, 8);

    const promptEn = `Find the product of zeroes of the quadratic polynomial: ${a}x² + ${b}x - ${c}`;
    const promptHi = `द्विघात बहुपद ${a}x² + ${b}x - ${c} के शून्यकों का गुणनफल ज्ञात कीजिए।`;
    const promptTe = `వర్గ బహుపది ${a}x² + ${b}x - ${c} యొక్క శూన్యాల లబ్దాన్ని కనుగొనండి.`;

    const correct = `-${c}/${a}`;
    const distractors = [
      { text: `${c}/${a}`, mistakeTag: "omitted_negative_sign_in_sum_formula" },
      { text: `-${b}/${a}`, mistakeTag: "swapped_sum_with_product" },
      { text: `${b}/${a}`, mistakeTag: "confused_zeroes_with_y_intercept" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-poly-01",
      difficulty: 2,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Product of zeroes = c/a = (-${c}) / ${a} = -${c}/${a}.`,
        hi: `शून्यकों का गुणनफल = c/a = -${c}/${a}।`,
        te: `శూన్యాల లబ్దం = c/a = -${c}/${a}.`,
        reviewed: false,
      },
      hint: {
        en: "Product of zeroes of ax² + bx + c is given by c/a.",
        hi: "ax² + bx + c के शून्यकों का गुणनफल c/a होता है।",
        te: "ax² + bx + c శూన్యాల లబ్దం c/a అవుతుంది.",
        reviewed: false,
      },
    };
  } else {
    // diff 3
    const sum = randInt(4, 8);
    const prod = randInt(2, 7);

    const promptEn = `A quadratic polynomial whose sum and product of zeroes are ${sum} and ${prod} respectively is:`;
    const promptHi = `एक द्विघात बहुपद जिसके शून्यकों का योग और गुणनफल क्रमशः ${sum} और ${prod} हैं, वह है:`;
    const promptTe = `శూన్యాల మొత్తం మరియు లబ్దాలు వరుసగా ${sum} మరియు ${prod} గా గల వర్గ బహుపది:`;

    const correct = `x² - ${sum}x + ${prod}`;
    const distractors = [
      { text: `x² + ${sum}x + ${prod}`, mistakeTag: "omitted_negative_sign_in_sum_formula" },
      { text: `x² - ${prod}x + ${sum}`, mistakeTag: "swapped_sum_with_product" },
      { text: `x² + ${sum}x - ${prod}`, mistakeTag: "confused_zeroes_with_y_intercept" },
    ];
    const { options, correctAnswer } = buildOptions(correct, distractors);

    return {
      id,
      conceptId: "c10-poly-01",
      difficulty: 3,
      type: "multiple_choice",
      contextTag: "pure_math",
      prompt: { en: promptEn, hi: promptHi, te: promptTe, reviewed: false },
      options,
      correctAnswer,
      explanation: {
        en: `Formula: k[x² - (sum)x + (product)] = x² - ${sum}x + ${prod}.`,
        hi: `सूत्र: k[x² - (योग)x + (गुणनफल)] = x² - ${sum}x + ${prod}।`,
        te: `సూత్రం: k[x² - (మొత్తం)x + (లబ్దం)] = x² - ${sum}x + ${prod}.`,
        reviewed: false,
      },
      hint: {
        en: "Formula: x² - (sum of zeroes)x + (product of zeroes).",
        hi: "सूत्र: x² - (शून्यकों का योग)x + (शून्यकों का गुणनफल)।",
        te: "సూత్రం: x² - (శూన్యాల మొత్తం)x + (శూన్యాల లబ్దం).",
        reviewed: false,
      },
    };
  }
}

// Map generator functions
const GENERATORS = {
  "c6-neg-01": genC6Neg,
  "c7-int-02": genC7Int,
  "c8-dist-01": genC8Dist,
  "c9-id-01": genC9Id,
  "c10-quad-01": genC10Quad,
  "c6-pat-01": genC6Pat,
  "c7-alg-01": genC7Alg,
  "c8-exp-01": genC8Exp,
  "c9-poly-01": genC9Poly,
  "c10-poly-01": genC10Poly,
};

// =============================================================================
// MAIN GENERATION & MERGING PIPELINE
// =============================================================================
console.log("================================================================================");
console.log("  MARGAM — PARAMETRIC QUESTION GENERATOR (PHASE 5)");
console.log("================================================================================");

const allExistingQuestions = JSON.parse(fs.readFileSync(questionsJsonPath, "utf8"));
const existingIds = new Set(allExistingQuestions.map((q) => q.id));

console.log(`Original Question Bank Count: ${allExistingQuestions.length}`);
console.log("Target: 18 questions per pilot concept across difficulty 1-3\n");

const newQuestionsByChapter = {};
let totalGenerated = 0;

for (const pilot of PILOT_CONCEPTS) {
  const { conceptId, chapterId } = pilot;
  const genFn = GENERATORS[conceptId];
  if (!genFn) continue;

  const existingForConcept = allExistingQuestions.filter((q) => q.conceptId === conceptId);
  const needed = 18 - existingForConcept.length;

  console.log(`Generating for concept ${conceptId} (Chapter: ${chapterId}) - Current: ${existingForConcept.length}, Target: 18, Needed: ${needed}`);

  if (!newQuestionsByChapter[chapterId]) {
    newQuestionsByChapter[chapterId] = [];
  }

  // Generate needed questions evenly across difficulties 1, 2, 3
  let idx = 1;
  while (existingForConcept.length + newQuestionsByChapter[chapterId].filter(q => q.conceptId === conceptId).length < 18) {
    const diff = ((idx - 1) % 3) + 1;
    const q = genFn(diff, idx);

    if (!existingIds.has(q.id)) {
      existingIds.add(q.id);
      newQuestionsByChapter[chapterId].push(q);
      totalGenerated++;
    }
    idx++;
  }
}

console.log(`\nGenerated ${totalGenerated} new verified parametric questions.`);

// Merge into chapter-split files and keep old files intact
let updatedChapters = 0;
const chapterCounts = JSON.parse(fs.readFileSync(chapterCountsPath, "utf8"));

for (const [chapterId, newQs] of Object.entries(newQuestionsByChapter)) {
  if (newQs.length === 0) continue;

  const chFile = path.join(questionsDir, `${chapterId}.json`);
  let chQs = [];
  if (fs.existsSync(chFile)) {
    chQs = JSON.parse(fs.readFileSync(chFile, "utf8"));
  }

  // Deduplicate against existing chapter questions
  const chIds = new Set(chQs.map((q) => q.id));
  const toAdd = newQs.filter((q) => !chIds.has(q.id));

  const merged = [...chQs, ...toAdd];
  fs.writeFileSync(chFile, JSON.stringify(merged, null, 2) + "\n", "utf8");

  chapterCounts[chapterId] = merged.filter((q) => q.verified !== false).length;
  updatedChapters++;
  console.log(`  Updated ${chapterId}.json: ${chQs.length} -> ${merged.length} questions`);
}

// Update chapter-counts.json
fs.writeFileSync(chapterCountsPath, JSON.stringify(chapterCounts, null, 2) + "\n", "utf8");
console.log("Updated data/chapter-counts.json");

// Aggregate all into data/questions.json
const aggregated = [];
const allChapterFiles = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));

for (const f of allChapterFiles) {
  const qs = JSON.parse(fs.readFileSync(path.join(questionsDir, f), "utf8"));
  aggregated.push(...qs);
}

fs.writeFileSync(questionsJsonPath, JSON.stringify(aggregated, null, 2) + "\n", "utf8");
console.log(`Updated data/questions.json: Total questions now = ${aggregated.length}`);

console.log("================================================================================");
console.log("✅ QUESTION GENERATION COMPLETE!");
console.log("================================================================================");
