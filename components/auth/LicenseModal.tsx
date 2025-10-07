import React, { useState } from 'react';
import { activateLicense } from '../../services/license';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, onSuccess, isDark }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await activateLicense(licenseKey);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during license activation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-lg p-2 transition-colors ${
              isDark
                ? 'hover:bg-[#334155] text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            <div className="mb-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
              }`}>
                <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Activate License
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Enter your license key to activate the software.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  License Key
                </label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors font-mono ${
                    isDark
                      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-cyan-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 active:scale-[0.98]'
                } text-white`}
              >
                {loading ? 'Activating...' : 'Activate License'}
              </button>
            </form>

            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-[#0f172a]' : 'bg-gray-50'
            }`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Note: You can get your license key from your admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;