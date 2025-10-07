import { useState, useEffect } from 'react';
import { checkUserLicense } from '../services/license';

interface LicenseStatus {
  isValid: boolean;
  expiresAt?: string;
  license?: any;
  message?: string;
  offline?: boolean;
}

interface UseLicenseReturn {
  licenseStatus: LicenseStatus;
  loading: boolean;
  initializing: boolean;
  recheckLicense: () => Promise<void>;
}

export const useLicense = (user: any): UseLicenseReturn => {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({
    isValid: false,
  });
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!user) {
      setLicenseStatus({ isValid: false });
      setLoading(false);
      setInitializing(false);
      return;
    }

    const checkLicense = async () => {
      try {
        const status = await checkUserLicense();
        setLicenseStatus(status);
      } catch (error) {
        setLicenseStatus({ isValid: false });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setInitializing(false);
        }, 500);
      }
    };

    checkLicense();
  }, [user]);

  const recheckLicense = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const status = await checkUserLicense();
      setLicenseStatus(status);
    } catch (error) {
      setLicenseStatus({ isValid: false });
    } finally {
      setLoading(false);
    }
  };

  return { licenseStatus, loading, initializing, recheckLicense };
};
