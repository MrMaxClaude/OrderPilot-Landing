/**
 * OrderPilot — PO Processing Cost Report Generator
 *
 * Calculation engine + Puppeteer PDF generation.
 * Takes user input from the Hidden Cost Calculator and produces
 * a personalized 6-page PDF cost analysis report.
 *
 * Usage:
 *   const { generateReport, calculateCosts } = require('./generate-report.cjs');
 *
 *   // Just calculations:
 *   const data = calculateCosts({ monthlyVolume: 225, timePerPO: 18, errorRate: 12, erpSystem: 'SAP' });
 *
 *   // Full PDF:
 *   await generateReport({ companyName: 'Acme Corp', monthlyVolume: 225, ... });
 */

const fs = require('fs');
const path = require('path');

// ── Constants ────────────────────────────────────────────────

const STAFF_HOURLY_COST = 42;
const MANAGER_HOURLY_COST = 62;
const ERROR_RESOLUTION_TIME_MIN = 20;
const AVG_INVOICE_VALUE = 2500;
const EARLY_PAYMENT_DISCOUNT = 0.02;
const ORDERPILOT_ANNUAL_COST = 6000;
const REWORK_RATE = 0.25;
const ESCALATION_RATE = 0.10;
const AUTOMATION_REDUCTION = 0.90; // 90% cost reduction with OrderPilot

// ── Calculation Engine ───────────────────────────────────────

