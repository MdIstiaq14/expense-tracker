import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, trend, trendType, color }) => {
  // Determine card styles based on color selection
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-primary-500',
          iconBg: 'bg-primary-50 dark:bg-primary-950/40 text-primary-500',
          shadow: 'hover:shadow-primary-500/10'
        };
      case 'emerald':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-emerald-500',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500',
          shadow: 'hover:shadow-emerald-500/10'
        };
      case 'rose':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-rose-500',
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-500',
          shadow: 'hover:shadow-rose-500/10'
        };
      case 'indigo':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-indigo-500',
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500',
          shadow: 'hover:shadow-indigo-500/10'
        };
      case 'amber':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-amber-500',
          iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500',
          shadow: 'hover:shadow-amber-500/10'
        };
      default:
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-l-4 border-gray-500',
          iconBg: 'bg-gray-50 dark:bg-gray-700 text-gray-500',
          shadow: 'hover:shadow-gray-500/10'
        };
    }
  };

  const style = getColorClasses();

  return (
    <div
      className={`relative flex items-center justify-between p-6 rounded-2xl ${style.bg} ${style.border} border border-gray-200/60 dark:border-gray-700/60 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300 ${style.shadow}`}
    >
      <div className="flex-1 min-w-0">
        <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </span>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight mb-2 truncate">
          {value}
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                trendType === 'down'
                  ? 'text-emerald-500' // down on expenses is good
                  : trendType === 'up'
                  ? 'text-rose-500' // up on expenses is bad
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {trend}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">from last period</span>
          </div>
        )}
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} shadow-sm shrink-0 ml-4`}>
        <Icon className="h-5.5 w-5.5" />
      </div>
    </div>
  );
};

export default DashboardCard;
