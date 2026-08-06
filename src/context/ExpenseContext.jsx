import React, { createContext, useState, useEffect, useContext } from 'react';
import expenseService from '../services/expenseService';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  // App data states
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

  // Apply theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Check auth user on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await expenseService.getMe();
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error(err);
          logout();
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, [token]);

  // Auth Methods
  const login = async (credentials) => {
    try {
      const res = await expenseService.login(credentials);
      if (res.success) {
        const { token: newToken, ...userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await expenseService.register(userData);
      if (res.success) {
        const { token: newToken, ...userInfo } = res.data;
        setToken(newToken);
        setUser(userInfo);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        toast.success(`Account created! Welcome, ${userInfo.name}!`);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return false;
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const res = await expenseService.googleLogin(googleData);
      if (res.success) {
        const { token: newToken, ...userInfo } = res.data;
        setToken(newToken);
        setUser(userInfo);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        toast.success(`Welcome, ${userInfo.name}!`);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      toast.error(msg);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await expenseService.updateProfile(profileData);
      if (res.success) {
        const { token: newToken, ...userInfo } = res.data;
        if (newToken) {
          setToken(newToken);
          localStorage.setItem('token', newToken);
        }
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        toast.success('Profile updated successfully');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
      return false;
    }
  };

  const changePassword = async (passData) => {
    try {
      const res = await expenseService.changePassword(passData);
      if (res.success) {
        toast.success(res.message || 'Password changed successfully');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      toast.error(msg);
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await expenseService.forgotPassword(email);
      if (res.success) {
        toast.success('Password reset link generated!');
        return res;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to request password reset';
      toast.error(msg);
      return null;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await expenseService.resetPassword(token, newPassword);
      if (res.success) {
        toast.success(res.message || 'Password reset successful!');
        return res;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      toast.error(msg);
      return null;
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setExpenses([]);
    setDashboardData(null);
    toast.success('Logged out successfully');
  };

  // Fetch Dashboard details
  const fetchDashboard = async () => {
    if (!token) return;
    setDashboardLoading(true);
    try {
      const res = await expenseService.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Fetch Expenses with active filters
  const fetchExpenses = async () => {
    if (!token) return;
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
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading list when active filters change
  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [search, category, startDate, endDate, month, sortBy, page, token]);

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

  // CRUD actions
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
        token,
        user,
        authLoading,
        login,
        register,
        googleLogin,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        logout,
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
