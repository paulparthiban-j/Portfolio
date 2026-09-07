import { APIRequestContext, APIResponse } from '@playwright/test';
import { TEST_ADMIN_PASSWORD } from '../test-env';

/**
 * Rate-limit isolation for the API test suite.
 *
 * Every mutating route calls `checkRateLimit(identifier, {windowMs, maxRequests})`
 * from lib/rateLimit.ts, backed by ONE module-level `Map<string, {count, resetTime}>`
 * inside the single `next dev` process this whole test run shares.
 *
 * Two things make this dangerous for a naive test suite:
 *
 * 1. `getClientIdentifier` builds the key from `x-forwarded-for`/`x-real-ip` (both
 *    absent for local Playwright requests, so both resolve to 'unknown') plus
 *    User-Agent. Without a distinguishing header, EVERY request collapses onto the
 *    same identifier string.
 * 2. The Map is keyed by that identifier string ALONE - it does not include the
 *    route/path. So two different routes (e.g. login's 5/hour and the resume
 *    upload's 3/hour) sharing an identifier also silently share ONE counter, each
 *    just interpreting it against its own configured maxRequests. A test hitting
 *    route A can exhaust (or partially consume) the budget a completely unrelated
 *    test expects to have for route B.
 *
 * The fix: give every logical test scenario its own headers via `uaHeaders(label)`,
 * called once and reused only within that scenario. The random suffix makes the
 * resulting identifier effectively unique, so unrelated scenarios (same file,
 * different file, same route, different route) never share a bucket by accident.
 *
 * The one deliberate exception: a test that specifically proves rate-limiting
 * works should call `uaHeaders(label)` ONCE, store it, and reuse that exact same
 * headers object across its own repeated calls so they accumulate toward the same
 * bucket.
 */
export function uaHeaders(label: string): Record<string, string> {
  return {
    'User-Agent': `pw-e2e-${label}-${Math.random().toString(36).slice(2)}`,
  };
}

/**
 * Logs in as the test admin using the given headers (normally a fresh call to
 * `uaHeaders(...)`) and returns the raw response - callers assert on it
 * themselves, e.g. `expect((await loginAs(request, uaHeaders('x'))).ok()).toBeTruthy()`.
 *
 * On success the route sets the `admin_token` cookie via `Set-Cookie`. Playwright's
 * `request` fixture keeps its own per-test cookie jar and automatically attaches
 * stored cookies to later calls made with that SAME `request` context, regardless
 * of what headers those later calls pass - cookie persistence does not depend on
 * reusing the same User-Agent (only rate-limit bucketing does, see `uaHeaders`
 * above). Each Playwright test gets a fresh, isolated `request` context, so a
 * login performed in one test is never visible to another.
 */
export async function loginAs(
  request: APIRequestContext,
  headers: Record<string, string>
): Promise<APIResponse> {
  return request.post('/api/admin/login', {
    headers,
    data: { password: TEST_ADMIN_PASSWORD },
  });
}
