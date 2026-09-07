import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, getClientIdentifier } from './rateLimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Every test below uses its own unique identifier string. checkRateLimit
  // is backed by a module-level Map created once when the module loads, so
  // it persists for the lifetime of this test file - reusing an identifier
  // across tests would leak counts between them.

  it('allows the first call for a new identifier, with remaining = maxRequests - 1', () => {
    const result = checkRateLimit('rl-first-call', { windowMs: 1000, maxRequests: 5 });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows calls up to maxRequests', () => {
    const id = 'rl-up-to-max';
    const config = { windowMs: 1000, maxRequests: 3 };

    for (let i = 0; i < 3; i++) {
      const result = checkRateLimit(id, config);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks requests once over the limit @critical', () => {
    const id = 'rl-over-limit';
    const config = { windowMs: 1000, maxRequests: 3 };

    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, config);
    }
    const result = checkRateLimit(id, config);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets the window after resetTime has passed, allowing requests again with a fresh count', () => {
    const id = 'rl-window-reset';
    const config = { windowMs: 1000, maxRequests: 2 };

    checkRateLimit(id, config); // 1st, allowed
    checkRateLimit(id, config); // 2nd, allowed
    const blocked = checkRateLimit(id, config); // 3rd, blocked
    expect(blocked.allowed).toBe(false);

    vi.setSystemTime(blocked.resetTime + 1);

    const afterReset = checkRateLimit(id, config);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1); // maxRequests - 1, counter restarted
  });

  it('tracks two different identifiers independently @critical', () => {
    const idA = 'rl-independent-a';
    const idB = 'rl-independent-b';
    const config = { windowMs: 1000, maxRequests: 1 };

    const firstA = checkRateLimit(idA, config);
    expect(firstA.allowed).toBe(true);

    const secondA = checkRateLimit(idA, config); // A is now over its limit
    expect(secondA.allowed).toBe(false);

    const firstB = checkRateLimit(idB, config); // B is unaffected by A's usage
    expect(firstB.allowed).toBe(true);
    expect(firstB.remaining).toBe(0);
  });
});

describe('getClientIdentifier', () => {
  it('uses the x-forwarded-for header when present (real Headers object)', () => {
    const headers = new Headers({
      'x-forwarded-for': '1.2.3.4',
      'user-agent': 'TestAgent/1.0',
    });

    expect(getClientIdentifier(headers)).toBe('1.2.3.4-TestAgent/1.0');
  });

  it('takes the first entry of a comma-separated x-forwarded-for list', () => {
    const headers = new Headers({
      'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12',
      'user-agent': 'TestAgent/1.0',
    });

    expect(getClientIdentifier(headers)).toBe('1.2.3.4-TestAgent/1.0');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent (real Headers object)', () => {
    const headers = new Headers({
      'x-real-ip': '9.9.9.9',
      'user-agent': 'TestAgent/1.0',
    });

    expect(getClientIdentifier(headers)).toBe('9.9.9.9-TestAgent/1.0');
  });

  it("falls back to 'unknown-unknown' when neither header nor user-agent is present", () => {
    const headers = new Headers({});

    expect(getClientIdentifier(headers)).toBe('unknown-unknown');
  });

  it('works with a plain-object headers shape (no .get method) when x-forwarded-for is present', () => {
    const headers = { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'TestAgent/1.0' };

    expect(getClientIdentifier(headers)).toBe('1.2.3.4-TestAgent/1.0');
  });

  it('documents a quirk: for the plain-object shape, x-real-ip is never consulted, even when x-forwarded-for is absent', () => {
    // getClientIdentifier's internal getHeader() falls back to the literal
    // string 'unknown' for a missing key ONLY on the plain-object branch
    // (`headers[key] || 'unknown'`); the real-Headers branch just returns
    // whatever `.get()` gives back (null for a missing header). Since
    // 'unknown' is truthy, the outer `forwarded ? ... : getHeader('x-real-ip')`
    // ternary always takes the truthy branch for plain objects, so
    // x-real-ip's fallback (which works correctly for real Headers objects,
    // see the test above) is unreachable dead code on this branch - even
    // when x-real-ip is present in the plain object, it's ignored, and the
    // identifier ends up using the literal string 'unknown' as the IP.
    const headers = { 'x-real-ip': '9.9.9.9', 'user-agent': 'TestAgent/1.0' };

    expect(getClientIdentifier(headers)).toBe('unknown-TestAgent/1.0');
  });
});
