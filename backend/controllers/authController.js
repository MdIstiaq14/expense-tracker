const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_expense_tracker_2026_antigravity',
    { expiresIn: '30d' }
  );
};

// Helper: Check if user is admin
const isUserAdmin = (user) => {
  if (!user) return false;
  return user.isAdmin === true || user.email === 'admin@expense.com';
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const isAdmin = email.toLowerCase() === 'admin@expense.com';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      authProvider: 'local',
      isAdmin
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          authProvider: user.authProvider,
          isAdmin: isUserAdmin(user),
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please click "Continue with Google"' });
    }

    if (await user.matchPassword(password)) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          authProvider: user.authProvider,
          isAdmin: isUserAdmin(user),
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Authentication (Login / Register)
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid Google account data' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    const isAdmin = email.toLowerCase() === 'admin@expense.com';

    if (user) {
      if (!user.googleId) user.googleId = googleId || '';
      if (!user.avatar && picture) user.avatar = picture;
      if (isAdmin) user.isAdmin = true;
      await user.save();
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: picture || '',
        googleId: googleId || '',
        authProvider: 'google',
        isAdmin
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        authProvider: user.authProvider,
        isAdmin: isUserAdmin(user),
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const userData = user.toObject();
    userData.isAdmin = isUserAdmin(user);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile info (name, email, avatar photo)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || '',
        authProvider: updatedUser.authProvider,
        isAdmin: isUserAdmin(updatedUser),
        token: generateToken(updatedUser._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change User Password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.authProvider === 'local') {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Please enter your current password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    user.authProvider = 'local';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - Request Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user account found with this email address' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully',
      resetToken,
      resetUrl: `/reset-password/${resetToken}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password via Token
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link' });
    }

    user.password = newPassword;
    user.authProvider = 'local';
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        isAdmin: isUserAdmin(user),
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Admin Stats & Privacy-Preserved User Names List
// @route   GET /api/auth/admin-stats
// @access  Private (Admin Only)
exports.getAdminStats = async (req, res) => {
  try {
    if (!isUserAdmin(req.user)) {
      return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }

    const totalUsers = await User.countDocuments();

    // Privacy-preserving query: Select ONLY name, avatar, and createdAt fields (no emails)
    const usersList = await User.find()
      .select('name avatar createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersList
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
