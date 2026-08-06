const express = require('express');
const {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getAdminStats
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin Only Route
router.get('/admin-stats', protect, getAdminStats);

module.exports = router;
