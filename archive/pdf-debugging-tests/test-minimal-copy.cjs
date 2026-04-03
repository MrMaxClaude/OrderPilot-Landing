/**
 * MINIMAL copy of exact working email format
 */

require('dotenv').config();
const fs = require('fs');

async function minimalTest() {
  console.log('🧪 MINIMAL copy of working email format...\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Use working PDF
  const workingPdf = fs.readFileSync('./exact-1019-test.pdf');

  console.log(`📊 Using working PDF: ${(workingPdf.length / 1024).toFixed(1)}KB`);

  // EXACT MINIMAL email like the working ones
  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'MINIMAL TEST: Same PDF Different Email',
    text: 'Minimal text email with known working PDF',
    attachments: [{
      filename: 'minimal-test.pdf',
      content: workingPdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });

  console.log('✅ Minimal test sent:', result.data?.id || result.id);
  console.log('📬 Same PDF, simplest possible email format');
}

minimalTest().catch(console.error);