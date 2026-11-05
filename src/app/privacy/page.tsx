import React from "react";
import { LegalPageViewer, type LegalDocument } from "@/components/legal/LegalPageViewer";

const PRIVACY_CONTENT: Record<"en" | "hi" | "te", LegalDocument> = {
  en: {
    badge: "Privacy notice",
    title: "Privacy notice",
    subtitle: "Plain-language notice for students, parents, and teachers.",
    lastUpdated: "5 November 2026",
    backText: "Back to home",
    sections: [
      {
        title: "1. No personal contact information asked",
        body: "Students use Margam without giving an email address, phone number, real name, or government ID. Account access uses a self-chosen username and a recovery code generated for your device.",
      },
      {
        title: "2. What we collect and store",
        body: "We store only mathematical progression data: diagnostic responses, concept status, practice attempts, and earned badges. This data is used solely to find the earlier topics you missed and walk you back to fix them.",
      },
      {
        title: "3. No ad trackers or advertising cookies",
        body: "Margam has no advertisements and does not load advertising trackers, tracking pixels, or marketing scripts. We do not sell or share student learning data.",
      },
      {
        title: "4. Teacher and classroom view",
        body: "When a student joins a class using a teacher-provided code, the teacher sees concept progress and prerequisite gaps to guide classroom teaching. Teachers cannot see personal contact details.",
      },
      {
        title: "5. Resetting your data",
        body: "Students can reset their profile at any time from the profile screen. Guest progress stored in your browser can be cleared by deleting your browser site data.",
      },
      {
        title: "6. Questions and contact",
        body: "If you have questions about your data or this notice, please open an issue at https://github.com/shalinireddy67/Margam/issues.",
      },
    ],
  },
  hi: {
    badge: "गोपनीयता सूचना",
    title: "गोपनीयता सूचना",
    subtitle: "विद्यार्थियों, अभिभावकों और शिक्षकों के लिए सरल भाषा में सूचना।",
    lastUpdated: "5 November 2026",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. कोई व्यक्तिगत संपर्क जानकारी नहीं मांगी जाती",
        body: "विद्यार्थी बिना ईमेल या फ़ोन नंबर के मार्गम् का उपयोग करते हैं। केवल उपयोगकर्ता नाम और रिकवरी कोड का उपयोग किया जाता है।",
      },
      {
        title: "2. हम क्या संग्रहीत करते हैं",
        body: "हम केवल गणितीय प्रगति डेटा संग्रहीत करते हैं: जांच परीक्षा के उत्तर, अवधारणा स्तर और अभ्यास प्रयास ताकि पिछली कमियों को सुधारा जा सके।",
      },
      {
        title: "3. कोई विज्ञापन ट्रैकर नहीं",
        body: "मार्गम् में कोई विज्ञापन नहीं हैं और न ही कोई विज्ञापन ट्रैकर या मार्केटिंग स्क्रिप्ट है।",
      },
      {
        title: "4. शिक्षक दृश्य",
        body: "जब कोई विद्यार्थी कक्षा कोड से जुड़ता है, तो शिक्षक केवल सीखने की कमियों को देख सकते हैं, कोई व्यक्तिगत संपर्क विवरण नहीं।",
      },
      {
        title: "5. डेटा रीसेट करना",
        body: "विद्यार्थी प्रोफ़ाइल स्क्रीन से कभी भी अपना डेटा रीसेट कर सकते हैं।",
      },
      {
        title: "6. संपर्क",
        body: "यदि आपके कोई प्रश्न हैं, तो कृपया यहां संपर्क करें: https://github.com/shalinireddy67/Margam/issues.",
      },
    ],
  },
  te: {
    badge: "గోప్యతా నోటీసు",
    title: "గోప్యతా నోటీసు",
    subtitle: "విద్యార్థులు, తల్లిదండ్రులు మరియు ఉపాధ్యాయుల కోసం సరళమైన వివరణ.",
    lastUpdated: "5 November 2026",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. వ్యక్తిగత సంప్రదింపు సమాచారం అడగము",
        body: "విద్యార్థులు ఈమెయిల్ లేదా ఫోన్ నంబర్ ఇవ్వకుండానే మార్గంను ఉపయోగించవచ్చు. కేవలం యూజర్‌నేమ్ మరియు రికవరీ కోడ్ ఉపయోగిస్తాము.",
      },
      {
        title: "2. మేము సేకరించే సమాచారం",
        body: "మేము కేవలం గణిత అభ్యాస సమాచారాన్ని మాత్రమే నిల్వ చేస్తాము: రోగనిర్ధారణ సమాధానాలు, కాన్సెప్ట్ స్థాయిలు మరియు సాధన వివరాలు.",
      },
      {
        title: "3. ఎలాంటి ప్రకటన ట్రాకర్లు లేవు",
        body: "మార్గంలో ఎలాంటి ప్రకటనలు లేదా మూడవ పక్ష ట్రాకింగ్ స్క్రిప్ట్‌లు ఉండవు.",
      },
      {
        title: "4. ఉపాధ్యాయుల సమాచారం",
        body: "తరగతి కోడ్ ద్వారా చేరినప్పుడు, ఉపాధ్యాయులు కేవలం అభ్యాస లోపాలను మాత్రమే చూడగలరు.",
      },
      {
        title: "5. డేటా రీసెట్",
        body: "విద్యార్థులు ఎప్పుడైనా తమ ప్రొఫైల్‌ను రీసెట్ చేసుకోవచ్చు.",
      },
      {
        title: "6. సంప్రదించండి",
        body: "సందేహాలు ఉంటే దయచేసి ఇక్కడ సంప్రదించండి: https://github.com/shalinireddy67/Margam/issues.",
      },
    ],
  },
};

export default function PrivacyPage() {
  return <LegalPageViewer content={PRIVACY_CONTENT} />;
}
