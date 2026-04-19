# Lighthouse baseline — www.order-pilot.ai

**Date:** 2026-04-19 10:10 UTC
**URL audited:** https://www.order-pilot.ai/
**Mode:** Desktop emulation, headless Chrome
**Full HTML report:** `reports/lighthouse/baseline-20260419-101043.report.html`

---

## Scores

| Category | Score |
|---|---|
| **SEO** | **100 / 100** ✓ |
| **Best Practices** | **96 / 100** |
| **Accessibility** | **95 / 100** |
| **Performance** | **87 / 100** |

---

## Core Web Vitals

| Metric | Value | Target | Status |
|---|---|---|---|
| First Contentful Paint (FCP) | 1.0 s | < 1.8 s | ✓ |
| Largest Contentful Paint (LCP) | **4.0 s** | < 2.5 s | ❌ |
| Total Blocking Time (TBT) | 80 ms | < 200 ms | ✓ |
| Cumulative Layout Shift (CLS) | 0.003 | < 0.1 | ✓ |
| Speed Index | 1.2 s | < 3.4 s | ✓ |
| Time to Interactive (TTI) | 4.3 s | < 3.8 s | ⚠ |

LCP is the headline performance problem — everything else is within "good" range.

---

## Top SEO issues — NONE

SEO scored 100/100. Lighthouse found no failed SEO audits on the homepage. This is consistent with the audit we ran earlier: title, description, canonical, OG/Twitter tags are all present. The missing structured data (Organization / SoftwareApplication / FAQPage) that my handoff branch adds isn't flagged by Lighthouse because those are opportunity-only signals, not failures.

*Note:* Lighthouse tests the homepage only by default. Subpage SEO (cases, pricing, calculator, privacy) likely also scores well but wasn't audited.

---

## Top accessibility issues (score 95)

1. **Color contrast: "NOW IN PUBLIC BETA" badge** (weight 7 → biggest A11y drag)
   - `#FF6321` orange on `#FDEDE5` tinted background = **2.6 : 1** (needs ≥ 4.5 : 1 for small text)
   - Element: `div.inline-flex` with classes `bg-rb2-orange/10 text-rb2-orange`
   - **Fix:** either darken the text (`text-rb2-orange-hover` / a darker orange token) OR darken the background beyond 10% opacity. Simpler still: swap the tinted-background badge to a solid light-bg outline + darker orange text (AA compliant).

2. **Color contrast: hero H1 italic span "Right."**
   - `#FF6321` on `#FDFCFB` near-white = **2.9 : 1** (needs ≥ 3 : 1 for large text — fails by a hair)
   - Element: `<span class="font-serif italic text-rb2-orange">` inside H1
   - **Fix:** bump the brand orange to a slightly darker value in large-text contexts, or add `text-rb2-orange-hover` to the italic span.

3. **Heading order violation** (weight 3)
   - Footer uses `<h4>PRODUCT</h4>` but the preceding sibling structure breaks the hierarchy (jumps h1 → h2 → h4).
   - **Fix:** change footer group headings from `<h4>` to `<h3>`.

---

## Top best-practices issues (score 96)

1. **Console error: /favicon.ico → 404**
   - **Already fixed** in my unshipped SEO foundation commit (adds `favicon.ico` + `favicon.svg` + `apple-touch-icon.png` + `manifest.webmanifest`).

---

## Top performance issues (score 87)

1. **LCP 4.0 s** — 25-point weighted drag
   - Lighthouse couldn't pin the LCP element in its output, but the most likely candidate is the hero headline or the hero image. LCP around 4 s on a mostly static page suggests render-blocking + heavy initial JS.

2. **Render-blocking CSS**
   - `CookieConsent.7ZQ3bsoR.css` (12 KB) blocks initial render.
   - **Fix:** load cookie consent CSS async — e.g. via a preload + onload swap — OR move the consent UI markup to lazy-render client-side.

3. **Unused JavaScript** (no explicit savings but measurable bytes wasted)
   - `gtag/js` — 160 KB total, **66 KB wasted (41%)** — GA4 is heavy.
   - `_astro/module.BneQYH42.js` — 62 KB total, **40 KB wasted (64%)** — likely one of the Astro bundles shipping unused code.
   - `posthog-js/surveys.js` — 33 KB total, **26 KB wasted (80%)** — PostHog Surveys loaded but not used on the homepage.

4. **Legacy JavaScript polyfills: ~9 KB saving**
   - PostHog's bundle includes transpiled code for old browsers.

5. **Cache TTL too short** on some static assets.

---

## Quick wins (can ship same day — all in-repo)

| # | Fix | Expected score lift | Scope |
|---|---|---|---|
| 1 | Ship the SEO foundation commit (fixes favicon 404) | Best Practices +4 | local commit pending push |
| 2 | Fix "NOW IN PUBLIC BETA" badge contrast | A11y +~2 | 1-line Tailwind class change |
| 3 | Fix hero italic span contrast | A11y +~1 | 1-line class change |
| 4 | Change footer `<h4>` to `<h3>` | A11y +~1 | Navbar.astro / Footer.astro edit |
| 5 | Defer CookieConsent CSS | Perf +~3 | layout change |
| 6 | Lazy-load PostHog surveys module (or gate behind opt-in) | Perf +~2 | 1-line change |
| 7 | Lazy-load GA4 until user interaction (meaningful gains given 66 KB unused) | Perf +~4 | small change |

Total potential after quick wins: **Perf ~94, A11y 100, Best Practices 100, SEO 100** — realistic, tightly scoped PR.

---

## Bigger wins (require deeper work)

- **LCP root cause investigation** — need a field-data trace. Possible causes: font load (Inter + Playfair), hero image (if any), or Vercel Analytics script. Preload hero image + use `font-display: swap` (already set) + measure again.
- **Bundle splitting** — astro module has 40 KB unused. Could be the posthog-js bundle or the calculator code leaking into homepage.
- **Server-side render less / static more** — Astro is already mostly static; confirm no unnecessary hydration.

---

## Recommended next step

Scope a Foundation-B PR that bundles items 1–7 from Quick Wins. ~2 hours of work, estimated to land at 94 / 100 / 100 / 100.

Separately: run Lighthouse on a mobile profile to see the real-world user experience — desktop scores are almost always optimistic.

---

*Baseline measured 2026-04-19 by spark. Re-run via `lighthouse https://www.order-pilot.ai/ --output html,json --output-path reports/lighthouse/<label>` to track progress.*
