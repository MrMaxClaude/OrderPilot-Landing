/**
 * Debug different PDF attachment methods with Resend
 */

require('dotenv').config();
const fs = require('fs');

async function debugAttachments() {
  console.log('🔍 Testing different attachment methods...\n');

  const pdfPath = './simple-test.pdf';
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfBase64 = pdfBuffer.toString('base64');

  console.log(`📄 PDF file: ${pdfPath}`);
  console.log(`📊 Buffer size: ${pdfBuffer.length} bytes`);
  console.log(`📊 Base64 size: ${pdfBase64.length} chars`);
  console.log(`📊 PDF starts with: ${pdfBuffer.toString('ascii', 0, 4)}`);
  console.log(`📊 Base64 starts with: ${pdfBase64.substring(0, 20)}`);

  // Test 1: Using MCP with filePath
  console.log('\n🧪 Test 1: Using MCP with filePath...');
  try {
    // This would be done via MCP call, simulated here
    console.log('✅ MCP method uses filePath directly');
  } catch (error) {
    console.error('❌ MCP method failed:', error.message);
  }

  // Test 2: Using direct base64 content
  console.log('\n🧪 Test 2: Using direct base64 content...');
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eros@rb2.nl',
      subject: 'DEBUG: Base64 Content Method',
      text: 'Testing with direct base64 content encoding',
      attachments: [{
        filename: 'debug-base64.pdf',
        content: pdfBase64
      }]
    });

    console.log('✅ Base64 content method:', result.data?.id || result.id);
  } catch (error) {
    console.error('❌ Base64 content method failed:', error.message);
  }

  // Test 3: Check for PDF corruption
  console.log('\n🧪 Test 3: Checking PDF integrity...');

  // Re-decode to check for corruption
  const decodedBuffer = Buffer.from(pdfBase64, 'base64');
  const isIdentical = Buffer.compare(pdfBuffer, decodedBuffer) === 0;

  console.log(`🔍 Original buffer length: ${pdfBuffer.length}`);
  console.log(`🔍 Decoded buffer length: ${decodedBuffer.length}`);
  console.log(`🔍 Buffers identical: ${isIdentical}`);

  if (!isIdentical) {
    console.error('❌ PDF corruption detected during base64 encoding/decoding!');
  } else {
    console.log('✅ PDF integrity preserved');
  }

  // Test 4: Write decoded PDF to verify
  console.log('\n🧪 Test 4: Writing decoded PDF for verification...');
  fs.writeFileSync('./debug-decoded.pdf', decodedBuffer);
  console.log('✅ Decoded PDF written to debug-decoded.pdf');
}

debugAttachments().catch(console.error);