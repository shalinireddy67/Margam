import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const newQuestions = [
  // =========================================================================
  // CONCEPT 1: c6-pat-01 (Patterns in Sequences and Shapes) - Class 6, c6-ch01
  // =========================================================================
  {
    id: "q-c6-pat-d1-01",
    conceptId: "c6-pat-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "What is the next number in the arithmetic sequence: 5, 10, 15, 20, ___?",
      hi: "अंकगणितीय अनुक्रम 5, 10, 15, 20, ___ में अगली संख्या क्या है?",
      te: "అంకశ్రేణి 5, 10, 15, 20, ___ లో తర్వాతి సంఖ్య ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "25", hi: "25", te: "25", reviewed: false }
      },
      {
        id: "B",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "C",
        text: { en: "30", hi: "30", te: "30", reviewed: false },
        mistakeTag: "multiplied_instead_of_adding_step"
      },
      {
        id: "D",
        text: { en: "21", hi: "21", te: "21", reviewed: false },
        mistakeTag: "added_one_instead_of_sequence_rule"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Each term increases by 5 (rule: add 5). 20 + 5 = 25.",
      hi: "प्रत्येक पद में 5 की वृद्धि होती है (नियम: 5 जोड़ें)। 20 + 5 = 25।",
      te: "ప్రతి పదం 5 పెరుగుతుంది (నియమం: 5 కలపండి). 20 + 5 = 25.",
      reviewed: false
    },
    hint: {
      en: "Find the constant difference between consecutive terms.",
      hi: "लगातार पदों के बीच का अंतर ज्ञात करें।",
      te: "వరుస పదాల మధ్య స్థిరమైన తేడాను కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d1-02",
    conceptId: "c6-pat-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "Observe the decreasing pattern: 40, 34, 28, 22, ___. What is the rule and the next number?",
      hi: "घटते क्रम का निरीक्षण करें: 40, 34, 28, 22, ___। नियम और अगली संख्या क्या है?",
      te: "తగ్గుతున్న నమూనాను పరిశీలించండి: 40, 34, 28, 22, ___। నియమం మరియు తర్వాతి సంఖ్య ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: {
          en: "Subtract 6; next number is 16",
          hi: "6 घटाएं; अगली संख्या 16 है",
          te: "6 తీసివేయండి; తర్వాతి సంఖ్య 16",
          reviewed: false
        }
      },
      {
        id: "B",
        text: {
          en: "Subtract 4; next number is 18",
          hi: "4 घटाएं; अगली संख्या 18 है",
          te: "4 తీసివేయండి; తర్వాతి సంఖ్య 18",
          reviewed: false
        },
        mistakeTag: "incorrect_step_difference_estimation"
      },
      {
        id: "C",
        text: {
          en: "Subtract 6; next number is 14",
          hi: "6 घटाएं; अगली संख्या 14 है",
          te: "6 తీసివేయండి; తర్వాతి సంఖ్య 14",
          reviewed: false
        },
        mistakeTag: "subtraction_borrowing_slip_pattern"
      },
      {
        id: "D",
        text: {
          en: "Add 6; next number is 28",
          hi: "6 जोड़ें; अगली संख्या 28 है",
          te: "6 కలపండి; తర్వాతి సంఖ్య 28",
          reviewed: false
        },
        mistakeTag: "reversed_direction_added_instead_of_subtracted"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Each consecutive term decreases by 6 (40 - 6 = 34, 34 - 6 = 28, 28 - 6 = 22). The next term is 22 - 6 = 16.",
      hi: "प्रत्येक पद 6 कम होता जाता है। अतः अगला पद 22 - 6 = 16 है।",
      te: "ప్రతి పదం 6 తగ్గుతుంది. కాబట్టి తర్వాతి పదం 22 - 6 = 16.",
      reviewed: false
    },
    hint: {
      en: "Subtract 34 from 40 to find the step size.",
      hi: "चरण आकार ज्ञात करने के लिए 40 में से 34 घटाएं।",
      te: "తేడా తెలుసుకోవడానికి 40 నుండి 34 తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d2-01",
    conceptId: "c6-pat-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "In a tile pattern, Stage 1 uses 4 tiles, Stage 2 uses 7 tiles, and Stage 3 uses 10 tiles. The algebraic rule for Stage n is 3n + 1. How many tiles are needed for Stage 6?",
      hi: "टाइल पैटर्न में, चरण 1 में 4 टाइलें, चरण 2 में 7 टाइलें और चरण 3 में 10 टाइलें लगती हैं। चरण n के लिए बीजगणितीय नियम 3n + 1 है। चरण 6 के लिए कितनी टाइलों की आवश्यकता होगी?",
      te: "ఒక టైల్స్ నమూనాలో, దశ 1 లో 4 టైల్స్, దశ 2 లో 7 టైల్స్ మరియు దశ 3 లో 10 టైల్స్ ఉన్నాయి. దశ n కొరకు సూత్రం 3n + 1. దశ 6 కొరకు ఎన్ని టైల్స్ అవసరం?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "19", hi: "19", te: "19", reviewed: false }
      },
      {
        id: "B",
        text: { en: "18", hi: "18", te: "18", reviewed: false },
        mistakeTag: "forgot_constant_term_in_pattern_rule"
      },
      {
        id: "C",
        text: { en: "21", hi: "21", te: "21", reviewed: false },
        mistakeTag: "multiplied_after_adding_rule_slip"
      },
      {
        id: "D",
        text: { en: "25", hi: "25", te: "25", reviewed: false },
        mistakeTag: "added_step_multiple_times_unscaled"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Substitute n = 6 into the rule 3n + 1: 3(6) + 1 = 18 + 1 = 19 tiles.",
      hi: "नियम 3n + 1 में n = 6 रखें: 3(6) + 1 = 18 + 1 = 19 टाइलें।",
      te: "3n + 1 సూత్రంలో n = 6 ప్రతిక్షేపించండి: 3(6) + 1 = 18 + 1 = 19 టైల్స్.",
      reviewed: false
    },
    hint: {
      en: "Multiply 6 by 3 first, then add 1.",
      hi: "पहले 6 को 3 से गुणा करें, फिर 1 जोड़ें।",
      te: "ముందుగా 6 ను 3 తో గుణించి, తర్వాత 1 కలపండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d2-02",
    conceptId: "c6-pat-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Look at the square numbers sequence: 1, 4, 9, 16, 25, ___. What is the 6th square number?",
      hi: "वर्ग संख्याओं के अनुक्रम को देखें: 1, 4, 9, 16, 25, ___। छठी वर्ग संख्या क्या है?",
      te: "వర్గ సంఖ్యల శ్రేణిని పరిశీలించండి: 1, 4, 9, 16, 25, ___। 6వ వర్గ సంఖ్య ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "36", hi: "36", te: "36", reviewed: false }
      },
      {
        id: "B",
        text: { en: "30", hi: "30", te: "30", reviewed: false },
        mistakeTag: "added_previous_difference_constant"
      },
      {
        id: "C",
        text: { en: "34", hi: "34", te: "34", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "D",
        text: { en: "49", hi: "49", te: "49", reviewed: false },
        mistakeTag: "skipped_one_term_in_sequence"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The terms are squares of consecutive integers: 1², 2², 3², 4², 5², 6². 6² = 6 × 6 = 36.",
      hi: "पद प्राकृतिक संख्याओं के वर्ग हैं: 1², 2², 3², 4², 5², 6² = 36।",
      te: "పదాలు పూర్ణాంకాల వర్గాలు: 1², 2², 3², 4², 5², 6² = 36.",
      reviewed: false
    },
    hint: {
      en: "Multiply the position number 6 by itself.",
      hi: "स्थान संख्या 6 को स्वयं से गुणा करें।",
      te: "6 వ స్థాన సంఖ్యను దానితోనే గుణించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d3-01",
    conceptId: "c6-pat-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "A sequence of hexagonal table arrangements follows the rule T(n) = 4n + 2, where n is the number of tables and T(n) is the total seated people. If 38 people must be seated, how many tables n must be joined together in a line?",
      hi: "षट्कोणीय मेजों की व्यवस्था का नियम T(n) = 4n + 2 है, जहाँ n मेजों की संख्या है और T(n) बैठने वाले लोगों की कुल संख्या है। यदि 38 लोगों को बैठाना है, तो एक पंक्ति में कितनी मेजें n जोड़ी जानी चाहिए?",
      te: "షడ్భుజి ఆకారపు బల్లల అమరిక సూత్రం T(n) = 4n + 2, ఇక్కడ n బల్లల సంఖ్య మరియు T(n) కూర్చునే వ్యక్తుల సంఖ్య. 38 మంది కూర్చోవడానికి ఎన్ని బల్లలు n అవసరం?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "9", hi: "9", te: "9", reviewed: false }
      },
      {
        id: "B",
        text: { en: "10", hi: "10", te: "10", reviewed: false },
        mistakeTag: "forgot_to_subtract_constant_term_before_dividing"
      },
      {
        id: "C",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "D",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "divided_by_two_instead_of_coefficient"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Set up the equation 4n + 2 = 38. Subtract 2 from both sides: 4n = 36. Divide by 4: n = 9 tables.",
      hi: "समीकरण 4n + 2 = 38 हल करें। दोनों पक्षों से 2 घटाएं: 4n = 36। 4 से भाग दें: n = 9 मेजें।",
      te: "4n + 2 = 38 సమీకరణాన్ని సాధించండి. 4n = 36 => n = 9 బల్లలు.",
      reviewed: false
    },
    hint: {
      en: "First subtract the 2 end seats from 38, then divide by 4.",
      hi: "पहले 38 में से 2 घटाएं, फिर 4 से भाग दें।",
      te: "ముందుగా 38 నుండి 2 తీసివేసి, తర్వాత 4 తో భాగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d3-02",
    conceptId: "c6-pat-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Consider the triangular numbers pattern: T₁ = 1, T₂ = 3, T₃ = 6, T₄ = 10. The formula for the nth triangular number is n(n + 1)/2. Find the 8th triangular number (T₈).",
      hi: "त्रिभुजीय संख्याओं के पैटर्न पर विचार करें: T₁ = 1, T₂ = 3, T₃ = 6, T₄ = 10। n वीं त्रिभुजीय संख्या का सूत्र n(n + 1)/2 है। 8वीं त्रिभुजीय संख्या (T₈) ज्ञात कीजिए।",
      te: "త్రిభుజాకార సంఖ్యల నమూనాను పరిశీలించండి: T₁ = 1, T₂ = 3, T₃ = 6, T₄ = 10. n వ త్రిభుజాకార సంఖ్య సూత్రం n(n + 1)/2. 8వ త్రిభుజాకార సంఖ్య (T₈) ను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "36", hi: "36", te: "36", reviewed: false }
      },
      {
        id: "B",
        text: { en: "72", hi: "72", te: "72", reviewed: false },
        mistakeTag: "forgot_division_by_two_in_triangular_formula"
      },
      {
        id: "C",
        text: { en: "32", hi: "32", te: "32", reviewed: false },
        mistakeTag: "used_n_squared_divided_by_two"
      },
      {
        id: "D",
        text: { en: "45", hi: "45", te: "45", reviewed: false },
        mistakeTag: "used_n_plus_one_instead_of_n"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Using T(n) = n(n + 1)/2 with n = 8: T₈ = 8(8 + 1)/2 = 8(9)/2 = 72/2 = 36.",
      hi: "सूत्र T(n) = n(n + 1)/2 में n = 8 रखें: T₈ = 8(9)/2 = 72/2 = 36।",
      te: "T(n) = n(n + 1)/2 సూత్రంలో n = 8 ఉంచగా: T₈ = 8(9)/2 = 72/2 = 36.",
      reviewed: false
    },
    hint: {
      en: "Compute 8 times 9, then divide the product by 2.",
      hi: "8 को 9 से गुणा करें, फिर परिणाम को 2 से भाग दें।",
      te: "8 ను 9 తో గుణించి, లబ్దాన్ని 2 తో భాగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-pat-d3-03",
    conceptId: "c6-pat-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "The first three terms of a geometric block pattern are 2, 6, 18. Each term is obtained by multiplying the previous term by 3. What is the 5th term of this pattern?",
      hi: "गुणोत्तर ब्लॉक पैटर्न के पहले तीन पद 2, 6, 18 हैं। प्रत्येक पद पिछले पद को 3 से गुणा करके प्राप्त होता है। इस पैटर्न का 5वां पद क्या है?",
      te: "ఒక గుణశ్రేణి నమూనాలో మొదటి మూడు పదాలు 2, 6, 18. ప్రతి పదం ముందున్న పదాన్ని 3 తో గుణించగా వస్తుంది. ఈ నమూనాలో 5వ పదం ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "162", hi: "162", te: "162", reviewed: false }
      },
      {
        id: "B",
        text: { en: "54", hi: "54", te: "54", reviewed: false },
        mistakeTag: "stopped_one_step_early_in_sequence"
      },
      {
        id: "C",
        text: { en: "486", hi: "486", te: "486", reviewed: false },
        mistakeTag: "computed_one_step_too_far"
      },
      {
        id: "D",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "switched_to_addition_instead_of_multiplication"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Term 1 = 2; Term 2 = 6; Term 3 = 18; Term 4 = 18 × 3 = 54; Term 5 = 54 × 3 = 162.",
      hi: "पद 1 = 2, पद 2 = 6, पद 3 = 18, पद 4 = 54, पद 5 = 54 × 3 = 162।",
      te: "1వ పదం = 2, 2వ పదం = 6, 3వ పదం = 18, 4వ పదం = 54, 5వ పదం = 54 × 3 = 162.",
      reviewed: false
    },
    hint: {
      en: "Multiply 18 by 3 to get the 4th term, then multiply again by 3 for the 5th term.",
      hi: "चौथा पद पाने के लिए 18 को 3 से गुणा करें, फिर 5वें पद के लिए पुनः 3 से गुणा करें।",
      te: "4వ పదం కోసం 18 ను 3 తో గుణించి, 5వ పదం కోసం మళ్లీ 3 తో గుణించండి.",
      reviewed: false
    }
  },

  // =========================================================================
  // CONCEPT 2: c7-alg-01 (Arithmetic Expressions & BODMAS) - Class 7, c7-ch02
  // =========================================================================
  {
    id: "q-c7-alg-d1-01",
    conceptId: "c7-alg-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate the arithmetic expression following order of operations: 18 + 12 ÷ 3.",
      hi: "संक्रियाओं के क्रम (BODMAS) का पालन करते हुए मान ज्ञात करें: 18 + 12 ÷ 3।",
      te: "BODMAS నియమాన్ని అనుసరించి విలువను లెక్కించండి: 18 + 12 ÷ 3.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "22", hi: "22", te: "22", reviewed: false }
      },
      {
        id: "B",
        text: { en: "10", hi: "10", te: "10", reviewed: false },
        mistakeTag: "added_before_dividing_ignored_bodmas"
      },
      {
        id: "C",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "D",
        text: { en: "14", hi: "14", te: "14", reviewed: false },
        mistakeTag: "subtracted_instead_of_adding"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Division takes precedence over addition: 12 ÷ 3 = 4. Then 18 + 4 = 22.",
      hi: "भाग की संक्रिया जोड़ से पहले की जाती है: 12 ÷ 3 = 4। फिर 18 + 4 = 22।",
      te: "కూడిక కంటే ముందే భాగహారం చేయాలి: 12 ÷ 3 = 4. తర్వాత 18 + 4 = 22.",
      reviewed: false
    },
    hint: {
      en: "BODMAS rule: perform division before addition.",
      hi: "BODMAS नियम: जोड़ से पहले भाग करें।",
      te: "BODMAS నియమం: కూడిక కంటే ముందు భాగహారం చేయాలి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d1-02",
    conceptId: "c7-alg-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "Find the value of: 40 - 5 × 6.",
      hi: "मान ज्ञात कीजिए: 40 - 5 × 6।",
      te: "విలువను కనుగొనండి: 40 - 5 × 6.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "10", hi: "10", te: "10", reviewed: false }
      },
      {
        id: "B",
        text: { en: "210", hi: "210", te: "210", reviewed: false },
        mistakeTag: "subtracted_before_multiplying_ignored_bodmas"
      },
      {
        id: "C",
        text: { en: "15", hi: "15", te: "15", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "D",
        text: { en: "-10", hi: "-10", te: "-10", reviewed: false },
        mistakeTag: "sign_reversal_in_subtraction"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Multiplication comes before subtraction: 5 × 6 = 30. Then 40 - 30 = 10.",
      hi: "घटाव से पहले गुणा किया जाता है: 5 × 6 = 30। फिर 40 - 30 = 10।",
      te: "తీసివేత కంటే ముందే గుణకారం చేయాలి: 5 × 6 = 30. తర్వాత 40 - 30 = 10.",
      reviewed: false
    },
    hint: {
      en: "Calculate 5 times 6 first.",
      hi: "पहले 5 गुणा 6 करें।",
      te: "ముందుగా 5 ను 6 తో గుణించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d2-01",
    conceptId: "c7-alg-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate the expression with nested brackets: 25 - [10 + (8 - 3 × 2)].",
      hi: "कोष्ठकों वाले व्यंजक का मान ज्ञात करें: 25 - [10 + (8 - 3 × 2)]।",
      te: "బ్రాకెట్లతో కూడిన సమాసాన్ని సాధించండి: 25 - [10 + (8 - 3 × 2)].",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "13", hi: "13", te: "13", reviewed: false }
      },
      {
        id: "B",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "performed_subtraction_before_multiplication_inside_brackets"
      },
      {
        id: "C",
        text: { en: "17", hi: "17", te: "17", reviewed: false },
        mistakeTag: "sign_distribution_error_on_bracket_removal"
      },
      {
        id: "D",
        text: { en: "21", hi: "21", te: "21", reviewed: false },
        mistakeTag: "ignored_nested_bracket_order"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Innermost bracket first: 3 × 2 = 6, then 8 - 6 = 2. Square bracket: 10 + 2 = 12. Finally: 25 - 12 = 13.",
      hi: "सबसे भीतरी कोष्ठक पहले: 3 × 2 = 6, फिर 8 - 6 = 2। बड़ा कोष्ठक: 10 + 2 = 12। अंत में: 25 - 12 = 13।",
      te: "లోపలి బ్రాకెట్ మొదట: 3 × 2 = 6, తర్వాత 8 - 6 = 2. చతురస్ర బ్రాకెట్: 10 + 2 = 12. చివరగా: 25 - 12 = 13.",
      reviewed: false
    },
    hint: {
      en: "Work from the innermost parentheses outward.",
      hi: "सबसे भीतरी कोष्ठक से शुरू करके बाहर की ओर हल करें।",
      te: "అన్నింటికంటే లోపలి బ్రాకెట్ నుండి బయటకు సాధించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d2-02",
    conceptId: "c7-alg-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate: 48 ÷ (12 - 4) × 3.",
      hi: "मान ज्ञात कीजिए: 48 ÷ (12 - 4) × 3।",
      te: "సాధించండి: 48 ÷ (12 - 4) × 3.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "18", hi: "18", te: "18", reviewed: false }
      },
      {
        id: "B",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "multiplied_before_dividing_from_left_to_right"
      },
      {
        id: "C",
        text: { en: "12", hi: "12", te: "12", reviewed: false },
        mistakeTag: "divided_first_number_by_all_in_brackets"
      },
      {
        id: "D",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Brackets first: 12 - 4 = 8. Then evaluate division and multiplication from left to right: 48 ÷ 8 = 6; 6 × 3 = 18.",
      hi: "पहले कोष्ठक: 12 - 4 = 8। फिर बाएं से दाएं भाग और गुणा: 48 ÷ 8 = 6; 6 × 3 = 18।",
      te: "మొదట బ్రాకెట్: 12 - 4 = 8. తర్వాత ఎడమ నుండి కుడికి: 48 ÷ 8 = 6; 6 × 3 = 18.",
      reviewed: false
    },
    hint: {
      en: "After resolving the brackets, perform division and multiplication from left to right.",
      hi: "कोष्ठक हल करने के बाद, बाएं से दाएं क्रम में भाग और गुणा करें।",
      te: "బ్రాకెట్ సాధించిన తర్వాత, ఎడమ నుండి కుడికి భాగహారం మరియు గుణకారం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d3-01",
    conceptId: "c7-alg-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Simplify the complex nested expression: 50 - 3 × {14 - 2 × (9 - 6)}.",
      hi: "जटिल कोष्ठक व्यंजक को सरल करें: 50 - 3 × {14 - 2 × (9 - 6)}।",
      te: "సంక్లిష్ట బ్రాకెట్లతో కూడిన సమాసాన్ని సూక్ష్మీకరించండి: 50 - 3 × {14 - 2 × (9 - 6)}.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "26", hi: "26", te: "26", reviewed: false }
      },
      {
        id: "B",
        text: { en: "32", hi: "32", te: "32", reviewed: false },
        mistakeTag: "performed_subtraction_before_multiplication_outside_braces"
      },
      {
        id: "C",
        text: { en: "14", hi: "14", te: "14", reviewed: false },
        mistakeTag: "distributed_wrong_sign_in_curly_braces"
      },
      {
        id: "D",
        text: { en: "44", hi: "44", te: "44", reviewed: false },
        mistakeTag: "forgot_outer_multiplication_factor"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "1) Parentheses: 9 - 6 = 3. 2) Braces: 14 - 2(3) = 14 - 6 = 8. 3) Multiply: 3 × 8 = 24. 4) Subtract: 50 - 24 = 26.",
      hi: "1) छोटा कोष्ठक: 9 - 6 = 3। 2) मँझला कोष्ठक: 14 - 2(3) = 14 - 6 = 8। 3) गुणा: 3 × 8 = 24। 4) घटाव: 50 - 24 = 26।",
      te: "1) లోపలి బ్రాకెట్: 9 - 6 = 3. 2) మధ్య బ్రాకెట్: 14 - 6 = 8. 3) గుణకారం: 3 × 8 = 24. 4) తీసివేత: 50 - 24 = 26.",
      reviewed: false
    },
    hint: {
      en: "Evaluate (9 - 6) first, multiply by 2, subtract from 14, multiply by 3, and subtract from 50.",
      hi: "पहले (9 - 6) का मान निकालें, 2 से गुणा करें, 14 में से घटाएं, 3 से गुणा करें, और 50 में से घटाएं।",
      te: "ముందు (9 - 6) విలువ కనుగొని, 2 తో గుణించి, 14 నుండి తీసివేసి, 3 తో గుణించి, 50 నుండి తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d3-02",
    conceptId: "c7-alg-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate: 100 - [40 + {20 - (12 - 4 × 2)}].",
      hi: "मान ज्ञात कीजिए: 100 - [40 + {20 - (12 - 4 × 2)}]।",
      te: "విలువను కనుగొనండి: 100 - [40 + {20 - (12 - 4 × 2)}].",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "44", hi: "44", te: "44", reviewed: false }
      },
      {
        id: "B",
        text: { en: "24", hi: "24", te: "24", reviewed: false },
        mistakeTag: "performed_subtraction_before_multiplication_inside_brackets"
      },
      {
        id: "C",
        text: { en: "56", hi: "56", te: "56", reviewed: false },
        mistakeTag: "forgot_to_subtract_from_first_term"
      },
      {
        id: "D",
        text: { en: "48", hi: "48", te: "48", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "1) 4 × 2 = 8. 2) 12 - 8 = 4. 3) 20 - 4 = 16. 4) 40 + 16 = 56. 5) 100 - 56 = 44.",
      hi: "1) 4 × 2 = 8। 2) 12 - 8 = 4। 3) 20 - 4 = 16। 4) 40 + 16 = 56। 5) 100 - 56 = 44।",
      te: "1) 4 × 2 = 8. 2) 12 - 8 = 4. 3) 20 - 4 = 16. 4) 40 + 16 = 56. 5) 100 - 56 = 44.",
      reviewed: false
    },
    hint: {
      en: "Resolve round brackets (12 - 8 = 4), then curly braces, then square brackets.",
      hi: "पहले छोटे कोष्ठक (12 - 8 = 4), फिर मँझले, फिर बड़े कोष्ठक को हल करें।",
      te: "ముందుగా గుండ్రని బ్రాకెట్లు (12 - 8 = 4), తర్వాత మధ్య బ్రాకెట్లు, తర్వాత పెద్ద బ్రాకెట్లు సాధించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-alg-d3-03",
    conceptId: "c7-alg-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Find the value of: [36 ÷ (-4)] + [(-5) × (-3)] - [18 ÷ (-6)].",
      hi: "मान ज्ञात कीजिए: [36 ÷ (-4)] + [(-5) × (-3)] - [18 ÷ (-6)]।",
      te: "విలువను లెక్కించండి: [36 ÷ (-4)] + [(-5) × (-3)] - [18 ÷ (-6)].",
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
        mistakeTag: "sign_error_negative_times_negative_became_negative"
      },
      {
        id: "C",
        text: { en: "-3", hi: "-3", te: "-3", reviewed: false },
        mistakeTag: "forgot_double_negative_becomes_positive_in_subtraction"
      },
      {
        id: "D",
        text: { en: "15", hi: "15", te: "15", reviewed: false },
        mistakeTag: "dropped_negative_sign_in_division"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "1) 36 ÷ (-4) = -9. 2) (-5) × (-3) = 15. 3) 18 ÷ (-6) = -3. Expression becomes: -9 + 15 - (-3) = -9 + 15 + 3 = 9.",
      hi: "1) 36 ÷ (-4) = -9। 2) (-5) × (-3) = 15। 3) 18 ÷ (-6) = -3। व्यंजक: -9 + 15 - (-3) = -9 + 15 + 3 = 9।",
      te: "1) 36 ÷ (-4) = -9. 2) (-5) × (-3) = 15. 3) 18 ÷ (-6) = -3. మొత్తం: -9 + 15 - (-3) = -9 + 15 + 3 = 9.",
      reviewed: false
    },
    hint: {
      en: "Remember that subtracting a negative number is equivalent to adding: -(-3) = +3.",
      hi: "याद रखें कि ऋणात्मक संख्या को घटाना जोड़ने के समान है: -(-3) = +3।",
      te: "రుణ సంఖ్యను తీసివేయడం అంటే ధన సంఖ్యను కలపడమే: -(-3) = +3.",
      reviewed: false
    }
  },

  // =========================================================================
  // CONCEPT 3: c8-exp-01 (Exponents, Powers, Laws) - Class 8, c8-ch02
  // =========================================================================
  {
    id: "q-c8-exp-d1-01",
    conceptId: "c8-exp-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "Simplify using the product law of exponents: 5² × 5⁵.",
      hi: "घातांकों के गुणन नियम का उपयोग करके सरल करें: 5² × 5⁵।",
      te: "ఘాతాంకాల గుణకార నియమాన్ని ఉపయోగించి సూక్ష్మీకరించండి: 5² × 5⁵.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "5⁷", hi: "5⁷", te: "5⁷", reviewed: false }
      },
      {
        id: "B",
        text: { en: "5¹⁰", hi: "5¹⁰", te: "5¹⁰", reviewed: false },
        mistakeTag: "multiplied_exponents_instead_of_adding_in_product_rule"
      },
      {
        id: "C",
        text: { en: "25⁷", hi: "25⁷", te: "25⁷", reviewed: false },
        mistakeTag: "multiplied_bases_as_well_as_powers"
      },
      {
        id: "D",
        text: { en: "5³", hi: "5³", te: "5³", reviewed: false },
        mistakeTag: "subtracted_exponents_instead_of_adding"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "By the product rule aᵐ × aⁿ = aᵐ⁺ⁿ, keeping base 5: 5²⁺⁵ = 5⁷.",
      hi: "गुणन नियम aᵐ × aⁿ = aᵐ⁺ⁿ के अनुसार आधार 5 रहेगा: 5²⁺⁵ = 5⁷।",
      te: "గుణకార నియమం aᵐ × aⁿ = aᵐ⁺ⁿ ప్రకారం భూమి 5 ఉంటుంది: 5²⁺⁵ = 5⁷.",
      reviewed: false
    },
    hint: {
      en: "When bases are identical, add the powers.",
      hi: "जब आधार समान हों, तो घातों को जोड़ें।",
      te: "భూములు సమానంగా ఉన్నప్పుడు ఘాతాంకాలను కలపండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d1-02",
    conceptId: "c8-exp-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "What is the value of any non-zero number raised to the zero power, such as 7⁰?",
      hi: "किसी भी गैर-शून्य संख्या की घात 0 होने पर उसका मान क्या होता है, जैसे 7⁰?",
      te: "సున్న కాకుండా ఏదైనా సంఖ్య యొక్క ఘాతం 0 అయితే దాని విలువ ఎంత, ఉదాహరణకు 7⁰?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1", hi: "1", te: "1", reviewed: false }
      },
      {
        id: "B",
        text: { en: "0", hi: "0", te: "0", reviewed: false },
        mistakeTag: "zero_power_confused_with_zero_multiplication"
      },
      {
        id: "C",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "zero_power_confused_with_first_power"
      },
      {
        id: "D",
        text: { en: "undefined", hi: "अपरिभाषित", te: "నిర్వచించబడలేదు", reviewed: false },
        mistakeTag: "confused_zero_power_with_division_by_zero"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "By the zero exponent rule, a⁰ = 1 for any non-zero real number a. 7⁰ = 1.",
      hi: "शून्य घातांक नियम के अनुसार, किसी भी अशून्य संख्या a के लिए a⁰ = 1 होता है। अतः 7⁰ = 1।",
      te: "శూన్య ఘాతాంక నియమం ప్రకారం, శూన్యేతర సంఖ్య a కి a⁰ = 1. కాబట్టి 7⁰ = 1.",
      reviewed: false
    },
    hint: {
      en: "Consider 7¹ ÷ 7¹ = 7¹⁻¹ = 7⁰, which equals 7 ÷ 7.",
      hi: "विचार करें 7¹ ÷ 7¹ = 7¹⁻¹ = 7⁰, जो 7 ÷ 7 = 1 के बराबर है।",
      te: "7¹ ÷ 7¹ = 7¹⁻¹ = 7⁰ ను గమనించండి, ఇది 7 ÷ 7 = 1 కి సమానం.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d2-01",
    conceptId: "c8-exp-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Simplify the power of a power expression: (4³)².",
      hi: "घात की घात वाले व्यंजक को सरल करें: (4³)²।",
      te: "ఘాతం యొక్క ఘాతాన్ని సూక్ష్మీకరించండి: (4³)².",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4⁶", hi: "4⁶", te: "4⁶", reviewed: false }
      },
      {
        id: "B",
        text: { en: "4⁵", hi: "4⁵", te: "4⁵", reviewed: false },
        mistakeTag: "added_exponents_instead_of_multiplying_in_power_of_power"
      },
      {
        id: "C",
        text: { en: "4⁹", hi: "4⁹", te: "4⁹", reviewed: false },
        mistakeTag: "raised_exponent_to_power_instead_of_multiplying"
      },
      {
        id: "D",
        text: { en: "16³", hi: "16³", te: "16³", reviewed: false },
        mistakeTag: "applied_outer_power_to_base_only"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "By the power of a power rule (aᵐ)ⁿ = aᵐˣⁿ: (4³)² = 4³ˣ² = 4⁶.",
      hi: "नियम (aᵐ)ⁿ = aᵐˣⁿ के अनुसार: (4³)² = 4³ˣ² = 4⁶।",
      te: "(aᵐ)ⁿ = aᵐˣⁿ నియమం ప్రకారం: (4³)² = 4³ˣ² = 4⁶.",
      reviewed: false
    },
    hint: {
      en: "Multiply the inner power 3 by the outer power 2.",
      hi: "भीतरी घात 3 को बाहरी घात 2 से गुणा करें।",
      te: "లోపలి ఘాతం 3 ను వెలుపలి ఘాతం 2 తో గుణించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d2-02",
    conceptId: "c8-exp-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate the negative exponent expression: 2⁻⁴.",
      hi: "ऋणात्मक घातांक व्यंजक का मान ज्ञात करें: 2⁻⁴।",
      te: "రుణ ఘాతాంకం యొక్క విలువను కనుగొనండి: 2⁻⁴.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1/16", hi: "1/16", te: "1/16", reviewed: false }
      },
      {
        id: "B",
        text: { en: "-8", hi: "-8", te: "-8", reviewed: false },
        mistakeTag: "multiplied_base_by_negative_exponent"
      },
      {
        id: "C",
        text: { en: "-16", hi: "-16", te: "-16", reviewed: false },
        mistakeTag: "confused_negative_exponent_with_negative_result"
      },
      {
        id: "D",
        text: { en: "1/8", hi: "1/8", te: "1/8", reviewed: false },
        mistakeTag: "miscalculated_power_of_two"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "A negative exponent represents the reciprocal: a⁻ⁿ = 1/(aⁿ). Thus 2⁻⁴ = 1/(2⁴) = 1/16.",
      hi: "ऋणात्मक घातांक व्युत्क्रम को दर्शाता है: a⁻ⁿ = 1/(aⁿ)। अतः 2⁻⁴ = 1/(2⁴) = 1/16।",
      te: "రుణ ఘాతాంకం విలోమాన్ని సూచిస్తుంది: a⁻ⁿ = 1/(aⁿ). కాబట్టి 2⁻⁴ = 1/(2⁴) = 1/16.",
      reviewed: false
    },
    hint: {
      en: "Rewrite with a positive exponent in the denominator.",
      hi: "हर में धनात्मक घात के साथ फिर से लिखें।",
      te: "హారంలో ధన ఘాతాంకంగా రాయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d3-01",
    conceptId: "c8-exp-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Simplify the expression and express in prime powers: (3⁻⁵ × 10⁻⁵ × 125) / (5⁻⁷ × 6⁻⁵).",
      hi: "व्यंजक को सरल कीजिए और अभाज्य घातों में व्यक्त कीजिए: (3⁻⁵ × 10⁻⁵ × 125) / (5⁻⁷ × 6⁻⁵)।",
      te: "సమాసాన్ని సూక్ష్మీకరించి ప్రధాన కారణాంకాల ఘాతాలుగా రాయండి: (3⁻⁵ × 10⁻⁵ × 125) / (5⁻⁷ × 6⁻⁵).",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "5⁵", hi: "5⁵", te: "5⁵", reviewed: false }
      },
      {
        id: "B",
        text: { en: "5³", hi: "5³", te: "5³", reviewed: false },
        mistakeTag: "cancelled_factors_with_incorrect_powers"
      },
      {
        id: "C",
        text: { en: "1", hi: "1", te: "1", reviewed: false },
        mistakeTag: "assumed_all_terms_cancel_completely"
      },
      {
        id: "D",
        text: { en: "5⁻²", hi: "5⁻²", te: "5⁻²", reviewed: false },
        mistakeTag: "subtracted_exponents_in_wrong_order_in_quotient"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Decompose into prime bases: 10⁻⁵ = 2⁻⁵ × 5⁻⁵, 125 = 5³, 6⁻⁵ = 2⁻⁵ × 3⁻⁵. Numerator = 3⁻⁵ × 2⁻⁵ × 5⁻²; Denominator = 5⁻⁷ × 2⁻⁵ × 3⁻⁵. Cancelling 2⁻⁵ and 3⁻⁵ yields 5⁻² / 5⁻⁷ = 5⁻²⁻⁽⁻⁷⁾ = 5⁵.",
      hi: "अभाज्य आधारों में तोड़ें: 10 = 2 × 5, 125 = 5³, 6 = 2 × 3। अंश और हर में समान पद कटने के बाद 5⁻² / 5⁻⁷ = 5⁵ बचता है।",
      te: "ప్రధాన కారణాంకాలుగా విడదీయండి: 10 = 2 × 5, 125 = 5³, 6 = 2 × 3. సవరించగా 5⁻² / 5⁻⁷ = 5⁵ వస్తుంది.",
      reviewed: false
    },
    hint: {
      en: "Factor 10, 6, and 125 into powers of 2, 3, and 5.",
      hi: "10, 6 और 125 को 2, 3 और 5 की अभाज्य घातों में बदलें।",
      te: "10, 6 మరియు 125 లను 2, 3, 5 ల ప్రధాన ఘాతాలుగా రాయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d3-02",
    conceptId: "c8-exp-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Find the value of x in the exponential equation: (2/3)³ × (2/3)⁵ = (2/3)²ˣ.",
      hi: "घातांकीय समीकरण में x का मान ज्ञात कीजिए: (2/3)³ × (2/3)⁵ = (2/3)²ˣ।",
      te: "ఘాతాంక సమీకరణంలో x విలువను కనుగొనండి: (2/3)³ × (2/3)⁵ = (2/3)²ˣ.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "B",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "forgot_to_divide_by_variable_coefficient"
      },
      {
        id: "C",
        text: { en: "7.5", hi: "7.5", te: "7.5", reviewed: false },
        mistakeTag: "multiplied_exponents_instead_of_adding_in_product_rule"
      },
      {
        id: "D",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "divided_powers_in_exponential_equation"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Left side: (2/3)³⁺⁵ = (2/3)⁸. Equating exponents since bases are equal: 2x = 8 => x = 4.",
      hi: "बायां पक्ष: (2/3)⁸। आधार समान होने के कारण घातों की तुलना करें: 2x = 8 => x = 4।",
      te: "ఎడమవైపు: (2/3)³⁺⁵ = (2/3)⁸. భూములు సమానం కాబట్టి ఘాతాలను పోల్చగా: 2x = 8 => x = 4.",
      reviewed: false
    },
    hint: {
      en: "Add exponents on the left, then set equal to 2x.",
      hi: "बाईं ओर की घातों को जोड़ें, फिर 2x के बराबर रखें।",
      te: "ఎడమవైపు ఘాతాలను కూడి, 2x కు సమానం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-exp-d3-03",
    conceptId: "c8-exp-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Evaluate the numeric value: [(1/3)⁻² - (1/2)⁻³] ÷ (1/4)⁻².",
      hi: "संख्यात्मक मान ज्ञात कीजिए: [(1/3)⁻² - (1/2)⁻³] ÷ (1/4)⁻²।",
      te: "విలువను లెక్కించండి: [(1/3)⁻² - (1/2)⁻³] ÷ (1/4)⁻².",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1/16", hi: "1/16", te: "1/16", reviewed: false }
      },
      {
        id: "B",
        text: { en: "1", hi: "1", te: "1", reviewed: false },
        mistakeTag: "confused_division_by_power_of_fraction"
      },
      {
        id: "C",
        text: { en: "-1/16", hi: "-1/16", te: "-1/16", reviewed: false },
        mistakeTag: "sign_error_in_subtraction_of_inverted_powers"
      },
      {
        id: "D",
        text: { en: "16", hi: "16", te: "16", reviewed: false },
        mistakeTag: "multiplied_instead_of_dividing_by_divisor"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "(1/3)⁻² = 3² = 9. (1/2)⁻³ = 2³ = 8. Inside brackets: 9 - 8 = 1. Divisor: (1/4)⁻² = 4² = 16. Result = 1 ÷ 16 = 1/16.",
      hi: "(1/3)⁻² = 9, (1/2)⁻³ = 8। कोष्ठक के अंदर: 9 - 8 = 1। भाजक: (1/4)⁻² = 16। परिणाम: 1 ÷ 16 = 1/16।",
      te: "(1/3)⁻² = 9, (1/2)⁻³ = 8. బ్రాకెట్ లోపల: 9 - 8 = 1. భాజకం: (1/4)⁻² = 16. ఫలితం: 1 ÷ 16 = 1/16.",
      reviewed: false
    },
    hint: {
      en: "Invert each fraction when changing negative powers to positive.",
      hi: "ऋणात्मक घात को धनात्मक में बदलते समय प्रत्येक भिन्न को उलट दें।",
      te: "రుణ ఘాతాలను ధన ఘాతాలుగా మార్చేటప్పుడు భిన్నాలను తిరగరాయండి.",
      reviewed: false
    }
  },

  // =========================================================================
  // CONCEPT 4: c9-poly-01 (Terms, Degree, Zeroes) - Class 9, c9-ch02
  // =========================================================================
  {
    id: "q-c9-poly-d1-01",
    conceptId: "c9-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "What is the degree of the polynomial P(x) = 7x³ - 4x² + 9x - 12?",
      hi: "बहुपद P(x) = 7x³ - 4x² + 9x - 12 की घात (degree) क्या है?",
      te: "బహుపది P(x) = 7x³ - 4x² + 9x - 12 యొక్క పరిమాణం (degree) ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3", hi: "3", te: "3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "4", hi: "4", te: "4", reviewed: false },
        mistakeTag: "counted_number_of_terms_instead_of_highest_power"
      },
      {
        id: "C",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "confused_leading_coefficient_with_degree"
      },
      {
        id: "D",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "selected_middle_exponent_as_degree"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The degree of a polynomial is the highest exponent of the variable. Here, the highest power of x is 3.",
      hi: "बहुपद की घात चर की उच्चतम घात होती है। यहाँ x की उच्चतम घात 3 है।",
      te: "బహుపది పరిమాణం అంటే చరరాశి యొక్క గరిష్ట ఘాతాంకం. ఇక్కడ x గరిష్ట ఘాతం 3.",
      reviewed: false
    },
    hint: {
      en: "Look for the greatest exponent among all terms.",
      hi: "सभी पदों में सबसे बड़ा घातांक देखें।",
      te: "అన్ని పదాలలో గరిష్ట ఘాతాంకాన్ని చూడండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d1-02",
    conceptId: "c9-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "Find the zero of the linear polynomial P(x) = 2x - 8.",
      hi: "रैखिक बहुपद P(x) = 2x - 8 का शून्यक ज्ञात कीजिए।",
      te: "రేఖీయ బహుపది P(x) = 2x - 8 యొక్క శూన్యాన్ని కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "4", hi: "4", te: "4", reviewed: false }
      },
      {
        id: "B",
        text: { en: "-4", hi: "-4", te: "-4", reviewed: false },
        mistakeTag: "forgot_to_invert_sign_when_transposing_constant"
      },
      {
        id: "C",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient_of_x"
      },
      {
        id: "D",
        text: { en: "-8", hi: "-8", te: "-8", reviewed: false },
        mistakeTag: "treated_constant_term_directly_as_zero"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "To find the zero, solve P(x) = 0: 2x - 8 = 0 => 2x = 8 => x = 4.",
      hi: "शून्यक ज्ञात करने के लिए P(x) = 0 रखें: 2x - 8 = 0 => 2x = 8 => x = 4।",
      te: "శూన్యం కోసం P(x) = 0 చేయండి: 2x - 8 = 0 => 2x = 8 => x = 4.",
      reviewed: false
    },
    hint: {
      en: "Set the expression equal to zero and isolate x.",
      hi: "व्यंजक को शून्य के बराबर रखें और x का मान ज्ञात करें।",
      te: "సమాసాన్ని సున్నాకి సమానం చేసి x విలువను సాధించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d2-01",
    conceptId: "c9-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "Find the zero of the linear polynomial Q(x) = 3x + 7.",
      hi: "रैखिक बहुपद Q(x) = 3x + 7 का शून्यक ज्ञात कीजिए।",
      te: "రేఖీయ బహుపది Q(x) = 3x + 7 యొక్క శూన్యాన్ని కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-7/3", hi: "-7/3", te: "-7/3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "7/3", hi: "7/3", te: "7/3", reviewed: false },
        mistakeTag: "forgot_to_invert_sign_when_transposing_constant"
      },
      {
        id: "C",
        text: { en: "-3/7", hi: "-3/7", te: "-3/7", reviewed: false },
        mistakeTag: "inverted_fraction_divided_coefficient_by_constant"
      },
      {
        id: "D",
        text: { en: "-7", hi: "-7", te: "-7", reviewed: false },
        mistakeTag: "forgot_to_divide_by_coefficient_of_x"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Set Q(x) = 0: 3x + 7 = 0 => 3x = -7 => x = -7/3.",
      hi: "Q(x) = 0 रखें: 3x + 7 = 0 => 3x = -7 => x = -7/3।",
      te: "Q(x) = 0 సమీకరించండి: 3x + 7 = 0 => 3x = -7 => x = -7/3.",
      reviewed: false
    },
    hint: {
      en: "For any linear polynomial ax + b, the zero is given by x = -b/a.",
      hi: "किसी भी रैखिक बहुपद ax + b के लिए शून्यक x = -b/a होता है।",
      te: "ఏదైనా రేఖీయ బహుపది ax + b కి శూన్యం x = -b/a అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d2-02",
    conceptId: "c9-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "What is the coefficient of x in the expanded polynomial P(x) = (2x - 3)(x + 5)?",
      hi: "विस्तारित बहुपद P(x) = (2x - 3)(x + 5) में x का गुणांक क्या है?",
      te: "విస్తరించిన బహుపది P(x) = (2x - 3)(x + 5) లో x యొక్క గుణకం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "7", hi: "7", te: "7", reviewed: false }
      },
      {
        id: "B",
        text: { en: "10", hi: "10", te: "10", reviewed: false },
        mistakeTag: "missed_inner_product_term_in_expansion"
      },
      {
        id: "C",
        text: { en: "-3", hi: "-3", te: "-3", reviewed: false },
        mistakeTag: "missed_outer_product_term_in_expansion"
      },
      {
        id: "D",
        text: { en: "-15", hi: "-15", te: "-15", reviewed: false },
        mistakeTag: "confused_constant_term_with_linear_coefficient"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Expanding: (2x)(x) + (2x)(5) + (-3)(x) + (-3)(5) = 2x² + 10x - 3x - 15 = 2x² + 7x - 15. The coefficient of x is 7.",
      hi: "विस्तार करने पर: 2x² + 10x - 3x - 15 = 2x² + 7x - 15। x का गुणांक 7 है।",
      te: "విస్తరించగా: 2x² + 10x - 3x - 15 = 2x² + 7x - 15. x గుణకం 7.",
      reviewed: false
    },
    hint: {
      en: "Combine the middle terms: 10x and -3x.",
      hi: "मध्य पदों 10x और -3x को जोड़ें।",
      te: "మధ్య పదాలైన 10x మరియు -3x లను కూడండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d3-01",
    conceptId: "c9-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "If x = 2 is a zero of the polynomial P(x) = 2x³ - 3x² + kx - 6, find the value of the constant k.",
      hi: "यदि x = 2 बहुपद P(x) = 2x³ - 3x² + kx - 6 का एक शून्यक है, तो अचर k का मान ज्ञात कीजिए।",
      te: "x = 2 అనేది బహుపది P(x) = 2x³ - 3x² + kx - 6 యొక్క శూన్యమైతే, స్థిరరాశి k విలువను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "1", hi: "1", te: "1", reviewed: false }
      },
      {
        id: "B",
        text: { en: "-1", hi: "-1", te: "-1", reviewed: false },
        mistakeTag: "sign_error_in_solving_linear_equation"
      },
      {
        id: "C",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      },
      {
        id: "D",
        text: { en: "-2", hi: "-2", te: "-2", reviewed: false },
        mistakeTag: "subtracted_instead_of_adding_in_polynomial_evaluation"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Since x = 2 is a zero, P(2) = 0: 2(2)³ - 3(2)² + k(2) - 6 = 2(8) - 3(4) + 2k - 6 = 16 - 12 + 2k - 6 = 2k - 2 = 0 => 2k = 2 => k = 1.",
      hi: "क्योंकि x = 2 एक शून्यक है, P(2) = 0: 16 - 12 + 2k - 6 = 0 => 2k - 2 = 0 => k = 1।",
      te: "x = 2 శూన్యం కాబట్టి, P(2) = 0: 16 - 12 + 2k - 6 = 0 => 2k - 2 = 0 => k = 1.",
      reviewed: false
    },
    hint: {
      en: "Substitute x = 2 into P(x) and set the entire equation equal to zero.",
      hi: "P(x) में x = 2 रखें और पूरे समीकरण को शून्य के बराबर रखें।",
      te: "P(x) లో x = 2 ప్రతిక్షేపించి సమీకరణాన్ని సున్నాకి సమానం చేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d3-02",
    conceptId: "c9-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "By the Remainder Theorem, what is the remainder when P(x) = x⁴ - 3x² + 4x - 5 is divided by (x + 2)?",
      hi: "शेषफल प्रमेय द्वारा, जब P(x) = x⁴ - 3x² + 4x - 5 को (x + 2) से भाग दिया जाता है, तो शेषफल क्या होगा?",
      te: "శేష సిద్ధాంతం ప్రకారం, P(x) = x⁴ - 3x² + 4x - 5 ను (x + 2) చే భాగించినప్పుడు వచ్చే శేషం ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-9", hi: "-9", te: "-9", reviewed: false }
      },
      {
        id: "B",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "evaluated_at_positive_root_instead_of_negative"
      },
      {
        id: "C",
        text: { en: "15", hi: "15", te: "15", reviewed: false },
        mistakeTag: "squared_negative_number_as_negative_slip"
      },
      {
        id: "D",
        text: { en: "-1", hi: "-1", te: "-1", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Remainder = P(-2) = (-2)⁴ - 3(-2)² + 4(-2) - 5 = 16 - 3(4) - 8 - 5 = 16 - 12 - 8 - 5 = -9.",
      hi: "शेषफल = P(-2) = 16 - 12 - 8 - 5 = -9।",
      te: "శేషం = P(-2) = 16 - 12 - 8 - 5 = -9.",
      reviewed: false
    },
    hint: {
      en: "For divisor (x + 2), evaluate P(x) at x = -2.",
      hi: "भाजक (x + 2) के लिए, x = -2 पर P(x) का मान ज्ञात करें।",
      te: "భాజకం (x + 2) కోసం, x = -2 వద్ద P(x) విలువను లెక్కించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-poly-d3-03",
    conceptId: "c9-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "Find all zeroes of the factored polynomial P(x) = (3x - 2)(2x + 5).",
      hi: "गुणनखंडित बहुपद P(x) = (3x - 2)(2x + 5) के सभी शून्यक ज्ञात कीजिए।",
      te: "కారణాంకాలుగా మార్చబడిన బహుపది P(x) = (3x - 2)(2x + 5) యొక్క అన్ని శూన్యాలను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: {
          en: "x = 2/3, x = -5/2",
          hi: "x = 2/3, x = -5/2",
          te: "x = 2/3, x = -5/2",
          reviewed: false
        }
      },
      {
        id: "B",
        text: {
          en: "x = -2/3, x = 5/2",
          hi: "x = -2/3, x = 5/2",
          te: "x = -2/3, x = 5/2",
          reviewed: false
        },
        mistakeTag: "forgot_to_invert_signs_from_factors_to_roots"
      },
      {
        id: "C",
        text: {
          en: "x = 3/2, x = -2/5",
          hi: "x = 3/2, x = -2/5",
          te: "x = 3/2, x = -2/5",
          reviewed: false
        },
        mistakeTag: "inverted_fraction_divided_coefficient_by_constant"
      },
      {
        id: "D",
        text: {
          en: "x = 2, x = -5",
          hi: "x = 2, x = -5",
          te: "x = 2, x = -5",
          reviewed: false
        },
        mistakeTag: "forgot_to_divide_by_coefficients_of_x"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Set each factor to zero: 3x - 2 = 0 => x = 2/3; 2x + 5 = 0 => x = -5/2.",
      hi: "प्रत्येक गुणनखंड को शून्य के बराबर रखें: 3x - 2 = 0 => x = 2/3; 2x + 5 = 0 => x = -5/2।",
      te: "ప్రతి కారణాంకాన్ని సున్నాకి సమానం చేయండి: 3x - 2 = 0 => x = 2/3; 2x + 5 = 0 => x = -5/2.",
      reviewed: false
    },
    hint: {
      en: "Solve 3x - 2 = 0 and 2x + 5 = 0 separately.",
      hi: "3x - 2 = 0 और 2x + 5 = 0 को अलग-अलग हल करें।",
      te: "3x - 2 = 0 మరియు 2x + 5 = 0 లను వేర్వేరుగా సాధించండి.",
      reviewed: false
    }
  },

  // =========================================================================
  // CONCEPT 5: c10-poly-01 (Zeroes & Coefficients) - Class 10, c10-ch02
  // =========================================================================
  {
    id: "q-c10-poly-d1-01",
    conceptId: "c10-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "How many zeroes does a polynomial have if its graph y = P(x) intersects the x-axis at exactly 3 distinct points?",
      hi: "यदि किसी बहुपद का ग्राफ y = P(x) x-अक्ष को ठीक 3 अलग-अलग बिंदुओं पर काटता है, तो उसके कितने शून्यक होंगे?",
      te: "ఒక బహుపది గ్రాఫ్ y = P(x) x-అక్షాన్ని ఖచ్చితంగా 3 వేర్వేరు బిందువుల వద్ద ఖండిస్తే, దానికి ఎన్ని శూన్యాలు ఉంటాయి?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3", hi: "3", te: "3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "2", hi: "2", te: "2", reviewed: false },
        mistakeTag: "confused_extrema_turning_points_with_zeroes"
      },
      {
        id: "C",
        text: { en: "4", hi: "4", te: "4", reviewed: false },
        mistakeTag: "added_y_axis_intersection_to_zero_count"
      },
      {
        id: "D",
        text: { en: "1", hi: "1", te: "1", reviewed: false },
        mistakeTag: "confused_degree_with_single_axis_point"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The number of real zeroes of y = P(x) equals the number of points where the graph intersects the x-axis (where y = 0). Here, 3 intersections mean exactly 3 zeroes.",
      hi: "y = P(x) के वास्तविक शून्यकों की संख्या ग्राफ द्वारा x-अक्ष को काटे जाने वाले बिंदुओं की संख्या के बराबर होती है। यहाँ 3 प्रतिच्छेद बिंदु हैं, अतः 3 शून्यक होंगे।",
      te: "y = P(x) యొక్క వాస్తవ శూన్యాల సంఖ్య ఆ గ్రాఫ్ x-అక్షాన్ని ఖండించే బిందువుల సంఖ్యకు సమానం. ఇక్కడ 3 బిందువులు కాబట్టి 3 శూన్యాలు ఉంటాయి.",
      reviewed: false
    },
    hint: {
      en: "Zeroes occur where y = 0, which corresponds to the x-axis.",
      hi: "शून्यक वहाँ होते हैं जहाँ y = 0 होता है, जो x-अक्ष पर स्थित है।",
      te: "y = 0 అయ్యే బిందువులే శూన్యాలు, ఇవి x-అక్షంపై ఉంటాయి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d1-02",
    conceptId: "c10-poly-01",
    difficulty: 1,
    type: "multiple_choice",
    prompt: {
      en: "For the quadratic polynomial P(x) = 3x² - 7x + 2, what is the sum of its zeroes (α + β)?",
      hi: "द्विघात बहुपद P(x) = 3x² - 7x + 2 के लिए इसके शून्यकों का योग (α + β) क्या है?",
      te: "వర్గ బహుపది P(x) = 3x² - 7x + 2 యొక్క శూన్యాల మొత్తం (α + β) ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "7/3", hi: "7/3", te: "7/3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "-7/3", hi: "-7/3", te: "-7/3", reviewed: false },
        mistakeTag: "forgot_negative_sign_in_sum_of_roots_formula"
      },
      {
        id: "C",
        text: { en: "2/3", hi: "2/3", te: "2/3", reviewed: false },
        mistakeTag: "confused_sum_of_roots_with_product_of_roots"
      },
      {
        id: "D",
        text: { en: "7", hi: "7", te: "7", reviewed: false },
        mistakeTag: "forgot_to_divide_by_leading_coefficient_a"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "For ax² + bx + c, sum of zeroes α + β = -b/a. Here a = 3, b = -7, so α + β = -(-7)/3 = 7/3.",
      hi: "द्विघात बहुपद ax² + bx + c के लिए, शून्यकों का योग α + β = -b/a होता है। यहाँ a = 3, b = -7, अतः α + β = -(-7)/3 = 7/3।",
      te: "ax² + bx + c లో శూన్యాల మొత్తం α + β = -b/a. ఇక్కడ a = 3, b = -7 కాబట్టి α + β = -(-7)/3 = 7/3.",
      reviewed: false
    },
    hint: {
      en: "Use the formula α + β = -b/a.",
      hi: "सूत्र α + β = -b/a का उपयोग करें।",
      te: "α + β = -b/a సూత్రాన్ని ఉపయోగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d2-01",
    conceptId: "c10-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "For the quadratic polynomial P(x) = 4x² + 8x - 12, find the product of its zeroes (αβ).",
      hi: "द्विघात बहुपद P(x) = 4x² + 8x - 12 के लिए इसके शून्यकों का गुणनफल (αβ) ज्ञात कीजिए।",
      te: "వర్గ బహుపది P(x) = 4x² + 8x - 12 యొక్క శూన్యాల లబ్దం (αβ) ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "-3", hi: "-3", te: "-3", reviewed: false }
      },
      {
        id: "B",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "dropped_negative_sign_of_constant_term"
      },
      {
        id: "C",
        text: { en: "-2", hi: "-2", te: "-2", reviewed: false },
        mistakeTag: "calculated_sum_of_roots_instead_of_product"
      },
      {
        id: "D",
        text: { en: "-12", hi: "-12", te: "-12", reviewed: false },
        mistakeTag: "forgot_to_divide_by_leading_coefficient_a"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The product of zeroes is given by αβ = c/a. Here c = -12 and a = 4, so αβ = -12/4 = -3.",
      hi: "शून्यकों का गुणनफल αβ = c/a होता है। यहाँ c = -12 और a = 4 है, अतः αβ = -12/4 = -3।",
      te: "శూన్యాల లబ్దం αβ = c/a. ఇక్కడ c = -12 మరియు a = 4 కాబట్టి αβ = -12/4 = -3.",
      reviewed: false
    },
    hint: {
      en: "Divide the constant term c by the leading coefficient a.",
      hi: "अचर पद c को मुख्य गुणांक a से भाग दें।",
      te: "స్థిరపదం c ని మొదటి గుణకం a తో భాగించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d2-02",
    conceptId: "c10-poly-01",
    difficulty: 2,
    type: "multiple_choice",
    prompt: {
      en: "A quadratic polynomial whose zeroes are α = 3 and β = -4 is given by x² - (α + β)x + αβ. What is this polynomial?",
      hi: "एक द्विघात बहुपद जिसके शून्यक α = 3 और β = -4 हैं, x² - (α + β)x + αβ द्वारा दिया जाता है। यह बहुपद क्या है?",
      te: "శూన్యాలు α = 3 మరియు β = -4 కలిగిన వర్గ బహుపది రూపం x² - (α + β)x + αβ. ఆ బహుపది ఏది?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: {
          en: "x² + x - 12",
          hi: "x² + x - 12",
          te: "x² + x - 12",
          reviewed: false
        }
      },
      {
        id: "B",
        text: {
          en: "x² - x - 12",
          hi: "x² - x - 12",
          te: "x² - x - 12",
          reviewed: false
        },
        mistakeTag: "forgot_to_invert_sign_of_sum_in_quadratic_construction"
      },
      {
        id: "C",
        text: {
          en: "x² + x + 12",
          hi: "x² + x + 12",
          te: "x² + x + 12",
          reviewed: false
        },
        mistakeTag: "sign_error_negative_times_positive_became_positive"
      },
      {
        id: "D",
        text: {
          en: "x² - 7x - 12",
          hi: "x² - 7x - 12",
          te: "x² - 7x - 12",
          reviewed: false
        },
        mistakeTag: "subtracted_roots_instead_of_adding_for_sum"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Sum of zeroes: α + β = 3 + (-4) = -1. Product: αβ = 3 × (-4) = -12. Form: x² - (-1)x + (-12) = x² + x - 12.",
      hi: "शून्यकों का योग: α + β = 3 + (-4) = -1। गुणनफल: αβ = -12। बहुपद: x² - (-1)x + (-12) = x² + x - 12।",
      te: "శూన్యాల మొత్తం: α + β = -1. లబ్దం: αβ = -12. బహుపది: x² - (-1)x + (-12) = x² + x - 12.",
      reviewed: false
    },
    hint: {
      en: "Carefully substitute -(α + β) when the sum is negative.",
      hi: "जब योग ऋणात्मक हो तो -(α + β) रखते समय चिह्न का ध्यान रखें।",
      te: "మొత్తం రుణాత్మకమైనప్పుడు -(α + β) లో గుర్తులను జాగ్రత్తగా ప్రతిక్షేపించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d3-01",
    conceptId: "c10-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "If one zero of the quadratic polynomial P(x) = 2x² - 3x + k is reciprocal to the other, what is the value of the constant k?",
      hi: "यदि द्विघात बहुपद P(x) = 2x² - 3x + k का एक शून्यक दूसरे का व्युत्क्रम है, तो अचर k का मान क्या है?",
      te: "వర్గ బహుపది P(x) = 2x² - 3x + k యొక్క ఒక శూన్యం మరొక శూన్యానికి వ్యుత్క్రమమైతే, స్థిరరాశి k విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "2", hi: "2", te: "2", reviewed: false }
      },
      {
        id: "B",
        text: { en: "-2", hi: "-2", te: "-2", reviewed: false },
        mistakeTag: "sign_error_in_reciprocal_product_condition"
      },
      {
        id: "C",
        text: { en: "1/2", hi: "1/2", te: "1/2", reviewed: false },
        mistakeTag: "inverted_relationship_k_equals_one_over_a"
      },
      {
        id: "D",
        text: { en: "3", hi: "3", te: "3", reviewed: false },
        mistakeTag: "confused_product_of_roots_with_sum_of_roots"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Let the zeroes be α and 1/α. Their product is α × (1/α) = 1. By the coefficient relation, product = c/a = k/2. Therefore, k/2 = 1 => k = 2.",
      hi: "माना शून्यक α और 1/α हैं। उनका गुणनफल = α × (1/α) = 1 = c/a = k/2। अतः k = 2।",
      te: "శూన్యాలు α మరియు 1/α అనుకుంటే, వాటి లబ్దం = α × (1/α) = 1 = c/a = k/2 => k = 2.",
      reviewed: false
    },
    hint: {
      en: "The product of reciprocal numbers is always 1.",
      hi: "परस्पर व्युत्क्रम संख्याओं का गुणनफल हमेशा 1 होता है।",
      te: "వ్యుత్క్రమ సంఖ్యల లబ్దం ఎల్లప్పుడూ 1 అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d3-02",
    conceptId: "c10-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "If α and β are the zeroes of the polynomial P(x) = x² - 6x + 8, find the value of (1/α + 1/β).",
      hi: "यदि α और β बहुपद P(x) = x² - 6x + 8 के शून्यक हैं, तो (1/α + 1/β) का मान ज्ञात कीजिए।",
      te: "α మరియు β లు బహుపది P(x) = x² - 6x + 8 యొక్క శూన్యాలైతే, (1/α + 1/β) విలువను కనుగొనండి.",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "3/4", hi: "3/4", te: "3/4", reviewed: false }
      },
      {
        id: "B",
        text: { en: "4/3", hi: "4/3", te: "4/3", reviewed: false },
        mistakeTag: "inverted_fraction_divided_product_by_sum"
      },
      {
        id: "C",
        text: { en: "-3/4", hi: "-3/4", te: "-3/4", reviewed: false },
        mistakeTag: "sign_error_in_sum_of_roots_formula"
      },
      {
        id: "D",
        text: { en: "7/8", hi: "7/8", te: "7/8", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "1/α + 1/β = (α + β) / (αβ). For P(x) = x² - 6x + 8: α + β = -(-6)/1 = 6; αβ = 8/1 = 8. Hence (1/α + 1/β) = 6/8 = 3/4.",
      hi: "1/α + 1/β = (α + β) / (αβ)। यहाँ α + β = 6 और αβ = 8। अतः 1/α + 1/β = 6/8 = 3/4।",
      te: "1/α + 1/β = (α + β) / (αβ). ఇక్కడ α + β = 6 మరియు αβ = 8. కాబట్టి 1/α + 1/β = 6/8 = 3/4.",
      reviewed: false
    },
    hint: {
      en: "Take the common denominator: (α + β) / (αβ).",
      hi: "उभयनिष्ठ हर लें: (α + β) / (αβ)।",
      te: "సాధారణ హారాన్ని తీసుకోండి: (α + β) / (αβ).",
      reviewed: false
    }
  },
  {
    id: "q-c10-poly-d3-03",
    conceptId: "c10-poly-01",
    difficulty: 3,
    type: "multiple_choice",
    prompt: {
      en: "If the zeroes of the quadratic polynomial P(x) = x² - (k + 6)x + 2(2k - 1) satisfy α + β = αβ / 2, find the value of k.",
      hi: "यदि द्विघात बहुपद P(x) = x² - (k + 6)x + 2(2k - 1) के शून्यक α + β = αβ / 2 को संतुष्ट करते हैं, तो k का मान ज्ञात कीजिए।",
      te: "వర్గ బహుపది P(x) = x² - (k + 6)x + 2(2k - 1) శూన్యాలు α + β = αβ / 2 ను తృప్తిపరిస్తే, k విలువ ఎంత?",
      reviewed: false
    },
    options: [
      {
        id: "A",
        text: { en: "7", hi: "7", te: "7", reviewed: false }
      },
      {
        id: "B",
        text: { en: "5", hi: "5", te: "5", reviewed: false },
        mistakeTag: "subtracted_constants_instead_of_adding_in_transposition"
      },
      {
        id: "C",
        text: { en: "-7", hi: "-7", te: "-7", reviewed: false },
        mistakeTag: "sign_error_in_solving_linear_equation"
      },
      {
        id: "D",
        text: { en: "8", hi: "8", te: "8", reviewed: false },
        mistakeTag: "arithmetic_calculation_slip_off_by_one"
      }
    ],
    correctAnswer: "A",
    explanation: {
      en: "α + β = k + 6. αβ = 2(2k - 1) = 4k - 2, so αβ / 2 = 2k - 1. Setting them equal: k + 6 = 2k - 1 => 2k - k = 6 + 1 => k = 7.",
      hi: "α + β = k + 6। αβ / 2 = 2k - 1। समीकरण: k + 6 = 2k - 1 => k = 7।",
      te: "α + β = k + 6. αβ / 2 = 2k - 1. సమీకరణం: k + 6 = 2k - 1 => k = 7.",
      reviewed: false
    },
    hint: {
      en: "Express α + β and αβ in terms of k, then solve the linear equation.",
      hi: "α + β और αβ को k के रूप में लिखें, फिर रैखिक समीकरण को हल करें।",
      te: "α + β మరియు αβ లను k రూపంలో రాసి, సరళ సమీకరణాన్ని సాధించండి.",
      reviewed: false
    }
  }
];

