import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Box,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { profileAPI } from 'services/api';

// assets
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockIcon from '@mui/icons-material/Lock';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| MY PROFILE ||============================== //

const MyProfile = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [companyCompleteness, setCompanyCompleteness] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    gstNumber: '',
    companyRegistrationNumber: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyPincode: '',
    companyDocuments: []
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
    // Only fetch company completeness for employers
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'employer') {
      fetchCompanyCompleteness();
    }
  }, []);

  const fetchCompanyCompleteness = async () => {
    try {
      const response = await profileAPI.getCompanyCompleteness();
      if (response.success) {
        setCompanyCompleteness(response.data);
      }
    } catch (err) {
      console.error('Error fetching company completeness:', err);
      // Don't set error state here as this is not critical for the component to function
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getProfile();
      if (response.success) {
        const user = response.data;
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || '',
          companyName: user.companyName || '',
          companyWebsite: user.companyWebsite || '',
          companyDescription: user.companyDescription || '',
          gstNumber: user.gstNumber || '',
          companyRegistrationNumber: user.companyRegistrationNumber || '',
          companyAddress: user.companyAddress || '',
          companyCity: user.companyCity || '',
          companyState: user.companyState || '',
          companyPincode: user.companyPincode || '',
          companyDocuments: user.companyDocuments || []
        });
        setImagePreview(user.avatar || null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert GST number to uppercase
    if (name === 'gstNumber') {
      processedValue = value.toUpperCase();
    }
    
    setProfileData({
      ...profileData,
      [name]: processedValue
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData({
          ...profileData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    
    if (profileData.companyDocuments.length + files.length > maxFiles) {
      setError(`You can only upload maximum ${maxFiles} documents`);
      return;
    }
    
    const validFiles = [];
    
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 10MB`);
        continue;
      }
      
      // Check file type (PDF, DOC, DOCX, JPG, PNG)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} is not supported. Please upload PDF, DOC, DOCX, JPG, or PNG files only`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    // Convert files to metadata for storage (excluding large base64 data)
    validFiles.forEach(file => {
      // Only store metadata, not the actual file data
      const newDocument = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        // Store a small preview for validation purposes
        hasFile: true
      };
      
      setProfileData(prev => ({
        ...prev,
        companyDocuments: [...prev.companyDocuments, newDocument]
      }));
    });
  };

  const removeDocument = (documentId) => {
    setProfileData(prev => ({
      ...prev,
      companyDocuments: prev.companyDocuments.filter(doc => doc.id !== documentId)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateCompanyDetails = () => {
    const requiredFields = [
      'companyName',
      'gstNumber',
      'companyRegistrationNumber',
      'companyAddress',
      'companyCity',
      'companyState',
      'companyPincode'
    ];
    
    const missingFields = [];
    requiredFields.forEach(field => {
      if (!profileData[field] || profileData[field].trim() === '') {
        missingFields.push(field);
      }
    });
    
    if (profileData.companyDocuments.length === 0) {
      missingFields.push('companyDocuments');
    }
    
    return missingFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate company details if on company tab
    if (tabValue === 1) {
      const missingFields = validateCompanyDetails();
      if (missingFields.length > 0) {
        const fieldNames = {
          companyName: 'Company Name',
          gstNumber: 'GST Number',
          companyRegistrationNumber: 'Company Registration Number',
          companyAddress: 'Company Address',
          companyCity: 'City',
          companyState: 'State',
          companyPincode: 'Pincode',
          companyDocuments: 'Company Documents (at least one document required)'
        };
        
        const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
        setError(`Please fill in all required fields: ${missingFieldNames}`);
        setSaving(false);
        return;
      }
      
      // Validate GST number format (basic validation)
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (profileData.gstNumber && !gstRegex.test(profileData.gstNumber.toUpperCase())) {
        setError('Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)');
        setSaving(false);
        return;
      }

      // Validate pincode format
      const pincodeRegex = /^[0-9]{6}$/;
      if (profileData.companyPincode && !pincodeRegex.test(profileData.companyPincode)) {
        setError('Please enter a valid 6-digit pincode');
        setSaving(false);
        return;
      }
    }

    try {
      const response = await profileAPI.updateProfile(profileData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        // Update the image preview after successful save
        if (response.data && response.data.avatar) {
          setImagePreview(response.data.avatar);
        }
        // Refresh profile to get latest data
        await fetchProfile();
        
        // Only refresh completeness for employers
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'employer' && tabValue === 1) {
          await fetchCompanyCompleteness();
        }
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await profileAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setSuccess('Password changed successfully!');
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0];
  };

  if (loading) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                <CircularProgress />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card sx={{
          boxShadow: { xs: 'none', md: 2 },
          border: { xs: 'none', md: '1px solid' },
          borderColor: { xs: 'transparent', md: 'divider' },
          borderRadius: { xs: 0, md: 1 },
          m: 0,
          width: '100%'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box 
              display="flex" 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              justifyContent="space-between" 
              mb={3}
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 2, sm: 0 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>My Profile</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setPasswordDialogOpen(true)}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  fontSize: { xs: '0.85rem', sm: '0.875rem' }
                }}
              >
                Change Password
              </Button>
            </Box>

            {/* Success/Error Messages */}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Profile Header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={{ xs: 3, md: 4 }}>
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                {/* Circular Progress Ring for Employers */}
                {companyCompleteness && (
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={{ xs: 116, sm: 136 }}
                    thickness={3}
                    sx={{
                      position: 'absolute',
                      color: 'grey.300',
                      zIndex: 1
                    }}
                  />
                )}
                {companyCompleteness && (
                  <CircularProgress
                    variant="determinate"
                    value={companyCompleteness.completionPercentage}
                    size={{ xs: 116, sm: 136 }}
                    thickness={3}
                    sx={{
                      position: 'absolute',
                      color: companyCompleteness.isComplete 
                        ? 'success.main' 
                        : companyCompleteness.completionPercentage > 50 
                          ? 'warning.main' 
                          : 'error.main',
                      zIndex: 2,
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      }
                    }}
                  />
                )}
                
                {/* Completion Percentage Badge */}
                {companyCompleteness && (
                  <Chip
                    label={`${companyCompleteness.completionPercentage}%`}
                    size="small"
                    color={companyCompleteness.isComplete ? 'success' : 'warning'}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      zIndex: 3,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                )}
                
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    zIndex: 3,
                    border: companyCompleteness ? '3px solid white' : 'none',
                    boxShadow: companyCompleteness ? 2 : 0
                  }}
                >
                  {!imagePreview && getInitials(profileData.name)}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: companyCompleteness ? 8 : 0,
                      right: companyCompleteness ? 8 : 0,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      zIndex: 4,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
                    }}
                  >
                    <CameraAltIcon fontSize="small" />
                  </IconButton>
                </label>
              </Box>
              {profileData.companyName && (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <BusinessIcon fontSize="small" color="primary" />
                  <Typography variant="h4" color="primary" sx={{ fontSize: { xs: '1.15rem', sm: '1.25rem', md: '1.5rem' }, fontWeight: 600 }}>
                    {profileData.companyName}
                  </Typography>
                </Box>
              )}
              <Typography variant="h5" sx={{ mt: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                {profileData.name || 'User Name'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                {profileData.email}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Tabs */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: 160 },
                  flex: { xs: 1, sm: 'initial' }
                }
              }}
              variant="standard"
              scrollButtons="auto"
            >
              <Tab label="Personal Information" />
              <Tab label="Company Details" />
            </Tabs>

            {/* Tab Content */}
            <form onSubmit={handleSubmit} className="profile-form">
              {tabValue === 0 && (
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={gridSpacing}>
                  {/* Company Profile Completeness - Only show if not complete */}
                  {companyCompleteness && !companyCompleteness.isComplete && (
                    <Grid item xs={12}>
                      <Card sx={{ mb: 2, bgcolor: 'warning.light', border: '1px solid', borderColor: 'warning.main' }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Company Profile Completion
                            </Typography>
                            <Chip 
                              label={`${companyCompleteness.completionPercentage}%`} 
                              color="warning"
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={companyCompleteness.completionPercentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 5,
                              bgcolor: 'background.default',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                bgcolor: 'warning.main'
                              }
                            }} 
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Please complete {companyCompleteness.missingFields.length} more field(s) to activate your company profile.
                          </Typography>
                          {companyCompleteness.missingFields.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="error" display="block">
                                Missing: {companyCompleteness.requiredFields
                                  .filter(rf => companyCompleteness.missingFields.includes(rf.field))
                                  .map(rf => rf.label)
                                  .join(', ')
                                }
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Basic Company Information */}
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Basic Company Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      name="companyName"
                      value={profileData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Tech Corp Inc."
                      required
                      error={!profileData.companyName}
                      helperText={!profileData.companyName ? "Company name is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Website"
                      name="companyWebsite"
                      value={profileData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Company Description"
                      name="companyDescription"
                      value={profileData.companyDescription}
                      onChange={handleChange}
                      placeholder="Tell us about your company, its mission, and what makes it unique..."
                    />
                  </Grid>

                  {/* Legal & Registration Details */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Legal & Registration Details
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="GST Number *"
                      name="gstNumber"
                      value={profileData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      required
                      error={!profileData.gstNumber}
                      helperText={!profileData.gstNumber ? "GST number is required" : "15-digit GST identification number"}
                      inputProps={{ 
                        style: { textTransform: 'uppercase' },
                        maxLength: 15
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Registration Number *"
                      name="companyRegistrationNumber"
                      value={profileData.companyRegistrationNumber}
                      onChange={handleChange}
                      placeholder="e.g. CIN: L72200DL2015PTC123456"
                      required
                      error={!profileData.companyRegistrationNumber}
                      helperText={!profileData.companyRegistrationNumber ? "Registration number is required" : "CIN, LLP ID, or Partnership registration number"}
                    />
                  </Grid>

                  {/* Company Address */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Company Address
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Address *"
                      name="companyAddress"
                      value={profileData.companyAddress}
                      onChange={handleChange}
                      placeholder="Street address, building name, floor/unit number"
                      required
                      multiline
                      rows={2}
                      error={!profileData.companyAddress}
                      helperText={!profileData.companyAddress ? "Company address is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City *"
                      name="companyCity"
                      value={profileData.companyCity}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      required
                      error={!profileData.companyCity}
                      helperText={!profileData.companyCity ? "City is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="State *"
                      name="companyState"
                      value={profileData.companyState}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      required
                      error={!profileData.companyState}
                      helperText={!profileData.companyState ? "State is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Pincode *"
                      name="companyPincode"
                      value={profileData.companyPincode}
                      onChange={handleChange}
                      placeholder="400001"
                      required
                      error={!profileData.companyPincode}
                      helperText={!profileData.companyPincode ? "Pincode is required" : "6-digit postal code"}
                      inputProps={{ 
                        maxLength: 6,
                        pattern: '[0-9]{6}'
                      }}
                    />
                  </Grid>

                  {/* Document Upload Section */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Company Documents *
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Please upload at least one company verification document (Certificate of Incorporation, GST Certificate, PAN Card, etc.)
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        border: '2px dashed',
                        borderColor: profileData.companyDocuments.length === 0 ? 'error.main' : 'primary.main',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: profileData.companyDocuments.length === 0 ? 'error.light' : 'primary.light',
                        opacity: profileData.companyDocuments.length === 0 ? 0.1 : 0.05,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          opacity: 0.1
                        }
                      }}
                    >
                      <input
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        id="company-documents-upload"
                        type="file"
                        multiple
                        onChange={handleDocumentUpload}
                      />
                      <label htmlFor="company-documents-upload" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
                        <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Upload Company Documents
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Drag and drop files here or click to browse
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file, up to 5 files)
                        </Typography>
                        <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          Note: Document metadata is stored for profile completion validation
                        </Typography>
                      </label>
                    </Box>
                    
                    {profileData.companyDocuments.length === 0 && (
                      <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                        At least one company document is required
                      </Typography>
                    )}
                  </Grid>
                  
                  {/* Display uploaded documents */}
                  {profileData.companyDocuments.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Uploaded Documents ({profileData.companyDocuments.length}/5)
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {profileData.companyDocuments.map((doc) => (
                          <Box
                            key={doc.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              backgroundColor: 'background.paper'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <AttachFileIcon color="primary" />
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {doc.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatFileSize(doc.size)}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              onClick={() => removeDocument(doc.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}

              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={fetchProfile}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  helperText="Minimum 6 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setPasswordDialogOpen(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setError(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
};

export default MyProfile;
