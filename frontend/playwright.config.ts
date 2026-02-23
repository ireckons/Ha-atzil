import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    retries: 1,
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
        trace: 'on-first-retry',
        locale: 'he-IL',
        timezoneId: 'Asia/Jerusalem',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['iPhone 13'] } },
    ],
    webServer: process.env.CI ? undefined : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
    },
});
