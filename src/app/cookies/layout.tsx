import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie notice",
  description:
    "Margam cookie notice. We use only strictly necessary authentication cookies and zero third-party advertising trackers.",
  openGraph: {
    title: "Cookie notice | Margam",
    description:
      "Margam cookie notice. We use only strictly necessary authentication cookies and zero third-party advertising trackers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie notice | Margam",
    description:
      "Margam cookie notice. We use only strictly necessary authentication cookies and zero third-party advertising trackers.",
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

