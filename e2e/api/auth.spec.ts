import { test, expect } from '@playwright/test';
import { uaHeaders, loginAs } from './helpers';
import { TEST_ADMIN_PASSWORD, TEST_ADMIN_TOKEN } from '../test-env';

test.describe('POST /api/admin/login', () => {
  test('accepts the correct password, returns success, and sets the admin_token cookie', async ({ request }) => {
    const res = await loginAs(request, uaHeaders('login-correct'));

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const state = await request.storageState();
    const cookie = state.cookies.find((c) => c.name === 'admin_token');
    expect(cookie).toBeTruthy();
    expect(cookie?.value).toBe(TEST_ADMIN_TOKEN);
  });

  test('rejects an incorrect password with 401 and sets no cookie', async ({ request }) => {
    const res = await request.post('/api/admin/login', {
      headers: uaHeaders('login-wrong-password'),
      data: { password: 'definitely-not-the-password' },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBeTruthy();

    const state = await request.storageState();
    const cookie = state.cookies.find((c) => c.name === 'admin_token');
    expect(cookie).toBeUndefined();
  });

  test('blocks the 6th login attempt within the hour with 429 @critical', async ({ request }) => {
    // Reused across every call in this test on purpose - this is the one
    // scenario that must accumulate toward a single rate-limit bucket.
    const headers = uaHeaders('login-ratelimit');

    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/admin/login', {
        headers,
        data: { password: 'wrong-on-purpose' },
      });
      expect(res.status()).toBe(401);
    }

    // The 6th attempt uses the CORRECT password, and must still be blocked -
    // proving the rate limiter fires unconditionally once its bucket (5/hour,
    // added ahead of the password check) is exhausted, not just for bad guesses.
    const blocked = await request.post('/api/admin/login', {
      headers,
      data: { password: TEST_ADMIN_PASSWORD },
    });

    expect(blocked.status()).toBe(429);
    expect(blocked.headers()['x-ratelimit-remaining']).toBe('0');
    const body = await blocked.json();
    expect(body.error).toBeTruthy();
  });
});

test.describe('GET /api/admin/check', () => {
  test('reports isAdmin false with no cookie at all', async ({ request }) => {
    const res = await request.get('/api/admin/check', { headers: uaHeaders('check-no-cookie') });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.isAdmin).toBe(false);
  });

  test('reports isAdmin false with a tampered/garbage cookie value', async ({ request }) => {
    // Fresh request context (no prior loginAs call in this test) so there is
    // no stored cookie to interact with - the explicit Cookie header below is
    // the only cookie data this request carries.
    const res = await request.get('/api/admin/check', {
      headers: { ...uaHeaders('check-tampered-cookie'), Cookie: 'admin_token=totally-bogus-tampered-value' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.isAdmin).toBe(false);
  });

  test('reports isAdmin true after a successful login', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('check-after-login'));
    expect(loginRes.ok()).toBeTruthy();

    const res = await request.get('/api/admin/check', { headers: uaHeaders('check-after-login-verify') });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.isAdmin).toBe(true);
  });
});

test.describe('POST /api/admin/logout', () => {
  test('clears the cookie so a subsequent check reports isAdmin false', async ({ request }) => {
    const loginRes = await loginAs(request, uaHeaders('logout-flow-login'));
    expect(loginRes.ok()).toBeTruthy();

    const checkBefore = await request.get('/api/admin/check', { headers: uaHeaders('logout-flow-check-before') });
    expect((await checkBefore.json()).isAdmin).toBe(true);

    const logoutRes = await request.post('/api/admin/logout', { headers: uaHeaders('logout-flow-logout') });
    expect(logoutRes.status()).toBe(200);
    expect((await logoutRes.json()).success).toBe(true);

    const checkAfter = await request.get('/api/admin/check', { headers: uaHeaders('logout-flow-check-after') });
    expect((await checkAfter.json()).isAdmin).toBe(false);
  });
});
