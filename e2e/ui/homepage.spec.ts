import { test, expect } from '@playwright/test';

// Smoke coverage for the public homepage (app/page.tsx) plus a real end-to-end
// pass through the contact form in Footer.tsx. Validation edge cases for
// POST /api/contact (bad email, short message, rate limiting, etc.) are covered
// by the API project's tests - this file only proves the real browser wiring
// (form -> fetch -> success UI) works once.

test.describe('Homepage', () => {
  test('loads with no unexpected console errors and renders all key sections', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // TechIcon.tsx renders skill icons from the third-party cdn.simpleicons.org
    // by guessing a slug from the skill name, with a graceful onError fallback
    // (a colored initial-letter badge) when a guess is wrong. A handful of
    // guesses for this resume's skills (C#, SQL Server, WinSCP) don't match
    // any real slug on that CDN and 404 - by design, already handled in the
    // UI, and not something this test suite can fix (see the QA report for
    // the confirmed list). Chromium's console API doesn't include the
    // resource URL for these, only this generic browser-emitted message, so
    // it's allow-listed by exact text rather than by URL.
    const IGNORED_CONSOLE_ERRORS = new Set(['Failed to load resource: the server responded with a status of 404 ()']);

    await page.goto('/');

    // Hero renders first and gates on a `mounted` flag - use it as the readiness
    // signal. Generous timeout since this is the first request to the route and
    // Next dev may still be compiling it.
    await expect(page.locator('[aria-label="Hero section"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('DEPLOYED PROJECTS')).toBeVisible();

    // Every other section is lazy-loaded (React.lazy + Suspense) below the fold.
    // app/page.tsx wraps each one in a div with a hardcoded aria-label - these
    // labels live in the component code, not data/portfolio.json, so they stay
    // valid regardless of what other spec files in this run have edited.
    for (const label of [
      'About section',
      'Skills section',
      'Projects section',
      'Experience section',
      'Credibility section',
      'Education section',
      'Contact section',
    ]) {
      await expect(page.locator(`[aria-label="${label}"]`)).toBeVisible();
    }

    // A couple of static, non-data-driven text fragments confirm real content
    // rendered inside those wrappers rather than an empty Suspense fallback.
    await expect(
      page.getByText('Solving complex problems with elegant code and innovative solutions.')
    ).toBeVisible();

    const unexpectedErrors = consoleErrors.filter((e) => !IGNORED_CONSOLE_ERRORS.has(e));
    expect(
      unexpectedErrors,
      `Expected no unexpected console errors during homepage load, got:\n${unexpectedErrors.join('\n')}`
    ).toEqual([]);
  });

  test('contact form submits successfully end-to-end', async ({ page }) => {
    await page.goto('/');

    // Footer.tsx's fields are properly associated via <label htmlFor> / id, so
    // getByLabel works here (unlike the admin dashboard, which has none of that).
    await page.getByLabel('Name').fill('E2E Test User');
    await page.getByLabel('Email').fill('e2e-test@example.com');
    await page
      .getByLabel('Message')
      .fill('This is an automated Playwright end-to-end test message - please disregard.');

    await page.getByRole('button', { name: 'Send Message' }).click();

    // On success the whole form is replaced by a confirmation panel.
    await expect(page.getByRole('heading', { name: 'Message Sent!' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("I'll get back to you soon.")).toBeVisible();
  });
});
