import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DRK Selbstauskunft",
  description: "Digitale Selbstauskunft für Vorstände, Geschäftsführer und Prokuristen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="text-red-600 font-bold text-xl">✚</div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">DRK Selbstauskunft</h1>
              <p className="text-xs text-gray-500">Deutsches Rotes Kreuz — Städteregion Aachen</p>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
