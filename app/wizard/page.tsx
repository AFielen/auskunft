"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { sections } from "@/lib/questions";
import { card } from "@/lib/styles";
import { generateReportHtml } from "@/lib/report";

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

// ── Help Icon (Bottom-Sheet on mobile) ──
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
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 left-4 right-4 bottom-4 sm:absolute sm:left-auto sm:right-0 sm:bottom-auto sm:top-7 sm:w-72 p-4 sm:p-3 rounded-[14px] sm:rounded-[10px] text-sm sm:text-xs leading-relaxed shadow-xl"
            style={{ background: "var(--white)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {text}
            <button
              onClick={() => setOpen(false)}
              className="block mt-3 sm:mt-2 text-sm sm:text-xs font-semibold"
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
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(value === opt.val ? undefined : opt.val)}
          className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all"
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
    const html = generateReportHtml(
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

  // Count total answered questions
  const totalQuestions = sections.reduce((count, sec) => {
    return count + sec.questions.filter((q) => {
      if (q.conditionalOn && answers[q.conditionalOn.id] !== q.conditionalOn.value) return false;
      return true;
    }).length;
  }, 0);

  const answeredQuestions = sections.reduce((count, sec) => {
    return count + sec.questions.filter((q) => {
      if (q.conditionalOn && answers[q.conditionalOn.id] !== q.conditionalOn.value) return false;
      return answers[q.id] !== undefined;
    }).length;
  }, 0);

  if (submitted) {
    return (
      <div className="space-y-0">
        {/* Hero */}
        <div className="hero" style={{ paddingBottom: "64px" }}>
          <div className="relative z-1 max-w-[640px] mx-auto">
            <div className="hero-icon">
              <span style={{ fontSize: "28px" }}>✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Vielen Dank!</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Ihre Selbstauskunft für das Geschäftsjahr {geschaeftsjahr} wurde vollständig ausgefüllt.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{sections.length}</span>
                <span className="hero-stat-label">Abschnitte</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">{answeredQuestions}/{totalQuestions}</span>
                <span className="hero-stat-label">Fragen beantwortet</span>
              </div>
              {deviationCount > 0 && (
                <div className="hero-stat">
                  <span className="hero-stat-value">{deviationCount}</span>
                  <span className="hero-stat-label">Abweichung(en)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Card (overlaps hero) */}
        <div className="overlap-card fade-up" style={{ margin: "-36px 0 16px" }}>
          <p className="text-sm mb-1 text-center" style={{ color: "var(--text-light)" }}>
            {userName} · {userRole} · {gliederung}
          </p>

          <button
            onClick={handlePrint}
            className="w-full py-3 mt-4 rounded-[10px] text-white font-semibold transition-colors"
            style={{ background: "var(--drk)" }}
          >
            Bericht als PDF drucken
          </button>
          <p className="text-xs text-center mt-2" style={{ color: "var(--text-light)" }}>
            Tipp: Im Druckdialog können Sie &bdquo;Als PDF speichern&ldquo; wählen.
          </p>
        </div>

        {/* So geht's weiter */}
        <div className="fade-up fade-up-delay-2" style={{ ...card, padding: "24px", marginTop: "16px" }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>So geht&apos;s weiter</h3>
          <ol className="steps-list">
            <li>Drucken Sie den Bericht als PDF oder auf Papier</li>
            <li>Leiten Sie das Dokument an Ihr Aufsichtsorgan weiter ({reportTo}: {aufsichtName})</li>
            <li>Bewahren Sie eine Kopie für Ihre Unterlagen auf</li>
          </ol>
        </div>

        {/* Donation */}
        <div className="fade-up fade-up-delay-3" style={{ ...card, padding: "24px", marginTop: "16px", textAlign: "center" }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: "var(--text)" }}>Weiterentwicklung unterstützen</h3>
          <p className="text-xs leading-relaxed mb-1" style={{ color: "var(--text-light)" }}>
            Diese Anwendung ist Open Source und kostenfrei für alle DRK-Gliederungen.
            Wenn Ihnen das Tool geholfen hat, freuen wir uns über einen kleinen Beitrag.
          </p>
          <div className="donation-amounts">
            <a
              href="https://www.paypal.com/donate/?business=DEINE_PAYPAL_ID&amount=15&currency_code=EUR&item_name=DRK+Selbstauskunft"
              target="_blank"
              rel="noopener noreferrer"
              className="donation-btn"
            >
              <span className="amount">15 €</span>
              <span className="label">Danke!</span>
            </a>
            <a
              href="https://www.paypal.com/donate/?business=DEINE_PAYPAL_ID&amount=25&currency_code=EUR&item_name=DRK+Selbstauskunft"
              target="_blank"
              rel="noopener noreferrer"
              className="donation-btn"
            >
              <span className="amount">25 €</span>
              <span className="label">Klasse!</span>
            </a>
            <a
              href="https://www.paypal.com/donate/?business=DEINE_PAYPAL_ID&amount=50&currency_code=EUR&item_name=DRK+Selbstauskunft"
              target="_blank"
              rel="noopener noreferrer"
              className="donation-btn"
            >
              <span className="amount">50 €</span>
              <span className="label">Großartig!</span>
            </a>
          </div>
          <p className="text-xs" style={{ color: "var(--text-light)" }}>
            Spenden fließen in Hosting, Weiterentwicklung und Barrierefreiheit.
          </p>
        </div>

        {/* Weitere Angebote */}
        <div className="fade-up fade-up-delay-4" style={{ ...card, padding: "24px", marginTop: "16px" }}>
          <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Was wir sonst noch entwickeln</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-light)" }}>
            Datensparsame, Open-Source-Werkzeuge für die Vereins- und Verbandsarbeit.
          </p>
          <div className="offer-cards">
            <a href="https://github.com/AFielen/drk" target="_blank" rel="noopener noreferrer" className="offer-card">
              <div className="offer-icon" style={{ background: "#fce4ec", color: "var(--drk)" }}>🗳️</div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  DRK Vereinsabstimmung
                  <span className="offer-badge live">Live</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
                  Digitales Abstimmungssystem für Mitgliederversammlungen — live, anonym und DSGVO-konform.
                </p>
              </div>
            </a>
            <a href="#" className="offer-card">
              <div className="offer-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}>🤖</div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  HenryGPT
                  <span className="offer-badge soon">In Entwicklung</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
                  Intelligenter KI-Assistent speziell für das DRK — DSGVO-konform in eigener Umgebung.
                </p>
              </div>
            </a>
            <a href="#" className="offer-card">
              <div className="offer-icon" style={{ background: "#f3e5f5", color: "#7b1fa2" }}>📋</div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Digitale Gremienarbeit
                  <span className="offer-badge soon">In Entwicklung</span>
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
                  Sitzungsmanagement, Beschlussdokumentation und Protokollführung — serverlos und datenschutzkonform.
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Privacy note */}
        <div
          className="fade-up fade-up-delay-5 rounded-[10px] p-4 text-center"
          style={{ background: "#f0f7ff", border: "1px solid #c5ddf5", marginTop: "16px" }}
        >
          <p className="text-xs" style={{ color: "var(--text-light)" }}>
            Ihre Daten wurden nicht gespeichert. Sobald Sie dieses Fenster schließen, sind alle Eingaben unwiderruflich gelöscht.
          </p>
        </div>

        {/* Restart */}
        <div className="fade-up fade-up-delay-6 text-center" style={{ marginTop: "16px" }}>
          <a
            href="/"
            className="text-sm font-medium"
            style={{ color: "var(--drk)" }}
          >
            Neue Selbstauskunft starten →
          </a>
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
            {currentSectionComplete ? "Weiter →" : "Alle Fragen beantworten"}
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
