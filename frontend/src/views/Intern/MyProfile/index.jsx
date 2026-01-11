import React, { useState, useEffect, useRef } from 'react';

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
  Avatar,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { profileAPI } from '../../../services/api';

// assets
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

// ==============================|| INTERN PROFILE ||============================== //

const InternProfile = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);
  
  // Video recording states
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    university: '',
    graduationYear: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    avatar: '',
    selfIntroVideo: ''
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Fetch profile data from backend on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getProfile();
      
      if (response.success) {
        const userData = response.data;
        
        // Handle education array - get first education entry if exists
        let educationDegree = '';
        let educationUniversity = '';
        
        if (Array.isArray(userData.education) && userData.education.length > 0) {
          educationDegree = userData.education[0].degree || '';
          educationUniversity = userData.education[0].institution || '';
        } else if (typeof userData.education === 'string') {
          educationDegree = userData.education;
        }
        
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          education: educationDegree,
          university: educationUniversity,
          graduationYear: userData.graduationYear || '',
          bio: userData.bio || '',
          linkedIn: userData.linkedIn || '',
          github: userData.github || '',
          portfolio: userData.portfolio || '',
          avatar: userData.avatar || '',
          selfIntroVideo: userData.selfIntroVideo || ''
        });
        setSkills(userData.skills || []);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile. Please try again.');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        setError(null);
        // Convert image to base64 for display
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileData({
            ...profileData,
            avatar: event.target?.result || ''
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error uploading image');
        console.error('Image upload error:', err);
      }
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size should be less than 50MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file');
        return;
      }
      
      try {
        setError(null);
        setVideoUploading(true);
        // Convert video to base64 for storage (for small videos)
        // For production, you should upload to a cloud storage
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileData({
            ...profileData,
            selfIntroVideo: event.target?.result || ''
          });
          setVideoUploading(false);
          setSuccessMessage('Video uploaded successfully! Don\'t forget to save your profile.');
          setTimeout(() => setSuccessMessage(''), 3000);
        };
        reader.onerror = () => {
          setError('Error reading video file');
          setVideoUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error uploading video');
        setVideoUploading(false);
        console.error('Video upload error:', err);
      }
    }
  };

  // Remove video
  const handleRemoveVideo = () => {
    setProfileData({
      ...profileData,
      selfIntroVideo: ''
    });
  };

  // ============ Video Recording Functions ============
  
  // Open recording dialog
  const handleOpenRecordDialog = async () => {
    setRecordDialogOpen(true);
    setRecordedVideo(null);
    setRecordingTime(0);
    setCameraError(null);
    setCameraReady(false);
    
    // Start camera after dialog opens
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Close recording dialog
  const handleCloseRecordDialog = () => {
    stopCamera();
    setRecordDialogOpen(false);
    setRecordedVideo(null);
    setIsRecording(false);
    setRecordingTime(0);
    setCameraReady(false);
  };

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.onloadedmetadata = () => {
          webcamRef.current.play();
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please allow camera permission and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (webcamRef.current) {
      webcamRef.current.srcObject = null;
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;
    
    recordedChunksRef.current = [];
    setRecordingTime(0);
    
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    
    // Fallback for browsers that don't support vp9
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm;codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
          // Store base64 temporarily
          setRecordedVideo(reader.result);
        };
        reader.readAsDataURL(blob);
      };
      
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      // Start timer
      const timerInterval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) { // Max 2 minutes
            stopRecording();
            clearInterval(timerInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Store interval ID for cleanup
      mediaRecorderRef.current.timerInterval = timerInterval;
      
    } catch (err) {
      console.error('Recording error:', err);
      setCameraError('Unable to start recording. Please try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (mediaRecorderRef.current.timerInterval) {
        clearInterval(mediaRecorderRef.current.timerInterval);
      }
    }
    setIsRecording(false);
  };

  // Re-record video
  const handleReRecord = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    startCamera();
  };

  // Use recorded video
  const handleUseRecordedVideo = () => {
    if (recordedVideo) {
      setProfileData({
        ...profileData,
        selfIntroVideo: recordedVideo
      });
      setSuccessMessage('Video recorded successfully! Don\'t forget to save your profile.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    handleCloseRecordDialog();
  };

  // Toggle mute
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccessMessage('');
      setSaving(true);
      
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        linkedIn: profileData.linkedIn,
        github: profileData.github,
        portfolio: profileData.portfolio,
        avatar: profileData.avatar,
        selfIntroVideo: profileData.selfIntroVideo,
        skills: skills,
        // Send education as an array with proper structure
        education: profileData.education ? [{
          degree: profileData.education,
          institution: profileData.university || '',
          field: '',
          startDate: null,
          endDate: null,
          current: true
        }] : []
      };

      const response = await profileAPI.updateProfile(updateData);
      
      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        // Refresh profile data
        fetchProfileData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile. Please try again.');
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileData(); // Reset to original data
  };

  if (loading) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      )}
      
      {successMessage && (
        <Grid item xs={12}>
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3">My Profile</Typography>
              </Box>
            }
            action={
              <Box display="flex" gap={1}>
                {isEditing && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant={isEditing ? 'contained' : 'outlined'}
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
                </Button>
              </Box>
            }
          />
        </Card>
      </Grid>

      {/* Profile Picture and Basic Info */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            <Box position="relative" display="inline-block">
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mx: 'auto',
                  mb: 2,
                  fontSize: 60,
                  bgcolor: theme.palette.primary.main,
                  ...(profileData.avatar && {
                    backgroundImage: `url(${profileData.avatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  })
                }}
              >
                {!profileData.avatar && profileData.name.charAt(0)}
              </Avatar>
              {isEditing && (
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 0,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <CameraAltIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
              )}
            </Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {profileData.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {profileData.email}
            </Typography>
            <Chip label="Active Intern" color="success" sx={{ mb: 2 }} />
          </CardContent>
        </Card>

        {/* Skills */}
        <Card sx={{ mt: 3 }}>
          <CardHeader title={<Typography variant="h4">Skills</Typography>} />
          <Divider />
          <CardContent>
            <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                    deleteIcon={isEditing ? <DeleteIcon /> : undefined}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No skills added yet
                </Typography>
              )}
            </Box>
            
            {isEditing && (
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  sx={{ minWidth: 'auto' }}
                >
                  <AddIcon />
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Self Introduction Video */}
        <Card sx={{ mt: 3 }}>
          <CardHeader 
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <VideocamIcon color="primary" />
                <Typography variant="h4">Self Introduction Video</Typography>
              </Box>
            } 
          />
          <Divider />
          <CardContent>
            {/* Hidden video input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
            />
            
            {profileData.selfIntroVideo ? (
              <Box>
                <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                  <video 
                    controls 
                    style={{ width: '100%', maxHeight: 250, borderRadius: 8, backgroundColor: '#000' }}
                    src={profileData.selfIntroVideo}
                  >
                    Your browser does not support video playback.
                  </video>
                </Box>
                {isEditing && (
                  <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => videoInputRef.current?.click()}
                    >
                      Upload New
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FiberManualRecordIcon />}
                      onClick={handleOpenRecordDialog}
                    >
                      Record New
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveVideo}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  bgcolor: theme.palette.grey[50], 
                  borderRadius: 2,
                  border: `2px dashed ${theme.palette.grey[300]}`
                }}
              >
                <VideocamIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  {isEditing ? 'Record or upload a self introduction video' : 'No self introduction video uploaded'}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
                  Tip: A brief 1-2 minute video introducing yourself can help employers know you better!
                </Typography>
                {isEditing && (
                  <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<FiberManualRecordIcon />}
                      onClick={handleOpenRecordDialog}
                      sx={{
                        background: 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #d32f2f 30%, #c2185b 90%)',
                        }
                      }}
                    >
                      Record Video
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={videoUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                      onClick={() => videoInputRef.current?.click()}
                      disabled={videoUploading}
                    >
                      {videoUploading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Profile Details */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title={<Typography variant="h4">Personal Information</Typography>} />
          <Divider />
          <CardContent>
            <Grid container spacing={gridSpacing} className="profile-form">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
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
                  disabled={true}
                  variant="filled"
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio / About Me"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                  helperText={isEditing ? 'Tell us about yourself (optional)' : ''}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Education */}
        <Card sx={{ mt: 3 }}>
          <CardHeader title={<Typography variant="h4">Education</Typography>} />
          <Divider />
          <CardContent>
            <Grid container spacing={gridSpacing} className="profile-form">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  name="education"
                  placeholder="e.g., Bachelor of Science"
                  value={profileData.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="University / Institution"
                  name="university"
                  placeholder="e.g., ABC University"
                  value={profileData.university}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  name="graduationYear"
                  type="number"
                  value={profileData.graduationYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card sx={{ mt: 3 }}>
          <CardHeader title={<Typography variant="h4">Social & Professional Links</Typography>} />
          <Divider />
          <CardContent>
            <Grid container spacing={gridSpacing} className="profile-form">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedIn"
                  placeholder="e.g., linkedin.com/in/yourprofile"
                  value={profileData.linkedIn}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="GitHub"
                  name="github"
                  placeholder="e.g., github.com/yourprofile"
                  value={profileData.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Portfolio"
                  name="portfolio"
                  placeholder="e.g., yourportfolio.com"
                  value={profileData.portfolio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Video Recording Dialog */}
      <Dialog
        open={recordDialogOpen}
        onClose={handleCloseRecordDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <VideocamIcon color="error" />
              <Typography variant="h4">Record Self Introduction</Typography>
            </Box>
            <IconButton onClick={handleCloseRecordDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {cameraError ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <VideocamOffIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography color="error" sx={{ mb: 2 }}>
                {cameraError}
              </Typography>
              <Button variant="contained" onClick={startCamera}>
                Try Again
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Video Preview Area */}
              <Box 
                sx={{ 
                  position: 'relative',
                  bgcolor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {!recordedVideo ? (
                  <>
                    <video
                      ref={webcamRef}
                      autoPlay
                      muted
                      playsInline
                      style={{ 
                        width: '100%', 
                        maxHeight: 400,
                        display: cameraReady ? 'block' : 'none',
                        transform: 'scaleX(-1)' // Mirror effect
                      }}
                    />
                    {!cameraReady && (
                      <Box 
                        sx={{ 
                          height: 300, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: 2
                        }}
                      >
                        <CircularProgress color="inherit" sx={{ color: '#fff' }} />
                        <Typography color="#fff">Starting camera...</Typography>
                      </Box>
                    )}
                    
                    {/* Recording indicator */}
                    {isRecording && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          left: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2
                        }}
                      >
                        <FiberManualRecordIcon 
                          sx={{ 
                            color: 'error.main',
                            animation: 'pulse 1s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                              '100%': { opacity: 1 }
                            }
                          }} 
                        />
                        <Typography color="#fff" fontWeight={600}>
                          REC {formatTime(recordingTime)}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Time limit warning */}
                    {isRecording && recordingTime >= 100 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16,
                          bgcolor: 'warning.main',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2
                        }}
                      >
                        <Typography color="#fff" variant="caption" fontWeight={600}>
                          {120 - recordingTime}s left
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <video
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: 400 }}
                    src={recordedVideo}
                  />
                )}
              </Box>

              {/* Recording Progress */}
              {isRecording && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(recordingTime / 120) * 100} 
                    color="error"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="textSecondary">
                      {formatTime(recordingTime)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Max: 2:00
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Controls */}
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                {!recordedVideo ? (
                  <>
                    {!isRecording ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<FiberManualRecordIcon />}
                        onClick={startRecording}
                        disabled={!cameraReady}
                        sx={{ 
                          px: 4,
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)',
                        }}
                      >
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<StopIcon />}
                        onClick={stopRecording}
                        sx={{ px: 4, borderRadius: 3 }}
                      >
                        Stop Recording
                      </Button>
                    )}
                    <IconButton 
                      onClick={toggleMute}
                      sx={{ 
                        bgcolor: isMuted ? 'error.light' : 'grey.200',
                        '&:hover': { bgcolor: isMuted ? 'error.main' : 'grey.300' }
                      }}
                    >
                      {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ReplayIcon />}
                      onClick={handleReRecord}
                      sx={{ borderRadius: 3 }}
                    >
                      Re-record
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<CheckIcon />}
                      onClick={handleUseRecordedVideo}
                      sx={{ 
                        px: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                      }}
                    >
                      Use This Video
                    </Button>
                  </>
                )}
              </Box>

              {/* Tips */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Tips for a great introduction:</strong>
                </Typography>
                <Typography variant="body2" component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                  <li>Keep it brief (1-2 minutes)</li>
                  <li>Introduce yourself and your background</li>
                  <li>Mention your key skills and interests</li>
                  <li>Ensure good lighting and clear audio</li>
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default InternProfile;
