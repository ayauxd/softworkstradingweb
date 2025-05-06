# Security Implementation Guide

This document outlines the security measures implemented in the SoftworksTradingWeb application, with a focus on Content Security Policy (CSP) and other protective headers.

## Content Security Policy

### Overview

The application uses a nonce-based Content Security Policy to protect against Cross-Site Scripting (XSS) and other code injection attacks. This approach allows legitimate inline scripts to run while blocking malicious script injection.

### Implementation

The CSP is implemented in `/server/middleware/security.ts` with the following key features:

1. **Nonce Generation**: A cryptographically secure random nonce is generated for each request:
   ```typescript
   const generateNonce = () => {
     return crypto.randomBytes(16).toString('base64');
   };
   ```

2. **CSP Directives**:
   - `default-src 'self'`: Only allow resources from the same origin by default
   - `script-src`: Scripts are restricted to same origin and those with correct nonce
   - `style-src`: Styles are restricted to same origin, Google Fonts, and those with nonce
   - `object-src 'none'`: Blocks all `<object>`, `<embed>`, and `<applet>` elements
   - `frame-ancestors 'none'`: Prevents this site from being embedded in iframes
   - `upgrade-insecure-requests`: Upgrades HTTP requests to HTTPS

3. **Automatic Nonce Application**:
   - Server middleware adds the nonce attribute to `<script>` and `<style>` tags 
   - JSON-LD structured data is excluded from nonce requirements
   - Response transformation happens at the Express middleware level

### Future Improvements

- Remove `unsafe-inline` from `style-src` once all CSS-in-JS solutions are updated
- Implement stricter CSP for admin sections
- Add CSP violation reporting endpoint

## Other Security Headers

In addition to CSP, the application implements several other security headers:

1. **Strict-Transport-Security (HSTS)**:
   ```
   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   ```
   Forces browsers to use HTTPS for all requests to this domain for 2 years.

2. **X-Content-Type-Options**:
   ```
   X-Content-Type-Options: nosniff
   ```
   Prevents browsers from MIME-sniffing a response away from the declared content-type.

3. **X-Frame-Options**:
   ```
   X-Frame-Options: DENY
   ```
   Prevents the website from being embedded in frames on other sites.

4. **X-XSS-Protection**:
   ```
   X-XSS-Protection: 1; mode=block
   ```
   Enables browser's built-in XSS filters.

5. **Referrer-Policy**:
   ```
   Referrer-Policy: strict-origin-when-cross-origin
   ```
   Limits the information sent in the Referer header when navigating to other origins.

## Integration with Frontend

### Adding Nonce to New Inline Scripts

If you need to add new inline scripts to the application:

1. **Server-rendered scripts**:
   The server middleware automatically adds the nonce attribute to script tags in HTML responses.

2. **Dynamically added scripts**:
   For scripts added via client-side JavaScript, use:
   ```javascript
   const script = document.createElement('script');
   script.nonce = document.querySelector('script[nonce]')?.nonce || '';
   script.textContent = 'console.log("Hello World")';
   document.head.appendChild(script);
   ```

## Testing CSP

To test your CSP implementation:

1. **Browser Developer Tools**:
   - Open Chrome DevTools → Network tab
   - Look for blocked resources that violate CSP

2. **CSP Evaluator**:
   - Visit [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
   - Paste your CSP header to check for weaknesses

3. **Automated Testing**:
   - Add tests that verify CSP headers are present
   - Test that resources load correctly with CSP in place