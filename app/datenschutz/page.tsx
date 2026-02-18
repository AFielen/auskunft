import Link from "next/link";

export default function Datenschutz() {
  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 mb-4 font-semibold text-sm" style={{ color: "var(--drk)" }}>
        ← Zurück
      </Link>
      <div className="rounded-[10px] p-6" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
        <h2 className="text-xl font-bold mb-4 pb-2" style={{ color: "var(--drk)", borderBottom: "2px solid var(--drk)" }}>
          Datenschutzerklärung
        </h2>

        <div className="space-y-5 text-sm" style={{ color: "var(--text)" }}>
          <div>
            <h3 className="font-bold mb-1">1. Verantwortlicher</h3>
            <p>DRK-Kreisverband StädteRegion Aachen e.V.</p>
            <p>Henry-Dunant-Platz 1, 52146 Würselen</p>
            <p>E-Mail: <a href="mailto:Info@DRK-Aachen.de" style={{ color: "var(--drk)" }}>Info@DRK-Aachen.de</a></p>
            <p>Telefon: 02405 6039-100</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">2. Grundsatz: Keine Erhebung personenbezogener Daten</h3>
            <p>Diese Anwendung wurde bewusst so konzipiert, dass <strong>keine personenbezogenen Daten</strong> erhoben, gespeichert oder an Dritte übermittelt werden. Es gibt:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Keine Registrierung oder Anmeldung</li>
              <li>Keine Cookies</li>
              <li>Keine Analyse- oder Tracking-Dienste (kein Google Analytics, kein Matomo o.Ä.)</li>
              <li>Keine Datenbank</li>
              <li>Keine serverseitige Speicherung von Formulardaten</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-1">3. Verarbeitung im Browser</h3>
            <p>Alle Angaben, die Sie in das Formular eingeben, werden <strong>ausschließlich lokal in Ihrem Browser</strong> verarbeitet. Die Daten verlassen Ihr Gerät nur, wenn Sie die Selbstauskunft aktiv als PDF exportieren oder ausdrucken.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">4. Keine persistente Datenspeicherung</h3>
            <p>Nach dem Schließen des Browser-Fensters oder -Tabs sind alle eingegebenen Daten <strong>unwiderruflich gelöscht</strong>. Es gibt keine Möglichkeit, vergangene Eingaben nachträglich einzusehen — weder durch den Betreiber noch durch Dritte.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">5. Hosting</h3>
            <p>Die Anwendung wird auf einem Server des DRK-Kreisverbandes Städteregion Aachen e.V. betrieben. Der Webserver erhebt dabei ggf. technische Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene Seite) in Server-Logfiles. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nach 7 Tagen automatisch gelöscht.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">6. Keine externen Dienste</h3>
            <p>Die Anwendung lädt <strong>keine externen Ressourcen</strong> (Schriftarten, Analyse-Tools, CDNs). Alle benötigten Dateien werden direkt mit der Anwendung ausgeliefert.</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">7. Ihre Rechte</h3>
            <p>Da keine personenbezogenen Daten erhoben oder gespeichert werden, entfallen die üblichen Betroffenenrechte (Auskunft, Löschung, Berichtigung etc.) im Kontext dieser Anwendung. Sollten Sie dennoch Fragen zum Datenschutz haben, können Sie sich jederzeit an uns wenden:</p>
            <p className="mt-1">E-Mail: <a href="mailto:Info@DRK-Aachen.de" style={{ color: "var(--drk)" }}>Info@DRK-Aachen.de</a></p>
          </div>

          <div>
            <h3 className="font-bold mb-1">8. Änderungen</h3>
            <p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, insbesondere bei technischen Änderungen an der Anwendung. Die jeweils aktuelle Fassung ist über den Link in der Anwendung abrufbar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
