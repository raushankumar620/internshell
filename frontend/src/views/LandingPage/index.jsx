import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  TextField,
  IconButton,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import PublicNavbar from '../../component/PublicNavbar';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LoginIcon from '@mui/icons-material/Login';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {
  Facebook,
  LinkedIn,
  Instagram,
  Twitter,
  Business,
  School,
  VerifiedUser,
  FlashOn,
  TrackChanges,
  WorkspacePremium,
  Stars
} from '@mui/icons-material';
import { jobAPI } from '../../services/api';

// Premium Color Palette
const colors = {
  primary: {
    main: '#2563EB',      // Royal Blue
    light: '#3B82F6',
    dark: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
  },
  secondary: {
    main: '#7C3AED',      // Violet
    light: '#8B5CF6',
    dark: '#6D28D9',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
  },
  accent: {
    teal: '#14B8A6',
    orange: '#F97316',
    pink: '#EC4899',
    emerald: '#10B981'
  },
  background: {
    light: '#F8FAFC',
    gradient: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 25%, #F0FDFA 50%, #FDF4FF 75%, #FEF3C7 100%)'
  }
};


// ==============================|| LANDING PAGE ||============================== //
const testimonials = [
  {
    name: 'Aayush Sharma',
    role: 'Student Intern',
    message:
      'This platform helped me secure my first internship quickly and smoothly.',
    avatar: '/testimonials/testonomials1.webp'
  },
  {
    name: 'Neha Verma',
    role: 'HR Manager',
    message:
      'Finding skilled interns has never been this easy and efficient.',
    avatar: '/testimonials/testonomials2.jpg'
  },
  {
    name: 'Shivam Mehta',
    role: 'Startup Founder',
    message:
      'A reliable internship platform focused on real skills and growth.',
    avatar: '/testimonials/testonomials3.avif'
  }
];



