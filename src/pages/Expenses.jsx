import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import ExpenseTable from '../components/ExpenseTable';

const Expenses = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5.5">
      {/* Header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Expense Registry</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Search, filter, edit, and organize all your registered payments.</p>
        </div>
        <button
          onClick={() => navigate('/add-expense')}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 transition-all self-start sm:self-center cursor-pointer"
        >
          + Add Expense
        </button>
      </div>

      {/* Search and Filters Layout */}
      <div className="flex flex-col gap-4">
        <div className="max-w-md w-full">
          <SearchBar />
        </div>
        <Filters />
      </div>

      {/* Main Registry Table */}
      <div className="mt-2">
        <ExpenseTable />
      </div>
    </div>
  );
};

export default Expenses;
