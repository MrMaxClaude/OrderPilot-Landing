import type { CollectionEntry } from 'astro:content';

export function buildArticleSchema(opts: {
  entry: CollectionEntry<'kb'>;
  siteOrigin: string;
  canonicalUrl: string;
}): Record<string, unknown> {
  const { entry, siteOrigin, canonicalUrl } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.data.title,
    description: entry.data.description,
    author: {
      '@type': 'Organization',
      name: 'OrderPilot',
      url: siteOrigin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OrderPilot',
      url: siteOrigin,
      logo: {
        '@type': 'ImageObject',
        url: `${siteOrigin}/orderpilot-logo.png`,
      },
    },
    datePublished: entry.data.publishedAt.toISOString(),
    dateModified: (entry.data.updatedAt ?? entry.data.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: entry.data.tags.join(', '),
  };
}
