import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Divider, IconButton, InputAdornment, Alert, Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import * as Yup from 'yup';
import { Formik } from 'formik';

import PublicNavbar from '../../component/PublicNavbar';
import SuccessToast from '../../component/SuccessToast';
import { authAPI } from '../../services/api';

export default function Login() {
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
    } catch {
      setError("Google login failed.");
    }
  };

  return (
    <Box
      sx={{
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
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PublicNavbar />
      <SuccessToast open={success} message="Login Successful!" />

      <Grid container alignItems="center" justifyContent="center" minHeight="100vh">
        <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6 }}>
          <Card sx={{
            width: 420,
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
          }}>
            <CardContent sx={{ p:4 }}>

              <Typography align="center" variant="h4" fontWeight={800} color="#2a2a2a">Welcome Back</Typography>
              <Typography align="center" sx={{ mb:3 }} color="#6e6e6e">Login to continue</Typography>

              {/* Note for Login */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Employers must use corporate emails. Interns can use Google login or manual login.
                </Typography>
              </Alert>

              <GoogleLogin onSuccess={handleGoogle} onError={()=>setError("Google login failed")} />

              <Divider sx={{ my:3, borderColor:"#38bdf8" }}>OR</Divider>

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
                    setError(""); // Clear previous errors
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
                      color:"#38bdf8", 
                      textDecoration:"none",
                      fontSize: "0.875rem",
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                <Button fullWidth type="submit" sx={{
                  mt:3,
                  mb:2,
                  py:1.6,
                  borderRadius:3,
                  fontWeight:700,
                  background:"linear-gradient(90deg,#3366ff,#4dd0ff)",
                  boxShadow:"0 0 25px rgba(51,102,255,.7)"
                }}>LOGIN</Button>
              </form>
              )}
              </Formik>

              <Typography align="center" mt={3} component={RouterLink} to="/register"
                sx={{ color:"#38bdf8", textDecoration:"none" }}>
                Don't have account? Create one →
              </Typography>

            </CardContent>
          </Card>
        </motion.div>
      </Grid>
      </Box>
    </Box>
  );
}