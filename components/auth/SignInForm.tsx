import React, { useState } from 'react';
import { signIn } from '../../services/auth';

interface SignInFormProps {
  isDark: boolean;
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ isDark, onSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
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
          البريد الإلكتروني
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
          كلمة المرور
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

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-cyan-500 hover:bg-cyan-600 active:scale-[0.98]'
        } text-white`}
      >
        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>

      <div className="text-center mt-6">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          ليس لديك حساب؟{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-cyan-500 hover:text-cyan-600 font-semibold"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
