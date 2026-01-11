import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';

// services
import { authAPI } from 'services/api';

const RoleSelection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [role, setRole] = useState('intern');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user data from localStorage (set during Google OAuth)
  const userData = JSON.parse(localStorage.getItem('googleUser') || '{}');
  
  // Debug logging
  console.log('RoleSelection userData:', userData);
  
  // Redirect if no user data
  React.useEffect(() => {
    if (!userData._id) {
      console.error('No user data found in localStorage');
      navigate('/login');
    }
  }, [userData, navigate]);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (role === 'employer' && !companyName.trim()) {
        throw new Error('Company name is required for employers');
      }

      // Call API to set role
      const response = await authAPI.setRole({
        userId: userData._id,
        role,
        companyName: role === 'employer' ? companyName : undefined
      });

      if (response.success) {
        // Clear googleUser from localStorage
        localStorage.removeItem('googleUser');
        
        // Redirect based on role
        if (role === 'employer') {
          navigate('/app/employer');
        } else {
          navigate('/app/intern');
        }
      } else {
        throw new Error(response.message || 'Failed to set role');
      }
    } catch (err) {
      console.error('Role Selection Error:', err);
      setError(err.message || 'Error setting role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Card sx={{ width: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Select Your Role
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              {userData.avatar && (
                <CardMedia
                  component="img"
                  image={userData.avatar}
                  alt={userData.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </Box>
            
            <Typography variant="h6" align="center" gutterBottom>
              Welcome, {userData.name || 'User'}!
            </Typography>
            
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Please select your role to continue
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleRoleSubmit} sx={{ mt: 1 }}>
              <FormControl component="fieldset" fullWidth margin="normal">
                <FormLabel component="legend">Select Role</FormLabel>
                <RadioGroup
                  aria-label="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <FormControlLabel
                    value="intern"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1">Intern/Student</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Looking forjobs opportunities
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="employer"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1">Employer/Company</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Postingjobss and hiring students
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {role === 'employer' && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  autoFocus
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Setting Role...' : 'Continue'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RoleSelection;