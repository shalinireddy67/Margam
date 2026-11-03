import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_NAME = "Margam";
const LANDING_TITLE = "Margam: find the gap behind your maths mistakes";
const LANDING_DESCRIPTION =
  "Margam finds the earlier maths topic you missed and walks you back to fix it. NCERT Classes 6-10, in English, Hindi and Telugu.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://margam-learningspace.vercel.app"
  ),
  title: {
    default: LANDING_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: LANDING_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: LANDING_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
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
