# DRK Selbstauskunft – Konventionen für Claude Code

## Überblick

Digitale Compliance-Erklärung für Vorstände, Geschäftsführer und Prokuristen im Deutschen Roten Kreuz. Basiert auf dem [drk-app-template](https://github.com/AFielen/drk-app-template).

**Referenz-Template:** https://github.com/AFielen/drk-app-template

---

## Tech-Stack

| Technologie | Version | Zweck |
|---|---|---|
| Next.js | 16 | App-Framework (App Router) |
| React | 19 | UI-Library |
| TypeScript | strict | Typisierung |
| Tailwind CSS | 4 | Styling |

**NICHT verwenden:**
- Keine CSS-Module, kein styled-components, kein Sass
- Keine externen Fonts (Google Fonts etc.) – Fonts immer lokal hosten
- Keine externen Analytics/Tracking-Dienste
- Keine Cookies
- Kein jQuery oder andere Legacy-Libraries

---

## Deployment

Diese App nutzt **Variante B: Server (Node.js Backend)** wegen API-Routes (`/api/auskunft`, `/api/feedback`).

- `output: 'standalone'` in `next.config.ts`
- Docker Multi-Stage Build (node:22-alpine)
- docker-compose mit Port 3333:3000

---

## Projektstruktur

```
auskunft/
├── CLAUDE.md                    # ← Diese Datei
├── app/
│   ├── layout.tsx               # Root-Layout: DRK-Header + Footer
│   ├── page.tsx                 # Startseite (Hero + Personen-Setup)
│   ├── globals.css              # DRK CSS-Variablen + Design-System
│   ├── not-found.tsx            # Custom 404
│   ├── wizard/page.tsx          # Wizard + PDF-Report + Ergebnisseite
│   ├── impressum/page.tsx       # Pflicht
│   ├── datenschutz/page.tsx     # Pflicht
│   ├── hilfe/page.tsx           # Pflicht (FAQ + Feedback)
│   ├── spenden/page.tsx         # Pflicht
│   └── api/
│       ├── auskunft/route.ts    # REST-API für KI-Assistenten
│       └── feedback/route.ts    # Feedback-Submission
├── lib/
│   ├── questions.ts             # Fragen, Abschnitte, Rollen, Types
│   ├── report.ts                # PDF HTML-Generierung + QR
│   ├── state-codec.ts           # State komprimieren/dekomprimieren
│   ├── qr-svg.ts                # QR-Code SVG-Generierung
│   ├── instance.ts              # Instanz-ID Management
│   ├── styles.ts                # Shared Styles (card)
│   └── version.ts               # Versionierung
├── public/
│   ├── logo.png                 # DRK-Logo (42x42)
│   ├── logo.svg
│   └── favicon.svg
├── API-INTEGRATION.md           # REST-API Doku für KI-Assistenten
├── PROJECT.md                   # Projektkontext für Entwickler
├── AUDIT.md                     # Template-Alignment Audit
├── README.md
├── LICENSE                      # MIT
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── next.config.ts
```

---

## Design-System

### CSS-Variablen (in globals.css)

```css
:root {
  --drk: #e30613;
  --drk-dark: #b8000f;
  --drk-light: #ff1a2e;
  --drk-bg: #fef2f2;

  --text: #212529;
  --text-light: #6b7280;
  --text-muted: #9ca3af;

  --bg: #f8f9fa;
  --bg-card: #ffffff;
  --border: #e5e7eb;

  --success: #28a745;
  --warning: #ffc107;
  --info: #17a2b8;
}
```

**WICHTIG:** In Komponenten `style={{ color: 'var(--drk)' }}` nutzen statt Tailwind-Hardcoded-Farben. Tailwind-Klassen für Layout, CSS-Variablen für DRK-Farben.

### Header

- Hintergrund: `#e30613` (inline style)
- Text: Weiß
- Links: DRK-Logo `logo.png` (42×42px) + App-Titel `text-[1.4rem] font-bold` + Untertitel `text-[0.8rem] opacity-85`
- Rechts: SVG-Icon-Buttons (❤ Spenden + ❓ Hilfe), jeweils `w-9 h-9 rounded-full hover:bg-white/10`
- Layout: `flex items-center justify-between gap-3 px-6 py-4`
- NICHT sticky/fixed

### Footer

- Heller Hintergrund, zentriert, `border-t`
- "DEUTSCHES ROTES KREUZ" – Rot, uppercase, bold, tracking-widest
- "Kreisverband StädteRegion Aachen e.V." – Grau
- Links: Impressum · Datenschutz · Hilfe · Unterstützen
- "made with ❤ for ✚"

### Design-System Klassen

- `.drk-card` – Box-Karten (weiß, rounded, shadow, padding)
- `.drk-btn-primary` – Primärer Button (Rot, weiß, min-height 44px)
- `.drk-btn-secondary` – Sekundärer Button (Grau)
- `.drk-label` – Formular-Labels (bold, dunkel)
- `.drk-input` – Formular-Inputs (border, rounded, focus-ring in Rot)

---

## UX-Prinzipien

1. **Einfachheit** – Jeder Bildschirm: EINE klare Aufgabe
2. **Mobile First** – Touch-Ziele min. 44x44px, kein Hover-only-Content
3. **Sofort nutzbar** – Kein Login, selbsterklärende UI
4. **Fehlertoleranz** – Exit-Guard, localStorage, deutsche Fehlermeldungen

---

## Pflicht-Seiten

- `/impressum` – DRK KV Aachen Kontaktdaten
- `/datenschutz` – Verantwortlicher, keine Cookies, Betroffenenrechte
- `/hilfe` – FAQ, Kontakt, Feedback-Formular
- `/spenden` – Spenden-Optionen, Open-Source-Hinweis

---

## Code-Konventionen

### TypeScript
- `strict: true`, keine `any`
- Interfaces für Props, Types für Unions
- Function Components only

### Dateibenennungen
- Komponenten: `PascalCase.tsx`
- Hooks: `use*.ts`
- Utils: `kebab-case.ts`
- Pages: `page.tsx`

### Commits
- `feat:` / `fix:` / `docs:` / `style:` / `refactor:`

---

## App-spezifische Hinweise

- **Privacy-First:** Keine serverseitige Datenspeicherung (außer opt-in Feedback)
- **QR-Code im PDF:** Komprimierter Formular-State (lz-string) für Vorausfüllung nächstes Jahr
- **REST-API:** `/api/auskunft` für KI-Agenten-Integration (siehe API-INTEGRATION.md)
- **Feedback-System:** Instance-ID-basiert, nur konfigurierte Instanz speichert Daten

---

## Kontakt

DRK Kreisverband StädteRegion Aachen e.V.
Henry-Dunant-Platz 1, 52146 Würselen
E-Mail: Info@DRK-Aachen.de
Web: https://www.drk-aachen.de
