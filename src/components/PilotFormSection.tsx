"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, ShieldCheck, School, Mail, Phone, MapPin, User } from "lucide-react";
import { SupportedLanguage } from "@/lib/types";

interface PilotFormSectionProps {
  currentLang: SupportedLanguage;
}

export default function PilotFormSection({ currentLang }: PilotFormSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    role: "Teacher / Math Lead",
    districtState: "",
    email: "",
    phone: "",
    classes: ["Class 7", "Class 8", "Class 9"],
    consent: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.email) return;
    setSubmitted(true);
  };

  const handleClassToggle = (className: string) => {
    setFormData((prev) => {
      const exists = prev.classes.includes(className);
      return {
        ...prev,
        classes: exists ? prev.classes.filter((c) => c !== className) : [...prev.classes, className],
      };
    });
  };

  const t = {
    en: {
      sectionNum: "12 / SCHOOL PILOT REQUEST",
      headline: "Request a 2-Week Classroom Pilot",
      subhead:
        "Equip your mathematics department with our diagnostic backtracking graph and single-page A4 remediation worksheets. Zero setup fees, zero hardware requisites.",
      schoolLabel: "School or Institution Name",
      schoolPlaceholder: "e.g. Kendriya Vidyalaya No. 1 / Zilla Parishad High School",
      contactLabel: "Contact Person Name",
      contactPlaceholder: "e.g. Sunita Rao",
      roleLabel: "Role / Designation",
      districtLabel: "District & State",
      districtPlaceholder: "e.g. Warangal, Telangana / Bhopal, Madhya Pradesh",
      emailLabel: "Work Email Address",
      emailPlaceholder: "e.g. sunita.rao@kvs.ac.in",
      phoneLabel: "Phone Number (Optional)",
      phonePlaceholder: "e.g. +91 98765 43210",
      classesLabel: "Classes to Pilot (Select all that apply):",
      consentText: "I agree to pilot Margam under DPDP Act 2023 compliance. No child data will be shared with commercial third parties.",
      submitBtn: "Submit Pilot Request",
      successTitle: "Pilot Request Registered Successfully!",
      successDesc: "Thank you for partnering with Margam. Your school pilot ticket has been generated. Our curriculum engineering team will reach out with onboarding materials within 24 hours.",
      ticketNum: "TICKET #MARGAM-PILOT-2026-948",
      resetBtn: "Submit Another Request",
    },
    hi: {
      sectionNum: "12 / विद्यालय पायलट अनुरोध",
      headline: "2-सप्ताह के कक्षा पायलट का अनुरोध करें",
      subhead:
        "अपने विद्यालय के गणित विभाग को हमारे डायग्नोस्टिक ग्राफ और 1-पेज A4 अभ्यास पत्रों से सुसज्जित करें। कोई अग्रिम शुल्क नहीं, कोई अतिरिक्त हार्डवेयर की आवश्यकता नहीं।",
      schoolLabel: "विद्यालय या संस्थान का नाम",
      schoolPlaceholder: "उदा. केन्द्रीय विद्यालय क्रमांक 1 / जिला परिषद हाई स्कूल",
      contactLabel: "संपर्क व्यक्ति का नाम",
      contactPlaceholder: "उदा. सुनीता राव",
      roleLabel: "पद / भूमिका",
      districtLabel: "ज़िला और राज्य",
      districtPlaceholder: "उदा. भोपाल, मध्य प्रदेश / वाराणसी, उत्तर प्रदेश",
      emailLabel: "कार्य ईमेल",
      emailPlaceholder: "उदा. sunita.rao@kvs.ac.in",
      phoneLabel: "फ़ोन नंबर (वैकल्पिक)",
      phonePlaceholder: "उदा. +91 98765 43210",
      classesLabel: "पायलट हेतु कक्षाएँ चुनें:",
      consentText: "मैं DPDP अधिनियम 2023 के तहत मार्गम् पायलट से सहमत हूँ। छात्रों का कोई भी डेटा तीसरे पक्ष से साझा नहीं होगा।",
      submitBtn: "पायलट अनुरोध भेजें",
      successTitle: "पायलट अनुरोध सफलतापूर्वक पंजीकृत!",
      successDesc: "मार्गम् के साथ जुड़ने के लिए धन्यवाद। आपका पायलट टिकट उत्पन्न हो गया है। हमारी टीम 24 घंटे में आपसे संपर्क करेगी।",
      ticketNum: "टिकट #MARGAM-PILOT-2026-948",
      resetBtn: "एक और अनुरोध भेजें",
    },
    te: {
      sectionNum: "12 / పాఠశాల పైలట్ అభ్యర్థన",
      headline: "2 వారాల ఉచిత తరగతి గది పైలట్ కోసం దరఖాస్తు",
      subhead:
        "మీ పాఠశాల గణిత ఉపాధ్యాయులకు మార్గం డయాగ్నోస్టిక్ గ్రాఫ్ మరియు 1-పేజీ A4 వర్క్‌షీట్‌లను అందించండి. ఎలాంటి రుసుములు లేవు, ప్రత్యేక పరికరాలు అవసరం లేదు.",
      schoolLabel: "పాఠశాల లేదా సంస్థ పేరు",
      schoolPlaceholder: "ఉదా. జిల్లా పరిషత్ ఉన్నత పాఠశాల / కేంద్రీయ విద్యాలయ",
      contactLabel: "సంప్రదించవలసిన వ్యక్తి పేరు",
      contactPlaceholder: "ఉదా. సునీతారావు",
      roleLabel: "హోదా / బాధ్యత",
      districtLabel: "జిల్లా మరియు రాష్ట్రం",
      districtPlaceholder: "ఉదా. వరంగల్, తెలంగాణ / గుంటూరు, ఆంధ్రప్రదేశ్",
      emailLabel: "ఈమెయిల్ చిరునామా",
      emailPlaceholder: "ఉదా. sunita.rao@school.edu.in",
      phoneLabel: "ఫోన్ నంబర్ (ఐచ్ఛికం)",
      phonePlaceholder: "ఉదా. +91 98765 43210",
      classesLabel: "పైలట్ కోసం తరగతులను ఎంచుకోండి:",
      consentText: "DPDP చట్టం 2023 ప్రకారం మార్గం ఉపయోగించడానికి అంగీకరిస్తున్నాను. విద్యార్థుల వివరాలు ఎవరికీ బదిలీ చేయబడవు.",
      submitBtn: "పైలట్ అభ్యర్థన సమర్పించండి",
      successTitle: "పైలట్ అభ్యర్థన విజయవంతంగా నమోదైంది!",
      successDesc: "మార్గంతో చేతులు కలిపినందుకు ధన్యవాదాలు. మీ పాఠశాల పైలట్ టికెట్ రూపొందించబడింది. మా బృందం 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తుంది.",
      ticketNum: "టికెట్ #MARGAM-PILOT-2026-948",
      resetBtn: "మరొక అభ్యర్థన పంపండి",
    },
  }[currentLang];

  return (
    <section id="pilot" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-primary font-bold mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
          <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
          <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{t.sectionNum}</span>
      </div>

      <div className="max-w-3xl mb-10 space-y-3">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {t.headline}
        </h2>
        <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
          {t.subhead}
        </p>
      </div>

      <div className="max-w-3xl">
        {submitted ? (
          <div className="bg-card rounded-[24px] border-2 border-[#C7DDAE] p-8 sm:p-10 shadow-warm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#EAF5E1] border-2 border-[#B7DE9E] text-[#3E8424] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF3DA] text-accent border border-[#FCD685]">
                {t.ticketNum}
              </span>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                {t.successTitle}
              </h3>
              <p className="text-sm text-foreground/80 max-w-lg mx-auto font-sans leading-relaxed">
                {t.successDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-[12px] bg-background border-2 border-[#C7DDAE] hover:border-primary text-xs font-bold font-heading text-foreground transition-all cursor-pointer"
            >
              {t.resetBtn}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-[24px] border-2 border-[#C7DDAE] p-6 sm:p-10 shadow-warm space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* School Name */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-accent" />
                  <span>{t.schoolLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.schoolPlaceholder}
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] bg-background border-2 border-[#C7DDAE] text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>{t.contactLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.contactPlaceholder}
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] bg-background border-2 border-[#C7DDAE] text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground">
                  {t.roleLabel}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] bg-background border-2 border-[#C7DDAE] text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="Teacher / Math Lead">Teacher / Math Lead</option>
                  <option value="Principal / Headmaster">Principal / Headmaster</option>
                  <option value="Academic Coordinator">Academic Coordinator</option>
                  <option value="NGO / CSR Education Partner">NGO / CSR Education Partner</option>
                </select>
              </div>

              {/* District & State */}
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{t.districtLabel}</span>
                </label>
                <input
                  type="text"
                  placeholder={t.districtPlaceholder}
                  value={formData.districtState}
                  onChange={(e) => setFormData({ ...formData, districtState: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] bg-background border-2 border-[#C7DDAE] text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>{t.emailLabel} *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] bg-background border-2 border-[#C7DDAE] text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Classes to Pilot */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-heading font-bold uppercase tracking-wider text-foreground block">
                  {t.classesLabel}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => {
                    const isChecked = formData.classes.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleClassToggle(cls)}
                        className={`px-3.5 py-1.5 rounded-[12px] text-xs font-mono font-bold transition-all cursor-pointer ${
                          isChecked
                            ? "bg-[#EAF5E1] text-primary border-2 border-[#B7DE9E]"
                            : "bg-background text-foreground/70 border-2 border-[#C7DDAE]/60 hover:border-primary"
                        }`}
                      >
                        {cls} {isChecked && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Privacy Consent */}
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-primary border-[#C7DDAE] focus:ring-primary"
                  />
                  <span className="text-xs text-foreground/80 leading-relaxed font-sans">
                    {t.consentText}
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-[14px] bg-primary hover:bg-[#5b8a3e] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-warm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
