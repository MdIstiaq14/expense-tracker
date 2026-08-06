import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useExpenses } from '../context/ExpenseContext';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, googleLogin } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    const success = await register({ name, email, password });
    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  // Google OAuth Login Trigger
  const handleGoogleSignIn = async () => {
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
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-gray-700/60">
        {/* Brand Header */}
        <div className="text-center">
          <img src={logoImg} alt="My Expense Tracker" className="h-16 w-16 mx-auto mb-4 rounded-2xl object-cover shadow-lg shadow-emerald-500/10 border border-gray-100 dark:border-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Get started with your private expense manager
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
              <FcGoogle className="h-5 w-5" /> Sign up with Google
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

        {/* Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiUser className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:border-primary-500 dark:text-white transition-all"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiLock className="h-4.5 w-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                Create Account <FiArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-1 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-500 hover:underline">
              Sign In
            </Link>
          </p>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700/60 pt-3">
            &copy; 2026 My Expense Tracker &bull; Designed &amp; Developed by <span className="font-bold text-gray-600 dark:text-gray-400">Md Istiaq</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
