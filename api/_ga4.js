/**
 * GA4 Measurement Protocol helper — shared by all API routes.
 * Requires GA_API_SECRET env var (GA4 → Admin → Data Streams → Measurement Protocol → API secrets).
 * Awaited with an 800ms timeout so the event completes before the serverless function exits.
 */

const GA_MEASUREMENT_ID = process.env.PUBLIC_GA_MEASUREMENT_ID;

export async function sendGa4Event(clientId, eventName, params = {}) {
  const apiSecret = process.env.GA_API_SECRET;
  if (!GA_MEASUREMENT_ID || !apiSecret || !clientId) return;
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: 'POST',
        body: JSON.stringify({ client_id: clientId, events: [{ name: eventName, params }] }),
        signal: AbortSignal.timeout(800),
      }
    );
  } catch {
    // ignore — never fail the main request on analytics errors
  }
}
