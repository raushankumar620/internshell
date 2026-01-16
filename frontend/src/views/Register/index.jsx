import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  MenuItem,
  Select,
  Paper,
  Container,
  Stack
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// google oauth
import { GoogleLogin } from '@react-oauth/google';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';

// project import
import PublicNavbar from '../../component/PublicNavbar';

// services
import { authAPI } from 'services/api';

// ==============================|| DYNAMIC MEDIA SECTION ||============================== //

const DynamicMediaSection = () => {
  const theme = useTheme();
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [nextMediaIndex, setNextMediaIndex] = React.useState(1);
  const [fadeClass, setFadeClass] = React.useState('fade-in');
  const [animationClass, setAnimationClass] = React.useState('');
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [videoDuration, setVideoDuration] = React.useState(0);
  const videoRef = React.useRef(null);
  const [transitionType, setTransitionType] = React.useState('slideIn');

  // Media items with images, videos, and content
  const mediaItems = [
    {
      type: 'video',
      src: '/inetrnshell_video.mp4',
      title: 'InternShell Experience',
      subtitle: 'See our platform in action',
      description: 'Discover how InternShell transforms careers'
    },
    {
      type: 'image',
      src: '/home.png',
      title: 'Start Your Journey',
      subtitle: 'Join thousands of successful interns',
      description: 'Connect with top companies and launch your career'
    },
    {
      type: 'image',
      src: '/home2.png',
      title: 'Build Your Network',
      subtitle: 'Connect with industry leaders',
      description: 'Expand your professional connections'
    },
    {
      type: 'image',
      src: '/home3.png',
      title: 'Gain Experience',
      subtitle: 'Real-world projects await',
      description: 'Work on meaningful projects that matter'
    },
    {
      type: 'image',
      src: '/home4.png',
      title: 'Secure Your Future',
      subtitle: 'Transform internships into careers',
      description: 'Many of our interns get full-time offers'
    },
    {
      type: 'image',
      src: '/loginimage.png',
      title: 'Welcome to Success',
      subtitle: 'Your career starts here',
      description: 'Join the InternShell community today'
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
    // Auto-advance to next slide when video ends
    setTimeout(() => {
      changeSlideWithAnimation();
    }, 500); // Small delay after video ends
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
    
    // Don't auto-advance if current item is a video and it's playing
    if (currentItem.type === 'video' && isVideoPlaying) {
      return;
    }

    // Only auto-advance for images
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
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
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
        transform: 'translateZ(0)', // Enable GPU acceleration
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
              transform: 'translateZ(0)', // GPU acceleration
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

      {/* Overlay Content */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        textAlign: 'center', 
        color: 'white',
        p: 4,
        maxWidth: 500,
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 3,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)', // GPU acceleration
        '&.enter-animation': {
          animation: 'bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        '&.exit-animation': {
          animation: 'exitSlideLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }}
      className={animationClass}>
        <Box sx={{
          mb: 3,
          '& img': {
            width: 60,
            height: 50,
            opacity: 0.7,
            filter: 'drop-shadow(0 2px 6px rgba(59, 130, 246, 0.3))'
          }
        }}>
          <img src="/logo.png" alt="InternShell Logo" />
        </Box>

        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          mb: 2,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #fff, #f0f0f0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {currentItem.title}
        </Typography>

        <Typography variant="h6" sx={{ 
          mb: 3, 
          opacity: 0.9,
          textShadow: '0 1px 5px rgba(0,0,0,0.2)',
          fontWeight: 500
        }}>
          {currentItem.subtitle}
        </Typography>

        <Typography variant="body1" sx={{ 
          mb: 4, 
          opacity: 0.8,
          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          lineHeight: 1.6
        }}>
          {currentItem.description}
        </Typography>
        
        {/* Feature points with animation */}
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body1" sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            animation: 'slideIn 0.6s ease-out 0.2s both'
          }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: 'white', 
              mr: 2,
              opacity: 0.8,
              animation: 'pulse 2s infinite'
            }} />
            Connect with industry professionals
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            animation: 'slideIn 0.6s ease-out 0.4s both'
          }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: 'white', 
              mr: 2,
              opacity: 0.8,
              animation: 'pulse 2s infinite'
            }} />
            Find your perfect internship
          </Typography>
          <Typography variant="body1" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            animation: 'slideIn 0.6s ease-out 0.6s both'
          }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: 'white', 
              mr: 2,
              opacity: 0.8,
              animation: 'pulse 2s infinite'
            }} />
            Build your professional network
          </Typography>
        </Box>

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

