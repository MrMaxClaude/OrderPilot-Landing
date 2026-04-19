import type { CollectionEntry } from 'astro:content';
import { KB_CATEGORIES } from '../content.config';

export type KbCategorySlug = (typeof KB_CATEGORIES)[number]['slug'];

/**
 * Drafts are always hidden on the live site. In dev we keep them visible so
 * authors can preview work-in-progress without toggling the draft flag.
 */
export function filterPublished(
  entries: CollectionEntry<'kb'>[],
): CollectionEntry<'kb'>[] {
  if (import.meta.env.DEV) return entries;
  return entries.filter((e) => !e.data.draft);
}

export function getCategoryLabel(slug: KbCategorySlug): string {
  return KB_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function articleUrl(entry: CollectionEntry<'kb'>): string {
  const slug = articleSlug(entry);
  return `/knowledge-base/${entry.data.category}/${slug}/`;
}

export function articleSlug(entry: CollectionEntry<'kb'>): string {
  return entry.id.replace(/^[^/]+\//, '').replace(/\.(md|mdx)$/i, '');
}

export function sortArticles(
  entries: CollectionEntry<'kb'>[],
): CollectionEntry<'kb'>[] {
  return [...entries].sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}

export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function articlesByCategory(
  entries: CollectionEntry<'kb'>[],
): Map<KbCategorySlug, CollectionEntry<'kb'>[]> {
  const map = new Map<KbCategorySlug, CollectionEntry<'kb'>[]>();
  for (const cat of KB_CATEGORIES) {
    map.set(cat.slug, []);
  }
  for (const entry of entries) {
    const bucket = map.get(entry.data.category as KbCategorySlug);
    if (bucket) bucket.push(entry);
  }
  for (const key of map.keys()) {
    map.set(key, sortArticles(map.get(key)!));
  }
  return map;
}
