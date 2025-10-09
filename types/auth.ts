import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at?: string;
}

export interface License {
  id: string;
  license_key: string;
  duration_days: number;
  max_activations: number;
  current_activations: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
}

export interface UserLicense {
  id: string;
  user_id: string;
  license_id: string;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
  last_validated?: string;
  licenses?: License;
}

export interface LicenseStatus {
  isValid: boolean;
  expiresAt?: string;
  daysLeft?: number;
  message?: string;
  offline?: boolean;
  profile?: {
    profile: UserProfile;
    licenses: UserLicense[];
    activeLicense: UserLicense | null;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface LicenseCheckResult {
  isValid: boolean;
  message: string;
  profile?: {
    profile: UserProfile;
    licenses: UserLicense[];
    activeLicense: UserLicense | null;
  };
}

export interface OfflineCache {
  user: UserProfile | null;
  license: CachedLicenseData | null;
  lastSync: string;
  isOfflineMode: boolean;
  authToken: string | null;
}

export interface CachedLicenseData {
  user_id: string;
  license_key: string;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
  duration_days: number;
}

export interface NetworkError extends Error {
  code?: string;
  isNetworkError: boolean;
}
