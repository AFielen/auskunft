# 🤖 AGENT.md — KI-Assistenten-Schnittstelle

Dieses Dokument beschreibt, wie ein KI-Assistent die DRK Selbstauskunft programmatisch ausfüllen kann.

---

## API-Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/auskunft` | Schema abrufen: alle Fragen, Typen, erlaubte Werte |
| `POST` | `/api/auskunft` | Selbstauskunft einreichen → HTML-Report zurück |

## Schema abrufen

```bash
curl https://deine-instanz.de/api/auskunft
```

Gibt zurück:
- Alle Pflichtfelder mit Beschreibung
- Alle Abschnitte mit Fragen
- Pro Frage: `id`, `text`, `type`, `required`, `conditionalOn`, `allowedValues`

## Report generieren

```bash
curl -X POST https://deine-instanz.de/api/auskunft \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Response:** HTML-Dokument (druckfertiger A4-Report mit DRK-Branding)

---

## Pflichtfelder (JSON-Body)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `name` | string | Vor- und Nachname der erklärenden Person |
| `role` | string | Funktion (z.B. "Kreisgeschäftsführer", "Vorstand", "Prokurist") |
| `gliederung` | string | DRK-Gliederung (z.B. "Kreisverband Städteregion Aachen e.V.") |
| `reportTo` | string | Funktion des Aufsichtsorgans (z.B. "Präsident") |
| `aufsichtName` | string | Name des/der Vorsitzenden des Aufsichtsorgans |
| `geschaeftsjahr` | string | Das Geschäftsjahr (z.B. "2025") |
| `ort` | string | Ort der Erklärung (z.B. "Würselen") |
| `answers` | object | Antworten: `{ fragenId: "ja" \| "nein" \| "teilweise" \| number \| string }` |
| `deviations` | object | Begründungen bei Abweichungen: `{ fragenId: "Erklärungstext" }` (optional) |

---

## Fragen-Übersicht

### 1. Geschäftsführung & Interessenkonflikte

| ID | Typ | Frage |
|----|-----|-------|
| `gf_keine_aenderungen` | confirmation | Vertragsänderungen mit Aufsichtsorgan abgestimmt |
| `gf_keine_interessen` | confirmation | Keine beeinträchtigenden persönlichen Interessen |
| `gf_konflikte_gemeldet` | confirmation | Interessenkonflikte gemeldet |
| `gf_keine_verwandten` | confirmation | Keine verwandten Personen in Gliederung tätig |
| `gf_keine_geschenke_angenommen` | confirmation | Keine Geschenke von Dritten angenommen |
| `gf_keine_geschenke_gewaehrt` | confirmation | Keine Geschenke an Dritte gewährt |

### 2. Sitzungen & Beschlussfassungen

| ID | Typ | Frage |
|----|-----|-------|
| `sitzungen_gesamt` | **number** | Anzahl Sitzungen des Aufsichtsorgans |
| `sitzungen_teilnahme` | **number** | Davon teilgenommen |
| `sitzungen_weitere` | text | Weitere Gremien (optional) |

### 3. Zustimmungspflichtige Rechtsgeschäfte

| ID | Typ | Frage |
|----|-----|-------|
| `rg_grundstuecke` | confirmation | Grundstücke nur mit Zustimmung |
| `rg_darlehen` | confirmation | Darlehen nur mit Zustimmung |
| `rg_darlehen_dritte` | confirmation | Darlehen an Dritte nur mit Zustimmung |
| `rg_buergschaften` | confirmation | Bürgschaften nur mit Zustimmung |
| `rg_beteiligungen` | confirmation | Beteiligungen nur mit Zustimmung |

### 4. Arbeitgeberstellung

| ID | Typ | Bedingung | Frage |
|----|-----|-----------|-------|
| `ag_mindestlohn` | confirmation | | Mindestlohn eingehalten |
| `ag_mutterschutz` | confirmation | | Mutterschutz eingehalten |
| `ag_jugendschutz` | confirmation | | Jugendarbeitsschutz eingehalten |
| `ag_schwerbehinderte` | confirmation | | Schwerbehindertenrecht eingehalten |
| `ag_auslaender` | confirmation | | Beschäftigung Ausländer eingehalten |
| `ag_betriebsrat_existiert` | confirmation | | Betriebsrat vorhanden |
| `ag_br_wahlen` | confirmation | nur wenn `ag_betriebsrat_existiert` = "ja" | BR-Wahlen unbeeinflusst |
| `ag_br_monatsgespraeche` | confirmation | nur wenn `ag_betriebsrat_existiert` = "ja" | Monatsgespräche durchgeführt |
| `ag_br_stoerungsfrei` | confirmation | nur wenn `ag_betriebsrat_existiert` = "ja" | BR-Tätigkeit ungehindert |
| `ag_br_pflichten` | confirmation | nur wenn `ag_betriebsrat_existiert` = "ja" | BetrVG-Pflichten erfüllt |
| `ag_beschlussverfahren` | **number** | | Beschlussverfahren Arbeitsgericht |

### 5. Finanzwesen

| ID | Typ | Frage |
|----|-----|-------|
| `fin_satzungsgemaess` | confirmation | Mittel satzungsgemäß verwendet |
| `fin_haushaltsplan` | confirmation | Haushaltsplan eingehalten |
| `fin_buchfuehrung` | confirmation | Buchführung ordnungsgemäß |
| `fin_vier_augen` | confirmation | Vier-Augen-Prinzip bei >10 TEUR |
| `fin_berichtspflichten` | confirmation | Berichtspflichten eingehalten |
| `fin_controlling` | confirmation | Controlling-Frühwarnsystem vorhanden |
| `fin_versicherung` | confirmation | D&O-Versicherung vorhanden |
| `fin_jahresabschluss` | confirmation | Jahresabschluss geprüft und vorgelegt |

### 6. Revision & Compliance

| ID | Typ | Frage |
|----|-----|-------|
| `rev_pruefung` | confirmation | Revisionsprüfung durchgeführt |
| `rev_hinweisgebersystem` | confirmation | Hinweisgebersystem vorhanden |
| `rev_hinweise_anzahl` | **number** | Anzahl eingegangener Hinweise |

---

## Antwort-Typen

| Typ | Erlaubte Werte | Hinweis |
|-----|----------------|---------|
| `confirmation` | `"ja"`, `"nein"`, `"teilweise"` | Bei "nein"/"teilweise" → Begründung in `deviations` empfohlen |
| `number` | Ganzzahl ≥ 0 | z.B. Sitzungsanzahl |
| `text` | Freitext | z.B. weitere Gremien |

## Bedingte Felder

Fragen mit `conditionalOn` werden nur ausgewertet, wenn die referenzierte Frage den angegebenen Wert hat. Beispiel: Die Betriebsrats-Fragen (`ag_br_*`) werden nur relevant wenn `ag_betriebsrat_existiert` = `"ja"`.

---

## Beispiel: Alles in Ordnung

```json
{
  "name": "Axel Fielen",
  "role": "Kreisgeschäftsführer",
  "gliederung": "DRK Kreisverband Städteregion Aachen e.V.",
  "reportTo": "Präsident",
  "aufsichtName": "Dr. Max Mustermann",
  "geschaeftsjahr": "2025",
  "ort": "Würselen",
  "answers": {
    "gf_keine_aenderungen": "ja",
    "gf_keine_interessen": "ja",
    "gf_konflikte_gemeldet": "ja",
    "gf_keine_verwandten": "ja",
    "gf_keine_geschenke_angenommen": "ja",
    "gf_keine_geschenke_gewaehrt": "ja",
    "sitzungen_gesamt": 12,
    "sitzungen_teilnahme": 12,
    "rg_grundstuecke": "ja",
    "rg_darlehen": "ja",
    "rg_darlehen_dritte": "ja",
    "rg_buergschaften": "ja",
    "rg_beteiligungen": "ja",
    "ag_mindestlohn": "ja",
    "ag_mutterschutz": "ja",
    "ag_jugendschutz": "ja",
    "ag_schwerbehinderte": "ja",
    "ag_auslaender": "ja",
    "ag_betriebsrat_existiert": "ja",
    "ag_br_wahlen": "ja",
    "ag_br_monatsgespraeche": "ja",
    "ag_br_stoerungsfrei": "ja",
    "ag_br_pflichten": "ja",
    "ag_beschlussverfahren": 0,
    "fin_satzungsgemaess": "ja",
    "fin_haushaltsplan": "ja",
    "fin_buchfuehrung": "ja",
    "fin_vier_augen": "ja",
    "fin_berichtspflichten": "ja",
    "fin_controlling": "ja",
    "fin_versicherung": "ja",
    "fin_jahresabschluss": "ja",
    "rev_pruefung": "ja",
    "rev_hinweisgebersystem": "ja",
    "rev_hinweise_anzahl": 0
  },
  "deviations": {}
}
```

## Beispiel: Mit Abweichung

```json
{
  "...": "...",
  "answers": {
    "gf_keine_verwandten": "teilweise",
    "...": "..."
  },
  "deviations": {
    "gf_keine_verwandten": "Ehepartner ist ehrenamtlich im Ortsverein Würselen als Sanitätshelfer tätig. Dem Aufsichtsorgan bekannt und genehmigt."
  }
}
```

---

## Tipps für KI-Assistenten

1. **"Alles nach Plan"** = Alle confirmation-Fragen auf `"ja"`, alle number-Fragen auf `0` (außer Sitzungen)
2. **Sitzungen immer nachfragen** — diese Zahlen sind jedes Jahr anders
3. **Betriebsrat-Fragen** nur stellen wenn `ag_betriebsrat_existiert` = `"ja"`
4. **Fragen clustern** statt einzeln stellen — spart Roundtrips
5. **Begründungen** bei Abweichungen sollten konkret und nachvollziehbar sein
