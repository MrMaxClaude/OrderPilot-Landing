/**
 * Simple test of the contentType fix without puppeteer
 */

require('dotenv').config();
const fs = require('fs');

async function testContentTypeFix() {
  console.log('🧪 Testing contentType fix with existing PDF...\n');

  try {
    // Use an existing working PDF
    const pdfBuffer = fs.readFileSync('./simple-test.pdf');
    console.log(`📄 Using existing PDF: ${(pdfBuffer.length / 1024).toFixed(1)}KB`);

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Test 1: OLD way (with 'type' - should fail/corrupt)
    console.log('📧 Test 1: OLD method (type instead of contentType)...');
    const result1 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'COMPARISON: OLD Method (type parameter)',
      text: 'This uses the OLD attachment format that causes corruption.',
      attachments: [
        {
          filename: 'old-method.pdf',
          content: pdfBuffer.toString('base64'),
          type: 'application/pdf', // OLD way - this might cause corruption
        },
      ],
    });

    console.log('✅ OLD method sent:', result1.data?.id || result1.id);

    // Test 2: NEW way (with 'contentType' - should work)
    console.log('📧 Test 2: NEW method (contentType)...');
    const result2 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'COMPARISON: NEW Method (contentType parameter)',
      text: 'This uses the FIXED attachment format with contentType.',
      attachments: [
        {
          filename: 'new-method.pdf',
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf', // NEW way - this should work
        },
      ],
    });

    console.log('✅ NEW method sent:', result2.data?.id || result2.id);
    console.log('\n📬 Check both emails in eros@rb2.nl to compare PDF attachments');
    console.log('🔍 The NEW method PDF should open correctly, OLD might be corrupted');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testContentTypeFix();