// New tag mappings to add to tag-roots.json
const newTagMappings = {
  "arithmetic_calculation_slip_off_by_one": "c6-pat-01",
  "multiplied_instead_of_adding_step": "c6-pat-01",
  "added_one_instead_of_sequence_rule": "c6-pat-01",
  "incorrect_step_difference_estimation": "c6-pat-01",
  "subtraction_borrowing_slip_pattern": "c6-pat-01",
  "reversed_direction_added_instead_of_subtracted": "c6-pat-01",
  "forgot_constant_term_in_pattern_rule": "c6-pat-01",
  "multiplied_after_adding_rule_slip": "c6-pat-01",
  "added_step_multiple_times_unscaled": "c6-pat-01",
  "added_previous_difference_constant": "c6-pat-01",
  "skipped_one_term_in_sequence": "c6-pat-01",
  "forgot_to_subtract_constant_term_before_dividing": "c6-pat-01",
  "divided_by_two_instead_of_coefficient": "c6-pat-01",
  "forgot_division_by_two_in_triangular_formula": "c6-pat-01",
  "used_n_squared_divided_by_two": "c6-pat-01",
  "used_n_plus_one_instead_of_n": "c6-pat-01",
  "stopped_one_step_early_in_sequence": "c6-pat-01",
  "computed_one_step_too_far": "c6-pat-01",
  "switched_to_addition_instead_of_multiplication": "c6-pat-01",

  "added_before_dividing_ignored_bodmas": "c7-alg-01",
  "subtracted_instead_of_adding": "c7-alg-01",
  "subtracted_before_multiplying_ignored_bodmas": "c7-alg-01",
  "sign_reversal_in_subtraction": "c7-alg-01",
  "performed_subtraction_before_multiplication_inside_brackets": "c7-alg-01",
  "sign_distribution_error_on_bracket_removal": "c7-alg-01",
  "ignored_nested_bracket_order": "c7-alg-01",
  "multiplied_before_dividing_from_left_to_right": "c7-alg-01",
  "divided_first_number_by_all_in_brackets": "c7-alg-01",
  "performed_subtraction_before_multiplication_outside_braces": "c7-alg-01",
  "distributed_wrong_sign_in_curly_braces": "c7-alg-01",
  "forgot_outer_multiplication_factor": "c7-alg-01",
  "forgot_to_subtract_from_first_term": "c7-alg-01",
  "forgot_double_negative_becomes_positive_in_subtraction": "c7-alg-01",
  "dropped_negative_sign_in_division": "c7-alg-01",

  "multiplied_exponents_instead_of_adding_in_product_rule": "c8-exp-01",
  "multiplied_bases_as_well_as_powers": "c8-exp-01",
  "subtracted_exponents_instead_of_adding": "c8-exp-01",
  "zero_power_confused_with_zero_multiplication": "c8-exp-01",
  "zero_power_confused_with_first_power": "c8-exp-01",
  "confused_zero_power_with_division_by_zero": "c8-exp-01",
  "added_exponents_instead_of_multiplying_in_power_of_power": "c8-exp-01",
  "raised_exponent_to_power_instead_of_multiplying": "c8-exp-01",
  "applied_outer_power_to_base_only": "c8-exp-01",
  "multiplied_base_by_negative_exponent": "c8-exp-01",
  "confused_negative_exponent_with_negative_result": "c8-exp-01",
  "miscalculated_power_of_two": "c8-exp-01",
  "cancelled_factors_with_incorrect_powers": "c8-exp-01",
  "assumed_all_terms_cancel_completely": "c8-exp-01",
  "subtracted_exponents_in_wrong_order_in_quotient": "c8-exp-01",
  "forgot_to_divide_by_variable_coefficient": "c8-exp-01",
  "divided_powers_in_exponential_equation": "c8-exp-01",
  "confused_division_by_power_of_fraction": "c8-exp-01",
  "sign_error_in_subtraction_of_inverted_powers": "c8-exp-01",
  "multiplied_instead_of_dividing_by_divisor": "c8-exp-01",

  "counted_number_of_terms_instead_of_highest_power": "c9-poly-01",
  "confused_leading_coefficient_with_degree": "c9-poly-01",
  "selected_middle_exponent_as_degree": "c9-poly-01",
  "forgot_to_invert_sign_when_transposing_constant": "c9-poly-01",
  "forgot_to_divide_by_coefficient_of_x": "c9-poly-01",
  "treated_constant_term_directly_as_zero": "c9-poly-01",
  "inverted_fraction_divided_coefficient_by_constant": "c9-poly-01",
  "missed_inner_product_term_in_expansion": "c9-poly-01",
  "missed_outer_product_term_in_expansion": "c9-poly-01",
  "confused_constant_term_with_linear_coefficient": "c9-poly-01",
  "sign_error_in_solving_linear_equation": "c9-poly-01",
  "subtracted_instead_of_adding_in_polynomial_evaluation": "c9-poly-01",
  "evaluated_at_positive_root_instead_of_negative": "c9-poly-01",
  "squared_negative_number_as_negative_slip": "c9-poly-01",
  "forgot_to_divide_by_coefficients_of_x": "c9-poly-01",

  "confused_extrema_turning_points_with_zeroes": "c10-poly-01",
  "added_y_axis_intersection_to_zero_count": "c10-poly-01",
  "confused_degree_with_single_axis_point": "c10-poly-01",
  "forgot_negative_sign_in_sum_of_roots_formula": "c10-poly-01",
  "confused_sum_of_roots_with_product_of_roots": "c10-poly-01",
  "confused_product_of_roots_with_sum_of_roots": "c10-poly-01",
  "forgot_to_divide_by_leading_coefficient_a": "c10-poly-01",
  "dropped_negative_sign_of_constant_term": "c10-poly-01",
  "calculated_sum_of_roots_instead_of_product": "c10-poly-01",
  "forgot_to_invert_sign_of_sum_in_quadratic_construction": "c10-poly-01",
  "sign_error_negative_times_positive_became_positive": "c10-poly-01",
  "subtracted_roots_instead_of_adding_for_sum": "c10-poly-01",
  "sign_error_in_reciprocal_product_condition": "c10-poly-01",
  "inverted_relationship_k_equals_one_over_a": "c10-poly-01",
  "inverted_fraction_divided_product_by_sum": "c10-poly-01",
  "sign_error_in_sum_of_roots_formula": "c10-poly-01",
  "subtracted_constants_instead_of_adding_in_transposition": "c10-poly-01"
};

