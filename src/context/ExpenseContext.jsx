import React, { createContext, useState, useEffect, useContext } from 'react';
import expenseService from '../services/expenseService';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 10
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [page, setPage] = useState(1);

  // Dark Mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply theme class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Fetch Dashboard details
  const fetchDashboard = async () => {
    setDashboardLoading(true);
    try {
      const res = await expenseService.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Fetch Expenses with active filters
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
        startDate,
        endDate,
        month,
        sortBy,
        page,
        limit: pagination.limit
      };

      const res = await expenseService.getExpenses(params);
      if (res.success) {
        setExpenses(res.data);
        setPagination({
          total: res.total,
          pages: res.pages,
          currentPage: res.currentPage,
          limit: pagination.limit
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load expenses list');
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading list when active filters change
  useEffect(() => {
    fetchExpenses();
  }, [search, category, startDate, endDate, month, sortBy, page]);

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setStartDate('');
    setEndDate('');
    setMonth('');
    setSortBy('date_desc');
    setPage(1);
    toast.success('Filters cleared');
  };

  // Create
  const addExpense = async (data) => {
    setLoading(true);
    try {
      const res = await expenseService.createExpense(data);
      if (res.success) {
        toast.success('Expense added successfully');
        fetchDashboard();
        fetchExpenses();
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add expense';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update
  const editExpense = async (id, data) => {
    setLoading(true);
    try {
      const res = await expenseService.updateExpense(id, data);
      if (res.success) {
        toast.success('Expense updated successfully');
        fetchDashboard();
        fetchExpenses();
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update expense';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      const res = await expenseService.deleteExpense(id);
      if (res.success) {
        toast.success('Expense deleted successfully');
        fetchDashboard();
        fetchExpenses();
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Import CSV
  const importCSV = async (file) => {
    setLoading(true);
    try {
      const res = await expenseService.importCSV(file);
      if (res.success) {
        toast.success(res.message);
        fetchDashboard();
        fetchExpenses();
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to import CSV';
      toast.error(msg);
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(e => console.error(e));
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Format Currency (Bangladeshi Taka default)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '৳0.00';
    return `৳${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        pagination,
        dashboardData,
        loading,
        dashboardLoading,
        search,
        setSearch,
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
        page,
        setPage,
        resetFilters,
        darkMode,
        toggleDarkMode,
        fetchDashboard,
        fetchExpenses,
        addExpense,
        editExpense,
        deleteExpense,
        importCSV,
        formatCurrency,
        exportUrl: expenseService.getExportUrl()
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
