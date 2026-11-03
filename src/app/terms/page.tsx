"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  FileCheck,
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

interface TermSection {
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
    sections: TermSection[];
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
    title: "Terms of Service",
    subtitle: "Educational platform terms for learners, educators, and schools.",
    badge: "NCERT Curriculum",
    backText: "Back to Home",
    errorTitle: "Terms Unavailable",
    errorMessage: "The terms of service document could not be rendered right now.",
    retryText: "Reload Terms",
    lockedTitle: "Access Restricted",
    lockedMessage: "Terms of service are temporarily unavailable.",
    emptyTitle: "No Content Found",
    emptyMessage: "The terms document contains no readable sections.",
    footerText: "Margam • Built for Indian students and teachers across Classes 6–10",
    sections: [
      {
        title: "1. Educational Purpose & Non-Commercial Use",
        body: "Margam is provided free of charge for Indian school students and mathematics educators in Classes 6 through 10. The platform is designed strictly for foundational mathematics learning and pedagogical gap diagnosis.",
      },
      {
        title: "2. Curriculum & Content Alignment",
        body: "All concept hierarchies, diagnostic items, and practice exercises align with the National Council of Educational Research and Training (NCERT 2024–26) syllabus for Indian middle and secondary schools.",
      },
      {
        title: "3. Account Security & Recovery Codes",
        body: "Students authenticate without email addresses or phone numbers. Learners are responsible for saving their deterministic recovery codes to restore progress on other devices.",
      },
      {
        title: "4. Teacher Supervision & Class Hubs",
        body: "Teachers creating classroom spaces do so with student educational welfare in mind. Roster analytics are provided solely for targeted remedial assistance.",
      },
      {
        title: "5. Availability & Service Continuity",
        body: "Margam is an educational submission for Code Kernel '26. We strive to provide reliable offline-first support and deterministic client storage across devices.",
      },
    ],
  },
  hi: {
    title: "सेवा की शर्तें",
    subtitle: "विद्यार्थियों, शिक्षकों और विद्यालयों के लिए शैक्षिक नियम।",
    badge: "एनसीईआरटी पाठ्यक्रम",
    backText: "होम पर लौटें",
    errorTitle: "शर्तें अनुपलब्ध हैं",
    errorMessage: "सेवा की शर्तें इस समय लोड नहीं की जा सकीं।",
    retryText: "पुनः लोड करें",
    lockedTitle: "पहुंच प्रतिबंधित है",
    lockedMessage: "शर्तें दस्तावेज़ अस्थायी रूप से अनुपलब्ध है।",
    emptyTitle: "कोई सामग्री नहीं मिली",
    emptyMessage: "दस्तावेज़ में कोई अनुभाग उपलब्ध नहीं है।",
    footerText: "मार्गम् • कक्षा 6-10 के विद्यार्थियों और शिक्षकों के लिए निर्मित",
    sections: [
      {
        title: "1. शैक्षिक उद्देश्य",
        body: "मार्गम् कक्षा 6 से 10 तक के भारतीय विद्यार्थियों और शिक्षकों के लिए निःशुल्क उपलब्ध कराया गया है।",
      },
      {
        title: "2. पाठ्यक्रम संरेखण",
        body: "सभी अवधारणाएं और प्रश्न एनसीईआरटी पाठ्यक्रम (2024-26) के अनुरूप हैं।",
      },
      {
        title: "3. खाता सुरक्षा",
        body: "विद्यार्थी बिना ईमेल के प्रमाणीकरण करते हैं और प्रगति पुनर्प्राप्त करने के लिए रिकवरी कोड का उपयोग करते हैं।",
      },
      {
        title: "4. शिक्षक उपयोग",
        body: "शिक्षक कक्षा में विद्यार्थियों की गणितीय कठिनाइयों को समझने के लिए इसका उपयोग करते हैं।",
      },
      {
        title: "5. उपलब्धता",
        body: "मार्गम् ऑफ़लाइन-प्रथम कार्यक्षमता का समर्थन करता है।",
      },
    ],
  },
  te: {
    title: "సేవా నిబంధనలు",
    subtitle: "విద్యార్థులు, ఉపాధ్యాయులు మరియు పాఠశాలల కోసం విద్యా నియమాలు.",
    badge: "ఎన్‌సిఇఆర్‌టి సిలబస్",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    errorTitle: "నిబంధనలు అందుబాటులో లేవు",
    errorMessage: "సేవా నిబంధనల పత్రం ప్రస్తుతం తెరవబడలేదు.",
    retryText: "మళ్లీ ప్రయత్నించండి",
    lockedTitle: "యాక్సెస్ పరిమితం చేయబడింది",
    lockedMessage: "నిబంధనలు తాత్కాలికంగా అందుబాటులో లేవు.",
    emptyTitle: "విషయం కనుగొనబడలేదు",
    emptyMessage: "ఈ పత్రంలో చదవడానికి సమాచారం లేదు.",
    footerText: "మార్గం • 6–10 తరగతుల విద్యార్థులు మరియు ఉపాధ్యాయుల కోసం నిర్మితం",
    sections: [
      {
        title: "1. విద్యా ప్రయోజనం",
        body: "మార్గం 6 నుండి 10వ తరగతి విద్యార్థులు మరియు ఉపాధ్యాయుల కోసం ఉచితంగా అందించబడుతుంది.",
      },
      {
        title: "2. సిలబస్ అనుసరణ",
        body: "అన్ని కాన్సెప్ట్‌లు ఎన్‌సిఇఆర్‌టి సిలబస్‌కు అనుగుణంగా రూపొందించబడ్డాయి.",
      },
      {
        title: "3. ఖాతా భద్రత",
        body: "విద్యార్థులు ఇమెయిల్ లేకుండా లాగిన్ అవుతారు మరియు రికవరీ కోడ్‌లను భద్రపరుచుకుంటారు.",
      },
      {
        title: "4. ఉపాధ్యాయ పర్యవేక్షణ",
        body: "ఉపాధ్యాయులు తరగతిలో విద్యార్థుల అవగాహనను పరిశీలించడానికి దీనిని ఉపయోగిస్తారు.",
      },
      {
        title: "5. లభ్యత",
        body: "మార్గం ఆఫ్‌లైన్ కార్యాచరణకు మద్దతు ఇస్తుంది.",
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF7E6] p-8 text-center font-heading">Loading Terms of Service...</div>}>
      <TermsContent />
    </Suspense>
  );
}

function TermsContent() {
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

  const content = TERMS_CONTENT[currentLang] || TERMS_CONTENT.en;
  const showOfflineBanner = !isOnline || stateParam === "offline";

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between pb-safe">
      {showOfflineBanner && (
        <div className="fixed top-2 left-4 right-4 z-50 max-w-[480px] mx-auto">
          <Toast
            type="offline"
            message="You are viewing the saved offline terms of service."
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
                  <FileCheck
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

      <footer className="border-t-[3px] border-[#422816] py-4 text-center text-xs font-sans font-medium text-[#FFF7E6] bg-[#5A3720]">
        {content.footerText}
      </footer>
    </div>
  );
}
