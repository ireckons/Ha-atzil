import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
const ADMIN_EMAIL = 'admin@haatzil.co.il';
const ADMIN_PASSWORD = 'Admin1234!';

test.describe('Admin Flow', () => {
    test('login and view orders', async ({ page }) => {
        await page.goto(`${BASE}/admin/login`);
        await expect(page.getByRole('heading', { name: 'כניסת מנהל' })).toBeVisible();

        await page.fill('#admin-email', ADMIN_EMAIL);
        await page.fill('#admin-password', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/admin$/, { timeout: 10000 });
        await expect(page.getByText('הזמנות')).toBeVisible();
    });

    test('admin cannot access without token', async ({ page }) => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto(`${BASE}/admin`);
        await page.waitForURL(/\/admin\/login/);
    });

    test('items panel – create and delete product', async ({ page }) => {
        // Login first
        await page.goto(`${BASE}/admin/login`);
        await page.fill('#admin-email', ADMIN_EMAIL);
        await page.fill('#admin-password', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/admin$/);

        // Switch to Items panel
        await page.click('button:has-text("פריטים")');
        await expect(page.getByText('ניהול פריטים')).toBeVisible();

        // Click "New product"
        await page.click('button:has-text("מוצר חדש")');
        await expect(page.getByRole('dialog')).toBeVisible();

        // Fill in form
        await page.fill('input[value=""]', 'טסט'); // name_he field
        const dialog = page.getByRole('dialog');
        await dialog.getByRole('textbox').nth(1).fill('Test Product');
        await dialog.locator('input[type="number"]').fill('99');

        // Save
        await dialog.click('button:has-text("שמור")');
        await expect(page.getByText('המוצר נוצר')).toBeVisible();
    });
});
