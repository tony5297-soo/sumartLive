const { test, expect } = require('@playwright/test');

async function clickAndWait(page, locator, destination) {
  await Promise.all([
    page.waitForURL(destination, { waitUntil: 'domcontentloaded' }),
    locator.click({ noWaitAfter: true })
  ]);
}

test('메뉴보기에서 쿠폰 페이지로 이동한다', async ({ page }) => {
  const response = await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  const menuButton = page.getByRole('button', { name: '전체 카테고리 열기' }).first();
  await menuButton.click();

  const panel = page.locator('.sx-category-panel');
  await expect(panel).toBeVisible();
  await clickAndWait(page, panel.locator('a[href="coupon.html"]'), /\/coupon\.html$/);

  await expect(page).toHaveURL(/\/coupon\.html$/);
  await expect(page.locator('body')).toBeVisible();
});

const topMenus = [
  ['홈', 'index.html'],
  ['AI검색', 'ai-search.html'],
  ['상품상세', 'product-detail.html'],
  ['LIVE', 'live.html'],
  ['장바구니', 'cart-order.html'],
  ['MY', 'mypage.html'],
  ['Admin', 'admin.html']
];

for (const [label, destination] of topMenus) {
  test(`상단 메뉴 ${label} 이동`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const start = await page.goto('/ai-search.html', { waitUntil: 'domcontentloaded' });
    expect(start?.ok()).toBeTruthy();

    const link = page.locator('nav.nav').getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    await clickAndWait(page, link, new RegExp(`/${destination.replace('.', '\\.')}$`));

    await expect(page).toHaveURL(new RegExp(`/${destination.replace('.', '\\.')}$`));
    await expect(page.locator('body')).toBeVisible();
    expect(errors, `브라우저 JavaScript 오류: ${errors.join(' | ')}`).toEqual([]);
  });
}
