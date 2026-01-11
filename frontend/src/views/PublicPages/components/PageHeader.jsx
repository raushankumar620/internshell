import React from 'react';
import { Box, Typography, useTheme, Container, Breadcrumbs, Link } from '@mui/material';
import { motion } from 'framer-motion';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

// Floating animated shapes component
const FloatingShapes = () => {
  const shapes = [
    { size: 80, top: '10%', left: '5%', delay: 0, duration: 6 },
    { size: 120, top: '60%', left: '10%', delay: 1, duration: 8 },
    { size: 60, top: '20%', right: '15%', delay: 0.5, duration: 7 },
    { size: 100, top: '70%', right: '5%', delay: 1.5, duration: 9 },
    { size: 40, top: '40%', left: '30%', delay: 2, duration: 5 },
    { size: 50, top: '80%', left: '50%', delay: 0.8, duration: 6.5 },
    { size: 70, top: '15%', right: '35%', delay: 1.2, duration: 7.5 },
  ];

  return (
    <>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            right: shape.right,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(5px)',
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};

// Animated gradient mesh background
const GradientMesh = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.08) 0%, transparent 40%)
      `,
      zIndex: 1,
    }}
  />
);

// Decorative lines
const DecorativeLines = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '-10%',
        width: '120%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        transform: 'rotate(-5deg)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '30%',
        left: '-10%',
        width: '120%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transform: 'rotate(3deg)',
      }
    }}
  />
);

const PageHeader = ({ 
  title, 
  subtitle, 
  center = false, 
  backgroundGradient,
  showBreadcrumb = false,
  breadcrumbItems = [],
  icon: Icon,
  badge
}) => {
  const theme = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8
      }
    }
  };
  
  return (
    <Box 
      sx={{ 
        background: backgroundGradient || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        pt: { xs: 14, sm: 16, md: 20 },
        pb: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '320px', sm: '380px', md: '450px' },
        display: 'flex',
        alignItems: 'center',
        // Animated gradient overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%),
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          zIndex: 1
        },
        // Bottom wave decoration
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: '60px',
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23ffffff' d='M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,37.3C672,32,768,32,864,37.3C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 2
        }
      }}
    >
      {/* Background decorations */}
      <FloatingShapes />
      <GradientMesh />
      <DecorativeLines />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 3,
          textAlign: center ? 'center' : 'left'
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <motion.div variants={itemVariants}>
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                sx={{ 
                  mb: 3,
                  justifyContent: center ? 'center' : 'flex-start',
                  display: 'flex',
                  '& .MuiBreadcrumbs-ol': {
                    justifyContent: center ? 'center' : 'flex-start'
                  }
                }}
              >
                <Link 
                  href="/" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'white',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                  Home
                </Link>
                {breadcrumbItems.map((item, index) => (
                  <Typography 
                    key={index} 
                    sx={{ 
                      color: index === breadcrumbItems.length - 1 ? 'white' : 'rgba(255,255,255,0.85)',
                      fontSize: '0.9rem',
                      fontWeight: index === breadcrumbItems.length - 1 ? 600 : 500
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Breadcrumbs>
            </motion.div>
          )}

          {/* Badge / Tag */}
          {badge && (
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50px',
                  px: 2.5,
                  py: 0.8,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 10px #4ade80',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    color: 'white'
                  }}
                >
                  {badge}
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Icon */}
          {Icon && (
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <Icon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
            </motion.div>
          )}

          {/* Title with gradient text effect */}
          <motion.div variants={titleVariants}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.2rem' },
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: center ? '50%' : 0,
                  transform: center ? 'translateX(-50%)' : 'none',
                  width: { xs: '60px', md: '80px' },
                  height: '4px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
                  borderRadius: '2px'
                }
              }}
            >
              {title}
            </Typography>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.div variants={itemVariants}>
              <Box sx={{ maxWidth: 700, mx: center ? 'auto' : 0, mt: 2 }}>
                {typeof subtitle === 'string' ? (
                  <Typography 
                    variant="h5" 
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
                      lineHeight: 1.7,
                      fontWeight: 400,
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {subtitle}
                  </Typography>
                ) : (
                  subtitle
                )}
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Keyframes for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
          }
        `}
      </style>
    </Box>
  );
};

export default PageHeader;