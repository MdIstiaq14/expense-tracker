import React, { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const SearchBar = () => {
  const { search, setSearch } = useExpenses();
  const [localVal, setLocalVal] = useState(search);

  // Sync state if changed from reset
  useEffect(() => {
    setLocalVal(search);
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(localVal);
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [localVal]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        <FiSearch className="h-4.5 w-4.5" />
      </div>
      <input
        type="text"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        placeholder="Search expenses by title..."
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/10 dark:text-white transition-all shadow-sm"
      />
      {localVal && (
        <button
          onClick={() => setLocalVal('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
