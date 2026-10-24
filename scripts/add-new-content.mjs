/**
 * Script to add Questions and Lessons for Chapters 1 and 2 across Classes 6-10.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const questionsPath = path.join(rootDir, "data", "questions.json");
const lessonsPath = path.join(rootDir, "data", "lessons.json");

const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const existingLessons = JSON.parse(fs.readFileSync(lessonsPath, "utf8"));

// Filter out any existing new question IDs to ensure idempotency
const newQuestionIds = new Set([
  "q-c6-pat-01", "q-c6-pat-02",
  "q-c6-geo-01", "q-c6-geo-02",
  "q-c7-num-01", "q-c7-num-02",
  "q-c7-alg-01", "q-c7-alg-02",
  "q-c8-sqr-01", "q-c8-sqr-02",
  "q-c8-exp-01", "q-c8-exp-02",
  "q-c9-coord-01", "q-c9-coord-02",
  "q-c9-poly-01", "q-c9-poly-02",
  "q-c10-real-01", "q-c10-real-02",
  "q-c10-poly-01", "q-c10-poly-02"
]);

const filteredQuestions = existingQuestions.filter(q => !newQuestionIds.has(q.id));

const newQuestions = [
  // Class 6 - Chapter 1: Patterns in Mathematics (c6-pat-01)
  {
    id: "q-c6-pat-01",
    conceptId: "c6-pat-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "What is the next number in the sequence: 4, 7, 10, 13, __?",
      hi: "अनुक्रम 4, 7, 10, 13, __ में अगली संख्या क्या होगी?",
      te: "4, 7, 10, 13, __ శ్రేణిలో తర్వాతి సంఖ్య ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "15", hi: "15", te: "15", reviewed: false },
        mistakeTag: "added_two_instead_of_three"
      },
      {
        id: "B",
        text: { en: "16", hi: "16", te: "16", reviewed: false }
      },
      {
        id: "C",
        text: { en: "17", hi: "17", te: "17", reviewed: false },
        mistakeTag: "added_four_instead_of_three"
      },
      {
        id: "D",
        text: { en: "18", hi: "18", te: "18", reviewed: false },
        mistakeTag: "assumed_multiplication_rule"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Each term in the sequence increases by 3: 4 + 3 = 7, 7 + 3 = 10, 10 + 3 = 13. Therefore, the next term is 13 + 3 = 16.",
      hi: "अनुक्रम का प्रत्येक पद 3 बढ़ता है: 4 + 3 = 7, 7 + 3 = 10, 10 + 3 = 13। अतः अगला पद 13 + 3 = 16 है।",
      te: "శ్రేణిలోని ప్రతి పదం 3 పెరుగుతుంది: 4 + 3 = 7, 7 + 3 = 10, 10 + 3 = 13. కాబట్టి తర్వాతి పదం 13 + 3 = 16.",
      reviewed: false
    },
    hint: {
      en: "Find the difference between consecutive numbers.",
      hi: "लगातार दो संख्याओं के बीच का अंतर ज्ञात करें।",
      te: "వరుస సంఖ్యల మధ్య తేడాను కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-02",
    conceptId: "c6-pat-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "A pattern of connected squares made from matchsticks needs 4 sticks for 1 square, 7 sticks for 2 squares, and 10 sticks for 3 squares. How many sticks are needed for 4 squares?",
      hi: "तीली से बने वर्गों के एक पैटर्न में 1 वर्ग के लिए 4 तीलियाँ, 2 वर्गों के लिए 7 तीलियाँ और 3 वर्गों के लिए 10 तीलियाँ लगती हैं। 4 वर्गों के लिए कितनी तीलियाँ चाहिए?",
      te: "అగ్గిపుల్లలతో చేసిన చతురస్రాల నమూనాలో 1 చతురస్రానికి 4 పుల్లలు, 2 చతురస్రాలకు 7 పుల్లలు, 3 చతురస్రాలకు 10 పుల్లలు అవసరం. 4 చతురస్రాలకు ఎన్ని పుల్లలు కావాలి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "multiplied_four_by_three"
      },
      {
        id: "B",
        text: { en: "13", hi: "13", te: "13", reviewed: false }
      },
      {
        id: "C",
        text: { en: "14", hi: "14", te: "14", reviewed: false },
        mistakeTag: "added_four_to_ten"
      },
      {
        id: "D",
        text: { en: "16", hi: "16", te: "16", reviewed: false },
        mistakeTag: "calculated_four_times_four_without_sharing"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "The number of matchsticks follows the rule 3n + 1, where n is the number of squares. For n = 4, sticks = 3(4) + 1 = 12 + 1 = 13.",
      hi: "तीलियों की संख्या नियम 3n + 1 का पालन करती है जहाँ n वर्गों की संख्या है। n = 4 के लिए, तीलियाँ = 3(4) + 1 = 13।",
      te: "అగ్గిపుల్లల సంఖ్య 3n + 1 నియమాన్ని అనుసరిస్తుంది. n = 4 కోసం, పుల్లలు = 3(4) + 1 = 13.",
      reviewed: false
    },
    hint: {
      en: "Notice that each additional square adds 3 more matchsticks.",
      hi: "ध्यान दें कि प्रत्येक अतिरिक्त वर्ग 3 और तीलियाँ जोड़ता है।",
      te: "ప్రతి అదనపు చతురస్రం 3 పుల్లలను మాత్రమే కలుపుతుందని గమనించండి.",
      reviewed: false
    }
  },

  // Class 6 - Chapter 2: Lines and Angles (c6-geo-01)
  {
    id: "q-c6-geo-01",
    conceptId: "c6-geo-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "An angle measuring 65° is classified as which type of angle?",
      hi: "65° का कोण किस प्रकार का कोण कहलाता है?",
      te: "65° కొలత గల కోణాన్ని ఏ రకమైన కోణంగా వర్గీకరిస్తారు?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "Right angle", hi: "समकोण", te: "లంబ కోణం", reviewed: false },
        mistakeTag: "confused_acute_with_right_angle"
      },
      {
        id: "B",
        text: { en: "Obtuse angle", hi: "अधिक कोण", te: "గురు కోణం", reviewed: false },
        mistakeTag: "confused_acute_with_obtuse_angle"
      },
      {
        id: "C",
        text: { en: "Acute angle", hi: "न्यून कोण", te: "లఘు కోణం", reviewed: false }
      },
      {
        id: "D",
        text: { en: "Straight angle", hi: "ऋजु कोण", te: "సరళ కోణం", reviewed: false },
        mistakeTag: "confused_acute_with_straight_angle"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "An angle whose measure is strictly greater than 0° and less than 90° is an acute angle. Since 65° is less than 90°, it is an acute angle.",
      hi: "वह कोण जिसका मान 0° से अधिक और 90° से कम हो, न्यून कोण कहलाता है। चूंकि 65° < 90°, यह एक न्यून कोण है।",
      te: "0° కంటే ఎక్కువ మరియు 90° కంటే తక్కువ ఉన్న కోణాన్ని లఘు కోణం అంటారు. 65° అనేది 90° కంటే తక్కువ కాబట్టి ఇది లఘు కోణం.",
      reviewed: false
    },
    hint: {
      en: "Is 65° less than or greater than 90°?",
      hi: "क्या 65° 90° से छोटा है या बड़ा?",
      te: "65° అనేది 90° కంటే చిన్నదా లేక పెద్దదా?",
      reviewed: false
    }
  },
  {
    id: "q-c6-geo-02",
    conceptId: "c6-geo-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "If two opposite rays share a common initial point and form a single straight line, what is the measure of the angle formed between them?",
      hi: "यदि दो विपरीत किरणें एक ही उभयनिष्ठ प्रारंभिक बिंदु साझा करती हैं और एक सीधी रेखा बनाती हैं, तो उनके बीच बने कोण का माप क्या है?",
      te: "రెండు వ్యతిరేక కిరణాలు ఒకే ఉమ్మడి ప్రారంభ బిందువును కలిగి ఉండి సరళ రేఖను ఏర్పరిస్తే, వాటి మధ్య కోణం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "90°", hi: "90°", te: "90°", reviewed: false },
        mistakeTag: "assumed_perpendicular_rays"
      },
      {
        id: "B",
        text: { en: "180°", hi: "180°", te: "180°", reviewed: false }
      },
      {
        id: "C",
        text: { en: "360°", hi: "360°", te: "360°", reviewed: false },
        mistakeTag: "confused_straight_angle_with_complete_angle"
      },
      {
        id: "D",
        text: { en: "45°", hi: "45°", te: "45°", reviewed: false },
        mistakeTag: "arbitrary_fraction_of_right_angle"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Two opposite rays forming a straight line create a straight angle, which measures exactly 180°.",
      hi: "एक सीधी रेखा बनाने वाली दो विपरीत किरणें एक ऋजु कोण बनाती हैं, जिसका माप ठीक 180° होता है।",
      te: "సరళ రేఖను ఏర్పరిచే రెండు వ్యతిరేక కిరణాలు సరళ కోణాన్ని ఏర్పరుస్తాయి, దీని కొలత ఖచ్చితంగా 180°.",
      reviewed: false
    },
    hint: {
      en: "A straight line represents half of a full 360° revolution.",
      hi: "एक सीधी रेखा 360° के पूरे घूर्णन का आधा हिस्सा होती है।",
      te: "సరళ రేఖ అనేది 360° పూర్తి భ్రమణంలో సగం.",
      reviewed: false
    }
  },

  // Class 7 - Chapter 1: Large Numbers Around Us (c7-num-01)
  {
    id: "q-c7-num-01",
    conceptId: "c7-num-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "In the Indian number system, 1 crore is equal to how many lakhs?",
      hi: "भारतीय संख्या प्रणाली में 1 करोड़ कितने लाख के बराबर होता है?",
      te: "భారతీయ సంఖ్యామానంలో 1 కోటి ఎన్ని లక్షలకు సమానం?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "10 lakhs", hi: "10 लाख", te: "10 లక్షలు", reviewed: false },
        mistakeTag: "confused_crore_with_million"
      },
      {
        id: "B",
        text: { en: "100 lakhs", hi: "100 लाख", te: "100 లక్షలు", reviewed: false }
      },
      {
        id: "C",
        text: { en: "1,000 lakhs", hi: "1,000 लाख", te: "1,000 లక్షలు", reviewed: false },
        mistakeTag: "added_extra_place_value"
      },
      {
        id: "D",
        text: { en: "50 lakhs", hi: "50 लाख", te: "50 లక్షలు", reviewed: false },
        mistakeTag: "arbitrary_place_estimation"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "1 lakh = 1,00,000 (5 zeros) and 1 crore = 1,00,00,000 (7 zeros). Since 1,00,00,000 ÷ 1,00,000 = 100, 1 crore equals 100 lakhs.",
      hi: "1 लाख = 1,00,000 और 1 करोड़ = 1,00,00,000। चूंकि 1,00,00,000 ÷ 1,00,000 = 100, इसलिए 1 करोड़ = 100 लाख।",
      te: "1 లక్ష = 1,00,000 మరియు 1 కోటి = 1,00,00,000. 1,00,00,000 ÷ 1,00,000 = 100 కాబట్టి, 1 కోటి = 100 లక్షలు.",
      reviewed: false
    },
    hint: {
      en: "Count the number of zeros in 1 lakh and in 1 crore.",
      hi: "1 लाख और 1 करोड़ में शून्यों की संख्या गिनें।",
      te: "1 లక్ష మరియు 1 కోటిలో ఉన్న సున్నాల సంఖ్యను లెక్కించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-num-02",
    conceptId: "c7-num-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Round the number 4,87,620 to the nearest ten thousand.",
      hi: "संख्या 4,87,620 को निकटतम दस हजार तक सन्निकटित कीजिए।",
      te: "4,87,620 సంఖ్యను సమీప పది వేలకు సవరించండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4,80,000", hi: "4,80,000", te: "4,80,000", reviewed: false },
        mistakeTag: "rounded_down_ignoring_digit_seven"
      },
      {
        id: "B",
        text: { en: "4,87,000", hi: "4,87,000", te: "4,87,000", reviewed: false },
        mistakeTag: "rounded_to_nearest_thousand_instead"
      },
      {
        id: "C",
        text: { en: "4,90,000", hi: "4,90,000", te: "4,90,000", reviewed: false }
      },
      {
        id: "D",
        text: { en: "5,00,000", hi: "5,00,000", te: "5,00,000", reviewed: false },
        mistakeTag: "rounded_to_nearest_lakh_instead"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "In 4,87,620, the ten-thousands digit is 8 and the thousands digit is 7. Since 7 >= 5, we round up the ten-thousands place from 8 to 9: 4,90,000.",
      hi: "4,87,620 में दस हजार का अंक 8 है और हजार का अंक 7 है। चूंकि 7 >= 5, हम दस हजार के अंक को बढ़ाकर 9 कर देते हैं: 4,90,000।",
      te: "4,87,620 లో పది వేల స్థానంలో 8, వేల స్థానంలో 7 ఉన్నాయి. 7 >= 5 కాబట్టి, పది వేల స్థానాన్ని 9 గా పెంచుతాము: 4,90,000.",
      reviewed: false
    },
    hint: {
      en: "Look at the digit in the thousands place (7) to decide whether to round up or down.",
      hi: "सन्निकटन का निर्णय लेने के लिए हजार के स्थान का अंक (7) देखें।",
      te: "సవరించడానికి వేల స్థానంలో ఉన్న అంకెను (7) చూడండి.",
      reviewed: false
    }
  },

  // Class 7 - Chapter 2: Arithmetic Expressions (c7-alg-01)
  {
    id: "q-c7-alg-01",
    conceptId: "c7-alg-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate the arithmetic expression using BODMAS: 20 - 3 × 4 + 6",
      hi: "BODMAS नियम का उपयोग करके मान ज्ञात कीजिए: 20 - 3 × 4 + 6",
      te: "BODMAS నియమాన్ని ఉపయోగించి లెక్కించండి: 20 - 3 × 4 + 6",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "74", hi: "74", te: "74", reviewed: false },
        mistakeTag: "performed_subtraction_before_multiplication"
      },
      {
        id: "B",
        text: { en: "14", hi: "14", te: "14", reviewed: false }
      },
      {
        id: "C",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "performed_addition_before_subtraction_erroneously"
      },
      {
        id: "D",
        text: { en: "26", hi: "26", te: "26", reviewed: false },
        mistakeTag: "added_multiplication_product_instead_of_subtracting"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "By BODMAS, perform multiplication first: 3 × 4 = 12. Expression becomes 20 - 12 + 6. Next, evaluate from left to right: (20 - 12) = 8, then 8 + 6 = 14.",
      hi: "BODMAS के अनुसार पहले गुणा करें: 3 × 4 = 12। व्यंजक बनता है 20 - 12 + 6। बाएं से दाएं हल करने पर: 20 - 12 = 8, फिर 8 + 6 = 14।",
      te: "BODMAS ప్రకారం ముందుగా గుణకారం చేయాలి: 3 × 4 = 12. సమాసం 20 - 12 + 6 అవుతుంది. ఎడమ నుండి కుడికి: 20 - 12 = 8, తర్వాత 8 + 6 = 14.",
      reviewed: false
    },
    hint: {
      en: "Multiplication takes precedence over addition and subtraction.",
      hi: "गुणा को जोड़ और घटाव से पहले हल किया जाता है।",
      te: "సంకలనం మరియు వ్యవకలనం కంటే గుణకారాన్ని ముందుగా చేయాలి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-02",
    conceptId: "c7-alg-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate the expression: 45 ÷ [12 - (5 + 4)]",
      hi: "मान ज्ञात कीजिए: 45 ÷ [12 - (5 + 4)]",
      te: "విలువను లెక్కించండి: 45 ÷ [12 - (5 + 4)]",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "15", hi: "15", te: "15", reviewed: false }
      },
      {
        id: "B",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "calculated_bracket_as_nine_instead_of_three"
      },
      {
        id: "C",
        text: { en: "45", hi: "45", te: "45", reviewed: false },
        mistakeTag: "calculated_bracket_as_one"
      },
      {
        id: "D",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "inverted_division_operands"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Evaluate innermost parentheses first: (5 + 4) = 9. Inside square brackets: [12 - 9] = 3. Finally, divide: 45 ÷ 3 = 15.",
      hi: "सबसे पहले छोटे कोष्ठक को हल करें: (5 + 4) = 9। फिर बड़े कोष्ठक में: [12 - 9] = 3। अंत में भाग दें: 45 ÷ 3 = 15।",
      te: "ముందుగా లోపలి బ్రాకెట్ చేయండి: (5 + 4) = 9. తర్వాత చతురస్ర బ్రాకెట్: [12 - 9] = 3. చివరగా భాగహారం: 45 ÷ 3 = 15.",
      reviewed: false
    },
    hint: {
      en: "Solve the innermost parentheses (5 + 4) before subtracting from 12.",
      hi: "12 में से घटाने से पहले सबसे भीतरी कोष्ठक (5 + 4) को हल करें।",
      te: "12 నుండి తీసివేసే ముందు లోపలి బ్రాకెట్ (5 + 4) ను సాధించండి.",
      reviewed: false
    }
  },

  // Class 8 - Chapter 1: A Square and a Cube (c8-sqr-01)
  {
    id: "q-c8-sqr-01",
    conceptId: "c8-sqr-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Which of the following numbers is a perfect square?",
      hi: "निम्नलिखित में से कौन सी संख्या एक पूर्ण वर्ग है?",
      te: "కింది వాటిలో ఏది ఖచ్చిత వర్గ సంఖ్య?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "72", hi: "72", te: "72", reviewed: false },
        mistakeTag: "confused_multiple_with_square"
      },
      {
        id: "B",
        text: { en: "144", hi: "144", te: "144", reviewed: false }
      },
      {
        id: "C",
        text: { en: "200", hi: "200", te: "200", reviewed: false },
        mistakeTag: "confused_double_hundred_with_perfect_square"
      },
      {
        id: "D",
        text: { en: "250", hi: "250", te: "250", reviewed: false },
        mistakeTag: "confused_ending_in_fifty_with_square"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "144 is a perfect square because 12 × 12 = 144. None of 72, 200, or 250 have an integer square root.",
      hi: "144 एक पूर्ण वर्ग है क्योंकि 12 × 12 = 144। 72, 200 या 250 का कोई पूर्णांक वर्गमूल नहीं है।",
      te: "12 × 12 = 144 కాబట్టి 144 ఖచ్చిత వర్గ సంఖ్య. 72, 200, 250 లకు పూర్ణ సంఖ్య వర్గమూలం లేదు.",
      reviewed: false
    },
    hint: {
      en: "Check if there is an integer whose square equals 144 (e.g. 10² = 100, 11² = 121, 12² = ?).",
      hi: "जांचें कि क्या 12 का वर्ग 144 के बराबर है।",
      te: "12 యొక్క వర్గం ఎంత అని పరిశీలించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-sqr-02",
    conceptId: "c8-sqr-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the square root of 576 using prime factorisation.",
      hi: "अभाज्य गुणनखंडन द्वारा 576 का वर्गमूल ज्ञात कीजिए।",
      te: "ప్రధాన కారణాంక పద్ధతిలో 576 యొక్క వర్గమూలాన్ని కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "26", hi: "26", te: "26", reviewed: false },
        mistakeTag: "calculated_square_root_arithmetic_error"
      },
      {
        id: "B",
        text: { en: "24", hi: "24", te: "24", reviewed: false }
      },
      {
        id: "C",
        text: { en: "28", hi: "28", te: "28", reviewed: false },
        mistakeTag: "overestimated_factor_product"
      },
      {
        id: "D",
        text: { en: "34", hi: "34", te: "34", reviewed: false },
        mistakeTag: "guessed_ending_in_four_from_six"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Prime factorisation of 576 = 2 × 2 × 2 × 2 × 2 × 2 × 3 × 3 = 2^6 × 3^2. Grouping into pairs: √(576) = 2^3 × 3 = 8 × 3 = 24.",
      hi: "576 का अभाज्य गुणनखंड = 2^6 × 3^2। युग्म बनाने पर: √(576) = 2^3 × 3 = 8 × 3 = 24।",
      te: "576 ప్రధాన కారణాంకాలు = 2^6 × 3^2. జతలుగా చేస్తే: √(576) = 2^3 × 3 = 8 × 3 = 24.",
      reviewed: false
    },
    hint: {
      en: "Notice that 20² = 400 and 30² = 900. Since 576 ends in 6, the unit digit of the root must be 4 or 6.",
      hi: "चूंकि 576 का अंतिम अंक 6 है, इसके वर्गमूल का इकाई अंक 4 या 6 होना चाहिए।",
      te: "576 చివరి అంకె 6 కాబట్టి, వర్గమూలం ఒకట్ల స్థానంలో 4 లేదా 6 ఉండాలి.",
      reviewed: false
    }
  },

  // Class 8 - Chapter 2: Power Play (c8-exp-01)
  {
    id: "q-c8-exp-01",
    conceptId: "c8-exp-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Simplify using the product law of exponents: 3⁴ × 3³",
      hi: "घातांकों के गुणन नियम का उपयोग करके सरल कीजिए: 3⁴ × 3³",
      te: "ఘాతాంక గుణకార నియమాన్ని ఉపయోగించి సూక్ష్మీకరించండి: 3⁴ × 3³",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3¹²", hi: "3¹²", te: "3¹²", reviewed: false },
        mistakeTag: "multiplied_powers_instead_of_adding"
      },
      {
        id: "B",
        text: { en: "3⁷", hi: "3⁷", te: "3⁷", reviewed: false }
      },
      {
        id: "C",
        text: { en: "9⁷", hi: "9⁷", te: "9⁷", reviewed: false },
        mistakeTag: "multiplied_bases_as_well_as_added_powers"
      },
      {
        id: "D",
        text: { en: "3¹", hi: "3¹", te: "3¹", reviewed: false },
        mistakeTag: "subtracted_powers_instead_of_adding"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "According to the law a^m × a^n = a^(m+n), when multiplying powers with the same base, add their exponents: 3^(4+3) = 3⁷.",
      hi: "नियम a^m × a^n = a^(m+n) के अनुसार समान आधार होने पर घातों को जोड़ते हैं: 3^(4+3) = 3⁷।",
      te: "a^m × a^n = a^(m+n) నియమం ప్రకారం సమాన భూములు ఉన్నప్పుడు ఘాతాలను కూడాలి: 3^(4+3) = 3⁷.",
      reviewed: false
    },
    hint: {
      en: "When bases are identical, do you add or multiply the exponents?",
      hi: "जब आधार समान हों, तो क्या आप घातांकों को जोड़ते हैं या गुणा करते हैं?",
      te: "భూములు సమానంగా ఉన్నప్పుడు ఘాతాంకాలను కూడాలా లేక గుణించాలా?",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-02",
    conceptId: "c8-exp-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate the numeric value of: (2³)² ÷ 2⁴",
      hi: "मान ज्ञात कीजिए: (2³)² ÷ 2⁴",
      te: "సంఖ్యా విలువను లెక్కించండి: (2³)² ÷ 2⁴",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "calculated_power_of_power_as_addition"
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "C",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "subtracted_wrong_exponent"
      },
      {
        id: "D",
        text: { en: "16", hi: "16", te: "16", reviewed: false },
        mistakeTag: "omitted_division_operation"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "First apply power of a power: (2³)² = 2^(3×2) = 2⁶. Next apply quotient rule: 2⁶ ÷ 2⁴ = 2^(6-4) = 2² = 4.",
      hi: "पहले घात की घात नियम लगाएं: (2³)² = 2⁶। फिर भाग नियम: 2⁶ ÷ 2⁴ = 2^(6-4) = 2² = 4।",
      te: "ముందుగా ఘాతం యొక్క ఘాతం: (2³)² = 2⁶. తర్వాత భాగహార నియమం: 2⁶ ÷ 2⁴ = 2^(6-4) = 2² = 4.",
      reviewed: false
    },
    hint: {
      en: "(a^m)^n = a^(mn), so (2³)² = 2⁶.",
      hi: "(a^m)^n = a^(mn), इसलिए (2³)² = 2⁶।",
      te: "(a^m)^n = a^(mn) కావున (2³)² = 2⁶.",
      reviewed: false
    }
  },

  // Class 9 - Chapter 1: Orienting Yourself: The Use of Coordinates (c9-coord-01)
  {
    id: "q-c9-coord-01",
    conceptId: "c9-coord-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "In which quadrant of the Cartesian plane does the point (-4, 5) lie?",
      hi: "कार्तीय तल के किस चतुर्थांश में बिंदु (-4, 5) स्थित है?",
      te: "కార్టీసియన్ తలంలో (-4, 5) బిందువు ఏ పాదంలో ఉంటుంది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "Quadrant I", hi: "चतुर्थांश I", te: "మొదటి పాదం", reviewed: false },
        mistakeTag: "ignored_negative_sign_of_x"
      },
      {
        id: "B",
        text: { en: "Quadrant II", hi: "चतुर्थांश II", te: "రెండవ పాదం", reviewed: false }
      },
      {
        id: "C",
        text: { en: "Quadrant III", hi: "चतुर्थांश III", te: "మూడవ పాదం", reviewed: false },
        mistakeTag: "assumed_both_coordinates_negative"
      },
      {
        id: "D",
        text: { en: "Quadrant IV", hi: "चतुर्थांश IV", te: "నాల్గవ పాదం", reviewed: false },
        mistakeTag: "swapped_x_and_y_signs"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "For point (-4, 5), the x-coordinate is negative (x < 0) and the y-coordinate is positive (y > 0). Points with (- , +) signs lie in Quadrant II.",
      hi: "बिंदु (-4, 5) के लिए x-निर्देशांक ऋणात्मक है और y-निर्देशांक धनात्मक है। (- , +) चिह्न वाले बिंदु द्वितीय चतुर्थांश (Quadrant II) में होते हैं।",
      te: "(-4, 5) బిందువుకు x నిరూపకం ఋణాత్మకం, y నిరూపకం ధనాత్మకం. (- , +) సంకేతాలు గల బిందువులు రెండవ పాదంలో ఉంటాయి.",
      reviewed: false
    },
    hint: {
      en: "Recall sign rules for quadrants: QI (+,+), QII (-,+), QIII (-,-), QIV (+,-).",
      hi: "चतुर्थांशों के चिह्न याद रखें: QI (+,+), QII (-,+), QIII (-,-), QIV (+,-)।",
      te: "పాదాల సంకేతాలను గుర్తుచేసుకోండి: QI (+,+), QII (-,+), QIII (-,-), QIV (+,-).",
      reviewed: false
    }
  },
  {
    id: "q-c9-coord-02",
    conceptId: "c9-coord-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "What are the coordinates of a point that lies on the y-axis at a distance of 6 units below the origin?",
      hi: "मूल बिंदु से 6 इकाई नीचे y-अक्ष पर स्थित बिंदु के निर्देशांक क्या हैं?",
      te: "మూల బిందువుకు దిగువన 6 ప్రమాణాల దూరంలో y-అక్షంపై ఉన్న బిందువు నిరూపకాలు ఏమిటి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "(-6, 0)", hi: "(-6, 0)", te: "(-6, 0)", reviewed: false },
        mistakeTag: "placed_point_on_x_axis_instead_of_y_axis"
      },
      {
        id: "B",
        text: { en: "(0, -6)", hi: "(0, -6)", te: "(0, -6)", reviewed: false }
      },
      {
        id: "C",
        text: { en: "(0, 6)", hi: "(0, 6)", te: "(0, 6)", reviewed: false },
        mistakeTag: "positive_y_instead_of_below_origin"
      },
      {
        id: "D",
        text: { en: "(-6, -6)", hi: "(-6, -6)", te: "(-6, -6)", reviewed: false },
        mistakeTag: "assigned_value_to_both_coordinates"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Any point on the y-axis has x-coordinate = 0. Being 6 units below the origin means y = -6. Thus, the coordinates are (0, -6).",
      hi: "y-अक्ष पर स्थित किसी भी बिंदु का x-निर्देशांक 0 होता है। मूल बिंदु से 6 इकाई नीचे होने का अर्थ y = -6 है। अतः निर्देशांक (0, -6) हैं।",
      te: "y-అక్షంపై ఉన్న ఏ బిందువుకైనా x-నిరూపకం = 0. మూల బిందువుకు 6 ప్రమాణాలు దిగువన ఉండటం వల్ల y = -6. కాబట్టి నిరూపకాలు (0, -6).",
      reviewed: false
    },
    hint: {
      en: "Points on the y-axis always have an x-coordinate of 0.",
      hi: "y-अक्ष पर स्थित बिंदुओं का x-निर्देशांक सदैव 0 होता है।",
      te: "y-అక్షంపై ఉన్న బిందువుల x నిరూపకం ఎల్లప్పుడూ 0 గా ఉంటుంది.",
      reviewed: false
    }
  },

  // Class 9 - Chapter 2: Introduction to Linear Polynomials (c9-poly-01)
  {
    id: "q-c9-poly-01",
    conceptId: "c9-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "What is the coefficient of x in the linear polynomial p(x) = 7 - 5x?",
      hi: "रैखिक बहुपद p(x) = 7 - 5x में x का गुणांक क्या है?",
      te: "రేఖీయ బహుపది p(x) = 7 - 5x లో x యొక్క గుణకం ఏమిటి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "omitted_negative_sign_of_coefficient"
      },
      {
        id: "B",
        text: { en: "-5", hi: "-5", te: "-5", reviewed: false }
      },
      {
        id: "C",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "confused_constant_term_with_coefficient_of_x"
      },
      {
        id: "D",
        text: { en: "-7", hi: "-7", te: "-7", reviewed: false },
        mistakeTag: "negated_constant_term"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "In the expression 7 - 5x, the term containing x is -5x. The coefficient includes the sign preceding the number, which is -5.",
      hi: "व्यंजक 7 - 5x में x वाला पद -5x है। गुणांक में संख्या से पहले का चिह्न भी शामिल होता है, जो कि -5 है।",
      te: "7 - 5x సమాసంలో x ఉన్న పదం -5x. గుణకంలో సంఖ్య ముందున్న సంకేతం కూడా ఉంటుంది, అది -5.",
      reviewed: false
    },
    hint: {
      en: "Remember to include the negative sign directly in front of the 5x term.",
      hi: "5x पद के ठीक आगे लगे ऋण चिह्न को शामिल करना याद रखें।",
      te: "5x పదం ముందున్న ఋణ సంకేతాన్ని చేర్చడం మర్చిపోకండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-02",
    conceptId: "c9-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the zero of the linear polynomial p(x) = 3x - 12.",
      hi: "रैखिक बहुपद p(x) = 3x - 12 का शून्यक ज्ञात कीजिए।",
      te: "రేఖీయ బహుపది p(x) = 3x - 12 యొక్క శూన్యాన్ని కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-4", hi: "-4", te: "-4", reviewed: false },
        mistakeTag: "sign_error_during_transposition"
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "C",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient"
      },
      {
        id: "D",
        text: { en: "36", hi: "36", te: "36", reviewed: false },
        mistakeTag: "multiplied_instead_of_divided"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "To find the zero of p(x), set p(x) = 0: 3x - 12 = 0 => 3x = 12 => x = 12 ÷ 3 = 4.",
      hi: "शून्यक ज्ञात करने के लिए p(x) = 0 रखें: 3x - 12 = 0 => 3x = 12 => x = 4।",
      te: "శూన్యాన్ని కనుగొనడానికి p(x) = 0 చేయండి: 3x - 12 = 0 => 3x = 12 => x = 4.",
      reviewed: false
    },
    hint: {
      en: "Set 3x - 12 = 0 and solve for x.",
      hi: "3x - 12 = 0 समीकरण को x के लिए हल करें।",
      te: "3x - 12 = 0 సమీకరణాన్ని x కోసం సాధించండి.",
      reviewed: false
    }
  },

  // Class 10 - Chapter 1: Real Numbers (c10-real-01)
  {
    id: "q-c10-real-01",
    conceptId: "c10-real-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Express 140 as a product of its prime factors.",
      hi: "140 को अभाज्य गुणनखंडों के गुणनफल के रूप में व्यक्त कीजिए।",
      te: "140 సంఖ్యను ప్రధాన కారణాంకాల లబ్దంగా రాయండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2 × 5 × 14", hi: "2 × 5 × 14", te: "2 × 5 × 14", reviewed: false },
        mistakeTag: "composite_number_fourteen_included"
      },
      {
        id: "B",
        text: { en: "2² × 5 × 7", hi: "2² × 5 × 7", te: "2² × 5 × 7", reviewed: false }
      },
      {
        id: "C",
        text: { en: "2³ × 5 × 7", hi: "2³ × 5 × 7", te: "2³ × 5 × 7", reviewed: false },
        mistakeTag: "extra_factor_of_two"
      },
      {
        id: "D",
        text: { en: "4 × 35", hi: "4 × 35", te: "4 × 35", reviewed: false },
        mistakeTag: "factored_into_composites_not_primes"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Divide 140 by primes: 140 ÷ 2 = 70; 70 ÷ 2 = 35; 35 ÷ 5 = 7; 7 ÷ 7 = 1. Thus, 140 = 2 × 2 × 5 × 7 = 2² × 5 × 7.",
      hi: "140 के अभाज्य गुणनखंड: 140 ÷ 2 = 70; 70 ÷ 2 = 35; 35 ÷ 5 = 7; 7 ÷ 7 = 1। अतः 140 = 2² × 5 × 7।",
      te: "140 ప్రధాన కారణాంకాలు: 140 ÷ 2 = 70; 70 ÷ 2 = 35; 35 ÷ 5 = 7; 7 ÷ 7 = 1. కాబట్టి 140 = 2² × 5 × 7.",
      reviewed: false
    },
    hint: {
      en: "Divide by the smallest prime 2 repeatedly, then by 5 and 7.",
      hi: "सबसे छोटे अभाज्य 2 से बार-बार भाग दें, फिर 5 और 7 से।",
      te: "అతి చిన్న ప్రధాన సంఖ్య 2 తో మొదలుపెట్టి భాగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-real-02",
    conceptId: "c10-real-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Given that HCF(306, 657) = 9, find LCM(306, 657) using the relationship HCF × LCM = a × b.",
      hi: "दिया गया है कि HCF(306, 657) = 9 है, तो HCF × LCM = a × b का उपयोग करके LCM(306, 657) ज्ञात कीजिए।",
      te: "HCF(306, 657) = 9 అని ఇవ్వబడింది, HCF × LCM = a × b సంబంధాన్ని ఉపయోగించి LCM(306, 657) ను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "22338", hi: "22338", te: "22338", reviewed: false }
      },
      {
        id: "B",
        text: { en: "201042", hi: "201042", te: "201042", reviewed: false },
        mistakeTag: "multiplied_numbers_without_dividing_by_hcf"
      },
      {
        id: "C",
        text: { en: "2238", hi: "2238", te: "2238", reviewed: false },
        mistakeTag: "division_decimal_omission_error"
      },
      {
        id: "D",
        text: { en: "73", hi: "73", te: "73", reviewed: false },
        mistakeTag: "divided_single_number_by_hcf"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Using HCF(a, b) × LCM(a, b) = a × b: 9 × LCM = 306 × 657 => LCM = (306 × 657) ÷ 9 = 34 × 657 = 22,338.",
      hi: "संबंध HCF × LCM = a × b द्वारा: 9 × LCM = 306 × 657 => LCM = (306 ÷ 9) × 657 = 34 × 657 = 22,338।",
      te: "HCF × LCM = a × b సూత్రం ప్రకారం: 9 × LCM = 306 × 657 => LCM = 34 × 657 = 22,338.",
      reviewed: false
    },
    hint: {
      en: "LCM = (a × b) / HCF. You can simplify 306 / 9 = 34 first.",
      hi: "LCM = (a × b) / HCF। आप पहले 306 ÷ 9 = 34 कर सकते हैं।",
      te: "LCM = (a × b) / HCF. ముందుగా 306 / 9 = 34 చేయండి.",
      reviewed: false
    }
  },

  // Class 10 - Chapter 2: Polynomials (c10-poly-01)
  {
    id: "q-c10-poly-01",
    conceptId: "c10-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "If a quadratic polynomial p(x) = x² - 5x + 6 has zeroes α and β, find the sum of zeroes (α + β).",
      hi: "यदि द्विघात बहुपद p(x) = x² - 5x + 6 के शून्यक α और β हैं, तो शून्यकों का योग (α + β) ज्ञात कीजिए।",
      te: "వర్గ బహుపది p(x) = x² - 5x + 6 శూన్యాలు α మరియు β అయితే, శూన్యాల మొత్తం (α + β) ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-5", hi: "-5", te: "-5", reviewed: false },
        mistakeTag: "omitted_negative_sign_in_sum_formula"
      },
      {
        id: "B",
        text: { en: "5", hi: "5", te: "5", reviewed: false }
      },
      {
        id: "C",
        text: { en: "6", hi: "6", te: "6", reviewed: false },
        mistakeTag: "swapped_sum_with_product"
      },
      {
        id: "D",
        text: { en: "-6", hi: "-6", te: "-6", reviewed: false },
        mistakeTag: "negated_product_coefficient"
      }
    ],
    correctAnswer: "B",
    explanation: {
      en: "For standard quadratic polynomial ax² + bx + c, the sum of zeroes α + β = -b/a. Here a = 1, b = -5, so α + β = -(-5)/1 = 5.",
      hi: "द्विघात बहुपद ax² + bx + c के लिए शून्यकों का योग α + β = -b/a होता है। यहाँ a = 1, b = -5, अतः α + β = -(-5)/1 = 5।",
      te: "ax² + bx + c బహుపదికి శూన్యాల మొత్తం α + β = -b/a. ఇక్కడ a = 1, b = -5, కాబట్టి α + β = -(-5)/1 = 5.",
      reviewed: false
    },
    hint: {
      en: "The formula for the sum of zeroes is -b/a.",
      hi: "शून्यकों के योग का सूत्र -b/a है।",
      te: "శూన్యాల మొత్తం సూత్రం -b/a.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-02",
    conceptId: "c10-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "How many real zeroes does a polynomial p(x) have if its graph intersects the x-axis at exactly 3 distinct points?",
      hi: "यदि किसी बहुपद p(x) का ग्राफ x-अक्ष को ठीक 3 अलग-अलग बिंदुओं पर काटता है, तो उसके कितने वास्तविक शून्यक होंगे?",
      te: "ఒక బహుపది p(x) గ్రాఫ్ x-అక్షాన్ని ఖచ్చితంగా 3 వేర్వేరు బిందువుల వద్ద ఖండిస్తే, దానికి ఎన్ని వాస్తవ శూన్యాలు ఉంటాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1", hi: "1", te: "1", reviewed: false },
        mistakeTag: "confused_zeroes_with_y_intercept"
      },
      {
        id: "B",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "assumed_standard_quadratic_two_zeroes"
      },
      {
        id: "C",
        text: { en: "3", hi: "3", te: "3", reviewed: false }
      },
      {
        id: "D",
        text: { en: "4", hi: "4", te: "4", reviewed: false },
        mistakeTag: "added_extra_zero"
      }
    ],
    correctAnswer: "C",
    explanation: {
      en: "The number of real zeroes of y = p(x) is equal to the number of points where the graph intersects the x-axis (where y = 0). Since it intersects at 3 points, it has 3 real zeroes.",
      hi: "y = p(x) के वास्तविक शून्यकों की संख्या x-अक्ष के प्रतिच्छेद बिंदुओं की संख्या के बराबर होती है। चूंकि यह 3 बिंदुओं पर काटता है, इसलिए इसके 3 वास्तविक शून्यक हैं।",
      te: "y = p(x) గ్రాఫ్ x-అక్షాన్ని ఖండించే బిందువుల సంఖ్యే దాని వాస్తవ శూన్యాల సంఖ్య. 3 బిందువుల వద్ద ఖండిస్తుంది కాబట్టి 3 శూన్యాలు ఉంటాయి.",
      reviewed: false
    },
    hint: {
      en: "Each intersection with the x-axis corresponds to an x value where p(x) = 0.",
      hi: "x-अक्ष के प्रत्येक प्रतिच्छेद बिंदु पर p(x) का मान 0 होता है।",
      te: "x-అక్షాన్ని ఖండించే ప్రతి బిందువు వద్ద p(x) విలువ 0 అవుతుంది.",
      reviewed: false
    }
  }
];

const combinedQuestions = [...filteredQuestions, ...newQuestions];
fs.writeFileSync(questionsPath, JSON.stringify(combinedQuestions, null, 2), "utf8");
console.log("Successfully wrote questions.json! Total questions:", combinedQuestions.length);
