/**
 * Send EXACT copy of ATTACHMENT TEST 1 that worked at 12:56
 */

require('dotenv').config();
const fs = require('fs');

async function testExactCopy() {
  console.log('🧪 EXACT COPY of ATTACHMENT TEST 1 that worked...\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Use EXACT same PDF
  const pdfBuffer = fs.readFileSync('./exact-1019-test.pdf');

  // EXACT copy of working test
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ATTACHMENT TEST 1: Root Cause Format',  // EXACT same subject
    text: 'Testing exact attachment format from working ROOT CAUSE tests',  // EXACT same text
    attachments: [{
      filename: 'test1-rootcause-format.pdf',  // EXACT same filename
      content: pdfBuffer.toString('base64'),
      contentType: 'application/pdf',
    }],
  });

  console.log('✅ Exact copy sent:', result.data?.id || result.id);
  console.log('📬 This is IDENTICAL to the test that worked at 12:56');
  console.log('   If this fails, something external has changed');
}

testExactCopy().catch(console.error);