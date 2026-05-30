import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header setIsOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-w-[1024px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
