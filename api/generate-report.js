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

/** Public site URL for links in the transactional email (set SITE_URL on Vercel for custom domain) */
function getSiteUrl() {
  if (process.env.SITE_URL) {
    return String(process.env.SITE_URL).replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    const host = String(process.env.VERCEL_URL).replace(/^https?:\/\//, '');
    return `https://${host}`;
  }
  return 'https://orderpilot.com';
}

function siteHostLabel(siteUrl) {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return 'orderpilot.com';
  }
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

  // Handle logo for serverless
  const logoPath = path.join(process.cwd(), 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    renderedHtml = renderedHtml.replace(
      /src="[^"]*logo\.svg"/g,
      `src="data:image/svg+xml;base64,${logoData}"`
    );
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

  const siteUrl = getSiteUrl();
  const siteHost = siteHostLabel(siteUrl);
  const fromAddress =
    process.env.RESEND_FROM || 'OrderPilot <hello@orderpilot.com>';

  return await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: `Your PO Cost Analysis — €${data.totalAnnualCost}/year in hidden costs`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OrderPilot Cost Analysis</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            background-color: #FDFCFB;
            padding: 20px;
          }

          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #FFFFFF;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: #141414;
            color: #FFFFFF;
            padding: 32px 40px;
            text-align: center;
            position: relative;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 24px 24px;
          }

          .logo {
            width: 48px;
            height: 48px;
            background: #FF6321;
            border-radius: 12px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            color: white;
          }

          .badge {
            display: inline-block;
            background: rgba(255, 99, 33, 0.15);
            color: #FF6321;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 6px 14px;
            border-radius: 20px;
            margin-bottom: 16px;
          }

          .header h1 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 8px;
            line-height: 1.2;
          }

          .header p {
            color: #9CA3AF;
            font-size: 14px;
          }

          .content {
            padding: 40px;
          }

          .greeting {
            font-size: 16px;
            color: #141414;
            margin-bottom: 24px;
            font-weight: 500;
          }

          .insight-box {
            background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
            border: 1px solid #FED7AA;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            position: relative;
          }

          .insight-box::before {
            content: '💡';
            position: absolute;
            top: -8px;
            left: 24px;
            background: #FFFFFF;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 16px;
          }

          .insight-title {
            font-size: 14px;
            font-weight: 700;
            color: #7C2D12;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .cost-highlight {
            font-size: 24px;
            font-weight: 800;
            color: #FF6321;
            margin: 8px 0;
          }

          .savings-highlight {
            font-size: 20px;
            font-weight: 700;
            color: #10B981;
            margin: 8px 0;
          }

          .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 32px 0;
          }

          .feature {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            background: #F7F5F2;
            border-radius: 12px;
          }

          .feature-icon {
            width: 32px;
            height: 32px;
            background: #FF6321;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
          }

          .feature-text {
            font-size: 13px;
            color: #4A4A4A;
          }

          .feature-title {
            font-weight: 700;
            color: #141414;
            margin-bottom: 4px;
          }

          .cta-section {
            background: linear-gradient(135deg, #141414 0%, #1F1F1F 100%);
            border-radius: 20px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
            position: relative;
          }

          .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            border-radius: 20px;
          }

          .cta-text {
            color: #FFFFFF;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }

          .cta-subtext {
            color: #9CA3AF;
            font-size: 14px;
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
          }

          .cta-button {
            display: inline-block;
            background: #FF6321;
            color: #FFFFFF !important;
            font-size: 16px;
            font-weight: 700;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.2s ease;
            position: relative;
            z-index: 1;
          }

          .cta-button:hover {
            background: #E8561B;
            transform: translateY(-1px);
          }

          .secondary-links {
            text-align: center;
            margin: 24px 0;
            padding: 20px;
            background: #F7F5F2;
            border-radius: 12px;
          }

          .secondary-link {
            color: #FF6321;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            margin: 0 16px;
          }

          .footer {
            background: #F7F5F2;
            padding: 32px 40px;
            text-align: center;
            font-size: 12px;
            color: #8E8E8E;
          }

          .footer-brand {
            font-weight: 700;
            color: #141414;
            margin-bottom: 8px;
          }

          .social-proof {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
            text-align: center;
          }

          .social-proof-text {
            font-size: 13px;
            color: #14532D;
            font-style: italic;
          }

          .social-proof-stat {
            font-weight: 700;
            color: #10B981;
            font-size: 14px;
            margin-top: 8px;
          }

          @media only screen and (max-width: 600px) {
            .content { padding: 24px; }
            .header { padding: 24px; }
            .features-grid { grid-template-columns: 1fr; }
            .cta-section { padding: 24px; }
            .secondary-link { display: block; margin: 8px 0; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="badge">Your Cost Analysis</div>
            <div class="logo">OP</div>
            <h1>Your Report is Ready</h1>
            <p>Personalized cost breakdown attached</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <div class="greeting">
              ${personalGreeting},
            </div>

            <p style="font-size: 15px; color: #4A4A4A; margin-bottom: 24px;">
              Your personalized PO Processing Cost Analysis is complete and attached to this email.
              Based on your inputs, we've calculated some eye-opening numbers.
            </p>

            <!-- Key Insight Box -->
            <div class="insight-box">
              <div class="insight-title">Key Finding</div>
              <div>
                Your manual PO processing costs you
                <div class="cost-highlight">€${data.totalAnnualCost}/year</div>
              </div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #FED7AA;">
                With OrderPilot automation, you could save
                <div class="savings-highlight">€${data.annualSavings}/year</div>
                <div style="font-size: 13px; color: #7C2D12; margin-top: 4px;">
                  That's ${data.roiMultiple}x ROI in year one
                </div>
              </div>
            </div>

            <!-- Social Proof -->
            <div class="social-proof">
              <div class="social-proof-text">
                "OrderPilot cut our PO processing costs by 87% in the first quarter.
                The ROI was immediate and substantial."
              </div>
              <div class="social-proof-stat">
                — Sarah Chen, Operations Director, MidCorp Manufacturing
              </div>
            </div>

            <!-- Features Grid -->
            <div class="features-grid">
              <div class="feature">
                <div class="feature-icon">📊</div>
                <div>
                  <div class="feature-title">Detailed Breakdown</div>
                  <div class="feature-text">See exactly where every euro goes in your current process</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">📈</div>
                <div>
                  <div class="feature-title">Industry Benchmarks</div>
                  <div class="feature-text">Compare your performance against top-performing companies</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">💰</div>
                <div>
                  <div class="feature-title">ROI Calculator</div>
                  <div class="feature-text">3-year financial projection with exact savings timeline</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">🚀</div>
                <div>
                  <div class="feature-title">90-Day Plan</div>
                  <div class="feature-text">${data.erpSystem}-specific implementation roadmap</div>
                </div>
              </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
              <div class="cta-text">Ready to save €${data.annualSavings}/year?</div>
              <div class="cta-subtext">
                Book a 20-minute demo to see OrderPilot process your actual PO formats
              </div>
              <a href="${siteUrl}/pdf-demo?savings=${data.annualSavings}&company=${encodeURIComponent(companyName || 'Your Company')}&erp=${encodeURIComponent(data.erpSystem)}&utm_source=pdf&utm_campaign=cost_analysis&utm_content=email_cta" class="cta-button">
                Book Your Personalized Demo
              </a>
            </div>

            <!-- Secondary Links -->
            <div class="secondary-links">
              <a href="${siteUrl}/cases" class="secondary-link">View Case Studies</a>
              <a href="mailto:info@order-pilot.ai" class="secondary-link">Ask Questions</a>
              <a href="${siteUrl}/#contact" class="secondary-link">Just Get in Touch</a>
            </div>

            <p style="font-size: 14px; color: #8E8E8E; text-align: center; margin-top: 24px;">
              Questions about your analysis? Simply reply to this email.<br>
              Our team typically responds within 2 hours.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-brand">OrderPilot</div>
            <div>AI-powered PO processing automation</div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
              <a href="${siteUrl}" style="color: #FF6321; text-decoration: none;">${siteHost}</a>
              &nbsp;•&nbsp;
              <a href="mailto:info@order-pilot.ai" style="color: #8E8E8E; text-decoration: none;">info@order-pilot.ai</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `OrderPilot-Cost-Analysis-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });
}