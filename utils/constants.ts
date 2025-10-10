export const CACHE_KEYS = {
  OFFLINE_CACHE: 'gamecard-forge-offline-cache',
  USER_TOKEN: 'gamecard-forge-user-token',
  LAST_LICENSE_CHECK: 'gamecard-forge-last-check',
} as const;

export const TIME_CONSTANTS = {
  MAX_OFFLINE_DAYS: 30,
  CACHE_VALIDITY_MS: 24 * 60 * 60 * 1000,
  RETRY_DELAY_MS: 2000,
  MAX_RETRIES: 3,
  LICENSE_CHECK_DEBOUNCE_MS: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Failed to connect to server. Please check your internet connection.',
  NO_USER: 'You must log in first',
  NO_LICENSE: 'No active license',
  LICENSE_EXPIRED: 'License has expired',
  LICENSE_INVALID: 'Invalid license',
  AUTH_FAILED: 'Authentication failed',
  PROFILE_FETCH_ERROR: 'Failed to load profile data',
  LICENSE_FETCH_ERROR: 'Failed to load license data',
  OFFLINE_NO_CACHE: 'No internet connection and no cached data',
  CACHE_EXPIRED: 'Cached data has expired',
} as const;

export const SUCCESS_MESSAGES = {
  LICENSE_ACTIVATED: 'License activated successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

export const NETWORK_ERROR_INDICATORS = [
  'Failed to fetch',
  'NetworkError',
  'network',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'net::',
] as const;
