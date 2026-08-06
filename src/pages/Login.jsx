import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useExpenses } from '../context/ExpenseContext';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleLogin } = useExpenses();
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

  // Google OAuth Login Trigger
  const handleGoogleSignIn = async () => {
    // Prompt user for Google Email demo input or simulate OAuth callback
    const googleEmail = prompt('Enter your Google Account Email:');
    if (!googleEmail) return;

    if (!googleEmail.includes('@')) {
      toast.error('Please enter a valid Google email address');
      return;
    }

    const googleName = googleEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = googleName.charAt(0).toUpperCase() + googleName.slice(1);

    setGoogleLoading(true);
    const success = await googleLogin({
      email: googleEmail,
      name: formattedName,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleName)}`,
      googleId: `google_${Date.now()}`
    });
    setGoogleLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-7 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-gray-700/60">
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

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {googleLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          ) : (
            <>
              <FcGoogle className="h-5 w-5" /> Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
          <span className="bg-white dark:bg-gray-800 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
            OR EMAIL
          </span>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-primary-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 dark:text-white transition-all"
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
          <div className="bg-primary-50/60 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 p-2.5 rounded-xl text-[11px] text-primary-700 dark:text-primary-300">
            <span className="font-semibold block mb-0.5">Demo Account Credentials:</span>
            Email: <code className="font-bold">admin@expense.com</code> &bull; Password: <code className="font-bold">password123</code>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="text-center pt-1">
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
