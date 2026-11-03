"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Cookie,
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

interface CookieSection {
  title: string;
  body: string;
}

const COOKIE_CONTENT: Record<
  Language,
  {
    title: string;
    subtitle: string;
    badge: string;
    backText: string;
    sections: CookieSection[];
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
    title: "Cookie Policy",
    subtitle: "Notice regarding HTTP cookies and browser storage in Margam.",
    badge: "Strictly Necessary Only",
    backText: "Back to Home",
    errorTitle: "Policy Unavailable",
    errorMessage: "The cookie policy document could not be rendered right now.",
    retryText: "Reload Policy",
    lockedTitle: "Access Restricted",
    lockedMessage: "Cookie policy is temporarily unavailable.",
    emptyTitle: "No Content Found",
    emptyMessage: "The policy document contains no readable sections.",
    footerText: "Margam • Built for Indian students and teachers across Classes 6–10",
    sections: [
      {
        title: "1. Strictly Necessary Cookies Only",
        body: "Margam uses only strictly necessary authentication cookies to maintain your login session and cryptographic anti-tamper session tokens for assessments. We do not use advertising, marketing, or behavioural cookies.",
      },
      {
        title: "2. Zero Third-Party Tracking",
        body: "We do not embed third-party analytics trackers, social network tracking pixels, or cross-site tracking scripts. Your mathematics activity stays between you and your classroom.",
      },
      {
        title: "3. Local Browser Storage",
        body: "For guest learners, concept progression and practice state are saved directly in your browser's localStorage. This data remains on your physical device until you clear site data.",
      },
      {
        title: "4. Cookie Security Flags",
        body: "All server cookies are transmitted with HttpOnly, Secure, and SameSite=Lax flags, preventing malicious script access and protecting student sessions from cross-site request forgery.",
      },
    ],
  },
  hi: {
    title: "कुकी नीति",
    subtitle: "मार्गम् में कुकीज़ और ब्राउज़र स्टोरेज के संबंध में जानकारी।",
    badge: "केवल आवश्यक कुकीज़",
    backText: "होम पर लौटें",
    errorTitle: "नीति अनुपलब्ध है",
    errorMessage: "कुकी नीति इस समय लोड नहीं की जा सकी।",
    retryText: "पुनः लोड करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "नीति दस्तावेज़ अस्थायी रूप से अनुपलब्ध है।",
    emptyTitle: "कोई सामग्री नहीं मिली",
    emptyMessage: "दस्तावेज़ में कोई अनुभाग उपलब्ध नहीं है।",
    footerText: "मार्गम् • कक्षा 6-10 के विद्यार्थियों और शिक्षकों के लिए निर्मित",
    sections: [
      {
        title: "1. केवल आवश्यक कुकीज़",
        body: "मार्गम् केवल लॉगिन और सत्र सुरक्षा के लिए आवश्यक कुकीज़ का उपयोग करता है। कोई विज्ञापन कुकी नहीं है।",
      },
      {
        title: "2. कोई तीसरा पक्ष ट्रैकिंग नहीं",
        body: "हम किसी भी तीसरे पक्ष के ट्रैकर या सोशल मीडिया पिक्सेल का उपयोग नहीं करते हैं।",
      },
      {
        title: "3. स्थानीय ब्राउज़र स्टोरेज",
        body: "अतिथि विद्यार्थियों के लिए प्रगति डेटा आपके डिवाइस के ब्राउज़र में सुरक्षित रहता है।",
      },
      {
        title: "4. कुकी सुरक्षा",
        body: "सभी सर्वर कुकीज़ सुरक्षित फ़्लैग (HttpOnly, Secure) के साथ भेजी जाती हैं।",
      },
    ],
  },
  te: {
    title: "కుకీ విధానం",
    subtitle: "మార్గంలో కుకీలు మరియు బ్రౌజర్ నిల్వ గురించిన సమాచారం.",
    badge: "అవసరమైన కుకీలు మాత్రమే",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    errorTitle: "విధానం అందుబాటులో లేదు",
    errorMessage: "కుకీ విధానం ప్రస్తుతం తెరవబడలేదు.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "విధానం తాత్కాలికంగా అందుబాటులో లేదు.",
    emptyTitle: "విషయం కనుగొనబడలేదు",
    emptyMessage: "ఈ పత్రంలో సమాచారం లేదు.",
    footerText: "మార్గం • 6–10 తరగతుల విద్యార్థులు మరియు ఉపాధ్యాయుల కోసం నిర్మితం",
    sections: [
      {
        title: "1. అవసరమైన కుకీలు మాత్రమే",
        body: "మార్గం లాగిన్ మరియు భద్రత కోసం అవసరమైన కుకీలను మాత్రమే ఉపయోగిస్తుంది. ప్రకటన కుకీలు లేవు.",
      },
      {
        title: "2. ఎలాంటి థర్డ్ పార్టీ ట్రాకింగ్ లేదు",
        body: "మేము ఇతర ట్రాకింగ్ స్క్రిప్ట్‌లు లేదా సోషల్ మీడియా పిక్సెల్‌లను ఉపయోగించము.",
      },
      {
        title: "3. స్థానిక బ్రౌజర్ నిల్వ",
        body: "గెస్ట్ విద్యార్థుల కోసం పురోగతి మీ పరికరంలో మాత్రమే సురక్షితంగా ఉంటుంది.",
      },
      {
        title: "4. కుకీ భద్రత",
        body: "అన్ని కుకీలు సురక్షితమైన సెక్యూరిటీ ఫ్లాగ్‌లతో రక్షించబడతాయి.",
      },
    ],
  },
};

export default function CookiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF7E6] p-8 text-center font-heading">Loading Cookie Policy...</div>}>
      <CookiesContent />
    </Suspense>
  );
}

function CookiesContent() {
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

  const content = COOKIE_CONTENT[currentLang] || COOKIE_CONTENT.en;
  const showOfflineBanner = !isOnline || stateParam === "offline";

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between pb-safe">
      {showOfflineBanner && (
        <div className="fixed top-2 left-4 right-4 z-50 max-w-[480px] mx-auto">
          <Toast
            type="offline"
            message="You are viewing the saved offline cookie policy."
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
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

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

        {!isLoading && !isLocked && !hasError && isEmpty && (
          <EmptyState
            title={content.emptyTitle}
            description={content.emptyMessage}
            actionLabel={content.backText}
            onAction={() => window.location.assign("/")}
          />
        )}

        {!isLoading && !isLocked && !hasError && !isEmpty && (
          <div className="bg-white p-6 sm:p-8 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#2B1B0F]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#5DAA3A] border-2 border-[#2B1B0F] flex items-center justify-center shadow-[2px_2px_0px_#2B1B0F] shrink-0 mt-0.5">
                  <Cookie
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

            <nav
              aria-label="Related policies"
              className="pt-4 border-t-2 border-[#2B1B0F] flex flex-wrap gap-3"
            >
              <Link
                href="/privacy"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] text-[#2B1B0F]"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Privacy Notice</span>
              </Link>
              <Link
                href="/terms"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold bg-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] hover:bg-[#FFE9A8] text-[#2B1B0F]"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Terms of Service</span>
              </Link>
            </nav>
          </div>
        )}
      </main>

      <footer className="border-t-[3px] border-[#422816] py-4 text-center text-xs font-sans font-medium text-[#FFF7E6] bg-[#5A3720]">
        {content.footerText}
      </footer>
    </div>
  );
}
