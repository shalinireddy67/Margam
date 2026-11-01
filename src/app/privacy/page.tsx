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
  OfflineBanner,
  Toast,
  SkeletonLine,
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
    badge: "Local and Private",
    backText: "Return to Home",
    sections: [
      {
        title: "1. Zero Personal Data Collection",
        body: "We do not ask for, collect, or store your real name, email address, phone number, physical address, school name, Aadhaar number, or biometric data. You choose a local nickname solely to personalize this device.",
      },
      {
        title: "2. Local Browser Storage Only",
        body: "Your math lessons, quiz results, mastery scores, and sticker badges remain inside your device's browser local storage (localStorage). No attempt logs or personal records are sent to external databases or advertising companies.",
      },
      {
        title: "3. No Tracking or Profiling",
        body: "Margam contains zero third-party advertising pixels, behavioral trackers, or cross-site monitoring scripts. We do not build marketing profiles and we do not sell student information.",
      },
      {
        title: "4. Complete Learner Control",
        body: "You own your data. You can clear your learning records at any time by pressing Reset Class on the home screen or by clearing your browser cache. There are no leftover remote records.",
      },
      {
        title: "5. DPDP Act Alignment",
        body: "We adhere strictly to the foundational principles of India's Digital Personal Data Protection Act: minimize data, restrict usage strictly to math practice, and provide simple, transparent user control.",
      },
      {
        title: "6. Contact and Inquiries",
        body: "For questions, curriculum feedback, or technical verification regarding this open learning prototype, reach out through the Margam project repository.",
      },
    ],
    errorTitle: "Unable to load privacy notice",
    errorMessage: "A temporary error occurred while reading the document.",
    retryText: "Retry",
    lockedTitle: "Access Restricted",
    lockedMessage: "This policy document is locked by current system policy.",
    emptyTitle: "No Policy Content",
    emptyMessage: "The privacy policy sections are currently unavailable.",
    footerText: "Margam • Plain Language Privacy",
  },
  hi: {
    title: "गोपनीयता सूचना",
    subtitle: "छात्रों, अभिभावकों और शिक्षकों के लिए सरल भाषा में।",
    badge: "स्थानीय और सुरक्षित",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. कोई व्यक्तिगत जानकारी नहीं",
        body: "हम आपका वास्तविक नाम, ईमेल, फोन नंबर, पता, स्कूल का नाम, आधार संख्या या बायोमेट्रिक डेटा नहीं मांगते। आप केवल इस डिवाइस के लिए एक उपनाम चुनते हैं।",
      },
      {
        title: "2. केवल स्थानीय ब्राउज़र संग्रहण",
        body: "आपके गणित के पाठ, अभ्यास परिणाम और बैज आपके डिवाइस के ब्राउज़र (localStorage) में सुरक्षित रहते हैं। कोई डेटा बाहरी सर्वर या विज्ञापन कंपनियों को नहीं भेजा जाता।",
      },
      {
        title: "3. कोई ट्रैकिंग या विज्ञापन नहीं",
        body: "मार्गम् में कोई विज्ञापन ट्रैकर या निगरानी स्क्रिप्ट नहीं है। हम विज्ञापन प्रोफ़ाइल नहीं बनाते और न ही किसी छात्र की जानकारी बेचते हैं।",
      },
      {
        title: "4. छात्र का पूरा नियंत्रण",
        body: "आप होम स्क्रीन पर 'कक्षा रीसेट' दबाकर या ब्राउज़र कैश साफ़ करके कभी भी अपने सभी रिकॉर्ड हटा सकते हैं।",
      },
      {
        title: "5. DPDP अधिनियम के अनुरूप",
        body: "हम भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम के सिद्धांतों का पालन करते हैं: न्यूनतम डेटा संग्रह और पूर्ण पारदर्शिता।",
      },
      {
        title: "6. संपर्क",
        body: "किसी भी प्रश्न या सुझाव के लिए मार्गम् रिपॉजिटरी के माध्यम से हमसे संपर्क करें।",
      },
    ],
    errorTitle: "गोपनीयता सूचना लोड करने में असमर्थ",
    errorMessage: "दस्तावेज़ पढ़ते समय एक अस्थायी त्रुटि हुई।",
    retryText: "पुनः प्रयास करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "यह नीति दस्तावेज़ वर्तमान सिस्टम नीति द्वारा लॉक है।",
    emptyTitle: "कोई सामग्री नहीं",
    emptyMessage: "गोपनीयता नीति अनुभाग वर्तमान में उपलब्ध नहीं हैं।",
    footerText: "मार्गम् • सरल भाषा गोपनीयता",
  },
  te: {
    title: "గోప్యతా నోటీసు",
    subtitle: "విద్యార్థులు, తల్లిదండ్రులు మరియు ఉపాధ్యాయుల కోసం సరళమైన భాషలో.",
    badge: "స్థానిక మరియు ప్రైవేట్",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. వ్యక్తిగత సమాచారం సేకరించము",
        body: "మేము మీ నిజమైన పేరు, ఈమెయిల్, ఫోన్ నంబర్, చిరునామా, పాఠశాల పేరు లేదా ఆధార్ సంఖ్యను అడగము. మీరు కేవలం ఒక ముద్దుపేరు మాత్రమే ఎంచుకుంటారు.",
      },
      {
        title: "2. బ్రౌజర్ లోకల్ స్టోరేజ్ మాత్రమే",
        body: "మీ గణిత పాఠాలు, పరీక్ష ఫలితాలు మరియు స్టిక్కర్లు మీ పరికర బ్రౌజర్‌లోనే ఉంటాయి. ఎలాంటి సమాచారం బాహ్య సర్వర్‌లకు పంపబడదు.",
      },
      {
        title: "3. ట్రాకింగ్ లేదా ప్రకటనలు లేవు",
        body: "మార్గంలో ఎలాంటి ప్రకటన ట్రాకర్లు లేదా నిఘా స్క్రిప్ట్‌లు లేవు. మేము ప్రొఫైల్‌లను నిర్మించము మరియు విద్యార్థుల సమాచారాన్ని విక్రయించము.",
      },
      {
        title: "4. మీకే పూర్తి నియంత్రణ",
        body: "హోమ్ స్క్రీన్‌లోని రీసెట్ బటన్ ద్వారా లేదా బ్రౌజర్ డేటా క్లియర్ చేయడం ద్వారా ఎప్పుడైనా మీ సమాచారాన్ని తొలగించవచ్చు.",
      },
      {
        title: "5. DPDP చట్టం అనుగుణ్యత",
        body: "మేము భారతీయ డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం సూత్రాలను ఖచ్చితంగా పాటిస్తాము: కనీస సమాచారం మరియు పారదర్శకత.",
      },
      {
        title: "6. సంప్రదించండి",
        body: "ఏవైనా ప్రశ్నలు ఉంటే ప్రాజెక్ట్ రిపోజిటరీ ద్వారా మమ్మల్ని సంప్రదించండి.",
      },
    ],
    errorTitle: "గోప్యతా నోటీసు లోడ్ చేయడం సాధ్యం కాలేదు",
    errorMessage: "పత్రాన్ని చదువుతున్నప్పుడు తాత్కాలిక లోపం సంభవించింది.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "ఈ పత్రం ప్రస్తుతం లాక్ చేయబడింది.",
    emptyTitle: "కంటెంట్ లేదు",
    emptyMessage: "గోప్యతా విభాగాల వివరాలు అందుబాటులో లేవు.",
    footerText: "మార్గం • సరళ భాష గోప్యత",
  },
};

