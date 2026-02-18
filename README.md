# 🛡️ DRK Selbstauskunft

Digitale Selbstauskunft für Vorstände, Geschäftsführer und Prokuristen im Deutschen Roten Kreuz.

**Open Source · Kostenlos · Keine Datenspeicherung**

---

## Was ist das?

Die jährliche Selbstauskunft ist ein Compliance-Instrument für Führungskräfte in DRK-Gliederungen. Vorstände, Geschäftsführer und Prokuristen bestätigen damit die Einhaltung zentraler Pflichten gegenüber ihrem Aufsichtsorgan.

Dieses Tool digitalisiert den Prozess — **Schritt für Schritt, direkt auf dem Handy oder am Computer.**

## ✨ Features

- **6 Abschnitte** — Geführter Wizard durch alle Compliance-Themen
- **Ja / Nein / Teilweise** — Klare Antwortoptionen mit Abweichungsbegründung
- **Hilfe bei jeder Frage** — Verständliche Erklärungen per ?-Icon
- **Rollenauswahl** — Geschäftsführer, Vorstand, Prokurist oder eigene Funktion
- **Flexibles Reporting** — Wählen Sie selbst, an wen Sie berichten (Präsident, Aufsichtsratsvorsitzender, Justiziar, …)
- **Mobile-optimiert** — Große Touch-Targets, responsive Design
- **Keine Datenspeicherung** — Ihre Angaben bleiben auf Ihrem Gerät. Nichts wird auf dem Server gespeichert.
- **PDF-Druck** — Fertige Auskunft direkt ausdrucken oder als PDF speichern

## 📋 Abschnitte

| # | Thema |
|---|-------|
| 1 | Geschäftsführung & Interessenkonflikte |
| 2 | Sitzungen & Beschlussfassungen |
| 3 | Zustimmungspflichtige Rechtsgeschäfte |
| 4 | Arbeitgeberstellung |
| 5 | Finanzwesen |
| 6 | Revision & Compliance |

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

Öffne [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech-Stack

- [Next.js 15](https://nextjs.org/) — React Framework
- [TypeScript](https://www.typescriptlang.org/) — Typsicherheit
- [Tailwind CSS](https://tailwindcss.com/) — Styling

## 📐 Architektur

```
auskunft/
├── app/
│   ├── layout.tsx       # DRK-Header, Footer, globales Layout
│   ├── page.tsx          # Startseite + Personen-Setup
│   ├── globals.css       # DRK-Farbvariablen
│   └── wizard/
│       └── page.tsx      # Der eigentliche Wizard
├── lib/
│   └── questions.ts      # Alle Fragen, Abschnitte, Rollen
├── public/
│   ├── logo.png          # DRK-Logo
│   └── logo.svg
├── Dockerfile
└── docker-compose.yml
```

## 🔒 Datenschutz

- **Keine Datenbank** — Alle Angaben existieren nur im Browser des Nutzers
- **Keine Cookies** — Kein Tracking, keine Analytics
- **Keine Übertragung** — Daten verlassen das Gerät nur beim Drucken/PDF-Export
- **DSGVO-konform** — Es werden keine personenbezogenen Daten verarbeitet oder gespeichert

## 🤝 Beitragen

Pull Requests sind willkommen! Dieses Projekt steht allen DRK-Gliederungen frei zur Verfügung.

1. Fork erstellen
2. Feature-Branch anlegen (`git checkout -b feature/mein-feature`)
3. Änderungen committen (`git commit -m 'feat: Beschreibung'`)
4. Branch pushen (`git push origin feature/mein-feature`)
5. Pull Request öffnen

## 📄 Lizenz

MIT — Frei verwendbar für alle DRK-Gliederungen und darüber hinaus.

## 🏥 Über

Ein Projekt des [DRK Kreisverband Städteregion Aachen e.V.](https://www.drk-aachen.de/) zur Digitalisierung der Compliance-Prozesse im Deutschen Roten Kreuz.

---

*Gebaut mit ❤️ für das Deutsche Rote Kreuz*
