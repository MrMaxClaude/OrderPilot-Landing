/**
 * Test the automated PDF generation and email with the fixed attachment
 */

require('dotenv').config();
const { generatePdfBuffer } = require('./src/pdf-report/api/generate-and-send.cjs');

async function testAutomatedPdf() {
  console.log('🧪 Testing automated PDF generation with fixed attachment...\n');

  try {
    // Test data
    const input = {
      companyName: 'RB2 Test',
      monthlyVolume: 150,
      timePerPO: 20,
      errorRate: 15,
      erpSystem: 'SAP'
    };

    console.log('📊 Generating PDF with automated pipeline...');
    const { pdfBuffer, data } = await generatePdfBuffer(input);

    console.log(`✅ PDF generated: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`📈 Annual savings: ${data.annualSavings}`);

    // Save to file for verification
    const fs = require('fs');
    fs.writeFileSync('./automated-test.pdf', pdfBuffer);
    console.log('💾 Saved as automated-test.pdf');

    // Test the fixed email sending
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('\n📧 Sending email with fixed attachment format...');
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'FIXED: Automated PDF Test - No More Corruption',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10B981;">✅ PDF Generation Fixed!</h2>
          <p>This email contains an automatically generated PDF using the fixed pipeline.</p>
          <div style="background: #ECFDF5; border-left: 3px solid #10B981; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #111827;">
              <strong>Fix Applied:</strong> Changed 'type' to 'contentType' in attachment<br>
              <strong>PDF Details:</strong><br>
              • Company: ${input.companyName}<br>
              • Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB<br>
              • Annual Savings: ${data.annualSavings}
            </p>
          </div>
          <p style="color: #6B7280;">This PDF should now open correctly without corruption.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'OrderPilot-Fixed-Test.pdf',
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf', // FIXED: was 'type' before
        },
      ],
    });

    console.log('✅ Fixed email sent:', result.data?.id || result.id);
    console.log('📬 Check eros@rb2.nl for the working PDF attachment');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAutomatedPdf();