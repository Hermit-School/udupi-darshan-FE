import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['junit', { outputFile: 'test-results/e2e.xml' }]],
  outputDir: 'test-results/browser',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 e2e/serve-build.py',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
