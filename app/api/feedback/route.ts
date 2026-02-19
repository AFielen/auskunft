import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Feedback-API mit Privacy-by-Design
 * Nur Feedback von der konfigurierten Instanz-ID wird gespeichert
 */

// Diese ID wird vom Agent in TOOLS.md gepflegt
const ALLOWED_INSTANCE_ID = process.env.DRK_INSTANCE_ID || '';

const FEEDBACK_DIR = '/data/drk-feedback';

interface FeedbackPayload {
  instanceId: string;
  type: 'bug' | 'feature' | 'question' | 'other';
  message: string;
  userAgent?: string;
  timestamp: number;
}

export async function POST(req: NextRequest) {
  try {
    const payload: FeedbackPayload = await req.json();

    // Validierung
    if (!payload.instanceId || !payload.message || !payload.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Privacy-Check: Nur erlaubte Instanz speichern
    const isAllowed = ALLOWED_INSTANCE_ID && payload.instanceId === ALLOWED_INSTANCE_ID;

    if (isAllowed) {
      // Feedback-Dir erstellen, falls nicht vorhanden
      if (!existsSync(FEEDBACK_DIR)) {
        await mkdir(FEEDBACK_DIR, { recursive: true });
      }

      // Dateiname: timestamp_instanceId.json
      const filename = `${payload.timestamp}_${payload.instanceId.slice(0, 8)}.json`;
      const filepath = join(FEEDBACK_DIR, filename);

      await writeFile(filepath, JSON.stringify(payload, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Feedback gespeichert. Vielen Dank!'
      });
    } else {
      // Fremde Instanz: 200 OK, aber nichts speichern
      return NextResponse.json({
        success: true,
        message: 'Feedback erhalten. Vielen Dank!'
      });
    }
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
