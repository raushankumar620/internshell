import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, Paper, Avatar } from '@mui/material';
import { keyframes } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

// Enhanced animations for professional look
const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -40%) scale(0.7);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const successCheckAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

const gradientBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const floatEffect = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const LoginSuccessPopup = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const getUserIcon = () => {
    if (userData?.role === 'employer') {
      return <BusinessIcon sx={{ fontSize: 32, color: 'white' }} />;
    } else if (userData?.role === 'intern') {
      return <PersonIcon sx={{ fontSize: 32, color: 'white' }} />;
    }
    return <PersonIcon sx={{ fontSize: 32, color: 'white' }} />;
  };

  const getRoleDisplayText = () => {
    if (userData?.role === 'employer') {
      return 'Employer Portal';
    } else if (userData?.role === 'intern') {
      return 'Intern Portal';
    }
    return 'Dashboard';
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: { xs: 320, sm: 400 },
          minHeight: 280,
          textAlign: 'center',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95))',
          backdropFilter: 'blur(20px)',
          animation: `${slideInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          border: '1px solid',
          borderImage: 'linear-gradient(45deg, #4CAF50, #2196F3, #9C27B0) 1',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: `${shimmerEffect} 2s infinite`,
            pointerEvents: 'none',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            padding: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            height: '100%',
          }}
        >
          {/* Animated Success Icon */}
          <Box
            sx={{
              position: 'relative',
              animation: `${floatEffect} 3s ease-in-out infinite`,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
                animation: `${successCheckAnimation} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both`,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
            </Avatar>
            
            {/* Success Ripple Effect */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '2px solid #4CAF50',
                opacity: 0,
                animation: `${successCheckAnimation} 1s ease-out 0.5s infinite`,
              }}
            />
          </Box>

          {/* Success Message */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mb: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Welcome Back!
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(0, 0, 0, 0.8)',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              Login Successful
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.9rem',
                mb: 2,
              }}
            >
              Redirecting to {getRoleDisplayText()}...
            </Typography>
          </Box>

          {/* User Role Badge */}
          {userData && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '20px',
                background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(76, 175, 80, 0.1))',
                border: '1px solid rgba(33, 150, 243, 0.2)',
              }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
                }}
              >
                {getUserIcon()}
              </Avatar>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: '0.8rem',
                }}
              >
                {userData.role || 'User'}
              </Typography>
            </Box>
          )}

          {/* Loading Indicator */}
          <Box
            sx={{
              width: 60,
              height: 4,
              borderRadius: 2,
              background: 'rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
                animation: `${shimmerEffect} 1.5s ease-in-out infinite`,
              }
            }}
          />
        </Box>
      </Paper>
    </Modal>
  );
};

export default LoginSuccessPopup;