// ==============================|| SIMPLE REGISTER FORM ||============================== //

const AuthRegisterForm = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [initialRole, setInitialRole] = React.useState('intern');

  // Get role from URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const roleParam = urlParams.get('role');
    if (roleParam === 'employer' || roleParam === 'intern') {
      setInitialRole(roleParam);
    }
  }, [location]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleGoogleSuccess = async (response) => {
    try {
      console.log('Google OAuth response:', response);
      const res = await authAPI.googleAuth(response.credential, null);

      if (res.success) {
        window.dispatchEvent(new Event('userRoleChanged'));
        
        const user = res.data;
        // Google auth only creates intern accounts now
        navigate('/app/intern/dashboard');
      }
    } catch (err) {
      console.error('Google Register Error:', err);
      const message = err.response?.data?.message || 'Google registration failed. Please try again.';
      setErrorMessage(message);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Register Failed:', error);
    setErrorMessage('Google registration is temporarily unavailable. Please use manual registration.');
  };

  return (
    <Box>
      {/* Google Sign Up Button - Only for Interns */}
      {initialRole === 'intern' && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
              Quick registration for Interns:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                shape="rectangular"
                theme="outline"
                size="large"
                text="signup_with"
              />
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography sx={{ mx: 2, color: 'text.secondary' }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
        </>
      )}
      
      {/* Alert for employers */}
      {initialRole === 'employer' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Employers:</strong> Must register with corporate email and verify via OTP.
          </Typography>
        </Alert>
      )}

      <Formik
        key={initialRole}
        initialValues={{
          name: '',
          email: '',
          password: '',
          role: initialRole,
          phone: '',
          companyName: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(50).required('Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required'),
          role: Yup.string().required('Role is required'),
          phone: Yup.string(),
          companyName: Yup.string().when('role', {
            is: 'employer',
            then: (schema) => schema.required('Company name is required for employers')
          })
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log('Registration form submitted:', values);
            
            if (!checked) {
              setErrorMessage('Please accept terms and conditions');
              setErrors({ submit: 'Please accept terms and conditions' });
              setSubmitting(false);
              return;
            }

            setErrorMessage('');
            setSubmitting(true);
            
            const registrationData = {
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
              phone: values.phone || '',
              companyName: values.companyName || ''
            };
            
            console.log('Sending registration data:', registrationData);
            
            // Add timeout and better error handling
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout - server may be down')), 30000)
            );
            
            const registrationPromise = authAPI.register(registrationData);
            
            const response = await Promise.race([registrationPromise, timeoutPromise]);
            console.log('Registration response received:', response);

            if (response && response.success) {
              setStatus({ success: true });
              
              if (response.emailVerificationRequired) {
                console.log('Email verification required, redirecting...');
                navigate(`/verify-email?email=${encodeURIComponent(response.email || values.email)}`);
                return;
              }
              
              console.log('Registration successful, updating auth state...');
              window.dispatchEvent(new Event('userRoleChanged'));
              
              const user = response.data;
              console.log('Redirecting user based on role:', user.role);
              if (user.role === 'employer') {
                navigate('/app/employer/post-job');
              } else if (user.role === 'intern') {
                navigate('/');
              } else {
                navigate('/app/dashboard');
              }
            } else {
              console.error('Registration failed - no success in response:', response);
              setErrorMessage(response?.message || 'Registration failed. Please try again.');
              setErrors({ submit: response?.message || 'Registration failed. Please try again.' });
            }
          } catch (err) {
            console.error('Registration error details:', {
              error: err,
              name: err.name,
              message: err.message,
              response: err.response?.data,
              status: err.response?.status,
              stack: err.stack
            });
            
            let message = 'Registration failed. Please try again.';
            
            if (err.message === 'Request timeout - server may be down') {
              message = 'Registration is taking too long. The server might be busy. Please try again.';
            } else if (err.response?.data?.message) {
              message = err.response.data.message;
            } else if (err.message.includes('Network Error')) {
              message = 'Network error. Please check your internet connection and try again.';
            } else if (err.code === 'ECONNABORTED') {
              message = 'Request timeout. Please try again.';
            }
            
            setErrorMessage(message);
            setErrors({ submit: message });
            setStatus({ success: false });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {errorMessage}
                </Typography>
                {import.meta.env.DEV && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                    Check browser console for more details
                  </Typography>
                )}
              </Alert>
            )}

            {/* Role Display */}
            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {values.role === 'intern' ? <PersonIcon color="primary" /> : <BusinessIcon color="primary" />}
                <Typography variant="h6" color="primary">
                  Registering as: {values.role === 'intern' ? 'Intern / Student' : 'Employer / Company'}
                </Typography>
              </Box>
            </Box>
            
            {/* Hidden role field */}
            <input type="hidden" name="role" value={values.role} />

            {/* Name and Email in One Row */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            {/* Company Name and Phone in One Row (if employer) */}
            {values.role === 'employer' ? (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.companyName && errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number (Optional)"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ mb: 2 }}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            )}

            {/* Password */}
            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined" size="medium">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                error={Boolean(touched.password && errors.password)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            {/* Terms and Conditions */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checked} 
                  onChange={(event) => setChecked(event.target.checked)} 
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <RouterLink 
                    to="#" 
                    style={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none'
                    }}
                  >
                    Terms and Conditions
                  </RouterLink>
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            {/* Submit Button */}
            <Button 
              fullWidth 
              size="large" 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      border: '2px solid #ffffff40',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                  Creating Account...
                </Box>
              ) : (
                'Create Account'
              )}
            </Button>

            {errors.submit && (
              <FormHelperText error sx={{ mt: 2, textAlign: 'center' }}>
                {errors.submit}
              </FormHelperText>
            )}
          </form>
        )}
      </Formik>
    </Box>
  );
};

