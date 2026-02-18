import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">🛡️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selbstauskunft</h2>
        <p className="text-gray-600 mb-6">
          Für Vorstände, Geschäftsführer und Prokuristen
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Füllen Sie die jährliche Selbstauskunft digital aus — 
          Schritt für Schritt, sicher und vertraulich.
        </p>
        <Link
          href="/wizard"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Selbstauskunft starten
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-900 mb-1">6 Abschnitte</h3>
          <p className="text-sm text-gray-500">Geführter Wizard — Schritt für Schritt durch alle Themen</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-2xl mb-2">💾</div>
          <h3 className="font-semibold text-gray-900 mb-1">Zwischenspeichern</h3>
          <p className="text-sm text-gray-500">Jederzeit pausieren und später weitermachen</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="text-2xl mb-2">📄</div>
          <h3 className="font-semibold text-gray-900 mb-1">PDF-Export</h3>
          <p className="text-sm text-gray-500">Fertige Auskunft als PDF herunterladen</p>
        </div>
      </div>
    </div>
  );
}
