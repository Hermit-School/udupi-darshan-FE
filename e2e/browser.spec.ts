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
  await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Add Nature/ })).toHaveAttribute('href', '#/new-entry/nature');
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
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

test('admin can publish each content type from its own form', async ({ page }) => {
  await mockApi(page);
  const endpoints = {
    Nature: '/v1/nature/postNature', Culture: '/v1/culture/postCulture',
    Food: '/v1/food/postFood', Story: '/v1/blogs/admin/publish', Ad: '/v1/ads',
  };
  const requests: { path: string; body: Record<string, unknown> }[] = [];
  for (const path of Object.values(endpoints)) {
    await page.route(api + path, async route => {
      const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type',
        'access-control-allow-methods': 'POST, OPTIONS' };
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      expect(route.request().method()).toBe('POST');
      expect(route.request().headers()['authorization']).toBe('Bearer ' + token);
      requests.push({ path, body: route.request().postDataJSON() });
      return path === endpoints.Culture
        ? route.fulfill({ headers, body: 'Success' })
        : route.fulfill({ headers, json: { id: requests.length } });
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/admin');
  await signIn(page);

  for (const [kind, path] of Object.entries(endpoints)) {
    await page.getByRole('link', { name: new RegExp('Add ' + (kind === 'Ad' ? 'Ads' : kind === 'Story' ? 'Stories' : kind)) }).click();
    await expect(page.getByRole('heading', { name: 'Add ' + kind })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    const publish = page.getByRole('button', { name: 'Publish ' + kind, exact: true });
    if (kind === 'Nature') {
      await publish.click();
      await expect(page.getByRole('alert')).toContainText('required fields');
      expect(requests).toHaveLength(0);
    }
    if (kind === 'Story') {
      await page.getByLabel('Title').fill('Market morning');
      await page.getByLabel('Author name').fill('Editor');
      await page.getByLabel('Contact email').fill('editor@example.invalid');
      await page.getByLabel('Story text').fill('A walk through Udupi market.');
    } else if (kind === 'Ad') {
      await page.getByLabel('Title').fill('Local market');
      await page.getByLabel('Image URL').fill('https://example.invalid/market.jpg');
    } else {
      await page.getByLabel('Place name').fill(kind + ' entry');
      await page.getByLabel('Section').selectOption({ index: 1 });
      await page.getByLabel('Website or map link').fill('https://example.invalid/place');
      if (kind === 'Nature') {
        await page.getByText('Related places', { exact: false }).first().click();
        await page.getByRole('button', { name: 'Add a related place' }).click();
        await page.getByRole('group', { name: 'Related place 1' }).getByLabel('Name').fill('Nearby beach');
      }
    }
    await publish.click();
    await expect(page.getByRole('status')).toContainText('Published successfully');
    expect(requests.at(-1)?.path).toBe(path);
    await page.getByRole('link', { name: 'Return to dashboard' }).click();
  }
  expect(requests).toHaveLength(5);
  expect(requests[0].body).toMatchObject({ category: 'Nature', label: 'Best Of Nature', dontMissThese: [{ name: 'Nearby beach' }] });
  expect(requests[3].body).toMatchObject({ submittedBy: 'Editor', email: 'editor@example.invalid' });
  expect(requests[4].body).toMatchObject({ title: 'Local market', imageUrl: 'https://example.invalid/market.jpg' });
});
