import * as api from './api';
import { getUserToken } from './auth';

const OFFLINE_LICENSE_KEY = 'app_license_offline';

interface OfflineLicenseData {
  licenseKey: string;
  expiresAt: string;
  lastValidated: string;
}

function saveOfflineLicense(data: { licenseKey: string; expiresAt: string }) {
  try {
    const offlineData: OfflineLicenseData = {
      ...data,
      lastValidated: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_LICENSE_KEY, JSON.stringify(offlineData));
  } catch (error) {
    console.error('Failed to save offline license:', error);
  }
}

function checkOfflineLicense(): { isValid: boolean; license?: OfflineLicenseData; message?: string } {
  try {
    const data = localStorage.getItem(OFFLINE_LICENSE_KEY);
    if (!data) return { isValid: false };

    const license: OfflineLicenseData = JSON.parse(data);
    const now = new Date();
    const expiresAt = new Date(license.expiresAt);

    if (expiresAt <= now) {
      localStorage.removeItem(OFFLINE_LICENSE_KEY);
      return { isValid: false, message: 'انتهت صلاحية الترخيص المخزن' };
    }

    return { isValid: true, license };
  } catch (error) {
    console.error('Failed to check offline license:', error);
    return { isValid: false };
  }
}

export async function activateLicense(licenseKey: string) {
  const token = getUserToken();
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await api.activate(licenseKey, token);

  if (response.success) {
    // After activation, we should validate to get the full license details and cache them.
    await validateLicense();
  }

  return response;
}

export async function validateLicense() {
  const token = getUserToken();
  if (!token) {
    return checkOfflineLicense();
  }

  try {
    const response = await api.validate(token);
    if (response.isValid) {
      saveOfflineLicense({
        licenseKey: response.license.key,
        expiresAt: response.expiresAt,
      });
    } else {
      // If the server says the license is invalid, clear the offline cache.
      localStorage.removeItem(OFFLINE_LICENSE_KEY);
    }
    return response;
  } catch (error) {
    console.warn('API validation failed, checking offline license:', error);
    // If the API call fails (e.g., network error), fall back to the offline license.
    return checkOfflineLicense();
  }
}