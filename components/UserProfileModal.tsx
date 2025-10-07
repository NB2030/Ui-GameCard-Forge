import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateLicense } from '../services/license';

// --- SVG Icons for better UI ---
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const StatusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
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
  license?: { key: string; durationDays: number; };
  message?: string;
  offline?: boolean;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; isDark: boolean;}> = ({ icon, label, value, isDark }) => (
  <div>
    <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</label>
    <div className="flex items-center gap-3 mt-1">
      <div className={isDark ? 'text-slate-500' : 'text-gray-400'}>{icon}</div>
      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</div>
    </div>
  </div>
);

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, isDark }) => {
  const { user } = useAuth();
  const [licenseDetails, setLicenseDetails] = useState<LicenseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      loadLicenseDetails();
    }
  }, [isOpen]);

  const loadLicenseDetails = async () => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getLicenseStatusInfo = () => {
    if (!licenseDetails?.isValid) return { text: 'Inactive', color: 'red' };
    if (licenseDetails.daysLeft !== undefined && licenseDetails.daysLeft <= 7) return { text: `Expires in ${licenseDetails.daysLeft} days`, color: 'yellow' };
    return { text: 'Active', color: 'green' };
  };

  const statusInfo = getLicenseStatusInfo();
  const statusColorClasses = {
    red: isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-100 text-red-700',
    yellow: isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-100 text-yellow-700',
    green: isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-100 text-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDark ? 'bg-[#1e293b]' : 'bg-gray-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Account & License</h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
            <CloseIcon />
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-80"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div></div>
        ) : user ? (
          <>
            <div className={`p-8 ${isDark ? 'bg-gradient-to-br from-slate-800 to-[#1e293b]' : 'bg-gradient-to-br from-gray-200 to-gray-100'}`}>
              <div className="flex items-center space-x-5">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0 ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-2 border-cyan-500/20' : 'bg-cyan-100 text-cyan-600'}`}>
                  {(user.fullName || user.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.fullName || 'User'}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-8 pt-6">
              <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white border'}`}>
                <h4 className={`text-base font-semibold mb-5 ${isDark ? 'text-white' : 'text-gray-800'}`}>License Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <DetailItem isDark={isDark} icon={<StatusIcon />} label="Status" value={
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorClasses[statusInfo.color]}`}>{statusInfo.text}</span>
                  }/>

                  {licenseDetails?.isValid && (
                    <DetailItem isDark={isDark} icon={<CalendarIcon />} label="Expires On" value={formatDate(licenseDetails.expiresAt)} />
                  )}

                  {licenseDetails?.isValid && licenseDetails.license && (
                    <div className="md:col-span-2">
                       <DetailItem isDark={isDark} icon={<KeyIcon />} label="License Key" value={
                        <span className="font-mono tracking-wider">{`****-****-****-${licenseDetails.license.key.slice(-4)}`}</span>
                      }/>
                    </div>
                  )}
                </div>
                {!licenseDetails?.isValid && licenseDetails?.message && (
                  <div className={`mt-4 text-center p-3 rounded-lg text-sm ${statusColorClasses[statusInfo.color]}`}>{licenseDetails.message}</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center h-80 flex items-center justify-center"><p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Failed to load profile data.</p></div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;