import { authenticator } from "otplib";

/**
 * Genereer een TOTP secret
 * @returns {string} - Het gegenereerde secret
 */
export const generateSecret = (): string => {
  return authenticator.generateSecret();
};

/**
 * Valideer een TOTP code
 * @param {string} secret - Het geheim dat gebruikt wordt voor TOTP
 * @param {string} token - De ingevoerde TOTP code
 * @returns {boolean} - True als de TOTP code geldig is, anders false
 */
export const validateTOTP = (secret: string, token: string): boolean => {
  return authenticator.check(token, secret);
};
