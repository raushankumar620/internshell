import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

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
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Collapse,
  Chip
} from '@mui/material';

// framer-motion
import { motion, AnimatePresence } from 'framer-motion';

// project import
import PublicNavbar from '../../component/PublicNavbar';
import { authAPI } from '../../services/api';

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Public Pages Theme Constants
import { PUBLIC_PAGE_GRADIENT } from '../PublicPages/constants/theme';

// ==============================|| RESET PASSWORD ||============================== //

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  // Verify OTP when code reaches 6 digits
  useEffect(() => {
    if (code.length === 6 && email && !codeVerified) {
      handleVerifyCode();
    }
  }, [code]);

  const handleVerifyCode = async () => {
    if (!email) {
      setCodeError('Please enter your email first');
      return;
    }
    
    setVerifyingCode(true);
    setCodeError('');
    
    try {
      const response = await authAPI.verifyResetCode(email, code);
      if (response.success && response.verified) {
        setCodeVerified(true);
        setCodeError('');
      }
    } catch (err) {
      setCodeVerified(false);
      setCodeError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setVerifyingCode(false);
    }
  };

  // Reset verification if code changes after being verified
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (codeVerified && newCode.length < 6) {
      setCodeVerified(false);
      setCodeError('');
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const validatePassword = () => {
    if (newPassword.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.resetPassword(email, code, newPassword);
      if (response.success) {
        setSuccess(true);
        setMessage(response.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setMessage('A new reset code has been sent to your email');
      setError('');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
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
                        background: success 
                          ? `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 3,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {success ? (
                        <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                      ) : (
                        <LockResetIcon sx={{ fontSize: 40, color: 'white' }} />
                      )}
                    </Box>
                  </motion.div>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {success ? 'Password Reset!' : 'Reset Password'}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {success 
                      ? 'Your password has been reset successfully. Redirecting to login...'
                      : 'Enter the code sent to your email and create a new password.'}
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
                {!success && (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Reset Code"
                      value={code}
                      onChange={handleCodeChange}
                      required
                      disabled={loading || codeVerified}
                      error={!!codeError}
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': codeVerified ? {
                          '& fieldset': {
                            borderColor: theme.palette.success.main,
                            borderWidth: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.success.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.success.main,
                          },
                          backgroundColor: 'rgba(76, 175, 80, 0.04)'
                        } : {}
                      }}
                      placeholder="Enter 6-digit code"
                      inputProps={{ maxLength: 6 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {verifyingCode ? (
                              <CircularProgress size={20} />
                            ) : codeVerified ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              >
                                <VerifiedIcon sx={{ color: theme.palette.success.main, fontSize: 24 }} />
                              </motion.div>
                            ) : codeError ? (
                              <ErrorOutlineIcon sx={{ color: theme.palette.error.main, fontSize: 24 }} />
                            ) : null}
                          </InputAdornment>
                        )
                      }}
                      helperText={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {codeVerified ? (
                            <Chip 
                              label="OTP Verified ✓" 
                              size="small" 
                              color="success"
                              sx={{ 
                                height: 22,
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            />
                          ) : codeError ? (
                            <Typography variant="caption" color="error">{codeError}</Typography>
                          ) : (
                            <span>Check your email for the code</span>
                          )}
                          {!codeVerified && (
                            <Button
                              size="small"
                              onClick={handleResendCode}
                              disabled={loading || verifyingCode}
                              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                            >
                              Resend Code
                            </Button>
                          )}
                        </Box>
                      }
                    />

                    {/* Password Fields - Only show after OTP is verified */}
                    <AnimatePresence>
                      {codeVerified && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <Alert severity="success" sx={{ mb: 2 }}>
                            OTP verified! Now create your new password.
                          </Alert>

                          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel>New Password</InputLabel>
                            <OutlinedInput
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              disabled={loading}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="New Password"
                            />
                            <FormHelperText>At least 6 characters</FormHelperText>
                          </FormControl>

                          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                            <InputLabel>Confirm Password</InputLabel>
                            <OutlinedInput
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              disabled={loading}
                              error={confirmPassword && newPassword !== confirmPassword}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Confirm Password"
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                              <FormHelperText error>Passwords do not match</FormHelperText>
                            )}
                          </FormControl>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !email || !code || !codeVerified || !newPassword || !confirmPassword}
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
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </form>
                )}

                {/* Success state - Go to Login button */}
                {success && (
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Go to Login
                  </Button>
                )}

                {/* Footer Links */}
                {!success && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Didn't receive the code?{' '}
                      <Typography
                        component={RouterLink}
                        to="/forgot-password"
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Request again
                      </Typography>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResetPassword;
