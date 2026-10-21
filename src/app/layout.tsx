import type { Metadata, Viewport } from "next";
import { Outfit, Nunito, Noto_Sans_Devanagari, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/config/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-telugu",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Adaptive Learning Platform for Classes 6–10`,
  description: `${SITE_TAGLINE} — ${SITE_DESCRIPTION}`,
  keywords: [
    "Adaptive Learning",
    "NCERT Mathematics",
    "Classes 6 to 10",
    "Prerequisite Gaps",
    "Concept Graph DAG",
    "Indian Classrooms",
    "Code Kernel 26",
    "Margam",
  ],
  authors: [{ name: "Margam Learning Initiative" }],
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
  themeColor: "#F4F6EE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${outfit.variable} ${nunito.variable} ${notoDevanagari.variable} ${notoTelugu.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased selection:bg-coral selection:text-white pb-20 md:pb-0 overflow-x-hidden">
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
