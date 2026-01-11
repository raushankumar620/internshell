const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getInternApplications,
  getEmployerApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  checkJobCompatibility
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Intern routes
router.post('/', protect, authorize('intern'), applyForJob);
router.post('/check-compatibility', protect, authorize('intern'), checkJobCompatibility);
router.get('/intern/my-applications', protect, authorize('intern'), getInternApplications);
router.delete('/:id', protect, authorize('intern'), withdrawApplication);

// Employer routes
router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

// Common routes
router.get('/:id', protect, getApplicationById);

module.exports = router;