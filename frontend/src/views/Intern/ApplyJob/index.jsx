import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { applicationAPI, profileAPI, jobAPI } from '../../../services/api';

// assets
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// components
import VideoPlayerModal from '../../../component/VideoPlayerModal';
import JobCompatibilityModal from '../../../component/JobCompatibilityModal';

// ==============================|| APPLY JOB ||============================== //

const ApplyJob = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [job, setJob] = useState(location.state?.job || null);
  
  const [loading, setLoading] = useState(!job); // Only show loading if no job data
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeOption, setResumeOption] = useState('existing'); // 'existing' or 'upload'
  const [uploadedResume, setUploadedResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [compatibilityModalOpen, setCompatibilityModalOpen] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [checkingCompatibility, setCheckingCompatibility] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Fetch job and profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job details if not passed via state
        if (!job && id) {
          const jobResponse = await jobAPI.getJobById(id);
          if (jobResponse.success) {
            setJob(jobResponse.data);
          } else {
            setError('Job not found');
            return;
          }
        }
        
        // Fetch profile
        const response = await profileAPI.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || 'Failed to fetch profile');
        }
        
        // Check if already applied for this job
        try {
          const applicationsResponse = await applicationAPI.getInternApplications();
          if (applicationsResponse.success && applicationsResponse.data) {
            const hasApplied = applicationsResponse.data.some(
              app => app.job?._id === id || app.job === id
            );
            setAlreadyApplied(hasApplied);
          }
        } catch (appErr) {
          console.error('Error checking applications:', appErr);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, job]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedResume(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setResumePreview(previewUrl);
    }
  };

  const handleCheckCompatibility = async () => {
    try {
      setCheckingCompatibility(true);
      setError(null);
      
      const response = await applicationAPI.checkJobCompatibility(job._id);
      
      if (response.success) {
        setCompatibilityData(response.data);
        setCompatibilityModalOpen(true);
      } else {
        setError(response.message || 'Failed to check job compatibility');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking job compatibility');
    } finally {
      setCheckingCompatibility(false);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      let resumeData = '';
      let resumeType = 'existing';
      let selectedTemplate = profile?.resumeData?.selectedTemplate || 1;
      
      if (resumeOption === 'existing' && (profile?.resume || profile?.resumeData)) {
        // Use existing resume from profile or resumeData
        resumeData = profile.resume || 'resume_builder';
        resumeType = 'existing';
        selectedTemplate = profile?.resumeData?.selectedTemplate || 1;
      } else if (resumeOption === 'upload' && uploadedResume) {
        // In a real implementation, you would upload the file to a server
        // For now, we'll just use a placeholder
        resumeData = 'uploaded_resume_placeholder';
        resumeType = 'uploaded';
      } else {
        throw new Error('Please provide a resume');
      }
      
      const applicationData = {
        jobId: job._id,
        coverLetter,
        resume: resumeData,
        resumeType,
        selectedTemplate
      };
      
      const response = await applicationAPI.applyForJob(applicationData);
      
      if (response.success) {
        setSuccess(true);
        
        // Store match result if available
        if (response.matchResult) {
          setMatchResult(response.matchResult);
        }
        
        setTimeout(() => {
          navigate('/app/intern/applied-internship');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Grid container spacing={gridSpacing} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center', py: 5 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading job details...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  if (!job) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h4" color="error">
                Job not found
              </Typography>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} 
                sx={{ mt: 2 }}
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2 }}
        >
          Back tojobs
        </Button>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <WorkOutlineIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3">Apply for Job</Typography>
              </Box>
            }
            subheader="Submit your application for this position"
          />
        </Card>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      )}
      
      {success && (
        <Grid item xs={12}>
          <Alert severity="success">
            <Box>
              <Typography variant="body2" sx={{ mb: matchResult ? 1 : 0 }}>
                Application submitted successfully! Redirecting to your applications...
              </Typography>
              {matchResult && (
                <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(46, 125, 50, 0.1)', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    🎯 Profile Match Score: {matchResult.score}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {matchResult.recommendation}
                  </Typography>
                </Box>
              )}
            </Box>
          </Alert>
        </Grid>
      )}

      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader
            title={<Typography variant="h4">Job Details</Typography>}
          />
          <Divider />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                {job.title}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                {job.employer?.companyName || job.companyName || job.company || 'Company'}
              </Typography>
              
              <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {job.location && (
                  <Chip 
                    icon={<LocationOnIcon />}
                    label={job.location} 
                    variant="outlined" 
                  />
                )}
                {(job.jobType || job.type) && (
                  <Chip 
                    icon={<AccessTimeIcon />}
                    label={job.jobType || job.type || 'N/A'} 
                    color="primary" 
                  />
                )}
                {(job.salary || job.stipend) && (
                  <Chip 
                    icon={<AttachMoneyIcon />}
                    label={
                      job.salary || 
                      (job.stipend ? 
                        `₹${job.stipend.min || 0}-${job.stipend.max || 0}` : 
                        'Stipend not specified'
                      )
                    }
                    variant="outlined" 
                    color="success"
                  />
                )}
                {job.experience && (
                  <Chip 
                    label={job.experience} 
                    variant="outlined" 
                  />
                )}
                {job.duration && (
                  <Chip 
                    label={job.duration} 
                    variant="outlined" 
                  />
                )}
              </Box>
              
              {/* Watch Video Button */}
              {job.videoStatus === 'completed' && job.videoUrl && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => {
                      setVideoData({
                        videoUrl: job.videoUrl,
                        videoStatus: job.videoStatus
                      });
                      setVideoModalOpen(true);
                    }}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6
                      }
                    }}
                  >
                    Watch Job Overview Video
                  </Button>
                </Box>
              )}
              
              {job.description && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Job Description:
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {job.description}
                  </Typography>
                </>
              )}
              
              {job.requirements && job.requirements.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Requirements:
                  </Typography>
                  <ul>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                          {req}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card>
          <CardHeader
            title={<Typography variant="h4">Your Application</Typography>}
          />
          <Divider />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                  Select Resume
                </FormLabel>
                <RadioGroup
                  value={resumeOption}
                  onChange={(e) => {
                    const newOption = e.target.value;
                    setResumeOption(newOption);
                    // Clear uploaded file when switching back to existing
                    if (newOption === 'existing') {
                      setUploadedResume(null);
                      setResumePreview(null);
                    }
                  }}
                >
                  <FormControlLabel 
                    value="existing" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body1">Use Existing Resume</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {profile?.resume || profile?.resumeData ? 'Resume already created' : 'No existing resume found'}
                        </Typography>
                      </Box>
                    }
                    disabled={!profile?.resume && !profile?.resumeData}
                  />
                  <FormControlLabel 
                    value="upload" 
                    control={<Radio />} 
                    label="Upload New Resume (PDF)"
                  />
                </RadioGroup>
              </FormControl>
              
              {resumeOption === 'upload' && (
                <Box sx={{ mt: 2 }}>
                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="resume-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="resume-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadFileIcon />}
                      fullWidth
                    >
                      Choose File
                    </Button>
                  </label>
                  
                  {uploadedResume && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Selected file: {uploadedResume.name}
                      </Typography>
                      {resumePreview && (
                        <iframe 
                          src={resumePreview} 
                          title="Resume Preview"
                          style={{ width: '100%', height: '200px', border: '1px solid #ccc' }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Option to go back to existing resume after uploading */}
              {resumeOption === 'upload' && uploadedResume && profile?.resume && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setResumeOption('existing');
                      setUploadedResume(null);
                      setResumePreview(null);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    ← Use Existing Resume Instead
                  </Button>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Cover Letter
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Why are you interested in this position? What makes you a good fit?"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={alreadyApplied}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              {alreadyApplied ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled
                  sx={{
                    '&.Mui-disabled': {
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      color: '#fff'
                    }
                  }}
                >
                  ✓ Already Applied
                </Button>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Compatibility Check Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleCheckCompatibility}
                    disabled={checkingCompatibility}
                    sx={{ textTransform: 'none' }}
                  >
                    {checkingCompatibility ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Checking Match...
                      </>
                    ) : (
                      '🎯 Check Job Match'
                    )}
                  </Button>
                  
                  {/* Apply Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmitApplication}
                    disabled={submitting || 
                      (resumeOption === 'existing' && !profile?.resume && !profile?.resumeData) || 
                      (resumeOption === 'upload' && !uploadedResume)}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Video Player Modal */}
      {videoData && (
        <VideoPlayerModal
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoUrl={videoData.videoUrl}
          videoStatus={videoData.videoStatus}
          jobTitle={job.title}
        />
      )}

      {/* Job Compatibility Modal */}
      <JobCompatibilityModal
        open={compatibilityModalOpen}
        onClose={() => setCompatibilityModalOpen(false)}
        compatibilityData={compatibilityData}
        onApply={() => {
          setCompatibilityModalOpen(false);
          handleSubmitApplication();
        }}
        onCancel={() => setCompatibilityModalOpen(false)}
      />
    </Grid>
  );
};

export default ApplyJob;