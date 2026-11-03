import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal",
  description:
    "Explore your mathematics learning path, diagnose foundational prerequisite gaps, and practice NCERT concepts.",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
