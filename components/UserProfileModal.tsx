import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/license';

// --- SVG Icons for the new design ---
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

interface ProfileData {
  profile: { id: string; email: string; full_name: string; created_at: string; };
  licenses: { activated_at: string; expires_at: string; is_active: boolean; licenses: { license_key: string; } }[];
  activeLicense: any;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string; isDark: boolean;}> = ({ icon, label, value, isDark }) => (
  <div>
    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
      {icon}
      <span>{label}</span>
    </div>
    <p className={`mt-1 text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
  </div>
);

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, isDark }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getUserProfile()
        .then(setProfileData)
        .catch(err => console.error('Failed to load profile:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const getLicenseStatus = () => {
    if (!profileData?.activeLicense) return { text: 'Inactive', color: 'red' };
    const expires = new Date(profileData.activeLicense.expires_at);
    if (expires < new Date()) return { text: 'Expired', color: 'red' };
    return { text: 'Active', color: 'green' };
  };

  const status = getLicenseStatus();
  const statusColorClasses = {
    red: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700',
    green: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden transform transition-all ${isDark ? 'bg-slate-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <header className={`px-8 py-5 border-b flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>User Account & License Information</h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}><CloseIcon /></button>
        </header>

        {loading ? (
          <div className="h-[450px] flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500"></div></div>
        ) : profileData ? (
          <div className="md:grid md:grid-cols-12 min-h-[450px]">
            <aside className={`md:col-span-4 p-8 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold shrink-0 mb-4 ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-2 border-cyan-500/20' : 'bg-cyan-100 text-cyan-600'}`}>
                  {profileData.profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className={`text-2xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{profileData.profile.full_name}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{profileData.profile.email}</p>
                <p className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Member since {formatDate(profileData.profile.created_at)}</p>
              </div>
            </aside>

            <main className="md:col-span-8 p-8">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Active License Details</h3>
              {profileData.activeLicense ? (
                <div className={`p-6 rounded-xl space-y-5 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50 border'}`}>
                  <InfoItem isDark={isDark} icon={<UserCircleIcon />} label="License Status" value={<span className={`px-3 py-1 text-sm rounded-full ${statusColorClasses[status.color]}`}>{status.text}</span>} />
                  <InfoItem isDark={isDark} icon={<KeyIcon />} label="License Key" value={profileData.activeLicense.licenses.license_key} />
                  <InfoItem isDark={isDark} icon={<CalendarIcon />} label="Activation Date" value={formatDate(profileData.activeLicense.activated_at)} />
                  <InfoItem isDark={isDark} icon={<CalendarIcon />} label="Expiration Date" value={formatDate(profileData.activeLicense.expires_at)} />
                </div>
              ) : (
                <div className={`p-6 rounded-xl text-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-50 border'}`}>
                  <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>No active license found.</p>
                </div>
              )}

              {profileData.licenses.length > 1 && (
                <div className="mt-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>License History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {profileData.licenses.filter(l => l.id !== profileData.activeLicense?.id).map((l, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm ${isDark ? 'bg-slate-700/50' : 'bg-gray-50 border'}`}>
                        <p className="font-mono">{l.licenses.license_key}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Activated: {formatDate(l.activated_at)} - Expired: {formatDate(l.expires_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className="h-[450px] flex items-center justify-center"><p className={isDark ? 'text-slate-400' : 'text-gray-600'}>Failed to load profile data.</p></div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;