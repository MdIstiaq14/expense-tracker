import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiX, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseTable = () => {
  const {
    expenses,
    pagination,
    page,
    setPage,
    deleteExpense,
    formatCurrency,
    loading
  } = useExpenses();

  const navigate = useNavigate();

  // Modal States
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Category Color Map (pill coloring)
  const categoryColors = {
    Food: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/40',
    Transport: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800/40',
    Shopping: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 border-pink-100 dark:border-pink-800/40',
    Bills: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/40',
    Entertainment: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/40',
    Medical: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/40',
    Education: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40',
    Travel: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800/40',
    Others: 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-800'
  };

  const defaultCategoryColor = 'bg-gray-50 text-gray-700 border-gray-100';

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteExpense(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-soft">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary-500"></div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-4">Retrieving expense records...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-soft px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 mb-5">
          <FiCalendar className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1.5">No Transactions Found</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm">
          No expenses match your active filter criteria, or there are no items logged yet. Click "Add Expense" to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-soft overflow-hidden transition-colors duration-200">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700/50">
          <thead className="bg-gray-50/50 dark:bg-gray-900/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Expense Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/10 transition-colors duration-150">
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-xs">{expense.title}</div>
                  {expense.notes && <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-xs mt-0.5">{expense.notes}</div>}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColors[expense.category] || defaultCategoryColor}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {expense.paymentMethod}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-bold text-gray-800 dark:text-white">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap text-center text-xs font-medium">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                      title="View Details"
                    >
                      <FiEye className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-expense/${expense._id}`)}
                      className="p-1.5 text-gray-400 hover:text-success-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(expense._id)}
                      className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700/50">
        {expenses.map((expense) => (
          <div key={expense._id} className="p-4 flex flex-col gap-3 hover:bg-gray-50/20 dark:hover:bg-gray-700/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">{expense.title}</span>
                <span className="inline-block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(expense.date)} &bull; {expense.paymentMethod}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryColors[expense.category] || defaultCategoryColor}`}>
                {expense.category}
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedExpense(expense)}
                  className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiEye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate(`/edit-expense/${expense._id}`)}
                  className="p-2 text-gray-500 hover:text-success-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(expense._id)}
                  className="p-2 text-gray-500 hover:text-danger-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/10">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
            Page {pagination.currentPage} of {pagination.pages} ({pagination.total} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={page === pagination.pages}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detailed Modal View */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-6 border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setSelectedExpense(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FiX className="h-4.5 w-4.5" />
            </button>
            
            <span className="text-[10px] uppercase font-bold text-primary-500 tracking-wider">Transaction Review</span>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-4 truncate">{selectedExpense.title}</h4>
            
            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-750">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Amount</span>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(selectedExpense.amount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-750">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Category</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold border ${categoryColors[selectedExpense.category] || defaultCategoryColor}`}>
                  {selectedExpense.category}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-750">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Log Date</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(selectedExpense.date)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-750">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Payment Method</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedExpense.paymentMethod}</span>
              </div>
              <div className="flex flex-col gap-1.5 py-2">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Notes & Descriptions</span>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60 leading-relaxed max-h-24 overflow-y-auto">
                  {selectedExpense.notes || 'No description notes available for this expense.'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedExpense(null)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-650 dark:text-white font-semibold text-xs rounded-xl transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-6 border border-gray-100 dark:border-gray-700">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Delete Expense</h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-6">
              Are you sure you want to permanently delete this expense from the tracker registry? This action is irreversible.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-650 dark:text-white font-semibold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-danger-500 hover:bg-danger-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-danger-500/10 transition-all"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
