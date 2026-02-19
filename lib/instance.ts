/**
 * Instanz-ID Management
 * Generiert eine eindeutige ID beim ersten Laden und speichert sie in localStorage
 */

export function getOrCreateInstanceId(): string {
  if (typeof window === 'undefined') return '';
  
  const key = 'drk_instance_id';
  let id = localStorage.getItem(key);
  
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  
  return id;
}

export function getInstanceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('drk_instance_id');
}
