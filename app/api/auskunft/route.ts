import { NextRequest, NextResponse } from "next/server";
import { sections } from "@/lib/questions";

interface AuskunftRequest {
  // Person
  name: string;
  role: string;
  gliederung: string;
  reportTo: string;
  aufsichtName: string;
  geschaeftsjahr: string;
  ort: string;

  // Answers: question id → "ja" | "nein" | "teilweise" | number | string
  answers: Record<string, string | number>;

  // Deviations: question id → explanation string
  deviations?: Record<string, string>;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateReportHtml(data: AuskunftRequest): string {
  const date = new Date().toLocaleDateString("de-DE");
  const answers = data.answers || {};
  const deviations = data.deviations || {};

  const getLabel = (val: string | undefined) => {
    if (val === "ja") return "✓ Ja";
    if (val === "nein") return "✗ Nein";
    if (val === "teilweise") return "~ Teilweise";
    return "— Nicht beantwortet";
  };

  let html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<title>Selbstauskunft ${escapeHtml(data.name)} — ${escapeHtml(data.geschaeftsjahr)}</title>
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
.danke { margin-top: 40px; text-align: center; padding: 20px; background: #f4f4f4; border-radius: 8px; }
.danke h2 { color: #e30613; font-size: 14pt; margin-bottom: 8px; }
.danke p { font-size: 10pt; color: #777; }
.footer { margin-top: 20px; text-align: center; font-size: 8pt; color: #999; }
</style></head><body>`;

  html += `<div class="header">
    <div><h1>DRK Selbstauskunft</h1><div class="sub">Digitale Compliance-Erklärung</div></div>
  </div>`;

  html += `<div class="meta"><table>
    <tr><td>Name:</td><td>${escapeHtml(data.name)}</td></tr>
    <tr><td>Funktion:</td><td>${escapeHtml(data.role)}</td></tr>
    <tr><td>DRK-Gliederung:</td><td>${escapeHtml(data.gliederung)}</td></tr>
    <tr><td>Berichtet an:</td><td>${escapeHtml(data.reportTo)} (${escapeHtml(data.aufsichtName)})</td></tr>
    <tr><td>Geschäftsjahr:</td><td>${escapeHtml(data.geschaeftsjahr)}</td></tr>
    <tr><td>Datum:</td><td>${date}</td></tr>
    <tr><td>Ort:</td><td>${escapeHtml(data.ort)}</td></tr>
  </table></div>`;

  for (const section of sections) {
    html += `<div class="section"><h2>${escapeHtml(section.title)}</h2>`;
    for (const q of section.questions) {
      if (q.conditionalOn) {
        const condVal = answers[q.conditionalOn.id];
        if (String(condVal) !== q.conditionalOn.value) continue;
      }

      html += `<div class="question"><div class="q-text">${escapeHtml(q.text)}</div>`;

      if (q.type === "confirmation") {
        const val = String(answers[q.id] || "");
        const cls = val || "none";
        html += `<div class="q-answer ${cls}">${getLabel(val)}</div>`;
        if ((val === "nein" || val === "teilweise") && deviations[q.id]) {
          html += `<div class="deviation"><strong>Begründung:</strong> ${escapeHtml(deviations[q.id])}</div>`;
        }
      } else if (q.type === "number") {
        html += `<div class="number-answer">${escapeHtml(String(answers[q.id] ?? "—"))}</div>`;
      } else if (q.type === "text") {
        const val = String(answers[q.id] || "");
        if (val) html += `<div class="text-answer">${escapeHtml(val)}</div>`;
      }

      html += `</div>`;
    }
    html += `</div>`;
  }

  html += `<div class="signature">
    <p><strong>Ich bestätige die Richtigkeit und Vollständigkeit meiner Angaben einschließlich etwaiger Anlagen.</strong></p>
    <div style="display:flex; gap:40px; margin-top:16px;">
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(data.ort)}, ${date}</div></div>
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(data.name)}</div></div>
    </div>
  </div>`;

  html += `<div class="danke">
    <h2>Vielen Dank!</h2>
    <p>Ihre Selbstauskunft für das Geschäftsjahr ${escapeHtml(data.geschaeftsjahr)} wurde vollständig ausgefüllt.</p>
  </div>`;

  html += `<div class="footer">DRK Selbstauskunft — Deutsches Rotes Kreuz · ${escapeHtml(data.gliederung)}</div>`;
  html += `</body></html>`;

  return html;
}

// GET: Return schema (for agents to know what to send)
export async function GET() {
  const questionSchema = sections.map((s) => ({
    section: s.id,
    title: s.title,
    questions: s.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      required: q.type === "confirmation" || q.required,
      conditionalOn: q.conditionalOn || undefined,
      allowedValues: q.type === "confirmation" ? ["ja", "nein", "teilweise"] : undefined,
    })),
  }));

  return NextResponse.json({
    name: "DRK Selbstauskunft API",
    version: "1.0",
    description: "API zum maschinellen Ausfüllen der DRK Selbstauskunft. POST mit JSON-Body, GET für Schema.",
    endpoints: {
      "GET /api/auskunft": "Dieses Schema",
      "POST /api/auskunft": "Selbstauskunft einreichen → HTML-Report zurück",
    },
    requiredFields: {
      name: "string — Vor- und Nachname",
      role: "string — Funktion (z.B. Kreisgeschäftsführer)",
      gliederung: "string — DRK-Gliederung (z.B. Kreisverband Städteregion Aachen e.V.)",
      reportTo: "string — Funktion Aufsichtsorgan (z.B. Präsident)",
      aufsichtName: "string — Name des Aufsichtsorganvertreters",
      geschaeftsjahr: "string — z.B. 2025",
      ort: "string — Ort der Erklärung",
      answers: "Record<questionId, 'ja'|'nein'|'teilweise'|number|string>",
      deviations: "Record<questionId, string> — Begründungen bei Abweichungen (optional)",
    },
    sections: questionSchema,
  });
}

// POST: Generate report
export async function POST(request: NextRequest) {
  try {
    const data: AuskunftRequest = await request.json();

    // Validate required fields
    const required = ["name", "role", "gliederung", "reportTo", "aufsichtName", "geschaeftsjahr", "ort"];
    const missing = required.filter((f) => !data[f as keyof AuskunftRequest]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Fehlende Pflichtfelder: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    if (!data.answers || typeof data.answers !== "object") {
      return NextResponse.json(
        { error: "Feld 'answers' fehlt oder ist kein Objekt" },
        { status: 400 }
      );
    }

    const html = generateReportHtml(data);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Ungültiger JSON-Body" },
      { status: 400 }
    );
  }
}
