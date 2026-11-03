import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "Terms of service for the Margam adaptive mathematics platform for Classes 6 to 10.",
  openGraph: {
    title: "Terms of service | Margam",
    description:
      "Terms of service for the Margam adaptive mathematics platform for Classes 6 to 10.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of service | Margam",
    description:
      "Terms of service for the Margam adaptive mathematics platform for Classes 6 to 10.",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

