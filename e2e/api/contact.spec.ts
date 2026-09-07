import { test, expect } from '@playwright/test';
import { uaHeaders } from './helpers';

// Boundary-value coverage lives with the route's own validation logic in
// lib/validation.ts; this file only needs to prove POST /api/contact wires
// that validation (and the rate limiter) in correctly end to end.
const VALID_PAYLOAD = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  message: 'This is a perfectly valid test message for the contact form endpoint.',
};

test.describe('POST /api/contact', () => {
  test('accepts a valid submission', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: uaHeaders('contact-valid'),
      data: VALID_PAYLOAD,
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test('rejects a submission missing a required field', async ({ request }) => {
    const headers = uaHeaders('contact-missing-field');

    const missingName = await request.post('/api/contact', {
      headers,
      data: { email: VALID_PAYLOAD.email, message: VALID_PAYLOAD.message },
    });
    expect(missingName.status()).toBe(400);

    const missingEmail = await request.post('/api/contact', {
      headers,
      data: { name: VALID_PAYLOAD.name, message: VALID_PAYLOAD.message },
    });
    expect(missingEmail.status()).toBe(400);

    const missingMessage = await request.post('/api/contact', {
      headers,
      data: { name: VALID_PAYLOAD.name, email: VALID_PAYLOAD.email },
    });
    expect(missingMessage.status()).toBe(400);
  });

  test('rejects an invalid email address', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: uaHeaders('contact-invalid-email'),
      data: { ...VALID_PAYLOAD, email: 'not-an-email' },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('email');
  });

  test('rejects a name outside the 2-100 character range', async ({ request }) => {
    const headers = uaHeaders('contact-name-length');

    const tooShort = await request.post('/api/contact', {
      headers,
      data: { ...VALID_PAYLOAD, name: 'A' },
    });
    expect(tooShort.status()).toBe(400);

    const tooLong = await request.post('/api/contact', {
      headers,
      data: { ...VALID_PAYLOAD, name: 'A'.repeat(101) },
    });
    expect(tooLong.status()).toBe(400);
  });

  test('rejects a message outside the 10-2000 character range', async ({ request }) => {
    const headers = uaHeaders('contact-message-length');

    const tooShort = await request.post('/api/contact', {
      headers,
      data: { ...VALID_PAYLOAD, message: 'short' },
    });
    expect(tooShort.status()).toBe(400);

    const tooLong = await request.post('/api/contact', {
      headers,
      data: { ...VALID_PAYLOAD, message: 'x'.repeat(2001) },
    });
    expect(tooLong.status()).toBe(400);
  });

  test('enforces the 5/hour rate limit', async ({ request }) => {
    // Reused across every call in this test on purpose, to accumulate
    // toward a single rate-limit bucket.
    const headers = uaHeaders('contact-ratelimit');

    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/contact', { headers, data: VALID_PAYLOAD });
      expect(res.status()).not.toBe(429);
    }

    const blocked = await request.post('/api/contact', { headers, data: VALID_PAYLOAD });
    expect(blocked.status()).toBe(429);
    expect(blocked.headers()['x-ratelimit-remaining']).toBe('0');
  });
});
