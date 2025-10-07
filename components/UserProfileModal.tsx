import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/license';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface ProfileData {
  profile: {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    updated_at: string;
  };
  licenses: Array<{
    uuid: string;
    license_key: string;
    activated_at: string;
    expires_at: string;
    is_active: boolean;
    last_validated: string;
  }>;
  activeLicense: any;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, isDark }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLicenseStatus = () => {
    if (!profileData?.activeLicense) {
      return { text: 'غير مفعل', color: 'red' };
    }
    const expiresAt = new Date(profileData.activeLicense.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return { text: 'منتهي الصلاحية', color: 'red' };
    } else if (daysLeft <= 7) {
      return { text: `ينتهي خلال ${daysLeft} أيام`, color: 'yellow' };
    } else {
      return { text: 'نشط', color: 'green' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#1e293b]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#334155] bg-[#0f172a]' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              الملف الشخصي
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-[#334155] text-gray-400' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : profileData ? (
            <div className="space-y-6">
              <div className={`flex items-center gap-4 p-4 rounded-lg ${
                isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
              }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                }`}>
                  {profileData.profile.full_name ? profileData.profile.full_name.charAt(0).toUpperCase() : profileData.profile.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.profile.full_name || 'مستخدم'}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profileData.profile.email}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                isDark ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  معلومات الحساب
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>معرف المستخدم</span>
                    <span className={`font-mono text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {profileData.profile.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>تاريخ التسجيل</span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {formatDate(profileData.profile.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                isDark ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  حالة الترخيص
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>الحالة</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getLicenseStatus().color === 'green'
                        ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                        : getLicenseStatus().color === 'yellow'
                        ? isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
                    }`}>
                      {getLicenseStatus().text}
                    </span>
                  </div>

                  {profileData.activeLicense && (
                    <>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>مفتاح الترخيص</span>
                        <span className={`font-mono text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData.activeLicense.license_key.substring(0, 20)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>تاريخ التفعيل</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(profileData.activeLicense.activated_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>تاريخ الانتهاء</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(profileData.activeLicense.expires_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>آخر تحقق</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(profileData.activeLicense.last_validated)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {profileData.licenses.length > 1 && (
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    سجل التراخيص ({profileData.licenses.length})
                  </h4>
                  <div className="space-y-2">
                    {profileData.licenses.map((license) => (
                      <div
                        key={license.uuid}
                        className={`p-3 rounded-lg text-xs ${
                          isDark ? 'bg-[#1e293b]' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {license.license_key.substring(0, 30)}...
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            license.is_active && new Date(license.expires_at) > new Date()
                              ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                              : isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {license.is_active && new Date(license.expires_at) > new Date() ? 'نشط' : 'منتهي'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                فشل تحميل بيانات الملف الشخصي
              </p>
            </div>
          )}
        </div>

        <div className={`px-6 py-4 border-t ${
          isDark ? 'border-[#334155] bg-[#0f172a]' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors ${
              isDark
                ? 'bg-[#334155] hover:bg-[#475569] text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
