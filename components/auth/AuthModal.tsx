import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, isDark }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

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
              <h2 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {mode === 'signin'
                  ? 'Welcome back! Please sign in to continue.'
                  : 'Create your account now to get started.'}
              </p>
            </div>

            {mode === 'signin' ? (
              <SignInForm
                isDark={isDark}
                onSuccess={onSuccess}
                onSwitchToSignUp={() => setMode('signup')}
              />
            ) : (
              <SignUpForm
                isDark={isDark}
                onSuccess={onSuccess}
                onSwitchToSignIn={() => setMode('signin')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
