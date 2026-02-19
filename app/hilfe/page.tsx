'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrCreateInstanceId } from '@/lib/instance';

export default function HilfePage() {
  const [instanceId, setInstanceId] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'question' | 'other'>('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setInstanceId(getOrCreateInstanceId());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setSubmitStatus({ type: 'success', message: data.message });
        setFeedbackMessage('');
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Fehler beim Senden' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Netzwerkfehler beim Senden' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prose prose-sm max-w-none">
      <h1>📘 Hilfe &amp; Support</h1>

      {/* Was ist die Selbstauskunft? */}
      <section>
        <h2>Was ist die DRK Selbstauskunft?</h2>
        <p>
          Die jährliche Selbstauskunft ist ein <strong>Compliance-Instrument</strong> für Führungskräfte in
          DRK-Gliederungen. Sie wurde im April 2025 auf der Landesversammlung des DRK Landesverbandes
          Nordrhein e.V. vorgestellt und unterstützt Aufsichtsorgane bei ihrer Arbeit.
        </p>
        <p>
          Sie dient ehrenamtlichen Kreisvorständen und Präsidien als Hilfsmittel bei der Wahrnehmung der
          <strong> Arbeitgeberfunktion</strong> gegenüber hauptamtlichen Geschäftsführungen.
        </p>

        <h3>🛡️ Internes Kontrollsystem (IKS)</h3>
        <p>Die Selbstauskunft ist Teil des IKS und sorgt dafür, dass:</p>
        <ul>
          <li>Risiken früh erkannt werden</li>
          <li>Verlässliche Abläufe geschaffen werden</li>
          <li>Transparenz entsteht</li>
          <li>Die Zusammenarbeit gestärkt wird</li>
        </ul>

        <h3>🎯 Zielgruppe</h3>
        <p>
          <strong>Vorstände, Geschäftsführer und Prokuristen</strong> in DRK-Kreisverbänden,
          Landesverbänden und Beteiligungsgesellschaften.
        </p>
      </section>

      {/* Wie funktioniert diese App? */}
      <section>
        <h2>Wie funktioniert diese App?</h2>
        <p>
          Diese Web-App digitalisiert die Selbstauskunft — <strong>Schritt für Schritt, direkt auf dem
          Handy oder am Computer</strong>.
        </p>

        <h3>✨ Features</h3>
        <ul>
          <li>
            <strong>Geführter Wizard</strong> — 6 Abschnitte mit 36 Fragen (Ja/Nein/Teilweise)
          </li>
          <li>
            <strong>Rollenauswahl</strong> — Geschäftsführer, Vorstand, Prokurist oder eigene Funktion
          </li>
          <li>
            <strong>Abweichungen dokumentieren</strong> — Bei „Nein" oder „Teilweise" wird automatisch eine
            Begründung verlangt
          </li>
          <li>
            <strong>PDF-Report</strong> — Vollständiger Bericht mit DRK-Branding, Unterschriftszeile und
            Zusammenfassung
          </li>
          <li>
            <strong>QR-Code im Report</strong> — Scannen füllt die Selbstauskunft für das nächste Jahr
            automatisch vor
          </li>
          <li>
            <strong>Zwischenspeichern</strong> — Fortschritt wird im Browser gespeichert (localStorage)
          </li>
          <li>
            <strong>Mobile-optimiert</strong> — Responsive Design mit Bottom-Sheet-Hilfe auf dem Handy
          </li>
        </ul>

        <h3>📋 Abschnitte</h3>
        <ol>
          <li>Geschäftsführung &amp; Interessenkonflikte (6 Fragen)</li>
          <li>Sitzungen &amp; Beschlussfassungen (3 Fragen)</li>
          <li>Zustimmungspflichtige Rechtsgeschäfte (5 Fragen)</li>
          <li>Arbeitgeberstellung (11 Fragen)</li>
          <li>Finanzwesen (8 Fragen)</li>
          <li>Revision &amp; Compliance (3 Fragen)</li>
        </ol>
      </section>

      {/* Agentenfunktion */}
      <section>
        <h2>🤖 Die Agentenfunktion</h2>
        <p>
          Diese App bietet eine <strong>REST-API für KI-Assistenten</strong> (z. B. ChatGPT, Claude,
          Custom AI-Agents).
        </p>
        <p>
          KI-Assistenten können die Selbstauskunft <strong>im Gespräch ausfüllen</strong> — Sie
          beantworten die Fragen, der Agent generiert den Report.
        </p>
        <p>
          <Link href="https://github.com/AFielen/auskunft/blob/main/AGENT.md" className="underline">
            → API-Dokumentation (AGENT.md)
          </Link>
        </p>
      </section>

      {/* Datenschutz */}
      <section>
        <h2>🔒 Datenschutz &amp; Sicherheit</h2>
        <ul>
          <li>
            <strong>Keine Datenbank</strong> — Alle Angaben existieren nur im Browser
          </li>
          <li>
            <strong>Keine Cookies</strong> — Kein Tracking, keine Analytics
          </li>
          <li>
            <strong>Keine externen Dienste</strong> — Keine Google Fonts, kein CDN
          </li>
          <li>
            <strong>localStorage nur lokal</strong> — Wird bei Abgabe automatisch gelöscht
          </li>
          <li>
            <strong>QR-Code = komprimierte Daten</strong> — Keine Datenbank, keine Tokens
          </li>
          <li>
            <strong>DSGVO-konform</strong> — Keine serverseitige Verarbeitung personenbezogener Daten
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2>❓ Häufige Fragen (FAQ)</h2>

        <h3>Wo werden meine Daten gespeichert?</h3>
        <p>
          <strong>Nirgends.</strong> Die App speichert keine Daten auf einem Server. Alle Angaben bleiben
          auf Ihrem Gerät (localStorage im Browser). Wenn Sie den PDF-Report herunterladen, ist die App
          „vergessen", was Sie eingegeben haben.
        </p>

        <h3>Kann ich den Fortschritt speichern?</h3>
        <p>
          Ja! Die App speichert Ihren Fortschritt automatisch im Browser (localStorage). Sie können jederzeit
          pausieren und später weitermachen — solange Sie denselben Browser auf demselben Gerät verwenden.
        </p>

        <h3>Was passiert, wenn ich „Teilweise" anklicke?</h3>
        <p>
          Sie werden aufgefordert, eine <strong>Begründung</strong> einzugeben. Diese erscheint im
          PDF-Report in der Zusammenfassung und hilft dem Aufsichtsorgan, die Situation zu verstehen.
        </p>

        <h3>Was ist der QR-Code im Report?</h3>
        <p>
          Der QR-Code enthält Ihre Antworten als komprimierten String. Beim nächsten Mal können Sie den Code
          scannen — die App füllt dann alle Felder automatisch vor. So sparen Sie Zeit beim jährlichen
          Ausfüllen.
        </p>

        <h3>Kann ich die App auf meinem Server hosten?</h3>
        <p>
          Ja! Die App ist <strong>Open Source (MIT-Lizenz)</strong>. Sie können sie auf Ihrem eigenen Server
          oder via Docker betreiben. Anleitung:{' '}
          <Link href="https://github.com/AFielen/auskunft#-installation" className="underline">
            GitHub README
          </Link>
        </p>
      </section>

      {/* Feedback */}
      <section>
        <h2>💬 Feedback &amp; Support</h2>
        <p>
          Haben Sie einen Bug gefunden, eine Verbesserungsidee oder eine Frage? Schreiben Sie uns!
        </p>

        <form onSubmit={handleSubmit} className="not-prose bg-gray-50 p-4 rounded-lg space-y-4 my-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="feedback-type">
              Art des Feedbacks
            </label>
            <select
              id="feedback-type"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="bug">🐛 Bug melden</option>
              <option value="feature">💡 Verbesserungsvorschlag</option>
              <option value="question">❓ Frage</option>
              <option value="other">💬 Sonstiges</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="feedback-message">
              Ihre Nachricht
            </label>
            <textarea
              id="feedback-message"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={5}
              placeholder="Beschreiben Sie Ihr Anliegen..."
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {submitStatus && (
            <div
              className={`p-3 rounded-md text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !feedbackMessage.trim()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Wird gesendet...' : 'Feedback senden'}
          </button>
        </form>

        <p className="text-xs" style={{ color: 'var(--text-light)' }}>
          <strong>Instanz-ID:</strong> <code>{instanceId || 'Lädt...'}</code>
          <br />
          Diese ID dient nur zur Zuordnung Ihres Feedbacks. Sie enthält keine personenbezogenen Daten.
        </p>
      </section>

      {/* Footer-Links */}
      <section>
        <h2>🔗 Weitere Informationen</h2>
        <ul>
          <li>
            <Link href="https://github.com/AFielen/auskunft" className="underline">
              GitHub Repository
            </Link>
          </li>
          <li>
            <Link href="/impressum" className="underline">
              Impressum
            </Link>
          </li>
          <li>
            <Link href="/datenschutz" className="underline">
              Datenschutz
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
