import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DRK Selbstauskunft",
  description: "Digitale Selbstauskunft für Vorstände, Geschäftsführer und Prokuristen",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col">
        <header
          style={{ background: "var(--drk)", color: "var(--white)" }}
          className="px-4 py-3 flex items-center justify-between gap-3"
        >
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="DRK Logo" width={42} height={42} />
            <div>
              <h1 className="text-xl font-bold leading-tight">DRK Selbstauskunft</h1>
              <div className="text-xs opacity-85">Digitale Compliance-Erklärung</div>
            </div>
          </Link>
          <Link
            href="/hilfe"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors"
            title="Hilfe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </Link>
        </header>
        <main className="flex-1 w-full max-w-[900px] mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center py-10 mt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--drk)" }}>
            Deutsches Rotes Kreuz
          </div>
          <div className="text-sm mb-3" style={{ color: "var(--text-light)" }}>
            Kreisverband StädteRegion Aachen e.V.
          </div>
          <div className="text-xs mb-3" style={{ color: "var(--text-light)" }}>
            <Link href="/impressum" className="hover:underline" style={{ color: "inherit" }}>Impressum</Link>
            {" · "}
            <Link href="/datenschutz" className="hover:underline" style={{ color: "inherit" }}>Datenschutz</Link>
            {" · "}
            <Link href="/hilfe" className="hover:underline" style={{ color: "inherit" }}>Hilfe</Link>
          </div>
          <div className="text-xs flex items-center justify-center gap-1" style={{ color: "var(--text-light)" }}>
            made with{" "}
            <span style={{ color: "var(--drk)" }}>&#10084;</span>
            {" "}for{" "}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--drk)" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z" />
            </svg>
          </div>
        </footer>
      </body>
    </html>
  );
}
