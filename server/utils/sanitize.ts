/**
 * Helper function to sanitize sensitive data before logging
 */
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  if (!data || typeof data !== 'object') return data;

  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'email', 'authentication'];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  });

  return sanitized;
}