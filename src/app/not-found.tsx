import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b-[3px] border-[#2B1B0F] bg-white text-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center text-[#2B1B0F]">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-pixel text-base text-[#2B1B0F]">MARGAM</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Card */}
      <main className="max-w-md mx-auto px-4 py-16 text-center w-full my-auto">
        <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-8 space-y-4">
          <span className="font-pixel text-4xl text-[#E04A3F] block">404</span>
          <h1 className="font-heading font-extrabold text-2xl text-[#2B1B0F]">Page not found.</h1>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed">
            This maths quest does not exist.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[4px_4px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Ground Strip */}
      <footer className="border-t-[3px] border-[#422816] py-4 text-center text-xs text-[#FFF7E6] bg-[#5A3720]">
        Margam · Maths for Classes 6-10
      </footer>
    </div>
  );
}
