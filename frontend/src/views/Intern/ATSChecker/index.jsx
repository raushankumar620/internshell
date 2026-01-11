import React, { useState, useRef, useEffect } from 'react';

// material-ui
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
  Paper,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Tooltip,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  Stack,
  Badge
} from '@mui/material';

// project import
import { atsAPI } from 'services/api';

// icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SpeedIcon from '@mui/icons-material/Speed';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';

// project import
import { gridSpacing } from 'config.js';

// ==============================|| ANIMATED SCORE CIRCLE ||============================== //

const AnimatedScoreCircle = ({ score, size = 200, strokeWidth = 12 }) => {
  const theme = useTheme();
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (end - start) * easeOutQuart);
      
      setAnimatedScore(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);
  
  const getScoreColor = (s) => {
    if (s >= 80) return theme.palette.success.main;
    if (s >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  const getScoreGradient = (s) => {
    if (s >= 80) return ['#4caf50', '#81c784'];
    if (s >= 60) return ['#ff9800', '#ffb74d'];
    return ['#f44336', '#e57373'];
  };
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const gradientColors = getScoreGradient(score);
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={alpha(theme.palette.grey[300], 0.3)}
          strokeWidth={strokeWidth}
        />
        
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ 
            transition: 'stroke-dashoffset 0.5s ease-out',
            filter: 'url(#glow)'
          }}
        />
      </svg>
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 800, 
            color: getScoreColor(score),
            fontSize: size * 0.25,
            lineHeight: 1
          }}
        >
          {animatedScore}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: getScoreColor(score),
            fontWeight: 600,
            fontSize: size * 0.08
          }}
        >
          ATS Score
        </Typography>
      </Box>
    </Box>
  );
};

// ==============================|| SCORE BADGE ||============================== //

