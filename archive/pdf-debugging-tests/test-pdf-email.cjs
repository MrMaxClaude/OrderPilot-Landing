/**
 * Test PDF Email with Attachment
 * Focuses just on testing the attachment mechanism
 */

require('dotenv').config();
const fs = require('fs');

async function testPdfAttachment() {
  console.log('📧 Testing PDF attachment via Resend...\n');

  try {
    // Read the PDF file that was already generated
    const pdfPath = './test-output.pdf';
    if (!fs.existsSync(pdfPath)) {
      console.error('❌ PDF file not found. Run test-lead-flow.cjs first.');
      return;
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log(`📄 PDF loaded: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`📄 Base64 length: ${pdfBase64.length} chars`);
    console.log(`📄 Base64 preview: ${pdfBase64.substring(0, 50)}...\n`);

    // Send email with Resend SDK
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'OrderPilot <onboarding@resend.dev>',
      to: ['eros@rb2.nl'],
      subject: 'OrderPilot PDF Test - Real PDF Attachment',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111827;">PDF Attachment Test</h2>
          <p>This email should contain a PDF attachment with your OrderPilot cost analysis report.</p>
          <div style="background: #FFF7ED; border-left: 3px solid #FF6321; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #111827;">
              <strong>PDF Details:</strong><br>
              • Size: ${(pdfBuffer.length / 1024).toFixed(1)}KB<br>
              • Format: A4 PDF<br>
              • Pages: 6<br>
              • Content: Personalized cost analysis
            </p>
          </div>
          <p style="color: #6B7280;">If you can see this email but no attachment, there's an issue with the attachment format.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'OrderPilot-Cost-Analysis-Test.pdf',
          content: pdfBase64,
          contentType: 'application/pdf'
        },
      ],
    });

    console.log('✅ Email sent successfully');
    console.log('📬 Full result:', JSON.stringify(result, null, 2));
    console.log('📧 Check eros@rb2.nl for the email with PDF attachment\n');

    // Also test with MCP for comparison
    console.log('🔄 Testing same attachment via MCP...');

    // Note: We'll truncate the PDF for MCP test to avoid size issues
    const shortBase64 = pdfBase64.substring(0, 1000); // Just first 1000 chars for MCP test
    console.log(`📄 Truncated base64 for MCP: ${shortBase64.length} chars`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPdfAttachment();