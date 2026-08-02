import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiInfo } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';
import toast from 'react-hot-toast';

const EditExpense = () => {
  const { id } = useParams();
  const { editExpense } = useExpenses();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch expense details on load
  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const res = await expenseService.getExpenseById(id);
        if (res.success) {
          setExpense(res.data);
        } else {
          toast.error('Expense record not found');
          navigate('/expenses');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error retrieving expense details');
        navigate('/expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseDetails();
  }, [id]);

  const handleFormSubmit = async (formData) => {
    const success = await editExpense(id, formData);
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
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">Modify Expense Details</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Make changes to your logged transaction details below.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-3.5">Loading transaction particulars...</p>
          </div>
        ) : expense ? (
          <ExpenseForm
            onSubmit={handleFormSubmit}
            initialData={expense}
            onCancel={() => navigate(-1)}
            submitLabel="Update Expense"
          />
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <FiInfo className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Failed to load expense record</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditExpense;
