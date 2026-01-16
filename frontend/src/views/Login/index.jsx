import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Divider, IconButton, InputAdornment, Alert, Paper,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';

import PublicNavbar from '../../component/PublicNavbar';
import SuccessToast from '../../component/SuccessToast';
import { authAPI } from '../../services/api';

// ==============================|| DYNAMIC MEDIA SECTION ||============================== //

const DynamicMediaSection = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [nextMediaIndex, setNextMediaIndex] = React.useState(1);
  const [animationClass, setAnimationClass] = React.useState('');
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const videoRef = React.useRef(null);
  const [transitionType, setTransitionType] = React.useState('slideIn');

  // Media items for login page
  const mediaItems = [
    {
      type: 'video',
      src: '/inetrnshell_video.mp4',
      title: 'Welcome Back to InternShell',
      subtitle: 'Continue your journey',
      description: 'Access your personalized dashboard'
    },
    {
      type: 'image',
      src: '/home.png',
      title: 'Your Career Awaits',
      subtitle: 'Login to explore opportunities',
      description: 'Connect with top companies and advance your career'
    },
    {
      type: 'image',
      src: '/home2.png',
      title: 'Stay Connected',
      subtitle: 'Access your network',
      description: 'Continue building professional relationships'
    },
    {
      type: 'image',
      src: '/home3.png',
      title: 'Track Progress',
      subtitle: 'Monitor your applications',
      description: 'Stay updated on your internship applications'
    },
    {
      type: 'image',
      src: '/loginimage.png',
      title: 'Welcome Back',
      subtitle: 'Your success story continues',
      description: 'Login to the InternShell community'
    }
  ];

  // Handle video events
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setTimeout(() => {
      changeSlideWithAnimation();
    }, 500);
  };

  // Function to change slides with random animation effects
  const changeSlideWithAnimation = () => {
    const animationTypes = ['slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoomOut', 'flip', 'rotate'];
    const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    
    setTransitionType(randomAnimation);
    setAnimationClass('exit-animation');
    
    setTimeout(() => {
      setCurrentMediaIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % mediaItems.length;
        setNextMediaIndex((newIndex + 1) % mediaItems.length);
        return newIndex;
      });
      setAnimationClass('enter-animation');
      
      setTimeout(() => {
        setAnimationClass('');
      }, 600);
    }, 400);
  };

  // Auto-change media every 4 seconds (only for images, not videos)
  React.useEffect(() => {
    const currentItem = mediaItems[currentMediaIndex];
    
    if (currentItem.type === 'video' && isVideoPlaying) {
      return;
    }

    if (currentItem.type === 'image') {
      const interval = setInterval(() => {
        changeSlideWithAnimation();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [mediaItems.length, currentMediaIndex, isVideoPlaying]);

  const currentItem = mediaItems[currentMediaIndex];

  return (
    <Box sx={{
      display: { xs: 'none', md: 'flex' },
      flex: 1,
      position: 'relative',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      // Slide Animations
      '@keyframes slideLeft': {
        '0%': { transform: 'translateX(100%)', opacity: 0, filter: 'blur(5px)' },
        '100%': { transform: 'translateX(0)', opacity: 1, filter: 'blur(0px)' }
      },
      '@keyframes slideRight': {
        '0%': { transform: 'translateX(-100%)', opacity: 0, filter: 'blur(5px)' },
        '100%': { transform: 'translateX(0)', opacity: 1, filter: 'blur(0px)' }
      },
      '@keyframes slideUp': {
        '0%': { transform: 'translateY(100%)', opacity: 0, filter: 'blur(3px)' },
        '100%': { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }
      },
      '@keyframes slideDown': {
        '0%': { transform: 'translateY(-100%)', opacity: 0, filter: 'blur(3px)' },
        '100%': { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }
      },
      // Zoom Animations
      '@keyframes zoomOut': {
        '0%': { transform: 'scale(1.5)', opacity: 0, filter: 'blur(8px)' },
        '100%': { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }
      },
      '@keyframes zoomIn': {
        '0%': { transform: 'scale(0.5)', opacity: 0, filter: 'blur(5px)' },
        '100%': { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }
      },
      // Flip Animation
      '@keyframes flip': {
        '0%': { transform: 'rotateY(90deg)', opacity: 0 },
        '50%': { transform: 'rotateY(45deg)', opacity: 0.5 },
        '100%': { transform: 'rotateY(0deg)', opacity: 1 }
      },
      // Rotate Animation
      '@keyframes rotate': {
        '0%': { transform: 'rotate(180deg) scale(0.8)', opacity: 0, filter: 'blur(5px)' },
        '100%': { transform: 'rotate(0deg) scale(1)', opacity: 1, filter: 'blur(0px)' }
      },
      // Exit Animations
      '@keyframes exitSlideLeft': {
        '0%': { transform: 'translateX(0)', opacity: 1 },
        '100%': { transform: 'translateX(-100%)', opacity: 0, filter: 'blur(3px)' }
      },
      '@keyframes exitSlideRight': {
        '0%': { transform: 'translateX(0)', opacity: 1 },
        '100%': { transform: 'translateX(100%)', opacity: 0, filter: 'blur(3px)' }
      },
      '@keyframes exitZoomOut': {
        '0%': { transform: 'scale(1)', opacity: 1 },
        '100%': { transform: 'scale(0.3)', opacity: 0, filter: 'blur(8px)' }
      },
      '@keyframes exitRotate': {
        '0%': { transform: 'rotate(0deg) scale(1)', opacity: 1 },
        '100%': { transform: 'rotate(-180deg) scale(0.3)', opacity: 0, filter: 'blur(5px)' }
      },
      '@keyframes pulse': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' }
      },
      '@keyframes bounceIn': {
        '0%': { transform: 'scale(0.3)', opacity: 0 },
        '50%': { transform: 'scale(1.1)', opacity: 0.8 },
        '100%': { transform: 'scale(1)', opacity: 1 }
      }
    }}>
      {/* Background Media */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        opacity: 0.3,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        '&.enter-animation': {
          opacity: 0.3,
          animation: `${transitionType} 0.8s cubic-bezier(0.4, 0, 0.2, 1)`
        },
        '&.exit-animation': {
          opacity: 0,
          animation: `exit${transitionType.charAt(0).toUpperCase() + transitionType.slice(1)} 0.4s cubic-bezier(0.4, 0, 0.2, 1)`
        },
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}
      className={animationClass}>
        {currentItem.type === 'image' ? (
          <Box
            component="img"
            src={currentItem.src}
            alt={currentItem.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(2px) brightness(0.7)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translateZ(0)',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'blur(1px) brightness(0.8)'
              }
            }}
          />
        ) : (
          <Box
            component="video"
            ref={videoRef}
            src={currentItem.src}
            autoPlay
            muted
            onLoadedMetadata={handleVideoLoadedMetadata}
            onPlay={handleVideoPlay}
            onEnded={handleVideoEnded}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(1px) brightness(0.6)'
            }}
          />
        )}
      </Box>

      {/* Content Overlay */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        color: 'white',
        textAlign: 'center',
        p: 4,
        maxWidth: 600
      }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            mb: 2,
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            animation: 'bounceIn 1s ease-out'
          }}
        >
          {currentItem.title}
        </Typography>
        
        <Typography 
          variant="h5"
          sx={{ 
            mb: 3,
            opacity: 0.9,
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.6s ease-out 0.3s both'
          }}
        >
          {currentItem.subtitle}
        </Typography>

        <Typography 
          variant="body1"
          sx={{ 
            fontSize: 18,
            opacity: 0.8,
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.6s ease-out 0.6s both'
          }}
        >
          {currentItem.description}
        </Typography>

        {/* Progress Indicators */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          gap: 1
        }}>
          {mediaItems.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === currentMediaIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: index === currentMediaIndex ? 'white' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.8)'
                }
              }}
              onClick={() => {
                if (index !== currentMediaIndex) {
                  setCurrentMediaIndex(index);
                  setNextMediaIndex((index + 1) % mediaItems.length);
                  setAnimationClass('enter-animation');
                  setTimeout(() => {
                    setAnimationClass('');
                  }, 800);
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const redirectUser = (user) => {
    if (user.role === "employer") navigate("/app/employer/landing");
    else if (user.role === "intern") navigate("/app/intern");
    else navigate("/app/dashboard");
  };

  const handleGoogle = async (res) => {
    try {
      const r = await authAPI.googleAuth(res.credential);
      setSuccess(true);
      setTimeout(() => redirectUser(r.data), 1200);
    } catch (error) {
      console.error('Google login error:', error);
      setError("Google login is temporarily unavailable. Please use manual login.");
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      <PublicNavbar />
      <SuccessToast open={success} message="Login Successful!" />
      
      {/* Full Page Layout */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        minHeight: 'calc(100vh - 64px)',
        mt: { xs: '80px', md: 0 },
        pt: { xs: 2, md: 2 }
      }}>
        
        {/* Left Side - Dynamic Image/Video Section (Hidden on mobile) */}
        <DynamicMediaSection />

        {/* Right Side - Form Section */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          p: { xs: 1, md: 4 },
          backgroundColor: 'transparent',
          minHeight: { xs: 'auto', md: '100%' },
          pt: { xs: 3, md: 0 }
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: 480,
            mx: 'auto',
            mt: { xs: 1, md: 0 }
          }}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 2.5, md: 5 },
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                mx: { xs: 1, md: 0 },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              {/* Header with Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <img 
                    src="/logo.png" 
                    alt="InternShell Logo" 
                    style={{
                      height: '70px',
                      width: 'auto',
                      borderRadius: '12px',
                      filter: 'drop-shadow(0 4px 15px rgba(59, 130, 246, 0.4))'
                    }}
                  />
                </Box>
              </Box>

              {/* Google Login - Only show for interns */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  Quick login for Interns:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <GoogleLogin 
                    onSuccess={handleGoogle} 
                    onError={()=>setError("Google login failed")}
                    useOneTap={false}
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    text="signin_with"
                  />
                </Box>
              </Box>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography sx={{ mx: 2, color: 'text.secondary' }}>
                  OR Manual Login
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              <Formik
                initialValues={{ email:"", password:"" }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email('Please enter a valid email address')
                    .required('Email is required'),
                  password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required')
                })}
                onSubmit={async(values)=>{
                  try{
                    setError("");
                    const r = await authAPI.login(values);
                    if (r.success) {
                      setSuccess(true);
                      setTimeout(()=>redirectUser(r.data),1200);
                    } else if (r.emailVerificationRequired) {
                      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
                    }
                  }catch(err){
                    console.error('Login error:', err);
                    const errorMessage = err.response?.data?.message || "Invalid email or password. Please check your credentials.";
                    setError(errorMessage);
                  }
                }}
              >
              {({handleSubmit, handleChange, values, errors, touched})=>(
              <form onSubmit={handleSubmit} className="login-form">

                {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ mb:2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#666' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={show?"text":"password"}
                  onChange={handleChange}
                  value={values.password}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                    endAdornment:(
                      <InputAdornment position="end">
                        <IconButton onClick={()=>setShow(!show)}>
                          {show ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Box display="flex" justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Typography 
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                <Button 
                  fullWidth 
                  type="submit" 
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.6,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #3366ff 0%, #4dd0ff 100%)',
                    color: 'white',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(51, 102, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2952e5 0%, #3bb9e6 100%)',
                      boxShadow: '0 6px 20px rgba(51, 102, 255, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  LOGIN
                </Button>
              </form>
              )}
              </Formik>

              {/* Register Links */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Don't have an account?
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Typography 
                    component={RouterLink}
                    to="/register?role=intern"
                    variant="body2"
                    sx={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <PersonIcon fontSize="small" />
                    Register as Intern →
                  </Typography>
                  <Typography 
                    component={RouterLink}
                    to="/register?role=employer"
                    variant="body2"
                    sx={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <BusinessIcon fontSize="small" />
                    Register as Employer →
                  </Typography>
                </Box>
              </Box>

            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}