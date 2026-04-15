/**
 * GA4 Measurement Protocol helper — shared by all API routes.
 * Requires GA_API_SECRET env var (GA4 → Admin → Data Streams → Measurement Protocol → API secrets).
 * Awaited with an 800ms timeout so the event completes before the serverless function exits.
 */

const GA_MEASUREMENT_ID = process.env.PUBLIC_GA_MEASUREMENT_ID;

export async function sendGa4Event(clientId, eventName, params = {}) {
  const apiSecret = process.env.GA_API_SECRET;
  if (!GA_MEASUREMENT_ID) { console.warn('[ga4] skipped: PUBLIC_GA_MEASUREMENT_ID not set'); return; }
  if (!apiSecret) { console.warn('[ga4] skipped: GA_API_SECRET not set'); return; }
  if (!clientId) { console.warn('[ga4] skipped: clientId missing'); return; }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`;
  const body = JSON.stringify({ client_id: clientId, events: [{ name: eventName, params }] });
  console.log(`[ga4] sending ${eventName} for client ${clientId}`, params);

  try {
    const res = await fetch(url, { method: 'POST', body, signal: AbortSignal.timeout(800) });
    console.log(`[ga4] ${eventName} → HTTP ${res.status}`);
  } catch (err) {
    console.error(`[ga4] ${eventName} failed:`, err?.message ?? err);
  }
}