// 1. Update data/tag-roots.json
const tagRootsPath = path.join(rootDir, "data", "tag-roots.json");
const tagRoots = JSON.parse(fs.readFileSync(tagRootsPath, "utf-8"));
Object.assign(tagRoots, newTagMappings);
fs.writeFileSync(tagRootsPath, JSON.stringify(tagRoots, null, 2) + "\n", "utf-8");
console.log(`Updated tag-roots.json with ${Object.keys(newTagMappings).length} new tags (Total: ${Object.keys(tagRoots).length})`);

// 2. Update data/questions.json
const questionsPath = path.join(rootDir, "data", "questions.json");
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

// Filter out any duplicates if rerun
const existingIds = new Set(existingQuestions.map(q => q.id));
const toAdd = newQuestions.filter(q => !existingIds.has(q.id));
const combinedQuestions = [...existingQuestions, ...toAdd];
fs.writeFileSync(questionsPath, JSON.stringify(combinedQuestions, null, 2) + "\n", "utf-8");
console.log(`Updated questions.json: Added ${toAdd.length} new questions (Total: ${combinedQuestions.length})`);

// 3. Update data/questions/${chapterId}.json files
const chapterMap = {
  "c6-pat-01": "c6-ch01",
  "c7-alg-01": "c7-ch02",
  "c8-exp-01": "c8-ch02",
  "c9-poly-01": "c9-ch02",
  "c10-poly-01": "c10-ch02"
};

for (const [conceptId, chapterId] of Object.entries(chapterMap)) {
  const chapterQuestions = combinedQuestions.filter(q => {
    // Check if question belongs to any concept in this chapter
    return q.conceptId === conceptId;
  });
  const chapterFilePath = path.join(rootDir, "data", "questions", `${chapterId}.json`);
  fs.writeFileSync(chapterFilePath, JSON.stringify(chapterQuestions, null, 2) + "\n", "utf-8");
  console.log(`Updated data/questions/${chapterId}.json: ${chapterQuestions.length} questions`);
}
