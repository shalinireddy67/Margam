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
  ShieldCheck,
} from "lucide-react";
import {
  Button,
  LanguageToggle,
  OfflineBanner,
  Toast,
  SkeletonLine,
  SkeletonCard,
  EmptyState,
  Logo,
  type Language,
} from "@/components/ui";

interface PolicySection {
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
    title: "Cookie & Local Storage Policy",
    subtitle: "Plain language explanation of how your browser stores your math progress.",
    badge: "Zero Trackers",
    backText: "Return to Home",
    sections: [
      {
        title: "1. No Tracking Cookies",
        body: "Margam does not use advertising cookies, third-party analytics cookies, surveillance beacons, or cross-domain tracking pixels. Your online identity is never sold or tracked across the web.",
      },
      {
        title: "2. Essential Local Storage Only",
        body: "We use your browser local storage (localStorage) exclusively to remember your selected class grade, unlocked chapters, practice mastery scores, and sticker showcase. This storage is strictly necessary for the application to function without requiring an account.",
      },
      {
        title: "3. Temporary Session Storage",
        body: "We use browser session storage while you take diagnostic assessments or solve worksheets so that refreshing the page does not erase your ongoing math quiz.",
      },
      {
        title: "4. Complete User Storage Control",
        body: "You can delete all stored learning records at any time. Tap Reset Class on the home screen or use your browser privacy settings to clear site data.",
      },
      {
        title: "5. No Third-Party Data Sharing",
        body: "Because all data remains strictly inside your browser, no commercial advertising network or external vendor ever has access to your learning metrics.",
      },
    ],
    errorTitle: "Unable to load cookie policy",
    errorMessage: "A temporary error occurred while reading the document.",
    retryText: "Retry",
    lockedTitle: "Access Restricted",
    lockedMessage: "The cookie policy is restricted by current system policy.",
    emptyTitle: "No Content Available",
    emptyMessage: "Cookie policy sections are currently unavailable.",
    footerText: "Margam • Plain Language Storage Notice",
  },
  hi: {
    title: "कुकी और स्थानीय संग्रहण नीति",
    subtitle: "मार्गम् आपके डिवाइस पर सीखने की प्रगति को कैसे सुरक्षित रखता है।",
    badge: "शून्य ट्रैकर",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. कोई ट्रैकिंग कुकी नहीं",
        body: "मार्गम् विज्ञापन कुकीज़, तीसरे पक्ष के एनालिटिक्स या वेब ट्रैकिंग पिक्सल का उपयोग नहीं करता है। आपकी पहचान कभी ट्रैक नहीं की जाती।",
      },
      {
        title: "2. केवल आवश्यक स्थानीय संग्रहण",
        body: "हम केवल आपकी चुनी हुई कक्षा, अनलॉक किए गए अध्याय और अर्जित बैज याद रखने के लिए स्थानीय संग्रहण (localStorage) का उपयोग करते हैं।",
      },
      {
        title: "3. अस्थायी सत्र संग्रहण",
        body: "हम अभ्यास के दौरान अस्थायी सत्र संग्रहण का उपयोग करते हैं ताकि पृष्ठ रीलोड होने पर आपका क्विज़ सुरक्षित रहे।",
      },
      {
        title: "4. पूर्ण उपयोगकर्ता नियंत्रण",
        body: "आप होम स्क्रीन पर 'कक्षा रीसेट' पर टैप करके या ब्राउज़र सेटिंग्स में जाकर अपना डेटा कभी भी हटा सकते हैं।",
      },
      {
        title: "5. कोई डेटा साझाकरण नहीं",
        body: "आपका सारा डेटा केवल आपके ब्राउज़र में रहता है, इसलिए किसी भी बाहरी कंपनी या विज्ञापनदाता की इस तक पहुंच नहीं है।",
      },
    ],
    errorTitle: "कुकी नीति लोड करने में असमर्थ",
    errorMessage: "दस्तावेज़ पढ़ते समय एक अस्थायी त्रुटि हुई।",
    retryText: "पुनः प्रयास करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "यह दस्तावेज़ वर्तमान में लॉक है।",
    emptyTitle: "कोई सामग्री नहीं",
    emptyMessage: "कुकी नीति विवरण वर्तमान में उपलब्ध नहीं है।",
    footerText: "मार्गम् • सरल भाषा कुकी नीति",
  },
  te: {
    title: "కుకీ మరియు నిల్వ విధానం",
    subtitle: "మీ పరికరంలో అభ్యాస పురోగతిని మార్గం ఎలా భద్రపరుస్తుందో తెలిపే వివరణ.",
    badge: "జీరో ట్రాకర్లు",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. ట్రాకింగ్ కుకీలు లేవు",
        body: "మార్గం ప్రకటన కుకీలు, థర్డ్-పార్టీ ట్రాకర్లు లేదా నిఘా పిక్సెల్‌లను ఉపయోగించదు. మీ సమాచారం ఎప్పుడూ ట్రాక్ చేయబడదు.",
      },
      {
        title: "2. అవసరమైన లోకల్ స్టోరేజ్ మాత్రమే",
        body: "మీరు ఎంచుకున్న తరగతి, పూర్తి చేసిన అధ్యాయాలు మరియు స్టిక్కర్ బ్యాడ్జ్‌లను గుర్తుంచుకోవడానికి మాత్రమే లోకల్ స్టోరేజ్‌ని ఉపయోగిస్తాము.",
      },
      {
        title: "3. తాత్కాలిక సెషన్ నిల్వ",
        body: "పరీక్షల సమయంలో పేజీ రీఫ్రెష్ అయినా మీ ప్రశ్నలు చెరిగిపోకుండా ఉండేందుకు తాత్కాలిక సెషన్ నిల్వను ఉపయోగిస్తాము.",
      },
      {
        title: "4. మీకే పూర్తి నియంత్రణ",
        body: "హోమ్ స్క్రీన్‌లోని రీసెట్ బటన్ ద్వారా లేదా బ్రౌజర్ డేటా క్లియర్ చేయడం ద్వారా ఎప్పుడైనా డేటాను క్లియర్ చేయవచ్చు.",
      },
      {
        title: "5. డేటా భాగస్వామ్యం లేదు",
        body: "మీ సమాచారం మీ బ్రౌజర్‌లోనే ఉంటుంది మరియు ఏ ఇతర కంపెనీకి లేదా ప్రకటనదారులకు పంపబడదు.",
      },
    ],
    errorTitle: "కుకీ విధానం లోడ్ చేయడం సాధ్యం కాలేదు",
    errorMessage: "పత్రాన్ని చదువుతున్నప్పుడు తాత్కాలిక లోపం సంభవించింది.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "ఈ పత్రం ప్రస్తుతం లాక్ చేయబడింది.",
    emptyTitle: "కంటెంట్ లేదు",
    emptyMessage: "కుకీ విధానం వివరాలు అందుబాటులో లేవు.",
    footerText: "మార్గం • సరళ భాష కుకీ విధానం",
  },
};

