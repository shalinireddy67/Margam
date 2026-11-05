"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  Button,
  Card,
  Tile,
  Input,
  Chip,
  LanguageToggle,
  BottomTabBar,
  Toast,
  SkeletonCard,
  EmptyState,
  StarRating,
  MistakeCreature,
  type Language,
} from "@/components/ui";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const [lang, setLang] = useState<Language>("en");
  const [chipSelected, setChipSelected] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const copy = {
    en: {
      title: "Margam Design System",
      subtitle: "Screen 1 Tokens, Typography & Base Components",
      buttons: "Action Buttons",
      chips: "Filter Chips",
      ratings: "Star Difficulty Ratings",
      cards: "Content Cards",
      tiles: "Chapter Tiles (App States)",
      creatures: "Original Mistake Creatures",
      inputs: "Input Fields",
      alerts: "Alerts & Status Toasts",
      skeletons: "Loading Skeletons & Empty States",
      sampleHeading: "Class 10 Quadratic Equations",
      sampleBody: "Find roots using the quadratic formula and check negative signs carefully.",
    },
    hi: {
      title: "मार्गम् डिज़ाइन सिस्टम",
      subtitle: "स्क्रीन 1 टोकन, टाइपोग्राफी और बेस कंपोनेंट्स",
      buttons: "एक्शन बटन",
      chips: "फ़िल्टर चिप्स",
      ratings: "कठिनाई स्टार रेटिंग",
      cards: "कंटेंट कार्ड्स",
      tiles: "अध्याय टाइल्स",
      creatures: "मूल मिस्टेक क्रिएचर्स",
      inputs: "इनपुट फ़ील्ड्स",
      alerts: "अलर्ट और टोस्ट",
      skeletons: "लोडिंग स्केलेटन और खाली स्थिति",
      sampleHeading: "कक्षा 10 द्विघात समीकरण",
      sampleBody: "द्विघात सूत्र का उपयोग करके मूल ज्ञात करें और ऋणात्मक चिह्नों की सावधानीपूर्वक जांच करें।",
    },
    te: {
      title: "మార్గం డిజైన్ సిస్టమ్",
      subtitle: "స్క్రీన్ 1 టోకెన్లు, టైపోగ్రఫీ మరియు బేస్ కాంపోనెంట్స్",
      buttons: "యాక్షన్ బటన్లు",
      chips: "ఫిల్టర్ చిప్స్",
      ratings: "కష్టతరం స్టార్ రేటింగ్‌లు",
      cards: "కంటెంట్ కార్డులు",
      tiles: "అధ్యాయం టైల్స్",
      creatures: "ఒరిజినల్ మిస్టేక్ క్రీచర్స్",
      inputs: "ఇన్‌పుట్ ఫీల్డ్‌లు",
      alerts: "హెచ్చరికలు మరియు టోస్ట్‌లు",
      skeletons: "లోడింగ్ అస్థిపంజరం మరియు ఖాళీ స్థితి",
      sampleHeading: "తరగతి 10 వర్గ సమీకరణాలు",
      sampleBody: "వర్గ సమీకరణ సూత్రాన్ని ఉపయోగించి మూలాలను కనుగొనండి మరియు రుణ గుర్తులను జాగ్రత్తగా పరిశీలించండి.",
    },
  }[lang];

  return (
    <div
      data-testid="design-system-root"
      className="min-h-screen bg-[#FFF8DC] text-[#111111] pb-24 px-4 sm:px-6 pt-6 max-w-4xl mx-auto overflow-x-hidden"
    >
      {/* Top Header & Language Toggle */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-[3px] border-[#111111] mb-8">
        <div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#111111] leading-tight">
            {copy.title}
          </h1>
          <p className="font-sans font-bold text-base text-[#111111]/80 mt-1">
            {copy.subtitle}
          </p>
        </div>
        <div className="shrink-0">
          <LanguageToggle currentLang={lang} onLanguageChange={setLang} />
        </div>
      </header>

      <main id="main-content" className="space-y-12">
        {/* Typography Showcase */}
        <section aria-labelledby="typography-heading" className="space-y-4">
          <h2
            id="typography-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            Typography & Live Script ({lang.toUpperCase()})
          </h2>
          <Card color="white" className="space-y-2">
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111111]">
              {copy.sampleHeading}
            </h3>
            <p className="font-sans text-lg text-[#111111] leading-relaxed">
              {copy.sampleBody}
            </p>
            <p className="text-xs font-bold text-[#666666]">
              Headings: Baloo 2 / Baloo Tammudu 2 (600, 800), Body: Nunito / Noto Sans (400, 700)
            </p>
          </Card>
        </section>

        {/* Buttons Showcase */}
        <section aria-labelledby="buttons-heading" className="space-y-4">
          <h2
            id="buttons-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            {copy.buttons}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="yellow">Yellow primary</Button>
            <Button variant="cyan">Cyan</Button>
            <Button variant="pink">Pink accent</Button>
            <Button variant="green">Green success</Button>
            <Button variant="sky">Sky blue</Button>
            <Button variant="orange">Orange</Button>
            <Button variant="white">White</Button>
            <Button variant="ink">Dark ink</Button>
            <Button variant="yellow" disabled>Disabled state</Button>
          </div>
        </section>

        {/* Chips & Star Ratings */}
        <section aria-labelledby="chips-ratings-heading" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2
              id="chips-ratings-heading"
              className="font-heading font-extrabold text-2xl text-[#111111]"
            >
              {copy.chips}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <Chip
                selected={chipSelected}
                onClick={() => setChipSelected(!chipSelected)}
              >
                {chipSelected ? "Selected (Inverted)" : "Click to Select"}
              </Chip>
              <Chip selected={false}>Class 10</Chip>
              <Chip selected={false}>Algebra</Chip>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-[#111111]">
              {copy.ratings}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StarRating rating={1} max={3} />
                <span className="text-sm font-bold">Difficulty 1 of 3</span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={2} max={3} />
                <span className="text-sm font-bold">Difficulty 2 of 3</span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={3} max={3} />
                <span className="text-sm font-bold">Difficulty 3 of 3</span>
              </div>
            </div>
          </div>
        </section>

        {/* Original Hand-drawn Mistake Creatures */}
        <section aria-labelledby="creatures-heading" className="space-y-4">
          <h2
            id="creatures-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            {copy.creatures}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card color="pink" className="flex flex-col items-center text-center p-3">
              <MistakeCreature type="sign_slip" size="default" />
              <h4 className="font-heading font-extrabold text-base mt-2">Sign Slip</h4>
              <p className="text-xs font-bold text-[#111111]/80">Minus goblin</p>
            </Card>

            <Card color="cyan" className="flex flex-col items-center text-center p-3">
              <MistakeCreature type="fraction_fumble" size="default" />
              <h4 className="font-heading font-extrabold text-base mt-2">Fraction Fumble</h4>
              <p className="text-xs font-bold text-[#111111]/80">Split balancer</p>
            </Card>

            <Card color="yellow" className="flex flex-col items-center text-center p-3">
              <MistakeCreature type="distribution_dodge" size="default" />
              <h4 className="font-heading font-extrabold text-base mt-2">Distribution Dodge</h4>
              <p className="text-xs font-bold text-[#111111]/80">Brackets lurker</p>
            </Card>

            <Card color="orange" className="flex flex-col items-center text-center p-3">
              <MistakeCreature type="calculation_slip" size="default" />
              <h4 className="font-heading font-extrabold text-base mt-2">Calculation Slip</h4>
              <p className="text-xs font-bold text-[#111111]/80">Spiraling bouncy</p>
            </Card>
          </div>
        </section>

        {/* Chapter Tiles (3 Real Chapter States: available, in_progress, coming_soon) */}
        <section aria-labelledby="tiles-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h2
              id="tiles-heading"
              className="font-heading font-extrabold text-2xl text-[#111111]"
            >
              {copy.tiles}
            </h2>
            <span className="text-xs font-bold text-[#666666]">
              Chapter states: available, in progress, coming soon
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Tile
              title="Quadratic Equations"
              subtitle="Class 10, Chapter 4"
              state="available"
              color="yellow"
              diagnosticHref="#diagnose"
              practiceHref="#practice"
            />
            <Tile
              title="Coordinate Geometry"
              subtitle="Class 10, Chapter 7"
              state="in_progress"
              color="cyan"
              practiceHref="#practice"
              lessonHref="#learn"
            />
            <Tile
              title="Triangles & Similarity"
              subtitle="Class 10, Chapter 6"
              state="coming_soon"
            />
          </div>

          {/* Lesson Tile (Locked State - For lessons only) */}
          <div className="pt-2">
            <p className="text-xs font-extrabold text-[#111111] uppercase tracking-wider mb-2">
              Lesson Tile (Locked State — Lessons Only)
            </p>
            <Tile
              title="Concept Remediation: Negative Integers"
              subtitle="Prerequisite concept, complete previous lesson first"
              state="locked"
              kind="lesson"
            />
          </div>
        </section>

        {/* Inputs */}
        <section aria-labelledby="inputs-heading" className="space-y-4">
          <h2
            id="inputs-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            {copy.inputs}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student-name-input" className="block font-heading font-bold text-sm mb-1">
                Student Name
              </label>
              <Input
                id="student-name-input"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (e.target.value.length > 0) setInputError("");
                }}
              />
            </div>
            <div>
              <label htmlFor="test-code-input" className="block font-heading font-bold text-sm mb-1">
                Class Code (Validation Error Preview)
              </label>
              <Input
                id="test-code-input"
                placeholder="e.g. 10A-MATH"
                error={inputError || "Please enter a valid 6-character code"}
                onChange={() => setInputError("")}
              />
            </div>
          </div>
        </section>

        {/* Alerts & Toasts */}
        <section aria-labelledby="alerts-heading" className="space-y-4">
          <h2
            id="alerts-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            {copy.alerts}
          </h2>
          <div className="space-y-3">
            <Toast
              type="success"
              title="Progress Saved"
              message="Your diagnostic answers have been synced successfully."
            />
            <Toast
              type="error"
              title="Connection Issue"
              message="Failed to load lesson assets. You can retry safely."
              onRetry={() => alert("Retrying load...")}
            />
            <Toast
              type="offline"
              title="Offline Mode Active"
              message="Saved lessons and questions still work without internet."
            />
          </div>
        </section>

        {/* Loading Skeletons & Empty State */}
        <section aria-labelledby="skeletons-heading" className="space-y-4">
          <h2
            id="skeletons-heading"
            className="font-heading font-extrabold text-2xl text-[#111111]"
          >
            {copy.skeletons}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard />
            <EmptyState
              title="No Active Gaps Found"
              description="Great job! You answered all questions correctly in this diagnostic."
              actionLabel="Start Next Chapter"
              onAction={() => alert("Next chapter selected")}
            />
          </div>
        </section>
      </main>

      {/* Student Bottom Tab Bar (Preview on Design System) */}
      <BottomTabBar currentTab="home" />
    </div>
  );
}
