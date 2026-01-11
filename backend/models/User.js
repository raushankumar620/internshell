const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: {
      type: String,
      enum: ['intern', 'employer', 'admin', 'pending'],
      default: 'pending'
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    linkedIn: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String
    },
    emailVerificationExpires: {
      type: Date
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Intern specific fields
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        current: Boolean
      }
    ],
    skills: [String],
    resume: {
      type: String,
      default: ''
    },
    selfIntroVideo: {
      type: String,
      default: ''
    },
    resumeData: {
      formData: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        summary: String,
        profileImage: String,
        linkedIn: String,
        github: String,
        portfolio: String
      },
      skills: [String],
      educations: [{
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        current: Boolean
      }],
      experiences: [{
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String
      }],
      projects: [{
        title: String,
        description: String,
        technologies: [String],
        link: String
      }],
      selectedTemplate: {
        type: Number,
        default: 1
      }
    },
    // Employer specific fields
    companyName: {
      type: String,
      trim: true
    },
    companyWebsite: {
      type: String,
      trim: true
    },
    companyDescription: {
      type: String,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: 'Please provide a valid GST number'
      }
    },
    companyRegistrationNumber: {
      type: String,
      trim: true
    },
    companyAddress: {
      type: String,
      trim: true
    },
    companyCity: {
      type: String,
      trim: true
    },
    companyState: {
      type: String,
      trim: true
    },
    companyPincode: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^[0-9]{6}$/.test(v);
        },
        message: 'Please provide a valid 6-digit pincode'
      }
    },
    companyDocuments: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's provided and modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);