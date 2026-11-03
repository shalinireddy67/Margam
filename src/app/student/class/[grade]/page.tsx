"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getActiveProfile,
  createLearnerProfile,
  updateLearnerStudyClass,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";

export default function ClassGradeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const rawGrade = Number(params?.grade);

  useEffect(() => {
    if ([6, 7, 8, 9, 10].includes(rawGrade)) {
      const grade = rawGrade as 6 | 7 | 8 | 9 | 10;
      const active = getActiveProfile();
      if (active) {
        const updated = updateLearnerStudyClass(active, grade);
        syncClassProgression(updated);
      } else {
        const newProf = createLearnerProfile("Student", grade);
        syncClassProgression(newProf);
      }
      router.replace("/student");
    } else {
      router.replace("/student/select-class");
    }
  }, [rawGrade, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-6 rounded-2xl bg-[#e0dcd1] border-2 border-[#5A3720] text-center shadow-sm">
        <p className="font-heading text-xs text-[#2B1B0F]">Switching Class Realm...</p>
      </div>
    </div>
  );
}
