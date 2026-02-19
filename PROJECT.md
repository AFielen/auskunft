---
project: DRK Selbstauskunft
type: web-app
status: active
updated: 2026-02-19
---

# DRK Selbstauskunft

Digitale Compliance-Erklärung für Vorstände, Geschäftsführer und Prokuristen im Deutschen Roten Kreuz.

## What It Does

- Guided wizard with 36 questions across 6 compliance sections
- Generates PDF reports with QR codes for next-year pre-fill
- Privacy-first: No database, all data in browser localStorage
- Feedback system for continuous improvement
- REST API for AI assistant integration

## Quick Links

- **Live:** (wird noch konfiguriert - läuft auf VPS)
- **Repo:** https://github.com/AFielen/auskunft/
- **Local Dev:** http://localhost:3333

---

## Tech Stack

### Frontend
- Framework: Next.js 16 (App Router)
- Language: TypeScript 5.3
- Styling: Tailwind CSS 4
- State Management: React useState + localStorage

### Backend
- Runtime: Node 22
- Framework: Next.js API Routes
- Database: None (by design - privacy-first)
- File Storage: `/data/drk-feedback/` (VPS host)

### Infrastructure
- Hosting: Docker on Hostinger VPS
- Deployment: Manual via git pull + docker compose rebuild
- Monitoring: None yet

### Development
- Package Manager: npm
- Bundler: Next.js (Turbopack in dev)
- Testing: None yet

---

## Architecture

### Directory Structure

```
auskunft/
├── app/
│   ├── page.tsx              # Homepage + person setup
│   ├── wizard/page.tsx       # Main wizard + PDF report
│   ├── hilfe/page.tsx        # Help page + feedback form
│   ├── api/
│   │   ├── auskunft/route.ts # AI agent API
│   │   └── feedback/route.ts # Feedback submission
│   ├── impressum/            # Legal pages
│   └── datenschutz/
├── lib/
│   ├── questions.ts          # Question data + sections
│   ├── report.ts             # PDF HTML generation
│   ├── state-codec.ts        # QR code compression (lz-string)
│   ├── qr-svg.ts             # QR code SVG generation
│   ├── instance.ts           # Instanz-ID management
│   └── version.ts            # Versioning
├── components/               # Reusable UI (minimal)
├── public/                   # Logo, favicon
└── Dockerfile + docker-compose.yml
```

### Key Patterns

- **Data Flow:** All state in React (useState) → localStorage persistence → PDF export
- **Privacy:** No server-side data storage except opt-in feedback with instance ID
- **QR Codes:** Compress entire form state into QR → scan to pre-fill next year
- **AI Integration:** REST API (`/api/auskunft`) for agent-driven completion

### Important Locations

- Question definitions: `lib/questions.ts`
- PDF template: `lib/report.ts` (HTML string generation)
- Feedback API: `app/api/feedback/route.ts` (filters by instance ID)
- Help page: `app/hilfe/page.tsx` (DRK context + FAQ)

---

## Architecture Decisions

### No Database / Privacy-First

- **Date:** 2025-02-18
- **Context:** DRK needs compliance tool but DSGVO is critical
- **Options:**
  1. Store in database (PostgreSQL, Supabase)
  2. Client-only (localStorage)
- **Decision:** Client-only storage
- **Rationale:**
  - No personal data leaves the device
  - No DSGVO concerns
  - Simpler deployment (no DB to manage)
- **Trade-offs:**
  - Can't pre-fill from previous year without QR code
  - No analytics on usage
  - No multi-device sync
- **Files:** All client-side logic in `app/wizard/page.tsx`

### QR Code as "Offline Database"

- **Date:** 2025-02-18
- **Context:** Users want to save time next year by reusing answers
- **Options:**
  1. Account system with cloud storage
  2. QR code with compressed state
  3. Just make them re-enter everything
- **Decision:** QR code compression
- **Rationale:**
  - No accounts → privacy preserved
  - Works offline
  - PDF becomes the "database"
- **Trade-offs:**
  - QR codes can be large (1000+ chars compressed)
  - If PDF is lost, answers are lost
- **Files:** `lib/state-codec.ts`, `lib/qr-svg.ts`

### Feedback System with Instance ID

- **Date:** 2025-02-19
- **Context:** Need user feedback but can't track individuals
- **Options:**
  1. Public form (spam risk)
  2. Email-only (friction)
  3. Instance-ID filtering (privacy + control)
- **Decision:** Instance-ID based privacy filter
- **Rationale:**
  - Only configured instance (mine) stores feedback
  - Other instances get 200 OK but data discarded
  - Users can self-host without worrying about data leaks
