import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_URL || 'http://127.0.0.1:4317';
const screenshots = process.env.TEST_SCREENSHOTS || '/tmp/j10-portfolio';
const browser = await chromium.launch({ headless: true, channel: process.env.TEST_BROWSER_CHANNEL || 'chrome' });
await mkdir(screenshots, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Pause project slideshow' }).click();
  assert.equal(await page.getByRole('button', { name: 'Play project slideshow' }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('link', { name: 'See all works', exact: true }).filter({ visible: true }).click();
  await page.waitForURL('**/work/');
  assert.equal(await page.locator('.project-card').count(), 7);
  const routes = await page.locator('.project-card').evaluateAll((links) => links.map((link) => link.href));
  for (const route of routes) {
    await page.goto(route);
    assert.equal(await page.locator('h1').count(), 1);
    assert.ok(await page.getByRole('link', { name: 'Visit website', exact: true }).getAttribute('href'));
    const next = page.getByRole('link', { name: 'Next project', exact: true }).filter({ visible: true });
    const target = await next.getAttribute('href');
    await next.click();
    await page.waitForURL(`**${target}`);
  }
  for (const width of [320, 390, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/work/', '/archive/', '/about/', '/project/worldbuilderzzz/']) {
      await page.goto(`${baseURL}${route}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow: ${width} ${route}`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  assert.equal(await page.locator('#page-content').evaluate((element) => element.inert), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'About', exact: true }).click();
  await page.waitForURL('**/about/');
  assert.equal(await page.locator('#page-content').evaluate((element) => element.inert), false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(baseURL);
  assert.equal(await page.locator('.hero-reel').evaluate((element) => getComputedStyle(element).animationName), 'none');
  await page.screenshot({ path: `${screenshots}/home-mobile.png` });
  assert.deepEqual(errors, []);
  console.log('PASS: project navigation, slideshow, responsive routes, keyboard menu, reduced motion, and no runtime errors.');
} finally { await browser.close(); }
