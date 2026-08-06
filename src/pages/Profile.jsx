import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiCheck, FiShield, FiKey, FiTrash2, FiSave } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useExpenses } from '../context/ExpenseContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useExpenses();

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Active Tab: 'info' or 'security'
  const [activeTab, setActiveTab] = useState('info');

  // Handle Photo Upload (Convert & compress image file)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedBase64);
        toast.success('Photo selected & optimized! Click "Save Profile Changes" below.');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    toast.success('Photo removed! Click "Save Profile Changes" below.');
  };

  // Submit Profile Info
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email cannot be empty');
      return;
    }

    setProfileLoading(true);
    await updateProfile({ name: name.trim(), email: email.trim(), avatar });
    setProfileLoading(false);
  };

  // Submit Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    const success = await changePassword({ currentPassword, newPassword });
    setPasswordLoading(false);

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Get Initials from Name
  const getInitials = (userName) => {
    if (!userName) return 'EX';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft-sm border border-gray-100 dark:border-gray-700/60 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Display */}
        <div className="relative group shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-24 w-24 rounded-2xl object-cover shadow-md border-2 border-primary-500/20"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {getInitials(user?.name)}
            </div>
          )}
          <label className="absolute -bottom-2 -right-2 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105">
            <FiCamera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* User Overview */}
        <div className="text-center md:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.name || 'User Profile'}
            </h2>
            {user?.authProvider === 'google' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                <FcGoogle className="h-3.5 w-3.5" /> Google Account
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <FiShield className="h-3 w-3" /> Password Protected
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || 'email@example.com'}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            Personalize your account details and password settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'info'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FiUser className="h-4 w-4" /> Personal Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FiKey className="h-4 w-4" /> Password & Security
        </button>
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'info' && (
        <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft-sm border border-gray-100 dark:border-gray-700/60 space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Account Details & Avatar
          </h3>

          {/* Profile Photo Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Profile Photo
            </label>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5">
                <FiCamera className="h-3.5 w-3.5" /> Upload New Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiUser className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiMail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {profileLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiSave className="h-4 w-4" /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft-sm border border-gray-100 dark:border-gray-700/60 space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Change Account Password
          </h3>

          {/* Current Password (if local user) */}
          {user?.authProvider === 'local' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              New Password (min 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiLock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <FiLock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {passwordLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiCheck className="h-4 w-4" /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
