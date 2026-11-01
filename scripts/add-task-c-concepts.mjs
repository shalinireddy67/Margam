import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. New Concepts for the 4 chapters
const newConcepts = [
  {
    "id": "c10-lin-01",
    "chapterId": "c10-ch03",
    "chapter": "Pair of Linear Equations in Two Variables",
    "subject": "maths",
    "board": "ncert",
    "class": 10,
    "name": {
      "en": "Pairs of Linear Equations in Two Variables and Consistency",
      "hi": "दो चरों में रैखिक समीकरण युग्म और संगतता",
      "te": "రెండు చరరాశులలో రేఖీయ సమీకరణాల జత మరియు అనుకూలత",
      "reviewed": false
    },
    "learningObjective": {
      "en": "Solve pairs of linear equations in two variables algebraically and graphically, and determine consistency using coefficient ratios.",
      "hi": "दो चरों में रैखिक समीकरण युग्म को बीजगणितीय और आलेखीय रूप से हल करें तथा गुणांकों के अनुपात से संगतता निर्धारित करें।",
      "te": "రెండు చరరాశులలో రేఖీయ సమీకరణాల జతను బీజగణిత మరియు గ్రాఫ్ పద్ధతులలో సాధించడం, గుణకాల నిష్పత్తులతో అనుకూలతను నిర్ధారించడం.",
      "reviewed": false
    },
    "prerequisites": [
      "c9-poly-01",
      "c9-coord-01"
    ],
    "edgeMeta": {
      "c9-poly-01": {
        "reason": "Understanding linear polynomials and zero values is required before formulating simultaneous linear equations.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      },
      "c9-coord-01": {
        "reason": "Plotting points and linear equations on the Cartesian plane is required for graphical interpretation of intersections.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      }
    }
  },
  {
    "id": "c10-ap-01",
    "chapterId": "c10-ch05",
    "chapter": "Arithmetic Progressions",
    "subject": "maths",
    "board": "ncert",
    "class": 10,
    "name": {
      "en": "nth Term and Sum of First n Terms of an Arithmetic Progression",
      "hi": "समांतर श्रेणी का n-वां पद और प्रथम n पदों का योग",
      "te": "అంకశ్రేఢి n-వ పదం మరియు మొదటి n పదాల మొత్తం",
      "reviewed": false
    },
    "learningObjective": {
      "en": "Identify arithmetic progressions, calculate the common difference, find the nth term, and compute the sum of the first n terms.",
      "hi": "समांतर श्रेणी की पहचान करें, सार्व अंतर ज्ञात करें, n-वां पद निकालें और प्रथम n पदों के योग की गणना करें।",
      "te": "అంకశ్రేఢిని గుర్తించడం, సామాన్య భేదాన్ని కనుగొనడం, n-వ పదాన్ని మరియు మొదటి n పదాల మొత్తాన్ని లెక్కించడం.",
      "reviewed": false
    },
    "prerequisites": [
      "c8-dist-01",
      "c7-alg-01"
    ],
    "edgeMeta": {
      "c8-dist-01": {
        "reason": "Expanding and simplifying expressions like a + (n - 1)d requires distributive property proficiency.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      },
      "c7-alg-01": {
        "reason": "Evaluating sequences and substituting values into algebraic expressions is essential for computing nth terms.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      }
    }
  },
  {
    "id": "c10-tri-01",
    "chapterId": "c10-ch06",
    "chapter": "Triangles",
    "subject": "maths",
    "board": "ncert",
    "class": 10,
    "name": {
      "en": "Similarity Criteria and Basic Proportionality Theorem",
      "hi": "त्रिभुजों की समरूपता की कसौटियाँ और आधारभूत आनुपातिकता प्रमेय",
      "te": "త్రిభుజాల సారూప్యతా నియమాలు మరియు ప్రాథమిక అనుపాత సిద్ధాంతం",
      "reviewed": false
    },
    "learningObjective": {
      "en": "Apply the Basic Proportionality Theorem (Thales theorem) and similarity criteria (AAA, SSS, SAS) to solve geometric problems.",
      "hi": "आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय) और समरूपता की कसौटियों (AAA, SSS, SAS) का उपयोग कर ज्यामितीय प्रश्नों को हल करें।",
      "te": "ప్రాథమిక అనుపాత సిద్ధాంతం (థేల్స్ సిద్ధాంతం) మరియు సారూప్యతా నియమాలను ఉపయోగించి రేఖాగణిత సమస్యలను సాధించడం.",
      "reviewed": false
    },
    "prerequisites": [
      "c6-geo-01"
    ],
    "edgeMeta": {
      "c6-geo-01": {
        "reason": "Fundamental understanding of lines, angles, and transversals is required to prove parallel line ratios and angle equality.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      }
    }
  },
  {
    "id": "c10-geom-01",
    "chapterId": "c10-ch07",
    "chapter": "Coordinate Geometry",
    "subject": "maths",
    "board": "ncert",
    "class": 10,
    "name": {
      "en": "Distance Formula and Section Formula on the Coordinate Plane",
      "hi": "निर्देशांक तल पर दूरी सूत्र और विभाजन सूत्र",
      "te": "నిరూపక తలంలో దూర సూత్రం మరియు విభజన సూత్రం",
      "reviewed": false
    },
    "learningObjective": {
      "en": "Calculate distances between points using the distance formula and find coordinates of points dividing segments using the section formula.",
      "hi": "दूरी सूत्र का उपयोग करके बिंदुओं के बीच की दूरी निकालें और विभाजन सूत्र से रेखाखंड को विभाजित करने वाले बिंदुओं के निर्देशांक ज्ञात करें।",
      "te": "దూర సూత్రం ఉపయోగించి బిందువుల మధ్య దూరాన్ని లెక్కించడం మరియు విభజన సూత్రంతో నిరూపకాలను కనుగొనడం.",
      "reviewed": false
    },
    "prerequisites": [
      "c9-coord-01",
      "c8-sqr-01"
    ],
    "edgeMeta": {
      "c9-coord-01": {
        "reason": "Plotting points and calculating coordinate differences is the direct prerequisite for distance on Cartesian plane.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      },
      "c8-sqr-01": {
        "reason": "Evaluating square roots of sums of squares sqrt((x2-x1)^2 + (y2-y1)^2) requires square root arithmetic.",
        "source": "team_curriculum_analysis",
        "status": "tentative, pending teacher review"
      }
    }
  }
];

// 2. New 3-Variant Lessons for the 4 concepts
const newLessons = [
  {
    conceptId: "c10-lin-01",
    basics_first: {
      headline: {
        en: "Basics-First: Recognizing Linear Equations in Two Variables",
        hi: "बुनियादी दृष्टिकोण: दो चरों में रैखिक समीकरणों की पहचान",
        te: "ప్రాథమిక విధానం: రెండు చరరాశులలో రేఖీయ సమీకరణాల గుర్తింపు",
        reviewed: false
      },
      explanation: {
        en: "A linear equation in two variables x and y has the form ax + by + c = 0 where a and b are not both zero. Geometrically, each equation represents a straight line on the Cartesian plane. Two lines can intersect at one point (one solution), be parallel (no solution), or coincide (infinitely many solutions).",
        hi: "दो चरों x और y में रैखिक समीकरण का रूप ax + by + c = 0 होता है जहाँ a और b दोनों शून्य नहीं हैं। ज्यामितीय रूप से, प्रत्येक समीकरण कार्तीय तल पर एक सीधी रेखा दर्शाता है।",
        te: "x మరియు y లలో రెండు చరరాశుల రేఖీయ సమీకరణం ax + by + c = 0 రూపంలో ఉంటుంది. రేఖాగణితంగా ప్రతి సమీకరణం సరళరేఖను సూచిస్తుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find if 2x + 3y = 9 and 4x + 6y = 18 are consistent.",
          hi: "ज्ञात कीजिए कि क्या 2x + 3y = 9 और 4x + 6y = 18 संगत हैं।",
          te: "2x + 3y = 9 మరియు 4x + 6y = 18 అనుకూలమైనవో కాదో కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "Compare ratios: a₁/a₂ = 2/4 = 1/2",
          "b₁/b₂ = 3/6 = 1/2",
          "c₁/c₂ = 9/18 = 1/2",
          "Since a₁/a₂ = b₁/b₂ = c₁/c₂, the lines are coincident with infinitely many solutions."
        ],
        solution: {
          en: "The system is consistent with infinitely many solutions.",
          hi: "निकाय संगत है और इसके अपरिमित रूप से अनेक हल हैं।",
          te: "వ్యవస్థ అనుకూలమైనది మరియు అనంతమైన సాధనలు కలిగి ఉంది.",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Compare a₁/a₂, b₁/b₂, and c₁/c₂ to determine whether a system has one, none, or infinite solutions.",
        hi: "a₁/a₂, b₁/b₂, और c₁/c₂ की तुलना करके निर्धारित करें कि निकाय का एक, कोई नहीं, या अनंत हल हैं।",
        te: "నిష్పత్తులను పోల్చి వ్యవస్థకు ఒక సాధన, సాధన లేకపోవడం లేదా అనంత సాధనలు ఉన్నాయో నిర్ణయించండి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Algebraic Methods of Solving Linear Systems",
        hi: "मानक स्तर: रैखिक प्रणालियों को हल करने की बीजगणितीय विधियाँ",
        te: "ప్రామాణిక స్థాయి: రేఖీయ వ్యవస్థలను సాధించే బీజగణిత పద్ధతులు",
        reviewed: false
      },
      explanation: {
        en: "Use substitution or elimination to isolate variables. In elimination, multiply one or both equations so coefficients of one variable match, then add or subtract to eliminate that variable.",
        hi: "चरों को अलग करने के लिए प्रतिस्थापन या विलोपन विधि का उपयोग करें।",
        te: "చరరాశులను వేరు చేయడానికి ప్రతిక్షేపణ లేదా చరలోప పద్ధతిని ఉపయోగించండి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Solve x + y = 10 and x - y = 4.",
          hi: "x + y = 10 और x - y = 4 को हल कीजिए।",
          te: "x + y = 10 మరియు x - y = 4 లను సాధించండి.",
          reviewed: false
        },
        steps: [
          "Add both equations: 2x = 14 => x = 7",
          "Substitute x = 7 into first equation: 7 + y = 10 => y = 3"
        ],
        solution: {
          en: "x = 7, y = 3",
          hi: "x = 7, y = 3",
          te: "x = 7, y = 3",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Elimination quickly finds exact intersection points by cancelling one variable.",
        hi: "विलोपन विधि एक चर को समाप्त करके तुरंत प्रतिच्छेद बिंदु ज्ञात करती है।",
        te: "చరలోప పద్ధతి ఒక చరరాశిని తొలగించి ఖండన బిందువును త్వరగా కనుగొంటుంది.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Parameterized Systems & Real-World Modeling",
        hi: "फास्ट-ट्रैक: प्राचलिक निकाय और व्यावहारिक अनुप्रयोग",
        te: "ఫాస్ట్-ట్రాక్: పారామీటరైజ్డ్ వ్యవస్థలు మరియు వాస్తవిక అనువర్తనాలు",
        reviewed: false
      },
      explanation: {
        en: "Solve upstream-downstream, speed-distance-time, and geometric word problems by creating two simultaneous equations.",
        hi: "दो युगपत समीकरण बनाकर गति-दूरी-समय और ज्यामितीय समस्याओं को हल करें।",
        te: "రెండు ఏకకాలిక సమీకరణాలను రూపొందించి వేగం-దూరం-సమయం సమస్యలను సాధించండి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find k for no solution: kx + 3y = 1 and 12x + ky = 2.",
          hi: "कोई हल न होने के लिए k का मान ज्ञात कीजिए: kx + 3y = 1 और 12x + ky = 2।",
          te: "సాధన లేకపోవడానికి k విలువను కనుగొనండి: kx + 3y = 1 మరియు 12x + ky = 2.",
          reviewed: false
        },
        steps: [
          "Condition for parallel lines: k/12 = 3/k => k² = 36 => k = ±6",
          "Check c₁/c₂: 1/2. If k = 6: 6/12 = 1/2 (infinite). Thus k = -6 gives parallel lines."
        ],
        solution: {
          en: "k = -6",
          hi: "k = -6",
          te: "k = -6",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Always verify the constant ratio to distinguish parallel lines from coincident lines.",
        hi: "समानांतर रेखाओं को संपाती रेखाओं से अलग करने के लिए अचर पदों के अनुपात की जांच अवश्य करें।",
        te: "సమాంతర రేఖలను ఏకీభవించే రేఖల నుండి వేరు చేయడానికి స్థిరపదాల నిష్పత్తిని తప్పనిసరిగా సరిచూడండి.",
        reviewed: false
      }
    }
  },
  {
    conceptId: "c10-ap-01",
    basics_first: {
      headline: {
        en: "Basics-First: What is an Arithmetic Progression?",
        hi: "बुनियादी दृष्टिकोण: समांतर श्रेणी क्या है?",
        te: "ప్రాథమిక విధానం: అంకశ్రేఢి అంటే ఏమిటి?",
        reviewed: false
      },
      explanation: {
        en: "An arithmetic progression (AP) is a list of numbers in which each term is obtained by adding a fixed number d (common difference) to the preceding term, except the first term a.",
        hi: "समांतर श्रेणी (AP) संख्याओं की एक ऐसी सूची है जिसमें प्रत्येक पद अपने पिछले पद में एक निश्चित संख्या d (सार्व अंतर) जोड़कर प्राप्त होता है।",
        te: "అంకశ్రేఢి (AP) అనేది మొదటి పదం తప్ప ప్రతి పదం మునుపటి పదానికి స్థిర సంఖ్య d (సాధారణ భేదం) కలపడం ద్వారా ఏర్పడే సంఖ్యల జాబితా.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the 5th term of AP: 2, 5, 8, ...",
          hi: "AP: 2, 5, 8, ... का 5वां पद ज्ञात कीजिए।",
          te: "AP: 2, 5, 8, ... యొక్క 5వ పదాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "First term a = 2, common difference d = 5 - 2 = 3",
          "a₅ = a + (5 - 1)d = 2 + 4(3) = 14"
        ],
        solution: {
          en: "14",
          hi: "14",
          te: "14",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Formula for nth term: aₙ = a + (n - 1)d.",
        hi: "n-वें पद का सूत्र: aₙ = a + (n - 1)d।",
        te: "n-వ పదానికి సూత్రం: aₙ = a + (n - 1)d.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Sum of the First n Terms of an AP",
        hi: "मानक स्तर: AP के प्रथम n पदों का योग",
        te: "ప్రామాణిక స్థాయి: AP లో మొదటి n పదాల మొత్తం",
        reviewed: false
      },
      explanation: {
        en: "The sum Sₙ of first n terms is Sₙ = n/2 * [2a + (n - 1)d] or Sₙ = n/2 * [a + l], where l is the last term.",
        hi: "प्रथम n पदों का योग Sₙ = n/2 * [2a + (n - 1)d] या Sₙ = n/2 * [a + l] होता है।",
        te: "మొదటి n పదాల మొత్తం Sₙ = n/2 * [2a + (n - 1)d] లేదా Sₙ = n/2 * [a + l].",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find sum of first 10 terms of 2, 4, 6, ...",
          hi: "2, 4, 6, ... के प्रथम 10 पदों का योग ज्ञात कीजिए।",
          te: "2, 4, 6, ... ల మొదటి 10 పదాల మొత్తం కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "a = 2, d = 2, n = 10",
          "S₁₀ = 10/2 * [2(2) + 9(2)] = 5 * [4 + 18] = 5 * 22 = 110"
        ],
        solution: {
          en: "110",
          hi: "110",
          te: "110",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Sₙ pairs symmetric terms from both ends, multiplying n/2 by the sum of first and last terms.",
        hi: "Sₙ दोनों सिरों से सममित पदों को जोड़कर n/2 से गुणा करता है।",
        te: "Sₙ రెండు చివర్ల నుండి సమరూప పదాలను జతచేసి n/2 తో గుణిస్తుంది.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Connecting Sₙ and aₙ & Financial/Physical Modeling",
        hi: "फास्ट-ट्रैक: Sₙ और aₙ का संबंध एवं व्यावहारिक अनुप्रयोग",
        te: "ఫాస్ట్-ట్రాక్: Sₙ మరియు aₙ సంబంధం మరియు వాస్తవిక అనువర్తనాలు",
        reviewed: false
      },
      explanation: {
        en: "The nth term is the difference between consecutive sums: aₙ = Sₙ - Sₙ₋₁.",
        hi: "n-वां पद क्रमागत योगों का अंतर होता है: aₙ = Sₙ - Sₙ₋₁।",
        te: "n-వ పదం వరుస మొత్తాల మధ్య తేడా: aₙ = Sₙ - Sₙ₋₁.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "If Sₙ = 2n² + 3n, find a₅.",
          hi: "यदि Sₙ = 2n² + 3n है, तो a₅ ज्ञात कीजिए।",
          te: "Sₙ = 2n² + 3n అయితే, a₅ కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "S₅ = 2(25) + 3(5) = 50 + 15 = 65",
          "S₄ = 2(16) + 3(4) = 32 + 12 = 44",
          "a₅ = 65 - 44 = 21"
        ],
        solution: {
          en: "21",
          hi: "21",
          te: "21",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "aₙ = Sₙ - Sₙ₋₁ enables recovery of any term directly from quadratic sum formulas.",
        hi: "aₙ = Sₙ - Sₙ₋₁ द्विघातीय योग सूत्रों से सीधे किसी भी पद को प्राप्त करने में मदद करता है।",
        te: "aₙ = Sₙ - Sₙ₋₁ వర్గ మొత్తం సూత్రాల నుండి ఏదైనా పదాన్ని నేరుగా కనుగొనడానికి సహాయపడుతుంది.",
        reviewed: false
      }
    }
  },
  {
    conceptId: "c10-tri-01",
    basics_first: {
      headline: {
        en: "Basics-First: Similar Triangles vs Congruent Triangles",
        hi: "बुनियादी दृष्टिकोण: समरूप त्रिभुज बनाम सर्वांगसम त्रिभुज",
        te: "ప్రాథమిక విధానం: సరూప త్రిభుజాలు మరియు సర్వసమాన త్రిభుజాలు",
        reviewed: false
      },
      explanation: {
        en: "Two triangles are similar (~) if their corresponding angles are equal and their corresponding sides are in the same ratio (proportional).",
        hi: "दो त्रिभुज समरूप होते हैं यदि उनके संगत कोण बराबर हों और उनकी संगत भुजाएँ एक ही अनुपात (समानुपाती) में हों।",
        te: "రెండు త్రిభుజాలు సరూపాలు కావాలంటే వాటి అనురూప కోణాలు సమానంగా మరియు అనురూప భుజాలు ఒకే నిష్పత్తిలో ఉండాలి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "If ΔABC ~ ΔDEF and AB/DE = 1/3, BC = 4 cm, find EF.",
          hi: "यदि ΔABC ~ ΔDEF और AB/DE = 1/3, BC = 4 सेमी है, तो EF ज्ञात कीजिए।",
          te: "ΔABC ~ ΔDEF మరియు AB/DE = 1/3, BC = 4 సెం.మీ అయితే, EF కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "Corresponding sides are proportional: AB/DE = BC/EF",
          "1/3 = 4/EF => EF = 12 cm"
        ],
        solution: {
          en: "12 cm",
          hi: "12 सेमी",
          te: "12 సెం.మీ",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "In similar triangles, angles are preserved while sides scale by a constant factor.",
        hi: "समरूप त्रिभुजों में कोण समान रहते हैं जबकि भुजाएँ एक निश्चित अनुपात में बढ़ती या घटती हैं।",
        te: "సరూప త్రిభుజాలలో కోణాలు మారవు, కానీ భుజాలు స్థిర నిష్పత్తిలో ఉంటాయి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Basic Proportionality Theorem (Thales' Theorem)",
        hi: "मानक स्तर: आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय)",
        te: "ప్రామాణిక స్థాయి: ప్రాథమిక అనుపాత సిద్ధాంతం (థేల్స్ సిద్ధాంతం)",
        reviewed: false
      },
      explanation: {
        en: "If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.",
        hi: "यदि किसी त्रिभुज की एक भुजा के समांतर अन्य दो भुजाओं को भिन्न-भिन्न बिंदुओं पर प्रतिच्छेद करने के लिए एक रेखा खींची जाए, तो ये अन्य दो भुजाएँ एक ही अनुपात में विभाजित हो जाती हैं।",
        te: "ఒక త్రిభుజంలో ఒక భుజానికి సమాంతరంగా గీసిన సరళరేఖ మిగిలిన రెండు భుజాలను సమాన నిష్పత్తిలో విభజిస్తుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "In ΔABC, DE || BC. If AD = 2 cm, DB = 4 cm, AE = 3 cm, find EC.",
          hi: "ΔABC में, DE || BC है। यदि AD = 2 सेमी, DB = 4 सेमी, AE = 3 सेमी है, तो EC ज्ञात कीजिए।",
          te: "ΔABC లో, DE || BC. AD = 2 సెం.మీ, DB = 4 సెం.మీ, AE = 3 సెం.మీ అయితే, EC కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "By BPT: AD/DB = AE/EC",
          "2/4 = 3/EC => 1/2 = 3/EC => EC = 6 cm"
        ],
        solution: {
          en: "6 cm",
          hi: "6 सेमी",
          te: "6 సెం.మీ",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "DE || BC guarantees AD/DB = AE/EC.",
        hi: "DE || BC होने पर AD/DB = AE/EC निश्चित होता है।",
        te: "DE || BC అయితే AD/DB = AE/EC అవుతుంది.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Right Triangles & Pythagoras Theorem Applications",
        hi: "फास्ट-ट्रैक: समकोण त्रिभुज और पाइथागोरस प्रमेय अनुप्रयोग",
        te: "ఫాస్ట్-ట్రాక్: లంబకోణ త్రిభుజాలు మరియు పైథాగరస్ సిద్ధాంత అనువర్తనాలు",
        reviewed: false
      },
      explanation: {
        en: "In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides: a² + b² = c².",
        hi: "एक समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है: a² + b² = c²।",
        te: "ఒక లంబకోణ త్రిభుజంలో కర్ణం మీది వర్గం మిగిలిన రెండు భుజాల మీది వర్గాల మొత్తానికి సమానం: a² + b² = c².",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "A 13 m ladder leans against a wall with base 5 m from wall. Find window height.",
          hi: "13 मीटर की सीढ़ी दीवार के सहारे खड़ी है जिसका निचला सिरा दीवार से 5 मीटर दूर है। खिड़की की ऊँचाई ज्ञात कीजिए।",
          te: "13 మీటర్ల నిచ్చెన గోడకు ఆనించి ఉంది, దాని అడుగు భాగం గోడ నుండి 5 మీటర్ల దూరంలో ఉంది. కిటికీ ఎత్తు కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "Hypotenuse c = 13, base b = 5",
          "h² + 5² = 13² => h² + 25 = 169 => h² = 144 => h = 12 m"
        ],
        solution: {
          en: "12 m",
          hi: "12 मीटर",
          te: "12 మీటర్లు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Pythagorean triples (3-4-5, 5-12-13, 8-15-17) rapidly solve physical distance geometry.",
        hi: "पाइथागोरस त्रिक (3-4-5, 5-12-13) भौतिक दूरी और ज्यामिति समस्याओं को तेजी से हल करते हैं।",
        te: "పైథాగోరియన్ త్రికాలు (3-4-5, 5-12-13) భౌతిక దూర సమస్యలను వేగంగా సాధిస్తాయి.",
        reviewed: false
      }
    }
  },
  {
    conceptId: "c10-geom-01",
    basics_first: {
      headline: {
        en: "Basics-First: The Distance Formula",
        hi: "बुनियादी दृष्टिकोण: दूरी सूत्र",
        te: "ప్రాథమిక విధానం: దూర సూత్రం",
        reviewed: false
      },
      explanation: {
        en: "The distance d between two points (x₁, y₁) and (x₂, y₂) in a coordinate plane is given by d = √[(x₂ - x₁)² + (y₂ - y₁)²].",
        hi: "कार्तीय तल में दो बिंदुओं (x₁, y₁) और (x₂, y₂) के बीच की दूरी d = √[(x₂ - x₁)² + (y₂ - y₁)²] होती है।",
        te: "నిరూపక తలంలో (x₁, y₁) మరియు (x₂, y₂) బిందువుల మధ్య దూరం d = √[(x₂ - x₁)² + (y₂ - y₁)²].",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find distance between (0, 0) and (3, 4).",
          hi: "(0, 0) और (3, 4) के बीच की दूरी ज्ञात कीजिए।",
          te: "(0, 0) మరియు (3, 4) బిందువుల మధ్య దూరం కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "x₁ = 0, y₁ = 0, x₂ = 3, y₂ = 4",
          "d = √[(3 - 0)² + (4 - 0)²] = √[9 + 16] = √25 = 5"
        ],
        solution: {
          en: "5 units",
          hi: "5 मात्रक",
          te: "5 యూనిట్లు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "The distance formula is a direct application of the Pythagorean theorem on the coordinate plane.",
        hi: "दूरी सूत्र कार्तीय तल पर पाइथागोरस प्रमेय का सीधा अनुप्रयोग है।",
        te: "దూర సూత్రం నిరూపక తలంలో పైథాగరస్ సిద్ధాంతం యొక్క ప్రత్యక్ష అనువర్తనం.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: The Section Formula (Internal Division)",
        hi: "मानक स्तर: विभाजन सूत्र (आंतरिक विभाजन)",
        te: "ప్రామాణిక స్థాయి: విభజన సూత్రం (అంతర్గత విభజన)",
        reviewed: false
      },
      explanation: {
        en: "The coordinates of the point P(x, y) dividing the line segment joining A(x₁, y₁) and B(x₂, y₂) internally in ratio m₁:m₂ are x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂).",
        hi: "बिंदुओं A(x₁, y₁) और B(x₂, y₂) को m₁:m₂ अनुपात में आंतरिक रूप से विभाजित करने वाले बिंदु के निर्देशांक x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂) होते हैं।",
        te: "A(x₁, y₁) మరియు B(x₂, y₂) బిందువులను m₁:m₂ నిష్పత్తిలో అంతర్గతంగా విభజించే బిందువు నిరూపకాలు x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂).",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find midpoint of (2, 6) and (8, 10).",
          hi: "(2, 6) और (8, 10) का मध्य-बिंदु ज्ञात कीजिए।",
          te: "(2, 6) మరియు (8, 10) ల మధ్య బిందువు కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "For midpoint, m₁ = m₂ = 1",
          "x = (2 + 8)/2 = 5, y = (6 + 10)/2 = 8"
        ],
        solution: {
          en: "(5, 8)",
          hi: "(5, 8)",
          te: "(5, 8)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Midpoint formula is section formula with ratio 1:1: ((x₁ + x₂)/2, (y₁ + y₂)/2).",
        hi: "मध्य-बिंदु सूत्र 1:1 अनुपात वाला विभाजन सूत्र है: ((x₁ + x₂)/2, (y₁ + y₂)/2)।",
        te: "మధ్య బిందువు సూత్రం 1:1 నిష్పత్తితో విభజన సూత్రం: ((x₁ + x₂)/2, (y₁ + y₂)/2).",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Collinearity, Parallelogram Diagonals & Ratio Determination",
        hi: "फास्ट-ट्रैक: संरेखता, समांतर चतुर्भुज के विकर्ण और अनुपात निर्धारण",
        te: "ఫాస్ట్-ట్రాక్: సరేఖీయత, సమాంతర చతుర్భుజ కర్ణాలు మరియు నిష్పత్తి నిర్ణయం",
        reviewed: false
      },
      explanation: {
        en: "To find the ratio in which an axis divides a segment, set the corresponding coordinate to zero and solve for k in ratio k:1.",
        hi: "अक्ष द्वारा रेखाखंड को विभाजित करने का अनुपात ज्ञात करने के लिए संबंधित निर्देशांक को शून्य मानकर k:1 में k का मान ज्ञात करें।",
        te: "అక్షం రేఖాఖండాన్ని విభజించే నిష్పత్తిని కనుగొనడానికి సంబంధిత నిరూపకాన్ని సున్నా చేసి k:1 లో k విలువను సాధించండి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find ratio in which x-axis divides (1, -3) and (4, 5).",
          hi: "ज्ञात कीजिए कि x-अक्ष (1, -3) और (4, 5) को किस अनुपात में विभाजित करता है।",
          te: "x-అక్షం (1, -3) మరియు (4, 5) లను ఏ నిష్పత్తిలో విభజిస్తుందో కనుగొనండి.",
          reviewed: false
        },
        steps: [
          "Point on x-axis has y = 0. Let ratio be k:1",
          "y = [k(5) + 1(-3)] / (k + 1) = 0 => 5k - 3 = 0 => k = 3/5"
        ],
        solution: {
          en: "3:5",
          hi: "3:5",
          te: "3:5",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Setting y = 0 for x-axis division (or x = 0 for y-axis) turns 2D geometry into a simple linear ratio.",
        hi: "x-अक्ष के लिए y = 0 (या y-अक्ष के लिए x = 0) रखने से 2D ज्यामिति सरल रैखिक अनुपात में बदल जाती है।",
        te: "x-అక్షం కోసం y = 0 (లేదా y-అక్షం కోసం x = 0) చేయడం ద్వారా 2D సమస్య సరళ నిష్పత్తిగా మారుతుంది.",
        reviewed: false
      }
    }
  }
];

// Update concepts.json
const conceptsPath = path.join(rootDir, "data", "concepts.json");
const existingConcepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));
for (const nc of newConcepts) {
  if (!existingConcepts.some(c => c.id === nc.id)) {
    existingConcepts.push(nc);
  }
}
fs.writeFileSync(conceptsPath, JSON.stringify(existingConcepts, null, 2) + "\n");
console.log(`Updated concepts.json: now has ${existingConcepts.length} concepts.`);

// Update lessons.json
const lessonsPath = path.join(rootDir, "data", "lessons.json");
const existingLessons = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
for (const nl of newLessons) {
  if (!existingLessons.some(l => l.conceptId === nl.conceptId)) {
    existingLessons.push(nl);
  }
}
fs.writeFileSync(lessonsPath, JSON.stringify(existingLessons, null, 2) + "\n");
console.log(`Updated lessons.json: now has ${existingLessons.length} lessons.`);
