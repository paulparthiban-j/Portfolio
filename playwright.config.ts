import { defineConfig, devices } from '@playwright/test';
import { TEST_PORT, BASE_URL, TEST_ADMIN_PASSWORD, TEST_ADMIN_TOKEN } from './e2e/test-env';

export default defineConfig({
  testDir: './e2e',
  // Tests share on-disk state (data/portfolio.json, temp/, public/resume_*.pdf).
  // Serial execution keeps them deterministic instead of racing each other.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }]],
  globalSetup: require.resolve('./e2e/global-setup'),
  globalTeardown: require.resolve('./e2e/global-teardown'),
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './e2e/api',
    },
    {
      name: 'e2e',
      testDir: './e2e/ui',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx next dev -p ${TEST_PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ADMIN_PASSWORD: TEST_ADMIN_PASSWORD,
      ADMIN_TOKEN: TEST_ADMIN_TOKEN,
      NODE_ENV: 'development',
    },
  },
});
