import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiInfo } from 'react-icons/fi';

const ExpenseForm = ({ onSubmit, initialData = null, onCancel, submitLabel = 'Save Expense' }) => {
  const categories = [
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

  const paymentMethods = [
    'Cash',
    'Card',
    'UPI',
    'Bank Transfer',
    'Net Banking',
    'Others'
  ];

  // Fields state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  // Form Validation errors state
  const [errors, setErrors] = useState({});

  // Initialize form fields for Edit Mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || '');
      setPaymentMethod(initialData.paymentMethod || 'Cash');
      
      // Format date to YYYY-MM-DD for standard input fields
      if (initialData.date) {
        const d = new Date(initialData.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDate('');
      }
      setNotes(initialData.notes || '');
    } else {
      // Default to today's date in local time for New Expense
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [initialData]);

  // Form Field Validator
  const validateForm = () => {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = 'Title is required';
    if (!amount) {
      tempErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      tempErrors.amount = 'Amount must be a positive number';
    }
    if (!category) tempErrors.category = 'Category selection is required';
    if (!date) tempErrors.date = 'Transaction date is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        paymentMethod,
        date: new Date(date).toISOString(),
        notes: notes.trim()
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5.5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Expense Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            placeholder="e.g., Weekly Grocery shopping"
            className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/10'
            } dark:text-white`}
          />
          {errors.title && (
            <span className="text-[11px] sm:text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-0.5">
              <FiInfo className="shrink-0" /> {errors.title}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Amount (৳) *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
            }}
            placeholder="0.00"
            className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.amount
                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/10'
            } dark:text-white`}
          />
          {errors.amount && (
            <span className="text-[11px] sm:text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-0.5">
              <FiInfo className="shrink-0" /> {errors.amount}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors(prev => ({ ...prev, category: null }));
            }}
            className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.category
                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/10'
            } dark:text-white`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-[11px] sm:text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-0.5">
              <FiInfo className="shrink-0" /> {errors.category}
            </span>
          )}
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="paymentMethod" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/10 dark:text-white transition-all"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Transaction Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors(prev => ({ ...prev, date: null }));
            }}
            className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.date
                ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/10'
            } dark:text-white`}
          />
          {errors.date && (
            <span className="text-[11px] sm:text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-0.5">
              <FiInfo className="shrink-0" /> {errors.date}
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add secondary information or reminders..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/10 dark:text-white transition-all resize-none"
        />
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
        >
          <FiX className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/15 hover:shadow-primary-500/25 transition-all flex items-center gap-1.5"
        >
          <FiSave className="h-4 w-4" /> {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
