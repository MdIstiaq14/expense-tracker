import React from 'react';
import { FiX, FiGithub, FiCheckCircle, FiStar, FiHeart } from 'react-icons/fi';
import logoImg from '../assets/logo.png';

const AboutOwnerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-gray-100 dark:border-gray-700/60 relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl transition-colors"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-3">
          <img src={logoImg} alt="My Expense Tracker" className="h-20 w-20 mx-auto rounded-2xl object-cover shadow-lg shadow-emerald-500/20 border border-gray-100 dark:border-gray-700" />
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              My Expense Tracker
            </h2>
            <p className="text-xs font-semibold text-emerald-500 tracking-widest uppercase mt-0.5">
              Track &bull; Manage &bull; Grow
            </p>
          </div>
        </div>

        {/* Owner Card */}
        <div className="bg-gradient-to-br from-primary-50 to-emerald-50/50 dark:from-primary-950/30 dark:to-emerald-950/20 border border-primary-100 dark:border-primary-900/40 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-lg flex items-center justify-center shadow-md">
              MI
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Md Istiaq
              </h3>
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                Founder & Lead Software Engineer
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Designed and engineered with passion to empower users with full privacy, real-time financial analytics, and seamless expense tracking in Bangladeshi Taka (<span className="font-bold">৳</span>).
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>100% Privacy-Preserved Isolated User Registries</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Bangladeshi Taka (৳) Currency Analytics & Recharts</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Mobile Progressive Web App (PWA) Support</span>
          </div>
        </div>

        {/* GitHub Link Button */}
        <a
          href="https://github.com/MdIstiaq14/expense-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <FiGithub className="h-4 w-4" /> View Source Code on GitHub <FiStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
        </a>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
          Made with <FiHeart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Md Istiaq &bull; &copy; 2026 All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default AboutOwnerModal;
