import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, company, poVolume, message } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !company || !poVolume) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Send notification email to sales team
    const notificationEmail = await resend.emails.send({
      from: 'OrderPilot <noreply@resend.dev>',  // Using Resend's test domain for now
      to: 'eros@rb2.nl',
      reply_to: email,
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

    // 2. Send confirmation email to the lead
    const confirmationEmail = await resend.emails.send({
      from: 'OrderPilot <noreply@resend.dev>',  // Using Resend's test domain for now
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

    console.log('Emails sent successfully:', {
      notification: notificationEmail.data?.id,
      confirmation: confirmationEmail.data?.id
    });

    res.json({
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Resend API Key configured:', !!process.env.RESEND_API_KEY);
});