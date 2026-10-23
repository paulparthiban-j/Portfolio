import { test, expect } from '@playwright/test';

const projectTitles = [
  'AdminCore - Enterprise Access Management',
  'P2P - Supply Chain Management System',
  'Purchase Request Management System',
  'Gesture-Controlled Video Player',
  'FamilyVerse Platform',
  'DISTRIBIZ ERP - Multi-Tenant Supply Chain Platform',
  'Personal Portfolio Website',
];

test('every project modal scrolls and restores the page on desktop', async ({ page }) => {
  await page.goto('/');

  for (const [index, title] of projectTitles.entries()) {
    const cardTitle = page.getByRole('heading', { name: title });
    await cardTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const pageScrollY = await page.evaluate(() => window.scrollY);
    await cardTitle.click();

    const dialog = page.getByRole('dialog', { name: `Project details: ${title}` });
    const details = dialog.locator(`[aria-label="${title} details"]`);
    await expect(details).toBeVisible();
    await page.waitForTimeout(800);
    const dimensions = await details.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
    const lockedScrollY = pageScrollY;
    expect(await page.evaluate(() => window.scrollY)).toBe(lockedScrollY);
    expect(lockedScrollY).toBe(pageScrollY);

    await details.hover();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => details.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await details.focus();
    await page.keyboard.press('PageDown');
    await expect.poll(() => details.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(lockedScrollY);

    // Exercise cleanup repeatedly to catch stale body locks or Lenis state.
    if (index === 0) {
      for (let cycle = 0; cycle < 2; cycle++) {
        await cardTitle.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('button', { name: 'Close project details' }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollY);
      }
    }
  }
});

test('project details accept native touch scrolling on mobile', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    await page.goto('/');
    const cardTitle = page.getByRole('heading', { name: projectTitles[0] });
    await cardTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const pageScrollY = await page.evaluate(() => window.scrollY);
    await cardTitle.click();

    await expect(page.getByRole('dialog')).toBeVisible();
    const details = page.locator(`[aria-label="${projectTitles[0]} details"]`);
    await expect(details).toBeVisible();
    const start = await details.boundingBox();
    expect(start).not.toBeNull();
    const x = start!.x + start!.width / 2;
    const fromY = start!.y + start!.height * 0.8;
    const toY = start!.y + start!.height * 0.3;
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: fromY }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: toY }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => details.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    const lockedScrollY = pageScrollY;
    expect(await page.evaluate(() => window.scrollY)).toBe(lockedScrollY);
    await page.getByRole('button', { name: 'Close project details' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(lockedScrollY).toBe(pageScrollY);
    expect(await page.evaluate(() => window.scrollY)).toBe(lockedScrollY);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  } finally {
    await context.close();
  }
});