// ==============================|| REGISTER ||============================== //

const Register = () => {
  const theme = useTheme();

  // Add mobile background fix
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media (max-width: 899px) {
        html, body {
          background: linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%) !important;
          min-height: 100vh !important;
          min-height: 100dvh !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        #root {
          background: linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%) !important;
          min-height: 100vh !important;
          min-height: 100dvh !important;
          height: 100% !important;
        }
        
        /* Additional mobile fixes */
        body {
          position: fixed !important;
          width: 100% !important;
          overflow-x: hidden !important;
        }
        
        /* Fix for white patches on scroll */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [theme]);

  return (
    <Box sx={{
      minHeight: ['100vh', '100dvh'], // Use array for fallback values
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      // Ensure full coverage on mobile
      background: {
        xs: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
        md: '#f5f5f5'
      },
      position: 'relative',
      overflow: 'hidden'
    }}>
      <PublicNavbar />
      
      {/* Full Page Layout */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        minHeight: { 
          xs: '100vh', 
          md: 'calc(100vh - 64px)'
        },
        height: { xs: '100%', md: 'auto' },
        mt: { xs: 0, md: 0 }, // Remove top margin on mobile
        pt: { xs: '80px', md: 2 }, // Convert margin to padding on mobile
        // Ensure background coverage
        background: {
          xs: 'transparent', // Let parent handle background on mobile
          md: 'transparent'
        },
        position: 'relative',
        // Force full coverage on mobile
        '&::before': {
          content: { xs: '""', md: 'none' },
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          zIndex: -1
        }
      }}>
        
        {/* Left Side - Dynamic Image/Video Section (Hidden on mobile) */}
        <DynamicMediaSection />

        {/* Right Side - Form Section */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' }, // Align to top on mobile
          justifyContent: 'center',
          p: { xs: 1, md: 4 }, // Further reduced padding on mobile
          background: {
            xs: 'transparent', // Use parent background on mobile
            md: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`
          },
          minHeight: { xs: '100%', md: '100%' },
          pt: { xs: 1, md: 0 }, // Reduce top padding on mobile
          pb: { xs: 2, md: 0 }, // Add bottom padding on mobile
          width: '100%',
          position: 'relative',
          // Ensure no gaps on mobile
          '&::after': {
            content: { xs: '""', md: 'none' },
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
            zIndex: -1,
            opacity: 0.95
          }
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: 480,
            mx: 'auto',
            mt: { xs: 0, md: 0 }, // Remove top margin
            mb: { xs: 1, md: 0 }  // Add small bottom margin on mobile
          }}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 2.5, md: 5 }, // Reduced padding on mobile
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                mx: { xs: 0.5, md: 0 }, // Reduce horizontal margin on mobile
                my: { xs: 0, md: 0 }, // Remove vertical margins
                width: { xs: 'calc(100% - 8px)', md: '100%' }, // Ensure it doesn't overflow
                maxHeight: { xs: 'none', md: 'none' },
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

              {/* Registration Form */}
              <AuthRegisterForm />

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <RouterLink 
                    to="/login"
                    style={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Sign in
                  </RouterLink>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};export default Register;