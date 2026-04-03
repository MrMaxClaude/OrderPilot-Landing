/**
 * Deep debug PDF generation and encoding
 */

require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');

async function debugPdfDeep() {
  console.log('🔍 DEEP PDF ANALYSIS\n');

  // Compare all PDFs we have
  const pdfs = [
    { name: 'simple-test.pdf', desc: 'Static simple (WORKS)' },
    { name: 'exact-1019-test.pdf', desc: 'Generated at 12:33 (WORKS)' },
    { name: 'test-output.pdf', desc: 'Latest generated (FAILS)' },
    { name: 'fixed-api-test.pdf', desc: 'API generated (FAILS)' },
  ];

  console.log('📊 PDF COMPARISON:\n');

  for (const pdf of pdfs) {
    if (fs.existsSync(pdf.name)) {
      const buffer = fs.readFileSync(pdf.name);
      const stats = fs.statSync(pdf.name);

      // Get MD5 hash
      const hash = crypto.createHash('md5').update(buffer).digest('hex');

      // Check PDF header
      const header = buffer.toString('ascii', 0, 8);

      // Check for binary content
      let binaryCount = 0;
      for (let i = 0; i < Math.min(1000, buffer.length); i++) {
        if (buffer[i] > 127 || buffer[i] < 32) binaryCount++;
      }

      // Check base64 encoding
      const base64 = buffer.toString('base64');
      const base64Size = base64.length;
      const base64Valid = /^[A-Za-z0-9+/]*={0,2}$/.test(base64.substring(0, 100));

      console.log(`📄 ${pdf.desc}`);
      console.log(`   File: ${pdf.name}`);
      console.log(`   Size: ${buffer.length} bytes`);
      console.log(`   MD5: ${hash}`);
      console.log(`   Header: ${header}`);
      console.log(`   Binary ratio: ${(binaryCount/Math.min(1000, buffer.length)*100).toFixed(1)}%`);
      console.log(`   Base64 size: ${base64Size} chars`);
      console.log(`   Base64 valid: ${base64Valid}`);
      console.log(`   Modified: ${stats.mtime}`);
      console.log('');
    }
  }

  // Now test the EXACT difference in email sending
  console.log('🧪 TESTING PDF SENDING:\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Test 1: Send the WORKING PDF with base64
  console.log('📧 Test 1: Working PDF (exact-1019-test.pdf)...');
  const workingPdf = fs.readFileSync('./exact-1019-test.pdf');
  const result1 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'PDF DEBUG 1: Working PDF Base64',
    text: 'This uses the exact PDF that worked at 12:33',
    attachments: [{
      filename: 'working.pdf',
      content: workingPdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Test 1 sent:', result1.data?.id || result1.id);

  // Test 2: Send the FAILING PDF with base64
  console.log('\n📧 Test 2: Failing PDF (test-output.pdf)...');
  const failingPdf = fs.readFileSync('./test-output.pdf');
  const result2 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'PDF DEBUG 2: Failing PDF Base64',
    text: 'This uses the PDF that fails from 12:37',
    attachments: [{
      filename: 'failing.pdf',
      content: failingPdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Test 2 sent:', result2.data?.id || result2.id);

  // Test 3: Send with Buffer directly (not base64 string)
  console.log('\n📧 Test 3: Working PDF as Buffer...');
  const result3 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'PDF DEBUG 3: Buffer Direct',
    text: 'Testing with Buffer directly, not base64 string',
    attachments: [{
      filename: 'buffer.pdf',
      content: workingPdf,  // Send Buffer directly
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Test 3 sent:', result3.data?.id || result3.id);

  console.log('\n📊 ANALYSIS:');
  console.log('If Test 1 works and Test 2 fails = PDF generation issue');
  console.log('If both work = timing/rate limit issue');
  console.log('If Test 3 works better = base64 encoding issue');
}

debugPdfDeep().catch(console.error);