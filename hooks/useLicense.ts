import { useState, useEffect } from 'react';
import { checkUserLicense } from '../services/license';

interface LicenseStatus {
  isValid: boolean;
  expiresAt?: string;
  license?: any;
  message?: string;
}

export const useLicense = (user: any) => {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({
    isValid: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLicenseStatus({ isValid: false });
      setLoading(false);
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

  return { licenseStatus, loading, recheckLicense };
};