const ScoreBadge = ({ score, label, icon: Icon, description }) => {
  const theme = useTheme();
  
  const getScoreColor = (s) => {
    if (s >= 80) return 'success';
    if (s >= 60) return 'warning';
    return 'error';
  };
  
  const color = getScoreColor(score);
  
  return (
    <Tooltip title={description} arrow placement="top">
      <Paper
        elevation={0}
        sx={{
          p: 2,
          textAlign: 'center',
          borderRadius: 3,
          border: `2px solid ${alpha(theme.palette[color].main, 0.3)}`,
          bgcolor: alpha(theme.palette[color].main, 0.05),
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.25)}`
          }
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.15),
            color: theme.palette[color].main,
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 1
          }}
        >
          <Icon />
        </Avatar>
        <Typography variant="h3" sx={{ color: theme.palette[color].main, fontWeight: 700 }}>
          {score}%
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

// ==============================|| ATS CHECKER ||============================== //

const ATSChecker = () => {
  const theme = useTheme();
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    keywords: true,
    format: true,
    content: true
  });
  const [dragActive, setDragActive] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      // Check if file is PDF or DOC/DOCX
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setResumeFile(file);
        setError('');
        setAnalysisResult(null);
      } else {
        setError('Please upload a PDF or Word document');
        setResumeFile(null);
      }
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const analysisSteps = [
    'Uploading resume...',
    'Extracting text content...',
    'Analyzing keywords...',
    'Checking format & structure...',
    'Evaluating content quality...',
    'Generating recommendations...'
  ];

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please select a resume file first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisStep(0);
    
    // Simulate analysis steps for better UX
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 500);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      // Call API to analyze resume
      const response = await atsAPI.checkResume(formData);
      
      clearInterval(stepInterval);
      
      if (response.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response.message || 'Failed to analyze resume');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('ATS Analysis Error:', err);
      setError(err.message || 'Error analyzing resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent', icon: EmojiEventsIcon, color: 'success' };
    if (score >= 80) return { label: 'Very Good', icon: VerifiedIcon, color: 'success' };
    if (score >= 70) return { label: 'Good', icon: TrendingUpIcon, color: 'warning' };
    if (score >= 60) return { label: 'Fair', icon: WarningAmberIcon, color: 'warning' };
    return { label: 'Needs Work', icon: ReportProblemIcon, color: 'error' };
  };

  const renderScoreBar = (score, showLabel = true) => {
    let color = 'error';
    if (score >= 80) color = 'success';
    else if (score >= 60) color = 'warning';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={score} 
            color={color}
            sx={{ 
              height: 12, 
              borderRadius: 6,
              bgcolor: alpha(theme.palette[color].main, 0.15),
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`
              }
            }}
          />
        </Box>
        {showLabel && (
          <Chip 
            label={`${score}%`}
            size="small"
            color={color}
            sx={{ fontWeight: 700, minWidth: 55 }}
          />
        )}
      </Box>
    );
  };

  const getSectionIcon = (sectionKey) => {
    switch (sectionKey) {
      case 'keywords': return KeyboardIcon;
      case 'format': return FormatListBulletedIcon;
      case 'content': return ArticleIcon;
      default: return AssessmentIcon;
    }
  };

  const renderSection = (title, sectionKey, data) => {
    const SectionIcon = getSectionIcon(sectionKey);
    const scoreInfo = getScoreLabel(data.score);
    
    return (
      <Card 
        sx={{ 
          mb: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              p: 2,
              bgcolor: expandedSections[sectionKey] ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => toggleSection(sectionKey)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  color: 'primary.main',
                  width: 40,
                  height: 40
                }}
              >
                <SectionIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <scoreInfo.icon sx={{ fontSize: 14, color: `${scoreInfo.color}.main` }} />
                  <Typography variant="caption" color={`${scoreInfo.color}.main`} sx={{ fontWeight: 500 }}>
                    {scoreInfo.label}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 120, display: { xs: 'none', sm: 'block' } }}>
                {renderScoreBar(data.score, false)}
              </Box>
              <Chip 
                label={`${data.score}%`}
                size="small"
                color={data.score >= 80 ? 'success' : data.score >= 60 ? 'warning' : 'error'}
                sx={{ fontWeight: 700 }}
              />
              {expandedSections[sectionKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          
          <Collapse in={expandedSections[sectionKey]}>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Strengths ({data.goodPoints?.length || 0})
                      </Typography>
                    </Box>
                    <List dense sx={{ py: 0 }}>
                      {data.goodPoints?.map((point, index) => (
                        <Fade in key={index} timeout={300 + index * 100}>
                          <ListItem sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <StarIcon sx={{ color: 'success.main', fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={point} 
                              primaryTypographyProps={{ variant: 'body2' }} 
                            />
                          </ListItem>
                        </Fade>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <LightbulbIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        Suggestions ({data.suggestions?.length || 0})
                      </Typography>
                    </Box>
                    <List dense sx={{ py: 0 }}>
                      {data.suggestions?.map((suggestion, index) => (
                        <Fade in key={index} timeout={300 + index * 100}>
                          <ListItem sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <AutoFixHighIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={suggestion} 
                              primaryTypographyProps={{ variant: 'body2' }} 
                            />
                          </ListItem>
                        </Fade>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Header */}
      <Grid item xs={12}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.1)
            }}
          />
          <CardContent sx={{ py: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  width: 56,
                  height: 56
                }}
              >
                <SpeedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                  ATS Resume Checker
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Optimize your resume for Applicant Tracking Systems and increase your chances of getting hired
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Upload Section */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon color="primary" />
                    <Typography variant="h5">Upload Resume</Typography>
                  </Box>
                }
                subheader="Supported: PDF, DOC, DOCX (Max 5MB)"
              />
              <CardContent>
                {/* Drag & Drop Zone */}
                <Box
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  sx={{
                    border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: dragActive ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.grey[100], 0.5),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.02)
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                  
                  <CloudUploadIcon 
                    sx={{ 
                      fontSize: 56, 
                      color: dragActive ? 'primary.main' : 'grey.400',
                      mb: 2,
                      transition: 'color 0.3s ease'
                    }} 
                  />
                  
                  <Typography variant="h6" gutterBottom>
                    {dragActive ? 'Drop your resume here' : 'Drag & Drop your resume'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    or click to browse files
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose File
                  </Button>
                </Box>
                
                {/* Selected File */}
                {resumeFile && (
                  <Zoom in>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                          <DescriptionIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {resumeFile.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(resumeFile.size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Zoom>
                )}
                
                {/* Error */}
                {error && (
                  <Fade in>
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}
                
                {/* Analyze Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeFile}
                  startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
                  sx={{ 
                    mt: 3, 
                    width: '100%',
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                    }
                  }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Check ATS Score'}
                </Button>
                
                <Divider sx={{ my: 3 }}>
                  <Chip label="OR" size="small" />
                </Divider>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AutoFixHighIcon />}
                  onClick={() => {
                    window.location.hash = '/app/intern/resume-builder';
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Build ATS-Friendly Resume
                </Button>
              </CardContent>
            </Card>
            
            {/* ATS Tips */}
            <Card sx={{ mt: gridSpacing, borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <TipsAndUpdatesIcon color="warning" />
                    <Typography variant="h5">Pro Tips</Typography>
                  </Box>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <List dense>
                  {[
                    { icon: FormatListBulletedIcon, text: 'Use standard section headings' },
                    { icon: KeyboardIcon, text: 'Include keywords from job postings' },
                    { icon: DescriptionIcon, text: 'Save as PDF to preserve formatting' },
                    { icon: ArticleIcon, text: 'Use Arial, Calibri, or Times New Roman' },
                    { icon: SpeedIcon, text: 'Avoid graphics and complex layouts' }
                  ].map((tip, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <tip.icon sx={{ color: 'success.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip.text}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Analysis Results */}
          <Grid item xs={12} lg={8}>
            {isAnalyzing ? (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress size={100} thickness={3} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                  </Box>
                  
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Analyzing Your Resume
                  </Typography>
                  
                  <Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(analysisStep / (analysisSteps.length - 1)) * 100}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body1" color="primary.main" sx={{ fontWeight: 500 }}>
                    {analysisSteps[analysisStep]}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    This may take a few seconds...
                  </Typography>
                </CardContent>
              </Card>
            ) : analysisResult ? (
              <>
                {/* Overall Score Card */}
                <Card 
                  sx={{ 
                    mb: gridSpacing, 
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${theme.palette.background.paper} 100%)`,
                    overflow: 'visible'
                  }}
                >
                  <CardContent sx={{ py: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                        <Zoom in timeout={500}>
                          <Box>
                            <AnimatedScoreCircle score={analysisResult.overallScore} />
                          </Box>
                        </Zoom>
                        
                        <Fade in timeout={800}>
                          <Box sx={{ mt: 2 }}>
                            <Chip
                              icon={getScoreLabel(analysisResult.overallScore).icon && 
                                React.createElement(getScoreLabel(analysisResult.overallScore).icon)}
                              label={getScoreLabel(analysisResult.overallScore).label}
                              color={getScoreLabel(analysisResult.overallScore).color}
                              sx={{ fontWeight: 600, px: 1 }}
                            />
                          </Box>
                        </Fade>
                      </Grid>
                      
                      <Grid item xs={12} md={7}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                          Section Scores
                        </Typography>
                        
                        <Stack spacing={2}>
                          <ScoreBadge 
                            score={analysisResult.sections.keywords.score}
                            label="Keywords"
                            icon={KeyboardIcon}
                            description="How well your resume uses industry keywords"
                          />
                          <ScoreBadge 
                            score={analysisResult.sections.format.score}
                            label="Format"
                            icon={FormatListBulletedIcon}
                            description="Resume structure and formatting"
                          />
                          <ScoreBadge 
                            score={analysisResult.sections.content.score}
                            label="Content"
                            icon={ArticleIcon}
                            description="Quality and completeness of content"
                          />
                        </Stack>
                        
                        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={handleReset}
                            sx={{ borderRadius: 2 }}
                          >
                            Check Another
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* Score Message */}
                    <Alert 
                      severity={analysisResult.overallScore >= 80 ? 'success' : analysisResult.overallScore >= 60 ? 'warning' : 'error'} 
                      sx={{ mt: 3, borderRadius: 2 }}
                      icon={analysisResult.overallScore >= 80 ? <EmojiEventsIcon /> : analysisResult.overallScore >= 60 ? <TrendingUpIcon /> : <WarningAmberIcon />}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {analysisResult.overallScore >= 80
                          ? '🎉 Excellent! Your resume has a high chance of passing ATS filters!'
                          : analysisResult.overallScore >= 60
                            ? '📈 Your resume is decent but could benefit from the improvements below.'
                            : '⚠️ Your resume may be filtered out by ATS systems. Please review the suggestions.'}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
                
                {/* Detailed Analysis */}
                <Card sx={{ mb: gridSpacing, borderRadius: 3 }}>
                  <CardHeader
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <AssessmentIcon color="primary" />
                        <Typography variant="h5">Detailed Analysis</Typography>
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    {renderSection('Keyword Optimization', 'keywords', analysisResult.sections.keywords)}
                    {renderSection('Format & Layout', 'format', analysisResult.sections.format)}
                    {renderSection('Content Quality', 'content', analysisResult.sections.content)}
                  </CardContent>
                </Card>
                
                {/* Recommendations */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardHeader
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <LightbulbIcon sx={{ color: 'info.main' }} />
                        <Typography variant="h5">General Recommendations</Typography>
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={2}>
                      {analysisResult.recommendations?.map((rec, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Fade in timeout={300 + index * 100}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                                height: '100%'
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.15),
                                  color: 'info.main',
                                  width: 28,
                                  height: 28
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                  {index + 1}
                                </Typography>
                              </Avatar>
                              <Typography variant="body2">{rec}</Typography>
                            </Paper>
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent 
                  sx={{ 
                    textAlign: 'center', 
                    py: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7 }} />
                  </Box>
                  
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    Upload Your Resume
                  </Typography>
                  
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
                    Get instant feedback on how well your resume performs against Applicant Tracking Systems
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                      { icon: WorkIcon, text: 'Job Matching' },
                      { icon: SchoolIcon, text: 'Education Check' },
                      { icon: BuildIcon, text: 'Skills Analysis' },
                      { icon: ContactMailIcon, text: 'Contact Info' }
                    ].map((item, index) => (
                      <Chip
                        key={index}
                        icon={<item.icon />}
                        label={item.text}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ATSChecker;