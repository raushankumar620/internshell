const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerification,
  forgotPassword,
  verifyResetCode,
  resetPassword
} = require('../controllers/authController');
const { googleAuth, setRole } = require('../controllers/googleAuthController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Add debugging middleware for setRole
router.post('/google/set-role', (req, res, next) => {
  console.log('=== Set Role Request Debug ===');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  console.log('Method:', req.method);
  console.log('================================');
  next();
}, setRole);

router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;