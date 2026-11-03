import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "Plain-language privacy notice for students, parents, and teachers. Margam collects no personal emails or phone numbers.",
  openGraph: {
    title: "Privacy notice | Margam",
    description:
      "Plain-language privacy notice for students, parents, and teachers. Margam collects no personal emails or phone numbers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy notice | Margam",
    description:
      "Plain-language privacy notice for students, parents, and teachers. Margam collects no personal emails or phone numbers.",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

