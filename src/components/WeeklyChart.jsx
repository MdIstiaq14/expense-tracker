import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyChart = ({ data = [], formatCurrency }) => {
  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-soft-lg text-xs">
          <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">{payload[0].payload.name}day</p>
          <p className="font-bold text-indigo-500 text-sm">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-soft transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">Weekly Spending Activity</h3>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">Expenses logged throughout the current week</p>
        </div>
      </div>

      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm font-medium">
            No weekly data to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-gray-700/40" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WeeklyChart;
