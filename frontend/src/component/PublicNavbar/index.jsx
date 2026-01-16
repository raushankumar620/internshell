import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  useScrollTrigger,
  Popper,
  Paper,
  Fade,
  ListItemIcon,
  Divider,
  ClickAwayListener,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import ArrowDropDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { authAPI } from 'services/api';

// ==============================|| PUBLIC NAVBAR ||============================== //

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [internshipOpen, setInternshipOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const internshipRef = React.useRef(null);

  // Get user from localStorage on mount and when user changes
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }

    // Listen for user role changes
    window.addEventListener('userRoleChanged', handleUserUpdate);
    return () => window.removeEventListener('userRoleChanged', handleUserUpdate);
  }, []);

  const handleUserUpdate = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    setProfileOpen(false);
    if (user?.role === 'intern') {
      navigate('/app/intern/dashboard');
    } else if (user?.role === 'employer') {
      navigate('/app/employer/dashboard');
    }
  };

  const handleProfileToggle = () => {
    setProfileOpen(!profileOpen);
  };

  const handleInternshipToggle = () => {
    setInternshipOpen(!internshipOpen);
  };

  const handleInternshipNavigation = (path) => {
    setInternshipOpen(false);
    
    if (user?.role === 'employer') {
      // Employer navigation logic
      if (path.includes('type=wfh') || path.includes('type=office') || path === '/internship') {
        navigate('/app/employer/my-internship');
      } else {
        navigate(path);
      }
    } else if (user?.role === 'intern') {
      // Intern navigation logic - view available internships
      if (path === '/internship') {
        navigate('/internships');
      } else {
        navigate('/internships' + path.split('/internship')[1]);
      }
    } else {
      // Non-logged users go to general internship browsing
      navigate(path.replace('/internship', '/internships'));
    }
  };

  // Scroll trigger for navbar background will be defined later in the component

  const menuItems = user ? [
    // Only show Internship for logged-in users - role-based navigation
    { 
      label: 'Internships', 
      path: user.role === 'employer' ? '/app/employer/my-internship' : '/internships'
    }
  ] : [
    // Show all menu items for non-logged-in users
    { label: 'Home', path: '/' },
    { label: 'Internships', path: '/internships' },
    { label: 'About', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blog', path: '/blog' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      // If user is logged in as intern and clicking Home, redirect to intern landing
      if (path === '/' && user && user.role === 'intern') {
        navigate('/app/intern');
      } else {
        navigate(path);
      }
      setMobileOpen(false);
    }, 0);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Enhanced Mobile Slider with smooth animations
  const drawer = (
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      {/* Animated Background Effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {/* Header Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              height: '40px',
              width: 'auto',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) brightness(1.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5)) brightness(1.2)',
                transform: 'scale(1.05)'
              }
            }}
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <IconButton 
            onClick={handleDrawerToggle} 
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              width: 40,
              height: 40,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)'
              }
            }}
          >
            <CloseIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </motion.div>
      </motion.div>
      
      {/* Menu List with staggered animations */}
      <List sx={{ mt: 1, position: 'relative', zIndex: 1, px: 1, flex: 1 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.1 + (index * 0.1), 
              duration: 0.4,
              type: 'spring',
              stiffness: 100
            }}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 2.5,
                  px: 3,
                  borderRadius: 3,
                  borderLeft: isActive(item.path) ? '4px solid white' : '4px solid transparent',
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&::before': {
                      transform: 'translateX(0)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease'
                  }
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: '1.1rem',
                    color: 'white'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
        
        {/* User Profile Section in Mobile */}
        {user && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ marginTop: '20px', paddingBottom: '20px' }}
          >
            <Box sx={{ px: 3, py: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar
                  sx={{
                    width: 45,
                    height: 45,
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    {user?.firstName || user?.name || 'User'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.85rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {user?.role || 'User'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Quick Actions for logged users */}
            <Box sx={{ px: 3 }}>
              <motion.div
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      handleDashboard();
                      setMobileOpen(false);
                    }}
                    sx={{
                      py: 2,
                      px: 3,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <DashboardIcon sx={{ color: 'white', fontSize: '1.3rem' }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'white'
                      }}
                    >
                      Dashboard
                    </Typography>
                  </ListItemButton>
                </Box>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      if (user?.role === 'employer') {
                        navigate('/app/employer/messages');
                      } else if (user?.role === 'intern') {
                        navigate('/app/intern/messages');
                      }
                      setMobileOpen(false);
                    }}
                    sx={{
                      py: 2,
                      px: 3,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    <MessageIcon sx={{ color: 'white', fontSize: '1.3rem' }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: 'white'
                      }}
                    >
                      Messages
                    </Typography>
                  </ListItemButton>
                </Box>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box>
                  <ListItemButton
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    sx={{
                      py: 2,
                      px: 3,
                      borderRadius: 3,
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.3)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ color: '#ff6b6b', fontSize: '1.3rem' }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#ff6b6b'
                      }}
                    >
                      Logout
                    </Typography>
                  </ListItemButton>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
        
        {/* Action Buttons for non-logged users */}
        {!user && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ 
              margin: '20px', 
              marginTop: 'auto',
              paddingBottom: '40px'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleNavigation('/register?role=employer');
                    setMobileOpen(false);
                  }}
                  sx={{
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  For Employers
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleNavigation('/register?role=intern');
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 3,
                    borderWidth: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  For Interns
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </List>
    </motion.div>
  );

  // Scroll trigger for navbar background
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 4 : 2}
        sx={{
          backgroundColor: trigger
            ? '#ffffff'
            : theme.palette.primary.main,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              py: 1.5,
              px: { xs: 0, sm: 2 }
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('/')}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{
                  height: { xs: '35px', md: '45px' },
                  width: 'auto',
                  filter: trigger 
                    ? 'drop-shadow(0 0 8px rgba(25,118,210,0.4)) brightness(1.1)'
                    : 'drop-shadow(0 0 12px rgba(255,255,255,0.6)) brightness(1.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: trigger 
                      ? 'drop-shadow(0 0 15px rgba(25,118,210,0.6)) brightness(1.2) saturate(1.2)'
                      : 'drop-shadow(0 0 20px rgba(255,255,255,0.8)) brightness(1.3) saturate(1.1)',
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </motion.div>

            {/* Desktop Menu - Full Width */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                flex: 1,
                ml: 4
              }}>
                {/* Show menu items only for non-logged users */}
                {!user && (
                  <motion.div 
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => handleNavigation(item.path)}
                          sx={{
                            color: trigger ? theme.palette.text.primary : 'white',
                            fontSize: '1rem',
                            fontWeight: isActive(item.path) ? 700 : 500,
                            px: 2.5,
                            py: 1,
                            borderRadius: 2,
                            position: 'relative',
                            textTransform: 'none',
                            backgroundColor: 'transparent',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            minWidth: 'auto',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: trigger
                                ? 'rgba(25, 118, 210, 0.08)'
                                : 'rgba(255, 255, 255, 0.12)',
                              transform: 'translateY(-1px)',
                            },
                            ...(isActive(item.path) && {
                              backgroundColor: trigger
                                ? 'rgba(25, 118, 210, 0.08)'
                                : 'rgba(255, 255, 255, 0.08)',
                              fontWeight: 600,
                              boxShadow: 'none',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '2px',
                                backgroundColor: trigger ? theme.palette.primary.main : 'white',
                                borderRadius: '1px'
                              }
                            })
                          }}
                        >
                          {item.label}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {/* Action Buttons */}
                {!user && (
                  <motion.div
                    style={{ display: 'flex', gap: '12px', marginLeft: '24px' }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleNavigation('/register?role=employer')}
                        sx={{
                          backgroundColor: trigger ? theme.palette.primary.main : 'transparent',
                          color: trigger ? 'white' : 'white',
                          border: trigger ? 'none' : '1px solid rgba(255, 255, 255, 0.5)',
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: trigger ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: trigger ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: trigger 
                              ? '0 4px 12px rgba(25, 118, 210, 0.4)' 
                              : '0 2px 8px rgba(255, 255, 255, 0.2)',
                          }
                        }}
                      >
                        For Employers
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleNavigation('/register?role=intern')}
                        sx={{
                          backgroundColor: 'transparent',
                          color: trigger ? theme.palette.primary.main : 'white',
                          borderColor: trigger ? theme.palette.primary.main : 'white',
                          borderWidth: '1px',
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: trigger 
                              ? 'rgba(25, 118, 210, 0.08)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderColor: trigger ? theme.palette.primary.dark : 'white',
                            transform: 'translateY(-1px)',
                            boxShadow: trigger 
                              ? '0 2px 8px rgba(25, 118, 210, 0.2)' 
                              : '0 2px 8px rgba(255, 255, 255, 0.2)',
                          }
                        }}
                      >
                        For Interns
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </Box>
            )}

            {/* Desktop Auth Buttons / Profile */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Show internship, message, and profile together for logged users */}
                {user && (
                  <>
                    <ClickAwayListener onClickAway={() => setInternshipOpen(false)}>
                      <Box sx={{ position: 'relative' }}>
                        <Button
                          ref={internshipRef}
                          onClick={handleInternshipToggle}
                          endIcon={<ArrowDropDownIcon sx={{ 
                            transform: internshipOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }} />}
                          sx={{
                            color: trigger ? theme.palette.text.primary : 'white',
                            fontSize: '1rem',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            borderRadius: 3,
                            textTransform: 'none',
                            backgroundColor: internshipOpen ? 
                              (trigger ? 'rgba(25, 118, 210, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 
                              'transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              backgroundColor: trigger
                                ? 'rgba(25, 118, 210, 0.1)'
                                : 'rgba(255, 255, 255, 0.2)',
                              boxShadow: trigger
                                ? '0 4px 20px rgba(25, 118, 210, 0.4)'
                                : '0 4px 20px rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        >
                          Internship
                        </Button>
                        <Popper
                          open={internshipOpen}
                          anchorEl={internshipRef.current}
                          placement="bottom-start"
                          transition
                          disablePortal
                          sx={{ zIndex: 1300 }}
                        >
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                              <Paper
                                sx={{
                                  mt: 1,
                                  minWidth: 220,
                                  borderRadius: 3,
                                  boxShadow: theme.shadows[8],
                                  border: `1px solid ${theme.palette.divider}`,
                                  overflow: 'hidden'
                                }}
                              >
                                <List sx={{ p: 0 }}>
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      onClick={() => handleInternshipNavigation('/internship?type=wfh')}
                                      sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                          backgroundColor: theme.palette.primary.light + '20'
                                        }
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        <HomeWorkIcon color="primary" />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Work From Home"
                                        secondary="Remote opportunities"
                                        primaryTypographyProps={{
                                          fontWeight: 600,
                                          fontSize: '0.95rem'
                                        }}
                                        secondaryTypographyProps={{
                                          fontSize: '0.8rem'
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                  <Divider />
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      onClick={() => handleInternshipNavigation('/internship?type=office')}
                                      sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                          backgroundColor: theme.palette.primary.light + '20'
                                        }
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        <BusinessCenterIcon color="primary" />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Office Based"
                                        secondary="On-site opportunities"
                                        primaryTypographyProps={{
                                          fontWeight: 600,
                                          fontSize: '0.95rem'
                                        }}
                                        secondaryTypographyProps={{
                                          fontSize: '0.8rem'
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                  <Divider />
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      onClick={() => handleInternshipNavigation('/internship')}
                                      sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                          backgroundColor: theme.palette.primary.light + '20'
                                        }
                                      }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        <LocationOnIcon color="primary" />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="All Internships"
                                        secondary="Browse everything"
                                        primaryTypographyProps={{
                                          fontWeight: 600,
                                          fontSize: '0.95rem'
                                        }}
                                        secondaryTypographyProps={{
                                          fontSize: '0.8rem'
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                </List>
                              </Paper>
                            </Fade>
                          )}
                        </Popper>
                      </Box>
                    </ClickAwayListener>
                    
                    <Button
                      onClick={() => {
                        if (user?.role === 'employer') {
                          navigate('/app/employer/messages');
                        } else if (user?.role === 'intern') {
                          navigate('/app/intern/messages');
                        } else {
                          navigate('/messages'); // fallback
                        }
                      }}
                      sx={{
                        color: trigger ? theme.palette.text.primary : 'white',
                        fontSize: '1rem',
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        backgroundColor: 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: trigger
                            ? '0 4px 20px rgba(25, 118, 210, 0.4)'
                            : '0 4px 20px rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      Messages
                    </Button>
                  </>
                )}
                {!user ? null : (
                  <ClickAwayListener onClickAway={() => setProfileOpen(false)}>
                    <Box>
                      <IconButton
                        ref={anchorRef}
                        onClick={handleProfileToggle}
                        sx={{
                          p: 0.5,
                          backgroundColor: trigger
                            ? 'rgba(25, 118, 210, 0.1)'
                            : 'rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: trigger
                              ? 'rgba(25, 118, 210, 0.2)'
                              : 'rgba(255, 255, 255, 0.3)'
                          }
                        }}
                      >
                        <Avatar
                          src={user?.profileImage || user?.avatar}
                          alt={user?.name || user?.companyName || 'User'}
                          sx={{
                            width: 38,
                            height: 38,
                            border: `2px solid ${trigger ? theme.palette.primary.main : 'white'}`,
                            bgcolor: trigger ? theme.palette.primary.main : 'rgba(255,255,255,0.3)',
                            color: trigger ? 'white' : 'white',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          {(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                      <Popper
                        open={profileOpen}
                        anchorEl={anchorRef.current}
                        placement="bottom-end"
                        transition
                        disablePortal
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper
                              sx={{
                                boxShadow: theme.shadows[8],
                                mt: 1.5,
                                minWidth: 220,
                                zIndex: 1300
                              }}
                            >
                              <List sx={{ py: 0 }}>
                                <ListItem disablePadding>
                                  <ListItemButton
                                    onClick={handleDashboard}
                                    sx={{
                                      py: 1.5,
                                      '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                      }
                                    }}
                                  >
                                    <ListItemIcon>
                                      <DashboardIcon sx={{ fontSize: '1.25rem' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                  </ListItemButton>
                                </ListItem>
                                {user?.role === 'intern' && (
                                  <ListItem disablePadding>
                                    <ListItemButton
                                      onClick={() => {
                                        setProfileOpen(false);
                                        navigate('/app/intern/applied-internship');
                                      }}
                                      sx={{
                                        py: 1.5,
                                        '&:hover': {
                                          backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                        }
                                      }}
                                    >
                                      <ListItemIcon>
                                        <WorkIcon sx={{ fontSize: '1.25rem' }} />
                                      </ListItemIcon>
                                      <ListItemText primary="My Applications" />
                                    </ListItemButton>
                                  </ListItem>
                                )}
                                <Divider sx={{ my: 0 }} />
                                <ListItem disablePadding>
                                  <ListItemButton
                                    onClick={handleLogout}
                                    sx={{
                                      py: 1.5,
                                      '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.04)'
                                      }
                                    }}
                                  >
                                    <ListItemIcon>
                                      <LogoutIcon sx={{ fontSize: '1.25rem', color: theme.palette.error.main }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Logout"
                                      primaryTypographyProps={{
                                        sx: { color: theme.palette.error.main }
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              </List>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </Box>
                  </ClickAwayListener>
                )}
              </Box>
            )}

            {/* Enhanced Mobile Menu Icon */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20 
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{
                      color: trigger ? theme.palette.text.primary : 'white',
                      backgroundColor: trigger 
                        ? 'rgba(25, 118, 210, 0.1)' 
                        : 'rgba(255, 255, 255, 0.15)',
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: `1px solid ${trigger 
                        ? 'rgba(25, 118, 210, 0.2)' 
                        : 'rgba(255, 255, 255, 0.2)'}`,
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        backgroundColor: trigger 
                          ? 'rgba(25, 118, 210, 0.2)' 
                          : 'rgba(255, 255, 255, 0.25)',
                        borderColor: trigger 
                          ? 'rgba(25, 118, 210, 0.4)' 
                          : 'rgba(255, 255, 255, 0.4)',
                        boxShadow: trigger 
                          ? '0 8px 25px rgba(25, 118, 210, 0.3)' 
                          : '0 8px 25px rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)'
                      },
                      '&:active': {
                        transform: 'translateY(0px) scale(0.95)'
                      }
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: mobileOpen ? 180 : 0,
                        scale: mobileOpen ? 1.1 : 1
                      }}
                      transition={{ 
                        duration: 0.3,
                        type: 'spring',
                        stiffness: 200 
                      }}
                    >
                      <MenuIcon sx={{ 
                        fontSize: '1.8rem',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }} />
                    </motion.div>
                  </IconButton>
                </motion.div>
              </motion.div>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Slider with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Custom Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
                zIndex: 1200
              }}
              onClick={handleDrawerToggle}
            />
            
            {/* Animated Slider */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween',
                duration: 0.3,
                ease: 'easeInOut'
              }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '80vw',
                maxWidth: 320,
                zIndex: 1300,
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              {drawer}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicNavbar;