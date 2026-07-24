const { test, expect } = require('@playwright/test');

test('카테고리 메뉴 버튼이 패널 열림/닫힘 상태를 공유 스크립트로 제어한다', async ({ page }) => {
  const response = await page.goto('/tests/fixtures/category-nav.html', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  const menuButton = page.locator('.sx-category-menu-btn');
  const toggleButton = page.locator('.sx-category-toggle');
  const panel = page.locator('.sx-category-panel');

  await menuButton.click();
  await expect(panel).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

  await toggleButton.click();
  await expect(panel).toBeHidden();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
});
