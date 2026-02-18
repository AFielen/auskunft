"use client";

import { useState } from "react";
import { sections } from "@/lib/questions";

type Answers = Record<string, boolean | string | number>;
type Deviations = Record<string, string>;

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [deviations, setDeviations] = useState<Deviations>({});
  const [signName, setSignName] = useState("");
  const [signOrt, setSignOrt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = sections.length + 1; // +1 for signature
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selbstauskunft abgegeben</h2>
        <p className="text-gray-600 mb-4">
          Vielen Dank, {signName}. Ihre Selbstauskunft wurde erfolgreich gespeichert.
        </p>
        {deviationCount > 0 && (
          <p className="text-amber-600 text-sm">
            {deviationCount} Abweichung(en) wurden dokumentiert.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Schritt {step + 1} von {totalSteps}</span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!isLastSection && section ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{section.description}</p>

            <div className="space-y-4">
              {section.questions.map((q) => {
                // Conditional visibility
                if (q.conditionalOn && answers[q.conditionalOn] !== true) {
                  return null;
                }

                const isDeviation = q.deviationRequired && q.type === "checkbox" && answers[q.id] === false;

                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${isDeviation ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-gray-50"}`}>
                    {q.type === "checkbox" && (
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={answers[q.id] === true}
                          onChange={(e) => setAnswer(q.id, e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{q.text}</span>
                      </label>
                    )}

                    {q.type === "number" && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{q.text}</label>
                        <input
                          type="number"
                          min="0"
                          value={(answers[q.id] as number) ?? ""}
                          onChange={(e) => setAnswer(q.id, parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    )}

                    {q.type === "text" && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{q.text}</label>
                        <textarea
                          value={(answers[q.id] as string) ?? ""}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    )}

                    {/* Deviation explanation */}
                    {isDeviation && (
                      <div className="mt-3 pl-8">
                        <p className="text-amber-700 text-xs font-semibold mb-1">
                          ⚠️ Abweichung — bitte begründen:
                        </p>
                        <textarea
                          value={deviations[q.id] ?? ""}
                          onChange={(e) => setDeviation(q.id, e.target.value)}
                          rows={2}
                          placeholder="Begründung der Abweichung..."
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Signature Step */
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Abschließende Erklärung & Unterschrift</h2>
            <p className="text-sm text-gray-500 mb-6">
              Bitte bestätigen Sie die Richtigkeit und Vollständigkeit Ihrer Angaben.
            </p>

            {deviationCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-800 font-semibold text-sm">
                  ⚠️ {deviationCount} Abweichung(en) dokumentiert
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  Stellen Sie sicher, dass alle Abweichungen begründet wurden.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vor- und Nachname</label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
                <input
                  type="text"
                  value={signOrt}
                  onChange={(e) => setSignOrt(e.target.value)}
                  placeholder="Aachen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="text-sm text-gray-500">
                Datum: {new Date().toLocaleDateString("de-DE")}
              </div>

              <label className="flex items-start gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={answers["final_confirm"] === true}
                  onChange={(e) => setAnswer("final_confirm", e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
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
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Zurück
        </button>

        {isLastSection ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!signName || !signOrt || answers["final_confirm"] !== true}
            className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ✅ Selbstauskunft abgeben
          </button>
        ) : (
          <button
            onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Weiter →
          </button>
        )}
      </div>
    </div>
  );
}
