/**
 * Test minimal PDF template to eliminate size issues
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function testMinimalPdf() {
  console.log('🧪 Testing minimal PDF template...');

  // Test data
  const data = {
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18,
    errorRate: 12,
    erpSystem: 'Business Central',
    totalAnnualCost: '€99,846',
    annualSavings: '€83,861',
    roiMultiple: '8.4x',
    year1Savings: '€83,861',
    year2Savings: '€167,722',
    year3Savings: '€251,583',
    paybackWeeks: '4',
    annualVolume: 2700,
    totalHoursMonth: 68,
    errorsPerMonth: 27,
    processingCost: '€67,500',
    errorCost: '€25,346',
    overheadCost: '€7,000',
    opportunityCost: '€15,000',
    processingHours: 1350,
    errorHours: 507
  };

  try {
    // Read minimal template
    const templatePath = path.join(__dirname, 'src', 'pdf-report', 'minimal-template.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf-8');

    // Replace variables
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      templateHtml = templateHtml.replace(regex, value);
    }

    console.log('🚀 Launching browser with minimal config...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    console.log('📄 Setting minimal content...');
    await page.setContent(templateHtml, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    console.log('📄 Generating minimal PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      timeout: 10000
    });

    await browser.close();

    // Save minimal PDF
    const outputPath = path.join(__dirname, 'minimal-output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ Minimal PDF generated`);
    console.log(`   📁 Path: ${outputPath}`);
    console.log(`   📏 Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

    // Send via email
    console.log('📧 Sending minimal PDF via email...');
    await sendMinimalEmail(pdfBuffer, data);

    return outputPath;

  } catch (error) {
    console.error('❌ Error generating minimal PDF:', error);
    throw error;
  }
}

async function sendMinimalEmail(pdfBuffer, data) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const pdfBase64 = pdfBuffer.toString('base64');

  const result = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>',
    to: 'eros@rb2.nl',
    subject: 'MINIMAL PDF TEST - OrderPilot Cost Analysis',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
        <h2>Minimal PDF Test</h2>
        <p>Hi Eros,</p>
        <p>This email contains a <strong>minimal PDF template</strong> designed to be lightweight and reliable.</p>
        <div style="background: #FFF7ED; border-left: 3px solid #FF6321; padding: 12px; margin: 16px 0;">
          <p style="margin: 0;"><strong>PDF Details:</strong><br>
          • Minimal template (no bloat)<br>
          • System fonts only<br>
          • Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB<br>
          • No external dependencies</p>
        </div>
        <p><strong>This should work reliably!</strong></p>
        <p>If this PDF doesn't work, the issue is with email delivery, not PDF generation.</p>
      </div>
    `,
    attachments: [
      {
        filename: 'OrderPilot-Minimal-Test.pdf',
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('✅ Minimal email sent');
  console.log('   📬 Email ID:', result.data?.id || result.id);
  return result;
}

testMinimalPdf();