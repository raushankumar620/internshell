import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// icons
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const AuthDemo = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <ToggleOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Seamless Toggle',
      description: 'Switch between login and signup with smooth animations'
    },
    {
      icon: <TouchAppIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Interactive Design',
      description: 'Material UI components with engaging hover effects'
    },
    {
      icon: <LoginIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Modern Authentication',
      description: 'Beautiful form validation with Google OAuth integration'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
      py: 8
    }}>
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              textAlign="center"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2
              }}
            >
              Modern Auth Toggle
            </Typography>
            <Typography
              variant="h5"
              textAlign="center"
              color="textSecondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Experience the beautiful Material UI styled login and signup form with smooth toggle animations
            </Typography>
          </motion.div>

          {/* Features */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Paper
                    component={motion.div}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: `0 20px 40px ${theme.palette.primary.main}20` 
                    }}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/auth')}
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 4,
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 15px 35px ${theme.palette.primary.main}50`
                }
              }}
            >
              Try the Auth Toggle
            </Button>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{ width: '100%' }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Features Included:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Material UI styled components with custom theming
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Framer Motion animations for smooth transitions
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Form validation using Formik and Yup
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Google OAuth integration
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Responsive design for all screen sizes
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Modern glassmorphism design elements
                </Typography>
              </Stack>
            </Paper>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default AuthDemo;