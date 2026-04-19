/**
 * Canonical PO-processing cost model.
 *
 * This module is the SINGLE SOURCE OF TRUTH for the cost calculation used by:
 *   - The calculator results screen (client-side, imported from CalculatorPage.astro)
 *   - The PDF report (server-side, imported by src/pdf-report/generate-report.cjs via dynamic import)
 *
 * Any change to the formula or constants must happen here. Do NOT duplicate
 * logic in the calling sites — they are allowed to format / route, not to
 * recalculate.
 *
 * ESM module so it can be imported natively by both Astro (Vite bundle) and
 * Node runtime (Vercel function). CJS consumers use dynamic import().
 */

// Constants — all EUR, all annualised helpers × 12 where noted
export const CONSTANTS = Object.freeze({
  STAFF_HOURLY_COST: 42,
  MANAGER_HOURLY_COST: 62,
  ERROR_RESOLUTION_TIME_MIN: 20,
  AVG_INVOICE_VALUE: 2500,
  EARLY_PAYMENT_DISCOUNT: 0.02,
  ORDERPILOT_ANNUAL_COST: 6000,
  REWORK_RATE: 0.25,
  ESCALATION_RATE: 0.10,
  AUTOMATION_REDUCTION: 0.90,
  MANAGER_ESCALATION_TIME_MIN: 15,
});

/**
 * Map an optional "days of delay" user answer to a factor (0-1) representing
 * the share of POs that miss their early-payment discount window.
 */
export function delayDaysToFactor(days) {
  if (!days || days <= 0) return 0;
  if (days <= 1.5) return 0.30;
  if (days <= 4) return 0.60;
  return 0.85;
}

/**
 * Fallback when the caller didn't collect a delay answer: derive a factor from
 * per-PO processing time. Long processing time → more missed windows.
 */
export function delayFactorFromTime(timePerPoMin) {
  return Math.min(timePerPoMin * 2, 60) / 100;
}

/**
 * @param {object} input
 * @param {number} input.monthlyVolume  POs per month
 * @param {number} input.timePerPoMin   Minutes per PO (manual processing)
 * @param {number} input.errorRate      0-1 fraction (e.g. 0.12 for 12%)
 * @param {number} [input.delayDays]    Optional: typical delay in days. If
 *                                      provided, the factor is derived from
 *                                      days; otherwise derived from timePerPoMin.
 */
export function calculateCosts(input) {
  const volume = Number(input.monthlyVolume) || 225;
  const timePerPoMin = Number(input.timePerPoMin) || 18;
  const errorRate = Number(input.errorRate) || 0.12;
  const delayDays = input.delayDays;

  const {
    STAFF_HOURLY_COST,
    MANAGER_HOURLY_COST,
    ERROR_RESOLUTION_TIME_MIN,
    AVG_INVOICE_VALUE,
    EARLY_PAYMENT_DISCOUNT,
    ORDERPILOT_ANNUAL_COST,
    REWORK_RATE,
    ESCALATION_RATE,
    AUTOMATION_REDUCTION,
    MANAGER_ESCALATION_TIME_MIN,
  } = CONSTANTS;

  const monthlyErrors = volume * errorRate;

  // Direct labor cost — annualised
  const laborCost = volume * (timePerPoMin / 60) * STAFF_HOURLY_COST * 12;

  // Delay cost: user's days-answer preferred, time-derived fallback.
  const delayFactor =
    delayDays != null ? delayDaysToFactor(delayDays) : delayFactorFromTime(timePerPoMin);
  const delayCost = volume * AVG_INVOICE_VALUE * EARLY_PAYMENT_DISCOUNT * delayFactor * 12;

  // Rework + escalation cost
  const reworkVolume = volume * REWORK_RATE;
  const escalationVolume = volume * ESCALATION_RATE;
  const reworkCost =
    (reworkVolume * (timePerPoMin / 60) * STAFF_HOURLY_COST +
      escalationVolume * (MANAGER_ESCALATION_TIME_MIN / 60) * MANAGER_HOURLY_COST) *
    12;

  // Error correction cost
  const errorCost = monthlyErrors * (ERROR_RESOLUTION_TIME_MIN / 60) * STAFF_HOURLY_COST * 12;

  const totalAnnualCost = laborCost + delayCost + reworkCost + errorCost;
  const grossSavings = totalAnnualCost * AUTOMATION_REDUCTION;
  const netSavings = grossSavings - ORDERPILOT_ANNUAL_COST;

  return {
    // Inputs echoed back
    monthlyVolume: volume,
    timePerPoMin,
    errorRate,
    delayDays: delayDays ?? null,
    delayFactor,
    monthlyErrors,

    // Per-bucket annual costs (raw numbers, no currency formatting)
    laborCost,
    delayCost,
    reworkCost,
    errorCost,
    totalAnnualCost,

    // Automation outcomes
    orderpilotAnnualCost: ORDERPILOT_ANNUAL_COST,
    grossSavings,
    netSavings,

    // Reusable ratios
    reductionRate: AUTOMATION_REDUCTION,
  };
}
