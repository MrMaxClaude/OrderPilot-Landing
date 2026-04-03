export const CONSENT_STORAGE_KEY = 'orderpilot-cookie-consent';

export type StoredConsent = {
  analytics: boolean;
  updatedAt: string;
};

export function getStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (typeof parsed.analytics !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): StoredConsent {
  const value: StoredConsent = {
    analytics,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  return value;
}

export const OPEN_COOKIE_CONSENT_EVENT = 'orderpilot:open-cookie-consent';

export function requestOpenCookieConsent(): void {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_CONSENT_EVENT));
}
