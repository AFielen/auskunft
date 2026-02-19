# 📝 Feedback-System Setup

## 1. App starten

```bash
cd /data/.openclaw/workspace/auskunft
docker compose up -d --build
```

Die App läuft dann auf **http://localhost:3333** (im Container gemappt auf Port 3000).

## 2. Instanz-ID abrufen

1. Öffne im Browser: `http://localhost:3333/hilfe`
2. Scrolle ganz nach unten zur Sektion "Feedback & Support"
3. Kopiere die **Instanz-ID** (sieht aus wie: `abc-123-def-456-...`)

## 3. Instanz-ID konfigurieren

Erstelle eine `.env` Datei im Projekt-Root:

```bash
cd /data/.openclaw/workspace/auskunft
echo "DRK_INSTANCE_ID=DEINE-INSTANZ-ID-HIER" > .env
```

**Wichtig:** Ersetze `DEINE-INSTANZ-ID-HIER` mit der kopierten ID!

## 4. Container neu starten

```bash
docker compose down
docker compose up -d
```

## 5. Testen

1. Öffne `/hilfe`
2. Fülle das Feedback-Formular aus
3. Klicke "Feedback senden"
4. Checke, ob das Feedback gespeichert wurde:

```bash
ls -lt /data/drk-feedback/
```

Du solltest eine JSON-Datei sehen: `1737273600_abc12345.json`

## 6. Henry (Agent) benachrichtigen

Henry kann periodisch (2x täglich via Heartbeat) nach neuem Feedback schauen und dich benachrichtigen.

**Manueller Check (als Henry):**

```bash
ls -lt /data/drk-feedback/*.json | head -5
cat /data/drk-feedback/DATEINAME.json
```

## Troubleshooting

**Problem:** Feedback wird nicht gespeichert

**Lösung:**
1. Checke, ob die Instanz-ID korrekt in `.env` steht
2. Prüfe Docker-Logs: `docker logs drk-selbstauskunft`
3. Stelle sicher, dass `/data/drk-feedback` existiert und beschreibbar ist

**Problem:** "Permission denied" beim Schreiben

**Lösung:**
```bash
sudo chown -R node:node /data/drk-feedback
sudo chmod 755 /data/drk-feedback
```

---

**Fertig!** 🎉

Jetzt kannst du (oder Nutzer deiner Instanz) Feedback direkt aus der App senden, und Henry wird dich informieren, wenn etwas Neues da ist.
