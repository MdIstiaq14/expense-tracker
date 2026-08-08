import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiInfo, FiPlus, FiTrash2, FiShoppingBag, FiCalculator } from 'react-icons/fi';

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
  const [items, setItems] = useState([]);

  // Form Validation errors state
  const [errors, setErrors] = useState({});

  // Initialize form fields for Edit Mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || '');
      setPaymentMethod(initialData.paymentMethod || 'Cash');
      setItems(Array.isArray(initialData.items) ? initialData.items : []);
      
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
      setItems([]);
    }
  }, [initialData]);

  // Product item helpers
  const handleAddItem = () => {
    setItems(prev => [...prev, { name: '', price: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Auto-calculate sum from purchased products
  const handleAutoSumAmount = () => {
    const totalSum = items.reduce((sum, item) => {
      const p = parseFloat(item.price) || 0;
      const q = parseInt(item.quantity) || 1;
      return sum + p * q;
    }, 0);

    if (totalSum > 0) {
      setAmount(totalSum.toFixed(2));
      if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
    }
  };

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
      // Filter out incomplete items
      const validItems = items
        .filter(item => item.name.trim() && !isNaN(parseFloat(item.price)) && parseFloat(item.price) > 0)
        .map(item => ({
          name: item.name.trim(),
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity) || 1
        }));

      onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        paymentMethod,
        date: new Date(date).toISOString(),
        notes: notes.trim(),
        items: validItems
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
            placeholder="e.g., Grocery & Supermarket Shopping"
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
          <div className="flex items-center justify-between">
            <label htmlFor="amount" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Amount (৳) *
            </label>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleAutoSumAmount}
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                title="Auto-calculate total from purchased items sum"
              >
                <FiCalculator className="h-3 w-3" /> Auto-Sum Items
              </button>
            )}
          </div>
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

      {/* Itemized Purchased Products Section */}
      <div className="border border-gray-200/80 dark:border-gray-700/80 rounded-2xl p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="h-4.5 w-4.5 text-primary-500" />
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">Purchased Products Breakdown (Optional)</h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">List individual items bought in this transaction</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 font-bold text-xs rounded-xl border border-primary-200 dark:border-primary-800/40 transition-colors flex items-center gap-1"
          >
            <FiPlus className="h-3.5 w-3.5" /> Add Product
          </button>
        </div>

        {items.length > 0 && (
          <div className="space-y-3 pt-1">
            {items.map((item, index) => (
              <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm">
                <input
                  type="text"
                  placeholder="Product Name (e.g. Rice 5kg)"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price (৳)"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  className="w-24 sm:w-28 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-gray-400">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-14 px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAutoSumAmount}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
              >
                <FiCalculator className="h-3.5 w-3.5" /> Calculate Total Amount
              </button>
            </div>
          </div>
        )}
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
