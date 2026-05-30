import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Book, Users, LogOut, Settings, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../Common/Avatar';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/profile', label: 'My Profile', icon: Settings },
    { href: '/library', label: 'Materials', icon: Book },
    { href: '/alumni', label: 'Alumni', icon: Users },
  ];

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin', label: 'Admin Panel', icon: Settings },
    { href: '/library/upload', label: 'Upload Materials', icon: FileText },
    { href: '/alumni/manage', label: 'Manage Alumni', icon: Users },
    { href: '/library', label: 'Browse Library', icon: Book },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            StudentSathi
          </h1>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center space-x-3">
              <Avatar
                name={`${user.firstName} ${user.lastName}`}
                src={user.profilePicture}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-6">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <button
            type="button"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
