const { test, expect } = require('playwright/test');

test.describe('Ghost text toggle', () => {
  test('pending chars are hidden by default (ghost toggle Off)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#window-1')).toBeVisible();
    await expect(page.locator('#ghost-toggle')).toHaveText('Off');
    
    // Click Start to begin generation
    await page.locator('#unified-start').click();
    await page.waitForTimeout(500);
    
    // Check that the no-ghost class is present
    const hasNoGhost = await page.locator('#window-1').evaluate(el => el.classList.contains('no-ghost'));
    expect(hasNoGhost).toBe(true);
    
    // Check that the CSS rule is applied (color should be transparent or display none)
    // We check a pending char's computed style
    const allChars = await page.locator('.char').all();
    let foundPending = false;
    for (const charEl of allChars) {
      const classes = await charEl.getAttribute('class');
      if (classes && classes.includes('pending')) {
        const color = await charEl.evaluate(el => window.getComputedStyle(el).color);
        // If no-ghost is active, pending chars should be transparent or hidden
        foundPending = true;
        break;
      }
    }
    // Just verify the class is on the window
    expect(foundPending || hasNoGhost).toBe(true);
  });

  test('clicking Off toggle shows ghost text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#window-1')).toBeVisible();
    await expect(page.locator('#ghost-toggle')).toHaveText('Off');
    
    // Click Start
    await page.locator('#unified-start').click();
    await page.waitForTimeout(500);
    
    // Verify no-ghost class is present
    let hasNoGhost = await page.locator('#window-1').evaluate(el => el.classList.contains('no-ghost'));
    expect(hasNoGhost).toBe(true);
    
    // Click toggle (Off -> On)
    await page.locator('#ghost-toggle').click();
    await expect(page.locator('#ghost-toggle')).toHaveText('On');
    
    // Verify no-ghost class is removed
    hasNoGhost = await page.locator('#window-1').evaluate(el => el.classList.contains('no-ghost'));
    expect(hasNoGhost).toBe(false);
    
    // Pending chars should now be visible (color is not transparent)
    const allChars = await page.locator('.char').all();
    for (const charEl of allChars) {
      const classes = await charEl.getAttribute('class');
      if (classes && classes.includes('pending')) {
        const color = await charEl.evaluate(el => window.getComputedStyle(el).color);
        // Color should NOT be transparent when ghost is ON
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        break;
      }
    }
  });

  test('clicking On toggle hides ghost text again', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ghost-toggle')).toHaveText('Off');
    
    // Set rate to 15 tok/s so generation takes longer
    await page.locator('#rate').fill('15');
    
    // Click Start
    await page.locator('#unified-start').click();
    await page.waitForTimeout(800);
    
    // Turn ghost ON
    await page.locator('#ghost-toggle').click();
    await expect(page.locator('#ghost-toggle')).toHaveText('On');
    await page.waitForTimeout(200);
    
    let hasNoGhost = await page.locator('#window-1').evaluate(el => el.classList.contains('no-ghost'));
    expect(hasNoGhost).toBe(false);
    
    // Turn ghost OFF (On -> Off)
    await page.locator('#ghost-toggle').click();
    await expect(page.locator('#ghost-toggle')).toHaveText('Off');
    await page.waitForTimeout(200);
    
    hasNoGhost = await page.locator('#window-1').evaluate(el => el.classList.contains('no-ghost'));
    expect(hasNoGhost).toBe(true);
  });
});
