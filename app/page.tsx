"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roles, reportTargets } from "@/lib/questions";
import { card } from "@/lib/styles";
import { APP_VERSION, APP_DATE } from "@/lib/version";

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
  const [geschaeftsjahr, setGeschaeftsjahr] = useState((new Date().getFullYear() - 1).toString());

  const gjNum = parseInt(geschaeftsjahr);
  const gjValid = /^\d{4}$/.test(geschaeftsjahr) && gjNum >= 2000 && gjNum <= new Date().getFullYear();

  const canStart =
    (role && (role !== "Sonstiges" || roleCustom.trim().length >= 2)) &&
    (reportTo && (reportTo !== "Sonstiges" || reportToCustom.trim().length >= 2)) &&
    name.trim().length >= 2 && gliederung.trim().length >= 2 && aufsichtName.trim().length >= 2 && gjValid;

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
        {/* Hero */}
        <div className="hero">
          <div className="relative z-1 max-w-[640px] mx-auto">
            <div className="hero-icon">
              <span>🛡️</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Digitale Selbstauskunft</h2>
            <p className="text-sm opacity-90 leading-relaxed max-w-md mx-auto">
              Jährliche Compliance-Erklärung für Vorstände, Geschäftsführer
              und Prokuristen — Schritt für Schritt, direkt im Browser.
            </p>
          </div>
        </div>

        {/* Feature Cards (overlap) */}
        <div className="overlap-card fade-up fade-up-delay-2">
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon" style={{ background: "#fef3e0", color: "var(--warning)" }}>📋</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Ausfüllen</p>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>6 Abschnitte mit Ja / Nein / Teilweise</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: "#e8f5e9", color: "var(--success)" }}>📄</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>PDF exportieren</p>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>Bericht drucken oder als PDF speichern</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}>🔒</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Keine Speicherung</p>
                <p className="text-xs" style={{ color: "var(--text-light)" }}>Alle Daten bleiben lokal im Browser</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("setup")}
            className="w-full py-3 mt-6 rounded-[10px] text-white font-semibold transition-colors"
            style={{ background: "var(--drk)" }}
          >
            Selbstauskunft beginnen →
          </button>

          <p className="text-xs text-center mt-3" style={{ color: "var(--text-light)" }}>
            Open Source & kostenlos — steht allen DRK-Gliederungen frei zur Verfügung.
          </p>
          <p className="text-xs text-center mt-2" style={{ color: "var(--text-light)", opacity: 0.6 }}>
            Version {APP_VERSION} · Stand {APP_DATE}
          </p>
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
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              inputMode="numeric"
              value={geschaeftsjahr}
              onChange={(e) => setGeschaeftsjahr(e.target.value)}
              placeholder={String(new Date().getFullYear() - 1)}
              className="w-full px-3 py-2 rounded-[10px] text-sm"
              style={{ border: `1px solid ${gjValid || !geschaeftsjahr ? "var(--border)" : "var(--danger)"}` }}
            />
            {geschaeftsjahr && !gjValid && (
              <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                Bitte ein gültiges Geschäftsjahr eingeben (2000–{new Date().getFullYear()}).
              </p>
            )}
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
              style={{ border: `1px solid ${name && name.trim().length < 2 ? "var(--danger)" : "var(--border)"}` }}
            />
            {name && name.trim().length < 2 && (
              <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>Bitte vollständigen Namen eingeben.</p>
            )}
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
              style={{ border: `1px solid ${gliederung && gliederung.trim().length < 2 ? "var(--danger)" : "var(--border)"}` }}
            />
            {gliederung && gliederung.trim().length < 2 && (
              <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>Bitte vollständige Bezeichnung eingeben.</p>
            )}
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
              style={{ border: `1px solid ${aufsichtName && aufsichtName.trim().length < 2 ? "var(--danger)" : "var(--border)"}` }}
            />
            {aufsichtName && aufsichtName.trim().length < 2 && (
              <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>Bitte vollständigen Namen eingeben.</p>
            )}
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
