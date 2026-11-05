"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  RefreshCw,
  Lock,
  Cookie,
  ShieldCheck,
  BookCheck,
} from "lucide-react";
import {
  Toast,
  SkeletonCard,
  EmptyState,
  type Language,
} from "@/components/ui";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolicySection {
  title: string;
  body: string;
}

const TERMS_CONTENT: Record<
  Language,
  {
    title: string;
    subtitle: string;
    badge: string;
    backText: string;
    sections: PolicySection[];
    errorTitle: string;
    errorMessage: string;
    retryText: string;
    lockedTitle: string;
    lockedMessage: string;
    emptyTitle: string;
    emptyMessage: string;
    privacyNoticeLink: string;
    cookiePolicyLink: string;
  }
> = {
  en: {
    title: "Terms of Service",
    subtitle: "Clear and fair rules for using the Margam learning platform.",
    badge: "Educational Use",
    backText: "Return to Home",
    sections: [
      {
        title: "1. Purpose and Educational Scope",
        body: "Margam is an open mathematics learning prototype designed for Indian students in Classes 6 through 10. The platform is offered free of charge for individual study, classroom practice, and educational demonstration.",
      },
      {
        title: "2. Free and Open Access",
        body: "The platform is completely free to use. There are no fees, paid upgrades, recurring subscriptions, or hidden charges.",
      },
      {
        title: "3. Curriculum Alignment and Content",
        body: "Chapter sequences follow the official 2026-27 NCERT mathematics syllabus (Ganita Prakash and Ganita Manjari). All math questions, hints, diagrams, and explanations are original educational materials developed specifically for student understanding.",
      },
      {
        title: "4. Pilot Progression Scope",
        body: "The initial chain of pilot chapters is fully interactive for learning, diagnostics, and testing. Chapters labeled as content in progress show syllabus topics and unlock sequentially as question pools are verified.",
      },
      {
        title: "5. Device Storage Responsibility",
        body: "Learner mastery records are stored in your device's browser memory. Margam does not maintain cloud accounts; clearing your browser cache will reset local mastery scores.",
      },
      {
        title: "6. Acceptable Use",
        body: "You may use this tool freely for mathematics education. Do not attempt to reverse engineer with harmful intent, flood server endpoints, or alter the platform for unauthorized commercial distribution.",
      },
    ],
    errorTitle: "Unable to load terms of service",
    errorMessage: "A temporary error occurred while reading the document.",
    retryText: "Retry",
    lockedTitle: "Access Restricted",
    lockedMessage: "Terms of service are restricted by current system policy.",
    emptyTitle: "No Terms Available",
    emptyMessage: "The terms of service sections are currently unavailable.",
    privacyNoticeLink: "Privacy Notice",
    cookiePolicyLink: "Cookie Policy",
  },
  hi: {
    title: "सेवा की शर्तें",
    subtitle: "मार्गम् शिक्षण मंच के उपयोग के लिए स्पष्ट और सरल नियम।",
    badge: "शैक्षणिक उपयोग",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. उद्देश्य और शैक्षणिक दायरा",
        body: "मार्गम् कक्षा 6 से 10 के भारतीय छात्रों के लिए एक निःशुल्क गणित अभ्यास मंच है। यह व्यक्तिगत अध्ययन और कक्षा अभ्यास के लिए प्रदान किया गया है।",
      },
      {
        title: "2. पूर्णतः निःशुल्क",
        body: "यह मंच पूरी तरह से मुफ़्त है। कोई शुल्क, सदस्यता या छिपा हुआ मूल्य नहीं है।",
      },
      {
        title: "3. एनसीईआरटी पाठ्यक्रम के अनुरूप",
        body: "अध्याय आधिकारिक 2026-27 एनसीईआरटी गणित पाठ्यक्रम के अनुसार तैयार किए गए हैं। सभी प्रश्न और संकेत छात्रों की समझ के लिए मूल रूप से बनाए गए हैं।",
      },
      {
        title: "4. पायलट प्रगति का दायरा",
        body: "शुरुआती अध्याय सीखने और परीक्षण के लिए पूरी तरह सक्रिय हैं। अन्य अध्याय पाठ्यक्रम की रूपरेखा दिखाते हैं और समीक्षा के बाद सक्रिय होते हैं।",
      },
      {
        title: "5. डिवाइस डेटा की ज़िम्मेदारी",
        body: "सीखने का रिकॉर्ड आपके ब्राउज़र में सुरक्षित रहता है। ब्राउज़र डेटा साफ़ करने पर प्रगति रीसेट हो जाएगी।",
      },
      {
        title: "6. उचित उपयोग",
        body: "इस उपकरण का उपयोग केवल गणित सीखने और सिखाने के लिए करें। सेवा में बाधा डालने का कोई प्रयास न करें।",
      },
    ],
    errorTitle: "सेवा की शर्तें लोड करने में असमर्थ",
    errorMessage: "दस्तावेज़ पढ़ते समय एक अस्थायी त्रुटि हुई।",
    retryText: "पुनः प्रयास करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "यह दस्तावेज़ वर्तमान में लॉक है।",
    emptyTitle: "कोई सामग्री नहीं",
    emptyMessage: "सेवा की शर्तें अनुभाग वर्तमान में उपलब्ध नहीं हैं।",
    privacyNoticeLink: "गोपनीयता नीति",
    cookiePolicyLink: "कुकी नीति",
  },
  te: {
    title: "సేవా నిబంధనలు",
    subtitle: "మార్గం ఉపయోగించడానికి స్పష్టమైన మరియు సరళమైన నియమాలు.",
    badge: "విద్యా ప్రయోజనం",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. విద్యా ప్రయోజనం",
        body: "మార్గం అనేది 6 నుండి 10 తరగతుల విద్యార్థుల కోసం రూపొందించబడిన ఉచిత గణిత వేదిక. ఇది వ్యక్తిగత అధ్యయనం మరియు తరగతి గది అభ్యాసం కోసం ఉద్దేశించబడింది.",
      },
      {
        title: "2. పూర్తిగా ఉచితం",
        body: "ఈ వేదికను ఉపయోగించడం పూర్తిగా ఉచితం. ఎలాంటి దాగి ఉన్న రుసుములు లేదా చందాలు లేవు.",
      },
      {
        title: "3. NCERT సిలబస్ అనుగుణ్యత",
        body: "అధ్యాయాలు అధికారిక 2026-27 NCERT గణిత సిలబస్‌కు అనుగుణంగా ఉంటాయి. అన్ని ప్రశ్నలు మరియు వివరణలు విద్యార్థుల కోసం ప్రత్యేకంగా రూపొందించబడ్డాయి.",
      },
      {
        title: "4. పైలట్ పరిధి",
        body: "ప్రారంభ అధ్యాయాలు అభ్యాసం మరియు పరీక్షల కోసం పూర్తిగా పనిచేస్తాయి. మిగిలిన అధ్యాయాలు సమీక్ష తర్వాత అందుబాటులోకి వస్తాయి.",
      },
      {
        title: "5. పరికర డేటా బాధ్యత",
        body: "పురోగతి మీ పరికర బ్రౌజర్‌లోనే నిల్వ చేయబడుతుంది. బ్రౌజర్ క్యాష్ క్లియర్ చేస్తే పురోగతి రీసెట్ అవుతుంది.",
      },
      {
        title: "6. సరైన ఉపయోగం",
        body: "ఈ సాధనాన్ని గణిత విద్య కోసం మాత్రమే ఉపయోగించండి. సిస్టమ్‌కు అంతరాయం కలిగించే ప్రయత్నం చేయవద్దు.",
      },
    ],
    errorTitle: "నిబంధనలు లోడ్ చేయడం సాధ్యం కాలేదు",
    errorMessage: "పత్రాన్ని చదువుతున్నప్పుడు తాత్కాలిక లోపం సంభవించింది.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "ఈ పత్రం ప్రస్తుతం లాక్ చేయబడింది.",
    emptyTitle: "కంటెంట్ లేదు",
    emptyMessage: "సేవా నిబంధనల వివరాలు అందుబాటులో లేవు.",
    privacyNoticeLink: "గోప్యతా విధానం",
    cookiePolicyLink: "కుకీ విధానం",
  },
};

