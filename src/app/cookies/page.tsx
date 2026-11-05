"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Cookie,
  ArrowLeft,
  RefreshCw,
  Lock,
  FileText,
  ShieldCheck,
  Settings2,
} from "lucide-react";
import {
  LanguageToggle,
  Toast,
  SkeletonCard,
  EmptyState,
  type Language,
} from "@/components/ui";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { openCookieSettings } from "@/components/ui/CookieConsent";
import { SupportedLanguage } from "@/lib/types";

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
    managePreferences: string;
    sections: PolicySection[];
    errorTitle: string;
    errorMessage: string;
    retryText: string;
    lockedTitle: string;
    lockedMessage: string;
    emptyTitle: string;
    emptyMessage: string;
    privacyNoticeLink: string;
    termsLink: string;
  }
> = {
  en: {
    title: "Cookie and Storage Policy",
    subtitle: "Plain language explanation of how your browser stores your math progress without tracking you.",
    badge: "Zero Advertising Trackers",
    backText: "Return to Home",
    managePreferences: "Manage Cookie Preferences",
    sections: [
      {
        title: "1. No Tracking Cookies",
        body: "Margam does not use advertising cookies, third-party analytics cookies, surveillance beacons, or cross-domain tracking pixels. Your online identity is never sold, tracked, or profiled across the web.",
      },
      {
        title: "2. Essential Local Storage Only",
        body: "We use your device's browser local storage (localStorage) exclusively to remember your selected class grade, completed lessons, practice mastery scores, and sticker showcase. This storage is strictly necessary for the application to function without requiring an account or email address.",
      },
      {
        title: "3. Temporary Session Storage",
        body: "We use browser session storage while you take diagnostic assessments or solve practice worksheets so that refreshing the page does not erase your ongoing math quiz.",
      },
      {
        title: "4. Complete User Storage Control",
        body: "You can delete all stored learning records at any time. Tap Reset Class on the student screen or use your browser privacy settings to clear site data instantly.",
      },
      {
        title: "5. No Third-Party Data Sharing",
        body: "Because all data remains strictly inside your local browser storage, no commercial advertising network or external vendor ever has access to your learning metrics.",
      },
    ],
    errorTitle: "Unable to load cookie policy",
    errorMessage: "A temporary error occurred while reading the document.",
    retryText: "Retry",
    lockedTitle: "Access Restricted",
    lockedMessage: "The cookie policy is restricted by current system policy.",
    emptyTitle: "No Content Available",
    emptyMessage: "Cookie policy sections are currently unavailable.",
    privacyNoticeLink: "Privacy Notice",
    termsLink: "Terms of Service",
  },
  hi: {
    title: "कुकी और संग्रहण नीति",
    subtitle: "मार्गम् आपके डिवाइस पर बिना किसी ट्रैकिंग के सीखने की प्रगति को कैसे सुरक्षित रखता है।",
    badge: "शून्य विज्ञापन ट्रैकर",
    backText: "होम पर लौटें",
    managePreferences: "कुकी प्राथमिकताएँ प्रबंधित करें",
    sections: [
      {
        title: "1. कोई ट्रैकिंग कुकी नहीं",
        body: "मार्गम् विज्ञापन कुकीज़, तीसरे पक्ष के एनालिटिक्स या वेब ट्रैकिंग पिक्सल का उपयोग नहीं करता है। आपकी पहचान कभी ट्रैक या प्रोफाइल नहीं की जाती।",
      },
      {
        title: "2. केवल आवश्यक स्थानीय संग्रहण",
        body: "हम केवल आपकी चुनी हुई कक्षा, अनलॉक किए गए अध्याय, अभ्यास स्कोर और अर्जित बैज याद रखने के लिए स्थानीय संग्रहण (localStorage) का उपयोग करते हैं। इसके लिए ईमेल की आवश्यकता नहीं है।",
      },
      {
        title: "3. अस्थायी सत्र संग्रहण",
        body: "हम अभ्यास के दौरान अस्थायी सत्र संग्रहण का उपयोग करते हैं ताकि पृष्ठ रीलोड होने पर आपका चालू गणित क्विज़ सुरक्षित रहे।",
      },
      {
        title: "4. पूर्ण उपयोगकर्ता नियंत्रण",
        body: "आप छात्र स्क्रीन पर 'कक्षा रीसेट' पर टैप करके या ब्राउज़र सेटिंग्स में जाकर अपना डेटा कभी भी पूरी तरह हटा सकते हैं।",
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
    privacyNoticeLink: "गोपनीयता नीति",
    termsLink: "सेवा की शर्तें",
  },
  te: {
    title: "కుకీ మరియు నిల్వ విధానం",
    subtitle: "మీ పరికరంలో అభ్యాస పురోగతిని ట్రాకింగ్ లేకుండా మార్గం ఎలా భద్రపరుస్తుందో తెలిపే సరళ వివరణ.",
    badge: "జీరో ప్రకటన ట్రాకర్లు",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    managePreferences: "కుకీ ప్రాధాన్యతలను నిర్వహించండి",
    sections: [
      {
        title: "1. ట్రాకింగ్ కుకీలు లేవు",
        body: "మార్గం ప్రకటన కుకీలు, థర్డ్-పార్టీ ట్రాకర్లు లేదా నిఘా పిక్సెల్‌లను ఉపయోగించదు. మీ సమాచారం ఎప్పుడూ ట్రాక్ చేయబడదు లేదా అమ్మబడదు.",
      },
      {
        title: "2. అవసరమైన లోకల్ స్టోరేజ్ మాత్రమే",
        body: "మీరు ఎంచుకున్న తరగతి, పూర్తి చేసిన పాఠాలు, సాధన స్కోర్లు మరియు స్టిక్కర్ బ్యాడ్జ్‌లను గుర్తుంచుకోవడానికి మాత్రమే లోకల్ స్టోరేజ్‌ని ఉపయోగిస్తాము. దీని కోసం ఈమెయిల్ అవసరం లేదు.",
      },
      {
        title: "3. తాత్కాలిక సెషన్ నిల్వ",
        body: "పరీక్షల సమయంలో పేజీ రీఫ్రెష్ అయినా మీ గణిత ప్రశ్నలు చెరిగిపోకుండా ఉండేందుకు తాత్కాలిక సెషన్ నిల్వను ఉపయోగిస్తాము.",
      },
      {
        title: "4. మీకే పూర్తి నియంత్రణ",
        body: "విద్యార్థి స్క్రీన్‌లోని రీసెట్ బటన్ ద్వారా లేదా బ్రౌజర్ డేటా క్లియర్ చేయడం ద్వారా ఎప్పుడైనా డేటాను క్లియర్ చేయవచ్చు.",
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
    privacyNoticeLink: "గోప్యతా విధానం",
    termsLink: "సేవా నిబంధనలు",
  },
};

function CookiesView() {
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

  const content = COOKIE_CONTENT[currentLang] || COOKIE_CONTENT.en;
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
            message="You are viewing the saved offline cookie policy."
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
            {/* Header section with high-contrast text and breathing room */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#1E1610]/20">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-[2px] bg-[#FAF3E3] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-6 h-6 text-[#5A3720]" aria-hidden="true" />
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

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E1610]" />
                  {content.badge}
                </span>

                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 bg-[#FAF3E3] hover:bg-[#EEDBB8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] font-heading font-extrabold text-xs cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5 text-[#5A3720]" />
                  <span>{content.managePreferences}</span>
                </button>
              </div>
            </div>

            {/* Structured policy sections with dark, high-contrast readable text on soft cream panels */}
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
                href="/terms"
                className="min-h-[42px] px-4 py-2 inline-flex items-center gap-2 text-xs font-heading font-extrabold bg-[#FAF3E3] hover:bg-[#EEDBB8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all no-underline"
              >
                <FileText className="w-4 h-4 text-[#5A3720]" aria-hidden="true" />
                <span>{content.termsLink}</span>
              </Link>

              <button
                type="button"
                onClick={openCookieSettings}
                className="min-h-[42px] px-4 py-2 inline-flex items-center gap-2 text-xs font-heading font-extrabold bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] rounded-[2px] transition-all cursor-pointer ml-auto"
              >
                <Settings2 className="w-4 h-4 text-[#1E1610]" aria-hidden="true" />
                <span>{content.managePreferences}</span>
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Margam Standard Footer */}
      <Footer />
    </div>
  );
}

export default function CookiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen text-[#1E1610] p-6 max-w-4xl mx-auto">
          <SkeletonCard />
        </div>
      }
    >
      <CookiesView />
    </Suspense>
  );
}
