import { describe, expect, beforeEach } from 'vitest';
import { it, fc } from '@fast-check/vitest';
import { getGaClientId } from './ga';

describe('getGaClientId', () => {
  beforeEach(() => {
    clearAllCookies();
  });

  it('should return undefined when no _ga cookie is present', () => {
    expect(getGaClientId()).toBeUndefined();
  });

  it('should return undefined for an empty _ga value', () => {
    document.cookie = '_ga=';
    expect(getGaClientId()).toBeUndefined();
  });

  it('should return undefined for a single-segment _ga value', () => {
    document.cookie = '_ga=onlyone';
    expect(getGaClientId()).toBeUndefined();
  });

  it('should not match _ga_ prefixed cookies (e.g. _ga_GTMID)', () => {
    document.cookie = '_ga_ABC123=GA1.1.foo.bar';
    expect(getGaClientId()).toBeUndefined();
  });

  it('should handle a three-segment _ga value by returning the last two', () => {
    // cross-subdomain GA1.2.xxx variant
    document.cookie = '_ga=GA1.2.abc';

    const result = getGaClientId();

    // ['GA1','2','abc'].slice(-2).join('.') → '2.abc'
    expect(result).toBe('2.abc');
  });

  // + in the pattern guarantees minLength: 1
  const cookieSafeString = fc.stringMatching(/^[a-z0-9]+$/);

  it.prop([cookieSafeString, cookieSafeString])(
    'should return the two trailing dot-segments for any client_id value',
    (seg1, seg2) => {
      // Arrange
      document.cookie = `_ga=GA1.1.${seg1}.${seg2}`;

      // Act
      const result = getGaClientId();

      // Assert
      expect(result).toBe(`${seg1}.${seg2}`);

      // beforeEach does not run between fast-check iterations
      deleteCookie('_ga');
    },
  );

  it.prop([
    cookieSafeString,
    cookieSafeString,
    fc.array(
      fc.tuple(cookieSafeString, cookieSafeString),
      { size: '-1' },
    ),
  ])(
    'should return the correct client_id regardless of other cookies present',
    (seg1, seg2, extras) => {
      // Arrange
      const extraNames = extras.map(([name], i) => `x${i}${name}`);
      extraNames.forEach((cookieName, i) => {
        document.cookie = `${cookieName}=${extras[i][1]}`;
      });
      document.cookie = `_ga=GA1.1.${seg1}.${seg2}`;

      // Act
      const result = getGaClientId();

      // Assert
      expect(result).toBe(`${seg1}.${seg2}`);

      // beforeEach does not run between fast-check iterations
      deleteCookie('_ga');
      extraNames.forEach(deleteCookie);
    },
  );
});

// Helpers

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
}

function clearAllCookies() {
  const cookies = document.cookie;
  if (!cookies) return;
  cookies.split(';').forEach(c => {
    deleteCookie(c.trim().split('=')[0]);
  });
}
