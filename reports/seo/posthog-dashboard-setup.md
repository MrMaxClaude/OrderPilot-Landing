# SEO monitoring — PostHog dashboard + Google Search Console setup

**Last updated:** 2026-04-19
**Prerequisite:** `PUBLIC_POSTHOG_KEY` is set in Vercel (project key `phc_*`, NOT the personal `phx_*` admin key).

OrderPilot emits a handful of structured events specifically for SEO reporting. This doc explains which events fire, when, and how to stitch them into a PostHog dashboard + couple them with Google Search Console.

---

## 1 · Events emitted by the site

### `seo_pageview` — fires on every page load
Properties:
- `path` — e.g. `/pricing/`, `/knowledge-base/getting-started/quickstart/`
- `category` — `home`, `pricing`, `calculator`, `cases`, `pdf-demo`, `privacy`, `kb-hub`, `kb-article-or-category`, `industry-landing`, `other`
- `referrer_source` — classified referrer: `google`, `bing`, `duckduckgo`, `yahoo`, `yandex`, `brave`, `ecosia`, `other-search`, `social`, `internal`, `direct`, `other`
- `referrer_host` — raw referrer hostname or `(none)`
- `is_organic` — boolean; true for known search engines
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` — echoed from URL when present

### `seo_organic_visit` — fires when `is_organic` is true
Same shape, smaller. Handy for building a "search referrals only" dashboard without filter overhead.

### `page_not_found` — fires on the branded 404 page
Properties: `path`, `referrer`.

### Knowledge-base events (already shipped in Fase 3)
- `kb_article_viewed`, `kb_article_scroll_depth` (25/50/75/100), `kb_article_read`, `kb_article_time_on_page`, `kb_article_code_copied`, `kb_article_feedback`, `kb_article_no_vote`
- `kb_search`, `kb_search_result_click`

### Form conversion events
- `inquiry_form_completed` (DemoForm), `hero_cta_clicked`, `calculator_completed`, `pdf_report_generated`

Full event shape lives in `src/lib/seo-events.ts` and `src/components/astro/KbArticleAnalytics.astro`.

---

## 2 · Building the dashboard in PostHog

Open PostHog → **Dashboards** → **New dashboard** → name it "OrderPilot SEO".

Add these seven insights, in this order:

### Panel 1 — Organic traffic by search engine (line chart)
- Insight type: **Trends**
- Event: `seo_organic_visit`
- Breakdown by: `referrer_source`
- Interval: daily, last 30 days
- Display: line chart

### Panel 2 — Top landing pages for organic traffic (bar)
- Insight: Trends
- Event: `seo_organic_visit`
- Breakdown by: `path`
- Top 10, last 30 days, bar chart

### Panel 3 — Pageviews by category (stacked area)
- Insight: Trends
- Event: `seo_pageview`
- Breakdown: `category`
- Last 30 days, stacked area

### Panel 4 — 404s hit in the last 30 days (table)
- Insight: Trends
- Event: `page_not_found`
- Breakdown: `path`
- Display: table
- Action: investigate any `path` with >5 hits — usually broken inbound link.

### Panel 5 — KB article funnel (funnel)
- Insight: **Funnels**
- Steps: `kb_article_viewed` → `kb_article_scroll_depth` (filter `percent = 75`) → `kb_article_read` → `kb_article_feedback`
- Breakdown: `article_slug`
- Flags articles with high view-to-read drop-offs.

### Panel 6 — KB search activity (trends + table)
- Event: `kb_search`
- Breakdown: `query`
- Add a second insight: click-through rate = `kb_search_result_click` / `kb_search`
- Queries with zero clicks = content gap signal.

### Panel 7 — Helpful rate per article (table)
- Event: `kb_article_feedback`
- Breakdown: `article_slug`
- Property filter `rating = yes` for helpful-count, duplicate with `rating = no` for unhelpful-count
- Compute `yes / (yes + no)` per article manually or via SQL.

---

## 3 · PostHog alerts (optional but high-value)

Under each insight → **Subscribe** → weekly digest to `info@order-pilot.ai`.

Specific alerts worth wiring:
- **"404 spike"** — alert when `page_not_found` count week-over-week doubles
- **"Organic drop"** — alert when `seo_organic_visit` 7-day rolling average drops > 20 %
- **"Helpful rate drop"** — alert on any article where yes-rate < 50 % with ≥ 10 votes

---

## 4 · Google Search Console coupling (manual steps for Eros)

PostHog does NOT pull GSC data automatically. The two systems stay separate; we cross-reference manually during the weekly SEO review.

### Step-by-step

1. **Add the property.** Go to <https://search.google.com/search-console>, click **Add property**, pick **URL prefix**, enter `https://www.order-pilot.ai` (www host, which is what the site redirects to). Also add `https://order-pilot.ai` as a separate property if you want to track non-www indexation separately.