function CookiesView() {
  const searchParams = useSearchParams();
  const stateParam = searchParams?.get("state");
  const langParam = searchParams?.get("lang") as Language | null;

  const [currentLang, setCurrentLang] = useState<Language>(
    langParam && ["en", "hi", "te"].includes(langParam) ? langParam : "en"
  );
  const [isOnline, setIsOnline] = useState(true);
  const [hasError, setHasError] = useState(stateParam === "error");
  const [isLocked] = useState(stateParam === "locked");
  const [isEmpty] = useState(stateParam === "empty");
  const [isLoading, setIsLoading] = useState(stateParam === "loading");

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
    <div className="min-h-screen bg-[#FFFDF7] text-[#1E1610] flex flex-col justify-between">
      {showOfflineBanner && (
        <div className="fixed top-2 left-4 right-4 z-50 max-w-[480px] mx-auto">
          <Toast
            type="offline"
            message="You are viewing the saved offline cookie policy."
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Header (Soft Cream, High-Contrast Typography) */}
      <header className="border-b-[3px] border-[#1E1610] bg-[#FAF6EC]/96 shadow-[0px_2px_0px_rgba(30,22,16,0.08)] backdrop-blur-[4px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Margam Home"
            className="flex items-center gap-2.5 min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#2F4FB5] focus-visible:outline-none p-1"
          >
            <div className="w-9 h-9 rounded-[2px] bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0">
              <Logo className="w-5 h-5 text-[#1E1610]" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base text-[#1E1610] leading-none">
                MARGAM
              </span>
              <span className="text-[10px] font-sans font-bold text-[#5A3720] mt-0.5">
                Classes 6–10
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle
              currentLang={currentLang}
              onLanguageChange={(lang) => setCurrentLang(lang)}
            />
            <Link
              href="/"
              className="min-h-[40px] px-3.5 inline-flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#1E1610] bg-[#FAF6EC] hover:bg-[#EFE8D8] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
            >
              <ArrowLeft className="w-4 h-4 text-[#1E1610]" aria-hidden="true" />
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
          <div className="bg-[#FAF6EC] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-[2px] p-6 sm:p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-[2px] bg-[#EFE8D8] border-2 border-[#1E1610] flex items-center justify-center shadow-[2px_2px_0px_#1E1610]">
              <Lock className="w-6 h-6 text-[#5A3720]" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#1E1610]">
              {content.lockedTitle}
            </h1>
            <p className="text-sm font-sans text-[#2B1B0F]">
              {content.lockedMessage}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 text-sm font-heading font-extrabold bg-[#5DAA3A] hover:bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px] transition-all no-underline"
            >
              {content.backText}
            </Link>
          </div>
        )}

        {/* Error state with retry */}
        {!isLoading && !isLocked && hasError && (
          <div className="bg-[#FAF6EC] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-[2px] p-6 sm:p-8 text-center space-y-4">
            <h1 className="text-xl font-heading font-extrabold text-[#1E1610]">
              {content.errorTitle}
            </h1>
            <p className="text-sm font-sans text-[#2B1B0F]">
              {content.errorMessage}
            </p>
            <Button
              variant="yellow"
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

        {/* Normal Content View */}
        {!isLoading && !isLocked && !hasError && !isEmpty && (
          <div className="bg-[#FAF6EC] p-6 sm:p-8 rounded-[2px] border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#1E1610]/20">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-[2px] bg-[#EFE8D8] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-6 h-6 text-[#5A3720]" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1610]">
                    {content.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-sans text-[#5A3720] mt-0.5">
                    {content.subtitle}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-heading font-extrabold px-3 py-1 bg-[#EFE8D8] text-[#1E1610] border-2 border-[#1E1610] rounded-[2px] shadow-[1px_1px_0px_#1E1610] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5DAA3A]" />
                {content.badge}
              </span>
            </div>

            <div className="space-y-4">
              {content.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="p-4 sm:p-5 bg-[#FFFDF7] border-2 border-[#1E1610]/30 rounded-[2px] space-y-2"
                >
                  <h2 className="font-heading font-bold text-base sm:text-lg text-[#1E1610]">
                    {sec.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#2B1B0F] leading-relaxed">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Cross navigation between policies */}
            <nav
              aria-label="Related policies"
              className="pt-4 border-t-2 border-[#1E1610]/20 flex flex-wrap gap-3"
            >
              <Link
                href="/privacy"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-extrabold bg-[#EFE8D8] hover:bg-[#E2D6C0] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline"
              >
                <FileText className="w-4 h-4 text-[#5A3720]" aria-hidden="true" />
                <span>Privacy Notice</span>
              </Link>
              <Link
                href="/terms"
                className="min-h-[44px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-extrabold bg-[#EFE8D8] hover:bg-[#E2D6C0] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline"
              >
                <FileText className="w-4 h-4 text-[#5A3720]" aria-hidden="true" />
                <span>Terms of Service</span>
              </Link>
            </nav>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-[2px] border-[#1E1610] py-4 text-center text-xs font-bold text-[#5A3720] bg-[#FAF6EC]">
        {content.footerText}
      </footer>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF7] p-6">
          <SkeletonCard />
        </div>
      }
    >
      <CookiesView />
    </Suspense>
  );
}
