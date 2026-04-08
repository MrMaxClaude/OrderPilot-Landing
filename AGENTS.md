## Project

OrderPilot landing site — Astro static site for lead generation with an ROI calculator that generates personalised PDF reports and emails them via Resend. Zero framework JS — all interactivity is vanilla JS in `<script>` tags.

## Commands

```bash
npm run dev          # Astro dev server (pages only)
npm run dev:full     # Vercel dev server (pages + API routes)
npm run build        # Astro production build
npm run preview      # Preview production build
npm run lint         # astro check + tsc --noEmit
```

No test runner is configured.

## Architecture

### Frontend (Astro 6 + Tailwind CSS 4)

- `src/pages/` — file-based routing (index, pricing, calculator, cases, pdf-demo, privacy)
- `src/components/astro/` — all components as `.astro` files with vanilla JS `<script>` tags
- `src/layouts/` — BaseLayout (head, fonts, PostHog) + PageLayout (navbar, footer, CTA)
- `src/content/` — Astro Content Collections (11 typed collections: hero, benefits, faqs, plans, cases, etc.)
- `src/content.config.ts` — Zod schemas for all collections
- `src/styles/global.css` — Tailwind directives + custom animations
- `src/lib/cookieConsent.ts` — cookie consent state; PostHog is opt-out-by-default
- `src/lib/markdown.ts` — shared markdown processor for content collections

Path alias: `@` resolves to `src/`.

### Content Collections

Marketing content lives in `src/content/` as JSON and Markdown files, validated by Zod schemas at build time. Pages fetch via `getEntry()`/`getCollection()` and pass data as props to components.

Collections: pages, hero, benefits, howItWorks, testimonials, trust, integrations, faqs, pricingFaqs, plans, cases.

### Backend — Vercel serverless functions

- `api/generate-report.js` — PDF generation + email delivery (Puppeteer + `@sparticuz/chromium` + Resend)
- `api/contact.js` — contact form handler (Resend)

Shared CJS modules in `src/pdf-report/`:
- `generate-report.cjs` — cost calculation logic + HTML template rendering
- `template.html` — full PDF report template (self-contained HTML/CSS)
- `report-delivery-email.cjs` — transactional email HTML builder

PDF generation: Puppeteer renders template.html with injected data, exports A4 PDF, attaches to Resend email.

## Environment Variables

Key vars:
- `RESEND_API_KEY` — required for all email functionality
- `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` — analytics (EU host)

## Deployment

Vercel. Config in `vercel.json` — `api/generate-report.js` gets 3GB memory / 60s timeout for Puppeteer PDF generation.

## Conventions

- All components are `.astro` files in `src/components/astro/` — zero React
- Backend shared code uses `.cjs` extension (CommonJS) because Puppeteer/serverless requires it, while the project is ESM
- No `useEffect`, no `useState` — all interactivity via vanilla JS `<script>` tags with `data-*` attributes
- Brand colour: `#FF6321` (rb2-orange)
- Contact email: `info@order-pilot.ai`
- Domain: `order-pilot.ai` (not orderpilot.com)
