import { sections } from "@/lib/questions";
import { generateQrSvg } from "@/lib/qr-svg";

export interface ReportParams {
  name: string;
  role: string;
  gliederung: string;
  reportTo: string;
  aufsichtName: string;
  geschaeftsjahr: string;
  ort: string;
}

export type ReportAnswers = Record<string, string | number | undefined>;
export type ReportDeviations = Record<string, string>;

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const VALID_CONFIRM = ["ja", "nein", "teilweise"];

/**
 * Validate answers against the question schema.
 * Returns an array of error strings (empty = valid).
 */
export function validateAnswers(answers: ReportAnswers): string[] {
  const errors: string[] = [];

  for (const section of sections) {
    for (const q of section.questions) {
      // Skip conditional questions whose condition isn't met
      if (q.conditionalOn) {
        if (String(answers[q.conditionalOn.id] ?? "") !== q.conditionalOn.value) continue;
      }

      const val = answers[q.id];

      // Check required confirmation questions have valid values
      if (q.type === "confirmation" && val !== undefined) {
        if (!VALID_CONFIRM.includes(String(val))) {
          errors.push(`${q.id}: Ungültiger Wert "${val}" — erlaubt: ja, nein, teilweise`);
        }
      }

      // Check number fields are non-negative integers
      if (q.type === "number" && val !== undefined) {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 0) {
          errors.push(`${q.id}: Ungültiger Wert "${val}" — Ganzzahl ≥ 0 erwartet`);
        }
      }
    }
  }

  return errors;
}

/**
 * Generate the HTML report used for both the browser print view and the API response.
 * If stateUrl is provided, a QR code linking to the pre-filled form is included.
 */
