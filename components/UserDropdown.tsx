import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/auth';

interface UserDropdownProps {
  onOpenProfile: () => void;
  isDark: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onOpenProfile, isDark }) => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    authService.signOut();
    setUser(null);
    setIsOpen(false);
  };

  const getInitials = () => {
    if (!user) return '';
    return (user.fullName || user.email || '')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getDisplayName = () => {
    if (!user) return 'Guest';
    return user.fullName || user.email.split('@')[0];
  };

  if (!user) {
    return null; // Or a sign-in button if preferred
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          isDark
            ? 'hover:bg-[#334155] text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
        }`}>
          {getInitials()}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {getDisplayName()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute left-0 mt-2 w-56 rounded-lg shadow-lg border overflow-hidden z-50 ${
          isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'
        }`}>
          <div className={`px-4 py-3 border-b ${
            isDark ? 'border-[#334155] bg-[#0f172a]' : 'border-gray-100 bg-gray-50'
          }`}>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {getDisplayName()}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5 truncate`}>
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onOpenProfile();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isDark
                  ? 'text-gray-300 hover:bg-[#334155]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>

            <div className={`my-1 border-t ${isDark ? 'border-[#334155]' : 'border-gray-100'}`}></div>

            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isDark
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;