# CSRF Protection Implementation Guide

This document outlines the Cross-Site Request Forgery (CSRF) protection measures implemented in the SoftworksTradingWeb application.

## What is CSRF?

CSRF is an attack that forces authenticated users to execute unwanted actions on a web application in which they're currently authenticated. The attack works by including a link or script in a page that accesses a site to which the user is known (or supposed) to have been authenticated.

## Implementation Overview

Our CSRF protection uses a double-submit cookie pattern with a cryptographically secure token. This approach involves:

1. Creating a secure random token
2. Storing the token's secret in an HTTP-only cookie
3. Requiring the client to include a valid token in requests that modify state

## Server-Side Implementation

The CSRF protection is implemented in `/server/middleware/csrf.ts` and consists of:

### 1. Secret Generation and Storage

```typescript
// Create a new CSRF secret
const secret = tokens.secretSync();

// Store it in an HTTP-only, same-site cookie
res.cookie(CSRF_COOKIE_NAME, secret, {
  secure: secureOption,
  httpOnly: true,
  sameSite: 'strict',
  maxAge: CSRF_SECRET_EXPIRY,
  path: '/',
});
```

### 2. Token Generation API

```typescript
app.get('/api/csrf-token', (req, res) => {
  const secret = req.csrfSecret;
  const token = tokens.create(secret);
  res.json({ csrfToken: token });
});
```

### 3. Request Validation Middleware

```typescript
export const csrfProtection = (req, res, next) => {
  // Skip validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Validate the token against the secret
  if (!token || !tokens.verify(secret, token)) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  
  next();
};
```

## Client-Side Implementation

The client-side implementation is in `/client/src/lib/csrf.ts` and provides utilities for:

### 1. Fetching CSRF Tokens

```typescript
export const fetchCSRFToken = async (): Promise<string> => {
  // Fetch token from server (with caching)
  const response = await fetch('/api/csrf-token');
  const data = await response.json();
  return data.csrfToken;
};
```

### 2. Creating Request Headers

```typescript
export const getCSRFHeaders = async (): Promise<HeadersInit> => {
  const token = await fetchCSRFToken();
  return {
    'X-CSRF-Token': token,
  };
};
```

### 3. Form Submission Example

```typescript
const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Get CSRF headers
  const csrfHeaders = await getCSRFHeaders();
  
  // Include token in API request
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeaders,
    },
    body: JSON.stringify(formData),
  });
  
  // Handle response...
};
```

## Protected Routes

The following routes are protected by CSRF validation:

- `POST /api/contact` - Contact form submission
- `POST /api/subscribe` - Newsletter subscription
- Any future mutation endpoints (POST, PUT, DELETE)

## Testing CSRF Protection

To verify that CSRF protection is working:

1. **Positive Test**: Submit the contact form with valid CSRF token
2. **Negative Test**: Try to submit with an invalid token (should return 403)

Use the automated tests in `/tests/unit/server/csrf.test.ts` to verify functionality.

## Security Considerations

This implementation follows best practices by:

- Using cryptographically secure random tokens
- Setting cookies with appropriate security flags
- Enforcing token verification for state-changing operations
- Providing a clean API for client-side integration

Future improvements could include:

- Implementing token rotation for long-lived sessions
- Adding a CSRF reporting endpoint for security monitoring