const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Image slideshow state
  const [currentImage, setCurrentImage] = useState(0);

  // Recent internship state
  const [recentinternship, setRecentinternship] = useState([]);
  const [loadinginternship, setLoadinginternship] = useState(false);

  // Scroll progress state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const images = [
    '/home.png',
    '/home2.png',
    '/home3.png',
    '/home4.png'
  ];

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollIndicator(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top/bottom function
  const handleScrollClick = () => {
    if (scrollProgress > 90) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch recentjobs
  useEffect(() => {
    const fetchRecentinternship = async () => {
      setLoadinginternship(true);
      try {
        const response = await jobAPI.getAllinternship({
          limit: 6,
          page: 1,
          sort: '-createdAt' // Get latestjobs first
        });
        if (response.success) {
          setRecentinternship(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch recentjobs:', error);
      } finally {
        setLoadinginternship(false);
      }
    };
    fetchRecentinternship();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background.gradient,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(ellipse at 30% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(124, 58, 237, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      {/* Public Navbar */}
      <PublicNavbar />

      {/* Scroll Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: showScrollIndicator ? 1 : 0, x: showScrollIndicator ? 0 : 50 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          right: isMobile ? 15 : 30,
          bottom: isMobile ? 80 : 100,
          zIndex: 1000,
          pointerEvents: showScrollIndicator ? 'auto' : 'none'
        }}
      >
        <Box
          onClick={handleScrollClick}
          sx={{
            position: 'relative',
            width: { xs: 55, md: 65 },
            height: { xs: 55, md: 65 },
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {/* Circular Progress Background */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(37, 99, 235, 0.1)'
            }}
          />
          
          {/* SVG Circular Progress */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: 'rotate(-90deg)'
            }}
          >
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary.main} />
                <stop offset="100%" stopColor={colors.secondary.main} />
              </linearGradient>
            </defs>
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(37, 99, 235, 0.1)"
              strokeWidth="4"
            />
            {/* Progress Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - scrollProgress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.1s ease' }}
            />
          </svg>

          {/* Center Content - Arrow & Percentage */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ 
                rotate: scrollProgress > 90 ? 180 : 0,
                y: scrollProgress > 90 ? 0 : [0, 3, 0]
              }}
              transition={{ 
                rotate: { duration: 0.3 },
                y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <Box
                sx={{
                  width: { xs: 28, md: 34 },
                  height: { xs: 28, md: 34 },
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                }}
              >
                <KeyboardArrowDownIcon 
                  sx={{ 
                    fontSize: { xs: 20, md: 24 }, 
                    color: '#fff'
                  }} 
                />
              </Box>
            </motion.div>
            <Typography
              sx={{
                fontSize: { xs: '0.6rem', md: '0.7rem' },
                fontWeight: 800,
                mt: 0.5,
                background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}
            >
              {Math.round(scrollProgress)}%
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Right Side - Image (Mobile First) */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
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
                  {/* ================= BACKGROUND ================= */}
                  <defs>
                    <radialGradient id="gradientCircle" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1E1B4B" />
                      <stop offset="40%" stopColor="#312E81" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </radialGradient>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  <circle cx="250" cy="250" r="240" fill="url(#gradientCircle)" />
                  <circle cx="250" cy="250" r="245" fill="none" stroke="url(#glowGradient)" strokeWidth="3" opacity="0.5" />

                  {/* ================= PERSON ================= */}
                  <circle cx="250" cy="110" r="40" fill="#7C3AED" />
                  <path
                    d="M 190 135 Q 250 160 310 135 L 298 215 L 202 215 Z"
                    fill="#7C3AED"
                  />

                  {/* ================= LAPTOP ================= */}
                  <rect x="80" y="150" width="340" height="230" rx="16" fill="#0F172A" />
                  <rect x="92" y="162" width="316" height="190" rx="8" fill="#1E293B" />
                  <rect x="50" y="380" width="400" height="14" rx="7" fill="#334155" />

                  {/* ================= SUCCESS BADGE ================= */}
                  <circle cx="400" cy="180" r="35" fill="#10B981" />
                  <circle cx="400" cy="180" r="40" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5" />
                  <path
                    d="M 383 180 L 395 192 L 417 160"
                    stroke="#fff"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* ================= IMAGES INSIDE LAPTOP ================= */}
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

          {/* Left Side - Content (Mobile Second) */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 0.8,
                      mb: 3,
                      borderRadius: '50px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 18, color: colors.primary.main }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.primary.main }}>
                      #1 Internship Platform in India
                    </Typography>
                  </Box>
                </motion.div>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem', lg: '3.8rem' },
                      mb: { xs: 1, md: 1.5 },
                      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.15,
                      textAlign: { xs: 'center', md: 'left' },
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Launch Your Career
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem', lg: '3.8rem' },
                      mb: { xs: 2, md: 3 },
                      background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.accent.teal} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.15,
                      textAlign: { xs: 'center', md: 'left' },
                      letterSpacing: '-0.02em'
                    }}
                  >
                    With Top Internship
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 3, md: 4 },
                      color: '#64748B',
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 1.7,
                      fontWeight: 400,
                      maxWidth: '540px',
                      mx: { xs: 'auto', md: 0 },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    Connect with 500+ top companies, discover internships that match your skills, and gain hands-on industry experience. Start building your professional future today.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/register')}
                      sx={{
                        background: colors.primary.gradient,
                        color: 'white',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        px: { xs: 3, md: 4 },
                        py: { xs: 1.2, md: 1.5 },
                        borderRadius: '50px',
                        fontWeight: 600,
                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                        flex: { xs: '1 1 auto', sm: '0 1 auto' },
                        minWidth: { xs: '45%', sm: 'auto' },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 35px rgba(37, 99, 235, 0.45)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Get Started Free
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<WorkIcon />}
                      onClick={() => navigate('/internship')}
                      sx={{
                        color: colors.secondary.main,
                        borderColor: colors.secondary.main,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        px: { xs: 3, md: 4 },
                        py: { xs: 1.2, md: 1.5 },
                        borderRadius: '50px',
                        fontWeight: 600,
                        borderWidth: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        flex: { xs: '1 1 auto', sm: '0 1 auto' },
                        minWidth: { xs: '45%', sm: 'auto' },
                        '&:hover': {
                          borderColor: colors.secondary.dark,
                          backgroundColor: 'rgba(124, 58, 237, 0.08)',
                          borderWidth: 2,
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 25px rgba(124, 58, 237, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Browse Internships
                    </Button>
                  </Box>

                  {/* Trust Indicators */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedIcon sx={{ color: colors.accent.emerald, fontSize: 20 }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>Verified Companies</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: colors.accent.orange, fontSize: 20 }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>4.9/5 Rating</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>

        </Grid>

        {/* ================= STATS SECTION ================= */}
        <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">

            {/* ================= STAT CARD 1 ================= */}
            <Grid item xs={6} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2.5, md: 4 },
                    height: '100%',
                    borderRadius: { xs: 3, md: 4 },
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(37, 99, 235, 0.2)',
                      borderColor: colors.primary.main
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 70, md: 90 },
                      height: { xs: 70, md: 90 },
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${colors.primary.light}20 0%, ${colors.primary.main}15 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '24px',
                        background: colors.primary.gradient,
                        opacity: 0.15
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2.2rem' }, fontWeight: 800, color: colors.primary.main }}>
                      10K+
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                    Internships
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#64748B' }}>
                    Available opportunities
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* ================= STAT CARD 2 ================= */}
            <Grid item xs={6} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2.5, md: 4 },
                    height: '100%',
                    borderRadius: { xs: 3, md: 4 },
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(124, 58, 237, 0.08)',
                    border: '1px solid rgba(124, 58, 237, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(124, 58, 237, 0.2)',
                      borderColor: colors.secondary.main
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 70, md: 90 },
                      height: { xs: 70, md: 90 },
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${colors.secondary.light}20 0%, ${colors.secondary.main}15 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '24px',
                        background: colors.secondary.gradient,
                        opacity: 0.15
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2.2rem' }, fontWeight: 800, color: colors.secondary.main }}>
                      500+
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                    Companies
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#64748B' }}>
                    Trusted partners
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* ================= STAT CARD 3 ================= */}
            <Grid item xs={6} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2.5, md: 4 },
                    height: '100%',
                    borderRadius: { xs: 3, md: 4 },
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(16, 185, 129, 0.2)',
                      borderColor: colors.accent.emerald
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 70, md: 90 },
                      height: { xs: 70, md: 90 },
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '24px',
                        background: `linear-gradient(135deg, ${colors.accent.emerald} 0%, ${colors.accent.teal} 100%)`,
                        opacity: 0.15
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2.2rem' }, fontWeight: 800, color: colors.accent.emerald }}>
                      95%
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                    Success Rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#64748B' }}>
                    Student satisfaction
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* ================= STAT CARD 4 ================= */}
            <Grid item xs={6} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2.5, md: 4 },
                    height: '100%',
                    borderRadius: { xs: 3, md: 4 },
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(249, 115, 22, 0.08)',
                    border: '1px solid rgba(249, 115, 22, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(249, 115, 22, 0.2)',
                      borderColor: colors.accent.orange
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 70, md: 90 },
                      height: { xs: 70, md: 90 },
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '24px',
                        background: `linear-gradient(135deg, ${colors.accent.orange} 0%, ${colors.accent.pink} 100%)`,
                        opacity: 0.15
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2.2rem' }, fontWeight: 800, color: colors.accent.orange }}>
                      24/7
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                    Support
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#64748B' }}>
                    Dedicated assistance
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

          </Grid>
        </Box>
        {/* ================= ENHANCED ABOUT SECTION ================= */}
        <Box sx={{ mt: { xs: 5, md: 8 }, mb: { xs: 5, md: 8 }, position: 'relative' }}>
          {/* Background Decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.03) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 0
            }}
          />

          {/* Section Heading - Centered like Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
              <Chip
                label="Why Choose Us"
                sx={{
                  mb: 2,
                  px: 2,
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: colors.primary.main,
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.8rem', md: '2.8rem' },
                  mb: 2,
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Connecting Employers & Future Interns
              </Typography>
              <Typography
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  px: { xs: 2, md: 0 },
                  color: '#64748B',
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: 1.7
                }}
              >
                Our platform seamlessly bridges the gap between talented students and leading companies,
                making the internship journey smooth, transparent, and rewarding for everyone.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Feature Card 1 */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 5 },
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(37, 99, 235, 0.1)',
                    boxShadow: '0 20px 50px rgba(37, 99, 235, 0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: colors.primary.gradient
                    },
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 30px 60px rgba(37, 99, 235, 0.15)',
                      borderColor: colors.primary.main
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      background: colors.primary.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <Business sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1E293B', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                    For Employers
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748B', mb: 3, lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                    Post internships, manage applications efficiently, and discover skilled candidates
                    who match your requirements. Streamline your hiring process with our ATS system.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['Post Unlimited Internships', 'Smart ATS System', 'Real-time Messaging'].map((text, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '6px',
                            background: `rgba(37, 99, 235, 0.1)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <VerifiedIcon sx={{ fontSize: 14, color: colors.primary.main }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Feature Card 2 */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 5 },
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,245,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(124, 58, 237, 0.1)',
                    boxShadow: '0 20px 50px rgba(124, 58, 237, 0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: colors.secondary.gradient
                    },
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 30px 60px rgba(124, 58, 237, 0.15)',
                      borderColor: colors.secondary.main
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      background: colors.secondary.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    <School sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1E293B', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                    For Students
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748B', mb: 3, lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                    Explore verified internship opportunities, apply with one click, and gain real-world
                    industry experience that kickstarts your career journey.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['Verified Opportunities', 'One-Click Apply', 'Skill Matching'].map((text, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '6px',
                            background: `rgba(124, 58, 237, 0.1)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <VerifiedIcon sx={{ fontSize: 14, color: colors.secondary.main }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

          </Grid>


        </Box>

    

        {/* ================= TESTIMONIAL SECTION ================= */}
        <Box sx={{ py: { xs: 6, md: 12 }, mb: { xs: 6, md: 12 }, overflow: 'hidden', position: 'relative' }}>
          {/* Background Decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
              zIndex: 0
            }}
          />

          {/* Heading */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
            <Chip
              label="Testimonials"
              sx={{
                mb: 2,
                px: 2,
                background: 'rgba(124, 58, 237, 0.1)',
                color: colors.secondary.main,
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            />
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.8rem', md: '2.8rem' },
                mb: 2,
                px: { xs: 2, md: 0 },
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Loved by Interns & Employers
            </Typography>

            <Typography
              align="center"
              sx={{
                color: '#64748B',
                mb: { xs: 4, md: 8 },
                maxWidth: 600,
                mx: 'auto',
                px: { xs: 2, md: 0 },
                fontSize: { xs: '0.95rem', md: '1.05rem' }
              }}
            >
              Real stories from people who trust our internship platform
            </Typography>
          </Box>

          {/* Auto Scroll */}
          <motion.div
            style={{ display: 'flex', gap: '28px', paddingLeft: '20px' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: { xs: 300, md: 360 },
                  maxWidth: { xs: 300, md: 360 },
                  p: { xs: 3, md: 4 },
                  borderRadius: '24px',
                  background: index % 2 === 0
                    ? `linear-gradient(145deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`
                    : `linear-gradient(145deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
                  color: '#fff',
                  boxShadow: index % 2 === 0
                    ? '0 20px 50px rgba(37, 99, 235, 0.3)'
                    : '0 20px 50px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '"\'"',
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    fontSize: '120px',
                    fontFamily: 'Georgia, serif',
                    opacity: 0.1,
                    color: '#fff',
                    lineHeight: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    boxShadow: index % 2 === 0
                      ? '0 30px 60px rgba(37, 99, 235, 0.4)'
                      : '0 30px 60px rgba(124, 58, 237, 0.4)'
                  }
                }}
              >
                {/* Stars */}
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: 20, color: '#FFD700' }} />
                  ))}
                </Box>

                {/* Message */}
                <Typography sx={{ fontStyle: 'italic', fontSize: '1rem', opacity: 0.95, mb: 3, lineHeight: 1.7 }}>
                  "{item.message}"
                </Typography>

                {/* Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={item.avatar}
                    alt={item.name}
                    sx={{
                      width: 52,
                      height: 52,
                      border: '3px solid rgba(255,255,255,0.3)',
                      mr: 2
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      {item.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </motion.div>
        </Box>

        {/* ================= RECENT INTERNSHIPS SECTION ================= */}
        <Box sx={{ mt: { xs: 5, md: 8 }, mb: { xs: 5, md: 8 }, position: 'relative' }}>
          <Container maxWidth="lg">
            {/* Section Heading */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
              <Chip
                label="Latest Opportunities"
                sx={{
                  mb: 2,
                  px: 2,
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: colors.accent.emerald,
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.8rem', md: '2.8rem' },
                  mb: 2,
                  px: { xs: 2, md: 0 },
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Recent Internship Opportunities
              </Typography>
              <Typography
                sx={{
                  maxWidth: 650,
                  mx: 'auto',
                  px: { xs: 2, md: 0 },
                  color: '#64748B',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  mb: 2
                }}
              >
                Explore the latest internships and job opportunities from top companies
              </Typography>
            </Box>

            {/* Internships Grid */}
            {loadinginternship ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: colors.primary.main }} />
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {recentinternship.slice(0, 6).map((job, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={job._id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '20px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(37, 99, 235, 0.08)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: index % 3 === 0
                              ? colors.primary.gradient
                              : index % 3 === 1
                                ? colors.secondary.gradient
                                : `linear-gradient(135deg, ${colors.accent.emerald} 0%, ${colors.accent.teal} 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          },
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.12)',
                            borderColor: colors.primary.light,
                            '&::before': {
                              opacity: 1
                            }
                          }
                        }}
                        onClick={() => navigate('/internship')}
                      >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          {/* Company Name */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            {job.employer?.avatar ? (
                              <Avatar
                                src={job.employer.avatar}
                                alt={job.company}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '10px',
                                  border: '2px solid rgba(37, 99, 235, 0.1)'
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '10px',
                                  background: `linear-gradient(135deg, ${colors.primary.light}20 0%, ${colors.primary.main}15 100%)`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid rgba(37, 99, 235, 0.1)'
                                }}
                              >
                                <Business sx={{ fontSize: 20, color: colors.primary.main }} />
                              </Box>
                            )}
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: colors.primary.main
                              }}
                            >
                              {job.employer?.companyName || job.company}
                            </Typography>
                          </Box>

                          {/* Job Title */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: '1.05rem', md: '1.15rem' },
                              mb: 2,
                              color: '#1E293B',
                              lineHeight: 1.4
                            }}
                          >
                            {job.title}
                          </Typography>

                          {/* Job Details */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <LocationOnIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                                {job.location}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <WorkIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                                {job.jobType || 'Full Time'}
                              </Typography>
                            </Box>

                            {job.salary && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AttachMoneyIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                                  {job.salary}
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Skills */}
                          {job.skills && job.skills.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                              {job.skills.slice(0, 3).map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  sx={{
                                    background: idx === 0
                                      ? `rgba(37, 99, 235, 0.1)`
                                      : idx === 1
                                        ? `rgba(124, 58, 237, 0.1)`
                                        : `rgba(16, 185, 129, 0.1)`,
                                    color: idx === 0
                                      ? colors.primary.main
                                      : idx === 1
                                        ? colors.secondary.main
                                        : colors.accent.emerald,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    border: 'none'
                                  }}
                                />
                              ))}
                              {job.skills.length > 3 && (
                                <Chip
                                  label={`+${job.skills.length - 3}`}
                                  size="small"
                                  sx={{
                                    background: '#F1F5F9',
                                    color: '#64748B',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              )}
                            </Box>
                          )}

                          {/* Apply Button */}
                          <Box sx={{ mt: 'auto' }}>
                            <Button
                              variant="contained"
                              fullWidth
                              endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                              sx={{
                                borderRadius: '12px',
                                py: 1.2,
                                background: colors.primary.gradient,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)'
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* View All Internships Button */}
            <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 8 } }}>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/internship')}
                sx={{
                  px: { xs: 4, md: 6 },
                  py: 1.5,
                  borderRadius: '50px',
                  borderWidth: 2,
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    background: `rgba(37, 99, 235, 0.05)`,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                View All Internships
              </Button>
            </Box>

          </Container>
        </Box>

            {/* ================= CONTACT SECTION ================= */}
        <Box
          sx={{
            mt: { xs: 5, md: 8 },
            mb: { xs: 5, md: 8 },
            position: 'relative',
            py: { xs: 8, md: 12 }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            {/* ===== Section Heading ===== */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
              <Chip
                label="Contact Us"
                sx={{
                  mb: 2,
                  px: 2,
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: colors.primary.main,
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.8rem', md: '2.8rem' },
                  mb: 2,
                  px: { xs: 2, md: 0 },
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Get in Touch With Us
              </Typography>

              <Typography
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  px: { xs: 2, md: 0 },
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  color: '#64748B',
                  lineHeight: 1.7
                }}
              >
                Whether you're an intern looking for opportunities or an employer
                searching for talent, we're here to help you.
              </Typography>
            </Box>

            {/* ===== Content ===== */}
            <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">

              {/* ================= LEFT : FORM ================= */}
              <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                <motion.div
                  style={{ width: '100%' }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, md: 5 },
                      width: '100%',
                      height: '100%',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 50px rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 25px 60px rgba(37, 99, 235, 0.15)',
                        borderColor: colors.primary.main
                      }
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1E293B', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                      Send Us a Message
                    </Typography>

                    <Typography sx={{ color: '#64748B', mb: 4, fontSize: '0.95rem' }}>
                      Fill out the form and our team will get back to you shortly.
                    </Typography>

                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': { borderColor: colors.primary.main },
                              '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': { borderColor: colors.primary.main },
                              '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': { borderColor: colors.primary.main },
                              '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={4}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': { borderColor: colors.primary.main },
                              '&.Mui-focused fieldset': { borderColor: colors.primary.main }
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Button aligned bottom */}
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 4,
                          px: 5,
                          py: 1.5,
                          borderRadius: '50px',
                          background: colors.primary.gradient,
                          fontWeight: 600,
                          fontSize: '1rem',
                          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                            boxShadow: '0 12px 35px rgba(37, 99, 235, 0.45)'
                          }
                        }}
                      >
                        Send Message
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              {/* ================= RIGHT : INFO ================= */}
              <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                <motion.div
                  style={{ width: '100%' }}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, md: 5 },
                      width: '100%',
                      height: '100%',
                      borderRadius: '24px',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(250,245,255,0.9) 100%)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 50px rgba(124, 58, 237, 0.08)',
                      border: '1px solid rgba(124, 58, 237, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 25px 60px rgba(124, 58, 237, 0.15)',
                        borderColor: colors.secondary.main
                      }
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.3rem', md: '1.5rem' }, color: '#1E293B' }}>
                      Contact Information
                    </Typography>

                    <Typography sx={{ color: '#64748B', mb: 4, fontSize: '0.95rem', lineHeight: 1.7 }}>
                      Our team is always ready to support interns and employers
                      with any queries related to internships or hiring.
                    </Typography>

                    {/* Info Blocks */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'rgba(37, 99, 235, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <LocationOnIcon sx={{ color: colors.primary.light }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, mb: 0.5, color: '#1E293B' }}>Address</Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                            1-A Prem Nagar, Thana Sanganer, Jaipur 302029
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'rgba(124, 58, 237, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.secondary.light} strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, mb: 0.5, color: '#1E293B' }}>Email</Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                            support@internshell.com
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.accent.emerald} strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, mb: 0.5, color: '#1E293B' }}>Phone</Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                            +91 8384935940
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Social */}
                    <Box sx={{ mt: 'auto' }}>
                      <Typography sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>
                        Connect With Us
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {[Facebook, LinkedIn, Instagram, Twitter].map((Icon, i) => (
                          <IconButton
                            key={i}
                            sx={{
                              color: '#fff',
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: i === 0
                                ? '#3B5998'
                                : i === 1
                                  ? '#0077B5'
                                  : i === 2
                                    ? 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)'
                                    : '#1DA1F2',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            <Icon />
                          </IconButton>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
      {/* Footer */}
    </Box>
  );
};

export default LandingPage;