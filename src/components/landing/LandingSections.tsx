"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  School,
  GraduationCap,
  ChevronDown,
  HelpCircle,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { WitchCat } from "@/components/ui/WitchCat";
import { MistakeCreature } from "@/components/ui/MistakeCreature";

export interface LandingSectionsProps {
  currentLang: "en" | "hi" | "te";
}

export function LandingSections({ currentLang }: LandingSectionsProps) {
  // Local state for interactive question demo in Section 5
  const [sampleLang, setSampleLang] = useState<"en" | "hi" | "te">(currentLang);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Copy-to-clipboard state for Section 7
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const copy = {
    en: {
      reviewed: true,
      hero: {
        h1: "Stuck in Class 10 maths? It probably started in Class 7.",
        sub: "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT, in English, हिन्दी and తెలుగు.",
        demoBtn: "Try the demo (judges)",
        demoSub: "Pre-fills demo credentials for quick evaluation",
        student: {
          tag: "Student",
          title: "I'm a student",
          desc: "Take a short diagnostic, see a map of what you know, then fix gaps one small step at a time. No email or phone number needed.",
          btn: "Start learning",
          signIn: "Already have an account? Sign in",
        },
        teacher: {
          tag: "Teacher",
          title: "I'm a teacher",
          desc: "Make a class, share a code, and see which earlier topics your students are actually missing.",
          btn: "Set up my class",
          signIn: "Already registered? Sign in",
        },
      },
      s1: {
        tag: "01 // WHY STUDENTS GET STUCK",
        heading: "Maths builds like a tower. One missing brick wobbles the whole floor.",
        body1:
          "In higher classes, maths stops making sense not because the new formulas are impossible, but because an earlier rule was forgotten.",
        body2:
          "If negative integer signs from Class 7 are shaky, Class 8 distributive law falls apart, Class 9 identities fail, and Class 10 quadratics feel impossible. Margam identifies the earliest break in the chain so you only have to fix what is actually broken.",
        step1Title: "Class 6",
        step1Concept: "Negative Numbers",
        step2Title: "Class 7",
        step2Concept: "Integer Sign Rules",
        step2Badge: "THE REAL PROBLEM",
        step3Title: "Class 8",
        step3Concept: "Distributive Property",
        step4Title: "Class 9",
        step4Concept: "Algebraic Identities",
        step5Title: "Class 10",
        step5Concept: "Quadratic Equations",
        step5Badge: "WHERE IT HURTS",
      },
      s2: {
        tag: "02 // HOW MARGAM WORKS",
        heading: "Three steps from stuck to confident",
        b1Num: "01",
        b1Title: "Diagnostic",
        b1Text:
          "A 5-question check-in tests prerequisite mastery behind your current class topic, tracing errors back to earlier grades.",
        b2Num: "02",
        b2Title: "Fix the Gap",
        b2Text:
          "Targeted micro-lessons and scaffolded questions rebuild the missing prerequisite step-by-step with immediate feedback.",
        b3Num: "03",
        b3Title: "Prove It",
        b3Text:
          "Return to your grade-level problem with confidence, lock in concept mastery, and earn XP.",
      },
      s3: {
        tag: "03 // MISTAKE CREATURES",
        heading: "Mistakes aren't failures — they're friendly clues",
        sub: "When you make an error, Maru and our pixel mistake creatures spot the exact pattern and help you patch it kindly.",
        c1Name: "Sign Slip",
        c1Line: "Juggles plus and minus signs when you look away. We'll help you lock them down.",
        c2Name: "Fraction Fumble",
        c2Line: "Flips the numerator and denominator upside down. A quick reciprocal check keeps it steady.",
        c3Name: "Distribution Dodge",
        c3Line: "Hides inside brackets and forgets to multiply the second term. We'll make sure everyone gets their share.",
        c4Name: "Calculation Slip",
        c4Line: "Rushes ahead and drops a carry or an exponent. Slowing down by one second catches it every time.",
      },
      s4: {
        tag: "04 // FOR TEACHERS",
        heading: "See what your classroom is actually missing",
        sub: "Stop reteaching the current chapter when the real obstacle is an unmastered concept from two grades ago. Our heatmap shows the exact prerequisite bottleneck across your class.",
        classTitle: "Class 10-A (demo) (Example Public School)",
        stat1Num: "25",
        stat1Label: "Enrolled Students",
        stat2Num: "68%",
        stat2Label: "Class Diagnostic Average",
        stat3Num: "7",
        stat3Label: "Students Stuck on Class 7 Signs",
        row1Concept: "Class 6 · Negative Numbers (c6-neg-01)",
        row1Rate: "23 / 25 Mastered (92%)",
        row2Concept: "Class 7 · Integer Sign Rules (c7-int-02)",
        row2Rate: "12 / 25 Mastered (48%) · 7 ROOT GAPS",
        row3Concept: "Class 8 · Distributive Law (c8-dist-01)",
        row3Rate: "18 / 25 Mastered (72%)",
        row4Concept: "Class 10 · Quadratic Factorisation (c10-quad-01)",
        row4Rate: "16 / 25 Mastered (64%)",
        insight:
          "Teaching insight: 7 students failed quadratic factoring solely because of negative integer sign errors. A 10-minute targeted refresher resolves the bottleneck.",
        cta: "Open the teacher dashboard",
      },
      s5: {
        tag: "05 // YOUR LANGUAGE",
        heading: "Learn maths in the language you think in",
        sub: "Mathematical reasoning shouldn't get trapped behind language barriers. Switch between English, हिन्दी and తెలుగు anytime.",
        qText:
          "Solve for x: x² − 5x + 6 = 0. Which foundational rule explains why (−2) × (−3) = +6?",
        opt0: "Class 7: The product of two negative integers is always positive",
        opt1: "Class 10: Quadratic discriminant formula b² − 4ac",
        opt2: "Class 6: Long division algorithm",
        opt3: "Class 8: Exponent product law aᵐ × aⁿ",
        feedbackCorrect:
          "Spot on! Factoring x² − 5x + 6 requires two numbers that multiply to +6 and add to −5. That relies entirely on Class 7 integer multiplication rules.",
        feedbackIncorrect:
          "Notice how (−2) × (−3) = +6 is an integer multiplication property from Class 7. When integer signs are mastered, quadratic factorisation becomes effortless!",
      },
      s6: {
        tag: "06 // BUILT TO KEEP STUDENTS SAFE",
        heading: "Private by design, safe by default",
        sub: "Margam is engineered for school-age learners. We collect only what is strictly necessary to teach maths.",
        f1Title: "No Email or Phone",
        f1Desc:
          "Students sign up with just a username and password. We never request, store, or sell phone numbers, personal email, or contacts.",
        f2Title: "Zero Ad Trackers",
        f2Desc:
          "No third-party advertising cookies, marketing pixels, or surveillance scripts. The entire learning session stays private.",
        f3Title: "Server-Side Verification",
        f3Desc:
          "Answer keys, diagnostic rules, and grading logic run strictly on the server. Answer sheets cannot be inspected in client browser tools.",
        f4Title: "Local Guest Learning",
        f4Desc:
          "Students can practice completely as a guest without creating an account. Progress is stored safely in your own browser's storage.",
      },
      s7: {
        tag: "07 // TRY THE DEMO (FOR JUDGES)",
        heading: "Evaluation credentials for Code Kernel '26",
        sub: "Pre-seeded synthetic class with realistic NCERT student learning histories and gap diagnostics.",
        disclaimer: "Demo accounts use synthetic data only.",
        studentCard: "Demo Student",
        studentUser: "student01",
        studentPass: "MargamDemo@2026",
        teacherCard: "Demo Teacher",
        teacherUser: "teacher@example.demo.invalid",
        teacherPass: "MargamDemo@2026",
        classCodeLabel: "Class Code",
        classCode: "DEMO-10A",
        copyBtn: "Copy",
        copiedBtn: "Copied!",
        enterStudentBtn: "Launch Student Demo",
        enterTeacherBtn: "Launch Teacher Demo",
      },
      s8: {
        tag: "08 // CURRICULUM SCOPE",
        heading: "Curriculum coverage today",
        honestLine:
          "Two full pilot chains (Classes 6-10) today; the rest of the 67 NCERT chapters are mapped and coming next.",
        chain1Title: "Pilot Chain 1: Number Systems to Quadratics",
        chain1Desc:
          "Classes 6–10: Negative Numbers ➔ Integer Arithmetic ➔ Distributive Law ➔ Algebraic Identities ➔ Quadratic Equations.",
        chain2Title: "Pilot Chain 2: Linear Equations & Algebra",
        chain2Desc:
          "Classes 6–10: Variables & Expressions ➔ Simple Linear Equations ➔ Equations in One Variable ➔ Polynomials ➔ Linear Pairs.",
        allMapped:
          "All 67 NCERT mathematics chapters (Classes 6–10) are mapped in our prerequisite dependency graph and ready for expanded question sets.",
      },
      s9: {
        tag: "09 // FREQUENTLY ASKED QUESTIONS",
        heading: "Everything you need to know",
        q1: "How does Margam find where I got stuck?",
        a1: "When you complete a 5-question chapter diagnostic, our prerequisite engine analyzes error patterns against a prerequisite dependency graph. If a quadratic factoring error stems from integer sign confusion, Margam identifies the Class 7 concept as the root gap rather than repeating Class 10 problems.",
        q2: "Do students need to provide an email or phone number?",
        a2: "No. Students create an account using only a username, password, and optional class code (or can practice as a guest). No email, phone number, or personal identity information is required.",
        q3: "Does Margam work offline?",
        a3: "Yes. Margam includes service worker caching and local browser storage so students with intermittent connectivity can practice worksheets and save their progress offline until they reconnect.",
        q4: "What curriculum does Margam align with?",
        a4: "Margam is aligned strictly with the official NCERT mathematics curriculum for Classes 6 through 10, covering English, Hindi, and Telugu terminology.",
        q5: "How does the teacher dashboard protect privacy?",
        a5: "Teachers view student performance through classroom roll numbers and usernames within their enrolled class code. No external identifiers or contact details are stored or displayed.",
      },
    },
    hi: {
      reviewed: false,
      hero: {
        h1: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
        sub: "मार्गम् उस पुरानी कमी को खोजता है जो छूट गई थी—जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न—और उसे सुधारने का मार्ग दिखाता है। एनसीईआरटी, अंग्रेजी, हिन्दी और తెలుగు में।",
        demoBtn: "डेमो आज़माएँ (जज)",
        demoSub: "त्वरित मूल्यांकन के लिए परीक्षण क्रेडेंशियल पहले से भरे गए हैं",
        student: {
          tag: "विद्यार्थी",
          title: "मैं एक विद्यार्थी हूँ",
          desc: "एक संक्षिप्त जांच परीक्षा दें, अपनी समझ का मानचित्र देखें, और एक-एक छोटे कदम के साथ कमियों को दूर करें। किसी ईमेल या फ़ोन नंबर की आवश्यकता नहीं है।",
          btn: "सीखना शुरू करें",
          signIn: "पहले से खाता है? साइन इन करें",
        },
        teacher: {
          tag: "शिक्षक",
          title: "मैं एक शिक्षक हूँ",
          desc: "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी वास्तव में किन पुराने विषयों में कठिनाई महसूस कर रहे हैं।",
          btn: "मेरी कक्षा सेट करें",
          signIn: "पहले से पंजीकृत हैं? साइन इन करें",
        },
      },
      s1: {
        tag: "01 // मुख्य कारण",
        heading: "गणित एक मीनार की तरह बनता है। एक कमजोर ईंट पूरी मंजिल को हिला देती है।",
        body1:
          "बड़ी कक्षाओं में गणित इसलिए कठिन नहीं लगता कि नए सूत्र बहुत जटिल हैं, बल्कि इसलिए कि कोई पुराना नियम अधूरा रह गया था।",
        body2:
          "यदि कक्षा 7 के ऋणात्मक पूर्णांक नियम कमजोर हैं, तो कक्षा 8 का वितरण नियम, कक्षा 9 की सर्वसमिकाएं और कक्षा 10 के द्विघात समीकरण असंभव लगने लगते हैं। मार्गम् उस पहली कड़ी को पहचानता है ताकि आप केवल वही सुधारें जो वास्तव में छूटा है।",
        step1Title: "कक्षा 6",
        step1Concept: "ऋणात्मक संख्याएँ",
        step2Title: "कक्षा 7",
        step2Concept: "पूर्णांक चिह्न नियम",
        step2Badge: "मुख्य समस्या",
        step3Title: "कक्षा 8",
        step3Concept: "वितरण नियम",
        step4Title: "कक्षा 9",
        step4Concept: "बीजीय सर्वसमिकाएँ",
        step5Title: "कक्षा 10",
        step5Concept: "द्विघात समीकरण",
        step5Badge: "कठिनाई यहाँ होती है",
      },
      s2: {
        tag: "02 // मार्गम् कैसे काम करता है",
        heading: "कठिनाई से आत्मविश्वास तक तीन कदम",
        b1Num: "01",
        b1Title: "जांच परीक्षा",
        b1Text:
          "एक 5-प्रश्नों की त्वरित जांच आपकी बुनियादी समझ को परखती है और गलतियों को पुरानी कक्षाओं तक जोड़ती है।",
        b2Num: "02",
        b2Title: "कमी सुधारें",
        b2Text:
          "लक्षित छोटे पाठ और चरणबद्ध प्रश्न छूटे हुए विषय को तुरंत समझ के साथ दोबारा सिखाते हैं।",
        b3Num: "03",
        b3Title: "सिद्ध करें",
        b3Text:
          "अपनी कक्षा के स्तर के प्रश्नों पर लौटें, पूरी समझ हासिल करें और अनुभव अंक (XP) अर्जित करें।",
      },
      s3: {
        tag: "03 // भूल-सुधार जीव",
        heading: "गलतियाँ असफलता नहीं हैं — वे सीखने के संकेत हैं",
        sub: "जब आपसे कोई त्रुटि होती है, तो मारु बिल्ली और हमारे पिक्सेल जीव उस सटीक स्वरूप को पहचानकर उसे सुधारते हैं।",
        c1Name: "साइन स्लिप",
        c1Line: "जब आप ध्यान नहीं देते, तो यह धन और ऋण चिह्नों की अदला-बदली कर देता है।",
        c2Name: "फ़्रैक्शन फंबल",
        c2Line: "अंश और हर को उलट देता है। एक त्वरित व्युत्क्रम जांच इसे सही रखती है।",
        c3Name: "डिस्ट्रिब्यूशन डॉज",
        c3Line: "कोष्ठक में छिप जाता है और दूसरे पद से गुणा करना भूल जाता है।",
        c4Name: "कैलकुलेशन स्लिप",
        c4Line: "जल्दबाजी में हासिल या घात छोड़ देता है। एक पल रुकने से यह पकड़ में आ जाता है।",
      },
      s4: {
        tag: "04 // शिक्षकों के लिए",
        heading: "देखें कि आपकी कक्षा में वास्तव में क्या कमी है",
        sub: "वर्तमान अध्याय को बार-बार पढ़ाने के बजाय देखें कि पुरानी कक्षाओं की कौन सी अवधारणा बाधा बन रही है।",
        classTitle: "कक्षा 10-अ (डेमो) (उदाहरण पब्लिक स्कूल)",
        stat1Num: "25",
        stat1Label: "नामांकित विद्यार्थी",
        stat2Num: "68%",
        stat2Label: "कक्षा औसत प्राप्तांक",
        stat3Num: "7",
        stat3Label: "कक्षा 7 के चिह्नों पर अटके विद्यार्थी",
        row1Concept: "कक्षा 6 · ऋणात्मक संख्याएँ (c6-neg-01)",
        row1Rate: "23 / 25 पूर्ण (92%)",
        row2Concept: "कक्षा 7 · पूर्णांक चिह्न नियम (c7-int-02)",
        row2Rate: "12 / 25 पूर्ण (48%) · 7 मुख्य कमियाँ",
        row3Concept: "कक्षा 8 · वितरण नियम (c8-dist-01)",
        row3Rate: "18 / 25 पूर्ण (72%)",
        row4Concept: "कक्षा 10 · द्विघात गुणनखंड (c10-quad-01)",
        row4Rate: "16 / 25 पूर्ण (64%)",
        insight:
          "शिक्षण अंतर्दृष्टि: 7 विद्यार्थी केवल ऋणात्मक चिह्न की गलती के कारण द्विघात गुणनखंड में असफल हुए। 10 मिनट का त्वरित अभ्यास इसे हल कर देता है।",
        cta: "शिक्षक डैशबोर्ड खोलें",
      },
      s5: {
        tag: "05 // आपकी भाषा",
        heading: "उस भाषा में सीखें जिसमें आप सोचते हैं",
        sub: "गणितीय सोच भाषा के बंधनों में नहीं अटकनी चाहिए। अंग्रेजी, हिन्दी और తెలుగు में कभी भी बदलें।",
        qText:
          "x के लिए हल करें: x² − 5x + 6 = 0। कौन सा बुनियादी नियम समझाता है कि (−2) × (−3) = +6 क्यों होता है?",
        opt0: "कक्षा 7: दो ऋणात्मक पूर्णांकों का गुणनफल सदैव धनात्मक होता है",
        opt1: "कक्षा 10: द्विघात विविक्तकर सूत्र b² − 4ac",
        opt2: "कक्षा 6: दीर्घ विभाजन विधि",
        opt3: "कक्षा 8: घातांक गुणन नियम aᵐ × aⁿ",
        feedbackCorrect:
          "बिल्कुल सही! x² − 5x + 6 के गुणनखंड के लिए दो संख्याएँ चाहिए जिनका गुणन +6 और योग −5 हो। यह पूरी तरह कक्षा 7 के पूर्णांक नियमों पर निर्भर है।",
        feedbackIncorrect:
          "ध्यान दें कि (−2) × (−3) = +6 कक्षा 7 का पूर्णांक गुणन नियम है। जब चिह्न नियम स्पष्ट होते हैं, तो द्विघात समीकरण बहुत आसान हो जाते हैं!",
      },
      s6: {
        tag: "06 // विद्यार्थी सुरक्षा",
        heading: "गोपनीयता पहले, सुरक्षा हमेशा",
        sub: "मार्गम् स्कूली विद्यार्थियों के लिए बनाया गया है। हम केवल गणित सिखाने के लिए आवश्यक डेटा ही लेते हैं।",
        f1Title: "कोई ईमेल या फ़ोन नहीं",
        f1Desc:
          "विद्यार्थी केवल एक उपयोगकर्ता नाम और पासवर्ड से जुड़ते हैं। हम कभी भी फ़ोन नंबर या व्यक्तिगत ईमेल नहीं मांगते।",
        f2Title: "शून्य विज्ञापन ट्रैकर",
        f2Desc:
          "कोई विज्ञापन कुकी या मार्केटिंग ट्रैकर नहीं। आपका अध्ययन सत्र पूरी तरह सुरक्षित और निजी रहता है।",
        f3Title: "सर्वर-आधारित सत्यापन",
        f3Desc:
          "उत्तर कुंजी और मूल्यांकन नियम केवल सर्वर पर रहते हैं। ब्राउज़र के माध्यम से उत्तर नहीं निकाले जा सकते।",
        f4Title: "अतिथि रूप में अभ्यास",
        f4Desc:
          "बिना खाता बनाए भी पूरा अभ्यास संभव है। प्रगति केवल आपके अपने ब्राउज़र में सुरक्षित रहती है।",
      },
      s7: {
        tag: "07 // डेमो (जज के लिए)",
        heading: "कोड कर्नेल '26 के लिए मूल्यांकन खाते",
        sub: "वास्तविक एनसीईआरटी विद्यार्थी इतिहास और जांच डेटा के साथ सिंथेटिक कक्षा।",
        disclaimer: "डेमो खाते केवल सिंथेटिक डेटा का उपयोग करते हैं।",
        studentCard: "डेमो विद्यार्थी",
        studentUser: "student01",
        studentPass: "MargamDemo@2026",
        teacherCard: "डेमो शिक्षक",
        teacherUser: "teacher@example.demo.invalid",
        teacherPass: "MargamDemo@2026",
        classCodeLabel: "कक्षा कोड",
        classCode: "DEMO-10A",
        copyBtn: "कॉपी",
        copiedBtn: "कॉपी हुआ!",
        enterStudentBtn: "विद्यार्थी डेमो खोलें",
        enterTeacherBtn: "शिक्षक डेमो खोलें",
      },
      s8: {
        tag: "08 // पाठ्यक्रम दायरा",
        heading: "आज का पाठ्यक्रम दायरा",
        honestLine:
          "आज दो पूर्ण पायलट शृंखलाएं (कक्षा 6-10) उपलब्ध हैं; शेष 67 एनसीईआरटी अध्यायों का मानचित्रण हो चुका है और वे जल्द आ रहे हैं।",
        chain1Title: "पायलट शृंखला 1: संख्या पद्धति से द्विघात समीकरण",
        chain1Desc:
          "कक्षा 6–10: ऋणात्मक संख्याएँ ➔ पूर्णांक संक्रियाएँ ➔ वितरण नियम ➔ बीजीय सर्वसमिकाएँ ➔ द्विघात समीकरण।",
        chain2Title: "पायलट शृंखला 2: रैखिक समीकरण और बीजगणित",
        chain2Desc:
          "कक्षा 6–10: चर और व्यंजक ➔ सरल समीकरण ➔ एक चर वाले समीकरण ➔ बहुपद ➔ रैखिक युग्म।",
        allMapped:
          "एनसीईआरटी कक्षा 6–10 के सभी 67 गणित अध्यायों को हमारी निर्भरता शृंखला में मैप किया गया है।",
      },
      s9: {
        tag: "09 // अक्सर पूछे जाने वाले प्रश्न",
        heading: "महत्वपूर्ण प्रश्न और उत्तर",
        q1: "मार्गम् यह कैसे पहचानता है कि मैं कहाँ अटका हूँ?",
        a1: "जब आप 5-प्रश्नों की जांच परीक्षा पूरी करते हैं, तो हमारा इंजन गलतियों के स्वरूप को पूर्व-आवश्यकता शृंखला से मिलाता है। यदि द्विघात समीकरण की गलती का कारण पूर्णांक चिह्न है, तो मार्गम् कक्षा 7 को मुख्य कमी के रूप में चिन्हित करता है।",
        q2: "क्या विद्यार्थियों को ईमेल या फ़ोन नंबर देना होगा?",
        a2: "नहीं। विद्यार्थी केवल एक उपयोगकर्ता नाम और पासवर्ड से खाता बना सकते हैं, या अतिथि के रूप में अभ्यास कर सकते हैं।",
        q3: "क्या मार्गम् ऑफ़लाइन काम करता है?",
        a3: "हाँ। मार्गम् में सर्विस वर्कर और स्थानीय संग्रहण है जिससे धीमे इंटरनेट में भी अभ्यास जारी रहता है।",
        q4: "क्या यह एनसीईआरटी पाठ्यक्रम के अनुसार है?",
        a4: "हाँ। सभी अध्याय और अवधारणाएं सीधे कक्षा 6 से 10 के नवीनतम एनसीईआरटी पाठ्यक्रम पर आधारित हैं।",
        q5: "शिक्षक डैशबोर्ड पर डेटा कैसे सुरक्षित रहता है?",
        a5: "शिक्षक केवल कक्षा रोल नंबर और उपयोगकर्ता नाम देख सकते हैं। कोई व्यक्तिगत संपर्क जानकारी संग्रहीत नहीं की जाती।",
      },
    },
    te: {
      reviewed: false,
      hero: {
        h1: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
        sub: "మార్గం మీరు గతంలో తప్పిపోయిన పునాది అంశాన్ని గుర్తిస్తుంది—ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేత నియమాలు—మరియు దానిని సరిదిద్దేందుకు మార్గదర్శనం చేస్తుంది. NCERT, English, हिन्दी మరియు తెలుగులో.",
        demoBtn: "డెమోను ప్రయత్నించండి (జడ్జ్)",
        demoSub: "త్వరిత పరిశీలన కోసం ఆధారాలు ముందుగానే పూరించబడతాయి",
        student: {
          tag: "విద్యార్థి",
          title: "నేను విద్యార్థిని",
          desc: "ఒక చిన్న రోగనిర్ధారణ పరీక్ష రాయండి, మీకు తెలిసిన అంశాల పటాన్ని చూడండి, మరియు చిన్న చిన్న దశల్లో లోపాలను సరిదిద్దండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
          btn: "నేర్చుకోవడం ప్రారంభించండి",
          signIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
        },
        teacher: {
          tag: "ఉపాధ్యాయుడు",
          title: "నేను ఉపాధ్యాయుడిని",
          desc: "తరగతిని సృష్టించండి, కోడ్‌ను పంచుకోండి, మరియు మీ విద్యార్థులు గతంలోని ఏ పునాది అంశాలలో వెనుకబడ్డారో చూడండి.",
          btn: "నా తరగతిని సిద్ధం చేయండి",
          signIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
        },
      },
      s1: {
        tag: "01 // ప్రధాన కారణం",
        heading: "గణితం ఒక భవనం లాంటిది. ఒక్క ఇటుక బలహీనంగా ఉన్నా మొత్తం అంతస్తు కదులుతుంది.",
        body1:
          "పై తరగతులలో లెక్కలు అర్థం కాకపోవడానికి కారణం కొత్త సూత్రాలు కష్టం కావడం కాదు, గతంలోని ఏదో ఒక నియమం మర్చిపోవడం.",
        body2:
          "7వ తరగతి పూర్ణ సంఖ్యల సంకేత నియమాలు సరిగ్గా లేకపోతే, 8వ తరగతి విభాగ న్యాయం, 9వ తరగతి సర్వసమీకరణాలు మరియు 10వ తరగతి వర్గ సమీకరణాలు అర్థం కావు. మార్గం ఆ మొదటి లోపాన్ని గుర్తించి పునాదిని బలపరుస్తుంది.",
        step1Title: "6వ తరగతి",
        step1Concept: "రుణ సంఖ్యలు",
        step2Title: "7వ తరగతి",
        step2Concept: "పూర్ణ సంఖ్యల సంకేత నియమాలు",
        step2Badge: "అసలైన సమస్య",
        step3Title: "8వ తరగతి",
        step3Concept: "విభాగ న్యాయం",
        step4Title: "9వ తరగతి",
        step4Concept: "బీజీయ సర్వసమీకరణాలు",
        step5Title: "10వ తరగతి",
        step5Concept: "వర్గ సమీకరణాలు",
        step5Badge: "ఇబ్బంది పడే చోటు",
      },
      s2: {
        tag: "02 // మార్గం ఎలా పనిచేస్తుంది",
        heading: "ఇబ్బంది నుంచి ఆత్మవిశ్వాసం వైపు మూడు అడుగులు",
        b1Num: "01",
        b1Title: "రోగనిర్ధారణ పరీక్ష",
        b1Text:
          "5 ప్రశ్నల చిన్న పరీక్ష మీ ప్రస్తుత తరగతి వెనుక ఉన్న పూర్వ పునాది సామర్థ్యాన్ని గుర్తిస్తుంది.",
        b2Num: "02",
        b2Title: "లోపాన్ని సరిదిద్దండి",
        b2Text:
          "లక్ష్యంగా చేసుకున్న చిన్న పాఠాలు మరియు సరళమైన ప్రశ్నలతో తప్పిపోయిన పునాది అంశాన్ని మళ్లీ నేర్పిస్తుంది.",
        b3Num: "03",
        b3Title: "నిరూపించండి",
        b3Text:
          "మీ తరగతి స్థాయి సమస్యలను పూర్తి ఆత్మవిశ్వాసంతో సాధించండి మరియు XP సంపాదించండి.",
      },
      s3: {
        tag: "03 // పొరపాటు జీవులు",
        heading: "తప్పులు వైఫల్యాలు కావు — అవి నేర్చుకోవడానికి స్నేహపూర్వక ఆధారాలు",
        sub: "మీరు పొరపాటు చేసినప్పుడు, మారు పిల్లి మరియు మా పిక్సెల్ జీవులు ఆ తప్పు వెనుక ఉన్న కారణాన్ని గుర్తించి ప్రేమగా సరిదిద్దుతాయి.",
        c1Name: "సైన్ స్లిప్",
        c1Line: "మీరు గమనించనప్పుడు ప్లస్ మరియు మైనస్ గుర్తులతో ఆడుకుంటుంది.",
        c2Name: "ఫ్రాక్షన్ ఫంబుల్",
        c2Line: "లవాన్ని మరియు హారాన్ని తలకిందులు చేస్తుంది. గుణకార విలోమంతో సరిదిద్దుకోవచ్చు.",
        c3Name: "డిస్ట్రిబ్యూషన్ డాడ్జ్",
        c3Line: "బ్రాకెట్లలో దాక్కుని రెండవ పదాన్ని గుణించడం మర్చిపోతుంది.",
        c4Name: "క్యాలిక్యులేషన్ స్లిప్",
        c4Line: "తొందరపాటులో ఘాతాలను లేదా క్యారీని జారవిడుస్తుంది.",
      },
      s4: {
        tag: "04 // ఉపాధ్యాయుల కోసం",
        heading: "మీ తరగతి గదిలో విద్యార్థులు ఎక్కడ వెనుకబడ్డారో చూడండి",
        sub: "ప్రస్తుత పాఠాన్ని మళ్లీ మళ్లీ బోధించే బదులు, ఏ పూర్వ తరగతి అంశం అసలైన అడ్డంకిగా ఉందో స్పష్టమైన హీట్‌మ్యాప్ ద్వారా తెలుసుకోండి.",
        classTitle: "10వ తరగతి — సెక్షన్ ఎ (డెమో) (ఎగ్జాంపుల్ పబ్లిక్ స్కూల్)",
        stat1Num: "25",
        stat1Label: "నమోదైన విద్యార్థులు",
        stat2Num: "68%",
        stat2Label: "తరగతి సగటు మార్కులు",
        stat3Num: "7",
        stat3Label: "7వ తరగతి గుర్తులపై ఇబ్బంది పడుతున్నవారు",
        row1Concept: "6వ తరగతి · రుణ సంఖ్యలు (c6-neg-01)",
        row1Rate: "23 / 25 పూర్తి (92%)",
        row2Concept: "7వ తరగతి · పూర్ణ సంఖ్యల గుర్తులు (c7-int-02)",
        row2Rate: "12 / 25 పూర్తి (48%) · 7 ప్రధాన లోపాలు",
        row3Concept: "8వ తరగతి · విభాగ న్యాయం (c8-dist-01)",
        row3Rate: "18 / 25 పూర్తి (72%)",
        row4Concept: "10వ తరగతి · వర్గ సమీకరణాల కారకాలు (c10-quad-01)",
        row4Rate: "16 / 25 పూర్తి (64%)",
        insight:
          "బోధన విశ్లేషణ: 7 మంది విద్యార్థులు కేవలం రుణ పూర్ణ సంఖ్యల సంకేతాల వల్లే వర్గ సమీకరణాలలో విఫలమయ్యారు. 10 నిమిషాల పునశ్చరణతో సమస్య పరిష్కారమవుతుంది.",
        cta: "ఉపాధ్యాయ డ్యాష్‌బోర్డ్ తెరవండి",
      },
      s5: {
        tag: "05 // మీ భాష",
        heading: "మీరు ఆలోచించే భాషలోనే గణితం నేర్చుకోండి",
        sub: "గణిత ఆలోచన భాషా అడ్డంకులలో చిక్కుకోకూడదు. ఇంగ్లీష్, हिन्दी మరియు తెలుగులలో ఎప్పుడైనా మారండి.",
        qText:
          "x విలువను కనుగొనండి: x² − 5x + 6 = 0. (−2) × (−3) = +6 ఎందుకు అవుతుందో ఏ పూర్వ నియమం వివరిస్తుంది?",
        opt0: "7వ తరగతి: రెండు రుణ పూర్ణసంఖ్యల లబ్దం ఎల్లప్పుడూ ధనాత్మకం అవుతుంది",
        opt1: "10వ తరగతి: వర్గ సమీకరణ వివక్షక సూత్రం b² − 4ac",
        opt2: "6వ తరగతి: భాగాహార పద్ధతి",
        opt3: "8వ తరగతి: ఘాతాంక న్యాయాలు aᵐ × aⁿ",
        feedbackCorrect:
          "చాలా చక్కగా చెప్పారు! x² − 5x + 6 కారకాలుగా మార్చడానికి గుణిస్తే +6 మరియు కూడితే −5 వచ్చే రెండు సంఖ్యలు కావాలి. ఇది 7వ తరగతి పూర్ణ సంఖ్యల గుణకారంపై ఆధారపడి ఉంటుంది.",
        feedbackIncorrect:
          "(−2) × (−3) = +6 అనేది 7వ తరగతి పూర్ణసంఖ్యల సంకేత నియమం. సంకేతాలపై పట్టు సాధిస్తే వర్గ సమీకరణాలు ఎంతో సులభమవుతాయి!",
      },
      s6: {
        tag: "06 // విద్యార్థి భద్రత",
        heading: "గోప్యతకు ప్రాధాన్యత, భద్రతకు హామీ",
        sub: "మార్గం పాఠశాల విద్యార్థుల కోసం రూపొందించబడింది. గణితం నేర్పించడానికి అవసరమైన సమాచారాన్ని మాత్రమే ఉపయోగిస్తాము.",
        f1Title: "ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు",
        f1Desc:
          "విద్యార్థులు కేవలం యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌తో నమోదు చేసుకుంటారు. ఫోన్ నంబర్లు లేదా ఈమెయిల్‌ను ఎప్పటికీ అడగము.",
        f2Title: "ప్రకటన ట్రాకర్లు ఉండవు",
        f2Desc:
          "ఎలాంటి మూడవ పక్ష ప్రకటన కుకీలు లేదా ట్రాకింగ్ స్క్రిప్ట్‌లు ఉండవు. మీ అభ్యసన సమాచారం పూర్తిగా సురక్షితం.",
        f3Title: "సర్వర్ ద్వారా నిర్ధారణ",
        f3Desc:
          "సమాధానాల కీలు మరియు మూల్యాంకన నియమాలు సర్వర్‌లో మాత్రమే ఉంటాయి. బ్రౌజర్‌లో సమాధానాలు బహిర్గతం కావు.",
        f4Title: "అతిథిగా నేర్చుకోండి",
        f4Desc:
          "ఖాతా లేకుండా కూడా పూర్తిగా ప్రాక్టీస్ చేయవచ్చు. మీ పురోగతి మీ బ్రౌజర్ మెమరీలోనే సురక్షితంగా ఉంటుంది.",
      },
      s7: {
        tag: "07 // డెమో (జడ్జిల కోసం)",
        heading: "కోడ్ కెర్నెల్ '26 కోసం మూల్యాంకన ఖాతాలు",
        sub: "వాస్తవిక NCERT అభ్యాస చరిత్రలతో కూడిన సింథటిక్ తరగతి గది.",
        disclaimer: "డెమో ఖాతాలు సింథటిక్ డేటాను మాత్రమే ఉపయోగిస్తాయి.",
        studentCard: "డెమో విద్యార్థి",
        studentUser: "student01",
        studentPass: "MargamDemo@2026",
        teacherCard: "డెమో ఉపాధ్యాయుడు",
        teacherUser: "teacher@example.demo.invalid",
        teacherPass: "MargamDemo@2026",
        classCodeLabel: "తరగతి కోడ్",
        classCode: "DEMO-10A",
        copyBtn: "కాపీ",
        copiedBtn: "కాపీ అయింది!",
        enterStudentBtn: "విద్యార్థి డెమో తెరవండి",
        enterTeacherBtn: "ఉపాధ్యాయ డెమో తెరవండి",
      },
      s8: {
        tag: "08 // పాఠ్యప్రణాళిక పరిధి",
        heading: "నేటి పాఠ్యప్రణాళిక పరిధి",
        honestLine:
          "ప్రస్తుతం రెండు పూర్తి పైలట్ విభాగాలు (6-10 తరగతులు) సిద్ధంగా ఉన్నాయి; మిగిలిన 67 NCERT అధ్యాయాలు మ్యాప్ చేయబడ్డాయి మరియు త్వరలో రాబోతున్నాయి.",
        chain1Title: "పైలట్ చైన్ 1: సంఖ్యా వ్యవస్థల నుండి వర్గ సమీకరణాలు",
        chain1Desc:
          "6–10 తరగతులు: రుణ సంఖ్యలు ➔ పూర్ణ సంఖ్యల గణనలు ➔ విభాగ న్యాయం ➔ సర్వసమీకరణాలు ➔ వర్గ సమీకరణాలు.",
        chain2Title: "పైలట్ చైన్ 2: రేఖీయ సమీకరణాలు మరియు బీజగణితం",
        chain2Desc:
          "6–10 తరగతులు: చరరాశులు ➔ సరళ సమీకరణాలు ➔ ఒక చరరాశి సమీకరణాలు ➔ బహుపదులు ➔ రేఖీయ జతలు.",
        allMapped:
          "NCERT 6–10 తరగతుల మొత్తం 67 అధ్యాయాలు మా పునాది డిపెండెన్సీ గ్రాఫ్‌లో మ్యాప్ చేయబడ్డాయి.",
      },
      s9: {
        tag: "09 // తరచుగా అడిగే ప్రశ్నలు",
        heading: "ముఖ్యమైన ప్రశ్నలు మరియు సమాధానాలు",
        q1: "నేను ఎక్కడ వెనుకబడ్డానో మార్గం ఎలా గుర్తిస్తుంది?",
        a1: "మీరు 5 ప్రశ్నల రోగనిర్ధారణ పరీక్ష పూర్తి చేసినప్పుడు, మా అల్గారిథమ్ తప్పుల విధానాన్ని విశ్లేషిస్తుంది. వర్గ సమీకరణాల తప్పు పూర్ణసంఖ్యల వల్ల జరిగిందని తెలిస్తే, 7వ తరగతి పునాదిని సరిదిద్దడానికి సూచిస్తుంది.",
        q2: "విద్యార్థులు ఈమెయిల్ లేదా ఫోన్ నంబర్ ఇవ్వాలా?",
        a2: "అవసరం లేదు. యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌తో లేదా అతిథిగా నేరుగా అభ్యసించవచ్చు.",
        q3: "ఇంటర్నెట్ సరిగ్గా లేకపోయినా పనిచేస్తుందా?",
        a3: "అవును. సర్వీస్ వర్కర్ మరియు స్థానిక నిల్వ ద్వారా ఆఫ్‌లైన్‌లో కూడా వర్క్‌షీట్‌లు సాధించవచ్చు.",
        q4: "ఇది NCERT సిలబస్‌కు అనుగుణంగా ఉందా?",
        a4: "అవును. అన్ని కాన్సెప్ట్‌లు 6 నుండి 10వ తరగతి వరకు NCERT గణిత పాఠ్యపుస్తకాలకు అనుగుణంగా ఉంటాయి.",
        q5: "ఉపాధ్యాయుల డాష్‌బోర్డ్‌లో గోప్యత ఎలా ఉంటుంది?",
        a5: "ఉపాధ్యాయులు కేవలం రోల్ నంబర్ మరియు యూజర్‌నేమ్ మాత్రమే చూస్తారు. ఎలాంటి వ్యక్తిగత వివరాలు నిల్వ చేయబడవు.",
      },
    },
  }[currentLang];

  // Helper for sample question options
  const sampleQuestion = {
    en: {
      q: copy.s5.qText,
      opts: [copy.s5.opt0, copy.s5.opt1, copy.s5.opt2, copy.s5.opt3],
    },
    hi: {
      q: copy.s5.qText,
      opts: [copy.s5.opt0, copy.s5.opt1, copy.s5.opt2, copy.s5.opt3],
    },
    te: {
      q: copy.s5.qText,
      opts: [copy.s5.opt0, copy.s5.opt1, copy.s5.opt2, copy.s5.opt3],
    },
  }[sampleLang];

  return (
    <div className="space-y-16 sm:space-y-20 py-4 sm:py-6">
      {/* ================================================================= */}
      {/* HERO SECTION                                                      */}
      {/* ================================================================= */}
      <section aria-labelledby="hero-heading" className="space-y-8 sm:space-y-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="shrink-0 mb-1 p-2 bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]">
            <WitchCat
              pose="greet"
              size={110}
              sticker={false}
              alt="Maru the cat companion"
            />
          </div>

          <h1
            id="hero-heading"
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-[#2B1B0F] leading-tight max-w-[22ch]"
          >
            {copy.hero.h1}
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#2B1B0F] max-w-[65ch] leading-relaxed">
            {copy.hero.sub}
          </p>

          {/* Prominent Demo Entry Button for Judges */}
          <div className="pt-2 w-full max-w-md">
            <Link
              href="/login?role=student&demo=1"
              className="w-full inline-flex items-center justify-center min-h-[50px] px-6 py-3 bg-[#F4C542] hover:bg-[#F6CF5C] text-[#2B1B0F] font-heading font-bold text-base sm:text-lg border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline gap-2 rounded-[2px]"
            >
              <span>{copy.hero.demoBtn}</span>
              <ArrowRight className="w-5 h-5 text-[#2B1B0F]" />
            </Link>
            <p className="text-[11px] font-sans text-[#7A4B2A] mt-1.5 text-center">
              {copy.hero.demoSub}
            </p>
          </div>
        </div>

        {/* Two Role Cards: Student & Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Student */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-pixel text-[11px] uppercase tracking-wider text-[#5DAA3A] block">
                {copy.hero.student.tag}
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                {copy.hero.student.title}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                {copy.hero.student.desc}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login?role=student&mode=signup"
                className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline rounded-[2px]"
              >
                <span>{copy.hero.student.btn}</span>
                <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
              </Link>

              <div className="text-center">
                <Link
                  href="/login?role=student"
                  className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                >
                  {copy.hero.student.signIn}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Teacher */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-pixel text-[11px] uppercase tracking-wider text-[#3FA7C9] block">
                {copy.hero.teacher.tag}
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                {copy.hero.teacher.title}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                {copy.hero.teacher.desc}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login?role=teacher&mode=signup"
                className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline rounded-[2px]"
              >
                <span>{copy.hero.teacher.btn}</span>
                <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
              </Link>

              <div className="text-center">
                <Link
                  href="/login?role=teacher"
                  className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                >
                  {copy.hero.teacher.signIn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 1: WHY STUDENTS GET STUCK (GAP TRACE DIAGRAM)              */}
      {/* ================================================================= */}
      <section aria-labelledby="s1-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s1.tag}
          </span>
          <h2 id="s1-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s1.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/90 leading-relaxed">
            {copy.s1.body1} {copy.s1.body2}
          </p>
        </div>

        {/* Responsive Gap Trace Chain: Vertical on <640px, Horizontal on >=640px */}
        <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
            {/* Step 1: Class 6 */}
            <div className="w-full sm:flex-1 p-3.5 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-center shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]">
              <span className="font-pixel text-[10px] text-[#7A4B2A] uppercase block">
                {copy.s1.step1Title}
              </span>
              <p className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] mt-1">
                {copy.s1.step1Concept}
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="text-[#2B1B0F] shrink-0" aria-hidden="true">
              <span className="hidden sm:inline font-bold text-lg">➔</span>
              <span className="sm:hidden font-bold text-base">↓</span>
            </div>

            {/* Step 2: Class 7 — HIGHLIGHTED RED: THE REAL PROBLEM */}
            <div className="w-full sm:flex-1 p-3.5 bg-[#D9453D] text-[#FFFFFF] border-[3px] border-[#2B1B0F] text-center shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] relative transform sm:scale-105">
              <span className="inline-block px-1.5 py-0.5 bg-[#F4C542] text-[#2B1B0F] font-pixel text-[9px] font-bold border border-[#2B1B0F] mb-1">
                {copy.s1.step2Badge}
              </span>
              <span className="font-pixel text-[10px] text-[#FFF7E6] uppercase block">
                {copy.s1.step2Title}
              </span>
              <p className="font-heading font-extrabold text-xs sm:text-sm text-[#FFFFFF] mt-0.5">
                {copy.s1.step2Concept}
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="text-[#2B1B0F] shrink-0" aria-hidden="true">
              <span className="hidden sm:inline font-bold text-lg">➔</span>
              <span className="sm:hidden font-bold text-base">↓</span>
            </div>

            {/* Step 3: Class 8 */}
            <div className="w-full sm:flex-1 p-3.5 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-center shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]">
              <span className="font-pixel text-[10px] text-[#7A4B2A] uppercase block">
                {copy.s1.step3Title}
              </span>
              <p className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] mt-1">
                {copy.s1.step3Concept}
              </p>
            </div>

            {/* Arrow 3 */}
            <div className="text-[#2B1B0F] shrink-0" aria-hidden="true">
              <span className="hidden sm:inline font-bold text-lg">➔</span>
              <span className="sm:hidden font-bold text-base">↓</span>
            </div>

            {/* Step 4: Class 9 */}
            <div className="w-full sm:flex-1 p-3.5 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-center shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]">
              <span className="font-pixel text-[10px] text-[#7A4B2A] uppercase block">
                {copy.s1.step4Title}
              </span>
              <p className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] mt-1">
                {copy.s1.step4Concept}
              </p>
            </div>

            {/* Arrow 4 */}
            <div className="text-[#2B1B0F] shrink-0" aria-hidden="true">
              <span className="hidden sm:inline font-bold text-lg">➔</span>
              <span className="sm:hidden font-bold text-base">↓</span>
            </div>

            {/* Step 5: Class 10 — WHERE IT HURTS */}
            <div className="w-full sm:flex-1 p-3.5 bg-[#FFFFFF] border-2 border-[#2B1B0F] text-center shadow-[2px_2px_0px_#2B1B0F] rounded-[2px] relative">
              <span className="inline-block px-1.5 py-0.5 bg-[#FFF7E6] text-[#D9453D] font-pixel text-[9px] font-bold border border-[#D9453D] mb-1">
                {copy.s1.step5Badge}
              </span>
              <span className="font-pixel text-[10px] text-[#7A4B2A] uppercase block">
                {copy.s1.step5Title}
              </span>
              <p className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] mt-0.5">
                {copy.s1.step5Concept}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: HOW MARGAM WORKS (3 NUMBERED VOXEL BLOCKS)             */}
      {/* ================================================================= */}
      <section aria-labelledby="s2-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s2.tag}
          </span>
          <h2 id="s2-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s2.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Block 1: Diagnostic */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 space-y-4">
            <span className="inline-block px-2 py-1 bg-[#5DAA3A] text-[#2B1B0F] font-pixel text-xs font-bold border-2 border-[#2B1B0F]">
              {copy.s2.b1Num}
            </span>
            <h3 className="font-heading font-bold text-xl text-[#2B1B0F]">
              {copy.s2.b1Title}
            </h3>
            <p className="font-sans text-sm text-[#2B1B0F]/85 leading-relaxed">
              {copy.s2.b1Text}
            </p>
          </div>

          {/* Block 2: Fix the Gap */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 space-y-4">
            <span className="inline-block px-2 py-1 bg-[#F4C542] text-[#2B1B0F] font-pixel text-xs font-bold border-2 border-[#2B1B0F]">
              {copy.s2.b2Num}
            </span>
            <h3 className="font-heading font-bold text-xl text-[#2B1B0F]">
              {copy.s2.b2Title}
            </h3>
            <p className="font-sans text-sm text-[#2B1B0F]/85 leading-relaxed">
              {copy.s2.b2Text}
            </p>
          </div>

          {/* Block 3: Prove It */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 space-y-4">
            <span className="inline-block px-2 py-1 bg-[#A4D2FF] text-[#2B1B0F] font-pixel text-xs font-bold border-2 border-[#2B1B0F]">
              {copy.s2.b3Num}
            </span>
            <h3 className="font-heading font-bold text-xl text-[#2B1B0F]">
              {copy.s2.b3Title}
            </h3>
            <p className="font-sans text-sm text-[#2B1B0F]/85 leading-relaxed">
              {copy.s2.b3Text}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: MEET THE MISTAKE CREATURES                             */}
      {/* ================================================================= */}
      <section aria-labelledby="s3-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s3.tag}
          </span>
          <h2 id="s3-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s3.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
            {copy.s3.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Creature 1: Sign Slip */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 flex flex-col items-center text-center space-y-3">
            <div className="p-2 bg-[#FFF7E6] border-2 border-[#2B1B0F]">
              <MistakeCreature type="sign_slip" size="default" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#2B1B0F]">
              {copy.s3.c1Name}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s3.c1Line}
            </p>
          </div>

          {/* Creature 2: Fraction Fumble */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 flex flex-col items-center text-center space-y-3">
            <div className="p-2 bg-[#FFF7E6] border-2 border-[#2B1B0F]">
              <MistakeCreature type="fraction_fumble" size="default" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#2B1B0F]">
              {copy.s3.c2Name}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s3.c2Line}
            </p>
          </div>

          {/* Creature 3: Distribution Dodge */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 flex flex-col items-center text-center space-y-3">
            <div className="p-2 bg-[#FFF7E6] border-2 border-[#2B1B0F]">
              <MistakeCreature type="distribution_dodge" size="default" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#2B1B0F]">
              {copy.s3.c3Name}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s3.c3Line}
            </p>
          </div>

          {/* Creature 4: Calculation Slip */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 flex flex-col items-center text-center space-y-3">
            <div className="p-2 bg-[#FFF7E6] border-2 border-[#2B1B0F]">
              <MistakeCreature type="calculation_slip" size="default" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#2B1B0F]">
              {copy.s3.c4Name}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s3.c4Line}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: FOR TEACHERS (CLASS HEATMAP PREVIEW)                   */}
      {/* ================================================================= */}
      <section aria-labelledby="s4-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s4.tag}
          </span>
          <h2 id="s4-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s4.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
            {copy.s4.sub}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#2B1B0F]/15 pb-4">
            <div>
              <span className="font-pixel text-[10px] text-[#3FA7C9] uppercase block">
                Live Classroom Analytics
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#2B1B0F]">
                {copy.s4.classTitle}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FFF7E6] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-bold text-xs rounded-[2px]">
                {copy.s4.stat1Num} {copy.s4.stat1Label}
              </span>
              <span className="px-3 py-1 bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-bold text-xs rounded-[2px]">
                Avg: {copy.s4.stat2Num}
              </span>
            </div>
          </div>

          {/* Heatmap concept progress bars */}
          <div className="space-y-3.5">
            {/* Row 1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
                <span>{copy.s4.row1Concept}</span>
                <span className="text-[#5DAA3A]">{copy.s4.row1Rate}</span>
              </div>
              <div className="h-3 w-full bg-[#FFF7E6] border border-[#2B1B0F] overflow-hidden">
                <div className="h-full bg-[#5DAA3A]" style={{ width: "92%" }} />
              </div>
            </div>

            {/* Row 2 — THE ROOT BOTTLENECK ALERT */}
            <div className="p-3 bg-[#FFF7E6] border-2 border-[#D9453D] rounded-[2px] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F] flex-wrap gap-1">
                <span className="flex items-center gap-1.5 text-[#D9453D]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{copy.s4.row2Concept}</span>
                </span>
                <span className="px-1.5 py-0.5 bg-[#D9453D] text-[#FFFFFF] font-pixel text-[9px] font-bold">
                  {copy.s4.stat3Num} BOTTLENECKS
                </span>
              </div>
              <div className="h-3 w-full bg-[#FFFFFF] border border-[#2B1B0F] overflow-hidden">
                <div className="h-full bg-[#D9453D]" style={{ width: "48%" }} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
                <span>{copy.s4.row3Concept}</span>
                <span className="text-[#5DAA3A]">{copy.s4.row3Rate}</span>
              </div>
              <div className="h-3 w-full bg-[#FFF7E6] border border-[#2B1B0F] overflow-hidden">
                <div className="h-full bg-[#5DAA3A]" style={{ width: "72%" }} />
              </div>
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
                <span>{copy.s4.row4Concept}</span>
                <span className="text-[#F4C542]">{copy.s4.row4Rate}</span>
              </div>
              <div className="h-3 w-full bg-[#FFF7E6] border border-[#2B1B0F] overflow-hidden">
                <div className="h-full bg-[#F4C542]" style={{ width: "64%" }} />
              </div>
            </div>
          </div>

          <div className="pt-2 p-3 bg-[#FFF7E6] border border-[#2B1B0F]/20 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs font-sans text-[#2B1B0F] leading-relaxed">
              💡 <strong>{copy.s4.insight}</strong>
            </p>
            <Link
              href="/login?role=teacher&demo=1"
              className="shrink-0 inline-flex items-center justify-center min-h-[38px] px-4 py-2 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-xs border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all no-underline rounded-[2px]"
            >
              <span>{copy.s4.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: YOUR LANGUAGE (INTERACTIVE QUESTION)                   */}
      {/* ================================================================= */}
      <section aria-labelledby="s5-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s5.tag}
          </span>
          <h2 id="s5-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s5.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
            {copy.s5.sub}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 sm:p-7 space-y-5">
          {/* Language Switch Tabs for this interactive widget */}
          <div className="flex items-center gap-2 border-b-2 border-[#2B1B0F]/15 pb-4">
            <span className="text-xs font-heading font-bold text-[#7A4B2A] mr-2">
              Preview Language:
            </span>
            {(["en", "hi", "te"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setSampleLang(l);
                  setSelectedOption(null);
                }}
                className={`min-h-[34px] px-3 py-1 font-heading font-bold text-xs border-2 border-[#2B1B0F] rounded-[2px] transition-all cursor-pointer ${
                  sampleLang === l
                    ? "bg-[#F4C542] text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                    : "bg-[#FFF7E6] text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
                }`}
              >
                {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "తెలుగు"}
              </button>
            ))}
          </div>

          {/* Question Box */}
          <div className="p-4 bg-[#FFF7E6] border-2 border-[#2B1B0F] rounded-[2px]">
            <span className="font-pixel text-[10px] text-[#7A4B2A] uppercase block mb-1">
              Sample Class 10 Diagnostic Question
            </span>
            <p className="font-heading font-bold text-base sm:text-lg text-[#2B1B0F] leading-snug">
              {sampleQuestion.q}
            </p>
          </div>

          {/* 4 Clickable Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleQuestion.opts.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={`p-3.5 border-2 border-[#2B1B0F] text-left rounded-[2px] transition-all cursor-pointer min-h-[56px] flex items-center justify-between gap-2 ${
                    isSelected
                      ? isCorrect
                        ? "bg-[#5DAA3A]/25 border-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                        : "bg-[#D9453D]/20 border-[#D9453D] shadow-[2px_2px_0px_#2B1B0F]"
                      : "bg-[#FFFFFF] hover:bg-[#FFF7E6] shadow-[2px_2px_0px_#2B1B0F]"
                  }`}
                >
                  <span className="font-sans text-xs sm:text-sm text-[#2B1B0F] font-semibold">
                    {opt}
                  </span>
                  {isSelected && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <Check className="w-4 h-4 text-[#5DAA3A]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#D9453D]" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {selectedOption !== null && (
            <div
              className={`p-4 border-2 border-[#2B1B0F] rounded-[2px] text-xs sm:text-sm font-sans leading-relaxed animate-in fade-in ${
                selectedOption === 0
                  ? "bg-[#5DAA3A]/20 text-[#2B1B0F]"
                  : "bg-[#F4C542]/30 text-[#2B1B0F]"
              }`}
            >
              <strong>{selectedOption === 0 ? "✓ " : "💡 "}</strong>
              {selectedOption === 0 ? copy.s5.feedbackCorrect : copy.s5.feedbackIncorrect}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: BUILT TO KEEP STUDENTS SAFE (PLAIN FACTS)               */}
      {/* ================================================================= */}
      <section aria-labelledby="s6-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s6.tag}
          </span>
          <h2 id="s6-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s6.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
            {copy.s6.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Fact 1 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-3">
            <div className="w-9 h-9 bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-center rounded-[2px]">
              <EyeOff className="w-5 h-5 text-[#2B1B0F]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s6.f1Title}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s6.f1Desc}
            </p>
          </div>

          {/* Fact 2 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-3">
            <div className="w-9 h-9 bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-center rounded-[2px]">
              <ShieldCheck className="w-5 h-5 text-[#5DAA3A]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s6.f2Title}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s6.f2Desc}
            </p>
          </div>

          {/* Fact 3 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-3">
            <div className="w-9 h-9 bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-center rounded-[2px]">
              <Lock className="w-5 h-5 text-[#2B1B0F]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s6.f3Title}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s6.f3Desc}
            </p>
          </div>

          {/* Fact 4 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-3">
            <div className="w-9 h-9 bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-center rounded-[2px]">
              <Database className="w-5 h-5 text-[#3FA7C9]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s6.f4Title}
            </h3>
            <p className="font-sans text-xs text-[#2B1B0F]/85 leading-relaxed">
              {copy.s6.f4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7: TRY THE DEMO (FOR JUDGES)                              */}
      {/* ================================================================= */}
      <section aria-labelledby="s7-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s7.tag}
          </span>
          <h2 id="s7-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s7.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
            {copy.s7.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card A: Demo Student */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] text-[#5DAA3A] uppercase block">
                  {copy.s7.studentCard} (Aarav Sharma)
                </span>
                <span className="text-[10px] font-mono bg-[#FFF7E6] px-2 py-0.5 border border-[#2B1B0F]">
                  Class 10-A4
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono bg-[#FFF7E6] p-3 border-2 border-[#2B1B0F] rounded-[2px]">
                <div className="flex items-center justify-between">
                  <span>Username: <strong>{copy.s7.studentUser}</strong></span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("stu-user", copy.s7.studentUser)}
                    className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
                  >
                    {copiedKey === "stu-user" ? copy.s7.copiedBtn : copy.s7.copyBtn}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#2B1B0F]/20">
                  <span>Password: <strong>{copy.s7.studentPass}</strong></span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("stu-pass", copy.s7.studentPass)}
                    className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
                  >
                    {copiedKey === "stu-pass" ? copy.s7.copiedBtn : copy.s7.copyBtn}
                  </button>
                </div>
              </div>
            </div>

            <Link
              href="/login?role=student&demo=1"
              className="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-sm border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all no-underline rounded-[2px]"
            >
              <span>{copy.s7.enterStudentBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Card B: Demo Teacher */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] text-[#3FA7C9] uppercase block">
                  {copy.s7.teacherCard}
                </span>
                <span className="text-[10px] font-mono bg-[#FFF7E6] px-2 py-0.5 border border-[#2B1B0F]">
                  25 Roster Heatmap
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono bg-[#FFF7E6] p-3 border-2 border-[#2B1B0F] rounded-[2px]">
                <div className="flex items-center justify-between">
                  <span>Email: <strong>{copy.s7.teacherUser}</strong></span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("tch-user", copy.s7.teacherUser)}
                    className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
                  >
                    {copiedKey === "tch-user" ? copy.s7.copiedBtn : copy.s7.copyBtn}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#2B1B0F]/20">
                  <span>Password: <strong>{copy.s7.teacherPass}</strong></span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("tch-pass", copy.s7.teacherPass)}
                    className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
                  >
                    {copiedKey === "tch-pass" ? copy.s7.copiedBtn : copy.s7.copyBtn}
                  </button>
                </div>
              </div>
            </div>

            <Link
              href="/login?role=teacher&demo=1"
              className="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-sm border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 transition-all no-underline rounded-[2px]"
            >
              <span>{copy.s7.enterTeacherBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Class Code & Disclaimer banner */}
        <div className="p-4 bg-[#FFF7E6] border-2 border-[#2B1B0F] rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[11px] text-[#7A4B2A] uppercase">
              {copy.s7.classCodeLabel}:
            </span>
            <code className="font-mono font-extrabold text-sm px-2 py-0.5 bg-white border border-[#2B1B0F] select-all">
              {copy.s7.classCode}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard("cls-code", copy.s7.classCode)}
              className="text-xs font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
            >
              {copiedKey === "cls-code" ? copy.s7.copiedBtn : copy.s7.copyBtn}
            </button>
          </div>

          <p className="text-xs font-sans text-[#7A4B2A] italic">
            ℹ️ {copy.s7.disclaimer}
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 8: HONEST SCOPE LINE                                      */}
      {/* ================================================================= */}
      <section aria-labelledby="s8-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s8.tag}
          </span>
          <h2 id="s8-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s8.heading}
          </h2>
          <div className="p-3 bg-[#FFF7E6] border-2 border-[#2B1B0F] rounded-[2px]">
            <p className="font-heading font-bold text-sm sm:text-base text-[#2B1B0F]">
              📌 &ldquo;{copy.s8.honestLine}&rdquo;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pilot 1 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-2.5">
            <span className="inline-block px-2 py-0.5 bg-[#5DAA3A] text-[#2B1B0F] font-pixel text-[10px] font-bold border border-[#2B1B0F]">
              PILOT CHAIN 1
            </span>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s8.chain1Title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed">
              {copy.s8.chain1Desc}
            </p>
          </div>

          {/* Pilot 2 */}
          <div className="bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-5 space-y-2.5">
            <span className="inline-block px-2 py-0.5 bg-[#F4C542] text-[#2B1B0F] font-pixel text-[10px] font-bold border border-[#2B1B0F]">
              PILOT CHAIN 2
            </span>
            <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
              {copy.s8.chain2Title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed">
              {copy.s8.chain2Desc}
            </p>
          </div>
        </div>

        <p className="font-sans text-xs text-[#7A4B2A] max-w-2xl">
          🗺️ {copy.s8.allMapped}
        </p>
      </section>

      {/* ================================================================= */}
      {/* SECTION 9: FAQ (NATIVE DETAILS/SUMMARY)                            */}
      {/* ================================================================= */}
      <section aria-labelledby="s9-heading" className="space-y-6">
        <div className="space-y-2 max-w-3xl">
          <span className="font-pixel text-[11px] uppercase tracking-wider text-[#7A4B2A] block">
            {copy.s9.tag}
          </span>
          <h2 id="s9-heading" className="font-heading font-bold text-2xl sm:text-3xl text-[#2B1B0F]">
            {copy.s9.heading}
          </h2>
        </div>

        <div className="space-y-3 max-w-4xl">
          {/* FAQ 1 */}
          <details className="group bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-4 transition-all">
            <summary className="font-heading font-bold text-base text-[#2B1B0F] cursor-pointer flex items-center justify-between list-none">
              <span>{copy.s9.q1}</span>
              <span className="font-pixel text-xs text-[#7A4B2A] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed pt-2 border-t border-[#2B1B0F]/15">
              {copy.s9.a1}
            </p>
          </details>

          {/* FAQ 2 */}
          <details className="group bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-4 transition-all">
            <summary className="font-heading font-bold text-base text-[#2B1B0F] cursor-pointer flex items-center justify-between list-none">
              <span>{copy.s9.q2}</span>
              <span className="font-pixel text-xs text-[#7A4B2A] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed pt-2 border-t border-[#2B1B0F]/15">
              {copy.s9.a2}
            </p>
          </details>

          {/* FAQ 3 */}
          <details className="group bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-4 transition-all">
            <summary className="font-heading font-bold text-base text-[#2B1B0F] cursor-pointer flex items-center justify-between list-none">
              <span>{copy.s9.q3}</span>
              <span className="font-pixel text-xs text-[#7A4B2A] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed pt-2 border-t border-[#2B1B0F]/15">
              {copy.s9.a3}
            </p>
          </details>

          {/* FAQ 4 */}
          <details className="group bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-4 transition-all">
            <summary className="font-heading font-bold text-base text-[#2B1B0F] cursor-pointer flex items-center justify-between list-none">
              <span>{copy.s9.q4}</span>
              <span className="font-pixel text-xs text-[#7A4B2A] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed pt-2 border-t border-[#2B1B0F]/15">
              {copy.s9.a4}
            </p>
          </details>

          {/* FAQ 5 */}
          <details className="group bg-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-4 transition-all">
            <summary className="font-heading font-bold text-base text-[#2B1B0F] cursor-pointer flex items-center justify-between list-none">
              <span>{copy.s9.q5}</span>
              <span className="font-pixel text-xs text-[#7A4B2A] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-3 font-sans text-xs sm:text-sm text-[#2B1B0F]/85 leading-relaxed pt-2 border-t border-[#2B1B0F]/15">
              {copy.s9.a5}
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

