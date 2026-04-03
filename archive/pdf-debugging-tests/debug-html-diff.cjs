/**
 * Debug HTML content differences between working and API
 */

const fs = require('fs');
const path = require('path');
const { calculateCosts, renderTemplate } = require('./src/pdf-report/generate-report.cjs');

function debugHtmlDiff() {
  console.log('🔍 Comparing HTML content between working and API...\n');

  const testData = {
    companyName: 'RB2',
    monthlyVolume: 225,
    timePerPO: 18,
    errorRate: 12,
    erpSystem: 'Business Central'
  };

  const data = calculateCosts(testData);
  const templatePath = path.join(__dirname, 'src', 'pdf-report', 'template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // WORKING TEST VERSION (same as test-lead-flow.cjs)
  let workingHtml = renderTemplate(templateHtml, data);

  // Logo handling from working test
  const workingLogoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(workingLogoPath)) {
    const logoData = fs.readFileSync(workingLogoPath, 'base64');
    workingHtml = workingHtml.replace(
      /src="[^"]*logo\.svg"/g,
      `src="data:image/svg+xml;base64,${logoData}"`
    );
  }

  // API VERSION (same as API generate-and-send.cjs)
  let apiHtml = renderTemplate(templateHtml, data);

  // Logo handling from API
  const apiLogoPath = path.join(__dirname, 'public', 'logo.svg');
  if (fs.existsSync(apiLogoPath)) {
    const logoData = fs.readFileSync(apiLogoPath, 'base64');
    apiHtml = apiHtml.replace(
      /src="[^"]*orderpilot-logo-icon\.svg"/g,
      `src="data:image/svg+xml;base64,${logoData}"`
    );
  }

  console.log('📊 COMPARISON RESULTS:');
  console.log(`Working HTML length: ${workingHtml.length} chars`);
  console.log(`API HTML length:     ${apiHtml.length} chars`);
  console.log(`HTML identical:      ${workingHtml === apiHtml}`);

  // Save both for comparison
  fs.writeFileSync('./debug-working.html', workingHtml);
  fs.writeFileSync('./debug-api.html', apiHtml);
  console.log('\n📁 Saved: debug-working.html and debug-api.html');

  // Check logo replacements
  const workingLogoMatches = (workingHtml.match(/data:image\/svg\+xml;base64,/g) || []).length;
  const apiLogoMatches = (apiHtml.match(/data:image\/svg\+xml;base64,/g) || []).length;

  console.log(`\n🖼️ LOGO ANALYSIS:`);
  console.log(`Working version logo embeds: ${workingLogoMatches}`);
  console.log(`API version logo embeds:     ${apiLogoMatches}`);

  // Check template references
  const templateLogoRefs = (templateHtml.match(/orderpilot-logo-icon\.svg/g) || []).length;
  const templateLogoRefsAlt = (templateHtml.match(/logo\.svg/g) || []).length;

  console.log(`\n📝 TEMPLATE ANALYSIS:`);
  console.log(`Template refs to 'orderpilot-logo-icon.svg': ${templateLogoRefs}`);
  console.log(`Template refs to 'logo.svg': ${templateLogoRefsAlt}`);

  if (workingHtml !== apiHtml) {
    console.log('\n⚠️  HTML CONTENT DIFFERS - this is likely the root cause');
  } else {
    console.log('\n✅ HTML content identical - problem is elsewhere');
  }
}

debugHtmlDiff();