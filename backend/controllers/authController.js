const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to validate employer email domain
const isValidEmployerEmail = (email) => {
  const emailLower = email.toLowerCase();
  
  // List of invalid domains (personal email providers)
  const invalidDomains = [
    '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', 
    '@live.com', '@icloud.com', '@protonmail.com', '@aol.com'
  ];
  
  // Check if email uses any invalid personal domains
  const isPersonalEmail = invalidDomains.some(domain => emailLower.includes(domain));
  
  if (isPersonalEmail) {
    return false;
  }
  
  // Valid corporate domains (must end with these)
  const validDomains = ['.com', '.in', '.org', '.net', '.co.in', '.edu', '.gov'];
  
  // Check if email ends with any valid corporate domain
  return validDomains.some(domain => emailLower.endsWith(domain));
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, companyName } = req.body;

    // Validate employer email domain
    if (role === 'employer' && !isValidEmployerEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Employers must use a corporate email address with domains like .com, .in, .org, .net, .co.in, .edu, or .gov'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but email not verified, resend verification
      if (!userExists.isEmailVerified) {
        const verificationToken = generateVerificationCode();
        userExists.emailVerificationToken = verificationToken;
        userExists.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await userExists.save({ validateBeforeSave: false });

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}`;
        await sendVerificationEmail({
          email,
          name: userExists.name,
          verificationToken,
          verificationUrl
        });

        return res.status(200).json({
          success: true,
          message: 'Verification code resent to your email',
          emailVerificationRequired: true,
          email
        });
      }
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate verification code
    const verificationToken = generateVerificationCode();

    // Create user
    const userData = {
      name,
      email,
      password,
      role: role || 'intern',
      phone,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    // Add company name if role is employer
    if (role === 'employer' && companyName) {
      userData.companyName = companyName;
    }

    const user = await User.create(userData);

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}`;
    console.log('🔐 Sending verification email to:', email);
    console.log('🔐 Verification URL:', verificationUrl);
    console.log('🔐 Verification Token:', verificationToken);
    
    const emailResult = await sendVerificationEmail({
      email,
      name,
      verificationToken,
      verificationUrl
    });
    
    console.log('🔐 Email send result:', emailResult);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      emailVerificationRequired: true,
      email: user.email
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationToken: code,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = await generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        token
      }
    });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const verificationToken = generateVerificationCode();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}`;
    await sendVerificationEmail({
      email,
      name: user.name,
      verificationToken,
      verificationUrl
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification code',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for email:', email);

    // Validate email and password
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and get password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    console.log('✅ User found:', { email: user.email, role: user.role, isEmailVerified: user.isEmailVerified });

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('❌ Password mismatch for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    console.log('✅ Password matched');

    // Additional validation for employers
    if (user.role === 'employer' && !isValidEmployerEmail(user.email)) {
      console.log('❌ Employer email domain validation failed');
      return res.status(403).json({
        success: false,
        message: 'Employer accounts must use corporate email addresses with domains like .com, .in, .org, .net, .co.in, .edu, or .gov'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Resend verification code
      const verificationToken = generateVerificationCode();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}`;
      await sendVerificationEmail({
        email,
        name: user.name,
        verificationToken,
        verificationUrl
      });

      return res.status(403).json({
        success: false,
        message: 'Please verify your email first. A new verification code has been sent.',
        emailVerificationRequired: true,
        email: user.email
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = await generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        avatar: user.avatar,
        token
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordMatch = await user.matchPassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// @desc    Forgot password - Send reset code
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset code has been sent'
      });
    }

    // Generate reset token (6 digit code)
    const resetToken = generateVerificationCode();
    
    // Set token and expiry on user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?email=${encodeURIComponent(email)}`;
    
    const emailResult = await sendPasswordResetEmail({
      email,
      name: user.name,
      resetToken,
      resetUrl
    });

    console.log('📧 Password reset email result:', emailResult);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset code has been sent'
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request',
      error: error.message
    });
  }
};

// @desc    Verify reset code
// @route   POST /api/auth/verify-reset-code
// @access  Public
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and code'
      });
    }

    const user = await User.findOne({
      email,
      passwordResetToken: code,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Code verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Verify Reset Code Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying reset code',
      error: error.message
    });
  }
};

// @desc    Reset password using code
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, code and new password'
      });
    }

    const user = await User.findOne({
      email,
      passwordResetToken: code,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};