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
        if (res.data.roleSelectionRequired) {
          localStorage.setItem('googleUser', JSON.stringify(res.data));
          navigate('/role-selection');
          return;
        }
        
        window.dispatchEvent(new Event('userRoleChanged'));
        
        const user = res.data;
        if (user.role === 'employer') {
          navigate('/app/employer/dashboard');
        } else if (user.role === 'intern') {
          navigate('/app/intern/dashboard');
        } else {
          navigate('/app/dashboard');
        }
      }
    } catch (err) {
      console.error('Google Register Error:', err);
      const message = err.response?.data?.message || 'Google registration failed. Please try again.';
      setErrorMessage(message);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Register Failed');
    setErrorMessage('Google registration failed. Please try again.');
  };

  return (
    <Box>
      {/* Google Sign Up Button */}
      <Box sx={{ mb: 3 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          shape="rectangular"
          theme="outline"
          size="large"
          text="signup_with"
          width="100%"
        />
      </Box>

      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography sx={{ mx: 2, color: 'text.secondary' }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

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
            if (!checked) {
              setErrorMessage('Please accept terms and conditions');
              setErrors({ submit: 'Please accept terms and conditions' });
              setSubmitting(false);
              return;
            }

            setErrorMessage('');
            const response = await authAPI.register({
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
              phone: values.phone,
              companyName: values.companyName
            });

            if (response.success) {
              setStatus({ success: true });
              
              if (response.emailVerificationRequired) {
                navigate(`/verify-email?email=${encodeURIComponent(response.email || values.email)}`);
                return;
              }
              
              window.dispatchEvent(new Event('userRoleChanged'));
              
              const user = response.data;
              if (user.role === 'employer') {
                navigate('/app/employer/post-job');
              } else if (user.role === 'intern') {
                navigate('/');
              } else {
                navigate('/app/dashboard');
              }
            }
          } catch (err) {
            console.error('Register error:', err);
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setErrorMessage(message);
            setErrors({ submit: message });
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest} className="registration-form">
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* Role Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Register as</InputLabel>
              <Select
                name="role"
                value={values.role}
                label="Register as"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.role && errors.role)}
              >
                <MenuItem value="intern">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography>Intern / Student</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="employer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Typography>Employer / Company</Typography>
                  </Box>
                </MenuItem>
              </Select>
              {touched.role && errors.role && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
            </FormControl>

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
            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
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
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      overflow: 'auto',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      },
      '@keyframes float': {
        '0%, 100%': {
          transform: 'translateY(0px)'
        },
        '50%': {
          transform: 'translateY(-20px)'
        }
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <PublicNavbar />
        
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 4,
              backdropFilter: 'blur(16px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: theme.palette.primary.main, 
              mb: 1 
            }}>
              Join InternShell
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and start your career journey
            </Typography>
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
        </Container>
      </Box>
    </Box>
  );
};export default Register;