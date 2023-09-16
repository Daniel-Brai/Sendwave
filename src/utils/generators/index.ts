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
