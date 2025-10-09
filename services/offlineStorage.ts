/**
 * Offline Storage Service for GameCard Forge
 * Handles caching user data, license information, and app state for offline usage
 */

import { CACHE_KEYS, TIME_CONSTANTS, ERROR_MESSAGES } from '../utils/constants';
import { logError } from '../utils/errorHandling';
import type { OfflineCache, CachedLicenseData, UserProfile } from '../types/auth';

/**
 * Gets cached data from localStorage
 */
export const getOfflineCache = (): OfflineCache | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.OFFLINE_CACHE);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    logError('getOfflineCache', error);
  }
  return null;
};

/**
 * Saves data to offline cache
 */
export const saveOfflineCache = (data: Partial<OfflineCache>): void => {
  try {
    const existing = getOfflineCache() || {
      user: null,
      license: null,
      lastSync: new Date().toISOString(),
      isOfflineMode: false,
      authToken: null
    };

    const updated = {
      ...existing,
      ...data,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem(CACHE_KEYS.OFFLINE_CACHE, JSON.stringify(updated));
  } catch (error) {
    logError('saveOfflineCache', error);
  }
};

/**
 * Caches user profile data
 */
export const cacheUserProfile = (user: UserProfile, licenses: any[], activeLicense: any): void => {
  try {
    const userData: UserProfile = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    let licenseData: CachedLicenseData | null = null;
    if (activeLicense) {
      licenseData = {
        user_id: activeLicense.user_id,
        license_key: activeLicense.licenses?.license_key || 'CACHED_LICENSE',
        activated_at: activeLicense.activated_at,
        expires_at: activeLicense.expires_at,
        is_active: activeLicense.is_active,
        duration_days: activeLicense.licenses?.duration_days || 30
      };
    }

    saveOfflineCache({
      user: userData,
      license: licenseData,
      isOfflineMode: false
    });
  } catch (error) {
    logError('cacheUserProfile', error);
  }
};

/**
 * Caches authentication token
 */
export const cacheAuthToken = (token: string): void => {
  saveOfflineCache({ authToken: token });
};

/**
 * Checks if cached license is still valid for offline use
 */
export const isCachedLicenseValid = (): boolean => {
  const cache = getOfflineCache();
  if (!cache || !cache.license || !cache.user) {
    return false;
  }

  // Check if license is still active
  if (!cache.license.is_active) {
    return false;
  }

  // Check if license hasn't expired
  const expiresAt = new Date(cache.license.expires_at);
  const now = new Date();
  if (expiresAt <= now) {
    return false;
  }

  // Check if we haven't been offline too long
  const lastSync = new Date(cache.lastSync);
  const daysSinceSync = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceSync > TIME_CONSTANTS.MAX_OFFLINE_DAYS) {
    return false;
  }

  return true;
};

/**
 * Gets cached user profile for offline mode
 */
export const getCachedUserProfile = () => {
  const cache = getOfflineCache();
  if (!cache || !cache.user) {
    return null;
  }

  // Format data to match the expected structure
  return {
    profile: cache.user,
    licenses: cache.license ? [{
      user_id: cache.license.user_id,
      activated_at: cache.license.activated_at,
      expires_at: cache.license.expires_at,
      is_active: cache.license.is_active,
      licenses: {
        license_key: cache.license.license_key,
        duration_days: cache.license.duration_days
      }
    }] : [],
    activeLicense: cache.license ? {
      user_id: cache.license.user_id,
      activated_at: cache.license.activated_at,
      expires_at: cache.license.expires_at,
      is_active: cache.license.is_active,
      licenses: {
        license_key: cache.license.license_key,
        duration_days: cache.license.duration_days
      }
    } : null
  };
};

/**
 * Enables offline mode
 */
export const enableOfflineMode = (): void => {
  saveOfflineCache({ isOfflineMode: true });
};

/**
 * Disables offline mode (when back online)
 */
export const disableOfflineMode = (): void => {
  saveOfflineCache({ isOfflineMode: false });
};

/**
 * Checks if app is currently in offline mode
 */
export const isOfflineMode = (): boolean => {
  const cache = getOfflineCache();
  return cache?.isOfflineMode || false;
};

/**
 * Clears all offline cache (useful for sign out)
 */
export const clearOfflineCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEYS.OFFLINE_CACHE);
  } catch (error) {
    logError('clearOfflineCache', error);
  }
};

/**
 * Gets days remaining on cached license
 */
export const getCachedLicenseDaysRemaining = (): number => {
  const cache = getOfflineCache();
  if (!cache || !cache.license) return 0;
  
  const expires = new Date(cache.license.expires_at);
  const now = new Date();
  const diffTime = expires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Checks network connectivity
 */
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

/**
 * Gets offline cache info for debugging
 */
export const getOfflineCacheInfo = () => {
  const cache = getOfflineCache();
  const networkOnline = checkNetworkStatus();
  const licenseValid = isCachedLicenseValid();
  
  return {
    hasCache: !!cache,
    hasUser: !!cache?.user,
    hasLicense: !!cache?.license,
    isOfflineMode: isOfflineMode(),
    networkOnline,
    licenseValid,
    lastSync: cache?.lastSync,
    daysRemaining: getCachedLicenseDaysRemaining()
  };
};