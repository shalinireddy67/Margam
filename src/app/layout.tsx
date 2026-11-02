import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/config/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Adaptive Mathematics Platform for Classes 6–10`,
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
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-950">
        {/* Universal Fixed Minecraft Nature Background Scenery */}
        <div
          className="fixed inset-0 pointer-events-none -z-20 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: "url('/images/minecraft/meadow-day.jpg')" }}
          aria-hidden="true"
        />
        {/* Subtle Ambient Light Wash */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 bg-white/10 backdrop-blur-[0.5px]"
          aria-hidden="true"
        />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
