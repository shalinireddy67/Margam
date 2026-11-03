"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Lock,
  FileText,
} from "lucide-react";
import {
  Button,
  LanguageToggle,
  Toast,
  SkeletonCard,
  EmptyState,
  type Language,
} from "@/components/ui";

interface PolicySection {
  title: string;
  body: string;
}

const PRIVACY_CONTENT: Record<
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
    footerText: string;
  }
> = {
  en: {
    title: "Privacy Notice",
    subtitle: "Plain language notice for students, parents, and educators.",
    badge: "Zero Trackers",
    backText: "Back to Home",
    errorTitle: "Notice Unavailable",
    errorMessage: "The privacy policy document could not be rendered right now.",
    retryText: "Reload Notice",
    lockedTitle: "Access Restricted",
    lockedMessage: "This policy document is temporarily unavailable.",
    emptyTitle: "No Content Found",
    emptyMessage: "The policy document contains no readable sections.",
    footerText: "Margam • Built for Indian students and teachers across Classes 6–10",
    sections: [
      {
        title: "1. No Personal Contact Information Collected",
        body: "Students use Margam without providing an email address, phone number, real name, or Aadhaar number. Account authentication uses self-chosen usernames and locally generated recovery codes.",
      },
      {
        title: "2. Learning Data Scope",
        body: "We store only mathematical progression data: diagnostic responses, concept mastery levels, practice attempts, and earned badges. This data is used solely to generate adaptive lesson recommendations.",
      },
      {
        title: "3. Zero Advertising & Third-Party Trackers",
        body: "Margam does not display advertisements, does not load tracking pixels, and does not sell or share student data with marketing networks. All analytical processing occurs server-side.",
      },
      {
        title: "4. Classroom & Teacher Visibility",
        body: "When a student joins a class using a teacher-provided code, the teacher sees aggregated concept mastery and foundational gaps to guide classroom instruction. Teachers cannot access personal device identifiers.",
      },
      {
        title: "5. Data Retention & Deletion",
        body: "Student profiles can be reset at any time through the profile screen. Inactive guest profiles stored on local devices can be cleared by deleting browser site data.",
      },
    ],
  },
  hi: {
    title: "गोपनीयता सूचना",
    subtitle: "विद्यार्थियों, अभिभावकों और शिक्षकों के लिए सरल भाषा में सूचना।",
    badge: "कोई ट्रैकर नहीं",
    backText: "होम पर लौटें",
    errorTitle: "सूचना अनुपलब्ध है",
    errorMessage: "गोपनीयता नीति दस्तावेज़ इस समय लोड नहीं किया जा सका।",
    retryText: "पुनः लोड करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "यह दस्तावेज़ अस्थायी रूप से अनुपलब्ध है।",
    emptyTitle: "कोई सामग्री नहीं मिली",
    emptyMessage: "दस्तावेज़ में कोई अनुभाग उपलब्ध नहीं है।",
    footerText: "मार्गम् • कक्षा 6-10 के विद्यार्थियों और शिक्षकों के लिए निर्मित",
    sections: [
      {
        title: "1. कोई व्यक्तिगत संपर्क जानकारी एकत्र नहीं की जाती",
        body: "विद्यार्थी बिना ईमेल या फ़ोन नंबर के मार्गम् का उपयोग करते हैं। केवल उपयोगकर्ता नाम और रिकवरी कोड का उपयोग किया जाता है।",
      },
      {
        title: "2. सीखने के डेटा का दायरा",
        body: "हम केवल गणितीय प्रगति डेटा संग्रहीत करते हैं: प्रश्नों के उत्तर, अवधारणा दक्षता स्तर और अभ्यास प्रयास।",
      },
      {
        title: "3. कोई विज्ञापन या ट्रैकर नहीं",
        body: "मार्गम् में कोई विज्ञापन या ट्रैकिंग पिक्सेल नहीं हैं। डेटा किसी भी बाहरी विपणन नेटवर्क के साथ साझा नहीं किया जाता।",
      },
      {
        title: "4. शिक्षक दृश्यता",
        body: "कक्षा कोड के माध्यम से जुड़ने पर शिक्षक केवल गणितीय अवधारणाओं की समझ देख सकते हैं।",
      },
      {
        title: "5. डेटा रीसेट",
        body: "विद्यार्थी प्रोफ़ाइल को कभी भी सेटिंग स्क्रीन से रीसेट किया जा सकता है।",
      },
    ],
  },
  te: {
    title: "గోప్యతా ప్రకటన",
    subtitle: "విద్యార్థులు, తల్లిదండ్రులు మరియు ఉపాధ్యాయుల కోసం సరళమైన వివరణ.",
    badge: "ట్రాకర్లు లేవు",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    errorTitle: "ప్రకటన అందుబాటులో లేదు",
    errorMessage: "గోప్యతా పత్రం ప్రస్తుతం తెరవబడలేదు.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "ఈ పత్రం తాత్కాలికంగా అందుబాటులో లేదు.",
    emptyTitle: "విషయం కనుగొనబడలేదు",
    emptyMessage: "ఈ పత్రంలో చదవడానికి సమాచారం లేదు.",
    footerText: "మార్గం • 6–10 తరగతుల విద్యార్థులు మరియు ఉపాధ్యాయుల కోసం నిర్మితం",
    sections: [
      {
        title: "1. వ్యక్తిగత సంప్రదింపు సమాచారం సేకరించబడదు",
        body: "విద్యార్థులు ఇమెయిల్ లేదా ఫోన్ నంబర్ లేకుండా మార్గంను ఉపయోగించవచ్చు. కేవలం వినియోగదారు పేరు మరియు రికవరీ కోడ్ ఉపయోగించబడుతుంది.",
      },
      {
        title: "2. అభ్యాస డేటా పరిధి",
        body: "మేము కేవలం గణిత పురోగతి డేటాను మాత్రమే నిల్వ చేస్తాము: ప్రశ్నల సమాధానాలు, కాన్సెప్ట్ సాధన మరియు అభ్యాస ప్రయత్నాలు.",
      },
      {
        title: "3. ప్రకటనలు మరియు ట్రాకర్లు లేవు",
        body: "మార్గంలో ఎలాంటి ప్రకటనలు లేవు. డేటా ఎవరికీ విక్రయించబడదు లేదా భాగస్వామ్యం చేయబడదు.",
      },
      {
        title: "4. ఉపాధ్యాయుల దృశ్యత",
        body: "తరగతి కోడ్ ద్వారా చేరినప్పుడు ఉపాధ్యాయులు కేవలం గణిత కాన్సెప్ట్ అవగాహనను మాత్రమే చూడగలరు.",
      },
      {
        title: "5. డేటా తొలగింపు",
        body: "విద్యార్థి ప్రొఫైల్‌ను ఎప్పుడైనా రీసెట్ చేసుకోవచ్చు.",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF7E6] p-8 text-center font-heading">Loading Privacy Notice...</div>}>
      <PrivacyContent />
    </Suspense>
  );
}

function PrivacyContent() {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get("state");

  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(stateParam === "error");

  const isLoading = stateParam === "loading";
  const isLocked = stateParam === "locked";
  const isEmpty = stateParam === "empty";

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

  const content = PRIVACY_CONTENT[currentLang] || PRIVACY_CONTENT.en;
  const showOfflineBanner = !isOnline || stateParam === "offline";

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between pb-safe">
      {showOfflineBanner && (
        <div className="fixed top-2 left-4 right-4 z-50 max-w-[480px] mx-auto">
          <Toast
            type="offline"
            message="You are viewing the saved offline privacy notice."
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Header */}
      <header className="border-b-[3px] border-[#2B1B0F] bg-white text-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Margam Home"
            className="flex items-center gap-2.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6EB5FF]"
          >
            <div className="w-9 h-9 bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] flex items-center justify-center shadow-[2px_2px_0px_#2B1B0F]">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-xl text-[#2B1B0F]">
              Margam
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle
              currentLang={currentLang}
              onLanguageChange={(lang) => setCurrentLang(lang)}
            />
            <Link
              href="/"
              className="min-h-[40px] px-3.5 inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2B1B0F] bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{content.backText}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Loading skeleton state */}
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Locked state */}
        {!isLoading && isLocked && (
          <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#FFE9A8] text-[#2B1B0F] border-2 border-[#2B1B0F] flex items-center justify-center shadow-[2px_2px_0px_#2B1B0F]">
              <Lock className="w-7 h-7 text-[#2B1B0F]" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#2B1B0F]">
              {content.lockedTitle}
            </h1>
            <p className="text-sm font-sans font-medium text-[#2B1B0F]/80">
              {content.lockedMessage}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 text-sm font-heading font-bold bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] hover:brightness-105"
            >
              {content.backText}
            </Link>
          </div>
        )}

        {/* Error state with retry */}
        {!isLoading && !isLocked && hasError && (
          <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 text-center space-y-4">
            <h1 className="text-xl font-heading font-extrabold text-[#2B1B0F]">
              {content.errorTitle}
            </h1>
            <p className="text-sm font-sans font-medium text-[#2B1B0F]/80">
              {content.errorMessage}
            </p>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setHasError(false)}
              className="min-h-[44px] inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>{content.retryText}</span>
            </Button>
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

        {/* Normal content view */}
        {!isLoading && !isLocked && !hasError && !isEmpty && (
          <div className="bg-white p-6 sm:p-8 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#2B1B0F]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#5DAA3A] border-2 border-[#2B1B0F] flex items-center justify-center shadow-[2px_2px_0px_#2B1B0F] shrink-0 mt-0.5">
                  <ShieldCheck
                    className="w-6 h-6 text-[#2B1B0F]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B1B0F]">
                    {content.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/75 mt-0.5">
                    {content.subtitle}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-heading font-extrabold px-2.5 py-1 bg-[#F4C542] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]">
                {content.badge}
              </span>
            </div>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#2B1B0F]">
              {content.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="p-4 bg-[#FFF7E6] border-2 border-[#2B1B0F] space-y-1.5"
                >
                  <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                    {sec.title}
                  </h2>
                  <p className="font-sans font-medium text-[#2B1B0F]/85">{sec.body}</p>
                </section>
              ))}
            </div>

            {/* Cross navigation between policies */}
            <nav
              aria-label="Related policies"
              className="pt-4 border-t-2 border-[#2B1B0F] flex flex-wrap gap-3"
            >
              <Link
                href="/terms"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] text-[#2B1B0F]"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Terms of Service</span>
              </Link>
              <Link
                href="/cookies"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] text-[#2B1B0F]"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Cookie Policy</span>
              </Link>
            </nav>
          </div>
        )}
      </main>

      {/* Footer Ground Strip */}
      <footer className="border-t-[3px] border-[#422816] py-4 text-center text-xs font-sans font-medium text-[#FFF7E6] bg-[#5A3720]">
        {content.footerText}
      </footer>
    </div>
  );
}
