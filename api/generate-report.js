/**
 * OrderPilot — Vercel API Endpoint
 * POST /api/generate-report
 *
 * Generates personalized PDF cost analysis and sends via email
 * Phase 1: Resend email only (no CRM integration yet)
 *
 * ESM default export (package.json has "type": "module"); CJS deps via createRequire.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { calculateCosts, renderTemplate } = require('../src/pdf-report/generate-report.cjs');
const {
  buildReportDeliveryEmailHtml,
  reportDeliveryEmailSubject,
} = require('../src/pdf-report/report-delivery-email.cjs');

/** Vercel can pass JSON as string or Buffer depending on runtime; normalize to an object */
function parseJsonBody(req) {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8') || '{}');
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' ? raw : {};
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = parseJsonBody(req);
    const {
      email,
      companyName,
      firstName,
      lastName,
      monthlyVolume,
      timePerPO,
      errorRate,
      erpSystem
    } = body;

    // Validate required fields
    if (!email || !monthlyVolume || !timePerPO || !errorRate) {
      return res.status(400).json({
        error: 'Missing required fields: email, monthlyVolume, timePerPO, errorRate'
      });
    }

    console.log('Generating PDF for:', { email, companyName, monthlyVolume });

    // Generate PDF
    const { pdfBuffer, data } = await generatePdfBuffer({
      companyName: companyName || 'Your Company',
      monthlyVolume: parseInt(monthlyVolume, 10),
      timePerPO: parseInt(timePerPO, 10),
      errorRate: parseInt(errorRate, 10),
      erpSystem: erpSystem || 'ERP'
    });

    // Send email with Resend
    const emailResult = await sendEmail(email, companyName, firstName, pdfBuffer, data);

    res.status(200).json({
      success: true,
      message: 'PDF generated and sent successfully',
      data: {
        emailId: emailResult?.data?.id,
        totalAnnualCost: data.totalAnnualCost,
        annualSavings: data.annualSavings,
        roiMultiple: data.roiMultiple
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      error: 'Failed to generate PDF report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// ── PDF Generation (Serverless Optimized) ────────────────

async function generatePdfBuffer(input) {
  let chromium, puppeteer;

  try {
    // Vercel serverless: use lightweight chromium
    chromium = require('@sparticuz/chromium');
    puppeteer = require('puppeteer-core');
  } catch (e) {
    // Local dev: use full puppeteer
    puppeteer = require('puppeteer');
    chromium = null;
  }

  const data = calculateCosts(input);
  const templatePath = path.join(process.cwd(), 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  let renderedHtml = renderTemplate(templateHtml, data);

  // Handle logo for serverless — inline SVG as base64 data URI
  const logoPath = path.join(process.cwd(), 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    const logoDataUri = `src="data:image/svg+xml;base64,${logoData}"`;
    // Replace both logo.svg and orderpilot-logo-icon.svg references
    renderedHtml = renderedHtml.replace(/src="[^"]*logo\.svg"/g, logoDataUri);
    renderedHtml = renderedHtml.replace(/src="[^"]*orderpilot-logo-icon\.svg"/g, logoDataUri);
  }

  const launchOptions = chromium
    ? {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      }
    : {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });

  await page.setContent(renderedHtml, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  return { pdfBuffer, data };
}

// ── Email via Resend ─────────────────────────────────────

async function sendEmail(email, companyName, firstName, pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const personalGreeting = firstName ? `Hi ${firstName}` : (companyName ? `Hi ${companyName} team` : 'Hi');

  // Convert PDF buffer to base64 for Resend attachment
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

  const fromAddress =
    process.env.RESEND_FROM || 'OrderPilot <hello@order-pilot.ai>';

  return await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: reportDeliveryEmailSubject(data),
    html: buildReportDeliveryEmailHtml({ personalGreeting, data }),
    attachments: [
      {
        filename: `OrderPilot-Cost-Analysis-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });
}