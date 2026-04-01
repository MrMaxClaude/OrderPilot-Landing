# Email Test Log - Finding the Pattern

## WORKING EMAILS ✅

| Time | Test | From | Subject | Attachment | Size | Email Type |
|------|------|------|---------|------------|------|------------|
| 10:19 | test-lead-flow | OrderPilot <onboarding@resend.dev> | Your PO Cost Analysis | OrderPilot-Cost-Analysis-RB2.pdf | 750KB | HTML (complex) |
| 12:22 | ROOT CAUSE 1 | onboarding@resend.dev | ROOT CAUSE 1: Simple Static | test1-simple.pdf | 62KB | text |
| 12:22 | ROOT CAUSE 2 | onboarding@resend.dev | ROOT CAUSE 2: Working 10:19 | test2-working-1019.pdf | 661KB | text |
| 12:22 | ROOT CAUSE 3 | onboarding@resend.dev | ROOT CAUSE 3: Latest API | test3-api-latest.pdf | 741KB | text |
| 12:26 | Final verification | onboarding@resend.dev | FINAL TEST: Same PDF as ROOT CAUSE 3 | Same-As-Root-Cause-3.pdf | 655KB | HTML |
| 12:33 | EXACT 10:19 replica | OrderPilot <onboarding@resend.dev> | EXACT 10:19 REPLICA | OrderPilot-Exact-1019-RB2.pdf | 661KB | HTML |
| 12:39 | Direct send working | OrderPilot <onboarding@resend.dev> | DIRECT SEND: Exact Working PDF | Working-PDF-From-1233.pdf | 661KB | HTML |
| 12:44 | Minimal test | onboarding@resend.dev | MINIMAL TEST | minimal-test.pdf | 661KB | text |
| 12:44 | MCP filePath | onboarding@resend.dev | MCP TEST: FilePath | mcp-filepath-test.pdf | 661KB | text |
| 12:56 | Attachment test 1 | onboarding@resend.dev | ATTACHMENT TEST 1 | test1-rootcause-format.pdf | 661KB | text |
| 12:56 | Attachment test 3 | onboarding@resend.dev | ATTACHMENT TEST 3 | test3-no-contenttype.pdf | 661KB | text |

## BROKEN EMAILS ❌

| Time | Test | From | Subject | Attachment | Size | Email Type |
|------|------|------|---------|------------|------|------------|
| 12:19 | test-pdf-email | OrderPilot <onboarding@resend.dev> | OrderPilot PDF Test | OrderPilot-Cost-Analysis-Test.pdf | 750KB | HTML |
| 12:24 | test-automated-pdf | onboarding@resend.dev | FIXED: Automated PDF Test | OrderPilot-Fixed-Test.pdf | 741KB | HTML |
| 12:25 | test-fixed-api | onboarding@resend.dev | FIXED: API PDF Generation | OrderPilot-Fixed-API.pdf | 741KB | HTML |
| 12:37 | Lead flow | onboarding@resend.dev | Your PO Cost Analysis | OrderPilot-Cost-Analysis-RB2.pdf | 661KB | text |
| 12:37 | API test | onboarding@resend.dev | FIXED: API PDF Generation | OrderPilot-Fixed-API.pdf | 655KB | HTML |
| 12:55 | Lead flow (text) | onboarding@resend.dev | Your PO Cost Analysis | OrderPilot-Cost-Analysis-RB2.pdf | 661KB | text |
| 13:00 | API test | onboarding@resend.dev | FIXED: API PDF Generation | OrderPilot-Fixed-API.pdf | 655KB | HTML |
| 13:02 | API test (simple name) | onboarding@resend.dev | FIXED: API PDF Generation | report.pdf | 655KB | HTML |

## PATTERNS OBSERVED

### WORKING:
- Simple filenames (test1-simple.pdf, minimal-test.pdf)
- ROOT CAUSE tests all worked
- Direct sends of same file sometimes work
- Both HTML and text can work

### BROKEN:
- Complex filenames with "OrderPilot" prefix
- API generated PDFs often fail
- Even simple filename failed (report.pdf)

### INCONSISTENCIES:
- 10:19 test worked WITH complex filename and HTML
- 12:33 EXACT replica worked WITH complex filename
- 12:37 onwards mostly broken regardless of format

## POSSIBLE CAUSES:
1. **Rate limiting** - Too many emails in short time?
2. **Resend server routing** - Different servers handle differently?
3. **Outlook filtering** - Learning and blocking patterns?
4. **Time-based issue** - Something changed around 12:37?
5. **Email content scanning** - Specific content triggers filtering?