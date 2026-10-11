import { contentSecurityPolicy, createNonce } from '@/app/utils/security/csp';
import { describe, expect, it } from 'vitest';

const directive = (policy: string, name: string) =>
  policy.split('; ').find((part) => part.startsWith(`${name} `));

describe('content security policy', () => {
  it('allows only scripts carrying the nonce', () => {
    const policy = contentSecurityPolicy({ nonce: 'abc' });

    expect(directive(policy, 'script-src')).toBe(
      "script-src 'self' 'nonce-abc' 'strict-dynamic'",
    );
  });

  it('allows eval only in development', () => {
    const policy = contentSecurityPolicy({ nonce: 'abc', isDev: true });

    expect(directive(policy, 'script-src')).toContain("'unsafe-eval'");
  });

  it('lets the browser reach the backend origin', () => {
    const policy = contentSecurityPolicy({
      nonce: 'abc',
      apiUrl: 'https://api.example.com/v1/',
    });

    expect(directive(policy, 'connect-src')).toBe(
      "connect-src 'self' https://api.example.com",
    );
    expect(directive(policy, 'form-action')).toBe(
      "form-action 'self' https://api.example.com",
    );
  });

  it('keeps inline styles without a style nonce', () => {
    const policy = contentSecurityPolicy({ nonce: 'abc' });

    expect(directive(policy, 'style-src')).toBe(
      "style-src 'self' 'unsafe-inline'",
    );
  });

  it('forbids framing, base rewriting and plugins', () => {
    const policy = contentSecurityPolicy({ nonce: 'abc' });

    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("object-src 'none'");
  });

  it('makes a fresh nonce each time', () => {
    expect(createNonce()).not.toBe(createNonce());
  });
});
