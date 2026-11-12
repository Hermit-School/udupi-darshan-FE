import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const configured = JSON.parse(readFileSync('firebase.json', 'utf8')).hosting.headers
  .find((rule: { source?: string }) => rule.source === '**').headers as { key: string; value: string }[];

test('security headers cover HTML, scripts, styles, and images', async ({ request }) => {
  const response = await request.get('/');
  const html = await response.text();
  const script = html.match(/src="([^"]+\.js)"/)![1];
  const style = html.match(/href="([^"]+\.css)"/)![1];
  for (const path of ['/', '/index.html', script, style, '/assets/images/static/temple.svg']) {
    const resource = await request.get(path);
    expect(resource.ok()).toBe(true);
    for (const header of configured) expect(resource.headers()[header.key.toLowerCase()]).toBe(header.value);
  }
  // The optimized entry point must not require CSP exceptions for inline scripts or handlers.
  expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/i);
  expect(html).not.toMatch(/\son\w+=/i);
});

test('browser blocks injected scripts, eval, and unapproved connections', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__violations = [];
    document.addEventListener('securitypolicyviolation', event => (window as any).__violations.push(event.effectiveDirective));
  });
  // Run eval inside a normal permitted script; DevTools evaluate itself bypasses CSP.
  await page.route('**/csp-eval-probe.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: "try { window.eval('window.__injectedEvalRan = true'); } catch { window.__evalBlocked = true; }"
  }));
  await page.goto('/#/admin');
  await expect(page.getByRole('link', { name: 'Need help signing in?' })).toBeVisible();
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.__injectedScriptRan = true';
    document.body.append(script);
    const evalProbe = document.createElement('script');
    evalProbe.src = '/csp-eval-probe.js';
    document.body.append(evalProbe);
    const external = document.createElement('script');
    external.src = 'https://unapproved.example.invalid/injected.js';
    document.body.append(external);
    void fetch('https://unapproved.example.invalid/collect').catch(() => {});
  });
  await expect.poll(() => page.evaluate(() => (window as any).__violations)).toEqual(expect.arrayContaining(['script-src-elem', 'script-src', 'connect-src']));
  expect(await page.evaluate(() => Boolean((window as any).__injectedScriptRan || (window as any).__injectedEvalRan))).toBe(false);
});

test('another page cannot frame the admin portal', async ({ page }) => {
  await page.route('http://127.0.0.1:4173/frame-probe', route => route.fulfill({
    contentType: 'text/html', body: '<iframe src="http://127.0.0.1:4173/#/admin"></iframe>'
  }));
  const blocked = page.waitForEvent('console', { predicate: message => /frame-ancestors|X-Frame-Options/i.test(message.text()) });
  await page.goto('/frame-probe');
  await blocked;
  await expect(page.frameLocator('iframe').getByRole('link', { name: 'Need help signing in?' })).toHaveCount(0);
});
