// /utils/totp.js
import { authenticator } from "otplib";

export const generateSecret = () => {
  return authenticator.generateSecret();
};

export const validateTOTP = (secret, token) => {
  return authenticator.check(token, secret);
};
