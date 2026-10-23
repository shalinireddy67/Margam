/**
 * Generator script to add 45 adaptive questions and data/tag-roots.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const questionsPath = path.join(rootDir, "data", "questions.json");
const tagRootsPath = path.join(rootDir, "data", "tag-roots.json");
const conceptsPath = path.join(rootDir, "data", "concepts.json");

const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const existingConcepts = JSON.parse(fs.readFileSync(conceptsPath, "utf8"));
const conceptMap = new Map(existingConcepts.map(c => [c.id, c]));

// 45 Verified Original Questions across the 5-concept chain
export const adaptiveQuestions = [
  // --------------------------------------------------------------------------
  // Concept 1: c6-neg-01 (Class 6: Opposite Quantities and Need for Negative Numbers)
  // --------------------------------------------------------------------------
  // Difficulty 1
  {
    id: "q-c6-neg-d1-01",
    conceptId: "c6-neg-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "In winter, the temperature in Leh drops to 14°C below the freezing point (0°C). How is this recorded as an integer?",
      hi: "सर्दियों में लेह का तापमान हिमांक (0°C) से 14°C नीचे चला जाता है। इसे पूर्णांक के रूप में कैसे लिखा जाएगा?",
      te: "శీతాకాలంలో లేహ్ ఉష్ణోగ్రత గడ్డకట్టే స్థానం (0°C) కంటే 14°C తక్కువకు పడిపోతుంది. దీనిని పూర్ణాంకంగా ఎలా నమోదు చేస్తారు?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-14°C", hi: "-14°C", te: "-14°C", reviewed: false } },
      { id: "B", text: { en: "+14°C", hi: "+14°C", te: "+14°C", reviewed: false }, mistakeTag: "positive_sign_for_below_zero" },
      { id: "C", text: { en: "0°C", hi: "0°C", te: "0°C", reviewed: false }, mistakeTag: "confused_zero_with_below_zero" },
      { id: "D", text: { en: "-4°C", hi: "-4°C", te: "-4°C", reviewed: false }, mistakeTag: "subtracted_ten_error" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Quantities below zero or below a reference benchmark are represented using negative integers. 14°C below 0°C is -14°C.",
      hi: "शून्य या मानक संदर्भ से नीचे की मात्राओं को ऋणात्मक पूर्णांकों द्वारा दर्शाया जाता है। 0°C से 14°C नीचे -14°C होता है।",
      te: "సున్నా కంటే తక్కువ ఉన్న పరిమాణాలను రుణ పూర్ణాంకాలతో సూచిస్తారు. 0°C కంటే 14°C తక్కువ అనగా -14°C.",
      reviewed: false
    },
    hint: {
      en: "Values below zero take a minus (-) sign.",
      hi: "शून्य से नीचे के मानों में ऋण (-) चिह्न लगता है।",
      te: "సున్నా కంటే తక్కువ ఉన్న విలువలకు మైనస్ (-) గుర్తు ఉంటుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d1-02",
    conceptId: "c6-neg-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "An Indian Navy submarine operates 85 metres below sea level (sea level is 0 m). How is its position recorded as an integer?",
      hi: "भारतीय नौसेना की एक पनडुब्बी समुद्र तल (0 मी) से 85 मीटर नीचे संचालित होती है। इसकी स्थिति को पूर्णांक के रूप में कैसे दर्ज किया जाएगा?",
      te: "భారత నావికాదళ జలాంతర్గామి సముద్ర మట్టం (0 మీ) కంటే 85 మీటర్ల దిగువన పనిచేస్తుంది. దాని స్థానాన్ని పూర్ణాంకంగా ఎలా నమోదు చేస్తారు?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "+85 m", hi: "+85 मी", te: "+85 మీ", reviewed: false }, mistakeTag: "positive_sign_for_below_zero" },
      { id: "B", text: { en: "-170 m", hi: "-170 मी", te: "-170 మీ", reviewed: false }, mistakeTag: "magnitude_doubled" },
      { id: "C", text: { en: "-85 m", hi: "-85 मी", te: "-85 మీ", reviewed: false } },
      { id: "D", text: { en: "0 m", hi: "0 मी", te: "0 మీ", reviewed: false }, mistakeTag: "confused_zero_with_below_zero" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Sea level is the zero benchmark. Depths below sea level are represented by negative integers: -85 m.",
      hi: "समुद्र तल शून्य संदर्भ है। समुद्र तल से नीचे की गहराई को ऋणात्मक पूर्णांक द्वारा दर्शाया जाता है: -85 मी।",
      te: "సముద్ర మట్టం సున్నా ప్రమాణం. సముద్ర మట్టానికి దిగువన ఉన్న లోతును రుణ పూర్ణాంకంతో సూచిస్తారు: -85 మీ.",
      reviewed: false
    },
    hint: {
      en: "Below sea level is opposite to altitude above sea level.",
      hi: "समुद्र तल से नीचे का स्थान ऊंचाई के विपरीत होता है।",
      te: "సముద్ర మట్టం కంటే దిగువన ఉండటం ఎత్తుకు వ్యతిరేకం.",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d1-03",
    conceptId: "c6-neg-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "In a shopping mall, an elevator travels from the ground floor (0) down to the 2nd basement parking level. What integer represents this basement floor?",
      hi: "एक शॉपिंग मॉल में लिफ्ट भूतल (0) से नीचे दूसरे बेसमेंट पार्किंग तल पर जाती है। इस बेसमेंट तल को कौन सा पूर्णांक दर्शाता है?",
      te: "షాపింగ్ మాల్‌లోని లిఫ్ట్ గ్రౌండ్ ఫ్లోర్ (0) నుండి 2వ బేస్‌మెంట్ పార్కింగ్ అంతస్తుకు దిగుతుంది. ఈ బేస్‌మెంట్ అంతస్తును ఏ పూర్ణాంకం సూచిస్తుంది?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "+2", hi: "+2", te: "+2", reviewed: false }, mistakeTag: "positive_sign_for_below_zero" },
      { id: "B", text: { en: "-2", hi: "-2", te: "-2", reviewed: false } },
      { id: "C", text: { en: "-20", hi: "-20", te: "-20", reviewed: false }, mistakeTag: "added_ten_scale" },
      { id: "D", text: { en: "0", hi: "0", te: "0", reviewed: false }, mistakeTag: "omitted_negative_displacement" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Levels below the ground floor (0) are negative. 2 levels down is -2.",
      hi: "भूतल (0) से नीचे के तलों को ऋणात्मक माना जाता है। 2 तल नीचे -2 होता है।",
      te: "గ్రౌండ్ ఫ్లోర్ (0) కంటే దిగువ అంతస్తులు రుణాత్మకం. 2 అంతస్తులు కిందకు అనగా -2.",
      reviewed: false
    },
    hint: {
      en: "Floors below ground level take negative values.",
      hi: "जमीन के स्तर से नीचे के तलों का मान ऋणात्मक होता है।",
      te: "భూగర్భ అంతస్తులకు రుణ విలువలు ఉంటాయి.",
      reviewed: false
    }
  },

  // Difficulty 2
  {
    id: "q-c6-neg-d2-01",
    conceptId: "c6-neg-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "Kavita has ₹500 in her bank account. She makes an online payment of ₹800 using an approved overdraft facility. What integer represents her new balance?",
      hi: "कविता के बैंक खाते में ₹500 हैं। वह ओवरड्राफ्ट सुविधा का उपयोग करके ₹800 का ऑनलाइन भुगतान करती है। उसका नया बैलेंस कौन सा पूर्णांक दर्शाएगा?",
      te: "కవిత బ్యాంక్ ఖాతాలో ₹500 ఉన్నాయి. ఆమె అనుమతించబడిన ఓవర్‌డ్రాఫ్ట్ ద్వారా ₹800 ఆన్‌లైన్ చెల్లింపు చేసింది. ఆమె కొత్త బ్యాలెన్స్‌ను ఏ పూర్ణాంకం సూచిస్తుంది?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-₹300", hi: "-₹300", te: "-₹300", reviewed: false } },
      { id: "B", text: { en: "+₹300", hi: "+₹300", te: "+₹300", reviewed: false }, mistakeTag: "lost_negative_sign_on_larger_magnitude" },
      { id: "C", text: { en: "+₹1300", hi: "+₹1300", te: "+₹1300", reviewed: false }, mistakeTag: "added_instead_of_subtracted" },
      { id: "D", text: { en: "-₹800", hi: "-₹800", te: "-₹800", reviewed: false }, mistakeTag: "subtracted_from_zero" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Balance = 500 - 800 = -300. An overdraft is money owed, represented by -₹300.",
      hi: "शेष = 500 - 800 = -300। ओवरड्राफ्ट बकाया राशि है, जिसे -₹300 से दर्शाया जाता है।",
      te: "నిల్వ = 500 - 800 = -300. ఓవర్‌డ్రాఫ్ట్ బాకీ ఉన్న డబ్బు, కాబట్టి -₹300.",
      reviewed: false
    },
    hint: {
      en: "Subtracting a larger amount from a smaller amount gives a negative balance.",
      hi: "छोटी राशि में से बड़ी राशि घटाने पर ऋणात्मक शेष प्राप्त होता है।",
      te: "చిన్న మొత్తం నుండి పెద్ద మొత్తాన్ని తీసివేస్తే రుణ విలువ వస్తుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d2-02",
    conceptId: "c6-neg-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "If travelling 12 km East is represented by +12 km, what integer represents travelling 15 km West?",
      hi: "यदि पूर्व दिशा में 12 किमी की यात्रा को +12 किमी से दर्शाया जाता है, तो पश्चिम दिशा में 15 किमी की यात्रा को किस पूर्णांक से दर्शाया जाएगा?",
      te: "తూర్పు దిశలో 12 కి.మీ ప్రయాణాన్ని +12 కి.మీగా సూచిస్తే, పశ్చిమ దిశలో 15 కి.మీ ప్రయాణాన్ని ఏ పూర్ణాంకం సూచిస్తుంది?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "+15 km", hi: "+15 किमी", te: "+15 కి.మీ", reviewed: false }, mistakeTag: "positive_sign_for_below_zero" },
      { id: "B", text: { en: "-3 km", hi: "-3 किमी", te: "-3 కి.మీ", reviewed: false }, mistakeTag: "subtracted_magnitudes_without_signs" },
      { id: "C", text: { en: "+3 km", hi: "+3 किमी", te: "+3 కి.మీ", reviewed: false }, mistakeTag: "confused_reference_point" },
      { id: "D", text: { en: "-15 km", hi: "-15 किमी", te: "-15 కి.మీ", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "West is the exact opposite direction to East. Since East is positive, West is negative: -15 km.",
      hi: "पश्चिम दिशा पूर्व के ठीक विपरीत है। चूंकि पूर्व धनात्मक है, पश्चिम ऋणात्मक होगा: -15 किमी।",
      te: "పశ్చిమ దిశ తూర్పుకు పూర్తి వ్యతిరేకం. తూర్పు ధనాత్మకం కాబట్టి, పశ్చిమం రుణాత్మకం: -15 కి.మీ.",
      reviewed: false
    },
    hint: {
      en: "Opposite directions are assigned opposite signs.",
      hi: "विपरीत दिशाओं को विपरीत चिह्न दिए जाते हैं।",
      te: "వ్యతిరేక దిశలకు వ్యతిరేక గుర్తులు ఇవ్వబడతాయి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d2-03",
    conceptId: "c6-neg-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "A coastal mountain peak has an elevation of +2400 m, while a deep sea trench directly offshore has an elevation of -600 m. What is the total vertical distance between the peak and the trench?",
      hi: "तटीय पर्वत शिखर की ऊंचाई +2400 मीटर है, जबकि समुद्र में एक खाई -600 मीटर की गहराई पर है। शिखर और खाई के बीच कुल ऊर्ध्वाधर दूरी क्या है?",
      te: "ఒక తీర పర్వత శిఖరం ఎత్తు +2400 మీటర్లు, సముద్ర కందకం లోతు -600 మీటర్లు. శిఖరం మరియు కందకం మధ్య మొత్తం నిలువు దూరం ఎంత?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "1800 m", hi: "1800 मी", te: "1800 మీ", reviewed: false }, mistakeTag: "subtracted_magnitudes_without_signs" },
      { id: "B", text: { en: "3000 m", hi: "3000 मी", te: "3000 మీ", reviewed: false } },
      { id: "C", text: { en: "-3000 m", hi: "-3000 मी", te: "-3000 మీ", reviewed: false }, mistakeTag: "distance_expressed_as_negative" },
      { id: "D", text: { en: "2400 m", hi: "2400 मी", te: "2400 మీ", reviewed: false }, mistakeTag: "confused_zero_reference" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Vertical distance = Higher elevation - Lower elevation = 2400 - (-600) = 2400 + 600 = 3000 m.",
      hi: "ऊर्ध्वाधर दूरी = उच्च ऊंचाई - निम्न ऊंचाई = 2400 - (-600) = 2400 + 600 = 3000 मी।",
      te: "నిలువు దూరం = ఎగువ ఎత్తు - దిగువ ఎత్తు = 2400 - (-600) = 2400 + 600 = 3000 మీ.",
      reviewed: false
    },
    hint: {
      en: "Subtracting a negative number is equivalent to adding its positive value.",
      hi: "किसी ऋणात्मक संख्या को घटाना उसके धनात्मक मान को जोड़ने के बराबर है।",
      te: "రుణ సంఖ్యను తీసివేయడం దాని ధన విలువను కలపడంతో సమానం.",
      reviewed: false
    }
  },

  // Difficulty 3
  {
    id: "q-c6-neg-d3-01",
    conceptId: "c6-neg-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "At 6 AM in Srinagar, the temperature was -4°C. By noon, it rose by 7°C, but by midnight it fell by 9°C. What was the temperature at midnight?",
      hi: "श्रीनगर में सुबह 6 बजे तापमान -4°C था। दोपहर तक यह 7°C बढ़ गया, लेकिन आधी रात तक 9°C गिर गया। आधी रात को तापमान क्या था?",
      te: "శ్రీనగర్‌లో ఉదయం 6 గంటలకు ఉష్ణోగ్రత -4°C. మధ్యాహ్నానికి 7°C పెరిగింది, కానీ అర్ధరాత్రికి 9°C తగ్గింది. అర్ధరాత్రి ఉష్ణోగ్రత ఎంత?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "+6°C", hi: "+6°C", te: "+6°C", reviewed: false }, mistakeTag: "positive_sign_for_below_zero" },
      { id: "B", text: { en: "-20°C", hi: "-20°C", te: "-20°C", reviewed: false }, mistakeTag: "subtracted_magnitudes_negative" },
      { id: "C", text: { en: "-6°C", hi: "-6°C", te: "-6°C", reviewed: false } },
      { id: "D", text: { en: "+2°C", hi: "+2°C", te: "+2°C", reviewed: false }, mistakeTag: "lost_negative_sign_on_larger_magnitude" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Initial = -4°C. Noon = -4 + 7 = +3°C. Midnight = +3 - 9 = -6°C.",
      hi: "प्रारंभिक = -4°C। दोपहर = -4 + 7 = +3°C। आधी रात = +3 - 9 = -6°C।",
      te: "ప్రారంభం = -4°C. మధ్యాహ్నం = -4 + 7 = +3°C. అర్ధరాత్రి = +3 - 9 = -6°C.",
      reviewed: false
    },
    hint: {
      en: "Follow each change in sequence: start at -4, add 7, then subtract 9.",
      hi: "क्रम से गणना करें: -4 से शुरू करें, 7 जोड़ें, फिर 9 घटाएं।",
      te: "-4 తో ప్రారంభించి, 7 కలిపి, తర్వాత 9 తీసివేయండి.",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d3-02",
    conceptId: "c6-neg-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "A deep-sea diver is positioned at -18 m. She ascends 12 m towards the surface, then descends 5 m deeper. What is her final elevation relative to sea level?",
      hi: "एक गोताखोर समुद्र में -18 मीटर पर है। वह सतह की ओर 12 मीटर ऊपर चढ़ती है, फिर 5 मीटर नीचे उतरती है। समुद्र तल के सापेक्ष उसकी अंतिम स्थिति क्या है?",
      te: "ఒక స్కూబా డైవర్ -18 మీటర్ల వద్ద ఉంది. ఆమె పైకి 12 మీటర్లు వెళ్లి, తర్వాత 5 మీటర్లు దిగువకు వెళ్ళింది. సముద్ర మట్టానికి సంబంధించి ఆమె చివరి స్థానం ఏమిటి?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-11 m", hi: "-11 मी", te: "-11 మీ", reviewed: false } },
      { id: "B", text: { en: "+11 m", hi: "+11 मी", te: "+11 మీ", reviewed: false }, mistakeTag: "lost_negative_sign_on_larger_magnitude" },
      { id: "C", text: { en: "-35 m", hi: "-35 मी", te: "-35 మీ", reviewed: false }, mistakeTag: "added_all_movements" },
      { id: "D", text: { en: "-1 m", hi: "-1 मी", te: "-1 మీ", reviewed: false }, mistakeTag: "confused_direction_signs" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Position = -18 + 12 - 5 = -6 - 5 = -11 m.",
      hi: "स्थिति = -18 + 12 - 5 = -6 - 5 = -11 मी।",
      te: "స్థానం = -18 + 12 - 5 = -6 - 5 = -11 మీ.",
      reviewed: false
    },
    hint: {
      en: "Ascending is positive (+); descending is negative (-).",
      hi: "ऊपर चढ़ना धनात्मक (+) है; नीचे उतरना ऋणात्मक (-) है।",
      te: "పైకి వెళ్లడం ధనాత్మకం (+); కిందకు వెళ్లడం రుణాత్మకం (-).",
      reviewed: false
    }
  },
  {
    id: "q-c6-neg-d3-03",
    conceptId: "c6-neg-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "A survey drone hovers at an altitude of +45 m above sea level. Directly beneath it, a coral reef lies at -15 m below sea level. A pelican flies at an altitude exactly halfway between the drone and the reef. What is the pelican's altitude?",
      hi: "एक सर्वेक्षण ड्रोन समुद्र तल से +45 मीटर की ऊंचाई पर उड़ रहा है। ठीक इसके नीचे, एक प्रवाल भित्ति समुद्र तल से -15 मीटर पर है। एक पेलिकन ड्रोन और भित्ति के ठीक बीच में उड़ रहा है। पेलिकन की ऊंचाई क्या है?",
      te: "ఒక సర్వే డ్రోన్ సముద్ర మట్టానికి +45 మీటర్ల ఎత్తులో ఉంది. దాని కింద ఒక పగడపు దిబ్బ -15 మీటర్ల లోతులో ఉంది. ఒక పక్షి డ్రోన్ మరియు దిబ్బకు సరిగ్గా మధ్యలో ఎగురుతోంది. ఆ పక్షి ఎత్తు ఎంత?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "0 m", hi: "0 मी", te: "0 మీ", reviewed: false }, mistakeTag: "confused_zero_reference" },
      { id: "B", text: { en: "+15 m", hi: "+15 मी", te: "+15 మీ", reviewed: false } },
      { id: "C", text: { en: "+30 m", hi: "+30 मी", te: "+30 మీ", reviewed: false }, mistakeTag: "subtracted_half_distance" },
      { id: "D", text: { en: "-15 m", hi: "-15 मी", te: "-15 మీ", reviewed: false }, mistakeTag: "negative_average_error" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "The midpoint is the average of the two elevations: [45 + (-15)] / 2 = 30 / 2 = +15 m.",
      hi: "मध्य बिंदु दोनों ऊंचाइयों का औसत है: [45 + (-15)] / 2 = 30 / 2 = +15 मी।",
      te: "మధ్య బిందువు రెండు ఎత్తుల సగటు: [45 + (-15)] / 2 = 30 / 2 = +15 మీ.",
      reviewed: false
    },
    hint: {
      en: "Add the two numbers and divide by 2.",
      hi: "दोनों संख्याओं को जोड़ें और 2 से भाग दें।",
      te: "రెండు సంఖ్యలను కలిపి 2 తో భాగించండి.",
      reviewed: false
    }
  },

  // --------------------------------------------------------------------------
  // Concept 2: c7-int-02 (Class 7: Multiplication of Integers and Rules of Signs)
  // --------------------------------------------------------------------------
  // Difficulty 1
  {
    id: "q-c7-int-d1-01",
    conceptId: "c7-int-02",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the product: (-6) × 7.",
      hi: "गुणनफल ज्ञात कीजिए: (-6) × 7.",
      te: "లబ్ధాన్ని కనుగొనండి: (-6) × 7.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "42", hi: "42", te: "42", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" },
      { id: "B", text: { en: "-42", hi: "-42", te: "-42", reviewed: false } },
      { id: "C", text: { en: "1", hi: "1", te: "1", reviewed: false }, mistakeTag: "added_instead_of_multiplied" },
      { id: "D", text: { en: "-13", hi: "-13", te: "-13", reviewed: false }, mistakeTag: "added_with_negative_sign" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "The product of a negative integer and a positive integer is always negative: (-6) × 7 = -42.",
      hi: "एक ऋणात्मक पूर्णांक और एक धनात्मक पूर्णांक का गुणनफल हमेशा ऋणात्मक होता है: (-6) × 7 = -42।",
      te: "ఒక రుణ పూర్ణాంకం మరియు ఒక ధన పూర్ణాంకం లబ్ధం ఎల్లప్పుడూ రుణాత్మకం: (-6) × 7 = -42.",
      reviewed: false
    },
    hint: {
      en: "Negative × Positive = Negative.",
      hi: "ऋणात्मक × धनात्मक = ऋणात्मक।",
      te: "రుణ సంఖ్య × ధన సంఖ్య = రుణ సంఖ్య.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d1-02",
    conceptId: "c7-int-02",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the product: (-9) × (-8).",
      hi: "गुणनफल ज्ञात कीजिए: (-9) × (-8).",
      te: "లబ్ధాన్ని కనుగొనండి: (-9) × (-8).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "72", hi: "72", te: "72", reviewed: false } },
      { id: "B", text: { en: "-72", hi: "-72", te: "-72", reviewed: false }, mistakeTag: "negative_times_negative_equals_negative_error" },
      { id: "C", text: { en: "-17", hi: "-17", te: "-17", reviewed: false }, mistakeTag: "added_with_negative_sign" },
      { id: "D", text: { en: "17", hi: "17", te: "17", reviewed: false }, mistakeTag: "added_instead_of_multiplied" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "The product of two negative integers is always positive: (-9) × (-8) = +72.",
      hi: "दो ऋणात्मक पूर्णांकों का गुणनफल हमेशा धनात्मक होता है: (-9) × (-8) = +72।",
      te: "రెండు రుణ పూర్ణాంకాల లబ్ధం ఎల్లప్పుడూ ధనాత్మకం: (-9) × (-8) = +72.",
      reviewed: false
    },
    hint: {
      en: "Negative × Negative = Positive.",
      hi: "ऋणात्मक × ऋणात्मक = धनात्मक।",
      te: "రుణ సంఖ్య × రుణ సంఖ్య = ధన సంఖ్య.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d1-03",
    conceptId: "c7-int-02",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the product: 12 × (-5).",
      hi: "गुणनफल ज्ञात कीजिए: 12 × (-5).",
      te: "లబ్ధాన్ని కనుగొనండి: 12 × (-5).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "60", hi: "60", te: "60", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" },
      { id: "B", text: { en: "-7", hi: "-7", te: "-7", reviewed: false }, mistakeTag: "subtracted_magnitudes_negative" },
      { id: "C", text: { en: "7", hi: "7", te: "7", reviewed: false }, mistakeTag: "added_instead_of_multiplied" },
      { id: "D", text: { en: "-60", hi: "-60", te: "-60", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "Positive × Negative = Negative: 12 × (-5) = -60.",
      hi: "धनात्मक × ऋणात्मक = ऋणात्मक: 12 × (-5) = -60।",
      te: "ధన సంఖ్య × రుణ సంఖ్య = రుణ సంఖ్య: 12 × (-5) = -60.",
      reviewed: false
    },
    hint: {
      en: "Multiplying with one negative factor yields a negative result.",
      hi: "एक ऋणात्मक गुणनखंड से गुणा करने पर ऋणात्मक परिणाम मिलता है।",
      te: "ఒక రుణ గుణకం ఉంటే ఫలితం రుణాత్మకం అవుతుంది.",
      reviewed: false
    }
  },

  // Difficulty 2
  {
    id: "q-c7-int-d2-01",
    conceptId: "c7-int-02",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate the product of three integers: (-3) × (-4) × (-5).",
      hi: "तीन पूर्णांकों के गुणनफल का मान ज्ञात कीजिए: (-3) × (-4) × (-5).",
      te: "మూడు పూర్ణాంకాల లబ్ధాన్ని కనుగొనండి: (-3) × (-4) × (-5).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "60", hi: "60", te: "60", reviewed: false }, mistakeTag: "odd_even_negative_count_confusion" },
      { id: "B", text: { en: "-12", hi: "-12", te: "-12", reviewed: false }, mistakeTag: "added_with_negative_sign" },
      { id: "C", text: { en: "-60", hi: "-60", te: "-60", reviewed: false } },
      { id: "D", text: { en: "20", hi: "20", te: "20", reviewed: false }, mistakeTag: "dropped_first_factor" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "First multiply (-3) × (-4) = +12. Then (+12) × (-5) = -60. An odd count of negative factors (3) yields a negative product.",
      hi: "पहले गुणा करें (-3) × (-4) = +12। फिर (+12) × (-5) = -60। ऋणात्मक गुणनखंडों की विषम संख्या (3) होने पर परिणाम ऋणात्मक होता है।",
      te: "మొదట (-3) × (-4) = +12. తర్వాత (+12) × (-5) = -60. బేసి సంఖ్యలో రుణ గుణకాలు ఉంటే ఫలితం రుణాత్మకం.",
      reviewed: false
    },
    hint: {
      en: "An odd number of negative signs results in a negative product.",
      hi: "ऋणात्मक चिह्नों की विषम संख्या होने पर गुणनफल ऋणात्मक होता है।",
      te: "బేసి సంఖ్యలో మైనస్ గుర్తులు ఉంటే ఫలితం మైనస్ అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d2-02",
    conceptId: "c7-int-02",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "A cold-storage facility reduces its internal temperature at a steady rate of 3°C per hour (change of -3°C/hr). What is the total temperature change after 8 hours?",
      hi: "एक कोल्ड स्टोरेज सुविधा अपने आंतरिक तापमान को 3°C प्रति घंटे की स्थिर दर से कम करती है (-3°C/घंटे का बदलाव)। 8 घंटे बाद कुल तापमान परिवर्तन क्या होगा?",
      te: "ఒక కోల్డ్ స్టోరేజ్ గంటకు 3°C చొప్పున ఉష్ణోగ్రతను తగ్గిస్తుంది (-3°C/గం). 8 గంటల తర్వాత మొత్తం ఉష్ణోగ్రత మార్పు ఎంత?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-24°C", hi: "-24°C", te: "-24°C", reviewed: false } },
      { id: "B", text: { en: "+24°C", hi: "+24°C", te: "+24°C", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" },
      { id: "C", text: { en: "+5°C", hi: "+5°C", te: "+5°C", reviewed: false }, mistakeTag: "added_instead_of_multiplied" },
      { id: "D", text: { en: "-11°C", hi: "-11°C", te: "-11°C", reviewed: false }, mistakeTag: "subtracted_instead_of_multiplied" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Total change = Rate × Time = (-3°C) × 8 = -24°C.",
      hi: "कुल परिवर्तन = दर × समय = (-3°C) × 8 = -24°C।",
      te: "మొత్తం మార్పు = రేటు × సమయం = (-3°C) × 8 = -24°C.",
      reviewed: false
    },
    hint: {
      en: "Multiply the hourly change (-3) by 8 hours.",
      hi: "प्रति घंटे के बदलाव (-3) को 8 घंटों से गुणा करें।",
      te: "గంట మార్పు (-3) ని 8 గంటలతో గుణించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d2-03",
    conceptId: "c7-int-02",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "What is the product of multiplying (-1) by itself 5 times: (-1) × (-1) × (-1) × (-1) × (-1)?",
      hi: "(-1) को 5 बार स्वयं से गुणा करने पर क्या मान प्राप्त होगा: (-1) × (-1) × (-1) × (-1) × (-1)?",
      te: "(-1) ని 5 సార్లు గుణిస్తే వచ్చే లబ్ధం ఎంత: (-1) × (-1) × (-1) × (-1) × (-1)?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "1", hi: "1", te: "1", reviewed: false }, mistakeTag: "odd_even_negative_count_confusion" },
      { id: "B", text: { en: "-1", hi: "-1", te: "-1", reviewed: false } },
      { id: "C", text: { en: "-5", hi: "-5", te: "-5", reviewed: false }, mistakeTag: "multiplied_by_count" },
      { id: "D", text: { en: "0", hi: "0", te: "0", reviewed: false }, mistakeTag: "confused_with_zero" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "(-1) raised to an odd power is always -1. There are 5 negative signs, so the product is -1.",
      hi: "(-1) की विषम घात हमेशा -1 होती है। यहाँ 5 ऋणात्मक चिह्न हैं, इसलिए गुणनफल -1 है।",
      te: "(-1) యొక్క బేసి ఘాతం ఎల్లప్పుడూ -1. 5 మైనస్ గుర్తులు ఉన్నాయి కాబట్టి లబ్ధం -1.",
      reviewed: false
    },
    hint: {
      en: "Pairs of negative signs turn positive; one unpaired negative sign remains.",
      hi: "ऋणात्मक चिह्नों के जोड़े धनात्मक बन जाते हैं; एक बिना जोड़े का ऋणात्मक चिह्न शेष रहता है।",
      te: "మైనస్ గుర్తుల జతలు ప్లస్ అవుతాయి; ఒక మిగిలిన మైనస్ గుర్తు ఉంటుంది.",
      reviewed: false
    }
  },

  // Difficulty 3
  {
    id: "q-c7-int-d3-01",
    conceptId: "c7-int-02",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate using order of operations: (-7) × [(-4) + (-6)].",
      hi: "संक्रियाओं के क्रम का उपयोग करके मान ज्ञात कीजिए: (-7) × [(-4) + (-6)].",
      te: "గణిత నియమాలను ఉపయోగించి సాధించండి: (-7) × [(-4) + (-6)].",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-70", hi: "-70", te: "-70", reviewed: false }, mistakeTag: "negative_times_negative_equals_negative_error" },
      { id: "B", text: { en: "-14", hi: "-14", te: "-14", reviewed: false }, mistakeTag: "sign_error_in_brackets" },
      { id: "C", text: { en: "168", hi: "168", te: "168", reviewed: false }, mistakeTag: "multiplied_instead_of_added_in_bracket" },
      { id: "D", text: { en: "70", hi: "70", te: "70", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "First evaluate inside brackets: (-4) + (-6) = -10. Then multiply: (-7) × (-10) = +70.",
      hi: "पहले कोष्ठक के अंदर का हल करें: (-4) + (-6) = -10। फिर गुणा करें: (-7) × (-10) = +70।",
      te: "మొదట బ్రాకెట్ లోపల ఉన్నది సాధించండి: (-4) + (-6) = -10. తర్వాత గుణించండి: (-7) × (-10) = +70.",
      reviewed: false
    },
    hint: {
      en: "Add the terms inside the square brackets first, then multiply by -7.",
      hi: "पहले कोष्ठक के अंदर के पदों को जोड़ें, फिर -7 से गुणा करें।",
      te: "మొదట బ్రాకెట్ లోపల కూడి, తర్వాత -7 తో గుణించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d3-02",
    conceptId: "c7-int-02",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "In a competitive exam, +4 marks are awarded for each correct answer and -2 marks are deducted for each incorrect answer. Maya attempted all questions, answering 12 correctly and 6 incorrectly. What was her final score?",
      hi: "एक प्रतियोगी परीक्षा में प्रत्येक सही उत्तर के लिए +4 अंक दिए जाते हैं और प्रत्येक गलत उत्तर के लिए -2 अंक काटे जाते हैं। माया ने 12 सही और 6 गलत उत्तर दिए। उसका अंतिम स्कोर क्या था?",
      te: "ఒక పోటీ పరీక్షలో ప్రతి సరైన సమాధానానికి +4 మార్కులు, తప్పు సమాధానానికి -2 మార్కులు ఇస్తారు. మాయ 12 సరైనవి మరియు 6 తప్పు సమాధానాలు ఇచ్చింది. ఆమె మొత్తం మార్కులు ఎన్ని?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "36 marks", hi: "36 अंक", te: "36 మార్కులు", reviewed: false } },
      { id: "B", text: { en: "48 marks", hi: "48 अंक", te: "48 మార్కులు", reviewed: false }, mistakeTag: "subtracted_magnitudes_without_signs" },
      { id: "C", text: { en: "60 marks", hi: "60 अंक", te: "60 మార్కులు", reviewed: false }, mistakeTag: "added_penalties_as_positive" },
      { id: "D", text: { en: "24 marks", hi: "24 अंक", te: "24 మార్కులు", reviewed: false }, mistakeTag: "subtracted_both" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Score = (12 × 4) + [6 × (-2)] = 48 + (-12) = 36 marks.",
      hi: "स्कोर = (12 × 4) + [6 × (-2)] = 48 + (-12) = 36 अंक।",
      te: "స్కోరు = (12 × 4) + [6 × (-2)] = 48 + (-12) = 36 మార్కులు.",
      reviewed: false
    },
    hint: {
      en: "Multiply 12 by 4, multiply 6 by -2, and add the two amounts.",
      hi: "12 को 4 से गुणा करें, 6 को -2 से गुणा करें, और दोनों को जोड़ें।",
      te: "12 ని 4 తో, 6 ని -2 తో గుణించి, రెండింటినీ కలపండి.",
      reviewed: false
    }
  },
  {
    id: "q-c7-int-d3-03",
    conceptId: "c7-int-02",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate the product: (-2) × 5 × (-3) × (-4).",
      hi: "गुणनफल का मान ज्ञात कीजिए: (-2) × 5 × (-3) × (-4).",
      te: "లబ్ధాన్ని సాధించండి: (-2) × 5 × (-3) × (-4).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "120", hi: "120", te: "120", reviewed: false }, mistakeTag: "odd_even_negative_count_confusion" },
      { id: "B", text: { en: "-4", hi: "-4", te: "-4", reviewed: false }, mistakeTag: "added_with_negative_sign" },
      { id: "C", text: { en: "-120", hi: "-120", te: "-120", reviewed: false } },
      { id: "D", text: { en: "60", hi: "60", te: "60", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Product of magnitudes = 2 × 5 × 3 × 4 = 120. Count of negative factors = 3 (odd). Hence result is -120.",
      hi: "संख्याओं का गुणनफल = 2 × 5 × 3 × 4 = 120। ऋणात्मक गुणनखंडों की संख्या = 3 (विषम)। अतः परिणाम -120 है।",
      te: "సంఖ్యల లబ్ధం = 2 × 5 × 3 × 4 = 120. రుణ గుణకాల సంఖ్య = 3 (బేసి). కాబట్టి జవాబు -120.",
      reviewed: false
    },
    hint: {
      en: "Count the number of negative signs: 3 negative signs produce a negative result.",
      hi: "ऋणात्मक चिह्नों की गिनती करें: 3 ऋणात्मक चिह्नों का परिणाम ऋणात्मक होता है।",
      te: "మైనస్ గుర్తులను లెక్కించండి: 3 మైనస్ గుర్తులు ఉన్నందున ఫలితం రుణాత్మకం.",
      reviewed: false
    }
  },

  // --------------------------------------------------------------------------
  // Concept 3: c8-dist-01 (Class 8: The Distributive Law with Signed Monomials)
  // --------------------------------------------------------------------------
  // Difficulty 1
  {
    id: "q-c8-dist-d1-01",
    conceptId: "c8-dist-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand the algebraic expression using the distributive law: 4(2x + 5).",
      hi: "वितरण नियम का उपयोग करके बीजगणितीय व्यंजक का विस्तार करें: 4(2x + 5).",
      te: "విభాగ న్యాయాన్ని ఉపయోగించి విస్తరించండి: 4(2x + 5).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "8x + 20", hi: "8x + 20", te: "8x + 20", reviewed: false } },
      { id: "B", text: { en: "8x + 5", hi: "8x + 5", te: "8x + 5", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" },
      { id: "C", text: { en: "6x + 9", hi: "6x + 9", te: "6x + 9", reviewed: false }, mistakeTag: "added_coefficients_instead_of_multiplied" },
      { id: "D", text: { en: "8x + 20x", hi: "8x + 20x", te: "8x + 20x", reviewed: false }, mistakeTag: "multiplied_variable_only" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Multiply the outer term 4 by both terms inside: 4(2x) + 4(5) = 8x + 20.",
      hi: "बाहरी पद 4 को अंदर के दोनों पदों से गुणा करें: 4(2x) + 4(5) = 8x + 20।",
      te: "బయట ఉన్న 4 ని బ్రాకెట్ లోపల ఉన్న రెండు పదాలతో గుణించండి: 4(2x) + 4(5) = 8x + 20.",
      reviewed: false
    },
    hint: {
      en: "Distribute 4 to both 2x and 5: a(b + c) = ab + ac.",
      hi: "4 को 2x और 5 दोनों में वितरित करें: a(b + c) = ab + ac।",
      te: "4 ని 2x మరియు 5 రెండింటికీ వర్తింపజేయండి: a(b + c) = ab + ac.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d1-02",
    conceptId: "c8-dist-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand: 3(4x - 7).",
      hi: "विस्तार कीजिए: 3(4x - 7).",
      te: "విస్తరించండి: 3(4x - 7).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "12x + 21", hi: "12x + 21", te: "12x + 21", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" },
      { id: "B", text: { en: "12x - 7", hi: "12x - 7", te: "12x - 7", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" },
      { id: "C", text: { en: "12x - 21", hi: "12x - 21", te: "12x - 21", reviewed: false } },
      { id: "D", text: { en: "7x - 4", hi: "7x - 4", te: "7x - 4", reviewed: false }, mistakeTag: "added_instead_of_multiplied" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "3(4x) + 3(-7) = 12x - 21.",
      hi: "3(4x) + 3(-7) = 12x - 21।",
      te: "3(4x) + 3(-7) = 12x - 21.",
      reviewed: false
    },
    hint: {
      en: "Remember that 3 multiplied by -7 gives -21.",
      hi: "ध्यान रखें कि 3 को -7 से गुणा करने पर -21 आता है।",
      te: "3 ని -7 తో గుణిస్తే -21 వస్తుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d1-03",
    conceptId: "c8-dist-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand: -5(3y + 2).",
      hi: "विस्तार कीजिए: -5(3y + 2).",
      te: "విస్తరించండి: -5(3y + 2).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-15y + 10", hi: "-15y + 10", te: "-15y + 10", reviewed: false }, mistakeTag: "sign_error_negative_times_positive" },
      { id: "B", text: { en: "-15y - 10", hi: "-15y - 10", te: "-15y - 10", reviewed: false } },
      { id: "C", text: { en: "15y - 10", hi: "15y - 10", te: "15y - 10", reviewed: false }, mistakeTag: "dropped_negative_on_first_term" },
      { id: "D", text: { en: "-15y + 2", hi: "-15y + 2", te: "-15y + 2", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Distribute -5: (-5)(3y) + (-5)(2) = -15y - 10.",
      hi: "-5 को वितरित करें: (-5)(3y) + (-5)(2) = -15y - 10।",
      te: "-5 ని గుణించండి: (-5)(3y) + (-5)(2) = -15y - 10.",
      reviewed: false
    },
    hint: {
      en: "A negative factor flips the sign of every term inside the parentheses.",
      hi: "ऋणात्मक गुणनखंड कोष्ठक के अंदर के प्रत्येक पद का चिह्न बदल देता है।",
      te: "రుణ గుణకం బ్రాకెట్ లోపల ఉన్న ప్రతి పదం గుర్తును మారుస్తుంది.",
      reviewed: false
    }
  },

  // Difficulty 2
  {
    id: "q-c8-dist-d2-01",
    conceptId: "c8-dist-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand the expression: -6(2a - 5).",
      hi: "व्यंजक का विस्तार कीजिए: -6(2a - 5).",
      te: "విస్తరించండి: -6(2a - 5).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-12a - 30", hi: "-12a - 30", te: "-12a - 30", reviewed: false }, mistakeTag: "sign_error_negative_times_negative_became_negative" },
      { id: "B", text: { en: "12a - 30", hi: "12a - 30", te: "12a - 30", reviewed: false }, mistakeTag: "dropped_negative_on_first_term" },
      { id: "C", text: { en: "-12a - 5", hi: "-12a - 5", te: "-12a - 5", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" },
      { id: "D", text: { en: "-12a + 30", hi: "-12a + 30", te: "-12a + 30", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "(-6)(2a) + (-6)(-5) = -12a + 30. Remember that negative × negative = positive.",
      hi: "(-6)(2a) + (-6)(-5) = -12a + 30। याद रखें कि ऋणात्मक × ऋणात्मक = धनात्मक होता है।",
      te: "(-6)(2a) + (-6)(-5) = -12a + 30. మైనస్ × మైనస్ = ప్లస్ అవుతుంది.",
      reviewed: false
    },
    hint: {
      en: "Multiplying -6 by -5 produces +30.",
      hi: "-6 को -5 से गुणा करने पर +30 प्राप्त होता है।",
      te: "-6 ని -5 తో గుణిస్తే +30 వస్తుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d2-02",
    conceptId: "c8-dist-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand: -2x(3x - 4).",
      hi: "विस्तार कीजिए: -2x(3x - 4).",
      te: "విస్తరించండి: -2x(3x - 4).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-6x² + 8x", hi: "-6x² + 8x", te: "-6x² + 8x", reviewed: false } },
      { id: "B", text: { en: "-6x² - 8x", hi: "-6x² - 8x", te: "-6x² - 8x", reviewed: false }, mistakeTag: "sign_error_negative_times_negative_became_negative" },
      { id: "C", text: { en: "-6x + 8x", hi: "-6x + 8x", te: "-6x + 8x", reviewed: false }, mistakeTag: "dropped_exponent_on_variable" },
      { id: "D", text: { en: "-6x² - 4", hi: "-6x² - 4", te: "-6x² - 4", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "(-2x)(3x) + (-2x)(-4) = -6x² + 8x. The powers of x add: x × x = x².",
      hi: "(-2x)(3x) + (-2x)(-4) = -6x² + 8x। x की घातें जुड़ती हैं: x × x = x²।",
      te: "(-2x)(3x) + (-2x)(-4) = -6x² + 8x. చరరాశి ఘాతాలు కూడబడతాయి: x × x = x².",
      reviewed: false
    },
    hint: {
      en: "Distribute -2x to both terms; (-2x)(-4) = +8x.",
      hi: "-2x को दोनों पदों में वितरित करें; (-2x)(-4) = +8x।",
      te: "-2x ని రెండు పదాలతో గుణించండి; (-2x)(-4) = +8x.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d2-03",
    conceptId: "c8-dist-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand: 7a(a - 3b).",
      hi: "विस्तार कीजिए: 7a(a - 3b).",
      te: "విస్తరించండి: 7a(a - 3b).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "7a² + 21ab", hi: "7a² + 21ab", te: "7a² + 21ab", reviewed: false }, mistakeTag: "sign_error_positive_times_negative" },
      { id: "B", text: { en: "7a² - 21ab", hi: "7a² - 21ab", te: "7a² - 21ab", reviewed: false } },
      { id: "C", text: { en: "7a² - 3b", hi: "7a² - 3b", te: "7a² - 3b", reviewed: false }, mistakeTag: "neglected_distributing_to_second_term" },
      { id: "D", text: { en: "7a² - 21a", hi: "7a² - 21a", te: "7a² - 21a", reviewed: false }, mistakeTag: "dropped_second_variable" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "(7a)(a) + (7a)(-3b) = 7a² - 21ab.",
      hi: "(7a)(a) + (7a)(-3b) = 7a² - 21ab।",
      te: "(7a)(a) + (7a)(-3b) = 7a² - 21ab.",
      reviewed: false
    },
    hint: {
      en: "Multiply coefficients and variables: 7a × (-3b) = -21ab.",
      hi: "गुणांकों और चरों को गुणा करें: 7a × (-3b) = -21ab।",
      te: "గుణకాలు మరియు చరరాశులను గుణించండి: 7a × (-3b) = -21ab.",
      reviewed: false
    }
  },

  // Difficulty 3
  {
    id: "q-c8-dist-d3-01",
    conceptId: "c8-dist-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Simplify by expanding and combining like terms: 3(2x - 4) - 2(x - 5).",
      hi: "विस्तार करके और समान पदों को मिलाकर सरल कीजिए: 3(2x - 4) - 2(x - 5).",
      te: "విస్తరించి, సజాతి పదాలను కలపడం ద్వారా సరళీకరించండి: 3(2x - 4) - 2(x - 5).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "4x - 22", hi: "4x - 22", te: "4x - 22", reviewed: false }, mistakeTag: "sign_error_distributing_negative_to_second_term" },
      { id: "B", text: { en: "4x + 2", hi: "4x + 2", te: "4x + 2", reviewed: false }, mistakeTag: "sign_error_combining_constants" },
      { id: "C", text: { en: "4x - 2", hi: "4x - 2", te: "4x - 2", reviewed: false } },
      { id: "D", text: { en: "x - 2", hi: "x - 2", te: "x - 2", reviewed: false }, mistakeTag: "subtracted_coefficients_without_expanding" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Expand: 3(2x - 4) = 6x - 12. Expand: -2(x - 5) = -2x + 10. Combine: (6x - 2x) + (-12 + 10) = 4x - 2.",
      hi: "विस्तार: 3(2x - 4) = 6x - 12। विस्तार: -2(x - 5) = -2x + 10। मिलाएँ: (6x - 2x) + (-12 + 10) = 4x - 2।",
      te: "విస్తరణ: 3(2x - 4) = 6x - 12. విస్తరణ: -2(x - 5) = -2x + 10. కలపండి: (6x - 2x) + (-12 + 10) = 4x - 2.",
      reviewed: false
    },
    hint: {
      en: "Distribute -2 carefully: (-2)(-5) becomes +10.",
      hi: "-2 का सावधानीपूर्वक वितरण करें: (-2)(-5) बन जाता है +10।",
      te: "-2 ని జాగ్రత్తగా గుణించండి: (-2)(-5) +10 అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d3-02",
    conceptId: "c8-dist-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Simplify: 5(x - 2) - 3(2x + 1).",
      hi: "सरल कीजिए: 5(x - 2) - 3(2x + 1).",
      te: "సరళీకరించండి: 5(x - 2) - 3(2x + 1).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "-x - 13", hi: "-x - 13", te: "-x - 13", reviewed: false } },
      { id: "B", text: { en: "-x - 7", hi: "-x - 7", te: "-x - 7", reviewed: false }, mistakeTag: "sign_error_distributing_negative_to_second_term" },
      { id: "C", text: { en: "x - 13", hi: "x - 13", te: "x - 13", reviewed: false }, mistakeTag: "lost_negative_sign_on_larger_magnitude" },
      { id: "D", text: { en: "-x + 7", hi: "-x + 7", te: "-x + 7", reviewed: false }, mistakeTag: "sign_error_combining_constants" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Expand: 5x - 10 - 6x - 3. Combine: (5x - 6x) + (-10 - 3) = -x - 13.",
      hi: "विस्तार: 5x - 10 - 6x - 3। मिलाएँ: (5x - 6x) + (-10 - 3) = -x - 13।",
      te: "విస్తరణ: 5x - 10 - 6x - 3. కలపండి: (5x - 6x) + (-10 - 3) = -x - 13.",
      reviewed: false
    },
    hint: {
      en: "Remember that -3 × (+1) = -3, and -10 - 3 = -13.",
      hi: "याद रखें कि -3 × (+1) = -3, और -10 - 3 = -13 होता है।",
      te: "-3 × (+1) = -3 మరియు -10 - 3 = -13 అని గుర్తుంచుకోండి.",
      reviewed: false
    }
  },
  {
    id: "q-c8-dist-d3-03",
    conceptId: "c8-dist-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Simplify: 2p(p - q) - 3q(p - q).",
      hi: "सरल कीजिए: 2p(p - q) - 3q(p - q).",
      te: "సరళీకరించండి: 2p(p - q) - 3q(p - q).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "2p² - 5pq - 3q²", hi: "2p² - 5pq - 3q²", te: "2p² - 5pq - 3q²", reviewed: false }, mistakeTag: "sign_error_negative_times_negative_became_negative" },
      { id: "B", text: { en: "2p² - 5pq + 3q²", hi: "2p² - 5pq + 3q²", te: "2p² - 5pq + 3q²", reviewed: false } },
      { id: "C", text: { en: "2p² - pq + 3q²", hi: "2p² - pq + 3q²", te: "2p² - pq + 3q²", reviewed: false }, mistakeTag: "sign_error_combining_middle_terms" },
      { id: "D", text: { en: "2p² + 5pq + 3q²", hi: "2p² + 5pq + 3q²", te: "2p² + 5pq + 3q²", reviewed: false }, mistakeTag: "dropped_negative_signs" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Expand: 2p² - 2pq - 3pq + 3q² = 2p² - 5pq + 3q². (-3q)(-q) yields +3q².",
      hi: "विस्तार: 2p² - 2pq - 3pq + 3q² = 2p² - 5pq + 3q²। (-3q)(-q) से +3q² प्राप्त होता है।",
      te: "విస్తరణ: 2p² - 2pq - 3pq + 3q² = 2p² - 5pq + 3q². (-3q)(-q) నుండి +3q² వస్తుంది.",
      reviewed: false
    },
    hint: {
      en: "Notice that (-3q) × (-q) = +3q², and combine -2pq - 3pq = -5pq.",
      hi: "ध्यान दें कि (-3q) × (-q) = +3q², और -2pq - 3pq = -5pq होता है।",
      te: "(-3q) × (-q) = +3q² అవుతుంది, మరియు -2pq - 3pq = -5pq కలపండి.",
      reviewed: false
    }
  },

  // --------------------------------------------------------------------------
  // Concept 4: c9-id-01 (Class 9: Standard Algebraic Identities and Patterns)
  // --------------------------------------------------------------------------
  // Difficulty 1
  {
    id: "q-c9-id-d1-01",
    conceptId: "c9-id-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand (x + 5)² using standard algebraic identities.",
      hi: "मानक बीजगणितीय सर्वसमिकाओं का उपयोग करके (x + 5)² का विस्तार कीजिए।",
      te: "బీజగణిత సర్వసమీకరణాలను ఉపయోగించి (x + 5)² ను విస్తరించండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x² + 10x + 25", hi: "x² + 10x + 25", te: "x² + 10x + 25", reviewed: false } },
      { id: "B", text: { en: "x² + 25", hi: "x² + 25", te: "x² + 25", reviewed: false }, mistakeTag: "omitted_middle_linear_terms" },
      { id: "C", text: { en: "x² + 5x + 25", hi: "x² + 5x + 25", te: "x² + 5x + 25", reviewed: false }, mistakeTag: "forgot_factor_of_two_in_middle_term" },
      { id: "D", text: { en: "x² + 10x + 10", hi: "x² + 10x + 10", te: "x² + 10x + 10", reviewed: false }, mistakeTag: "multiplied_by_two_instead_of_squaring" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Using (a + b)² = a² + 2ab + b²: x² + 2(x)(5) + 5² = x² + 10x + 25.",
      hi: "(a + b)² = a² + 2ab + b² का उपयोग करते हुए: x² + 2(x)(5) + 5² = x² + 10x + 25।",
      te: "(a + b)² = a² + 2ab + b² సూత్రం ప్రకారం: x² + 2(x)(5) + 5² = x² + 10x + 25.",
      reviewed: false
    },
    hint: {
      en: "Don't forget the middle term 2ab.",
      hi: "मध्य पद 2ab को न भूलें।",
      te: "మధ్య పదం 2ab ని మర్చిపోకండి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d1-02",
    conceptId: "c9-id-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand (x - 6)² using algebraic identities.",
      hi: "बीजगणितीय सर्वसमिकाओं का उपयोग करके (x - 6)² का विस्तार कीजिए।",
      te: "(x - 6)² ను విస్తరించండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x² + 12x + 36", hi: "x² + 12x + 36", te: "x² + 12x + 36", reviewed: false }, mistakeTag: "sign_error_middle_term_positive_instead_of_negative" },
      { id: "B", text: { en: "x² + 36", hi: "x² + 36", te: "x² + 36", reviewed: false }, mistakeTag: "omitted_middle_linear_terms" },
      { id: "C", text: { en: "x² - 12x - 36", hi: "x² - 12x - 36", te: "x² - 12x - 36", reviewed: false }, mistakeTag: "sign_error_constant_product" },
      { id: "D", text: { en: "x² - 12x + 36", hi: "x² - 12x + 36", te: "x² - 12x + 36", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "Using (a - b)² = a² - 2ab + b²: x² - 2(x)(6) + 6² = x² - 12x + 36.",
      hi: "(a - b)² = a² - 2ab + b² का उपयोग करते हुए: x² - 2(x)(6) + 6² = x² - 12x + 36।",
      te: "(a - b)² = a² - 2ab + b² సూత్రం ప్రకారం: x² - 2(x)(6) + 6² = x² - 12x + 36.",
      reviewed: false
    },
    hint: {
      en: "The square of a negative number is positive: (-6)² = +36, but the middle term is negative.",
      hi: "ऋणात्मक संख्या का वर्ग धनात्मक होता है: (-6)² = +36, लेकिन मध्य पद ऋणात्मक होता है।",
      te: "రుణ సంఖ్య వర్గం ధనాత్మకం: (-6)² = +36, కానీ మధ్య పదం రుణాత్మకం.",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d1-03",
    conceptId: "c9-id-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand: (2x + 3)².",
      hi: "विस्तार कीजिए: (2x + 3)².",
      te: "విస్తరించండి: (2x + 3)².",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "2x² + 12x + 9", hi: "2x² + 12x + 9", te: "2x² + 12x + 9", reviewed: false }, mistakeTag: "dropped_coefficient_square" },
      { id: "B", text: { en: "4x² + 12x + 9", hi: "4x² + 12x + 9", te: "4x² + 12x + 9", reviewed: false } },
      { id: "C", text: { en: "4x² + 6x + 9", hi: "4x² + 6x + 9", te: "4x² + 6x + 9", reviewed: false }, mistakeTag: "forgot_factor_of_two_in_middle_term" },
      { id: "D", text: { en: "4x² + 9", hi: "4x² + 9", te: "4x² + 9", reviewed: false }, mistakeTag: "omitted_middle_linear_terms" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "(2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9. Square both the coefficient 2 and the variable x.",
      hi: "(2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9। गुणांक 2 और चर x दोनों का वर्ग करें।",
      te: "(2x)² + 2(2x)(3) + 3² = 4x² + 12x + 9. గుణకం 2 మరియు చరరాశి x రెండింటినీ వర్గం చేయండి.",
      reviewed: false
    },
    hint: {
      en: "Square the entire first term: (2x)² = 4x².",
      hi: "पूरे पहले पद का वर्ग करें: (2x)² = 4x²।",
      te: "మొత్తం మొదటి పదాన్ని వర్గం చేయండి: (2x)² = 4x².",
      reviewed: false
    }
  },

  // Difficulty 2
  {
    id: "q-c9-id-d2-01",
    conceptId: "c9-id-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand using the difference of squares identity: (3x + 4)(3x - 4).",
      hi: "वर्गों के अंतर की सर्वसमिका का उपयोग करके विस्तार कीजिए: (3x + 4)(3x - 4).",
      te: "వర్గాల తేడా సూత్రాన్ని ఉపయోగించి విస్తరించండి: (3x + 4)(3x - 4).",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "9x² - 24x - 16", hi: "9x² - 24x - 16", te: "9x² - 24x - 16", reviewed: false }, mistakeTag: "included_non_existent_middle_term_in_difference_of_squares" },
      { id: "B", text: { en: "9x² + 16", hi: "9x² + 16", te: "9x² + 16", reviewed: false }, mistakeTag: "sign_error_difference_of_squares" },
      { id: "C", text: { en: "9x² - 16", hi: "9x² - 16", te: "9x² - 16", reviewed: false } },
      { id: "D", text: { en: "3x² - 16", hi: "3x² - 16", te: "3x² - 16", reviewed: false }, mistakeTag: "dropped_coefficient_square" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Using (a + b)(a - b) = a² - b²: (3x)² - 4² = 9x² - 16.",
      hi: "(a + b)(a - b) = a² - b² का उपयोग करते हुए: (3x)² - 4² = 9x² - 16।",
      te: "(a + b)(a - b) = a² - b² సూత్రం ప్రకారం: (3x)² - 4² = 9x² - 16.",
      reviewed: false
    },
    hint: {
      en: "The product of sum and difference has no middle term: a² - b².",
      hi: "योग और अंतर के गुणनफल में कोई मध्य पद नहीं होता: a² - b²।",
      te: "కూడిక మరియు తీసివేతల లబ్దంలో మధ్య పదం ఉండదు: a² - b².",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d2-02",
    conceptId: "c9-id-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand (x + 7)(x - 3) using the identity (x + a)(x + b) = x² + (a + b)x + ab.",
      hi: "सर्वसमिका (x + a)(x + b) = x² + (a + b)x + ab का उपयोग करके (x + 7)(x - 3) का विस्तार कीजिए।",
      te: "(x + a)(x + b) = x² + (a + b)x + ab సూత్రాన్ని ఉపయోగించి (x + 7)(x - 3) ను విస్తరించండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x² + 4x - 21", hi: "x² + 4x - 21", te: "x² + 4x - 21", reviewed: false } },
      { id: "B", text: { en: "x² - 4x - 21", hi: "x² - 4x - 21", te: "x² - 4x - 21", reviewed: false }, mistakeTag: "sign_error_combining_linear_terms" },
      { id: "C", text: { en: "x² + 4x + 21", hi: "x² + 4x + 21", te: "x² + 4x + 21", reviewed: false }, mistakeTag: "sign_error_constant_product" },
      { id: "D", text: { en: "x² - 21x + 4", hi: "x² - 21x + 4", te: "x² - 21x + 4", reviewed: false }, mistakeTag: "swapped_sum_and_product_coefficients" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Here a = 7, b = -3. Middle coefficient = 7 + (-3) = 4. Constant term = 7 × (-3) = -21. So x² + 4x - 21.",
      hi: "यहाँ a = 7, b = -3। मध्य गुणांक = 7 + (-3) = 4। अचर पद = 7 × (-3) = -21। अतः x² + 4x - 21।",
      te: "ఇక్కడ a = 7, b = -3. మధ్య గుణకం = 7 + (-3) = 4. స్థిర పదం = 7 × (-3) = -21. కాబట్టి x² + 4x - 21.",
      reviewed: false
    },
    hint: {
      en: "The middle term is the sum of 7 and -3; the constant is their product.",
      hi: "मध्य पद 7 और -3 का योग है; अचर पद उनका गुणनफल है।",
      te: "మధ్య పదం 7 మరియు -3 ల మొత్తం; స్థిర పదం వాటి లబ్ధం.",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d2-03",
    conceptId: "c9-id-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Evaluate 103 × 97 without direct multiplication using an algebraic identity.",
      hi: "बीजगणितीय सर्वसमिका का उपयोग करके प्रत्यक्ष गुणा किए बिना 103 × 97 का मान ज्ञात कीजिए।",
      te: "బీజగణిత సూత్రాన్ని ఉపయోగించి నేరుగా గుణించకుండా 103 × 97 విలువను కనుగొనండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "9997", hi: "9997", te: "9997", reviewed: false }, mistakeTag: "subtracted_magnitudes_without_signs" },
      { id: "B", text: { en: "9991", hi: "9991", te: "9991", reviewed: false } },
      { id: "C", text: { en: "10009", hi: "10009", te: "10009", reviewed: false }, mistakeTag: "added_instead_of_subtracted" },
      { id: "D", text: { en: "9981", hi: "9981", te: "9981", reviewed: false }, mistakeTag: "calculation_error" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "103 × 97 = (100 + 3)(100 - 3) = 100² - 3² = 10000 - 9 = 9991.",
      hi: "103 × 97 = (100 + 3)(100 - 3) = 100² - 3² = 10000 - 9 = 9991।",
      te: "103 × 97 = (100 + 3)(100 - 3) = 100² - 3² = 10000 - 9 = 9991.",
      reviewed: false
    },
    hint: {
      en: "Rewrite 103 as (100 + 3) and 97 as (100 - 3).",
      hi: "103 को (100 + 3) और 97 को (100 - 3) के रूप में लिखें।",
      te: "103 ని (100 + 3) గా మరియు 97 ని (100 - 3) గా రాయండి.",
      reviewed: false
    }
  },

  // Difficulty 3
  {
    id: "q-c9-id-d3-01",
    conceptId: "c9-id-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Expand (x - 2y + 3z)² using the identity (a + b + c)².",
      hi: "सर्वसमिका (a + b + c)² का उपयोग करके (x - 2y + 3z)² का विस्तार कीजिए।",
      te: "(a + b + c)² సూత్రాన్ని ఉపయోగించి (x - 2y + 3z)² ను విస్తరించండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x² + 4y² + 9z² + 4xy + 12yz + 6xz", hi: "x² + 4y² + 9z² + 4xy + 12yz + 6xz", te: "x² + 4y² + 9z² + 4xy + 12yz + 6xz", reviewed: false }, mistakeTag: "sign_error_cross_terms_all_positive" },
      { id: "B", text: { en: "x² - 4y² + 9z² - 4xy - 12yz + 6xz", hi: "x² - 4y² + 9z² - 4xy - 12yz + 6xz", te: "x² - 4y² + 9z² - 4xy - 12yz + 6xz", reviewed: false }, mistakeTag: "sign_error_squared_terms_negative" },
      { id: "C", text: { en: "x² + 4y² + 9z² - 2xy - 6yz + 3xz", hi: "x² + 4y² + 9z² - 2xy - 6yz + 3xz", te: "x² + 4y² + 9z² - 2xy - 6yz + 3xz", reviewed: false }, mistakeTag: "forgot_factor_of_two_in_cross_terms" },
      { id: "D", text: { en: "x² + 4y² + 9z² - 4xy - 12yz + 6xz", hi: "x² + 4y² + 9z² - 4xy - 12yz + 6xz", te: "x² + 4y² + 9z² - 4xy - 12yz + 6xz", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "a² + b² + c² + 2ab + 2bc + 2ca = x² + (-2y)² + (3z)² + 2(x)(-2y) + 2(-2y)(3z) + 2(x)(3z) = x² + 4y² + 9z² - 4xy - 12yz + 6xz.",
      hi: "a² + b² + c² + 2ab + 2bc + 2ca = x² + (-2y)² + (3z)² + 2(x)(-2y) + 2(-2y)(3z) + 2(x)(3z) = x² + 4y² + 9z² - 4xy - 12yz + 6xz।",
      te: "a² + b² + c² + 2ab + 2bc + 2ca = x² + 4y² + 9z² - 4xy - 12yz + 6xz.",
      reviewed: false
    },
    hint: {
      en: "Cross terms containing an odd number of negative factors become negative: 2(x)(-2y) = -4xy.",
      hi: "ऋणात्मक गुणनखंड वाले पदों का गुणनफल ऋणात्मक होता है: 2(x)(-2y) = -4xy।",
      te: "ఒక రుణ గుణకం ఉన్న పదాలు రుణాత్మకం అవుతాయి: 2(x)(-2y) = -4xy.",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d3-02",
    conceptId: "c9-id-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "If x + 1/x = 5, find the value of x² + 1/x².",
      hi: "यदि x + 1/x = 5 है, तो x² + 1/x² का मान ज्ञात कीजिए।",
      te: "x + 1/x = 5 అయితే, x² + 1/x² విలువ ఎంత?",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "23", hi: "23", te: "23", reviewed: false } },
      { id: "B", text: { en: "25", hi: "25", te: "25", reviewed: false }, mistakeTag: "omitted_cross_term_subtraction" },
      { id: "C", text: { en: "27", hi: "27", te: "27", reviewed: false }, mistakeTag: "added_cross_term_instead_of_subtracted" },
      { id: "D", text: { en: "10", hi: "10", te: "10", reviewed: false }, mistakeTag: "squared_without_cross_terms" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Square both sides: (x + 1/x)² = 5² => x² + 2(x)(1/x) + 1/x² = 25 => x² + 2 + 1/x² = 25 => x² + 1/x² = 23.",
      hi: "दोनों पक्षों का वर्ग करें: (x + 1/x)² = 5² => x² + 2 + 1/x² = 25 => x² + 1/x² = 23।",
      te: "ఇరువైపులా వర్గం చేయండి: (x + 1/x)² = 5² => x² + 2 + 1/x² = 25 => x² + 1/x² = 23.",
      reviewed: false
    },
    hint: {
      en: "The cross term 2·x·(1/x) simplifies to 2, which must be subtracted from 25.",
      hi: "मध्य पद 2·x·(1/x) सरल होकर 2 बन जाता है, जिसे 25 में से घटाना होगा।",
      te: "మధ్య పదం 2·x·(1/x) 2 అవుతుంది, దానిని 25 నుండి తీసివేయాలి.",
      reviewed: false
    }
  },
  {
    id: "q-c9-id-d3-03",
    conceptId: "c9-id-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Factorise the quadratic expression: 49a² - 28ab + 4b².",
      hi: "द्विघात व्यंजक का गुणनखंडन कीजिए: 49a² - 28ab + 4b².",
      te: "కారణాంకాలుగా విభజించండి: 49a² - 28ab + 4b².",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "(7a + 2b)²", hi: "(7a + 2b)²", te: "(7a + 2b)²", reviewed: false }, mistakeTag: "sign_error_middle_term_positive_instead_of_negative" },
      { id: "B", text: { en: "(7a - 2b)(7a + 2b)", hi: "(7a - 2b)(7a + 2b)", te: "(7a - 2b)(7a + 2b)", reviewed: false }, mistakeTag: "confused_with_difference_of_squares" },
      { id: "C", text: { en: "(7a - 2b)²", hi: "(7a - 2b)²", te: "(7a - 2b)²", reviewed: false } },
      { id: "D", text: { en: "(49a - 4b)²", hi: "(49a - 4b)²", te: "(49a - 4b)²", reviewed: false }, mistakeTag: "dropped_coefficient_square" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Recognize the pattern a² - 2ab + b² = (a - b)²: (7a)² - 2(7a)(2b) + (2b)² = (7a - 2b)².",
      hi: "सर्वसमिका पहचानें a² - 2ab + b² = (a - b)²: (7a)² - 2(7a)(2b) + (2b)² = (7a - 2b)²।",
      te: "a² - 2ab + b² = (a - b)² రూపంలో ఉంది: (7a)² - 2(7a)(2b) + (2b)² = (7a - 2b)².",
      reviewed: false
    },
    hint: {
      en: "49a² = (7a)² and 4b² = (2b)², and 2(7a)(2b) = 28ab.",
      hi: "49a² = (7a)² और 4b² = (2b)², तथा 2(7a)(2b) = 28ab।",
      te: "49a² = (7a)² మరియు 4b² = (2b)², మరియు 2(7a)(2b) = 28ab.",
      reviewed: false
    }
  },

  // --------------------------------------------------------------------------
  // Concept 5: c10-quad-01 (Class 10: Standard Form and Solving by Factoring)
  // --------------------------------------------------------------------------
  // Difficulty 1
  {
    id: "q-c10-quad-d1-01",
    conceptId: "c10-quad-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find the roots of the factored quadratic equation: (x - 5)(x + 2) = 0.",
      hi: "गुणनखंडित द्विघात समीकरण के मूल ज्ञात कीजिए: (x - 5)(x + 2) = 0.",
      te: "వర్గ సమీకరణం యొక్క మూలాలను కనుగొనండి: (x - 5)(x + 2) = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = 5, x = -2", hi: "x = 5, x = -2", te: "x = 5, x = -2", reviewed: false } },
      { id: "B", text: { en: "x = -5, x = 2", hi: "x = -5, x = 2", te: "x = -5, x = 2", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "C", text: { en: "x = 5, x = 2", hi: "x = 5, x = 2", te: "x = 5, x = 2", reviewed: false }, mistakeTag: "inconsistent_sign_inversion" },
      { id: "D", text: { en: "x = -5, x = -2", hi: "x = -5, x = -2", te: "x = -5, x = -2", reviewed: false }, mistakeTag: "assumed_both_roots_negative" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Set each factor to zero: x - 5 = 0 => x = 5; x + 2 = 0 => x = -2.",
      hi: "प्रत्येक गुणनखंड को शून्य के बराबर रखें: x - 5 = 0 => x = 5; x + 2 = 0 => x = -2।",
      te: "ప్రతి కారణాంకాన్ని సున్నాకి సమానం చేయండి: x - 5 = 0 => x = 5; x + 2 = 0 => x = -2.",
      reviewed: false
    },
    hint: {
      en: "If AB = 0, then either A = 0 or B = 0.",
      hi: "यदि AB = 0, तो या तो A = 0 या B = 0।",
      te: "AB = 0 అయితే, A = 0 లేదా B = 0 అవుతుంది.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d1-02",
    conceptId: "c10-quad-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Rewrite the equation 2x² = 7x - 3 in standard form ax² + bx + c = 0.",
      hi: "समीकरण 2x² = 7x - 3 को मानक रूप ax² + bx + c = 0 में लिखिए।",
      te: "2x² = 7x - 3 సమీకరణాన్ని ప్రామాణిక రూపం ax² + bx + c = 0 లో రాయండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "2x² + 7x - 3 = 0", hi: "2x² + 7x - 3 = 0", te: "2x² + 7x - 3 = 0", reviewed: false }, mistakeTag: "sign_error_moving_terms_across_equality" },
      { id: "B", text: { en: "2x² - 7x - 3 = 0", hi: "2x² - 7x - 3 = 0", te: "2x² - 7x - 3 = 0", reviewed: false }, mistakeTag: "sign_error_constant_term" },
      { id: "C", text: { en: "-2x² - 7x + 3 = 0", hi: "-2x² - 7x + 3 = 0", te: "-2x² - 7x + 3 = 0", reviewed: false }, mistakeTag: "inverted_equation_signs" },
      { id: "D", text: { en: "2x² - 7x + 3 = 0", hi: "2x² - 7x + 3 = 0", te: "2x² - 7x + 3 = 0", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "Subtract 7x and add 3 to both sides: 2x² - 7x + 3 = 0.",
      hi: "दोनों पक्षों से 7x घटाएं और 3 जोड़ें: 2x² - 7x + 3 = 0।",
      te: "ఇరువైపులా 7x తీసివేసి 3 కలపండి: 2x² - 7x + 3 = 0.",
      reviewed: false
    },
    hint: {
      en: "Moving terms across the equals sign changes their signs.",
      hi: "बराबर के चिह्न के पार पदों को ले जाने से उनके चिह्न बदल जाते हैं।",
      te: "సమాన గుర్తు దాటి పదాలను తరలించినప్పుడు వాటి గుర్తులు మారుతాయి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d1-03",
    conceptId: "c10-quad-01",
    difficulty: 1,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Find all real roots of the equation x² - 9 = 0.",
      hi: "समीकरण x² - 9 = 0 के सभी वास्तविक मूल ज्ञात कीजिए।",
      te: "x² - 9 = 0 సమీకరణం యొక్క అన్ని వాస్తవ మూలాలను కనుగొనండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = 3 only", hi: "केवल x = 3", te: "కేవలం x = 3", reviewed: false }, mistakeTag: "dropped_negative_root" },
      { id: "B", text: { en: "x = 3, x = -3", hi: "x = 3, x = -3", te: "x = 3, x = -3", reviewed: false } },
      { id: "C", text: { en: "x = 9, x = -9", hi: "x = 9, x = -9", te: "x = 9, x = -9", reviewed: false }, mistakeTag: "squared_instead_of_square_root" },
      { id: "D", text: { en: "x = 0, x = 3", hi: "x = 0, x = 3", te: "x = 0, x = 3", reviewed: false }, mistakeTag: "sign_error_zero_root" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "x² = 9 => x = ±√9 = ±3. A quadratic equation has up to two roots.",
      hi: "x² = 9 => x = ±√9 = ±3। द्विघात समीकरण के अधिकतम दो मूल होते हैं।",
      te: "x² = 9 => x = ±√9 = ±3. వర్గ సమీకరణానికి రెండు మూలాలు ఉంటాయి.",
      reviewed: false
    },
    hint: {
      en: "Remember that both (+3)² and (-3)² equal 9.",
      hi: "याद रखें कि (+3)² और (-3)² दोनों का मान 9 होता है।",
      te: "(+3)² మరియు (-3)² రెండూ 9 అవుతాయి.",
      reviewed: false
    }
  },

  // Difficulty 2
  {
    id: "q-c10-quad-d2-01",
    conceptId: "c10-quad-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Solve by factorisation: x² - 8x + 15 = 0.",
      hi: "गुणनखंडन द्वारा हल कीजिए: x² - 8x + 15 = 0.",
      te: "కారణాంకాల పద్ధతి ద్వారా సాధించండి: x² - 8x + 15 = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = 3, x = 5", hi: "x = 3, x = 5", te: "x = 3, x = 5", reviewed: false } },
      { id: "B", text: { en: "x = -3, x = -5", hi: "x = -3, x = -5", te: "x = -3, x = -5", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "C", text: { en: "x = 1, x = 15", hi: "x = 1, x = 15", te: "x = 1, x = 15", reviewed: false }, mistakeTag: "incorrect_factor_pair_sum" },
      { id: "D", text: { en: "x = -3, x = 5", hi: "x = -3, x = 5", te: "x = -3, x = 5", reviewed: false }, mistakeTag: "inconsistent_sign_inversion" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "Find two numbers whose product is 15 and sum is -8: -3 and -5. (x - 3)(x - 5) = 0 => x = 3, x = 5.",
      hi: "दो संख्याएँ खोजें जिनका गुणनफल 15 और योग -8 हो: -3 और -5। (x - 3)(x - 5) = 0 => x = 3, x = 5।",
      te: "లబ్ధం 15 మరియు మొత్తం -8 అయ్యే సంఖ్యలు: -3 మరియు -5. (x - 3)(x - 5) = 0 => x = 3, x = 5.",
      reviewed: false
    },
    hint: {
      en: "Both factors of +15 must be negative to add up to -8.",
      hi: "+15 के दोनों गुणनखंड ऋणात्मक होने चाहिए ताकि उनका योग -8 हो।",
      te: "మొత్తం -8 రావడానికి +15 కారణాంకాలు రెండూ రుణాత్మకంగా ఉండాలి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d2-02",
    conceptId: "c10-quad-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Solve by factorisation: x² + 5x - 24 = 0.",
      hi: "गुणनखंडन द्वारा हल कीजिए: x² + 5x - 24 = 0.",
      te: "కారణాంకాల పద్ధతి ద్వారా సాధించండి: x² + 5x - 24 = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = -3, x = 8", hi: "x = -3, x = 8", te: "x = -3, x = 8", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "B", text: { en: "x = -3, x = -8", hi: "x = -3, x = -8", te: "x = -3, x = -8", reviewed: false }, mistakeTag: "swapped_factor_signs_producing_positive_middle_term" },
      { id: "C", text: { en: "x = 3, x = -8", hi: "x = 3, x = -8", te: "x = 3, x = -8", reviewed: false } },
      { id: "D", text: { en: "x = 4, x = -6", hi: "x = 4, x = -6", te: "x = 4, x = -6", reviewed: false }, mistakeTag: "incorrect_factor_pair_sum" }
    ],
    correctAnswer: "C",
    explanation: {
      en: "Factors of -24 adding to +5 are +8 and -3: (x + 8)(x - 3) = 0 => x = -8, x = 3.",
      hi: "-24 के ऐसे गुणनखंड जिनका योग +5 हो: +8 और -3। (x + 8)(x - 3) = 0 => x = -8, x = 3।",
      te: "-24 యొక్క కారణాంకాలు మొత్తం +5 ఇచ్చేవి: +8 మరియు -3. (x + 8)(x - 3) = 0 => x = -8, x = 3.",
      reviewed: false
    },
    hint: {
      en: "8 × (-3) = -24 and 8 + (-3) = +5.",
      hi: "8 × (-3) = -24 और 8 + (-3) = +5।",
      te: "8 × (-3) = -24 మరియు 8 + (-3) = +5.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d2-03",
    conceptId: "c10-quad-01",
    difficulty: 2,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Solve by factorisation: x² - 2x - 35 = 0.",
      hi: "गुणनखंडन द्वारा हल कीजिए: x² - 2x - 35 = 0.",
      te: "కారణాంకాల పద్ధతి ద్వారా సాధించండి: x² - 2x - 35 = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = -7, x = 5", hi: "x = -7, x = 5", te: "x = -7, x = 5", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "B", text: { en: "x = 7, x = -5", hi: "x = 7, x = -5", te: "x = 7, x = -5", reviewed: false } },
      { id: "C", text: { en: "x = -7, x = -5", hi: "x = -7, x = -5", te: "x = -7, x = -5", reviewed: false }, mistakeTag: "swapped_factor_signs_producing_positive_middle_term" },
      { id: "D", text: { en: "x = 7, x = 5", hi: "x = 7, x = 5", te: "x = 7, x = 5", reviewed: false }, mistakeTag: "inconsistent_sign_inversion" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Two numbers whose product is -35 and sum is -2 are -7 and +5: (x - 7)(x + 5) = 0 => x = 7, x = -5.",
      hi: "-35 का गुणनफल और -2 का योग देने वाली संख्याएँ: -7 और +5। (x - 7)(x + 5) = 0 => x = 7, x = -5।",
      te: "లబ్ధం -35 మరియు మొత్తం -2 అయ్యే సంఖ్యలు: -7 మరియు +5. (x - 7)(x + 5) = 0 => x = 7, x = -5.",
      reviewed: false
    },
    hint: {
      en: "The larger factor must be negative so that their sum is -2.",
      hi: "बड़ा गुणनखंड ऋणात्मक होना चाहिए ताकि उनका योग -2 हो।",
      te: "మొత్తం -2 రావడానికి పెద్ద కారణాంకం రుణాత్మకంగా ఉండాలి.",
      reviewed: false
    }
  },

  // Difficulty 3
  {
    id: "q-c10-quad-d3-01",
    conceptId: "c10-quad-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Solve the non-monic quadratic equation by factorisation: 2x² - 7x + 3 = 0.",
      hi: "गुणनखंडन द्वारा द्विघात समीकरण को हल कीजिए: 2x² - 7x + 3 = 0.",
      te: "కారణాంకాల పద్ధతి ద్వారా సాధించండి: 2x² - 7x + 3 = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = -3, x = -1/2", hi: "x = -3, x = -1/2", te: "x = -3, x = -1/2", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "B", text: { en: "x = 3, x = 1", hi: "x = 3, x = 1", te: "x = 3, x = 1", reviewed: false }, mistakeTag: "forgot_division_by_leading_coefficient" },
      { id: "C", text: { en: "x = -3, x = 1/2", hi: "x = -3, x = 1/2", te: "x = -3, x = 1/2", reviewed: false }, mistakeTag: "sign_error_both_negative_yields_positive_product" },
      { id: "D", text: { en: "x = 3, x = 1/2", hi: "x = 3, x = 1/2", te: "x = 3, x = 1/2", reviewed: false } }
    ],
    correctAnswer: "D",
    explanation: {
      en: "Product ac = 2 × 3 = 6. Factors adding to -7 are -6 and -1. 2x² - 6x - x + 3 = 0 => 2x(x - 3) - 1(x - 3) = 0 => (2x - 1)(x - 3) = 0 => x = 1/2, x = 3.",
      hi: "ac = 2 × 3 = 6। -7 का योग देने वाले गुणनखंड: -6 और -1। 2x(x - 3) - 1(x - 3) = 0 => (2x - 1)(x - 3) = 0 => x = 1/2, x = 3।",
      te: "ac = 2 × 3 = 6. మొత్తం -7 ఇచ్చేవి: -6 మరియు -1. 2x(x - 3) - 1(x - 3) = 0 => (2x - 1)(x - 3) = 0 => x = 1/2, x = 3.",
      reviewed: false
    },
    hint: {
      en: "Multiply a and c (2 × 3 = 6) and find factors of 6 that add to -7.",
      hi: "a और c का गुणा करें (2 × 3 = 6) और 6 के ऐसे गुणनखंड खोजें जिनका योग -7 हो।",
      te: "a మరియు c లను గుణించండి (2 × 3 = 6), మొత్తం -7 వచ్చేలా 6 కారణాంకాలను కనుగొనండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d3-02",
    conceptId: "c10-quad-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "pure_math",
    prompt: {
      en: "Solve by factorisation: 3x² + 10x - 8 = 0.",
      hi: "गुणनखंडन द्वारा हल कीजिए: 3x² + 10x - 8 = 0.",
      te: "కారణాంకాల పద్ధతి ద్వారా సాధించండి: 3x² + 10x - 8 = 0.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "x = 2/3, x = -4", hi: "x = 2/3, x = -4", te: "x = 2/3, x = -4", reviewed: false } },
      { id: "B", text: { en: "x = -2/3, x = 4", hi: "x = -2/3, x = 4", te: "x = -2/3, x = 4", reviewed: false }, mistakeTag: "forgot_to_invert_signs_from_factors_to_roots" },
      { id: "C", text: { en: "x = 2, x = -4", hi: "x = 2, x = -4", te: "x = 2, x = -4", reviewed: false }, mistakeTag: "forgot_division_by_leading_coefficient" },
      { id: "D", text: { en: "x = -2/3, x = -4", hi: "x = -2/3, x = -4", te: "x = -2/3, x = -4", reviewed: false }, mistakeTag: "swapped_factor_signs_producing_positive_middle_term" }
    ],
    correctAnswer: "A",
    explanation: {
      en: "ac = 3 × (-8) = -24. Factors of -24 adding to +10 are +12 and -2: 3x² + 12x - 2x - 8 = 0 => 3x(x + 4) - 2(x + 4) = 0 => (3x - 2)(x + 4) = 0 => x = 2/3, x = -4.",
      hi: "ac = 3 × (-8) = -24। -24 के ऐसे गुणनखंड जिनका योग +10 हो: +12 और -2। 3x(x + 4) - 2(x + 4) = 0 => (3x - 2)(x + 4) = 0 => x = 2/3, x = -4।",
      te: "ac = 3 × (-8) = -24. మొత్తం +10 ఇచ్చేవి: +12 మరియు -2. 3x(x + 4) - 2(x + 4) = 0 => (3x - 2)(x + 4) = 0 => x = 2/3, x = -4.",
      reviewed: false
    },
    hint: {
      en: "Split the middle term 10x into +12x - 2x.",
      hi: "मध्य पद 10x को +12x - 2x में विभाजित करें।",
      te: "మధ్య పదం 10x ను +12x - 2x గా విభజించండి.",
      reviewed: false
    }
  },
  {
    id: "q-c10-quad-d3-03",
    conceptId: "c10-quad-01",
    difficulty: 3,
    type: "multiple_choice",
    contextTag: "indian_real_world",
    prompt: {
      en: "A rectangular community garden in Bengaluru has an area of 60 m². The length of the garden is 7 metres more than its breadth. Find the length and breadth by solving a quadratic equation.",
      hi: "बेंगलुरु में एक आयताकार सामुदायिक उद्यान का क्षेत्रफल 60 वर्ग मीटर है। उद्यान की लंबाई उसकी चौड़ाई से 7 मीटर अधिक है। द्विघात समीकरण हल करके लंबाई और चौड़ाई ज्ञात कीजिए।",
      te: "బెంగళూరులోని ఒక దీర్ఘచతురస్రాకార తోట వైశాల్యం 60 చ.మీ. దాని పొడవు వెడల్పు కంటే 7 మీటర్లు ఎక్కువ. వర్గ సమీకరణాన్ని సాధించి పొడవు మరియు వెడల్పులను కనుగొనండి.",
      reviewed: false
    },
    options: [
      { id: "A", text: { en: "Breadth = -12 m, Length = -5 m", hi: "चौड़ाई = -12 मी, लंबाई = -5 मी", te: "వెడల్పు = -12 మీ, పొడవు = -5 మీ", reviewed: false }, mistakeTag: "accepted_negative_root_for_physical_dimension" },
      { id: "B", text: { en: "Length = 12 m, Breadth = 5 m", hi: "लंबाई = 12 मी, चौड़ाई = 5 मी", te: "పొడవు = 12 మీ, వెడల్పు = 5 మీ", reviewed: false } },
      { id: "C", text: { en: "Length = 10 m, Breadth = 6 m", hi: "लंबाई = 10 मी, चौड़ाई = 6 मी", te: "పొడవు = 10 మీ, వెడల్పు = 6 మీ", reviewed: false }, mistakeTag: "incorrect_factor_pair_sum" },
      { id: "D", text: { en: "Length = 15 m, Breadth = 4 m", hi: "लंबाई = 15 मी, चौड़ाई = 4 मी", te: "పొడవు = 15 మీ, వెడల్పు = 4 మీ", reviewed: false }, mistakeTag: "incorrect_factor_pair_difference" }
    ],
    correctAnswer: "B",
    explanation: {
      en: "Let breadth be b. Length = b + 7. Area = b(b + 7) = 60 => b² + 7b - 60 = 0 => (b + 12)(b - 5) = 0 => b = 5 (rejecting b = -12 since dimensions must be positive). Length = 5 + 7 = 12 m.",
      hi: "माना चौड़ाई b है। लंबाई = b + 7। क्षेत्रफल = b(b + 7) = 60 => b² + 7b - 60 = 0 => (b + 12)(b - 5) = 0 => b = 5 (ऋणात्मक मान -12 को अस्वीकार करते हुए)। लंबाई = 5 + 7 = 12 मी।",
      te: "వెడల్పు b అనుకుందాం. పొడవు = b + 7. వైశాల్యం = b(b + 7) = 60 => b² + 7b - 60 = 0 => (b + 12)(b - 5) = 0 => b = 5 (కొలతలు ధనాత్మకంగా ఉండాలి కాబట్టి -12 ని తిరస్కరించాలి). పొడవు = 5 + 7 = 12 మీ.",
      reviewed: false
    },
    hint: {
      en: "Set up b(b + 7) = 60, factorise, and choose the positive root for physical measurements.",
      hi: "समीकरण बनाएं b(b + 7) = 60, गुणनखंड करें और भौतिक माप के लिए धनात्मक मूल चुनें।",
      te: "b(b + 7) = 60 సమీకరణాన్ని రాసి, కారణాంకాలుగా మార్చి, ధన మూలాన్ని ఎంచుకోండి.",
      reviewed: false
    }
  }
];

// Merge without duplicates
const existingMap = new Map(existingQuestions.map(q => [q.id, q]));
for (const q of adaptiveQuestions) {
  existingMap.set(q.id, q);
}

const mergedQuestions = Array.from(existingMap.values());
fs.writeFileSync(questionsPath, JSON.stringify(mergedQuestions, null, 2), "utf8");
console.log(`[PASS] Written ${mergedQuestions.length} questions to data/questions.json (+${adaptiveQuestions.length} adaptive questions added/updated).`);

// Step 3: Generate tag-roots.json
// Collect all unique mistake tags across ALL questions
const allTags = new Set();
for (const q of mergedQuestions) {
  if (q.options) {
    for (const opt of q.options) {
      if (opt.mistakeTag) {
        allTags.add(opt.mistakeTag);
      }
    }
  }
}

console.log(`Total unique mistake tags found across question bank: ${allTags.size}`);

// Define root concept mapping for all tags
// Every mapped concept must exist and have questions!
const tagRoots = {};

for (const tag of allTags) {
  // Integer signs, opposite quantities, temperatures, elevators, depths, below zero
  if (
    tag.includes("below_zero") ||
    tag.includes("opposite_direction") ||
    tag.includes("depth") ||
    tag.includes("overdraft") ||
    tag.includes("subtracted_ten") ||
    tag.includes("magnitude_doubled") ||
    tag.includes("omitted_negative_displacement") ||
    tag.includes("confused_reference") ||
    tag.includes("distance_expressed_as_negative") ||
    tag.includes("negative_average") ||
    tag.includes("confused_zero") ||
    tag.includes("negative_greater_than_zero") ||
    tag.includes("ordered_negatives") ||
    tag.includes("descending_order") ||
    tag.includes("placed_zero") ||
    tag.includes("assumed_minimum_negative") ||
    tag.includes("assumed_all_negatives") ||
    tag.includes("confused_absolute_value")
  ) {
    tagRoots[tag] = "c6-neg-01";
  }
  // Signed integer addition / subtraction
  else if (
    tag.includes("added_magnitudes") ||
    tag.includes("subtracted_magnitudes") ||
    tag.includes("lost_negative_sign") ||
    tag.includes("added_penalties") ||
    tag.includes("subtracted_both") ||
    tag.includes("inverted_result_sign")
  ) {
    tagRoots[tag] = "c7-int-01";
  }
  // Integer multiplication & rules of signs
  else if (
    tag.includes("negative_times_negative") ||
    tag.includes("odd_even_negative_count") ||
    tag.includes("positive_times_negative") ||
    tag.includes("dropped_first_factor") ||
    tag.includes("multiplied_by_count") ||
    tag.includes("sign_error_positive_times_negative") ||
    tag.includes("sign_error_in_brackets") ||
    tag.includes("multiplied_instead_of_added") ||
    tag.includes("added_instead_of_multiplied") ||
    tag.includes("added_with_negative_sign") ||
    tag.includes("subtracted_instead_of_multiplied")
  ) {
    tagRoots[tag] = "c7-int-02";
  }
  // Distributive law with signed monomials
  else if (
    tag.includes("distribut") ||
    tag.includes("second_term") ||
    tag.includes("multiplied_variable_only") ||
    tag.includes("combining_constants") ||
    tag.includes("subtracted_coefficients_without_expanding") ||
    tag.includes("combining_middle_terms") ||
    tag.includes("dropped_negative_signs") ||
    tag.includes("dropped_exponent_on_variable") ||
    tag.includes("dropped_second_variable") ||
    tag.includes("added_coefficients_instead_of_multiplied")
  ) {
    tagRoots[tag] = "c8-dist-01";
  }
  // Standard algebraic identities (a+b)^2, (a-b)^2, a^2-b^2
  else if (
    tag.includes("middle_linear_terms") ||
    tag.includes("factor_of_two") ||
    tag.includes("difference_of_squares") ||
    tag.includes("combining_linear_terms") ||
    tag.includes("swapped_sum_and_product") ||
    tag.includes("cross_terms") ||
    tag.includes("cross_term_subtraction") ||
    tag.includes("squared_without_cross_terms") ||
    tag.includes("dropped_coefficient_square") ||
    tag.includes("multiplied_by_two_instead_of_squaring") ||
    tag.includes("calculation_error")
  ) {
    tagRoots[tag] = "c9-id-01";
  }
  // Quadratic factoring & middle-term splitting
  else if (
    tag.includes("factor_pair") ||
    tag.includes("roots") ||
    tag.includes("discriminant") ||
    tag.includes("leading_coefficient") ||
    tag.includes("across_equality") ||
    tag.includes("physical_dimension") ||
    tag.includes("dropped_negative_root") ||
    tag.includes("squared_instead_of_square_root") ||
    tag.includes("zero_root") ||
    tag.includes("inverted_equation_signs")
  ) {
    tagRoots[tag] = "c10-quad-01";
  }
  // Patterns (c6-pat-01)
  else if (tag.includes("added_two") || tag.includes("added_four") || tag.includes("multiplication_rule") || tag.includes("multiplied_four") || tag.includes("added_four_to_ten") || tag.includes("sharing")) {
    tagRoots[tag] = "c6-pat-01";
  }
  // Angles & Geometry (c6-geo-01)
  else if (tag.includes("angle") || tag.includes("rays")) {
    tagRoots[tag] = "c6-geo-01";
  }
  // Large numbers (c7-num-01)
  else if (tag.includes("crore") || tag.includes("place_value") || tag.includes("rounded") || tag.includes("estimation") || tag.includes("lakh") || tag.includes("thousand")) {
    tagRoots[tag] = "c7-num-01";
  }
  // Arithmetic order of ops (c7-alg-01)
  else if (tag.includes("bracket") || tag.includes("division_operands") || tag.includes("subtraction_before_multiplication") || tag.includes("addition_before_subtraction")) {
    tagRoots[tag] = "c7-alg-01";
  }
  // Squares & Square roots (c8-sqr-01)
  else if (tag.includes("square") || tag.includes("factor_product")) {
    tagRoots[tag] = "c8-sqr-01";
  }
  // Exponents (c8-exp-01)
  else if (tag.includes("powers") || tag.includes("exponent") || tag.includes("bases")) {
    tagRoots[tag] = "c8-exp-01";
  }
  // Coordinates (c9-coord-01)
  else if (tag.includes("coordinate") || tag.includes("axis") || tag.includes("origin") || tag.includes("quadrant")) {
    tagRoots[tag] = "c9-coord-01";
  }
  // Polynomial zeroes (c9-poly-01 or c10-poly-01)
  else if (tag.includes("coefficient") || tag.includes("zeroes") || tag.includes("polynomial")) {
    tagRoots[tag] = "c9-poly-01";
  }
  // Real numbers HCF/LCM (c10-real-01)
  else if (tag.includes("prime") || tag.includes("factorisation") || tag.includes("hcf") || tag.includes("lcm")) {
    tagRoots[tag] = "c10-real-01";
  }
  else {
    // Default fallback to c6-neg-01 or c7-int-02
    tagRoots[tag] = "c6-neg-01";
  }
}

// Verify that every concept mapped exists and has questions
for (const [tag, conceptId] of Object.entries(tagRoots)) {
  if (!conceptMap.has(conceptId)) {
    throw new Error(`Tag "${tag}" mapped to non-existent concept "${conceptId}"`);
  }
}

fs.writeFileSync(tagRootsPath, JSON.stringify(tagRoots, null, 2), "utf8");
console.log(`[PASS] Written ${Object.keys(tagRoots).length} mappings to data/tag-roots.json.`);
