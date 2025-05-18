# Email Configuration for Softworks Trading Web

This document outlines the email configuration requirements for the Softworks Trading website, specifically for the AI voice call summary feature.

## Overview

The AI voice call feature automatically generates summaries of voice interactions with the AI agent. These summaries are:
1. Saved to the local filesystem in the `/logs` directory
2. Optionally sent via email to a configured address

## Environment Variables

The following environment variables need to be configured in your deployment environment:

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | smtp.gmail.com |
| `EMAIL_PORT` | SMTP server port | 587 |
| `EMAIL_SECURE` | Use secure connection (set to "true" for SSL/TLS) | false |
| `EMAIL_USER` | SMTP account username | - |
| `EMAIL_PASSWORD` | SMTP account password or app password | - |
| `EMAIL_FROM` | "From" email address for sent emails | noreply@softworkstrading.com |
| `CALL_SUMMARY_EMAIL` | Email address to receive call summaries | agents@softworkstrading.com |
| `FORCE_EMAIL_IN_DEV` | Force email sending in development mode | false |

## Fallback Mechanism

The system includes a robust fallback mechanism:

1. If saving to filesystem fails, the system will still attempt to send emails
2. If email sending fails, the system will still return success (the summary was saved to filesystem)
3. In development mode, emails are not sent unless `FORCE_EMAIL_IN_DEV` is set
4. If email credentials are not provided, the system logs a warning and continues operation

## Logs Directory

The application automatically creates a `/logs` directory in the project root during:
- Local development startup
- Build process (via render-build.sh)
- Runtime when a call summary is generated

## Call Summary Format

Call summaries are stored in text files with the naming format:
```
call_summary_YYYY-MM-DDThh-mm-ss-SSSZ.txt
```

The content format is:
```
Timestamp: [ISO timestamp]
User Email: [email provided or "Not provided"]

[Call summary content]
```

## Testing Email Configuration

To test your email configuration:
1. Set the required environment variables
2. Set `FORCE_EMAIL_IN_DEV=true` if testing in development
3. Use the AI voice call feature and complete a call
4. Check the configured email address for the summary

## Troubleshooting

If email sending fails:
1. Check environment variables are correctly set
2. Verify SMTP server details and credentials
3. Check server logs for specific error messages
4. Look for saved files in the `/logs` directory as a backup

For Gmail accounts, use an App Password instead of your regular password.