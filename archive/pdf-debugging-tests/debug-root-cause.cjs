/**
 * Debug the root cause systematically
 */

require('dotenv').config();
const fs = require('fs');

async function debugRootCause() {
  console.log('🔍 SYSTEMATIC ROOT CAUSE ANALYSIS\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Test 1: Simple static PDF (simple-test.pdf) - KNOWN TO WORK
  console.log('📧 Test 1: Simple static PDF (62KB, known working)...');
  const simplePdf = fs.readFileSync('./simple-test.pdf');
  const result1 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ROOT CAUSE 1: Simple Static PDF',
    text: '62KB static PDF - should work',
    attachments: [{
      filename: 'test1-simple.pdf',
      content: simplePdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Sent:', result1.data?.id || result1.id);

  // Test 2: Working 10:19 PDF (test-output.pdf) - KNOWN TO WORK
  console.log('\n📧 Test 2: Working 10:19 PDF (661KB, confirmed working)...');
  const working1019 = fs.readFileSync('./test-output.pdf');
  const result2 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ROOT CAUSE 2: Working 10:19 PDF',
    text: '661KB PDF from working 10:19 test - should work',
    attachments: [{
      filename: 'test2-working-1019.pdf',
      content: working1019.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Sent:', result2.data?.id || result2.id);

  // Test 3: Latest API generated PDF (fixed-api-test.pdf) - UNKNOWN
  console.log('\n📧 Test 3: Latest API PDF (741KB, with logo fix)...');
  const apiPdf = fs.readFileSync('./fixed-api-test.pdf');
  const result3 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ROOT CAUSE 3: Latest API PDF',
    text: '741KB API generated PDF with logo fix - status unknown',
    attachments: [{
      filename: 'test3-api-latest.pdf',
      content: apiPdf.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Sent:', result3.data?.id || result3.id);

  // Analysis
  console.log('\n🧪 ANALYSIS:');
  console.log('Test 1 (62KB static): Should work ✅');
  console.log('Test 2 (661KB working): Should work ✅');
  console.log('Test 3 (741KB API): Will reveal if API generation is still broken');
  console.log('\nIf Test 3 fails but Test 2 works, the issue is in PDF generation.');
  console.log('If all tests work, the issue was resolved.');
  console.log('If all tests fail, the issue is in our email sending method.');

  // File comparison
  console.log('\n📊 FILE COMPARISON:');
  console.log(`Simple PDF:    ${fs.statSync('./simple-test.pdf').size} bytes`);
  console.log(`Working 10:19: ${fs.statSync('./test-output.pdf').size} bytes`);
  console.log(`API Latest:    ${fs.statSync('./fixed-api-test.pdf').size} bytes`);

  // Binary diff check
  const working = fs.readFileSync('./test-output.pdf');
  const latest = fs.readFileSync('./fixed-api-test.pdf');

  console.log('\n🔍 BINARY COMPARISON:');
  console.log(`Working PDF first 50 bytes: ${working.subarray(0, 50).toString('hex')}`);
  console.log(`Latest PDF first 50 bytes:  ${latest.subarray(0, 50).toString('hex')}`);
  console.log(`First 50 bytes identical: ${Buffer.compare(working.subarray(0, 50), latest.subarray(0, 50)) === 0}`);
}

debugRootCause().catch(console.error);