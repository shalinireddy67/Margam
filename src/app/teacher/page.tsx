"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  BookOpen,
  Printer,
  ChevronRight,
  Smartphone,
  Info,
  Network,
  RotateCcw,
  Search,
  Trophy,
  Flame,
  TrendingUp,
  Eye,
  EyeOff,
  Users,
  Plus,
  LogOut,
  Copy,
  Check,
  School,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import syntheticClassData from "../../../data/synthetic-class.json";
import { getActiveProfile } from "@/lib/storage";
import { LearnerProfile } from "@/lib/types";

export default function TeacherPage() {
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("stu-synth-01");
  const [filterAttention, setFilterAttention] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "heatmap" | "misconceptions" | "print" | "effort">("dashboard");
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
  const [hiddenStudentIds, setHiddenStudentIds] = useState<Set<string>>(new Set(["stu-synth-07"]));
  const [localProfile, setLocalProfile] = useState<LearnerProfile | null>(null);

  // Live enrolled classes state
  const [viewMode, setViewMode] = useState<"synthetic" | "live">("synthetic");
  const [teacherUser, setTeacherUser] = useState<any>(null);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [liveMembers, setLiveMembers] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState<number>(10);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [inspectingStudent, setInspectingStudent] = useState<any | null>(null);
  const [selectedLiveClassId, setSelectedLiveClassId] = useState<string | null>(null);
  const [liveFilter, setLiveFilter] = useState<"all" | "needs_attention" | "strong" | "improving">("all");
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>("");

  const fetchTeacherData = async () => {
    try {
      setLoadingLive(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.authenticated && meData.user?.role === "teacher") {
        setTeacherUser(meData.user);
      }

      const classRes = await fetch("/api/teacher/classes");
      if (classRes.ok) {
        const classData = await classRes.json();
        const classes = classData.classes || [];
        const members = classData.members || [];
        setLiveClasses(classes);
        setLiveMembers(members);
        if (classes.length > 0) {
          setViewMode("live");
          setSelectedLiveClassId(classes[0].id);
        }
      }
    } catch (err) {
      console.warn("Error fetching teacher class data:", err);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    const profile = getActiveProfile();
    setLocalProfile(profile);
    fetchTeacherData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login?role=teacher");
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const res = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClassName.trim(),
          grade: Number(newClassGrade),
        }),
      });

      if (res.ok) {
        setShowAddClassModal(false);
        setNewClassName("");
        await fetchTeacherData();
        setViewMode("live");
      }
    } catch (err) {
      console.error("Failed to create class:", err);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const students = syntheticClassData.students;
  const heatmapConcepts = syntheticClassData.heatmapConcepts;
  const metrics = syntheticClassData.metrics;

  const filteredStudents = students.filter((s) => {
    if (filterAttention && !s.needsAttention) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        String(s.rollNumber).includes(q) ||
        (s.persona && s.persona.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  // Live class metrics & filtering for active class
  const activeLiveClass = liveClasses.find((c) => c.id === selectedLiveClassId) || liveClasses[0] || null;
  const isDemoLiveClass = Boolean(
    activeLiveClass?.isDemo ||
    activeLiveClass?.schoolName === "Vignan School" ||
    activeLiveClass?.class_code === "VIGNAN-10A4" ||
    activeLiveClass?.classCode === "VIGNAN-10A4" ||
    teacherUser?.email === "teacher@vignan.demo.invalid"
  );

  const classMembers = activeLiveClass
    ? liveMembers.filter((m) => m.class_id === activeLiveClass.id || m.classId === activeLiveClass.id)
    : liveMembers;

  const totalClassStudents = classMembers.length;
  const diagScores = classMembers
    .map((m) => m.latestDiagnosticPercentage)
    .filter((p) => typeof p === "number" && !isNaN(p));
  const avgClassDiag = diagScores.length
    ? Math.round(diagScores.reduce((a, b) => a + b, 0) / diagScores.length)
    : 74;

  const masteryScores = classMembers.map((m) => {
    if (m.conceptMastery && m.conceptMastery.length > 0) {
      const sum = m.conceptMastery.reduce((acc: number, curr: any) => acc + (Number(curr.mastery) || 0), 0);
      return Math.round(sum / m.conceptMastery.length);
    }
    return 73;
  });
  const avgClassMastery = masteryScores.length
    ? Math.round(masteryScores.reduce((a: number, b: number) => a + b, 0) / masteryScores.length)
    : 73;

  const liveNeedingAttention = classMembers.filter(
    (m) => m.category === "needs_attention" || m.identifiedGap || (typeof m.latestDiagnosticPercentage === "number" && m.latestDiagnosticPercentage < 70)
  );
  const liveStrong = classMembers.filter(
    (m) => m.category === "strong" || (typeof m.latestDiagnosticPercentage === "number" && m.latestDiagnosticPercentage >= 75)
  );
  const liveImproving = classMembers.filter(
    (m) => m.category === "improving" || m.resolvedGap
  );

  const filteredLiveMembers = classMembers.filter((m) => {
    if (liveFilter === "needs_attention") {
      const isAttn = m.category === "needs_attention" || m.identifiedGap || (typeof m.latestDiagnosticPercentage === "number" && m.latestDiagnosticPercentage < 70);
      if (!isAttn) return false;
    } else if (liveFilter === "strong") {
      const isStr = m.category === "strong" || (typeof m.latestDiagnosticPercentage === "number" && m.latestDiagnosticPercentage >= 75);
      if (!isStr) return false;
    } else if (liveFilter === "improving") {
      const isImp = m.category === "improving" || m.resolvedGap;
      if (!isImp) return false;
    }

    if (liveSearchQuery.trim()) {
      const q = liveSearchQuery.toLowerCase();
      const name = (m.profiles?.full_name || m.name || "").toLowerCase();
      const uname = (m.profiles?.username || m.username || "").toLowerCase();
      const persona = (m.persona || "").toLowerCase();
      const gap = (m.identifiedGap?.conceptName || "").toLowerCase();
      return name.includes(q) || uname.includes(q) || persona.includes(q) || gap.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans">
      {/* Floating Top Glass Header */}
      <header className="sticky top-3 z-50 max-w-[1200px] mx-auto px-3 sm:px-6 w-full">
        <div className="panel-night px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-[#F3E3BC]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#6DB33F] border-2 border-[#1E1610] flex items-center justify-center font-heading font-black text-lg text-[#1E1610] shadow-[2px_2px_0px_#1E1610]">
              M
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight block leading-tight text-emerald-950">
                Margam Teacher
              </span>
              <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">
                {teacherUser?.fullName ? `Welcome, ${teacherUser.fullName}` : "Classroom Diagnostics"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="glass-btn-primary inline-flex items-center justify-center min-h-[38px] px-3.5 py-1.5 text-xs font-heading font-bold no-underline"
            >
              <span>Student View</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center min-h-[38px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-heading font-bold border border-rose-200 rounded-xl shadow-xs transition-transform active:translate-y-0.5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">

        {/* View Mode Switcher: Synthetic Demo Class vs Enrolled Students */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 panel-plank p-3 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("synthetic")}
              className={`px-3.5 py-2 font-heading font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "synthetic"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                  : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#A06A3C]" />
              <span>Synthetic Demo Class</span>
            </button>

            <button
              onClick={() => setViewMode("live")}
              className={`px-3.5 py-2 font-heading font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "live"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                  : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
              }`}
            >
              <Users className="w-4 h-4 text-[#1E1610]" />
              <span>My Enrolled Students ({liveMembers.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddClassModal(true)}
              className="glass-btn-primary px-3.5 py-1.5 text-xs font-heading font-bold flex items-center gap-1 transition-all cursor-pointer rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Class</span>
            </button>
          </div>
        </div>

        {/* LIVE ENROLLED STUDENTS VIEW */}
        {viewMode === "live" && (
          <div className="space-y-6">
            {/* School & Class Overview Hero Banner */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-950/15 shadow-[0_8px_32px_rgba(16,42,18,0.12)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E1610]/20 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-heading font-black tracking-wider uppercase shadow-xs">
                    DEMO DATA
                  </span>
                  {isDemoLiveClass && (
                    <span className="px-2.5 py-0.5 bg-[#8CCB55] border-2 border-[#1E1610] text-[#1E1610] text-[10px] font-heading font-extrabold tracking-wide uppercase">
                      DEMO ENVIRONMENT (CLASS 10-A4)
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg font-heading font-extrabold text-emerald-950">
                    {activeLiveClass?.schoolName || "Vignan School"} • {activeLiveClass?.name || "Class 10-A4"}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-[#E8CF9C] px-3 py-1 border-2 border-[#1E1610] flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Class Code</span>
                    <code className="text-xs font-mono font-black text-emerald-900 tracking-wider">
                      {activeLiveClass?.class_code || activeLiveClass?.classCode || "VIGNAN-10A4"}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyCode(activeLiveClass?.class_code || activeLiveClass?.classCode || "VIGNAN-10A4")}
                      className="p-1 text-slate-500 hover:text-emerald-900 transition-colors"
                      title="Copy Class Code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {liveClasses.length > 1 && (
                    <select
                      aria-label="Select Class"
                      value={selectedLiveClassId || ""}
                      onChange={(e) => setSelectedLiveClassId(e.target.value)}
                      className="bg-[#E8CF9C] border-2 border-[#1E1610] text-xs font-heading font-bold px-2.5 py-1.5 text-[#1E1610] focus:outline-none"
                    >
                      {liveClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.grade}th)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 font-sans gap-2">
                <div className="flex items-center gap-4">
                  <span>
                    <strong>Class Teacher:</strong> {teacherUser?.fullName || "Demo Teacher"}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Curriculum:</strong> NCERT Mathematics (Class 10)
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Enrolled Roster:</strong> {totalClassStudents} Students
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#1E1610] bg-[#E8CF9C] px-2.5 py-0.5 border-2 border-[#1E1610]">
                  Live Judging Environment
                </span>
              </div>
            </div>

            {/* Class Overview KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Total Students */}
              <div className="panel-plank p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-1">
                <div className="flex items-center justify-between text-slate-600 text-xs font-heading font-bold">
                  <span>Enrolled Students</span>
                  <Users className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-950">
                  {totalClassStudents}
                </div>
                <p className="text-[10px] text-slate-500 font-sans">
                  Section A4 (25 synthetic profiles)
                </p>
              </div>

              {/* Card 2: Avg Diagnostic */}
              <div className="panel-plank p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-1">
                <div className="flex items-center justify-between text-slate-600 text-xs font-heading font-bold">
                  <span>Class Avg Diagnostic</span>
                  <TrendingUp className="w-4 h-4 text-sky-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-sky-950">
                  {avgClassDiag}%
                </div>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${avgClassDiag}%` }} />
                </div>
              </div>

              {/* Card 3: Concept Mastery */}
              <div className="panel-plank p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-1">
                <div className="flex items-center justify-between text-slate-600 text-xs font-heading font-bold">
                  <span>Concept Mastery</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-950">
                  {avgClassMastery}%
                </div>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${avgClassMastery}%` }} />
                </div>
              </div>

              {/* Card 4: Learning Health */}
              <div className="panel-plank p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-1">
                <div className="flex items-center justify-between text-slate-600 text-xs font-heading font-bold">
                  <span>Roster Distribution</span>
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-xs font-heading font-bold text-slate-800 space-y-0.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800">● Strong Performers:</span>
                    <span className="font-extrabold">{liveStrong.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-rose-700">● Needs Attention:</span>
                    <span className="font-extrabold">{liveNeedingAttention.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class-wide Foundational Learning Gaps Breakdown */}
            <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Top Foundational Gaps Identified Across Classroom</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Prerequisite skills missing from earlier grades affecting Class 10 curriculum.
                  </p>
                </div>
                <span className="text-[11px] font-heading font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-xl self-start sm:self-auto border border-emerald-300">
                  Adaptive Auto-Remediation Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Gap 1 */}
                <div className="p-3.5 bg-[#E8CF9C]/70 border-2 border-[#D1362B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                      c7-int-02 • Class 7
                    </span>
                    <span className="text-[10px] font-heading font-extrabold text-rose-900">
                      4 Students
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-slate-800">
                    Negative Integer Multiplication
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Root prerequisite for quadratic equation factoring & algebraic expansion.
                  </p>
                  <div className="text-[10px] font-heading font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Isha Reddy resolved via remedial drill!</span>
                  </div>
                </div>

                {/* Gap 2 */}
                <div className="p-3.5 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      c7-num-01 • Class 7
                    </span>
                    <span className="text-[10px] font-heading font-extrabold text-amber-900">
                      3 Students
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-slate-800">
                    Operations on Fractions & Decimals
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Affects rational coefficients in real numbers & trigonometric ratios.
                  </p>
                  <div className="text-[10px] font-heading font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Vihaan & Ishaan routed to fraction review</span>
                  </div>
                </div>

                {/* Gap 3 */}
                <div className="p-3.5 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      c8-alg-03 • Class 8
                    </span>
                    <span className="text-[10px] font-heading font-extrabold text-sky-900">
                      2 Students
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-slate-800">
                    Distributive Property in Equations
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Prerequisite for linear equations in two variables and polynomial zeroes.
                  </p>
                  <div className="text-[10px] font-heading font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded border border-sky-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    <span>Myra Nair successfully resolved gap</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Roster Table with Search & Filters */}
            <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-black text-base text-emerald-950">
                    Class 10-A4 Student Roster ({filteredLiveMembers.length} of {totalClassStudents})
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Inspect individual student trajectories, verified masteries, and remedial pathways.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLiveFilter("all")}
                    className={`px-3 py-1 text-xs font-heading font-bold rounded-xl border transition-all cursor-pointer ${
                      liveFilter === "all"
                        ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                        : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] hover:bg-[#D9B87A]"
                    }`}
                  >
                    All ({totalClassStudents})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveFilter("needs_attention")}
                    className={`px-3 py-1 text-xs font-heading font-bold rounded-xl border transition-all cursor-pointer ${
                      liveFilter === "needs_attention"
                        ? "bg-[#D1362B] text-[#F3E3BC] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                        : "bg-[#E8CF9C] text-[#D1362B] border-2 border-[#1E1610] hover:bg-[#D9B87A]"
                    }`}
                  >
                    Needs Attention ({liveNeedingAttention.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveFilter("strong")}
                    className={`px-3 py-1 text-xs font-heading font-bold rounded-xl border transition-all cursor-pointer ${
                      liveFilter === "strong"
                        ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                        : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] hover:bg-[#D9B87A]"
                    }`}
                  >
                    Strong ({liveStrong.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiveFilter("improving")}
                    className={`px-3 py-1 text-xs font-heading font-bold rounded-xl border transition-all cursor-pointer ${
                      liveFilter === "improving"
                        ? "bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                        : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] hover:bg-[#D9B87A]"
                    }`}
                  >
                    Breakthroughs ({liveImproving.length})
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={liveSearchQuery}
                  onChange={(e) => setLiveSearchQuery(e.target.value)}
                  placeholder="Search by student name, username, roll number, or concept..."
                  className="w-full pl-9 pr-3 py-2 bg-[#E8CF9C] border-2 border-[#1E1610] text-xs font-medium text-[#1E1610] placeholder-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                />
              </div>

              {/* Roster Table */}
              {filteredLiveMembers.length === 0 ? (
                <div className="p-8 text-center bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-2">
                  <p className="text-xs font-bold text-slate-700">No students match your filter.</p>
                  <button
                    type="button"
                    onClick={() => { setLiveFilter("all"); setLiveSearchQuery(""); }}
                    className="text-xs font-heading font-bold text-emerald-700 underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="sm:hidden text-[11px] text-slate-500 font-sans px-1 pb-1">Swipe table horizontally to see all student columns →</div>
                  <div className="table-responsive-container border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]">
                    <div className="min-w-[680px]">
                  <table className="w-full text-left text-xs border-collapse bg-[#E8CF9C]/70">
                    <thead>
                      <tr className="border-b-2 border-[#1E1610] bg-[#D9B87A] text-[#1E1610] font-heading font-extrabold">
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Username</th>
                        <th className="py-2.5 px-3">Pedagogical Persona</th>
                        <th className="py-2.5 px-3">Diagnostic Score</th>
                        <th className="py-2.5 px-3">Mastery</th>
                        <th className="py-2.5 px-3">Key Gap / Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLiveMembers.map((m, idx) => {
                        const prof = m.profiles || {};
                        const diagScore = m.latestDiagnosticScore;
                        const diagPct = m.latestDiagnosticPercentage;
                        const roll = m.rollNumber ? `#${String(m.rollNumber).padStart(2, "0")}` : `#${String(idx + 1).padStart(2, "0")}`;
                        const isTop = (diagPct ?? 0) >= 80;
                        const isLow = (diagPct ?? 0) < 65;

                        return (
                          <tr key={m.student_id || idx} className="hover:bg-[#E8CF9C] border-b border-[#1E1610]/20 transition-colors">
                            <td className="py-2.5 px-3 font-heading font-bold text-emerald-950 whitespace-nowrap">
                              <span className="text-slate-400 font-mono text-[11px] mr-1.5">{roll}</span>
                              {prof.full_name || m.name || "Student"}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                              @{prof.username || m.username || "student"}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold ${
                                m.resolvedGap
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : m.category === "strong"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  : m.category === "needs_attention"
                                  ? "bg-rose-100 text-rose-900 border border-rose-300"
                                  : "bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]"
                              }`}>
                                {m.persona || "Class 10 Student"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {diagScore ? (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-heading font-extrabold ${
                                  isTop ? "bg-emerald-100 text-emerald-900" : isLow ? "bg-rose-100 text-rose-900" : "bg-amber-100 text-amber-900"
                                }`}>
                                  {diagScore} ({diagPct}%)
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Pending</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full"
                                    style={{ width: `${m.latestDiagnosticPercentage || 70}%` }}
                                  />
                                </div>
                                <span className="font-heading font-bold text-[11px] text-slate-700">
                                  {m.latestDiagnosticPercentage || 70}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              {m.resolvedGap ? (
                                <span className="text-[10px] font-heading font-bold text-emerald-800 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Resolved: {m.resolvedGap.conceptId}</span>
                                </span>
                              ) : m.identifiedGap ? (
                                <span className="text-[10px] font-heading font-bold text-rose-800 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>Gap: {m.identifiedGap.conceptId}</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-700 font-medium">On Track</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setInspectingStudent(m)}
                                className="glass-btn-primary px-2.5 py-1 text-[10px] font-heading font-bold rounded-lg cursor-pointer whitespace-nowrap"
                              >
                                Inspect Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>

            {/* Modal: Inspect Student Profile & Diagnostic Journey */}
            {inspectingStudent && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-[#1E1610]">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-heading font-bold">
                          {activeLiveClass?.schoolName || "Vignan School"} • Class 10-A4
                        </span>
                        {inspectingStudent.rollNumber && (
                          <span className="font-mono text-xs font-bold text-slate-500">
                            #{String(inspectingStudent.rollNumber).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-black text-lg text-emerald-950 mt-1">
                        {inspectingStudent.profiles?.full_name || inspectingStudent.name || "Student"}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        @{inspectingStudent.profiles?.username || inspectingStudent.username}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectingStudent(null)}
                      className="px-3 py-1 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] text-xs font-heading font-bold border-2 border-[#1E1610] transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* Persona Tag */}
                  <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-heading uppercase text-slate-500 block font-bold">
                        Pedagogical Profile
                      </span>
                      <span className="font-heading font-extrabold text-xs text-slate-800">
                        {inspectingStudent.persona || "Enrolled Student"}
                      </span>
                    </div>
                    {inspectingStudent.diagnosticScore && (
                      <div className="text-right">
                        <span className="text-[10px] font-heading uppercase text-slate-500 block font-bold">
                          Diagnostic Score
                        </span>
                        <span className="font-heading font-black text-xs text-emerald-800">
                          {inspectingStudent.diagnosticScore}/{inspectingStudent.diagnosticTotal || 10} ({inspectingStudent.masteryPercentage || 80}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Breakthrough / Resolved Gap Banner */}
                  {inspectingStudent.resolvedGap && (
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Prerequisite Gap Resolved: {inspectingStudent.resolvedGap.conceptName} ({inspectingStudent.resolvedGap.conceptId})</span>
                      </div>
                      <p className="text-xs text-emerald-800/90 font-sans leading-relaxed">
                        Student showed a 40% diagnostic deficiency on negative integer signs, completed prerequisite interactive drills, and scored 90% on subsequent assessments.
                      </p>
                    </div>
                  )}

                  {/* Active Identified Gap Banner */}
                  {inspectingStudent.identifiedGap && !inspectingStudent.resolvedGap && (
                    <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Foundational Gap: {inspectingStudent.identifiedGap.conceptName} ({inspectingStudent.identifiedGap.conceptId})</span>
                      </div>
                      <p className="text-xs text-rose-800 font-sans leading-relaxed">
                        {inspectingStudent.identifiedGap.reason}
                      </p>
                    </div>
                  )}

                  {/* Strong Concepts & Concepts Needing Improvement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                      <span className="font-heading font-extrabold text-[11px] text-emerald-900 block">
                        Verified Strong Concepts
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(inspectingStudent.strongConcepts || ["Real Numbers", "Linear Equations"]).map((sc: string) => (
                          <span key={sc} className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded text-[10px] font-heading font-bold">
                            ✓ {sc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                      <span className="font-heading font-extrabold text-[11px] text-amber-900 block">
                        Pending Revision Topics
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(inspectingStudent.conceptsNeedingImprovement || ["Quadratic Equations"]).map((cc: string) => (
                          <span key={cc} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-heading font-bold">
                            ! {cc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Next Learning Activity */}
                  {inspectingStudent.recommendedActivity && (
                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-sky-700 block tracking-wider">
                        Recommended Next Activity
                      </span>
                      <p className="font-heading font-bold text-xs text-sky-950">
                        🎯 {inspectingStudent.recommendedActivity}
                      </p>
                    </div>
                  )}

                  {/* Assessment Attempts History */}
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-xs text-slate-700 uppercase tracking-wider">
                      Assessment & Diagnostic Attempts
                    </h4>
                    {(!inspectingStudent.attempts || inspectingStudent.attempts.length === 0) ? (
                      <p className="text-xs text-[#5A3720] italic p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610]">
                        No prior attempts recorded.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {inspectingStudent.attempts.map((att: any, aIdx: number) => {
                          const pct = Math.round((Number(att.score) / Number(att.total)) * 100);
                          const passed = pct >= 70;
                          return (
                            <div key={aIdx} className="flex items-center justify-between p-2 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-xs">
                              <div>
                                <span className="font-heading font-bold text-slate-800 capitalize">
                                  {att.type} • {att.identifier}
                                </span>
                                <span className="block text-[10px] text-slate-500">
                                  {att.created_at || att.createdAt ? new Date(att.created_at || att.createdAt).toLocaleString() : "Recent"}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-heading font-black ${
                                passed ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                              }`}>
                                {att.score}/{att.total} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Concept Mastery Progress */}
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-xs text-slate-700 uppercase tracking-wider">
                      Concept Mastery Progress
                    </h4>
                    {(!inspectingStudent.conceptMastery || inspectingStudent.conceptMastery.length === 0) ? (
                      <p className="text-xs text-[#5A3720] italic p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610]">
                        No concept progression recorded.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {inspectingStudent.conceptMastery.map((cm: any, cmIdx: number) => {
                          const mVal = Number(cm.mastery) || 0;
                          const isM = mVal >= 75 || cm.status === "mastered";
                          return (
                            <div key={cmIdx} className="p-2 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-slate-800">
                                  {cm.concept_id || cm.conceptId} {cm.conceptName ? `(${cm.conceptName})` : ""}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold ${
                                  isM ? "bg-emerald-100 text-emerald-900" : "bg-sky-100 text-sky-900"
                                }`}>
                                  {mVal}% {isM ? "Mastered" : "Learning"}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isM ? "bg-emerald-600" : "bg-sky-600"}`}
                                  style={{ width: `${Math.min(100, mVal)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Create New Class */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="panel-plank p-6 sm:p-7 border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] max-w-sm w-full space-y-4 text-[#1E1610]">
              <h3 className="font-heading font-black text-base text-emerald-950">
                Create a New Class
              </h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Class Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Class 9-B Mathematics"
                    className="w-full px-3 py-2 bg-[#E8CF9C] border-2 border-[#1E1610] text-xs text-[#1E1610] font-medium focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Grade Realm
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[6, 7, 8, 9, 10].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setNewClassGrade(g)}
                        className={`py-1.5 text-xs font-heading font-extrabold rounded-xl border border-slate-200 transition-all cursor-pointer ${
                          newClassGrade === g ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]" : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] hover:bg-[#D9B87A]"
                        }`}
                      >
                        C{g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-3.5 py-1.5 bg-[#D9B87A] hover:bg-[#E8CF9C] text-xs font-heading font-bold text-[#1E1610] border-2 border-[#1E1610] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-xs font-heading font-bold text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SYNTHETIC DEMO CLASS BANNER & SECTIONS */}
        {viewMode === "synthetic" && (
          <>
            {/* Synthetic Notice Banner */}
            <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#1E1610]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#3FA7C9] border-2 border-[#1E6F8C] flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
                  <Compass className="w-5 h-5 text-[#FFF7E6]" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-[10px] font-heading font-extrabold uppercase tracking-wider text-emerald-900 rounded-full mb-1">
                    Synthetic class, generated by the Margam engine
                  </div>
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight leading-tight text-emerald-950">
                    {syntheticClassData.className} — {syntheticClassData.chapterName}
                  </h1>
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    Teacher: {syntheticClassData.teacherName} • Chapter ID: {syntheticClassData.chapterId} • 25 Scripted Student Profiles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs font-heading font-bold px-3 py-1.5 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-center flex-1 sm:flex-none">
                  Engine Status: Active
                </span>
              </div>
            </div>

        {/* This Device: Current Student Session Card */}
        <section className="panel-plank p-4 sm:p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-2">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-950 mb-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span className="uppercase tracking-wider">This Device • Active Learner Session</span>
            <span className="ml-auto text-[11px] font-medium text-slate-500">Local Browser State</span>
          </div>

          {localProfile ? (
            <div className="bg-[#E8CF9C]/70 p-3 sm:p-4 border-2 border-[#1E1610] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#1E1610]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-base text-emerald-950">{localProfile.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[10px] font-heading font-bold text-emerald-900 rounded-full">
                    Class {localProfile.selectedClass}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[10px] font-heading font-bold text-emerald-950 rounded-full">
                    Difficulty L{localProfile.currentDifficulty || 1}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Active topics: {Object.keys(localProfile.topicProgress || {}).length} tracked •
                  Streak: {localProfile.consecutiveCorrect || 0} correct
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/student"
                  className="glass-btn-primary min-h-[40px] px-4 py-2 text-xs font-heading font-bold flex items-center justify-center gap-1.5 flex-1 sm:flex-none rounded-xl cursor-pointer"
                >
                  <span>Resume Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#1E1610]">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    No active student profile initialized on this browser device yet.
                  </p>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Student answers submitted in the learning flow will immediately appear in local diagnostics.
                  </p>
                </div>
              </div>
              <Link
                href="/student"
                className="glass-btn-primary min-h-[40px] px-4 py-2 text-xs font-heading font-bold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer w-full sm:w-auto"
              >
                <span>Launch Student Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Metrics Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Class Average</span>
            <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-700 mt-0.5">
              {metrics.averageScore}%
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-sans">
              Chapter Diagnostic Accuracy
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-rose-300 bg-rose-50/70 shadow-xs">
            <span className="text-[11px] font-bold text-rose-700 block uppercase">Needs Attention</span>
            <div className="font-heading font-black text-2xl sm:text-3xl text-rose-700 mt-0.5">
              {metrics.studentsNeedingAttentionCount} <span className="text-sm font-bold text-slate-600">/ {syntheticClassData.totalStudents}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-sans">
              {metrics.studentsNeedingAttentionPercentage}% of students flagged
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-300 bg-emerald-50/70 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 block uppercase">On Track</span>
            <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-700 mt-0.5">
              {metrics.studentsOnTrackCount} <span className="text-sm font-bold text-slate-600">/ {syntheticClassData.totalStudents}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-sans">
              {metrics.studentsOnTrackPercentage}% performing at or above grade
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-sky-300 bg-sky-50/70 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-sky-700 block uppercase">Top Missing Prereq</span>
              <div className="font-heading font-extrabold text-base sm:text-lg text-sky-950 mt-0.5 truncate" title={metrics.topMissingPrerequisite?.conceptName}>
                {metrics.topMissingPrerequisite?.conceptId}
              </div>
              <span className="text-[10px] font-bold text-[#E5D7BE] block mt-1 truncate">
                Class {metrics.topMissingPrerequisite?.class} • {metrics.topMissingPrerequisite?.count} Students ({metrics.topMissingPrerequisite?.percentage}%)
              </span>
            </div>
            <button
              onClick={() => setActiveTab("print")}
              className="mt-2 min-h-[38px] px-3 py-1.5 bg-[#78BDE8] hover:bg-[#4EDBD3] text-[#1E1610] font-heading font-bold text-xs border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center gap-1 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Group Worksheet (A4)</span>
            </button>
          </div>
        </section>

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#E8CF9C]/70 p-1.5 border-2 border-[#1E1610]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold"
                : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-bold"
            }`}
          >
            Students & Attention ({metrics.studentsNeedingAttentionCount})
          </button>
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "heatmap"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold"
                : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-bold"
            }`}
          >
            Concept Heatmap (M/P/G/L)
          </button>
          <button
            onClick={() => setActiveTab("misconceptions")}
            className={`min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "misconceptions"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold"
                : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-bold"
            }`}
          >
            Common Misconceptions & Roots
          </button>
          <button
            onClick={() => setActiveTab("print")}
            className={`min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "print"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold"
                : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-bold"
            }`}
          >
            Printable A4 Remedial Worksheet
          </button>
          <button
            onClick={() => setActiveTab("effort")}
            className={`min-h-[42px] px-3.5 py-2 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "effort"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] font-heading font-bold"
                : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-bold"
            }`}
          >
            Class Effort & Gaps
          </button>
        </div>

        {/* TAB 1: Dashboard & Attention List with Drill-Down */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Student Roster */}
            <div className="lg:col-span-5 space-y-4">
              <div className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-3 text-[#1E1610]">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-black text-base text-[#FFF7E6]">
                    Cohort Roster ({syntheticClassData.totalStudents})
                  </h2>
                  <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
                    Synthetic class
                  </span>
                </div>

                {/* Search & Filter Controls */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-[#2B1B0F]/60" />
                    <input
                      type="text"
                      placeholder="Search student by name or roll..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#E8CF9C] border-2 border-[#1E1610] text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5] font-sans"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterAttention(!filterAttention)}
                      className={`min-h-[40px] flex-1 px-3 py-1.5 text-xs font-heading font-bold rounded-xl border transition-all cursor-pointer ${
                        filterAttention
                          ? "bg-[#E04A3F] text-[#FFF7E6] shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
                          : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
                      }`}
                    >
                      {filterAttention ? "Showing Flagged Only" : "Filter: Needs Attention Only"}
                    </button>
                    {(filterAttention || searchQuery) && (
                      <button
                        onClick={() => {
                          setFilterAttention(false);
                          setSearchQuery("");
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 text-xs font-heading font-bold bg-[#E8CF9C] border-2 border-[#1E1610] text-[#1E1610] hover:bg-[#D9B87A] cursor-pointer"
                        title="Reset Filters"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Student Scrollable List */}
                <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                  {filteredStudents.map((st) => {
                    const isSelected = st.id === selectedStudentId;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStudentId(st.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all min-h-[48px] flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                          ? "bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs"
                            : st.needsAttention
                          ? "bg-[#E8CF9C] border-2 border-[#D1362B] text-[#1E1610]"
                          : "bg-[#E8CF9C] border-2 border-[#1E1610] text-[#1E1610]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 bg-[#D9B87A] border-2 border-[#1E1610] flex items-center justify-center text-xs font-heading font-bold shrink-0 text-[#1E1610]">
                            #{st.rollNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="font-heading font-black text-xs truncate">
                              {st.name}
                            </div>
                            <div className="text-[10px] font-semibold text-[#E5D7BE]/80 truncate max-w-[180px]">
                              {st.attentionReason}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-black rounded-full ${
                              st.diagnosticScore >= 80
                                ? "bg-[#5DAA3A] text-[#FFF7E6]"
                                : st.diagnosticScore >= 60
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-[#E04A3F] text-[#FFF7E6]"
                            }`}
                          >
                            {st.diagnosticScore}%
                          </span>
                          {st.needsAttention && (
                            <span className="block text-[9px] font-black text-rose-700 uppercase mt-0.5">
                              Alert
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-xs font-bold text-[#E5D7BE]">
                      No students match the current filter.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Evidence Drill-Down Panel */}
            <div className="lg:col-span-7 space-y-4">
              {/* Weekly Class Effort & Engagement Pulse Card */}
              <div className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-3 text-[#1E1610]">
                <div className="flex items-center justify-between border-b-2 border-[#1E1610]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#D9B87A]" />
                    <span className="font-heading font-extrabold text-xs text-[#1E1610] uppercase tracking-wider">
                      Class Effort Pulse
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#E8CF9C] border border-[#1E1610] font-heading font-bold text-[#1E1610]">
                    Focus: Effort & Gaps
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-1">
                    <span className="text-[10px] font-heading font-bold text-[#5A3720] uppercase block">
                      Questions Solved
                    </span>
                    <div className="text-sm font-heading font-extrabold text-[#1E1610]">
                      142 Completed
                    </div>
                  </div>

                  <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-1">
                    <span className="text-[10px] font-heading font-bold text-[#5A3720] uppercase block">
                      Active Days
                    </span>
                    <div className="text-sm font-heading font-extrabold text-[#D1362B]">
                      4.2 avg / week
                    </div>
                  </div>

                  <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] space-y-1">
                    <span className="text-[10px] font-heading font-bold text-[#5A3720] uppercase block">
                      Gaps Repaired
                    </span>
                    <div className="text-sm font-heading font-extrabold text-[#6DB33F]">
                      18 Foundations Fixed
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-plank p-6 sm:p-7 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-5 text-[#1E1610]">
                {/* Header of Selected Student */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-[#7A4B2A]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-emerald-100 rounded-xl border border-emerald-300 flex items-center justify-center font-heading font-extrabold text-sm text-emerald-900 shadow-xs">
                        #{selectedStudent.rollNumber}
                      </span>
                      <h3 className="font-heading font-black text-lg text-[#FFF7E6]">
                        {selectedStudent.name}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[10px] font-heading font-bold text-[#1E1610]">
                        {selectedStudent.persona}
                      </span>
                    </div>
                    <p className="text-xs text-[#E5D7BE] mt-1">
                      {selectedStudent.attentionReason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="px-3 py-1.5 rounded-xl bg-cream border-2 border-ink text-center shadow-hard-sm">
                      <span className="block text-[10px] font-bold text-slate-600 uppercase">Score</span>
                      <span className="font-heading font-black text-base text-ink">
                        {selectedStudent.correctCount}/{selectedStudent.totalQuestions} ({selectedStudent.diagnosticScore}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Remedial Concept Card */}
                {selectedStudent.recommendedRemedialConcept ? (
                  <div className="bg-yellow-light/60 border-2 border-ink rounded-xl p-4 shadow-hard-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-pink-700">
                        <AlertTriangle className="w-4 h-4 text-pink-700" />
                        <span>Recommended Remedial Intervention</span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[#1E1610]">
                        Confidence: {selectedStudent.recommendedRemedialConcept.confidence}
                      </span>
                    </div>

                    <div className="bg-[#E8CF9C]/70 border-2 border-[#1E1610] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-pill bg-pink text-ink border border-ink text-[10px] font-black">
                              Class {selectedStudent.recommendedRemedialConcept.class} Prerequisite
                            </span>
                            <span className="font-heading font-black text-sm text-ink">
                              {selectedStudent.recommendedRemedialConcept.name} ({selectedStudent.recommendedRemedialConcept.conceptId})
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                            {selectedStudent.recommendedRemedialConcept.reason}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 block">Ranking Score</span>
                          <span className="font-heading font-black text-sm text-ink">
                            {selectedStudent.recommendedRemedialConcept.score.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Prerequisite DAG Path Display */}
                      {selectedStudent.recommendedRemedialConcept.path && selectedStudent.recommendedRemedialConcept.path.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Graph Prerequisite Traversal Path:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {selectedStudent.recommendedRemedialConcept.path.map((node, i) => (
                              <React.Fragment key={node}>
                                <span className="px-2 py-0.5 bg-yellow-bright border border-ink rounded-md text-[11px] font-black text-ink shadow-hard-sm">
                                  {node}
                                </span>
                                {i < (selectedStudent.recommendedRemedialConcept?.path?.length ?? 0) - 1 && (
                                  <span className="text-xs font-black text-slate-500">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                setActiveTab("print");
                              }}
                              className="min-h-[48px] px-3.5 py-1.5 bg-yellow-bright hover:bg-yellow border-2 border-ink rounded-xl font-heading font-black text-xs shadow-hard-sm flex items-center gap-1.5"
                            >
                              <Printer className="w-4 h-4" />
                              <span>Print A4 Worksheet for {selectedStudent.recommendedRemedialConcept.conceptId} Group</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-light/40 border-2 border-ink rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-800 shrink-0" />
                    <span className="text-xs font-bold text-green-900">
                      No foundational prerequisite gaps detected. Student is on track with Class 10 concepts!
                    </span>
                  </div>
                )}

                {/* Evidence Drill-Down: Actual Answers & Tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-black text-sm text-ink uppercase tracking-wide">
                      Diagnostic Question Evidence ({selectedStudent.feedback.length} items)
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">
                      Real answer submissions
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedStudent.feedback.map((item, idx) => (
                      <div
                        key={item.questionId}
                        className={`p-3 rounded-xl border-2 border-ink text-xs ${
                          item.isCorrect
                            ? "bg-[#E8CF9C]"
                            : "bg-pink-light/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-pink-600 shrink-0" />
                            )}
                            <span className="font-bold text-ink">
                              Q{idx + 1}. ({item.questionId})
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              [{item.conceptId}]
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span>
                              Answer: <strong className={item.isCorrect ? "text-green-700" : "text-pink-700 font-bold"}>
                                {item.selectedOption}
                              </strong>
                            </span>
                            {!item.isCorrect && (
                              <span className="text-slate-500">
                                (Correct: <strong>{item.correctAnswer}</strong>)
                              </span>
                            )}
                          </div>
                        </div>

                        {item.mistakeTag && (
                          <div className="mt-2 pl-6">
                            <span className="inline-block px-2 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[#D1362B] text-[10px] font-black">
                              Tag: {item.mistakeTag.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Margam Engine Candidates Ranking Table */}
                {selectedStudent.gapAnalysis.candidates && selectedStudent.gapAnalysis.candidates.length > 0 && (
                  <div className="space-y-2 pt-2 border-t-2 border-ink">
                    <h4 className="font-heading font-black text-xs text-ink uppercase tracking-wide">
                      Engine Candidate Ranking Breakdown
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b-2 border-ink text-slate-600 font-black">
                            <th className="py-1">Candidate Concept</th>
                            <th className="py-1">Class</th>
                            <th className="py-1">Ranking Score</th>
                            <th className="py-1">Confidence</th>
                            <th className="py-1">Routing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {selectedStudent.gapAnalysis.candidates.map((cand) => (
                            <tr key={cand.conceptId} className="hover:bg-[#E8CF9C] border-b border-[#1E1610]/20">
                              <td className="py-1.5 font-bold text-ink">
                                {cand.conceptName} ({cand.conceptId})
                              </td>
                              <td className="py-1.5">Class {cand.class}</td>
                              <td className="py-1.5 font-mono font-black">{cand.score.toFixed(2)}</td>
                              <td className="py-1.5">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                                  cand.confidence === "high" || cand.confidence === "medium"
                                    ? "bg-pink-light text-pink-900 border border-pink-400"
                                    : "bg-[#D9B87A] text-[#1E1610]"
                                }`}>
                                  {cand.confidence}
                                </span>
                              </td>
                              <td className="py-1.5 font-mono text-[10px]">{cand.routing}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Concept Heatmap (M, P, G, L) */}
        {activeTab === "heatmap" && (
          <div className="panel-plank border-3 border-[#1E1610] p-5 shadow-[3px_3px_0px_#1E1610] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading font-black text-lg text-ink">
                  Classroom Concept Mastery Heatmap (25 × 10 Matrix)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Every cell displays a status letter (M, P, G, L) and color token computed directly by the Margam engine.
                </p>
              </div>

              {/* Legend with exact letters and colors */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green border-2 border-ink rounded-lg shadow-hard-sm">
                  <span className="font-heading font-black">M</span>
                  <span className="text-[10px]">Mastered (≥75%)</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan border-2 border-ink rounded-lg shadow-hard-sm">
                  <span className="font-heading font-black">P</span>
                  <span className="text-[10px]">Practicing (50–74%)</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-pink border-2 border-ink rounded-lg shadow-hard-sm">
                  <span className="font-heading font-black">G</span>
                  <span className="text-[10px]">Gap Detected</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow border-2 border-ink rounded-lg shadow-hard-sm">
                  <span className="font-heading font-black">L</span>
                  <span className="text-[10px]">Learning (&lt;50%)</span>
                </div>
              </div>
            </div>

            {/* Matrix Table with Horizontal Scroll */}
            <div className="overflow-x-auto border-2 border-ink rounded-xl">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-yellow-light/60 border-b-2 border-ink">
                    <th className="p-2.5 text-left font-heading font-black text-xs text-ink sticky left-0 bg-yellow-light z-10 border-r-2 border-ink min-w-[140px]">
                      Student
                    </th>
                    {heatmapConcepts.map((c) => (
                      <th
                        key={c.id}
                        className="p-2 font-heading font-black text-[11px] text-ink border-r border-ink/40 min-w-[70px]"
                        title={`${c.name} (Class ${c.class})`}
                      >
                        <span className="block">{c.shortName}</span>
                        <span className="text-[9px] font-bold text-slate-600">C{c.class}</span>
                      </th>
                    ))}
                    <th className="p-2 font-heading font-black text-[11px] text-ink min-w-[80px]">
                      Diag Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/20">
                  {students.map((st) => {
                    const isSelected = st.id === selectedStudentId;
                    return (
                      <tr
                        key={st.id}
                        onClick={() => {
                          setSelectedStudentId(st.id);
                          setActiveTab("dashboard");
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-[#8CCB55]/40" : "hover:bg-[#E8CF9C]"
                        }`}
                      >
                        {/* Student Name Sticky Left */}
                        <td className="p-2.5 text-left font-bold text-[#1E1610] sticky left-0 bg-[#D9B87A] border-r-2 border-[#1E1610] whitespace-nowrap z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-500">#{st.rollNumber}</span>
                            <span className="truncate max-w-[110px]">{st.name}</span>
                          </div>
                        </td>

                        {/* Concept Cells with Letter + Color */}
                        {st.heatmap.map((cell) => {
                          let cellStyle = "bg-[#E8CF9C] text-[#1E1610]";
                          if (cell.status === "M") cellStyle = "bg-green text-ink";
                          else if (cell.status === "P") cellStyle = "bg-cyan text-ink";
                          else if (cell.status === "G") cellStyle = "bg-pink text-ink font-black animate-pulse";
                          else if (cell.status === "L") cellStyle = "bg-yellow text-ink";

                          return (
                            <td
                              key={cell.conceptId}
                              className="p-1.5 border-r border-ink/20 text-center"
                              title={`${st.name} • ${cell.name}: ${cell.masteryPercentage}% (${cell.status})`}
                            >
                              <div
                                className={`w-8 h-8 mx-auto rounded-lg border-2 border-ink font-heading font-black text-xs flex items-center justify-center shadow-hard-sm ${cellStyle}`}
                              >
                                {cell.status}
                              </div>
                            </td>
                          );
                        })}

                        {/* Overall Diagnostic Score */}
                        <td className="p-2 font-mono font-black text-xs text-ink">
                          {st.diagnosticScore}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Click any student row to view their full evidence drill-down, question answers, and graph paths.
            </p>
          </div>
        )}

        {/* TAB 3: Common Misconceptions & Missing Prerequisites */}
        {activeTab === "misconceptions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Misconceptions List */}
            <div className="panel-plank border-3 border-[#1E1610] p-5 shadow-[3px_3px_0px_#1E1610] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
                <h3 className="font-heading font-black text-base text-ink">
                  Common Mistake Tags & Frequency
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-pill bg-pink-light border border-ink">
                  {syntheticClassData.commonMisconceptions.length} Tags Tracked
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Aggregated misconception patterns detected across the cohort from real diagnostic answer selections.
              </p>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {syntheticClassData.commonMisconceptions.map((m) => (
                  <div
                    key={m.tag}
                    className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-black text-xs text-ink uppercase">
                        {m.description}
                      </span>
                      <span className="px-2 py-0.5 rounded-pill bg-pink text-ink border border-ink text-[10px] font-black shrink-0">
                        {m.count} Students ({m.percentage}%)
                      </span>
                    </div>
                    <span className="block font-mono text-[10px] text-slate-500 truncate">
                      tag: {m.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Missing Prerequisites */}
            <div className="panel-plank border-3 border-[#1E1610] p-5 shadow-[3px_3px_0px_#1E1610] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-ink">
                <h3 className="font-heading font-black text-base text-ink">
                  Frequently Missing Prerequisites
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-pill bg-cyan-light border border-ink">
                  {syntheticClassData.frequentlyMissingPrerequisites.length} Concepts
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Foundational concepts diagnosed as root bottlenecks before Class 10 quadratic factoring can succeed.
              </p>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {syntheticClassData.frequentlyMissingPrerequisites.map((p) => (
                  <div
                    key={p.conceptId}
                    className="p-3.5 bg-yellow-light/40 border-2 border-ink rounded-xl shadow-hard-sm space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-[#D9B87A] border-2 border-[#1E1610] text-[10px] font-black text-[#1E1610] mb-1">
                          Class {p.class} Foundational Concept
                        </span>
                        <h4 className="font-heading font-black text-xs sm:text-sm text-ink">
                          {p.conceptName} ({p.conceptId})
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-pink text-ink border-2 border-ink font-heading font-black text-xs shrink-0 shadow-hard-sm">
                        {p.count} Students ({p.percentage}%)
                      </span>
                    </div>

                    <p className="text-xs text-[#5A3720] leading-relaxed bg-[#E8CF9C]/70 p-2.5 border-2 border-[#1E1610]">
                      {p.learningObjective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Printable A4 Worksheet Preview */}
        {activeTab === "print" && (
          <div className="panel-plank border-3 border-[#1E1610] p-6 shadow-[3px_3px_0px_#1E1610] space-y-5 print:border-none print:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-4">
              <div>
                <h2 className="font-heading font-black text-lg text-ink">
                  Print-Ready A4 Remedial Practice Worksheet
                </h2>
                <p className="text-xs text-slate-600">
                  Targeted remediation for top class bottleneck: Class 7 Integer Multiplication & Sign Rules ({metrics.topMissingPrerequisite?.conceptId})
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="min-h-[48px] px-4 py-2 bg-yellow-bright hover:bg-yellow border-2 border-ink rounded-xl font-heading font-black text-xs shadow-hard flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Printer className="w-4 h-4" />
                <span>Print Worksheet</span>
              </button>
            </div>

            {/* A4 Sheet Preview & Print Container */}
            <div className="printable-a4-sheet p-6 border-2 border-dashed border-[#1E1610] bg-[#F3E3BC] space-y-6 text-xs text-[#1E1610] max-w-2xl mx-auto">
              {/* Print media query styling */}
              <style jsx global>{`
                @media print {
                  body {
                    background: white !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }
                  nav, header, footer, button, .no-print {
                    display: none !important;
                  }
                  .printable-a4-sheet {
                    display: block !important;
                    border: 2px solid black !important;
                    box-shadow: none !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 18px !important;
                    margin: 0 !important;
                  }
                  @page {
                    size: A4 portrait;
                    margin: 12mm;
                  }
                }
              `}</style>
              <div className="flex justify-between items-center border-b-2 border-ink pb-3">
                <div>
                  <h3 className="font-heading font-black text-sm">Margam Adaptive Learning • Targeted Remediation</h3>
                  <p className="text-[11px] text-slate-600">Topic: Integer Multiplication & Rule of Signs (Class 7 Prerequisite)</p>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <p>Student Name: _______________________</p>
                  <p>Roll No: _______ Date: _____________</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-bold">Q1. Evaluate the signed product: (-4) × (-7)</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) -28</div>
                    <div>(B) 28</div>
                    <div>(C) -11</div>
                    <div>(D) 11</div>
                  </div>
                </div>

                <div>
                  <p className="font-bold">Q2. Evaluate (-3)² and compare with -(3²):</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) Both equal -9</div>
                    <div>(B) (-3)² = 9, while -(3²) = -9</div>
                    <div>(C) Both equal 9</div>
                    <div>(D) (-3)² = -6, while -(3²) = 6</div>
                  </div>
                </div>

                <div>
                  <p className="font-bold">Q3. Solve for x: (-5) × x = 35</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) x = 7</div>
                    <div>(B) x = -7</div>
                    <div>(C) x = -30</div>
                    <div>(D) x = 30</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-ink text-[10px] text-slate-500 flex justify-between">
                <span>Teacher Signature: _____________________</span>
                <span>Margam Remedial Print Edition • Zero Internet Required</span>
              </div>
            </div>
          </div>
        )}
        {/* TAB 5: Class Effort & Learning Gaps Tracker (No competitive leaderboard) */}
        {activeTab === "effort" && (
          <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-5 text-[#1E1610]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1E1610]/20 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#1E1610]">
                  Class Effort & Learning Gaps Tracker
                </h3>
                <p className="text-xs text-[#5A3720] font-sans">
                  Tracks individual student practice activity, consistency, and resolved prerequisite gaps without public peer ranking.
                </p>
              </div>
              <span className="text-xs font-heading font-extrabold px-2.5 py-1 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]">
                {students.length} Students Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1E1610] text-[#5A3720] font-heading font-extrabold text-[11px] uppercase">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Questions Solved</th>
                    <th className="py-2.5 px-3">Days Active</th>
                    <th className="py-2.5 px-3">Root Gap Status</th>
                    <th className="py-2.5 px-3">Attention Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1E1610]/10 font-sans">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-[#E8CF9C]/50 transition-colors">
                      <td className="py-2.5 px-3 font-heading font-bold text-[#1E1610]">
                        #{st.rollNumber} {st.name}
                      </td>
                      <td className="py-2.5 px-3 text-[#1E1610]">
                        {(st as any).totalQuestions || Math.round(st.diagnosticScore * 2.5)}
                      </td>
                      <td className="py-2.5 px-3 text-[#D1362B] font-bold">
                        {Math.max(1, Math.min(7, ((st.correctCount || 2) + 1)))} days in a row
                      </td>
                      <td className="py-2.5 px-3">
                        {st.needsAttention ? (
                          <span className="px-2 py-0.5 bg-[#D1362B] text-[#F3E3BC] border border-[#1E1610] text-[10px] font-heading font-bold">
                            Prerequisite Gap: {typeof st.recommendedRemedialConcept === "object" && st.recommendedRemedialConcept ? (st.recommendedRemedialConcept as any).name : (st.recommendedRemedialConcept || "Class 7 Integers")}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#6DB33F] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-bold">
                            Foundations Strong ✓
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {st.needsAttention ? (
                          <span className="px-2 py-0.5 bg-[#F2C230] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-extrabold">
                            Needs Guidance
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#E8CF9C] text-[#5A3720] border border-[#1E1610] text-[10px] font-heading font-bold">
                            On Track
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-3 border-[#1E1610] py-6 text-center text-xs font-bold bg-[#D9B87A] text-[#1E1610] mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Margam • Teacher Partnership & Classroom Practice</span>
          <span className="text-[11px] font-black px-2 py-0.5 rounded-pill bg-yellow-light border border-ink text-ink">
            Synthetic class, generated by the Margam engine
          </span>
        </div>
      </footer>
    </div>
  );
}
