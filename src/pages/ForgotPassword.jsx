import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle, FiKey } from 'react-icons/fi';
import { useExpenses } from '../context/ExpenseContext';
import logoImg from '../assets/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const { forgotPassword } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result && result.resetUrl) {
      setResetUrl(result.resetUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft-lg border border-gray-100 dark:border-gray-700/60">
        {/* Brand Header */}
        <div className="text-center">
          <img src={logoImg} alt="My Expense Tracker" className="h-16 w-16 mx-auto mb-4 rounded-2xl object-cover shadow-lg shadow-emerald-500/10 border border-gray-100 dark:border-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Recover Password
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Enter your email to receive a password recovery link
          </p>
        </div>

        {resetUrl ? (
          <div className="space-y-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-2xl text-center">
            <FiCheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Recovery Link Generated!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                A password reset token has been created for <span className="font-semibold text-emerald-600 dark:text-emerald-400">{email}</span>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(resetUrl)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiKey className="h-4 w-4" /> Reset Password Now <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Request Form */
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">
                Registered Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Generate Recovery Link <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
