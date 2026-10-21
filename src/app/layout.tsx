import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/config/site";

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
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col editorial-paper font-sans text-margam-navy selection:bg-margam-terracotta selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-margam-navy focus:text-white focus:rounded-md focus:shadow-lg focus:font-semibold text-sm"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
