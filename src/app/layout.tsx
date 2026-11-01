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
  themeColor: "#5A3720",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#5A3720] text-[#FFF7E6] font-sans antialiased pb-24 md:pb-0 overflow-x-hidden voxel-grid-bg">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