function PrivacyView() {
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

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const content = PRIVACY_CONTENT[currentLang] || PRIVACY_CONTENT.en;

  // Offline banner forced by query param or network
  const showOfflineBanner = !isOnline || stateParam === "offline";

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] flex flex-col justify-between pb-safe">
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
      <header className="border-b-[3px] border-[#111111] bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Margam Home"
            className="flex items-center gap-2.5 min-h-[48px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFE14D] border-[2px] border-[#111111] flex items-center justify-center text-[#111111] shadow-[2px_2px_0px_#111111]">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-xl text-[#111111]">
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
              className="min-h-[48px] min-w-[48px] px-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111] hover:bg-[#FFE14D] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
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
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-[24px_16px_28px_18px/18px_26px_16px_24px] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FFE14D] border-[3px] border-[#111111] flex items-center justify-center shadow-[3px_3px_0px_#111111]">
              <Lock className="w-7 h-7 text-[#111111]" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-heading font-extrabold text-[#111111]">
              {content.lockedTitle}
            </h1>
            <p className="text-sm font-bold text-[#555555]">
              {content.lockedMessage}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[48px] px-6 text-sm font-extrabold bg-[#FFE14D] border-[3px] border-[#111111] rounded-xl shadow-[3px_3px_0px_#111111] hover:bg-[#FFD700] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
            >
              {content.backText}
            </Link>
          </div>
        )}

        {/* Error state with retry */}
        {!isLoading && !isLocked && hasError && (
          <div className="bg-[#FFFFFF] border-[3px] border-[#111111] rounded-[24px_16px_28px_18px/18px_26px_16px_24px] shadow-[4px_4px_0px_#111111] p-6 sm:p-8 text-center space-y-4">
            <h1 className="text-xl font-heading font-extrabold text-[#111111]">
              {content.errorTitle}
            </h1>
            <p className="text-sm font-bold text-[#555555]">
              {content.errorMessage}
            </p>
            <Button
              variant="yellow"
              size="sm"
              onClick={() => setHasError(false)}
              className="min-h-[48px] inline-flex items-center gap-2"
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
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-[24px_16px_28px_18px/18px_26px_16px_24px] border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b-[2px] border-[#111111]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#8DE86A] border-[2px] border-[#111111] flex items-center justify-center shadow-[2px_2px_0px_#111111] shrink-0 mt-0.5">
                  <ShieldCheck
                    className="w-6 h-6 text-[#111111]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#111111]">
                    {content.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#555555] mt-0.5">
                    {content.subtitle}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-black px-2.5 py-1 bg-[#FFE14D] border-[2px] border-[#111111] rounded-lg shadow-[2px_2px_0px_#111111]">
                {content.badge}
              </span>
            </div>

            <div className="space-y-5 text-sm sm:text-base leading-relaxed text-[#111111]">
              {content.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="p-4 bg-[#FFF8DC] border-[2px] border-[#111111] rounded-xl space-y-1.5"
                >
                  <h2 className="font-heading font-extrabold text-base text-[#111111]">
                    {sec.title}
                  </h2>
                  <p className="font-medium text-[#222222]">{sec.body}</p>
                </section>
              ))}
            </div>

            {/* Cross navigation between policies */}
            <nav
              aria-label="Related policies"
              className="pt-4 border-t-[2px] border-[#111111] flex flex-wrap gap-3"
            >
              <Link
                href="/terms"
                className="min-h-[48px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111] hover:bg-[#FFE14D] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Terms of Service</span>
              </Link>
              <Link
                href="/cookies"
                className="min-h-[48px] px-4 py-2 inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111] hover:bg-[#FFE14D] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>Cookie Policy</span>
              </Link>
            </nav>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#111111] py-4 text-center text-xs font-bold text-[#555555] bg-[#FFFFFF]">
        {content.footerText}
      </footer>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8DC] p-6">
          <SkeletonCard />
        </div>
      }
    >
      <PrivacyView />
    </Suspense>
  );
}