function calculateCosts(input) {
  const {
    monthlyVolume = 225,
    timePerPO = 18,
    errorRate = 12,
    erpSystem = 'ERP',
    companyName = 'Your Company',
    reportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  } = input;

  // Monthly errors
  const monthlyErrors = Math.round(monthlyVolume * (errorRate / 100));

  // 1. Direct Labor Cost
  const laborCostRaw = monthlyVolume * (timePerPO / 60) * STAFF_HOURLY_COST * 12;

  // 2. Processing Delays — lost early payment discounts
  const delayFactor = Math.min(timePerPO * 2, 60); // delay correlates with processing time
  const delayCostRaw = monthlyVolume * AVG_INVOICE_VALUE * EARLY_PAYMENT_DISCOUNT * (delayFactor / 100) * 12;

  // 3. Rework & Escalation
  const reworkVolume = monthlyVolume * REWORK_RATE;
  const escalationVolume = monthlyVolume * ESCALATION_RATE;
  const reworkCostRaw = (reworkVolume * (timePerPO / 60) * STAFF_HOURLY_COST + escalationVolume * (15 / 60) * MANAGER_HOURLY_COST) * 12;

  // 4. Error Correction
  const errorCostRaw = monthlyErrors * (ERROR_RESOLUTION_TIME_MIN / 60) * STAFF_HOURLY_COST * 12;

  // Totals
  const totalAnnualCostRaw = laborCostRaw + delayCostRaw + reworkCostRaw + errorCostRaw;
  const totalSavingsRaw = totalAnnualCostRaw * AUTOMATION_REDUCTION;
  const annualSavingsRaw = totalSavingsRaw - ORDERPILOT_ANNUAL_COST;
  const totalAutomatedRaw = totalAnnualCostRaw - totalSavingsRaw;

  // Per-category automated costs
  const laborAutomatedRaw = laborCostRaw * (1 - AUTOMATION_REDUCTION);
  const delayAutomatedRaw = delayCostRaw * (1 - AUTOMATION_REDUCTION);
  const reworkAutomatedRaw = reworkCostRaw * (1 - AUTOMATION_REDUCTION);
  const errorAutomatedRaw = errorCostRaw * (1 - AUTOMATION_REDUCTION);

  // Percentages
  const laborPercent = Math.round((laborCostRaw / totalAnnualCostRaw) * 100);
  const delayPercent = Math.round((delayCostRaw / totalAnnualCostRaw) * 100);
  const reworkPercent = Math.round((reworkCostRaw / totalAnnualCostRaw) * 100);
  const errorPercent = Math.round((errorCostRaw / totalAnnualCostRaw) * 100);

  // Bar widths (max 95%)
  const maxCost = Math.max(laborCostRaw, delayCostRaw, reworkCostRaw, errorCostRaw);
  const laborBarWidth = Math.round((laborCostRaw / maxCost) * 95);
  const delayBarWidth = Math.round((delayCostRaw / maxCost) * 95);
  const reworkBarWidth = Math.round((reworkCostRaw / maxCost) * 95);
  const errorBarWidth = Math.round((errorCostRaw / maxCost) * 95);

  // ROI
  const roiMultiple = Math.round((annualSavingsRaw / ORDERPILOT_ANNUAL_COST) * 10) / 10;

  // Payback
  const monthlySavings = annualSavingsRaw / 12;
  const paybackMonths = monthlySavings > 0 ? Math.ceil(ORDERPILOT_ANNUAL_COST / monthlySavings) : 12;
  const paybackWeeks = Math.round(paybackMonths * 4.33);

  // 3-year projection
  const year1 = annualSavingsRaw;
  const year2 = annualSavingsRaw * 2;
  const year3 = annualSavingsRaw * 3;

  // Benchmarking
  const costPerPORaw = totalAnnualCostRaw / (monthlyVolume * 12);
  const industryAvgCostRaw = monthlyVolume * 12 * 26.4;
  const topPerformerCostRaw = monthlyVolume * 12 * 6.5;

  // Meter position (0 = top, 100 = worst) based on cost per PO
  const meterPosition = Math.min(95, Math.max(5, ((costPerPORaw - 5) / (60 - 5)) * 100));

  // Efficiency score (inverse of cost ranking)
  const efficiencyScore = Math.max(10, Math.round(100 - meterPosition));
  const improvementPercent = Math.round(AUTOMATION_REDUCTION * 100);

  // Automation level description
  let automationLevel = 'Manual';
  if (timePerPO < 5) automationLevel = 'Mostly automated';
  else if (timePerPO < 10) automationLevel = 'Partially automated';
  else if (timePerPO < 15) automationLevel = 'Semi-manual';

  // ERP insight
  const erpInsights = {
    'SAP': 'a 40-60% reduction in PO processing time after implementing AI automation alongside their SAP modules',
    'Oracle': 'significant efficiency gains when augmenting Oracle Procurement Cloud with AI-driven PO extraction',
    'Microsoft Dynamics': 'streamlined order-to-cash cycles when AI processing feeds directly into Dynamics 365',
    'NetSuite': 'faster PO turnaround and fewer errors when AI handles the data entry layer before NetSuite',
    'Exact': 'major time savings by automating PO intake and letting Exact handle downstream accounting',
    'AFAS': 'a significant reduction in manual data entry when AI pre-processes POs before AFAS ingestion',
    'Unit4': 'improved procurement efficiency when AI extraction feeds structured data into Unit4',
    'ERP': 'a 40-60% reduction in processing costs after implementing AI-driven PO automation',
  };

  const erpIcons = {
    'SAP': '🔷', 'Oracle': '🔴', 'Microsoft Dynamics': '🟦',
    'NetSuite': '🟠', 'Exact': '🟢', 'AFAS': '🔵', 'Unit4': '🟣', 'ERP': '⚙️',
  };

  const erpInsight = erpInsights[erpSystem] || erpInsights['ERP'];
  const erpIcon = erpIcons[erpSystem] || erpIcons['ERP'];

  // Format helpers
  const fmt = (n) => '€' + Math.round(n).toLocaleString('nl-NL');
  const fmtShort = (n) => {
    if (n >= 1000000) return '€' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '€' + Math.round(n / 1000) + 'K';
    return '€' + Math.round(n);
  };

  return {
    // Input echo
    companyName,
    reportDate,
    monthlyVolume,
    timePerPO,
    errorRate,
    erpSystem,
    monthlyErrors,
    automationLevel,
    delayFactor,

    // Costs formatted
    totalAnnualCost: fmt(totalAnnualCostRaw),
    costPerPO: fmt(costPerPORaw),
    laborCost: fmt(laborCostRaw),
    delayCost: fmt(delayCostRaw),
    reworkCost: fmt(reworkCostRaw),
    errorCost: fmt(errorCostRaw),

    // Percentages
    laborPercent, delayPercent, reworkPercent, errorPercent,

    // Bar widths
    laborBarWidth, delayBarWidth, reworkBarWidth, errorBarWidth,

    // Savings formatted
    annualSavings: fmt(annualSavingsRaw),
    totalSavings: fmt(totalSavingsRaw),
    totalAutomated: fmt(totalAutomatedRaw),
    laborAutomated: fmt(laborAutomatedRaw),
    delayAutomated: fmt(delayAutomatedRaw),
    reworkAutomated: fmt(reworkAutomatedRaw),
    errorAutomated: fmt(errorAutomatedRaw),
    laborSavings: fmt(laborCostRaw * AUTOMATION_REDUCTION),
    delaySavings: fmt(delayCostRaw * AUTOMATION_REDUCTION),
    reworkSavings: fmt(reworkCostRaw * AUTOMATION_REDUCTION),
    errorSavings: fmt(errorCostRaw * AUTOMATION_REDUCTION),

    // ROI
    roiMultiple,
    paybackWeeks,
    paybackMonths,

    // 3-year
    year1Savings: fmt(year1),
    year2Savings: fmt(year2),
    year3Savings: fmt(year3),

    // Benchmarking
    industryAvgCost: Math.round(industryAvgCostRaw).toLocaleString('nl-NL'),
    topPerformerCost: Math.round(topPerformerCostRaw).toLocaleString('nl-NL'),
    meterPosition: Math.round(meterPosition),
    efficiencyScore,
    improvementPercent,

    // ERP
    erpInsight,
    erpIcon,

    // Raw values (for API consumers)
    _raw: {
      totalAnnualCost: totalAnnualCostRaw,
      laborCost: laborCostRaw,
      delayCost: delayCostRaw,
      reworkCost: reworkCostRaw,
      errorCost: errorCostRaw,
      annualSavings: annualSavingsRaw,
      costPerPO: costPerPORaw,
      roiMultiple,
    },
  };
}

