import { describe, it, expect } from 'vitest';
import { passwordStrength } from './password-strength';

describe('Password strength guidance', () => {
  it('penalizes long common passwords, repeated patterns, and number sequences', () => {
    for (const password of ['Password123456!', 'abcabcabcabcabcabc', '111111111111111111', '12345678901234567890']) {
      expect(passwordStrength(password).score).toBe(1);
    }
  });
  it('rewards long unrelated-word passphrases without requiring symbols', () => {
    expect(passwordStrength('cobalt meadow lantern otter').label).toBe('Strong');
    expect(passwordStrength('short').suggestions).toContain('Use at least 12 characters.');
  });
  it('flags Unicode passwords exceeding the storage limit and handles empty input', () => {
    expect(passwordStrength('🌻'.repeat(19)).score).toBe(0);
    expect(passwordStrength('').label).toBe('Not entered');
  });
});
