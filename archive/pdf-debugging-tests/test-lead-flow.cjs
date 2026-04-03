/**
 * OrderPilot — Test Lead Magnet Flow
 *
 * Tests the complete flow:
 * 1. Generate personalized PDF report
 * 2. Send email with PDF attachment via Resend
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import the report generator
const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');

async function testLeadFlow() {
  console.log('🚀 Testing OrderPilot Lead Magnet Flow\n');

  // Test data (simulating calculator completion)
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
    // Step 1: Generate PDF
    console.log('📄 Generating PDF report...');
    const { pdfBuffer, data } = await generatePdfBuffer(testData);
    console.log('✅ PDF generated successfully');
    console.log(`   - Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`   - Total Annual Cost: ${data.totalAnnualCost}`);
    console.log(`   - Annual Savings: ${data.annualSavings}`);
    console.log('');

    // Step 2: Send email with PDF
    console.log('📧 Sending email via Resend...');
    await sendTestEmail(testData.email, testData.companyName, testData.firstName, pdfBuffer, data);
    console.log('✅ Email sent successfully to', testData.email);
    console.log('');

    console.log('🎉 Lead magnet flow test completed successfully!');
    console.log('Check your inbox for the email with PDF attachment.');

  } catch (error) {
    console.error('❌ Error in lead flow:', error);
    process.exit(1);
  }
}

// PDF Generation (local version)
async function generatePdfBuffer(input) {
  // For local testing, use regular puppeteer
  const puppeteer = require('puppeteer');

  const data = calculateCosts(input);
  const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  let renderedHtml = renderTemplate(templateHtml, data);

  // Handle logo embedding - 10:19 working configuration
  const logoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    renderedHtml = renderedHtml.replace(
      /src="[^"]*logo\.svg"/g,  // Searches for logo.svg (doesn't exist in template)
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

  // Optionally save PDF locally for inspection
  const outputPath = path.join(__dirname, 'test-output.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`   📁 PDF saved locally to: ${outputPath}`);

  return { pdfBuffer, data };
}

// Send email using Resend SDK
async function sendTestEmail(email, companyName, firstName, pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const personalGreeting = firstName ? `Hi ${firstName}` : (companyName ? `Hi ${companyName} team` : 'Hi');

  // Convert PDF buffer to base64 for Resend
  const pdfBase64 = pdfBuffer.toString('base64');

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: `Your PO Cost Analysis — €${data.totalAnnualCost}/year in hidden costs`,
    text: `${personalGreeting},

Your personalized PO Processing Cost Analysis is attached.

Key insight: Your current manual processing costs €${data.totalAnnualCost}/year.
With OrderPilot automation, you could save €${data.annualSavings}/year.

The report includes:
• Detailed breakdown of your current costs
• Industry benchmarks for companies your size
• ROI calculation showing ${data.roiMultiple}x return
• 90-day implementation roadmap
• ${data.erpSystem}-specific integration guide

Schedule a demo: http://localhost:3000/pdf-demo?savings=${data.annualSavings}&company=${companyName || 'Test Company'}&erp=${data.erpSystem}&utm_source=pdf&utm_campaign=cost_analysis&utm_content=test_email

Want to discuss your specific results? Our procurement automation experts can show you exactly how to achieve these savings.

OrderPilot — AI-powered PO processing automation
localhost:3000`,
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

// Run the test
testLeadFlow();