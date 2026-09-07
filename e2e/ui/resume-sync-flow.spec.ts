import path from 'path';
import { test, expect } from '@playwright/test';
import { TEST_ADMIN_PASSWORD } from '../test-env';

// The newest and, before this test existed, completely untested admin flow:
// upload a .tex resume -> parse + preview -> confirm -> portfolio.json updated.
// Drives handleTexUpload and handleConfirmUpdate in
// app/admin/dashboard/page.tsx through the real upload-tex / parse-and-preview /
// update-from-tex API routes, using the real fixture file at the repo root,
// ai-native-resume.tex.

// See admin-auth.spec.ts for why each file uses a distinct userAgent: it
// keeps this file's one login attempt in its own rate-limit bucket, separate
// from every other spec file's attempts against the same shared dev server.
test.use({ userAgent: 'playwright-e2e-resume-sync-flow' });

test('@critical upload, parse-preview, and confirm updates the portfolio end-to-end', async ({ page }) => {
  const loginRes = await page.request.post('/api/admin/login', {
    data: { password: TEST_ADMIN_PASSWORD },
  });
  expect(loginRes.ok()).toBeTruthy();

  // Force a known starting name before syncing. Without this, running the
  // 'api' project's own resume-sync-flow test earlier in the same overall
  // `playwright test` invocation (it uses this same real .tex fixture) can
  // leave data/portfolio.json's name already equal to the parsed value -
  // parse-and-preview's diff only lists 'added'/'modified' fields, so with
  // nothing to change, the assertion below would find no diff line to match,
  // not because the sync is broken but because there was nothing to sync.
  // POST /api/portfolio does a raw overwrite (not a merge), so the full
  // current object must be fetched and only `name` changed - never send a
  // partial object, or every other field would be wiped.
  const currentPortfolio = await (await page.request.get('/api/portfolio')).json();
  const resetRes = await page.request.post('/api/portfolio', {
    data: { ...currentPortfolio, name: 'Pre-Sync Placeholder Name' },
  });
  expect(resetRes.ok()).toBeTruthy();

  await page.goto('/admin/dashboard');
  await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
    timeout: 10000,
  });

  await page.getByRole('button', { name: 'Resume Sync' }).click();
  await expect(page.getByRole('heading', { name: 'Resume Sync from LaTeX' })).toBeVisible();

  // The only .tex file input on the page - the PDF resume uploader on the
  // "Identity" tab is a separate <input accept=".pdf">.
  const texInput = page.locator('input[type="file"][accept=".tex"]');
  const texFilePath = path.join(process.cwd(), 'ai-native-resume.tex');
  await texInput.setInputFiles(texFilePath);

  // handleTexUpload fires on change and chains two requests: POST upload-tex,
  // then POST parse-and-preview. Generous timeout to cover both round trips.
  await expect(page.getByRole('heading', { name: /Resume Parsed Successfully/ })).toBeVisible({
    timeout: 15000,
  });

  // The change-preview list (parse-and-preview/route.ts's generateChangePreview)
  // only prints a value for 'added'/'modified' fields - a field the parser
  // extracts unchanged from the current data is dropped entirely, so the JSX
  // never renders parsedData directly, only this diff. The fixture's header
  // line is `{\Large \textbf{PAUL PARTHIBAN J}}`; latex-parser.ts's parseHeader
  // extracts that verbatim (no case-folding) as personalInfo.name, which is
  // distinct from data/portfolio.json's current "Paul Parthiban J" - so this is
  // expected to show up as a 'modified' Personal Info change whose newValue is
  // exactly "PAUL PARTHIBAN J". exact:true avoids also matching the (case-
  // insensitively identical) old-value text rendered right next to it.
  await expect(page.getByText('PAUL PARTHIBAN J', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm & Update Portfolio' }).click();

  // Regression check: update-from-tex previously read `await request.json()`
  // twice (once for newPortfolioData, once for filePath), and the second read
  // of an already-consumed body always threw - so this exact successful flow
  // used to land on the catch block and show "Update failed." even though nothing
  // was actually wrong with the data. The fix destructures both fields from a
  // single request.json() call. This assertion is a real regression test for
  // that bug, not a trivial smoke check.
  await expect(page.getByText('Portfolio updated successfully!')).toBeVisible({ timeout: 15000 });

  // Reload and re-fetch through the real UI to confirm the write reached
  // data/portfolio.json, and that the dashboard now shows the resume's parsed
  // name instead of whatever was there before.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
    timeout: 10000,
  });
  await expect(page.locator('label:text-is("Full Name") + input')).toHaveValue('PAUL PARTHIBAN J');
});
