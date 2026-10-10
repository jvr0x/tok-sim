const path = require('path');
const { test, expect } = require('playwright/test');

// Local copy of the shared jvr0x.com chrome stylesheet. The page links it
// root-relative (/assets/chrome.css), which the test server does not serve.
const CHROME_CSS = path.resolve(__dirname, '../../jvr0x.github.io/assets/chrome.css');

const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

// Panels whose buttons must stay inside their own bounding box.
const PANELS = ['section.controls', '#unified-controls'];

// Tolerance in CSS pixels for sub-pixel rounding.
const TOLERANCE = 1;

/**
 * Routes the shared chrome stylesheet to the local copy and blocks the
 * newsletter iframe so layout is deterministic and offline.
 */
async function routeExternal(page) {
  await page.route('**/assets/chrome.css', route =>
    route.fulfill({ path: CHROME_CSS, contentType: 'text/css' }));
  await page.route('https://agicheckpoint.com/**', route =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '' }));
}

/**
 * Asserts every button in each controls panel lies fully inside that panel,
 * and that the page has no horizontal scroll.
 */
async function expectButtonsInsidePanels(page, label) {
  for (const panelSel of PANELS) {
    const panel = page.locator(panelSel);
    const pb = await panel.boundingBox();
    expect(pb, `${panelSel} visible`).not.toBeNull();
    const buttons = await panel.locator('button').all();
    expect(buttons.length, `${panelSel} has buttons`).toBeGreaterThan(0);
    for (const btn of buttons) {
      const bb = await btn.boundingBox();
      const name = await btn.evaluate(el => el.id || el.textContent.trim());
      const where = `[${label}] ${panelSel} button "${name}"`;
      expect.soft(bb.x + bb.width, `${where} right ${(bb.x + bb.width).toFixed(1)} > panel right ${(pb.x + pb.width).toFixed(1)}`)
        .toBeLessThanOrEqual(pb.x + pb.width + TOLERANCE);
      expect.soft(bb.x, `${where} left ${bb.x.toFixed(1)} < panel left ${pb.x.toFixed(1)}`)
        .toBeGreaterThanOrEqual(pb.x - TOLERANCE);
    }
  }
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect.soft(scrollWidth, `[${label}] page scrollWidth ${scrollWidth} > viewport ${innerWidth}`)
    .toBeLessThanOrEqual(innerWidth);
}

test.describe('Controls panel layout', () => {
  for (const vp of VIEWPORTS) {
    const size = `${vp.width}x${vp.height}`;

    test(`buttons stay inside their panels at ${size} (single mode)`, async ({ page }) => {
      await page.setViewportSize(vp);
      await routeExternal(page);
      await page.goto('/');
      await expect(page.locator('#unified-start')).toBeVisible();
      await expectButtonsInsidePanels(page, `${size} single`);

      // "Running" label is wider than "Start".
      await page.locator('#unified-start').click();
      await expect(page.locator('#unified-start')).toHaveText(/Running/);
      await expectButtonsInsidePanels(page, `${size} single running`);
    });

    test(`buttons stay inside their panels at ${size} (compare mode)`, async ({ page }) => {
      await page.setViewportSize(vp);
      await routeExternal(page);
      await page.goto('/');
      await page.locator('#compare-toggle').click();
      await expect(page.locator('#window-2')).toBeVisible();
      await expectButtonsInsidePanels(page, `${size} compare`);
    });
  }
});
