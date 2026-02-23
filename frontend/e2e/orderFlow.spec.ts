import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

test.describe('Order Flow', () => {
    test('browse catalog → add to cart → checkout → confirmation', async ({ page }) => {
        // 1. Navigate to home
        await page.goto(BASE);
        await expect(page).toHaveTitle(/האציל/);
        await expect(page.getByText('האציל since 2005')).toBeVisible();

        // 2. Go to catalog
        await page.click('a[href="/catalog"]');
        await page.waitForSelector('[aria-label*="מוצרים"]');

        // 3. Click first product
        const firstCard = page.locator('a[href^="/product/"]').first();
        await firstCard.click();
        await page.waitForURL(/\/product\//);

        // 4. Select weight (if available) and add to cart
        const weightBtn = page.getByRole('button', { name: /g/i }).first();
        if (await weightBtn.isVisible()) await weightBtn.click();
        await page.click('button:has-text("הוסף לעגלה")');
        await expect(page.getByText(/נוסף לעגלה/)).toBeVisible();

        // 5. Go to cart
        await page.click('a[href="/cart"]');
        await expect(page.getByText('עגלת הקניות')).toBeVisible();
        await expect(page.getByRole('listitem').first()).toBeVisible();

        // 6. Proceed to checkout
        await page.click('a[href="/checkout"]');
        await page.waitForURL(/\/checkout/);

        // 7. Fill in customer details
        await page.fill('#name', 'ישראל ישראלי');
        await page.fill('#phone', '052-0000000');

        // 8. Select first available pickup slot
        const slotBtn = page.getByRole('radio').first();
        if (await slotBtn.isVisible()) await slotBtn.click();

        // 9. Submit order
        await page.click('button:has-text("שלח הזמנה")');
        await page.waitForURL(/\/confirmation/, { timeout: 10000 });
        await expect(page.getByText('ההזמנה התקבלה')).toBeVisible();
        await expect(page.getByText(/HA-/)).toBeVisible(); // order number
    });

    test('pickup-only – no delivery option present', async ({ page }) => {
        await page.goto(`${BASE}/checkout`);
        await expect(page.getByText(/קיים איסוף עצמי בלבד/)).toBeVisible();
        await expect(page.getByText(/משלוח/)).toHaveCount(0);
    });
});
