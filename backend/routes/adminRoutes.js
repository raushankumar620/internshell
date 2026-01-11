const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Admin login route
router.post('/login', adminController.login);

// Protected admin routes
router.get('/dashboard', adminAuth, adminController.getDashboard);
router.get('/users', adminAuth, adminController.getUsers);
router.get('/jobs', adminAuth, adminController.getJobs);
router.get('/applications', adminAuth, adminController.getApplications);
router.get('/stats', adminAuth, adminController.getStats);

// Admin profile management
router.get('/profile', adminAuth, adminController.getProfile);
router.put('/profile', adminAuth, adminController.updateProfile);
router.put('/change-password', adminAuth, adminController.changePassword);

// Security management
router.get('/security/settings', adminAuth, adminController.getSecuritySettings);
router.put('/security/settings', adminAuth, adminController.updateSecuritySettings);
router.get('/security/audit-logs', adminAuth, adminController.getAuditLogs);
router.get('/security/api-keys', adminAuth, adminController.getApiKeys);
router.post('/security/api-keys', adminAuth, adminController.createApiKey);
router.delete('/security/api-keys/:id', adminAuth, adminController.deleteApiKey);

// User management
router.put('/users/:id/status', adminAuth, adminController.updateUserStatus);
router.delete('/users/:id', adminAuth, adminController.deleteUser);

// Job management
router.put('/jobs/:id/status', adminAuth, adminController.updateJobStatus);
router.delete('/jobs/:id', adminAuth, adminController.deleteJob);

module.exports = router;