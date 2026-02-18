import LZString from "lz-string";
import { sections } from "@/lib/questions";

export interface AuskunftState {
  name: string;
  role: string;
  gliederung: string;
  reportTo: string;
  aufsichtName: string;
  geschaeftsjahr: string;
  ort: string;
  answers: Record<string, string | number | undefined>;
  deviations: Record<string, string>;
}

/**
 * Encode the full form state into a URL-safe compressed string.
 */
export function encodeState(state: AuskunftState): string {
  const json = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decode a compressed state string back into the form state.
 * Gracefully handles schema changes: unknown question IDs are dropped,
 * new questions simply remain unanswered.
 * Returns null only if the data is completely corrupt.
 */
export function decodeState(encoded: string): AuskunftState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);

    // Basic shape check — person fields must exist
    if (typeof parsed.name !== "string") return null;

    // Build set of currently valid question IDs
    const validIds = new Set<string>();
    for (const sec of sections) {
      for (const q of sec.questions) {
        validIds.add(q.id);
      }
    }

    // Filter answers: keep only IDs that still exist in the current schema
    const cleanAnswers: Record<string, string | number | undefined> = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [id, val] of Object.entries(parsed.answers)) {
        if (validIds.has(id)) {
          cleanAnswers[id] = val as string | number | undefined;
        }
      }
    }

    // Filter deviations the same way
    const cleanDeviations: Record<string, string> = {};
    if (parsed.deviations && typeof parsed.deviations === "object") {
      for (const [id, val] of Object.entries(parsed.deviations)) {
        if (validIds.has(id) && typeof val === "string") {
          cleanDeviations[id] = val;
        }
      }
    }

    return {
      name: String(parsed.name || ""),
      role: String(parsed.role || ""),
      gliederung: String(parsed.gliederung || ""),
      reportTo: String(parsed.reportTo || ""),
      aufsichtName: String(parsed.aufsichtName || ""),
      geschaeftsjahr: String(parsed.geschaeftsjahr || ""),
      ort: String(parsed.ort || ""),
      answers: cleanAnswers,
      deviations: cleanDeviations,
    };
  } catch {
    return null;
  }
}
