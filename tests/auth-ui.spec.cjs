const { test, expect } = require('@playwright/test');

test('로그인된 사용자가 헤더 버튼과 마이페이지 안내 문구를 업데이트한다', async ({ page }) => {
  await page.goto('/mypage.html', { waitUntil: 'domcontentloaded' });

  await page.evaluate(() => {
    localStorage.setItem('sumartLoggedIn', 'true');
    localStorage.setItem('sumartLoginProvider', '카카오');
    localStorage.setItem('sumartAccessToken', 'demo-access-token');
    localStorage.setItem('sumartTokenType', 'demo');
  });

  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('.btn-login')).toHaveText('로그아웃');
  await expect(page.locator('.my-welcome h2')).toContainText('카카오');
});
