import React, { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import LicenseModal from './LicenseModal';
import { useAuth } from '../../hooks/useAuth';
import { checkUserLicense } from '../../services/license';
import { signOut as authSignOut } from '../../services/auth';
import { 
  isCachedLicenseValid, 
  getCachedUserProfile, 
  enableOfflineMode, 
  disableOfflineMode,
  checkNetworkStatus,
  getOfflineCacheInfo,
  clearOfflineCache,
  cacheUserProfile
} from '../../services/offlineStorage';

interface LicenseGateProps {
  children: React.ReactNode;
  isDark: boolean;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ children, isDark }) => {
  const { user, loading: authLoading, setUser } = useAuth();
  const [licenseStatus, setLicenseStatus] = useState({
    isValid: false,
    loading: true,
    message: '',
    offline: false,
    daysRemaining: 0,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const lastCheckedUserId = useRef<string | null>(null);
  const hasCheckedLicense = useRef(false);

  const checkLicense = async () => {
    setLicenseStatus(prev => ({ ...prev, loading: true }));

    const isOnline = checkNetworkStatus();
    console.log('Network status:', isOnline);

    try {
      if (isOnline) {
        // Try to check license online
        console.log('Checking license online...');
        try {
          const result = await checkUserLicense(user!.id);

          if (result.isValid && result.profile) {
            // Cache the successful license check
            cacheUserProfile(result.profile.profile, result.profile.licenses, result.profile.activeLicense);
            disableOfflineMode();

            setLicenseStatus({
              isValid: true,
              loading: false,
              message: `License active - ${result.profile.activeLicense?.licenses?.duration_days || 30} days`,
              offline: false,
              daysRemaining: result.profile.activeLicense?.licenses?.duration_days || 30
            });
            return;
          } else {
            // License invalid online - DO NOT fall back to cache
            // The connection is working, so we trust the online result
            disableOfflineMode();

            setLicenseStatus({
              isValid: false,
              loading: false,
              message: result.message || 'No valid license found',
              offline: false,
              daysRemaining: 0
            });
            return;
          }
        } catch (onlineError: any) {
          console.error('Online license check failed:', onlineError);

          // Check if this is a network error or a database error
          // Network errors typically have specific error messages or codes
          const isNetworkError =
            !navigator.onLine ||
            onlineError?.message?.includes('Failed to fetch') ||
            onlineError?.message?.includes('NetworkError') ||
            onlineError?.message?.includes('network') ||
            onlineError?.code === 'ECONNREFUSED' ||
            onlineError?.code === 'ETIMEDOUT';

          if (isNetworkError) {
            // True network error - fall back to cached license
            if (isCachedLicenseValid()) {
              console.log('Using cached license data (network error)');
              const cachedInfo = getOfflineCacheInfo();
              enableOfflineMode();

              setLicenseStatus({
                isValid: true,
                loading: false,
                message: 'Using cached license (Network error)',
                offline: true,
                daysRemaining: cachedInfo.daysRemaining
              });
              return;
            }

            // No cached license available
            setLicenseStatus({
              isValid: false,
              loading: false,
              message: 'Cannot verify license - No internet connection and no cached license',
              offline: true,
              daysRemaining: 0
            });
          } else {
            // Not a network error - likely a database or authentication error
            // Do not fall back to cache, show the error
            disableOfflineMode();
            setLicenseStatus({
              isValid: false,
              loading: false,
              message: 'Error verifying license. Please check your account status.',
              offline: false,
              daysRemaining: 0
            });
          }
        }
      } else {
        // Offline mode - check cached license
        console.log('Device is offline, checking cached license...');

        if (isCachedLicenseValid()) {
          const cachedInfo = getOfflineCacheInfo();
          enableOfflineMode();

          setLicenseStatus({
            isValid: true,
            loading: false,
            message: `Offline mode - Cached license valid`,
            offline: true,
            daysRemaining: cachedInfo.daysRemaining
          });
        } else {
          setLicenseStatus({
            isValid: false,
            loading: false,
            message: 'No valid cached license for offline use',
            offline: true,
            daysRemaining: 0
          });
        }
      }
    } catch (error) {
      console.error('License check error:', error);
      setLicenseStatus({
        isValid: false,
        loading: false,
        message: 'Error checking license',
        offline: false,
        daysRemaining: 0
      });
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      // Only check license if user changed or this is the first check
      if (lastCheckedUserId.current !== user.id || !hasCheckedLicense.current) {
        lastCheckedUserId.current = user.id;
        hasCheckedLicense.current = true;
        checkLicense();
      }
    } else {
      // User logged out
      lastCheckedUserId.current = null;
      hasCheckedLicense.current = false;
      setLicenseStatus({ isValid: false, loading: false, message: '', offline: false, daysRemaining: 0 });
    }
  }, [authLoading, user]);


  const handleSignOut = () => {
    clearOfflineCache(); // Clear cached license data
    authSignOut();
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
          <div className="text-center max-w-md px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
              <svg className="w-10 h-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome to GameCard Forge</h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Please sign in to continue</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
          isDark={isDark}
        />
      </>
    );
  }

  // Enable license checking with offline support
  if (licenseStatus.loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Verifying license...</p>
          {!checkNetworkStatus() && (
            <p className={`text-sm mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Checking offline cache...</p>
          )}
        </div>
      </div>
    );
  }

  if (!licenseStatus.isValid) {
    return (
      <>
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
          <div className="text-center max-w-md px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
              <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Inactive License</h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {licenseStatus.message || 'Please activate your license to access the application'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLicenseModal(true)}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
              >
                Activate License
              </button>
              <button
                onClick={handleSignOut}
                className={`px-8 py-3 rounded-lg font-semibold transition-all active:scale-95 ${
                  isDark
                    ? 'bg-[#334155] hover:bg-[#475569] text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <LicenseModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
          onSuccess={() => {
            setShowLicenseModal(false);
            checkLicense();
          }}
          isDark={isDark}
        />
      </>
    );
  }

  return (
    <>
      {licenseStatus.offline && (
        <div className={`${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'} border-b ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'} px-4 py-2`}>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Offline Mode - Using cached license (Days remaining: {licenseStatus.daysRemaining})
            </span>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default LicenseGate;