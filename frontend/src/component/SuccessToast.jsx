import React from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@emotion/react';

// Smooth slide in animation from top
const slideIn = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const checkPop = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const SuccessToast = ({ open, onClose, message = 'Login Successful!' }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        mt: 3,
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{
          animation: `${slideIn} 0.4s ease-out`,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          minWidth: '280px',
          py: 1.5,
          px: 2,
          '& .MuiAlert-icon': {
            display: 'none',
          },
          '& .MuiAlert-action': {
            pt: 0,
            alignItems: 'center',
          },
          '& .MuiAlert-message': {
            padding: 0,
            width: '100%',
          },
        }}
        icon={false}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${checkPop} 0.5s ease-out 0.2s both`,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 22, color: 'white' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                lineHeight: 1.3,
              }}
            >
              {message} 
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.8rem',
                mt: 0.25,
              }}
            >
              Welcome back!... 😊
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default SuccessToast;
