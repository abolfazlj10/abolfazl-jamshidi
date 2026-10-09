import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_URL || 'http://127.0.0.1:4317';
const screenshots = process.env.TEST_SCREENSHOTS || '/tmp/j10-portfolio';
const browser = await chromium.launch({ headless: true, channel: process.env.TEST_BROWSER_CHANNEL || 'chrome' });
const errors = [];
const names = ['WePackaging', 'Bazaarchiii', 'WorldBuilderzzz', 'Mehdi Arman', 'Fash Ba Tashdid', 'ToolBo', 'IdiomYar'];
await mkdir(screenshots, { recursive: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  assert.equal((await page.goto(baseURL, { waitUntil: 'networkidle' })).status(), 200);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
  await page.waitForFunction(() => Math.abs(document.querySelector('#projects').getBoundingClientRect().top) < 2);
  await page.mouse.move(1000, 450);
  await page.mouse.wheel(0, 540);
  await page.waitForFunction(() => document.querySelector('h3').textContent === 'Bazaarchiii.');
  await page.mouse.wheel(0, -540);
  await page.waitForFunction(() => document.querySelector('h3').textContent === 'WePackaging.');
  await page.mouse.wheel(0, -400);
  await page.waitForFunction(() => document.querySelector('#projects').getBoundingClientRect().top > 200);

  for (let index = 0; index < names.length; index++) {
    await page.getByRole('button', { name: `Select ${names[index]}`, exact: true }).click();
    await page.waitForFunction((name) => document.querySelector('h3').textContent === `${name}.`, names[index]);
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    assert.equal(await page.getByRole('link', { name: 'Visit website', exact: true }).count(), 1);
    assert.equal(await page.locator('.source-link').count(), index >= 5 ? 1 : 0);
  }
  assert.equal(await page.getByRole('button', { name: 'Next project', exact: true }).isEnabled(), false);
  await page.mouse.wheel(0, 900);
  await page.waitForFunction(() => document.querySelector('#contact').getBoundingClientRect().top < innerHeight);
  await page.getByRole('link', { name: 'Back to top', exact: true }).click();
  await page.waitForFunction(() => scrollY < 2);

  await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
  await page.getByRole('button', { name: 'Select WePackaging', exact: true }).press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('h3').textContent === 'Bazaarchiii.');
  await page.getByRole('button', { name: 'Select WePackaging', exact: true }).press('End');
  await page.waitForFunction(() => document.querySelector('h3').textContent === 'IdiomYar.');
  await page.getByRole('button', { name: 'Select WePackaging', exact: true }).press('Home');
  await page.waitForFunction(() => document.querySelector('h3').textContent === 'WePackaging.');
  await page.screenshot({ path: `${screenshots}/projects-desktop.png` });

  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1280, 650], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${baseURL}/#projects`, { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal overflow at ${width}`);
    if (width < 1000) await page.getByLabel('Choose a project', { exact: true }).selectOption('1');
    else await page.getByRole('button', { name: 'Select Bazaarchiii', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('h3').textContent === 'Bazaarchiii.');
    await page.getByRole('button', { name: 'Next project', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('h3').textContent === 'WorldBuilderzzz.');
    if (width < 1000 || height < 720) {
      assert.ok(await page.evaluate(() => Math.abs(document.querySelector('#projects').offsetHeight - document.querySelector('.projects-panel').offsetHeight) < 3), 'small viewports have no pinned scroll track');
    }
    await page.screenshot({ path: `${screenshots}/projects-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Select WePackaging', exact: true }).click();
  assert.equal(await page.locator('.project-copy').evaluate((element) => getComputedStyle(element).animationName), 'none');
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  console.log('PASS: native scroll entry/exit, all projects and assets, keyboard, direct selection, responsive layouts, and reduced motion.');
} finally {
  await browser.close();
}
