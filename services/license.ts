import { supabase } from '../lib/supabase';

const OFFLINE_LICENSE_KEY = 'app_license_offline';

interface OfflineLicenseData {
  userId: string;
  email: string;
  fullName: string;
  licenseKey: string;
  expiresAt: string;
  lastValidated: string;
}

function saveOfflineLicense(data: OfflineLicenseData) {
  try {
    localStorage.setItem(OFFLINE_LICENSE_KEY, JSON.stringify({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      licenseKey: data.licenseKey,
      expiresAt: data.expiresAt,
      lastValidated: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save offline license:', error);
  }
}

function checkOfflineLicense(): { isValid: boolean; data?: OfflineLicenseData; message?: string } {
  try {
    const data = localStorage.getItem(OFFLINE_LICENSE_KEY);
    if (!data) return { isValid: false };

    const license: OfflineLicenseData = JSON.parse(data);
    const now = new Date();
    const expiresAt = new Date(license.expiresAt);

    if (expiresAt <= now) {
      return { isValid: false, message: 'انتهت صلاحية الترخيص' };
    }

    return { isValid: true, data: license };
  } catch (error) {
    console.error('Failed to check offline license:', error);
    return { isValid: false };
  }
}

export async function activateLicense(licenseKey: string) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('يجب تسجيل الدخول أولاً');
  }

  const response = await fetch(
    'https://iwipefxjymkqpsuxkupo.supabase.co/functions/v1/activate-license',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ licenseKey }),
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  if (data.license) {
    saveOfflineLicense({
      userId: session.user.id,
      email: session.user.email || '',
      fullName: data.license.fullName || '',
      licenseKey: data.license.licenseKey,
      expiresAt: data.license.expiresAt,
      lastValidated: new Date().toISOString(),
    });
  }

  return data;
}

export async function checkUserLicense() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('يجب تسجيل الدخول أولاً');
  }

  try {
    const response = await fetch(
      'https://iwipefxjymkqpsuxkupo.supabase.co/functions/v1/validate-license',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.isValid) {
      const offlineCheck = checkOfflineLicense();
      if (offlineCheck.isValid && offlineCheck.data) {
        return {
          isValid: true,
          expiresAt: offlineCheck.data.expiresAt,
          license: offlineCheck.data,
          offline: true,
        };
      }
      return { isValid: false, message: data.message };
    }

    if (data.license) {
      saveOfflineLicense({
        userId: session.user.id,
        email: session.user.email || '',
        fullName: data.license.fullName || '',
        licenseKey: data.license.licenseKey,
        expiresAt: data.expiresAt,
        lastValidated: new Date().toISOString(),
      });
    }

    return {
      isValid: true,
      expiresAt: data.expiresAt,
      license: data.license,
    };
  } catch (error) {
    console.error('Network error, checking offline license:', error);
    const offlineCheck = checkOfflineLicense();
    if (offlineCheck.isValid && offlineCheck.data) {
      return {
        isValid: true,
        expiresAt: offlineCheck.data.expiresAt,
        license: offlineCheck.data,
        offline: true,
      };
    }
    throw error;
  }
}
