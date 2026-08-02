import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';

const AddExpense = () => {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    const success = await addExpense(formData);
    if (success) {
      navigate('/expenses');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" /> Go Back
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 md:p-8 shadow-soft transition-colors duration-200">
        <div className="mb-6 border-b border-gray-100 dark:border-gray-750 pb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Log New Outflow</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Register a new transaction payment item into your registry.</p>
        </div>

        <ExpenseForm
          onSubmit={handleFormSubmit}
          onCancel={() => navigate(-1)}
          submitLabel="Log Expense"
        />
      </div>
    </div>
  );
};

export default AddExpense;
