import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const tagRoots = JSON.parse(fs.readFileSync(path.join(rootDir, "data", "tag-roots.json"), "utf-8"));

// 1. Questions for c10-ch01: Real Numbers (q-c10-real-03 to 08)
const c10_ch01_new_questions = [
  {
    id: "q-c10-real-03",
    conceptId: "c10-real-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the HCF of 96 and 404 using prime factorisation.",
      hi: "अभाज्य गुणनखंडन विधि द्वारा 96 और 404 का HCF ज्ञात कीजिए।",
      te: "ప్రధాన కారణాంకాల పద్ధతి ద్వారా 96 మరియు 404 ల HCF కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "C",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "extra_factor_of_two"
      },
      {
        id: "D",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "composite_number_fourteen_included"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "96 = 2⁵ × 3 and 404 = 2² × 101. The common prime factor is 2, with smallest exponent 2. Thus HCF = 2² = 4.",
      hi: "96 = 2⁵ × 3 और 404 = 2² × 101 है। उभयनिष्ठ अभाज्य गुणनखंड 2 है जिसकी न्यूनतम घात 2 है। अतः HCF = 2² = 4।",
      te: "96 = 2⁵ × 3 మరియు 404 = 2² × 101. ఉమ్మడి ప్రధాన కారణాంకం 2, కనిష్ట ఘాతం 2. కాబట్టి HCF = 2² = 4.",
      reviewed: false
    },
    hint: {
      en: "Find the prime factors of both numbers and take the product of smallest powers of common prime factors.",
      hi: "दोनों संख्याओं के अभाज्य गुणनखंड ज्ञात करें और उभयनिष्ठ गुणनखंडों की न्यूनतम घात लें।",
      te: "రెండు సంఖ్యల ప్రధాన కారణాంకాలను కనుగొని ఉమ్మడి కారణాంకాల కనిష్ట ఘాతాల లబ్దం తీసుకోండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-04",
    conceptId: "c10-real-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Which of the following is an irrational number?",
      hi: "निम्नलिखित में से कौन-सी एक अपरिमेय संख्या है?",
      te: "కింది వాటిలో ఏది కరణీయ సంఖ్య?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "√4", hi: "√4", te: "√4", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "B",
        text: { en: "0.375", hi: "0.375", te: "0.375", reviewed: false },
        mistakeTag: "confused_zero_with_below_zero"
      },
      {
        id: "C",
        text: { en: "√7", hi: "√7", te: "√7", reviewed: false }
      },
      {
        id: "D",
        text: { en: "22/7", hi: "22/7", te: "22/7", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "√4 = 2 (rational), 0.375 = 375/1000 = 3/8 (rational), 22/7 is p/q form (rational). √7 cannot be written as p/q with integers p, q; hence it is irrational.",
      hi: "√4 = 2 (परिमेय), 0.375 = 3/8 (परिमेय), 22/7 p/q रूप में है। √7 को p/q के रूप में व्यक्त नहीं किया जा सकता, अतः यह अपरिमेय है।",
      te: "√4 = 2 (అకరణీయ), 0.375 = 3/8 (అకరణీయ), 22/7 p/q రూపంలో ఉంది. √7 ను పూర్ణసంఖ్యల p/q రూపంలో రాయలేము, కాబట్టి ఇది కరణీయ సంఖ్య.",
      reviewed: false
    },
    hint: {
      en: "The square root of any non-square prime number is always irrational.",
      hi: "किसी भी अभाज्य संख्या का वर्गमूल सदैव अपरिमेय होता है।",
      te: "ఏదైనా ప్రధాన సంఖ్య యొక్క వర్గమూలం ఎల్లప్పుడూ కరణీయ సంఖ్య అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-05",
    conceptId: "c10-real-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the LCM of 12, 15 and 21 using the prime factorisation method.",
      hi: "अभाज्य गुणनखंडन विधि द्वारा 12, 15 और 21 का LCM ज्ञात कीजिए।",
      te: "ప్రధాన కారణాంకాల పద్ధతి ద్వారా 12, 15 మరియు 21 ల LCM కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "420", hi: "420", te: "420", reviewed: false }
      },
      {
        id: "B",
        text: { en: "210", hi: "210", te: "210", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "C",
        text: { en: "840", hi: "840", te: "840", reviewed: false },
        mistakeTag: "extra_factor_of_two"
      },
      {
        id: "D",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7. LCM = 2² × 3 × 5 × 7 = 4 × 3 × 5 × 7 = 420.",
      hi: "12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7। LCM = 2² × 3 × 5 × 7 = 420।",
      te: "12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7. LCM = 2² × 3 × 5 × 7 = 420.",
      reviewed: false
    },
    hint: {
      en: "LCM is the product of the greatest power of each prime factor involved in the numbers.",
      hi: "LCM संख्याओं में शामिल प्रत्येक अभाज्य गुणनखंड की उच्चतम घात का गुणनफल होता है।",
      te: "LCM అనేది సంఖ్యలలోని ప్రతి ప్రధాన కారణాంకం యొక్క గరిష్ట ఘాతాల లబ్దం.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-06",
    conceptId: "c10-real-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
      hi: "यदि दो धनात्मक पूर्णांक a और b को a = x³y² और b = xy³ के रूप में लिखा जाता है, जहाँ x, y अभाज्य संख्याएँ हैं, तो HCF(a, b) क्या है?",
      te: "రెండు ధన పూర్ణసంఖ్యలు a మరియు b లను a = x³y² మరియు b = xy³ గా రాస్తే (ఇక్కడ x, y ప్రధాన సంఖ్యలు), HCF(a, b) ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "xy", hi: "xy", te: "xy", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "B",
        text: { en: "xy²", hi: "xy²", te: "xy²", reviewed: false }
      },
      {
        id: "C",
        text: { en: "x³y³", hi: "x³y³", te: "x³y³", reviewed: false },
        mistakeTag: "extra_factor_of_two"
      },
      {
        id: "D",
        text: { en: "x²y²", hi: "x²y²", te: "x²y²", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "HCF takes the minimum power of each common prime factor: for x it is min(3, 1) = 1, for y it is min(2, 3) = 2. Thus HCF = x¹y² = xy².",
      hi: "HCF प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की न्यूनतम घात लेता है: x के लिए min(3, 1) = 1, y के लिए min(2, 3) = 2। अतः HCF = xy²।",
      te: "HCF ఉమ్మడి ప్రధాన కారణాంకాల కనిష్ట ఘాతాలను తీసుకుంటుంది: x కి 1, y కి 2. కాబట్టి HCF = xy².",
      reviewed: false
    },
    hint: {
      en: "Remember that HCF uses the smallest exponent of each common prime.",
      hi: "याद रखें कि HCF प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की सबसे छोटी घात का उपयोग करता है।",
      te: "HCF ప్రతి ఉమ్మడి ప్రధాన కారణాంకం యొక్క కనిష్ట ఘాతాన్ని ఉపయోగిస్తుందని గుర్తుంచుకోండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-07",
    conceptId: "c10-real-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "word_problem",
    verified: false,
    prompt: {
      en: "Three bells toll together at intervals of 9, 12, 15 minutes respectively. If they start tolling together, after what minimum time will they toll together next?",
      hi: "तीन घंटियाँ क्रमशः 9, 12, 15 मिनट के अंतराल पर बजती हैं। यदि वे एक साथ बजना शुरू करती हैं, तो अगली बार वे कितने न्यूनतम समय बाद एक साथ बजेंगी?",
      te: "మూడు గంటలు వరుసగా 9, 12, 15 నిమిషాల వ్యవధిలో మోగుతాయి. అవి ఒకేసారి మోగడం ప్రారంభిస్తే, తర్వాత ఎంత కనీస సమయం తర్వాత మళ్లీ కలిసి మోగుతాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "36 minutes", hi: "36 मिनट", te: "36 నిమిషాలు", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "B",
        text: { en: "60 minutes", hi: "60 मिनट", te: "60 నిమిషాలు", reviewed: false },
        mistakeTag: "factored_into_composites_not_primes"
      },
      {
        id: "C",
        text: { en: "90 minutes", hi: "90 मिनट", te: "90 నిమిషాలు", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      },
      {
        id: "D",
        text: { en: "180 minutes", hi: "180 मिनट", te: "180 నిమిషాలు", reviewed: false }
      }
    ],
    correctAnswer: "D",
    explanation: {
      en: "The time interval after which they toll together is LCM(9, 12, 15). 9 = 3², 12 = 2² × 3, 15 = 3 × 5. LCM = 2² × 3² × 5 = 4 × 9 × 5 = 180 minutes.",
      hi: "वह समय अंतराल LCM(9, 12, 15) है। 9 = 3², 12 = 2² × 3, 15 = 3 × 5। LCM = 2² × 3² × 5 = 180 मिनट।",
      te: "మళ్లీ కలిసి మోగే సమయం LCM(9, 12, 15). 9 = 3², 12 = 2² × 3, 15 = 3 × 5. LCM = 2² × 3² × 5 = 180 నిమిషాలు.",
      reviewed: false
    },
    hint: {
      en: "Problems asking for when periodic events repeat next require finding the LCM.",
      hi: "आवर्ती घटनाओं के एक साथ अगली बार घटने के लिए LCM ज्ञात किया जाता है।",
      te: "పునరావృతమయ్యే సంఘటనలు మళ్లీ ఎప్పుడు కలిసి జరుగుతాయో కనుగొనడానికి LCM అవసరం.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-08",
    conceptId: "c10-real-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If HCF(a, 8) = 4 and LCM(a, 8) = 24, what is the value of a?",
      hi: "यदि HCF(a, 8) = 4 और LCM(a, 8) = 24 है, तो a का मान क्या है?",
      te: "HCF(a, 8) = 4 మరియు LCM(a, 8) = 24 అయితే, a విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "12", hi: "12", te: "12", reviewed: false }
      },
      {
        id: "B",
        text: { en: "6", hi: "6", te: "6", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "C",
        text: { en: "16", hi: "16", te: "16", reviewed: false },
        mistakeTag: "extra_factor_of_two"
      },
      {
        id: "D",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Using the formula HCF(a, b) × LCM(a, b) = a × b: 4 × 24 = a × 8 => 96 = 8a => a = 96 / 8 = 12.",
      hi: "HCF(a, b) × LCM(a, b) = a × b सूत्र का उपयोग करें: 4 × 24 = a × 8 => 96 = 8a => a = 12।",
      te: "HCF(a, b) × LCM(a, b) = a × b సూత్రం ద్వారా: 4 × 24 = a × 8 => 96 = 8a => a = 12.",
      reviewed: false
    },
    hint: {
      en: "Recall that the product of two positive integers equals the product of their HCF and LCM.",
      hi: "याद रखें कि दो धनात्मक पूर्णांकों का गुणनफल उनके HCF और LCM के गुणनफल के बराबर होता है।",
      te: "రెండు ధన పూర్ణసంఖ్యల లబ్దం వాటి HCF మరియు LCM ల లబ్దానికి సమానమని గుర్తుంచుకోండి.",
      reviewed: false
    }
  }
];

// 2. Questions for c10-ch03: Pair of Linear Equations in Two Variables (q-c10-lin-01 to 08)
const c10_ch03_questions = [
  {
    id: "q-c10-lin-01",
    conceptId: "c10-lin-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "For what condition do the lines a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 represent parallel lines (no solution)?",
      hi: "रेखाएँ a₁x + b₁y + c₁ = 0 और a₂x + b₂y + c₂ = 0 किस स्थिति में समांतर रेखाएँ (कोई हल नहीं) दर्शाती हैं?",
      te: "a₁x + b₁y + c₁ = 0 మరియు a₂x + b₂y + c₂ = 0 రేఖలు ఏ నిబంధన ప్రకారం సమాంతర రేఖలను (సాధన లేదు) సూచిస్తాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "a₁/a₂ ≠ b₁/b₂", hi: "a₁/a₂ ≠ b₁/b₂", te: "a₁/a₂ ≠ b₁/b₂", reviewed: false },
        mistakeTag: "sign_error_moving_terms_across_equality"
      },
      {
        id: "B",
        text: { en: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂", hi: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂", te: "a₁/a₂ = b₁/b₂ ≠ c₁/c₂", reviewed: false }
      },
      {
        id: "C",
        text: { en: "a₁/a₂ = b₁/b₂ = c₁/c₂", hi: "a₁/a₂ = b₁/b₂ = c₁/c₂", te: "a₁/a₂ = b₁/b₂ = c₁/c₂", reviewed: false },
        mistakeTag: "omitted_negative_sign_of_coefficient"
      },
      {
        id: "D",
        text: { en: "a₁/a₂ ≠ c₁/c₂", hi: "a₁/a₂ ≠ c₁/c₂", te: "a₁/a₂ ≠ c₁/c₂", reviewed: false },
        mistakeTag: "swapped_sum_with_product"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Parallel lines never intersect, meaning there is no common solution. The condition is a₁/a₂ = b₁/b₂ ≠ c₁/c₂.",
      hi: "समानांतर रेखाएँ कभी प्रतिच्छेद नहीं करतीं, अर्थात कोई उभयनिष्ठ हल नहीं होता। शर्त है a₁/a₂ = b₁/b₂ ≠ c₁/c₂।",
      te: "సమాంతర రేఖలు ఎప్పుడూ ఖండించుకోవు, అంటే ఉమ్మడి సాధన ఉండదు. నిబంధన a₁/a₂ = b₁/b₂ ≠ c₁/c₂.",
      reviewed: false
    },
    hint: {
      en: "Parallel lines have the same slope (a₁/a₂ = b₁/b₂) but different intercepts.",
      hi: "समानांतर रेखाओं की ढाल समान होती है परंतु अंतःखंड भिन्न होते हैं।",
      te: "సమాంతర రేఖల వాలు సమానంగా ఉంటుంది కానీ అంతరఖండాలు వేరుగా ఉంటాయి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-02",
    conceptId: "c10-lin-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the value of y if x = 3 is substituted into the equation 2x + y = 10.",
      hi: "यदि x = 3 को समीकरण 2x + y = 10 में प्रतिस्थापित किया जाए, तो y का मान ज्ञात कीजिए।",
      te: "2x + y = 10 సమీకరణంలో x = 3 ప్రతిక్షేపిస్తే y విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "B",
        text: { en: "16", hi: "16", te: "16", reviewed: false },
        mistakeTag: "sign_error_moving_terms_across_equality"
      },
      {
        id: "C",
        text: { en: "-4", hi: "-4", te: "-4", reviewed: false },
        mistakeTag: "omitted_negative_sign_of_coefficient"
      },
      {
        id: "D",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "performed_addition_before_subtraction_erroneously"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Substitute x = 3: 2(3) + y = 10 => 6 + y = 10 => y = 10 - 6 = 4.",
      hi: "x = 3 रखें: 2(3) + y = 10 => 6 + y = 10 => y = 10 - 6 = 4।",
      te: "x = 3 ప్రతిక్షేపించండి: 2(3) + y = 10 => 6 + y = 10 => y = 10 - 6 = 4.",
      reviewed: false
    },
    hint: {
      en: "Multiply 2 by 3 first, then subtract the result from 10.",
      hi: "पहले 2 को 3 से गुणा करें, फिर परिणाम को 10 में से घटाएँ।",
      te: "ముందుగా 2 ని 3 తో గుణించి, ఆ ఫలితాన్ని 10 నుండి తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-03",
    conceptId: "c10-lin-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If a pair of linear equations is consistent and has a unique solution, the lines represented by them are:",
      hi: "यदि रैखिक समीकरणों का एक युग्म संगत है और इसका एक अद्वितीय हल है, तो उनके द्वारा निरूपित रेखाएँ होंगी:",
      te: "రెండు రేఖీయ సమీకరణాల జత అనుకూలమైనదై ఏకైక సాధన కలిగి ఉంటే, ఆ రేఖలు:",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "Parallel lines", hi: "समांतर रेखाएँ", te: "సమాంతర రేఖలు", reviewed: false },
        mistakeTag: "confused_zeroes_with_y_intercept"
      },
      {
        id: "B",
        text: { en: "Coincident lines", hi: "संपाती रेखाएँ", te: "ఏకీభవించే రేఖలు", reviewed: false },
        mistakeTag: "placed_point_on_x_axis_instead_of_y_axis"
      },
      {
        id: "C",
        text: { en: "Intersecting at one point", hi: "एक बिंदु पर प्रतिच्छेद करती रेखाएँ", te: "ఒకే బిందువు వద్ద ఖండించుకునే రేఖలు", reviewed: false }
      },
      {
        id: "D",
        text: { en: "Perpendicular only", hi: "केवल लंबवत रेखाएँ", te: "కేవలం లంబ రేఖలు మాత్రమే", reviewed: false },
        mistakeTag: "confused_degree_with_single_axis_point"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "A unique solution means the two straight lines meet at exactly one coordinate point (x, y). Thus, the lines intersect at one point.",
      hi: "अद्वितीय हल का अर्थ है कि दोनों सीधी रेखाएँ ठीक एक बिंदु (x, y) पर मिलती हैं। अतः रेखाएँ प्रतिच्छेद करती हैं।",
      te: "ఏకైక సాధన అంటే రెండు సరళరేఖలు సరిగ్గా ఒక బిందువు (x, y) వద్ద కలుస్తాయి. కాబట్టి అవి ఖండన రేఖలు.",
      reviewed: false
    },
    hint: {
      en: "Think geometrically: one solution corresponds to one point of intersection.",
      hi: "ज्यामितीय रूप से सोचें: एक हल का अर्थ है प्रतिच्छेद का एक बिंदु।",
      te: "రేఖాగణితంగా ఆలోచించండి: ఒక సాధన అంటే ఒక ఖండన బిందువు.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-04",
    conceptId: "c10-lin-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Solve the system: x + y = 14 and x - y = 4. What is the value of x?",
      hi: "निकाय को हल कीजिए: x + y = 14 और x - y = 4। x का मान क्या है?",
      te: "x + y = 14 మరియు x - y = 4 వ్యవస్థను సాధించండి. x విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "B",
        text: { en: "9", hi: "9", te: "9", reviewed: false }
      },
      {
        id: "C",
        text: { en: "10", hi: "10", te: "10", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "D",
        text: { en: "18", hi: "18", te: "18", reviewed: false },
        mistakeTag: "negated_constant_term"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Add the two equations: (x + y) + (x - y) = 14 + 4 => 2x = 18 => x = 9. (And y = 5).",
      hi: "दोनों समीकरणों को जोड़ें: 2x = 18 => x = 9 (और y = 5)।",
      te: "రెండు సమీకరణాలను కలపండి: 2x = 18 => x = 9 (మరియు y = 5).",
      reviewed: false
    },
    hint: {
      en: "Add both equations together to eliminate the variable y immediately.",
      hi: "चर y को तुरंत समाप्त करने के लिए दोनों समीकरणों को जोड़ें।",
      te: "y చరరాశిని తొలగించడానికి రెండు సమీకరణాలను కలపండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-05",
    conceptId: "c10-lin-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "For which value of k will the pair of equations 2x + 3y = 7 and 4x + ky = 14 have infinitely many solutions?",
      hi: "k के किस मान के लिए समीकरण युग्म 2x + 3y = 7 और 4x + ky = 14 के अपरिमित रूप से अनेक हल होंगे?",
      te: "k ఏ విలువకు 2x + 3y = 7 మరియు 4x + ky = 14 సమీకరణాల జతకు అనంతమైన సాధనలు ఉంటాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient"
      },
      {
        id: "C",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "omitted_negative_sign_of_coefficient"
      },
      {
        id: "D",
        text: { en: "6", hi: "6", te: "6", reviewed: false }
      }
    ],
    correctAnswer: "D",
    explanation: {
      en: "For infinitely many solutions: a₁/a₂ = b₁/b₂ = c₁/c₂. Here 2/4 = 3/k = 7/14. Since 2/4 = 1/2, 3/k = 1/2 => k = 6.",
      hi: "अपरिमित रूप से अनेक हलों के लिए: a₁/a₂ = b₁/b₂ = c₁/c₂। 2/4 = 3/k = 7/14 => 1/2 = 3/k => k = 6।",
      te: "అనంతమైన సాధనల కోసం: a₁/a₂ = b₁/b₂ = c₁/c₂. 2/4 = 3/k = 7/14 => 1/2 = 3/k => k = 6.",
      reviewed: false
    },
    hint: {
      en: "Coincident lines require all three coefficient ratios to be equal.",
      hi: "संपाती रेखाओं के लिए तीनों गुणांकों का अनुपात बराबर होना चाहिए।",
      te: "ఏకీభవించే రేఖల కోసం మూడు గుణకాల నిష్పత్తులు సమానంగా ఉండాలి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-06",
    conceptId: "c10-lin-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Solve for y from 3x + 2y = 11 and 2x + 3y = 4.",
      hi: "3x + 2y = 11 और 2x + 3y = 4 से y का मान ज्ञात कीजिए।",
      te: "3x + 2y = 11 మరియు 2x + 3y = 4 నుండి y విలువను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-2", hi: "-2", te: "-2", reviewed: false }
      },
      {
        id: "B",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "C",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "sign_error_moving_terms_across_equality"
      },
      {
        id: "D",
        text: { en: "-5", hi: "-5", te: "-5", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Multiply 1st eq by 2: 6x + 4y = 22. Multiply 2nd eq by 3: 6x + 9y = 12. Subtract 1st from 2nd: 5y = -10 => y = -2.",
      hi: "पहले समीकरण को 2 से और दूसरे को 3 से गुणा करें: 6x + 4y = 22 और 6x + 9y = 12। घटाने पर: 5y = -10 => y = -2।",
      te: "మొదటి సమీకరణాన్ని 2 తో, రెండవదాన్ని 3 తో గుణించండి: 6x + 4y = 22 మరియు 6x + 9y = 12. తీసివేస్తే: 5y = -10 => y = -2.",
      reviewed: false
    },
    hint: {
      en: "Make the coefficients of x equal by multiplying both equations.",
      hi: "दोनों समीकरणों को गुणा करके x के गुणांक बराबर करें।",
      te: "రెండు సమీకరణాలను గుణించి x గుణకాలను సమానం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-07",
    conceptId: "c10-lin-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "word_problem",
    verified: false,
    prompt: {
      en: "The sum of the digits of a two-digit number is 9. Also, nine times this number is twice the number obtained by reversing the order of the digits. Find the number.",
      hi: "दो अंकों की एक संख्या के अंकों का योग 9 है। इस संख्या का 9 गुना, संख्या के अंकों को पलटने से बनी संख्या का 2 गुना है। वह संख्या ज्ञात कीजिए।",
      te: "రెండు అంకెల సంఖ్యలోని అంకెల మొత్తం 9. ఈ సంఖ్యకు 9 రెట్లు, అంకెల క్రమాన్ని తిరగరాయగా వచ్చే సంఖ్యకు రెట్టింపు. ఆ సంఖ్యను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "81", hi: "81", te: "81", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      },
      {
        id: "B",
        text: { en: "27", hi: "27", te: "27", reviewed: false },
        mistakeTag: "neglected_distributing_to_second_term"
      },
      {
        id: "C",
        text: { en: "18", hi: "18", te: "18", reviewed: false }
      },
      {
        id: "D",
        text: { en: "36", hi: "36", te: "36", reviewed: false },
        mistakeTag: "sign_error_moving_terms_across_equality"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Let tens digit be x and units digit be y. Number is 10x + y. x + y = 9. 9(10x + y) = 2(10y + x) => 90x + 9y = 20y + 2x => 88x = 11y => y = 8x. Since x + 8x = 9 => 9x = 9 => x = 1, y = 8. The number is 18.",
      hi: "दहाई का अंक x और इकाई का y मानें: x + y = 9 और 9(10x + y) = 2(10y + x) => 88x = 11y => y = 8x। 9x = 9 => x = 1, y = 8। संख्या 18 है।",
      te: "పదుల స్థానం x, ఒకట్ల స్థానం y అనుకుంటే: x + y = 9 మరియు 9(10x + y) = 2(10y + x) => 88x = 11y => y = 8x. 9x = 9 => x = 1, y = 8. ఆ సంఖ్య 18.",
      reviewed: false
    },
    hint: {
      en: "Represent a two-digit number with tens digit x and units digit y as 10x + y.",
      hi: "दो अंकों की संख्या को 10x + y के रूप में निरूपित करें।",
      te: "రెండు అంకెల సంఖ్యను 10x + y గా సూచించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-lin-08",
    conceptId: "c10-lin-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the values of a and b for which the system 2x + 3y = 7 and (a - b)x + (a + b)y = 3a + b - 2 has infinitely many solutions.",
      hi: "a और b के वे मान ज्ञात कीजिए जिनके लिए 2x + 3y = 7 और (a - b)x + (a + b)y = 3a + b - 2 के अपरिमित रूप से अनेक हल हों।",
      te: "2x + 3y = 7 మరియు (a - b)x + (a + b)y = 3a + b - 2 వ్యవస్థకు అనంతమైన సాధనలు ఉండటానికి a మరియు b విలువలను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "a = 3, b = 2", hi: "a = 3, b = 2", te: "a = 3, b = 2", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      },
      {
        id: "B",
        text: { en: "a = 5, b = 1", hi: "a = 5, b = 1", te: "a = 5, b = 1", reviewed: false }
      },
      {
        id: "C",
        text: { en: "a = 1, b = 5", hi: "a = 1, b = 5", te: "a = 1, b = 5", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "D",
        text: { en: "a = 4, b = 2", hi: "a = 4, b = 2", te: "a = 4, b = 2", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Ratio equality: 2/(a - b) = 3/(a + b) = 7/(3a + b - 2). From first pair: 2a + 2b = 3a - 3b => a = 5b. From second: 3/(6b) = 7/(16b - 2) => 1/(2b) = 7/(16b - 2) => 16b - 2 = 14b => 2b = 2 => b = 1, a = 5.",
      hi: "2/(a - b) = 3/(a + b) = 7/(3a + b - 2)। पहली जोड़ी से: a = 5b। दूसरी जोड़ी में रखने पर: 2b = 2 => b = 1, a = 5।",
      te: "2/(a - b) = 3/(a + b) = 7/(3a + b - 2). మొదటి జత నుండి: a = 5b. రెండవ జతలో ప్రతిక్షేపిస్తే: b = 1, a = 5.",
      reviewed: false
    },
    hint: {
      en: "Equate the ratio pairs 2/(a-b) = 3/(a+b) and 3/(a+b) = 7/(3a+b-2) to form two linear equations in a and b.",
      hi: "a और b में दो समीकरण बनाने के लिए अनुपातों की तुलना करें।",
      te: "a మరియు b లలో రెండు సమీకరణాలను రూపొందించడానికి నిష్పత్తులను పోల్చండి.",
      reviewed: false
    }
  }
];

// 3. Questions for c10-ch05: Arithmetic Progressions (q-c10-ap-01 to 08)
const c10_ch05_questions = [
  {
    id: "q-c10-ap-01",
    conceptId: "c10-ap-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "What is the common difference d of the AP: 3, 7, 11, 15, ...?",
      hi: "AP: 3, 7, 11, 15, ... का सार्व अंतर d क्या है?",
      te: "AP: 3, 7, 11, 15, ... యొక్క సాధారణ భేదం d ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "C",
        text: { en: "-4", hi: "-4", te: "-4", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "D",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "added_magnitudes_positive"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "The common difference d = a₂ - a₁ = 7 - 3 = 4.",
      hi: "सार्व अंतर d = a₂ - a₁ = 7 - 3 = 4।",
      te: "సాధారణ భేదం d = a₂ - a₁ = 7 - 3 = 4.",
      reviewed: false
    },
    hint: {
      en: "Subtract the first term from the second term.",
      hi: "दूसरे पद में से पहला पद घटाएँ।",
      te: "రెండవ పదం నుండి మొదటి పదాన్ని తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-02",
    conceptId: "c10-ap-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the 10th term of the AP: 2, 7, 12, ...",
      hi: "AP: 2, 7, 12, ... का 10वां पद ज्ञात कीजिए।",
      te: "AP: 2, 7, 12, ... యొక్క 10వ పదాన్ని కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "47", hi: "47", te: "47", reviewed: false }
      },
      {
        id: "B",
        text: { en: "50", hi: "50", te: "50", reviewed: false },
        mistakeTag: "performed_addition_before_subtraction_erroneously"
      },
      {
        id: "C",
        text: { en: "45", hi: "45", te: "45", reviewed: false },
        mistakeTag: "added_instead_of_multiplied_positive"
      },
      {
        id: "D",
        text: { en: "52", hi: "52", te: "52", reviewed: false },
        mistakeTag: "multiplied_four_by_three"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Here a = 2, d = 7 - 2 = 5. a₁₀ = a + (10 - 1)d = 2 + 9(5) = 2 + 45 = 47.",
      hi: "यहाँ a = 2, d = 5। a₁₀ = 2 + (10 - 1)5 = 2 + 45 = 47।",
      te: "ఇక్కడ a = 2, d = 5. a₁₀ = 2 + (10 - 1)5 = 2 + 45 = 47.",
      reviewed: false
    },
    hint: {
      en: "Use the formula aₙ = a + (n - 1)d.",
      hi: "aₙ = a + (n - 1)d सूत्र का उपयोग करें।",
      te: "aₙ = a + (n - 1)d సూత్రాన్ని ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-03",
    conceptId: "c10-ap-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Which term of the AP: 21, 18, 15, ... is -81?",
      hi: "AP: 21, 18, 15, ... का कौन-सा पद -81 है?",
      te: "AP: 21, 18, 15, ... లో ఎన్నవ పదం -81 అవుతుంది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "34th term", hi: "34वां पद", te: "34వ పదం", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "B",
        text: { en: "30th term", hi: "30वां पद", te: "30వ పదం", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "C",
        text: { en: "35th term", hi: "35वां पद", te: "35వ పదం", reviewed: false }
      },
      {
        id: "D",
        text: { en: "36th term", hi: "36वां पद", te: "36వ పదం", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "a = 21, d = 18 - 21 = -3. aₙ = a + (n - 1)d => -81 = 21 + (n - 1)(-3) => -102 = -3(n - 1) => n - 1 = 34 => n = 35.",
      hi: "a = 21, d = -3। -81 = 21 + (n - 1)(-3) => -102 = -3(n - 1) => n - 1 = 34 => n = 35।",
      te: "a = 21, d = -3. -81 = 21 + (n - 1)(-3) => -102 = -3(n - 1) => n - 1 = 34 => n = 35.",
      reviewed: false
    },
    hint: {
      en: "Note that d is negative because the AP is decreasing.",
      hi: "ध्यान दें कि श्रेणी घट रही है इसलिए d ऋणात्मक है।",
      te: "శ్రేఢి తగ్గుతోంది కాబట్టి d ఋణాత్మకం అని గమనించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-04",
    conceptId: "c10-ap-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the sum of the first 20 terms of the AP: 1, 4, 7, 10, ...",
      hi: "AP: 1, 4, 7, 10, ... के प्रथम 20 पदों का योग ज्ञात कीजिए।",
      te: "AP: 1, 4, 7, 10, ... యొక్క మొదటి 20 పదాల మొత్తం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "570", hi: "570", te: "570", reviewed: false },
        mistakeTag: "performed_addition_before_subtraction_erroneously"
      },
      {
        id: "B",
        text: { en: "590", hi: "590", te: "590", reviewed: false }
      },
      {
        id: "C",
        text: { en: "600", hi: "600", te: "600", reviewed: false },
        mistakeTag: "added_multiplication_product_instead_of_subtracting"
      },
      {
        id: "D",
        text: { en: "620", hi: "620", te: "620", reviewed: false },
        mistakeTag: "added_instead_of_multiplied_positive"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "a = 1, d = 3, n = 20. S₂₀ = (20/2) × [2(1) + (20 - 1)(3)] = 10 × [2 + 57] = 10 × 59 = 590.",
      hi: "a = 1, d = 3, n = 20। S₂₀ = (20/2) × [2(1) + 19(3)] = 10 × 59 = 590।",
      te: "a = 1, d = 3, n = 20. S₂₀ = 10 × [2 + 57] = 10 × 59 = 590.",
      reviewed: false
    },
    hint: {
      en: "Use Sₙ = n/2 * [2a + (n - 1)d].",
      hi: "Sₙ = n/2 * [2a + (n - 1)d] सूत्र का उपयोग करें।",
      te: "Sₙ = n/2 * [2a + (n - 1)d] సూత్రాన్ని ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-05",
    conceptId: "c10-ap-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If the 3rd and 9th terms of an AP are 4 and -8 respectively, find the common difference d.",
      hi: "यदि किसी AP के तीसरे और 9वें पद क्रमशः 4 और -8 हैं, तो सार्व अंतर d ज्ञात कीजिए।",
      te: "ఒక AP లో 3వ మరియు 9వ పదాలు వరుసగా 4 మరియు -8 అయితే, సాధారణ భేదం d ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "B",
        text: { en: "-4", hi: "-4", te: "-4", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "C",
        text: { en: "-2", hi: "-2", te: "-2", reviewed: false }
      },
      {
        id: "D",
        text: { en: "6", hi: "6", te: "6", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "a₃ = a + 2d = 4, a₉ = a + 8d = -8. Subtracting gives (a + 8d) - (a + 2d) = -8 - 4 => 6d = -12 => d = -2.",
      hi: "a + 2d = 4 और a + 8d = -8। घटाने पर: 6d = -12 => d = -2।",
      te: "a + 2d = 4 మరియు a + 8d = -8. తీసివేస్తే: 6d = -12 => d = -2.",
      reviewed: false
    },
    hint: {
      en: "Subtract a₃ from a₉ to eliminate the first term a.",
      hi: "पहला पद a समाप्त करने के लिए a₉ में से a₃ घटाएँ।",
      te: "మొదటి పదం a ని తొలగించడానికి a₉ నుండి a₃ ని తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-06",
    conceptId: "c10-ap-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "How many multiples of 4 lie between 10 and 250?",
      hi: "10 और 250 के बीच में 4 के कितने गुणज हैं?",
      te: "10 మరియు 250 ల మధ్య 4 యొక్క గుణిజాలు ఎన్ని ఉన్నాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "60", hi: "60", te: "60", reviewed: false }
      },
      {
        id: "B",
        text: { en: "59", hi: "59", te: "59", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "C",
        text: { en: "61", hi: "61", te: "61", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      },
      {
        id: "D",
        text: { en: "62", hi: "62", te: "62", reviewed: false },
        mistakeTag: "added_extra_place_value"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "First multiple > 10 is 12. Last multiple < 250 is 248. AP: 12, 16, ..., 248. 248 = 12 + (n - 1)4 => 236 = 4(n - 1) => n - 1 = 59 => n = 60.",
      hi: "पहला गुणज 12 और अंतिम 248 है। 248 = 12 + (n - 1)4 => 236 = 4(n - 1) => n - 1 = 59 => n = 60।",
      te: "మొదటి గుణిజం 12 మరియు చివరిది 248. 248 = 12 + (n - 1)4 => n - 1 = 59 => n = 60.",
      reviewed: false
    },
    hint: {
      en: "Identify the first and last multiples of 4 within the range and form an AP.",
      hi: "दी गई सीमा में 4 के पहले और अंतिम गुणज ज्ञात करें और एक AP बनाएँ।",
      te: "పరిధిలోని 4 యొక్క మొదటి మరియు చివరి గుణిజాలను గుర్తించి AP ని రూపొందించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-07",
    conceptId: "c10-ap-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If the sum of the first n terms of an AP is given by Sₙ = 3n² + 5n, find the 15th term.",
      hi: "यदि किसी AP के प्रथम n पदों का योग Sₙ = 3n² + 5n द्वारा दिया गया है, तो 15वां पद ज्ञात कीजिए।",
      te: "ఒక AP లో మొదటి n పదాల మొత్తం Sₙ = 3n² + 5n అయితే, 15వ పదం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "88", hi: "88", te: "88", reviewed: false },
        mistakeTag: "omitted_middle_linear_terms"
      },
      {
        id: "B",
        text: { en: "90", hi: "90", te: "90", reviewed: false },
        mistakeTag: "neglected_distributing_to_second_term"
      },
      {
        id: "C",
        text: { en: "95", hi: "95", te: "95", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "D",
        text: { en: "92", hi: "92", te: "92", reviewed: false }
      }
    ],
    correctAnswer: "D",
    explanation: {
      en: "aₙ = Sₙ - Sₙ₋₁. a₁₅ = S₁₅ - S₁₄ = [3(15)² + 5(15)] - [3(14)² + 5(14)] = [3(225) + 75] - [3(196) + 70] = 750 - 658 = 92.",
      hi: "a₁₅ = S₁₅ - S₁₄ = [3(225) + 75] - [3(196) + 70] = 750 - 658 = 92।",
      te: "a₁₅ = S₁₅ - S₁₄ = [3(225) + 75] - [3(196) + 70] = 750 - 658 = 92.",
      reviewed: false
    },
    hint: {
      en: "Use the identity aₙ = Sₙ - Sₙ₋₁ for n = 15.",
      hi: "n = 15 के लिए संबंध aₙ = Sₙ - Sₙ₋₁ का उपयोग करें।",
      te: "n = 15 కొరకు aₙ = Sₙ - Sₙ₋₁ సంబంధాన్ని ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-ap-08",
    conceptId: "c10-ap-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "word_problem",
    verified: false,
    prompt: {
      en: "A contract on a construction job specifies a penalty for delay of completion beyond a certain date as follows: ₹200 for the first day, ₹250 for the second day, ₹300 for the third day, etc. How much money does the contractor have to pay as penalty if he delays the work by 30 days?",
      hi: "निर्माण कार्य के एक ठेके में एक निश्चित तिथि से विलंब होने पर जुर्माना इस प्रकार लगाया जाता है: पहले दिन ₹200, दूसरे दिन ₹250, तीसरे दिन ₹300 इत्यादि। यदि ठेकेदार 30 दिन का विलंब करता है, तो उसे जुर्माने के रूप में कितनी राशि देनी होगी?",
      te: "ఒక నిర్మాణ కాంట్రాక్ట్‌లో పని ఆలస్యమైతే జరిమానా ఈ విధంగా ఉంటుంది: మొదటి రోజు ₹200, రెండవ రోజు ₹250, మూడవ రోజు ₹300 మొదలైనవి. కాంట్రాక్టర్ 30 రోజులు ఆలస్యం చేస్తే జరిమానాగా ఎంత చెల్లించాలి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "₹25,500", hi: "₹25,500", te: "₹25,500", reviewed: false },
        mistakeTag: "added_multiplication_product_instead_of_subtracting"
      },
      {
        id: "B",
        text: { en: "₹27,750", hi: "₹27,750", te: "₹27,750", reviewed: false }
      },
      {
        id: "C",
        text: { en: "₹28,500", hi: "₹28,500", te: "₹28,500", reviewed: false },
        mistakeTag: "performed_addition_before_subtraction_erroneously"
      },
      {
        id: "D",
        text: { en: "₹30,000", hi: "₹30,000", te: "₹30,000", reviewed: false },
        mistakeTag: "overestimated_factor_product"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "This is an AP with a = 200, d = 50, n = 30. Total penalty = S₃₀ = (30/2) × [2(200) + (30 - 1)(50)] = 15 × [400 + 1450] = 15 × 1850 = ₹27,750.",
      hi: "यह a = 200, d = 50, n = 30 वाली AP है। S₃₀ = 15 × [400 + 1450] = 15 × 1850 = ₹27,750।",
      te: "ఇది a = 200, d = 50, n = 30 గల AP. S₃₀ = 15 × [400 + 1450] = 15 × 1850 = ₹27,750.",
      reviewed: false
    },
    hint: {
      en: "Calculate the sum S₃₀ of the AP with first term 200 and common difference 50.",
      hi: "प्रथम पद 200 और सार्व अंतर 50 वाली AP के प्रथम 30 पदों का योग S₃₀ ज्ञात करें।",
      te: "మొదటి పదం 200, సాధారణ భేదం 50 గా గల AP యొక్క S₃₀ మొత్తాన్ని లెక్కించండి.",
      reviewed: false
    }
  }
];

// 4. Questions for c10-ch06: Triangles (q-c10-tri-01 to 08)
const c10_ch06_questions = [
  {
    id: "q-c10-tri-01",
    conceptId: "c10-tri-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "In triangle ABC, DE || BC intersecting AB at D and AC at E. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, find EC (using Basic Proportionality Theorem).",
      hi: "त्रिभुज ABC में, DE || BC है जो AB को D और AC को E पर प्रतिच्छेद करती है। यदि AD = 1.5 सेमी, DB = 3 सेमी, और AE = 1 सेमी है, तो EC ज्ञात कीजिए।",
      te: "ΔABC లో, DE || BC. AD = 1.5 సెం.మీ, DB = 3 సెం.మీ, AE = 1 సెం.మీ అయితే EC విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2 cm", hi: "2 सेमी", te: "2 సెం.మీ", reviewed: false }
      },
      {
        id: "B",
        text: { en: "3 cm", hi: "3 सेमी", te: "3 సెం.మీ", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "C",
        text: { en: "1.5 cm", hi: "1.5 सेमी", te: "1.5 సెం.మీ", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "D",
        text: { en: "4.5 cm", hi: "4.5 सेमी", te: "4.5 సెం.మీ", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "By BPT: AD/DB = AE/EC => 1.5/3 = 1/EC => 1/2 = 1/EC => EC = 2 cm.",
      hi: "आधारभूत आनुपातिकता प्रमेय (BPT) से: AD/DB = AE/EC => 1.5/3 = 1/EC => EC = 2 सेमी।",
      te: "ప్రాథమిక అనుపాత సిద్ధాంతం ప్రకారం: AD/DB = AE/EC => 1.5/3 = 1/EC => EC = 2 సెం.మీ.",
      reviewed: false
    },
    hint: {
      en: "Set up the proportion AD/DB = AE/EC and cross-multiply.",
      hi: "अनुपात AD/DB = AE/EC बनाएँ और तिर्यक गुणा करें।",
      te: "AD/DB = AE/EC నిష్పత్తిని వేసి అడ్డగుణకారం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-02",
    conceptId: "c10-tri-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If two triangles ABC and PQR are similar such that ∠A = 45° and ∠B = 75°, then the measure of ∠R is:",
      hi: "यदि दो त्रिभुज ABC और PQR समरूप हैं और ∠A = 45° तथा ∠B = 75° है, तो ∠R का मान क्या है?",
      te: "రెండు త్రిభుజాలు ABC మరియు PQR సరూపాలుగా ఉండి ∠A = 45° మరియు ∠B = 75° అయితే, ∠R కొలత ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "45°", hi: "45°", te: "45°", reviewed: false },
        mistakeTag: "confused_acute_with_right_angle"
      },
      {
        id: "B",
        text: { en: "55°", hi: "55°", te: "55°", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "C",
        text: { en: "60°", hi: "60°", te: "60°", reviewed: false }
      },
      {
        id: "D",
        text: { en: "75°", hi: "75°", te: "75°", reviewed: false },
        mistakeTag: "confused_straight_angle_with_complete_angle"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "In ΔABC, sum of angles is 180°: ∠C = 180° - (45° + 75°) = 60°. Since ΔABC ~ ΔPQR, corresponding angle ∠R = ∠C = 60°.",
      hi: "ΔABC में: ∠C = 180° - (45° + 75°) = 60°। समरूप त्रिभुजों में संगत कोण बराबर होते हैं: ∠R = ∠C = 60°।",
      te: "ΔABC లో: ∠C = 180° - (45° + 75°) = 60°. సరూప త్రిభుజాలలో అనురూప కోణాలు సమానం కాబట్టి ∠R = ∠C = 60°.",
      reviewed: false
    },
    hint: {
      en: "First find the third angle of triangle ABC using the angle sum property.",
      hi: "पहले त्रिभुज के तीनों कोणों के योग गुणधर्म से त्रिभुज ABC का तीसरा कोण ज्ञात करें।",
      te: "మొదట త్రిభుజ కోణాల మొత్తం ధర్మం ద్వారా ΔABC లో మూడవ కోణాన్ని కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-03",
    conceptId: "c10-tri-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Two figures having the same shape but not necessarily the same size are called:",
      hi: "समान आकार (shape) परंतु आवश्यक रूप से समान माप (size) न रखने वाली दो आकृतियाँ क्या कहलाती हैं?",
      te: "ఒకే ఆకారం కలిగి ఉండి, ఒకే పరిమాణం తప్పనిసరిగా ఉండాల్సిన అవసరం లేని రెండు పటాలను ఏమంటారు?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "Congruent figures", hi: "सर्वांगसम आकृतियाँ", te: "సర్వసమాన పటాలు", reviewed: false },
        mistakeTag: "confused_acute_with_right_angle"
      },
      {
        id: "B",
        text: { en: "Similar figures", hi: "समरूप आकृतियाँ", te: "సరూప పటాలు", reviewed: false }
      },
      {
        id: "C",
        text: { en: "Equal figures", hi: "बराबर आकृतियाँ", te: "సమాన పటాలు", reviewed: false },
        mistakeTag: "confused_degree_with_single_axis_point"
      },
      {
        id: "D",
        text: { en: "Symmetric figures", hi: "सममित आकृतियाँ", te: "సౌష్టవ పటాలు", reviewed: false },
        mistakeTag: "assumed_perpendicular_rays"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "By definition, figures that have the same shape but possibly different sizes are similar figures. Congruent figures must also have the exact same size.",
      hi: "परिभाषा के अनुसार, समान आकार परंतु भिन्न माप वाली आकृतियाँ समरूप कहलाती हैं। सर्वांगसम आकृतियों का माप भी समान होना आवश्यक है।",
      te: "నిర్వచనం ప్రకారం, ఒకే ఆకారం ఉండి పరిమాణం మారే పటాలను సరూప పటాలు అంటారు.",
      reviewed: false
    },
    hint: {
      en: "Recall that 'congruent' means same shape AND same size, while 'similar' requires only same shape.",
      hi: "याद रखें कि सर्वांगसम में आकार और माप दोनों समान होते हैं, जबकि समरूप में केवल आकार समान होना पर्याप्त है।",
      te: "సర్వసమానం అంటే ఆకారం మరియు పరిమాణం రెండూ సమానం, సరూపం అంటే కేవలం ఆకారం మాత్రమే సమానం అని గుర్తుంచుకోండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-04",
    conceptId: "c10-tri-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "In a right triangle ABC right-angled at B, if AB = 6 cm and BC = 8 cm, find the length of the hypotenuse AC.",
      hi: "एक समकोण त्रिभुज ABC में जिसका कोण B समकोण है, यदि AB = 6 सेमी और BC = 8 सेमी है, तो कर्ण AC की लंबाई ज्ञात कीजिए।",
      te: "B వద్ద లంబకోణం కలిగిన లంబకోణ త్రిభుజం ABC లో, AB = 6 సెం.మీ మరియు BC = 8 సెం.మీ అయితే కర్ణం AC పొడవు ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "14 cm", hi: "14 सेमी", te: "14 సెం.మీ", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "B",
        text: { en: "12 cm", hi: "12 सेमी", te: "12 సెం.మీ", reviewed: false },
        mistakeTag: "calculated_square_root_arithmetic_error"
      },
      {
        id: "C",
        text: { en: "9 cm", hi: "9 सेमी", te: "9 సెం.మీ", reviewed: false },
        mistakeTag: "overestimated_factor_product"
      },
      {
        id: "D",
        text: { en: "10 cm", hi: "10 सेमी", te: "10 సెం.మీ", reviewed: false }
      }
    ],
    correctAnswer: "D",
    explanation: {
      en: "By Pythagoras Theorem: AC² = AB² + BC² = 6² + 8² = 36 + 64 = 100 => AC = √100 = 10 cm.",
      hi: "पाइथागोरस प्रमेय से: AC² = 6² + 8² = 36 + 64 = 100 => AC = 10 सेमी।",
      te: "పైథాగరస్ సిద్ధాంతం ప్రకారం: AC² = 6² + 8² = 36 + 64 = 100 => AC = 10 సెం.మీ.",
      reviewed: false
    },
    hint: {
      en: "Square both legs, add the results, and take the square root.",
      hi: "दोनों भुजाओं का वर्ग करें, जोड़ें और वर्गमूल लें।",
      te: "రెండు భుజాలను వర్గం చేసి, కూడి, వర్గమూలం కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-05",
    conceptId: "c10-tri-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If triangle ABC ~ triangle DEF such that 2AB = DE and BC = 8 cm, find EF.",
      hi: "यदि त्रिभुज ABC ~ त्रिभुज DEF इस प्रकार है कि 2AB = DE और BC = 8 सेमी है, तो EF ज्ञात कीजिए।",
      te: "త్రిభుజం ABC ~ త్రిభుజం DEF మరియు 2AB = DE, BC = 8 సెం.మీ అయితే EF ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "16 cm", hi: "16 सेमी", te: "16 సెం.మీ", reviewed: false }
      },
      {
        id: "B",
        text: { en: "4 cm", hi: "4 सेमी", te: "4 సెం.మీ", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "C",
        text: { en: "10 cm", hi: "10 सेमी", te: "10 సెం.మీ", reviewed: false },
        mistakeTag: "inverted_fraction_divided_product_by_sum"
      },
      {
        id: "D",
        text: { en: "12 cm", hi: "12 सेमी", te: "12 సెం.మీ", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Since ΔABC ~ ΔDEF, ratio of corresponding sides is equal: AB/DE = BC/EF. Given DE = 2AB, AB/(2AB) = 8/EF => 1/2 = 8/EF => EF = 16 cm.",
      hi: "समरूप त्रिभुजों की संगत भुजाएँ समानुपाती होती हैं: AB/DE = BC/EF => 1/2 = 8/EF => EF = 16 सेमी।",
      te: "సరూప త్రిభుజాల అనురూప భుజాల నిష్పత్తి సమానం: AB/DE = BC/EF => 1/2 = 8/EF => EF = 16 సెం.మీ.",
      reviewed: false
    },
    hint: {
      en: "The scale factor from ΔABC to ΔDEF is 2.",
      hi: "ΔABC से ΔDEF का स्केल फैक्टर 2 है।",
      te: "ΔABC నుండి ΔDEF కి స్కేల్ ఫ్యాక్టర్ 2.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-06",
    conceptId: "c10-tri-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "word_problem",
    verified: false,
    prompt: {
      en: "A vertical pole of length 6 m casts a shadow 4 m long on the ground, and at the same time a tower casts a shadow 28 m long. Find the height of the tower.",
      hi: "6 मीटर लंबाई वाला एक ऊर्ध्वाधर खंभा जमीन पर 4 मीटर लंबी छाया डालता है, और उसी समय एक मीनार 28 मीटर लंबी छाया डालती है। मीनार की ऊँचाई ज्ञात कीजिए।",
      te: "6 మీటర్ల పొడవు గల నిలువు స్తంభం నేలపై 4 మీటర్ల నీడను ఏర్పరుస్తుంది, అదే సమయంలో ఒక టవర్ 28 మీటర్ల నీడను ఏర్పరుస్తుంది. టవర్ ఎత్తు ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "36 m", hi: "36 मीटर", te: "36 మీటర్లు", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      },
      {
        id: "B",
        text: { en: "40 m", hi: "40 मीटर", te: "40 మీటర్లు", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "C",
        text: { en: "42 m", hi: "42 मीटर", te: "42 మీటర్లు", reviewed: false }
      },
      {
        id: "D",
        text: { en: "48 m", hi: "48 मीटर", te: "48 మీటర్లు", reviewed: false },
        mistakeTag: "added_magnitudes_positive"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "At the same time, the angle of elevation of the sun is the same, so the triangles formed by the objects and their shadows are similar. (Height of tower) / (Pole height) = (Tower shadow) / (Pole shadow) => H / 6 = 28 / 4 = 7 => H = 6 × 7 = 42 m.",
      hi: "सूर्य का उन्नयन कोण समान होने से बने त्रिभुज समरूप हैं: H/6 = 28/4 => H = 6 × 7 = 42 मीटर।",
      te: "సూర్యుని ఉన్నతి కోణం ఒకేలా ఉండటం వల్ల ఏర్పడే త్రిభుజాలు సరూపాలు: H/6 = 28/4 => H = 6 × 7 = 42 మీటర్లు.",
      reviewed: false
    },
    hint: {
      en: "Set up the proportion (Height of tower) / 28 = 6 / 4.",
      hi: "समानुपात (मीनार की ऊँचाई)/28 = 6/4 बनाएँ।",
      te: "(టవర్ ఎత్తు)/28 = 6/4 అనుపాతాన్ని ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-07",
    conceptId: "c10-tri-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "word_problem",
    verified: false,
    prompt: {
      en: "A ladder 10 m long reaches a window 8 m above the ground. Find the distance of the foot of the ladder from the base of the wall.",
      hi: "10 मीटर लंबी एक सीढ़ी जमीन से 8 मीटर ऊँची खिड़की तक पहुँचती है। दीवार के आधार से सीढ़ी के पाद की दूरी ज्ञात कीजिए।",
      te: "10 మీటర్ల పొడవు గల నిచ్చెన నేల నుండి 8 మీటర్ల ఎత్తులో ఉన్న కిటికీని తాకుతుంది. గోడ అడుగు భాగం నుండి నిచ్చెన అడుగు భాగం ఎంత దూరంలో ఉంది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4 m", hi: "4 मीटर", te: "4 మీటర్లు", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "B",
        text: { en: "6 m", hi: "6 मीटर", te: "6 మీటర్లు", reviewed: false }
      },
      {
        id: "C",
        text: { en: "8 m", hi: "8 मीटर", te: "8 మీటర్లు", reviewed: false },
        mistakeTag: "calculated_square_root_arithmetic_error"
      },
      {
        id: "D",
        text: { en: "√164 m", hi: "√164 मीटर", te: "√164 మీటర్లు", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "The ladder, wall, and ground form a right-angled triangle. Hypotenuse = 10 m, vertical leg = 8 m. Base d = √(10² - 8²) = √(100 - 64) = √36 = 6 m.",
      hi: "सीढ़ी, दीवार और जमीन समकोण त्रिभुज बनाते हैं। d = √(10² - 8²) = √(100 - 64) = √36 = 6 मीटर।",
      te: "నిచ్చెన, గోడ మరియు నేల లంబకోణ త్రిభుజాన్ని ఏర్పరుస్తాయి. d = √(10² - 8²) = √(100 - 64) = √36 = 6 మీటర్లు.",
      reviewed: false
    },
    hint: {
      en: "In Pythagoras theorem, base² = hypotenuse² - height².",
      hi: "पाइथागोरस प्रमेय में, आधार² = कर्ण² - लंब² होता है।",
      te: "పైథాగరస్ సిద్ధాంతంలో, భూమి² = కర్ణం² - ఎత్తు².",
      reviewed: false
    }
  },
  {
    id: "q-c10-tri-08",
    conceptId: "c10-tri-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "In an equilateral triangle ABC of side 2a, find the length of each of its altitudes.",
      hi: "भुजा 2a वाले एक समबाहु त्रिभुज ABC में, इसके प्रत्येक शीर्षलंब की लंबाई ज्ञात कीजिए।",
      te: "2a భుజం గల సమబాహు త్రిభుజం ABC లో దాని ప్రతి ఉన్నతి పొడవు ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "a√3", hi: "a√3", te: "a√3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "2a√3", hi: "2a√3", te: "2a√3", reviewed: false },
        mistakeTag: "dropped_exponent_on_variable"
      },
      {
        id: "C",
        text: { en: "3a", hi: "3a", te: "3a", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "D",
        text: { en: "a√2", hi: "a√2", te: "a√2", reviewed: false },
        mistakeTag: "calculated_square_root_arithmetic_error"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The altitude of an equilateral triangle bisects the base into lengths a. In the right triangle: h² + a² = (2a)² => h² + a² = 4a² => h² = 3a² => h = a√3.",
      hi: "समबाहु त्रिभुज का शीर्षलंब आधार को दो बराबर भागों (a) में बाँटता है। h² + a² = (2a)² => h² = 3a² => h = a√3।",
      te: "సమబాహు త్రిభుజం యొక్క ఉన్నతి భూమిని a పొడవు గల రెండు సమాన భాగాలుగా విభజిస్తుంది. h² + a² = 4a² => h² = 3a² => h = a√3.",
      reviewed: false
    },
    hint: {
      en: "The altitude splits the equilateral triangle into two 30-60-90 right triangles with base a and hypotenuse 2a.",
      hi: "शीर्षलंब समबाहु त्रिभुज को दो समकोण त्रिभुजों में विभाजित करता है जिनका आधार a और कर्ण 2a है।",
      te: "ఉన్నతి సమబాహు త్రిభుజాన్ని భూమి a, కర్ణం 2a గల రెండు లంబకోణ త్రిభుజాలుగా విభజిస్తుంది.",
      reviewed: false
    }
  }
];

// 5. Questions for c10-ch07: Coordinate Geometry (q-c10-geom-01 to 08)
const c10_ch07_questions = [
  {
    id: "q-c10-geom-01",
    conceptId: "c10-geom-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the distance between the points (2, 3) and (4, 1).",
      hi: "बिंदुओं (2, 3) और (4, 1) के बीच की दूरी ज्ञात कीजिए।",
      te: "(2, 3) మరియు (4, 1) బిందువుల మధ్య దూరం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4", hi: "4", te: "4", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "B",
        text: { en: "2√2", hi: "2√2", te: "2√2", reviewed: false }
      },
      {
        id: "C",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "calculated_square_root_arithmetic_error"
      },
      {
        id: "D",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "d = √[(4 - 2)² + (1 - 3)²] = √[2² + (-2)²] = √[4 + 4] = √8 = 2√2 units.",
      hi: "d = √[(4 - 2)² + (1 - 3)²] = √[4 + 4] = √8 = 2√2 मात्रक।",
      te: "d = √[(4 - 2)² + (1 - 3)²] = √[4 + 4] = √8 = 2√2 యూనిట్లు.",
      reviewed: false
    },
    hint: {
      en: "Use the distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²].",
      hi: "दूरी सूत्र d = √[(x₂ - x₁)² + (y₂ - y₁)²] का उपयोग करें।",
      te: "దూర సూత్రం d = √[(x₂ - x₁)² + (y₂ - y₁)²] ను ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-02",
    conceptId: "c10-geom-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "What is the distance of the point P(-6, 8) from the origin (0, 0)?",
      hi: "बिंदु P(-6, 8) की मूल बिंदु (0, 0) से दूरी क्या है?",
      te: "మూలబిందువు (0, 0) నుండి P(-6, 8) బిందువు దూరం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "10", hi: "10", te: "10", reviewed: false }
      },
      {
        id: "B",
        text: { en: "14", hi: "14", te: "14", reviewed: false },
        mistakeTag: "distance_expressed_as_negative"
      },
      {
        id: "C",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "D",
        text: { en: "-10", hi: "-10", te: "-10", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Distance from origin = √(x² + y²) = √((-6)² + 8²) = √(36 + 64) = √100 = 10 units.",
      hi: "मूल बिंदु से दूरी = √(x² + y²) = √((-6)² + 8²) = √(36 + 64) = √100 = 10 मात्रक।",
      te: "మూలబిందువు నుండి దూరం = √(x² + y²) = √((-6)² + 8²) = √(36 + 64) = √100 = 10 యూనిట్లు.",
      reviewed: false
    },
    hint: {
      en: "Distance of (x, y) from origin is √(x² + y²). Note that distances are always non-negative.",
      hi: "मूल बिंदु से (x, y) की दूरी √(x² + y²) होती है। दूरी हमेशा धनात्मक होती है।",
      te: "మూలబిందువు నుండి (x, y) దూరం √(x² + y²). దూరం ఎల్లప్పుడూ ధనాత్మకం.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-03",
    conceptId: "c10-geom-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the coordinates of the midpoint of the line segment joining points A(2, 4) and B(6, 8).",
      hi: "बिंदुओं A(2, 4) और B(6, 8) को मिलाने वाले रेखाखंड के मध्य-बिंदु के निर्देशांक ज्ञात कीजिए।",
      te: "A(2, 4) మరియు B(6, 8) బిందువులను కలిపే రేఖాఖండం యొక్క మధ్య బిందువు నిరూపకాలు ఏవి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "(3, 5)", hi: "(3, 5)", te: "(3, 5)", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient"
      },
      {
        id: "B",
        text: { en: "(8, 12)", hi: "(8, 12)", te: "(8, 12)", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      },
      {
        id: "C",
        text: { en: "(4, 6)", hi: "(4, 6)", te: "(4, 6)", reviewed: false }
      },
      {
        id: "D",
        text: { en: "(2, 2)", hi: "(2, 2)", te: "(2, 2)", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Midpoint formula: ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((2 + 6)/2, (4 + 8)/2) = (8/2, 12/2) = (4, 6).",
      hi: "मध्य-बिंदु = ((2 + 6)/2, (4 + 8)/2) = (8/2, 12/2) = (4, 6)।",
      te: "మధ్య బిందువు = ((2 + 6)/2, (4 + 8)/2) = (8/2, 12/2) = (4, 6).",
      reviewed: false
    },
    hint: {
      en: "Add corresponding coordinates and divide by 2.",
      hi: "संगत निर्देशांकों को जोड़कर 2 से भाग दें।",
      te: "అనురూప నిరూపకాలను కూడి 2 తో భాగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-04",
    conceptId: "c10-geom-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the coordinates of the point which divides the line segment joining (4, -3) and (8, 5) in the ratio 3:1 internally.",
      hi: "उस बिंदु के निर्देशांक ज्ञात कीजिए जो (4, -3) और (8, 5) को मिलाने वाले रेखाखंड को 3:1 के अनुपात में अंतर्विभाजित करता है।",
      te: "(4, -3) మరియు (8, 5) బిందువులను కలిపే రేఖాఖండాన్ని 3:1 నిష్పత్తిలో అంతర్గతంగా విభజించే బిందువు నిరూపకాలను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "(6, 2)", hi: "(6, 2)", te: "(6, 2)", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      },
      {
        id: "B",
        text: { en: "(3, 7)", hi: "(3, 7)", te: "(3, 7)", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      },
      {
        id: "C",
        text: { en: "(5, 1)", hi: "(5, 1)", te: "(5, 1)", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient"
      },
      {
        id: "D",
        text: { en: "(7, 3)", hi: "(7, 3)", te: "(7, 3)", reviewed: false }
      }
    ],
    correctAnswer: "D",
    explanation: {
      en: "By Section Formula: x = [3(8) + 1(4)] / (3 + 1) = (24 + 4)/4 = 28/4 = 7. y = [3(5) + 1(-3)] / (3 + 1) = (15 - 3)/4 = 12/4 = 3. Point is (7, 3).",
      hi: "विभाजन सूत्र से: x = (24 + 4)/4 = 7, y = (15 - 3)/4 = 3। अभीष्ट बिंदु (7, 3) है।",
      te: "విభజన సూత్రం ద్వారా: x = (24 + 4)/4 = 7, y = (15 - 3)/4 = 3. కావలసిన బిందువు (7, 3).",
      reviewed: false
    },
    hint: {
      en: "Use Section Formula: x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂).",
      hi: "विभाजन सूत्र: x = (m₁x₂ + m₂x₁)/(m₁ + m₂), y = (m₁y₂ + m₂y₁)/(m₁ + m₂) का प्रयोग करें।",
      te: "విభజన సూత్రం x = (m₁x₂ + m₂x₁)/(m₁ + m₂), y = (m₁y₂ + m₂y₁)/(m₁ + m₂) ను ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-05",
    conceptId: "c10-geom-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find a point on the x-axis which is equidistant from (2, -5) and (-2, 9).",
      hi: "x-अक्ष पर वह बिंदु ज्ञात कीजिए जो (2, -5) और (-2, 9) से समदूरस्थ है।",
      te: "(2, -5) మరియు (-2, 9) నుండి సమాన దూరంలో ఉన్న x-అక్షం మీది బిందువును కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "(-7, 0)", hi: "(-7, 0)", te: "(-7, 0)", reviewed: false }
      },
      {
        id: "B",
        text: { en: "(7, 0)", hi: "(7, 0)", te: "(7, 0)", reviewed: false },
        mistakeTag: "placed_point_on_x_axis_instead_of_y_axis"
      },
      {
        id: "C",
        text: { en: "(0, -7)", hi: "(0, -7)", te: "(0, -7)", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "D",
        text: { en: "(-8, 0)", hi: "(-8, 0)", te: "(-8, 0)", reviewed: false },
        mistakeTag: "lost_negative_sign_on_larger_magnitude"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Let the point on x-axis be P(x, 0). PA² = PB² => (x - 2)² + (0 - (-5))² = (x - (-2))² + (0 - 9)² => x² - 4x + 4 + 25 = x² + 4x + 4 + 81 => -4x + 29 = 4x + 85 => -8x = 56 => x = -7. Thus P is (-7, 0).",
      hi: "x-अक्ष पर बिंदु P(x, 0) मानें। (x - 2)² + 25 = (x + 2)² + 81 => -4x + 29 = 4x + 85 => -8x = 56 => x = -7। बिंदु (-7, 0) है।",
      te: "x-అక్షం మీది బిందువు P(x, 0) అనుకుంటే. (x - 2)² + 25 = (x + 2)² + 81 => -8x = 56 => x = -7. ఆ బిందువు (-7, 0).",
      reviewed: false
    },
    hint: {
      en: "Any point on the x-axis has y-coordinate equal to 0.",
      hi: "x-अक्ष पर स्थित किसी भी बिंदु का y-निर्देशांक 0 होता है।",
      te: "x-అక్షం మీది ఏ బిందువుకైనా y-నిరూపకం 0 అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-06",
    conceptId: "c10-geom-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If the points A(6, 1), B(8, 2), C(9, 4) and D(p, 3) are the vertices of a parallelogram taken in order, find the value of p.",
      hi: "यदि बिंदु A(6, 1), B(8, 2), C(9, 4) और D(p, 3) इसी क्रम में एक समांतर चतुर्भुज के शीर्ष हैं, तो p का मान ज्ञात कीजिए।",
      te: "A(6, 1), B(8, 2), C(9, 4) మరియు D(p, 3) లు వరుసగా సమాంతర చతుర్భుజ శీర్షాలు అయితే p విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "6", hi: "6", te: "6", reviewed: false },
        mistakeTag: "subtracted_magnitudes_without_signs"
      },
      {
        id: "B",
        text: { en: "7", hi: "7", te: "7", reviewed: false }
      },
      {
        id: "C",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "D",
        text: { en: "9", hi: "9", te: "9", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Diagonals of a parallelogram bisect each other: Midpoint of AC = Midpoint of BD. x-coordinate: (6 + 9)/2 = (8 + p)/2 => 15 = 8 + p => p = 7.",
      hi: "समांतर चतुर्भुज के विकर्ण परस्पर समद्विभाजित करते हैं: AC का मध्य-बिंदु = BD का मध्य-बिंदु। (6 + 9)/2 = (8 + p)/2 => 15 = 8 + p => p = 7।",
      te: "సమాంతర చతుర్భుజ కర్ణాలు పరస్పరం సమద్విఖండన చేసుకుంటాయి: AC మధ్య బిందువు = BD మధ్య బిందువు. (6 + 9)/2 = (8 + p)/2 => 15 = 8 + p => p = 7.",
      reviewed: false
    },
    hint: {
      en: "Equate the midpoints of the two diagonals AC and BD.",
      hi: "दोनों विकर्णों AC और BD के मध्य-बिंदुओं को बराबर रखें।",
      te: "రెండు కర్ణాలు AC మరియు BD ల మధ్య బిందువులను సమానం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-07",
    conceptId: "c10-geom-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "Find the ratio in which the y-axis divides the line segment joining the points (5, -6) and (-1, -4).",
      hi: "ज्ञात कीजिए कि y-अक्ष बिंदुओं (5, -6) और (-1, -4) को मिलाने वाले रेखाखंड को किस अनुपात में विभाजित करता है।",
      te: "(5, -6) మరియు (-1, -4) బిందువులను కలిపే రేఖాఖండాన్ని y-అక్షం ఏ నిష్పత్తిలో విభజిస్తుంది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1:5", hi: "1:5", te: "1:5", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      },
      {
        id: "B",
        text: { en: "2:3", hi: "2:3", te: "2:3", reviewed: false },
        mistakeTag: "inverted_fraction_divided_product_by_sum"
      },
      {
        id: "C",
        text: { en: "5:1", hi: "5:1", te: "5:1", reviewed: false }
      },
      {
        id: "D",
        text: { en: "4:1", hi: "4:1", te: "4:1", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Any point on the y-axis has x = 0. Let ratio be k:1. x = [k(-1) + 1(5)] / (k + 1) = 0 => -k + 5 = 0 => k = 5. Thus the ratio is 5:1.",
      hi: "y-अक्ष पर स्थित बिंदु का x-निर्देशांक 0 होता है। k:1 अनुपात मानने पर: (-k + 5)/(k + 1) = 0 => k = 5। अतः अनुपात 5:1 है।",
      te: "y-అక్షం మీది బిందువుకి x = 0. నిష్పత్తి k:1 అనుకుంటే: (-k + 5)/(k + 1) = 0 => k = 5. కాబట్టి నిష్పత్తి 5:1.",
      reviewed: false
    },
    hint: {
      en: "Set the x-coordinate of the dividing point equal to 0 and solve for the ratio k:1.",
      hi: "विभाजन बिंदु के x-निर्देशांक को 0 के बराबर रखें और अनुपात k:1 ज्ञात करें।",
      te: "విభజన బిందువు యొక్క x-నిరూపకాన్ని 0 కి సమానం చేసి k:1 నిష్పత్తిని కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-geom-08",
    conceptId: "c10-geom-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    verified: false,
    prompt: {
      en: "If the distance between the points A(x, 2) and B(3, -6) is 10 units, find the positive value of x.",
      hi: "यदि बिंदुओं A(x, 2) और B(3, -6) के बीच की दूरी 10 मात्रक है, तो x का धनात्मक मान ज्ञात कीजिए।",
      te: "A(x, 2) మరియు B(3, -6) బిందువుల మధ్య దూరం 10 యూనిట్లు అయితే, x యొక్క ధనాత్మక విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "9", hi: "9", te: "9", reviewed: false }
      },
      {
        id: "B",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "dropped_negative_root_sign"
      },
      {
        id: "C",
        text: { en: "-3", hi: "-3", te: "-3", reviewed: false },
        mistakeTag: "forgot_to_invert_signs_from_factors_to_roots"
      },
      {
        id: "D",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "d² = (x - 3)² + (2 - (-6))² = 10² => (x - 3)² + 8² = 100 => (x - 3)² + 64 = 100 => (x - 3)² = 36 => x - 3 = ±6. Positive value: x - 3 = 6 => x = 9.",
      hi: "(x - 3)² + 64 = 100 => (x - 3)² = 36 => x - 3 = ±6। धनात्मक मान: x = 3 + 6 = 9।",
      te: "(x - 3)² + 64 = 100 => (x - 3)² = 36 => x - 3 = ±6. ధనాత్మక విలువ: x = 3 + 6 = 9.",
      reviewed: false
    },
    hint: {
      en: "Apply the distance formula, square both sides, and solve the resulting quadratic equation.",
      hi: "दूरी सूत्र लगाएँ, दोनों पक्षों का वर्ग करें और द्विघात समीकरण को हल करें।",
      te: "దూర సూత్రాన్ని ఉపయోగించి, ఇరువైపులా వర్గం చేసి వర్గ సమీకరణాన్ని సాధించండి.",
      reviewed: false
    }
  }
];

// All 38 new questions
const allNewQuestions = [
  ...c10_ch01_new_questions,
  ...c10_ch03_questions,
  ...c10_ch05_questions,
  ...c10_ch06_questions,
  ...c10_ch07_questions
];

// Validate that every single question follows schema and has valid mistake tags
for (const q of allNewQuestions) {
  if (q.verified !== false) throw new Error(`${q.id} must have verified: false`);
  if (!q.options || q.options.length !== 4) throw new Error(`${q.id} must have 4 options`);
  if (!["A", "B", "C", "D"].includes(q.correctAnswer)) throw new Error(`${q.id} invalid correctAnswer`);
  for (const opt of q.options) {
    if (opt.id === q.correctAnswer) {
      if (opt.mistakeTag) throw new Error(`${q.id} correct option must not have mistakeTag`);
    } else {
      if (!opt.mistakeTag || !tagRoots[opt.mistakeTag]) {
        throw new Error(`${q.id} wrong option ${opt.id} has invalid mistakeTag: ${opt.mistakeTag}`);
      }
    }
  }
}

console.log(`[PASS] All 38 draft questions validated against schema and tag-roots.json.`);

// Write to individual chapter question files
// 1. c10-ch01
const c10_ch01_path = path.join(rootDir, "data", "questions", "c10-ch01.json");
const existing_c10_ch01 = JSON.parse(fs.readFileSync(c10_ch01_path, "utf-8"));
const merged_c10_ch01 = [
  ...existing_c10_ch01.filter(q => !c10_ch01_new_questions.some(nq => nq.id === q.id)),
  ...c10_ch01_new_questions
];
fs.writeFileSync(c10_ch01_path, JSON.stringify(merged_c10_ch01, null, 2) + "\n");
console.log(`Updated data/questions/c10-ch01.json: now has ${merged_c10_ch01.length} questions.`);

// 2. c10-ch03
fs.writeFileSync(path.join(rootDir, "data", "questions", "c10-ch03.json"), JSON.stringify(c10_ch03_questions, null, 2) + "\n");
console.log(`Updated data/questions/c10-ch03.json: now has ${c10_ch03_questions.length} questions.`);

// 3. c10-ch05
fs.writeFileSync(path.join(rootDir, "data", "questions", "c10-ch05.json"), JSON.stringify(c10_ch05_questions, null, 2) + "\n");
console.log(`Updated data/questions/c10-ch05.json: now has ${c10_ch05_questions.length} questions.`);

// 4. c10-ch06
fs.writeFileSync(path.join(rootDir, "data", "questions", "c10-ch06.json"), JSON.stringify(c10_ch06_questions, null, 2) + "\n");
console.log(`Updated data/questions/c10-ch06.json: now has ${c10_ch06_questions.length} questions.`);

// 5. c10-ch07
fs.writeFileSync(path.join(rootDir, "data", "questions", "c10-ch07.json"), JSON.stringify(c10_ch07_questions, null, 2) + "\n");
console.log(`Updated data/questions/c10-ch07.json: now has ${c10_ch07_questions.length} questions.`);

// 6. Master data/questions.json
const masterQuestionsPath = path.join(rootDir, "data", "questions.json");
const masterQuestions = JSON.parse(fs.readFileSync(masterQuestionsPath, "utf-8"));
const mergedMaster = [
  ...masterQuestions.filter(q => !allNewQuestions.some(nq => nq.id === q.id)),
  ...allNewQuestions
];
fs.writeFileSync(masterQuestionsPath, JSON.stringify(mergedMaster, null, 2) + "\n");
console.log(`Updated data/questions.json: now has ${mergedMaster.length} questions (+38 draft questions).`);
