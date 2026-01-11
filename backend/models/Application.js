const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      trim: true
    },
    resume: {
      type: String,
      required: true
    },
    resumeType: {
      type: String,
      enum: ['existing', 'uploaded'],
      default: 'existing'
    },
    selectedTemplate: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    matchDetails: {
      experienceMatch: {
        type: Number,
        default: 0
      },
      skillsMatch: {
        type: Number,
        default: 0
      },
      educationMatch: {
        type: Number,
        default: 0
      },
      locationMatch: {
        type: Boolean,
        default: false
      }
    },
    isPoorMatch: {
      type: Boolean,
      default: false
    },
    appliedAnyway: {
      type: Boolean,
      default: false
    },
    mismatchReasons: [{
      type: String,
      category: String, // 'experience', 'skills', 'education', 'location'
      severity: String // 'low', 'medium', 'high'
    }],
    appliedDate: {
      type: Date,
      default: Date.now
    },
    reviewedDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
applicationSchema.index({ job: 1, applicant: 1 });
applicationSchema.index({ employer: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
