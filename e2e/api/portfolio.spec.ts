import { test, expect } from '@playwright/test';
import { uaHeaders, loginAs } from './helpers';

test.describe('GET /api/portfolio', () => {
  test('is public and returns the full PortfolioContent shape', async ({ request }) => {
    const res = await request.get('/api/portfolio', { headers: uaHeaders('portfolio-get-public') });

    expect(res.status()).toBe(200);
    const body = await res.json();

    // types/portfolio.ts's PortfolioContent - spot-check required fields.
    expect(typeof body.name).toBe('string');
    expect(body.name.length).toBeGreaterThan(0);
    expect(body.theme).toBeTruthy();
    expect(typeof body.theme.mode).toBe('string');
    expect(Array.isArray(body.skills)).toBe(true);
    expect(Array.isArray(body.experience)).toBe(true);
    expect(Array.isArray(body.projects)).toBe(true);
  });
});

test.describe('POST /api/portfolio', () => {
  test('rejects an unauthenticated POST and does not persist it @critical', async ({ request }) => {
    const beforeRes = await request.get('/api/portfolio', { headers: uaHeaders('portfolio-post-noauth-before') });
    const before = await beforeRes.json();

    // Deliberately no cookie and no Authorization header of any kind - this
    // is the exact regression this route used to fail open on.
    const attemptedPayload = { ...before, description: `SHOULD-NOT-PERSIST-${Date.now()}` };
    const postRes = await request.post('/api/portfolio', {
      headers: uaHeaders('portfolio-post-noauth'),
      data: attemptedPayload,
    });

    expect(postRes.status()).toBe(401);
    const postBody = await postRes.json();
    expect(postBody.error).toBeTruthy();

    const afterRes = await request.get('/api/portfolio', { headers: uaHeaders('portfolio-post-noauth-after') });
    const after = await afterRes.json();
    expect(after.description).toBe(before.description);
    expect(after.description).not.toContain('SHOULD-NOT-PERSIST');
  });

  test('accepts an authenticated POST and the new content is retrievable via GET', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('portfolio-post-auth-login'));
    expect(loginRes.ok()).toBeTruthy();

    // This route does a raw overwrite, not a merge - always send back a
    // complete, valid object (a shallow-modified clone of the current one),
    // never a partial one.
    const beforeRes = await request.get('/api/portfolio', { headers: uaHeaders('portfolio-post-auth-before') });
    const before = await beforeRes.json();
    const marker = `e2e-test-description-${Date.now()}`;
    const fullPayload = { ...before, description: marker };

    const postRes = await request.post('/api/portfolio', {
      headers: uaHeaders('portfolio-post-auth'),
      data: fullPayload,
    });

    expect(postRes.status()).toBe(200);
    const postBody = await postRes.json();
    expect(postBody.success).toBe(true);

    const afterRes = await request.get('/api/portfolio', { headers: uaHeaders('portfolio-post-auth-after') });
    const after = await afterRes.json();
    expect(after.description).toBe(marker);
  });

  test('enforces the 10/hour rate limit', async ({ request }) => {
    // Reused across every call in this test on purpose. Every call here is
    // deliberately unauthenticated: the route checks the rate limit BEFORE
    // the auth cookie, so each of the first 10 is rate-limit-allowed but
    // then 401s on the auth check - none of them ever reach the write path,
    // so portfolio.json is never touched by this test.
    const headers = uaHeaders('portfolio-post-ratelimit');

    for (let i = 0; i < 10; i++) {
      const res = await request.post('/api/portfolio', { headers, data: {} });
      expect(res.status()).not.toBe(429);
    }

    const blocked = await request.post('/api/portfolio', { headers, data: {} });
    expect(blocked.status()).toBe(429);
    expect(blocked.headers()['x-ratelimit-remaining']).toBe('0');
  });
});
