export function getGaClientId(): string | undefined {
  const value = document.cookie
    .split('; ')
    .find(r => r.startsWith('_ga='))
    ?.split('=')[1];
  if (!value) return undefined;
  const parts = value.split('.');
  if (parts.length < 2) return undefined;
  return parts.slice(-2).join('.');
}

export type GtagFn = (...args: unknown[]) => void;
