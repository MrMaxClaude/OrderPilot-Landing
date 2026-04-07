/**
 * HTML body for the PDF cost-analysis delivery email (Resend).
 * Minimal, table-light layout; inline styles for client compatibility.
 */

'use strict';

function getSiteUrl() {
  if (process.env.SITE_URL) {
    return String(process.env.SITE_URL).replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    const host = String(process.env.VERCEL_URL).replace(/^https?:\/\//, '');
    return `https://${host}`;
  }
  return 'https://orderpilot.com';
}

/** Footer website (display + canonical URL) */
const FOOTER_SITE_LABEL = 'Order-pilot.ai';
const FOOTER_SITE_URL = 'https://order-pilot.ai';

/**
 * @param {{ personalGreeting: string; data: Record<string, unknown> }} opts
 */
function buildReportDeliveryEmailHtml({ personalGreeting, data }) {
  const siteUrl = getSiteUrl();
  const contactFormUrl = `${siteUrl}/#contact?utm_source=pdf&utm_medium=email&utm_campaign=cost_analysis`;

  const erpSystem = typeof data.erpSystem === 'string' ? data.erpSystem : 'ERP';
  const roiMultiple = data.roiMultiple != null ? String(data.roiMultiple) : '—';
  const totalAnnualCost = String(data.totalAnnualCost ?? '');
  const annualSavings = String(data.annualSavings ?? '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OrderPilot Cost Analysis</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#141414;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="font-size:16px;color:#141414;">
              <p style="margin:0 0 16px 0;">${personalGreeting},</p>
              <p style="margin:0 0 24px 0;color:#4A4A4A;font-size:15px;">
                Your personalized PO Processing Cost Analysis is ready and attached to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FAF6F0;border-left:4px solid #FF6321;padding:18px 20px;margin:0;">
              <p style="margin:0;font-size:15px;line-height:1.65;color:#141414;">
                <strong>Key insight:</strong> Your current manual processing costs
                <strong style="color:#FF6321;">${totalAnnualCost}/year</strong>.
                With OrderPilot automation, you could save
                <strong style="color:#10B981;">${annualSavings}/year</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:28px;font-size:15px;color:#141414;">
              <p style="margin:0 0 10px 0;font-weight:700;">The report includes:</p>
              <ul style="margin:0 0 0 20px;padding:0;color:#4A4A4A;line-height:1.7;">
                <li style="margin-bottom:8px;">Detailed breakdown of your current costs</li>
                <li style="margin-bottom:8px;">Industry benchmarks for companies your size</li>
                <li style="margin-bottom:8px;">ROI calculation showing ${roiMultiple}x return</li>
                <li style="margin-bottom:8px;">90-day implementation roadmap</li>
                <li style="margin-bottom:8px;">${erpSystem}-specific integration guide</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 0 24px 0;">
              <a href="${contactFormUrl}" style="display:inline-block;background-color:#FF6321;color:#ffffff !important;font-size:16px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;">
                Go to contact form
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#4A4A4A;padding-bottom:28px;">
              <p style="margin:0;">
                Want to discuss your specific results? Our procurement automation experts can show you exactly how to achieve these savings.
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #E5E7EB;padding-top:24px;text-align:center;font-size:12px;color:#8E8E8E;line-height:1.6;">
              <p style="margin:0 0 8px 0;">OrderPilot — AI-powered PO processing automation</p>
              <p style="margin:0;">
                <a href="${FOOTER_SITE_URL}" style="color:#FF6321;text-decoration:none;">${FOOTER_SITE_LABEL}</a>
                <span style="color:#D1D5DB;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a href="mailto:info@order-pilot.ai" style="color:#FF6321;text-decoration:none;">info@order-pilot.ai</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function reportDeliveryEmailSubject(data) {
  const total = data.totalAnnualCost != null ? String(data.totalAnnualCost) : '';
  return `Your PO Processing Cost Analysis — ${total}/year in hidden costs`;
}

module.exports = {
  getSiteUrl,
  buildReportDeliveryEmailHtml,
  reportDeliveryEmailSubject,
};
