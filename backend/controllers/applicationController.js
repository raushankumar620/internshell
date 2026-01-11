const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');
const { emitAnalyticsUpdate } = require('../utils/socket'); // Import emit function from utils
const { createNotification } = require('./notificationController');
const { matchCandidateToJob, generateImprovementSuggestions, generateMismatchReasons } = require('../utils/jobMatcher');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Intern)
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume, resumeType, selectedTemplate } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Get candidate profile for matching
    const candidate = await User.findById(req.user.id);
    
    // Perform job profile matching
    const matchResult = matchCandidateToJob(candidate, job);
    
    // Check if candidate meets minimum requirements (configurable threshold)
    // This could be made configurable per job in the future
    const MINIMUM_MATCH_THRESHOLD = job.minimumMatchScore || 40; // 40% minimum match required by default
    
    // Note: We no longer automatically reject applications
    // Instead, we allow \"Apply Anyway\" but track the poor match
    const isPoorMatch = matchResult.overallScore < MINIMUM_MATCH_THRESHOLD;
    
    // Generate detailed mismatch reasons and suggestions
    const mismatchReasons = isPoorMatch ? generateMismatchReasons(matchResult) : [];
    const suggestions = isPoorMatch ? generateImprovementSuggestions(matchResult) : [];

    // Create application with match score
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      employer: job.employer,
      coverLetter,
      resume: resumeData,
      resumeType: resumeType || 'existing',
      selectedTemplate: selectedTemplate || 1,
      matchScore: matchResult.overallScore,
      matchDetails: {
        experienceMatch: matchResult.experienceMatch.score,
        skillsMatch: matchResult.skillsMatch.score,
        educationMatch: matchResult.educationMatch.score,
        locationMatch: matchResult.locationMatch.match
      },
      isPoorMatch: isPoorMatch,
      appliedAnyway: isPoorMatch, // Flag to indicate if candidate applied despite poor match
      mismatchReasons: mismatchReasons.map(reason => ({
        type: reason.reason,
        category: reason.category,
        severity: reason.severity
      }))
    });

    // Add applicant to job
    job.applicants.push(req.user.id);
    await job.save();

    // Create notification for employer
    await createNotification({
      recipient: job.employer,
      sender: req.user.id,
      type: 'new_application',
      title: 'New Application Received',
      message: `${req.user.name} applied for ${job.title}`,
      link: `/employer/applicants/${application._id}`,
      relatedJob: jobId,
      relatedApplication: application._id
    });

    // Emit real-time update to employer
    emitAnalyticsUpdate(job.employer.toString(), {
      type: 'new_application',
      jobId: jobId,
      applicantId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
      matchResult: {
        score: matchResult.overallScore,
        recommendation: matchResult.recommendation,
        details: {
          experienceMatch: matchResult.experienceMatch,
          skillsMatch: matchResult.skillsMatch,
          educationMatch: matchResult.educationMatch,
          locationMatch: matchResult.locationMatch
        }
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
};

// @desc    Check job compatibility before applying
// @route   POST /api/applications/check-compatibility
// @access  Private (Intern)
exports.checkJobCompatibility = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Get candidate profile for matching
    const candidate = await User.findById(req.user.id);
    
    // Perform job profile matching
    const matchResult = matchCandidateToJob(candidate, job);
    
    // Generate improvement suggestions if score is low
    const suggestions = matchResult.overallScore < 70 ? 
      generateImprovementSuggestions(matchResult) : [];
    
    // Generate detailed mismatch reasons if not recommended
    const mismatchReasons = !matchResult.isMatch ? 
      generateMismatchReasons(matchResult) : [];

    res.json({
      success: true,
      data: {
        jobTitle: job.title,
        company: job.company,
        overallScore: matchResult.overallScore,
        isRecommended: matchResult.isMatch,
        recommendation: matchResult.recommendation,
        feedback: matchResult.feedback,
        suggestions: suggestions,
        mismatchReasons: mismatchReasons,
        detailedMatch: {
          experience: {
            score: matchResult.experienceMatch.score,
            required: matchResult.experienceMatch.required,
            candidate: matchResult.experienceMatch.candidate,
            match: matchResult.experienceMatch.match
          },
          skills: {
            score: matchResult.skillsMatch.score,
            matched: matchResult.skillsMatch.matched,
            missing: matchResult.skillsMatch.missing,
            totalRequired: job.skills ? job.skills.length : 0
          },
          education: {
            score: matchResult.educationMatch.score,
            hasRequirement: matchResult.educationMatch.hasRequirement
          },
          location: {
            match: matchResult.locationMatch.match,
            required: matchResult.locationMatch.required,
            candidate: matchResult.locationMatch.candidate
          }
        }
      }
    });
  } catch (error) {
    console.error('Check job compatibility error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check job compatibility'
    });
  }
};

