/**
 * Test with EXACT attachment config from working tests
 */

require('dotenv').config();
const fs = require('fs');

async function testExactAttachment() {
  console.log('🧪 Testing EXACT attachment config from working tests...\n');

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Use same PDF
  const pdfBuffer = fs.readFileSync('./exact-1019-test.pdf');

  // Try DIFFERENT attachment configurations

  // Test 1: Exact same as working ROOT CAUSE tests
  console.log('📧 Test 1: ROOT CAUSE attachment format...');
  const result1 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ATTACHMENT TEST 1: Root Cause Format',
    text: 'Testing exact attachment format from working ROOT CAUSE tests',
    attachments: [{
      filename: 'test1-rootcause-format.pdf',
      content: pdfBuffer.toString('base64'),
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ Test 1 sent:', result1.data?.id || result1.id);

  // Test 2: Exact same as working MCP test
  console.log('\n📧 Test 2: MCP filePath format...');
  const result2 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ATTACHMENT TEST 2: MCP Format',
    text: 'Testing MCP filePath format that worked',
    attachments: [{
      filename: 'test2-mcp-format.pdf',
      filePath: './exact-1019-test.pdf',
    }],
  });
  console.log('✅ Test 2 sent:', result2.data?.id || result2.id);

  // Test 3: Try WITHOUT contentType
  console.log('\n📧 Test 3: NO contentType...');
  const result3 = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'eros@rb2.nl',
    subject: 'ATTACHMENT TEST 3: No ContentType',
    text: 'Testing without contentType parameter',
    attachments: [{
      filename: 'test3-no-contenttype.pdf',
      content: pdfBuffer.toString('base64'),
      // NO contentType
    }],
  });
  console.log('✅ Test 3 sent:', result3.data?.id || result3.id);

  console.log('\n🧪 Testing 3 different attachment configurations...');
  console.log('One of these MUST work if the issue is attachment format!');
}

testExactAttachment().catch(console.error);