"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Input,
  LanguageToggle,
  OfflineBanner,
  Logo,
  type Language,
} from "@/components/ui";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import { isFeatureEnabled } from "@/lib/flags";
import { Companion } from "@/components/ui/Companion";
import { isIstNightTime } from "@/lib/xp-config";
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Users, Compass, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lang: currentLang, setLang: setCurrentLang, t } = useLanguage();

  useEffect(() => {
    const active = getActiveProfile();
    if (active && active.selectedClass) {
      const updated = syncClassProgression(active);
      setProfile(updated);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Multilingual copy dictionary for landing page
  const copy = {
    en: {
      appName: "Margam",
      tagline: "Adaptive Mathematics for Classes 6–10",
      h1: "Stuck in Class 10 maths? It probably started in Class 7.",
      subline:
        "Margam finds the earlier topic you missed, like integer signs hiding behind your quadratic mistakes, and walks you back to fix it. NCERT Classes 6-10, in English, हिन्दी and తెలుగు.",
      studentLabel: "STUDENT",
      studentTitle: "I'm a student",
      studentBody:
        "Take a quick check, see what you know, then fix topics one small step at a time. No email or phone number needed.",
      studentBtn: "Start learning",
      studentSignIn: "Already have an account? Sign in",
      teacherLabel: "TEACHER",
      teacherTitle: "I'm a teacher",
      teacherBody:
        "Create a class, share a code, and see which foundational concepts from earlier grades your students are actually stuck on.",
      teacherBtn: "Set up my class",
      teacherSignIn: "Already registered? Sign in",
      trustLine: "Follows NCERT 2024–26 · No trackers · No email needed",

      // SECTION A — HOW MARGAM WORKS
      howItWorksHeading: "Learning that understands where you need help.",
      howItWorksBadge: "5 STEPS TO MASTERY",
      howItWorksSubtitle: "A calm, structured pathway from your first check to genuine maths confidence.",
      step1Title: "1. Choose your class",
      step1Desc: "Select your grade from Class 6 to 10 to view your aligned NCERT mathematics chapters.",
      step2Title: "2. Find your learning gaps",
      step2Desc: "A short check finds earlier topics you missed—like integer signs behind quadratic equations—without test pressure.",
      step3Title: "3. Learn concepts through guided lessons",
      step3Desc: "Read concise, step-by-step lessons with clear worked examples and intuitive explanations.",
      step4Title: "4. Practise with questions adapted to your understanding",
      step4Desc: "Questions match your current understanding so practice stays encouraging, never overwhelming.",
      step5Title: "5. Track your progress and improvement",
      step5Desc: "Watch your mastered topics grow and build lasting confidence for school examinations.",

      // SECTION B — LEARNING THAT ADAPTS TO YOU
      adaptiveHeading: "Learning that adapts to you",
      adaptiveBadge: "ADAPTIVE LEARNING",
      adaptiveSubtitle: "Mathematics builds like a tower. When an earlier block is missing, higher grades feel difficult. Margam finds the missing block.",
      adaptivePoint1Title: "Identifies difficult concepts",
      adaptivePoint1Desc: "Spots exactly which concepts cause trouble instead of just giving a percentage score.",
      adaptivePoint2Title: "Recognises mistake patterns",
      adaptivePoint2Desc: "Understands why mistakes happen—whether it is a sign rule, formula confusion, or calculation step.",
      adaptivePoint3Title: "Revisits foundational concepts",
      adaptivePoint3Desc: "Guides you back to previous grade topics needed for your current chapter so you can master them.",
      adaptivePoint4Title: "Adapts practice to your pace",
      adaptivePoint4Desc: "Difficulty scales with understanding, providing targeted practice until the topic clicks.",
      adaptivePoint5Title: "Builds genuine confidence",
      adaptivePoint5Desc: "Students learn without penalty or fear, building mastery one small step at a time.",

      // SECTION C — BUILT FOR TEACHERS TOO
      teachersHeading: "Built for teachers too",
      teachersBadge: "TEACHER TOOLS",
      teachersSubtitle: "Margam supports teachers in the classroom. It does not replace them.",
      teacherFeat1Title: "Monitor student progress",
      teacherFeat1Desc: "View class rosters, lesson completions, and chapter practice activity in one clear dashboard.",
      teacherFeat2Title: "Identify common learning gaps",
      teacherFeat2Desc: "Discover which prerequisite skills from earlier grades the whole class finds difficult.",
      teacherFeat3Title: "Understand individual student performance",
      teacherFeat3Desc: "Review specific error tags and accuracy rates for each student privately.",
      teacherFeat4Title: "Use learning insights in the classroom",
      teacherFeat4Desc: "Plan targeted classroom revisions based on actual student gap data to help everyone succeed.",
      teacherCtaBtn: "Explore Teacher Hub",

      // SECTION D — WHY MARGAM?
      whyHeading: "Why Margam?",
      whyBadge: "OUR FOCUS",
      whySubtitle: "A focused learning space built specifically for Indian school mathematics.",
      why1Title: "Designed for Classes 6–10",
      why1Desc: "Strictly aligned with the NCERT Mathematics syllabus for middle and secondary school.",
      why2Title: "Understanding over memorising",
      why2Desc: "Focuses on why formulas work, not just rushing through repetitive question drills.",
      why3Title: "Identifies foundational gaps",
      why3Desc: "Directly bridges gaps between middle school basics and board exam requirements.",
      why4Title: "Supports students and teachers",
      why4Desc: "Bridges home practice with classroom guidance without replacing teachers.",
      why5Title: "Clear, visible progress",
      why5Desc: "Clean mastery tracking shows students and parents real improvement every week.",

      // SECTION E — FINAL CALL TO ACTION
      ctaHeading: "Ready to start understanding maths?",
      ctaSubtitle: "Free for students. No email or phone number needed to get started.",
      ctaStudentBtn: "Start learning as student",
      ctaTeacherBtn: "Set up teacher class",
      ctaStudentSub: "Instant access with your name · Follows NCERT 2024–26",
      ctaTeacherSub: "Create a class and share a simple code with students",
    },
    hi: {
      appName: "मार्गम्",
      tagline: "कक्षा 6–10 के लिए अनुकूली गणित",
      h1: "कक्षा 10 के गणित में अटक रहे हैं? इसकी शुरुआत शायद कक्षा 7 में हुई थी।",
      subline:
        "मार्गम् उस पुरानी कमी को खोजता है जो छूट गई थी—जैसे द्विघात समीकरण की गलतियों के पीछे छिपे पूर्णांकों के चिह्न—और उसे सुधारने का मार्ग दिखाता है। एनसीईआरटी कक्षा 6-10, अंग्रेजी, हिन्दी और తెలుగు में।",
      studentLabel: "STUDENT",
      studentTitle: "मैं एक विद्यार्थी हूँ",
      studentBody:
        "एक संक्षिप्त जांच परीक्षा दें, अपनी समझ का मानचित्र देखें, और एक-एक छोटे कदम के साथ कमियों को दूर करें। किसी ईमेल या फ़ोन नंबर की आवश्यकता नहीं है।",
      studentBtn: "सीखना शुरू करें",
      studentSignIn: "पहले से खाता है? साइन इन करें",
      teacherLabel: "TEACHER",
      teacherTitle: "मैं एक शिक्षक हूँ",
      teacherBody:
        "कक्षा बनाएं, कोड साझा करें, और देखें कि आपके विद्यार्थी वास्तव में किन पुराने विषयों में कठिनाई महसूस कर रहे हैं।",
      teacherBtn: "मेरी कक्षा सेट करें",
      teacherSignIn: "पहले से पंजीकृत हैं? साइन इन करें",
      trustLine: "एनसीईआरटी 2024–26 पर आधारित · कोई ट्रैकर नहीं · ईमेल की आवश्यकता नहीं",

      // SECTION A — HOW MARGAM WORKS
      howItWorksHeading: "वह सीख जो समझती है कि आपको कहाँ मदद चाहिए।",
      howItWorksBadge: "सफलता के 5 सरल कदम",
      howItWorksSubtitle: "पहली जांच से लेकर विषय में पूरी समझ तक पाँच आसान चरण।",
      step1Title: "1. अपनी कक्षा चुनें",
      step1Desc: "कक्षा 6 से 10 में से अपनी कक्षा चुनें और अपने एनसीईआरटी गणित पाठ देखें।",
      step2Title: "2. अपनी कमियों को पहचानें",
      step2Desc: "एक छोटी सी जांच पुरानी कक्षाओं के छूटे हुए विषयों को खोजती है—बिना किसी परीक्षा के दबाव के।",
      step3Title: "3. सरल पाठों से समझें",
      step3Desc: "स्पष्ट उदाहरणों और चित्रों के साथ छोटे, क्रमबद्ध पाठ पढ़कर अवधारणाओं को समझें।",
      step4Title: "4. अपनी समझ के अनुसार अभ्यास करें",
      step4Desc: "ऐसे प्रश्न हल करें जो आपके स्तर से मेल खाते हैं, ताकि अभ्यास आसान और उत्साहवर्धक लगे।",
      step5Title: "5. अपनी प्रगति देखें",
      step5Desc: "मास्टर किए गए विषयों को बढ़ते देखें और स्कूल की परीक्षाओं के लिए मजबूत नींव बनाएं।",

      // SECTION B — LEARNING THAT ADAPTS TO YOU
      adaptiveHeading: "सीखने का ऐसा तरीका जो आपके अनुसार बदलता है",
      adaptiveBadge: "अनुकूली शिक्षण",
      adaptiveSubtitle: "गणित एक मीनार की तरह है। यदि नीचे का कोई ब्लॉक कमजोर हो, तो ऊपर की कक्षाएं कठिन लगती हैं।",
      adaptivePoint1Title: "कठिन विषयों की समय पर पहचान",
      adaptivePoint1Desc: "यह केवल नंबर नहीं देता, बल्कि ठीक वही विषय पहचानता है जहाँ समझने में कठिनाई हो रही है।",
      adaptivePoint2Title: "गलतियों के पैटर्न को समझना",
      adaptivePoint2Desc: "यह समझता है कि गलती किस वजह से हुई—चिह्नों की भूल, सूत्र में उलझन या गणना की चूक।",
      adaptivePoint3Title: "बुनियादी विषयों पर वापसी",
      adaptivePoint3Desc: "वर्तमान पाठ को आसान बनाने के लिए पिछली कक्षाओं के जरूरी नियमों को फिर से सिखाता है।",
      adaptivePoint4Title: "आपकी गति के अनुसार अभ्यास",
      adaptivePoint4Desc: "जैसे-जैसे समझ बढ़ती है, प्रश्नों का स्तर स्वाभाविक रूप से आगे बढ़ता है।",
      adaptivePoint5Title: "आत्मविश्वास में वृद्धि",
      adaptivePoint5Desc: "बिना किसी डर या दबाव के, छोटे-छोटे कदमों से गणित में महारत हासिल करें।",

      // SECTION C — BUILT FOR TEACHERS TOO
      teachersHeading: "शिक्षकों के लिए भी तैयार",
      teachersBadge: "शिक्षक साधन",
      teachersSubtitle: "मार्गम् कक्षा शिक्षण का साथी है, यह शिक्षकों की जगह नहीं लेता बल्कि उनकी मदद करता है।",
      teacherFeat1Title: "विद्यार्थियों की प्रगति देखें",
      teacherFeat1Desc: "कक्षा के सभी छात्रों की पाठ प्रगति और अभ्यास रिपोर्ट एक जगह देखें।",
      teacherFeat2Title: "कक्षा की आम कमियों को पहचानें",
      teacherFeat2Desc: "देखें कि पिछली कक्षाओं के किन विषयों में पूरी कक्षा को अधिक सहायता चाहिए।",
      teacherFeat3Title: "प्रत्येक छात्र की जरूरत समझें",
      teacherFeat3Desc: "हर छात्र की सटीकता और गलतियों को देखकर व्यक्तिगत मार्गदर्शन दें।",
      teacherFeat4Title: "कक्षा शिक्षण को मजबूती दें",
      teacherFeat4Desc: "जांच से मिली जानकारी का उपयोग करके कक्षा में जरूरी विषयों का दोहराव कराएं।",
      teacherCtaBtn: "शिक्षक दृश्य देखें",

      // SECTION D — WHY MARGAM?
      whyHeading: "मार्गम् ही क्यों?",
      whyBadge: "हमारा उद्देश्य",
      whySubtitle: "भारतीय स्कूली छात्रों के लिए विशेष रूप से बनाया गया सीखने का मंच।",
      why1Title: "कक्षा 6–10 के लिए उपयुक्त",
      why1Desc: "मध्य और माध्यमिक कक्षाओं के एनसीईआरटी गणित पाठ्यक्रम पर पूरी तरह आधारित।",
      why2Title: "रटने के बजाय समझ पर ज़ोर",
      why2Desc: "केवल उत्तर निकालने के बजाय यह समझाता है कि सूत्र कैसे काम करते हैं।",
      why3Title: "छिपी हुई कमियों की खोज",
      why3Desc: "कक्षा 10 की कठिनाइयों को कक्षा 6 से 8 की बुनियाद से जोड़कर सुधारता है।",
      why4Title: "छात्रों और शिक्षकों दोनों का साथी",
      why4Desc: "घर पर अभ्यास और कक्षा की पढ़ाई के बीच एक सरल पुल बनाता है।",
      why5Title: "स्पष्ट और पारदर्शी प्रगति",
      why5Desc: "साफ रिपोर्ट से छात्रों को हर सप्ताह अपनी समझ में सुधार दिखाई देता है।",

      // SECTION E — FINAL CALL TO ACTION
      ctaHeading: "गणित को गहराई से समझने के लिए तैयार हैं?",
      ctaSubtitle: "छात्रों के लिए पूरी तरह निःशुल्क। शुरू करने के लिए किसी ईमेल या फ़ोन नंबर की जरूरत नहीं।",
      ctaStudentBtn: "छात्र के रूप में सीखना शुरू करें",
      ctaTeacherBtn: "शिक्षक कक्षा बनाएं",
      ctaStudentSub: "अपने नाम से तुरंत प्रवेश करें · एनसीईआरटी 2024–26 के अनुसार",
      ctaTeacherSub: "कक्षा बनाएं और विद्यार्थियों के साथ सरल कोड साझा करें",
    },
    te: {
      appName: "మార్గం",
      tagline: "6–10 తరగతుల అనుకూల గణితం",
      h1: "10వ తరగతి లెక్కల్లో ఇబ్బంది పడుతున్నారా? అది బహుశా 7వ తరగతిలోనే మొదలై ఉండవచ్చు.",
      subline:
        "మార్గం మీరు గతంలో తప్పిపోయిన పునాది అంశాన్ని గుర్తిస్తుంది—ఉదాహరణకు వర్గ సమీకరణాల తప్పుల వెనుక దాగి ఉన్న పూర్ణ సంఖ్యల సంకేత నియమాలు—మరియు దానిని సరిదిద్దేందుకు మార్గదర్శనం చేస్తుంది. NCERT 6-10 తరగతులు, English, हिन्दी మరియు తెలుగులో.",
      studentLabel: "STUDENT",
      studentTitle: "నేను విద్యార్థిని",
      studentBody:
        "ఒక చిన్న రోగనిర్ధారణ పరీక్ష రాయండి, మీకు తెలిసిన అంశాల పటాన్ని చూడండి, మరియు చిన్న చిన్న దశల్లో లోపాలను సరిదిద్దండి. ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      studentBtn: "నేర్చుకోవడం ప్రారంభించండి",
      studentSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
      teacherLabel: "TEACHER",
      teacherTitle: "నేను ఉపాధ్యాయుడిని",
      teacherBody:
        "తరగతిని సృష్టించండి, కోడ్‌ను పంచుకోండి, మరియు మీ విద్యార్థులు గతంలోని ఏ పునాది అంశాలలో వెనుకబడ్డారో చూడండి.",
      teacherBtn: "నా తరగతిని సిద్ధం చేయండి",
      teacherSignIn: "ఇప్పటికే నమోదు చేసుకున్నారా? సైన్ ఇన్ చేయండి",
      trustLine: "NCERT 2024–26 ఆధారంగా · ట్రాకర్లు లేవు · ఈమెయిల్ అవసరం లేదు",

      // SECTION A — HOW MARGAM WORKS
      howItWorksHeading: "మీకు ఎక్కడ సహాయం కావాలో అర్థం చేసుకునే అభ్యాసం.",
      howItWorksBadge: "విశ్వాసానికి 5 సులభమైన దశలు",
      howItWorksSubtitle: "మొదటి చిన్న పరిశీలన నుండి పూర్తి అవగాహన వరకు 5 సాధారణ దశలు.",
      step1Title: "1. మీ తరగతిని ఎంచుకోండి",
      step1Desc: "మీ NCERT గణిత అధ్యాయాలను చూడటానికి 6 నుండి 10 తరగతులలో మీ తరగతిని ఎంచుకోండి.",
      step2Title: "2. మీ అభ్యసన లోపాలను గుర్తించండి",
      step2Desc: "ఎటువంటి పరీక్ష ఒత్తిడి లేకుండా, గత తరగతులలో తప్పిపోయిన పునాది అంశాలను చిన్న పరిశీలన ద్వారా గుర్తిస్తుంది.",
      step3Title: "3. మార్గదర్శక పాఠాల ద్వారా నేర్చుకోండి",
      step3Desc: "స్పష్టమైన ఉదాహరణలు మరియు వివరణలతో కూడిన చిన్న పాఠాల ద్వారా అంశాలను సులభంగా అర్థం చేసుకోండి.",
      step4Title: "4. మీ అవగాహనకు తగినట్లు అభ్యాసం చేయండి",
      step4Desc: "మీ స్థాయికి సరిపోయే ప్రశ్నలను సాధన చేయండి, తద్వారా సాధన సులభంగా మరియు ఉత్సాహంగా ఉంటుంది.",
      step5Title: "5. మీ ప్రగతిని పరిశీలించండి",
      step5Desc: "మీరు పూర్తి చేసిన అంశాలను చూస్తూ, పాఠశాల పరీక్షలకు బలమైన పునాదిని నిర్మించుకోండి.",

      // SECTION B — LEARNING THAT ADAPTS TO YOU
      adaptiveHeading: "మీ స్థాయికి అనుగుణంగా మారే అభ్యాసం",
      adaptiveBadge: "అనుకూల అభ్యాసం",
      adaptiveSubtitle: "గణితం ఒక భవనం లాంటిది. పునాది రాయి బలహీనంగా ఉంటే, పై తరగతులు కష్టంగా అనిపిస్తాయి.",
      adaptivePoint1Title: "కష్టమైన అంశాలను త్వరగా గుర్తిస్తుంది",
      adaptivePoint1Desc: "కేవలం మార్కులు మాత్రమే కాకుండా, ఏ భావనలో ఇబ్బంది ఉందో సరిగ్గా గుర్తిస్తుంది.",
      adaptivePoint2Title: "తప్పుల తీరును అర్థం చేసుకుంటుంది",
      adaptivePoint2Desc: "తప్పు ఎందుకు జరిగిందో విశ్లేషిస్తుంది—గుర్తుల గందరగోళమా, సూత్రాల లోపమా లేదా గణన తప్పిదమా.",
      adaptivePoint3Title: "పునాది అంశాలను తిరిగి గుర్తుచేస్తుంది",
      adaptivePoint3Desc: "ప్రస్తుత పాఠాన్ని అర్థం చేసుకోవడానికి అవసరమైన పాత తరగతుల పునాదులను సరిదిద్దుతుంది.",
      adaptivePoint4Title: "మీ వేగానికి తగిన అభ్యాసం",
      adaptivePoint4Desc: "మీ అవగాహన పెరిగే కొద్దీ ప్రశ్నల స్థాయి కూడా క్రమంగా పెరుగుతుంది.",
      adaptivePoint5Title: "నిజమైన ఆత్మవిశ్వాసం",
      adaptivePoint5Desc: "ఎటువంటి భయం లేకుండా, చిన్న చిన్న దశల్లో గణితంలో పట్టు సాధించవచ్చు.",

      // SECTION C — BUILT FOR TEACHERS TOO
      teachersHeading: "ఉపాధ్యాయుల కోసం కూడా రూపొందించబడింది",
      teachersBadge: "ఉపాధ్యాయ సాధనాలు",
      teachersSubtitle: "మార్గం తరగతి గది బోధనకు సహకరిస్తుంది, ఇది ఉపాధ్యాయుల స్థానాన్ని భర్తీ చేయదు.",
      teacherFeat1Title: "విద్యార్థుల ప్రగతిని పరిశీలించండి",
      teacherFeat1Desc: "తరగతి విద్యార్థులందరి పాఠాల ప్రగతి మరియు అభ్యాస నివేదికలను ఒకే చోట చూడండి.",
      teacherFeat2Title: "తరగతిలోని సాధారణ లోపాలను గుర్తించండి",
      teacherFeat2Desc: "పాత తరగతుల ఏ పునాది అంశాలలో విద్యార్థులకు మరింత సహాయం కావాలో తెలుసుకోండి.",
      teacherFeat3Title: "ప్రతి విద్యార్థి అవసరాన్ని అర్థం చేసుకోండి",
      teacherFeat3Desc: "విద్యార్థుల కచ్చితత్వం మరియు తప్పులను చూసి వ్యక్తిగతంగా మార్గదర్శనం చేయండి.",
      teacherFeat4Title: "తరగతి బోధనకు బలాన్ని ఇవ్వండి",
      teacherFeat4Desc: "ఈ సమాచారాన్ని ఉపయోగించి తరగతిలో అవసరమైన అంశాలను తిరిగి బోధించండి.",
      teacherCtaBtn: "ఉపాధ్యాయ సాధనాలు చూడండి",

      // SECTION D — WHY MARGAM?
      whyHeading: "ఎందుకు మార్గం?",
      whyBadge: "మా లక్ష్యం",
      whySubtitle: "భారతీయ పాఠశాల విద్యార్థుల కోసం ప్రత్యేకంగా రూపొందించబడిన అభ్యాస వేదిక.",
      why1Title: "6–10 తరగతులకు ప్రత్యేకం",
      why1Desc: "మిడిల్ మరియు హైస్కూల్ NCERT గణిత సిలబస్‌కు అనుగుణంగా రూపొందించబడింది.",
      why2Title: "బట్టీ పట్టడం కంటే అవగాహన ముఖ్యం",
      why2Desc: "కేవలం లెక్కలు చేయడం కాకుండా, సూత్రాలు ఎలా పనిచేస్తాయో స్పష్టంగా వివరిస్తుంది.",
      why3Title: "దాగి ఉన్న పునాది లోపాలను సరిచేస్తుంది",
      why3Desc: "10వ తరగతి ఇబ్బందులను 6 నుండి 8 తరగతుల పునాదులతో జోడించి సరిదిద్దుతుంది.",
      why4Title: "విద్యార్థులు మరియు ఉపాధ్యాయులకు తోడుగా",
      why4Desc: "ఇంటి వద్ద అభ్యాసానికి మరియు తరగతి గది బోధనకు మధ్య వారధిగా నిలుస్తుంది.",
      why5Title: "స్పష్టమైన ప్రగతి దర్శనం",
      why5Desc: "సులభమైన నివేదికల ద్వారా ప్రతి వారం మీ అవగాహన మెరుగుపడటాన్ని స్పష్టంగా చూడవచ్చు.",

      // SECTION E — FINAL CALL TO ACTION
      ctaHeading: "గణితాన్ని లోతుగా నేర్చుకోవడానికి సిద్ధంగా ఉన్నారా?",
      ctaSubtitle: "విద్యార్థులకు ఉచితం. ప్రారంభించడానికి ఈమెయిల్ లేదా ఫోన్ నంబర్ అవసరం లేదు.",
      ctaStudentBtn: "విద్యార్థిగా నేర్చుకోవడం ప్రారంభించండి",
      ctaTeacherBtn: "ఉపాధ్యాయ తరగతిని సిద్ధం చేయండి",
      ctaStudentSub: "మీ పేరుతో వెంటనే ప్రవేశించండి · NCERT 2024–26 ఆధారంగా",
      ctaTeacherSub: "తరగతిని సృష్టించండి మరియు విద్యార్థులతో కోడ్‌ను పంచుకోండి",
    },
  }[currentLang];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
        <div className="p-6 border-[3px] border-[#2B1B0F] bg-[#D9B87A]/90 shadow-[4px_4px_0px_#2B1B0F] text-center text-[#2B1B0F]">
          <p className="font-heading font-extrabold text-base text-[#2B1B0F] animate-pulse">
            Loading Margam...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#2B1B0F] flex flex-col justify-between">
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* Unified Responsive Navigation */}
      <Navigation
        currentTab="home"
        currentLang={currentLang as SupportedLanguage}
        onLanguageChange={(lang) => setCurrentLang(lang as Language)}
        profile={profile}
      />

      {/* Main Content Container: Fluid padding, centered max-w-[1200px], safe-area bottom */}
      <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-12 md:pl-28 lg:pl-8 pb-16 flex-1 w-full">
        {/* ================================================================= */}
        {/* 1. PRESERVED HERO SECTION (Exactly As Required)                   */}
        {/* ================================================================= */}
        <section aria-labelledby="hero-heading" className="space-y-10 sm:space-y-12 py-4 sm:py-8">
          {/* Hero Section: Learning Companion Mascot + H1 + Subline */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            <div className="shrink-0 mb-3 sm:mb-5 flex flex-col items-center">
              <div className="block sm:hidden">
                <Companion
                  pose={isIstNightTime() ? "sleepy" : "greet"}
                  size={160}
                  withShadow={true}
                  sticker={false}
                  alt="Margam learning companion"
                />
              </div>
              <div className="hidden sm:block">
                <Companion
                  pose={isIstNightTime() ? "sleepy" : "greet"}
                  size={210}
                  withShadow={true}
                  sticker={false}
                  alt="Margam learning companion"
                />
              </div>
            </div>

            <h1
              id="hero-heading"
              className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-[#1E1610] leading-tight max-w-[22ch] drop-shadow-[1px_1px_0px_#FFE9A8]"
            >
              {copy.h1}
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#2B1B0F] max-w-[65ch] leading-relaxed">
              {copy.subline}
            </p>
          </div>

          {/* Two Role Cards: Student & Teacher (side by side on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            {/* Card 1: Student */}
            <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 border-t-[5px] border-t-[#6DB33F]">
              <div className="space-y-3">
                <span className="font-pixel text-[11px] uppercase tracking-wider text-[#5DAA3A] block">
                  {copy.studentLabel}
                </span>
                <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                  {copy.studentTitle}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                  {copy.studentBody}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={profile ? "/student" : "/login?role=student"}
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                >
                  <span>{profile ? (currentLang === "hi" ? "विद्यार्थी डैशबोर्ड पर जाएं" : currentLang === "te" ? "విద్యార్థి హోమ్‌కు వెళ్లండి" : "Go to student home") : copy.studentBtn}</span>
                  <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
                </Link>

                <div className="text-center">
                  <Link
                    href={profile ? "/student" : "/login?role=student"}
                    className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                  >
                    {profile ? (currentLang === "hi" ? "पहले से साइन इन हैं" : currentLang === "te" ? "ఇప్పటికే సైన్ ఇన్ అయ్యారు" : "Already signed in") : copy.studentSignIn}
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Teacher */}
            <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 border-t-[5px] border-t-[#3FA7C9]">
              <div className="space-y-3">
                <span className="font-pixel text-[11px] uppercase tracking-wider text-[#3FA7C9] block">
                  {copy.teacherLabel}
                </span>
                <h2 className="font-heading font-bold text-2xl text-[#2B1B0F]">
                  {copy.teacherTitle}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/85 leading-relaxed">
                  {copy.teacherBody}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/login?role=teacher"
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] text-[#2B1B0F] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                >
                  <span>{copy.teacherBtn}</span>
                  <ArrowRight className="w-5 h-5 ml-2 text-[#2B1B0F]" />
                </Link>

                <div className="text-center">
                  <Link
                    href="/login?role=teacher"
                    className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                  >
                    {copy.teacherSignIn}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Line Below Cards */}
          <div className="text-center pt-2 pb-4">
            <p className="font-sans text-sm text-[#5A3720] max-w-none">
              {copy.trustLine}
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION A — HOW MARGAM WORKS                                      */}
        {/* ================================================================= */}
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="space-y-8 pt-8 sm:pt-12 border-t-2 border-[#7A4B2A]/30">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-pixel text-[11px] uppercase tracking-wider px-3 py-1 bg-[#6DB33F]/20 text-[#2B1B0F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] inline-block">
              {copy.howItWorksBadge}
            </span>
            <h2
              id="how-it-works-heading"
              className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1E1610] leading-snug drop-shadow-[1px_1px_0px_#FFE9A8]"
            >
              {copy.howItWorksHeading}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#2B1B0F] leading-relaxed">
              {copy.howItWorksSubtitle}
            </p>
          </div>

          {/* 5 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
            {/* Step 1 */}
            <div className="panel-plank p-4 sm:p-5 flex flex-col justify-between space-y-3 border-t-[4px] border-t-[#6DB33F]">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#6DB33F] text-[#1E1610] font-heading font-extrabold text-xs border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]">
                  01
                </div>
                <h3 className="font-heading font-bold text-base text-[#1E1610] leading-snug">
                  {copy.step1Title}
                </h3>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed">
                  {copy.step1Desc}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="panel-plank p-4 sm:p-5 flex flex-col justify-between space-y-3 border-t-[4px] border-t-[#F2C230]">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#F2C230] text-[#1E1610] font-heading font-extrabold text-xs border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]">
                  02
                </div>
                <h3 className="font-heading font-bold text-base text-[#1E1610] leading-snug">
                  {copy.step2Title}
                </h3>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed">
                  {copy.step2Desc}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="panel-plank p-4 sm:p-5 flex flex-col justify-between space-y-3 border-t-[4px] border-t-[#78BDE8]">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#78BDE8] text-[#1E1610] font-heading font-extrabold text-xs border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]">
                  03
                </div>
                <h3 className="font-heading font-bold text-base text-[#1E1610] leading-snug">
                  {copy.step3Title}
                </h3>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed">
                  {copy.step3Desc}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="panel-plank p-4 sm:p-5 flex flex-col justify-between space-y-3 border-t-[4px] border-t-[#5DAA3A]">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#5DAA3A] text-[#1E1610] font-heading font-extrabold text-xs border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]">
                  04
                </div>
                <h3 className="font-heading font-bold text-base text-[#1E1610] leading-snug">
                  {copy.step4Title}
                </h3>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed">
                  {copy.step4Desc}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="panel-plank p-4 sm:p-5 flex flex-col justify-between space-y-3 border-t-[4px] border-t-[#D9B87A]">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#E8CF9C] text-[#1E1610] font-heading font-extrabold text-xs border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]">
                  05
                </div>
                <h3 className="font-heading font-bold text-base text-[#1E1610] leading-snug">
                  {copy.step5Title}
                </h3>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed">
                  {copy.step5Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION B — LEARNING THAT ADAPTS TO YOU                           */}
        {/* ================================================================= */}
        <section id="adaptive-learning" aria-labelledby="adaptive-heading" className="space-y-8 pt-8 sm:pt-12 border-t-2 border-[#7A4B2A]/30">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-pixel text-[11px] uppercase tracking-wider px-3 py-1 bg-[#F2C230]/20 text-[#2B1B0F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] inline-block">
              {copy.adaptiveBadge}
            </span>
            <h2
              id="adaptive-heading"
              className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1E1610] leading-snug drop-shadow-[1px_1px_0px_#FFE9A8]"
            >
              {copy.adaptiveHeading}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#2B1B0F] leading-relaxed">
              {copy.adaptiveSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Point 1 */}
            <div className="panel-plank p-5 space-y-2.5 border-l-[6px] border-l-[#F2C230]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F2C230] border border-[#1E1610] inline-block" />
                <h3 className="font-heading font-bold text-base text-[#1E1610]">
                  {copy.adaptivePoint1Title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.adaptivePoint1Desc}
              </p>
            </div>

            {/* Point 2 */}
            <div className="panel-plank p-5 space-y-2.5 border-l-[6px] border-l-[#6DB33F]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#6DB33F] border border-[#1E1610] inline-block" />
                <h3 className="font-heading font-bold text-base text-[#1E1610]">
                  {copy.adaptivePoint2Title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.adaptivePoint2Desc}
              </p>
            </div>

            {/* Point 3 */}
            <div className="panel-plank p-5 space-y-2.5 border-l-[6px] border-l-[#78BDE8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#78BDE8] border border-[#1E1610] inline-block" />
                <h3 className="font-heading font-bold text-base text-[#1E1610]">
                  {copy.adaptivePoint3Title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.adaptivePoint3Desc}
              </p>
            </div>

            {/* Point 4 */}
            <div className="panel-plank p-5 space-y-2.5 border-l-[6px] border-l-[#5DAA3A]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#5DAA3A] border border-[#1E1610] inline-block" />
                <h3 className="font-heading font-bold text-base text-[#1E1610]">
                  {copy.adaptivePoint4Title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.adaptivePoint4Desc}
              </p>
            </div>

            {/* Point 5 */}
            <div className="panel-plank p-5 space-y-2.5 border-l-[6px] border-l-[#D9B87A] md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#D9B87A] border border-[#1E1610] inline-block" />
                <h3 className="font-heading font-bold text-base text-[#1E1610]">
                  {copy.adaptivePoint5Title}
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.adaptivePoint5Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION C — BUILT FOR TEACHERS TOO                                */}
        {/* ================================================================= */}
        <section id="for-teachers" aria-labelledby="teachers-heading" className="space-y-8 pt-8 sm:pt-12 border-t-2 border-[#7A4B2A]/30">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-pixel text-[11px] uppercase tracking-wider px-3 py-1 bg-[#3FA7C9]/20 text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] inline-block">
              {copy.teachersBadge}
            </span>
            <h2
              id="teachers-heading"
              className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1E1610] leading-snug drop-shadow-[1px_1px_0px_#FFE9A8]"
            >
              {copy.teachersHeading}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#2B1B0F] leading-relaxed">
              {copy.teachersSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Teacher Feature 1 */}
            <div className="panel-plank p-5 space-y-2 border-t-[4px] border-t-[#3FA7C9]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.teacherFeat1Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.teacherFeat1Desc}
              </p>
            </div>

            {/* Teacher Feature 2 */}
            <div className="panel-plank p-5 space-y-2 border-t-[4px] border-t-[#3FA7C9]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.teacherFeat2Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.teacherFeat2Desc}
              </p>
            </div>

            {/* Teacher Feature 3 */}
            <div className="panel-plank p-5 space-y-2 border-t-[4px] border-t-[#3FA7C9]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.teacherFeat3Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.teacherFeat3Desc}
              </p>
            </div>

            {/* Teacher Feature 4 */}
            <div className="panel-plank p-5 space-y-2 border-t-[4px] border-t-[#3FA7C9]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.teacherFeat4Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.teacherFeat4Desc}
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login?role=teacher"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] font-heading font-extrabold text-sm border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] transition-all no-underline"
            >
              <span>{copy.teacherCtaBtn}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION D — WHY MARGAM?                                           */}
        {/* ================================================================= */}
        <section id="why-margam" aria-labelledby="why-heading" className="space-y-8 pt-8 sm:pt-12 border-t-2 border-[#7A4B2A]/30">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-pixel text-[11px] uppercase tracking-wider px-3 py-1 bg-[#8B5A2B]/20 text-[#2B1B0F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] inline-block">
              {copy.whyBadge}
            </span>
            <h2
              id="why-heading"
              className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1E1610] leading-snug drop-shadow-[1px_1px_0px_#FFE9A8]"
            >
              {copy.whyHeading}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#2B1B0F] leading-relaxed">
              {copy.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Point 1 */}
            <div className="panel-stone p-5 space-y-2 border-t-[4px] border-t-[#6DB33F]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.why1Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.why1Desc}
              </p>
            </div>

            {/* Point 2 */}
            <div className="panel-stone p-5 space-y-2 border-t-[4px] border-t-[#6DB33F]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.why2Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.why2Desc}
              </p>
            </div>

            {/* Point 3 */}
            <div className="panel-stone p-5 space-y-2 border-t-[4px] border-t-[#6DB33F]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.why3Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.why3Desc}
              </p>
            </div>

            {/* Point 4 */}
            <div className="panel-stone p-5 space-y-2 border-t-[4px] border-t-[#6DB33F]">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.why4Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.why4Desc}
              </p>
            </div>

            {/* Point 5 */}
            <div className="panel-stone p-5 space-y-2 border-t-[4px] border-t-[#6DB33F] sm:col-span-2 lg:col-span-2">
              <h3 className="font-heading font-bold text-base text-[#1E1610]">
                {copy.why5Title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed">
                {copy.why5Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION E — FINAL CALL TO ACTION                                  */}
        {/* ================================================================= */}
        <section id="get-started" aria-labelledby="cta-heading" className="max-w-4xl mx-auto my-8 sm:my-12 p-6 sm:p-10 panel-night border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-[2px] text-center space-y-6">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2
              id="cta-heading"
              className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFE9A8] leading-snug drop-shadow-[2px_2px_0px_#1E1610]"
            >
              {copy.ctaHeading}
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#F3E3BC] leading-relaxed">
              {copy.ctaSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
            {/* Student CTA */}
            <div className="space-y-2">
              <Link
                href={profile ? "/student" : "/login?role=student"}
                className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 bg-[#5DAA3A] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-extrabold text-base border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] transition-all no-underline"
              >
                <span>{profile ? (currentLang === "hi" ? "विद्यार्थी डैशबोर्ड पर जाएं" : currentLang === "te" ? "విద్యార్థి హోమ్‌కు వెళ్లండి" : "Go to student home") : copy.ctaStudentBtn}</span>
                <ArrowRight className="w-5 h-5 ml-2 text-[#1E1610]" />
              </Link>
              <p className="text-[11px] text-[#E5D7BE]">
                {copy.ctaStudentSub}
              </p>
            </div>

            {/* Teacher CTA */}
            <div className="space-y-2">
              <Link
                href="/login?role=teacher"
                className="w-full inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] font-heading font-extrabold text-base border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] transition-all no-underline"
              >
                <span>{copy.ctaTeacherBtn}</span>
                <ArrowRight className="w-5 h-5 ml-2 text-[#1E1610]" />
              </Link>
              <p className="text-[11px] text-[#E5D7BE]">
                {copy.ctaTeacherSub}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Slim Brown Ground-Strip Footer */}
      <Footer />
    </div>
  );
}
