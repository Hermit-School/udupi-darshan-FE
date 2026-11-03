import { expect, test, type Page } from '@playwright/test';

const api = 'https://udupi-darshan-be.onrender.com';
const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
const token = [
  encode({ alg: 'HS256' }),
  encode({ sub: 'fixture-admin', iss: 'udupi-darshan', aud: 'udupi-darshan-api',
    exp: Math.floor(Date.now() / 1000) + 3600 }),
  'fixture-signature',
].join('.');

async function mockApi(page: Page, allowAdmin = true) {
  const calls: string[] = [];
  await page.route(api + '/**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();
    const headers = { 'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS' };
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers });
    calls.push(method + ' ' + path);
    if (method === 'POST' && path === '/v1/admin/sign-in') {
      expect(request.postDataJSON()).toEqual({ userName: 'fixture-admin', password: 'fixture-password' });
      return route.fulfill({ headers, body: token });
    }
    if (path === '/actuator/info' || path === '/v1/jwt/revoke') {
      expect(request.headers()['authorization']).toBe('Bearer ' + token);
      return route.fulfill({ headers, status: path === '/actuator/info' && !allowAdmin ? 403 : 200, body: '{}' });
    }
    if (method === 'GET') {
      expect(request.headers()['authorization']).toBeUndefined();
      return route.fulfill({ headers, json: [] });
    }
    return route.fulfill({ headers, status: 500 });
  });
  return calls;
}

async function signIn(page: Page) {
  await page.getByLabel('Username').fill('fixture-admin');
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

test('mobile visitors can navigate to public content and unknown routes land on 404', async ({ page }) => {
  await mockApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/home');
  const museum = page.getByRole('img', { name: 'Corporation Bank Heritage Museum' });
  await museum.scrollIntoViewIfNeeded();
  await expect.poll(() => museum.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const menu = page.getByRole('dialog', { name: 'Explore Udupi' });
  await menu.getByRole('link', { name: 'Nature', exact: true }).click();
  await expect(page).toHaveURL(/#\/nature$/);
  await expect(page).toHaveTitle(/Nature in Udupi/);
  await expect(menu).toBeHidden();
  await page.goto('/#/missing-route');
  await expect(page).toHaveURL(/#\/404$/);
});

test('admin guard, password sign-in and sign-out work in a browser', async ({ page }) => {
  const calls = await mockApi(page);
  await page.goto('/#/admindashboard');
  await expect(page).toHaveURL(/#\/admin$/);
  await signIn(page);
  await expect(page).toHaveURL(/#\/admindashboard$/);
  const revoked = page.waitForResponse(response => response.url() === api + '/v1/jwt/revoke');
  await page.getByRole('button', { name: 'Sign out' }).click();
  expect((await revoked).ok()).toBe(true);
  await page.goto('/#/new-entry');
  await expect(page).toHaveURL(/#\/admin$/);
  expect(calls).toContain('GET /actuator/info');
  expect(calls).toContain('DELETE /v1/jwt/revoke');
});

test('a server role denial prevents access even after receiving a token', async ({ page }) => {
  await mockApi(page, false);
  await page.goto('/#/admin');
  await signIn(page);
  await expect(page.getByRole('alert')).toContainText('does not have administrator access');
  await page.goto('/#/admindashboard');
  await expect(page).toHaveURL(/#\/admin$/);
});

test('mobile admin sign-in guides the user with a single form', async ({ page }) => {
  await mockApi(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/#/admin');
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);

  await page.getByLabel('Username').fill('fixture-admin');
  const password = page.getByLabel('Password', { exact: true });
  await password.fill('fixture-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
  await page.getByRole('link', { name: 'Back to public site' }).click();
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.getByRole('navigation').first()).toBeVisible();
});
