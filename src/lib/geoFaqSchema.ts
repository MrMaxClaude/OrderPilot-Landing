/**
 * Helpers for FAQPage JSON-LD (GEO / structured data).
 */

export type FaqPair = { name: string; text: string };

export function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildFaqPageSchema(opts: {
  description?: string;
  mainEntity: FaqPair[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(opts.description ? { description: opts.description } : {}),
    mainEntity: opts.mainEntity.map((pair) => ({
      '@type': 'Question',
      name: pair.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: pair.text,
      },
    })),
  };
}
