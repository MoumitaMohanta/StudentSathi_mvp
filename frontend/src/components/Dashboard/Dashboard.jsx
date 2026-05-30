import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Users, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isAdmin) {
          const response = await profileAPI.getProfile();
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.firstName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Admin overview</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin"
            className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Admin Panel
            </h3>
            <p className="text-gray-600 dark:text-gray-400">View system stats and quick actions</p>
          </Link>
          <Link
            to="/library/upload"
            className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Materials
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Add PYQs and study resources</p>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'CGPA',
      value: profile?.cgpa ?? '0.0',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Skills',
      value: profile?.skills?.length || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Semester',
      value: profile?.semester || 'N/A',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Profile',
      value: `${profile?.profileCompletion || 0}%`,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Here&apos;s your academic overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {profile?.profileCompletion < 100 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">
            Complete Your Profile
          </h3>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${profile?.profileCompletion || 0}%` }}
            />
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <Plus size={18} />
            <span>Complete Profile</span>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Materials
          </h3>
          <Link to="/library" className="inline-flex items-center space-x-2 text-primary-600 font-medium">
            <BookOpen size={18} />
            <span>Browse Materials</span>
          </Link>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alumni Network
          </h3>
          <Link to="/alumni" className="inline-flex items-center space-x-2 text-primary-600 font-medium">
            <Users size={18} />
            <span>View Alumni</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
