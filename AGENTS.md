## Project

OrderPilot landing site — React/TypeScript SPA for lead generation with an ROI calculator that generates personalised PDF reports and emails them via Resend.

## Commands

```bash
npm run dev          # Vite dev server on :3000
npm run server       # Express backend on :3001 (email + PDF generation)
npm run dev:full     # Both in parallel
npm run build        # Vite production build
npm run lint         # TypeScript type-check (tsc --noEmit)
```

No test runner is configured.

## Architecture

### Frontend (Vite + React 19 + TailwindCSS 4)

- `index.tsx` — entrypoint; wraps app in PostHog + BrowserRouter
- `App.tsx` — route definitions (/, /calculator, /pricing, /cases, /pdf-demo, /privacy)
- `components/` — all page components and sections live flat here (no nesting)
- `src/hooks/` — custom hooks (PostHog tracking, scroll animation)
- `src/lib/cookieConsent.ts` — cookie consent state; PostHog is opt-out-by-default
- `index.css` — global styles + Tailwind

Path alias: `@` resolves to the project root (vite.config.ts).

### Backend — dual deployment

The same PDF/email logic runs in two environments:

1. **`server.js`** — Express server for local dev. Endpoints: `POST /api/contact`, `POST /api/generate-report`.
2. **`api/generate-report.js`** — Vercel serverless function (same logic, uses `@sparticuz/chromium` + `puppeteer-core` in prod, falls back to full `puppeteer` locally).

Both share CJS modules in `src/pdf-report/`:
- `generate-report.cjs` — cost calculation logic (`calculateCosts`) + HTML template rendering (`renderTemplate`)
- `template.html` — full PDF report template (32KB, self-contained HTML/CSS)
- `report-delivery-email.cjs` — transactional email HTML builder + subject line

PDF generation: Puppeteer renders `template.html` with injected data, exports A4 PDF, attaches to Resend email.

### Contact form

`api/contact.js` (Vercel) / `server.js /api/contact` (local) — sends lead notification to sales + confirmation to submitter via Resend.

## Environment Variables

See `.env.example`. Key vars:
- `RESEND_API_KEY` — required for all email functionality
- `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` — analytics (EU host)
- `VITE_API_URL` — backend URL for DemoForm (default `http://localhost:3001`); calculator uses same-origin `/api` on Vercel

## Deployment

Vercel. Config in `vercel.json` — `api/generate-report.js` gets 3GB memory / 60s timeout for Puppeteer PDF generation.

## Conventions

- Components are `.tsx` files in `components/` (flat, no subdirectories)
- Backend shared code uses `.cjs` extension (CommonJS) because Puppeteer/serverless requires it, while the project is ESM (`"type": "module"`)
- Animations use `motion` (Framer Motion successor)
- Brand colour: `#FF6B35` (rb2-orange)
- Contact email: `info@order-pilot.ai`
