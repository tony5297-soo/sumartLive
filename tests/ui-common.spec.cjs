const { test, expect } = require('@playwright/test');

test('공용 UI 이벤트가 토스트, 이동, 상단 이동을 처리한다', async ({ page }) => {
  const response = await page.goto('/tests/fixtures/ui-common.html', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  await page.locator('button[data-toast]').click();
  await expect(page.locator('.toast')).toContainText('공용 토스트가 표시됩니다.');

  await Promise.all([
    page.waitForURL(/\/coupon\.html$/, { waitUntil: 'domcontentloaded' }),
    page.locator('div[data-link]').click({ noWaitAfter: true })
  ]);

  await expect(page).toHaveURL(/\/coupon\.html$/);

  await page.goBack();
  await page.locator('.scroll-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(5);
});
