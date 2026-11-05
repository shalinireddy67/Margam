"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X, Check, Settings2, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupportedLanguage } from "@/lib/types";

const COOKIE_STORAGE_KEY = "margam_cookie_consent";

export interface CookiePreferences {
  essential: true;
  practiceCache: boolean;
  timestamp: string;
}

const CONSENT_TEXT = {
  en: {
    bannerTitle: "Cookie & Local Storage Notice",
    bannerText:
      "Margam uses essential local storage on your device to remember your class grade, lesson progress, and language preference. Zero tracking cookies, zero ads. We respect student privacy.",
    acceptAll: "Accept All",
    essentialOnly: "Essential Only",
    customize: "Cookie Settings",
    learnMore: "Learn more in our",
    cookiePolicyLink: "Cookie Policy",
    privacyLink: "Privacy Notice",
    modalTitle: "Cookie & Storage Preferences",
    modalSubtitle:
      "Margam is aligned with India's DPDP Act 2023. We store learning data locally inside your browser and never track you across the web.",
    essentialTitle: "1. Essential Storage (Strictly Necessary)",
    essentialDesc:
      "Required for the learning application to function. Stores your selected grade (Classes 6–10), completed lessons, mastery scores, streak count, and language. Cannot be disabled.",
    alwaysActive: "Always Active",
    cacheTitle: "2. Practice & Quiz Session Cache",
    cacheDesc:
      "Allows your browser to temporarily store active question answers and diagnostic worksheets so a page refresh does not reset your ongoing math attempt.",
    savePreferences: "Save Preferences",
    close: "Close",
    savedNotice: "Preferences saved successfully.",
  },
  hi: {
    bannerTitle: "कुकी और स्थानीय संग्रहण सूचना",
    bannerText:
      "मार्गम् आपकी कक्षा, पाठों की प्रगति और भाषा प्राथमिकता को याद रखने के लिए केवल आवश्यक स्थानीय संग्रहण का उपयोग करता है। शून्य ट्रैकर, शून्य विज्ञापन। आपकी गोपनीयता हमारी प्राथमिकता है।",
    acceptAll: "सभी स्वीकार करें",
    essentialOnly: "केवल आवश्यक",
    customize: "कुकी सेटिंग्स",
    learnMore: "अधिक जानकारी के लिए हमारी",
    cookiePolicyLink: "कुकी नीति",
    privacyLink: "गोपनीयता नीति",
    modalTitle: "कुकी और संग्रहण प्राथमिकताएँ",
    modalSubtitle:
      "मार्गम् भारत के डीपीडीपी अधिनियम 2023 के तहत गोपनीयता-प्रथम सिद्धांत पर बनाया गया है। सारा डेटा आपके ब्राउज़र में रहता है।",
    essentialTitle: "1. आवश्यक संग्रहण (अनिवार्य)",
    essentialDesc:
      "मंच के संचालन के लिए आवश्यक है। आपकी चुनी हुई कक्षा (कक्षा 6–10), पाठ प्रगति, स्ट्रीक और भाषा को सहेजता है। इसे अक्षम नहीं किया जा सकता।",
    alwaysActive: "सदैव सक्रिय",
    cacheTitle: "2. अभ्यास सत्र और जांच कैश",
    cacheDesc:
      "अभ्यास के दौरान आपके उत्तरों को अस्थायी रूप से याद रखता है ताकि पृष्ठ रीलोड होने पर आपका चालू क्विज़ सुरक्षित रहे।",
    savePreferences: "प्राथमिकताएँ सहेजें",
    close: "बंद करें",
    savedNotice: "प्राथमिकताएँ सफलतापूर्वक सहेजी गईं।",
  },
  te: {
    bannerTitle: "కుకీ మరియు స్థానిక నిల్వ సమాచారం",
    bannerText:
      "మీ తరగతి, పాఠాల పురోగతి మరియు భాషా ఎంపికను గుర్తుంచుకోవడానికి మార్గం అవసరమైన స్థానిక నిల్వను మాత్రమే ఉపయోగిస్తుంది. జీరో ట్రాకర్లు, జీరో ప్రకటనలు. మీ గోప్యతకు పూర్తి భద్రత.",
    acceptAll: "అన్నీ అంగీకరించండి",
    essentialOnly: "అవసరమైనవి మాత్రమే",
    customize: "కుకీ సెట్టింగ్‌లు",
    learnMore: "మరిన్ని వివరాలకు మా",
    cookiePolicyLink: "కుకీ విధానం",
    privacyLink: "గోప్యతా విధానం",
    modalTitle: "కుకీ మరియు నిల్వ ప్రాధాన్యతలు",
    modalSubtitle:
      "మార్గం భారత డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ యాక్ట్ (DPDP 2023) మార్గదర్శకాలకు అనుగుణంగా రూపొందించబడింది. సమాచారం మీ బ్రౌజర్‌లోనే ఉంటుంది.",
    essentialTitle: "1. అవసరమైన నిల్వ (తప్పనిసరి)",
    essentialDesc:
      "అప్లికేషన్ పనిచేయడానికి ఇది తప్పనిసరి. మీరు ఎంచుకున్న తరగతి (6–10 తరగతులు), పూర్తి చేసిన పాఠాలు, స్ట్రీక్ మరియు భాషను భద్రపరుస్తుంది. దీనిని నిలిపివేయడం సాధ్యం కాదు.",
    alwaysActive: "ఎల్లప్పుడూ క్రియాశీలం",
    cacheTitle: "2. సాధన సెషన్ మరియు పరీక్షల కాష్",
    cacheDesc:
      "సాధన సమయంలో మీ సమాధానాలను తాత్కాలికంగా గుర్తుంచుకోవడం ద్వారా పేజీ రీఫ్రెష్ అయినా పురోగతి చెరిగిపోకుండా ఉంటుంది.",
    savePreferences: "ప్రాధాన్యతలను భద్రపరచండి",
    close: "మూసివేయి",
    savedNotice: "ప్రాధాన్యతలు విజయవంతంగా భద్రపరచబడ్డాయి.",
  },
};

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("margam_open_cookie_settings"));
  }
}

