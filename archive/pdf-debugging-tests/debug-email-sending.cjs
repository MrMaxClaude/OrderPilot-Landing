/**
 * Debug email sending with exact same code as lead flow
 */

require('dotenv').config();
const fs = require('fs');

async function debugEmailSending() {
  console.log('🔍 DEBUGGING EMAIL SENDING\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Test 1: Use KNOWN WORKING simple PDF with EXACT lead flow email code
  console.log('📧 Test 1: Simple PDF (known working) with lead flow email format...');

  const simplePdf = fs.readFileSync('./simple-test.pdf');
  const pdfBase64 = simplePdf.toString('base64');

  console.log(`   PDF size: ${(simplePdf.length / 1024).toFixed(1)}KB`);
  console.log(`   Base64 size: ${(pdfBase64.length / 1024).toFixed(1)}KB`);

  const testData = {
    email: 'eros@rb2.nl',
    firstName: 'Eros',
    companyName: 'RB2-Test'
  };

  // EXACT SAME EMAIL CODE AS LEAD FLOW
  const personalGreeting = testData.firstName ? `Hi ${testData.firstName}` : (testData.companyName ? `Hi ${testData.companyName} team` : 'Hi');

  const result1 = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>',
    to: testData.email,
    subject: `DEBUG: Simple PDF with lead flow format`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 15px; color: #111827;">${personalGreeting},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Your personalized PO Processing Cost Analysis is ready and attached to this email.
        </p>
        <div style="background: #FFF7ED; border-left: 3px solid #FF6321; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #111827;">
            <strong>DEBUG:</strong> This is the simple 62KB PDF that we know works, but using exact lead flow email format.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `OrderPilot-Cost-Analysis-${(testData.companyName || 'Report').replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBase64,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log('✅ Test 1 sent:', result1.data?.id || result1.id);

  // Test 2: Use latest generated PDF but with SIMPLE email format
  console.log('\n📧 Test 2: Latest PDF with simple email format...');

  const latestPdf = fs.readFileSync('./test-output.pdf');
  const latestBase64 = latestPdf.toString('base64');

  console.log(`   PDF size: ${(latestPdf.length / 1024).toFixed(1)}KB`);
  console.log(`   Base64 size: ${(latestBase64.length / 1024).toFixed(1)}KB`);

  const result2 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'DEBUG: Latest PDF with simple format',
    text: 'Simple email format with latest generated PDF',
    attachments: [{
      filename: 'latest-simple-format.pdf',
      content: latestBase64,
      contentType: 'application/pdf',
    }],
  });

  console.log('✅ Test 2 sent:', result2.data?.id || result2.id);

  console.log('\n🧪 ANALYSIS:');
  console.log('Test 1: Known working PDF + lead flow email format');
  console.log('Test 2: Latest PDF + simple email format');
  console.log('This will isolate if the problem is PDF generation or email formatting');
}

debugEmailSending().catch(console.error);