import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { useTheme, styled, alpha } from '@mui/material/styles';
import {
  Grid, Card, CardContent, Typography, Box, Chip, LinearProgress,
  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, CircularProgress, Alert, Stack, IconButton, Badge, useMediaQuery,
  Avatar
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// MUI Icons
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';

// Project imports
import { dashboardAPI, applicationAPI } from 'services/api';
import { initSocket, getSocket } from 'services/socket';

// ===================== PREMIUM STYLED COMPONENTS ===================== //

const MainWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
  minHeight: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3)
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4)
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: '0 4px 24px -1px rgba(0,0,0,0.04)',
  transition: 'all 0.3s ease-in-out',
  [theme.breakpoints.up('sm')]: {
    borderRadius: 24
  },
  '&:hover': {
    boxShadow: '0 12px 40px -5px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)'
  },
  '@media (hover: none)': {
    '&:hover': {
      transform: 'none'
    }
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 20px',
  boxShadow: 'none',
  minHeight: 44,
  [theme.breakpoints.up('sm')]: {
    padding: '10px 24px'
  },
  '&:hover': {
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: { bg: '#FFF4E5', text: '#B76E00' },
    accepted: { bg: '#E6F9F0', text: '#00A44F' },
    rejected: { bg: '#FFEBEE', text: '#D32F2F' },
    shortlisted: { bg: '#E3F2FD', text: '#1976D2' },
    interview_scheduled: { bg: '#F3E5F5', text: '#7B1FA2' },
    hired: { bg: '#E8F5E9', text: '#2E7D32' },
    withdrawn: { bg: '#ECEFF1', text: '#546E7A' },
  };
  const style = colors[status] || colors.pending;
  return {
    backgroundColor: style.bg,
    color: style.text,
    fontWeight: 700,
    borderRadius: 8,
    fontSize: '0.75rem'
  };
});

// ===================== COMPONENT ===================== //

const InternDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Real Data States
  const [stats, setStats] = useState({
    totalApplications: 0,
    resumeViews: 0,
    shortlisted: 0,
    accepted: 0,
    profileCompletion: 0,
    pendingApplications: 0,
    interviewScheduled: 0,
    totalinternshipAvailable: 0,
    unreadMessages: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getInternStats();
      
      if (response.success) {
        const { stats: apiStats, applicationTrend, recentApplications: recent, statusBreakdown } = response.data;
        
        // Set stats
        setStats({
          totalApplications: apiStats.totalApplications || 0,
          resumeViews: apiStats.resumeViews || 0,
          shortlisted: apiStats.shortlisted || 0,
          accepted: statusBreakdown?.accepted || 0,
          profileCompletion: apiStats.profileCompletion || 0,
          pendingApplications: apiStats.pendingApplications || 0,
          interviewScheduled: apiStats.interviewScheduled || 0,
          totalinternshipAvailable: apiStats.totalinternshipAvailable || 0,
          unreadMessages: apiStats.unreadMessages || 0
        });

        // Format chart data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedChartData = applicationTrend?.map(item => {
          const date = new Date(item._id);
          return {
            day: days[date.getDay()],
            date: item._id,
            count: item.count
          };
        }) || [];
        
        // If no data, show last 7 days with 0
        if (formattedChartData.length === 0) {
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
              day: days[date.getDay()],
              date: date.toISOString().split('T')[0],
              count: 0
            });
          }
          setChartData(last7Days);
        } else {
          setChartData(formattedChartData);
        }

        // Set recent applications
        setRecentApplications(recent || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Socket connection for real-time updates
    try {
      const socket = getSocket();
      if (socket) {
        socket.on('applicationUpdate', () => {
          fetchDashboardData();
        });
        socket.on('newMessage', () => {
          fetchDashboardData();
        });
      }
    } catch (err) {
      console.log('Socket not available');
    }

    return () => {
      try {
        const socket = getSocket();
        if (socket) {
          socket.off('applicationUpdate');
          socket.off('newMessage');
        }
      } catch (err) {}
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return (
    <Box sx={{ p: 5, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={50} />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 5 }}>
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={fetchDashboardData}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    </Box>
  );

  return (
    <MainWrapper>
      <Grid container spacing={3}>
        
        {/* WELCOME BANNER */}
        <Grid item xs={12}>
          <Box sx={{
            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            borderRadius: { xs: '16px', sm: '24px' },
            p: { xs: 2.5, sm: 4, md: 5 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <Grid container alignItems="center">
                <Grid item xs={12} md={8}>
                   <Typography 
                     variant="h3" 
                     sx={{ 
                       fontWeight: 700, 
                       mb: 1, 
                       fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }
                     }}
                   >
                     Ready for your next step?
                   </Typography>
                   <Typography 
                     variant="h6" 
                     sx={{ 
                       opacity: 0.8, 
                       mb: 3, 
                       fontWeight: 400,
                       fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                       lineHeight: 1.4
                     }}
                   >
                     {stats.totalinternshipAvailable > 0 
                       ? `${stats.totalinternshipAvailable} internship opportunities available for you.`
                       : 'Explore new internship opportunities based on your profile.'}
                   </Typography>
                   <Stack 
                     direction={{ xs: 'column', sm: 'row' }} 
                     spacing={2}
                     sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
                   >
                      <ActionButton 
                        sx={{ 
                          bgcolor: 'white', 
                          color: '#764ba2', 
                          '&:hover': { bgcolor: '#f8f9fa'},
                          minWidth: { xs: 'auto', sm: '140px' }
                        }}
                        onClick={() => navigate('/app/intern')}
                        fullWidth={isMobile}
                      >
                        Explore Jobs
                      </ActionButton>
                      <ActionButton 
                        variant="outlined" 
                        sx={{ 
                          color: 'white', 
                          borderColor: 'rgba(255,255,255,0.5)',
                          minWidth: { xs: 'auto', sm: '140px' }
                        }}
                        onClick={() => navigate('/app/intern/profile')}
                        fullWidth={isMobile}
                      >
                        Update Profile
                      </ActionButton>
                   </Stack>
                </Grid>
                <Grid item xs={12} md={4} sx={{ 
                  textAlign: { xs: 'left', md: 'right' },
                  mt: { xs: 2, md: 0 }
                }}>
                  <IconButton 
                    onClick={fetchDashboardData} 
                    sx={{ 
                      color: 'white', 
                      opacity: 0.7,
                      display: { xs: 'inline-flex', md: 'inline-flex' }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Grid>
             </Grid>
          </Box>
        </Grid>

        {/* KEY STATS */}
        {[
          { label: 'Applications', val: stats.totalApplications, icon: <FolderOpenIcon />, color: '#667eea' },
          { label: 'Shortlisted', val: stats.shortlisted, icon: <StarIcon />, color: '#f093fb' },
          { label: 'Profile Views', val: stats.resumeViews, icon: <VisibilityIcon />, color: '#38ef7d' },
          { label: 'Accepted', val: stats.accepted, icon: <CheckCircleIcon />, color: '#4facfe' },
        ].map((item, i) => (
          <Grid item xs={6} sm={6} md={3} key={i}>
            <GlassCard>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 }, 
                    borderRadius: '12px', 
                    bgcolor: alpha(item.color, 0.1), 
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </Box>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                    lineHeight: 1.2
                  }}
                >
                  {item.val}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {item.label}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}

        {/* ACTIVITY CHART */}
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.125rem', sm: '1.25rem' }
                }}
              >
                Application Activity
              </Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9e9e9e', fontSize: isMobile ? 10 : 12}} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke={theme.palette.primary.main} 
                      strokeWidth={isMobile ? 2 : 3}
                      fillOpacity={1} 
                      fill="url(#colorPrimary)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* PROFILE COMPLETION */}
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: { xs: '1.125rem', sm: '1.25rem' }
                }}
              >
                Profile Strength
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Complete your profile to get 3x more views.
              </Typography>
              
              <Box sx={{ 
                position: 'relative', 
                display: 'inline-flex', 
                mb: { xs: 3, sm: 4 }, 
                width: '100%', 
                justifyContent: 'center' 
              }}>
                <CircularProgress 
                  variant="determinate" 
                  value={stats.profileCompletion} 
                  size={isMobile ? 120 : 140} 
                  thickness={5} 
                  sx={{ color: theme.palette.primary.main, strokeLinecap: 'round' }}
                />
                <Box sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '1.75rem', sm: '2.125rem' }
                    }}
                  >
                    {`${stats.profileCompletion}%`}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1.5, sm: 2 } 
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Basic Information
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1.5, sm: 2 }, 
                    bgcolor: stats.profileCompletion < 100 ? '#FFFBF2' : 'inherit'
                  }}
                >
                  {stats.profileCompletion < 100 ? (
                    <DescriptionIcon sx={{ color: 'warning.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  ) : (
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {stats.profileCompletion < 100 ? 'Complete Your Profile' : 'Profile Complete'}
                  </Typography>
                </Paper>
                <ActionButton 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/app/intern/profile')}
                  sx={{ mt: { xs: 2, sm: 2 } }}
                >
                  {stats.profileCompletion < 100 ? 'Complete Now' : 'View Profile'}
                </ActionButton>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* RECENT APPLICATIONS TABLE */}
        <Grid item xs={12}>
          <GlassCard>
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
               <Typography 
                 variant="h6" 
                 sx={{ 
                   fontWeight: 700,
                   fontSize: { xs: '1.125rem', sm: '1.25rem' },
                   alignSelf: { xs: 'flex-start', sm: 'center' }
                 }}
               >
                 Recent Applications
               </Typography>
               <Button 
                 size="small" 
                 sx={{ 
                   fontWeight: 600,
                   fontSize: { xs: '0.8rem', sm: '0.875rem' },
                   alignSelf: { xs: 'flex-end', sm: 'center' }
                 }}
                 onClick={() => navigate('/app/intern/applied-jobs')}
               >
                 View All
               </Button>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
                <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#5F6368',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#5F6368',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}>
                      Company
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#5F6368',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#5F6368',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentApplications.length > 0 ? (
                    recentApplications.slice(0, 5).map((application, index) => (
                      <TableRow key={application._id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          py: { xs: 1.5, sm: 2 },
                          maxWidth: { xs: '120px', sm: 'none' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {application.job?.title || 'N/A'}
                        </TableCell>
                        <TableCell sx={{
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          py: { xs: 1.5, sm: 2 },
                          maxWidth: { xs: '120px', sm: 'none' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {application.job?.company || application.employer?.companyName || 'N/A'}
                        </TableCell>
                        <TableCell sx={{
                          color: 'textSecondary',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: { xs: 1.5, sm: 2 }
                        }}>
                          {formatDate(application.createdAt)}
                        </TableCell>
                        <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                          <StatusBadge 
                            label={(application.status || 'pending').toUpperCase().replace('_', ' ')} 
                            status={application.status || 'pending'} 
                            sx={{ 
                              fontSize: { xs: '0.6rem', sm: '0.75rem' },
                              padding: { xs: '4px 8px', sm: '6px 12px' }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <WorkIcon sx={{ 
                            fontSize: { xs: 36, sm: 48 }, 
                            color: 'text.disabled', 
                            mb: 1 
                          }} />
                          <Typography 
                            variant="body1" 
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            No applications yet
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            sx={{ 
                              mt: 2,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              py: { xs: 1, sm: 1.2 },
                              px: { xs: 2, sm: 3 }
                            }}
                            onClick={() => navigate('/app/intern')}
                          >
                            Browse Internships
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

      </Grid>
    </MainWrapper>
  );
};

export default InternDashboard;