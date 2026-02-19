/**
 * Instanz-ID Management
 * Generiert eine eindeutige ID beim ersten Laden und speichert sie in localStorage
 */

// Fallback UUID-Generator für ältere Browser
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback für ältere Browser
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateInstanceId(): string {
  if (typeof window === 'undefined') return '';
  
  const key = 'drk_instance_id';
  let id = localStorage.getItem(key);
  
  if (!id) {
    id = generateUUID();
    localStorage.setItem(key, id);
  }
  
  return id;
}

export function getInstanceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('drk_instance_id');
}
