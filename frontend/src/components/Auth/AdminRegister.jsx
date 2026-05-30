import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, Shield, KeyRound } from 'lucide-react';

export const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerAdmin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await registerAdmin(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.adminSecret
    );

    if (result.success) {
      navigate('/library/upload');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 dark:from-dark-900 dark:to-dark-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 mb-4">
            <Shield size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Admin Account</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Requires the admin secret from <code className="text-xs">backend/.env</code>
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="admin@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="adminSecret"
                placeholder="Admin registration secret"
                value={formData.adminSecret}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="text-primary-600 font-semibold">
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
