import { test, expect } from '@playwright/test';
import { TEST_ADMIN_PASSWORD } from '../test-env';

// Proves the core admin editing workflow - the primary reason this dashboard
// exists - actually works end-to-end in a real browser: edit a field, save,
// reload, and confirm the write really reached data/portfolio.json.
//
// None of the dashboard's form fields use htmlFor/id or wrap their <input>, so
// getByLabel() can't find them (confirmed by reading app/admin/dashboard/page.tsx
// in full - there are no data-testids anywhere either). Each field is a
// `<label>text</label><input .../>` pair inside the same wrapping <div>, so
// `label:text-is("...") + input` (Playwright's CSS text-matching extension) is
// used instead to reach the sibling input precisely.

// See admin-auth.spec.ts for why each file uses a distinct userAgent: it
// keeps this file's one login attempt in its own rate-limit bucket, separate
// from every other spec file's attempts against the same shared dev server.
test.use({ userAgent: 'playwright-e2e-admin-dashboard-save' });

test('editing the Subtitle field and saving persists across a reload', async ({ page }) => {
  // Log in via a direct API request rather than driving the login form - faster,
  // and the resulting admin_token cookie is visible to the subsequent page.goto()
  // navigation because page.request shares its cookie jar with the browser
  // context `page` belongs to.
  const loginRes = await page.request.post('/api/admin/login', {
    data: { password: TEST_ADMIN_PASSWORD },
  });
  expect(loginRes.ok()).toBeTruthy();

  await page.goto('/admin/dashboard');
  await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
    timeout: 10000,
  });

  // "Identity" (activeTab id "general") is the default tab and holds Subtitle: a
  // plain top-level string field (no arrays/nested objects to juggle), and low
  // enough impact that overwriting it can't break theme/layout in a way that's
  // hard to eyeball-verify.
  const subtitleField = page.locator('label:text-is("Subtitle") + input');
  await expect(subtitleField).toBeVisible();

  const testValue = `E2E test subtitle - ${Date.now()} - safe to overwrite`;
  await subtitleField.fill(testValue);

  await page.getByRole('button', { name: 'Save Changes' }).click();

  // handleSave sets this exact string on a successful POST /api/portfolio.
  await expect(page.getByText('Portfolio updated successfully!')).toBeVisible({ timeout: 10000 });

  // Reload from scratch (re-runs the dashboard's auth check + GET /api/portfolio)
  // to prove the value was actually written to disk, not just held in React state.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
    timeout: 10000,
  });
  await expect(page.locator('label:text-is("Subtitle") + input')).toHaveValue(testValue);
});
