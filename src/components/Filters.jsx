import React, { useRef, useState } from 'react';
import { FiDownload, FiUpload, FiSliders, FiRefreshCw, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const Filters = () => {
  const {
    category,
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    month,
    setMonth,
    sortBy,
    setSortBy,
    resetFilters,
    importCSV,
    exportUrl
  } = useExpenses();

  const fileInputRef = useRef(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'All',
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Medical',
    'Education',
    'Travel',
    'Others'
  ];

  const sortOptions = [
    { label: 'Latest First', value: 'date_desc' },
    { label: 'Oldest First', value: 'date_asc' },
    { label: 'Highest Amount', value: 'amount_desc' },
    { label: 'Lowest Amount', value: 'amount_asc' }
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const success = await importCSV(file);
      if (success) {
        e.target.value = ''; // clear input
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4.5 shadow-soft transition-all duration-200">
      {/* Primary Row: Category, Sorting, and CSV Controls */}
      <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        
        {/* Category Selector (Touch Scrollable) */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border whitespace-nowrap shrink-0 transition-all duration-200 ${
                category === cat
                  ? 'bg-primary-500 border-primary-500 text-white shadow-sm shadow-primary-500/10'
                  : 'bg-white border-gray-200/80 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700/40">
          
          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer flex-1 sm:flex-initial"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showAdvanced
                  ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-950/20 dark:border-primary-900 dark:text-primary-400'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60'
              }`}
              title="Advanced Filters"
            >
              <FiSliders className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {showAdvanced ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
            </button>

            {/* Clear Filters */}
            <button
              onClick={resetFilters}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition-all"
              title="Reset Filters"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>

            {/* CSV Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition-all"
              title="Import CSV"
            >
              <FiUpload className="h-4 w-4" />
            </button>

            {/* CSV Export */}
            <a
              href={exportUrl}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition-all flex items-center justify-center"
              title="Export CSV"
              download
            >
              <FiDownload className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fade-in">
          
          {/* Month Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Filter by Month</span>
            <div className="relative">
              <input
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setStartDate('');
                  setEndDate('');
                }}
                disabled={!!(startDate || endDate)}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setMonth('');
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setMonth('');
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer"
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default Filters;
