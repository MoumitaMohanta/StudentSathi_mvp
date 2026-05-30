import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    totalAlumni: 0,
    downloadCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch {
        setError('Failed to load system statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Study Materials', value: stats.totalMaterials, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Alumni', value: stats.totalAlumni, icon: Users, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Downloads', value: stats.downloadCount, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

      {error && (
        <p className="mb-6 text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/library/upload"
              className="block bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 hover:bg-primary-100 dark:hover:bg-primary-900/30"
            >
              <h3 className="font-semibold text-primary-900 dark:text-primary-200">Upload Materials</h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Add PYQs and study materials via Cloudinary
              </p>
            </Link>
            <Link
              to="/alumni/manage"
              className="block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <h3 className="font-semibold text-green-900 dark:text-green-200">Manage Alumni</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Add alumni profiles with role, company, and advice
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All metrics are loaded from MongoDB. Promote a user to admin in Atlas:
          </p>
          <pre className="mt-4 p-4 bg-gray-100 dark:bg-dark-700 rounded-lg text-xs overflow-x-auto">
            {`db.users.updateOne(
  { email: "you@example.com" },
  { $set: { role: "admin" } }
)`}
          </pre>
        </div>
      </div>
    </div>
  );
};
