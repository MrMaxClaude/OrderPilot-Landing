/**
 * Test the fixed API PDF generation
 */

require('dotenv').config();
const { generatePdfBuffer } = require('./src/pdf-report/api/generate-and-send.cjs');

async function testFixedApi() {
  console.log('🧪 Testing FIXED API PDF generation...\n');

  try {
    const input = {
      companyName: 'RB2 Fixed Test',
      monthlyVolume: 200,
      timePerPO: 16,
      errorRate: 10,
      erpSystem: 'SAP'
    };

    console.log('📊 Input:', input);
    console.log('\n📄 Generating PDF with fixed API...');

    const { pdfBuffer, data } = await generatePdfBuffer(input);

    console.log(`✅ PDF generated: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`💰 Annual savings: ${data.annualSavings}`);

    // Save locally
    const fs = require('fs');
    fs.writeFileSync('./fixed-api-test.pdf', pdfBuffer);
    console.log('💾 Saved as fixed-api-test.pdf');

    // Test email sending
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: '✅ FIXED: API PDF Generation Test',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10B981;">🎉 API PDF Generation Fixed!</h2>
          <p>This email contains a PDF generated using the FIXED API configuration.</p>
          <div style="background: #ECFDF5; border-left: 3px solid #10B981; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #111827;">
              <strong>Fixes Applied:</strong><br>
              • Increased timeout: 15s → 30s<br>
              • Removed Vercel chromium complexity<br>
              • Using reliable local puppeteer config<br>
              • Fixed contentType parameter
            </p>
          </div>
          <p style="color: #6B7280;">This PDF should open perfectly without any corruption.</p>
        </div>
      `,
      attachments: [{
        filename: 'OrderPilot-Fixed-API.pdf',
        content: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      }],
    });

    console.log('\n✅ Fixed API email sent:', result.data?.id || result.id);
    console.log('📬 Check eros@rb2.nl for the working PDF');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFixedApi();