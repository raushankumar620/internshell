const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Hardcoded admin credentials - In production, store in database with hashed passwords
let adminCredentials = {
  username: 'admin',
  password: 'admin@123',
  email: 'admin@internshell.com',
  role: 'super_admin',
  lastLogin: null
};

// Admin login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check hardcoded credentials
    if (username !== adminCredentials.username || password !== adminCredentials.password) {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    adminCredentials.lastLogin = new Date();

    // Create admin token
    const token = jwt.sign(
      { isAdmin: true, username: adminCredentials.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        username: adminCredentials.username,
        email: adminCredentials.email,
        role: adminCredentials.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: 'Server error during admin login'
    });
  }
};

// Get dashboard overview
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments()
    ]);

    // Get recent users, jobs, and applications
    const recentUsers = await User.find()
      .select('name email userType createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Job.find()
      .populate('employer', 'name')
      .select('title company location salary status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = await Application.find()
      .populate('applicant', 'name email')
      .populate('job', 'title')
      .select('status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user type distribution
    const userTypeStats = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get job status distribution
    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get application status distribution
    const applicationStatusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      overview: {
        totalUsers,
        totalJobs,
        totalApplications
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      },
      statistics: {
        userTypes: userTypeStats,
        jobStatus: jobStatusStats,
        applicationStatus: applicationStatusStats
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const userType = req.query.userType || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (userType) {
      query.userType = userType;
    }

    const users = await User.find(query)
      .select('name email userType isActive createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
};

// Get all jobs with pagination
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate('employer', 'name email')
      .select('title company location salary status createdAt deadline')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      totalJobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      message: 'Failed to fetch jobs'
    });
  }
};

// Get all applications with pagination
const getApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const query = {};
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('applicant', 'name email')
      .populate('job', 'title company')
      .select('status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalApplications = await Application.countDocuments(query);

    res.status(200).json({
      applications,
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: page,
      totalApplications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      message: 'Failed to fetch applications'
    });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // User growth in last 30 days
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Job posting trends
    const jobTrends = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Application trends
    const applicationTrends = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      userGrowth,
      jobTrends,
      applicationTrends
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch statistics'
    });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('name email isActive');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      message: 'Failed to update user status'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Also delete related applications
    await Application.deleteMany({ applicant: id });

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Failed to delete user'
    });
  }
};

// Update job status
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('title company status');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    res.status(200).json({
      message: 'Job status updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      message: 'Failed to update job status'
    });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Also delete related applications
    await Application.deleteMany({ job: id });

    res.status(200).json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      message: 'Failed to delete job'
    });
  }
};

// Get admin profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      username: adminCredentials.username,
      email: adminCredentials.email,
      role: adminCredentials.role,
      lastLogin: adminCredentials.lastLogin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      message: 'Failed to get admin profile'
    });
  }
};

// Update admin profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        message: 'Username and email are required'
      });
    }

    // Update admin credentials
    adminCredentials.username = username;
    adminCredentials.email = email;

    res.status(200).json({
      message: 'Profile updated successfully',
      username: adminCredentials.username,
      email: adminCredentials.email,
      role: adminCredentials.role,
      lastLogin: adminCredentials.lastLogin
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      message: 'Failed to update admin profile'
    });
  }
};

// Change admin password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    // Verify current password
    if (currentPassword !== adminCredentials.password) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Update password
    adminCredentials.password = newPassword;

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      message: 'Failed to change password'
    });
  }
};

// Security Settings Management
let securitySettings = {
  twoFactorAuth: false,
  sessionTimeout: true,
  passwordPolicy: true,
  loginAttempts: true,
  emailNotifications: true,
  auditLogs: true
};

let auditLogs = [
  { timestamp: new Date(), user: 'admin@internshell.com', action: 'User login', ip: '192.168.1.1', status: 'success' },
  { timestamp: new Date(Date.now() - 5*60*1000), user: 'admin@internshell.com', action: 'Password changed', ip: '192.168.1.1', status: 'success' },
  { timestamp: new Date(Date.now() - 10*60*1000), user: 'unknown', action: 'Failed login attempt', ip: '10.0.0.1', status: 'failed' },
  { timestamp: new Date(Date.now() - 15*60*1000), user: 'admin@internshell.com', action: 'API key created', ip: '192.168.1.1', status: 'success' }
];

