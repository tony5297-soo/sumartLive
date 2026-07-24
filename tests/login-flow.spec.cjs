const { test, expect } = require('@playwright/test');

test('공급자 로그인 페이지가 인증 상태를 저장하고 마이페이지로 이동한다', async ({ page }) => {
  const cases = [
    ['login-kakao.html', '카카오'],
    ['login-naver.html', '네이버'],
    ['login-google.html', 'Google'],
    ['login-apple.html', 'Apple']
  ];

  for (const [path, provider] of cases) {
    const response = await page.goto(`/${path}`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    await page.locator('#go').click();
    await page.waitForURL(/\/mypage\.html$/, { timeout: 3000 });

    await expect.poll(async () => page.evaluate(() => localStorage.getItem('sumartLoggedIn'))).toBe('true');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('sumartLoginProvider'))).toBe(provider);
    await expect.poll(async () => page.evaluate(() => !!localStorage.getItem('sumartAccessToken'))).toBeTruthy();
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('sumartTokenType'))).toBe('demo');
  }
});
