import React from 'react';
import { Navigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

const ProtectedRoute = ({ children }) => {
  const { token, authLoading } = useExpenses();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-primary-500"></div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-4">Verifying authentication...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
