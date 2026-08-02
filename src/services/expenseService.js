import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : '/api';

const expenseService = {
  // Get dashboard statistics
  getDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard`);
    return response.data;
  },

  // Get list of expenses with filters
  getExpenses: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/expenses`, { params });
    return response.data;
  },

  // Get single expense
  getExpenseById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData) => {
    const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (id, expenseData) => {
    const response = await axios.put(`${API_BASE_URL}/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/expenses/${id}`);
    return response.data;
  },

  // Import expenses via CSV file upload
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/expenses/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Export expenses (returns direct download url link)
  getExportUrl: () => {
    return `${API_BASE_URL}/expenses/export`;
  }
};

export default expenseService;
