import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher",
  description:
    "Manage classes, view student prerequisite gaps across Classes 6–10, and track mastery heatmaps.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Teacher | Margam",
    description:
      "Manage classes, view student prerequisite gaps across Classes 6–10, and track mastery heatmaps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teacher | Margam",
    description:
      "Manage classes, view student prerequisite gaps across Classes 6–10, and track mastery heatmaps.",
  },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
