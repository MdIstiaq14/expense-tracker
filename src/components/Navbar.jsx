import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiLogOut } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const Navbar = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode, user, logout } = useExpenses();
  const location = useLocation();

  // Get Page Title from path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/expenses':
        return 'Expense Registry';
      case '/add-expense':
        return 'Log New Expense';
      case '/edit-expense':
        return 'Modify Expense';
      default:
        if (location.pathname.startsWith('/edit-expense/')) {
          return 'Modify Expense Details';
        }
        return 'My Expense Tracker';
    }
  };

  // Get Initials from User Name
  const getInitials = (name) => {
    if (!name) return 'EX';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 sm:px-6 transition-colors duration-200">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 lg:hidden focus:outline-none"
          onClick={onMenuClick}
        >
          <FiMenu className="h-5.5 w-5.5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden md:block text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
            Welcome back, {user?.name || 'User'} &bull; Real-time financial insights
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications Icon (mock) */}
        <button
          type="button"
          className="relative rounded-xl p-2 sm:p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors duration-200"
        >
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <FiBell className="h-4.5 w-4.5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-xl p-2 sm:p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors duration-200"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <FiSun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <FiMoon className="h-4.5 w-4.5" />
          )}
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-4 self-stretch my-3 hidden sm:block" />

        {/* User Profile Badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-xs shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:block text-left max-w-[120px]">
            <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {user?.name || 'User'}
            </span>
            <span className="block text-[10px] text-gray-400 dark:text-gray-500 truncate">
              {user?.email || ''}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="p-2 sm:p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
          title="Sign Out"
        >
          <FiLogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
