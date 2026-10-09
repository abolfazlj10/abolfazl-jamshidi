import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.TEST_URL || 'http://127.0.0.1:4317';
const screenshots = process.env.TEST_SCREENSHOTS || '/tmp/j10-portfolio';
const browser = await chromium.launch({ headless: true, channel: process.env.TEST_BROWSER_CHANNEL || 'chrome' });
const errors = [];
await mkdir(screenshots, { recursive: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(baseURL, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
  assert.ok(!(await page.locator('body').innerText()).match(/[\u0600-\u06ff]/));
  await page.screenshot({ path: `${screenshots}/intro-desktop.png` });
  await page.mouse.move(1000, 500);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(900);
  assert.ok(Math.abs((await page.locator('#projects').boundingBox()).y) <= 2, 'large scroll lands on Projects');
  assert.match(await page.locator('h3').innerText(), /ToolBo/);
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(850);
  assert.match(await page.locator('h3').innerText(), /Weather App/);
  const positions = await page.locator('.wheel-item').evaluateAll((items) =>
    items.filter((item) => getComputedStyle(item).visibility === 'visible').map((item) => {
      const bounds = item.getBoundingClientRect();
      return { title: item.querySelector('button').title, x: bounds.x, y: bounds.y };
    })
  );
  const previous = positions.find((item) => item.title === 'ToolBo');
  const current = positions.find((item) => item.title === 'Weather App');
  const next = positions.find((item) => item.title === 'Calculator');
  assert.ok(previous.y < current.y && next.y > current.y);
  assert.ok(previous.x > current.x && Math.abs(previous.x - next.x) < 2);
  for (let index = 0; index < 6; index++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(820);
  }
  assert.match(await page.locator('h3').innerText(), /ToolBo/, 'complete loop returns to first project');
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(850);
  assert.match(await page.locator('h3').innerText(), /CPass/, 'reverse wraps to the last project');
  assert.equal(await page.getByRole('link', { name: 'Open project', exact: true }).count(), 0, 'offline demo is not linked');
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await page.waitForTimeout(850);
  await page.locator('#projects').focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(850);
  assert.match(await page.locator('h3').innerText(), /Weather App/);
  await page.getByRole('button', { name: 'Select ToolBo', exact: true }).last().click();
  await page.waitForTimeout(850);
  await page.screenshot({ path: `${screenshots}/projects-desktop.png` });
  for (let index = 0; index < 7; index++) {
    await page.locator('.project-index button').nth(index).click();
    await page.waitForTimeout(850);
    const broken = await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src));
    assert.deepEqual(broken, [], 'portrait and selected project preview load');
    const source = await page.locator('.source-link').getAttribute('href');
    assert.ok(source.startsWith('https://github.com/abolfazlj10/'));
  }
  await page.locator('.projects-header-links a').click();
  await page.waitForTimeout(1000);
  assert.ok(await page.evaluate(() => window.scrollY < 2), 'Intro link exits the infinite wheel');

  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no horizontal overflow at ${width}`);
    await page.screenshot({ path: `${screenshots}/intro-${width}.png` });
    await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshots}/projects-${width}.png`, fullPage: width < 600 });
    await page.getByRole('button', { name: 'Next project', exact: true }).click();
    await page.waitForTimeout(850);
    assert.match(await page.locator('h3').innerText(), /Weather App/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/#projects`, { waitUntil: 'networkidle' });
  await page.locator('.project-index button').first().click();
  await page.waitForTimeout(850);
  const stage = page.locator('.wheel-stage');
  await stage.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 260, clientY: 280 });
    const end = new Touch({ identifier: 1, target: element, clientX: 260, clientY: 160 });
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }));
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
  });
  await page.waitForTimeout(850);
  assert.match(await page.locator('h3').innerText(), /Weather App/, 'mobile swipe selects next');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await page.waitForTimeout(50);
  assert.match(await page.locator('h3').innerText(), /Calculator/, 'reduced-motion selection');
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(`${baseURL}/#projects`, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(300);
  const icon = await mobile.locator('.project-select[aria-current="true"]').boundingBox();
  const session = await mobile.context().newCDPSession(mobile);
  const point = { x: icon.x + icon.width / 2, y: icon.y + icon.height / 2 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x, y: point.y - 70 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await mobile.waitForTimeout(850);
  assert.match(await mobile.locator('h3').innerText(), /Weather App/, 'native mobile swipe on active icon');
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log('PASS: English intro, scroll landing, forward/reverse loop, arc positions, keyboard, buttons, preview assets, exit route, mobile swipe, reduced motion, and four responsive sizes.');
  console.log(`Screenshots: ${screenshots}`);
} finally {
  await browser.close();
}