let apiKeys = [
  { id: 1, name: 'Mobile App', key: 'sk_live_51H7xYz...', permissions: ['read', 'write'], lastUsed: new Date(Date.now() - 24*60*60*1000), status: 'active' },
  { id: 2, name: 'Analytics Service', key: 'sk_live_62J8aC...', permissions: ['read'], lastUsed: new Date(Date.now() - 3*24*60*60*1000), status: 'active' },
  { id: 3, name: 'Backup Service', key: 'sk_live_73K9bD...', permissions: ['read'], lastUsed: new Date(Date.now() - 20*24*60*60*1000), status: 'inactive' }
];

// Get security settings
const getSecuritySettings = async (req, res) => {
  try {
    const activeApiKeys = apiKeys.filter(key => key.status === 'active').length;
    const securityAlerts = auditLogs.filter(log => log.status === 'failed').length;
    
    res.status(200).json({
      settings: securitySettings,
      securityScore: 95,
      securityAlerts,
      activeApiKeys
    });
  } catch (error) {
    console.error('Get security settings error:', error);
    res.status(500).json({
      message: 'Server error while fetching security settings'
    });
  }
};

// Update security settings
const updateSecuritySettings = async (req, res) => {
  try {
    const updatedSettings = req.body;
    securitySettings = { ...securitySettings, ...updatedSettings };
    
    // Log the action
    auditLogs.unshift({
      timestamp: new Date(),
      user: adminCredentials.email,
      action: 'Security settings updated',
      ip: req.ip || '127.0.0.1',
      status: 'success'
    });

    res.status(200).json({
      settings: securitySettings,
      message: 'Security settings updated successfully'
    });
  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({
      message: 'Server error while updating security settings'
    });
  }
};

// Get audit logs
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedLogs = auditLogs.slice(startIndex, endIndex);
    
    res.status(200).json({
      logs: paginatedLogs,
      total: auditLogs.length,
      page,
      totalPages: Math.ceil(auditLogs.length / limit)
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      message: 'Server error while fetching audit logs'
    });
  }
};

// Get API keys
const getApiKeys = async (req, res) => {
  try {
    res.status(200).json({
      apiKeys: apiKeys.map(key => ({
        ...key,
        key: key.key.substring(0, 12) + '...' // Hide full key for security
      }))
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      message: 'Server error while fetching API keys'
    });
  }
};

// Create new API key
const createApiKey = async (req, res) => {
  try {
    const { name, permissions = ['read'] } = req.body;
    
    const newKey = {
      id: apiKeys.length + 1,
      name,
      key: `sk_live_${Math.random().toString(36).substr(2, 15)}`,
      permissions,
      lastUsed: null,
      status: 'active'
    };
    
    apiKeys.push(newKey);
    
    // Log the action
    auditLogs.unshift({
      timestamp: new Date(),
      user: adminCredentials.email,
      action: `API key created: ${name}`,
      ip: req.ip || '127.0.0.1',
      status: 'success'
    });

    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        ...newKey,
        key: newKey.key.substring(0, 12) + '...'
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      message: 'Server error while creating API key'
    });
  }
};

// Delete API key
const deleteApiKey = async (req, res) => {
  try {
    const keyId = parseInt(req.params.id);
    const keyIndex = apiKeys.findIndex(key => key.id === keyId);
    
    if (keyIndex === -1) {
      return res.status(404).json({
        message: 'API key not found'
      });
    }
    
    const deletedKey = apiKeys[keyIndex];
    apiKeys.splice(keyIndex, 1);
    
    // Log the action
    auditLogs.unshift({
      timestamp: new Date(),
      user: adminCredentials.email,
      action: `API key deleted: ${deletedKey.name}`,
      ip: req.ip || '127.0.0.1',
      status: 'success'
    });

    res.status(200).json({
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      message: 'Server error while deleting API key'
    });
  }
};

module.exports = {
  login,
  getDashboard,
  getUsers,
  getJobs,
  getApplications,
  getStats,
  updateUserStatus,
  deleteUser,
  updateJobStatus,
  deleteJob,
  getProfile,
  updateProfile,
  changePassword,
  getSecuritySettings,
  updateSecuritySettings,
  getAuditLogs,
  getApiKeys,
  createApiKey,
  deleteApiKey
};