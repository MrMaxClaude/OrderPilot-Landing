/**
 * Test simple PDF generation to isolate the issue
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testSimplePdf() {
  console.log('🧪 Testing simple PDF generation...');

  const simpleHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test PDF</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          background: white;
        }
        h1 { color: #FF6321; }
        .box {
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>OrderPilot Test Report</h1>
      <div class="box">
        <h2>Company: RB2</h2>
        <p>Monthly Volume: 225 POs</p>
        <p>Annual Savings: €83,861</p>
      </div>
      <div class="box">
        <h3>Key Benefits</h3>
        <ul>
          <li>Automated PO processing</li>
          <li>ERP integration</li>
          <li>Error reduction</li>
        </ul>
      </div>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(simpleHtml, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    await browser.close();

    // Save the simple PDF
    const outputPath = path.join(__dirname, 'simple-test.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ Simple PDF generated: ${outputPath}`);
    console.log(`📏 Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

    return outputPath;

  } catch (error) {
    console.error('❌ Error generating simple PDF:', error);
    throw error;
  }
}

testSimplePdf();