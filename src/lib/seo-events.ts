/**
 * Browser-side SEO monitoring events.
 *
 * PostHog's autocapture already tracks $pageview with the referrer, but those
 * events are noisy for SEO reporting — they fire for every navigation, every
 * internal click, every tab switch. This module adds a single normalised
 * seo_pageview event per page load with pre-classified properties so editors
 * can build SEO dashboards without touching SQL.
 */

import posthog from 'posthog-js';

type OrganicSource =
  | 'google'
  | 'bing'
  | 'duckduckgo'
  | 'yahoo'
  | 'yandex'
  | 'brave'
  | 'ecosia'
  | 'other-search'
  | 'direct'
  | 'internal'
  | 'social'
  | 'other';

const ORGANIC_HOSTS: Array<{ match: RegExp; source: OrganicSource }> = [
  { match: /(^|\.)google\./i, source: 'google' },
  { match: /(^|\.)bing\./i, source: 'bing' },
  { match: /(^|\.)duckduckgo\./i, source: 'duckduckgo' },
  { match: /(^|\.)yahoo\./i, source: 'yahoo' },
  { match: /(^|\.)yandex\./i, source: 'yandex' },
  { match: /(^|\.)search\.brave\./i, source: 'brave' },
  { match: /(^|\.)ecosia\./i, source: 'ecosia' },
];

const SOCIAL_HOSTS = [
  'linkedin.com',
  'twitter.com',
  'x.com',
  't.co',
  'facebook.com',
  'instagram.com',
  'reddit.com',
  'ycombinator.com',
  'news.ycombinator.com',
];

function classifyReferrer(referrer: string, currentHost: string): {
  source: OrganicSource;
  isOrganic: boolean;
  refHost: string;
} {
  if (!referrer) return { source: 'direct', isOrganic: false, refHost: '' };
  let refHost = '';
  try {
    refHost = new URL(referrer).hostname.toLowerCase();
  } catch {
    return { source: 'other', isOrganic: false, refHost: '' };
  }
  if (refHost === currentHost) {
    return { source: 'internal', isOrganic: false, refHost };
  }
  for (const { match, source } of ORGANIC_HOSTS) {
    if (match.test(refHost)) {
      return { source, isOrganic: true, refHost };
    }
  }
  if (/search/i.test(refHost)) {
    return { source: 'other-search', isOrganic: true, refHost };
  }
  if (SOCIAL_HOSTS.some((h) => refHost === h || refHost.endsWith('.' + h))) {
    return { source: 'social', isOrganic: false, refHost };
  }
  return { source: 'other', isOrganic: false, refHost };
}

/** Category buckets useful for dashboard grouping. */
function classifyPath(path: string): string {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/knowledge-base/')) return path === '/knowledge-base/' ? 'kb-hub' : 'kb-article-or-category';
  if (path.startsWith('/cases')) return 'cases';
  if (path.startsWith('/pricing')) return 'pricing';
  if (path.startsWith('/calculator')) return 'calculator';
  if (path.startsWith('/pdf-demo')) return 'pdf-demo';
  if (path.startsWith('/privacy')) return 'privacy';
  if (path.startsWith('/purchase-order-automation') || path.startsWith('/po-processing-software')) {
    return 'industry-landing';
  }
  return 'other';
}

function readUtmParams(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(search);
    for (const [k, v] of params.entries()) {
      if (k.startsWith('utm_')) out[k] = v;
    }
  } catch {
    // ignore
  }
  return out;
}

export function fireSeoPageview(): void {
  const path = window.location.pathname;
  const host = window.location.hostname;
  const { source, isOrganic, refHost } = classifyReferrer(document.referrer, host);
  const utms = readUtmParams(window.location.search);
  try {
    posthog.capture('seo_pageview', {
      path,
      category: classifyPath(path),
      referrer_source: source,
      referrer_host: refHost || '(none)',
      is_organic: isOrganic,
      ...utms,
    });
    if (isOrganic) {
      posthog.capture('seo_organic_visit', {
        path,
        referrer_source: source,
        referrer_host: refHost,
      });
    }
  } catch {
    // PostHog init may still be pending — deferred loader will pick up next page
  }
}
