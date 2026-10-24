/**
 * Script to add 10 complete 3-variant Lessons for Chapters 1 and 2 across Classes 6-10.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const lessonsPath = path.join(rootDir, "data", "lessons.json");
const existingLessons = JSON.parse(fs.readFileSync(lessonsPath, "utf8"));

const newConceptIds = new Set([
  "c6-pat-01",
  "c6-geo-01",
  "c7-num-01",
  "c7-alg-01",
  "c8-sqr-01",
  "c8-exp-01",
  "c9-coord-01",
  "c9-poly-01",
  "c10-real-01",
  "c10-poly-01"
]);

// Keep existing lessons that are not in the newConceptIds list
const filteredLessons = existingLessons.filter(l => !newConceptIds.has(l.conceptId));

const newLessons = [
  // 1. Class 6 - Chapter 1: Patterns in Mathematics (c6-pat-01)
  {
    conceptId: "c6-pat-01",
    basics_first: {
      headline: {
        en: "Basics-First: Discovering Sequences and Step Rules",
        hi: "बुनियादी दृष्टिकोण: अनुक्रम और चरण नियमों की खोज",
        te: "ప్రాథమిక విధానం: శ్రేణులు మరియు క్రమ నియమాల ఆవిష్కరణ",
        reviewed: false
      },
      explanation: {
        en: "A pattern is an arrangement of numbers or shapes that follows a fixed, predictable rule. When looking at numbers in a line, find what happens as you jump from one number to the next: are you adding the same number every time?",
        hi: "एक पैटर्न संख्याओं या आकृतियों की एक ऐसी व्यवस्था है जो एक निश्चित नियम का पालन करती है। जब आप एक पंक्ति में संख्याओं को देखते हैं, तो देखें कि एक संख्या से अगली संख्या पर जाने पर क्या होता है: क्या आप हर बार समान संख्या जोड़ रहे हैं?",
        te: "నమూనా (ప్యాటర్న్) అనేది ఒక నిర్దిష్టమైన నియమాన్ని అనుసరించే సంఖ్యలు లేదా ఆకారాల అమరిక. వరుస సంఖ్యలను పరిశీలించినప్పుడు, ఒక సంఖ్య నుండి తర్వాతి సంఖ్యకు వెళ్లేందుకు ప్రతిసారీ ఎంత కలుపుతున్నారో గమనించండి.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Stepping stones on a garden path spaced equally 3 feet apart: stone 1 is at 4 ft, stone 2 at 7 ft, stone 3 at 10 ft.",
        hi: "बगीचे के रास्ते पर 3 फीट की दूरी पर रखे पत्थर: पत्थर 1 (4 फीट), पत्थर 2 (7 फीट), पत्थर 3 (10 फीट)।",
        te: "తోటలో 3 అడుగుల సమాన దూరంలో ఉన్న రాళ్ళు: 1వ రాయి (4 అడుగులు), 2వ రాయి (7 అడుగులు), 3వ రాయి (10 అడుగులు).",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the next term in the sequence: 5, 9, 13, 17, __?",
          hi: "अनुक्रम 5, 9, 13, 17, __ में अगला पद ज्ञात कीजिए।",
          te: "5, 9, 13, 17, __ శ్రేణిలో తర్వాతి పదాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Subtract the first term from the second: 9 - 5 = 4.",
            hi: "दूसरे पद में से पहला पद घटाएं: 9 - 5 = 4।",
            te: "రెండో పదం నుండి మొదటి పదాన్ని తీసివేయండి: 9 - 5 = 4.",
            reviewed: false
          },
          {
            en: "Check the next step: 13 - 9 = 4 and 17 - 13 = 4. The rule is '+4'.",
            hi: "अगले चरण की जाँच करें: 13 - 9 = 4 और 17 - 13 = 4। नियम है '+4'।",
            te: "తర్వాతి దశను సరిచూడండి: 13 - 9 = 4 మరియు 17 - 13 = 4. నియమం '+4'.",
            reviewed: false
          },
          {
            en: "Add 4 to 17: 17 + 4 = 21.",
            hi: "17 में 4 जोड़ें: 17 + 4 = 21।",
            te: "17 కి 4 కలపండి: 17 + 4 = 21.",
            reviewed: false
          }
        ],
        solution: {
          en: "21",
          hi: "21",
          te: "21",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Identifying the difference between consecutive numbers reveals the constant step rule.",
        hi: "लगातार संख्याओं के बीच के अंतर की पहचान करने से स्थिर चरण नियम का पता चलता है।",
        te: "వరుస సంఖ్యల మధ్య తేడాను గుర్తించడం ద్వారా నియమాన్ని సులభంగా కనుగొనవచ్చు.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Generalizing Matchstick and Geometric Patterns",
        hi: "मानक दृष्टिकोण: तीलियों और ज्यामितीय पैटर्न का सामान्यीकरण",
        te: "ప్రామాణిక విధానం: అగ్గిపుల్లల మరియు రేఖాగణిత నమూనాల సాధారణీకరణ",
        reviewed: false
      },
      explanation: {
        en: "When geometric figures are built sequentially, the total number of parts often forms an arithmetic sequence. For example, making 1 square with matchsticks takes 4 sticks. Adding a connected square shares one side, requiring 3 more sticks. For n connected squares, the rule is 3n + 1 sticks.",
        hi: "जब ज्यामितीय आकृतियाँ क्रमिक रूप से बनाई जाती हैं, तो भागों की कुल संख्या एक अंकगणितीय अनुक्रम बनाती है। उदाहरण के लिए, तीलियों से 1 वर्ग बनाने में 4 तीलियाँ लगती हैं। जुड़े हुए दूसरे वर्ग के लिए 3 और तीलियाँ चाहिए। n जुड़े हुए वर्गों के लिए नियम 3n + 1 है।",
        te: "జ్యామితీయ ఆకారాలను వరుసగా నిర్మించినప్పుడు, వాటి భాగాల సంఖ్య ఒక క్రమాన్ని ఏర్పరుస్తుంది. ఉదాహరణకు, అగ్గిపుల్లలతో 1 చతురస్రం చేయడానికి 4 పుల్లలు అవసరం. పక్కనే మరొక చతురస్రం కలపడానికి 3 పుల్లలు చాలు. n చతురస్రాలకు అవసరమైన పుల్లల సూత్రం 3n + 1.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "How many matchsticks are needed to form 5 connected squares using the rule S = 3n + 1?",
          hi: "नियम S = 3n + 1 का उपयोग करके 5 जुड़े हुए वर्ग बनाने के लिए कितनी तीलियों की आवश्यकता है?",
          te: "S = 3n + 1 సూత్రాన్ని ఉపయోగించి 5 కలిపిన చతురస్రాలను రూపొందించడానికి ఎన్ని అగ్గిపుల్లలు కావాలి?",
          reviewed: false
        },
        steps: [
          {
            en: "Identify n = 5 (the number of squares to construct).",
            hi: "पहचानें कि n = 5 (बनाए जाने वाले वर्गों की संख्या)।",
            te: "n = 5 (నిర్మించాల్సిన చతురస్రాల సంఖ్య) అని గుర్తించండి.",
            reviewed: false
          },
          {
            en: "Substitute n = 5 into the formula: 3 × 5 + 1.",
            hi: "सूत्र में n = 5 रखें: 3 × 5 + 1।",
            te: "సూత్రంలో n = 5 ని ప్రతిక్షేపించండి: 3 × 5 + 1.",
            reviewed: false
          },
          {
            en: "Calculate: 15 + 1 = 16 sticks.",
            hi: "गणना करें: 15 + 1 = 16 तीलियाँ।",
            te: "లెక్కించండి: 15 + 1 = 16 పుల్లలు.",
            reviewed: false
          }
        ],
        solution: {
          en: "16 matchsticks",
          hi: "16 तीलियाँ",
          te: "16 అగ్గిపుల్లలు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "An algebraic pattern formula allows us to compute the value for any position without drawing every step.",
        hi: "एक बीजीय पैटर्न सूत्र हमें प्रत्येक चरण को बनाए बिना किसी भी पद का मान ज्ञात करने की अनुमति देता है।",
        te: "బీజగణిత సూత్రం ద్వారా ప్రతి దశను గీయకుండానే ఏ స్థానంలోని విలువనైనా లెక్కించవచ్చు.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Linear Term Formula (dn + c)",
        hi: "फास्ट-ट्रैक: रैखिक पद सूत्र (dn + c)",
        te: "ఫాస్ట్-ట్రాక్: రేఖీయ పద సూత్రం (dn + c)",
        reviewed: false
      },
      explanation: {
        en: "For any sequence with constant common difference d, the nth term is given by T(n) = dn + (first_term - d). If d = 3 and T(1) = 4, then T(n) = 3n + 1.",
        hi: "समान अंतर d वाले किसी भी अनुक्रम के लिए, nवाँ पद T(n) = dn + (पहला पद - d) होता है। यदि d = 3 और T(1) = 4 है, तो T(n) = 3n + 1।",
        te: "స్థిరమైన ఉమ్మడి భేదం d కలిగిన శ్రేణిలో nవ పదం T(n) = dn + (మొదటి పదం - d). d = 3 మరియు T(1) = 4 అయితే, T(n) = 3n + 1.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the 10th term of the sequence: 4, 7, 10, 13, ...",
          hi: "अनुक्रम 4, 7, 10, 13, ... का 10वाँ पद ज्ञात कीजिए।",
          te: "4, 7, 10, 13, ... శ్రేణి యొక్క 10వ పదాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Common difference d = 3; rule is 3n + 1.",
            hi: "सार्व अंतर d = 3; नियम 3n + 1 है।",
            te: "ఉమ్మడి భేదం d = 3; సూత్రం 3n + 1.",
            reviewed: false
          },
          {
            en: "For n = 10: 3(10) + 1 = 30 + 1 = 31.",
            hi: "n = 10 के लिए: 3(10) + 1 = 30 + 1 = 31।",
            te: "n = 10 కోసం: 3(10) + 1 = 30 + 1 = 31.",
            reviewed: false
          }
        ],
        solution: {
          en: "31",
          hi: "31",
          te: "31",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Direct substitution into the nth term formula computes distant terms instantly.",
        hi: "nवें पद के सूत्र में सीधा मान रखने से दूर के पद तुरंत प्राप्त हो जाते हैं।",
        te: "nవ పద సూత్రంలో నేరుగా ప్రతిక్షేపించడం ద్వారా దూరపు పదాలను క్షణాల్లో కనుగొనవచ్చు.",
        reviewed: false
      }
    }
  },

  // 2. Class 6 - Chapter 2: Lines and Angles (c6-geo-01)
  {
    conceptId: "c6-geo-01",
    basics_first: {
      headline: {
        en: "Basics-First: Points, Lines, Rays, and Angles",
        hi: "बुनियादी दृष्टिकोण: बिंदु, रेखाएं, किरणें और कोण",
        te: "ప్రాథమిక విధానం: బిందువులు, రేఖలు, కిరణాలు మరియు కోణాలు",
        reviewed: false
      },
      explanation: {
        en: "A line segment has two fixed end points. A ray starts at one point and goes forever in one direction. A line extends endlessly in both directions. When two rays share a common starting point (called the vertex), they form an angle.",
        hi: "एक रेखाखंड के दो निश्चित अंत बिंदु होते हैं। एक किरण एक बिंदु से शुरू होकर एक दिशा में अनिश्चित काल तक जाती है। एक रेखा दोनों दिशाओं में अंतहीन रूप से फैली होती है। जब दो किरणें एक ही उभयनिष्ठ प्रारंभिक बिंदु (शीर्ष) से निकलती हैं, तो वे एक कोण बनाती हैं।",
        te: "రేఖాఖండానికి రెండు చివరి బిందువులు ఉంటాయి. కిరణం ఒక బిందువు వద్ద ప్రారంభమై ఒకే దిశలో అనంతంగా సాగుతుంది. సరళరేఖ రెండు వైపులా అనంతంగా విస్తరిస్తుంది. రెండు కిరణాలు ఒకే శీర్షం వద్ద కలిసినప్పుడు కోణం ఏర్పడుతుంది.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Opening a pair of scissors or a book creates an angle at the hinge. An open book with perpendicular pages forms a 90° right angle.",
        hi: "कैंची या किताब खोलने पर कब्जे पर एक कोण बनता है। लंबवत पन्नों वाली खुली किताब 90° का समकोण बनाती है।",
        te: "కత్తెర లేదా పుస్తకాన్ని తెరిచినప్పుడు కీలు వద్ద కోణం ఏర్పడుతుంది. లంబంగా తెరిచిన పుస్తకం 90° లంబ కోణాన్ని చూపుతుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "An angle measures 65°. Is it acute, right, obtuse, or straight?",
          hi: "एक कोण का माप 65° है। यह न्यूनकोण, समकोण, अधिककोण या ऋजुकोण में से क्या है?",
          te: "ఒక కోణం కొలత 65°. ఇది అల్పకోణమా, లంబకోణమా, అధికకోణమా లేదా సరళకోణమా?",
          reviewed: false
        },
        steps: [
          {
            en: "Recall: An acute angle is strictly between 0° and 90°.",
            hi: "याद रखें: न्यूनकोण 0° और 90° के बीच होता है।",
            te: "గుర్తుచేసుకోండి: అల్పకోణం 0° మరియు 90° ల మధ్య ఉంటుంది.",
            reviewed: false
          },
          {
            en: "65° is greater than 0° and less than 90°.",
            hi: "65° का मान 0° से अधिक और 90° से कम है।",
            te: "65° అనేది 0° కంటే ఎక్కువ మరియు 90° కంటే తక్కువ.",
            reviewed: false
          }
        ],
        solution: {
          en: "Acute angle",
          hi: "न्यूनकोण",
          te: "అల్పకోణం",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Angles less than 90° are acute; exactly 90° is a right angle; between 90° and 180° is obtuse.",
        hi: "90° से छोटे कोण न्यूनकोण होते हैं; 90° समकोण होता है; 90° और 180° के बीच अधिककोण होता है।",
        te: "90° కంటే తక్కువ ఉంటే అల్పకోణం; సరిగ్గా 90° ఉంటే లంబకోణం; 90° మరియు 180° మధ్య ఉంటే అధికకోణం.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Measuring and Classifying Angles",
        hi: "मानक दृष्टिकोण: कोणों को मापना और उनका वर्गीकरण",
        te: "ప్రామాణిక విధానం: కోణాల కొలత మరియు వర్గీకరణ",
        reviewed: false
      },
      explanation: {
        en: "Angles are measured in degrees (°). A complete revolution is 360°. A straight line forms a straight angle of 180°. Two angles are called complementary if their sum is 90°, and supplementary if their sum is 180°.",
        hi: "कोणों को डिग्री (°) में मापा जाता है। एक पूरा चक्कर 360° का होता है। एक सीधी रेखा 180° का ऋजुकोण बनाती है। यदि दो कोणों का योग 90° हो तो वे पूरक कोण कहलाते हैं, और यदि योग 180° हो तो वे संपूरक कोण कहलाते हैं।",
        te: "కోణాలను డిగ్రీలలో (°) కొలుస్తారు. ఒక పూర్తి భ్రమణం 360°. సరళరేఖ 180° సరళ కోణాన్ని ఏర్పరుస్తుంది. రెండు కోణాల మొత్తం 90° అయితే అవి పూరక కోణాలు, 180° అయితే సంపూరక కోణాలు.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the supplement of an angle measuring 115°.",
          hi: "115° माप वाले कोण का संपूरक कोण ज्ञात कीजिए।",
          te: "115° కోణం యొక్క సంపూరక కోణాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Supplementary angles sum to 180°.",
            hi: "संपूरक कोणों का योग 180° होता है।",
            te: "సంపూరక కోణాల మొత్తం 180°.",
            reviewed: false
          },
          {
            en: "Subtract 115° from 180°: 180° - 115° = 65°.",
            hi: "180° में से 115° घटाएं: 180° - 115° = 65°।",
            te: "180° నుండి 115° తీసివేయండి: 180° - 115° = 65°.",
            reviewed: false
          }
        ],
        solution: {
          en: "65°",
          hi: "65°",
          te: "65°",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Supplementary angles add up to 180°, forming a straight line pair.",
        hi: "संपूरक कोणों का योग 180° होता है, जो एक सरल रेखीय युग्म बनाते हैं।",
        te: "సంపూరక కోణాల మొత్తం 180° అవుతుంది, ఇవి సరళరేఖపై ఉంటాయి.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Angle Pairs and Intersecting Lines",
        hi: "फास्ट-ट्रैक: कोण युग्म और प्रतिच्छेदी रेखाएं",
        te: "ఫాస్ట్-ట్రాక్: కోణాల జతలు మరియు ఖండన రేఖలు",
        reviewed: false
      },
      explanation: {
        en: "When two straight lines intersect, they form two pairs of vertically opposite angles, which are always equal. Adjacent angles on a straight line are supplementary (sum = 180°).",
        hi: "जब दो सीधी रेखाएं प्रतिच्छेद करती हैं, तो शीर्षाभिमुख कोणों के दो युग्म बनते हैं, जो हमेशा बराबर होते हैं। एक सरल रेखा पर बने आसन्न कोणों का योग 180° होता है।",
        te: "రెండు సరళరేఖలు ఖండించుకున్నప్పుడు శీర్షాభిముఖ కోణాలు సమానంగా ఉంటాయి. సరళరేఖపై ఉన్న ఆసన్న కోణాల మొత్తం 180°.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Two intersecting lines form an angle of 70°. What is the measure of the vertically opposite angle?",
          hi: "दो प्रतिच्छेदी रेखाएं 70° का एक कोण बनाती हैं। उसके शीर्षाभिमुख कोण का माप क्या है?",
          te: "రెండు ఖండన రేఖలు ఒక కోణాన్ని 70° గా ఏర్పరిస్తే, దాని శీర్షాభిముఖ కోణం ఎంత?",
          reviewed: false
        },
        steps: [
          {
            en: "Vertically opposite angles are equal.",
            hi: "शीर्षाभिमुख कोण सदैव बराबर होते हैं।",
            te: "శీర్షాభిముఖ కోణాలు సమానంగా ఉంటాయి.",
            reviewed: false
          },
          {
            en: "Therefore, the vertically opposite angle is also 70°.",
            hi: "अतः शीर्षाभिमुख कोण भी 70° होगा।",
            te: "కాబట్టి ఎదురుగా ఉండే శీర్షాభిముఖ కోణం కూడా 70° అవుతుంది.",
            reviewed: false
          }
        ],
        solution: {
          en: "70°",
          hi: "70°",
          te: "70°",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Vertically opposite angles are identical; linear pair angles sum to 180°.",
        hi: "शीर्षाभिमुख कोण समान होते हैं; रेखीय युग्म कोणों का योग 180° होता है।",
        te: "శీర్షాభిముఖ కోణాలు సమానం; సరళ జత కోణాల మొత్తం 180°.",
        reviewed: false
      }
    }
  },

  // 3. Class 7 - Chapter 1: Large Numbers Around Us (c7-num-01)
  {
    conceptId: "c7-num-01",
    basics_first: {
      headline: {
        en: "Basics-First: Understanding Large Numbers and Place Value",
        hi: "बुनियादी दृष्टिकोण: बड़ी संख्याओं और स्थानीय मान को समझना",
        te: "ప్రాథమిక విధానం: పెద్ద సంఖ్యలు మరియు స్థాన విలువల అవగాహన",
        reviewed: false
      },
      explanation: {
        en: "Large numbers help us measure populations, distances between planets, and national budgets. Each digit in a number has a place value determined by its position. Every step to the left multiplies the place value by 10.",
        hi: "बड़ी संख्याएँ हमें जनसंख्या, ग्रहों के बीच की दूरी और राष्ट्रीय बजट मापने में मदद करती हैं। किसी संख्या में प्रत्येक अंक का एक स्थानीय मान होता है। बाईं ओर प्रत्येक कदम स्थानीय मान को 10 गुना बढ़ा देता है।",
        te: "జనాభా, గ్రహాల మధ్య దూరాలు మరియు ప్రభుత్వ బడ్జెట్లను లెక్కించడానికి పెద్ద సంఖ్యలు సహాయపడతాయి. స్థానాన్ని బట్టి ప్రతి అంకెకు స్థాన విలువ ఉంటుంది. ఎడమవైపుకు వెళ్లే కొద్దీ స్థాన విలువ 10 రెట్లు పెరుగుతుంది.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Currency denominations: ten ₹10 notes make ₹100; ten ₹100 notes make ₹1,000; one hundred ₹1,000 makes ₹1,00,000 (1 Lakh).",
        hi: "मुद्रा नोट: दस ₹10 के नोट ₹100 बनाते हैं; दस ₹100 के नोट ₹1,000 बनाते हैं; सौ ₹1,000 के नोट ₹1,00,000 (1 लाख) बनाते हैं।",
        te: "కరెన్సీ నోట్లు: పది ₹10 నోట్లు ₹100 అవుతాయి; పది ₹100 నోట్లు ₹1,000 అవుతాయి; వంద ₹1,000 నోట్లు ₹1,00,000 (1 లక్ష) అవుతాయి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "How many thousands make 1 Lakh?",
          hi: "1 लाख में कितने हजार होते हैं?",
          te: "1 లక్షలో ఎన్ని వేలు ఉంటాయి?",
          reviewed: false
        },
        steps: [
          {
            en: "1 Lakh = 1,00,000.",
            hi: "1 लाख = 1,00,000।",
            te: "1 లక్ష = 1,00,000.",
            reviewed: false
          },
          {
            en: "1 Thousand = 1,000.",
            hi: "1 हजार = 1,000।",
            te: "1 వేయి = 1,000.",
            reviewed: false
          },
          {
            en: "Divide: 1,00,000 / 1,000 = 100.",
            hi: "भाग दें: 1,00,000 / 1,000 = 100।",
            te: "భాగించండి: 1,00,000 / 1,000 = 100.",
            reviewed: false
          }
        ],
        solution: {
          en: "100 thousands",
          hi: "100 हजार",
          te: "100 వేలు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "1 Lakh has 5 zeroes (1,00,000) and equals 100 thousands.",
        hi: "1 लाख में 5 शून्य होते हैं (1,00,000) और यह 100 हजार के बराबर होता है।",
        te: "1 లక్షలో 5 సున్నాలు ఉంటాయి (1,00,000), ఇది 100 వేలకు సమానం.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Indian vs International Place Value Systems",
        hi: "मानक दृष्टिकोण: भारतीय बनाम अंतर्राष्ट्रीय स्थानीय मान प्रणाली",
        te: "ప్రామాణిక విధానం: భారతీయ మరియు అంతర్జాతీయ సంఖ్యా మానాలు",
        reviewed: false
      },
      explanation: {
        en: "In the Indian system, commas are placed after the hundreds period (3 digits), and then after every 2 digits (Lakhs, Crores): e.g. 12,34,567. In the International system, commas are placed after every 3 digits (Thousands, Millions, Billions): e.g. 1,234,567. 1 Million equals 10 Lakhs, and 1 Crore equals 10 Millions.",
        hi: "भारतीय प्रणाली में अल्पविराम पहले 3 अंकों (सैकड़ा) के बाद, फिर प्रत्येक 2 अंकों (लाख, करोड़) के बाद आता है: जैसे 12,34,567। अंतर्राष्ट्रीय प्रणाली में प्रत्येक 3 अंकों (हजार, मिलियन) के बाद अल्पविराम आता है: जैसे 1,234,567। 1 मिलियन = 10 लाख और 1 करोड़ = 10 मिलियन।",
        te: "భారతీయ విధానంలో మొదటి కామా 3 అంకెల తర్వాత, ఆపై ప్రతి 2 అంకెలకి వస్తుంది: ఉదా 12,34,567. అంతర్జాతీయ విధానంలో ప్రతి 3 అంకెలకి కామా వస్తుంది: ఉదా 1,234,567. 1 మిలియన్ = 10 లక్షలు, 1 కోటి = 10 మిలియన్లు.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Convert 50 Million into the Indian numeral system (Crores/Lakhs).",
          hi: "50 मिलियन को भारतीय संख्या प्रणाली (करोड़/लाख) में बदलिए।",
          te: "50 మిలియన్లను భారతీయ సంఖ్యా మానంలోకి (కోట్లు/లక్షలు) మార్చండి.",
          reviewed: false
        },
        steps: [
          {
            en: "10 Million = 1 Crore.",
            hi: "10 मिलियन = 1 करोड़।",
            te: "10 మిలియన్లు = 1 కోటి.",
            reviewed: false
          },
          {
            en: "Divide 50 Million by 10: 50 / 10 = 5 Crores.",
            hi: "50 मिलियन को 10 से भाग दें: 50 / 10 = 5 करोड़।",
            te: "50 మిలియన్లను 10 తో భాగించండి: 50 / 10 = 5 కోట్లు.",
            reviewed: false
          }
        ],
        solution: {
          en: "5 Crores",
          hi: "5 करोड़",
          te: "5 కోట్లు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "1 Million = 10 Lakhs (10⁶) and 10 Millions = 1 Crore (10⁷).",
        hi: "1 मिलियन = 10 लाख (10⁶) और 10 मिलियन = 1 करोड़ (10⁷)।",
        te: "1 మిలియన్ = 10 లక్షలు (10⁶) మరియు 10 మిలియన్లు = 1 కోటి (10⁷).",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Powers of 10 and Scientific Notation",
        hi: "फास्ट-ट्रैक: 10 की घातें और मानक वैज्ञानिक रूप",
        te: "ఫాస్ట్-ట్రాక్: 10 యొక్క ఘాతాలు మరియు శాస్త్రీయ సంకేతం",
        reviewed: false
      },
      explanation: {
        en: "Very large numbers are compactly written as m × 10ᵏ, where 1 ≤ m < 10 and k is an integer. 1 Crore = 10,000,000 = 10⁷. The population of India (approx. 1.4 billion) is 1.4 × 10⁹.",
        hi: "अत्यधिक बड़ी संख्याओं को m × 10ᵏ के रूप में संक्षेप में लिखा जाता है, जहाँ 1 ≤ m < 10। 1 करोड़ = 10⁷। भारत की जनसंख्या (लगभग 1.4 अरब) 1.4 × 10⁹ है।",
        te: "చాలా పెద్ద సంఖ్యలను m × 10ᵏ రూపంలో సూచిస్తారు, ఇక్కడ 1 ≤ m < 10. 1 కోటి = 10⁷. భారతదేశ జనాభా (సుమారు 140 కోట్లు) 1.4 × 10⁹.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Express 75,000,000 in standard scientific form.",
          hi: "75,000,000 को मानक वैज्ञानिक रूप में व्यक्त कीजिए।",
          te: "75,000,000 ను ప్రామాణిక శాస్త్రీయ రూపంలో రాయండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Place decimal point after first non-zero digit: 7.5.",
            hi: "पहले गैर-शून्य अंक के बाद दशमलव बिंदु लगाएं: 7.5।",
            te: "మొదటి సున్నాయేతర అంకె తర్వాత దశాంశ బిందువును ఉంచండి: 7.5.",
            reviewed: false
          },
          {
            en: "Count places moved from the right: 7 decimal places.",
            hi: "दाएं से खिसकाए गए स्थानों की गिनती करें: 7 स्थान।",
            te: "కుడి నుండి జరిపిన స్థానాలను లెక్కించండి: 7 స్థానాలు.",
            reviewed: false
          }
        ],
        solution: {
          en: "7.5 × 10⁷",
          hi: "7.5 × 10⁷",
          te: "7.5 × 10⁷",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Moving the decimal left counts positive powers of 10.",
        hi: "दशमलव को बाईं ओर ले जाने पर 10 की धनात्मक घात बढ़ती है।",
        te: "దశాంశ బిందువును ఎడమవైపు జరిపినప్పుడు 10 యొక్క ధన ఘాతాలు వస్తాయి.",
        reviewed: false
      }
    }
  },

  // 4. Class 7 - Chapter 2: Arithmetic Expressions (c7-alg-01)
  {
    conceptId: "c7-alg-01",
    basics_first: {
      headline: {
        en: "Basics-First: Order of Operations (BODMAS)",
        hi: "बुनियादी दृष्टिकोण: संक्रियाओं का क्रम (BODMAS)",
        te: "ప్రాథమిక విధానం: పరిక్రియల క్రమం (BODMAS)",
        reviewed: false
      },
      explanation: {
        en: "When a calculation has more than one operation (+, -, ×, ÷), we must follow an agreed rule so everyone gets the same answer. The rule is BODMAS: Brackets first, then Orders (powers), then Division & Multiplication (left to right), and finally Addition & Subtraction (left to right).",
        hi: "जब किसी गणना में एक से अधिक संक्रियाएँ (+, -, ×, ÷) होती हैं, तो हमें एक निश्चित नियम का पालन करना होता है ताकि सभी का उत्तर समान आए। यह नियम BODMAS है: पहले कोष्ठक (Brackets), फिर घात (Orders), फिर भाग और गुणा, अंत में जोड़ और घटाव।",
        te: "ఒక లెక్కలో ఒకటి కంటే ఎక్కువ గుర్తులు (+, -, ×, ÷) ఉన్నప్పుడు, అందరికీ ఒకే సమాధానం రావడానికి BODMAS నియమాన్ని పాటిస్తాం: బ్రాకెట్లు మొదట, తర్వాత ఘాతాలు, భాగహారం & గుణకారం, చివరగా సంకలనం & వ్యవకలనం.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Traffic priority rules: emergency vehicles (brackets) go first, then highway traffic (multiplication/division), then side streets (addition/subtraction).",
        hi: "यातायात नियम: एम्बुलेंस (कोष्ठक) पहले जाएगी, फिर मुख्य सड़क का ट्रैफिक (गुणा/भाग), फिर साइड की सड़कें (जोड़/घटाव)।",
        te: "ట్రాఫిక్ నియమం: అంబులెన్స్ (బ్రాకెట్లు) మొదట వెళ్తుంది, తర్వాత ప్రధాన రహదారి వాహనాలు (గుణకారం/భాగహారం), చివరగా చిన్న వీధులు (కూడిక/తీసివేత).",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Evaluate: 18 - 3 × 4 + 2",
          hi: "मान ज्ञात कीजिए: 18 - 3 × 4 + 2",
          te: "విలువను కనుగొనండి: 18 - 3 × 4 + 2",
          reviewed: false
        },
        steps: [
          {
            en: "Perform multiplication first: 3 × 4 = 12.",
            hi: "पहले गुणा करें: 3 × 4 = 12।",
            te: "ముందుగా గుణకారం చేయండి: 3 × 4 = 12.",
            reviewed: false
          },
          {
            en: "Substitute back: 18 - 12 + 2.",
            hi: "व्यंजक में रखें: 18 - 12 + 2।",
            te: "తిరిగి ప్రతిక్షేపించండి: 18 - 12 + 2.",
            reviewed: false
          },
          {
            en: "Calculate left to right: 18 - 12 = 6, and 6 + 2 = 8.",
            hi: "बाएं से दाएं हल करें: 18 - 12 = 6, और 6 + 2 = 8।",
            te: "ఎడమ నుండి కుడికి లెక్కించండి: 18 - 12 = 6, మరియు 6 + 2 = 8.",
            reviewed: false
          }
        ],
        solution: {
          en: "8",
          hi: "8",
          te: "8",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Always multiply and divide before adding and subtracting.",
        hi: "जोड़ने और घटाने से पहले हमेशा गुणा और भाग करें।",
        te: "కూడిక మరియు తీసివేతలకు ముందే గుణకారం, భాగహారాలు చేయాలి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Working with Nested Brackets and Grouping",
        hi: "मानक दृष्टिकोण: कोष्ठकों के प्रकार और समूहन",
        te: "ప్రామాణిక విధానం: బ్రాకెట్ల రకాలు మరియు సమూహం",
        reviewed: false
      },
      explanation: {
        en: "Brackets override normal precedence. When brackets are nested inside each other, always evaluate from the innermost brackets outward: round brackets ( ), then curly brackets { }, then square brackets [ ]. A negative sign outside a bracket changes the sign of every term inside when expanded.",
        hi: "कोष्ठक सामान्य प्राथमिकता को बदलते हैं। जब कोष्ठक एक दूसरे के अंदर हों, तो सबसे अंदर वाले कोष्ठक ( ) से शुरू करें, फिर मझोले { }, और अंत में बड़े कोष्ठक [ ] को हल करें। कोष्ठक के बाहर ऋण चिह्न अंदर के सभी चिह्नों को बदल देता है।",
        te: "బ్రాకెట్లు సాధారణ ప్రాధాన్యతను మారుస్తాయి. బ్రాకెట్ లోపల బ్రాకెట్ ఉన్నప్పుడు, అన్నిటికంటే లోపలి గుండ్రని బ్రాకెట్ ( ), తర్వాత పుష్ప బ్రాకెట్ { }, చివరగా చతురస్ర బ్రాకెట్ [ ] పూర్తిచేయాలి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Simplify: 25 - [10 + {8 - (6 - 2)}]",
          hi: "सरल कीजिए: 25 - [10 + {8 - (6 - 2)}]",
          te: "సూక్ష్మీకరించండి: 25 - [10 + {8 - (6 - 2)}]",
          reviewed: false
        },
        steps: [
          {
            en: "Innermost round bracket: 6 - 2 = 4.",
            hi: "सबसे अंदर का छोटा कोष्ठक: 6 - 2 = 4।",
            te: "లోపలి గుండ్రని బ్రాకెట్: 6 - 2 = 4.",
            reviewed: false
          },
          {
            en: "Curly bracket: 8 - 4 = 4.",
            hi: "मझोला कोष्ठक: 8 - 4 = 4।",
            te: "పుష్ప బ్రాకెట్: 8 - 4 = 4.",
            reviewed: false
          },
          {
            en: "Square bracket: 10 + 4 = 14.",
            hi: "बड़ा कोष्ठक: 10 + 4 = 14।",
            te: "చతురస్ర బ్రాకెట్: 10 + 4 = 14.",
            reviewed: false
          },
          {
            en: "Final subtraction: 25 - 14 = 11.",
            hi: "अंतिम घटाव: 25 - 14 = 11।",
            te: "చివరి తీసివేత: 25 - 14 = 11.",
            reviewed: false
          }
        ],
        solution: {
          en: "11",
          hi: "11",
          te: "11",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Solve from inside out: ( ) first, then { }, then [ ].",
        hi: "अंदर से बाहर की ओर हल करें: पहले ( ), फिर { }, फिर [ ]।",
        te: "లోపలి నుండి బయటకు సాధించండి: మొదట ( ), తర్వాత { }, ఆపై [ ].",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Translating Word Problems to Expressions",
        hi: "फास्ट-ट्रैक: शाब्दिक समस्याओं को व्यंजक में बदलना",
        te: "ఫాస్ట్-ట్రాక్: రాతపూర్వక లెక్కలను సమాసాలుగా మార్చడం",
        reviewed: false
      },
      explanation: {
        en: "Translating words to algebraic expressions: '5 more than twice a number' is 2x + 5. 'Product of the sum of a and b with their difference' is (a + b)(a - b). Pay close attention to grouping words like 'sum of ... multiplied by'.",
        hi: "शब्दों को बीजीय व्यंजक में बदलना: 'किसी संख्या के दोगुने से 5 अधिक' 2x + 5 है। 'a और b के योग तथा उनके अंतर का गुणनफल' (a + b)(a - b) है।",
        te: "పదాలను బీజగణిత సమాసాలుగా మార్చడం: 'ఒక సంఖ్య యొక్క రెట్టింపు కంటే 5 ఎక్కువ' అంటే 2x + 5. 'a మరియు b ల మొత్తం, భేదాల లబ్ధం' అంటే (a + b)(a - b).",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Write an expression for: 'Subtract 7 from the product of 4 and 9, then divide by 5'.",
          hi: "व्यंजक लिखिए: '4 और 9 के गुणनफल में से 7 घटाएं, फिर 5 से भाग दें'।",
          te: "సమాసాన్ని రాయండి: '4 మరియు 9 ల లబ్ధం నుండి 7 తీసివేసి, ఆపై 5 తో భాగించండి'.",
          reviewed: false
        },
        steps: [
          {
            en: "Product of 4 and 9: (4 × 9).",
            hi: "4 और 9 का गुणनफल: (4 × 9)।",
            te: "4 మరియు 9 ల లబ్ధం: (4 × 9).",
            reviewed: false
          },
          {
            en: "Subtract 7: (4 × 9) - 7.",
            hi: "7 घटाएं: (4 × 9) - 7।",
            te: "7 తీసివేయండి: (4 × 9) - 7.",
            reviewed: false
          },
          {
            en: "Divide entire result by 5: [(4 × 9) - 7] ÷ 5.",
            hi: "परिणाम को 5 से भाग दें: [(4 × 9) - 7] ÷ 5।",
            te: "మొత్తం ఫలితాన్ని 5 తో భాగించండి: [(4 × 9) - 7] ÷ 5.",
            reviewed: false
          }
        ],
        solution: {
          en: "[(4 × 9) - 7] ÷ 5 (which evaluates to 29/5 = 5.8)",
          hi: "[(4 × 9) - 7] ÷ 5 (मान = 29/5 = 5.8)",
          te: "[(4 × 9) - 7] ÷ 5 (విలువ = 29/5 = 5.8)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Use brackets to enforce order when word problems group operations before division or multiplication.",
        hi: "जब शाब्दिक समस्याओं में भाग या गुणा से पहले किसी संक्रिया का समूहन हो, तो कोष्ठक का उपयोग करें।",
        te: "పదాల లెక్కల్లో నిర్దిష్ట క్రమాన్ని పాటించడానికి బ్రాకెట్లను ఉపయోగించండి.",
        reviewed: false
      }
    }
  },

  // 5. Class 8 - Chapter 1: A Square and a Cube (c8-sqr-01)
  {
    conceptId: "c8-sqr-01",
    basics_first: {
      headline: {
        en: "Basics-First: Perfect Squares and Square Roots",
        hi: "बुनियादी दृष्टिकोण: पूर्ण वर्ग और वर्गमूल",
        te: "ప్రాథమిక విధానం: పరిపూర్ణ వర్గాలు మరియు వర్గమూలాలు",
        reviewed: false
      },
      explanation: {
        en: "When a number is multiplied by itself, the product is called a square number. For instance, 6 × 6 = 36, so 36 is a square of 6. The reverse operation is finding the square root: √36 = 6. Square numbers can always be arranged as a square grid of dots.",
        hi: "जब किसी संख्या को उसी से गुणा किया जाता है, तो प्राप्त गुणनफल को वर्ग संख्या कहते हैं। उदाहरण के लिए, 6 × 6 = 36, इसलिए 36 संख्या 6 का वर्ग है। इसकी विपरीत क्रिया वर्गमूल निकालना है: √36 = 6।",
        te: "ఒక సంఖ్యను అదే సంఖ్యతో గుణించినప్పుడు వచ్చే ఫలితాన్ని వర్గ సంఖ్య అంటారు. ఉదాహరణకు, 6 × 6 = 36, కాబట్టి 36 అనేది 6 యొక్క వర్గం. దీని వ్యతిరేక ప్రక్రియ వర్గమూలం: √36 = 6.",
        reviewed: false
      },
      visualAnalogy: {
        en: "A square chessboard with 8 rows and 8 columns has 8 × 8 = 64 small squares.",
        hi: "8 पंक्तियों और 8 स्तंभों वाले शतरंज के बोर्ड में 8 × 8 = 64 छोटे वर्ग होते हैं।",
        te: "8 అడ్డు వరుసలు, 8 నిలువు వరుసలు ఉన్న చదరంగం బోర్డులో 8 × 8 = 64 గడులు ఉంటాయి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Which of these is a perfect square: 45, 64, or 72?",
          hi: "इनमें से कौन सी एक पूर्ण वर्ग संख्या है: 45, 64, या 72?",
          te: "వీటిలో పరిపూర్ణ వర్గ సంఖ్య ఏది: 45, 64, లేదా 72?",
          reviewed: false
        },
        steps: [
          {
            en: "Test integer squares: 6² = 36, 7² = 49 (so 45 is not a square).",
            hi: "पूर्णांक वर्गों की जाँच करें: 6² = 36, 7² = 49 (अतः 45 वर्ग नहीं है)।",
            te: "వర్గాలను సరిచూడండి: 6² = 36, 7² = 49 (కాబట్టి 45 వర్గం కాదు).",
            reviewed: false
          },
          {
            en: "Test 8: 8 × 8 = 64. 64 is exactly 8².",
            hi: "8 की जाँच करें: 8 × 8 = 64। 64 ठीक 8² है।",
            te: "8 ని చూడండి: 8 × 8 = 64. 64 అనేది ఖచ్చితంగా 8².",
            reviewed: false
          }
        ],
        solution: {
          en: "64",
          hi: "64",
          te: "64",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "A perfect square is the product of an integer multiplied by itself.",
        hi: "पूर्ण वर्ग किसी पूर्णांक को उसी से गुणा करने पर प्राप्त संख्या होती है।",
        te: "ఒక పూర్ణ సంఖ్యను అదే సంఖ్యతో గుణిస్తే వచ్చే సంఖ్యే పరిపూర్ణ వర్గం.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Prime Factorisation Method for Square Roots and Cubes",
        hi: "मानक दृष्टिकोण: वर्गमूल और घनमूल के लिए अभाज्य गुणनखंडन विधि",
        te: "ప్రామాణిక విధానం: వర్గమూలాలు మరియు ఘనమూలాల కోసం ప్రధాన కారణాంక విభజన",
        reviewed: false
      },
      explanation: {
        en: "To find the square root of a number, break it into prime factors and group identical factors in pairs (twos). For cube roots, group identical factors in triplets (threes). If all factors pair up completely, the number is a perfect square; if all group in triplets, it is a perfect cube.",
        hi: "किसी संख्या का वर्गमूल निकालने के लिए, उसके अभाज्य गुणनखंड बनाएं और समान गुणनखंडों के जोड़े (दो-दो) बनाएं। घनमूल के लिए तीन-तीन के समूह बनाएं। यदि सभी गुणनखंडों के जोड़े बन जाते हैं, तो वह पूर्ण वर्ग है।",
        te: "ఒక సంఖ్య యొక్క వర్గమూలాన్ని కనుగొనడానికి, దానిని ప్రధాన కారణాంకాలుగా విభజించి సమాన కారణాంకాలను జతలుగా (రెండు చొప్పున) సమూహపరచాలి. ఘనమూలం కోసం మూడేసి చొప్పున సమూహపరచాలి.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the cube root of 216 by prime factorisation.",
          hi: "अभाज्य गुणनखंडन द्वारा 216 का घनमूल ज्ञात कीजिए।",
          te: "ప్రధాన కారణాంక విభజన పద్ధతి ద్వారా 216 ఘనమూలాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Factorise 216: 216 = 2 × 2 × 2 × 3 × 3 × 3.",
            hi: "216 के गुणनखंड करें: 216 = 2 × 2 × 2 × 3 × 3 × 3।",
            te: "216 ను కారణాంకాలుగా రాయండి: 216 = 2 × 2 × 2 × 3 × 3 × 3.",
            reviewed: false
          },
          {
            en: "Group into triplets: (2 × 2 × 2) and (3 × 3 × 3).",
            hi: "तीन-तीन के समूह बनाएं: (2 × 2 × 2) और (3 × 3 × 3)।",
            te: "మూడేసి చొప్పున సమూహపరచండి: (2 × 2 × 2) మరియు (3 × 3 × 3).",
            reviewed: false
          },
          {
            en: "Take one from each group: ∛216 = 2 × 3 = 6.",
            hi: "प्रत्येक समूह से एक लें: ∛216 = 2 × 3 = 6।",
            te: "ప్రతి సమూహం నుండి ఒకటి తీసుకోండి: ∛216 = 2 × 3 = 6.",
            reviewed: false
          }
        ],
        solution: {
          en: "6",
          hi: "6",
          te: "6",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Pairs of prime factors give square roots; triplets give cube roots.",
        hi: "अभाज्य गुणनखंडों के जोड़े वर्गमूल देते हैं; तीन के समूह घनमूल देते हैं।",
        te: "ప్రధాన కారణాంకాల జతలు వర్గమూలాన్ని, త్రయాలు ఘనమూలాన్ని ఇస్తాయి.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Patterns and Unit Digits in Squares",
        hi: "फास्ट-ट्रैक: वर्गों में पैटर्न और इकाई अंक",
        te: "ఫాస్ట్-ట్రాక్: వర్గాలలో నమూనాలు మరియు ఒకట్ల స్థాన అంకెలు",
        reviewed: false
      },
      explanation: {
        en: "Square numbers can only end in 0, 1, 4, 5, 6, or 9. A number ending in 2, 3, 7, or 8 is NEVER a perfect square! Also, the square of an odd number is always odd, and the square of an even number is always even.",
        hi: "पूर्ण वर्ग संख्याओं का इकाई अंक केवल 0, 1, 4, 5, 6 या 9 हो सकता है। 2, 3, 7 या 8 पर समाप्त होने वाली संख्या कभी भी पूर्ण वर्ग नहीं हो सकती! विषम संख्या का वर्ग विषम और सम का वर्ग सम होता है।",
        te: "పరిపూర్ణ వర్గ సంఖ్యలు ఎల్లప్పుడూ 0, 1, 4, 5, 6, లేదా 9 తో మాత్రమే అంతమవుతాయి. 2, 3, 7, 8 తో అంతమయ్యే సంఖ్యలు ఎప్పటికీ పరిపూర్ణ వర్గాలు కావు!",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Without calculating, can 1,057 be a perfect square?",
          hi: "बिना गणना किए बताएं, क्या 1,057 एक पूर्ण वर्ग हो सकता है?",
          te: "లెక్కించకుండా చెప్పండి, 1,057 పరిపూర్ణ వర్గం కాగలదా?",
          reviewed: false
        },
        steps: [
          {
            en: "Examine the unit digit: 7.",
            hi: "इकाई अंक देखें: 7।",
            te: "ఒకట్ల స్థానంలోని అంకెను చూడండి: 7.",
            reviewed: false
          },
          {
            en: "No square number ends with 2, 3, 7, or 8.",
            hi: "कोई भी वर्ग संख्या 2, 3, 7 या 8 पर समाप्त नहीं होती।",
            te: "ఏ పరిపూర్ణ వర్గం కూడా 2, 3, 7, 8 లతో ముగియదు.",
            reviewed: false
          }
        ],
        solution: {
          en: "No, because it ends in 7.",
          hi: "नहीं, क्योंकि इसका इकाई अंक 7 है।",
          te: "కాదు, ఎందుకంటే దీని ఒకట్ల స్థానంలో 7 ఉంది.",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Numbers ending in 2, 3, 7, 8 are never perfect squares.",
        hi: "2, 3, 7, 8 पर समाप्त होने वाली संख्याएँ कभी पूर्ण वर्ग नहीं होतीं।",
        te: "2, 3, 7, 8 లతో ముగిసే సంఖ్యలు ఎన్నటికీ పరిపూర్ణ వర్గాలు కావు.",
        reviewed: false
      }
    }
  },

  // 6. Class 8 - Chapter 2: Power Play (c8-exp-01)
  {
    conceptId: "c8-exp-01",
    basics_first: {
      headline: {
        en: "Basics-First: Exponents and Repeated Multiplication",
        hi: "बुनियादी दृष्टिकोण: घातांक और बार-बार गुणा",
        te: "ప్రాథమిక విధానం: ఘాతాంకాలు మరియు పునరావృత గుణకారం",
        reviewed: false
      },
      explanation: {
        en: "Repeated multiplication of the same number can be written compactly using exponents. In the expression 3⁴, 3 is the base and 4 is the exponent (or power). It means multiply 3 by itself 4 times: 3 × 3 × 3 × 3 = 81.",
        hi: "एक ही संख्या के बार-बार गुणा को घातांकों द्वारा संक्षेप में लिखा जा सकता है। व्यंजक 3⁴ में, 3 आधार (base) है और 4 घातांक (power) है। इसका अर्थ है 3 को स्वयं से 4 बार गुणा करना: 3 × 3 × 3 × 3 = 81।",
        te: "ఒకే సంఖ్యను మళ్లీ మళ్లీ గుణించడాన్ని ఘాతాంకాల ద్వారా సంక్షిప్తంగా రాయవచ్చు. 3⁴ లో 3 ని భూమి అని, 4 ని ఘాతం అని అంటారు. అంటే 3 ని 4 సార్లు గుణించాలి: 3 × 3 × 3 × 3 = 81.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Cell division: 1 cell splits into 2 (2¹), then into 4 (2²), then into 8 (2³), doubling at each generation.",
        hi: "कोशिका विभाजन: 1 कोशिका 2 में विभाजित होती है (2¹), फिर 4 में (2²), फिर 8 में (2³), प्रत्येक पीढ़ी में दोगुनी होती है।",
        te: "కణ విభజన: 1 కణం 2 గా (2¹), తర్వాత 4 గా (2²), తర్వాత 8 గా (2³) విభజించబడుతుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "What is the value of 2⁵?",
          hi: "2⁵ का मान क्या है?",
          te: "2⁵ విలువ ఎంత?",
          reviewed: false
        },
        steps: [
          {
            en: "Expand 2 multiplied 5 times: 2 × 2 × 2 × 2 × 2.",
            hi: "2 को 5 बार गुणा के रूप में लिखें: 2 × 2 × 2 × 2 × 2।",
            te: "2 ని 5 సార్లు గుణించండి: 2 × 2 × 2 × 2 × 2.",
            reviewed: false
          },
          {
            en: "Calculate step by step: 2×2=4, 4×2=8, 8×2=16, 16×2=32.",
            hi: "गणना करें: 2×2=4, 4×2=8, 8×2=16, 16×2=32।",
            te: "దశలవారీగా లెక్కించండి: 2×2=4, 4×2=8, 8×2=16, 16×2=32.",
            reviewed: false
          }
        ],
        solution: {
          en: "32",
          hi: "32",
          te: "32",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Base raised to exponent n means multiplying the base by itself n times.",
        hi: "आधार की घात n का अर्थ है आधार को स्वयं से n बार गुणा करना।",
        te: "భూమి యొక్క ఘాతం n అంటే ఆ భూమిని n సార్లు గుణించడం.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Laws of Exponents with the Same Base",
        hi: "मानक दृष्टिकोण: समान आधार वाले घातांकों के नियम",
        te: "ప్రామాణిక విధానం: సమాన భూములు కలిగిన ఘాతాంక న్యాయాలు",
        reviewed: false
      },
      explanation: {
        en: "Key exponent laws for non-zero base a: (1) Product rule: aᵐ × aⁿ = aᵐ⁺ⁿ. (2) Quotient rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. (3) Power of a power: (aᵐ)ⁿ = aᵐⁿ. (4) Zero exponent: a⁰ = 1. (5) Negative exponent: a⁻ⁿ = 1 / aⁿ.",
        hi: "शून्यतर आधार a के लिए मुख्य घातांक नियम: (1) गुणन नियम: aᵐ × aⁿ = aᵐ⁺ⁿ। (2) भाग नियम: aᵐ ÷ aⁿ = aᵐ⁻ⁿ। (3) घात की घात: (aᵐ)ⁿ = aᵐⁿ। (4) शून्य घात: a⁰ = 1। (5) ऋणात्मक घात: a⁻ⁿ = 1 / aⁿ।",
        te: "సున్నా కాని భూమి a కి ముఖ్యమైన ఘాతాంక న్యాయాలు: (1) లబ్ద న్యాయం: aᵐ × aⁿ = aᵐ⁺ⁿ. (2) భాగహార న్యాయం: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. (3) ఘాతం యొక్క ఘాతం: (aᵐ)ⁿ = aᵐⁿ. (4) సున్నా ఘాతం: a⁰ = 1. (5) ఋణ ఘాతం: a⁻ⁿ = 1 / aⁿ.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Simplify: (5³ × 5⁴) ÷ 5⁵",
          hi: "सरल कीजिए: (5³ × 5⁴) ÷ 5⁵",
          te: "సూక్ష్మీకరించండి: (5³ × 5⁴) ÷ 5⁵",
          reviewed: false
        },
        steps: [
          {
            en: "Multiply powers with same base by adding exponents: 5³ × 5⁴ = 5³⁺⁴ = 5⁷.",
            hi: "समान आधार वाली घातों को गुणा करते समय घातांक जोड़ें: 5³ × 5⁴ = 5³⁺⁴ = 5⁷।",
            te: "సమాన భూములు ఉన్నప్పుడు ఘాతాలను కలపండి: 5³ × 5⁴ = 5³⁺⁴ = 5⁷.",
            reviewed: false
          },
          {
            en: "Divide powers by subtracting exponents: 5⁷ ÷ 5⁵ = 5⁷⁻⁵ = 5².",
            hi: "भाग करते समय घातांक घटाएं: 5⁷ ÷ 5⁵ = 5⁷⁻⁵ = 5²।",
            te: "భాగహారంలో ఘాతాలను తీసివేయండి: 5⁷ ÷ 5⁵ = 5⁷⁻⁵ = 5².",
            reviewed: false
          },
          {
            en: "Evaluate 5² = 25.",
            hi: "5² = 25।",
            te: "5² = 25.",
            reviewed: false
          }
        ],
        solution: {
          en: "25",
          hi: "25",
          te: "25",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Multiply $\\rightarrow$ add exponents; Divide $\\rightarrow$ subtract exponents.",
        hi: "गुणा $\\rightarrow$ घातांक जोड़ें; भाग $\\rightarrow$ घातांक घटाएं।",
        te: "గుణకారం $\\rightarrow$ ఘాతాలను కలపండి; భాగహారం $\\rightarrow$ ఘాతాలను తీసివేయండి.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Negative Exponents and Reciprocals",
        hi: "फास्ट-ट्रैक: ऋणात्मक घातांक और व्युत्क्रम",
        te: "ఫాస్ట్-ట్రాక్: ఋణ ఘాతాంకాలు మరియు వ్యుత్క్రమాలు",
        reviewed: false
      },
      explanation: {
        en: "A negative exponent represents the reciprocal of the positive power: x⁻ⁿ = 1 / xⁿ. Similarly, (a/b)⁻ⁿ = (b/a)ⁿ. For example, 2⁻³ = 1 / 2³ = 1/8.",
        hi: "ऋणात्मक घातांक धनात्मक घात के व्युत्क्रम को दर्शाता है: x⁻ⁿ = 1 / xⁿ। इसी प्रकार, (a/b)⁻ⁿ = (b/a)ⁿ। उदाहरण: 2⁻³ = 1 / 2³ = 1/8।",
        te: "ఋణ ఘాతం అనేది ధన ఘాతం యొక్క వ్యుత్క్రమాన్ని సూచిస్తుంది: x⁻ⁿ = 1 / xⁿ. అలాగే (a/b)⁻ⁿ = (b/a)ⁿ. ఉదాహరణకు 2⁻³ = 1 / 2³ = 1/8.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Evaluate: (2/3)⁻²",
          hi: "मान ज्ञात कीजिए: (2/3)⁻²",
          te: "విలువను కనుగొనండి: (2/3)⁻²",
          reviewed: false
        },
        steps: [
          {
            en: "Invert the fraction to make the exponent positive: (3/2)².",
            hi: "घात को धनात्मक बनाने के लिए भिन्न को पलटें: (3/2)²।",
            te: "ఘాతాన్ని ధనంగా మార్చడానికి భిన్నాన్ని తిరగరాయండి: (3/2)².",
            reviewed: false
          },
          {
            en: "Square numerator and denominator: 3² / 2² = 9/4.",
            hi: "अंश और हर का वर्ग करें: 3² / 2² = 9/4।",
            te: "లవం మరియు హారాలను వర్గం చేయండి: 3² / 2² = 9/4.",
            reviewed: false
          }
        ],
        solution: {
          en: "9/4",
          hi: "9/4",
          te: "9/4",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Flip the fraction to change a negative exponent to a positive exponent.",
        hi: "ऋणात्मक घात को धनात्मक में बदलने के लिए भिन्न को उलट दें।",
        te: "ఋణ ఘాతాన్ని ధనంగా మార్చడానికి భిన్నాన్ని తలక్రిందులు చేయండి.",
        reviewed: false
      }
    }
  },

  // 7. Class 9 - Chapter 1: Orienting Yourself: The Use of Coordinates (c9-coord-01)
  {
    conceptId: "c9-coord-01",
    basics_first: {
      headline: {
        en: "Basics-First: Navigating the Cartesian Plane",
        hi: "बुनियादी दृष्टिकोण: कार्तीय तल पर नेविगेशन",
        te: "ప్రాథమిక విధానం: కార్టీసియన్ తలంపై స్థానాలు గుర్తించడం",
        reviewed: false
      },
      explanation: {
        en: "René Descartes invented coordinate geometry to pinpoint any point on a flat sheet of paper. We draw two perpendicular number lines: the horizontal x-axis and the vertical y-axis. Their meeting point is called the origin (0, 0). Any position is given as an ordered pair (x, y).",
        hi: "रेने देकार्त ने एक समतल सतह पर किसी भी बिंदु की सही स्थिति जानने के लिए निर्देशांक ज्यामिति का आविष्कार किया। हम दो लंबवत संख्या रेखाएं खींचते हैं: क्षैतिज x-अक्ष और ऊर्ध्वाधर y-अक्ष। उनके मिलन बिंदु को मूल बिंदु (0, 0) कहते हैं। किसी भी बिंदु को (x, y) के रूप में लिखा जाता है।",
        te: "రెనే డెకార్టే ఒక తలంపై ఏదైనా బిందువు స్థానాన్ని ఖచ్చితంగా గుర్తించడానికి నిరూపక రేఖాగణితాన్ని కనుగొన్నారు. క్షితిజ సమాంతరంగా x-అక్షం, నిలువుగా y-అక్షం ఉంటాయి. అవి కలిసే బిందువును మూలబిందువు (0, 0) అంటారు. ఏదైనా స్థానాన్ని (x, y) జతగా రాస్తారు.",
        reviewed: false
      },
      visualAnalogy: {
        en: "A classroom seating chart: Row 3, Column 4 pinpoints exactly one desk.",
        hi: "कक्षा की बैठक व्यवस्था: पंक्ति 3, स्तंभ 4 ठीक एक डेस्क को दर्शाता है।",
        te: "తరగతి గది సీటింగ్ చార్ట్: వరుస 3, నిలువు వరుస 4 ఒక ఖచ్చితమైన బెంచీని సూచిస్తుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Starting at the origin (0, 0), move 4 units right and 3 units down. What are the coordinates?",
          hi: "मूल बिंदु (0, 0) से शुरू करके 4 इकाई दाईं ओर और 3 इकाई नीचे जाएं। निर्देशांक क्या होंगे?",
          te: "మూలబిందువు (0, 0) నుండి ప్రారంభించి కుడివైపుకు 4 యూనిట్లు, క్రిందికి 3 యూనిట్లు కదలండి. నిరూపకాలు ఏమిటి?",
          reviewed: false
        },
        steps: [
          {
            en: "Moving right along the x-axis gives positive x: x = +4.",
            hi: "x-अक्ष पर दाईं ओर जाने पर धनात्मक x मिलता है: x = +4।",
            te: "x-అక్షంపై కుడివైపుకు వెళ్తే ధన x వస్తుంది: x = +4.",
            reviewed: false
          },
          {
            en: "Moving down along the y-axis gives negative y: y = -3.",
            hi: "y-अक्ष पर नीचे जाने पर ऋणात्मक y मिलता है: y = -3।",
            te: "y-అక్షంపై క్రిందికి వెళ్తే ఋణ y వస్తుంది: y = -3.",
            reviewed: false
          }
        ],
        solution: {
          en: "(4, -3)",
          hi: "(4, -3)",
          te: "(4, -3)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "In (x, y), x measures horizontal step (right +, left -) and y measures vertical step (up +, down -).",
        hi: "(x, y) में, x क्षैतिज दूरी (दाएं +, बाएं -) और y ऊर्ध्वाधर दूरी (ऊपर +, नीचे -) मापता है।",
        te: "(x, y) లో x క్షితిజ సమాంతర కదలికను, y నిలువు కదలికను సూచిస్తాయి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: The Four Quadrants and Sign Conventions",
        hi: "मानक दृष्टिकोण: चार चतुर्थांश और चिह्न परिपाटी",
        te: "ప్రామాణిక విధానం: నాలుగు పాదాలు మరియు సంకేత నియమాలు",
        reviewed: false
      },
      explanation: {
        en: "The axes divide the Cartesian plane into four regions called quadrants: Quadrant I (+, +), Quadrant II (-, +), Quadrant III (-, -), and Quadrant IV (+, -). Points lying on the x-axis have y = 0. Points lying on the y-axis have x = 0.",
        hi: "अक्ष कार्तीय तल को चार भागों में बांटते हैं जिन्हें चतुर्थांश कहते हैं: चतुर्थांश I (+, +), चतुर्थांश II (-, +), चतुर्थांश III (-, -), और चतुर्थांश IV (+, -)। x-अक्ष पर स्थित बिंदुओं का y = 0 होता है। y-अक्ष पर स्थित बिंदुओं का x = 0 होता है।",
        te: "అక్షాలు కార్టీసియన్ తలాన్ని నాలుగు పాదాలుగా విభజిస్తాయి: పాదం I (+, +), పాదం II (-, +), పాదం III (-, -), పాదం IV (+, -). x-అక్షంపై ఉండే బిందువుల వద్ద y = 0. y-అక్షంపై ఉండే బిందువుల వద్ద x = 0.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "In which quadrant does the point (-5, 8) lie?",
          hi: "बिंदु (-5, 8) किस चतुर्थांश में स्थित है?",
          te: "(-5, 8) బిందువు ఏ పాదంలో ఉంటుంది?",
          reviewed: false
        },
        steps: [
          {
            en: "Inspect signs: x = -5 (negative) and y = +8 (positive).",
            hi: "चिह्नों की जाँच करें: x = -5 (ऋणात्मक) और y = +8 (धनात्मक)।",
            te: "సంకేతాలను చూడండి: x = -5 (ఋణం) మరియు y = +8 (ధనం).",
            reviewed: false
          },
          {
            en: "Points with (-, +) are in Quadrant II.",
            hi: "(-, +) वाले बिंदु चतुर्थांश II में होते हैं।",
            te: "(-, +) సంకేతాలు ఉన్న బిందువులు 2వ పాదంలో (Quadrant II) ఉంటాయి.",
            reviewed: false
          }
        ],
        solution: {
          en: "Quadrant II",
          hi: "चतुर्थांश II",
          te: "2వ పాదం (Quadrant II)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Signs (x, y): Q1=(+,+), Q2=(-,+), Q3=(-,-), Q4=(+,-).",
        hi: "चिह्न (x, y): Q1=(+,+), Q2=(-,+), Q3=(-,-), Q4=(+,-)।",
        te: "సంకేతాలు (x, y): Q1=(+,+), Q2=(-,+), Q3=(-,-), Q4=(+,-).",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Abscissa, Ordinate, and Axis Loci",
        hi: "फास्ट-ट्रैक: भुज, कोटि और अक्ष समीकरण",
        te: "ఫాస్ట్-ట్రాక్: x-నిరూపకం (భుజం), y-నిరూపకం (కోటి)",
        reviewed: false
      },
      explanation: {
        en: "The x-coordinate is called the abscissa; the y-coordinate is called the ordinate. The equation of the x-axis is y = 0. The equation of the y-axis is x = 0. The distance of a point (x, y) from the y-axis is |x|, and from the x-axis is |y|.",
        hi: "x-निर्देशांक को भुज (abscissa) और y-निर्देशांक को कोटि (ordinate) कहते हैं। x-अक्ष का समीकरण y = 0 है। y-अक्ष का समीकरण x = 0 है। बिंदु (x, y) की y-अक्ष से दूरी |x| और x-अक्ष से दूरी |y| होती है।",
        te: "x-నిరూపకాన్ని భుజం (abscissa) అని, y-నిరూపకాన్ని కోటి (ordinate) అని అంటారు. x-అక్షం సమీకరణం y = 0. y-అక్షం సమీకరణం x = 0. (x, y) బిందువుకి y-అక్షం నుండి దూరం |x|, x-అక్షం నుండి దూరం |y|.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "What is the perpendicular distance of the point P(-6, 4) from the y-axis?",
          hi: "बिंदु P(-6, 4) की y-अक्ष से लंबवत दूरी क्या है?",
          te: "P(-6, 4) బిందువుకి y-అక్షం నుండి లంబ దూరం ఎంత?",
          reviewed: false
        },
        steps: [
          {
            en: "Distance from y-axis is the absolute value of the x-coordinate: |x|.",
            hi: "y-अक्ष से दूरी x-निर्देशांक का निरपेक्ष मान |x| होती है।",
            te: "y-అక్షం నుండి దూరం అనేది x-నిరూపకం యొక్క సంపూర్ణ విలువ |x|.",
            reviewed: false
          },
          {
            en: "Here x = -6, so |-6| = 6 units.",
            hi: "यहाँ x = -6, अतः |-6| = 6 इकाई।",
            te: "ఇక్కడ x = -6, కాబట్టి |-6| = 6 యూనిట్లు.",
            reviewed: false
          }
        ],
        solution: {
          en: "6 units",
          hi: "6 इकाई",
          te: "6 యూనిట్లు",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Distance from y-axis = |x|; distance from x-axis = |y| (distance is always positive).",
        hi: "y-अक्ष से दूरी = |x|; x-अक्ष से दूरी = |y| (दूरी हमेशा धनात्मक होती है)।",
        te: "y-అక్షం నుండి దూరం = |x|; x-అక్షం నుండి దూరం = |y| (దూరం ఎల్లప్పుడూ ధనాత్మకం).",
        reviewed: false
      }
    }
  },

  // 8. Class 9 - Chapter 2: Introduction to Linear Polynomials (c9-poly-01)
  {
    conceptId: "c9-poly-01",
    basics_first: {
      headline: {
        en: "Basics-First: What is a Polynomial?",
        hi: "बुनियादी दृष्टिकोण: बहुपद क्या है?",
        te: "ప్రాథమిక విధానం: బహుపది అంటే ఏమిటి?",
        reviewed: false
      },
      explanation: {
        en: "A polynomial is an algebraic expression where the powers of variables are whole numbers (0, 1, 2, ...). In a linear polynomial, the highest power of the variable is exactly 1 (e.g. 3x + 5). The value of x that makes the polynomial equal to zero is called its zero or root.",
        hi: "एक बहुपद एक ऐसा बीजीय व्यंजक है जिसमें चर की घातें पूर्ण संख्याएँ (0, 1, 2, ...) होती हैं। एक रैखिक बहुपद में चर की अधिकतम घात 1 होती है (जैसे 3x + 5)। चर का वह मान जो बहुपद को शून्य बना दे, उसका शून्यक कहलाता है।",
        te: "బహుపది అనేది చరరాశి ఘాతాలు పూర్ణాంకాలుగా (0, 1, 2, ...) ఉండే బీజగణిత సమాసం. రేఖీయ బహుపదిలో చరరాశి గరిష్ట ఘాతం 1 (ఉదా 3x + 5). బహుపది విలువను సున్నా చేసే చరరాశి విలువను శూన్యం లేదా మూలం అంటారు.",
        reviewed: false
      },
      visualAnalogy: {
        en: "A balancing scale: if 2x + 6 balances with 0, finding x means finding what weight counterbalances +6.",
        hi: "संतुलन तराजू: यदि 2x + 6 शून्य के साथ संतुलित है, तो x का मान ज्ञात करने का अर्थ है वह मान ढूंढना जो +6 को संतुलित करे।",
        te: "త్రాసు: 2x + 6 ని సున్నాతో సమానం చేసినప్పుడు, x విలువ అంటే +6 ని సరిచేసే భారం.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the zero of the linear polynomial p(x) = 2x - 8.",
          hi: "रैखिक बहुपद p(x) = 2x - 8 का शून्यक ज्ञात कीजिए।",
          te: "p(x) = 2x - 8 అనే రేఖీయ బహుపది యొక్క శూన్యాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Set p(x) = 0: 2x - 8 = 0.",
            hi: "p(x) = 0 रखें: 2x - 8 = 0।",
            te: "p(x) = 0 గా రాయండి: 2x - 8 = 0.",
            reviewed: false
          },
          {
            en: "Add 8 to both sides: 2x = 8.",
            hi: "दोनों पक्षों में 8 जोड़ें: 2x = 8।",
            te: "ఇరువైపులా 8 కలపండి: 2x = 8.",
            reviewed: false
          },
          {
            en: "Divide by 2: x = 8 / 2 = 4.",
            hi: "2 से भाग दें: x = 8 / 2 = 4।",
            te: "2 తో భాగించండి: x = 8 / 2 = 4.",
            reviewed: false
          }
        ],
        solution: {
          en: "x = 4",
          hi: "x = 4",
          te: "x = 4",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "To find the zero of p(x), solve p(x) = 0.",
        hi: "p(x) का शून्यक ज्ञात करने के लिए, समीकरण p(x) = 0 को हल करें।",
        te: "p(x) శూన్యాన్ని కనుగొనడానికి, p(x) = 0 సమీకరణాన్ని సాధించండి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Degree of Polynomials and Standard Form ax + b",
        hi: "मानक दृष्टिकोण: बहुपद की घात और मानक रूप ax + b",
        te: "ప్రామాణిక విధానం: బహుపది పరిమాణం మరియు ప్రామాణిక రూపం ax + b",
        reviewed: false
      },
      explanation: {
        en: "The degree of a polynomial is the highest power of the variable. Degree 1 is linear (ax + b, a ≠ 0), degree 2 is quadratic (ax² + bx + c), degree 3 is cubic. A non-zero linear polynomial has exactly one real zero, given by x = -b/a.",
        hi: "बहुपद की घात चर की उच्चतम घात होती है। घात 1 रैखिक (ax + b, a ≠ 0), घात 2 द्विघात, घात 3 त्रिघात होती है। एक रैखिक बहुपद का ठीक एक वास्तविक शून्यक x = -b/a होता है।",
        te: "చరరాశి యొక్క గరిష్ట ఘాతాన్ని బహుపది పరిమాణం అంటారు. పరిమాణం 1 ఉంటే రేఖీయ బహుపది (ax + b, a ≠ 0), పరిమాణం 2 ఉంటే వర్గ బహుపది. రేఖీయ బహుపదికి ఖచ్చితంగా ఒకే శూన్యం x = -b/a ఉంటుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "What is the degree of the polynomial 5x³ - 4x² + 7x - 9?",
          hi: "बहुपद 5x³ - 4x² + 7x - 9 की घात क्या है?",
          te: "5x³ - 4x² + 7x - 9 బహుపది యొక్క పరిమాణం ఎంత?",
          reviewed: false
        },
        steps: [
          {
            en: "Identify powers of x: 3 in 5x³, 2 in -4x², 1 in 7x, 0 in -9.",
            hi: "x की घातों को पहचानें: 5x³ में 3, -4x² में 2, 7x में 1, -9 में 0।",
            te: "x ఘాతాలను గుర్తించండి: 5x³ లో 3, -4x² లో 2, 7x లో 1.",
            reviewed: false
          },
          {
            en: "The highest power is 3.",
            hi: "उच्चतम घात 3 है।",
            te: "అత్యధిక ఘాతం 3.",
            reviewed: false
          }
        ],
        solution: {
          en: "3",
          hi: "3",
          te: "3",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Degree = highest exponent of the variable with non-zero coefficient.",
        hi: "घात = अशून्य गुणांक वाले चर का उच्चतम घातांक।",
        te: "పరిమాణం = సున్నా కాని గుణకం ఉన్న చరరాశి యొక్క గరిష్ట ఘాతం.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Zero of Linear Polynomial Formula x = -b/a",
        hi: "फास्ट-ट्रैक: रैखिक बहुपद के शून्यक का सूत्र x = -b/a",
        te: "ఫాస్ట్-ట్రాక్: రేఖీయ బహుపది శూన్య సూత్రం x = -b/a",
        reviewed: false
      },
      explanation: {
        en: "For p(x) = ax + b (where a ≠ 0), solving ax + b = 0 yields x = -b/a. Graphically, y = ax + b is a straight line intersecting the x-axis at the point (-b/a, 0).",
        hi: "p(x) = ax + b (जहाँ a ≠ 0) के लिए ax + b = 0 हल करने पर x = -b/a प्राप्त होता है। आलेखीय रूप से रेखा y = ax + b x-अक्ष को (-b/a, 0) पर काटती है।",
        te: "p(x) = ax + b (a ≠ 0) సమీకరణాన్ని సాధిస్తే x = -b/a వస్తుంది. గ్రాఫ్ రూపంలో y = ax + b సరళరేఖ x-అక్షాన్ని (-b/a, 0) వద్ద ఖండిస్తుంది.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the zero of p(x) = 3x + 12 without graphing.",
          hi: "बिना आलेख के p(x) = 3x + 12 का शून्यक ज्ञात कीजिए।",
          te: "గ్రాఫ్ లేకుండా p(x) = 3x + 12 శూన్యాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Identify coefficients: a = 3, b = 12.",
            hi: "गुणांक पहचानें: a = 3, b = 12।",
            te: "గుణకాలను గుర్తించండి: a = 3, b = 12.",
            reviewed: false
          },
          {
            en: "Use formula x = -b/a = -12/3 = -4.",
            hi: "सूत्र का उपयोग करें x = -b/a = -12/3 = -4।",
            te: "సూత్రం ఉపయోగించండి: x = -b/a = -12/3 = -4.",
            reviewed: false
          }
        ],
        solution: {
          en: "x = -4",
          hi: "x = -4",
          te: "x = -4",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "The unique zero of ax + b is always -b/a.",
        hi: "ax + b का अद्वितीय शून्यक सदैव -b/a होता है।",
        te: "ax + b యొక్క ఏకైక శూన్యం ఎల్లప్పుడూ -b/a.",
        reviewed: false
      }
    }
  },

  // 9. Class 10 - Chapter 1: Real Numbers (c10-real-01)
  {
    conceptId: "c10-real-01",
    basics_first: {
      headline: {
        en: "Basics-First: The Fundamental Theorem of Arithmetic",
        hi: "बुनियादी दृष्टिकोण: अंकगणित की आधारभूत प्रमेय",
        te: "ప్రాథమిక విధానం: అంకగణిత ప్రాథమిక సిద్ధాంతం",
        reviewed: false
      },
      explanation: {
        en: "Every composite number can be uniquely expressed (factorised) as a product of prime numbers, apart from the order in which the prime factors occur. Primes are the 'building blocks' or 'atoms' of all integers.",
        hi: "प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के गुणनफल के रूप में अद्वितीय रूप से व्यक्त किया जा सकता है, भले ही गुणनखंडों का क्रम कुछ भी हो। अभाज्य संख्याएँ सभी पूर्णांकों के 'निर्माण खंड' या 'परमाणु' हैं।",
        te: "ప్రతి సంయుక్త సంఖ్యను ప్రధాన సంఖ్యల లబ్దంగా ఏకైకంగా రాయవచ్చు. ప్రధాన సంఖ్యలు అన్ని సంఖ్యల యొక్క మూల స్తంభాలు లాంటివి.",
        reviewed: false
      },
      visualAnalogy: {
        en: "Building blocks: any Lego castle (composite number) can be dismantled down into fundamental single coloured bricks (prime numbers).",
        hi: "लेगो ब्लॉक: किसी भी लेगो महल (भाज्य संख्या) को उसके मूल एकल ईंटों (अभाज्य संख्या) में तोड़ा जा सकता है।",
        te: "లెగో ఇటుకలు: ఎంత పెద్ద భవనాన్ని (సంయుక్త సంఖ్య) అయినా ప్రాథమిక రంగు ఇటుకలుగా (ప్రధాన సంఖ్యలు) విడదీయవచ్చు.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Express 140 as a product of its prime factors.",
          hi: "140 को उसके अभाज्य गुणनखंडों के गुणनफल के रूप में व्यक्त कीजिए।",
          te: "140 ని ప్రధాన కారణాంకాల లబ్దంగా రాయండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Divide by 2: 140 ÷ 2 = 70.",
            hi: "2 से भाग दें: 140 ÷ 2 = 70।",
            te: "2 తో భాగించండి: 140 ÷ 2 = 70.",
            reviewed: false
          },
          {
            en: "Divide by 2: 70 ÷ 2 = 35.",
            hi: "2 से भाग दें: 70 ÷ 2 = 35।",
            te: "2 తో భాగించండి: 70 ÷ 2 = 35.",
            reviewed: false
          },
          {
            en: "Divide by 5: 35 ÷ 5 = 7 (7 is prime).",
            hi: "5 से भाग दें: 35 ÷ 5 = 7 (7 अभाज्य है)।",
            te: "5 తో భాగించండి: 35 ÷ 5 = 7 (7 ప్రధాన సంఖ్య).",
            reviewed: false
          }
        ],
        solution: {
          en: "2² × 5 × 7",
          hi: "2² × 5 × 7",
          te: "2² × 5 × 7",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Every integer greater than 1 has a unique prime factorisation.",
        hi: "1 से बड़े प्रत्येक पूर्णांक का एक अद्वितीय अभाज्य गुणनखंडन होता है।",
        te: "1 కంటే పెద్దదైన ప్రతి పూర్ణ సంఖ్యకు ఏకైక ప్రధాన కారణాంక విభజన ఉంటుంది.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: HCF and LCM via Prime Factorisation",
        hi: "मानक दृष्टिकोण: अभाज्य गुणनखंडन द्वारा HCF और LCM",
        te: "ప్రామాణిక విధానం: ప్రధాన కారణాంకాల ద్వారా గ.సా.భా మరియు క.సా.గు",
        reviewed: false
      },
      explanation: {
        en: "For any two positive integers a and b: HCF is the product of the smallest powers of each common prime factor. LCM is the product of the greatest powers of all prime factors. Crucial identity: HCF(a, b) × LCM(a, b) = a × b.",
        hi: "किन्हीं दो धनात्मक पूर्णांकों a और b के लिए: HCF प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की सबसे छोटी घात का गुणनफल होता है। LCM सभी अभाज्य गुणनखंडों की सबसे बड़ी घात का गुणनफल होता है। मुख्य सूत्र: HCF(a, b) × LCM(a, b) = a × b।",
        te: "ఏవైనా రెండు ధన పూర్ణ సంఖ్యలు a, b లకు: ఉమ్మడి ప్రధాన కారణాంకాల అత్యల్ప ఘాతాల లబ్ధం HCF (గ.సా.భా). అన్ని ప్రధాన కారణాంకాల గరిష్ట ఘాతాల లబ్ధం LCM (క.సా.గు). ముఖ్య సూత్రం: HCF(a, b) × LCM(a, b) = a × b.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "If HCF(12, 18) = 6, find LCM(12, 18) using the identity HCF × LCM = a × b.",
          hi: "यदि HCF(12, 18) = 6 है, तो सूत्र HCF × LCM = a × b का उपयोग करके LCM(12, 18) ज्ञात कीजिए।",
          te: "HCF(12, 18) = 6 అయితే, HCF × LCM = a × b సూత్రం ద్వారా LCM(12, 18) కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Calculate the product a × b: 12 × 18 = 216.",
            hi: "a × b का गुणनफल निकालें: 12 × 18 = 216।",
            te: "a × b లబ్ధాన్ని లెక్కించండి: 12 × 18 = 216.",
            reviewed: false
          },
          {
            en: "LCM = (a × b) / HCF = 216 / 6 = 36.",
            hi: "LCM = (a × b) / HCF = 216 / 6 = 36।",
            te: "LCM = (a × b) / HCF = 216 / 6 = 36.",
            reviewed: false
          }
        ],
        solution: {
          en: "36",
          hi: "36",
          te: "36",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "For two numbers, HCF(a, b) × LCM(a, b) = a × b.",
        hi: "दो संख्याओं के लिए, HCF(a, b) × LCM(a, b) = a × b।",
        te: "రెండు సంఖ్యలకు, HCF(a, b) × LCM(a, b) = a × b.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Decimal Expansions and Irrationality",
        hi: "फास्ट-ट्रैक: दशमलव प्रसार और अपरिमेयता",
        te: "ఫాస్ట్-ట్రాక్: దశాంశ విస్తరణలు మరియు కరణీయ సంఖ్యలు",
        reviewed: false
      },
      explanation: {
        en: "A rational number p/q in lowest terms has a terminating decimal expansion if and only if the prime factorisation of q is of the form 2ⁿ5ᵐ (where n, m are non-negative integers). If q has any other prime factor (such as 3 or 7), the expansion is non-terminating repeating.",
        hi: "एक परिमेय संख्या p/q का दशमलव प्रसार सांत होता है यदि और केवल यदि q का अभाज्य गुणनखंडन 2ⁿ5ᵐ के रूप का हो। यदि q में कोई अन्य अभाज्य गुणनखंड (जैसे 3 या 7) हो, तो प्रसार असांत आवर्ती होता है।",
        te: "ఒక అకరణీయ సంఖ్య p/q లో హారం q యొక్క ప్రధాన కారణాంకాలు 2ⁿ5ᵐ రూపంలో ఉంటేనే అది అంతమయ్యే దశాంశం అవుతుంది. వేరే ఇతర ప్రధాన కారణాంకాలు ఉంటే అది అంతం కాని ఆవర్తన దశాంశం.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Will 17/8 have a terminating or non-terminating decimal expansion?",
          hi: "क्या 17/8 का दशमलव प्रसार सांत होगा या असांत?",
          te: "17/8 అంతమయ్యే దశాంశ విస్తరణను కలిగి ఉంటుందా లేదా?",
          reviewed: false
        },
        steps: [
          {
            en: "Check denominator q = 8.",
            hi: "हर q = 8 की जाँच करें।",
            te: "హారం q = 8 ని చూడండి.",
            reviewed: false
          },
          {
            en: "Factorise: 8 = 2³ = 2³ × 5⁰. It matches 2ⁿ5ᵐ.",
            hi: "गुणनखंड करें: 8 = 2³ = 2³ × 5⁰। यह 2ⁿ5ᵐ के रूप का है।",
            te: "కారణాంకాలు: 8 = 2³ = 2³ × 5⁰. ఇది 2ⁿ5ᵐ రూపంలో ఉంది.",
            reviewed: false
          }
        ],
        solution: {
          en: "Terminating (17/8 = 2.125)",
          hi: "सांत (17/8 = 2.125)",
          te: "అంతమయ్యే దశాంశం (17/8 = 2.125)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Terminating decimals require denominator factors of only 2s and 5s.",
        hi: "सांत दशमलव के लिए हर में केवल 2 और 5 के गुणनखंड होने चाहिए।",
        te: "అంతమయ్యే దశాంశం కావాలంటే హారంలో 2 మరియు 5 లు మాత్రమే ఉండాలి.",
        reviewed: false
      }
    }
  },

  // 10. Class 10 - Chapter 2: Polynomials (c10-poly-01)
  {
    conceptId: "c10-poly-01",
    basics_first: {
      headline: {
        en: "Basics-First: Geometrical Meaning of Zeroes",
        hi: "बुनियादी दृष्टिकोण: शून्यकों का ज्यामितीय अर्थ",
        te: "ప్రాథమిక విధానం: శూన్యాల రేఖాగణిత అర్థం",
        reviewed: false
      },
      explanation: {
        en: "The zeroes of a polynomial p(x) correspond precisely to the x-coordinates of the points where the graph of y = p(x) intersects the x-axis. A linear polynomial's graph is a line cutting the x-axis at 1 point. A quadratic polynomial forms a parabola cutting the x-axis at up to 2 points.",
        hi: "किसी बहुपद p(x) के शून्यक उन बिंदुओं के x-निर्देशांक होते हैं जहाँ y = p(x) का ग्राफ x-अक्ष को काटता है। रैखिक बहुपद का ग्राफ एक रेखा होती है जो x-अक्ष को 1 बिंदु पर काटती है। द्विघात बहुपद का ग्राफ एक परवलय (parabola) होता है जो अधिकतम 2 बिंदुओं पर काटता है।",
        te: "ఒక బహుపది p(x) శూన్యాలు అంటే y = p(x) గ్రాఫ్ x-అక్షాన్ని ఖండించే బిందువుల యొక్క x-నిరూపకాలు. రేఖీయ బహుపది సరళరేఖ 1 బిందువు వద్ద, వర్గ బహుపది పరావలయం గరిష్టంగా 2 బిందువుల వద్ద x-అక్షాన్ని ఖండిస్తాయి.",
        reviewed: false
      },
      visualAnalogy: {
        en: "A U-shaped roller-coaster track: the points where the track dips down and touches the ground level (sea level) are the zeroes.",
        hi: "रोलर-कोस्टर ट्रैक: जिस बिंदु पर ट्रैक जमीन के स्तर को छूता है, वे उसके शून्यक होते हैं।",
        te: "రోలర్-కోస్టర్ ట్రాక్: ట్రాక్ నేలను తాకే బిందువులు దాని శూన్యాలు.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "If the graph of y = p(x) touches the x-axis at exactly one point and does not cross it, how many real zeroes does it have?",
          hi: "यदि y = p(x) का ग्राफ x-अक्ष को ठीक एक बिंदु पर स्पर्श करता है, तो उसके कितने वास्तविक शून्यक हैं?",
          te: "y = p(x) గ్రాఫ్ x-అక్షాన్ని కేవలం ఒకే బిందువు వద్ద తాకితే, దానికి ఎన్ని వాస్తవ శూన్యాలు ఉంటాయి?",
          reviewed: false
        },
        steps: [
          {
            en: "Number of real zeroes equals number of contact/intersection points with x-axis.",
            hi: "वास्तविक शून्यकों की संख्या x-अक्ष के स्पर्श/प्रतिच्छेद बिंदुओं की संख्या के बराबर होती है।",
            te: "వాస్తవ శూన్యాల సంఖ్య x-అక్షాన్ని తాకే లేదా ఖండించే బిందువుల సంఖ్యకు సమానం.",
            reviewed: false
          },
          {
            en: "There is exactly 1 contact point, meaning two coincident (equal) real zeroes.",
            hi: "ठीक 1 संपर्क बिंदु है, जिसका अर्थ है दो संपाती (समान) वास्तविक शून्यक।",
            te: "ఖచ్చితంగా 1 తాకే బిందువు ఉంది, అంటే సమానమైన శూన్యాలు ఉన్నాయి.",
            reviewed: false
          }
        ],
        solution: {
          en: "1 distinct real zero (two equal roots)",
          hi: "1 अद्वितीय वास्तविक शून्यक (दो बराबर मूल)",
          te: "1 ప్రత్యేక వాస్తవ శూన్యం (రెండు సమాన మూలాలు)",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Intersections with x-axis give the real zeroes of y = p(x).",
        hi: "x-अक्ष के साथ प्रतिच्छेद बिंदु y = p(x) के वास्तविक शून्यक देते हैं।",
        te: "x-అక్షంతో ఖండన బిందువులు y = p(x) యొక్క వాస్తవ శూన్యాలను ఇస్తాయి.",
        reviewed: false
      }
    },
    standard: {
      headline: {
        en: "Standard: Zeroes and Coefficients of a Quadratic Polynomial",
        hi: "मानक दृष्टिकोण: द्विघात बहुपद के शून्यक और गुणांकों के बीच संबंध",
        te: "ప్రామాణిక విధానం: వర్గ బహుపది శూన్యాలు మరియు గుణకాల సంబంధం",
        reviewed: false
      },
      explanation: {
        en: "For a quadratic polynomial p(x) = ax² + bx + c (a ≠ 0) with zeroes α and β: Sum of zeroes: α + β = -b/a = -(coefficient of x) / (coefficient of x²). Product of zeroes: αβ = c/a = (constant term) / (coefficient of x²).",
        hi: "द्विघात बहुपद p(x) = ax² + bx + c (a ≠ 0) जिसके शून्यक α और β हैं: शून्यकों का योग: α + β = -b/a। शून्यकों का गुणनफल: αβ = c/a।",
        te: "వర్గ బహుపది p(x) = ax² + bx + c (a ≠ 0) శూన్యాలు α, β లకు: శూన్యాల మొత్తం: α + β = -b/a. శూన్యాల లబ్ధం: αβ = c/a.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Find the sum and product of zeroes for p(x) = 2x² - 8x + 6.",
          hi: "बहुपद p(x) = 2x² - 8x + 6 के शून्यकों का योग और गुणनफल ज्ञात कीजिए।",
          te: "p(x) = 2x² - 8x + 6 బహుపది శూన్యాల మొత్తం మరియు లబ్ధాన్ని కనుగొనండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Identify coefficients: a = 2, b = -8, c = 6.",
            hi: "गुणांक पहचानें: a = 2, b = -8, c = 6।",
            te: "గుణకాలను గుర్తించండి: a = 2, b = -8, c = 6.",
            reviewed: false
          },
          {
            en: "Sum α + β = -(-8)/2 = 8/2 = 4.",
            hi: "योग α + β = -(-8)/2 = 8/2 = 4।",
            te: "మొత్తం α + β = -(-8)/2 = 8/2 = 4.",
            reviewed: false
          },
          {
            en: "Product αβ = c/a = 6/2 = 3.",
            hi: "गुणनफल αβ = c/a = 6/2 = 3।",
            te: "లబ్ధం αβ = c/a = 6/2 = 3.",
            reviewed: false
          }
        ],
        solution: {
          en: "Sum = 4, Product = 3",
          hi: "योग = 4, गुणनफल = 3",
          te: "మొత్తం = 4, లబ్ధం = 3",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Sum of zeroes = -b/a; Product of zeroes = c/a.",
        hi: "शून्यकों का योग = -b/a; शून्यकों का गुणनफल = c/a।",
        te: "శూన్యాల మొత్తం = -b/a; శూన్యాల లబ్ధం = c/a.",
        reviewed: false
      }
    },
    fast_track: {
      headline: {
        en: "Fast-Track: Forming a Quadratic from Sum and Product",
        hi: "फास्ट-ट्रैक: योग और गुणनफल से द्विघात बहुपद बनाना",
        te: "ఫాస్ట్-ట్రాక్: శూన్యాల మొత్తం మరియు లబ్ధంతో వర్గ బహుపదిని రూపొందించడం",
        reviewed: false
      },
      explanation: {
        en: "A quadratic polynomial with zeroes α and β can be constructed directly as k[x² - (α + β)x + αβ], where k is any non-zero real constant. In standard monic form: x² - Sx + P, where S is the sum and P is the product of zeroes.",
        hi: "शून्यक α और β वाले द्विघात बहुपद को सीधे k[x² - (α + β)x + αβ] के रूप में बनाया जा सकता है, जहाँ k कोई अशून्य वास्तविक संख्या है।",
        te: "α, β శూన్యాలుగా గల వర్గ బహుపదిని నేరుగా k[x² - (α + β)x + αβ] రూపంలో నిర్మించవచ్చు.",
        reviewed: false
      },
      workedExample: {
        problem: {
          en: "Form a quadratic polynomial whose sum of zeroes is -3 and product of zeroes is 2.",
          hi: "एक द्विघात बहुपद ज्ञात कीजिए जिसके शून्यकों का योग -3 और गुणनफल 2 है।",
          te: "శూన్యాల మొత్తం -3 మరియు లబ్ధం 2 గా గల వర్గ బహుపదిని రాయండి.",
          reviewed: false
        },
        steps: [
          {
            en: "Sum S = -3, Product P = 2.",
            hi: "योग S = -3, गुणनफल P = 2।",
            te: "మొత్తం S = -3, లబ్ధం P = 2.",
            reviewed: false
          },
          {
            en: "Formula: x² - Sx + P = x² - (-3)x + 2 = x² + 3x + 2.",
            hi: "सूत्र: x² - Sx + P = x² - (-3)x + 2 = x² + 3x + 2।",
            te: "సూత్రం: x² - Sx + P = x² - (-3)x + 2 = x² + 3x + 2.",
            reviewed: false
          }
        ],
        solution: {
          en: "x² + 3x + 2",
          hi: "x² + 3x + 2",
          te: "x² + 3x + 2",
          reviewed: false
        }
      },
      keyTakeaway: {
        en: "Quadratic polynomial = x² - (Sum)x + (Product).",
        hi: "द्विघात बहुपद = x² - (योग)x + (गुणनफल)।",
        te: "వర్గ బహుపది = x² - (మొత్తం)x + (లబ్ధం).",
        reviewed: false
      }
    }
  }
];

const combinedLessons = [...filteredLessons, ...newLessons];
fs.writeFileSync(lessonsPath, JSON.stringify(combinedLessons, null, 2), "utf8");
console.log("Successfully wrote lessons.json! Total lessons:", combinedLessons.length);
