# OrderPilot Contact Form Email Setup

## ✅ Implementation Complete

The contact form now sends emails to your inbox and provides auto-confirmation to leads.

## Configuration

### Current Settings
- **Notification Email:** eros@rb2.nl (receives all form submissions)
- **From Email:** noreply@orderpilot.com
- **Email Service:** Resend (API key configured)

### To Change Email Recipients
Edit `server.js` line 31:
```javascript
to: 'eros@rb2.nl', // Change this to your preferred email
```

## Testing Instructions

1. **Start the servers:**
   ```bash
   npm run dev:full
   # Or run separately:
   npm run server  # Backend on :3001
   npm run dev     # Frontend on :3000
   ```

2. **Submit a test form:**
   - Go to http://localhost:3002/#contact
   - Fill out the form with test data
   - Submit

3. **What happens:**
   - You receive an email at eros@rb2.nl with the lead info
   - The lead receives a confirmation email
   - Form shows success message
   - PostHog tracks the submission

## Email Templates

### Notification Email (to your team)
- Subject: "New OrderPilot Lead - [Company Name]"
- Contains all form data
- Reply-to is set to the lead's email

### Confirmation Email (to the lead)
- Professional branded template
- Sets expectations (2 hour response time)
- Includes next steps

## Production Deployment

Before deploying to production:

1. **Update environment variables:**
   - Set `VITE_API_URL` to your production backend URL
   - Ensure `RESEND_API_KEY` is set in production env

2. **Update email settings:**
   - Change notification email from eros@rb2.nl to final recipient
   - Verify domain in Resend dashboard for better deliverability

3. **CORS configuration:**
   - Update `server.js` CORS settings for your production domain

## Troubleshooting

- **Emails not sending:** Check Resend dashboard for API logs
- **CORS errors:** Ensure backend is running on port 3001
- **Form not submitting:** Check browser console for errors

## Files Modified

- `server.js` - Backend API with email endpoints
- `components/DemoForm.tsx` - Updated form with API integration
- `.env` - Added API URL and Resend config
- `package.json` - Added server scripts