/**
 * Test WITH logo embedding to confirm it breaks
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');

async function testWithLogos() {
  console.log('🧪 Testing WITH logo embedding (should BREAK)...\n');

  const puppeteer = require('puppeteer');

  const data = calculateCosts({
    companyName: 'Logo Test',
    monthlyVolume: 100,
    timePerPO: 10,
    errorRate: 5,
    erpSystem: 'SAP'
  });

  const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  let renderedHtml = renderTemplate(templateHtml, data);

  // FORCE LOGO EMBEDDING - this should break it!
  const logoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath, 'base64');
    console.log(`📊 Logo size: ${(logoData.length / 1024).toFixed(1)}KB base64`);

    // Use the CORRECT regex that WILL match
    const matches = renderedHtml.match(/src="[^"]*orderpilot-logo-icon\.svg"/g);
    console.log(`🔍 Found ${matches ? matches.length : 0} logo references`);

    renderedHtml = renderedHtml.replace(
      /src="[^"]*orderpilot-logo-icon\.svg"/g,  // This WILL match!
      `src="data:image/svg+xml;base64,${logoData}"`
    );

    console.log(`📊 HTML size after embedding: ${(renderedHtml.length / 1024).toFixed(1)}KB`);
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

  console.log(`📄 PDF generated: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

  // Send email
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'LOGO TEST: Should FAIL with embedded logos',
    text: 'This PDF has embedded logos and should be corrupt in email',
    attachments: [{
      filename: 'with-logos.pdf',
      content: pdfBuffer.toString('base64'),
      contentType: 'application/pdf',
    }],
  });

  console.log('\n✅ Email sent:', result.data?.id || result.id);
  console.log('⚠️  This should FAIL because logos are embedded!');
}

testWithLogos().catch(console.error);