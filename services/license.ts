import { supabase } from '../lib/supabase';
import { ERROR_MESSAGES } from '../utils/constants';
import { logError, retryWithExponentialBackoff } from '../utils/errorHandling';
import type { LicenseCheckResult, UserProfile, UserLicense } from '../types/auth';

/**
 * Checks if the current user has a valid, active license.
 * @param {string} userId - The user ID to check license for
 */
export async function checkUserLicense(userId: string): Promise<LicenseCheckResult> {
  if (!userId) {
    return { isValid: false, message: ERROR_MESSAGES.NO_USER };
  }

  try {
    return await retryWithExponentialBackoff(async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        logError('checkUserLicense - profile fetch', profileError);
        throw new Error(ERROR_MESSAGES.PROFILE_FETCH_ERROR);
      }

      const { data: licenses, error: licensesError } = await supabase
        .from('user_licenses')
        .select('*, licenses(*)')
        .eq('user_id', userId)
        .order('activated_at', { ascending: false });

      if (licensesError) {
        logError('checkUserLicense - licenses fetch', licensesError);
        throw new Error(ERROR_MESSAGES.LICENSE_FETCH_ERROR);
      }

      const activeLicense = licenses?.find(l =>
        l.is_active && new Date(l.expires_at) > new Date()
      );

      if (activeLicense) {
        return {
          isValid: true,
          message: 'License is valid',
          profile: {
            profile: profile as UserProfile,
            licenses: licenses as UserLicense[] || [],
            activeLicense: activeLicense as UserLicense
          }
        };
      }

      return { isValid: false, message: ERROR_MESSAGES.NO_LICENSE };
    }, 2);
  } catch (error) {
    logError('checkUserLicense', error);
    throw error;
  }
}

/**
 * Activates a license for the current user using direct database operations.
 * @param {string} licenseKey - The license key to activate.
 * @returns {Promise<object>} An object indicating success and the new license details.
 */
export async function activateLicense(licenseKey: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error(ERROR_MESSAGES.NO_USER);
    }

    return await retryWithExponentialBackoff(async () => {
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select('*')
        .eq('license_key', licenseKey)
        .maybeSingle();

      if (licenseError) {
        logError('activateLicense - license fetch', licenseError);
        throw new Error(ERROR_MESSAGES.LICENSE_FETCH_ERROR);
      }

      if (!license) {
        throw new Error(ERROR_MESSAGES.LICENSE_INVALID);
      }

      if (!license.is_active) {
        throw new Error('مفتاح الترخيص غير نشط');
      }

      if (license.current_activations >= license.max_activations) {
        throw new Error('تم الوصول للحد الأقصى لعدد التفعيلات المسموح بها');
      }

      const { data: existingLicense, error: existingLicenseError } = await supabase
        .from('user_licenses')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (existingLicenseError) {
        logError('activateLicense - existing license check', existingLicenseError);
        throw new Error('فشل التحقق من التراخيص الموجودة');
      }

      if (existingLicense) {
        throw new Error('لديك بالفعل ترخيص نشط');
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + license.duration_days);

      const { data: newUserLicense, error: insertError } = await supabase
        .from('user_licenses')
        .insert({
          user_id: user.id,
          license_id: license.id,
          activated_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        logError('activateLicense - insert', insertError);
        throw new Error('فشل تفعيل الترخيص. يرجى المحاولة مرة أخرى');
      }

      const { error: updateError } = await supabase
        .from('licenses')
        .update({ current_activations: license.current_activations + 1 })
        .eq('id', license.id);

      if (updateError) {
        logError('activateLicense - update count', updateError);
      }

      return { success: true, license: newUserLicense };
    }, 2);
  } catch (error) {
    logError('activateLicense', error);
    throw error;
  }
}

/**
 * Fetches the complete profile for the current user, including license history.
 * @returns {Promise<object>} An object containing the user's profile, all their licenses, and their currently active license.
 */
export async function getUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated.');
  }

  // Fetch user profile from 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    throw new Error('Could not fetch user profile.');
  }

  // Fetch all licenses associated with the user
  const { data: licenses, error: licensesError } = await supabase
    .from('user_licenses')
    .select('*, licenses(license_key, duration_days)')
    .eq('user_id', session.user.id)
    .order('activated_at', { ascending: false });

  if (licensesError) {
    console.error('Error fetching user licenses:', licensesError);
    throw new Error('Could not fetch user licenses.');
  }

  const activeLicense = licenses?.find(l => l.is_active && new Date(l.expires_at) > new Date());

  return {
    profile,
    licenses: licenses || [],
    activeLicense: activeLicense || null,
  };
}