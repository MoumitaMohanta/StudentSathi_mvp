import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ setIsOpen }) => {
  const { darkMode, toggleDarkMode, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 z-40">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between lg:pl-[calc(16rem+2rem)]">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center space-x-4">
          <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </span>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
