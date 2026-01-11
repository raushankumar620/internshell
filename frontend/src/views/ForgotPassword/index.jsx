import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

// framer-motion
import { motion } from 'framer-motion';

// project import
import PublicNavbar from '../../component/PublicNavbar';
import { authAPI } from '../../services/api';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';

// Public Pages Theme Constants
import { PUBLIC_PAGE_GRADIENT } from '../PublicPages/constants/theme';

// ==============================|| FORGOT PASSWORD ||============================== //

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setMessage(response.message);
        setEmailSent(true);
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: PUBLIC_PAGE_GRADIENT(theme),
      width: '100%',
      overflowX: 'hidden'
    }}>
      <PublicNavbar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ 
          height: '100%', 
          minHeight: '100vh', 
          pt: { xs: 8, sm: 10, md: 12 },
          pb: { xs: 3, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Grid item xs={12} sm={10} md={8} lg={5} xl={4}>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card
              component={motion.div}
              whileHover={{ boxShadow: '0 25px 50px rgba(0,0,0,0.2)', transform: 'translateY(-4px)' }}
              sx={{
                overflow: 'hidden',
                maxWidth: '475px',
                margin: '0 auto',
                borderRadius: { xs: 3, sm: 4 },
                boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5 }, width: '100%' }}>
                {/* Back to Login */}
                
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 3
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                  </motion.div>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Forgot Password?
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    No worries! Enter your email address and we'll send you a code to reset your password.
                  </Typography>
                </Box>

                {/* Alert Messages */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {message}
                  </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || emailSent}
                    sx={{ mb: 3 }}
                    placeholder="Enter your registered email"
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || emailSent || !email}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : emailSent ? (
                      'Redirecting...'
                    ) : (
                      'Send Reset Code'
                    )}
                  </Button>
                </form>

                {/* Footer Links */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Remember your password?{' '}
                    <Typography
                      component={RouterLink}
                      to="/login"
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Login here
                    </Typography>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