// ── Template Rendering ───────────────────────────────────────

function renderTemplate(templateHtml, data) {
  let html = templateHtml;
  for (const [key, value] of Object.entries(data)) {
    if (key === '_raw') continue;
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }
  return html;
}

// ── Preview Generation (no Puppeteer needed) ─────────────────

function generatePreview(input, outputPath) {
  const templatePath = path.join(__dirname, 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const data = calculateCosts(input);
  const renderedHtml = renderTemplate(templateHtml, data);
  fs.writeFileSync(outputPath, renderedHtml, 'utf-8');
  return { outputPath, data };
}

// ── PDF Generation (requires Puppeteer) ──────────────────────

async function generateReport(input) {
  const puppeteer = require('puppeteer');

  const data = calculateCosts(input);
  const templatePath = path.join(__dirname, 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const renderedHtml = renderTemplate(templateHtml, data);

  // Write rendered HTML to temp file (Puppeteer needs file:// for local assets)
  const tempHtmlPath = path.join(__dirname, 'output', '_temp-render.html');
  fs.writeFileSync(tempHtmlPath, renderedHtml, 'utf-8');

  const outputPath = path.join(
    __dirname, 'output',
    `OrderPilot-Cost-Report-${(input.companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
  );

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });

  console.log('Rendering report...');
  await page.goto(`file://${tempHtmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  await page.evaluateHandle('document.fonts.ready');

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  // Cleanup temp file
  try { fs.unlinkSync(tempHtmlPath); } catch (e) { /* ignore */ }

  console.log(`PDF saved to: ${outputPath}`);
  return { outputPath, data };
}

module.exports = { calculateCosts, generateReport, generatePreview, renderTemplate };
