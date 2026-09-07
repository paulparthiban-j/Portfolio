import { test, expect } from '@playwright/test';
import { uaHeaders, loginAs } from './helpers';

// The route validates via the multipart field's declared Content-Type
// (`file.type !== "application/pdf"`) - it does not sniff magic bytes or
// check the extension - so a small fake buffer with the right mimeType is a
// valid fixture for the "accepted" path.
const PDF_BUFFER = Buffer.from('%PDF-1.4 fake pdf content for e2e testing');

test.describe('POST /api/admin/resume (PDF upload)', () => {
  test('requires the admin_token cookie', async ({ request }) => {
    const res = await request.post('/api/admin/resume', {
      headers: uaHeaders('resume-upload-no-auth'),
      multipart: {
        resume: { name: 'resume.pdf', mimeType: 'application/pdf', buffer: PDF_BUFFER },
      },
    });

    expect(res.status()).toBe(401);
  });

  test('accepts a PDF under 5MB when authenticated', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('resume-upload-valid-login'));
    expect(loginRes.ok()).toBeTruthy();

    const res = await request.post('/api/admin/resume', {
      headers: uaHeaders('resume-upload-valid'),
      multipart: {
        resume: { name: 'resume.pdf', mimeType: 'application/pdf', buffer: PDF_BUFFER },
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.filename).toMatch(/^resume_\d+\.pdf$/);
  });

  test('rejects a non-PDF mimetype', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('resume-upload-badtype-login'));
    expect(loginRes.ok()).toBeTruthy();

    const res = await request.post('/api/admin/resume', {
      headers: uaHeaders('resume-upload-badtype'),
      multipart: {
        resume: { name: 'resume.pdf', mimeType: 'text/plain', buffer: Buffer.from('not a pdf') },
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('PDF');
  });

  test('rejects a file over 5MB', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('resume-upload-toobig-login'));
    expect(loginRes.ok()).toBeTruthy();

    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1024, 'a');
    const res = await request.post('/api/admin/resume', {
      headers: uaHeaders('resume-upload-toobig'),
      multipart: {
        resume: { name: 'resume.pdf', mimeType: 'application/pdf', buffer: oversized },
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('5MB');
  });

  test('rejects a filename containing path-traversal characters', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('resume-upload-traversal-login'));
    expect(loginRes.ok()).toBeTruthy();
    const headers = uaHeaders('resume-upload-traversal');

    const dotDot = await request.post('/api/admin/resume', {
      headers,
      multipart: {
        resume: { name: '../evil.pdf', mimeType: 'application/pdf', buffer: PDF_BUFFER },
      },
    });
    expect(dotDot.status()).toBe(400);

    const backslash = await request.post('/api/admin/resume', {
      headers,
      multipart: {
        resume: { name: 'evil\\..\\name.pdf', mimeType: 'application/pdf', buffer: PDF_BUFFER },
      },
    });
    expect(backslash.status()).toBe(400);
  });

  test('the just-uploaded PDF becomes the file served by GET /api/resume', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('resume-upload-then-download-login'));
    expect(loginRes.ok()).toBeTruthy();

    const uploadRes = await request.post('/api/admin/resume', {
      headers: uaHeaders('resume-upload-then-download-upload'),
      multipart: {
        resume: { name: 'resume.pdf', mimeType: 'application/pdf', buffer: PDF_BUFFER },
      },
    });
    expect(uploadRes.status()).toBe(200);

    // GET /api/resume (public, unauthenticated) sorts public/resume_*.pdf by
    // the timestamp in the filename and serves the newest - our upload just
    // became that file.
    const downloadRes = await request.get('/api/resume', { headers: uaHeaders('resume-upload-then-download-get') });
    expect(downloadRes.status()).toBe(200);
    expect(downloadRes.headers()['content-type']).toBe('application/pdf');
  });
});
