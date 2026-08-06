import React, { useEffect, useState } from 'react';
import { FiUsers, FiShield, FiClock, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const AdminDashboard = () => {
  const { getAdminStats } = useExpenses();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminStats = async () => {
      setLoading(true);
      const data = await getAdminStats();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };

    loadAdminStats();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'EX';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary-500"></div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-4">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft-sm border border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Portal
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
              <FiShield className="h-3 w-3" /> Owner Access
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Real-time registered user metrics with privacy protection
          </p>
        </div>
      </div>

      {/* KPI User Counter Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
              Total App Users
            </span>
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 block">
              {stats?.totalUsers || 0}
            </span>
            <span className="text-[11px] font-medium text-emerald-500 mt-1 block">
              Active Registered Accounts
            </span>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center">
            <FiUsers className="h-7 w-7" />
          </div>
        </div>

        {/* Privacy Notice Card */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20 border border-primary-100 dark:border-primary-900/40 rounded-2xl p-6 shadow-soft flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-300">
              <FiLock className="h-4 w-4" /> Privacy-First Guaranteed
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              User emails & personal financial transactions remain 100% private and isolated.
            </p>
          </div>
        </div>
      </div>

      {/* Registered User Names Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Registered App Users Directory
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Showing user names and registration timestamps
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
            {stats?.usersList?.length || 0} Members
          </span>
        </div>

        {stats?.usersList?.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-500">
            No registered users found
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {stats?.usersList?.map((usr) => (
              <div key={usr._id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  {usr.avatar ? (
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="h-9 w-9 rounded-xl object-cover shadow-sm border border-primary-500/20"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {getInitials(usr.name)}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      {usr.name || 'Anonymous User'}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                      <FiCheckCircle className="h-3 w-3 text-emerald-500" /> Verified Member
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                    <FiClock className="h-3.5 w-3.5 text-gray-400" /> {formatDate(usr.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
