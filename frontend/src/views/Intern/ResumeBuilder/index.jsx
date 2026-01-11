import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  ButtonGroup,
  Avatar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// project import
import { gridSpacing } from 'config.js';
import { profileAPI } from '../../../services/api';

// Templates
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';
import Template5 from './templates/Template5';

// assets
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

// ==============================|| RESUME BUILDER ||============================== //

const ResumeBuilder = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const resumeRef = useRef();
  const downloadRef = useRef();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isPremiumUser, setIsPremiumUser] = useState(false); // TODO: Get from user context/API
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    profileImage: '',
    
    // Links
    linkedIn: '',
    github: '',
    portfolio: ''
  });

  const templates = {
    1: Template1,
    2: Template2,
    3: Template3,
    4: Template4,
    5: Template5
  };

  const SelectedTemplate = templates[selectedTemplate];

  // Load saved resume or populate from profile on initial load
  useEffect(() => {
    loadResumeData();
  }, []);

  // Load saved resume data
  const loadResumeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getResumeData();
      
      // Check if saved resume exists and has meaningful data
      if (response.success && response.data && response.data.formData && 
          (response.data.formData.fullName || response.data.formData.email)) {
        // Load saved resume data
        const { formData: savedFormData, skills: savedSkills, educations: savedEducations, 
                experiences: savedExperiences, projects: savedProjects, selectedTemplate: savedTemplate } = response.data;
        
        if (savedFormData) setFormData(savedFormData);
        if (savedSkills && savedSkills.length > 0) setSkills(savedSkills);
        if (savedEducations && savedEducations.length > 0) setEducations(savedEducations);
        if (savedExperiences && savedExperiences.length > 0) setExperiences(savedExperiences);
        if (savedProjects && savedProjects.length > 0) setProjects(savedProjects);
        if (savedTemplate) setSelectedTemplate(savedTemplate);
        
        setSuccessMessage('Saved resume loaded successfully!');
      } else {
        // No saved resume, populate from profile
        await populateFromProfile();
      }
    } catch (err) {
      console.error('Load resume error:', err);
      // If no saved resume, try to populate from profile
      await populateFromProfile();
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddEducation = () => {
    setEducations([...educations, { degree: '', university: '', graduationYear: '', cgpa: '' }]);
  };

  const handleRemoveEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value;
    setEducations(updatedEducations);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { jobTitle: '', company: '', duration: '', description: '' }]);
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  const handleAddProject = () => {
    setProjects([...projects, { projectName: '', projectDescription: '', projectTech: '' }]);
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Map profile data to resume data format
  const mapProfileToResume = (profileData) => {
    // Extract name and email from profile
    const mappedData = {
      fullName: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      location: profileData.location || '',
      summary: profileData.bio || '',
      profileImage: profileData.avatar || '',
      linkedIn: profileData.linkedIn || '',
      github: profileData.github || '',
      portfolio: profileData.portfolio || ''
    };

    // Map skills
    const mappedSkills = profileData.skills || [];

    // Map education
    let mappedEducations = [];
    if (Array.isArray(profileData.education) && profileData.education.length > 0) {
      mappedEducations = profileData.education.map(edu => ({
        degree: edu.degree || '',
        university: edu.institution || '',
        graduationYear: '', // Not available in profile
        cgpa: '' // Not available in profile
      }));
    }

    return {
      formData: mappedData,
      skills: mappedSkills,
      educations: mappedEducations
    };
  };

  // Fetch profile data and populate resume
  const populateFromProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      const response = await profileAPI.getProfile();
      
      if (response.success) {
        const { formData: mappedData, skills: mappedSkills, educations: mappedEducations } = mapProfileToResume(response.data);
        
        setFormData(mappedData);
        setSkills(mappedSkills);
        setEducations(mappedEducations);
        
        // Experiences and projects remain empty as they're not in profile
        setExperiences([]);
        setProjects([]);
        
        setSuccessMessage('Profile data loaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to fetch profile data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile. Please try again.');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    // Check if user is trying to download with a premium template
    if (selectedTemplate !== 1 && !isPremiumUser) {
      navigate('/pricing');
      return;
    }

    if (!downloadRef.current) {
      setError('Resume not ready. Please try again.');
      return;
    }

    try {
      setDownloadLoading(true);
      setError(null);

      // Wait a bit to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const resumeElement = downloadRef.current;

      // Capture with high quality settings
      const canvas = await html2canvas(resumeElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: false
      });

      // Create PDF with exact A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Add image to fit A4 page perfectly
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, '', 'FAST');
      
      // Generate filename
      const fileName = formData.fullName 
        ? `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      // Download the PDF
      pdf.save(fileName);
      
      setSuccessMessage('Resume downloaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download resume. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      const resumeData = {
        formData,
        skills,
        educations,
        experiences,
        projects,
        selectedTemplate
      };

      const response = await profileAPI.saveResumeData(resumeData);

      if (response.success) {
        setSuccessMessage('Resume saved successfully! Profile updated.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to save resume');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save resume. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Header */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h3">Resume Builder</Typography>
              </Box>
            }
            subheader="Create your professional resume - Fill form on left, preview on right"
            action={
              <Button
                variant="outlined"
                startIcon={loading ? <CircularProgress size={20} /> : <SyncIcon />}
                onClick={populateFromProfile}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Populate from Profile'}
              </Button>
            }
          />
          {(error || successMessage) && (
            <CardContent>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                  {successMessage}
                </Alert>
              )}
            </CardContent>
          )}
        </Card>
      </Grid>

      {/* Template Selector */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Select Template:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map((num) => {
                  const isLocked = num !== 1 && !isPremiumUser;
                  return (
                    <Box key={num} sx={{ position: 'relative' }}>
                      <Button
                        onClick={() => setSelectedTemplate(num)}
                        variant={selectedTemplate === num ? 'contained' : 'outlined'}
                        color={selectedTemplate === num ? 'primary' : 'inherit'}
                        sx={{
                          minWidth: '60px',
                          minHeight: '45px',
                          fontWeight: selectedTemplate === num ? 700 : 400,
                          position: 'relative'
                        }}
                      >
                        {num}
                      </Button>
                      {isLocked && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            pointerEvents: 'none'
                          }}
                        >
                          <LockIcon sx={{ color: '#fff', fontSize: '20px' }} />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
              {!isPremiumUser && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<StarIcon />}
                  onClick={() => navigate('/pricing')}
                  sx={{
                    ml: 'auto',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)'
                    }
                  }}
                >
                  Get Premium
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content - Two Column Layout */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Left Column - Form */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader
                title={<Typography variant="h5">Enter Your Information</Typography>}
              />
              <CardContent>
                <Box className="resume-builder-form" sx={{ maxHeight: 'none', overflowY: 'visible', pr: 1 }}>
                  {/* Personal Info Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Profile Image Upload */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            bgcolor: theme.palette.primary.light,
                            fontSize: '36px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          src={formData.profileImage}
                        >
                          {formData.fullName
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase() || 'U'}
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          id="profile-image-input"
                        />
                        <label htmlFor="profile-image-input" style={{ width: '100%', height: '100%' }}>
                          <IconButton
                            component="span"
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              bgcolor: theme.palette.primary.main,
                              color: '#fff',
                              '&:hover': { bgcolor: theme.palette.primary.dark },
                              width: 40,
                              height: 40
                            }}
                          >
                            <CameraAltIcon sx={{ fontSize: '18px' }} />
                          </IconButton>
                        </label>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Professional Summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Write a brief summary about yourself..."
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Education Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Education
                  </Typography>
                  {educations.map((edu, index) => (
                    <Box key={index} className="education-section" sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Education #{index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Degree"
                            placeholder="e.g., B.Tech, Class XII, Class X"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="University/College/School"
                            value={edu.university}
                            onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Graduation Year"
                            placeholder="e.g., 2025"
                            value={edu.graduationYear}
                            onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="CGPA/Percentage"
                            placeholder="e.g., 8.5/10"
                            value={edu.cgpa}
                            onChange={(e) => handleEducationChange(index, 'cgpa', e.target.value)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddEducation}
                    sx={{ mb: 3 }}
                  >
                    Add Education
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  {/* Experience Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Experience
                  </Typography>
                  {experiences.map((exp, index) => (
                    <Box key={index} className="experience-section" sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Experience #{index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveExperience(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Job Title"
                            placeholder="e.g., Frontend Developer"
                            value={exp.jobTitle}
                            onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Company"
                            placeholder="e.g., Tech Corp"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Duration"
                            placeholder="e.g., Jan 2024 - Present"
                            value={exp.duration}
                            onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Job Description"
                            placeholder="Describe your responsibilities..."
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddExperience}
                    sx={{ mb: 3 }}
                  >
                    Add Experience
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  {/* Skills Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Skills
                  </Typography>
                  <Box className="skills-section" sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSkill}
                      startIcon={<AddIcon />}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Projects Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Projects
                  </Typography>
                  {projects.map((proj, index) => (
                    <Box key={index} className="projects-section" sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Project #{index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveProject(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Project Name"
                            placeholder="e.g., E-commerce Website"
                            value={proj.projectName}
                            onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Project Description"
                            placeholder="Describe your project..."
                            value={proj.projectDescription}
                            onChange={(e) => handleProjectChange(index, 'projectDescription', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Technologies Used"
                            placeholder="e.g., React, Node.js, MongoDB"
                            value={proj.projectTech}
                            onChange={(e) => handleProjectChange(index, 'projectTech', e.target.value)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddProject}
                    sx={{ mb: 3 }}
                  >
                    Add Project
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  {/* Social Links Section */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                    Social Links
                  </Typography>
                  <Grid container spacing={2} className="social-links-section">
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="LinkedIn"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="GitHub"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Portfolio Website"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Live Preview */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: 'auto'
            }}>
              <CardHeader
                title={<Typography variant="h5">Resume Preview A4 (Template {selectedTemplate})</Typography>}
              />
              <CardContent sx={{ 
                p: 2, 
                bgcolor: '#e8e8e8', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                overflow: 'visible',
                position: 'relative'
              }}>
                <Box sx={{ 
                  scale: { xs: '0.35', sm: '0.45', md: '0.55', lg: '0.65' },
                  transformOrigin: 'top center',
                  transition: 'scale 0.3s ease'
                }}>
                  <Box ref={resumeRef}>
                    <SelectedTemplate 
                      data={formData} 
                      skills={skills}
                      educations={educations}
                      experiences={experiences}
                      projects={projects}
                    />
                  </Box>
                </Box>

                {/* Lock Overlay for Premium Templates - Semi-transparent */}
                {selectedTemplate !== 1 && !isPremiumUser && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      <LockIcon sx={{ fontSize: 45, color: '#fff' }} />
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<StarIcon />}
                      onClick={() => navigate('/pricing')}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 3,
                        py: 1.2,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                        }
                      }}
                    >
                      Get Premium
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                onClick={handleSave}
                disabled={saveLoading || loading}
              >
                {saveLoading ? 'Saving...' : 'Save Resume'}
              </Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={downloadLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={handleDownload}
                disabled={downloadLoading || loading}
              >
                {downloadLoading ? 'Generating PDF...' : 'Download Resume (PDF)'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Hidden full-scale template for PDF generation */}
      <Box
        ref={downloadRef}
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '210mm',
          height: '297mm',
          overflow: 'hidden'
        }}
      >
        <SelectedTemplate 
          data={formData} 
          skills={skills}
          educations={educations}
          experiences={experiences}
          projects={projects}
        />
      </Box>
    </Grid>
  );
};

export default ResumeBuilder;
