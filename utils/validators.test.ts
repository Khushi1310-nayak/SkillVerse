import { describe, it, expect } from 'vitest';
import { validateUsername, validateEmail, checkPasswordStrength } from './validators';

describe('User Input & Security Validators', () => {
  describe('validateUsername', () => {
    it('accepts valid usernames', () => {
      expect(validateUsername('john_doe').valid).toBe(true);
      expect(validateUsername('user123').valid).toBe(true);
      expect(validateUsername('dev_pro_99').valid).toBe(true);
    });

    it('rejects short or long usernames', () => {
      expect(validateUsername('abc').valid).toBe(false);
      expect(validateUsername('a_very_long_username_exceeding_20_chars').valid).toBe(false);
    });

    it('rejects invalid characters and uppercase letters', () => {
      expect(validateUsername('JohnDoe').valid).toBe(false);
      expect(validateUsername('user@name').valid).toBe(false);
      expect(validateUsername('user-name').valid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('accepts standard valid emails', () => {
      expect(validateEmail('dev@example.com').valid).toBe(true);
      expect(validateEmail('user.name+tag@sub.domain.org').valid).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid-email').valid).toBe(false);
      expect(validateEmail('@domain.com').valid).toBe(false);
      expect(validateEmail('user@').valid).toBe(false);
      expect(validateEmail('user@domain').valid).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('rates common weak passwords with score 0', () => {
      const result = checkPasswordStrength('password123');
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.checks.notCommon).toBe(false);
    });

    it('rates complex unique passwords with high score', () => {
      const result = checkPasswordStrength('Kx9#mP$2vLq!8zR@');
      expect(result.score).toBe(4);
      expect(result.label).toBe('Excellent');
      expect(result.checks.length).toBe(true);
      expect(result.checks.upper).toBe(true);
      expect(result.checks.lower).toBe(true);
      expect(result.checks.number).toBe(true);
      expect(result.checks.special).toBe(true);
      expect(result.checks.notCommon).toBe(true);
    });
  });
});
