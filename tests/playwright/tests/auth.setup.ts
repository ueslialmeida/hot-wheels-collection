import { test as setup, expect } from '@playwright/test';

// Path where the authentication state will be saved (also defined in playwright.config.ts)
const authFile = '.auth/user.json';

setup('Setup user login', async ({ page }) => {
  await page.goto('/auth/login');

  await page.locator('#email').fill(process.env.TEST_USER_EMAIL || '');
  await page.locator('#password').fill(process.env.TEST_USER_PASSWORD || '');

  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByRole('heading', { name: 'HW Collector', level: 1 })).toBeVisible();

  // Saves the user session state to the authFile path, so other tests can use it
  await page.context().storageState({ path: authFile });
});