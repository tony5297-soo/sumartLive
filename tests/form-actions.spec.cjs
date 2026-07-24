const { test, expect } = require('@playwright/test');

test('공용 폼 액션 스크립트가 data-form-action 기반으로 동작한다', async ({ page }) => {
  const response = await page.goto('/tests/fixtures/form-action.html', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  await page.locator('form').getByRole('button').click();

  await expect(page.locator('#result')).toHaveText('회원가입이 완료되었습니다. 잠시 후 로그인 화면으로 이동합니다.');
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('sumartMember'))).toBe('true');
  await expect.poll(async () => page.evaluate(() => !!localStorage.getItem('sumartAccessToken'))).toBeTruthy();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('sumartTokenType'))).toBe('demo');
});
