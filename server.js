import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const CONTACT_EMAIL = 'info@order-pilot.ai';

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, company, poVolume, message } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !company || !poVolume) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const contactFrom =
    process.env.RESEND_CONTACT_FROM ||
    process.env.RESEND_FROM ||
    'OrderPilot <onboarding@resend.dev>';
  const notifyTo = process.env.CONTACT_NOTIFY_TO || CONTACT_EMAIL;

  try {
    // 1. Send notification email to sales team
    const notificationEmail = await resend.emails.send({
      from: contactFrom,
      to: notifyTo,
      replyTo: email,
      subject: `New OrderPilot Lead - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">New Lead from OrderPilot</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Monthly PO Volume:</strong> ${poVolume}</p>
            ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action Required:</strong> Reply directly to this email to contact the lead.</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This lead was submitted via the OrderPilot website contact form.</p>
        </div>
      `,
    });

    // 2. Send confirmation email to the lead
    const confirmationEmail = await resend.emails.send({
      from: contactFrom,
      to: email,
      subject: 'Thank you for your interest in OrderPilot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Reaching Out!</h1>
          </div>

          <div style="padding: 40px 20px; background: #ffffff;">
            <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for your interest in OrderPilot. We've received your inquiry and will typically respond within 24 hours.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #FF6B35;">What happens next?</h3>
              <ul style="font-size: 15px; line-height: 1.8;">
                <li>Our specialist will review your requirements</li>
                <li>We'll schedule a brief call to understand your PO processing challenges</li>
                <li>If OrderPilot is a good fit, we'll provide a personalized demo</li>
                <li>You'll receive a custom ROI calculation for your business</li>
              </ul>
            </div>

            <p style="font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our <a href="https://orderpilot.com/calculator" style="color: #FF6B35;">ROI Calculator</a> to see potential savings for your business.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Questions? Email us at <a href="mailto:${CONTACT_EMAIL}" style="color: #FF6B35;">${CONTACT_EMAIL}</a>.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The OrderPilot Team</strong>
            </p>
          </div>

          <div style="padding: 20px; background: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              OrderPilot - Automating Purchase Order Processing<br>
              <a href="https://orderpilot.com" style="color: #FF6B35;">orderpilot.com</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log('Emails sent successfully:', {
      notification: notificationEmail.data?.id,
      confirmation: confirmationEmail.data?.id
    });

    res.json({
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate report endpoint (PDF + Email) - Working Solution
app.post('/api/generate-report', async (req, res) => {
  try {
    const {
      email,
      companyName,
      firstName,
      lastName,
      monthlyVolume,
      timePerPO,
      errorRate,
      erpSystem
    } = req.body;

    // Validate required fields
    if (!email || !monthlyVolume || !timePerPO || !errorRate) {
      return res.status(400).json({
        error: 'Missing required fields: email, monthlyVolume, timePerPO, errorRate'
      });
    }

    console.log('Generating PDF for:', { email, companyName, monthlyVolume });

    // Import calculation functions
    const fs = require('fs');
    const path = require('path');
    const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');
    const puppeteer = require('puppeteer');

    // Full report PDF (template.html — same flow as api/generate-report.js)
    const data = calculateCosts({
      companyName: companyName || 'Your Company',
      monthlyVolume: parseInt(monthlyVolume, 10),
      timePerPO: parseInt(timePerPO, 10),
      errorRate: parseInt(errorRate, 10),
      erpSystem: erpSystem || 'ERP',
    });

    const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    let renderedHtml = renderTemplate(templateHtml, data);

    const logoPath = path.join(__dirname, 'public', 'logo.svg');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath, 'base64');
      renderedHtml = renderedHtml.replace(
        /src="[^"]*logo\.svg"/g,
        `src="data:image/svg+xml;base64,${logoData}"`
      );
    }

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
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

    // Save PDF temporarily for attachment (working solution method)
    const tempPdfPath = path.join(__dirname, `temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, Buffer.from(pdfBuffer));

    // Send email with the full template from original working code
    const personalGreeting = firstName ? `Hi ${firstName}` : (companyName ? `Hi ${companyName} team` : 'Hi');

    const emailResult = await resend.emails.send({
      from: 'OrderPilot <noreply@resend.dev>',
      to: email,
      subject: `Your PO Processing Cost Analysis — €${data.totalAnnualCost}/year in hidden costs`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OrderPilot Cost Analysis</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
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
            .header h1 {
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 8px;
            }
            .content {
              padding: 40px;
            }
            .insight-box {
              background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
              border: 1px solid #FED7AA;
              border-radius: 16px;
              padding: 24px;
              margin: 24px 0;
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
            .cta-button {
              display: inline-block;
              background: #FF6321;
              color: #FFFFFF !important;
              font-size: 16px;
              font-weight: 700;
              padding: 16px 32px;
              border-radius: 12px;
              text-decoration: none;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">OP</div>
              <h1>Your Report is Ready</h1>
              <p>Personalized cost breakdown attached</p>
            </div>

            <div class="content">
              <p style="font-size: 16px; margin-bottom: 24px;">
                ${personalGreeting},
              </p>

              <p style="font-size: 15px; color: #4A4A4A; margin-bottom: 24px;">
                Your personalized PO Processing Cost Analysis is complete and attached to this email.
                Based on your inputs, we've calculated some eye-opening numbers.
              </p>

              <div class="insight-box">
                <div style="font-size: 14px; font-weight: 700; color: #7C2D12; margin-bottom: 12px;">
                  KEY FINDING
                </div>
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

              <p style="font-size: 15px; color: #4A4A4A; margin-bottom: 32px;">
                The attached report includes a detailed breakdown, industry benchmarks,
                ROI model, and a 90-day implementation plan.
              </p>

              <div style="text-align: center;">
                <a href="https://orderpilot.com/demo" class="cta-button">
                  Book Your Personalized Demo
                </a>
              </div>

              <p style="font-size: 14px; color: #8E8E8E; text-align: center; margin-top: 24px;">
                Questions about your analysis? Simply reply to this email.<br>
                Our team typically responds within 2 hours.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `OrderPilot-Cost-Analysis-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
          contentType: 'application/pdf',
        },
      ],
    });

    // Clean up temp file
    try {
      fs.unlinkSync(tempPdfPath);
    } catch (e) {
      console.warn('Could not clean up temp file:', e.message);
    }

    console.log('PDF email sent successfully:', {
      emailId: emailResult.data?.id,
      to: email,
      pdfSize: `${Math.round(pdfBuffer.length / 1024)}KB`
    });

    res.status(200).json({
      success: true,
      message: 'PDF generated and sent successfully',
      data: {
        emailId: emailResult.data?.id,
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
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Resend API Key configured:', !!process.env.RESEND_API_KEY);
});