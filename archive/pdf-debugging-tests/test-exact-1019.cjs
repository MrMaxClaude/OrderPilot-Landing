/**
 * EXACT REPLICA of 10:19 working test
 * Copy everything exactly as it was when it worked
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import the report generator
const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');

async function testExact1019() {
  console.log('🚀 EXACT REPLICA of 10:19 Working Test\n');

  // EXACT SAME test data as 10:19
  const testData = {
    email: 'eros@rb2.nl',
    firstName: 'Eros',
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18, // minutes
    errorRate: 12, // percentage
    erpSystem: 'Business Central'
  };

  console.log('📊 Test Data:', testData);
  console.log('');

  try {
    // Step 1: Generate PDF EXACTLY as 10:19
    console.log('📄 Generating PDF report...');
    const { pdfBuffer, data } = await generatePdfBuffer(testData);
    console.log('✅ PDF generated successfully');
    console.log(`   - Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`   - Total Annual Cost: ${data.totalAnnualCost}`);
    console.log(`   - Annual Savings: ${data.annualSavings}`);
    console.log('');

    // Step 2: Send email EXACTLY as 10:19
    console.log('📧 Sending email via Resend...');
    await sendTestEmail(testData.email, testData.companyName, testData.firstName, pdfBuffer, data);
    console.log('✅ Email sent successfully to', testData.email);
    console.log('');

    console.log('🎉 EXACT 10:19 replica completed successfully!');
    console.log('This should work exactly like the 10:19 test that worked.');

  } catch (error) {
    console.error('❌ Error in exact 10:19 replica:', error);
  }
}

// EXACT PDF Generation as 10:19 (NO logo embedding - that was the key!)
async function generatePdfBuffer(input) {
  const puppeteer = require('puppeteer');

  const data = calculateCosts(input);
  const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  let renderedHtml = renderTemplate(templateHtml, data);

  // EXACTLY AS 10:19 - this searched for logo.svg (which doesn't exist in template)
  // So NO logos get embedded - which was why it worked!
  const logoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    renderedHtml = renderedHtml.replace(
      /src="[^"]*logo\.svg"/g,  // This won't match anything in template
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

  // Save exactly as 10:19
  const outputPath = path.join(__dirname, 'exact-1019-test.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`   📁 PDF saved locally to: ${outputPath}`);

  return { pdfBuffer, data };
}

// EXACT email sending as 10:19
async function sendTestEmail(email, companyName, firstName, pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const personalGreeting = firstName ? `Hi ${firstName}` : (companyName ? `Hi ${companyName} team` : 'Hi');

  // Convert PDF buffer to base64 for Resend
  const pdfBase64 = pdfBuffer.toString('base64');

  const result = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>',
    to: email,
    subject: `EXACT 10:19 REPLICA — €${data.totalAnnualCost}/year in hidden costs`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 15px; color: #111827;">${personalGreeting},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          This is an EXACT replica of the 10:19 test that worked perfectly.
        </p>
        <div style="background: #FFF7ED; border-left: 3px solid #FF6321; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #111827;">
            <strong>Key insight:</strong> Your current manual processing costs
            <strong style="color: #FF6321;">€${data.totalAnnualCost}/year</strong>.
            With OrderPilot automation, you could save <strong style="color: #10B981;">€${data.annualSavings}/year</strong>.
          </p>
        </div>
        <p style="font-size: 13px; color: #6B7280;">
          Same data, same code, same everything as the working 10:19 test.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `OrderPilot-Exact-1019-${(companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('   📬 Email ID:', result.data?.id || result.id);
  return result;
}

// Run the exact 10:19 test
testExact1019();