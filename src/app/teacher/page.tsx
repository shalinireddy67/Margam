"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Printer,
  Users,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import demoClassData from "../../../data/demo-class.json";

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<"roadmap" | "printable" | "sample_class">("roadmap");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-foreground tracking-tight">
              Margam
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-1">
              Teacher Tools (Roadmap)
            </span>
          </Link>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft transition-all"
          >
            <span>Enter Student Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Banner with Clear Status Disclaimer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Teacher Experience Roadmap & Classroom Artifacts</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            Designed to Empower Indian Teachers, Not Replace Them
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            In government schools and multi-grade Indian classrooms, teachers spend hours grading diagnostic tests
            manually. Margam provides transparent mastery aggregations and offline printable worksheets. Below is an
            honest preview of currently planned teacher features and sample classroom data.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "roadmap"
                  ? "bg-primary text-white shadow-soft"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Planned Teacher Roadmap
            </button>
            <button
              onClick={() => setActiveTab("printable")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "printable"
                  ? "bg-primary text-white shadow-soft"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Printable A4 Worksheet Preview
            </button>
            <button
              onClick={() => setActiveTab("sample_class")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "sample_class"
                  ? "bg-primary text-white shadow-soft"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Synthetic Classroom Data ({demoClassData.totalStudents} Students)
            </button>
          </div>
        </div>

        {/* Tab 1: Roadmap View */}
        {activeTab === "roadmap" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Classroom Learning-Gap Matrix
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregated heatmap showing which students struggle with foundational Class 6 and 7 prerequisites
                (e.g., negative sign rules) before starting Class 8 polynomials or Class 10 quadratics.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                Status: Phase 2 Planned Feature
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Suggested Peer Learning Groups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algorithmic suggestions that pair students with complementary mastery patterns for 15-minute
                classroom peer-tutoring activities, with complete teacher override control.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                Status: Phase 2 Planned Feature
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                One-Click Printable Worksheets
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean, low-ink A4 printable question sets formatted specifically for Indian government schools
                with low or intermittent internet connectivity.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                Status: Sample Generator Active Below
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Teacher Decision Sovereignty
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No automated black-box grading decisions. Teachers retain 100% control over student topic unlocking,
                custom homework assignments, and classroom pacing.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                Core Architecture Guarantee
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Printable A4 Preview */}
        {activeTab === "printable" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-6 print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-foreground">
                  A4 Remedial Practice Worksheet
                </h2>
                <p className="text-xs text-muted-foreground">
                  Format: Single-sheet print-optimized • Class 8 Mathematics • Distributive Law
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Worksheet</span>
              </button>
            </div>

            {/* Printable Mock Document */}
            <div className="p-6 border border-dashed border-slate-300 rounded-2xl bg-white space-y-5 text-xs text-slate-800">
              <div className="flex justify-between items-center border-b pb-3 border-slate-300">
                <div>
                  <h3 className="font-bold text-sm">Margam Adaptive Learning • Classroom Practice</h3>
                  <p className="text-[11px] text-slate-600">Chapter: We Distribute, Yet Things Multiply</p>
                </div>
                <div className="text-right text-[11px]">
                  <p>Student Name: _________________________</p>
                  <p>Roll No: ________ Date: _______________</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-bold">Q1. Expand the expression using the distributive property: -4(2x - 7)</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) -8x - 28</div>
                    <div>(B) -8x + 28</div>
                    <div>(C) 8x - 28</div>
                    <div>(D) -8x - 7</div>
                  </div>
                </div>

                <div>
                  <p className="font-bold">Q2. Multiply the two binomials and combine like terms: (x + 3)(x + 7)</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) x² + 21</div>
                    <div>(B) x² + 10x + 21</div>
                    <div>(C) x² + 10x + 10</div>
                    <div>(D) x² + 21x + 10</div>
                  </div>
                </div>

                <div>
                  <p className="font-bold">Q3. Expand and simplify: (x - 5)(x + 8)</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 pl-4 text-[11px]">
                    <div>(A) x² - 3x - 40</div>
                    <div>(B) x² + 3x - 40</div>
                    <div>(C) x² + 3x + 40</div>
                    <div>(D) x² - 40</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between">
                <span>Teacher Signature: _____________________</span>
                <span>Margam Remedial Print Edition</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Synthetic Class Data */}
        {activeTab === "sample_class" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">
                  {demoClassData.className} ({demoClassData.academicYear})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Teacher: {demoClassData.teacherName} • Subject: Mathematics
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                Sample Data (Fictional)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 font-bold">Roll</th>
                    <th className="py-2 font-bold">Name</th>
                    <th className="py-2 font-bold">Grade</th>
                    <th className="py-2 font-bold">Signed Numbers (C6)</th>
                    <th className="py-2 font-bold">Distributive Law (C8)</th>
                    <th className="py-2 font-bold">Identified Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demoClassData.students.slice(0, 10).map((st) => {
                    const c6Mastery = st.mastery.find((m) => m.conceptId === "c6-neg-01")?.masteryPercentage ?? 0;
                    const c8Mastery = st.mastery.find((m) => m.conceptId === "c8-dist-01")?.masteryPercentage ?? 0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-2 font-semibold text-slate-500">#{st.rollNumber}</td>
                        <td className="py-2 font-bold text-foreground">{st.name}</td>
                        <td className="py-2 text-slate-600">Class {st.overallGradeLevel}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c6Mastery >= 75
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {c6Mastery}%
                          </span>
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c8Mastery >= 75
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {c8Mastery}%
                          </span>
                        </td>
                        <td className="py-2 text-slate-600 truncate max-w-[180px]">
                          {st.diagnosedRootGap?.rationale || "On track"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 text-center pt-2">
              Showing first 10 students of synthetic cohort. All data generated for prototype validation only.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-muted-foreground bg-white">
        Margam • Teacher Partnership & Classroom Practice Tools
      </footer>
    </div>
  );
}
