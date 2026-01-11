import React from 'react';
import { Box, Typography, Button, Container, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.light}0a 0%, transparent 50%)`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1
          }}
        >
          {/* Animated Cloud SVG Container */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: '20px' }}
          >
            <svg width="240" height="180" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main Cloud Body */}
              <path 
                d="M50 110C25 110 5 90 5 65C5 40 25 25 45 25C55 10 85 5 105 20C130 5 165 20 165 55C165 85 145 110 120 110H50Z" 
                fill="#F1F5F9" 
                stroke="#CBD5E1" 
                strokeWidth="2"
              />
              {/* Sad Eyes */}
              <circle cx="70" cy="60" r="4" fill="#64748B" />
              <circle cx="115" cy="60" r="4" fill="#64748B" />
              {/* Sad Mouth Curve */}
              <path d="M85 85C90 80 100 80 105 85" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
              
              {/* Falling Rain/Tears Animation */}
              {[1, 2, 3].map((i) => (
                <motion.rect
                  key={i}
                  x={60 + (i * 25)}
                  y="110"
                  width="3"
                  height="10"
                  rx="1.5"
                  fill="#60A5FA"
                  animate={{ y: [0, 50], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </svg>
          </motion.div>

          {/* 404 Text with Glass Effect */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '8rem', md: '12rem' },
              fontWeight: 800,
              lineHeight: 0.8,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(180deg, #1E293B 0%, #64748B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.1,
              position: 'absolute',
              zIndex: -1,
              userSelect: 'none'
            }}
          >
            404
          </Typography>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1E293B' }}>
              Lost in the Clouds
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', mb: 5, fontSize: '1.1rem', lineHeight: 1.7 }}
            >
              The page you are looking for has drifted away. 
              It’s either been moved or no longer exists in this atmosphere.
            </Typography>

            {/* Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  bgcolor: '#0F172A',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#334155' }
                }}
              >
                Back to Earth
              </Button>
              <Button
                variant="text"
                onClick={() => navigate(-1)}
                sx={{
                  color: '#64748B',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': { background: 'rgba(0,0,0,0.04)' }
                }}
              >
                Go Back
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;