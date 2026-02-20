# Template-Alignment Audit: Auskunft vs. drk-app-template

**Datum:** 2026-02-20
**Referenz:** [CLAUDE.md aus drk-app-template](https://github.com/AFielen/drk-app-template/blob/main/CLAUDE.md)
**Geprüftes Projekt:** [auskunft](https://github.com/AFielen/auskunft)

---

## 1. Was stimmt bereits überein

### Tech-Stack

- **Next.js 16** — `next: ^16.1.6` in `package.json`
- **React 19** — `react: ^19.2.4`
- **TypeScript strict** — `strict: true` in `tsconfig.json`
- **Tailwind CSS 4** — `tailwindcss: ^4.2.0` mit `@tailwindcss/postcss`
- **Keine CSS-Module, kein styled-components, kein Sass** — nur Tailwind + CSS-Variablen
- **Keine externen Fonts** — System-Font-Stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Keine externen Analytics/Tracking** — bewusst kein Tracking
- **Keine Cookies** — bestätigt in Datenschutzerklärung und Implementierung
- **Kein jQuery oder Legacy-Libraries** — nicht vorhanden

### Deployment-Strategie

- **Server-Variante (Variante B)** korrekt gewählt — App hat API-Routes (`/api/auskunft`, `/api/feedback`)
- **`output: 'standalone'`** in `next.config.ts`
- **Dockerfile vorhanden** mit `node:22-alpine`, Multi-Stage Build, `server.js` CMD
- **docker-compose.yml vorhanden** mit `restart: unless-stopped`

### Projektstruktur

- `app/layout.tsx` — Root-Layout mit Header + Footer
- `app/page.tsx` — Startseite
- `app/globals.css` — CSS-Variablen + Basis-Styles
- `app/not-found.tsx` — Custom 404
- `app/impressum/page.tsx` — vorhanden
- `app/datenschutz/page.tsx` — vorhanden
- `app/hilfe/page.tsx` — vorhanden
- `app/api/` — API-Routes vorhanden
- `lib/version.ts` — vorhanden
- `public/logo.png`, `public/logo.svg`, `public/favicon.svg` — vorhanden
- `API-INTEGRATION.md` — vorhanden
- `PROJECT.md` — vorhanden
- `README.md` — vorhanden
- `Dockerfile` + `docker-compose.yml` — vorhanden
- `package.json`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts` — vorhanden

### Design-System

- **CSS-Variablen in globals.css** — `--drk`, `--drk-dark`, `--text`, `--text-light`, `--bg`, `--border`, `--success`, `--warning` definiert
- **Header: Hintergrund rot, Text weiss** — korrekt
- **Header: DRK-Logo links (42x42)** — `<Image src="/logo.png" width={42} height={42} />`
- **Header: App-Titel + Untertitel** — vorhanden ("DRK Selbstauskunft" + "Digitale Compliance-Erklärung")
- **Header: Hilfe-Icon rechts als SVG** — Inline-SVG Fragezeichen-Icon mit `w-9 h-9 rounded-full hover:bg-white/10`
- **Header: Nicht sticky/fixed** — korrekt, scrollt mit
- **Footer: Hell (weisser Hintergrund)** — korrekt
- **Footer: "Deutsches Rotes Kreuz"** rot, uppercase, bold, tracking-widest — korrekt
- **Footer: "Kreisverband StädteRegion Aachen e.V."** grau — korrekt
- **Footer: Links** Impressum, Datenschutz, Hilfe getrennt durch ` · ` — korrekt
- **Footer: "made with :heart: for :cross:"** mit rotem Herz und Rotkreuz-SVG — korrekt
- **Footer: `border-t` oben** — korrekt
- **Seitenhintergrund: `var(--bg)`** — leichtes Grau, korrekt
- **System-Font-Stack** — korrekt

### UX-Prinzipien

- **Mobile First** — Responsive Design, Touch-Targets vorhanden
- **Kein Login/Registrierung** — sofort nutzbar
- **Exit-Guard (beforeunload)** — in Wizard implementiert (lt. README)
- **localStorage-Zwischenspeicherung** — vorhanden
- **Fehlermeldungen auf Deutsch** — durchgängig

### DSGVO-Checkliste

- [x] Keine Cookies
- [x] `/impressum` vorhanden
- [x] `/datenschutz` vorhanden
- [x] `/hilfe` vorhanden
- [x] XSS-Schutz (HTML-Escaping in PDF-Generierung)
- [x] Fonts lokal / System-Stack
- [x] README.md vorhanden

### Code-Konventionen

- **`strict: true`** — in tsconfig.json
- **Kein `any`** — nicht in lib/-Dateien gefunden
- **Interfaces für Props, Types für Unions** — korrekt (`interface Question`, `interface Section`, `type AnswerType`)
- **Function Components only** — alle Seiten sind Function Components
- **Utils: kebab-case.ts** — `qr-svg.ts`, `state-codec.ts` korrekt
- **Pages: `page.tsx`** — korrekt

### README.md Format

- Titel mit Emoji + Kurzbeschreibung + Tagline — vorhanden
- "Was ist das?" — vorhanden
- Features (Web-App + REST-API) — vorhanden
- Installation (Docker + lokal) — vorhanden
- Tech-Stack — vorhanden
- Projektstruktur — vorhanden
- Datenschutz & Sicherheit — vorhanden
- Beitragen (Fork > Branch > Commit > PR) — vorhanden
- Lizenz (MIT) — vorhanden
- "Gebaut mit :heart: für das Deutsche Rote Kreuz" — vorhanden

---

## 2. Was weicht ab

### CSS-Variablen — abweichende Namen/Werte

| Template-Variable | Template-Wert | Auskunft-Variable | Auskunft-Wert | Problem |
|---|---|---|---|---|
| `--drk-light` | `#ff1a2e` | `--drk-light` | `#ff2d3a` | Farbwert weicht ab |
| `--drk-bg` | `#fef2f2` | — | — | Fehlt komplett |
| `--text` | `#212529` | `--text` | `#2a2a2a` | Farbwert weicht ab |
| `--text-light` | `#6b7280` | `--text-light` | `#777` | Farbwert weicht ab |
| `--text-muted` | `#9ca3af` | — | — | Fehlt komplett |
| `--bg` | `#f8f9fa` | `--bg` | `#f4f4f4` | Farbwert weicht ab |
| `--bg-card` | `#ffffff` | `--card` | `#fff` | Anderer Variablenname |
| `--border` | `#e5e7eb` | `--border` | `#e0e0e0` | Farbwert weicht ab |
| `--success` | `#28a745` | `--success` | `#2e7d32` | Farbwert weicht ab |
| `--warning` | `#ffc107` | `--warning` | `#f9a825` | Farbwert weicht ab |
| `--info` | `#17a2b8` | — | — | Fehlt komplett |

Zusätzlich definiert Auskunft:
- `--white: #fff` (nicht im Template)
- `--danger: #c62828` (nicht im Template)
- `--radius: 10px` (nicht im Template)

### Header — Abweichungen

| Aspekt | Template | Auskunft | Abweichung |
|---|---|---|---|
| Hintergrund-Style | `style={{ background: '#e30613' }}` (Hardcoded) | `style={{ background: "var(--drk)" }}` (Variable) | Geringfügig — Variable ist besser, aber Template sagt Hardcoded |
| Farbe-Style | `color: '#fff'` | `color: "var(--white)"` | Eigene Variable statt Hardcoded |
| Padding | `px-6 py-4` | `px-4 py-3` | Weniger Padding als Template |
| Titel-Größe | `text-[1.4rem]` | `text-xl` | Leicht abweichend (~1.25rem vs 1.4rem) |
| Untertitel-Größe | `text-[0.8rem] opacity-85` | `text-xs opacity-85` | `text-xs` = 0.75rem statt 0.8rem |
| Logo-Komponente | `<img>` | `<Image>` (next/image) | Auskunft nutzt Next.js Image-Optimierung |
| Spenden-Icon | Heart-SVG vorhanden | **Fehlt** | Kein Spenden-Link im Header |

### Footer — Abweichungen

| Aspekt | Template | Auskunft | Abweichung |
|---|---|---|---|
| Spenden-Link | `<Link href="/spenden">Unterstützen</Link>` | Fehlt | Kein Spenden-Link im Footer |

### Dockerfile — Abweichungen

| Aspekt | Template | Auskunft |
|---|---|---|
| Build-Stages | 3 Stages (deps, builder, runner) | 2 Stages (builder, runner) |
| deps-Stage | Separate `npm ci` Stage | `npm ci` direkt im builder |

Die Template-Variante mit 3 Stages erlaubt besseres Docker-Layer-Caching.

### docker-compose.yml — Abweichungen

| Aspekt | Template | Auskunft |
|---|---|---|
| Service-Name | `app` | `selbstauskunft` |
| Port-Mapping | `3000:3000` | `3333:3000` |
| container_name | nicht gesetzt | `drk-selbstauskunft` |
| environment | nicht gesetzt | `NODE_ENV`, `DRK_INSTANCE_ID` |
| volumes | nicht gesetzt | `/data/drk-feedback` |

Port-Mapping und Volumes sind app-spezifisch und vertretbar. Template zeigt nur die Basisstruktur.

### Hauptseiten-Layout

| Aspekt | Template | Auskunft |
|---|---|---|
| Container-Breite | `max-w-4xl` (896px) | `max-w-[900px]` | Fast identisch, aber Custom-Wert statt Tailwind-Klasse |
| Box-Karten | `.drk-card` CSS-Klasse | `lib/styles.ts` JS-Objekt (`card`) + Inline-Styles | Kein `.drk-card` in globals.css |
| Abstände | `space-y-6` | `space-y-4` | Weniger Abstand zwischen Boxen |

### Dateibenennungen

| Konvention | Template | Auskunft | Status |
|---|---|---|---|
| Komponenten: PascalCase.tsx | Erwartet | Kein `components/`-Verzeichnis mit Dateien | Nicht anwendbar (keine separaten Komponenten) |
| Hooks: use*.ts | Erwartet | Keine Custom Hooks vorhanden | Nicht anwendbar |

---

## 3. Was fehlt

### Pflichtseiten

| Seite | Status |
|---|---|
| `/impressum` | Vorhanden |
| `/datenschutz` | Vorhanden |
| `/hilfe` | Vorhanden |
| `/spenden` | **FEHLT** |

Die Spenden-Seite ist laut Template **Pflicht**. Sie soll enthalten:
- Warmherziger Dank an Nutzer
- Hinweis auf ehrenamtliche/kostenlose/Open-Source-Entwicklung
- DRK-Arbeit kurz beschreiben
- Spenden-Optionen: Online (Link), Überweisung (Bankverbindung), Fördermitgliedschaft
- Optional: QR-Code

### Header: Spenden-Icon

Das Template verlangt ein **Heart-SVG-Icon** im Header links neben dem Hilfe-Icon, das auf `/spenden` verlinkt. Aktuell zeigt der Header nur das Hilfe-Icon.

### CLAUDE.md

Das Template erwartet eine `CLAUDE.md` im Projekt-Root. In Auskunft existiert keine `CLAUDE.md`. Das Template selbst dient als Referenz, aber jede App sollte eine eigene (ggf. angepasste) Version haben.

### lib/i18n.ts — Zweisprachigkeit (DE/EN)

Laut Template soll jede App DE und EN unterstützen:
- `lib/i18n.ts` mit Übersetzungs-Keys
- Sprachumschaltung (Button DE | EN)
- Alle sichtbaren Texte über i18n-Keys

In Auskunft gibt es **keine i18n-Unterstützung**. Alle Texte sind Hardcoded auf Deutsch.

### lib/types.ts

Das Template sieht eine zentrale `lib/types.ts` vor. In Auskunft sind Types in `lib/questions.ts` und `lib/report.ts` direkt definiert (nicht in einer separaten Datei).

### CSS-Klassen aus dem Design-System

Folgende Template-Klassen fehlen in `globals.css`:
- `.drk-card` — Box-Karten (stattdessen JS-Objekt in `lib/styles.ts`)
- `.drk-btn-primary` — Primärer Button
- `.drk-btn-secondary` — Sekundärer Button
- `.drk-label` — Formular-Labels
- `.drk-input` — Formular-Inputs

Auskunft nutzt stattdessen Inline-Styles und direkte Tailwind-Klassen. Funktioniert, folgt aber nicht dem Template-Ansatz mit wiederverwendbaren CSS-Klassen.

### LICENSE-Datei

Das Template enthält eine `LICENSE`-Datei (MIT). In Auskunft fehlt diese Datei, obwohl die README "MIT" als Lizenz nennt.

### .gitattributes

Das Template enthält eine `.gitattributes`-Datei. In Auskunft fehlt diese.

### DSGVO-Checkliste — offene Punkte

- [ ] Keine externen Requests — **Teilweise**: Die Hilfe-Seite verlinkt extern auf GitHub (`target="_blank"`), und die Feedback-API sendet Daten an den eigenen Server. Keine Third-Party-Requests, aber Server-Kommunikation vorhanden.
- [ ] Keine Datenbank wo vermeidbar — **Teilweise**: Feedback-System schreibt in Dateien auf dem Server (`/data/drk-feedback/`). Vertretbar, da opt-in und nur auf der eigenen Instanz.
- [ ] `/spenden` vorhanden — **FEHLT**

---

## Zusammenfassung

| Kategorie | Status |
|---|---|
| Tech-Stack | Vollständig konform |
| Deployment | Konform (kleine Dockerfile-Abweichung) |
| Projektstruktur | Weitgehend konform |
| Design-System (Farben) | Abweichende Werte, fehlende Variablen |
| Design-System (Klassen) | `.drk-card`, `.drk-btn-*`, `.drk-label`, `.drk-input` fehlen |
| Header | Padding/Schriftgrößen leicht abweichend, Spenden-Icon fehlt |
| Footer | Spenden-Link fehlt |
| Pflichtseiten | `/spenden` fehlt |
| i18n (DE/EN) | Komplett fehlend |
| CLAUDE.md | Fehlt |
| LICENSE | Fehlt |
| .gitattributes | Fehlt |
| lib/types.ts | Fehlt (Types inline in anderen Dateien) |
| Code-Konventionen | Konform |
| README.md | Konform |
| DSGVO | Weitgehend konform |
| UX-Prinzipien | Konform |

### Prioritäten für Alignment

1. **Hoch:** `/spenden`-Seite erstellen + Header/Footer-Links ergänzen
2. **Hoch:** `CLAUDE.md` erstellen
3. **Hoch:** `LICENSE` (MIT) hinzufügen
4. **Mittel:** CSS-Variablen an Template angleichen (Farben + fehlende Variablen)
5. **Mittel:** Design-System CSS-Klassen (`.drk-card`, `.drk-btn-*` etc.) in globals.css
6. **Mittel:** Header-Padding und Schriftgrößen an Template angleichen
7. **Niedrig:** Dockerfile auf 3-Stage Build umstellen
8. **Niedrig:** `lib/types.ts` extrahieren
9. **Niedrig:** `.gitattributes` hinzufügen
10. **Langfristig:** i18n-Support (DE/EN) implementieren
