import Link from "next/link";
import { Compass, BookCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-foreground">Margam</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex-1">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <BookCheck className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground">Margam Educational Platform</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">1. Purpose</h2>
            <p>
              Margam is a functional prototype designed for adaptive mathematics learning for Indian students in
              Classes 6 through 10. The platform is offered free of charge for educational demonstration and testing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">2. Curriculum Alignment & Intellectual Property</h2>
            <p>
              The chapter catalogue and learning themes are organized to align with the official 2026-27 NCERT mathematics
              curriculum (*Ganita Prakash* and *Ganita Manjari*). All practice questions, lesson explanations, and
              diagnostic items are original works created for this platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">3. Pilot Demonstration Scope</h2>
            <p>
              The five-chapter pilot chain (covering signed numbers to quadratic equations) is fully functional. Chapters
              labeled as "Content in progress" represent the official syllabus roadmap and are non-interactive until
              their questions and lessons are reviewed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">4. User Responsibility</h2>
            <p>
              Learners and educators are responsible for preserving their browser session data. Margam does not warrant
              permanent retention of local browser storage across browser resets.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam • Terms of Service
      </footer>
    </div>
  );
}
