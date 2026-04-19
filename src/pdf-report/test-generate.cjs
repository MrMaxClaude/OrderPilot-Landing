/**
 * OrderPilot - Test Report Generator
 *
 * Generates preview HTML files for 3 scenarios:
 *   - Low volume (small company, 25 POs/month)
 *   - Medium volume (target market, 225 POs/month)
 *   - High volume (enterprise, 400 POs/month)
 *
 * Usage:
 *   node test-generate.cjs           → HTML previews only
 *   node test-generate.cjs --pdf     → HTML previews + PDFs
 */

const path = require('path');
const { calculateCosts, generatePreview, generateReport } = require('./generate-report.cjs');

const scenarios = [
  {
    name: 'low',
    input: {
      companyName: 'Small Trading BV',
      monthlyVolume: 25,
      timePerPO: 12,
      errorRate: 8,
      erpSystem: 'Exact',
    },
  },
  {
    name: 'medium',
    input: {
      companyName: 'MidMarket Industries',
      monthlyVolume: 225,
      timePerPO: 18,
      errorRate: 12,
      erpSystem: 'SAP',
    },
  },
  {
    name: 'high',
    input: {
      companyName: 'Enterprise Manufacturing Group',
      monthlyVolume: 400,
      timePerPO: 22,
      errorRate: 15,
      erpSystem: 'Oracle',
    },
  },
];

async function run() {
  const generatePdf = process.argv.includes('--pdf');

  console.log('');
  console.log('OrderPilot - Cost Report Test Generator');
  console.log('═══════════════════════════════════════');
  console.log('');

  for (const scenario of scenarios) {
    const data = calculateCosts(scenario.input);

    console.log(`  ${scenario.name.toUpperCase()} scenario: ${scenario.input.companyName}`);
    console.log(`  ├── Volume: ${scenario.input.monthlyVolume} POs/month`);
    console.log(`  ├── Total cost: ${data.totalAnnualCost}/year`);
    console.log(`  ├── Cost per PO: ${data.costPerPO}`);
    console.log(`  ├── Annual savings: ${data.annualSavings}`);
    console.log(`  └── ROI: ${data.roiMultiple}x`);
    console.log('');

    // Generate HTML preview
    const previewPath = path.join(__dirname, 'output', `preview-${scenario.name}.html`);
    generatePreview(scenario.input, previewPath);
    console.log(`  ✓ HTML preview: output/preview-${scenario.name}.html`);

    // Generate PDF if requested
    if (generatePdf) {
      try {
        const result = await generateReport(scenario.input);
        console.log(`  ✓ PDF: ${path.basename(result.outputPath)}`);
      } catch (err) {
        console.log(`  ✗ PDF failed: ${err.message}`);
      }
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log('  Done! Open preview files in browser:');
  console.log('  open output/preview-medium.html');
  console.log('');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
