"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { card } from "@/lib/styles";
import { getOrCreateInstanceId } from "@/lib/instance";

const faqItems = [
  {
    q: "Wo werden meine Daten gespeichert?",
    a: "Nirgends auf einem Server. Alle Angaben bleiben auf Ihrem Gerät (localStorage im Browser). Wenn Sie den PDF-Report herunterladen und den Wizard abschließen, werden die lokalen Daten gelöscht.",
  },
  {
    q: "Kann ich den Fortschritt speichern?",
    a: "Ja! Die App speichert Ihren Fortschritt automatisch im Browser. Sie können jederzeit pausieren und später weitermachen — solange Sie denselben Browser auf demselben Gerät verwenden.",
  },
  {
    q: 'Was passiert, wenn ich "Teilweise" anklicke?',
    a: "Sie werden aufgefordert, eine Begründung einzugeben. Diese erscheint im PDF-Report und hilft dem Aufsichtsorgan, die Situation zu verstehen.",
  },
  {
    q: "Was ist der QR-Code im Report?",
    a: "Der QR-Code enthält Ihre Antworten als komprimierten String. Beim nächsten Mal können Sie den Code scannen — die App füllt dann alle Felder automatisch vor. So sparen Sie Zeit beim jährlichen Ausfüllen.",
  },
  {
    q: "Kann ich die App auf meinem eigenen Server hosten?",
    a: "Ja! Die App ist Open Source (MIT-Lizenz). Sie können sie auf Ihrem eigenen Server oder via Docker betreiben.",
  },
];

const feedbackTypes = [
  { value: "bug" as const, label: "Bug melden", icon: "🐛" },
  { value: "feature" as const, label: "Idee", icon: "💡" },
  { value: "question" as const, label: "Frage", icon: "?" },
  { value: "other" as const, label: "Sonstiges", icon: "💬" },
];

