# PostHog Analytics Setup voor OrderPilot

## 🚀 Implementatie Overzicht

PostHog analytics is volledig geïmplementeerd in de OrderPilot frontend voor complete marketing funnel tracking en gebruikersgedrag analyse.

## 📊 Getrackede Events

### Awareness Stage
- `page_viewed` - Pageviews met bron tracking
- `hero_cta_clicked` - CTA clicks op homepage
- `value_proposition_viewed` - Benefits sectie views
- `case_study_viewed` - Case study interacties

### Interest Stage
- `pricing_page_viewed` - Pricing page visits met toggle tracking
- `calculator_started` - Calculator gestart
- `calculator_completed` - Calculator voltooid met savings data
- `how_it_works_viewed` - Process steps bekeken

### Consideration Stage
- `demo_form_started` - Demo form bekeken
- `demo_form_completed` - Demo form ingevuld (met user identification)
- `integration_info_viewed` - ERP integratie info bekeken
- `faq_engaged` - FAQ vragen geopend

## 🔧 Setup Instructies

### 1. Environment Variabelen
Kopieer `.env.example` naar `.env` en vul je PostHog credentials in:

```bash
cp .env.example .env
```

```env
VITE_PUBLIC_POSTHOG_KEY=phc_jouw_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
VITE_PUBLIC_POSTHOG_DEBUG=true
```

### 2. PostHog Project Setup
1. Login bij [PostHog](https://posthog.com)
2. Maak nieuw project aan of gebruik bestaand
3. Kopieer API key uit Project Settings
4. Update `.env` bestand met echte credentials

### 3. Development vs Production
```env
# Development
VITE_PUBLIC_POSTHOG_DEBUG=true

# Production
VITE_PUBLIC_POSTHOG_DEBUG=false
```

## 📈 Marketing Funnel Analysis

### Key Metrics Dashboard
PostHog tracking biedt inzicht in:

- **Conversion Rates** per funnel stage
- **Drop-off Points** in user journey
- **Channel Attribution** (organic, paid, referral)
- **Content Performance** (welke secties converteren)
- **A/B Test Results** via feature flags
- **User Segmentation** op basis van gedrag

### B2B Company Tracking
- Company-level analytics voor enterprise deals
- User identification bij demo requests
- PO volume en ERP type segmentatie

## 🎯 Feature Flags (A/B Testing)

Feature flags zijn voorbereid voor:
- Hero CTA varianten
- Pricing display opties
- Case study formaten
- Demo form lengte

Activeer in PostHog dashboard → Feature Flags.

## 🔍 Event Properties

Alle events bevatten automatisch:
- Current URL en path
- Timestamp
- UTM parameters (als aanwezig)
- User agent en device info
- Session context

### Custom Properties per Event Type
- **calculator_completed**: cost_savings, po_volume, processing_time
- **demo_form_completed**: company_size, industry, po_volume
- **pricing_page_viewed**: plan_focus, pricing_toggle

## 💡 Marketing Optimalisatie Tips

### 1. Funnel Analysis
```javascript
// In PostHog: Insights → Funnels
// Setup: page_viewed (home) → calculator_started → calculator_completed → demo_form_completed
```

### 2. Correlation Analysis
PostHog toont automatisch welke factoren conversion beïnvloeden.

### 3. Cohort Analysis
Track hoe verschillende user segments presteren over tijd.

### 4. Session Recordings
Enable om te zien hoe users door de site navigeren.

## 🛡️ Privacy & GDPR

- EU hosting (eu.i.posthog.com)
- Minimale data verzameling
- localStorage + cookie persistence
- Secure cookies enabled
- Opt-out functionaliteit beschikbaar

## 🚨 Troubleshooting

### Events niet zichtbaar?
1. Check browser console voor PostHog errors
2. Verificeer API key in `.env`
3. Controleer network tab voor PostHog requests
4. Enable debug mode: `VITE_PUBLIC_POSTHOG_DEBUG=true`

### TypeScript Errors?
Zorg ervoor dat `vite-env.d.ts` de PostHog env types definieert.

### User Identification werkt niet?
Check of `identifyUser()` wordt aangeroepen na form submission met correct email formaat.

## 📊 Expected Results

Gebaseerd op B2B SaaS benchmarks:
- **25% verbetering** in demo conversion rates
- **Real-time insights** in content performance
- **Data-driven** marketing budget allocatie
- **Predictive scoring** voor high-value prospects

## 🎯 Volgende Stappen

1. **Launch A/B tests** voor hero CTA en pricing display
2. **Setup automation** triggers gebaseerd op events
3. **Create dashboards** voor marketing team
4. **Implement** session recordings voor UX insights