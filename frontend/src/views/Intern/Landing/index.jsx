import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  LinearProgress,
  CardMedia,
  Fade,
  Slide
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { profileAPI } from 'services/api';

// Add jobAPI import
import { jobAPI } from 'services/api';

// Custom styled components
const TrendingCard = ({ title, subtitle, bgColor, textColor, buttonText, icon, image, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        background: bgColor,
        color: textColor,
        height: 320,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: theme.shadows[8],
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12]
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out'
        },
        '&:hover::before': {
          opacity: 1
        }
      }}
      onClick={onClick}
    >
      {image && (
        <CardMedia
          component="img"
          height="120"
          image={image}
          alt={title}
          sx={{ 
            objectFit: 'cover',
            opacity: 0.9
          }}
        />
      )}
      <CardContent sx={{ 
        p: 3, 
        height: image ? '160px' : '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip 
              icon={<TrendingUpOutlinedIcon sx={{ fontSize: '16px !important' }} />}
              label="Trending Now" 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: textColor,
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }} 
            />
            <AutoAwesomeIcon sx={{ fontSize: 20, opacity: 0.8 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ 
            mb: 1,
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ 
            opacity: 0.95,
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            {subtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="medium"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: textColor,
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'scale(1.05)'
            },
            alignSelf: 'flex-start',
            borderRadius: 3,
            px: 3,
            py: 1
          }}
        >
          {buttonText}
        </Button>
        {icon && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 16, 
            right: 16, 
            opacity: 0.2,
            transform: 'rotate(15deg)'
          }}>
            {icon}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const JobCard = ({ job }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Navigating to job application for job ID:', job.id);
    // Pass original job data if available, otherwise pass the mapped data
    const jobData = job.originalJob || job;
    navigate(`/app/intern/apply-job/${job.id}`, { state: { job: jobData } });
  };

  return (
    <Card sx={{ 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3,
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: theme.shadows[8],
        transform: 'translateY(-4px)',
        borderColor: theme.palette.primary.main
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
      },
      '&:hover::before': {
        opacity: 1
      }
    }}
    onClick={handleCardClick}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="700" sx={{ 
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
              {job.employer?.companyName || job.companyName || job.company}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<LocationOnIcon />} 
                label={job.location} 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: theme.palette.primary.light,
                    color: 'white',
                    borderColor: theme.palette.primary.main
                  }
                }}
              />
              <Chip 
                icon={<AccessTimeIcon />} 
                label={job.type} 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: theme.palette.info.light,
                    color: 'white',
                    borderColor: theme.palette.info.main
                  }
                }}
              />
              <Chip 
                icon={<CurrencyRupeeIcon />} 
                label={job.salary} 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: theme.palette.success.light,
                    color: 'white',
                    borderColor: theme.palette.success.main
                  }
                }}
              />
            </Box>
            
            {job.activelyHiring && (
              <Chip 
                icon={<TrendingUpIcon />}
                label="Actively hiring" 
                color="success" 
                size="small" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    left: 8,
                    animation: 'pulse 2s infinite'
                  }
                }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
            <Avatar 
              src={job.companyLogo} 
              sx={{ 
                width: 56, 
                height: 56, 
                mb: 1,
                border: `2px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'scale(1.1)'
                }
              }}
            >
              <BusinessIcon />
            </Avatar>
          </Box>
        </Box>
        
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={(e) => {
            e.stopPropagation();
            const jobData = job.originalJob || job;
            navigate(`/app/intern/apply-job/${job.id}`, { state: { job: jobData } });
          }}
          sx={{ 
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              bgcolor: theme.palette.primary.main,
              color: 'white',
              transform: 'scale(1.02)'
            }
          }}
        >
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  );
};

const InternLanding = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todoProgress, setTodoProgress] = useState(1); // 1 out of 2 completed
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [slideDirection, setSlideDirection] = useState('left');

  // Auto-slide effect for trending items
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('left');
      setTrendingIndex((prev) => (prev + 1) % trendingItems.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Trending items with images
  const trendingItems = [
    {
      title: "Full Stack Development Program",
      subtitle: "MERN Stack • 6 Month Course • Guaranteed Job Placement",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "white",
      buttonText: "Join Program",
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cloud Computing & DevOps",
      subtitle: "AWS Certification • Docker • Kubernetes • CI/CD Pipeline",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "white", 
      buttonText: "Start Journey",
      icon: <WorkIcon sx={{ fontSize: 60 }} />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Artificial Intelligence & Robotics",
      subtitle: "ChatGPT Integration • Neural Networks • Computer Vision",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textColor: "white",
      buttonText: "Explore AI", 
      icon: <AutoAwesomeIcon sx={{ fontSize: 60 }} />,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cybersecurity Specialist Program",
      subtitle: "Ethical Hacking • Network Security • Blockchain Security",
      bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      textColor: "white",
      buttonText: "Secure Future",
      icon: <TrendingUpIcon sx={{ fontSize: 60 }} />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Mobile App Development", 
      subtitle: "React Native • Flutter • iOS/Android • App Store Publishing",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      textColor: "white",
      buttonText: "Build Apps",
      icon: <StarIcon sx={{ fontSize: 60 }} />,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Sample recommended jobs
  const sampleJobs = [
    {
      id: 1,
      title: "Data Science",
      company: "Placement Course with AI",
      location: "Work From Home",
      type: "Part-time",
      salary: "₹9 LPA",
      activelyHiring: true,
      companyLogo: null
    },
    {
      id: 2,
      title: "Front End Development",
      company: "Taqvia Technologies Private Limited",
      location: "Work From Home",
      type: "Full-time",
      salary: "₹15,000 - 25,000 /month",
      activelyHiring: true,
      companyLogo: null
    },
    {
      id: 3,
      title: "JavaScript Development",
      company: "SurgePv",
      location: "Work From Home",
      type: "Full-time", 
      salary: "₹20,000 - 35,000 /month",
      activelyHiring: true,
      companyLogo: null
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserProfile(),
        fetchRecommendedJobs()
      ]);
    };
    
    loadData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setApiError(null);
      const response = await profileAPI.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setApiError('Failed to load profile data');
      // Set default user data for better UX
      setUser({ firstName: 'User' });
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      setApiError(null);
      const response = await jobAPI.getAllinternship({ 
        page: 1, 
        limit: 6, 
        status: 'active'
      });
      if (response.success && response.data) {
        const jobsData = response.data.map(job => {
          // Calculate salary string
          let salaryStr = 'Not specified';
          if (job.stipend && (job.stipend.min || job.stipend.max)) {
            salaryStr = `₹${(job.stipend.min || 0).toLocaleString('en-IN')} - ₹${(job.stipend.max || 0).toLocaleString('en-IN')}`;
          } else if (job.salary) {
            salaryStr = job.salary.includes('₹') ? job.salary : `₹${job.salary}`;
          }
          
          // Use employer.companyName as primary, fallback to job.company
          const companyName = job.employer?.companyName || job.company || 'Company Name';
          
          return {
            id: job._id,
            _id: job._id,
            title: job.title,
            company: companyName,
            companyName: companyName,
            location: job.location || 'Work From Home',
            type: job.jobType || job.type || 'Full-time',
            jobType: job.jobType || job.type || 'Full-time',
            salary: salaryStr,
            stipend: job.stipend,
            activelyHiring: true,
            companyLogo: job.employer?.avatar || null,
            employer: job.employer,
            description: job.description,
            skills: job.skills,
            requirements: job.requirements,
            // Keep original job data for navigation
            originalJob: job
          };
        });
        setRecommendedJobs(jobsData);
      } else {
        // Fallback to sample jobs if API fails
        setRecommendedJobs(sampleJobs);
      }
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      setApiError('Failed to load jobs data');
      // Fallback to sample jobs for better UX
      setRecommendedJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  };

  const nextTrending = () => {
    setSlideDirection('left');
    setTrendingIndex((prev) => (prev + 1) % trendingItems.length);
  };

  const prevTrending = () => {
    setSlideDirection('right');
    setTrendingIndex((prev) => (prev - 1 + trendingItems.length) % trendingItems.length);
  };

  return (
    <Box sx={{ 
      bgcolor: '#f8fafc', 
      minHeight: '100vh', 
      pt: { xs: 10, sm: 12, md: 14 }, 
      pb: { xs: 2, md: 4 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Welcome Section */}
        <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 0, md: 2 }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography 
            variant="h3" 
            fontWeight="700" 
            sx={{ 
              mb: 1,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Hi, {user?.firstName || 'Raushan'}! 👋
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
          >
            Let's help you land your dream career
          </Typography>
        </Box>


        {/* Company Partners Section with Scrolling Logos */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Partnered with India's Leading Companies
          </Typography>
          
          {/* Scrolling Container */}
          <Box sx={{
            overflow: 'hidden',
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              width: '50px',
              height: '100%',
              zIndex: 2
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(to right, #f8fafc, transparent)'
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, #f8fafc, transparent)'
            }
          }}>
            <Box sx={{
              display: 'flex',
              gap: { xs: 2, sm: 3, md: 4 },
              animation: 'scroll 30s linear infinite',
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' }
              }
            }}>
              {/* First set of companies */}
              {[
                { name: 'Google', color: '#4285f4' },
                { name: 'Microsoft', color: '#00a1f1' },
                { name: 'Amazon', color: '#ff9900' },
                { name: 'Meta', color: '#1877f2' },
                { name: 'Netflix', color: '#e50914' },
                { name: 'Apple', color: '#007aff' },
                { name: 'Spotify', color: '#1db954' },
                { name: 'Tesla', color: '#cc0000' },
                { name: 'Uber', color: '#000000' },
                { name: 'Airbnb', color: '#ff5a5f' },
                // Duplicate for seamless loop
                { name: 'Google', color: '#4285f4' },
                { name: 'Microsoft', color: '#00a1f1' },
                { name: 'Amazon', color: '#ff9900' },
                { name: 'Meta', color: '#1877f2' },
                { name: 'Netflix', color: '#e50914' },
                { name: 'Apple', color: '#007aff' },
                { name: 'Spotify', color: '#1db954' },
                { name: 'Tesla', color: '#cc0000' },
                { name: 'Uber', color: '#000000' },
                { name: 'Airbnb', color: '#ff5a5f' }
              ].map((company, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 40, sm: 50, md: 60 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      borderColor: company.color
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="700"
                    sx={{ 
                      color: company.color,
                      letterSpacing: '0.5px',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {company.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Left Column */}
          <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
            {/* To Do List */}
            <Paper sx={{ 
              p: { xs: 2, sm: 2.5, md: 3 }, 
              mb: { xs: 3, md: 4 }, 
              borderRadius: 3,
              boxShadow: theme.shadows[3]
            }}>
              <Typography 
                variant="h5" 
                fontWeight="600" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                To do list ({todoProgress}/2)
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2, cursor: 'pointer' }} 
                     onClick={() => navigate('/app/intern/profile')}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <DescriptionIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="500">
                      ATS Friendly Resume
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Build your professional resume
                    </Typography>
                  </Box>
                  <ArrowForwardIcon color="action" />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2, cursor: 'pointer' }}
                     onClick={() => navigate('/app/intern/applied-jobs')}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="500">
                      Applied Jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your job applications
                    </Typography>
                  </Box>
                  <ArrowForwardIcon color="action" />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
            {/* Trending Section */}
            <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 0, md: -2 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 2, md: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="h5" 
                  fontWeight="600"
                  sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' } }}
                >
                  Trending on Internshell🔥
                </Typography>
                <Box>
                  <IconButton onClick={prevTrending} size="small">
                    <ArrowBackIcon />
                  </IconButton>
                  <IconButton onClick={nextTrending} size="small">
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                <Slide direction={slideDirection} in timeout={500} key={trendingIndex}>
                  <Box>
                    <TrendingCard {...trendingItems[trendingIndex]} />
                  </Box>
                </Slide>
              </Box>
              
              {/* Dots indicator */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                {trendingItems.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index === trendingIndex ? theme.palette.primary.main : theme.palette.grey[300],
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSlideDirection(index > trendingIndex ? 'left' : 'right');
                      setTrendingIndex(index);
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Recommended Jobs Section */}
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h5" 
            fontWeight="600" 
            sx={{ 
              mb: 1,
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Recommended for you
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, md: 3 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            as per your <Typography component="span" color="primary.main" sx={{ cursor: 'pointer' }}>preferences</Typography>
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {recommendedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default InternLanding;