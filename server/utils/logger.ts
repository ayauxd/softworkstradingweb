/**
 * Simple console logger with timestamp
 */
export function log(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
}