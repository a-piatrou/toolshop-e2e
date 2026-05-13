import 'dotenv/config';

function fromEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

/**
 * Central place for environment configuration. Defaults target the public
 * demo so the suite runs without a local .env file; CI overrides them.
 */
export const env = {
  baseUrl: fromEnv('BASE_URL', 'https://practicesoftwaretesting.com'),
  apiUrl: fromEnv('API_URL', 'https://api.practicesoftwaretesting.com'),
} as const;
