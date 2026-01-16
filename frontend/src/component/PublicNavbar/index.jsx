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

  // Scroll trigger for navbar background
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50
  });

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

  // Mobile Drawer
  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-10%, -10%)' },
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            color: 'white',
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Internshell 
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            width: 40,
            height: 40,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'rotate(90deg)',
            }
          }}
        >
          <CloseIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>
      <List sx={{ mt: 1, position: 'relative', zIndex: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem 
            key={item.label} 
            disablePadding
            sx={{
              animation: `slideIn 0.2s ease-out ${index * 0.05}s both`,
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateX(20px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 2,
                px: 3,
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                borderLeft: isActive(item.path) ? '4px solid white' : '4px solid transparent',
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  transform: 'translateX(5px)',
                  '&::before': {
                    transform: 'translateX(0)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.4s ease',
                }
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '1.05rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  letterSpacing: '0.5px'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          width: '100%', 
          p: 3,
          background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
          backdropFilter: 'blur(5px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}
      >
        {!user ? (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNavigation('/register?role=employer')}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                py: 2,
                mb: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)'
                }
              }}
            >
              For Employers
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNavigation('/register?role=intern')}
              sx={{
                color: 'white',
                borderColor: 'white',
                py: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                borderWidth: 2,
                borderRadius: 3,
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                }
              }}
            >
              For Interns
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                handleDashboard();
                setMobileOpen(false);
              }}
              sx={{
                mb: 2,
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                py: 1.75,
                fontWeight: 700,
                fontSize: '1.05rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
                }
              }}
            >
              Dashboard
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                py: 1.75,
                fontWeight: 700,
                fontSize: '1.05rem',
                borderWidth: 2,
                borderRadius: 2,
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
                }
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

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
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  background: trigger
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: trigger ? 'none' : '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Internshell
              </Typography>
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

            {/* Mobile Menu Icon */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: trigger 
                        ? 'rgba(25, 118, 210, 0.2)' 
                        : 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.05)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    }
                  }}
                >
                  <motion.div
                    animate={{ rotate: mobileOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MenuIcon sx={{ fontSize: '1.8rem' }} />
                  </motion.div>
                </IconButton>
              </motion.div>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.3)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }
        }}
        transitionDuration={{
          enter: 250,
          exit: 200
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default PublicNavbar;