// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60 * 60 * 1000, maxRequests: 5 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (now > record.resetTime) {
    // Window expired, reset
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function getClientIdentifier(headers: Headers | any): string {
  // Handle both Headers and ReadonlyHeaders
  const getHeader = (key: string) => {
    if (typeof headers.get === 'function') {
      return headers.get(key);
    }
    return headers[key] || 'unknown';
  };

  // Use IP + User-Agent for basic identification
  const forwarded = getHeader('x-forwarded-for');
  const ip = forwarded ? String(forwarded).split(',')[0] : getHeader('x-real-ip') || 'unknown';
  const userAgent = getHeader('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

// Cleanup old entries periodically (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
