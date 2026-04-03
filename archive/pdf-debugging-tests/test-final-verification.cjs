/**
 * Final verification test
 */

require('dotenv').config();
const fs = require('fs');

async function finalTest() {
  console.log('🔍 FINAL VERIFICATION TEST\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Test the EXACT same PDF that ROOT CAUSE 3 used (which worked)
  console.log('📧 Sending EXACT same PDF as ROOT CAUSE 3 (which worked)...');
  const samePdf = fs.readFileSync('./fixed-api-test.pdf');

  console.log(`📊 File stats:`);
  console.log(`  Size: ${(samePdf.length / 1024).toFixed(1)}KB`);
  console.log(`  Modified: ${fs.statSync('./fixed-api-test.pdf').mtime}`);
  console.log(`  First 20 bytes: ${samePdf.subarray(0, 20).toString('hex')}`);

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'FINAL TEST: Same PDF as ROOT CAUSE 3',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2>🔍 Final Verification</h2>
        <p>This is the EXACT same PDF file that was used in ROOT CAUSE 3 test, which you confirmed worked.</p>
        <p><strong>File:</strong> fixed-api-test.pdf</p>
        <p><strong>Size:</strong> ${(samePdf.length / 1024).toFixed(1)}KB</p>
        <p><strong>Created:</strong> ${fs.statSync('./fixed-api-test.pdf').mtime}</p>
        <p>If this fails but ROOT CAUSE 3 worked, something is very weird.</p>
      </div>
    `,
    attachments: [{
      filename: 'Same-As-Root-Cause-3.pdf',
      content: samePdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });

  console.log('✅ Final test sent:', result.data?.id || result.id);
  console.log('\nThis should behave EXACTLY like ROOT CAUSE 3 which worked.');
}

finalTest().catch(console.error);