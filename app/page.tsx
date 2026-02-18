"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roles, reportTargets } from "@/lib/questions";

const card = {
  background: "var(--card)",
  boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  borderRadius: "var(--radius)",
};

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "setup">("intro");
  const [role, setRole] = useState("");
  const [roleCustom, setRoleCustom] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [reportToCustom, setReportToCustom] = useState("");
  const [name, setName] = useState("");
  const [gliederung, setGliederung] = useState("");
  const [aufsichtName, setAufsichtName] = useState("");
  const [geschaeftsjahr, setGeschaeftsjahr] = useState(new Date().getFullYear().toString());

  const canStart =
    (role && (role !== "Sonstiges" || roleCustom)) &&
    (reportTo && (reportTo !== "Sonstiges" || reportToCustom)) &&
    name && gliederung && aufsichtName && geschaeftsjahr;

  const handleStart = () => {
    const params = new URLSearchParams({
      role: role === "Sonstiges" ? roleCustom : role,
      reportTo: reportTo === "Sonstiges" ? reportToCustom : reportTo,
      name,
      gliederung,
      aufsichtName,
      geschaeftsjahr,
    });
    router.push(`/wizard?${params.toString()}`);
  };

  if (step === "intro") {
    return (
      <div className="space-y-4">
        <div style={card} className="p-6 md:p-8">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--drk)" }}>
            Digitale Selbstauskunft
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text)" }}>
            Mit diesem Tool füllen Sie die jährliche Selbstauskunft für Ihre DRK-Gliederung
            digital aus — <strong>Schritt für Schritt, direkt auf dem Handy oder am Computer.</strong>
          </p>

          <div className="rounded-[10px] p-4 mb-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>So funktioniert&apos;s:</h3>
            <ul className="text-sm space-y-2" style={{ color: "var(--text-light)" }}>
              <li>📋 <strong>Ausfüllen</strong> — 6 Abschnitte mit Ja/Nein/Teilweise-Fragen</li>
              <li>📄 <strong>Abschicken oder Drucken</strong> — als PDF exportieren oder direkt versenden</li>
              <li>🔒 <strong>Keine Datenspeicherung</strong> — Ihre Angaben werden nicht auf dem Server gespeichert</li>
            </ul>
          </div>

          <div className="rounded-[10px] p-4 mb-6" style={{ background: "#f0f7ff", border: "1px solid #c5ddf5" }}>
            <p className="text-xs" style={{ color: "var(--text-light)" }}>
              <strong>Open Source & Kostenlos</strong> — Dieses Tool steht allen DRK-Gliederungen
              frei zur Verfügung. Der Quellcode ist öffentlich einsehbar.
            </p>
          </div>

          <button
            onClick={() => setStep("setup")}
            className="w-full py-3 rounded-[10px] text-white font-semibold transition-colors"
            style={{ background: "var(--drk)" }}
          >
            Selbstauskunft beginnen →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div style={card} className="p-6">
        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--drk)" }}>
          Angaben zur Person
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-light)" }}>
          Bitte geben Sie Ihre Daten und die Ihres Aufsichtsorgans ein.
        </p>

        <div className="space-y-4">
          {/* Geschäftsjahr */}
          <div>
            <label className="block text-sm font-semibold mb-1">Geschäftsjahr</label>
            <input
              type="text"
              value={geschaeftsjahr}
              onChange={(e) => setGeschaeftsjahr(e.target.value)}
              placeholder="2025"
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: "1px solid var(--border)" }}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Ihr Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vor- und Nachname"
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: "1px solid var(--border)" }}
            />
          </div>

          {/* Rolle */}
          <div>
            <label className="block text-sm font-semibold mb-1">Ihre Funktion</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: role === r ? "var(--drk)" : "var(--bg)",
                    color: role === r ? "var(--white)" : "var(--text)",
                    border: `1px solid ${role === r ? "var(--drk)" : "var(--border)"}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            {role === "Sonstiges" && (
              <input
                type="text"
                value={roleCustom}
                onChange={(e) => setRoleCustom(e.target.value)}
                placeholder="Funktion eingeben..."
                className="w-full px-3 py-2 rounded-[10px] text-sm mt-2"
                style={{ border: "1px solid var(--border)" }}
              />
            )}
          </div>

          {/* DRK-Gliederung */}
          <div>
            <label className="block text-sm font-semibold mb-1">DRK-Gliederung</label>
            <input
              type="text"
              value={gliederung}
              onChange={(e) => setGliederung(e.target.value)}
              placeholder="z.B. Kreisverband Städteregion Aachen e.V."
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: "1px solid var(--border)" }}
            />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />

          {/* Aufsichtsorgan */}
          <div>
            <label className="block text-sm font-semibold mb-1">Ich berichte an (Funktion des Aufsichtsorgans)</label>
            <div className="flex flex-wrap gap-2">
              {reportTargets.map((r) => (
                <button
                  key={r}
                  onClick={() => setReportTo(r)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: reportTo === r ? "var(--drk)" : "var(--bg)",
                    color: reportTo === r ? "var(--white)" : "var(--text)",
                    border: `1px solid ${reportTo === r ? "var(--drk)" : "var(--border)"}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            {reportTo === "Sonstiges" && (
              <input
                type="text"
                value={reportToCustom}
                onChange={(e) => setReportToCustom(e.target.value)}
                placeholder="Funktion eingeben..."
                className="w-full px-3 py-2 rounded-[10px] text-sm mt-2"
                style={{ border: "1px solid var(--border)" }}
              />
            )}
          </div>

          {/* Name Aufsichtsorgan */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name des/der Vorsitzenden des Aufsichtsorgans</label>
            <input
              type="text"
              value={aufsichtName}
              onChange={(e) => setAufsichtName(e.target.value)}
              placeholder="Vor- und Nachname"
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: "1px solid var(--border)" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep("intro")}
          className="px-6 py-2 rounded-[10px] text-sm font-semibold"
          style={{ background: "var(--border)", color: "var(--text)" }}
        >
          ← Zurück
        </button>
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="px-6 py-2 rounded-[10px] text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          style={{ background: "var(--drk)" }}
        >
          Wizard starten →
        </button>
      </div>
    </div>
  );
}