function TermsView() {
  const searchParams = useSearchParams();
  const stateParam = searchParams?.get("state");

  const { lang, setLang } = useLanguage();
  const currentLang: Language = (lang as Language) || "en";

  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(stateParam === "error");
  const [isLocked] = useState(stateParam === "locked");
  const [isEmpty] = useState(stateParam === "empty");
  const [isLoading] = useState(stateParam === "loading");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const content = TERMS_CONTENT[currentLang] || TERMS_CONTENT.en;
  const showOfflineBanner = !isOnline || stateParam === "offline";

  return (
    <div className="min-h-screen text-[#1E1610] flex flex-col justify-between">
      {/* Top Floating Navigation */}
      <Navigation
        currentTab="home"
        currentLang={currentLang}
        onLanguageChange={setLang}
        showTopBar={true}
      />

      {showOfflineBanner && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-[480px] mx-auto">
          <Toast
            type="offline"
            message="You are viewing the saved offline terms of service."
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Loading skeleton state */}
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Locked state */}
        {!isLoading && isLocked && (
          <div className="panel-plank border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-[2px] bg-[#FAF3E3] border-2 border-[#1E1610] flex items-center justify-center shadow-[2px_2px_0px_#1E1610]">
              <Lock className="w-7 h-7 text-[#5A3720]" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#1E1610]">
              {content.lockedTitle}
            </h1>
            <p className="text-sm font-sans font-medium text-[#5A3720]">
              {content.lockedMessage}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 text-xs font-heading font-extrabold bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px]"
            >
              {content.backText}
            </Link>
          </div>
        )}

        {/* Error state with retry */}
        {!isLoading && !isLocked && hasError && (
          <div className="panel-plank border-3 border-[#D1362B] shadow-[4px_4px_0px_#1E1610] p-6 sm:p-8 text-center space-y-4">
            <h1 className="text-xl font-heading font-extrabold text-[#D1362B]">
              {content.errorTitle}
            </h1>
            <p className="text-sm font-sans font-medium text-[#5A3720]">
              {content.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setHasError(false)}
              className="min-h-[44px] px-5 bg-[#FAF3E3] hover:bg-[#EEDBB8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] inline-flex items-center gap-2 font-heading font-bold text-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#1E1610]" aria-hidden="true" />
              <span>{content.retryText}</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isLocked && !hasError && isEmpty && (
          <EmptyState
            title={content.emptyTitle}
            description={content.emptyMessage}
            actionLabel={content.backText}
            onAction={() => window.location.assign("/")}
          />
        )}

        {/* Normal Content View */}
        {!isLoading && !isLocked && !hasError && !isEmpty && (
          <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] space-y-6 text-[#1E1610]">
            {/* Header section with high-contrast text and warm panel */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#1E1610]/20">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-[2px] bg-[#FAF3E3] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0 mt-0.5">
                  <BookCheck className="w-6 h-6 text-[#5A3720]" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#1E1610] leading-tight m-0">
                    {content.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-sans font-medium text-[#5A3720] mt-1 leading-relaxed">
                    {content.subtitle}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#78BDE8] text-[#1E1610] border-2 border-[#1E1610] shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold text-xs self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E1610]" />
                {content.badge}
              </span>
            </div>

            {/* Structured policy sections with dark, high-contrast readable text */}
            <div className="space-y-4">
              {content.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="p-5 sm:p-6 bg-[#FAF3E3] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px] space-y-2 transition-all hover:translate-x-[1px]"
                >
                  <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#1E1610] m-0">
                    {sec.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#3E2718] font-medium leading-relaxed m-0">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Cross navigation between policies */}
            <nav
              aria-label="Related policies"
              className="pt-5 border-t-2 border-[#1E1610]/20 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/privacy"
                className="min-h-[42px] px-4 py-2 inline-flex items-center gap-2 text-xs font-heading font-extrabold bg-[#FAF3E3] hover:bg-[#EEDBB8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline"
              >
                <FileText className="w-4 h-4 text-[#5A3720]" aria-hidden="true" />
                <span>{content.privacyNoticeLink}</span>
              </Link>

              <Link
                href="/cookies"
                className="min-h-[42px] px-4 py-2 inline-flex items-center gap-2 text-xs font-heading font-extrabold bg-[#FAF3E3] hover:bg-[#EEDBB8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline"
              >
                <Cookie className="w-4 h-4 text-[#5A3720]" aria-hidden="true" />
                <span>{content.cookiePolicyLink}</span>
              </Link>
            </nav>
          </div>
        )}
      </main>

      {/* Margam Standard Footer */}
      <Footer />
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen text-[#1E1610] p-6 max-w-4xl mx-auto">
          <SkeletonCard />
        </div>
      }
    >
      <TermsView />
    </Suspense>
  );
}
