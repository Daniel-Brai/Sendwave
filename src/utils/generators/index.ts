import * as crypto from 'crypto';

/**
 * This function generates a random secret key
 *
 * @params {number} length - The length of the random key
 * @returns {string} The random key of the given `length`.
 */
export function generateRandomKey(length = 30): string {
  return crypto.randomBytes(length).toString('base64');
}

/**
 * This function generates a random alphanumneric key
 *
 * @params {number} length - The length of the random toekn
 * @returns {string} The random token of the given `length`.
 */
export function generateAlphanumericToken(length: number) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    token += charset.charAt(randomIndex);
  }

  return token;
}

/**
 * Generates an OTP code
 * @params {number} length - The length of the desired otp code
 * @returns {string} The generated otp code
 */
export function generateOtpCode(length: number): string {
  if (length <= 0) {
    throw new Error('Length must be a positive integer');
  }

  let result = '';
  const characters = '0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
