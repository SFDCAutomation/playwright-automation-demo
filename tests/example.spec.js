// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import XLSX from 'xlsx';

const testDataPath = path.join(import.meta.dirname, 'test-data', 'login-data.xlsx');
if (!fs.existsSync(testDataPath)) {
  throw new Error(`Test data file was not found: ${testDataPath}`);
}

const workbook = XLSX.readFile(testDataPath);
const loginData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
  defval: '',
});

for (const [index, row] of loginData.entries()) {
  if (!row.username || !row.password) {
    throw new Error(`Row ${index + 2} in login-data.xlsx must contain username and password`);
  }
}

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

for (const { username, password } of loginData) {
  test(`should login with ${username}`, async ({ page }) => {
  await page.goto('https://example.com/login');

    await page.fill('#username', username);
    await page.fill('#password', password);

    await page.click('#login-button');

    await expect(page).toHaveURL('https://example.com/dashboard');

    await expect(page.getByText(`Welcome, ${username}!`)).toBeVisible();
  });
}
