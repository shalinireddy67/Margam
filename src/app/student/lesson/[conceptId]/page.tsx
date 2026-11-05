"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentLessonRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params?.conceptId as string;

  useEffect(() => {
    if (conceptId) {
      router.replace(`/lesson/${conceptId}`);
    } else {
      router.replace("/student");
    }
  }, [conceptId, router]);

  return null;
}
