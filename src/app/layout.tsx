import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#5DAA3A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col text-[#2B1B0F] font-sans antialiased pb-24 md:pb-0 overflow-x-hidden selection:bg-[#5DAA3A]/30 selection:text-[#1B3811]">
        {/* Universal Fixed Nature Background Scenery */}
        <div
          className="fixed inset-0 pointer-events-none -z-20 bg-cover bg-center bg-no-repeat responsive-bg-fixed"
          style={{ backgroundImage: "url('/images/world/meadow-day.jpg')" }}
          aria-hidden="true"
        />
        {/* Subtle Ambient Daylight Overlay for Readability */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 bg-[#FFFDF7]/30 backdrop-blur-[1px]"
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
