/**
 * Debug PDF generation to identify loading issues
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function debugPdfGeneration() {
  console.log('🔍 Debugging PDF generation...\n');

  const testData = {
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18,
    errorRate: 12,
    erpSystem: 'Business Central',
    totalAnnualCost: '€99.846',
    annualSavings: '€83.861',
    roiMultiple: '8.4x'
  };

  try {
    // Read template
    const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf-8');

    // Replace template variables
    for (const [key, value] of Object.entries(testData)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      templateHtml = templateHtml.replace(regex, value);
    }

    // Handle logo embedding
    const logoPath = path.join(__dirname, 'public', 'logo.svg');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath, 'base64');
      templateHtml = templateHtml.replace(
        /src=\"[^\"]*logo\.svg\"/g,
        `src="data:image/svg+xml;base64,${logoData}"`
      );
      console.log('✅ Logo embedded successfully');
    } else {
      console.log('⚠️ Logo file not found at:', logoPath);
    }

    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      devtools: false
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      console.log('📄 Page console:', msg.text());
    });

    // Enable error logging
    page.on('pageerror', err => {
      console.error('❌ Page error:', err.message);
    });

    await page.setViewport({ width: 794, height: 1123 });

    console.log('📝 Setting page content...');
    await page.setContent(templateHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('⏳ Waiting for fonts to load...');
    await page.evaluateHandle('document.fonts.ready');

    console.log('📄 Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    // Save PDF
    const outputPath = path.join(__dirname, 'debug-output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ PDF generated successfully`);
    console.log(`   📁 Saved to: ${outputPath}`);
    console.log(`   📏 Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

    // Verify PDF integrity
    const savedPdf = fs.readFileSync(outputPath);
    if (savedPdf.length === pdfBuffer.length) {
      console.log('✅ PDF integrity check passed');
    } else {
      console.error('❌ PDF integrity check failed');
    }

  } catch (error) {
    console.error('❌ Error in PDF generation:', error);
    process.exit(1);
  }
}

debugPdfGeneration();