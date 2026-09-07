import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeInput } from './validation';

describe('validateEmail', () => {
  it('accepts well-formed emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
  });

  it('rejects an email with no @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects an email with no domain', () => {
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@example')).toBe(false); // no dot/TLD
  });

  it('rejects an empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('rejects a whitespace-only string', () => {
    expect(validateEmail('   ')).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('escapes <, >, ", and \' individually', () => {
    expect(sanitizeInput('<')).toBe('&lt;');
    expect(sanitizeInput('>')).toBe('&gt;');
    expect(sanitizeInput('"')).toBe('&quot;');
    expect(sanitizeInput("'")).toBe('&#x27;');
  });

  it('escapes all four special characters together in a realistic payload', () => {
    const input = `<script>alert("x")</script>`;
    expect(sanitizeInput(input)).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('   hello world   ')).toBe('hello world');
  });

  it('leaves a 500-character input unchanged', () => {
    const input = 'a'.repeat(500);
    const result = sanitizeInput(input);
    expect(result).toBe(input);
    expect(result.length).toBe(500);
  });

  it('truncates a 501-character input to exactly 500 characters', () => {
    const input = 'a'.repeat(501);
    const result = sanitizeInput(input);
    expect(result.length).toBe(500);
    expect(result).toBe('a'.repeat(500));
  });
});
