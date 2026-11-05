import type { Metadata, Viewport } from "next";
import "./globals.css";
import WorldBackground from "@/components/world/WorldBackground";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CookieConsent } from "@/components/ui/CookieConsent";

const SITE_NAME = "Margam";
const SITE_DESCRIPTION =
  "Margam — Adaptive Mathematics learning platform for Classes 6 to 10 (NCERT curriculum).";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Adaptive Mathematics (Classes 6–10)`,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: `${SITE_NAME} | Every learner has a path. Find yours.`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#78BDE8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col text-[#1E1610] font-sans antialiased pb-24 md:pb-0 overflow-x-hidden selection:bg-[#6DB33F]/30 selection:text-[#1E1610]">
        <LanguageProvider>
          {/* Universal Movable World Background */}
          <WorldBackground />
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          {children}
          {/* Global DPDP Multilingual Cookie & Storage Consent */}
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
