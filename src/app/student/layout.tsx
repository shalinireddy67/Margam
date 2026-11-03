import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student",
  description:
    "Diagnose prerequisite maths gaps, follow your learning path, and practice NCERT concepts.",
  openGraph: {
    title: "Student | Margam",
    description:
      "Diagnose prerequisite maths gaps, follow your learning path, and practice NCERT concepts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student | Margam",
    description:
      "Diagnose prerequisite maths gaps, follow your learning path, and practice NCERT concepts.",
  },
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

