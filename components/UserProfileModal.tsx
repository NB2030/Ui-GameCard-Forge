import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateLicense } from '../services/license';

// --- SVG Icons for better UI ---
const UserIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const KeyIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
const CalendarIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CloseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface LicenseDetails {
  isValid: boolean;
  expiresAt?: string;
  daysLeft?: number;
  license?: {
    key: string;
    durationDays: number;
  };
  message?: string;
  offline?: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, isDark }) => {
  const { user } = useAuth();
  const [licenseDetails, setLicenseDetails] = useState<LicenseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadLicenseDetails();
    }
  }, [isOpen]);

  const loadLicenseDetails = async () => {
    setLoading(true);
    try {
      const data = await validateLicense();
      setLicenseDetails(data);
    } catch (error) {
      console.error('Failed to load license details:', error);
      setLicenseDetails({ isValid: false, message: 'Failed to load license details.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getLicenseStatusInfo = () => {
    if (!licenseDetails?.isValid) {
      return { text: 'Inactive', color: 'red', icon: <KeyIcon /> };
    }
    if (licenseDetails.daysLeft !== undefined && licenseDetails.daysLeft <= 7) {
      return { text: `Expires in ${licenseDetails.daysLeft} days`, color: 'yellow', icon: <CalendarIcon /> };
    }
    return { text: 'Active', color: 'green', icon: <KeyIcon /> };
  };

  const statusInfo = getLicenseStatusInfo();
  const statusColorClasses = {
    red: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700',
    yellow: isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
    green: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDark ? 'bg-[#1e293b]' : 'bg-gray-50'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profile & License
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
            <CloseIcon />
          </button>
        </header>

        <main className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : user ? (
            <>
              {/* User Info Card */}
              <div className={`p-5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white border'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                    {(user.fullName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.fullName || 'User'}</h3>
                    <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>
                </div>
              </div>

              {/* License Info Card */}
              <div className={`p-5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white border'}`}>
                <h4 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>License Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorClasses[statusInfo.color]}`}>{statusInfo.text}</span>
                  </div>

                  {licenseDetails?.isValid && licenseDetails.license && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>License Key</span>
                        <span className={`font-mono text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{`****-****-****-${licenseDetails.license.key.slice(-4)}`}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Expires On</span>
                        <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatDate(licenseDetails.expiresAt)}</span>
                      </div>
                    </>
                  )}

                  {!licenseDetails?.isValid && licenseDetails?.message && (
                    <p className={`text-xs text-center pt-2 ${statusColorClasses[statusInfo.color]}`}>{licenseDetails.message}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Failed to load profile data.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfileModal;