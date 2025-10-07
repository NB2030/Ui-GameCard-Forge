import React, { useState } from 'react';
import AuthModal from './AuthModal';
import LicenseModal from './LicenseModal';
import { useAuth } from '../../hooks/useAuth';
import { useLicense } from '../../hooks/useLicense';
import { signOut } from '../../services/auth';

interface LicenseGateProps {
  children: React.ReactNode;
  isDark: boolean;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ children, isDark }) => {
  const { user, loading: authLoading } = useAuth();
  const { licenseStatus, loading: licenseLoading, initializing, recheckLicense } = useLicense(user);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            جاري تحميل الجلسة...
          </p>
        </div>
      </div>
    );
  }

  if (user && initializing) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            جاري التحقق من الترخيص...
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            يرجى الانتظار
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className={`min-h-screen flex items-center justify-center ${
          isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
        }`}>
          <div className="text-center max-w-md px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
            }`}>
              <svg className="w-10 h-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              مرحباً بك في GameCard Forge
            </h1>
            <p className={`text-lg mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              يرجى تسجيل الدخول للمتابعة
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
            >
              تسجيل الدخول / إنشاء حساب
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            recheckLicense();
          }}
          isDark={isDark}
        />
      </>
    );
  }

  if (!licenseStatus.isValid) {
    return (
      <>
        <div className={`min-h-screen flex items-center justify-center ${
          isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
        }`}>
          <div className="text-center max-w-md px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
            }`}>
              <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              ترخيص غير نشط
            </h1>
            <p className={`text-lg mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {licenseStatus.message || 'يرجى تفعيل الترخيص للوصول إلى البرنامج'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLicenseModal(true)}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
              >
                تفعيل الترخيص
              </button>
              <button
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all active:scale-95 ${
                  isDark
                    ? 'bg-[#334155] hover:bg-[#475569] text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
        <LicenseModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
          onSuccess={recheckLicense}
          isDark={isDark}
        />
      </>
    );
  }

  if (licenseStatus.offline) {
    return (
      <>
        <div className={`${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'} border-b ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'} px-4 py-2`}>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
              الوضع غير متصل - يتم استخدام الترخيص المحفوظ محلياً
            </span>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default LicenseGate;