// @desc    Get intern's applications
// @route   GET /api/applications/intern/my-applications
// @access  Private (Intern)
exports.getInternApplications = async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { applicant: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const applications = await Application.find(query)
      .populate('job', 'title company location jobType stipend')
      .populate('employer', 'name companyName')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get intern applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// @desc    Get all applications for employer
// @route   GET /api/applications/employer
// @access  Private (Employer)
exports.getEmployerApplications = async (req, res) => {
  try {
    const { 
      status, 
      jobId, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { employer: req.user.id };

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const applications = await Application.find(query)
      .populate('applicant', 'name email phone skills education resume selfIntroVideo resumeData avatar bio location linkedIn github portfolio')
      .populate('job', 'title company location jobType stipend')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify job belongs to employer
    const job = await Job.findOne({ _id: jobId, employer: req.user.id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('applicant', 'name email phone skills education resume resumeData selfIntroVideo avatar bio location linkedIn github portfolio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get status counts
    const statusCounts = await Application.aggregate([
      { $match: { job: mongoose.Types.ObjectId(jobId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: applications,
      statusCounts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone skills education resume resumeData selfIntroVideo avatar bio location linkedIn github portfolio')
      .populate('job', 'title company description requirements location jobType stipend')
      .populate('employer', 'name email companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (
      application.employer.toString() !== req.user.id &&
      application.applicant._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes, rejectionReason } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if employer owns this application
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application.status = status;
    if (notes) application.notes = notes;
    if (rejectionReason && status === 'rejected') {
      application.rejectionReason = rejectionReason;
    }
    if (status !== 'pending') {
      application.reviewedDate = Date.now();
    }
    await application.save();

    // Create notification for applicant
    let notificationTitle = 'Application Status Updated';
    let notificationMessage = `Your application for ${application.job.title} has been ${status}`;
    let notificationType = 'application_status';

    if (status === 'accepted') {
      notificationType = 'application_accepted';
      notificationTitle = 'Application Accepted! 🎉';
      notificationMessage = `Congratulations! Your application for ${application.job.title} has been accepted`;
    } else if (status === 'rejected') {
      notificationType = 'application_rejected';
      notificationTitle = 'Application Update';
      notificationMessage = rejectionReason 
        ? `Your application for ${application.job.title} has been reviewed. Reason: ${rejectionReason}`
        : `Your application for ${application.job.title} has been reviewed`;
    } else if (status === 'shortlisted') {
      notificationType = 'application_shortlisted';
      notificationTitle = 'You\'re Shortlisted! 🌟';
      notificationMessage = `Great news! You\'ve been shortlisted for ${application.job.title}`;
    }

    await createNotification({
      recipient: application.applicant,
      sender: req.user.id,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      link: `/intern/applied-internship`,
      relatedJob: application.job._id,
      relatedApplication: application._id
    });

    // Emit real-time update to employer
    emitAnalyticsUpdate(req.user.id.toString(), {
      type: 'application_status_update',
      applicationId: req.params.id,
      jobId: application.job._id,
      status: status
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update application status'
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Intern)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Remove applicant from job
    const job = await Job.findById(application.job);
    if (job) {
      job.applicants = job.applicants.filter(
        (applicantId) => applicantId.toString() !== req.user.id
      );
      await job.save();
    }

    await application.deleteOne();

    // Emit real-time update to employer
    emitAnalyticsUpdate(application.employer.toString(), {
      type: 'application_withdrawn',
      applicationId: req.params.id,
      jobId: application.job,
      applicantId: req.user.id
    });

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application'
    });
  }
};