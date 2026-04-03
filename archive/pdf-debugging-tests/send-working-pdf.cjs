/**
 * Send the EXACT working PDF from 12:33 test
 */

require('dotenv').config();
const fs = require('fs');

async function sendWorkingPdf() {
  console.log('📧 Sending EXACT working PDF from 12:33 test...\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Use the EXACT PDF that worked at 12:33
  const workingPdf = fs.readFileSync('./exact-1019-test.pdf');

  console.log(`📊 Working PDF stats:`);
  console.log(`   Size: ${workingPdf.length} bytes (${(workingPdf.length/1024).toFixed(1)}KB)`);
  console.log(`   Created: ${fs.statSync('./exact-1019-test.pdf').mtime}`);

  const result = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>',
    to: 'eros@rb2.nl',
    subject: 'DIRECT SEND: Exact Working PDF from 12:33',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10B981;">📎 Direct Send of Working PDF</h2>
        <p>This is the EXACT PDF file that worked in the 12:33 test.</p>
        <p><strong>File:</strong> exact-1019-test.pdf</p>
        <p><strong>Size:</strong> ${workingPdf.length} bytes</p>
        <p><strong>Created:</strong> ${fs.statSync('./exact-1019-test.pdf').mtime}</p>
        <p>If this fails, something external changed between 12:33 and now.</p>
      </div>
    `,
    attachments: [{
      filename: 'Working-PDF-From-1233.pdf',
      content: workingPdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });

  console.log('✅ Exact working PDF sent:', result.data?.id || result.id);
  console.log('📬 This is literally the same file that worked 4 minutes ago');
}

sendWorkingPdf().catch(console.error);