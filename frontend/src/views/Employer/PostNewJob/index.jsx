import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Tooltip,
  FormHelperText
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';

// AI Components
import AISuggestionsModal from 'component/AISuggestionsModal';
import SmartSkillsInput from 'component/SmartSkillsInput';
import InstantSkillsInput from 'component/InstantSkillsInput';
import LinkedInStyleSkillsInput from 'component/LinkedInStyleSkillsInput';
import SmartTextArea from 'component/SmartTextArea';

// assets
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// ==============================|| POST NEW JOB ||============================== //

const PostNewJob = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salaryError, setSalaryError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    experience: '',
    salary: {
      min: '',
      max: '',
      currency: 'INR'
    },
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    openings: '1',
    deadline: ''
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Indian cities list for location dropdown
  const indianCities = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Ahmedabad, Gujarat',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
    'Jaipur, Rajasthan',
    'Surat, Gujarat',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ghaziabad, Uttar Pradesh',
    'Ludhiana, Punjab',
    'Agra, Uttar Pradesh',
    'Nashik, Maharashtra',
    'Faridabad, Haryana',
    'Meerut, Uttar Pradesh',
    'Rajkot, Gujarat',
    'Varanasi, Uttar Pradesh',
    'Srinagar, Jammu and Kashmir',
    'Aurangabad, Maharashtra',
    'Dhanbad, Jharkhand',
    'Amritsar, Punjab',
    'Navi Mumbai, Maharashtra',
    'Allahabad, Uttar Pradesh',
    'Ranchi, Jharkhand',
    'Howrah, West Bengal',
    'Coimbatore, Tamil Nadu',
    'Jabalpur, Madhya Pradesh',
    'Gwalior, Madhya Pradesh',
    'Vijayawada, Andhra Pradesh',
    'Jodhpur, Rajasthan',
    'Madurai, Tamil Nadu',
    'Raipur, Chhattisgarh',
    'Kota, Rajasthan',
    'Chandigarh',
    'Guwahati, Assam',
    'Remote',
    'Work from Home'
  ].sort();

  // Format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const number = value.toString().replace(/,/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove commas and get numeric value
  const parseFormattedNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const steps = ['Basic Info', 'Details', 'Requirements', 'Review & Publish'];

  // Validation for each step
  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          formData.title.trim() !== '' &&
          formData.company.trim() !== '' &&
          formData.location !== '' &&
          formData.type !== '' &&
          formData.category.trim() !== ''
        );
      case 1: // Details
        return formData.description.trim() !== '';
      case 2: // Requirements
        return formData.requirements.trim() !== '' && skills.length > 0;
      case 3: // Review
        return true;
      default:
        return true;
    }
  };

  const getStepErrors = (step) => {
    const errors = [];
    switch (step) {
      case 0:
        if (!formData.title.trim()) errors.push('Job Title is required');
        if (!formData.company.trim()) errors.push('Company Name is required');
        if (!formData.location) errors.push('Location is required');
        if (!formData.type) errors.push('Job Type is required');
        if (!formData.category.trim()) errors.push('Job Category is required');
        break;
      case 1:
        if (!formData.description.trim()) errors.push('Job Description is required');
        break;
      case 2:
        if (!formData.requirements.trim()) errors.push('Requirements are required');
        if (skills.length === 0) errors.push('At least one skill is required');
        break;
    }
    return errors;
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

  // AI Suggestions Handler
  const handleAISuggestions = (section, data) => {
    if (section === 'all') {
      // Apply all suggestions
      if (data.requiredSkills) {
        setSkills([...new Set([...skills, ...data.requiredSkills])]);
      }
      if (data.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
      }
      if (data.responsibilities) {
        setFormData(prev => ({ ...prev, responsibilities: data.responsibilities.join('\n• ') }));
      }
      if (data.qualifications) {
        setFormData(prev => ({ ...prev, requirements: data.qualifications.join('\n• ') }));
      }
    } else if (section === 'skills') {
      setSkills([...new Set([...skills, ...data])]);
    } else if (section === 'description') {
      setFormData(prev => ({ ...prev, description: data }));
    } else if (section === 'responsibilities') {
      setFormData(prev => ({ ...prev, responsibilities: data }));
    } else if (section === 'requirements') {
      setFormData(prev => ({ ...prev, requirements: data }));
    }
  };

  const openAISuggestions = () => {
    if (!formData.title.trim()) {
      alert('Please enter a job title first to get AI suggestions');
      return;
    }
    setShowAISuggestions(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // Handle salary fields with comma formatting
      if (parent === 'salary' && (child === 'min' || child === 'max')) {
        const numericValue = parseFormattedNumber(value);
        
        // Validate salary range
        const newSalary = {
          ...formData.salary,
          [child]: numericValue
        };
        
        // Check if min > max
        if (child === 'min' && newSalary.max && parseInt(numericValue) > parseInt(newSalary.max)) {
          setSalaryError('Minimum salary cannot be greater than maximum salary');
        } else if (child === 'max' && newSalary.min && parseInt(numericValue) < parseInt(newSalary.min)) {
          setSalaryError('Maximum salary cannot be less than minimum salary');
        } else {
          setSalaryError('');
        }
        
        setFormData({
          ...formData,
          [parent]: newSalary
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && validateStep(currentStep)) {
      // Don't skip review step - go step by step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert requirements, responsibilities to array
      const requirementsArray = formData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r && r !== '•' && r.length > 0);

      const responsibilitiesArray = formData.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r && r !== '•' && r.length > 0);

      // Format salary as string
      const salaryString = formData.salary.min && formData.salary.max
        ? `₹${(parseInt(formData.salary.min) / 100000).toFixed(1)}-${(parseInt(formData.salary.max) / 100000).toFixed(1)} LPA`
        : undefined;

      // Prepare payload
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        category: formData.category || 'Technology',
        description: formData.description,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        skills: skills,
        salary: salaryString,
        experience: formData.experience,
        deadline: formData.deadline || undefined,
        openings: parseInt(formData.openings)
      };

      // Call API to create job
      const { jobAPI } = await import('services/api');
      const response = await jobAPI.createJob(payload);
      
      if (response.success) {
        alert('Job posted successfully! 🎉');
        // Navigate to My Jobs page
        navigate('/app/employer/my-internship');
      }
      
    } catch (error) {
      console.error('Error creating job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create job. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <WorkOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h3">Post New Job with AI Assistant</Typography>
                </Box>
                <Tooltip title="Get comprehensive AI suggestions for your job posting">
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={openAISuggestions}
                      disabled={!formData.title.trim()}
                      sx={{ 
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                        }
                      }}
                    >
                      AI Suggestions
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            }
          />
          <Divider />
          <CardContent>
            {/* Stepper */}
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 0 && (
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior React Developer"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Tech Corp"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Location</InputLabel>
                      <Select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        label="Location"
                      >
                        {indianCities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Job Type</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="Job Type"
                      >
                        <MenuItem value="full-time">Full-time</MenuItem>
                        <MenuItem value="part-time">Part-time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                        <MenuItem value="internship">Internship</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Job Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Technology, Marketing, Finance"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Experience Required"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 2-4 years"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Number of Openings"
                      name="openings"
                      type="number"
                      value={formData.openings}
                      onChange={handleChange}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Application Deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Salary Range (Per Annum)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Minimum Salary"
                          name="salary.min"
                          value={formatNumberWithCommas(formData.salary.min)}
                          onChange={handleChange}
                          placeholder="e.g. 5,00,000"
                          error={salaryError !== '' && salaryError.includes('Minimum')}
                          helperText={salaryError.includes('Minimum') ? salaryError : ''}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Maximum Salary"
                          name="salary.max"
                          value={formatNumberWithCommas(formData.salary.max)}
                          onChange={handleChange}
                          placeholder="e.g. 8,00,000"
                          error={salaryError !== '' && salaryError.includes('Maximum')}
                          helperText={salaryError.includes('Maximum') ? salaryError : ''}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Step 2: Details */}
              {currentStep === 1 && (
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <SmartTextArea
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                      label="Job Description"
                      placeholder="Describe the role, team, and what makes this opportunity exciting..."
                      rows={6}
                      jobTitle={formData.title}
                      company={formData.company}
                      type="description"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SmartTextArea
                      value={formData.responsibilities}
                      onChange={handleChange}
                      name="responsibilities"
                      label="Key Responsibilities"
                      placeholder="• Lead development of new features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
                      rows={5}
                      jobTitle={formData.title}
                      company={formData.company}
                      type="responsibilities"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Benefits & Perks"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="• Health insurance&#10;• Flexible work hours&#10;• Remote work options"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 3: Requirements */}
              {currentStep === 2 && (
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <SmartTextArea
                      value={formData.requirements}
                      onChange={handleChange}
                      name="requirements"
                      label="Qualifications & Requirements"
                      placeholder="• Bachelor's degree in Computer Science or related field&#10;• 2+ years of experience with React&#10;• Strong understanding of JavaScript/TypeScript"
                      rows={6}
                      jobTitle={formData.title}
                      company={formData.company}
                      type="requirements"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LinkedInStyleSkillsInput
                      skills={skills}
                      onSkillsChange={setSkills}
                      label="🚀 Required Skills & Technologies"
                      placeholder="Start typing... React, JavaScript, Python, etc."
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 4: Review & Publish */}
              {currentStep === 3 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    📋 Please review your job posting before publishing. Make sure all details are correct.
                  </Alert>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {formData.title}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                      {formData.company}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                      <Chip label={formData.type} color="primary" />
                      <Chip label={formData.location} variant="outlined" />
                      {formData.salary.min && formData.salary.max && (
                        <Chip
                          label={`₹${formatNumberWithCommas(formData.salary.min)} - ₹${formatNumberWithCommas(formData.salary.max)}`}
                          variant="outlined"
                        />
                      )}
                      <Chip label={`${formData.openings} ${parseInt(formData.openings) > 1 ? 'openings' : 'opening'}`} variant="outlined" />
                      {formData.experience && <Chip label={formData.experience} variant="outlined" />}
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Category
                      </Typography>
                      <Typography color="textSecondary">
                        {formData.category}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Description
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {formData.description}
                      </Typography>
                    </Box>
                    
                    {formData.responsibilities && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Key Responsibilities
                        </Typography>
                        <Typography sx={{ whiteSpace: 'pre-line' }}>
                          {formData.responsibilities}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Requirements
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {formData.requirements}
                      </Typography>
                    </Box>
                    
                    {formData.benefits && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Benefits & Perks
                        </Typography>
                        <Typography sx={{ whiteSpace: 'pre-line' }}>
                          {formData.benefits}
                        </Typography>
                      </Box>
                    )}
                    
                    {skills.length > 0 && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Required Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {skills.map((skill, index) => (
                            <Chip key={index} label={skill} color="info" size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {formData.deadline && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                          Application Deadline: {new Date(formData.deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                {/* Show validation errors for current step */}
                {!validateStep(currentStep) && currentStep < 3 && (
                  <Box sx={{ flex: 1, mx: 2 }}>
                    <Alert severity="warning" sx={{ py: 0.5 }}>
                      Please fill all mandatory fields: {getStepErrors(currentStep).join(', ')}
                    </Alert>
                  </Box>
                )}
                
                {currentStep < 3 ? (
                  <Tooltip title={!validateStep(currentStep) ? 'Please fill all mandatory fields' : ''}>
                    <span>
                      <Button 
                        variant="contained" 
                        onClick={handleNext}
                        disabled={!validateStep(currentStep)}
                      >
                        Next
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={isSubmitting || salaryError !== ''}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Job'}
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
      
      {/* AI Suggestions Modal */}
      <AISuggestionsModal
        open={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        jobTitle={formData.title}
        onApplySuggestions={handleAISuggestions}
      />
    </Grid>
  );
};

export default PostNewJob;
