import { NextRequest, NextResponse } from "next/server";
import { sections } from "@/lib/questions";
import { generateReportHtml, validateAnswers } from "@/lib/report";

interface AuskunftRequest {
  name: string;
  role: string;
  gliederung: string;
  reportTo: string;
  aufsichtName: string;
  geschaeftsjahr: string;
  ort: string;
  answers: Record<string, string | number>;
  deviations?: Record<string, string>;
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
    const required = ["name", "role", "gliederung", "reportTo", "aufsichtName", "geschaeftsjahr", "ort"] as const;
    const missing = required.filter((f) => !data[f]);
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

    // Validate answer values against schema
    const validationErrors = validateAnswers(data.answers);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Ungültige Antworten", details: validationErrors },
        { status: 400 }
      );
    }

    const html = generateReportHtml(
      {
        name: data.name,
        role: data.role,
        gliederung: data.gliederung,
        reportTo: data.reportTo,
        aufsichtName: data.aufsichtName,
        geschaeftsjahr: data.geschaeftsjahr,
        ort: data.ort,
      },
      data.answers,
      data.deviations || {}
    );

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
