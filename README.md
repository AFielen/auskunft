# 🛡️ DRK Selbstauskunft

**Digitale Compliance-Erklärung für Vorstände, Geschäftsführer und Prokuristen im Deutschen Roten Kreuz.**

Open Source · Kostenlos · Keine Datenspeicherung · DSGVO-konform

---

## Was ist das?

Die jährliche Selbstauskunft ist ein Compliance-Instrument für Führungskräfte in DRK-Gliederungen. Vorstände, Geschäftsführer und Prokuristen bestätigen damit die Einhaltung zentraler Pflichten gegenüber ihrem Aufsichtsorgan.

Dieses Tool digitalisiert den Prozess — **Schritt für Schritt, direkt auf dem Handy oder am Computer.**

## ✨ Features

- **Geführter Wizard** — 6 Abschnitte mit Ja/Nein/Teilweise-Fragen und Hilfe-Erklärungen
- **Rollenauswahl** — Geschäftsführer, Vorstand, Prokurist oder eigene Funktion
- **Flexibles Reporting** — Wählen Sie selbst, an wen Sie berichten
- **Abweichungen dokumentieren** — Bei "Nein" oder "Teilweise" wird automatisch eine Begründung verlangt
- **PDF-Report** — Vollständiger Bericht mit DRK-Branding, Unterschriftszeile und Zusammenfassung
- **Zwischenspeichern** — Fortschritt wird im Browser gespeichert (localStorage)
- **Exit-Guard** — Warnung beim versehentlichen Schließen des Tabs
- **Mobile-optimiert** — Responsive Design, große Touch-Targets
- **Keine Datenspeicherung** — Alles bleibt auf Ihrem Gerät. Nichts wird auf dem Server gespeichert.

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

- [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

## 📐 Architektur

```
auskunft/
├── app/
│   ├── layout.tsx          # DRK-Header + Footer mit Impressum/Datenschutz
│   ├── page.tsx            # Startseite (Hero) + Personen-Setup
│   ├── globals.css         # DRK-Farbvariablen + Animationen
│   ├── not-found.tsx       # Custom 404
│   ├── wizard/page.tsx     # Wizard + PDF-Report-Generator + Ergebnisseite
│   ├── impressum/page.tsx
│   └── datenschutz/page.tsx
├── lib/
│   ├── questions.ts        # Alle Fragen, Abschnitte, Rollen, Report-Targets
│   └── styles.ts           # Shared CSS-in-JS Styles
├── public/
│   ├── logo.png / logo.svg # DRK-Logo
│   └── favicon.svg         # DRK-Kreuz Favicon
├── Dockerfile
└── docker-compose.yml
```

## 🔒 Datenschutz

- **Keine Datenbank** — Alle Angaben existieren nur im Browser
- **Keine Cookies** — Kein Tracking, keine Analytics
- **Keine externe Dienste** — Keine Google Fonts, kein CDN, kein Analytics
- **localStorage nur lokal** — Zwischenspeicher bleibt auf dem Gerät, wird bei Abgabe gelöscht
- **DSGVO-konform** — Es werden keine personenbezogenen Daten serverseitig verarbeitet

## 🔐 Sicherheit

- HTML-Escaping aller Benutzereingaben in der PDF-Generierung (XSS-Schutz)
- Keine serverseitige Datenverarbeitung
- Keine API-Endpunkte die Nutzerdaten annehmen

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
