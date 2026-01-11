import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { applicationAPI } from '../../../services/api';

// Resume Templates
import Template1 from '../../Intern/ResumeBuilder/templates/Template1';
import Template2 from '../../Intern/ResumeBuilder/templates/Template2';
import Template3 from '../../Intern/ResumeBuilder/templates/Template3';
import Template4 from '../../Intern/ResumeBuilder/templates/Template4';
import Template5 from '../../Intern/ResumeBuilder/templates/Template5';



// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

// ==============================|| APPLICANTS ||============================== //

const Applicants = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Rejection dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingApplication, setRejectingApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Video dialog state
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideoApplication, setSelectedVideoApplication] = useState(null);

  // Predefined rejection reasons
  const rejectionReasons = [
    'Not enough experience',
    'Skills do not match requirements',
    'Position already filled',
    'Salary expectations too high',
    'Location constraints',
    'Better qualified candidates available',
    'Incomplete application',
    'Other'
  ];

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const jobId = params.get('jobId');
    
    // Handle status filtering
    if (status) {
      switch (status) {
        case 'shortlisted':
          setActiveTab(2);
          break;
        case 'accepted':
          setActiveTab(4);
          break;
        default:
          setActiveTab(0);
          break;
      }
    } else {
      setActiveTab(0);
    }
  }, [location.search]);

  // Filter applications based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 0: // All
        setFilteredApplications(applications);
        break;
      case 1: // Pending
        setFilteredApplications(applications.filter(app => app.status === 'pending'));
        break;
      case 2: // Shortlisted
        setFilteredApplications(applications.filter(app => app.status === 'shortlisted'));
        break;
      case 3: // Rejected
        setFilteredApplications(applications.filter(app => app.status === 'rejected'));
        break;
      case 4: // Accepted/Hired
        setFilteredApplications(applications.filter(app => app.status === 'accepted'));
        break;
      default:
        setFilteredApplications(applications);
    }
  }, [activeTab, applications]);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await applicationAPI.getEmployerApplications();
        if (response.success) {
          setApplications(response.data);
        } else {
          setError(response.message || 'Failed to fetch applications');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'shortlisted':
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'reviewed':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewResume = (application) => {
    setSelectedApplication(application);
    setResumeDialogOpen(true);
  };

  const handleCloseResumeDialog = () => {
    setResumeDialogOpen(false);
    setSelectedApplication(null);
  };

  // Video dialog handlers
  const handleOpenVideoDialog = (application) => {
    setSelectedVideoApplication(application);
    setVideoDialogOpen(true);
  };

  const handleCloseVideoDialog = () => {
    setVideoDialogOpen(false);
    setSelectedVideoApplication(null);
  };

  const handleMessageClick = (application) => {
    // Navigate to the messages page with the applicant's ID as a parameter
    navigate('/app/employer/messages', { 
      state: { 
        recipientId: application.applicant._id,
        jobId: application.job?._id
      } 
    });
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(applicationId, { status: newStatus });
      if (response.success) {
        // Update the application status in state
        setApplications(prev => prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
      } else {
        setError(response.message || 'Failed to update application status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating application status');
    }
  };

  // Open rejection dialog
  const handleOpenRejectDialog = (application) => {
    setRejectingApplication(application);
    setRejectionReason('');
    setCustomReason('');
    setRejectDialogOpen(true);
  };

  // Close rejection dialog
  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectingApplication(null);
    setRejectionReason('');
    setCustomReason('');
  };

  // Handle rejection with reason
  const handleRejectWithReason = async () => {
    if (!rejectingApplication) return;
    
    const finalReason = rejectionReason === 'Other' ? customReason : rejectionReason;
    
    if (!finalReason.trim()) {
      setError('Please select or enter a rejection reason');
      return;
    }

    setIsRejecting(true);
    try {
      const response = await applicationAPI.updateApplicationStatus(rejectingApplication._id, { 
        status: 'rejected',
        rejectionReason: finalReason
      });
      
      if (response.success) {
        // Update the application status in state
        setApplications(prev => prev.map(app => 
          app._id === rejectingApplication._id 
            ? { ...app, status: 'rejected', rejectionReason: finalReason } 
            : app
        ));
        handleCloseRejectDialog();
      } else {
        setError(response.message || 'Failed to reject application');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error rejecting application');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleAltIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3">Job Applicants</Typography>
              </Box>
              <Typography variant="h4" color="textSecondary">
                Total: {filteredApplications.length} Applicants
              </Typography>
            </Box>
            
            {/* Tabs for filtering */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab label="All" />
                <Tab label="Pending" />
                <Tab label="Shortlisted" />
                <Tab label="Rejected" />
                <Tab label="Hired" />
              </Tabs>
            </Box>
            
            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {/* Loading Indicator */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Applied For</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((application) => (
                        <TableRow key={application._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                {application.applicant?.name?.charAt(0) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {application.applicant?.name || 'Unknown Applicant'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {application.applicant?.email || 'No email'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{application.job?.title || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell>
                            {application.applicant?.education && application.applicant.education.length > 0 
                              ? `${application.applicant.education[0].degree || 'N/A'}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(application.createdAt).toLocaleDateString('en-IN', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={application.status.charAt(0).toUpperCase() + application.status.slice(1)} 
                              color={getStatusColor(application.status)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                              <IconButton 
                                size="medium" 
                                title="View Resume"
                                onClick={() => handleViewResume(application)}
                                sx={{ 
                                  bgcolor: '#e3f2fd',
                                  color: '#1976d2',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: '#bbdefb',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <DescriptionIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="medium" 
                                title={application.applicant?.selfIntroVideo ? "Watch Self Introduction" : "No Video Available"}
                                onClick={() => application.applicant?.selfIntroVideo && handleOpenVideoDialog(application)}
                                disabled={!application.applicant?.selfIntroVideo}
                                sx={{ 
                                  bgcolor: application.applicant?.selfIntroVideo ? '#e8f5e9' : '#f5f5f5',
                                  color: application.applicant?.selfIntroVideo ? '#2e7d32' : '#9e9e9e',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: application.applicant?.selfIntroVideo ? '#c8e6c9' : '#f5f5f5',
                                    transform: application.applicant?.selfIntroVideo ? 'translateY(-2px)' : 'none',
                                    boxShadow: application.applicant?.selfIntroVideo ? 2 : 0
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <VideocamIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="medium" 
                                title="Shortlist"
                                onClick={() => handleStatusChange(application._id, 'shortlisted')}
                                sx={{ 
                                  bgcolor: '#e8f5e9',
                                  color: '#2e7d32',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: '#c8e6c9',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="medium" 
                                title="Reject"
                                onClick={() => handleOpenRejectDialog(application)}
                                sx={{ 
                                  bgcolor: '#ffebee',
                                  color: '#c62828',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: '#ffcdd2',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="medium" 
                                title="Send Email"
                                sx={{ 
                                  bgcolor: '#fff3e0',
                                  color: '#ef6c00',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: '#ffe0b2',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="medium" 
                                title="Send Message"
                                onClick={() => handleMessageClick(application)}
                                sx={{ 
                                  bgcolor: '#f3e5f5',
                                  color: '#7b1fa2',
                                  borderRadius: 2,
                                  '&:hover': { 
                                    bgcolor: '#e1bee7',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2
                                  },
                                  transition: 'all 0.2s'
                                }}
                              >
                                <MessageIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                          <Typography variant="h6" color="textSecondary">
                            No applications found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      {/* Resume Preview Dialog */}
      <Dialog 
        open={resumeDialogOpen} 
        onClose={handleCloseResumeDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                src={selectedApplication?.applicant?.avatar || selectedApplication?.applicant?.resumeData?.formData?.profileImage}
                sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}
              >
                {selectedApplication?.applicant?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4">
                  {selectedApplication?.applicant?.name || 'Applicant'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Applied for: {selectedApplication?.job?.title || 'Job Application'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseResumeDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedApplication && (
            <Box>
              {/* Contact Information */}
              <Card sx={{ mb: 3, bgcolor: theme.palette.grey[50] }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" /> Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {selectedApplication.applicant?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {selectedApplication.applicant?.phone || selectedApplication.applicant?.resumeData?.formData?.phone || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {selectedApplication.applicant?.location || selectedApplication.applicant?.resumeData?.formData?.location || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    {(selectedApplication.applicant?.linkedIn || selectedApplication.applicant?.resumeData?.formData?.linkedIn) && (
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinkIcon fontSize="small" color="action" />
                          <Typography 
                            variant="body2" 
                            component="a" 
                            href={selectedApplication.applicant?.linkedIn || selectedApplication.applicant?.resumeData?.formData?.linkedIn}
                            target="_blank"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            LinkedIn Profile
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>

              {/* Self Introduction Video Section */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VideocamIcon color="primary" /> Self Introduction Video
                  </Typography>
                  {selectedApplication.applicant?.selfIntroVideo ? (
                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                      <video 
                        controls 
                        style={{ width: '100%', maxHeight: 300, borderRadius: 8 }}
                        src={selectedApplication.applicant.selfIntroVideo}
                      >
                        Your browser does not support video playback.
                      </video>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: theme.palette.grey[100], 
                        borderRadius: 2 
                      }}
                    >
                      <VideocamIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography color="textSecondary">
                        No self introduction video available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="primary" /> Cover Letter
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: theme.palette.text.secondary }}>
                    {selectedApplication.coverLetter || 'No cover letter provided'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Skills */}
              {(selectedApplication.applicant?.skills?.length > 0 || selectedApplication.applicant?.resumeData?.skills?.length > 0) && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon color="primary" /> Skills
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {(selectedApplication.applicant?.skills || selectedApplication.applicant?.resumeData?.skills || []).map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {(selectedApplication.applicant?.education?.length > 0 || selectedApplication.applicant?.resumeData?.educations?.length > 0) && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="primary" /> Education
                    </Typography>
                    {(selectedApplication.applicant?.education || selectedApplication.applicant?.resumeData?.educations || []).map((edu, index) => (
                      <Box key={index} sx={{ mb: index < (selectedApplication.applicant?.education?.length || selectedApplication.applicant?.resumeData?.educations?.length) - 1 ? 2 : 0 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {edu.institution}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {selectedApplication.applicant?.resumeData?.experiences?.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon color="primary" /> Experience
                    </Typography>
                    {selectedApplication.applicant.resumeData.experiences.map((exp, index) => (
                      <Box key={index} sx={{ mb: index < selectedApplication.applicant.resumeData.experiences.length - 1 ? 2 : 0 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {exp.position}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </Typography>
                        {exp.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {selectedApplication.applicant?.resumeData?.projects?.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon color="primary" /> Projects
                    </Typography>
                    {selectedApplication.applicant.resumeData.projects.map((project, index) => (
                      <Box key={index} sx={{ mb: index < selectedApplication.applicant.resumeData.projects.length - 1 ? 2 : 0 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {project.title}
                          {project.link && (
                            <IconButton 
                              size="small" 
                              component="a" 
                              href={project.link} 
                              target="_blank"
                              sx={{ ml: 1 }}
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {project.description}
                        </Typography>
                        {project.technologies?.length > 0 && (
                          <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                            {project.technologies.map((tech, i) => (
                              <Chip key={i} label={tech} size="small" variant="outlined" />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Resume File */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="primary" /> Resume
                  </Typography>
                  
                  {/* Show Resume Builder Template if resumeType is existing */}
                  {(selectedApplication.resumeType === 'existing' || !selectedApplication.resumeType) && 
                   selectedApplication.applicant?.resumeData?.formData ? (
                    <Box sx={{ 
                      maxHeight: 600, 
                      overflow: 'auto', 
                      border: '1px solid #ccc', 
                      borderRadius: 2,
                      transform: 'scale(0.6)',
                      transformOrigin: 'top left',
                      width: '166.67%'
                    }}>
                      {(() => {
                        const templates = {
                          1: Template1,
                          2: Template2,
                          3: Template3,
                          4: Template4,
                          5: Template5
                        };
                        const templateNum = selectedApplication.selectedTemplate || 
                                           selectedApplication.applicant?.resumeData?.selectedTemplate || 1;
                        const SelectedTemplate = templates[templateNum] || Template1;
                        const resumeData = selectedApplication.applicant?.resumeData;
                        
                        return (
                          <SelectedTemplate 
                            data={resumeData?.formData}
                            skills={resumeData?.skills || []}
                            educations={resumeData?.educations || []}
                            experiences={resumeData?.experiences || []}
                            projects={resumeData?.projects || []}
                          />
                        );
                      })()}
                    </Box>
                  ) : (selectedApplication.resume || selectedApplication.applicant?.resume) ? (
                    <Box>
                      {(selectedApplication.resume || selectedApplication.applicant?.resume)?.includes('data:') ? (
                        // Base64 PDF or data URL
                        <Box sx={{ height: 400 }}>
                          <iframe 
                            src={selectedApplication.resume || selectedApplication.applicant?.resume} 
                            title="Resume Preview"
                            style={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: 8 }}
                          />
                        </Box>
                      ) : (selectedApplication.resume || selectedApplication.applicant?.resume)?.endsWith('.pdf') ? (
                        // PDF resume - embed viewer
                        <Box sx={{ height: 400 }}>
                          <iframe 
                            src={selectedApplication.resume || selectedApplication.applicant?.resume} 
                            title="Resume Preview"
                            style={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: 8 }}
                          />
                        </Box>
                      ) : (
                        // Other file types - provide download link
                        <Box 
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2, 
                            p: 3, 
                            textAlign: 'center',
                            bgcolor: theme.palette.grey[50]
                          }}
                        >
                          <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                            Resume file uploaded
                          </Typography>
                          <Button 
                            variant="contained" 
                            startIcon={<DownloadIcon />}
                            href={selectedApplication.resume || selectedApplication.applicant?.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Resume
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: theme.palette.grey[100], 
                        borderRadius: 2 
                      }}
                    >
                      <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography color="textSecondary">
                        No resume file attached
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Self Introduction Video Dialog */}
      <Dialog 
        open={videoDialogOpen} 
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                {selectedVideoApplication?.applicant?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4">
                  Self Introduction
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedVideoApplication?.applicant?.name || 'Candidate'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseVideoDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVideoApplication?.applicant?.selfIntroVideo ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: '#000',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <video 
                controls 
                autoPlay
                style={{ width: '100%', maxHeight: 500 }}
                src={selectedVideoApplication.applicant.selfIntroVideo}
              >
                Your browser does not support video playback.
              </video>
            </Box>
          ) : (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <VideocamIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No video available
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <CancelIcon sx={{ color: theme.palette.error.main }} />
              <Typography variant="h4">Reject Application</Typography>
            </Box>
            <IconButton onClick={handleCloseRejectDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {rejectingApplication && (
            <Box>
              {/* Candidate Info */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  p: 2,
                  bgcolor: theme.palette.grey[50],
                  borderRadius: 2
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                  {rejectingApplication.applicant?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {rejectingApplication.applicant?.name || 'Unknown Applicant'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Applied for: {rejectingApplication.job?.title || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Rejection Reason Selection */}
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Select Rejection Reason *
                </FormLabel>
                <RadioGroup
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  {rejectionReasons.map((reason) => (
                    <FormControlLabel
                      key={reason}
                      value={reason}
                      control={
                        <Radio 
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette.error.main
                            }
                          }}
                        />
                      }
                      label={reason}
                      sx={{
                        mb: 0.5,
                        p: 1,
                        mx: 0,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: theme.palette.grey[50]
                        },
                        ...(rejectionReason === reason && {
                          bgcolor: theme.palette.error.lighter || '#ffebee',
                        })
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Custom Reason Input */}
              {rejectionReason === 'Other' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Enter custom reason"
                  placeholder="Please specify the reason for rejection..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  sx={{ mt: 2 }}
                  required
                />
              )}

              {/* Info Note */}
              <Alert severity="info" sx={{ mt: 3 }}>
                The candidate will be notified about this rejection via email with the reason you provide.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseRejectDialog} 
            variant="outlined"
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectWithReason}
            variant="contained"
            color="error"
            disabled={isRejecting || !rejectionReason || (rejectionReason === 'Other' && !customReason.trim())}
            startIcon={isRejecting ? <CircularProgress size={20} color="inherit" /> : <CancelIcon />}
          >
            {isRejecting ? 'Rejecting...' : 'Reject Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Applicants;