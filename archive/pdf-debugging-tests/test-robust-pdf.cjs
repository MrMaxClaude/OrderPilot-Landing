/**
 * Generate robust PDF with additional validation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateRobustPdf() {
  console.log('🔧 Generating robust PDF...');

  const testData = {
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18,
    errorRate: 12,
    erpSystem: 'Business Central',
    totalAnnualCost: '€99.846',
    annualSavings: '€83.861',
    roiMultiple: '8.4x',
    year1Savings: '€83.861',
    year3Savings: '€251.583',
    paybackWeeks: '4',
    paybackMonths: '1'
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
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set a longer timeout
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);

    await page.setViewport({ width: 794, height: 1123 });

    // Load content with extended timeout
    await page.setContent(templateHtml, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
      timeout: 60000
    });

    // Wait for any animations/fonts
    await page.waitForTimeout(2000);

    // Generate PDF with more robust settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      timeout: 60000
    });

    await browser.close();

    // Save and validate
    const outputPath = path.join(__dirname, 'robust-output.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ Robust PDF generated`);
    console.log(`   📁 Path: ${outputPath}`);
    console.log(`   📏 Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

    // Validate PDF structure
    const pdfHeader = pdfBuffer.slice(0, 8);
    if (pdfHeader.toString('ascii').startsWith('%PDF-')) {
      console.log('✅ PDF header valid:', pdfHeader.toString('ascii'));
    } else {
      console.error('❌ Invalid PDF header');
      return;
    }

    // Check file can be read back
    const readBack = fs.readFileSync(outputPath);
    if (readBack.length === pdfBuffer.length) {
      console.log('✅ PDF file integrity confirmed');
    } else {
      console.error('❌ PDF file corruption detected');
    }

    return outputPath;

  } catch (error) {
    console.error('❌ Error generating robust PDF:', error);
    throw error;
  }
}

generateRobustPdf();