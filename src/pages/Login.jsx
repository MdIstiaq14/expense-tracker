import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';

import logoImg from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-gray-700/60">
        {/* Brand Header */}
        <div className="text-center">
          <img src={logoImg} alt="My Expense Tracker" className="h-16 w-16 mx-auto mb-4 rounded-2xl object-cover shadow-lg shadow-emerald-500/10 border border-gray-100 dark:border-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Sign in to access your personal expense registry
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiMail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/10 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiLock className="h-4.5 w-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base sm:text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/10 dark:text-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Demo User Hint */}
          <div className="bg-primary-50/60 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 p-3 rounded-xl text-[11px] text-primary-700 dark:text-primary-300">
            <span className="font-semibold block mb-0.5">Demo Account Credentials:</span>
            Email: <code className="font-bold">admin@expense.com</code> &bull; Password: <code className="font-bold">password123</code>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                Sign In <FiArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary-500 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
