/**
 * OrderPilot — Vercel serverless: POST /api/contact
 * Mirrors server.js contact handler; notifies team + sends confirmation to lead.
 */

import { Resend } from 'resend';

const CONTACT_EMAIL = 'info@order-pilot.ai';

function parseJsonBody(req) {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8') || '{}');
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' ? raw : {};
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = parseJsonBody(req);
  const { firstName, lastName, email, company, poVolume, message } = body;

  if (!firstName || !lastName || !email || !company || !poVolume) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set (Vercel → Environment Variables)');
    return res.status(503).json({
      error: 'Email service is not configured',
      code: 'missing_resend_key',
    });
  }

  const notifyTo = process.env.CONTACT_NOTIFY_TO || CONTACT_EMAIL;
  const fromAddress =
    process.env.RESEND_CONTACT_FROM ||
    process.env.RESEND_FROM ||
    'OrderPilot <onboarding@resend.dev>';

  try {
    const resend = new Resend(apiKey);

    const notificationEmail = await resend.emails.send({
      from: fromAddress,
      to: notifyTo,
      replyTo: email,
      subject: `New OrderPilot Lead - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">New Lead from OrderPilot</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Monthly PO Volume:</strong> ${poVolume}</p>
            ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action Required:</strong> Reply directly to this email to contact the lead.</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This lead was submitted via the OrderPilot website contact form.</p>
        </div>
      `,
    });

    if (notificationEmail.error) {
      console.error('Resend notification error:', notificationEmail.error);
      return res.status(502).json({
        error: 'Failed to send notification email',
        details: notificationEmail.error.message || String(notificationEmail.error),
      });
    }

    const confirmationEmail = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Thank you for your interest in OrderPilot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Reaching Out!</h1>
          </div>

          <div style="padding: 40px 20px; background: #ffffff;">
            <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>

            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for your interest in OrderPilot. We've received your inquiry and will typically respond within 24 hours.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #FF6B35;">What happens next?</h3>
              <ul style="font-size: 15px; line-height: 1.8;">
                <li>Our specialist will review your requirements</li>
                <li>We'll schedule a brief call to understand your PO processing challenges</li>
                <li>If OrderPilot is a good fit, we'll provide a personalized demo</li>
                <li>You'll receive a custom ROI calculation for your business</li>
              </ul>
            </div>

            <p style="font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our <a href="https://orderpilot.com/calculator" style="color: #FF6B35;">ROI Calculator</a> to see potential savings for your business.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Questions? Email us at <a href="mailto:${CONTACT_EMAIL}" style="color: #FF6B35;">${CONTACT_EMAIL}</a>.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The OrderPilot Team</strong>
            </p>
          </div>

          <div style="padding: 20px; background: #f8f9fa; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              OrderPilot - Automating Purchase Order Processing<br>
              <a href="https://orderpilot.com" style="color: #FF6B35;">orderpilot.com</a>
            </p>
          </div>
        </div>
      `,
    });

    if (confirmationEmail.error) {
      console.error('Resend confirmation error:', confirmationEmail.error);
      return res.status(502).json({
        error: 'Failed to send confirmation email',
        details: confirmationEmail.error.message || String(confirmationEmail.error),
      });
    }

    console.log('Contact form emails sent:', {
      notification: notificationEmail.data?.id,
      confirmation: confirmationEmail.data?.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
