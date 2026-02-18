# 🛡️ DRK Selbstauskunft

**Digitale Compliance-Erklärung für Vorstände, Geschäftsführer und Prokuristen im Deutschen Roten Kreuz.**

Open Source · Kostenlos · Keine Datenspeicherung · DSGVO-konform

---

## Was ist das?

Die jährliche Selbstauskunft ist ein Compliance-Instrument für Führungskräfte in DRK-Gliederungen. Vorstände, Geschäftsführer und Prokuristen bestätigen damit die Einhaltung zentraler Pflichten gegenüber ihrem Aufsichtsorgan.

Dieses Tool digitalisiert den Prozess — **Schritt für Schritt, direkt auf dem Handy oder am Computer.**

## ✨ Features

### Web-App
- **Geführter Wizard** — 6 Abschnitte mit Ja/Nein/Teilweise-Fragen und Hilfe-Erklärungen
- **Rollenauswahl** — Geschäftsführer, Vorstand, Prokurist oder eigene Funktion
- **Flexibles Reporting** — Wählen Sie selbst, an wen Sie berichten
- **Abweichungen dokumentieren** — Bei "Nein" oder "Teilweise" wird automatisch eine Begründung verlangt
- **PDF-Report** — Vollständiger Bericht mit DRK-Branding, Unterschriftszeile und Zusammenfassung
- **QR-Code im Report** — Jeder Report enthält einen QR-Code mit komprimierten Formulardaten. Scannen füllt die Selbstauskunft für das nächste Jahr automatisch vor — das PDF wird zur "Offline-Datenbank"
- **Zwischenspeichern** — Fortschritt wird im Browser gespeichert (localStorage)
- **Exit-Guard** — Warnung beim versehentlichen Schließen des Tabs
- **Mobile-optimiert** — Responsive Design mit Bottom-Sheet-Hilfe auf dem Handy

### REST-API (für KI-Assistenten)
- **Schema abrufen** — `GET /api/auskunft` liefert alle Fragen, Typen und erlaubte Werte
- **Report generieren** — `POST /api/auskunft` mit JSON → HTML-Report zurück
- **Agent-ready** — KI-Assistenten können die Selbstauskunft im Gespräch ausfüllen

→ Details zur API: [AGENT.md](AGENT.md)

## 📋 Abschnitte

| # | Thema | Fragen |
|---|-------|--------|
| 1 | Geschäftsführung & Interessenkonflikte | 6 |
| 2 | Sitzungen & Beschlussfassungen | 3 |
| 3 | Zustimmungspflichtige Rechtsgeschäfte | 5 |
| 4 | Arbeitgeberstellung | 11 |
| 5 | Finanzwesen | 8 |
| 6 | Revision & Compliance | 3 |

## 🚀 Installation

### Docker (empfohlen)

```bash
git clone https://github.com/AFielen/auskunft.git
cd auskunft
docker compose up -d --build
```

Die App läuft dann auf **http://localhost:3000**.

### Lokal entwickeln

```bash
git clone https://github.com/AFielen/auskunft.git
cd auskunft
npm install
npm run dev
```

## 🛠️ Tech-Stack

- [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

## 📐 Projektstruktur

```
auskunft/
├── app/
│   ├── layout.tsx              # DRK-Header + Footer
│   ├── page.tsx                # Startseite (Hero) + Personen-Setup
│   ├── globals.css             # DRK-Farbvariablen + Animationen
│   ├── not-found.tsx           # Custom 404
│   ├── wizard/page.tsx         # Wizard + PDF-Report + Ergebnisseite
│   ├── api/auskunft/route.ts   # REST-API für KI-Assistenten
│   ├── impressum/page.tsx
│   └── datenschutz/page.tsx
├── lib/
│   ├── questions.ts            # Fragen, Abschnitte, Rollen
│   ├── report.ts               # Shared Report-Generierung (HTML + QR)
│   ├── state-codec.ts          # State komprimieren/dekomprimieren (lz-string)
│   ├── qr-svg.ts               # QR-Code SVG-Generierung
│   ├── styles.ts               # Shared Styles
│   └── version.ts              # Versionierung
├── public/
│   ├── logo.png / logo.svg
│   └── favicon.svg
├── AGENT.md                    # API-Doku für KI-Assistenten
├── Dockerfile
└── docker-compose.yml
```

## 🔒 Datenschutz & Sicherheit

- **Keine Datenbank** — Alle Angaben existieren nur im Browser
- **Keine Cookies** — Kein Tracking, keine Analytics
- **Keine externen Dienste** — Keine Google Fonts, kein CDN
- **localStorage nur lokal** — Wird bei Abgabe automatisch gelöscht
- **XSS-Schutz** — HTML-Escaping aller Benutzereingaben in der PDF-Generierung
- **QR-Code = nur komprimierte Daten** — Der QR-Code enthält die Formulardaten als komprimierten String (lz-string). Kein Server, kein Token, keine Datenbank — die Daten reisen mit dem Dokument
- **DSGVO-konform** — Keine serverseitige Verarbeitung personenbezogener Daten

## 🤝 Beitragen

Pull Requests sind willkommen!

1. Fork erstellen
2. Feature-Branch anlegen (`git checkout -b feature/mein-feature`)
3. Committen (`git commit -m 'feat: Beschreibung'`)
4. Pushen (`git push origin feature/mein-feature`)
5. Pull Request öffnen

## 📄 Lizenz

MIT — Frei verwendbar für alle DRK-Gliederungen und darüber hinaus.

## 🏥 Über

Ein Projekt des [DRK Kreisverband Städteregion Aachen e.V.](https://www.drk-aachen.de/) zur Digitalisierung der Compliance-Prozesse im Deutschen Roten Kreuz.

---

*Gebaut mit ❤️ für das Deutsche Rote Kreuz*
