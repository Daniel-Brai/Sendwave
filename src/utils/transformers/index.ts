import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

/**
 * Gets the generated secret key by openssl
 * @command {string} "openssl rand -hex 32 > cert/public.key"
 * @returns {string} The generated 256 bits random secret key
 */
export function getSecretKey(): string {
  const filePath = join(cwd(), 'cert', 'public.key');
  const secretKey = readFileSync(filePath, 'utf8').trim();
  return secretKey;
}
