"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { sections } from "@/lib/questions";
import { card } from "@/lib/styles";

type ConfirmValue = "ja" | "nein" | "teilweise" | undefined;
type Answers = Record<string, ConfirmValue | string | number>;
type Deviations = Record<string, string>;

const STORAGE_KEY = "drk-selbstauskunft-draft";

// ── Exit Guard ──
function useExitGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}

// ── Help Icon ──
function HelpIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0"
        style={{ background: "var(--border)", color: "var(--text-light)" }}
        aria-label="Hilfe"
      >
        ?
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute z-20 left-0 top-7 w-72 p-3 rounded-[10px] text-xs leading-relaxed shadow-lg"
            style={{ background: "var(--white)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {text}
            <button
              onClick={() => setOpen(false)}
              className="block mt-2 text-xs font-semibold"
              style={{ color: "var(--drk)" }}
            >
              Schließen
            </button>
          </div>
        </>
      )}
    </span>
  );
}

// ── Confirm Buttons ──
function ConfirmButtons({
  value,
  onChange,
}: {
  value: ConfirmValue;
  onChange: (v: ConfirmValue) => void;
}) {
  const options: { label: string; val: ConfirmValue; color: string }[] = [
    { label: "✓ Ja", val: "ja", color: "var(--success)" },
    { label: "✗ Nein", val: "nein", color: "var(--danger)" },
    { label: "~ Teilweise", val: "teilweise", color: "var(--warning)" },
  ];
  return (
    <div className="flex gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(value === opt.val ? undefined : opt.val)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: value === opt.val ? opt.color : "var(--bg)",
            color: value === opt.val ? "var(--white)" : opt.color,
            border: `2px solid ${value === opt.val ? opt.color : opt.color}`,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── HTML Escaping (XSS prevention) ──
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── PDF Report Generation ──
function generateReport(
  params: {
    name: string;
    role: string;
    gliederung: string;
    reportTo: string;
    aufsichtName: string;
    geschaeftsjahr: string;
    ort: string;
  },
  answers: Answers,
  deviations: Deviations
) {
  const date = new Date().toLocaleDateString("de-DE");

  const getLabel = (val: ConfirmValue) => {
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
    html += `<div class="section"><h2>${section.title}</h2>`;
    for (const q of section.questions) {
      if (q.conditionalOn && answers[q.conditionalOn.id] !== q.conditionalOn.value) continue;

      html += `<div class="question"><div class="q-text">${q.text}</div>`;

      if (q.type === "confirmation") {
        const val = answers[q.id] as ConfirmValue;
        const cls = val || "none";
        html += `<div class="q-answer ${cls}">${getLabel(val)}</div>`;
        if ((val === "nein" || val === "teilweise") && deviations[q.id]) {
          html += `<div class="deviation"><strong>Begründung:</strong> ${escapeHtml(deviations[q.id])}</div>`;
        }
      } else if (q.type === "number") {
        const val = answers[q.id] ?? "—";
        html += `<div class="number-answer">${val}</div>`;
      } else if (q.type === "text") {
        const val = answers[q.id] as string;
        if (val) html += `<div class="text-answer">${escapeHtml(val)}</div>`;
      }

      html += `</div>`;
    }
    html += `</div>`;
  }

  // Signature
  html += `<div class="signature">
    <p><strong>Ich bestätige die Richtigkeit und Vollständigkeit meiner Angaben einschließlich etwaiger Anlagen.</strong></p>
    <div style="display:flex; gap:40px; margin-top:16px;">
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(params.ort)}, ${date}</div></div>
      <div><div class="sig-line"></div><div class="sig-label">${escapeHtml(params.name)}</div></div>
    </div>
  </div>`;

  // Danke
  html += `<div class="danke">
    <h2>Vielen Dank!</h2>
    <p>Ihre Selbstauskunft für das Geschäftsjahr ${escapeHtml(params.geschaeftsjahr)} wurde vollständig ausgefüllt.</p>
    <p style="margin-top:8px">Bitte leiten Sie dieses Dokument an Ihr Aufsichtsorgan weiter.</p>
  </div>`;

  html += `<div class="footer">DRK Selbstauskunft — Deutsches Rotes Kreuz · ${escapeHtml(params.gliederung)}</div>`;
  html += `</body></html>`;

  return html;
}

// ── Wizard Content ──
function WizardContent() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "";
  const userRole = searchParams.get("role") || "";
  const gliederung = searchParams.get("gliederung") || "";
  const reportTo = searchParams.get("reportTo") || "";
  const aufsichtName = searchParams.get("aufsichtName") || "";
  const geschaeftsjahr = searchParams.get("geschaeftsjahr") || "";

  // Restore from localStorage
  const [step, setStep] = useState(() => {
    if (typeof window === "undefined") return 0;
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return d.step ?? 0; } catch { return 0; }
  });
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window === "undefined") return {};
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return d.answers ?? {}; } catch { return {}; }
  });
  const [deviations, setDeviations] = useState<Deviations>(() => {
    if (typeof window === "undefined") return {};
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return d.deviations ?? {}; } catch { return {}; }
  });
  const [signOrt, setSignOrt] = useState(() => {
    if (typeof window === "undefined") return "";
    try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return d.signOrt ?? ""; } catch { return ""; }
  });
  const [submitted, setSubmitted] = useState(false);

  // Save to localStorage on every change
  useEffect(() => {
    if (submitted) { localStorage.removeItem(STORAGE_KEY); return; }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers, deviations, signOrt }));
  }, [step, answers, deviations, signOrt, submitted]);

  // Activate exit guard whenever there are answers
  const hasAnswers = Object.keys(answers).length > 0;
  useExitGuard(hasAnswers && !submitted);

  const totalSteps = sections.length + 1;
  const section = sections[step];
  const isLastSection = step === sections.length;

  const setAnswer = (id: string, value: ConfirmValue | string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const setDeviation = (id: string, value: string) => {
    setDeviations((prev) => ({ ...prev, [id]: value }));
  };

  // Check if current section has unanswered confirmation questions
  const currentSectionComplete = !section || section.questions.every((q) => {
    if (q.conditionalOn && answers[q.conditionalOn.id] !== q.conditionalOn.value) return true;
    if (q.type === "confirmation") return answers[q.id] !== undefined;
    if (q.type === "number" && q.required) return answers[q.id] !== undefined;
    return true;
  });

  const deviationCount = sections.reduce((count, sec) => {
    return count + sec.questions.filter(
      (q) => q.type === "confirmation" && (answers[q.id] === "nein" || answers[q.id] === "teilweise")
    ).length;
  }, 0);

  const handlePrint = useCallback(() => {
    const html = generateReport(
      { name: userName, role: userRole, gliederung, reportTo, aufsichtName, geschaeftsjahr, ort: signOrt },
      answers,
      deviations
    );
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 300);
    }
  }, [userName, userRole, gliederung, reportTo, aufsichtName, geschaeftsjahr, signOrt, answers, deviations]);

  if (submitted) {
    return (
      <div className="space-y-4">
        <div style={card} className="p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--drk)" }}>
            Vielen Dank!
          </h2>
          <p style={{ color: "var(--text)" }} className="mb-2">
            Ihre Selbstauskunft für das Geschäftsjahr {geschaeftsjahr} wurde vollständig ausgefüllt.
          </p>
          <p className="text-sm mb-2" style={{ color: "var(--text-light)" }}>
            {userName} · {userRole} · {gliederung}
          </p>
          {deviationCount > 0 && (
            <p className="text-sm mb-4" style={{ color: "var(--warning)" }}>
              {deviationCount} Abweichung(en) wurden dokumentiert.
            </p>
          )}
          <div className="mt-6 space-y-3">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-8 py-3 rounded-[10px] text-white font-semibold"
              style={{ background: "var(--drk)" }}
            >
              📄 Bericht als PDF drucken
            </button>
            <p className="text-xs" style={{ color: "var(--text-light)" }}>
              Tipp: Im Druckdialog können Sie „Als PDF speichern" wählen.
            </p>
          </div>
        </div>

        <div style={card} className="p-6">
          <h3 className="font-bold mb-2" style={{ color: "var(--text)" }}>So geht&apos;s weiter:</h3>
          <ol className="text-sm space-y-2 list-decimal ml-5" style={{ color: "var(--text-light)" }}>
            <li>Drucken Sie den Bericht als PDF oder auf Papier</li>
            <li>Leiten Sie das Dokument an Ihr Aufsichtsorgan weiter ({reportTo}: {aufsichtName})</li>
            <li>Bewahren Sie eine Kopie für Ihre Unterlagen auf</li>
          </ol>
        </div>

        <div
          className="rounded-[10px] p-4 text-center"
          style={{ background: "#f0f7ff", border: "1px solid #c5ddf5" }}
        >
          <p className="text-xs" style={{ color: "var(--text-light)" }}>
            🔒 Ihre Daten wurden nicht gespeichert. Sobald Sie dieses Fenster schließen, sind alle Eingaben unwiderruflich gelöscht.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Context Bar */}
      <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--text-light)" }}>
        <span className="px-2 py-1 rounded-full" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          {userName} — {userRole}
        </span>
        <span className="px-2 py-1 rounded-full" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          {gliederung}
        </span>
        <span className="px-2 py-1 rounded-full" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          GJ {geschaeftsjahr}
        </span>
      </div>

      {/* Progress */}
      <div style={card} className="p-4">
        <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-light)" }}>
          <span>Schritt {step + 1} von {totalSteps}</span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-[10px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%`, background: "var(--drk)" }}
          />
        </div>
      </div>

      {/* Section */}
      <div style={card} className="p-5 md:p-6">
        {!isLastSection && section ? (
          <>
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--drk)" }}>{section.title}</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-light)" }}>{section.description}</p>

            <div className="space-y-3">
              {section.questions.map((q) => {
                if (q.conditionalOn && answers[q.conditionalOn.id] !== q.conditionalOn.value) return null;

                const answer = answers[q.id] as ConfirmValue;
                const needsDeviation = q.type === "confirmation" && (answer === "nein" || answer === "teilweise");

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-[10px]"
                    style={{
                      background: needsDeviation ? "#fef3e0" : "var(--bg)",
                      border: needsDeviation ? "1px solid var(--warning)" : "1px solid var(--border)",
                    }}
                  >
                    {q.type === "confirmation" && (
                      <div>
                        <div className="flex items-start gap-1">
                          <span className="text-sm" style={{ color: "var(--text)" }}>{q.text}</span>
                          {q.help && <HelpIcon text={q.help} />}
                        </div>
                        <ConfirmButtons
                          value={answer}
                          onChange={(v) => setAnswer(q.id, v as ConfirmValue)}
                        />
                      </div>
                    )}

                    {q.type === "number" && (
                      <div>
                        <div className="flex items-start gap-1 mb-2">
                          <label className="text-sm" style={{ color: "var(--text)" }}>{q.text}</label>
                          {q.help && <HelpIcon text={q.help} />}
                        </div>
                        <input
                          type="number"
                          min="0"
                          inputMode="numeric"
                          value={(answers[q.id] as number) ?? ""}
                          onChange={(e) => setAnswer(q.id, Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-28 px-3 py-2 rounded-[10px] text-sm"
                          style={{ border: "1px solid var(--border)" }}
                        />
                      </div>
                    )}

                    {q.type === "text" && (
                      <div>
                        <div className="flex items-start gap-1 mb-2">
                          <label className="text-sm" style={{ color: "var(--text)" }}>{q.text}</label>
                          {q.help && <HelpIcon text={q.help} />}
                        </div>
                        <textarea
                          value={(answers[q.id] as string) ?? ""}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-[10px] text-sm"
                          style={{ border: "1px solid var(--border)" }}
                        />
                      </div>
                    )}

                    {needsDeviation && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold mb-1" style={{ color: "var(--danger)" }}>
                          ⚠️ Bitte begründen Sie die Abweichung:
                        </p>
                        <textarea
                          value={deviations[q.id] ?? ""}
                          onChange={(e) => setDeviation(q.id, e.target.value)}
                          rows={2}
                          placeholder="Begründung..."
                          className="w-full px-3 py-2 rounded-[10px] text-sm"
                          style={{ border: "1px solid var(--warning)", background: "var(--white)" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--drk)" }}>
              Abschließende Erklärung
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-light)" }}>
              Bitte bestätigen Sie die Richtigkeit Ihrer Angaben.
            </p>

            {deviationCount > 0 && (
              <div className="rounded-[10px] p-4 mb-5" style={{ background: "#fef3e0", border: "1px solid var(--warning)" }}>
                <p className="font-semibold text-sm" style={{ color: "var(--danger)" }}>
                  ⚠️ {deviationCount} Abweichung(en)
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
                  Stellen Sie sicher, dass alle Abweichungen begründet wurden.
                </p>
              </div>
            )}

            <div className="rounded-[10px] p-4 mb-5" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="text-sm space-y-1" style={{ color: "var(--text)" }}>
                <p><strong>Name:</strong> {userName}</p>
                <p><strong>Funktion:</strong> {userRole}</p>
                <p><strong>Gliederung:</strong> {gliederung}</p>
                <p><strong>Berichtet an:</strong> {reportTo} ({aufsichtName})</p>
                <p><strong>Geschäftsjahr:</strong> {geschaeftsjahr}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ort</label>
                <input
                  type="text"
                  value={signOrt}
                  onChange={(e) => setSignOrt(e.target.value)}
                  placeholder="Aachen"
                  className="w-full px-3 py-2 rounded-[10px] text-sm"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div className="text-sm" style={{ color: "var(--text-light)" }}>
                Datum: {new Date().toLocaleDateString("de-DE")}
              </div>

              <label
                className="flex items-start gap-3 cursor-pointer p-4 rounded-[10px]"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <input
                  type="checkbox"
                  checked={answers["final_confirm"] === "ja"}
                  onChange={(e) => setAnswer("final_confirm", e.target.checked ? "ja" : undefined)}
                  className="mt-1 h-5 w-5 rounded accent-[var(--drk)]"
                />
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  Ich bestätige die Richtigkeit und Vollständigkeit meiner Angaben
                  einschließlich etwaiger Anlagen.
                </span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-5 py-2 rounded-[10px] text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "var(--border)", color: "var(--text)" }}
        >
          ← Zurück
        </button>

        {isLastSection ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!signOrt || answers["final_confirm"] !== "ja"}
            className="px-6 py-2 rounded-[10px] text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ background: "var(--drk)" }}
          >
            ✅ Abgeben
          </button>
        ) : (
          <button
            onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
            disabled={!currentSectionComplete}
            className="px-5 py-2 rounded-[10px] text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--drk)" }}
          >
            {currentSectionComplete ? "Weiter →" : "Bitte alle Fragen beantworten"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="text-center py-8" style={{ color: "var(--text-light)" }}>Laden...</div>}>
      <WizardContent />
    </Suspense>
  );
}
