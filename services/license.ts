import { supabase } from '../lib/supabase';

/**
 * Checks if the current user has a valid, active license.
 * This is the function that was causing the build to fail.
 * It's now implemented to use direct Supabase queries.
 */
export async function checkUserLicense() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { isValid: false, message: 'User not authenticated.' };
  }

  const { data: activeLicense, error } = await supabase
    .from('user_licenses')
    .select('*, licenses(*)')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('Error checking user license:', error);
    return { isValid: false, message: 'An error occurred while checking the license.' };
  }

  if (activeLicense) {
    return { isValid: true, license: activeLicense };
  }

  return { isValid: false, message: 'No active license found.' };
}

/**
 * Activates a license for the current user using direct database operations.
 * @param {string} licenseKey - The license key to activate.
 * @returns {Promise<object>} An object indicating success and the new license details.
 */
export async function activateLicense(licenseKey: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to activate a license.');
  }

  // 1. Find the license by key in the 'licenses' table.
  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .single();

  if (licenseError || !license) {
    throw new Error('The provided license key is invalid or does not exist.');
  }

  // 2. Check if the license is active and has activations remaining.
  if (!license.is_active) {
    throw new Error('This license key is not active.');
  }
  if (license.current_activations >= license.max_activations) {
    throw new Error('This license has reached its maximum number of activations.');
  }

  // 3. Check if the user already has an active license.
  const { data: existingLicense, error: existingLicenseError } = await supabase
    .from('user_licenses')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (existingLicenseError) {
    console.error('Error checking existing license:', existingLicenseError);
    throw new Error('Could not verify existing licenses.');
  }

  if (existingLicense) {
    throw new Error('You already have an active license.');
  }

  // 4. Create the user license record.
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
    console.error('Error activating license:', insertError);
    throw new Error('Could not activate the license. Please try again.');
  }

  // 5. Increment the activation count for the license.
  const { error: updateError } = await supabase
    .from('licenses')
    .update({ current_activations: license.current_activations + 1 })
    .eq('id', license.id);

  if (updateError) {
    // Log the error but don't block the user, as the license is already granted.
    console.error('Failed to update license activation count:', updateError);
  }

  return { success: true, license: newUserLicense };
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