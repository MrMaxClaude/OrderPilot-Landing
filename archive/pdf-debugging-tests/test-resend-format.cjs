/**
 * Test exact Resend documentation format for PDF attachments
 */

require('dotenv').config();
const fs = require('fs');
const { Resend } = require('resend');

async function testResendFormat() {
  console.log('🧪 Testing exact Resend documentation format...');

  try {
    // Read a simple PDF
    const pdfBuffer = fs.readFileSync('./simple-test.pdf');
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log(`📄 PDF size: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`📄 Base64 size: ${(pdfBase64.length / 1024).toFixed(1)}KB`);

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Test 1: Exact Resend docs format (no contentType)
    console.log('📧 Test 1: Resend docs format (no contentType)...');
    const result1 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'Test: Resend Docs Format (no contentType)',
      text: 'Testing exact Resend documentation format without contentType parameter.',
      attachments: [
        {
          filename: 'test-docs-format.pdf',
          content: pdfBase64,
          // NO contentType parameter
        },
      ],
    });

    console.log('✅ Test 1 sent:', result1.data?.id || result1.id);

    // Test 2: With contentType (our current approach)
    console.log('📧 Test 2: With contentType (current approach)...');
    const result2 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'Test: With contentType',
      text: 'Testing with contentType parameter (our current approach).',
      attachments: [
        {
          filename: 'test-with-contenttype.pdf',
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('✅ Test 2 sent:', result2.data?.id || result2.id);

    // Test 3: Check if size is the issue (40MB limit)
    const sizeAfterEncoding = pdfBase64.length;
    const sizeInMB = sizeAfterEncoding / (1024 * 1024);
    console.log(`📊 Size check: ${sizeInMB.toFixed(2)}MB (limit: 40MB)`);

    if (sizeInMB > 40) {
      console.error('❌ Size exceeds 40MB limit!');
    } else {
      console.log('✅ Size within 40MB limit');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testResendFormat();