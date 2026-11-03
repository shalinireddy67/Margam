import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description:
    "Manage classroom rosters, track student prerequisite gaps across Classes 6–10, and view live concept heatmaps.",
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

