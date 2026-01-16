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

const SimpleRegisterForm = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [initialRole, setInitialRole] = React.useState('intern');

  // Helper function to validate employer email domain
  const isValidEmployerEmail = (email) => {
    const emailLower = email.toLowerCase();
    
    // List of invalid domains (personal email providers)
    const invalidDomains = [
      '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', 
      '@live.com', '@icloud.com', '@protonmail.com', '@aol.com'
    ];
    
    // Check if email uses any invalid personal domains
    const isPersonalEmail = invalidDomains.some(domain => emailLower.includes(domain));
    
    if (isPersonalEmail) {
      return false;
    }
    
    // Valid corporate domains (must end with these)
    const validDomains = ['.com', '.in', '.org', '.net', '.co.in', '.edu', '.gov'];
    
    // Check if email ends with any valid corporate domain
    return validDomains.some(domain => emailLower.endsWith(domain));
  };

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
      {/* Google Sign Up Button - Only for Interns */}
      {initialRole === 'intern' && (
        <>
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
              या
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
        </>
      )}

      {/* Note for Employers */}
      {initialRole === 'employer' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>नियोक्ताओं के लिए नोट:</strong> Gmail, Yahoo, Hotmail जैसे व्यक्तिगत ईमेल का उपयोग नहीं कर सकते। कृपया अपने कॉर्पोरेट ईमेल (.com, .in, .org, .net, .co.in, .edu, .gov) का उपयोग करके मैन्युअल पंजीकरण करें।
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
          name: Yup.string().max(50).required('नाम आवश्यक है'),
          email: Yup.string()
            .email('वैध ईमेल होना चाहिए')
            .max(255)
            .required('ईमेल आवश्यक है')
            .test('employer-domain', 'नियोक्ता Gmail, Yahoo, Hotmail जैसे व्यक्तिगत ईमेल का उपयोग नहीं कर सकते। कृपया कॉर्पोरेट ईमेल (.com, .in, .org, .net, .co.in, .edu, .gov) का उपयोग करें।', function(value) {
              const { role } = this.parent;
              if (role === 'employer' && value) {
                return isValidEmployerEmail(value);
              }
              return true;
            }),
          password: Yup.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए').max(255).required('पासवर्ड आवश्यक है'),
          role: Yup.string().required('भूमिका चुनना आवश्यक है'),
          phone: Yup.string(),
          companyName: Yup.string().when('role', {
            is: 'employer',
            then: (schema) => schema.required('नियोक्ता के लिए कंपनी का नाम आवश्यक है')
          })
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (!checked) {
              setErrorMessage('कृपया नियम और शर्तों को स्वीकार करें');
              setErrors({ submit: 'कृपया नियम और शर्तों को स्वीकार करें' });
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
            const message = err.response?.data?.message || 'पंजीकरण विफल। कृपया पुनः प्रयास करें।';
            setErrorMessage(message);
            setErrors({ submit: message });
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* Role Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>पंजीकरण करें</InputLabel>
              <Select
                name="role"
                value={values.role}
                label="पंजीकरण करें"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.role && errors.role)}
              >
                <MenuItem value="intern">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography>इंटर्न / छात्र</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="employer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Typography>नियोक्ता / कंपनी</Typography>
                  </Box>
                </MenuItem>
              </Select>
              {touched.role && errors.role && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
            </FormControl>

            {/* Name and Email */}
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="पूरा नाम"
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

              <TextField
                fullWidth
                label="ईमेल पता"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={
                  touched.email && errors.email ? errors.email :
                  values.role === 'employer' ? 'नियोक्ता को कॉर्पोरेट ईमेल (.com, .in, .org, .net, .co.in, .edu, .gov) का उपयोग करना आवश्यक है' : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            {/* Company Name (if employer) */}
            {values.role === 'employer' && (
              <TextField
                fullWidth
                label="कंपनी का नाम"
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.companyName && errors.companyName)}
                helperText={touched.companyName && errors.companyName}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            )}

            {/* Phone Number */}
            <TextField
              fullWidth
              label="फ़ोन नंबर (वैकल्पिक)"
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

            {/* Password */}
            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
              <InputLabel>पासवर्ड</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="पासवर्ड"
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
                  मैं{' '}
                  <RouterLink 
                    to="#" 
                    style={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none'
                    }}
                  >
                    नियम और शर्तों
                  </RouterLink>{' '}
                  से सहमत हूं
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
              {isSubmitting ? 'खाता बनाया जा रहा है...' : 'खाता बनाएं'}
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

// ==============================|| SIMPLE REGISTER ||============================== //

const SimpleRegister = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <PublicNavbar />
      
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'white'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
              इंटर्नशेल में शामिल हों
            </Typography>
            <Typography variant="body1" color="text.secondary">
              अपना नया खाता बनाएं और अपने करियर की शुरुआत करें
            </Typography>
          </Box>

          {/* Registration Form */}
          <SimpleRegisterForm />

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              क्या आपका पहले से खाता है?{' '}
              <RouterLink 
                to="/login"
                style={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                साइन इन करें
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SimpleRegister;