import { supabase } from '../lib/supabase';

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

  return data;
}

export async function checkUserLicense() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('يجب تسجيل الدخول أولاً');
  }

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
    return { isValid: false, message: data.message };
  }

  return {
    isValid: true,
    expiresAt: data.expiresAt,
    license: data.license,
  };
}
