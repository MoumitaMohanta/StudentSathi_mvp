import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, Shield } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, { requireAdmin: true });

    if (result.success) {
      navigate('/library/upload');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 dark:from-dark-900 dark:to-dark-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 mb-4">
            <Shield size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to upload study materials, PYQs, and question banks
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Login as Admin'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
            New admin?{' '}
            <Link to="/admin/register" className="text-primary-600 font-semibold">
              Create admin account
            </Link>
          </p>
          <p className="text-center text-gray-500 text-sm mt-3">
            <Link to="/login" className="hover:text-primary-600">
              Student login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
