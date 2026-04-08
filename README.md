# OrderPilot Landing

Astro landing site for OrderPilot — lead generation with an ROI calculator that generates personalised PDF reports.

## Setup

```bash
npm install
npm run dev        # Astro dev server (pages only)
npm run dev:full   # Vercel dev server (pages + API routes)
```

## Tech Stack

- Astro 6 (static site generation)
- Tailwind CSS 4.2
- Vanilla JS (zero framework JS — no React)
- Astro Content Collections (typed content via Zod)
- PostHog analytics (cookie-consent gated)
- Puppeteer + Resend (PDF report generation + email delivery)
- Vercel (hosting + serverless functions)

## Scripts

- `npm run dev` — Astro dev server (pages only)
- `npm run dev:full` — Vercel dev server (pages + `/api/` routes)
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — Astro check + TypeScript type-check