export default function HilfePage() {
  const [instanceId, setInstanceId] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "question" | "other">("bug");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setInstanceId(getOrCreateInstanceId());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceId,
          type: feedbackType,
          message: feedbackMessage,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: "success", message: data.message });
        setFeedbackMessage("");
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Fehler beim Senden" });
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Netzwerkfehler beim Senden" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="hero">
        <div className="relative z-1 max-w-[640px] mx-auto">
          <div className="hero-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Hilfe & Support</h2>
          <p className="text-sm opacity-90 leading-relaxed max-w-md mx-auto">
            Alles Wichtige zur DRK Selbstauskunft — von der Idee bis zur Technik.
          </p>
        </div>
      </div>

      {/* Was ist die Selbstauskunft? */}
      <div className="overlap-card fade-up fade-up-delay-2">
        <h3 className="text-base font-bold mb-1" style={{ color: "var(--drk)" }}>
          Was ist die DRK Selbstauskunft?
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-light)" }}>
          Die jährliche Selbstauskunft ist ein Compliance-Instrument für Führungskräfte in
          DRK-Gliederungen. Vorstände, Geschäftsführer und Prokuristen bestätigen damit die
          Einhaltung zentraler Pflichten gegenüber ihrem Aufsichtsorgan.
        </p>

        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon" style={{ background: "#fce4ec", color: "var(--drk)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Internes Kontrollsystem</p>
              <p className="text-xs" style={{ color: "var(--text-light)" }}>Teil des IKS — Risiken erkennen, Transparenz schaffen</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{ background: "#e8f5e9", color: "var(--success)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Zielgruppe</p>
              <p className="text-xs" style={{ color: "var(--text-light)" }}>Vorstände, Geschäftsführer und Prokuristen in DRK-Gliederungen</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Digital & datenschutzkonform</p>
              <p className="text-xs" style={{ color: "var(--text-light)" }}>Schritt für Schritt am Handy oder Computer</p>
            </div>
          </div>
        </div>
      </div>

      {/* So funktioniert die App */}
      <div style={card} className="p-6 fade-up fade-up-delay-3">
        <h3 className="text-base font-bold mb-1" style={{ color: "var(--drk)" }}>
          So funktioniert die App
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-light)" }}>
          In vier Schritten zur fertigen Selbstauskunft.
        </p>

        <ol className="steps-list">
          <li>
            <div>
              <strong>Persönliche Daten eingeben</strong>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                Name, Funktion, DRK-Gliederung und Aufsichtsorgan.
              </p>
            </div>
          </li>
          <li>
            <div>
              <strong>36 Fragen beantworten</strong>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                6 Abschnitte — von Geschäftsführung bis Revision. Bei Abweichungen wird
                automatisch eine Begründung verlangt.
              </p>
            </div>
          </li>
          <li>
            <div>
              <strong>Zusammenfassung prüfen</strong>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                Alle Antworten auf einen Blick — Abweichungen werden hervorgehoben.
              </p>
            </div>
          </li>
          <li>
            <div>
              <strong>PDF drucken oder speichern</strong>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-light)" }}>
                Vollständiger Bericht mit Unterschriftszeile und QR-Code für das nächste Jahr.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Die 6 Abschnitte */}
      <div style={card} className="p-6 fade-up fade-up-delay-4">
        <h3 className="text-base font-bold mb-3" style={{ color: "var(--drk)" }}>
          Die 6 Abschnitte
        </h3>
        <div className="space-y-2">
          {[
            { nr: 1, title: "Geschäftsführung & Interessenkonflikte", count: 6, color: "#fce4ec" },
            { nr: 2, title: "Sitzungen & Beschlussfassungen", count: 3, color: "#e3f2fd" },
            { nr: 3, title: "Zustimmungspflichtige Rechtsgeschäfte", count: 5, color: "#fff3e0" },
            { nr: 4, title: "Arbeitgeberstellung", count: 11, color: "#e8f5e9" },
            { nr: 5, title: "Finanzwesen", count: 8, color: "#f3e5f5" },
            { nr: 6, title: "Revision & Compliance", count: 3, color: "#e0f7fa" },
          ].map((s) => (
            <div
              key={s.nr}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <div
                className="flex items-center justify-center font-bold text-xs rounded-full flex-shrink-0"
                style={{ width: 28, height: 28, background: s.color, color: "var(--drk)" }}
              >
                {s.nr}
              </div>
              <span className="text-sm flex-1" style={{ color: "var(--text)" }}>{s.title}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--text-light)" }}>
                {s.count} Fragen
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Datenschutz */}
      <div style={card} className="p-6 fade-up fade-up-delay-5">
        <h3 className="text-base font-bold mb-1" style={{ color: "var(--drk)" }}>
          Datenschutz & Sicherheit
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-light)" }}>
          Privacy by Design — keine Kompromisse.
        </p>

        <div className="space-y-3">
          {[
            { icon: "🚫", title: "Keine Datenbank", desc: "Alle Angaben existieren nur im Browser" },
            { icon: "🍪", title: "Keine Cookies", desc: "Kein Tracking, keine Analytics, kein Fingerprinting" },
            { icon: "🔌", title: "Keine externen Dienste", desc: "Keine Google Fonts, kein CDN, keine eingebetteten Inhalte" },
            { icon: "📱", title: "localStorage nur lokal", desc: "Wird bei Abgabe automatisch gelöscht" },
            { icon: "📷", title: "QR-Code = komprimierte Daten", desc: "Kein Server, kein Token — die Daten reisen mit dem Dokument" },
            { icon: "✅", title: "DSGVO-konform", desc: "Keine serverseitige Verarbeitung personenbezogener Daten" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.title}</p>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div style={card} className="p-6 fade-up fade-up-delay-6">
        <h3 className="text-base font-bold mb-4" style={{ color: "var(--drk)" }}>
          Häufige Fragen
        </h3>
        <div>
          {faqItems.map((item, i) => (
            <div key={i} style={{ borderBottom: i < faqItems.length - 1 ? "1px solid var(--border)" : "none" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 py-3 text-left"
              >
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-light)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && (
                <p className="text-sm pb-3 -mt-1" style={{ color: "var(--text-light)" }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KI-Agenten */}
      <div style={card} className="p-6 fade-up">
        <div className="flex items-start gap-3">
          <div className="feature-icon flex-shrink-0" style={{ background: "#f3e5f5", color: "#7b1fa2" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 22h-4a7 7 0 0 1-6.73-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
              <circle cx="9.5" cy="15.5" r="1" fill="currentColor" /><circle cx="14.5" cy="15.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--drk)" }}>
              KI-Agentenfunktion
            </h3>
            <p className="text-sm mb-2" style={{ color: "var(--text-light)" }}>
              Diese App bietet eine REST-API für KI-Assistenten (z.B. ChatGPT, Claude).
              KI-Assistenten können die Selbstauskunft im Gespräch ausfüllen —
              Sie beantworten die Fragen, der Agent generiert den Report.
            </p>
            <Link
              href="https://github.com/AFielen/auskunft/blob/main/API-INTEGRATION.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--drk)" }}
            >
              API-Dokumentation ansehen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div style={card} className="p-6 fade-up">
        <h3 className="text-base font-bold mb-1" style={{ color: "var(--drk)" }}>
          Feedback & Support
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-light)" }}>
          Bug gefunden, Verbesserungsidee oder eine Frage? Schreiben Sie uns!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector — pill buttons like role selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Art des Feedbacks</label>
            <div className="flex flex-wrap gap-2">
              {feedbackTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFeedbackType(t.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: feedbackType === t.value ? "var(--drk)" : "var(--bg)",
                    color: feedbackType === t.value ? "var(--white)" : "var(--text)",
                    border: `1px solid ${feedbackType === t.value ? "var(--drk)" : "var(--border)"}`,
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="feedback-message">
              Ihre Nachricht
            </label>
            <textarea
              id="feedback-message"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={4}
              placeholder="Beschreiben Sie Ihr Anliegen..."
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: "1px solid var(--border)", resize: "vertical" }}
              required
            />
          </div>

          {/* Status */}
          {submitStatus && (
            <div
              className="p-3 rounded-[10px] text-sm"
              style={{
                background: submitStatus.type === "success" ? "#e8f5e9" : "#fce4ec",
                color: submitStatus.type === "success" ? "var(--success)" : "var(--danger)",
                border: `1px solid ${submitStatus.type === "success" ? "var(--success)" : "var(--danger)"}`,
              }}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !feedbackMessage.trim()}
            className="w-full py-3 rounded-[10px] text-white font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--drk)" }}
          >
            {isSubmitting ? "Wird gesendet..." : "Feedback senden"}
          </button>
        </form>

        <p className="text-xs mt-4" style={{ color: "var(--text-light)" }}>
          <strong>Instanz-ID:</strong>{" "}
          <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "var(--bg)" }}>
            {instanceId || "Lädt..."}
          </code>
          <br />
          <span className="mt-1 inline-block">
            Dient nur zur Zuordnung — enthält keine personenbezogenen Daten.
          </span>
        </p>
      </div>

      {/* Links */}
      <div style={card} className="p-6 fade-up">
        <h3 className="text-base font-bold mb-3" style={{ color: "var(--drk)" }}>
          Weitere Informationen
        </h3>
        <div className="space-y-2">
          {[
            { href: "https://github.com/AFielen/auskunft", label: "GitHub Repository", desc: "Quellcode, Issues & Mitwirken", external: true },
            { href: "/impressum", label: "Impressum", desc: "Angaben nach § 5 TMG", external: false },
            { href: "/datenschutz", label: "Datenschutz", desc: "Datenschutzerklärung", external: false },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-colors"
              style={{ border: "1px solid var(--border)", textDecoration: "none", color: "inherit" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{link.label}</p>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>{link.desc}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-light)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
