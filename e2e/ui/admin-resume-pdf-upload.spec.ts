import { test, expect } from '@playwright/test';
import { TEST_ADMIN_PASSWORD } from '../test-env';

// Regression test: handleResumeUpload used to hardcode
// `setData({ ...data, resumeUrl: "/resume.pdf" })` after every successful
// upload, ignoring the actual filename POST /api/admin/resume returns
// (resume_<timestamp>.pdf). Since /resume.pdf is a separate, permanently
// stale bundled file, the dashboard's own "Preview CV" link kept pointing at
// the OLD resume even right after uploading a new one - the one place an
// admin would look to confirm their upload worked showed the wrong file.
// Fixed to use the server's returned filename instead.

// See admin-auth.spec.ts for why each file uses a distinct userAgent.
test.use({ userAgent: 'playwright-e2e-admin-resume-pdf-upload' });

test('@critical uploading a resume PDF updates the dashboard preview link to the new file, not the stale bundled one', async ({ page }) => {
  const loginRes = await page.request.post('/api/admin/login', {
    data: { password: TEST_ADMIN_PASSWORD },
  });
  expect(loginRes.ok()).toBeTruthy();

  await page.goto('/admin/dashboard');
  await expect(page.getByRole('heading', { name: 'Portfolio Master Control' })).toBeVisible({
    timeout: 10000,
  });

  // The PDF uploader's <input accept=".pdf"> - distinct from the .tex
  // uploader on the Resume Sync tab, which uses accept=".tex".
  const pdfInput = page.locator('input[type="file"][accept=".pdf"]');
  await pdfInput.setInputFiles({
    name: 'e2e-test-resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 fake pdf for e2e upload test'),
  });

  await expect(page.getByText('Resume uploaded successfully!')).toBeVisible({ timeout: 10000 });

  // The regression: this href must be the just-uploaded resume_<ts>.pdf, not
  // the hardcoded, permanently-stale "/resume.pdf".
  const previewLink = page.getByRole('link', { name: 'Preview CV' });
  await expect(previewLink).toBeVisible();
  await expect(previewLink).toHaveAttribute('href', /^\/resume_\d+\.pdf$/);
});
