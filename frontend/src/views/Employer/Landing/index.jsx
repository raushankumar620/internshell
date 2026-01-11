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
  useMediaQuery
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { jobAPI, applicationAPI } from 'services/api';

const EmployerLanding = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    hired: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    '/home.png',
    '/home2.png',
    '/home3.png',
    '/home4.png'
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Fetch employer stats
        const [jobsRes, applicationsRes] = await Promise.all([
          jobAPI.getMyJobs(),
          applicationAPI.getEmployerApplications()
        ]);

        if (jobsRes.success) {
          const jobs = jobsRes.data || [];
          setStats(prev => ({
            ...prev,
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'active').length
          }));
        }

        if (applicationsRes.success) {
          const apps = applicationsRes.data || [];
          setStats(prev => ({
            ...prev,
            totalApplications: apps.length,
            pendingReview: apps.filter(a => a.status === 'pending').length,
            shortlisted: apps.filter(a => a.status === 'shortlisted').length,
            hired: apps.filter(a => a.status === 'hired').length
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const gradientText = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const quickActions = [
    {
      title: 'Post New Internship',
      subtitle: 'Create job listing',
      icon: <AddIcon sx={{ fontSize: 32 }} />,
      color: 'primary',
      path: '/app/employer/post-job',
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    },
    {
      title: 'View Applicants',
      subtitle: 'Review candidates',
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: 'secondary',
      path: '/app/employer/applicants',
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
    },
    {
      title: 'My Internships',
      subtitle: 'Manage postings',
      icon: <WorkIcon sx={{ fontSize: 32 }} />,
      color: 'success',
      path: '/app/employer/my-internship',
      gradient: `linear-gradient(135deg, #10B981 0%, #059669 100%)`
    },
    {
      title: 'Analytics',
      subtitle: 'View insights',
      icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
      color: 'warning',
      path: '/app/employer/analytics',
      gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`
    }
  ];

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Matching',
      description: 'Our smart algorithm finds the perfect candidates for your internship positions automatically.',
      color: theme.palette.primary.main
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Hiring Process',
      description: 'Streamlined workflow helps you hire talented interns 3x faster than traditional methods.',
      color: theme.palette.secondary.main
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Verified Candidates',
      description: 'All candidates are verified students with authentic credentials and portfolios.',
      color: theme.palette.success.main
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our dedicated team is always ready to help you with any hiring needs.',
      color: theme.palette.warning.main
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, #f8faff 50%, ${alpha(theme.palette.secondary.light, 0.3)} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
          zIndex: 0
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 12, md: 14 }, pb: 8 }}>

        {/* ==================== HERO SECTION ==================== */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ mb: { xs: 6, md: 10 } }}>

          {/* Right Side - Image (Mobile First) */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 500"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                >
                  {/* Background Circle */}
                  <defs>
                    <radialGradient id="gradientCircle" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#000000" />
                      <stop offset="60%" stopColor="#000033" />
                      <stop offset="100%" stopColor={theme.palette.primary.main} />
                    </radialGradient>
                  </defs>

                  <circle cx="250" cy="250" r="240" fill="url(#gradientCircle)" />

                  {/* Business Person */}
                  <circle cx="250" cy="110" r="40" fill={theme.palette.primary.main} />
                  <path
                    d="M 190 135 Q 250 160 310 135 L 298 215 L 202 215 Z"
                    fill={theme.palette.primary.main}
                  />

                  {/* Laptop */}
                  <rect x="80" y="150" width="340" height="230" rx="12" fill="#000" />
                  <rect x="92" y="162" width="316" height="190" rx="6" fill="#111" />
                  <rect x="50" y="380" width="400" height="12" rx="6" fill="#333" />

                  {/* Success Badge */}
                  <circle cx="400" cy="180" r="35" fill="#4caf50" />
                  <path
                    d="M 383 180 L 395 192 L 417 160"
                    stroke="#fff"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Images Inside Laptop */}
                  <foreignObject x="92" y="162" width="316" height="190">
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '6px'
                      }}
                    >
                      {images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Slide ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            position: 'absolute',
                            inset: 0,
                            opacity: currentImage === index ? 1 : 0,
                            transition: 'opacity 1s ease-in-out'
                          }}
                        />
                      ))}
                    </div>
                  </foreignObject>
                </svg>
              </Box>
            </motion.div>
          </Grid>

          {/* Left Side - Content */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Greeting */}
                <Chip
                  icon={<RocketLaunchIcon sx={{ fontSize: 18 }} />}
                  label={`Welcome back, ${user?.name || user?.companyName || 'Employer'}! 👋`}
                  sx={{
                    mb: 3,
                    py: 2.5,
                    px: 1,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '& .MuiChip-icon': {
                      color: theme.palette.primary.main
                    }
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                    mb: 1.5,
                    ...gradientText,
                    lineHeight: 1.2,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Find Your Perfect
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Interns Today! 🎯
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    fontWeight: 400,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Connect with talented students, post internships, and build your dream team.
                  Our AI-powered platform makes hiring interns faster and smarter than ever.
                </Typography>

                {/* CTA Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/app/employer/post-job')}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.2, md: 1.5 },
                      borderRadius: 3,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.45)}`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Post Internship
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/app/employer/applicants')}
                    sx={{
                      borderColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.main,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.2, md: 1.5 },
                      borderRadius: 3,
                      borderWidth: 2,
                      background: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Applicants
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* ==================== STATS SECTION ==================== */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {[
              { value: stats.totalJobs, label: 'Total Internships', sublabel: 'Posted by you', color: theme.palette.primary.main },
              { value: stats.totalApplications, label: 'Applications', sublabel: 'Received', color: theme.palette.secondary.main },
              { value: stats.shortlisted, label: 'Shortlisted', sublabel: 'Candidates', color: theme.palette.success.main },
              { value: stats.hired, label: 'Hired', sublabel: 'Interns', color: theme.palette.warning.main }
            ].map((stat, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2.5, md: 4 },
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                      transition: 'all 0.35s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: `0 30px 60px ${alpha(stat.color, 0.25)}`
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 60, md: 80 },
                        height: { xs: 60, md: 80 },
                        borderRadius: '50%',
                        background: alpha(stat.color, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        border: `2px solid ${stat.color}`
                      }}
                    >
                      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: stat.color }}>
                        {loading ? '...' : stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' }, fontWeight: 700 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' }, color: theme.palette.text.secondary }}>
                      {stat.sublabel}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ==================== QUICK ACTIONS ==================== */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  mb: 2,
                  ...gradientText
                }}
              >
                Quick Actions ⚡
              </Typography>
              <Typography
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                Access your most used features with one click
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => navigate(action.path)}
                    sx={{
                      background: action.gradient,
                      color: 'white',
                      borderRadius: 4,
                      cursor: 'pointer',
                      height: '100%',
                      minHeight: { xs: 140, md: 180 },
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`
                      },
                      '&:hover': {
                        boxShadow: `0 20px 40px ${alpha(theme.palette[action.color].main, 0.4)}`
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', md: '1.1rem' }, mb: 0.5 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85, fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {action.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ==================== FEATURES SECTION ==================== */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  mb: 2,
                  ...gradientText
                }}
              >
                Why Hire With Us? 🚀
              </Typography>
              <Typography
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.9rem', md: '1.05rem' },
                  lineHeight: 1.7
                }}
              >
                Join 500+ companies who trust our platform to find talented interns
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(feature.color, 0.1)}`,
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 25px 50px ${alpha(feature.color, 0.2)}`,
                        borderColor: feature.color
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${feature.color}, ${alpha(feature.color, 0.7)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'white',
                        boxShadow: `0 10px 25px ${alpha(feature.color, 0.35)}`
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6, fontSize: '0.9rem' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ==================== CTA SECTION ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 50%)`
              }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '2.2rem' },
                color: 'white',
                mb: 2,
                position: 'relative',
                zIndex: 1
              }}
            >
              Ready to Find Amazing Talent? 🌟
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                position: 'relative',
                zIndex: 1
              }}
            >
              Start posting internships today and connect with thousands of talented students eager to join your team.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              onClick={() => navigate('/app/employer/post-job')}
              sx={{
                background: 'white',
                color: theme.palette.primary.main,
                fontSize: '1rem',
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
};
export default EmployerLanding;
