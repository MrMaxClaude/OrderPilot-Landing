/**
 * Recreate EXACT 10:19 test that worked perfectly
 * Based on what we know worked at that time
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import the report generator
const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');

async function recreate1019() {
  console.log('🚀 RECREATING EXACT 10:19 Working Test\n');

  // EXACT SAME test data as 10:19
  const testData = {
    email: 'eros@rb2.nl',
    firstName: 'Eros',
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18,
    errorRate: 12,
    erpSystem: 'Business Central'
  };

  console.log('📊 Test Data:', testData);

  try {
    // Step 1: Generate PDF EXACTLY as 10:19
    console.log('📄 Generating PDF report...');
    const { pdfBuffer, data } = await generatePdfBuffer(testData);
    console.log('✅ PDF generated successfully');
    console.log(`   - Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`   - Total Annual Cost: ${data.totalAnnualCost}`);
    console.log(`   - Annual Savings: ${data.annualSavings}`);

    // Step 2: Send email EXACTLY as 10:19 (with HTML, not text!)
    console.log('📧 Sending email via Resend...');
    await sendTestEmail(testData.email, testData.companyName, testData.firstName, pdfBuffer, data);
    console.log('✅ Email sent successfully to', testData.email);

    console.log('🎉 EXACT 10:19 recreation completed!');
    console.log('This should work EXACTLY like the original 10:19 test.');

  } catch (error) {
    console.error('❌ Error in 10:19 recreation:', error);
  }
}

// EXACT PDF Generation as 10:19 was (before all our changes)
async function generatePdfBuffer(input) {
  const puppeteer = require('puppeteer');

  const data = calculateCosts(input);
  const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  let renderedHtml = renderTemplate(templateHtml, data);

  // ORIGINAL 10:19 logo handling - NO CHANGES made yet
  // This was searching for 'logo.svg' which doesn't exist, so NO embedding
  const logoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    renderedHtml = renderedHtml.replace(
      /src="[^"]*logo\.svg"/g,
      `src="data:image/svg+xml;base64,${logoData}"`
    );
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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

  return { pdfBuffer, data };
}

// EXACT email sending as 10:19 (HTML EMAIL, not text!)
async function sendTestEmail(email, companyName, firstName, pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const personalGreeting = firstName ? `Hi ${firstName}` : (companyName ? `Hi ${companyName} team` : 'Hi');
  const pdfBase64 = pdfBuffer.toString('base64');

  const result = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>', // ORIGINAL FROM as it was
    to: email,
    subject: `Your PO Cost Analysis — ${data.totalAnnualCost}/year in hidden costs`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 15px; color: #111827;">${personalGreeting},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Your personalized PO Processing Cost Analysis is ready and attached to this email.
        </p>
        <div style="background: #FFF7ED; border-left: 3px solid #FF6321; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #111827;">
            <strong>Key insight:</strong> Your current manual processing costs
            <strong style="color: #FF6321;">${data.totalAnnualCost}/year</strong>.
            With OrderPilot automation, you could save <strong style="color: #10B981;">${data.annualSavings}/year</strong>.
          </p>
        </div>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          The report includes:
        </p>
        <ul style="font-size: 14px; color: #374151; line-height: 1.8; margin: 12px 0 20px 20px;">
          <li>Detailed breakdown of your current costs</li>
          <li>Industry benchmarks for companies your size</li>
          <li>ROI calculation showing ${data.roiMultiple}x return</li>
          <li>90-day implementation roadmap</li>
          <li>${data.erpSystem}-specific integration guide</li>
        </ul>
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:3000/pdf-demo?savings=${data.annualSavings}&company=${companyName || 'Test Company'}&erp=${data.erpSystem}&utm_source=pdf&utm_campaign=cost_analysis&utm_content=test_email"
             style="background: #FF6321; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
            Schedule a Demo
          </a>
        </div>
        <p style="font-size: 13px; color: #6B7280; line-height: 1.5;">
          Want to discuss your specific results? Our procurement automation experts can show you exactly how to achieve these savings.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="font-size: 11px; color: #9CA3AF; text-align: center;">
          OrderPilot — AI-powered PO processing automation<br>
          <a href="http://localhost:3000" style="color: #FF6321; text-decoration: none;">localhost:3000</a>
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `OrderPilot-Cost-Analysis-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('   📬 Email ID:', result.data?.id || result.id);
  return result;
}

recreate1019();