import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryChart = ({ data = [], formatCurrency }) => {
  // Pre-mapped colors for consistency
  const COLORS = {
    Food: '#3b82f6',        // Blue
    Transport: '#8b5cf6',   // Purple
    Shopping: '#ec4899',    // Pink
    Bills: '#f59e0b',        // Amber/Yellow
    Entertainment: '#6366f1',// Indigo
    Medical: '#f43f5e',      // Rose
    Education: '#10b981',    // Emerald
    Travel: '#06b6d4',      // Cyan
    Others: '#6b7280'        // Gray
  };

  const DEFAULT_COLOR = '#9ca3af';

  // Calculate percentages
  const totalAmount = data.reduce((acc, curr) => acc + curr.value, 0);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = totalAmount > 0 ? ((payload[0].value / totalAmount) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-soft-lg text-xs">
          <p className="font-semibold text-gray-800 dark:text-white mb-1">{payload[0].name}</p>
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] text-primary-500 font-semibold">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-soft transition-colors duration-200 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-base font-bold text-gray-800 dark:text-white">Category Breakdown</h3>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-6">Distribution of expenses by category</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Chart */}
        <div className="h-48 w-48 shrink-0 relative flex items-center justify-center">
          {data.length === 0 ? (
            <div className="text-gray-400 text-sm font-medium text-center">No categories to display</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || DEFAULT_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Center Info Panel */}
          {data.length > 0 && (
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Total</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white leading-none mt-1">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        {data.length > 0 && (
          <div className="flex-1 w-full max-h-48 overflow-y-auto pr-1 space-y-2">
            {data.slice(0, 5).map((entry, index) => {
              const color = COLORS[entry.name] || DEFAULT_COLOR;
              const percentage = totalAmount > 0 ? ((entry.value / totalAmount) * 100).toFixed(0) : 0;
              return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800 dark:text-white mr-1.5">{formatCurrency(entry.value)}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
            {data.length > 5 && (
              <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 font-medium pt-1.5 border-t border-gray-100 dark:border-gray-800">
                + {data.length - 5} more categories
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
