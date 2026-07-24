const { test, expect } = require('@playwright/test');

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});

for (const path of ['/cart-order.html', '/mypage.html']) {
  test(`${path} 모바일 첫 스크롤이 잠기지 않는다`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator('#sumart-mobile-scroll-stability')).toHaveCount(1);

    const mobileStyles = await page.evaluate(() => {
      const headerStyle = getComputedStyle(document.querySelector('header'));
      const bodyStyle = getComputedStyle(document.body);
      const reveal = document.querySelector('.v501-reveal');
      const categoryScroller = document.querySelector('.sx-category-scroll');

      window.scrollTo(0, 420);

      return {
        backdropFilter: headerStyle.backdropFilter || headerStyle.webkitBackdropFilter,
        bodyOverflowY: bodyStyle.overflowY,
        categoryTouchAction: categoryScroller ? getComputedStyle(categoryScroller).touchAction : 'auto',
        revealAnimation: reveal ? getComputedStyle(reveal).animationName : 'none',
        scrollY: window.scrollY
      };
    });

    expect(mobileStyles.backdropFilter).toBe('none');
    expect(mobileStyles.bodyOverflowY).not.toBe('hidden');
    expect(mobileStyles.categoryTouchAction).toBe('auto');
    expect(mobileStyles.revealAnimation).toBe('none');
    expect(mobileStyles.scrollY).toBeGreaterThan(0);
    expect(errors, `브라우저 JavaScript 오류: ${errors.join(' | ')}`).toEqual([]);
  });
}

test('/cart-order.html 카테고리 영역에서 시작한 세로 스와이프가 페이지를 스크롤한다', async ({ page }) => {
  await page.goto('/cart-order.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.scrollTo(0, 0));

  const mobileLiteState = await page.evaluate(() => ({
    enabled: window.__SUMART_CART_MOBILE_LITE__ === true,
    legacyNodes: document.querySelectorAll(
      '.sumart-v516-compare,.sumart-v51-assistant,.sumart-v5011-dock,.v379-ai-launcher'
    ).length
  }));
  expect(mobileLiteState).toEqual({ enabled: true, legacyNodes: 0 });

  const categoryScroller = page.locator('.sx-category-scroll').first();
  const box = await categoryScroller.boundingBox();
  expect(box).not.toBeNull();

  const client = await page.context().newCDPSession(page);
  const x = Math.round(box.x + box.width / 2);
  const startY = Math.round(box.y + box.height / 2);

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y: startY, id: 1, radiusX: 3, radiusY: 3, force: 1 }]
  });

  for (let distance = 30; distance <= 240; distance += 30) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: startY - distance, id: 1, radiusX: 3, radiusY: 3, force: 1 }]
    });
    await page.waitForTimeout(16);
  }

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: []
  });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
});
