import Link from "next/link";
import { Compass, Cookie, ArrowLeft } from "lucide-react";

export default function CookiesPage() {
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
            <Cookie className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                Cookie & Storage Policy
              </h1>
              <p className="text-xs text-muted-foreground">Strictly Necessary Storage Usage</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">1. No Third-Party Tracking Cookies</h2>
            <p>
              Margam does NOT use advertising cookies, marketing pixels, cross-site trackers, or third-party behavioral analytics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">2. Essential Local Storage Only</h2>
            <p>
              We utilize browser <code>localStorage</code> strictly for the purpose of maintaining your local learner profile,
              selected class, and topic unlock progression across page reloads.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">3. User Control</h2>
            <p>
              You can clear your local progression at any time by visiting the <strong>Reset Class</strong> section or clearing
              your browser cache and site data.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam • Cookie & Storage Policy
      </footer>
    </div>
  );
}
