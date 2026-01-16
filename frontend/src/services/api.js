import axios from 'axios';

// Use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors with better authentication management
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear all auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('googleUser');
      
      // Dispatch event for components to update
      window.dispatchEvent(new Event('userRoleChanged'));
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      const authPages = ['/login', '/register', '/forgot-password', '/verify-email'];
      
      if (!authPages.some(page => currentPath.startsWith(page))) {
        window.location.href = '/login?message=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      console.log('📝 Attempting registration with API:', API_URL);
      
      // Add timeout to the request
      const response = await api.post('/auth/register', userData, {
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('✅ Registration successful:', response.data);
      
      if (response.data.success && response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Registration API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout
        }
      });
      
      // If it's a timeout or network error, throw a more descriptive error
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Registration request timed out. The server may be busy. Please try again.');
      }
      
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Google OAuth login/register
  googleAuth: async (tokenId) => {
    const response = await api.post('/auth/google', { tokenId });
    
    // Check if role selection is required
    if (response.data.success && response.data.data.roleSelectionRequired) {
      // Store user data temporarily for role selection
      localStorage.setItem('googleUser', JSON.stringify(response.data.data));
      return response.data;
    }
    
    // If role is already set, store token and user data
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  
  // Set user role after Google OAuth
  setRole: async (roleData) => {
    const response = await api.post('/auth/google/set-role', roleData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verify email
  verifyEmail: async (email, code) => {
    const response = await api.post('/auth/verify-email', { email, code });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Resend verification code
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Forgot password - request reset code
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset code
  verifyResetCode: async (email, code) => {
    const response = await api.post('/auth/verify-reset-code', { email, code });
    return response.data;
  },

  // Reset password with code
  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
  }
};

// Job API calls
export const jobAPI = {
  // Get alljobs (public)
  getAllinternship: async (params = {}) => {
    const response = await api.get('/internship', { params });
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/internship/${id}`);
    return response.data;
  },

  // Get valid locations list
  getValidLocations: async () => {
    const response = await api.get('/internship/locations/list');
    return response.data;
  },

  // Create new job (employer only)
  createJob: async (jobData) => {
    const response = await api.post('/internship', jobData);
    return response.data;
  },

  // Get employer'sjobs
  getEmployerinternship: async (params = {}) => {
    const response = await api.get('/internship/employer/my-internship', { params });
    return response.data;
  },

  // Get employer analytics
  getAnalytics: async () => {
    const response = await api.get('/internship/analytics/stats');
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/internship/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/internship/${id}`);
    return response.data;
  }
};

// Application API calls
export const applicationAPI = {
  // Apply for a job (intern)
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get intern's applications
  getInternApplications: async (params = {}) => {
    const response = await api.get('/applications/intern/my-applications', { params });
    return response.data;
  },

  // Get employer's applications
  getEmployerApplications: async (params = {}) => {
    const response = await api.get('/applications/employer', { params });
    return response.data;
  },

  // Get applications for specific job
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Update application status (employer)
  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  },

  // Withdraw application (intern)
  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Check job compatibility before applying
  checkJobCompatibility: async (jobId) => {
    const response = await api.post('/applications/check-compatibility', { jobId });
    return response.data;
  }
};

// Message API calls
export const messageAPI = {
  // Send a message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get messages (inbox/sent)
  getMessages: async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // Get conversation with specific user
  getConversation: async (userId, params = {}) => {
    const response = await api.get(`/messages/conversation/${userId}`, { params });
    return response.data;
  },

  // Mark message as read
  markAsRead: async (id) => {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  },

  // Delete message
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  }
};

// Profile API calls
export const profileAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data.data }));
    }
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/profile/password', passwordData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/profile/${id}`);
    return response.data;
  },

  // Save resume data
  saveResumeData: async (resumeData) => {
    const response = await api.put('/profile/resume', resumeData);
    return response.data;
  },

  // Get resume data
  getResumeData: async () => {
    const response = await api.get('/profile/resume');
    return response.data;
  },

  // Get company completeness
  getCompanyCompleteness: async () => {
    const response = await api.get('/profile/company-completeness');
    return response.data;
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get intern dashboard stats
  getInternStats: async () => {
    const response = await api.get('/dashboard/intern/stats');
    return response.data;
  },

  // Get employer dashboard stats
  getEmployerStats: async () => {
    const response = await api.get('/dashboard/employer/stats');
    return response.data;
  },

  // Get activity stats
  getActivityStats: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  }
};

// ATS API calls
export const atsAPI = {
  // Check resume for ATS compatibility
  checkResume: async (formData) => {
    const response = await api.post('/ats/check', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Contact API calls
export const contactAPI = {
  // Send contact form message
  sendContactMessage: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact messages (admin only)
  getContactMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  }
};

// AI API calls
export const aiAPI = {
  // Get comprehensive job suggestions based on job title
  getJobSuggestions: async (jobTitle) => {
    const response = await api.post('/ai/job-suggestions', { jobTitle });
    return response.data;
  },

  // Enhance job description with AI
  enhanceDescription: async (description, jobTitle, company) => {
    const response = await api.post('/ai/enhance-description', {
      description,
      jobTitle,
      company
    });
    return response.data;
  },

  // Get skill suggestions
  suggestSkills: async (jobTitle, jobDescription) => {
    const response = await api.post('/ai/suggest-skills', {
      jobTitle,
      jobDescription
    });
    return response.data;
  },

  // Generate requirements based on job details
  generateRequirements: async (jobTitle, experienceLevel, skills) => {
    const response = await api.post('/ai/generate-requirements', {
      jobTitle,
      experienceLevel,
      skills
    });
    return response.data;
  },

  // Analyze job posting for completeness and suggestions
  analyzePosting: async (jobData) => {
    const response = await api.post('/ai/analyze-posting', { jobData });
    return response.data;
  },

  // Generate interview questions
  generateInterviewQuestions: async (jobTitle, skills, experienceLevel) => {
    const response = await api.post('/ai/interview-questions', {
      jobTitle,
      skills,
      experienceLevel
    });
    return response.data;
  },

  // Get smart suggestions while typing (real-time)
  getSmartSuggestions: async (field, value, context) => {
    const response = await api.post('/ai/smart-suggestions', {
      field,
      value,
      context
    });
    return response.data;
  }
};

export default api;