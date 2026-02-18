"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { sections } from "@/lib/questions";

type ConfirmValue = "ja" | "nein" | "teilweise" | undefined;
type Answers = Record<string, ConfirmValue | string | number>;
type Deviations = Record<string, string>;

const card = {
  background: "var(--card)",
  boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  borderRadius: "var(--radius)",
};

function HelpIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
        style={{ background: "var(--border)", color: "var(--text-light)" }}
        aria-label="Hilfe"
      >
        ?
      </button>
      {open && (
        <div
          className="absolute z-10 left-0 top-7 w-72 p-3 rounded-[10px] text-xs leading-relaxed shadow-lg"
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
      )}
    </span>
  );
}

function ConfirmButtons({
  value,
  onChange,
}: {
  value: ConfirmValue;
  onChange: (v: ConfirmValue) => void;
}) {
  const options: { label: string; val: ConfirmValue; color: string; activeBg: string }[] = [
    { label: "Ja", val: "ja", color: "var(--success)", activeBg: "var(--success)" },
    { label: "Nein", val: "nein", color: "var(--danger)", activeBg: "var(--danger)" },
    { label: "Teilweise", val: "teilweise", color: "var(--warning)", activeBg: "var(--warning)" },
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
            background: value === opt.val ? opt.activeBg : "var(--bg)",
            color: value === opt.val ? "var(--white)" : opt.color,
            border: `2px solid ${value === opt.val ? opt.activeBg : opt.color}`,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function WizardContent() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "";
  const userRole = searchParams.get("role") || "";
  const gliederung = searchParams.get("gliederung") || "";
  const reportTo = searchParams.get("reportTo") || "";
  const aufsichtName = searchParams.get("aufsichtName") || "";
  const geschaeftsjahr = searchParams.get("geschaeftsjahr") || "";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [deviations, setDeviations] = useState<Deviations>({});
  const [signOrt, setSignOrt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = sections.length + 1;
  const section = sections[step];
  const isLastSection = step === sections.length;

  const setAnswer = (id: string, value: ConfirmValue | string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const setDeviation = (id: string, value: string) => {
    setDeviations((prev) => ({ ...prev, [id]: value }));
  };

  const deviationCount = sections.reduce((count, sec) => {
    return count + sec.questions.filter(
      (q) => q.type === "confirmation" && (answers[q.id] === "nein" || answers[q.id] === "teilweise")
    ).length;
  }, 0);

  if (submitted) {
    return (
      <div style={card} className="p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--drk)" }}>
          Selbstauskunft abgegeben
        </h2>
        <p style={{ color: "var(--text)" }} className="mb-2">
          Vielen Dank, {userName}.
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--text-light)" }}>
          {userRole} — {gliederung} — Geschäftsjahr {geschaeftsjahr}
        </p>
        {deviationCount > 0 && (
          <p className="text-sm" style={{ color: "var(--warning)" }}>
            {deviationCount} Abweichung(en) wurden dokumentiert.
          </p>
        )}
        <div className="mt-6">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded-[10px] text-sm font-semibold text-white"
            style={{ background: "var(--drk)" }}
          >
            📄 Als PDF drucken
          </button>
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

      {/* Progress Bar */}
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

      {/* Section Content */}
      <div style={card} className="p-5 md:p-6">
        {!isLastSection && section ? (
          <>
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--drk)" }}>{section.title}</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-light)" }}>{section.description}</p>

            <div className="space-y-3">
              {section.questions.map((q) => {
                // Conditional visibility
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
                          onChange={(e) => setAnswer(q.id, parseInt(e.target.value) || 0)}
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
            className="px-5 py-2 rounded-[10px] text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--drk)" }}
          >
            Weiter →
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
