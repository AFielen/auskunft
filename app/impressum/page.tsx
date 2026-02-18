import Link from "next/link";

export default function Impressum() {
  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 mb-4 font-semibold text-sm" style={{ color: "var(--drk)" }}>
        ← Zurück
      </Link>
      <div className="rounded-[10px] p-6" style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
        <h2 className="text-xl font-bold mb-4 pb-2" style={{ color: "var(--drk)", borderBottom: "2px solid var(--drk)" }}>
          Impressum
        </h2>

        <div className="space-y-5 text-sm" style={{ color: "var(--text)" }}>
          <div>
            <h3 className="font-bold mb-1">Ansprechpartner</h3>
            <p>Herr Axel Fielen</p>
            <p>Vorsitzender des Vorstandes</p>
            <p>Tel: 02405 6039100</p>
            <p>Henry-Dunant-Platz 1</p>
            <p>52146 Würselen</p>
            <p><a href="mailto:Info@DRK-Aachen.de" style={{ color: "var(--drk)" }}>E-Mail schreiben</a></p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Anbieterkennung nach § 5 TMG</h3>
            <p>DRK-Kreisverband Städteregion Aachen e.V.</p>
            <p>Henry-Dunant-Platz 1</p>
            <p>52146 Würselen</p>
            <p>Telefon: 02405 6039-100</p>
            <p>Telefax: 02405 6039-200</p>
            <p>E-Mail: <a href="mailto:Info@DRK-Aachen.de" style={{ color: "var(--drk)" }}>Info@DRK-Aachen.de</a></p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Vereinsregister</h3>
            <p>Registergericht: Amtsgericht Aachen</p>
            <p>Registernummer: VR 4535</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Vertretungsberechtigte</h3>
            <p>Axel Fielen (Vorsitzender des Vorstandes)</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Umsatzsteuer-Identifikationsnummer</h3>
            <p>gemäß § 27 a Umsatzsteuergesetz: DE121729631</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Inhaltlich Verantwortlicher</h3>
            <p>gemäß § 55 Abs. 2 RStV:</p>
            <p>Axel Fielen (Anschrift wie oben)</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Streitbeilegungsverfahren</h3>
            <p>Der DRK Kreisverband Städteregion Aachen e.V. wie auch die Tochter- und Enkelgesellschaften nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
