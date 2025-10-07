import React, { useState } from 'react';
import { signUp } from '../../services/auth';

interface SignUpFormProps {
  isDark: boolean;
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ isDark, onSuccess, onSwitchToSignIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the account');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#0f172a] border-[#334155] text-white focus:border-cyan-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
          } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#0f172a] border-[#334155] text-white focus:border-cyan-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
          } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#0f172a] border-[#334155] text-white focus:border-cyan-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
          } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#0f172a] border-[#334155] text-white focus:border-cyan-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
          } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
          placeholder="••••••••"
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="text-center mt-6">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-cyan-500 hover:text-cyan-600 font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;