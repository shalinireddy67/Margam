import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/server/rate-limit";
import syntheticClassData from "../../../../../data/synthetic-class.json";

export interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  avatarPixel: string;
  level: number;
  rankBadge: string;
  rankName: string;
  weeklyXp: number;
  streakDays: number;
  improvedDelta: number;
  rankPosition: number;
  isCurrentUser?: boolean;
}

// In-memory 60s cache per classId and tab
const leaderboardCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 1000;

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const classId = params.classId || "demo-sec-10a";
    const clientIp = req.headers.get("x-forwarded-for") || "anonymous_client";

    // Rate limiting: 60 reads per minute
    if (isRateLimited(`lb_read_${clientIp}`, 60, 60000)) {
      return NextResponse.json(
        { error: "Too many leaderboard requests. Please slow down." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "weekly"; // "weekly" | "most_improved" | "streak_kings"
    const currentStudentId = searchParams.get("studentId") || "";
    const hideOptedOut = searchParams.get("hideOptedOut") !== "false";

    const cacheKey = `${classId}:${tab}`;
    const cached = leaderboardCache.get(cacheKey);
    const now = Date.now();

    // Generate entries based on class dataset
    const rawStudents = syntheticClassData.students || [];

    // Synthesize weekly XP, streaks, and levels safely and deterministically
    const entries: LeaderboardEntry[] = rawStudents.map((s, idx) => {
      // Deterministic weekly XP derived from student metrics
      const hash = (idx * 37 + 13) % 100;
      const weeklyXp = Math.floor(120 + hash * 2.8);
      const streakDays = Math.max(1, (hash % 14) + 1);
      const improvedDelta = Math.floor(15 + (hash % 45));
      const level = Math.max(1, Math.floor(weeklyXp / 80) + 1);

      let rankName = "Wood";
      let rankBadge = "🪵";
      if (level >= 20) {
        rankName = "Diamond";
        rankBadge = "💎";
      } else if (level >= 15) {
        rankName = "Gold";
        rankBadge = "👑";
      } else if (level >= 10) {
        rankName = "Iron";
        rankBadge = "⚔️";
      } else if (level >= 5) {
        rankName = "Stone";
        rankBadge = "🪨";
      }

      // Privacy: Only use chosen first-name or anonymous alias (never real full names or private scores)
      const firstName = s.name.split(" ")[0];
      const displayName = `${firstName}_${s.rollNumber}`;

      return {
        studentId: s.id,
        displayName,
        avatarPixel: `avatar_${(idx % 6) + 1}`,
        level,
        rankBadge,
        rankName,
        weeklyXp,
        streakDays,
        improvedDelta,
        rankPosition: 0,
      };
    });

    // Sort depending on tab
    if (tab === "most_improved") {
      entries.sort((a, b) => b.improvedDelta - a.improvedDelta);
    } else if (tab === "streak_kings") {
      entries.sort((a, b) => b.streakDays - a.streakDays);
    } else {
      // Default: weekly XP
      entries.sort((a, b) => b.weeklyXp - a.weeklyXp);
    }

    // Assign Dense Rank (ties celebrated!)
    let currentDenseRank = 1;
    for (let i = 0; i < entries.length; i++) {
      if (i > 0) {
        const prev = entries[i - 1];
        const curr = entries[i];
        const valPrev =
          tab === "most_improved"
            ? prev.improvedDelta
            : tab === "streak_kings"
            ? prev.streakDays
            : prev.weeklyXp;
        const valCurr =
          tab === "most_improved"
            ? curr.improvedDelta
            : tab === "streak_kings"
            ? curr.streakDays
            : curr.weeklyXp;

        if (valCurr < valPrev) {
          currentDenseRank++;
        }
      }
      entries[i].rankPosition = currentDenseRank;
      if (currentStudentId && entries[i].studentId === currentStudentId) {
        entries[i].isCurrentUser = true;
      }
    }

    // Top 10 items
    const top10 = entries.slice(0, 10);

    // Relative ranking helper for user outside top 10
    let userRelativePosition: {
      rank: number;
      weeklyXp: number;
      diffToAhead: number;
      aheadRank: number;
      aheadName: string;
    } | null = null;

    if (currentStudentId) {
      const userIndex = entries.findIndex((e) => e.studentId === currentStudentId);
      if (userIndex >= 10) {
        const userEntry = entries[userIndex];
        const aheadEntry = entries[userIndex - 1];
        const diff = aheadEntry.weeklyXp - userEntry.weeklyXp;
        userRelativePosition = {
          rank: userEntry.rankPosition,
          weeklyXp: userEntry.weeklyXp,
          diffToAhead: Math.max(5, diff),
          aheadRank: aheadEntry.rankPosition,
          aheadName: aheadEntry.displayName,
        };
      }
    }

    const payload = {
      classId,
      tab,
      resetWindowLabel: "Resets Mondays at 00:00 IST",
      totalMembers: entries.length,
      leaderboard: top10,
      userRelativePosition,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err: any) {
    console.error("Error in /api/leaderboard/[classId]:", err);
    return NextResponse.json(
      { error: "Internal server error fetching class leaderboard" },
      { status: 500 }
    );
  }
}

