import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiCalendar, FiArrowRight, FiPercent, FiActivity, FiTag } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';
import DashboardCard from '../components/DashboardCard';
import WeeklyChart from '../components/WeeklyChart';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';

const Dashboard = () => {
  const { dashboardData, dashboardLoading, fetchDashboard, formatCurrency } = useExpenses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mt-4 animate-pulse">Aggregating portfolio details...</p>
      </div>
    );
  }

  const stats = dashboardData || {
    totalExpense: 0,
    monthlyExpense: 0,
    weeklyExpense: 0,
    totalTransactions: 0,
    recentTransactions: [],
    charts: { categoryData: [], weeklyData: [], monthlyData: [] }
  };

  return (
    <div className="space-y-6.5">
      {/* Welcome Message for Desktop */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Financial Overview</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Summary of your current spending metrics and transaction activity</p>
        </div>
        <button
          onClick={() => navigate('/add-expense')}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 transition-all cursor-pointer"
        >
          + Add Expense
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Today's Expense"
          value={formatCurrency(stats.todayExpense || 0)}
          icon={FiActivity}
          color="emerald"
          trend="Today's total"
        />
        <DashboardCard
          title="This Week"
          value={formatCurrency(stats.weeklyExpense)}
          icon={FiActivity}
          color="rose"
          trend={stats.weeklyExpense > 500 ? "Elevated" : "Controlled"}
          trendType={stats.weeklyExpense > 500 ? "up" : "down"}
        />
        <DashboardCard
          title="This Month"
          value={formatCurrency(stats.monthlyExpense)}
          icon={FiCalendar}
          color="indigo"
          trend={stats.monthlyExpense > 2000 ? "High usage" : "Within bounds"}
          trendType={stats.monthlyExpense > 2000 ? "up" : "down"}
        />
        <DashboardCard
          title="Total Outflow"
          value={formatCurrency(stats.totalExpense)}
          icon={FiDollarSign}
          color="blue"
          trend="Cumulative"
        />
      </div>

      {/* Charts Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        {/* Weekly line activity */}
        <div className="lg:col-span-2">
          <WeeklyChart data={stats.charts.weeklyData} formatCurrency={formatCurrency} />
        </div>
        
        {/* Category Pie */}
        <div>
          <CategoryChart data={stats.charts.categoryData} formatCurrency={formatCurrency} />
        </div>
      </div>

      {/* Bottom Section: Monthly Bar chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5">
        {/* Monthly Trend */}
        <div className="lg:col-span-2">
          <MonthlyChart data={stats.charts.monthlyData} formatCurrency={formatCurrency} />
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-soft transition-colors duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5.5">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Recent Outflows</h3>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">Your latest 5 expenditures</p>
              </div>
              <button
                onClick={() => navigate('/expenses')}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 hover:underline transition-all"
              >
                View Registry <FiArrowRight />
              </button>
            </div>

            {stats.recentTransactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400 dark:text-gray-500 font-medium">
                No recent transactions registered
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
                {stats.recentTransactions.map((exp) => (
                  <div key={exp._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="block font-bold text-gray-800 dark:text-white truncate max-w-[150px]">
                        {exp.title}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                        {formatDate(exp.date)} &bull; {exp.category}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white shrink-0">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
