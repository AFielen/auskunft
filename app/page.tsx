import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <div
        className="rounded-[10px] p-8 text-center"
        style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
      >
        <div className="text-5xl mb-4">🛡️</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--drk)" }}>
          Selbstauskunft
        </h2>
        <p style={{ color: "var(--text)" }} className="mb-2">
          Für Vorstände, Geschäftsführer und Prokuristen
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-light)" }}>
          Füllen Sie die jährliche Selbstauskunft digital aus —
          Schritt für Schritt, sicher und vertraulich.
        </p>
        <Link
          href="/wizard"
          className="inline-block text-white font-semibold px-8 py-3 rounded-[10px] transition-colors"
          style={{ background: "var(--drk)" }}
        >
          Selbstauskunft starten
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "📋", title: "6 Abschnitte", desc: "Geführter Wizard — Schritt für Schritt durch alle Themen" },
          { icon: "💾", title: "Zwischenspeichern", desc: "Jederzeit pausieren und später weitermachen" },
          { icon: "📄", title: "PDF-Export", desc: "Fertige Auskunft als PDF herunterladen" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[10px] p-5"
            style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>{item.title}</h3>
            <p className="text-sm" style={{ color: "var(--text-light)" }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
