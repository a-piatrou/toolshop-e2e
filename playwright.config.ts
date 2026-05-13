import { defineConfig, devices } from '@playwright/test';
import { env } from './src/utils/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 45_000,
  expect: { timeout: 10_000 },

  reporter: isCI ? [['github'], ['blob']] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiUrl },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
