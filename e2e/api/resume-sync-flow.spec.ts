import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { uaHeaders, loginAs } from './helpers';

// Real fixture at the repo root. Its Summary and the P2P project's bullets
// (in the Projects section) contain `\%` (an escaped LaTeX percent sign) -
// exactly the sequence the comment-stripping regex used to mishandle.
const FIXTURE_PATH = path.join(process.cwd(), 'ai-native-resume.tex');

test.describe('resume sync flow (upload-tex -> parse-and-preview -> update-from-tex)', () => {
  test('uploads, parses without %-truncation, and update-from-tex succeeds instead of false-reporting failure @critical', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('sync-flow-login'));
    expect(loginRes.ok()).toBeTruthy();

    const beforeRes = await request.get('/api/portfolio', { headers: uaHeaders('sync-flow-before') });
    expect(beforeRes.status()).toBe(200);
    const beforeData = await beforeRes.json();

    // --- Step 1: upload-tex ---
    const texBuffer = fs.readFileSync(FIXTURE_PATH);
    const uploadRes = await request.post('/api/admin/resume/upload-tex', {
      headers: uaHeaders('sync-flow-upload-tex'),
      multipart: {
        resume: { name: 'ai-native-resume.tex', mimeType: 'text/x-tex', buffer: texBuffer },
      },
    });
    expect(uploadRes.status()).toBe(200);
    const uploadBody = await uploadRes.json();
    expect(uploadBody.success).toBe(true);
    expect(typeof uploadBody.filePath).toBe('string');
    const filePath: string = uploadBody.filePath;
    expect(fs.existsSync(filePath)).toBe(true);

    // --- Step 2: parse-and-preview ---
    const parseRes = await request.post('/api/admin/resume/parse-and-preview', {
      headers: uaHeaders('sync-flow-parse'),
      data: { filePath },
    });
    expect(parseRes.status()).toBe(200);
    const parseBody = await parseRes.json();
    expect(parseBody.success).toBe(true);
    expect(parseBody.parsedData).toBeTruthy();
    expect(parseBody.changePreview).toBeTruthy();

    // Regression: the LaTeX comment-stripping regex used to treat ANY `%`
    // (including an escaped `\%`) as the start of a comment and strip to end
    // of line. The Summary line reads "...(40\% efficiency improvement),
    // and handled high-volume transactions...troubleshooting." - under the
    // bug this would have been silently cut down to end at "...(40". The
    // fix (a negative lookbehind for `\` in the comment regex) must leave it
    // intact.
    expect(parseBody.parsedData.description).toContain('40% efficiency improvement');
    expect(parseBody.parsedData.description).not.toMatch(/\(40$/);
    // "production troubleshooting" is the tail of that same paragraph, well
    // after the "(40" point - its presence is direct proof nothing downstream
    // of the escaped percent was truncated.
    expect(parseBody.parsedData.description).toContain('production troubleshooting');

    // The same `\%` escape also appears twice more, in the P2P project's
    // bullet points (Projects section) - confirm both survive intact too.
    const parsedDataStr = JSON.stringify(parseBody.parsedData);
    expect(parsedDataStr).toContain('40% through workflow optimization');
    expect(parsedDataStr).toContain('25% with optimized database operations');

    // --- Step 3: update-from-tex ---
    const updateRes = await request.post('/api/admin/resume/update-from-tex', {
      headers: uaHeaders('sync-flow-update'),
      data: { newPortfolioData: parseBody.parsedData, filePath },
    });
    // Regression: this endpoint used to read `request.json()` twice, which
    // throws on the second read and made every successful save incorrectly
    // report HTTP 500. A valid request must now return 200.
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);

    // (a) GET /api/portfolio reflects the resume-derived fields.
    const afterRes = await request.get('/api/portfolio', { headers: uaHeaders('sync-flow-after') });
    expect(afterRes.status()).toBe(200);
    const afterData = await afterRes.json();
    expect(afterData.name).toBe('PAUL PARTHIBAN J');
    expect(afterData.title).toContain('Software Engineer');

    // (b) Admin-curated fields such as theme are preserved by
    // mergePortfolioData, unchanged from immediately before this sync.
    expect(afterData.theme).toEqual(beforeData.theme);

    // (c) The temp .tex file from step 1 was cleaned up - the other half of
    // the same double-body-read bug: cleanup ran after the second (throwing)
    // body read, so it never used to execute.
    expect(fs.existsSync(filePath)).toBe(false);
  });

  test('parse-and-preview rejects a filePath outside temp/, including a same-prefix sibling directory', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('sync-flow-traversal-login'));
    expect(loginRes.ok()).toBeTruthy();

    const outsideRes = await request.post('/api/admin/resume/parse-and-preview', {
      headers: uaHeaders('sync-flow-traversal-outside'),
      data: { filePath: '../../etc/passwd' },
    });
    expect(outsideRes.status()).toBe(400);

    // Hardening regression: a sibling directory whose name merely STARTS
    // WITH "temp" (e.g. "temp-evil") must not satisfy the guard. This only
    // works because the route compares against tempDir + a trailing path
    // separator, not the bare tempDir string - a naive `startsWith(tempDir)`
    // check would have wrongly let this through.
    const tempDirNoSep = path.join(process.cwd(), 'temp');
    const siblingPath = `${tempDirNoSep}-evil${path.sep}x.tex`;
    const siblingRes = await request.post('/api/admin/resume/parse-and-preview', {
      headers: uaHeaders('sync-flow-traversal-sibling'),
      data: { filePath: siblingPath },
    });
    expect(siblingRes.status()).toBe(400);
  });

  test('update-from-tex requires newPortfolioData in the body', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('sync-flow-missing-data-login'));
    expect(loginRes.ok()).toBeTruthy();

    const res = await request.post('/api/admin/resume/update-from-tex', {
      headers: uaHeaders('sync-flow-missing-data'),
      data: { filePath: 'irrelevant-for-this-test' },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test('update-from-tex requires authentication', async ({ request }) => {
    const res = await request.post('/api/admin/resume/update-from-tex', {
      headers: uaHeaders('sync-flow-no-auth'),
      data: { newPortfolioData: { name: 'Someone Else' } },
    });

    expect(res.status()).toBe(401);
  });
});
