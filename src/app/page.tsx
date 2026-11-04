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
import { ArrowRight } from "lucide-react";
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

  // Multilingual copy for landing page
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

      // Section A: How Margam Works
      howItWorksHeading: "Learning that understands where you need help.",
      howItWorksBadge: "5 STEPS TO CONFIDENCE",
      howItWorksSubtitle: "Follow five simple steps from your first check to full topic mastery.",
      step1Title: "Choose your class",
      step1Desc: "Select your grade from Class 6 to 10 to see your NCERT maths chapters.",
      step2Title: "Find your learning gaps",
      step2Desc: "A short check finds missing foundation topics from earlier grades without penalty.",
      step3Title: "Learn concepts through guided lessons",
      step3Desc: "Read simple step-by-step lessons with clear examples and helpful diagrams.",
      step4Title: "Practise with questions adapted to your understanding",
      step4Desc: "Solve questions that match your level so practice feels encouraging and safe.",
      step5Title: "Track your progress and improvement",
      step5Desc: "See your mastered topics grow and build lasting confidence for exams.",

      // Section B: Learning that Adapts to You
      adaptiveHeading: "Learning that adapts to you",
      adaptiveSubtitle: "Maths builds like a block tower. When an early block is loose, later topics feel hard.",
      adaptivePoint1Title: "Finds difficult topics early",
      adaptivePoint1Desc: "Margam spots where you struggle and traces it back to the missing foundation.",
      adaptivePoint2Title: "Understands mistake patterns",
      adaptivePoint2Desc: "Instead of just marking wrong, it recognizes common student misconceptions.",
      adaptivePoint3Title: "Revisits foundational concepts",
      adaptivePoint3Desc: "Guides you back to previous grade topics needed for your current chapter.",
      adaptivePoint4Title: "Adapts practice to your pace",
      adaptivePoint4Desc: "Questions match your current understanding so learning stays calm and steady.",
      adaptivePoint5Title: "Builds lasting confidence",
      adaptivePoint5Desc: "Every repaired foundation helps you understand high school maths with clarity.",

      // Section C: Built for Teachers Too
      teachersHeading: "Built for teachers too",
      teachersSubtitle: "Margam supports teachers in the classroom. It does not replace them.",
      teacherFeat1Title: "Monitor student progress",
      teacherFeat1Desc: "View your class roster, lesson completions, and chapter practice in one clear view.",
      teacherFeat2Title: "Identify common learning gaps",
      teacherFeat2Desc: "Discover which prerequisite skills from earlier grades the whole class finds difficult.",
      teacherFeat3Title: "Understand individual needs",
      teacherFeat3Desc: "Review specific mistake tags and accuracy rates for each student privately.",
      teacherFeat4Title: "Support classroom teaching",
      teacherFeat4Desc: "Use learning insights to plan targeted revisions and help every student succeed.",
      teacherCtaBtn: "Explore Teacher Tools",

      // Section D: Why Margam?
      whyHeading: "Why Margam?",
      whySubtitle: "A focused learning space built for Indian school students.",
      why1Title: "Built for Classes 6–10",
      why1Desc: "Strictly aligned with the NCERT Mathematics syllabus for middle and high school.",
      why2Title: "Understanding over memorising",
      why2Desc: "Focuses on why formulas work, not just rushing through question drills.",
      why3Title: "Finds hidden foundation gaps",
      why3Desc: "Traces Class 10 difficulties back to Class 6 to 8 building blocks.",
      why4Title: "Supports students and teachers",
      why4Desc: "Bridges home practice with classroom guidance without replacing teachers.",
      why5Title: "Clear, visible progress",
      why5Desc: "Clean mastery tracking shows students and parents real improvement every week.",

      // Section E: Final Call to Action
      ctaHeading: "Ready to start understanding maths?",
      ctaSubtitle: "Free for students. No phone number or email required.",
      ctaStudentBtn: "Start learning as student",
      ctaTeacherBtn: "Set up teacher class",
      ctaStudentSub: "Quick sign-in with your name · Instant access",
      ctaTeacherSub: "Create a class and share a simple code",
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

      // Section A: How Margam Works
      howItWorksHeading: "वह सीख जो समझती है कि आपको कहाँ मदद चाहिए।",
      howItWorksBadge: "सफलता के 5 सरल कदम",
      howItWorksSubtitle: "पहली जांच से लेकर विषय में पूरी महारत तक पाँच आसान चरण।",
      step1Title: "अपनी कक्षा चुनें",
      step1Desc: "अपने एनसीईआरटी पाठ्यक्रम को देखने के लिए कक्षा 6 से 10 में से अपनी कक्षा चुनें।",
      step2Title: "पुरानी कमियों को पहचानें",
      step2Desc: "एक छोटी जांच से जानें कि पिछली कक्षाओं के किन विषयों में सहायता चाहिए।",
      step3Title: "मार्गदर्शित पाठों से सीखें",
      step3Desc: "सरल भाषा और स्पष्ट उदाहरणों वाले पाठ पढ़कर विषय को गहराई से समझें।",
      step4Title: "अपनी समझ के अनुसार अभ्यास करें",
      step4Desc: "ऐसे प्रश्नों का अभ्यास करें जो आपकी गति के अनुसार बदलकर आत्मविश्वास बढ़ाते हैं।",
      step5Title: "अपनी प्रगति को ट्रैक करें",
      step5Desc: "अपनी पूरी की गई अवधारणाओं को देखें और परीक्षा के लिए तैयार रहें।",

      // Section B: Learning that Adapts to You
      adaptiveHeading: "आपकी समझ के अनुसार अनुकूली सीख",
      adaptiveSubtitle: "गणित ईंटों की मीनार जैसा है। जब नीचे की ईंट ढीली हो, तो ऊपर का काम कठिन लगता है।",
      adaptivePoint1Title: "कठिन विषयों की शीघ्र पहचान",
      adaptivePoint1Desc: "मार्गम् पहचानता है कि आप कहाँ अटक रहे हैं और उस पुरानी कमी को खोजता है।",
      adaptivePoint2Title: "गलतियों के पैटर्न को समझना",
      adaptivePoint2Desc: "केवल गलत बताने के बजाय, यह समझता है कि छात्र अक्सर कहाँ चूकते हैं।",
      adaptivePoint3Title: "बुनियादी विषयों को फिर से सीखना",
      adaptivePoint3Desc: "वर्तमान पाठ को सरल बनाने के लिए यह पिछली कक्षाओं के मुख्य पाठों पर ले जाता है।",
      adaptivePoint4Title: "आपकी गति के अनुकूल अभ्यास",
      adaptivePoint4Desc: "प्रश्न आपकी समझ के अनुसार आते हैं ताकि सीखना शांत और सहज रहे।",
      adaptivePoint5Title: "स्थायी आत्मविश्वास का निर्माण",
      adaptivePoint5Desc: "हर मजबूत बुनियाद आपको आगे के कठिन गणित को आसानी से समझने में मदद करती है।",

      // Section C: Built for Teachers Too
      teachersHeading: "शिक्षकों के लिए भी समर्पित",
      teachersSubtitle: "मार्गम् कक्षा में शिक्षक का साथी बनता है, उनकी जगह नहीं लेता।",
      teacherFeat1Title: "विद्यार्थियों की प्रगति देखें",
      teacherFeat1Desc: "कक्षा के सभी छात्रों की पाठ प्रगति और अभ्यास रिपोर्ट एक जगह देखें।",
      teacherFeat2Title: "कक्षा की आम कमियों को पहचानें",
      teacherFeat2Desc: "देखें कि पिछली कक्षाओं के किन विषयों में पूरी कक्षा को अधिक सहायता चाहिए।",
      teacherFeat3Title: "प्रत्येक छात्र की जरूरत समझें",
      teacherFeat3Desc: "हर छात्र की सटीकता और विशिष्ट गलतियों को निजी तौर पर देखें।",
      teacherFeat4Title: "कक्षा शिक्षण को मजबूती दें",
      teacherFeat4Desc: "इन जानकारियों की सहायता से उन विषयों पर विशेष ध्यान दें जहाँ छात्रों को जरूरत है।",
      teacherCtaBtn: "शिक्षक साधन देखें",

      // Section D: Why Margam?
      whyHeading: "मार्गम् ही क्यों?",
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
      why5Desc: "साफ रिपोर्ट से छात्रों और अभिभावकों को हर सप्ताह अपनी प्रगति दिखाई देती है।",

      // Section E: Final Call to Action
      ctaHeading: "गणित को गहराई से समझने के लिए तैयार हैं?",
      ctaSubtitle: "छात्रों के लिए पूरी तरह निःशुल्क। किसी फ़ोन या ईमेल की जरूरत नहीं।",
      ctaStudentBtn: "छात्र के रूप में सीखना शुरू करें",
      ctaTeacherBtn: "शिक्षक कक्षा बनाएं",
      ctaStudentSub: "अपने नाम से तुरंत प्रवेश करें · कोई पासवर्ड नहीं",
      ctaTeacherSub: "कक्षा बनाकर विद्यार्थियों के साथ सरल कोड साझा करें",
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

      // Section A: How Margam Works
      howItWorksHeading: "మీకు ఎక్కడ సహాయం కావాలో అర్థం చేసుకునే అభ్యాసం.",
      howItWorksBadge: "విజయానికి 5 సరళమైన దశలు",
      howItWorksSubtitle: "మొదటి చిన్న పరీక్ష నుండి అంశంపై పూర్తి పట్టు సాధించే వరకు ఐదు సులభమైన దశలు.",
      step1Title: "మీ తరగతిని ఎంచుకోండి",
      step1Desc: "మీ NCERT గణిత అధ్యాయాలను చూడటానికి 6 నుండి 10 తరగతులలో మీ తరగతిని ఎంచుకోండి.",
      step2Title: "పునాది లోపాలను గుర్తించండి",
      step2Desc: "గత తరగతుల్లో తప్పిపోయిన పునాది అంశాలను చిన్న పరీక్ష ద్వారా తెలుసుకోండి.",
      step3Title: "సులభమైన పాఠాల ద్వారా నేర్చుకోండి",
      step3Desc: "సరళమైన భాష, స్పష్టమైన ఉదాహరణలతో కాన్సెప్ట్‌లను క్షుణ్ణంగా అర్థం చేసుకోండి.",
      step4Title: "మీ స్థాయికి తగిన ప్రశ్నలతో సాధన చేయండి",
      step4Desc: "మీ అవగాహనకు అనుగుణంగా మారే ప్రశ్నలతో భయం లేకుండా సాధన చేయండి.",
      step5Title: "మీ పురోగతిని తెలుసుకోండి",
      step5Desc: "మీరు పూర్తి చేసిన కాన్సెప్ట్‌లను చూస్తూ పరీక్షల కోసం ఆత్మవిశ్వాసం పెంచుకోండి.",

      // Section B: Learning that Adapts to You
      adaptiveHeading: "మీ అవగాహనకు అనుగుణంగా మారే అభ్యాసం",
      adaptiveSubtitle: "గణితం ఒక ఇటుకల గోడ లాంటిది. కింద ఇటుక సరిగ్గా లేకపోతే పై పాఠాలు కష్టంగా అనిపిస్తాయి.",
      adaptivePoint1Title: "కష్టమైన అంశాలను త్వరగా గుర్తిస్తుంది",
      adaptivePoint1Desc: "మీరు ఎక్కడ ఇబ్బంది పడుతున్నారో గుర్తించి, వెనుక ఉన్న పునాది లోపాన్ని చూపుతుంది.",
      adaptivePoint2Title: "తప్పుల సరళిని అర్థం చేసుకుంటుంది",
      adaptivePoint2Desc: "కేవలం తప్పు అని చెప్పకుండా, విద్యార్థులు సాధారణంగా చేసే పొరపాట్లను గుర్తిస్తుంది.",
      adaptivePoint3Title: "పునాది కాన్సెప్ట్‌లను మళ్ళీ నేర్పుతుంది",
      adaptivePoint3Desc: "ప్రస్తుత అధ్యాయం సులభంగా అర్థం కావడానికి పాత తరగతుల పాఠాలను గుర్తుచేస్తుంది.",
      adaptivePoint4Title: "మీ వేగానికి తగిన అభ్యాసం",
      adaptivePoint4Desc: "మీ అవగాహనకు సరిపోయే ప్రశ్నలను అందిస్తూ నేర్చుకోవడాన్ని సులభతరం చేస్తుంది.",
      adaptivePoint5Title: "శాశ్వత ఆత్మవిశ్వాసాన్ని అందిస్తుంది",
      adaptivePoint5Desc: "ప్రతి పునాదిని సరిచేసుకోవడం ద్వారా ఉన్నత తరగతుల గణితం సులభంగా అర్థమవుతుంది.",

      // Section C: Built for Teachers Too
      teachersHeading: "ఉపాధ్యాయుల కోసం కూడా ప్రత్యేకం",
      teachersSubtitle: "మార్గం తరగతి గదిలో ఉపాధ్యాయులకు తోడ్పడుతుంది. వారికి ప్రత్యామ్నాయం కాదు.",
      teacherFeat1Title: "విద్యార్థుల పురోగతిని చూడండి",
      teacherFeat1Desc: "తరగతి విద్యార్థుల వివరాలు, పాఠాల పురోగతి మరియు సాధన నివేదికలను ఒకే చోట చూడండి.",
      teacherFeat2Title: "ఉమ్మడి లోపాలను గుర్తించండి",
      teacherFeat2Desc: "గత తరగతుల ఏ పునాది అంశాలలో విద్యార్థులు ఎక్కువగా ఇబ్బంది పడుతున్నారో తెలుసుకోండి.",
      teacherFeat3Title: "ప్రతి విద్యార్థి అవసరాలను అర్థం చేసుకోండి",
      teacherFeat3Desc: "ప్రతి విద్యార్థి తప్పుల తీరు మరియు ఖచ్చితత్వాన్ని వ్యక్తిగతంగా విశ్లేషించండి.",
      teacherFeat4Title: "తరగతి బోధనకు తోడ్పడండి",
      teacherFeat4Desc: "ఈ వివరాల ఆధారంగా విద్యార్థులకు అవసరమైన అంశాలపై ప్రత్యేక శ్రద్ధ పెట్టండి.",
      teacherCtaBtn: "ఉపాధ్యాయ సాధనాలను చూడండి",

      // Section D: Why Margam?
      whyHeading: "మార్గం ఎందుకు?",
      whySubtitle: "భారతీయ పాఠశాల విద్యార్థుల కోసం ప్రత్యేకంగా రూపొందించిన అభ్యాస వేదిక.",
      why1Title: "6–10 తరగతులకు ప్రత్యేకం",
      why1Desc: "NCERT గణిత సిలబస్‌కు అనుగుణంగా పూర్తి అధ్యాయాల పాఠాలు.",
      why2Title: "బట్టీ పట్టడం కాకుండా అవగాహన",
      why2Desc: "సూత్రాలు ఎలా పని చేస్తాయో అర్థం చేసుకుంటూ సమస్యలను సాధించడం.",
      why3Title: "దాగి ఉన్న పునాది లోపాల గుర్తింపు",
      why3Desc: "10వ తరగతి లెక్కల కష్టాలను 6 నుండి 8వ తరగతి పునాదులతో సరిదిద్దడం.",
      why4Title: "విద్యార్థులు మరియు ఉపాధ్యాయుల తోడు",
      why4Desc: "ఇంట్లో సాధన మరియు తరగతి గది బోధనకు సరైన వారధిగా నిలుస్తుంది.",
      why5Title: "స్పష్టమైన పురోగతి వివరాలు",
      why5Desc: "సాధించిన ఫలితాలు విద్యార్థులకు మరియు తల్లిదండ్రులకు స్పష్టంగా కనిపిస్తాయి.",

      // Section E: Final Call to Action
      ctaHeading: "గణితాన్ని సులభంగా అర్థం చేసుకోవడానికి సిద్ధంగా ఉన్నారా?",
      ctaSubtitle: "విద్యార్థుల కోసం ఉచితం. ఫోన్ నంబర్ లేదా ఈమెయిల్ అవసరం లేదు.",
      ctaStudentBtn: "విద్యార్థిగా నేర్చుకోవడం ప్రారంభించండి",
      ctaTeacherBtn: "ఉపాధ్యాయ తరగతిని సిద్ధం చేయండి",
      ctaStudentSub: "మీ పేరుతో వెంటనే ప్రవేశించండి · పాస్‌వర్డ్ అవసరం లేదు",
      ctaTeacherSub: "తరగతిని సృష్టించి విద్యార్థులకు సులభమైన కోడ్ ఇవ్వండి",
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

      {/* Unified Responsive Navigation (Top Navbar on Desktop, Left Rail on Tablet, Bottom Bar on Mobile) */}
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
                <p className="font-sans text-sm sm:text-base text-[#1E1610] leading-relaxed">
                  {copy.studentBody}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={profile ? "/student" : "/login?role=student"}
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                >
                  <span>{profile ? "Go to student home" : copy.studentBtn}</span>
                  <ArrowRight className="w-5 h-5 ml-2 text-[#1E1610]" />
                </Link>

                <div className="text-center">
                  <Link
                    href={profile ? "/student" : "/login?role=student"}
                    className="inline-block text-xs sm:text-sm font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline underline-offset-2"
                  >
                    {profile ? "Already signed in" : copy.studentSignIn}
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
                <p className="font-sans text-sm sm:text-base text-[#1E1610] leading-relaxed">
                  {copy.teacherBody}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/login?role=teacher"
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-[#5DAA3A] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-base border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all no-underline"
                >
                  <span>{copy.teacherBtn}</span>
                  <ArrowRight className="w-5 h-5 ml-2 text-[#1E1610]" />
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
              ADAPTIVE LEARNING
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
              TEACHER TOOLS
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
              OUR FOCUS
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
                <span>{profile ? "Go to student home" : copy.ctaStudentBtn}</span>
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
