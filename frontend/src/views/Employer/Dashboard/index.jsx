import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  IconButton,
  Divider,
  LinearProgress,
  Skeleton,
  Tooltip,
  AvatarGroup,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme, alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Recharts for Charts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EastIcon from '@mui/icons-material/East';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AreaChartIcon from '@mui/icons-material/StackedLineChart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { profileAPI, jobAPI, applicationAPI } from 'services/api';

// Styled Components
const DashboardCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

const MainStatCard = styled(Paper)(({ theme, gradientcolor }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.5),
  },
  borderRadius: 12,
  [theme.breakpoints.up('sm')]: {
    borderRadius: 16,
  },
  background: `linear-gradient(135deg, ${gradientcolor} 0%, ${alpha(gradientcolor, 0.8)} 100%)`,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: 'none',
  boxShadow: `0 6px 20px ${alpha(gradientcolor, 0.3)}`,
  [theme.breakpoints.up('sm')]: {
    boxShadow: `0 8px 30px ${alpha(gradientcolor, 0.35)}`,
  },
  minHeight: 120,
  [theme.breakpoints.up('sm')]: {
    minHeight: 140,
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 50px ${alpha(gradientcolor, 0.45)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: alpha('#fff', 0.1),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -25,
    left: -25,
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: alpha('#fff', 0.08),
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2.5),
  borderRadius: 12,
  background: theme.palette.background.paper,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const ChartCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 20,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  overflow: 'visible',
  '&:hover': {
    boxShadow: '0 8px 35px rgba(0,0,0,0.1)',
  },
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(0.75, 1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 2.5),
  },
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.875rem',
  },
  boxShadow: 'none',
}));

const JobListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  border: `1px solid transparent`,
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    flexWrap: 'nowrap',
    gap: 0,
  },
  '&:hover': {
    background: alpha(theme.palette.action.hover, 0.5),
    '& .job-arrow': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}));

const ApplicantCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1.5),
  },
  padding: theme.spacing(1.25),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.5),
  },
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: alpha(theme.palette.action.hover, 0.3),
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

const WelcomeBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  borderRadius: 16,
  [theme.breakpoints.up('sm')]: {
    borderRadius: 20,
  },
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  border: 'none',
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: theme.spacing(4),
  },
  color: '#fff',
  overflow: 'hidden',
  boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.25)}`,
  [theme.breakpoints.up('sm')]: {
    boxShadow: `0 10px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -60,
    right: -60,
    width: 150,
    height: 150,
    [theme.breakpoints.up('sm')]: {
      top: -100,
      right: -100,
      width: 300,
      height: 300,
    },
    borderRadius: '50%',
    background: alpha('#fff', 0.1),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -30,
    left: '30%',
    width: 80,
    height: 80,
    [theme.breakpoints.up('sm')]: {
      bottom: -50,
      width: 150,
      height: 150,
    },
    borderRadius: '50%',
    background: alpha('#fff', 0.05),
  },
}));

// Custom Pie Chart Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 1.5, 
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {payload[0].value} applications
        </Typography>
      </Box>
    );
  }
  return null;
};

const EmployerDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    hired: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chart type state and menu
  const [chartType, setChartType] = useState('pie');
  const [chartMenuAnchor, setChartMenuAnchor] = useState(null);
  
  const chartOptions = [
    { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon fontSize="small" /> },
    { value: 'bar', label: 'Bar Chart', icon: <BarChartIcon fontSize="small" /> },
    { value: 'line', label: 'Line Chart', icon: <ShowChartIcon fontSize="small" /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartIcon fontSize="small" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await profileAPI.getProfile();
        if (userResponse.success) {
          setUser(userResponse.data);
        }

        const jobsResponse = await jobAPI.getEmployerinternship();
        if (jobsResponse.success) {
          const jobs = jobsResponse.data || [];
          setRecentJobs(jobs.slice(0, 5));
          setStats(prev => ({
            ...prev,
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'active').length
          }));
        }

        const appsResponse = await applicationAPI.getEmployerApplications();
        if (appsResponse.success) {
          const apps = appsResponse.data || [];
          setRecentApplicants(apps.slice(0, 6));
          setStats(prev => ({
            ...prev,
            totalApplications: apps.length,
            pendingReview: apps.filter(a => a.status === 'pending').length,
            shortlisted: apps.filter(a => a.status === 'shortlisted').length,
            hired: apps.filter(a => a.status === 'hired').length
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'shortlisted': 'info',
      'hired': 'success',
      'rejected': 'error',
      'active': 'success',
      'closed': 'default'
    };
    return colors[status] || 'default';
  };

  const statCards = [
    { 
      label: 'Total Jobs', 
      value: stats.totalJobs, 
      icon: <WorkOutlineIcon sx={{ fontSize: 26 }} />,
      color: theme.palette.primary.main,
      description: 'Posted positions',
      onClick: () => navigate('/app/employer/my-internship')
    },
    { 
      label: 'Applications', 
      value: stats.totalApplications, 
      icon: <PeopleOutlineIcon sx={{ fontSize: 26 }} />,
      color: theme.palette.success.main,
      description: 'Total received',
      onClick: () => navigate('/app/employer/applicants')
    },
    { 
      label: 'Pending', 
      value: stats.pendingReview, 
      icon: <AccessTimeIcon sx={{ fontSize: 26 }} />,
      color: theme.palette.warning.main,
      description: 'Awaiting review',
      onClick: () => navigate('/app/employer/applicants')
    },
    { 
      label: 'Hired', 
      value: stats.hired, 
      icon: <PersonAddAltIcon sx={{ fontSize: 26 }} />,
      color: theme.palette.secondary.main,
      description: 'Successfully hired',
      onClick: () => navigate('/app/employer/applicants')
    },
  ];

  // Pie chart data
  const pieChartData = [
    { name: 'Pending', value: stats.pendingReview, color: theme.palette.warning.main },
    { name: 'Shortlisted', value: stats.shortlisted, color: theme.palette.info.main },
    { name: 'Hired', value: stats.hired, color: theme.palette.success.main },
    { name: 'Active Jobs', value: stats.activeJobs, color: theme.palette.primary.main },
  ].filter(item => item.value > 0);

  // If no data, show placeholder
  const chartHasData = pieChartData.length > 0 && pieChartData.some(item => item.value > 0);

  if (loading) {
    return (
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
        maxWidth: 1600, 
        mx: 'auto',
        minHeight: '100vh',
      }}>
        <Skeleton 
          variant="rectangular" 
          sx={{ height: { xs: 100, sm: 120, md: 140 }, borderRadius: { xs: 3, sm: 4 }, mb: { xs: 2, sm: 3, md: 4 } }} 
        />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {[1,2,3,4].map(i => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <Skeleton 
                variant="rectangular" 
                sx={{ height: { xs: 100, sm: 120, md: 140 }, borderRadius: { xs: 2, sm: 3, md: 4 } }} 
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mt: { xs: 1, sm: 1.5, md: 2 } }}>
          <Grid item xs={12} lg={5}>
            <Skeleton variant="rectangular" sx={{ height: { xs: 280, sm: 320, md: 350 }, borderRadius: { xs: 3, sm: 4 } }} />
          </Grid>
          <Grid item xs={12} lg={7}>
            <Skeleton variant="rectangular" sx={{ height: { xs: 280, sm: 320, md: 350 }, borderRadius: { xs: 3, sm: 4 } }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1.5, sm: 2, md: 3, lg: 4 }, 
      maxWidth: 1600, 
      mx: 'auto',
      minHeight: '100vh',
    }}>
      {/* Welcome Banner */}
      <WelcomeBanner>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2 },
          position: 'relative',
          zIndex: 1 
        }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, display: { xs: 'none', sm: 'block' } }}>
              Dashboard Overview
            </Typography>
            <Typography 
              sx={{ 
                mb: 0.5, 
                color: '#fff',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                fontWeight: 700
              }}
            >
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
            </Typography>
            <Typography sx={{ opacity: 0.85, fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
              Here's what's happening with your hiring today
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
            <QuickActionButton 
              variant="contained"
              startIcon={<AssessmentOutlinedIcon />}
              onClick={() => navigate('/app/employer/analytics')}
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: '#fff',
                '&:hover': { bgcolor: alpha('#fff', 0.3) }
              }}
            >
              Analytics
            </QuickActionButton>
            <QuickActionButton 
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate('/app/employer/post-job')}
              sx={{ 
                bgcolor: '#fff', 
                color: 'primary.main',
                '&:hover': { bgcolor: alpha('#fff', 0.9) }
              }}
            >
              Post New Job
            </QuickActionButton>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Main Stats Section - 4 Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
        {statCards.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <MainStatCard onClick={stat.onClick} gradientcolor={stat.color}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: { xs: 1, sm: 1.5 } 
                }}>
                  <Box sx={{ 
                    p: { xs: 0.75, sm: 1 }, 
                    borderRadius: 2, 
                    bgcolor: alpha('#fff', 0.2),
                    display: 'flex',
                  }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 20, sm: 24, md: 26 }, color: '#fff' } })}
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: alpha('#fff', 0.7), display: { xs: 'none', sm: 'block' } }} />
                </Box>
                <Typography 
                  fontWeight={800}
                  sx={{ color: '#fff', mb: 0.25, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  fontWeight={600}
                  sx={{ color: '#fff', opacity: 0.95, fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}
                >
                  {stat.label}
                </Typography>
                <Typography 
                  sx={{ color: alpha('#fff', 0.8), mt: 0.25, display: { xs: 'none', sm: 'block' }, fontSize: '0.75rem' }}
                >
                  {stat.description}
                </Typography>
              </Box>
            </MainStatCard>
          </Grid>
        ))}
      </Grid>

      {/* Chart and Jobs Section */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Chart Section */}
        <Grid item xs={12} lg={5}>
          <ChartCard>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                justifyContent: 'space-between', 
                mb: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 0 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 }, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                  }}>
                    <AssessmentOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>Application Status</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}>
                      Overview of all applications
                    </Typography>
                  </Box>
                </Box>
                
                {/* Chart Type Dropdown */}
                <Button
                  size="small"
                  onClick={(e) => setChartMenuAnchor(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.5, sm: 0.75 },
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                >
                  {chartOptions.find(c => c.value === chartType)?.icon}
                  <Typography sx={{ ml: 0.5, fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: { xs: 'none', sm: 'block' } }}>
                    {chartOptions.find(c => c.value === chartType)?.label}
                  </Typography>
                </Button>
                <Menu
                  anchorEl={chartMenuAnchor}
                  open={Boolean(chartMenuAnchor)}
                  onClose={() => setChartMenuAnchor(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      minWidth: 160
                    }
                  }}
                >
                  {chartOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={chartType === option.value}
                      onClick={() => {
                        setChartType(option.value);
                        setChartMenuAnchor(null);
                      }}
                      sx={{ 
                        borderRadius: 1, 
                        mx: 0.5,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: chartType === option.value ? 'primary.main' : 'text.secondary' }}>
                        {option.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={option.label} 
                        primaryTypographyProps={{ 
                          fontWeight: chartType === option.value ? 600 : 500,
                          fontSize: '0.875rem'
                        }} 
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {chartHasData ? (
                <Box sx={{ height: { xs: 220, sm: 260, md: 280 }, width: '100%', minWidth: 200, minHeight: 200 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                    {chartType === 'pie' && (
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => (
                            <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    )}
                    
                    {chartType === 'bar' && (
                      <BarChart data={pieChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                    
                    {chartType === 'line' && (
                      <LineChart data={pieChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={theme.palette.primary.main} 
                          strokeWidth={3}
                          dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: theme.palette.primary.main }}
                        />
                      </LineChart>
                    )}
                    
                    {chartType === 'area' && (
                      <AreaChart data={pieChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: theme.palette.divider }}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={theme.palette.primary.main} 
                          strokeWidth={2}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ 
                  height: 280, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 3
                }}>
                  <AssessmentOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No data yet
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Post jobs to see analytics
                  </Typography>
                </Box>
              )}

              {/* Quick Stats Below Chart */}
              <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mt: { xs: 1.5, sm: 2 } }}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }} color="warning.main">
                      {stats.pendingReview}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }} color="text.secondary" fontWeight={500}>
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }} color="info.main">
                      {stats.shortlisted}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }} color="text.secondary" fontWeight={500}>
                      Shortlisted
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }} color="success.main">
                      {stats.activeJobs}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }} color="text.secondary" fontWeight={500}>
                      Active
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }} color="secondary.main">
                      {stats.hired}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }} color="text.secondary" fontWeight={500}>
                      Hired
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </ChartCard>
        </Grid>
        {/* Recent Jobs Section */}
        <Grid item xs={12} lg={7}>
          <DashboardCard>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 0 },
                mb: { xs: 2, sm: 3 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 }, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                  }}>
                    <WorkOutlineIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>Recent Job Posts</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      {stats.activeJobs} active out of {stats.totalJobs} total
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  endIcon={<EastIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                  onClick={() => navigate('/app/employer/my-internship')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                >
                  View All
                </Button>
              </Box>

              {recentJobs.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: { xs: 4, sm: 6 },
                  px: { xs: 1.5, sm: 2 },
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: 3,
                }}>
                  <Box sx={{ 
                    width: { xs: 56, sm: 72 }, 
                    height: { xs: 56, sm: 72 }, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 2, sm: 2.5 },
                  }}>
                    <WorkOutlineIcon sx={{ fontSize: { xs: 28, sm: 36 }, color: 'primary.main' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                    No jobs posted yet
                  </Typography>
                  <Typography sx={{ mb: { xs: 2, sm: 3 }, maxWidth: 280, mx: 'auto', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Create your first job posting to start receiving applications from top talent
                  </Typography>
                  <QuickActionButton 
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate('/app/employer/post-job')}
                    sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 1, sm: 1.5 } }}
                  >
                    Post Your First Job
                  </QuickActionButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                  {recentJobs.map((job, index) => (
                    <JobListItem 
                      key={job._id || index}
                      onClick={() => navigate(`/app/employer/internship/${job._id}`)}
                      sx={{
                        borderRadius: { xs: 2, sm: 3 },
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
                        <Avatar 
                          sx={{ 
                            width: { xs: 40, sm: 48, md: 52 }, 
                            height: { xs: 40, sm: 48, md: 52 }, 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' }
                          }}
                        >
                          {job.title?.charAt(0).toUpperCase() || 'J'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            fontWeight={700}
                            noWrap
                            sx={{ mb: 0.25, fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
                          >
                            {job.title}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: { xs: 1, sm: 1.5 },
                            color: 'text.secondary',
                            flexWrap: 'wrap'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                              <Typography noWrap fontWeight={500} sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                {job.location || 'Remote'}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              width: 3, 
                              height: 3, 
                              borderRadius: '50%', 
                              bgcolor: 'text.disabled',
                              display: { xs: 'none', sm: 'block' }
                            }} />
                            <Typography fontWeight={500} sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, display: { xs: 'none', sm: 'block' } }}>
                              {job.type || 'Internship'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <Box sx={{ 
                          textAlign: 'center', 
                          display: { xs: 'none', md: 'block' },
                          px: { sm: 1.5, md: 2 },
                          py: { sm: 1, md: 1.5 },
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.info.main, 0.1)
                        }}>
                          <Typography sx={{ fontWeight: 700, fontSize: { sm: '1rem', md: '1.2rem' } }} color="info.main">
                            {job.applicationsCount || 0}
                          </Typography>
                          <Typography sx={{ fontSize: { sm: '0.65rem', md: '0.7rem' } }} color="text.secondary" fontWeight={500}>
                            applicants
                          </Typography>
                        </Box>
                        <Chip 
                          label={job.status || 'Active'} 
                          size="small"
                          color={getStatusColor(job.status)}
                          sx={{ 
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            minWidth: { xs: 60, sm: 75, md: 85 },
                            borderRadius: 2,
                            height: { xs: 24, sm: 28, md: 30 },
                            fontSize: { xs: '0.65rem', sm: '0.75rem' }
                          }}
                        />
                        <IconButton 
                          size="small"
                          className="job-arrow"
                          sx={{ 
                            opacity: 0, 
                            transform: 'translateX(-10px)',
                            transition: 'all 0.25s ease',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: { xs: 'none', sm: 'flex' },
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            }
                          }}
                        >
                          <EastIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Box>
                    </JobListItem>
                  ))}
                </Box>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Bottom Section - Applicants and Tips */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
        {/* Recent Applicants */}
        <Grid item xs={12} md={7}>
          <DashboardCard>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 0 },
                mb: { xs: 2, sm: 3 } 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 }, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                  }}>
                    <PeopleOutlineIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'secondary.main' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                      Recent Applicants
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                      {stats.totalApplications} total applications
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  size="small"
                  endIcon={<EastIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                  onClick={() => navigate('/app/employer/applicants')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                    color: 'secondary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.15),
                    }
                  }}
                >
                  View All
                </Button>
              </Box>

              {recentApplicants.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: { xs: 3.5, sm: 5 },
                  px: { xs: 1.5, sm: 2 },
                  bgcolor: alpha(theme.palette.secondary.main, 0.03),
                  borderRadius: 3,
                }}>
                  <Box sx={{
                    width: { xs: 52, sm: 64 },
                    height: { xs: 52, sm: 64 },
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: { xs: 1.5, sm: 2 }
                  }}>
                    <PeopleOutlineIcon sx={{ fontSize: { xs: 26, sm: 32 }, color: 'secondary.main' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    No applications yet
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Applications will appear here when candidates apply
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {recentApplicants.slice(0, 6).map((applicant, index) => (
                    <Grid item xs={12} sm={6} key={applicant._id || index}>
                      <ApplicantCard 
                        onClick={() => navigate('/app/employer/applicants')}
                        sx={{ 
                          borderRadius: { xs: 2, sm: 3 },
                          p: { xs: 1.5, sm: 2 },
                          '&:hover': {
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                          }
                        }}
                      >
                        <Avatar 
                          src={applicant.intern?.profileImage}
                          sx={{ 
                            width: { xs: 38, sm: 44, md: 48 }, 
                            height: { xs: 38, sm: 44, md: 48 },
                            bgcolor: theme.palette.secondary.main,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.85rem', sm: '1rem' }
                          }}
                        >
                          {applicant.intern?.name?.charAt(0).toUpperCase() || 'A'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} noWrap>
                            {applicant.intern?.name || 'Applicant'}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', display: 'block', fontSize: { xs: '0.65rem', sm: '0.7rem' } }} noWrap>
                            Applied for <strong>{applicant.job?.title || 'Position'}</strong>
                          </Typography>
                        </Box>
                        <Chip 
                          label={applicant.status} 
                          size="small"
                          color={getStatusColor(applicant.status)}
                          sx={{ 
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            borderRadius: 2,
                            height: { xs: 22, sm: 26, md: 28 },
                            minWidth: { xs: 55, sm: 65 }
                          }}
                        />
                      </ApplicantCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};
export default EmployerDashboard;