import React from "react";
import { LegalPageViewer, type LegalDocument } from "@/components/legal/LegalPageViewer";

const COOKIE_CONTENT: Record<"en" | "hi" | "te", LegalDocument> = {
  en: {
    badge: "Cookie notice",
    title: "Cookie notice",
    subtitle: "How Margam uses cookies and browser storage.",
    backText: "Back to home",
    sections: [
      {
        title: "1. Essential cookies only",
        body: "Margam uses only essential authentication cookies to keep you signed in and secure your session. We do not use advertising, marketing, or tracking cookies.",
      },
      {
        title: "2. No third-party trackers",
        body: "We do not embed third-party analytics trackers, advertising pixels, or cross-site surveillance scripts. Your mathematics activity stays on Margam.",
      },
      {
        title: "3. Browser storage",
        body: "For guest learners, topic progress and practice history are saved directly in your browser's local storage. This data remains on your physical device until you clear your browser site data.",
      },
      {
        title: "4. Cookie security flags",
        body: "Authentication cookies are set with HttpOnly, Secure, and SameSite=Lax flags to protect your session from unauthorized script access.",
      },
      {
        title: "5. Questions and contact",
        body: "If you have questions about how we use cookies, contact [TODO: contact email/address].",
      },
    ],
  },
  hi: {
    badge: "कुकी सूचना",
    title: "कुकी सूचना",
    subtitle: "मार्गम् में कुकीज़ और ब्राउज़र स्टोरेज का विवरण।",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. केवल आवश्यक कुकीज़",
        body: "मार्गम् केवल सत्र और लॉगिन सुरक्षा के लिए आवश्यक कुकीज़ का उपयोग करता है। कोई विज्ञापन कुकी नहीं है।",
      },
      {
        title: "2. कोई तीसरा पक्ष ट्रैकर नहीं",
        body: "हम किसी तीसरे पक्ष के एनालिटिक्स या ट्रैकिंग पिक्सेल का उपयोग नहीं करते हैं।",
      },
      {
        title: "3. ब्राउज़र स्टोरेज",
        body: "अतिथि के रूप में अभ्यास करने पर डेटा सीधे आपके ब्राउज़र में सुरक्षित रहता है।",
      },
      {
        title: "4. कुकी सुरक्षा",
        body: "सभी प्रमाणीकरण कुकीज़ सुरक्षित फ़्लैग के साथ भेजी जाती हैं।",
      },
      {
        title: "5. संपर्क",
        body: "यदि आपके कोई प्रश्न हैं, तो संपर्क करें: [TODO: contact email/address]。",
      },
    ],
  },
  te: {
    badge: "కుకీ సమాచారం",
    title: "కుకీ సమాచారం",
    subtitle: "మార్గంలో కుకీలు మరియు బ్రౌజర్ నిల్వ వివరాలు.",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. కేవలం అవసరమైన కుకీలు మాత్రమే",
        body: "మార్గం లాగిన్ మరియు సెషన్ భద్రత కోసం మాత్రమే అవసరమైన కుకీలను ఉపయోగిస్తుంది. ఎలాంటి ప్రకటన కుకీలు ఉండవు.",
      },
      {
        title: "2. ప్రకటన ట్రాకర్లు లేవు",
        body: "మేము మూడవ పక్ష ట్రాకింగ్ స్క్రిప్ట్‌లను ఉపయోగించము.",
      },
      {
        title: "3. బ్రౌజర్ నిల్వ",
        body: "అతిథి అభ్యాసకుల పురోగతి మీ బ్రౌజర్ మెమరీలోనే భద్రంగా ఉంటుంది.",
      },
      {
        title: "4. కుకీ భద్రత",
        body: "కుకీలు సురక్షిత సెక్యూరిటీ ఫ్లాగ్‌లతో బ్రౌజర్‌లో నిల్వ చేయబడతాయి.",
      },
      {
        title: "5. సంప్రదించండి",
        body: "సందేహాలు ఉంటే సంప్రదించండి: [TODO: contact email/address].",
      },
    ],
  },
};

export default function CookiesPage() {
  return <LegalPageViewer content={COOKIE_CONTENT} />;
}
