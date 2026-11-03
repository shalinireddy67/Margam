import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_NAME = "Margam";
const SITE_DESCRIPTION =
  "Margam — Adaptive Mathematics learning platform for Indian students in Classes 6 to 10 (NCERT curriculum).";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://margam-learningspace.vercel.app"
  ),
  title: {
    default: `${SITE_NAME} | Adaptive Mathematics (Classes 6–10)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: `${SITE_NAME} | Every learner has a path. Find yours.`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Margam — Adaptive Mathematics for Classes 6 to 10",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Adaptive Mathematics (Classes 6–10)`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
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
  themeColor: "#FFF7E6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FFF7E6] text-[#2B1B0F] font-sans antialiased pb-24 md:pb-0 overflow-x-hidden">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
