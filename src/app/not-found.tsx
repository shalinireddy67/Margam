import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-foreground">Margam</span>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-4xl font-extrabold text-primary">404</span>
        <h1 className="text-xl font-heading font-bold text-foreground">Page Not Found</h1>
        <p className="text-xs text-muted-foreground">
          The requested mathematics resource or route does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Margam Home</span>
        </Link>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam
      </footer>
    </div>
  );
}
