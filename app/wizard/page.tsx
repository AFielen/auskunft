"use client";

import { useState } from "react";
import { sections } from "@/lib/questions";

type Answers = Record<string, boolean | string | number>;
type Deviations = Record<string, string>;

const card = {
  background: "var(--card)",
  boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  borderRadius: "var(--radius)",
};

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [deviations, setDeviations] = useState<Deviations>({});
  const [signName, setSignName] = useState("");
  const [signOrt, setSignOrt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = sections.length + 1;
  const section = sections[step];
  const isLastSection = step === sections.length;

  const setAnswer = (id: string, value: boolean | string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const setDeviation = (id: string, value: string) => {
    setDeviations((prev) => ({ ...prev, [id]: value }));
  };

  const deviationCount = sections.reduce((count, sec) => {
    return count + sec.questions.filter(
      (q) => q.deviationRequired && q.type === "checkbox" && answers[q.id] !== true
    ).length;
  }, 0);

  if (submitted) {
    return (
      <div style={card} className="p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--drk)" }}>Selbstauskunft abgegeben</h2>
        <p style={{ color: "var(--text)" }} className="mb-4">
          Vielen Dank, {signName}. Ihre Selbstauskunft wurde erfolgreich gespeichert.
        </p>
        {deviationCount > 0 && (
          <p style={{ color: "var(--warning)" }} className="text-sm">
            {deviationCount} Abweichung(en) wurden dokumentiert.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      <div style={card} className="p-6">
        {!isLastSection && section ? (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--drk)" }}>{section.title}</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-light)" }}>{section.description}</p>

            <div className="space-y-3">
              {section.questions.map((q) => {
                if (q.conditionalOn && answers[q.conditionalOn] !== true) return null;

                const isDeviation = q.deviationRequired && q.type === "checkbox" && answers[q.id] === false;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-[10px]"
                    style={{
                      background: isDeviation ? "#fef3e0" : "var(--bg)",
                      border: isDeviation ? "1px solid var(--warning)" : "1px solid var(--border)",
                    }}
                  >
                    {q.type === "checkbox" && (
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={answers[q.id] === true}
                          onChange={(e) => setAnswer(q.id, e.target.checked)}
                          className="mt-1 h-5 w-5 rounded accent-[var(--drk)]"
                        />
                        <span className="text-sm" style={{ color: "var(--text)" }}>{q.text}</span>
                      </label>
                    )}

                    {q.type === "number" && (
                      <div>
                        <label className="block text-sm mb-2" style={{ color: "var(--text)" }}>{q.text}</label>
                        <input
                          type="number"
                          min="0"
                          value={(answers[q.id] as number) ?? ""}
                          onChange={(e) => setAnswer(q.id, parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-2 rounded-[10px] text-sm"
                          style={{ border: "1px solid var(--border)" }}
                        />
                      </div>
                    )}

                    {q.type === "text" && (
                      <div>
                        <label className="block text-sm mb-2" style={{ color: "var(--text)" }}>{q.text}</label>
                        <textarea
                          value={(answers[q.id] as string) ?? ""}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-[10px] text-sm"
                          style={{ border: "1px solid var(--border)" }}
                        />
                      </div>
                    )}

                    {isDeviation && (
                      <div className="mt-3 pl-8">
                        <p className="text-xs font-semibold mb-1" style={{ color: "var(--danger)" }}>
                          ⚠️ Abweichung — bitte begründen:
                        </p>
                        <textarea
                          value={deviations[q.id] ?? ""}
                          onChange={(e) => setDeviation(q.id, e.target.value)}
                          rows={2}
                          placeholder="Begründung der Abweichung..."
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
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--drk)" }}>
              Abschließende Erklärung & Unterschrift
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-light)" }}>
              Bitte bestätigen Sie die Richtigkeit und Vollständigkeit Ihrer Angaben.
            </p>

            {deviationCount > 0 && (
              <div
                className="rounded-[10px] p-4 mb-6"
                style={{ background: "#fef3e0", border: "1px solid var(--warning)" }}
              >
                <p className="font-semibold text-sm" style={{ color: "var(--danger)" }}>
                  ⚠️ {deviationCount} Abweichung(en) dokumentiert
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
                  Stellen Sie sicher, dass alle Abweichungen begründet wurden.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                  Vor- und Nachname
                </label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full px-3 py-2 rounded-[10px] text-sm"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Ort</label>
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
                  checked={answers["final_confirm"] === true}
                  onChange={(e) => setAnswer("final_confirm", e.target.checked)}
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
          className="px-6 py-2 rounded-[10px] text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "var(--border)", color: "var(--text)" }}
        >
          ← Zurück
        </button>

        {isLastSection ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!signName || !signOrt || answers["final_confirm"] !== true}
            className="px-8 py-2 rounded-[10px] text-sm font-semibold text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--drk)" }}
          >
            ✅ Selbstauskunft abgeben
          </button>
        ) : (
          <button
            onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
            className="px-6 py-2 rounded-[10px] text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--drk)" }}
          >
            Weiter →
          </button>
        )}
      </div>
    </div>
  );
}
