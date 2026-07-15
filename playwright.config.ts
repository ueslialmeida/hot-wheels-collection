import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Loads environment variables from the .env file if it exists. 
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  // 1. Directory where Playwright will look for test files (.spec.ts)
  testDir: './tests/playwright/tests',

  // 2. Maximum time limit for EACH individual test (30 seconds)
  timeout: 30 * 1000,

  // 3. Maximum time limit for assertions like expect(locator).toBeVisible() (10 seconds)
  expect: {
    timeout: 10000,
  },

  // 4. Executes the tests within a single file in parallel.
  fullyParallel: true,

  // 5. The CI build fails if you leave a stray `test.only` in the code.
  forbidOnly: !!process.env.CI,

  // 6. Number of retries if a test fails (2 times in CI to avoid false positives, 0 locally)
  retries: process.env.CI ? 2 : 0,

  // 7. Number of workers in parallel. In CI we use half the capacity to avoid overwhelming the CPU
  workers: process.env.CI ? 2 : undefined,

  // 8. Format of the reports generated after execution
  reporter: process.env.CI 
    ? [['blob'], ['github']] // No CI: generates blob to consolidate and integrates with the summaries of GitHub Actions
    : [['html', { open: 'on-failure' }]], // Locally: opens the HTML report only if there are failures

  // 9. Global settings for all projects/browsers
  use: {
    // URL base that will be prefixed in the commands page.goto('/route')
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',

    // Captures behavior only when the test fails (saves space and processing)
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    // Defines which HTML attribute will be used by the page.getByTestId() locator.
    testIdAttribute: 'data-testid',
  },

  // 10. Project Definition (Browsers, Devices, and Special Flows)
  projects: [
    // === GLOBAL SETUP STAGE ===
    // Executes the login once and saves the authentication state for other tests
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // ===  DESKTOP BROWSERS ===
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // This project depends on the success of the 'setup' project.
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // === MOBILE DEVICES EMULATION ===
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  // 11. Directory where test artifacts will be saved (downloads, screenshots, etc.)
  outputDir: 'test-results/',
});