import React from "react";
import { LegalPageViewer, type LegalDocument } from "@/components/legal/LegalPageViewer";

const TERMS_CONTENT: Record<"en" | "hi" | "te", LegalDocument> = {
  en: {
    badge: "Terms of service",
    title: "Terms of service",
    subtitle: "Plain-language terms for students, parents, and teachers.",
    backText: "Back to home",
    sections: [
      {
        title: "1. Educational purpose",
        body: "Margam is a maths learning tool built around NCERT chapters for Classes 6 to 10. It is intended to help students identify earlier prerequisite gaps and practice foundational topics.",
      },
      {
        title: "2. Curriculum scope",
        body: "Content is mapped to NCERT chapters for Classes 6 to 10. While we work to keep questions accurate and helpful, the platform is provided as-is for educational practice.",
      },
      {
        title: "3. Account credentials",
        body: "Students sign in with a username and password. We do not ask for email or phone numbers, so we cannot send password reset emails. You are responsible for keeping your recovery code safe.",
      },
      {
        title: "4. Teacher responsibilities",
        body: "Teachers who create classes and invite students are responsible for using classroom analytics only to guide instruction and support their students.",
      },
      {
        title: "5. Service availability",
        body: "Margam is provided free of charge. We aim to keep the service reliable and support offline practice in your browser, but we cannot guarantee uninterrupted access.",
      },
      {
        title: "6. Questions and contact",
        body: "If you have questions about these terms, contact [TODO: contact email/address].",
      },
    ],
  },
  hi: {
    badge: "सेवा की शर्तें",
    title: "सेवा की शर्तें",
    subtitle: "विद्यार्थियों, अभिभावकों और शिक्षकों के लिए सरल नियम।",
    backText: "होम पर लौटें",
    sections: [
      {
        title: "1. शैक्षिक उद्देश्य",
        body: "मार्गम् कक्षा 6 से 10 के एनसीईआरटी अध्यायों पर आधारित एक गणित सीखने का मंच है।",
      },
      {
        title: "2. पाठ्यक्रम दायरा",
        body: "सामग्री कक्षा 6 से 10 के एनसीईआरटी पाठ्यक्रम से जुड़ी है।",
      },
      {
        title: "3. खाता क्रेडेंशियल",
        body: "विद्यार्थी उपयोगकर्ता नाम और पासवर्ड से साइन इन करते हैं। रिकवरी कोड को सुरक्षित रखना आपकी जिम्मेदारी है।",
      },
      {
        title: "4. शिक्षक उत्तरदायित्व",
        body: "शिक्षक कक्षा विश्लेषण का उपयोग केवल शिक्षण और मार्गदर्शन के लिए करते हैं।",
      },
      {
        title: "5. सेवा की उपलब्धता",
        body: "मार्गम् निःशुल्क उपलब्ध है। हम ऑफ़लाइन अभ्यास का समर्थन करते हैं।",
      },
      {
        title: "6. संपर्क",
        body: "यदि आपके कोई प्रश्न हैं, तो संपर्क करें: [TODO: contact email/address]。",
      },
    ],
  },
  te: {
    badge: "నిబంధనలు",
    title: "సేవా నిబంధనలు",
    subtitle: "విద్యార్థులు, తల్లిదండ్రులు మరియు ఉపాధ్యాయుల కోసం సరళమైన నియమాలు.",
    backText: "హోమ్‌కు తిరిగి వెళ్లండి",
    sections: [
      {
        title: "1. విద్యా ప్రయోజనం",
        body: "మార్గం 6 నుండి 10 తరగతుల NCERT గణిత అధ్యాయాలపై ఆధారపడిన అభ్యాస సాధనం.",
      },
      {
        title: "2. పాఠ్యప్రణాళిక పరిధి",
        body: "అన్ని అంశాలు NCERT గణిత సిలబస్‌కు అనుగుణంగా మ్యాప్ చేయబడ్డాయి.",
      },
      {
        title: "3. ఖాతా వివరాలు",
        body: "విద్యార్థులు యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌తో సైన్ ఇన్ చేస్తారు. రికవరీ కోడ్‌ను సురక్షితంగా ఉంచుకోవడం మీ బాధ్యత.",
      },
      {
        title: "4. ఉపాధ్యాయుల బాధ్యత",
        body: "ఉపాధ్యాయులు తరగతి విశ్లేషణను కేవలం బోధన మార్గదర్శకత్వం కోసం మాత్రమే ఉపయోగిస్తారు.",
      },
      {
        title: "5. సేవ లభ్యత",
        body: "మార్గం ఉచితంగా అందించబడుతుంది మరియు ఆఫ్‌లైన్ సాధనకు మద్దతు ఇస్తుంది.",
      },
      {
        title: "6. సంప్రదించండి",
        body: "సందేహాలు ఉంటే సంప్రదించండి: [TODO: contact email/address].",
      },
    ],
  },
};

export default function TermsPage() {
  return <LegalPageViewer content={TERMS_CONTENT} />;
}
