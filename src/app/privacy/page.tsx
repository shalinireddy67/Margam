import Link from "next/link";
import { Compass, ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                Privacy Notice & Data Protection
              </h1>
              <p className="text-xs text-muted-foreground">Drafted in accordance with DPDP Principles</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">1. Privacy by Architecture & Data Minimization</h2>
            <p>
              Margam is designed with radical data minimization. We do not require, collect, or store student email
              addresses, telephone numbers, Aadhaar numbers, biometric data, or residential addresses. Student accounts
              require only a self-chosen username and password.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">2. Dual Storage: Guest Mode & Cloud Sync</h2>
            <p>
              <strong>Guest Mode:</strong> Students can use Margam entirely offline or without creating an account. Learning progression, diagnostic results, and worksheet attempts stay strictly within local browser storage (<code>localStorage</code>).
            </p>
            <p>
              <strong>Supabase Mode (Cloud Sync):</strong> When creating an account, an internal, non-mailable address is generated solely for authentication. Learning progress is synced via server-only routes with PostgreSQL Row-Level Security (RLS). Students read and write only their own records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">3. One-Time Recovery Codes & Account Security</h2>
            <p>
              Because Margam does not collect student email addresses or phone numbers, passwords cannot be reset via email.
              During sign-up, a one-time cryptographic recovery code is displayed once to the student and stored exclusively as a SHA-256 hash. Login endpoints enforce a 15-minute lockout after 5 consecutive failed attempts to prevent automated credential attacks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">4. Teacher Accounts & Guardian Consent</h2>
            <p>
              Teacher registration requires professional school verification and explicit confirmation of school or guardian consent. Teachers create private class codes and can view only students who deliberately join their specific class code. Teachers cannot access records of students enrolled with other educators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">5. Single-Grade Learner Isolation</h2>
            <p>
              To maintain academic integrity and prevent multi-grade data confusion, each learner profile is locked to
              one selected class. Switching grades requires a deliberate reset that clears local progress, preventing
              cross-contamination between different syllabus levels.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">6. Alignment with DPDP Act 2023</h2>
            <p>
              We adhere strictly to the foundational principles of the Digital Personal Data Protection (DPDP) Act 2023:
              purpose limitation, collection minimization, transparent user choice, and storage security. We do not
              claim formal statutory certification, but our architecture embodies privacy-by-design.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">7. Contact & Questions</h2>
            <p>
              For queries or feedback regarding our open mathematical tools, contact us via the Margam repository.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam • Privacy Architecture
      </footer>
    </div>
  );
}