2. **Verify ownership.** The simplest path for OrderPilot: **HTML tag** method.
   - GSC gives you a `<meta name="google-site-verification" content="...">` tag.
   - Paste the `content` value into Vercel → Project Settings → Environment Variables as `PUBLIC_GOOGLE_SITE_VERIFICATION`.
   - Ask spark (that's me) to wire the meta tag into `BaseLayout.astro` behind a conditional (30-second change). Alternatively use the DNS TXT record method if you don't want any code change.

3. **Submit the sitemap.** In GSC → **Sitemaps** → add `https://www.order-pilot.ai/sitemap-index.xml`. The build already generates this; it currently lists 26+ URLs.

4. **Wait 48–72 hours** for the initial crawl, then check **Pages** for indexation status. Any URL flagged as "Discovered – currently not indexed" is usually a content-quality or internal-linking issue; audit those first.

5. **Weekly loop:**
   - Look at **Performance** → top queries. Export CSV.
   - Pair each high-impression-low-CTR query with the landing page in PostHog Panel 2 (organic landing pages).
   - If the page has traffic but low CTR in GSC: meta title/description needs work.
   - If the page has GSC impressions but zero PostHog pageviews: the click-through is blocked by something (consent denial, bot filter) — investigate.

### Optional: GA4 ↔ GSC linking

GA4 already has a built-in Search Console link. If you also want GA4-side organic reporting:
- GA4 → Admin → Property settings → Product links → Search Console links → Link.
- This brings GSC queries into GA4 reports without any code change.

### Not recommended: API polling

You could build a scheduled job that pulls GSC data via the Search Console API and pushes custom events to PostHog. I don't recommend it right now — GSC's natural weekly cadence matches the SEO review rhythm, and the API adds credential + cost overhead for data you'll look at manually anyway. Revisit this in 6 months if the weekly manual cross-reference becomes a bottleneck.

---

## 5 · What's intentionally NOT tracked

- **Individual user identity before consent.** PostHog runs `opt_out_capturing_by_default: true` — we collect nothing until the user accepts analytics cookies.
- **Raw referrer URLs.** We only capture the referrer host (not full URL) to avoid leaking search query strings from referer headers into PostHog, which some browsers strip but not all.
- **Client-side error stacks.** Errors are still logged to the browser console but not wired to a monitoring service. If you want Sentry, that's a separate PR.

---

## 6 · Where it's all wired

| File | Purpose |
|---|---|
| `src/lib/seo-events.ts` | Referrer classifier + fireSeoPageview helper |
| `src/layouts/BaseLayout.astro` | Calls fireSeoPageview after posthog.init |
| `src/components/astro/KbArticleAnalytics.astro` | KB-specific reading events |
| `src/components/astro/KbArticleFeedback.astro` | Helpful/not-helpful + no-vote |
| `src/pages/knowledge-base.astro` | Hub search events (kb_search, kb_search_result_click) |
| `src/pages/404.astro` | `page_not_found` event |

---

*Generated 2026-04-19 by spark. Revisit quarterly.*
