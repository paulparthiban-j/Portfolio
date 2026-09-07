// Shared constants for the Playwright suite (API + UI projects).
// The webServer in playwright.config.ts is started with these as
// ADMIN_PASSWORD / ADMIN_TOKEN, so tests never depend on the app's
// insecure hardcoded defaults ('admin123' / 'super-secret-admin').

export const TEST_PORT = 3211;
export const BASE_URL = `http://localhost:${TEST_PORT}`;
export const TEST_ADMIN_PASSWORD = 'e2e-test-password-8f2c91';
export const TEST_ADMIN_TOKEN = 'e2e-test-admin-token-4d91ab';