- **Trade-offs:**
  - More complex setup (need to configure ID)
  - Can't aggregate feedback across all instances
- **Files:** `app/api/feedback/route.ts`, `lib/instance.ts`

### Hilfe-Seite: App-Designsystem statt Prose

- **Date:** 2026-02-19
- **Context:** Hilfe-Seite nutzte `prose` Tailwind-Typography — sah aus wie Wikipedia, nicht wie die App
- **Options:**
  1. prose beibehalten, nur Farben anpassen
  2. Komplett ins App-Designsystem umbauen
- **Decision:** Kompletter Umbau
- **Rationale:**
  - Konsistente UX über alle Seiten
  - Hero, Cards, Accordion, Feature-Grid bereits vorhanden — nur wiederverwenden
  - FAQ als Accordion spart Platz und ist interaktiver
  - Feedback-Formular mit Pill-Buttons statt Select passt zum Rollen-Selector
- **Files:** `app/hilfe/page.tsx`

### Server-Side PDF Generation Avoided

- **Date:** 2025-02-18
- **Context:** Generate PDF reports
- **Options:**
  1. Puppeteer server-side
  2. Client-side HTML → Print
- **Decision:** Client-side (browser print)
- **Rationale:**
  - Simpler deployment (no headless Chrome)
  - Lower server resource usage
  - Works offline
- **Trade-offs:**
  - User must "Print to PDF" manually (minor friction)
  - Inconsistent output across browsers (minor)
- **Files:** `lib/report.ts` generates HTML, browser handles PDF

---

## Current State

### Done (2026-02-19)

- [x] QR-Code im PDF-Report mit komprimiertem Formular-State (lz-string + qrcode)
- [x] State-Wiederherstellung: QR-Code scannen → `?state=` URL → Startseite füllt alle Felder vor
- [x] State-Codec mit Graceful Degradation: bei geänderten Fragen werden unbekannte IDs ignoriert, neue Fragen bleiben leer
- [x] Grünes Banner "Daten aus QR-Code wiederhergestellt" auf der Startseite
- [x] Hilfe-Seite komplett ins App-Designsystem umgebaut (Hero, Cards, FAQ-Accordion, Feature-Grid, Pill-Buttons, Fade-up-Animationen)

### In Progress

- [ ] Deployment auf HTTPS (Domain + SSL)

### Planned

- AI agent integration test (Henry checks feedback via heartbeat)
- Markdown-to-HTML für Begründungsfelder (bessere PDF-Formatierung)
- Dark Mode
- Export as JSON (for power users)

### Known Issues

- **QR Codes können groß werden:** Bei vielen Begründungen (>500 Zeichen pro Feld) kann der QR Code schwer scannbar werden
  - Workaround: Begründungen kurz halten
  - Mögliche Lösung: QR-Fehlerkorrektur runtersetzen (L statt H)

- **Mobile Safari localStorage:** Inkognito-Modus löscht localStorage beim Tab-Close
  - Bekanntes Browser-Verhalten, keine Lösung
  - User-Hinweis: Nicht im Inkognito-Modus verwenden

---

## Setup & Deployment

### Local Development

```bash
git clone https://github.com/AFielen/auskunft.git
cd auskunft
npm install
npm run dev
```

**No environment variables needed** (privacy-first = no external services).

### Deployment (VPS)

```bash
# On the server
cd /opt/auskunft
git pull
docker compose up -d --build
```

**Port:** 3333 (mapped to container port 3000)

### Feedback System Setup

1. Visit `/hilfe` on your instance
2. Copy the Instanz-ID (at bottom of page)
3. Create `.env` in project root:
   ```
   DRK_INSTANCE_ID=78842d30-3f6e-4594-b6ce-17f8b80b354a
   ```
4. Restart container: `docker compose down && docker compose up -d`
5. Feedback is stored in `/data/drk-feedback/` on host

**Henry (AI agent) checks for feedback 2x daily via heartbeat.**

---

## Notes & Context

- **Icons:** Inline SVG (no icon library to save bundle size)
- **Fonts:** System fonts (-apple-system, Segoe UI) for speed
- **DRK Colors:** `--drk: #e30613` (defined in `globals.css`)
- **No Analytics:** Intentional - privacy-first design
- **API for Agents:** See `API-INTEGRATION.md` in repo (separate doc for AI REST API)
- **Project Context:** This file (PROJECT.md) - for human/AI developers
- **Presentation:** Introduced at DRK Landesversammlung 2025-04-09
- **Target Users:** ~200 DRK Kreisverbände in NRW

---

_Last updated: 2026-02-19 by Claude (AI)_
