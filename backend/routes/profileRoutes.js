const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  saveResumeData,
  getResumeData,
  checkCompanyCompleteness
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// All profile routes are protected
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/resume', protect, getResumeData);
router.put('/resume', protect, saveResumeData);
router.get('/company-completeness', protect, checkCompanyCompleteness);
router.get('/:id', protect, getUserById);

module.exports = router;