export function generateReportHtml(
  params: ReportParams,
  answers: ReportAnswers,
  deviations: ReportDeviations,
  stateUrl?: string
): string {
  const date = new Date().toLocaleDateString("de-DE");

  const getLabel = (val: string | undefined) => {
    if (val === "ja") return "✓ Ja";
    if (val === "nein") return "✗ Nein";
    if (val === "teilweise") return "~ Teilweise";
    return "— Nicht beantwortet";
  };

  let html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<title>Selbstauskunft ${escapeHtml(params.name)} — ${escapeHtml(params.geschaeftsjahr)}</title>
<style>
@page { margin: 2cm; size: A4; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11pt; color: #2a2a2a; line-height: 1.5; }
.header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 3px solid #e30613; }
.header h1 { font-size: 18pt; color: #e30613; }
.header .sub { font-size: 9pt; color: #777; }
.meta { background: #f4f4f4; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 10pt; }
.meta table { width: 100%; } .meta td { padding: 2px 8px; } .meta td:first-child { font-weight: 700; width: 200px; }
.section { margin-bottom: 18px; page-break-inside: avoid; }
.section h2 { font-size: 13pt; color: #e30613; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #e0e0e0; }
.question { padding: 6px 0; border-bottom: 1px dotted #e0e0e0; }
.question:last-child { border-bottom: none; }
.q-text { font-size: 10pt; }
.q-answer { font-size: 10pt; font-weight: 700; margin-top: 2px; }
.q-answer.ja { color: #2e7d32; }
.q-answer.nein { color: #c62828; }
.q-answer.teilweise { color: #f9a825; }
.q-answer.none { color: #999; }
.deviation { background: #fef3e0; border-left: 3px solid #f9a825; padding: 6px 10px; margin-top: 4px; font-size: 9pt; border-radius: 4px; }
.number-answer { font-size: 10pt; font-weight: 700; }
.text-answer { font-size: 10pt; background: #f4f4f4; padding: 6px 10px; border-radius: 4px; margin-top: 4px; white-space: pre-wrap; }
.signature { margin-top: 30px; padding-top: 16px; border-top: 2px solid #e30613; }
.sig-line { border-bottom: 1px solid #2a2a2a; width: 300px; height: 40px; margin-top: 8px; }
.sig-label { font-size: 9pt; color: #777; margin-top: 4px; }
.danke { margin-top: 40px; text-align: center; padding: 20px; background: #f4f4f4; border-radius: 8px; page-break-inside: avoid; }
.danke h2 { color: #e30613; font-size: 14pt; margin-bottom: 8px; }
.danke p { font-size: 10pt; color: #777; }
.footer { margin-top: 20px; text-align: center; font-size: 8pt; color: #999; }
.qr-section { margin-top: 24px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; display: flex; align-items: center; gap: 16px; page-break-inside: avoid; }
.qr-section svg { flex-shrink: 0; }
.qr-section .qr-text { font-size: 8pt; color: #777; line-height: 1.5; }
.qr-section .qr-text strong { color: #2a2a2a; font-size: 9pt; }
</style></head><body>`;

  html += `<div class="header">
    <div><h1>DRK Selbstauskunft</h1><div class="sub">Digitale Compliance-Erklärung</div></div>
  </div>`;

  html += `<div class="meta"><table>
    <tr><td>Name:</td><td>${escapeHtml(params.name)}</td></tr>
    <tr><td>Funktion:</td><td>${escapeHtml(params.role)}</td></tr>
    <tr><td>DRK-Gliederung:</td><td>${escapeHtml(params.gliederung)}</td></tr>
    <tr><td>Berichtet an:</td><td>${escapeHtml(params.reportTo)} (${escapeHtml(params.aufsichtName)})</td></tr>
    <tr><td>Geschäftsjahr:</td><td>${escapeHtml(params.geschaeftsjahr)}</td></tr>
    <tr><td>Datum:</td><td>${date}</td></tr>
    <tr><td>Ort:</td><td>${escapeHtml(params.ort)}</td></tr>
  </table></div>`;

  for (const section of sections) {
    html += `<div class="section"><h2>${escapeHtml(section.title)}</h2>`;
    for (const q of section.questions) {
      if (q.conditionalOn) {
        if (String(answers[q.conditionalOn.id] ?? "") !== q.conditionalOn.value) continue;
      }

      html += `<div class="question"><div class="q-text">${escapeHtml(q.text)}</div>`;

      if (q.type === "confirmation") {
        const val = String(answers[q.id] ?? "");
        const cls = VALID_CONFIRM.includes(val) ? val : "none";
        html += `<div class="q-answer ${cls}">${getLabel(val || undefined)}</div>`;
        if ((val === "nein" || val === "teilweise") && deviations[q.id]) {
          html += `<div class="deviation"><strong>Begründung:</strong> ${escapeHtml(deviations[q.id])}</div>`;
        }
      } else if (q.type === "number") {
        html += `<div class="number-answer">${escapeHtml(String(answers[q.id] ?? "—"))}</div>`;
      } else if (q.type === "text") {
        const val = String(answers[q.id] ?? "");
        if (val) html += `<div class="text-answer">${escapeHtml(val)}</div>`;
      }

      html += `</div>`;
    }
    html += `</div>`;
  }

  html += `<div class="signature">
    <p><strong>Ich bestätige die Richtigkeit und Vollständigkeit meiner Angaben einschließlich etwaiger Anlagen.</strong></p>
    <div style="display:flex; gap:40px; margin-top:16px;">
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(params.ort)}, ${date}</div></div>
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(params.name)}</div></div>
    </div>
  </div>`;

  html += `<div class="danke">
    <h2>Vielen Dank!</h2>
    <p>Ihre Selbstauskunft für das Geschäftsjahr ${escapeHtml(params.geschaeftsjahr)} wurde vollständig ausgefüllt.</p>
    <p style="margin-top:8px">Bitte leiten Sie dieses Dokument an Ihr Aufsichtsorgan weiter.</p>
  </div>`;

  if (stateUrl) {
    const qrSvg = generateQrSvg(stateUrl, 100);
    html += `<div class="qr-section">
      ${qrSvg}
      <div class="qr-text">
        <strong>QR-Code: Selbstauskunft wiederherstellen</strong><br>
        Scannen Sie diesen Code, um die Selbstauskunft mit den aktuellen Angaben
        vorauszufüllen — z.B. als Vorlage für das nächste Geschäftsjahr.<br>
        Persönliche Daten und Antworten sind komprimiert im Code enthalten.
        Es werden keine Daten auf einem Server gespeichert.
      </div>
    </div>`;
  }

  html += `<div class="footer">DRK Selbstauskunft — Deutsches Rotes Kreuz · ${escapeHtml(params.gliederung)}</div>`;
  html += `</body></html>`;

  return html;
}
