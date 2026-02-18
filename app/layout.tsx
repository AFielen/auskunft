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
          className="px-4 py-3 flex items-center gap-3"
        >
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="DRK Logo" width={42} height={42} />
            <div>
              <h1 className="text-xl font-bold leading-tight">DRK Selbstauskunft</h1>
              <div className="text-xs opacity-85">Digitale Compliance-Erklärung</div>
            </div>
          </Link>
        </header>
        <main className="flex-1 w-full max-w-[900px] mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center text-xs py-4" style={{ color: "var(--text-light)" }}>
          DRK Selbstauskunft — Deutsches Rotes Kreuz ·{" "}
          <Link href="/impressum" className="underline" style={{ color: "inherit" }}>Impressum</Link> ·{" "}
          <Link href="/datenschutz" className="underline" style={{ color: "inherit" }}>Datenschutz</Link>
        </footer>
      </body>
    </html>
  );
}
