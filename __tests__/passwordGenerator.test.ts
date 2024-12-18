import { generatePassword } from '@/utils/passwordGenerator';

describe('generatePassword', () => {
  test('should generate a password of the specified length', () => {
    const length = 12;
    const password = generatePassword(length);
    expect(password.length).toBe(length);
  });

  test('should include at least one uppercase letter', () => {
    const password = generatePassword();
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  test('should include at least one lowercase letter', () => {
    const password = generatePassword();
    expect(/[a-z]/.test(password)).toBe(true);
  });

  test('should include at least one numeric character', () => {
    const password = generatePassword();
    expect(/[0-9]/.test(password)).toBe(true);
  });

  test('should include at least one special character', () => {
    const password = generatePassword();
    expect(/[!@#$%^&*()_+\-=[\]{}|;':,.<>?]/.test(password)).toBe(true);
  });

  test('should return a shuffled password (not in predictable order)', () => {
    const length = 20;
    const password = generatePassword(length);

    // Check that it's not in the exact order we expect based on generation rules
    const orderedPassword = password
      .split('')
      .sort((a: string, b: string) => a.localeCompare(b))
      .join('');

    expect(password).not.toBe(orderedPassword); // Password should be shuffled
  });
});
