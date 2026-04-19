# OrderPilot — starter keyword list

**Drafted:** 2026-04-19
**Drafter:** spark
**Status:** Content-analysis + competitor-heuristic based. **Not tool-backed.** Validate with Ahrefs / SEMrush / Google Keyword Planner for actual search volume and difficulty before committing to targeting.

---

## Positioning summary

OrderPilot is an **AI-powered purchase order (PO) automation platform** for European mid-market B2B companies. It ingests incoming PO emails, extracts line items with 99.9% accuracy, and writes them into the customer's ERP (SAP, AFAS, Exact, NetSuite, Microsoft Dynamics 365 Business Central, Odoo). Built by RB2 B.V. (Dutch), strong NL+EU presence.

This shapes the keyword profile in three ways:
1. **"Purchase order" + automation/processing/extraction** — core product category. High intent, moderate volume.
2. **ERP-qualified variants** (e.g. "SAP purchase order automation") — highest-intent queries, already covered by the five industry landing pages.
3. **Dutch/NL terminology** — smaller but qualified audience; RB2's home market.

---

## Top 10 starter keywords

Priority order (1 = highest-intent + clearest fit; validate volume before locking).

| # | Keyword | Intent | Target page | Current coverage | Action |
|---|---|---|---|---|---|
| 1 | purchase order automation | transactional | `/` + `/pricing/` | title says "PO Processing", description "purchase order processing platform" — present but could be stronger | Bump page title to lead with "purchase order automation" |
| 2 | AI purchase order extraction | transactional | `/` + KB "how accurate" article | "AI-powered" not in the homepage title/description | Weave "AI-powered" into hero subheadline and home meta description |
| 3 | PO processing software | transactional | `/po-processing-software-mid-market/` | dedicated landing exists ✓ | No change — well positioned |
| 4 | SAP purchase order automation | transactional | `/purchase-order-automation-sap/` | dedicated landing exists ✓ | No change |
| 5 | AFAS inkooporder automatisering | transactional (NL) | `/purchase-order-automation-afas/` | landing exists, English-language — Dutch variant missing | Add Dutch H1 or subtitle using "inkooporder automatisering" on the AFAS page |
| 6 | procurement automation software | transactional | `/pricing/` + `/` | phrase appears in case study body but not in meta | Consider adding to pricing page meta description |
| 7 | AP automation purchase orders | navigational | `/cases/` | not mentioned | Weave into case-study copy if accurate (AP = accounts payable; many AP platforms don't automate PO intake, OrderPilot does) |
| 8 | automated PO data entry | informational | KB "first PO upload" article | content aligns, phrase not explicitly used | Add the phrase once in the article opener |
| 9 | manufacturing purchase order automation | transactional | `/purchase-order-automation-manufacturing/` | landing exists ✓ | No change |
| 10 | wholesale / distribution PO software | transactional | `/purchase-order-automation-distribution/` | landing exists ✓ | No change |

---

## Dutch-language opportunities (NL market, RB2's home turf)

Separate track from the main list. Each would need its own route (e.g. `/nl/*`) with `hreflang` pairing. Not scoped for this PR — flagging for a Phase 4 decision.

- inkooporder automatisering
- PO verwerking software
- bestelbon automatiseren
- orderverwerking AI
- AFAS inkooporder software
- Exact Online inkoopmodule AI

---

## Weaving plan (what I'm shipping this PR)

Small, low-risk content tweaks — can be rolled back if they hurt CTR:

### Homepage meta
- **Old title:** `OrderPilot | 100% Error-Free PO Processing`
- **New title:** `OrderPilot | AI purchase order automation — 99.9% accuracy`
- **Old description:** `The world's most accurate purchase order processing platform. Built for procurement teams that demand 100% accuracy.`
- **New description:** `AI-powered purchase order automation for European procurement teams. Extract PO data from supplier emails into your ERP (SAP, AFAS, Exact, NetSuite) in under 60 seconds, with 99.9% accuracy.`

Rationale: keeps the 100% brand claim (now framed as "99.9% accuracy" which is the honest number the KB article already states), leads with the top-2 keywords, names the major ERPs for mid/long-tail capture.

### What I'm NOT touching
- Hero H1 — design-weighted, not an SEO lever for above-the-fold
- Industry landing pages — each already has keyword-optimised H1 + FAQ
- Subpage titles — already clean

---

## How to validate before broadcasting

1. Plug keywords into Google Keyword Planner (free) or Ahrefs (paid) to get search volume per country (NL / DE / FR / UK).
2. For any keyword with <100 monthly searches in your target country: deprioritise. Don't build a page just for it.
3. Check SERP competitor pages for each keyword — who ranks today? Matches OrderPilot's positioning?
4. Shortlist 3–5 keywords to actually target in Q2; track ranking bi-weekly.

---

## Longer-term content backlog suggested by this keyword profile

Content ideas that would cover gaps between the existing pages. Each as its own KB article (faster, internal link juice) or blog post (external juice, more effort):

- "OCR vs AI extraction for purchase orders — why accuracy compounds" (informational)
- "3-way matching explained — and where OrderPilot fits" (informational)
- "OrderPilot vs Rossum — when to pick which" (comparison — high intent)
- "Calculating the real cost of manual PO processing" (repurpose ROI calculator content)
- "Integrating AFAS Profit with an AI PO extraction layer" (mid-intent, NL)
- "AP automation vs PO automation — a procurement leader's reference" (informational; clears up common confusion)

---

*This is a starting point. Lock in after search-volume validation.*
