import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar - Desktop and Mobile (Drawer) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 transition-colors duration-200 flex flex-col justify-between">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>

          {/* Owner Footer */}
          <footer className="mt-8 pt-4 pb-2 text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 border-t border-gray-200/60 dark:border-gray-800">
            &copy; 2026 My Expense Tracker &bull; Designed &amp; Developed by <span className="font-bold text-gray-700 dark:text-gray-300">Md Istiaq</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
