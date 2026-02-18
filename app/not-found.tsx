import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--drk)" }}>Seite nicht gefunden</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-light)" }}>
        Die angeforderte Seite existiert nicht.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2 rounded-[10px] text-white font-semibold"
        style={{ background: "var(--drk)" }}
      >
        ← Zur Startseite
      </Link>
    </div>
  );
}
