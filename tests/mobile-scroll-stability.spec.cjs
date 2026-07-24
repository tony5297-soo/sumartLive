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

      window.scrollTo(0, 420);

      return {
        backdropFilter: headerStyle.backdropFilter || headerStyle.webkitBackdropFilter,
        bodyOverflowY: bodyStyle.overflowY,
        revealAnimation: reveal ? getComputedStyle(reveal).animationName : 'none',
        scrollY: window.scrollY
      };
    });

    expect(mobileStyles.backdropFilter).toBe('none');
    expect(mobileStyles.bodyOverflowY).not.toBe('hidden');
    expect(mobileStyles.revealAnimation).toBe('none');
    expect(mobileStyles.scrollY).toBeGreaterThan(0);
    expect(errors, `브라우저 JavaScript 오류: ${errors.join(' | ')}`).toEqual([]);
  });
}
