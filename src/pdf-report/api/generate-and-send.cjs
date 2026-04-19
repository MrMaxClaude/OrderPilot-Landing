/**
 * OrderPilot - Vercel Serverless Endpoint
 *
 * POST /api/generate-and-send
 *
 * Receives calculator data, generates PDF report,
 * emails it to the lead, and creates/updates HubSpot contact.
 *
 * Request body:
 *   {
 *     email: "john@company.com",
 *     companyName: "Acme Corp",
 *     monthlyVolume: 225,
 *     timePerPO: 18,
 *     errorRate: 12,
 *     erpSystem: "SAP"
 *   }
 *
 * Requires env vars:
 *   RESEND_API_KEY    - Resend transactional email
 *   HUBSPOT_API_KEY   - HubSpot CRM (optional)
 */

// NOTE: For Vercel deployment, move this file to /api/generate-and-send.js
// and update the imports accordingly.

const { calculateCosts, renderTemplate } = require('../generate-report.cjs');
const fs = require('fs');
const path = require('path');

// ── Serverless PDF generation (Vercel-compatible) ────────────

async function generatePdfBuffer(input) {
  // Always use local puppeteer for reliability
  // Vercel deployment will need puppeteer installed, not puppeteer-core
  const puppeteer = require('puppeteer');
  const chromium = null;

  const data = calculateCosts(input);
  const templatePath = path.join(__dirname, '..', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // For serverless, we need to inline the logo since file:// won't work
  let renderedHtml = renderTemplate(templateHtml, data);

  // Inline SVG logo as base64 data URI for Puppeteer rendering
  const svgLogoPath = path.join(__dirname, '..', '..', '..', 'public', 'logo.svg');
  if (fs.existsSync(svgLogoPath)) {
    const svgData = fs.readFileSync(svgLogoPath, 'base64');
    const logoDataUri = `src="data:image/svg+xml;base64,${svgData}"`;
    renderedHtml = renderedHtml.replace(/src="[^"]*orderpilot-logo-icon\.svg"/g, logoDataUri);
    renderedHtml = renderedHtml.replace(/src="[^"]*logo\.svg"/g, logoDataUri);
  }

  const launchOptions = {
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

// ── Email via Resend ─────────────────────────────────────────

async function sendEmail(email, companyName, pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Save PDF temporarily for MCP filePath method
  const tempPdfPath = path.join(__dirname, '..', '..', '..', `temp-${Date.now()}.pdf`);
  fs.writeFileSync(tempPdfPath, pdfBuffer);

  const emailResult = await resend.emails.send({
    from: process.env.RESEND_FROM || 'OrderPilot <info@order-pilot.ai>',
    to: email,
    subject: `Your PO Processing Cost Analysis - ${data.totalAnnualCost}/year in hidden costs`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 15px; color: #111827;">Hi${companyName ? ` ${companyName} team` : ''},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Your personalized PO Processing Cost Analysis is attached.
        </p>
        <div style="background: #FFF0EB; border-left: 3px solid #FF4500; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #111827;">
            <strong>Key finding:</strong> Your current PO processing costs
            <strong style="color: #FF4500;">${data.totalAnnualCost}/year</strong>.
            With OrderPilot, you could save <strong style="color: #10B981;">${data.annualSavings}/year</strong>.
          </p>
        </div>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          The report includes a detailed breakdown, industry benchmarks, ROI model, and a 90-day implementation plan.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://calendly.com/orderpilot/demo"
             style="background: #FF4500; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
            Book Your Free Demo
          </a>
        </div>
        <p style="font-size: 12px; color: #9CA3AF; line-height: 1.5;">
          Questions about the report? Reply to this email or reach us at info@order-pilot.ai.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="font-size: 11px; color: #9CA3AF;">
          OrderPilot &mdash; AI-powered PO processing &middot; order-pilot.ai
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `OrderPilot-Cost-Report-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: Buffer.from(pdfBuffer).toString('base64'),
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('Resend response:', emailResult);
  console.log('PDF email sent successfully:', {
    emailId: emailResult.data?.id,
    error: emailResult.error,
    to: email,
    subject: `Your PO Processing Cost Analysis - ${data.totalAnnualCost}/year in hidden costs`
  });

  // Clean up temp file
  try {
    fs.unlinkSync(tempPdfPath);
  } catch (e) {
    // Ignore cleanup errors
  }
}

// ── HubSpot CRM ──────────────────────────────────────────────

async function upsertHubSpotContact(email, companyName, data) {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) return;

  const properties = {
    email,
    company: companyName,
    orderpilot_monthly_volume: String(data.monthlyVolume),
    orderpilot_annual_cost: String(data._raw.totalAnnualCost),
    orderpilot_annual_savings: String(data._raw.annualSavings),
    orderpilot_roi: String(data.roiMultiple),
    orderpilot_erp: data.erpSystem,
    orderpilot_report_date: new Date().toISOString().split('T')[0],
    lifecyclestage: 'lead',
  };

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  });

  if (response.status === 409) {
    // Contact exists - update instead
    const existing = await response.json();
    const contactId = existing?.message?.match(/ID: (\d+)/)?.[1];
    if (contactId) {
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    }
  }
}

// ── API Handler ──────────────────────────────────────────────

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, companyName, monthlyVolume, timePerPO, errorRate, erpSystem } = req.body;

  if (!email || !monthlyVolume) {
    return res.status(400).json({ error: 'Missing required fields: email, monthlyVolume' });
  }

  try {
    // 1. Generate PDF
    const { pdfBuffer, data } = await generatePdfBuffer({
      companyName, monthlyVolume, timePerPO, errorRate, erpSystem,
    });

    // 2. Send email with PDF
    if (process.env.RESEND_API_KEY) {
      await sendEmail(email, companyName, pdfBuffer, data);
    }

    // 3. Update CRM
    if (process.env.HUBSPOT_API_KEY) {
      await upsertHubSpotContact(email, companyName, data).catch(err => {
        console.error('HubSpot error (non-fatal):', err.message);
      });
    }

    return res.status(200).json({
      success: true,
      summary: {
        totalAnnualCost: data.totalAnnualCost,
        annualSavings: data.annualSavings,
        roiMultiple: data.roiMultiple,
        costPerPO: data.costPerPO,
      },
    });
  } catch (err) {
    console.error('Report generation error:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}

module.exports = handler;
module.exports.generatePdfBuffer = generatePdfBuffer;
module.exports.sendEmail = sendEmail;