export function CookieConsent() {
  const { lang } = useLanguage();
  const currentLang: SupportedLanguage = (lang as SupportedLanguage) || "en";
  const t = CONSENT_TEXT[currentLang] || CONSENT_TEXT.en;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [practiceCache, setPracticeCache] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!stored) {
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPracticeCache(parsed.practiceCache !== false);
      }
    } catch {
      setShowBanner(true);
    }
    setHasLoaded(true);

    const handleOpenModal = () => {
      setShowModal(true);
    };

    window.addEventListener("margam_open_cookie_settings", handleOpenModal);
    return () => {
      window.removeEventListener("margam_open_cookie_settings", handleOpenModal);
    };
  }, []);

  const saveConsent = (allowCache: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      practiceCache: allowCache,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
    setPracticeCache(allowCache);
    setShowBanner(false);
    setShowModal(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  if (!hasLoaded) return null;

  return (
    <>
      {/* ================================================================= */}
      {/* 1. BOTTOM CONSENT BANNER (Soft Warm Cream, High-Contrast Ink)     */}
      {/* ================================================================= */}
      {showBanner && (
        <aside
          role="region"
          aria-label={t.bannerTitle}
          data-panel="cookie-banner"
          className="fixed bottom-0 inset-x-0 z-50 bg-[#FAF6EC] text-[#1E1610] border-t-[3px] border-[#1E1610] shadow-[0px_-4px_16px_rgba(30,22,16,0.12)] p-4 sm:p-5 transition-transform"
        >
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left: Icon & Explanatory Text */}
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-[2px] bg-[#EFE8D8] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-[#5A3720]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610] m-0">
                    {t.bannerTitle}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-heading font-extrabold bg-[#EFE8D8] text-[#1E1610] border border-[#1E1610] rounded-[2px]">
                    <ShieldCheck className="w-3 h-3 text-[#5DAA3A]" />
                    Zero Trackers
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed max-w-3xl m-0">
                  {t.bannerText}{" "}
                  <span className="text-[#5A3720]">
                    {t.learnMore}{" "}
                    <Link
                      href="/cookies"
                      className="font-bold text-[#2F4FB5] underline hover:text-[#1E1610]"
                    >
                      {t.cookiePolicyLink}
                    </Link>{" "}
                    &amp;{" "}
                    <Link
                      href="/privacy"
                      className="font-bold text-[#2F4FB5] underline hover:text-[#1E1610]"
                    >
                      {t.privacyLink}
                    </Link>
                    .
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold text-[#5A3720] hover:text-[#1E1610] bg-[#FAF6EC] hover:bg-[#EFE8D8] border-2 border-[#1E1610]/60 hover:border-[#1E1610] rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{t.customize}</span>
              </button>

              <button
                type="button"
                onClick={() => saveConsent(false)}
                className="min-h-[42px] px-4 py-2 text-xs font-heading font-extrabold text-[#1E1610] bg-[#EFE8D8] hover:bg-[#E2D6C0] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
              >
                {t.essentialOnly}
              </button>

              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="min-h-[42px] px-5 py-2 text-xs font-heading font-extrabold text-[#1E1610] bg-[#5DAA3A] hover:bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
              >
                {t.acceptAll}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ================================================================= */}
      {/* 2. SETTINGS MODAL (Soft Warm Cream, High-Contrast Typography)     */}
      {/* ================================================================= */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1610]/60 backdrop-blur-[2px]"
        >
          <div className="relative w-full max-w-xl bg-[#FAF6EC] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[6px_6px_0px_#1E1610] rounded-[2px] max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b-2 border-[#1E1610]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[2px] bg-[#EFE8D8] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-[#5A3720]" />
                </div>
                <div>
                  <h2
                    id="cookie-modal-title"
                    className="font-heading font-extrabold text-base sm:text-lg text-[#1E1610] m-0"
                  >
                    {t.modalTitle}
                  </h2>
                  <p className="font-sans text-xs text-[#5A3720] m-0 mt-0.5">
                    India DPDP Act 2023 · Privacy by Design
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-[2px] border-2 border-[#1E1610] bg-[#FAF6EC] hover:bg-[#EFE8D8] text-[#1E1610] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5]"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#2B1B0F] leading-relaxed m-0">
              {t.modalSubtitle}
            </p>

            {/* Storage Preference Categories */}
            <div className="space-y-3.5">
              {/* Essential Storage */}
              <div className="p-4 bg-[#FFFDF7] border-2 border-[#1E1610]/30 rounded-[2px] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#5DAA3A]" />
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1E1610] m-0">
                      {t.essentialTitle}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-heading font-bold bg-[#EFE8D8] text-[#1E1610] border border-[#1E1610] rounded-[2px]">
                    {t.alwaysActive}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed m-0">
                  {t.essentialDesc}
                </p>
              </div>

              {/* Practice Cache */}
              <div className="p-4 bg-[#FFFDF7] border-2 border-[#1E1610]/30 rounded-[2px] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="toggle-practice-cache"
                    className="font-heading font-bold text-xs sm:text-sm text-[#1E1610] cursor-pointer flex items-center gap-2"
                  >
                    <span>{t.cacheTitle}</span>
                  </label>
                  <input
                    id="toggle-practice-cache"
                    type="checkbox"
                    checked={practiceCache}
                    onChange={(e) => setPracticeCache(e.target.checked)}
                    className="w-4 h-4 accent-[#5DAA3A] cursor-pointer"
                  />
                </div>
                <p className="font-sans text-xs text-[#2B1B0F] leading-relaxed m-0">
                  {t.cacheDesc}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#1E1610]/20">
              <div className="flex items-center gap-3 text-xs">
                <Link
                  href="/cookies"
                  onClick={() => setShowModal(false)}
                  className="font-bold text-[#2F4FB5] underline hover:text-[#1E1610]"
                >
                  {t.cookiePolicyLink}
                </Link>
                <span>·</span>
                <Link
                  href="/privacy"
                  onClick={() => setShowModal(false)}
                  className="font-bold text-[#2F4FB5] underline hover:text-[#1E1610]"
                >
                  {t.privacyLink}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="min-h-[40px] px-3.5 py-1.5 text-xs font-heading font-bold text-[#5A3720] hover:text-[#1E1610] bg-[#FAF6EC] hover:bg-[#EFE8D8] border-2 border-[#1E1610]/60 rounded-[2px] transition-all cursor-pointer"
                >
                  {t.close}
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent(practiceCache)}
                  className="min-h-[40px] px-4 py-1.5 text-xs font-heading font-extrabold text-[#1E1610] bg-[#5DAA3A] hover:bg-[#6DB33F] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-[2px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  {t.savePreferences}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#FAF6EC] text-[#1E1610] border-2 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] px-4 py-2.5 rounded-[2px] flex items-center gap-2 text-xs font-heading font-bold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#5DAA3A]" />
          <span>{t.savedNotice}</span>
        </div>
      )}
    </>
  );
}

export default CookieConsent;

