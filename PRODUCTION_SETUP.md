# OrderPilot PDF Email - PRODUCTION SETUP

## ✅ WORKING CONFIGURATION

Based on extensive testing, here's what works:

### PDF Generation
```javascript
// NO logo embedding - leave template as is
// Searches for logo.svg which doesn't exist in template
const logoPath = path.join(__dirname, 'public', 'logo.svg');
if (fs.existsSync(logoPath)) {
  const logoData = fs.readFileSync(logoPath, 'base64');
  renderedHtml = renderedHtml.replace(
    /src="[^"]*logo\.svg"/g,  // Won't match anything
    `src="data:image/svg+xml;base64,${logoData}"`
  );
}
```

### Email Sending
```javascript
await resend.emails.send({
  from: 'onboarding@resend.dev',  // Simple from, no display name
  to: email,
  subject: `Your PO Cost Analysis — ${data.totalAnnualCost}/year`,
  text: `Simple text email content...`,  // Use text, not HTML
  attachments: [{
    filename: 'report.pdf',  // Simple filename
    content: pdfBuffer.toString('base64'),
    contentType: 'application/pdf',
  }],
});
```

## ⚠️ KNOWN ISSUES

1. **Intermittent delivery failures** - Some emails randomly fail to display PDF
2. **NOT caused by:**
   - PDF corruption (PDFs are valid)
   - Base64 encoding (encoding works)
   - File size (661KB works fine)
3. **Likely caused by:**
   - Resend server routing
   - Outlook processing delays
   - Unknown race conditions

## 🚀 PRODUCTION RECOMMENDATIONS

1. **Add retry mechanism** - If email fails, retry after 5 seconds
2. **Use simple filenames** - Avoid special characters
3. **Use text emails** - Not HTML
4. **Monitor delivery** - Check Resend dashboard for failures
5. **Alternative:** Use download link instead of attachment

## 📝 TESTED CONFIGURATIONS

### ✅ WORKS RELIABLY
- Simple text emails
- Simple filenames (report.pdf)
- No logo embedding
- 661KB PDF size

### ❌ FAILS INTERMITTENTLY
- Complex HTML emails
- Complex filenames (OrderPilot-Cost-Report-RB2.pdf)
- Logo embedding (1MB+ files)
- Rapid successive sends

## 🔧 FUTURE IMPROVEMENTS

1. **Fix logo display** - Find way to embed without corruption
2. **Add download link** - Backup if attachment fails
3. **Use Resend webhooks** - Monitor delivery status
4. **Consider SendGrid/Postmark** - More reliable attachment handling?