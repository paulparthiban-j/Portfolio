import { test, expect } from '@playwright/test';
import { TEST_ADMIN_PASSWORD } from '../test-env';

// app/admin/page.tsx has no data-testid/id/htmlFor wiring on its password field,
// only a placeholder - getByPlaceholder is the stable locator here.

test.describe('Admin authentication', () => {
  // POST /api/admin/login is rate-limited (5/hour) per identifier, and that
  // identifier is IP+User-Agent (lib/rateLimit.ts) - with no forwarded-IP
  // header locally, every spec file's login attempts would otherwise share
  // one bucket with the whole rest of this project's run and could exhaust
  // it before an unrelated file's turn. A distinct UA per file keeps each
  // file's login attempts in their own bucket.
  test.use({ userAgent: 'playwright-e2e-admin-auth' });

  test('wrong password shows an error and does not navigate away', async ({ page }) => {
    await page.goto('/admin');

    await page.getByPlaceholder('Enter your password').fill('definitely-the-wrong-password');
    await page.getByRole('button', { name: 'Access Dashboard' }).click();

    // POST /api/admin/login returns { error: "Invalid password" } on a bad
    // password (see app/api/admin/login/route.ts) - the login page renders that
    // string verbatim.
    await expect(page.getByText('Invalid password')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('@critical correct password navigates to the dashboard and renders real admin content', async ({ page }) => {
    // Previously the dashboard was only hidden client-side rather than truly
    // gated, so what matters here is proving the whole chain works in a real
    // browser: submit -> cookie set -> client-side navigation -> dashboard's own
    // auth-check -> portfolio fetch -> actual content rendered (not stuck on the
    // loading spinner and not bounced back to /admin).
    await page.goto('/admin');

    await page.getByPlaceholder('Enter your password').fill(TEST_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Access Dashboard' }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  });

  test('visiting /admin/dashboard with no prior login redirects back to /admin', async ({ page }) => {
    // The `page` fixture gives each test its own fresh browser context with no
    // cookies, so this is already an unauthenticated session - no explicit
    // logout/cookie-clearing step is needed.
    //
    // NOTE: this only proves the client-side UX redirect works (dashboard's
    // useEffect calls GET /api/admin/check, gets isAdmin:false, and does
    // router.push("/admin") before ever rendering real content). It is NOT the
    // real security boundary - that's server-side auth on the admin API routes
    // (the admin_token cookie check repeated in every /api/admin/** route),
    // which is covered by the other agent's API-level tests. Someone hitting
    // those API routes directly, bypassing this page entirely, would be stopped
    // there, not here.
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Admin Portal' })).toBeVisible();

    // Real admin content must never be left visible, not even momentarily.
    await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Save Changes' })).toHaveCount(0);
  });
});
