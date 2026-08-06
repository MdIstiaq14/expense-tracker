import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiPlusCircle, FiX, FiLogOut, FiUser, FiShield, FiInfo } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';
import AboutOwnerModal from './AboutOwnerModal';
import logoImg from '../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { dashboardData, formatCurrency, user, logout } = useExpenses();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: FiGrid },
    { name: 'Expenses', to: '/expenses', icon: FiList },
    { name: 'Add Expense', to: '/add-expense', icon: FiPlusCircle },
    { name: 'Profile Settings', to: '/profile', icon: FiUser },
  ];

  if (user?.isAdmin) {
    navigation.push({ name: 'Admin Portal', to: '/admin', icon: FiShield });
  }

  return (
    <>
      {/* About Owner Modal */}
      <AboutOwnerModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-gray-800 border-r border-gray-200/80 dark:border-gray-700/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="My Expense Tracker" className="h-10 w-10 rounded-xl object-cover shadow-md shrink-0" />
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight leading-tight block">My Expense</span>
              <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-[-1px]">Track &bull; Manage &bull; Grow</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </>
                );
              }}
            </NavLink>
          ))}

          {/* Owner Branding Card */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="w-full bg-gradient-to-tr from-emerald-50 to-primary-50 dark:from-emerald-950/30 dark:to-primary-950/30 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl p-3 text-left hover:scale-[1.02] transition-transform duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Created & Managed By
                </span>
                <FiInfo className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="text-xs font-extrabold text-gray-900 dark:text-white block mt-0.5">
                Md Istiaq
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
                Founder & Lead Developer &bull; Tap for Info
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
          >
            <FiLogOut className="h-5 w-5 text-rose-500" />
            Sign Out
          </button>
        </nav>

        {/* Sidebar Footer - User Quick stats summary */}
        {dashboardData && (
          <div className="p-4 mx-4 mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-700/10 border border-gray-100 dark:border-gray-700/40">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
              Monthly Budget Cap
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {formatCurrency(dashboardData.monthlyExpense)}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">spent</span>
            </div>
            <div className="mt-3.5 w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (dashboardData.monthlyExpense / 50000) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 block font-medium truncate">
              {user?.name ? `${user.name}'s Limit: ৳50,000.00` : 'Target limit: ৳50,000.00'}
            </span>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
